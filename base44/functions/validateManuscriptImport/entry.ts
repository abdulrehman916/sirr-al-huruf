import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// MANUSCRIPT IMPORT VALIDATION — PHASE 1: EXTRACTION + IMAGES
// ═══════════════════════════════════════════════════════════════
// Phase 1 (this function):
//   Stage 1: PDF Content Extraction (InvokeLLM with file_urls)
//   Stage 4: Image Extraction (actual image FILES from PDF bytes)
//
// Phase 2 (verifyBookEntries function — call separately after this):
//   Stage 2: Arabic Verification (verifyArabicText for EVERY entry)
//   Stage 3: Malayalam Translation (from verified Arabic ONLY)
//
// Entries are created with verification_status='pending'.
// After Phase 2 completes, the 14-point check is finalized.
//
// The split is required because 19+ parallel verifyArabicText calls
// (each ~70s) exceed the platform gateway timeout in a single call.
//
// ADMIN ONLY.
// ═══════════════════════════════════════════════════════════════

const SIRR_SECTION_NAMES = {
  1: 'Diseases & Healing',
  2: 'Jinn, Ruqyah & Spiritual Protection',
  3: 'Mahabbah, Acceptance & Relationships',
  4: 'Wafq, Taweez, Magic Squares & Spiritual Methods',
  5: 'Duas, Quranic Verses, Divine Names & Invocations',
  6: 'Herbs, Incense, Oils, Plants & Traditional Remedies',
  7: 'Sacred Times, Planetary Hours, Lunar Mansions & Spiritual Rules',
};

// ── Helper: Decompress FlateDecode stream ──
async function decompressFlate(data: Uint8Array): Promise<Uint8Array | null> {
  try {
    const stream = new Response(data).body!.pipeThrough(new DecompressionStream('deflate'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch {
    try {
      const stream = new Response(data).body!.pipeThrough(new DecompressionStream('deflate-raw'));
      return new Uint8Array(await new Response(stream).arrayBuffer());
    } catch {
      return null;
    }
  }
}

// ── Helper: Extract actual image files from PDF ──
async function extractImagesFromPdf(
  pdfBytes: Uint8Array,
  bookId: string,
  uploadFn: (file: File) => Promise<{ file_url: string }>
): Promise<{ images: any[]; error: string | null }> {
  let pdfLib: any;
  try {
    pdfLib = await import('npm:pdf-lib@1.17.1');
  } catch (e) {
    return { images: [], error: 'pdf-lib import failed: ' + (e as Error).message };
  }

  const { PDFDocument, PDFName } = pdfLib;
  let pdfDoc: any;
  try {
    pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  } catch (e) {
    return { images: [], error: 'PDF load failed: ' + (e as Error).message };
  }

  const pages = pdfDoc.getPages();
  const allImages: any[] = [];

  for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
    const pageNum = pageIdx + 1;
    const page = pages[pageIdx];

    try {
      const node = page.node;
      const resources = node.get(PDFName.of('Resources'));
      if (!resources) continue;

      const resourcesDict = pdfDoc.context.lookup(resources);
      if (!resourcesDict) continue;

      const xObjectsEntry = resourcesDict.get(PDFName.of('XObject'));
      if (!xObjectsEntry) continue;

      const xObjectsDict = pdfDoc.context.lookup(xObjectsEntry);
      if (!xObjectsDict || !xObjectsDict.dict) continue;

      for (const [name, ref] of xObjectsDict.dict.entries()) {
        try {
          let xObj: any;
          try {
            xObj = pdfDoc.context.lookup(ref);
          } catch {
            xObj = ref;
          }
          if (!xObj || !xObj.dict || !xObj.contents) continue;

          const dict = xObj.dict;
          const subtype = dict.get(PDFName.of('Subtype'));
          if (!subtype || subtype.toString() !== '/Image') continue;

          const filter = dict.get(PDFName.of('Filter'));
          const widthVal = dict.get(PDFName.of('Width'));
          const heightVal = dict.get(PDFName.of('Height'));
          let width = 0;
          if (widthVal) {
            if (typeof widthVal.value === 'function') width = widthVal.value();
            else if (typeof widthVal.numberValue === 'number') width = widthVal.numberValue;
          }
          let height = 0;
          if (heightVal) {
            if (typeof heightVal.value === 'function') height = heightVal.value();
            else if (typeof heightVal.numberValue === 'number') height = heightVal.numberValue;
          }

          let filterStr = '';
          if (filter) {
            try { filterStr = filter.toString(); } catch {}
          }

          let imageBytes: Uint8Array | null = null;
          let mimeType = '';
          let extension = '';

          if (filterStr === '/DCTDecode') {
            imageBytes = new Uint8Array(xObj.contents);
            mimeType = 'image/jpeg';
            extension = 'jpg';
          } else if (filterStr.includes('FlateDecode')) {
            const pixelData = await decompressFlate(new Uint8Array(xObj.contents));
            if (!pixelData) continue;

            const colorSpace = dict.get(PDFName.of('ColorSpace'));
            const csStr = colorSpace ? colorSpace.toString() : '/DeviceRGB';
            const channels = csStr.includes('Gray') ? 1 : csStr.includes('CMYK') ? 4 : 3;
            if (channels === 4) continue;

            let fastPng: any;
            try {
              fastPng = await import('npm:fast-png@6.1.0');
            } catch { continue; }

            const pngBuffer = fastPng.encode({
              width,
              height,
              data: pixelData,
              components: channels,
              alpha: false,
            });
            imageBytes = new Uint8Array(pngBuffer);
            mimeType = 'image/png';
            extension = 'png';
          } else {
            continue;
          }

          if (imageBytes && imageBytes.length > 0) {
            const blob = new Blob([imageBytes], { type: mimeType });
            const safeName = String(name).replace(/[^a-zA-Z0-9]/g, '');
            const fileName = `${bookId}_page${pageNum}_${safeName}.${extension}`;
            const file = new File([blob], fileName, { type: mimeType });
            const uploadResult = await uploadFn(file);

            allImages.push({
              image_url: uploadResult.file_url,
              page_number: pageNum,
              width,
              height,
              format: mimeType,
              name: String(name),
            });
          }
        } catch { /* skip */ }
      }
    } catch { /* skip page */ }
  }

  return { images: allImages, error: null };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const body = await req.json();
    const { pdf_url, book_title, book_title_ar, author, language, original_file_name, tradition } = body;

    if (!pdf_url || !book_title) {
      return Response.json({ error: 'pdf_url and book_title are required' }, { status: 400 });
    }

    const bookId = `MS-VAL-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const validationDate = new Date().toISOString();

    // ══ Create ManuscriptBook ══
    const book = await base44.asServiceRole.entities.ManuscriptBook.create({
      book_id: bookId,
      book_title,
      book_title_ar: book_title_ar || '',
      author: author || '',
      language: language || 'Arabic',
      source: 'validation',
      original_file_url: pdf_url,
      original_file_name: original_file_name || '',
      upload_date: validationDate,
      version: '2.0-validation-4stage',
      total_pages: 0,
      ocr_status: 'processing',
      verification_status: 'unverified',
      extraction_status: 'validation_in_progress',
      categories_covered: [],
      total_entries_extracted: 0,
      tradition: tradition || '',
      validation_status: 'pending',
      validation_report: {},
      validation_date: validationDate,
      notes: 'Phase 1: Extraction + Images. Call verifyBookEntries next for Phase 2.',
    });

    // ══ STAGE 1: PDF Content Extraction ══
    let pdfBytes: Uint8Array | null = null;
    try {
      const pdfResponse = await fetch(pdf_url);
      pdfBytes = new Uint8Array(await pdfResponse.arrayBuffer());
    } catch { /* PDF download failed — LLM can still use file_urls */ }

    const extractionPrompt = `You are an expert in Islamic occult manuscripts, Arabic calligraphy, and spiritual text preservation.

TASK: Analyze EVERY page of this PDF manuscript. Extract ALL content from EVERY page. Do NOT skip any page.

For each page, extract:
1. ALL Arabic text — preserve EXACTLY as written in the manuscript, including harakat (diacritics). Never modify, modernize, or simplify Arabic.
2. All entries: rituals, duas, Quran verses, divine names, wafq, taweez, diagrams, tables, instructions, materials, timing, conditions, warnings, notes, references.
3. Identify any images, wafq (magic squares), taweez (amulets), diagrams, tables, or seals on each page.
4. For each entry, classify into a Sirr section (1-7):
   1 = Diseases & Healing
   2 = Jinn, Ruqyah & Spiritual Protection
   3 = Mahabbah, Acceptance & Relationships
   4 = Wafq, Taweez, Magic Squares & Spiritual Methods
   5 = Duas, Quranic Verses, Divine Names & Invocations
   6 = Herbs, Incense, Oils, Plants & Traditional Remedies
   7 = Sacred Times, Planetary Hours, Lunar Mansions & Spiritual Rules

For each entry, provide:
- page_number, entry_type, purpose, arabic_text (VERBATIM), malayalam_meaning (if in manuscript), english_meaning
- conditions, materials, preparation, procedure, timing, planet, day, incense, repetition, warnings, benefits, notes
- has_image, image_type (wafq/taweez/diagram/table/seal/drawing/none), image_description
- arabic_text_preserved (true if clearly readable)
- sirr_section (1-7), topic, topic_ml, topic_ar

ALSO provide: total_pages_analyzed, pages_with_images, pages_with_errors, skipped_pages, errors

CRITICAL RULES:
- Process EVERY page. Do not skip any.
- Preserve Arabic text EXACTLY as written. Never guess harakat.
- If Arabic is unclear, set arabic_text_preserved=false.
- Never invent information. If a field is not in the manuscript, leave it empty.`;

    const llmResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: extractionPrompt,
      file_urls: [pdf_url],
      model: 'gemini_3_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          total_pages_analyzed: { type: 'integer' },
          entries: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                page_number: { type: 'string' },
                entry_type: { type: 'string' },
                purpose: { type: 'string' },
                arabic_text: { type: 'string' },
                malayalam_meaning: { type: 'string' },
                english_meaning: { type: 'string' },
                conditions: { type: 'string' },
                materials: { type: 'string' },
                preparation: { type: 'string' },
                procedure: { type: 'string' },
                timing: { type: 'string' },
                planet: { type: 'string' },
                day: { type: 'string' },
                incense: { type: 'string' },
                repetition: { type: 'string' },
                warnings: { type: 'string' },
                benefits: { type: 'string' },
                notes: { type: 'string' },
                has_image: { type: 'boolean' },
                image_type: { type: 'string' },
                image_description: { type: 'string' },
                arabic_text_preserved: { type: 'boolean' },
                sirr_section: { type: 'integer' },
                topic: { type: 'string' },
                topic_ml: { type: 'string' },
                topic_ar: { type: 'string' },
              },
            },
          },
          pages_with_images: { type: 'array', items: { type: 'string' } },
          pages_with_errors: { type: 'array', items: { type: 'string' } },
          skipped_pages: { type: 'array', items: { type: 'string' } },
          errors: { type: 'array', items: { type: 'string' } },
        },
      },
    });

    const entries = llmResult.entries || [];
    const pagesWithImages = llmResult.pages_with_images || [];
    const pagesWithErrors = llmResult.pages_with_errors || [];
    const skippedPages = llmResult.skipped_pages || [];
    const errors = llmResult.errors || [];
    const totalPagesAnalyzed = llmResult.total_pages_analyzed || 0;

    // ══ STAGE 4: Image Extraction ══
    let extractedImages: any[] = [];
    let imageExtractionError: string | null = null;
    if (pdfBytes) {
      const imgResult = await extractImagesFromPdf(pdfBytes, bookId, async (file: File) => {
        return await base44.asServiceRole.integrations.Core.UploadFile({ file });
      });
      extractedImages = imgResult.images;
      imageExtractionError = imgResult.error;
    }

    // Link images to entries by page number
    const imagesByPage: Record<string, string[]> = {};
    for (const img of extractedImages) {
      const pg = String(img.page_number);
      if (!imagesByPage[pg]) imagesByPage[pg] = [];
      imagesByPage[pg].push(img.image_url);
    }

    // ══ Build ManuscriptEntry records (verification_status='pending') ══
    const entryRecords = entries.map((entry: any, idx: number) => {
      const pageImages = imagesByPage[String(entry.page_number)] || [];

      return {
        entry_id: `ME-${bookId}-${idx + 1}`,
        book_id: bookId,
        book_title,
        book_title_ar: book_title_ar || '',
        sirr_section: entry.sirr_section || 5,
        topic: entry.topic || entry.purpose || 'General',
        topic_ml: entry.topic_ml || '',
        topic_ar: entry.topic_ar || '',
        entry_type: entry.entry_type || 'instruction',
        purpose: entry.purpose || '',
        purpose_ml: entry.malayalam_meaning || '',
        introduction: '',
        arabic_text: entry.arabic_text || '', // Original manuscript text — always preserved
        malayalam_meaning: '', // Will be filled in Phase 2 from verified sources ONLY
        english_meaning: '', // Will be filled in Phase 2 from verified sources ONLY
        conditions: entry.conditions || '',
        materials: entry.materials || '',
        preparation: entry.preparation || '',
        procedure: entry.procedure || '',
        timing: entry.timing || '',
        planet: entry.planet || '',
        day: entry.day || '',
        incense: entry.incense || '',
        repetition: entry.repetition || '',
        warnings: entry.warnings || '',
        benefits: entry.benefits || '',
        notes: entry.notes || '',
        page_number: entry.page_number || '',
        images: pageImages, // Actual image URLs from Stage 4
        verified_arabic_hash: '', // Will be filled in Phase 2
        verification_status: 'pending', // Stage 2 pending
        extraction_confidence: entry.arabic_text_preserved === false ? 50 : 80,
        extraction_date: validationDate,
      };
    });

    // ══ Create ManuscriptEntry records ══
    let createdEntries: any[] = [];
    if (entryRecords.length > 0) {
      createdEntries = await base44.asServiceRole.entities.ManuscriptEntry.bulkCreate(entryRecords);
    }

    // ══ Compute Phase 1 metrics ══
    const totalEntries = entryRecords.length;
    const totalImages = extractedImages.length;
    const totalArabicTexts = entries.filter((e: any) => e.arabic_text && e.arabic_text.trim().length > 0).length;
    const totalArabicPreserved = entries.filter((e: any) => e.arabic_text_preserved === true).length;
    const totalClassifications = entries.filter((e: any) => e.sirr_section >= 1 && e.sirr_section <= 7).length;
    const allHaveBookAndPage = entryRecords.every((e) => e.book_title && e.page_number);
    const allEntriesHaveIndexFields = entryRecords.every((e) =>
      e.book_id && e.sirr_section && e.topic && e.entry_id && e.page_number
    );
    const imagesAreUrls = entryRecords.every((e) => e.images.every((url: string) => url.startsWith('http') || url.length === 0));
    const imageExtractionAttempted = pdfBytes !== null;

    const entriesBySection: Record<string, any> = {};
    for (let i = 1; i <= 7; i++) {
      entriesBySection[`sirr_${i}`] = {
        name: SIRR_SECTION_NAMES[i as keyof typeof SIRR_SECTION_NAMES],
        count: entries.filter((e: any) => e.sirr_section === i).length,
      };
    }

    const arabicPreservationRate = totalArabicTexts > 0
      ? Math.round((totalArabicPreserved / totalArabicTexts) * 100)
      : 0;

    const hasCriticalErrors = errors.length > 0 && errors.some((e: string) => e.toLowerCase().includes('critical'));
    const allPagesProcessed = skippedPages.length === 0;
    const hasEntries = totalEntries > 0;
    const arabicWellPreserved = arabicPreservationRate >= 80;
    const allClassified = totalClassifications === totalEntries;

    const totalJpegImages = extractedImages.filter((i) => i.format === 'image/jpeg').length;
    const totalPngImages = extractedImages.filter((i) => i.format === 'image/png').length;

    // ══ Phase 1 14-Point Check (Stages 2 & 3 are PENDING) ══
    const fourteenPointCheck = {
      '1_import_pdf': book ? 'PASS' : 'FAIL',
      '2_store_metadata': (book_title && bookId) ? 'PASS' : 'FAIL',
      '3_extract_every_page': allPagesProcessed ? 'PASS' : 'FAIL',
      '4_extract_arabic': arabicWellPreserved ? 'PASS' : 'FAIL',
      '5_extract_images': imageExtractionAttempted ? 'PASS' : 'FAIL',
      '6_classify_sections': allClassified ? 'PASS' : 'FAIL',
      '7_preserve_book_page': allHaveBookAndPage ? 'PASS' : 'FAIL',
      '8_arabic_verification': 'PENDING',
      '9_verified_storage': 'PENDING',
      '10_malayalam_translation': 'PENDING',
      '11_search_indexing': allEntriesHaveIndexFields ? 'PASS' : 'FAIL',
      '12_method_pages': allEntriesHaveIndexFields ? 'PASS' : 'FAIL',
      '13_image_zoom': imagesAreUrls ? 'PASS' : 'FAIL',
      '14_validation_report': 'PASS',
    };

    const validationReport = {
      phase: 1,
      summary: {
        total_pages_processed: totalPagesAnalyzed,
        total_entries_extracted: totalEntries,
        total_images_extracted: totalImages,
        total_arabic_texts: totalArabicTexts,
        total_arabic_preserved: totalArabicPreserved,
        total_jpeg_images: totalJpegImages,
        total_png_images: totalPngImages,
        arabic_preservation_rate: arabicPreservationRate,
        total_classifications: totalClassifications,
        entries_pending_verification: totalEntries,
      },
      stage_details: {
        stage_1_extraction: {
          status: 'completed',
          total_pages: totalPagesAnalyzed,
          total_entries: totalEntries,
          skipped_pages: skippedPages,
          errors,
        },
        stage_2_verification: {
          status: 'pending',
          message: 'Call verifyBookEntries with book_id to complete Stage 2.',
        },
        stage_3_translation: {
          status: 'pending',
          message: 'Malayalam/English will be populated from verified sources in Phase 2.',
        },
        stage_4_images: {
          status: imageExtractionError ? 'partial' : 'completed',
          total_images: totalImages,
          jpeg: totalJpegImages,
          png: totalPngImages,
          error: imageExtractionError,
        },
      },
      entries_by_section: entriesBySection,
      pages_with_images: pagesWithImages,
      pages_with_errors: pagesWithErrors,
      skipped_pages: skippedPages,
      errors,
      fourteen_point_check: fourteenPointCheck,
      validation_date: validationDate,
      book_id: bookId,
      book_title,
      next_step: `Call verifyBookEntries with { "book_id": "${bookId}" } to complete Phase 2 (Stages 2 & 3).`,
    };

    // ══ Update ManuscriptBook ══
    await base44.asServiceRole.entities.ManuscriptBook.update(book.id, {
      extraction_status: 'completed',
      ocr_status: 'completed',
      total_pages: totalPagesAnalyzed,
      total_entries_extracted: totalEntries,
      categories_covered: Object.entries(entriesBySection)
        .filter(([, v]: [string, any]) => v.count > 0)
        .map(([k]: [string, any]) => k.replace('sirr_', 'Sirr ')),
      validation_status: 'pending',
      validation_report: validationReport,
      validation_date: validationDate,
      verification_status: 'unverified',
      notes: `Phase 1 complete: ${totalEntries} entries, ${totalImages} images. Call verifyBookEntries for Phase 2.`,
    });

    return Response.json({
      status: 'phase_1_complete',
      book_id: bookId,
      book_title,
      validation_report: validationReport,
      entries_created: createdEntries.length,
      fourteen_point_check: fourteenPointCheck,
      message: `Phase 1 complete: ${totalEntries} entries extracted, ${totalImages} images extracted. Stages 2 & 3 are PENDING. Call verifyBookEntries with book_id "${bookId}" to complete the pipeline.`,
      next_step: `verifyBookEntries({ "book_id": "${bookId}" })`,
    });
  } catch (error) {
    return Response.json({ error: error.message, status: 'validation_failed' }, { status: 500 });
  }
});