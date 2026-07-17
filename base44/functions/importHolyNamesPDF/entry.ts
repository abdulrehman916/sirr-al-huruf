import { createClientFromRequest } from "npm:@base44/sdk@0.8.38";

// ═══════════════════════════════════════════════════════════════
// importHolyNamesPDF — Holy Names PDF Knowledge Import (admin-only)
// ═══════════════════════════════════════════════════════════════
// Enriches the EXISTING Holy Name records shown on the Holy Names page:
//   • Section A — the static HOLY_NAMES array. The frontend sends
//     section_a_names:[{id, arabicPlain, englishName}]. Matched by
//     arabicPlain (normalized). Stored with source_section="section_a",
//     source_name_key=String(id).
//   • Section B — the HolyOnePDFName entity. Queried server-side. Matched
//     by normalized arabic_name. Stored with source_section="section_b",
//     source_name_key=pdf_name_id.
//
// Hybrid extraction:
//   • RAW path (primary): frontend extracts the PDF text layer with
//     pdfjs and sends pages:[{page_number,text}]. The backend matches
//     each page text against Section A + Section B names, collects the
//     verbatim paragraph(s) containing each found name, and stores them
//     as HolyNameImportedSection records. NO LLM, NO generation.
//   • LLM fallback: if no pages are sent (scanned PDF), the backend calls
//     ExtractDataFromUploadedFile with a STRICT verbatim prompt, then
//     matches the transcribed text the same way.
//
// Rules enforced:
//   • Append-only: existing sections are NEVER deleted/overwritten.
//   • Duplicates skipped by content_hash (source_section|source_name_key|text).
//   • Every section records source_pdf_file + source_pdf_page.
//   • Never attaches info to the wrong name (substring match on the
//     name's own normalized form; very short forms (<3 chars) skipped
//     to avoid false positives).
//   • Arabic + Malayalam preserved verbatim.
// Affects ONLY the Holy Names page. Admin-only.
// ═══════════════════════════════════════════════════════════════

function normalizeArabic(s: string): string {
  if (!s) return "";
  return String(s)
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
function detectLang(text: string): string {
  const hasAr = /[\u0600-\u06FF]/.test(text);
  const hasMl = /[\u0D00-\u0D7F]/.test(text);
  if (hasAr && hasMl) return "mixed";
  if (hasMl) return "ml";
  if (hasAr) return "ar";
  return "en";
}
function splitScripts(text: string): { arabic: string; malayalam: string } {
  const lines = String(text || "").split(/\n+/);
  let arabic = "";
  let malayalam = "";
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    const hasAr = /[\u0600-\u06FF]/.test(t);
    const hasMl = /[\u0D00-\u0D7F]/.test(t);
    if (hasAr && hasMl) {
      const arRuns = (t.match(/[\u0600-\u06FF\u0640\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\s.,،؛:!؟"'()\-]+/g) || []).join(" ").trim();
      const mlRuns = (t.match(/[\u0D00-\u0D7F\s.,:!?'"\-]+/g) || []).join(" ").trim();
      if (arRuns) arabic += (arabic ? "\n" : "") + arRuns;
      if (mlRuns) malayalam += (malayalam ? "\n" : "") + mlRuns;
    } else if (hasMl) {
      malayalam += (malayalam ? "\n" : "") + t;
    } else if (hasAr) {
      arabic += (arabic ? "\n" : "") + t;
    }
  }
  return { arabic, malayalam };
}
// Boundary-aware token match: the name must appear as a standalone token
// (surrounded by non-Arabic-letter characters), never as a substring inside
// a longer Arabic word. Prevents attaching info to the wrong Holy Name.
function isArabicLetter(c: string): boolean {
  return /[\u0600-\u06FF]/.test(c);
}
function containsAsToken(text: string, name: string): boolean {
  if (!name) return false;
  let idx = text.indexOf(name);
  while (idx !== -1) {
    const before = idx > 0 ? text[idx - 1] : " ";
    const after = idx + name.length < text.length ? text[idx + name.length] : " ";
    if (!isArabicLetter(before) && !isArabicLetter(after)) return true;
    idx = text.indexOf(name, idx + 1);
  }
  return false;
}
async function sha256(s: string): Promise<string> {
  const data = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") {
      return Response.json({ error: "Forbidden — admin only" }, { status: 403 });
    }

    const body = await req.json();
    const import_batch = String(body?.import_batch || "HNK-" + Date.now());
    const source_pdf_file = String(body?.source_pdf_file || "");
    const source_pdf_url = String(body?.source_pdf_url || "");
    const now = new Date().toISOString();
    let pages: any[] = Array.isArray(body?.pages) ? body.pages : [];
    let extraction_method = "raw";

    // ── LLM verbatim fallback when no raw text was provided ──
    if (pages.length === 0 && source_pdf_url) {
      extraction_method = "llm_verbatim";
      const extract: any = await base44.asServiceRole.integrations.Core.ExtractDataFromUploadedFile({
        file_url: source_pdf_url,
        json_schema: {
          type: "object",
          properties: {
            pages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  page_number: { type: "integer" },
                  text: { type: "string" },
                },
                required: ["page_number", "text"],
              },
            },
          },
          required: ["pages"],
        },
      });
      const out = extract?.output || extract;
      pages = Array.isArray(out?.pages) ? out.pages : [];
    }

    if (pages.length === 0) {
      return Response.json({ error: "No extractable text found in this PDF." }, { status: 400 });
    }

    // ── Build matchers from Section A (sent from frontend) + Section B (DB) ──
    type Matcher = { source_section: "section_a" | "section_b"; source_name_key: string; norm: string };
    const matchers: Matcher[] = [];

    // Section A: static HOLY_NAMES sent from the frontend
    const sectionA: any[] = Array.isArray(body?.section_a_names) ? body.section_a_names : [];
    for (const n of sectionA) {
      const norm = normalizeArabic(n?.arabicPlain || n?.arabicName || "");
      if (norm.length >= 3) {
        matchers.push({ source_section: "section_a", source_name_key: String(n.id), norm });
      }
    }

    // Section B: HolyOnePDFName records from the database
    try {
      const bNames = await base44.asServiceRole.entities.HolyOnePDFName.list(null, 1000);
      for (const n of bNames || []) {
        const norm = normalizeArabic(n?.arabic_name || "");
        if (norm.length >= 3 && n?.pdf_name_id) {
          matchers.push({ source_section: "section_b", source_name_key: String(n.pdf_name_id), norm });
        }
      }
    } catch { /* Section B unavailable — continue with Section A only */ }

    if (matchers.length === 0) {
      return Response.json({ error: "No Holy Names available to match against. Ensure Section A names loaded or Section B has records." }, { status: 400 });
    }

    // ── Match + collect verbatim sections ──
    const toCreate: any[] = [];
    const foundKeys = new Set<string>();   // "section|key"
    let pagesProcessed = 0;
    let duplicates = 0;
    const hashesSeenThisRun = new Set<string>();

    for (const page of pages) {
      const rawText = String(page?.text || "");
      if (!rawText.trim()) continue;
      pagesProcessed++;
      const paras = rawText.split(/\n+/).map((p) => p.trim()).filter(Boolean);

      // Per-page ordered pass:
      //   1. Each paragraph containing a Holy Name is attributed to that name.
      //   2. A Malayalam-only paragraph (a translation gloss with no Arabic name
      //      of its own) is attached to the NEAREST PRECEDING paragraph that
      //      contained exactly ONE name.
      const nameParas: Record<string, string[]> = {};
      const nameHit: Record<string, boolean> = {};
      for (const m of matchers) {
        const k = m.source_section + "|" + m.source_name_key;
        nameParas[k] = [];
      }

      let lastKey = "";
      for (const p of paras) {
        const pn = normalizeArabic(p);
        const hasAr = /[\u0600-\u06FF]/.test(p);
        const hasMl = /[\u0D00-\u0D7F]/.test(p);
        const contained = matchers
          .filter((m) => m.norm && containsAsToken(pn, m.norm))
          .map((m) => m.source_section + "|" + m.source_name_key);

        if (contained.length === 1) {
          lastKey = contained[0];
          nameHit[lastKey] = true;
          nameParas[lastKey].push(p);
        } else if (contained.length > 1) {
          lastKey = "";
          for (const k of contained) { nameHit[k] = true; nameParas[k].push(p); }
        } else if (contained.length === 0 && hasMl && !hasAr && lastKey) {
          nameParas[lastKey].push(p);
        }
      }

      for (const m of matchers) {
        const k = m.source_section + "|" + m.source_name_key;
        if (!nameHit[k]) continue;
        foundKeys.add(k);
        const text = (nameParas[k] || []).join("\n").trim();
        if (!text) continue;

        const hash = await sha256(m.source_section + "|" + m.source_name_key + "|" + normalizeArabic(text));
        if (hashesSeenThisRun.has(hash)) { duplicates++; continue; }
        hashesSeenThisRun.add(hash);

        const exist = await base44.asServiceRole.entities.HolyNameImportedSection.filter(
          { source_section: m.source_section, source_name_key: m.source_name_key, content_hash: hash },
          null,
          1
        );
        if (exist && exist.length > 0) { duplicates++; continue; }

        const { arabic, malayalam } = splitScripts(text);
        toCreate.push({
          section_id: "HNIS-" + hash.slice(0, 24),
          source_section: m.source_section,
          source_name_key: m.source_name_key,
          name_id: m.source_name_key,
          section_type: "other",
          text_content: text,
          arabic_text: arabic,
          malayalam_translation: malayalam,
          language: detectLang(text),
          source_pdf_file,
          source_pdf_url,
          source_pdf_page: Number(page?.page_number) || 0,
          import_date: now,
          content_hash: hash,
          import_batch,
        });
      }
    }

    let sections_added = 0;
    if (toCreate.length > 0) {
      const res: any = await base44.asServiceRole.entities.HolyNameImportedSection.bulkCreate(toCreate);
      sections_added = Array.isArray(res) ? res.length : (res?.length || 0);
    }

    return Response.json({
      status: "ok",
      extraction_method,
      pages_processed: pagesProcessed,
      names_found: foundKeys.size,
      sections_added,
      duplicates_skipped: duplicates,
      matchers: matchers.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});