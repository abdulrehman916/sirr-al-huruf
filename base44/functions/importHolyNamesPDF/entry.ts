import { createClientFromRequest } from "npm:@base44/sdk@0.8.38";

// ═══════════════════════════════════════════════════════════════
// importHolyNamesPDF — Holy Names PDF Knowledge Import (admin-only)
// ═══════════════════════════════════════════════════════════════
// Hybrid extraction:
//   • RAW path (primary): frontend extracts the PDF text layer with
//     pdfjs and sends pages:[{page_number,text}]. The backend matches
//     each page text against HolyNameKnowledge names (normalized,
//     with/without leading "ال"), collects the verbatim paragraph(s)
//     containing each found name, and stores them as
//     HolyNameImportedSection records. NO LLM, NO generation.
//   • LLM fallback: if no pages are sent (or raw extraction failed
//     client-side for a scanned PDF), the backend calls
//     ExtractDataFromUploadedFile with a STRICT verbatim prompt —
//     "transcribe exactly as printed, never paraphrase/generate" —
//     then matches the transcribed text the same way.
//
// Rules enforced:
//   • Append-only: existing sections are NEVER deleted/overwritten.
//   • Duplicates skipped by content_hash (name_id + normalized text).
//   • Every section records source_pdf_file + source_pdf_page.
//   • Never attaches info to the wrong name (substring match on the
//     name's own normalized form).
//   • Arabic + Malayalam preserved verbatim.
// Affects ONLY the Holy Names page entities. Admin-only.
// ═══════════════════════════════════════════════════════════════

function normalizeArabic(s: string): string {
  if (!s) return "";
  return String(s)
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
function stripAl(s: string): string {
  return normalizeArabic(s).replace(/^ال/, "").trim();
}
function detectLang(text: string): string {
  const hasAr = /[\u0600-\u06FF]/.test(text);
  const hasMl = /[\u0D00-\u0D7F]/.test(text);
  if (hasAr && hasMl) return "mixed";
  if (hasMl) return "ml";
  if (hasAr) return "ar";
  return "en";
}
// Split a verbatim block into its Arabic-script and Malayalam-script portions.
// Non-script lines (Latin/numbers) are left out of BOTH — they remain only in
// text_content (the original book content). Malayalam stays EMPTY when the PDF
// does not print Malayalam for this section (never auto-generated).
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

    // ── Load matching targets (active Holy Names) ──
    const allNames = await base44.asServiceRole.entities.HolyNameKnowledge.filter({ is_active: true }, null, 500);
    const matchers = (allNames || []).map((n: any) => {
      const full = normalizeArabic(n.arabic_name);
      const noAl = stripAl(n.arabic_name);
      return { recordId: n.id, name_id: n.name_id, full, noAl: noAl.length > 1 ? noAl : "" };
    });

    // ── Match + collect verbatim sections ──
    const toCreate: any[] = [];
    const foundRecordIds: Record<string, string> = {};   // name_id -> record id
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
      //      contained exactly ONE name — so the gloss follows its name without
      //      ever merging translations across unrelated names. If the preceding
      //      name-bearing paragraph held multiple names, the gloss is ambiguous
      //      and is left out of the structured fields (it still lives verbatim
      //      in text_content of nothing here — simply not attached).
      const nameParas: Record<string, string[]> = {};
      const nameHit: Record<string, boolean> = {};
      for (const m of matchers) nameParas[m.name_id] = [];

      let lastNameId = "";
      for (const p of paras) {
        const pn = normalizeArabic(p);
        const hasAr = /[\u0600-\u06FF]/.test(p);
        const hasMl = /[\u0D00-\u0D7F]/.test(p);
        const contained = matchers
          .filter((m) => (m.full && pn.includes(m.full)) || (m.noAl && pn.includes(m.noAl)))
          .map((m) => m.name_id);

        if (contained.length === 1) {
          lastNameId = contained[0];
          nameHit[lastNameId] = true;
          nameParas[lastNameId].push(p);
        } else if (contained.length > 1) {
          lastNameId = ""; // ambiguous — do not attach following gloss to any
          for (const nid of contained) { nameHit[nid] = true; nameParas[nid].push(p); }
        } else if (contained.length === 0 && hasMl && !hasAr && lastNameId) {
          // Malayalam translation gloss for the nearest preceding single name.
          nameParas[lastNameId].push(p);
        }
      }

      for (const m of matchers) {
        if (!nameHit[m.name_id]) continue;
        foundRecordIds[m.name_id] = m.recordId;
        const text = (nameParas[m.name_id] || []).join("\n").trim();
        if (!text) continue;

        const hash = await sha256(m.name_id + "|" + normalizeArabic(text));
        if (hashesSeenThisRun.has(hash)) { duplicates++; continue; }
        hashesSeenThisRun.add(hash);

        // Cross-check against already-stored sections (dedup across imports).
        const exist = await base44.asServiceRole.entities.HolyNameImportedSection.filter({ content_hash: hash }, null, 1);
        if (exist && exist.length > 0) { duplicates++; continue; }

        const { arabic, malayalam } = splitScripts(text);
        toCreate.push({
          section_id: "HNIS-" + hash.slice(0, 24),
          name_id: m.name_id,
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

    // ── Refresh denormalized section_count + last_imported_at for found names ──
    for (const name_id of Object.keys(foundRecordIds)) {
      try {
        const secs = await base44.asServiceRole.entities.HolyNameImportedSection.filter({ name_id }, null, 1000);
        await base44.asServiceRole.entities.HolyNameKnowledge.update(foundRecordIds[name_id], {
          section_count: (secs || []).length,
          last_imported_at: now,
        });
      } catch { /* best-effort */ }
    }

    return Response.json({
      status: "ok",
      extraction_method,
      pages_processed: pagesProcessed,
      names_found: Object.keys(foundRecordIds).length,
      sections_added,
      duplicates_skipped: duplicates,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});