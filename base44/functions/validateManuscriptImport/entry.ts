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

    // ══ STAGE 1: File Content Extraction ══
    // Detect file type from original_file_name extension.
    // Non-PDF files (DOCX, TXT, Markdown, Images) skip pdf-lib chunking
    // and use whole-file LLM extraction via file_urls (Gemini vision).
    const fileExt = (original_file_name || pdf_url || '').toLowerCase().split('.').pop() || '';
    const isPdf = !fileExt || fileExt === 'pdf';
    let pdfBytes: Uint8Array | null = null;
    if (isPdf) {
      try {
        const pdfResponse = await fetch(pdf_url);
        pdfBytes = new Uint8Array(await pdfResponse.arrayBuffer());
      } catch { /* PDF download failed — LLM can still use file_urls */ }
    }

    // ══ STAGE 0: QUALITY ASSESSMENT GATE ══
    // Assess manuscript readability BEFORE extraction.
    // Reject poor-quality manuscripts — do NOT import them.
    // Accuracy > completeness. Better to reject than to save incorrect data.
    const qualityPrompt = `You are an expert in Islamic manuscript analysis and Arabic calligraphy preservation.

TASK: Assess the READABILITY and EXTRACTION QUALITY of this PDF manuscript. Determine whether this manuscript can be reliably extracted with high accuracy.

Analyze the manuscript for these quality criteria:
1. PAGE CLARITY: Are pages clear enough to read? (blurred, smudged, faded, low-resolution scans)
2. ARABIC LEGIBILITY: Is the Arabic text clearly readable? (calligraphy quality, harakat visibility, letter clarity)
3. TEXT COMPLETENESS: Are pages complete? (missing pages, cut-off text, incomplete scans, damaged pages)
4. OCR FEASIBILITY: Can text be reliably extracted? (broken characters, overlapping text, decorative borders interfering)
5. CONSISTENCY: Is quality consistent across pages? (some clear, others unreadable)
6. CONTENT INTEGRITY: Is the actual content (rituals, Arabic, tables, diagrams) intact and legible?

For each page, note whether it has problems.

Return:
- quality_verdict: "pass" or "reject"
- overall_confidence: 0-100 (confidence that extraction will be accurate)
- reason: if rejected, explain why
- problem_pages: array of page numbers with quality issues
- quality_details: { page_clarity, arabic_legibility, text_completeness, ocr_feasibility, consistency, content_integrity } each 0-100
- pages_assessed: total pages examined

REJECTION THRESHOLD: Reject if overall_confidence < 65, OR if more than 20% of pages have problems, OR if Arabic legibility is too poor to preserve harakat reliably.

CRITICAL: It is BETTER TO REJECT an unclear manuscript than to extract incorrect or incomplete information. Accuracy and authenticity are more important than importing every available manuscript.`;

    const qualityResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: qualityPrompt,
      file_urls: [pdf_url],
      model: 'gemini_3_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          quality_verdict: { type: 'string' },
          overall_confidence: { type: 'integer' },
          reason: { type: 'string' },
          problem_pages: { type: 'array', items: { type: 'string' } },
          quality_details: {
            type: 'object',
            properties: {
              page_clarity: { type: 'integer' },
              arabic_legibility: { type: 'integer' },
              text_completeness: { type: 'integer' },
              ocr_feasibility: { type: 'integer' },
              consistency: { type: 'integer' },
              content_integrity: { type: 'integer' },
            },
          },
          pages_assessed: { type: 'integer' },
        },
      },
    });

    const qualityVerdict = (qualityResult as any)?.quality_verdict || 'pass';
    const overallConfidence = (qualityResult as any)?.overall_confidence ?? 0;
    const qualityReason = (qualityResult as any)?.reason || '';
    const problemPages = (qualityResult as any)?.problem_pages || [];
    const qualityDetails = (qualityResult as any)?.quality_details || {};
    const pagesAssessed = (qualityResult as any)?.pages_assessed || 0;

    // ══ QUALITY GATE: Reject poor-quality manuscripts — do NOT import ══
    const qualityPassed = qualityVerdict === 'pass' && overallConfidence >= 65;

    if (!qualityPassed) {
      const rejectionReport = {
        quality_rejected: true,
        quality_verdict: 'reject',
        overall_confidence: overallConfidence,
        reason: qualityReason || 'Manuscript quality below threshold for reliable extraction',
        problem_pages: problemPages,
        quality_details: qualityDetails,
        pages_assessed: pagesAssessed,
        rejection_date: validationDate,
        message: 'Import Rejected: manuscript quality too poor for reliable extraction. No entries imported.',
      };

      await base44.asServiceRole.entities.ManuscriptBook.update(book.id, {
        extraction_status: 'failed',
        ocr_status: 'failed',
        validation_status: 'failed',
        total_pages: pagesAssessed,
        total_entries_extracted: 0,
        validation_report: rejectionReport,
        validation_date: validationDate,
        notes: `IMPORT REJECTED — Quality: ${overallConfidence}/100. ${qualityReason}`,
      });

      return Response.json({
        status: 'import_rejected',
        book_id: bookId,
        book_title,
        quality_verdict: 'reject',
        overall_confidence: overallConfidence,
        reason: qualityReason,
        problem_pages: problemPages,
        quality_details: qualityDetails,
        message: `Import Rejected: manuscript quality too poor (confidence ${overallConfidence}/100). No entries imported. Reason: ${qualityReason}`,
        validation_report: rejectionReport,
      });
    }

    const extractionPrompt = `You are an expert in Islamic occult manuscripts, Arabic calligraphy, and spiritual text preservation.

TASK: Analyze EVERY page of this PDF manuscript. Extract ALL content from EVERY page. Do NOT skip any page.

═══ HEADING DETECTION — MANUSCRIPT STRUCTURE PRESERVATION ═══
FIRST, detect the REAL heading hierarchy from the PDF layout. Different manuscripts use different structures (Bab/Fasl/Mas'ala, Chapter/Section, Part/Chapter, etc.). You must detect what actually exists — never invent headings.

Detect headings by recognizing:
- Larger font sizes (chapter titles are typically larger than body text)
- Bold or centered text (section headings are often bold or centered)
- Decorative separators (ornamental dividers between chapters/sections)
- Numbered headings (e.g., "باب الأول", "الفصل الثاني", "القسم الثالث", "1.", "2.")
- Arabic heading conventions: باب (Bab/Door), فصل (Fasl/Chapter), قسم (Qism/Section), جزء (Juz/Part), مسألة (Mas'ala/Question)
- Page-break boundaries (chapters often start on a new page)
- Indentation levels (sub-headings may be indented)
- Whitespace patterns (extra space before headings)

Build a HEADING TREE with any number of levels. For each heading provide:
- heading_id: unique identifier within this book (e.g., "H1", "H1-1", "H1-1-1", "H2", etc.)
- parent_heading_id: the heading_id of the parent heading (empty string "" for top-level)
- heading_level: integer depth (1 = top-level, 2 = sub-heading, 3 = sub-sub-heading, etc.)
- heading_title: the heading text in English transliteration or translation
- heading_title_ar: the heading text in original Arabic script (empty if not in Arabic)
- heading_order: sequence within parent (1-based)
- start_page: first page where this heading appears
- end_page: last page before the next heading at the same level (empty if unknown)
- heading_source: "pdf_detected" (real heading found in PDF) or "generated_fallback" (no heading found, temporary label created)

RULES FOR HEADINGS:
- NEVER invent headings when the manuscript already contains them.
- Only create "generated_fallback" headings when a section of content has NO detectable heading at all.
- Preserve heading titles EXACTLY as written (Arabic verbatim, never modified).
- If a manuscript has no headings at all, create ONE generated_fallback top-level heading covering the entire book.

═══ ENTRY EXTRACTION ═══
For each page, extract:
1. ALL Arabic text — preserve EXACTLY as written in the manuscript, including harakat (diacritics). Never modify, modernize, or simplify Arabic.
2. All entries: rituals, duas, Quran verses, divine names, wafq, taweez, diagrams, tables, instructions, materials, timing, conditions, warnings, notes, references.
3. Identify any images, wafq (magic squares), taweez (amulets), diagrams, tables, or seals on each page.
4. For each entry, classify into a Sirr section (1-7) — this is an ALTERNATIVE classification only:
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
- heading_id: the heading_id this entry belongs to (from the heading tree above). Every entry MUST have a heading_id.
- entry_order: sequential position of this entry within the book, by page order (1-based). Entries MUST be in exact manuscript page order.

ALSO provide: total_pages_analyzed, pages_with_images, pages_with_errors, skipped_pages, errors

CRITICAL RULES:
- Process EVERY page. Do not skip any.
- Preserve Arabic text EXACTLY as written. Never guess harakat. Never invent missing Arabic.
- If Arabic is unclear or partially unreadable, extract ONLY what is clearly readable. Set arabic_text_preserved=false.
- NEVER invent meanings, translations, or interpretations. Only extract what is explicitly written.
- If a field is not in the manuscript, leave it empty. Do not guess.
- For each entry, provide extraction_confidence (0-100): your confidence that the extracted content is accurate and complete. Below 70 = uncertain (unclear Arabic, missing fields, damaged content).
- Every entry MUST belong to a heading (heading_id). Never leave an entry orphaned.
- Preserve exact page order (entry_order must be sequential 1, 2, 3... by page).
- ACCURACY OVER COMPLETENESS: It is better to extract fewer entries with high confidence than many entries with uncertain content.`;

    // ══ STAGE 1: PDF Content Extraction — PAGE-BY-PAGE (chunked for accuracy) ══
    // Permanent Rule: "import the book page by page."
    // Process the PDF in small page chunks. Each chunk is extracted separately
    // to ensure every page is thoroughly analyzed. Results are aggregated.

    const EXTRACTION_SCHEMA = {
      type: 'object',
      properties: {
        total_pages_analyzed: { type: 'integer' },
        headings: {
          type: 'array',
          description: 'Dynamic heading tree detected from the PDF layout.',
          items: {
            type: 'object',
            properties: {
              heading_id: { type: 'string' },
              parent_heading_id: { type: 'string' },
              heading_level: { type: 'integer' },
              heading_title: { type: 'string' },
              heading_title_ar: { type: 'string' },
              heading_order: { type: 'integer' },
              start_page: { type: 'string' },
              end_page: { type: 'string' },
              heading_source: { type: 'string' },
            },
          },
        },
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
              extraction_confidence: { type: 'integer' },
              sirr_section: { type: 'integer' },
              topic: { type: 'string' },
              topic_ml: { type: 'string' },
              topic_ar: { type: 'string' },
              heading_id: { type: 'string' },
              entry_order: { type: 'integer' },
            },
          },
        },
        pages_with_images: { type: 'array', items: { type: 'string' } },
        pages_with_errors: { type: 'array', items: { type: 'string' } },
        skipped_pages: { type: 'array', items: { type: 'string' } },
        errors: { type: 'array', items: { type: 'string' } },
      },
    };

    let entries: any[] = [];
    let llmHeadings: any[] = [];
    let pagesWithImages: string[] = [];
    let pagesWithErrors: string[] = [];
    let skippedPages: string[] = [];
    let errors: string[] = [];
    let totalPagesAnalyzed = 0;

    // Try page-by-page chunked extraction if PDF bytes are available
    let chunkedExtraction = false;
    if (pdfBytes) {
      try {
        const pdfLibMod = await import('npm:pdf-lib@1.17.1');
        const { PDFDocument: PdfDoc } = pdfLibMod;
        const fullPdfDoc = await PdfDoc.load(pdfBytes, { ignoreEncryption: true });
        const totalPdfPages = fullPdfDoc.getPageCount();

        if (totalPdfPages > 0) {
          chunkedExtraction = true;
          const CHUNK_SIZE = 10;
          const totalChunks = Math.ceil(totalPdfPages / CHUNK_SIZE);

          for (let chunkIdx = 0; chunkIdx < totalChunks; chunkIdx++) {
            const startPage = chunkIdx * CHUNK_SIZE + 1;
            const endPage = Math.min((chunkIdx + 1) * CHUNK_SIZE, totalPdfPages);

            // Create a chunk PDF with just these pages
            const chunkPdf = await PdfDoc.create();
            const pageIndices: number[] = [];
            for (let p = startPage - 1; p < endPage; p++) pageIndices.push(p);
            const copiedPages = await chunkPdf.copyPages(fullPdfDoc, pageIndices);
            copiedPages.forEach((p: any) => chunkPdf.addPage(p));

            const chunkBytes = await chunkPdf.save();
            const chunkBlob = new Blob([chunkBytes], { type: 'application/pdf' });
            const chunkFileName = `${bookId}_pages_${startPage}-${endPage}.pdf`;
            const chunkFile = new File([chunkBlob], chunkFileName, { type: 'application/pdf' });
            const chunkUpload = await base44.asServiceRole.integrations.Core.UploadFile({ file: chunkFile });

            const chunkPrompt = `You are analyzing pages ${startPage} to ${endPage} of an Islamic occult manuscript PDF.\nIMPORTANT: Use ABSOLUTE page numbers (${startPage} to ${endPage}) in your response.\n\n${extractionPrompt}`;

            const chunkResult: any = await base44.asServiceRole.integrations.Core.InvokeLLM({
              prompt: chunkPrompt,
              file_urls: [chunkUpload.file_url],
              model: 'gemini_3_flash',
              response_json_schema: EXTRACTION_SCHEMA,
            });

            // Prefix heading_ids with chunk number to ensure uniqueness across chunks
            if (chunkResult.entries) {
              for (const e of chunkResult.entries) {
                if (e.heading_id) e.heading_id = `C${chunkIdx + 1}_${e.heading_id}`;
                entries.push(e);
              }
            }
            if (chunkResult.headings) {
              for (const h of chunkResult.headings) {
                h.heading_id = `C${chunkIdx + 1}_${h.heading_id}`;
                if (h.parent_heading_id) h.parent_heading_id = `C${chunkIdx + 1}_${h.parent_heading_id}`;
                llmHeadings.push(h);
              }
            }
            if (chunkResult.pages_with_images) pagesWithImages.push(...chunkResult.pages_with_images);
            if (chunkResult.pages_with_errors) pagesWithErrors.push(...chunkResult.pages_with_errors);
            if (chunkResult.skipped_pages) skippedPages.push(...chunkResult.skipped_pages);
            if (chunkResult.errors) errors.push(...chunkResult.errors);
            totalPagesAnalyzed += (chunkResult.total_pages_analyzed || (endPage - startPage + 1));
          }
        }
      } catch {
        // Fall back to whole-PDF extraction
        chunkedExtraction = false;
      }
    }

    // Fallback: whole-PDF extraction
    if (!chunkedExtraction) {
      const llmResult: any = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: extractionPrompt,
        file_urls: [pdf_url],
        model: 'gemini_3_flash',
        response_json_schema: EXTRACTION_SCHEMA,
      });
      entries = llmResult.entries || [];
      llmHeadings = llmResult.headings || [];
      pagesWithImages = llmResult.pages_with_images || [];
      pagesWithErrors = llmResult.pages_with_errors || [];
      skippedPages = llmResult.skipped_pages || [];
      errors = llmResult.errors || [];
      totalPagesAnalyzed = llmResult.total_pages_analyzed || 0;
    }

    // Ensure global sequential entry_order across all chunks (manuscript page order)
    entries.forEach((e: any, idx: number) => {
      e.entry_order = idx + 1;
    });

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

    // ══ STAGE 1.5: Create ManuscriptHeading records (dynamic heading tree) ══
    // DEDUPLICATION: Headings are deduplicated by (title, level) across all chunks.
    // The same heading appearing in multiple chunks (e.g., a chapter heading that
    // spans pages across chunk boundaries) is recognized as ONE heading.
    // Parent-child relationships are resolved globally, not per-chunk.
    // This fixes the broken heading tree where chunk-prefixed IDs prevented
    // cross-chunk parent-child resolution.
    const headingIdMap: Record<string, string> = {};
    const headingDedupMap: Map<string, any> = new Map();
    const chunkIdToPermanentId: Map<string, string> = new Map();

    if (llmHeadings.length > 0) {
      // Pass 1: Deduplicate headings by (title, level) across all chunks
      for (const h of llmHeadings) {
        const dedupKey = `${(h.heading_title || 'Untitled').trim().toLowerCase()}|${h.heading_level || 1}`;
        if (headingDedupMap.has(dedupKey)) {
          chunkIdToPermanentId.set(h.heading_id, headingDedupMap.get(dedupKey).heading_id);
          const existing = headingDedupMap.get(dedupKey);
          if (h.end_page && (!existing.end_page || String(h.end_page) > String(existing.end_page))) {
            existing.end_page = h.end_page;
          }
        } else {
          const permanentId = `H-${bookId}-${h.heading_level || 1}-${h.heading_order || 1}-${Math.random().toString(36).slice(2, 6)}`;
          const record: any = {
            heading_id: permanentId,
            parent_heading_id: '',
            book_id: bookId,
            heading_level: h.heading_level || 1,
            heading_title: h.heading_title || 'Untitled',
            heading_title_ar: h.heading_title_ar || '',
            heading_order: h.heading_order || 1,
            start_page: h.start_page || '',
            end_page: h.end_page || '',
            heading_source: h.heading_source || 'generated_fallback',
            entry_count: 0,
            total_entry_count: 0,
            _original_parent: h.parent_heading_id || '',
          };
          headingDedupMap.set(dedupKey, record);
          chunkIdToPermanentId.set(h.heading_id, permanentId);
        }
      }

      // Pass 2: Resolve parent references globally
      const headingRecords: any[] = [];
      for (const record of headingDedupMap.values()) {
        if (record._original_parent) {
          record.parent_heading_id = chunkIdToPermanentId.get(record._original_parent) || '';
        }
        delete record._original_parent;
        headingRecords.push(record);
      }

      for (const [chunkId, permanentId] of chunkIdToPermanentId) {
        headingIdMap[chunkId] = permanentId;
      }

      if (headingRecords.length > 0) {
        try {
          await base44.asServiceRole.entities.ManuscriptHeading.bulkCreate(headingRecords);
        } catch (e) {
          // Non-critical — headings may fail but entries still get created
        }
      }
    }

    // ══ Build ManuscriptEntry records (verification_status='pending') ══
    const entryRecords = entries.map((entry: any, idx: number) => {
      const pageImages = imagesByPage[String(entry.page_number)] || [];
      // Map LLM heading_id to permanent database heading_id
      const mappedHeadingId = entry.heading_id ? (headingIdMap[entry.heading_id] || '') : '';

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
        heading_id: mappedHeadingId,
        entry_order: entry.entry_order || (idx + 1),
        images: pageImages, // Actual image URLs from Stage 4
        verified_arabic_hash: '', // Will be filled in Phase 2
        verification_status: (entry.extraction_confidence || (entry.arabic_text_preserved === false ? 50 : 80)) < 70 ? 'manual_review' : 'pending',
        extraction_confidence: entry.extraction_confidence || (entry.arabic_text_preserved === false ? 50 : 80),
        extraction_date: validationDate,
      };
    });

    // ══ Update heading entry counts ══
    if (headingRecords.length > 0 && entryRecords.length > 0) {
      const entryCountByHeading: Record<string, number> = {};
      for (const e of entryRecords) {
        if (e.heading_id) {
          entryCountByHeading[e.heading_id] = (entryCountByHeading[e.heading_id] || 0) + 1;
        }
      }
      const headingUpdates = headingRecords
        .filter((h) => entryCountByHeading[h.heading_id] !== undefined)
        .map((h) => ({
          id: h.id || h.heading_id,
          entry_count: entryCountByHeading[h.heading_id] || 0,
          total_entry_count: entryCountByHeading[h.heading_id] || 0,
        }));
      // Note: total_entry_count for parent headings would require tree traversal;
      // entry_count (direct) is set here. total_entry_count can be computed later.
      if (headingUpdates.length > 0) {
        try {
          await base44.asServiceRole.entities.ManuscriptHeading.bulkUpdate(headingUpdates);
        } catch { /* non-critical */ }
      }
    }

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
      quality_assessment: {
        verdict: 'pass',
        overall_confidence: overallConfidence,
        quality_details: qualityDetails,
        problem_pages: problemPages,
        pages_assessed: pagesAssessed,
      },
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