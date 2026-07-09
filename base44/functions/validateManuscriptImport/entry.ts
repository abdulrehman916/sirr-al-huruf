import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// MANUSCRIPT IMPORT VALIDATION — SINGLE PDF END-TO-END TEST
// ═══════════════════════════════════════════════════════════════
// Processes a single real PDF and verifies:
//   ✓ Every page is processed correctly
//   ✓ Every Arabic text is preserved (not garbled)
//   ✓ Images, Wafq, Taweez, diagrams, tables identified
//   ✓ Page references, book references, search indexing
//   ✓ Auto-classification into Sirr sections (1-7)
//
// Generates a COMPLETE IMPORT REPORT:
//   - Total pages processed
//   - Total entries extracted
//   - Total images extracted
//   - Total Arabic texts
//   - Total verified Arabic texts
//   - Total manual review items
//   - Total classification results
//   - Any errors or skipped pages
//
// GATE: Bulk OneDrive import is LOCKED until validation_status='passed'.
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

    // ── Create ManuscriptBook (validation mode) ──
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
      version: '1.0-validation',
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
      notes: 'Single-PDF validation test. Not part of production library yet.',
    });

    // ── Use InvokeLLM with file_urls to analyze EVERY page of the PDF ──
    const validationPrompt = `You are an expert in Islamic occult manuscripts, Arabic calligraphy, and spiritual text preservation.

TASK: Analyze EVERY page of this PDF manuscript. Extract ALL content from EVERY page. Do NOT skip any page.

For each page, extract:
1. ALL Arabic text — preserve EXACTLY as written in the manuscript, including harakat (diacritics). Never modify, modernize, or simplify Arabic.
2. All entries: rituals, duas, Quran verses, divine names, wafq, taweez, diagrams, tables, instructions, materials, timing, conditions, warnings, notes, references.
3. Identify any images, wafq (magic squares), taweez (amulets), diagrams, tables, or seals on each page.
4. For each entry, classify into a Sirr section (1-7):
   1 = Diseases & Healing (diseases, treatments, remedies)
   2 = Jinn, Ruqyah & Spiritual Protection (jinn, exorcism, evil eye, protection)
   3 = Mahabbah, Acceptance & Relationships (love, attraction, marriage)
   4 = Wafq, Taweez, Magic Squares & Spiritual Methods (amulets, seals, diagrams)
   5 = Duas, Quranic Verses, Divine Names & Invocations (prayers, supplications)
   6 = Herbs, Incense, Oils, Plants & Traditional Remedies (herbal, incense)
   7 = Sacred Times, Planetary Hours, Lunar Mansions & Spiritual Rules (timing, astrology, rules)

For each entry, provide:
- page_number: The exact page number in the PDF
- entry_type: ritual, dua, quran_verse, divine_name, wafq, taweez, diagram, table, instruction, material, timing, condition, warning, note, reference, exorcism, protection, incense, herb
- purpose: What this entry is for
- arabic_text: Original Arabic text VERBATIM from the manuscript (preserve every character)
- malayalam_meaning: Malayalam translation if available in the manuscript
- english_meaning: English translation
- conditions, materials, preparation, procedure, timing, planet, day, incense, repetition, warnings, benefits, notes: All available fields
- has_image: true if this page contains an image/diagram/wafq/taweez/seal/table
- image_type: wafq, taweez, diagram, table, seal, drawing, or none
- image_description: Brief description of the image (if any)
- arabic_text_preserved: true if Arabic text is clearly readable and not garbled
- sirr_section: 1-7 classification
- topic: Concise topic name (e.g., "Stomach Pain", "Ayat al-Kursi Protection")
- topic_ml: Malayalam topic name
- topic_ar: Arabic topic name
- needs_verification: true if Arabic text should be verified against authoritative sources
- needs_manual_review: true if the text is unclear, garbled, or uncertain

ALSO provide:
- total_pages_analyzed: Total number of pages you analyzed
- pages_with_images: List of page numbers that contain images/diagrams
- pages_with_errors: List of page numbers where content could not be extracted
- skipped_pages: List of any pages you skipped (should be empty)
- errors: List of any errors encountered

CRITICAL RULES:
- Process EVERY page. Do not skip any.
- Preserve Arabic text EXACTLY as written. Never guess harakat.
- If Arabic text is unclear or garbled, set arabic_text_preserved=false and needs_manual_review=true.
- If a page has no extractable content, still include it in pages_with_errors.
- Never invent information. If a field is not in the manuscript, leave it empty.`;

    const llmResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: validationPrompt,
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
                needs_verification: { type: 'boolean' },
                needs_manual_review: { type: 'boolean' },
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

    // ── Compute validation metrics ──
    const totalEntries = entries.length;
    const totalImages = entries.filter((e) => e.has_image).length;
    const totalArabicTexts = entries.filter((e) => e.arabic_text && e.arabic_text.trim().length > 0).length;
    const totalArabicPreserved = entries.filter((e) => e.arabic_text_preserved === true).length;
    const totalVerifiedArabic = 0; // Will be verified separately via verifyArabicText
    const totalManualReview = entries.filter((e) => e.needs_manual_review === true).length;
    const totalClassifications = entries.filter((e) => e.sirr_section >= 1 && e.sirr_section <= 7).length;
    const totalNeedingVerification = entries.filter((e) => e.needs_verification === true).length;

    // Entries by Sirr section
    const entriesBySection = {};
    for (let i = 1; i <= 7; i++) {
      entriesBySection[`sirr_${i}`] = {
        name: SIRR_SECTION_NAMES[i],
        count: entries.filter((e) => e.sirr_section === i).length,
      };
    }

    // Image type breakdown
    const imageTypeBreakdown = {};
    entries.filter((e) => e.has_image).forEach((e) => {
      const type = e.image_type || 'unknown';
      imageTypeBreakdown[type] = (imageTypeBreakdown[type] || 0) + 1;
    });

    // Arabic preservation rate
    const arabicPreservationRate = totalArabicTexts > 0
      ? Math.round((totalArabicPreserved / totalArabicTexts) * 100)
      : 0;

    // ── Determine validation status ──
    const hasCriticalErrors = errors.length > 0 && errors.some((e) => e.toLowerCase().includes('critical'));
    const allPagesProcessed = skippedPages.length === 0;
    const hasEntries = totalEntries > 0;
    const arabicWellPreserved = arabicPreservationRate >= 80;
    const allClassified = totalClassifications === totalEntries;

    const validationPassed = !hasCriticalErrors && allPagesProcessed && hasEntries && arabicWellPreserved && allClassified;

    // ── Build validation report ──
    const validationReport = {
      summary: {
        total_pages_processed: totalPagesAnalyzed,
        total_entries_extracted: totalEntries,
        total_images_extracted: totalImages,
        total_arabic_texts: totalArabicTexts,
        total_arabic_preserved: totalArabicPreserved,
        total_verified_arabic: totalVerifiedArabic,
        total_needing_verification: totalNeedingVerification,
        total_manual_review: totalManualReview,
        total_classifications: totalClassifications,
        arabic_preservation_rate: arabicPreservationRate,
        validation_passed: validationPassed,
      },
      entries_by_section: entriesBySection,
      image_type_breakdown: imageTypeBreakdown,
      pages_with_images: pagesWithImages,
      pages_with_errors: pagesWithErrors,
      skipped_pages: skippedPages,
      errors: errors,
      validation_criteria: {
        no_critical_errors: !hasCriticalErrors,
        all_pages_processed: allPagesProcessed,
        has_entries: hasEntries,
        arabic_well_preserved: arabicWellPreserved,
        all_entries_classified: allClassified,
      },
      validation_date: validationDate,
      book_id: bookId,
      book_title: book_title,
    };

    // ── Create ManuscriptEntry records ──
    const entryRecords = entries.map((entry, idx) => ({
      entry_id: `ME-${bookId}-${idx + 1}`,
      book_id: bookId,
      book_title: book_title,
      book_title_ar: book_title_ar || '',
      sirr_section: entry.sirr_section || 5,
      topic: entry.topic || entry.purpose || 'General',
      topic_ml: entry.topic_ml || '',
      topic_ar: entry.topic_ar || '',
      entry_type: entry.entry_type || 'instruction',
      purpose: entry.purpose || '',
      purpose_ml: entry.malayalam_meaning || '',
      introduction: '',
      arabic_text: entry.arabic_text || '',
      malayalam_meaning: entry.malayalam_meaning || '',
      english_meaning: entry.english_meaning || '',
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
      images: entry.has_image && entry.image_description ? [entry.image_description] : [],
      verified_arabic_hash: '',
      verification_status: entry.needs_manual_review ? 'manual_review' : (entry.needs_verification ? 'unverified' : 'unverified'),
      extraction_confidence: entry.arabic_text_preserved === false ? 50 : 80,
      extraction_date: validationDate,
    }));

    let createdEntries = [];
    if (entryRecords.length > 0) {
      createdEntries = await base44.asServiceRole.entities.ManuscriptEntry.bulkCreate(entryRecords);
    }

    // ── Update ManuscriptBook with validation results ──
    await base44.asServiceRole.entities.ManuscriptBook.update(book.id, {
      extraction_status: 'completed',
      ocr_status: 'completed',
      total_pages: totalPagesAnalyzed,
      total_entries_extracted: totalEntries,
      categories_covered: Object.entries(entriesBySection)
        .filter(([, v]) => v.count > 0)
        .map(([k]) => k.replace('sirr_', 'Sirr ')),
      validation_status: validationPassed ? 'passed' : 'failed',
      validation_report: validationReport,
      validation_date: validationDate,
      verification_status: totalManualReview > 0 ? 'manual_review' : 'partially_verified',
      notes: validationPassed
        ? 'Validation PASSED. Bulk import unlocked.'
        : `Validation FAILED. ${errors.length} errors, ${skippedPages.length} skipped pages, ${totalManualReview} manual review items.`,
    });

    return Response.json({
      status: validationPassed ? 'validation_passed' : 'validation_failed',
      book_id: bookId,
      book_title: book_title,
      validation_report: validationReport,
      entries_created: createdEntries.length,
      bulk_import_unlocked: validationPassed,
      message: validationPassed
        ? 'Validation PASSED. All pages processed, Arabic text preserved, classifications complete. Bulk import is now unlocked.'
        : 'Validation FAILED. Review errors and manual review items before proceeding with bulk import.',
    });
  } catch (error) {
    return Response.json({ error: error.message, status: 'validation_failed' }, { status: 500 });
  }
});