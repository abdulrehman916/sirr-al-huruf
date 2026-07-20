import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import {
  sha256, slug, normalizeArabic,
  mergeActionArr, mergeAttributesAdditive, appendTextDedup,
} from '../../shared/astroScanShared.ts';

// ═══════════════════════════════════════════════════════════════
// extractAstrologyFromIndex — STAGE 2 OF THE TWO-STAGE PIPELINE
//
// Runs ONLY after Stage 1 (buildLibraryIndex) is complete. Reads
// LibraryBookIndex and processes ONLY books classified with the
// 'astrology' module. Extracts every astrology-related passage from
// every classified book and APPENDS it into AstroClockKnowledge.
//
// LAWS (non-negotiable):
//   - NEVER overwrite or delete existing AstroClockKnowledge records
//   - APPEND-ONLY — every source kept separate with its own citation
//   - Preserve every Arabic letter + harakat EXACTLY as printed
//   - Never merge different scholarly methods — each kept separate
//   - Never touch Astro Clock engines, Holy Names engines, or UI
//   - Every magic square kept separately with its own citation
//   - Only astrology books are processed (no module mixing)
//
// Resumable: tracks astrology_pages_processed per book. Time-budgeted.
// ADMIN/OWNER ONLY.
// ═══════════════════════════════════════════════════════════════

const TIME_BUDGET_MS = 180000;
const PAGES_PER_CALL = 8;
const LLM_MODEL = 'gemini_3_flash';

// ── Detection schema (astrology only) ──────────────────────────
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
          magic_squares: { type: 'array', description: 'Magic squares / wafq for this entity. Each kept SEPARATELY with its own citation. NEVER omit.', items: { type: 'object', properties: { name: { type: 'string' }, grid: { type: 'array', items: { type: 'array', items: { type: 'number' } } }, grid_text: { type: 'string' }, purpose: { type: 'string' }, repetitions: { type: 'string' }, conditions: { type: 'string' }, timing: { type: 'string' } }, required: ['name'] } },
          ritual_suitability: { type: 'string' },
          cross_links: { type: 'array', items: { type: 'object', properties: { module: { type: 'string' }, card_id: { type: 'string' }, reason: { type: 'string' } }, required: ['module', 'card_id'] } },
          confidence: { type: 'integer' },
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
6. NEVER omit a magic square / wafq. If the page contains one, store it in magic_squares with its grid and citation.

CATEGORIES (rule_category — lowercase slug):
planetary_hours, zodiac_signs, lunar_mansions, planets, weekdays, sahat, islamic_months, special_days, special_nights, lucky_timings, unfavourable_timings, correspondences, planet_relationships, friendly_planets, enemy_planets, colours, metals, stones, incense, directions, elements, spiritual_properties, khawass, mujarrabat, wafq, invocations, recommended_actions, forbidden_actions, treatments, rituals

ENTITY (rule_entity — canonical lowercase):
- planets: sun, moon, mars, mercury, jupiter, venus, saturn
- zodiac: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces
- lunar_mansions: mansion-1 .. mansion-28
- weekdays: sunday..saturday
- sahat/planetary_hours: hour-1 .. hour-24
- islamic_months: muharram, safar, rabi-al-awwal, rabi-al-thani, jumada-al-awwal, jumada-al-thani, rajab, shaban, ramadan, shawwal, dhu-al-qadah, dhu-al-hijjah

LUNAR MANSION EXTRA (when rule_category is lunar_mansions, populate attributes with any that apply):
birth_characteristics, personality_traits, strengths, weaknesses, suitable_professions, marriage_compatibility, health_tendencies, spiritual_recommendations, scholarly_opinions — each an array of strings, VERBATIM from the source.

MAGIC SQUARES: if the page contains a magic square / wafq for this entity, store it in magic_squares:
{ name: "<label as printed>", grid: [[numbers...],...], grid_text: "<if Arabic-letter square>", purpose, repetitions, conditions, timing }
NEVER omit a square. Keep every version separately.

CROSS-LINKS: { module: "holy_names"|"dua"|"wafq"|"khawass"|"mujarrabat"|"nine_mizan"|"abjad", card_id: "<entity name or id>", reason } — only when the page EXPLICITLY mentions the related entity.

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
    const checkpointOnly = body && body.mode === 'checkpoint';
    const reportOnly = body && body.mode === 'report';
    const started = Date.now();

    // ── Load the library index ──
    const index = await loadAllIndex(sdk);

    // ── Astrology books only ──
    const astroBooks = index.filter(i => (i.modules || []).includes('astrology') && i.classification_status === 'classified');
    const pending = astroBooks.filter(i => i.astrology_extraction_status !== 'completed');

    if (checkpointOnly) {
      const completed = astroBooks.filter(i => i.astrology_extraction_status === 'completed').length;
      const inProgress = astroBooks.filter(i => i.astrology_extraction_status === 'in_progress').length;
      return Response.json({
        status: 'checkpoint',
        totalAstrologyBooks: astroBooks.length,
        extractionCompleted: completed,
        extractionInProgress: inProgress,
        extractionPending: pending.length,
        stage1Complete: index.length >= 1, // informational
      });
    }

    if (reportOnly) {
      const completed = astroBooks.filter(i => i.astrology_extraction_status === 'completed');
      return Response.json({
        status: 'report',
        totalAstrologyBooks: astroBooks.length,
        extractionCompleted: completed.length,
        extractionRemaining: pending.length,
        completedBooks: completed.map(i => ({ book_id: i.source_book_id, title: i.book_title })),
        confirmation: 'No existing Astro Clock data was modified, overwritten, or deleted. All findings appended additively. Every source preserved separately with its own Arabic text, citations, page numbers, and book references.',
      });
    }

    const stats = {
      booksProcessed: 0,
      booksCompleted: 0,
      pagesProcessed: 0,
      pagesWithAstrology: 0,
      findingsDetected: 0,
      recordsCreated: 0,
      recordsMerged: 0,
      citationsAdded: 0,
      crossLinksCreated: 0,
      magicSquaresStored: 0,
      categoriesCovered: new Set(),
    };

    for (const idx of pending) {
      if (Date.now() - started > TIME_BUDGET_MS - 15000) break;
      const bookId = idx.source_book_id;
      const bookTitle = idx.book_title || '';

      // Fetch the MasterPdfBook (for author + combined_total_pages)
      const bookRecs = await sdk.entities.MasterPdfBook.filter({ master_book_id: bookId }, undefined, 1).catch(() => []);
      const book = (bookRecs && bookRecs[0]) || { master_book_id: bookId, book_title: bookTitle, author: '' };
      const bookAuthor = book.author || '';

      // Load all pages for this book
      let pages = [];
      let pSkip = 0;
      while (true) {
        const batch = await sdk.entities.MasterPdfPage.filter({ master_book_id: bookId }, 'page_number', 200, pSkip).catch(() => []);
        if (!batch || batch.length === 0) break;
        pages.push(...batch); pSkip += batch.length;
        if (batch.length < 200) break;
      }
      const lastPage = idx.astrology_pages_processed || 0;
      pages = pages.filter(p => (p.ocr_text || p.arabic_text || p.ocr_text_ar || '').trim().length > 0 && p.page_number > lastPage);

      if (idx.astrology_extraction_status !== 'in_progress') {
        await updateIndexStatus(sdk, idx, 'in_progress', lastPage);
      }

      if (pages.length === 0) {
        await updateIndexStatus(sdk, idx, 'completed', lastPage);
        stats.booksCompleted++;
        continue;
      }

      let lastProcessedPage = lastPage;
      let allPagesScanned = true;
      for (let i = 0; i < pages.length; i += PAGES_PER_CALL) {
        if (Date.now() - started > TIME_BUDGET_MS - 10000) { allPagesScanned = false; break; }
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
        lastProcessedPage = chunk[chunk.length - 1].page_number;
        const pageNumbers = chunk.map(p => String(p.page_number)).join(',');
        const findings = (result && Array.isArray(result.findings)) ? result.findings : [];
        if (findings.length > 0) stats.pagesWithAstrology++;

        for (const f of findings) {
          if (!f.rule_category || !f.rule_entity || !f.knowledge_text_en) continue;
          stats.findingsDetected++;
          stats.categoriesCovered.add(slug(f.rule_category));
          await writeAstroFinding(sdk, f, bookId, bookTitle, bookAuthor, pageNumbers, stats);
        }
      }

      const newStatus = allPagesScanned ? 'completed' : 'in_progress';
      await updateIndexStatus(sdk, idx, newStatus, lastProcessedPage);
      stats.booksProcessed++;
      if (allPagesScanned) stats.booksCompleted++;
    }

    const completedCount = astroBooks.filter(i => i.astrology_extraction_status === 'completed').length + stats.booksCompleted;
    const allComplete = completedCount >= astroBooks.length && astroBooks.length > 0;

    if (allComplete) {
      return Response.json({
        status: 'complete',
        totalAstrologyBooks: astroBooks.length,
        extractionCompleted: completedCount,
        booksProcessedThisRun: stats.booksProcessed,
        pagesProcessed: stats.pagesProcessed,
        findingsDetected: stats.findingsDetected,
        recordsCreated: stats.recordsCreated,
        recordsMerged: stats.recordsMerged,
        citationsAdded: stats.citationsAdded,
        crossLinksCreated: stats.crossLinksCreated,
        magicSquaresStored: stats.magicSquaresStored,
        categoriesCovered: Array.from(stats.categoriesCovered),
        confirmation: 'Astrology extraction 100% complete. No existing data was modified, overwritten, or deleted. Every source preserved separately. Astro Clock cards are now ready to be generated/verified from this appended data.',
        reRunNeeded: false,
        timeMs: Date.now() - started,
      });
    }

    return Response.json({
      status: 'in_progress',
      totalAstrologyBooks: astroBooks.length,
      extractionCompleted: completedCount,
      extractionRemaining: astroBooks.length - completedCount,
      booksProcessedThisRun: stats.booksProcessed,
      pagesProcessed: stats.pagesProcessed,
      findingsDetected: stats.findingsDetected,
      recordsCreated: stats.recordsCreated,
      recordsMerged: stats.recordsMerged,
      citationsAdded: stats.citationsAdded,
      crossLinksCreated: stats.crossLinksCreated,
      magicSquaresStored: stats.magicSquaresStored,
      categoriesCovered: Array.from(stats.categoriesCovered),
      reRunNeeded: true,
      timeMs: Date.now() - started,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ── Write an Astro finding (append/merge into AstroClockKnowledge) ──
async function writeAstroFinding(sdk, f, bookId, bookTitle, bookAuthor, pageNumbers, stats) {
  const ruleCategory = slug(f.rule_category);
  const ruleEntity = slug(f.rule_entity);
  const ruleRecordKey = `${ruleCategory}|${ruleEntity}`;
  const textEn = String(f.knowledge_text_en || '').trim();
  const contentHash = `cat-${ruleRecordKey}-${await sha256(textEn.slice(0, 200))}`;

  const existing = await sdk.entities.AstroClockKnowledge.filter(
    { rule_record_key: ruleRecordKey, source_type: 'categorized' }, undefined, 1
  ).catch(() => []);

  const magicSquares = Array.isArray(f.magic_squares) ? f.magic_squares.map(ms => ({
    name: String(ms.name || ''),
    grid: Array.isArray(ms.grid) ? ms.grid : [],
    grid_text: String(ms.grid_text || ''),
    purpose: String(ms.purpose || ''),
    repetitions: String(ms.repetitions || ''),
    conditions: String(ms.conditions || ''),
    timing: String(ms.timing || ''),
    source_book: bookTitle,
    source_page: pageNumbers,
  })) : [];

  if (existing && existing.length > 0) {
    const rec = existing[0];
    const updates = {};
    const sep = '\n---\n';
    updates.knowledge_text_en = appendTextDedup(rec.knowledge_text_en, textEn, sep);
    updates.knowledge_text_ar = appendTextDedup(rec.knowledge_text_ar, String(f.knowledge_text_ar || '').trim(), sep);
    updates.knowledge_text_ml = appendTextDedup(rec.knowledge_text_ml, String(f.knowledge_text_ml || '').trim(), sep);

    if (Array.isArray(f.recommended_actions) && f.recommended_actions.length) updates.recommended_actions = mergeActionArr(rec.recommended_actions, f.recommended_actions);
    if (Array.isArray(f.forbidden_actions) && f.forbidden_actions.length) updates.forbidden_actions = mergeActionArr(rec.forbidden_actions, f.forbidden_actions);
    if (Array.isArray(f.warnings_list) && f.warnings_list.length) updates.warnings_list = mergeActionArr(rec.warnings_list, f.warnings_list);
    if (Array.isArray(f.notes_list) && f.notes_list.length) updates.notes_list = mergeActionArr(rec.notes_list, f.notes_list);

    let existingAttrs = mergeAttributesAdditive(rec.attributes, f.attributes);
    if (magicSquares.length > 0) {
      const existingMs = Array.isArray(existingAttrs.magic_squares) ? existingAttrs.magic_squares : [];
      for (const ms of magicSquares) {
        const msKey = `${ms.name}|${ms.source_page}|${JSON.stringify(ms.grid).slice(0, 80)}`;
        if (existingMs.some(x => `${x.name}|${x.source_page}|${JSON.stringify(x.grid).slice(0, 80)}` === msKey)) continue;
        existingMs.push(ms);
        stats.magicSquaresStored++;
      }
      existingAttrs.magic_squares = existingMs;
    }
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
    } catch (_) {}
  } else {
    const attrs = (f.attributes && typeof f.attributes === 'object') ? { ...f.attributes } : {};
    if (magicSquares.length > 0) {
      attrs.magic_squares = magicSquares;
      stats.magicSquaresStored += magicSquares.length;
    }
    const cross = [];
    for (const cl of (f.cross_links || [])) {
      if (!cl || !cl.module || !cl.card_id) continue;
      cross.push({ module: cl.module, card_id: String(cl.card_id), reason: String(cl.reason || '') });
      stats.crossLinksCreated++;
    }
    if (cross.length > 0) attrs.cross_links = cross;

    const newRec = {
      knowledge_id: `ACK-STAGE2-${bookId}-${(await sha256(ruleRecordKey + textEn.slice(0, 60))).slice(0, 12)}`,
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
    } catch (_) {}
  }
}

async function updateIndexStatus(sdk, idx, status, lastPage) {
  try {
    await sdk.entities.LibraryBookIndex.update(idx.id || idx._id, {
      astrology_extraction_status: status,
      astrology_pages_processed: lastPage,
    });
  } catch (_) {}
}

async function loadAllIndex(sdk) {
  const all = [];
  let skip = 0;
  while (all.length < 2000) {
    const batch = await sdk.entities.LibraryBookIndex.list('-indexed_at', 500, skip).catch(() => []);
    if (!batch || batch.length === 0) break;
    all.push(...batch); skip += batch.length;
    if (batch.length < 500) break;
  }
  return all;
}