import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// ═══════════════════════════════════════════════════════════════
// SIRR-ONLY FAITHFUL MANUSCRIPT ARCHIVE INGESTION
// ═══════════════════════════════════════════════════════════════
// The uploaded PDF is the ONLY source of truth. This function is a
// faithful digital archive — it TRANSCRIBES, it never GENERATES.
//
//   • Transcribes each page VERBATIM (every Arabic letter, harakah,
//     punctuation, paragraph, line break preserved) in page order.
//   • Never rewrites, summarizes, paraphrases, or regenerates content.
//   • Never auto-translates Arabic. malayalam_meaning is left empty.
//   • Never generates introductions, benefits, warnings, or
//     explanations.
//   • A Malayalam NAVIGATION title is created ONLY when the
//     manuscript has no Malayalam title (short label, never content).
//   • Pages with OCR confidence < 100 are flagged needs_review=true
//     for manual review — never guesses or invents missing words.
//
// Writes ONLY to the SIRR-isolated entities (SirrManuscriptBook /
// SirrManuscriptEntry). Admin-only. Never touches global collections.
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
      'You are a faithful manuscript archivist. You are given a scanned Islamic occult manuscript PDF (Arabic / Ottoman Turkish).',
      'Your ONLY job is to TRANSCRIBE — never to generate.',
      '',
      'ABSOLUTE RULES (HIGHEST PRIORITY):',
      '- Transcribe each page EXACTLY as printed. Copy EVERY Arabic letter, EVERY harakah, EVERY punctuation mark, EVERY paragraph, EVERY line break.',
      '- Do NOT paraphrase, rewrite, summarize, or "improve" anything.',
      '- Do NOT translate. Do NOT generate introductions, benefits, warnings, or explanations.',
      '- Do NOT reconstruct Duas from memory. Only copy what is literally visible on the page.',
      '- Do NOT add, guess, or invent missing words. If a word or character is unclear, lower the ocr_confidence for that page — never guess.',
      '- Preserve the original language mix exactly (if a page has Arabic and Turkish and Malayalam, transcribe all as printed).',
      '- Process pages in order. Return one object per page.',
      '',
      'For EACH page return:',
      '- page_number: the page number (1-based).',
      '- verbatim_text: the COMPLETE text printed on the page, transcribed character-for-character, preserving line breaks with \\n.',
      '- ocr_confidence: integer 0-100. Use 100 ONLY if you are completely certain of every single character on the page. Use a value below 100 if ANY character is uncertain, unclear, partially cut, or guessed. Never round up to 100 when unsure.',
      '- heading_ar: ONLY if this page begins a new section AND the manuscript prints a heading on it — transcribe that heading verbatim (with harakat). Otherwise "".',
      '- heading_ml: ONLY if heading_ar is non-empty AND the manuscript has NO Malayalam title for this section — a SHORT Malayalam navigation label (a few words, for navigation ONLY). NEVER a translation of the section content. Otherwise "".',
      '- has_malayalam: true if the page itself contains Malayalam text (which is already part of verbatim_text).',
      '',
      'Also return book-level metadata if visible on the manuscript: book_title (original), book_title_ar, author, edition, volume, publication_year, book_language, total_pages, and malayalam_book_name (a short Malayalam navigation name for the book ONLY if the manuscript has no Malayalam book title).',
      '',
      'Return ONLY the JSON object matching the schema. No commentary, no notes, no extra text.'
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
        pages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              page_number: { type: 'integer' },
              verbatim_text: { type: 'string' },
              ocr_confidence: { type: 'integer' },
              heading_ar: { type: 'string' },
              heading_ml: { type: 'string' },
              has_malayalam: { type: 'boolean' },
            },
            required: ['page_number', 'verbatim_text', 'ocr_confidence'],
          },
        },
      },
      required: ['pages'],
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
      return Response.json({ error: 'Transcription failed', details: String(e?.message || e) }, { status: 500 });
    }

    const data = (extracted && typeof extracted === 'object') ? extracted : {};
    const pages = Array.isArray(data.pages) ? data.pages : [];
    const total_pages = Number(data.total_pages) || pages.length;
    const malayalam_book_name = provided_malayalam_name || data.malayalam_book_name || '';

    // One SirrManuscriptEntry per page — verbatim, in page order.
    // No structured fields are generated. No Malayalam translation.
    const records = pages.map((p) => {
      const page_number = Number(p.page_number) || 0;
      const conf = Number(p.ocr_confidence);
      const ocr_confidence = Number.isFinite(conf) ? Math.max(0, Math.min(100, conf)) : 100;
      return {
        sirr_entry_id: `SIRRE-${sirr_book_id}-${page_number}`,
        sirr_book_id,
        entry_order: page_number,
        heading_title_ml: p.heading_ml || '',
        heading_title_ar: p.heading_ar || '',
        heading_title: '',
        arabic_text: p.verbatim_text || '',
        malayalam_meaning: '',
        english_meaning: '',
        images: [],
        page_number: page_number ? String(page_number) : '',
        book_title: data.book_title || original_file_name || '',
        ocr_confidence,
        needs_review: ocr_confidence < 100,
        has_malayalam: !!p.has_malayalam,
      };
    });

    if (records.length > 0) {
      for (let i = 0; i < records.length; i += 100) {
        await base44.entities.SirrManuscriptEntry.bulkCreate(records.slice(i, i + 100));
      }
    }

    const review_count = records.filter((r) => r.needs_review).length;
    const bookUpdate = {
      total_pages,
      total_entries: records.length,
      extraction_status: records.length > 0 ? 'completed' : 'failed',
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
      review_count,
      status: bookUpdate.extraction_status,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});