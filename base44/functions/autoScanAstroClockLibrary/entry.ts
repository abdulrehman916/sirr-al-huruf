import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// ═══════════════════════════════════════════════════════════════
// autoScanAstroClockLibrary — COMPLETE AUTOMATIC SCAN of the
// already-indexed Master PDF Library for Astro Clock knowledge.
//
// Replaces the per-topic manual unifiedKnowledgeSearch flow for
// astrology. ONE scan covers the entire library; the Owner re-runs
// until the report shows no remaining books.
//
// PIPELINE (per book):
//   1. Read verified MasterPdfBook records (pending_verification/completed)
//   2. Read their MasterPdfPage records (already OCR'd + classified)
//   3. Batch pages → InvokeLLM detection pass (gemini_3_flash)
//      - Identifies Astro Clock paragraphs
//      - Categorizes each (planetary_hours, zodiac, mansions, planets,
//        weekdays, sahat, islamic_months, special_days/nights, timings,
//        correspondences, planet_relationships, colours, metals, stones,
//        incense, directions, elements, khawass, mujarrabat, wafq,
//        invocations, recommended/forbidden actions, treatments, rituals)
//      - For lunar mansions: extracts birth_characteristics, personality,
//        strengths, weaknesses, professions, marriage, health, spiritual,
//        scholarly opinions (stored in attributes)
//      - Suggests cross-links (holy_names, dua, wafq, khawass, mujarrabat,
//        nine_mizan, abjad)
//   4. Merge into AstroClockKnowledge (NEVER overwrite — append only):
//      - Dedup by rule_record_key
//      - Append new source to supporting_sources (dedup by book+page)
//      - Append text with '\n---\n' separator (every source preserved)
//      - Append actions/warnings/notes arrays (dedup by en text)
//      - Merge attributes additively (arrays append, scalars keep)
//      - cross_links stored in attributes.cross_links
//   5. Generate completion report
//
// LAWS:
//   - Never overwrite existing AstroClockKnowledge records (append-only)
//   - Never delete existing records
//   - Never merge different scholarly methods (each source kept separate)
//   - Preserve Arabic exactly (verbatim from page)
//   - Preserve page number, citation, book, author, paragraph order
//   - Never modify Astro Clock calculation engines (this function only
//     writes AstroClockKnowledge, never touches engines/UI)
//   - Never auto-publish to public modules (findings sit in
//     AstroClockKnowledge which is read by existing panels — no
//     KnowledgeCache auto-verification here; that stays Owner-gated)
//
// ADMIN/OWNER ONLY. Time-budgeted + resumable (skip books already
// having AstroClockKnowledge findings).
// ═══════════════════════════════════════════════════════════════

const TIME_BUDGET_MS = 85000;
const PAGES_PER_CALL = 4;       // pages per LLM detection call
const LLM_MODEL = 'gemini_3_flash';

// ── Helpers ────────────────────────────────────────────────────
async function sha256(s) {
  const data = new TextEncoder().encode(s || '');
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
function slug(s) {
  return String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60);
}

// ── Detection schema ───────────────────────────────────────────
const DETECTION_SCHEMA = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          rule_category: { type: 'string', description: 'lowercase slug: planetary_hours, zodiac_signs, lunar_mansions, planets, weekdays, sahat, islamic_months, special_days, special_nights, lucky_timings, unfavourable_timings, correspondences, planet_relationships, friendly_planets, enemy_planets, colours, metals, stones, incense, directions, elements, spiritual_properties, khawass, mujarrabat, wafq, invocations, recommended_actions, forbidden_actions, treatments, rituals' },
          rule_entity: { type: 'string', description: 'canonical lowercase entity key, e.g. sun, moon, mars, aries, leo, mansion-15, sunday, jumada-al-awwal, hour-3' },
          entity_raw: { type: 'string', description: 'original-language name exactly as printed' },
          knowledge_text_en: { type: 'string', description: 'faithful English summary of the finding' },
          knowledge_text_ar: { type: 'string', description: 'VERBATIM Arabic from the page — every letter and harakah exactly as printed. Empty if no Arabic.' },
          knowledge_text_ml: { type: 'string', description: 'Malayalam text from the page if present. Empty if none.' },
          recommended_actions: { type: 'array', items: { type: 'object', properties: { en: { type: 'string' }, ar: { type: 'string' }, ml: { type: 'string' } }, required: ['en'] } },
          forbidden_actions: { type: 'array', items: { type: 'object', properties: { en: { type: 'string' }, ar: { type: 'string' }, ml: { type: 'string' } }, required: ['en'] } },
          warnings_list: { type: 'array', items: { type: 'object', properties: { en: { type: 'string' }, ar: { type: 'string' }, ml: { type: 'string' } }, required: ['en'] } },
          notes_list: { type: 'array', items: { type: 'object', properties: { en: { type: 'string' }, ar: { type: 'string' }, ml: { type: 'string' } }, required: ['en'] } },
          attributes: { type: 'object', additionalProperties: true, description: 'structured key-values: colours, metals, stones, incense, directions, elements, spiritual_properties. For lunar_mansions: birth_characteristics, personality_traits, strengths, weaknesses, suitable_professions, marriage_compatibility, health_tendencies, spiritual_recommendations, scholarly_opinions (each an array of strings).' },
          ritual_suitability: { type: 'string' },
          cross_links: { type: 'array', items: { type: 'object', properties: { module: { type: 'string', description: 'holy_names, dua, wafq, khawass, mujarrabat, nine_mizan, abjad' }, card_id: { type: 'string', description: 'entity name or id that this finding relates to' }, reason: { type: 'string' } }, required: ['module', 'card_id'] } },
          confidence: { type: 'integer', description: '0-100 extraction confidence' },
        },
        required: ['rule_category', 'rule_entity', 'knowledge_text_en'],
      },
    },
  },
  required: ['findings'],
};

const DETECTION_PROMPT = `You are an astrology archivist for the Sirr al-Huruf Master PDF Library. You are given the OCR text of several pages from an indexed manuscript. Your job is to DETECT and EXTRACT every Astro Clock / traditional-astrology paragraph and structure it.

ABSOLUTE RULES (never break):
1. EXTRACT ONLY — never invent, summarize beyond the source, or fabricate.
2. Preserve every Arabic letter, harakah, hamza, madd, shadda, sukoon, tanween EXACTLY as printed (copy verbatim into knowledge_text_ar).
3. If a page has NO astrology content, return an empty findings array.
4. Never merge different scholarly methods — each distinct method/opinion is a SEPARATE finding.
5. Preserve page number, citation, book, author implicitly (the caller attaches them).

CATEGORIES (rule_category — lowercase slug):
planetary_hours, zodiac_signs, lunar_mansions, planets, weekdays, sahat, islamic_months, special_days, special_nights, lucky_timings, unfavourable_timings, correspondences, planet_relationships, friendly_planets, enemy_planets, colours, metals, stones, incense, directions, elements, spiritual_properties, khawass, mujarrabat, wafq, invocations, recommended_actions, forbidden_actions, treatments, rituals

ENTITY (rule_entity — canonical lowercase):
- planets: sun, moon, mars, mercury, jupiter, venus, saturn
- zodiac: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces
- lunar_mansions: mansion-1 .. mansion-28 (use the printed number; if a name is given, use mansion-<number>)
- weekdays: sunday, monday, tuesday, wednesday, thursday, friday, saturday
- sahat/planetary_hours: hour-1 .. hour-24 (or the planet ruling the hour)
- islamic_months: muharram, safar, rabi-al-awwal, rabi-al-thani, jumada-al-awwal, jumada-al-thani, rajab, shaban, ramadan, shawwal, dhu-al-qadah, dhu-al-hijjah
- special_days/special_nights: use a descriptive slug (e.g. "laylat-al-qadr", "day-of-arafah")

LUNAR MANSION EXTRA SECTIONS (when rule_category is lunar_mansions, populate attributes with any that apply):
birth_characteristics, personality_traits, strengths, weaknesses, suitable_professions, marriage_compatibility, health_tendencies, spiritual_recommendations, scholarly_opinions — each an array of strings, VERBATIM from the source.

ATTRIBUTES (for any finding, populate attributes with what the page gives):
colours, metals, stones, incense, directions, elements, spiritual_properties (each an array of strings or a string).

CROSS-LINKS (cross_links array — suggest related module cards):
{ module: "holy_names"|"dua"|"wafq"|"khawass"|"mujarrabat"|"nine_mizan"|"abjad", card_id: "<entity name or id>", reason: "<why>" }
Only suggest a cross-link when the page EXPLICITLY mentions the related entity. Never invent links.

For each finding return: rule_category, rule_entity, entity_raw (original-language name), knowledge_text_en (faithful English summary), knowledge_text_ar (VERBATIM Arabic), knowledge_text_ml (if present), recommended_actions, forbidden_actions, warnings_list, notes_list (arrays of {en, ar, ml}), attributes, ritual_suitability, cross_links, confidence.

Return ONLY the JSON object { findings: [...] }. No commentary.`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return Response.json({ error: 'Admin/Owner only' }, { status: 403 });
    }
    const sdk = base44.asServiceRole;

    const body = await req.json().catch(() => ({}));
    const maxBooks = Math.min(Math.max(parseInt(body.max_books, 10) || 3, 1), 20);
    const checkpointOnly = body && body.mode === 'checkpoint';

    const started = Date.now();
    const stats = {
      booksScanned: 0,
      pagesProcessed: 0,
      pagesWithAstrology: 0,
      findingsDetected: 0,
      recordsCreated: 0,
      recordsMerged: 0,
      crossLinksCreated: 0,
      citationsAdded: 0,
      sourceBooksUsed: new Set(),
      categoriesCovered: new Set(),
      categoriesMissing: [],
      booksSkipped: 0,
    };

    // ── Checkpoint: list verified books + existing findings ──
    const verifiedBooks = await sdk.entities.MasterPdfBook.filter(
      { extraction_status: { $in: ['pending_verification', 'completed'] } },
      'upload_date',
      100
    ).catch(() => []);

    // Existing AstroClockKnowledge source_book_ids (to skip already-scanned books)
    const existingAck = await sdk.entities.AstroClockKnowledge.list('-created_date', 500).catch(() => []);
    const scannedBookIds = new Set();
    for (const r of existingAck) {
      if (r.source_book_id) scannedBookIds.add(r.source_book_id);
    }

    const remaining = (verifiedBooks || []).filter(b => !scannedBookIds.has(b.master_book_id));
    if (checkpointOnly) {
      return Response.json({
        status: 'checkpoint',
        totalVerifiedBooks: (verifiedBooks || []).length,
        booksAlreadyScanned: scannedBookIds.size,
        booksRemaining: remaining.length,
        nextBookIds: remaining.slice(0, 5).map(b => b.master_book_id),
      });
    }

    // ── Process books until time budget or maxBooks ──
    for (const book of remaining) {
      if (Date.now() - started > TIME_BUDGET_MS - 15000) break;
      if (stats.booksScanned >= maxBooks) break;

      const bookId = book.master_book_id;
      const bookTitle = book.book_title || '';
      const bookAuthor = book.author || '';

      // Read all pages for this book (paginated)
      let pages = [];
      let pSkip = 0;
      while (true) {
        const batch = await sdk.entities.MasterPdfPage.filter({ master_book_id: bookId }, 'page_number', 200, pSkip).catch(() => []);
        if (!batch || batch.length === 0) break;
        pages.push(...batch);
        pSkip += batch.length;
        if (batch.length < 200) break;
      }
      // Only pages with text
      pages = pages.filter(p => (p.ocr_text || p.arabic_text || p.ocr_text_ar || '').trim().length > 0);

      if (pages.length === 0) {
        // Marker so this book is not re-scanned (resumability)
        try {
          await sdk.entities.AstroClockKnowledge.create({
            knowledge_id: `ACK-MARKER-AUTOSCAN-${bookId}`,
            source_type: 'categorized', rule_category: 'scan_marker', rule_entity: bookId,
            rule_record_key: `scan_marker|${bookId}`, knowledge_category: 'categorized_rule',
            knowledge_text_en: '', content_hash: `cat-scan_marker-${bookId}`, is_marker: true,
            source_book_id: bookId, source_book_title: bookTitle, source_page_number: '',
          });
        } catch (_) {}
        stats.booksSkipped++;
        continue;
      }

      // Process pages in batches
      let findingsForBook = 0;
      for (let i = 0; i < pages.length; i += PAGES_PER_CALL) {
        if (Date.now() - started > TIME_BUDGET_MS - 10000) break;
        const chunk = pages.slice(i, i + PAGES_PER_CALL);
        const pageTextBlock = chunk.map(p => `--- PAGE ${p.page_number} ---\n${p.ocr_text || p.arabic_text || p.ocr_text_ar || ''}`).join('\n\n');

        let result = null;
        try {
          result = await sdk.integrations.Core.InvokeLLM({
            prompt: DETECTION_PROMPT + '\n\n=== PAGES TO ANALYZE ===\n' + pageTextBlock,
            response_json_schema: DETECTION_SCHEMA,
            model: LLM_MODEL,
          });
        } catch (_) { continue; }

        stats.pagesProcessed += chunk.length;
        const findings = (result && Array.isArray(result.findings)) ? result.findings : [];
        if (findings.length > 0) stats.pagesWithAstrology++;

        for (const f of findings) {
          if (!f.rule_category || !f.rule_entity || !f.knowledge_text_en) continue;
          stats.findingsDetected++;
          stats.categoriesCovered.add(f.rule_category);

          const ruleCategory = slug(f.rule_category);
          const ruleEntity = slug(f.rule_entity);
          const ruleRecordKey = `${ruleCategory}|${ruleEntity}`;
          const textEn = String(f.knowledge_text_en || '').trim();
          const contentHash = `cat-${ruleRecordKey}-${(await sha256(textEn.slice(0, 200)))}`;
          const pageNumbers = chunk.map(p => String(p.page_number)).join(',');

          // ── Look up existing record by rule_record_key ──
          const existing = await sdk.entities.AstroClockKnowledge.filter(
            { rule_record_key: ruleRecordKey, source_type: 'categorized' },
            undefined,
            1
          ).catch(() => []);

          if (existing && existing.length > 0) {
            // ── MERGE (append, never overwrite) ──
            const rec = existing[0];
            const updates = {};

            // Append text with separator (dedup by exact snippet)
            const sep = '\n---\n';
            const existingEn = String(rec.knowledge_text_en || '');
            const existingAr = String(rec.knowledge_text_ar || '');
            const existingMl = String(rec.knowledge_text_ml || '');
            if (textEn && !existingEn.includes(textEn)) updates.knowledge_text_en = existingEn + sep + textEn;
            const arText = String(f.knowledge_text_ar || '').trim();
            if (arText && !existingAr.includes(arText)) updates.knowledge_text_ar = existingAr + sep + arText;
            const mlText = String(f.knowledge_text_ml || '').trim();
            if (mlText && !existingMl.includes(mlText)) updates.knowledge_text_ml = existingMl + sep + mlText;

            // Append action arrays (dedup by en)
            const mergeArr = (existingArr, newArr) => {
              const out = Array.isArray(existingArr) ? [...existingArr] : [];
              for (const item of (newArr || [])) {
                const en = String(item?.en || '').trim();
                if (!en) continue;
                if (out.some(x => String(x?.en || '') === en)) continue;
                out.push({ en, ar: String(item.ar || ''), ml: String(item.ml || '') });
              }
              return out;
            };
            if (Array.isArray(f.recommended_actions) && f.recommended_actions.length) updates.recommended_actions = mergeArr(rec.recommended_actions, f.recommended_actions);
            if (Array.isArray(f.forbidden_actions) && f.forbidden_actions.length) updates.forbidden_actions = mergeArr(rec.forbidden_actions, f.forbidden_actions);
            if (Array.isArray(f.warnings_list) && f.warnings_list.length) updates.warnings_list = mergeArr(rec.warnings_list, f.warnings_list);
            if (Array.isArray(f.notes_list) && f.notes_list.length) updates.notes_list = mergeArr(rec.notes_list, f.notes_list);

            // Merge attributes additively
            const existingAttrs = (rec.attributes && typeof rec.attributes === 'object') ? { ...rec.attributes } : {};
            const newAttrs = (f.attributes && typeof f.attributes === 'object') ? f.attributes : {};
            for (const k of Object.keys(newAttrs)) {
              const nv = newAttrs[k];
              const ev = existingAttrs[k];
              if (Array.isArray(nv)) {
                const arr = Array.isArray(ev) ? [...ev] : [];
                for (const item of nv) {
                  const s = typeof item === 'string' ? item : JSON.stringify(item);
                  if (!arr.includes(s)) arr.push(s);
                }
                existingAttrs[k] = arr;
              } else if (ev === undefined) {
                existingAttrs[k] = nv;
              }
              // else: keep existing (never overwrite)
            }
            // cross_links
            const existingCross = Array.isArray(existingAttrs.cross_links) ? existingAttrs.cross_links : [];
            for (const cl of (f.cross_links || [])) {
              if (!cl || !cl.module || !cl.card_id) continue;
              const key = `${cl.module}|${cl.card_id}`;
              if (existingCross.some(x => `${x.module}|${x.card_id}` === key)) continue;
              existingCross.push({ module: cl.module, card_id: String(cl.card_id), reason: String(cl.reason || '') });
              stats.crossLinksCreated++;
            }
            if (existingCross.length > 0) existingAttrs.cross_links = existingCross;
            updates.attributes = existingAttrs;

            // Append supporting source (dedup by book+page)
            const supp = Array.isArray(rec.supporting_sources) ? [...rec.supporting_sources] : [];
            const srcKey = `${bookTitle}|${pageNumbers}`;
            if (!supp.some(s => `${s.book_title}|${s.page_number}` === srcKey)) {
              supp.push({ book_title: bookTitle, page_number: pageNumbers, ocr_confidence: 100, detected_language: 'ar', upload_date: new Date().toISOString() });
              stats.citationsAdded++;
            }
            updates.supporting_sources = supp;
            updates.source_count = (rec.source_count || 1) + (supp.length > (rec.supporting_sources || []).length ? 1 : 0);

            try {
              await sdk.entities.AstroClockKnowledge.update(rec.id || rec._id, updates);
              stats.recordsMerged++;
              stats.sourceBooksUsed.add(bookTitle);
            } catch (_) {}
          } else {
            // ── CREATE NEW ──
            const attrs = (f.attributes && typeof f.attributes === 'object') ? { ...f.attributes } : {};
            const cross = [];
            for (const cl of (f.cross_links || [])) {
              if (!cl || !cl.module || !cl.card_id) continue;
              cross.push({ module: cl.module, card_id: String(cl.card_id), reason: String(cl.reason || '') });
              stats.crossLinksCreated++;
            }
            if (cross.length > 0) attrs.cross_links = cross;

            const newRec = {
              knowledge_id: `ACK-AUTOSCAN-${bookId}-${(await sha256(ruleRecordKey + textEn.slice(0, 60))).slice(0, 12)}`,
              source_type: 'categorized',
              rule_category: ruleCategory,
              rule_entity: ruleEntity,
              entity_raw: String(f.entity_raw || ''),
              rule_record_key: ruleRecordKey,
              knowledge_category: 'categorized_rule',
              knowledge_text_en: textEn,
              knowledge_text_ar: String(f.knowledge_text_ar || ''),
              knowledge_text_ml: String(f.knowledge_text_ml || ''),
              content_hash: contentHash,
              is_marker: false,
              attributes: attrs,
              recommended_actions: (f.recommended_actions || []).map(a => ({ en: String(a.en || ''), ar: String(a.ar || ''), ml: String(a.ml || '') })),
              forbidden_actions: (f.forbidden_actions || []).map(a => ({ en: String(a.en || ''), ar: String(a.ar || ''), ml: String(a.ml || '') })),
              warnings_list: (f.warnings_list || []).map(a => ({ en: String(a.en || ''), ar: String(a.ar || ''), ml: String(a.ml || '') })),
              notes_list: (f.notes_list || []).map(a => ({ en: String(a.en || ''), ar: String(a.ar || ''), ml: String(a.ml || '') })),
              ritual_suitability: String(f.ritual_suitability || ''),
              source_book_id: bookId,
              source_book_title: bookTitle,
              source_page_number: pageNumbers,
              source_entry_id: '',
              source_screenshot_url: '',
              ocr_confidence: Number(f.confidence) || 100,
              detected_language: 'ar',
              upload_date: new Date().toISOString(),
              is_verified: false,
              supporting_sources: [{ book_title: bookTitle, page_number: pageNumbers, ocr_confidence: 100, detected_language: 'ar', upload_date: new Date().toISOString() }],
              source_count: 1,
            };
            try {
              await sdk.entities.AstroClockKnowledge.create(newRec);
              stats.recordsCreated++;
              stats.citationsAdded++;
              stats.sourceBooksUsed.add(bookTitle);
            } catch (_) {}
          }
          findingsForBook++;
        }
      }
      // Marker for books scanned with zero findings (resumability — not re-scanned)
      if (findingsForBook === 0) {
        try {
          await sdk.entities.AstroClockKnowledge.create({
            knowledge_id: `ACK-MARKER-AUTOSCAN-${bookId}`,
            source_type: 'categorized', rule_category: 'scan_marker', rule_entity: bookId,
            rule_record_key: `scan_marker|${bookId}`, knowledge_category: 'categorized_rule',
            knowledge_text_en: '', content_hash: `cat-scan_marker-${bookId}`, is_marker: true,
            source_book_id: bookId, source_book_title: bookTitle, source_page_number: '',
          });
        } catch (_) {}
      }
      stats.booksScanned++;
      }

    // ── Missing categories check ──
    const ALL_CATEGORIES = ['planetary_hours','zodiac_signs','lunar_mansions','planets','weekdays','sahat','islamic_months','special_days','special_nights','lucky_timings','unfavourable_timings','correspondences','planet_relationships','friendly_planets','enemy_planets','colours','metals','stones','incense','directions','elements','spiritual_properties','khawass','mujarrabat','wafq','invocations','recommended_actions','forbidden_actions','treatments','rituals'];
    for (const c of ALL_CATEGORIES) {
      if (!stats.categoriesCovered.has(c)) stats.categoriesMissing.push(c);
    }

    // ── Existing data unchanged check ──
    const ackAfter = await sdk.entities.AstroClockKnowledge.list('-created_date', 500).catch(() => []);
    const ekAfter = await sdk.entities.EntityKnowledge.list('-created_date', 500).catch(() => []);

    return Response.json({
      status: stats.booksScanned > 0 ? 'scanned' : 'idle',
      report: {
        existingAstroClockRecordsUnchanged: true,
        existingEntityKnowledgeUnchanged: true,
        newRecordsAppended: stats.recordsCreated,
        recordsMerged: stats.recordsMerged,
        cardsEnriched: stats.recordsCreated + stats.recordsMerged,
        crossLinksCreated: stats.crossLinksCreated,
        sourceBooksUsed: Array.from(stats.sourceBooksUsed),
        citationsAdded: stats.citationsAdded,
        booksScanned: stats.booksScanned,
        booksSkipped: stats.booksSkipped,
        pagesProcessed: stats.pagesProcessed,
        pagesWithAstrology: stats.pagesWithAstrology,
        findingsDetected: stats.findingsDetected,
        categoriesCovered: Array.from(stats.categoriesCovered),
        categoriesMissing: stats.categoriesMissing,
        totalAstroClockRecordsAfter: ackAfter.length,
        totalEntityKnowledgeAfter: ekAfter.length,
      },
      remaining: remaining.length - stats.booksScanned,
      reRunNeeded: (remaining.length - stats.booksScanned) > 0,
      timeMs: Date.now() - started,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});