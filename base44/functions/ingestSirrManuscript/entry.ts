import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// ═══════════════════════════════════════════════════════════════
// SIRR-ONLY MANUSCRIPT INGESTION
// ═══════════════════════════════════════════════════════════════
// Writes ONLY to the SIRR-isolated entities (SirrManuscriptBook /
// SirrManuscriptEntry). Never touches the global ManuscriptBook /
// ManuscriptEntry collections used by Astro Clock, Reference Library,
// Holy Names, or any other module.
//
// Admin-only. Receives a PDF file_url (uploaded via Core.UploadFile),
// extracts every Dua / Surah / practice / section in EXACT manuscript
// order via LLM vision, and stores them verbatim (Arabic with every
// harakah, faithful Malayalam translation). Nothing is invented.
// ═══════════════════════════════════════════════════════════════
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const pdf_file_url = body.pdf_file_url;
    if (!pdf_file_url) return Response.json({ error: 'pdf_file_url is required' }, { status: 400 });
    const original_file_name = body.original_file_name || '';
    const provided_malayalam_name = body.malayalam_book_name || '';
    const existing_book_id = body.existing_book_id || '';

    const now = new Date().toISOString();
    const stamp = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    const sirr_book_id = existing_book_id || `SIRRB-${stamp}-${rand}`;

    // Re-import: clear old entries for this book, mark processing.
    if (existing_book_id) {
      await base44.entities.SirrManuscriptEntry.deleteMany({ sirr_book_id: existing_book_id });
      await base44.entities.SirrManuscriptBook.update(existing_book_id, {
        extraction_status: 'processing', extraction_error: ''
      });
    } else {
      await base44.entities.SirrManuscriptBook.create({
        sirr_book_id,
        book_title: original_file_name || 'Sirr Manuscript',
        malayalam_book_name: provided_malayalam_name,
        original_file_url: pdf_file_url,
        original_file_name,
        source: 'sirr_upload',
        upload_date: now,
        extraction_status: 'processing',
        total_pages: 0,
        total_entries: 0,
      });
    }

    const extractionPrompt = [
      'You are given an Islamic occult manuscript PDF (Arabic / Ottoman Turkish).',
      'It contains Duas, Surahs, Hizbs, Wirds, practices, and sections.',
      '',
      'Extract EVERY Dua, Surah, practice, or section in EXACT manuscript order.',
      'Do NOT skip any. Do NOT merge. Do NOT rearrange. Do NOT invent.',
      '',
      'For each entry provide:',
      '- heading_title_ml: the Malayalam title. If the manuscript already has a Malayalam title, use it verbatim. If it does NOT, translate ONLY the title into Malayalam (nothing else). NEVER use generic names like "Dua 1", "Prayer 2", "Section 5". Always use the real manuscript title.',
      '- heading_title_ar: the original Arabic title exactly as printed (verbatim, with harakat).',
      '- heading_title: the original heading in its source language / transliteration.',
      '- arabic_text: the COMPLETE Arabic text verbatim. Preserve EVERY letter, harakah, punctuation mark, line break, and paragraph. Never modify, normalize, summarize, or merge.',
      '- malayalam_meaning: a faithful Malayalam translation of the Arabic text. If the source is Turkish, translate the Turkish meaning accurately into Malayalam. Do NOT summarize. Do NOT simplify. Do NOT invent explanations.',
      '- english_meaning: English translation only if the manuscript itself provides one.',
      '- introduction, purpose, etiquette, conditions, preparation, warnings, repetition, timing, notes, materials, day, planet, incense, benefits, procedure: exactly as written in the manuscript for this entry. If the manuscript does not contain a field, leave it empty (""). NEVER fabricate introductions, benefits, warnings, or explanations.',
      '- page_number: the page number where this entry appears.',
      '- entry_order: 1-based position in manuscript order.',
      '',
      'Also return book-level metadata:',
      '- book_title: original book title (original language).',
      '- book_title_ar: Arabic book title if present.',
      '- author, edition, volume, publication_year, book_language: if present in the manuscript.',
      '- malayalam_book_name: Malayalam book name (translate the book title to Malayalam if the manuscript has none).',
      '- total_pages: total number of pages in the PDF.',
      '',
      'Return ONLY the JSON object matching the schema. No commentary.'
    ].join('\n');

    const schema = {
      type: 'object',
      properties: {
        total_pages: { type: 'integer' },
        book_title: { type: 'string' },
        book_title_ar: { type: 'string' },
        author: { type: 'string' },
        edition: { type: 'string' },
        volume: { type: 'string' },
        publication_year: { type: 'string' },
        book_language: { type: 'string' },
        malayalam_book_name: { type: 'string' },
        entries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              entry_order: { type: 'integer' },
              page_number: { type: 'string' },
              heading_title_ml: { type: 'string' },
              heading_title_ar: { type: 'string' },
              heading_title: { type: 'string' },
              introduction: { type: 'string' },
              purpose: { type: 'string' },
              etiquette: { type: 'string' },
              conditions: { type: "string" },
              preparation: { type: 'string' },
              warnings: { type: 'string' },
              repetition: { type: 'string' },
              timing: { type: 'string' },
              notes: { type: 'string' },
              materials: { type: 'string' },
              day: { type: 'string' },
              planet: { type: 'string' },
              incense: { type: 'string' },
              benefits: { type: 'string' },
              procedure: { type: 'string' },
              arabic_text: { type: 'string' },
              malayalam_meaning: { type: 'string' },
              english_meaning: { type: 'string' },
            },
            required: ['entry_order'],
          },
        },
      },
      required: ['entries'],
    };

    let extracted;
    try {
      extracted = await base44.integrations.Core.InvokeLLM({
        prompt: extractionPrompt,
        file_urls: [pdf_file_url],
        response_json_schema: schema,
      });
    } catch (e) {
      await base44.entities.SirrManuscriptBook.update(sirr_book_id, {
        extraction_status: 'failed',
        extraction_error: String(e?.message || e),
      });
      return Response.json({ error: 'Extraction failed', details: String(e?.message || e) }, { status: 500 });
    }

    const data = (extracted && typeof extracted === 'object') ? extracted : {};
    const entries = Array.isArray(data.entries) ? data.entries : [];
    const total_pages = Number(data.total_pages) || 0;
    const malayalam_book_name = provided_malayalam_name || data.malayalam_book_name || '';

    const records = entries.map((e, i) => ({
      sirr_entry_id: `SIRRE-${sirr_book_id}-${i + 1}`,
      sirr_book_id,
      entry_order: Number(e.entry_order) || (i + 1),
      heading_title_ml: e.heading_title_ml || '',
      heading_title_ar: e.heading_title_ar || '',
      heading_title: e.heading_title || '',
      introduction: e.introduction || '',
      purpose: e.purpose || '',
      etiquette: e.etiquette || '',
      conditions: e.conditions || '',
      materials: e.materials || '',
      preparation: e.preparation || '',
      procedure: e.procedure || '',
      timing: e.timing || '',
      day: e.day || '',
      planet: e.planet || '',
      incense: e.incense || '',
      repetition: e.repetition || '',
      warnings: e.warnings || '',
      benefits: e.benefits || '',
      notes: e.notes || '',
      arabic_text: e.arabic_text || '',
      malayalam_meaning: e.malayalam_meaning || '',
      english_meaning: e.english_meaning || '',
      images: Array.isArray(e.images) ? e.images : [],
      page_number: e.page_number ? String(e.page_number) : '',
      book_title: data.book_title || original_file_name || '',
    }));

    if (records.length > 0) {
      for (let i = 0; i < records.length; i += 100) {
        await base44.entities.SirrManuscriptEntry.bulkCreate(records.slice(i, i + 100));
      }
    }

    const bookUpdate = {
      total_pages,
      total_entries: records.length,
      extraction_status: records.length > 0 ? 'completed' : (total_pages > 0 ? 'partial' : 'failed'),
      book_title: data.book_title || original_file_name || '',
      book_title_ar: data.book_title_ar || '',
      author: data.author || '',
      language: data.book_language || '',
      edition: data.edition || '',
      volume: data.volume || '',
      publication_year: data.publication_year || '',
    };
    if (malayalam_book_name) bookUpdate.malayalam_book_name = malayalam_book_name;

    await base44.entities.SirrManuscriptBook.update(sirr_book_id, bookUpdate);

    return Response.json({
      sirr_book_id,
      total_entries: records.length,
      total_pages,
      status: bookUpdate.extraction_status,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});