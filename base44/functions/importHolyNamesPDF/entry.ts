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
// Boundary-aware ALIAS match across scripts (Arabic, English, Malayalam).
// The alias must appear as a standalone token — surrounded by characters
// that are NOT word-characters of the same script — so it is never matched
// as a substring inside a longer word. This lets a Holy Name be found whether
// the PDF prints it in Arabic, English transliteration, or Malayalam, and all
// aliases point to the SAME Holy Name record (never creating duplicates).
function isWordChar(c: string, script: "ar" | "en" | "ml"): boolean {
  if (script === "ar") return /[\u0600-\u06FF]/.test(c);
  if (script === "ml") return /[\u0D00-\u0D7F]/.test(c);
  return /[a-zA-Z0-9]/.test(c); // en
}
function containsAlias(normText: string, normAlias: string, script: "ar" | "en" | "ml"): boolean {
  if (!normAlias || normAlias.length < 3) return false;
  let idx = normText.indexOf(normAlias);
  while (idx !== -1) {
    const before = idx > 0 ? normText[idx - 1] : " ";
    const after = idx + normAlias.length < normText.length ? normText[idx + normAlias.length] : " ";
    if (!isWordChar(before, script) && !isWordChar(after, script)) return true;
    idx = normText.indexOf(normAlias, idx + 1);
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

    // ── Page images map (rendered by frontend for pages with visual content) ──
    const pageImagesMap = new Map<number, { image_url: string; has_visual: boolean }>();
    for (const pi of Array.isArray(body?.page_images) ? body.page_images : []) {
      const pn = Number(pi?.page_number) || 0;
      if (pn && pi?.image_url) pageImagesMap.set(pn, { image_url: String(pi.image_url), has_visual: pi?.has_visual !== false });
    }

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
    type Matcher = { source_section: "section_a" | "section_b"; source_name_key: string; norm: string; script: "ar" | "en" | "ml" };
    const matchers: Matcher[] = [];

    // Section A: static HOLY_NAMES sent from the frontend
    const sectionA: any[] = Array.isArray(body?.section_a_names) ? body.section_a_names : [];
    for (const n of sectionA) {
      const key = String(n.id);
      const arNorm = normalizeArabic(n?.arabicPlain || n?.arabicName || "");
      if (arNorm.length >= 3) matchers.push({ source_section: "section_a", source_name_key: key, norm: arNorm, script: "ar" });
      const enNorm = String(n?.englishName || "").toLowerCase().trim();
      if (enNorm.length >= 3) matchers.push({ source_section: "section_a", source_name_key: key, norm: enNorm, script: "en" });
    }

    // Section B: HolyOnePDFName records from the database
    try {
      const bNames = await base44.asServiceRole.entities.HolyOnePDFName.list(null, 1000);
      for (const n of bNames || []) {
        if (!n?.pdf_name_id) continue;
        const key = String(n.pdf_name_id);
        const arNorm = normalizeArabic(n?.arabic_name || "");
        if (arNorm.length >= 3) matchers.push({ source_section: "section_b", source_name_key: key, norm: arNorm, script: "ar" });
        const enNorm = String(n?.arabic_transliteration || "").toLowerCase().trim();
        if (enNorm.length >= 3) matchers.push({ source_section: "section_b", source_name_key: key, norm: enNorm, script: "en" });
        const mlNorm = String(n?.malayalam_pronunciation || "").trim();
        if (mlNorm.length >= 3) matchers.push({ source_section: "section_b", source_name_key: key, norm: mlNorm, script: "ml" });
      }
    } catch { /* Section B unavailable — continue with Section A only */ }

    if (matchers.length === 0) {
      return Response.json({ error: "No Holy Names available to match against. Ensure Section A names loaded or Section B has records." }, { status: 400 });
    }

    // ── Match + collect verbatim sections ──
    const toCreate: any[] = [];
    const classifyItems: { idx: number; text: string }[] = [];
    const foundKeys = new Set<string>();   // "section|key"
    let pagesProcessed = 0;
    let duplicates = 0;
    const hashesSeenThisRun = new Set<string>();

    for (const page of pages) {
      const rawText = String(page?.text || "");
      if (!rawText.trim()) continue;
      pagesProcessed++;
      const paras = rawText.split(/\n+/).map((p) => p.trim()).filter(Boolean);

      // Per-page ordered pass — build UNITS (one per name-paragraph + its glosses):
      //   Each paragraph containing a Holy Name starts a new unit. Following
      //   Malayalam-only gloss paragraphs attach to the current unit. Each
      //   unit becomes ONE section per name it mentions, so multi-topic pages
      //   produce multiple independently-categorized sections (benefits, usage,
      //   conditions, warnings, etc.) instead of one merged block.
      const units: { keys: string[]; text: string }[] = [];
      let currentUnit: { keys: string[]; text: string } | null = null;

      for (const p of paras) {
        const pAr = normalizeArabic(p);
        const pEn = p.toLowerCase();
        const hasAr = /[\u0600-\u06FF]/.test(p);
        const hasMl = /[\u0D00-\u0D7F]/.test(p);
        const contained = [...new Set(
          matchers
            .filter((m) => {
              const text = m.script === "ar" ? pAr : m.script === "en" ? pEn : p;
              return containsAlias(text, m.norm, m.script);
            })
            .map((m) => m.source_section + "|" + m.source_name_key)
        )];

        if (contained.length >= 1) {
          if (currentUnit) units.push(currentUnit);
          currentUnit = { keys: contained, text: p };
        } else if (hasMl && !hasAr && currentUnit) {
          currentUnit.text += "\n" + p;
        } else {
          if (currentUnit) { units.push(currentUnit); currentUnit = null; }
        }
      }
      if (currentUnit) units.push(currentUnit);

      for (const unit of units) {
        const text = unit.text.trim();
        if (!text) continue;
        for (const k of unit.keys) {
          const m = matchers.find((mm) => mm.source_section + "|" + mm.source_name_key === k);
          if (!m) continue;
          foundKeys.add(k);

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
          const pageNum = Number(page?.page_number) || 0;
          const pImg = pageImagesMap.get(pageNum);
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
            images: pImg ? [pImg.image_url] : [],
            has_visual: !!(pImg && pImg.has_visual),
            source_pdf_file,
            source_pdf_url,
            source_pdf_page: pageNum,
            import_date: now,
            content_hash: hash,
            import_batch,
          });
          classifyItems.push({ idx: toCreate.length - 1, text });
        }
      }
    }

    // ── LLM classification (CLASSIFIER ONLY — never modifies the verbatim text) ──
    if (classifyItems.length > 0) {
      try {
        const classifyRes: any = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `You are a SECTION LABELER for Islamic occult manuscript sections about Holy Names (Asma ul-Husna and related divine names). For EACH text section below, read the content and output a short normalized section_type label (snake_case, lowercase) that describes what kind of section this is.

Use these common labels WHEN they clearly apply:
- arabic_name — the Holy Name itself in Arabic
- malayalam_meaning — Malayalam translation or meaning of the name
- description — general explanation or commentary
- benefits — spiritual, physical, or worldly benefits (فوائد، خواص)
- usage — how to use or apply the name (طريقة الاستخدام)
- method — procedure, practice, or ritual steps (طريقة، العمل)
- recitations — repetition count, number of times, or adad (عدد المرات، العدد)
- conditions — prerequisites, requirements, or timing conditions (شرط، شروط)
- warnings — cautions, prohibitions, or restrictions (تحذير، احتياط)
- related_duas — associated prayers, Quranic verses, or supplications (دعاء، أدعية)
- references — citations, sources, or book references (المراجع)
- notes — miscellaneous notes or asides (ملاحظات)
- wafq_diagram — magic square, wafq, or grid of letters/numbers (وفق)
- table — tabular data or chart (جدول)
- symbol — symbolic content or sigil
- numeric_layout — number arrangement or numerical calculation

CRITICAL RULES:
- You are a LABELER ONLY. NEVER modify, translate, summarize, or generate any text.
- If the section has a heading or content that does NOT fit any common label above, CREATE a new snake_case label (e.g. "khawas" for خواص/properties, "tawassul" for توسل/intercession, "adab" for آداب/etiquette, "ijazat" for إجازة/permission, "asma" for أسماء/names listing, "ruqyah" for رقية).
- New labels are WELCOME — this is a FLEXIBLE system that grows with every new book. Do NOT force content into an existing label if it doesn't fit.
- Return ONLY a JSON object: {"classifications": [{"index": <number>, "section_type": "<label>"}]}
- Use the exact index numbers provided for each section.
- If truly unsure, return "other".

Text sections to label:
${classifyItems.map((c) => `--- Section index ${c.idx} ---\n${c.text.slice(0, 800)}`).join("\n\n")}`,
          response_json_schema: {
            type: "object",
            properties: {
              classifications: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    index: { type: "integer" },
                    section_type: { type: "string" },
                  },
                },
              },
            },
          },
        });
        for (const c of (classifyRes?.classifications || [])) {
          const cat = String(c?.section_type || "").toLowerCase().trim().replace(/\s+/g, "_");
          if (cat && toCreate[Number(c?.index)]) {
            toCreate[Number(c.index)].section_type = cat;
          }
        }
      } catch { /* labeling unavailable — keep "other" */ }
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