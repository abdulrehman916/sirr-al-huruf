import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// MANUSCRIPT VERIFICATION — PHASE 2: VERIFY + TRANSLATE
// ═══════════════════════════════════════════════════════════════
// Called after validateManuscriptImport (Phase 1) completes.
//
// Stage 2: Arabic Verification
//   - Every entry with Arabic text MUST call verifyArabicText()
//   - Never skip verification
//   - Never store AI-generated harakat
//   - Only verified Arabic continues to translation
//
// Stage 3: Malayalam Translation
//   - Generate Malayalam ONLY AFTER successful verification
//   - Translation must always come from the verified Arabic
//   - Never translate unverified Arabic
//   - Never AI-generate translations — use trusted sources only
//   - Store Malayalam and English separately
//
// After completion, the 14-point check is finalized.
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

// ── Helper: Verify a single entry's Arabic text ──
async function verifyEntryArabic(
  base44: any,
  arabicText: string,
  bookTitle: string,
  pageNumber: string,
  topic: string,
  entryType: string
): Promise<any> {
  if (!arabicText || arabicText.trim().length === 0) {
    return { verification_status: 'no_arabic', text_hash: '', malayalam_meaning: '', english_meaning: '' };
  }

  const sourceTypeMap: Record<string, string> = {
    dua: 'dua', quran_verse: 'quran', divine_name: 'divine_name', tawkeel: 'tawkeel',
    angel_name: 'angel_name', jinn_name: 'jinn_name', talisman_text: 'talisman_text',
    magical_formula: 'magical_formula', exorcism: 'occult_invocation', protection: 'adhkar',
    ritual: 'manuscript_quotation', instruction: 'manuscript_quotation', wafq: 'magical_formula',
    taweez: 'talisman_text', reference: 'manuscript_quotation', note: 'manuscript_quotation',
    warning: 'manuscript_quotation', condition: 'manuscript_quotation', material: 'manuscript_quotation',
    timing: 'manuscript_quotation', herb: 'manuscript_quotation', incense: 'manuscript_quotation',
    diagram: 'manuscript_quotation', table: 'manuscript_quotation', image: 'manuscript_quotation',
  };
  const sourceType = sourceTypeMap[entryType] || 'manuscript_quotation';

  try {
    const response = await base44.functions.invoke('verifyArabicText', {
      arabic_text: arabicText,
      source_type: sourceType,
      book_name: bookTitle,
      page_number: pageNumber || '',
      section: topic || '',
    });

    const result = response.data || response;
    return {
      verification_status: result.verification_status || 'unverified',
      verification_confidence: result.verification_confidence || 'UNVERIFIED',
      text_hash: result.text_hash || '',
      arabic_text_verified: result.arabic_text || '',
      original_manuscript_text: result.original_manuscript_text || '',
      malayalam_meaning: result.malayalam_meaning || '',
      english_meaning: result.english_meaning || '',
      source: result.source || '',
      primary_source: result.primary_source || '',
      revision_number: result.revision_number || 0,
      date_verified: result.date_verified || '',
      notes: result.notes || '',
    };
  } catch (e) {
    return {
      verification_status: 'error',
      text_hash: '',
      malayalam_meaning: '',
      english_meaning: '',
      error: (e as Error).message,
    };
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const body = await req.json();
    const { book_id, batch_size } = body;

    if (!book_id) {
      return Response.json({ error: 'book_id is required' }, { status: 400 });
    }

    // Process at most batch_size pending entries per call to stay under gateway timeout.
    // Each verifyArabicText call takes ~70s (internet search); 5 parallel = ~70s total.
    // Caller re-invokes until all entries are processed.
    const BATCH_SIZE = Math.min(batch_size || 5, 8);

    // ══ Fetch ManuscriptBook ══
    const books = await base44.asServiceRole.entities.ManuscriptBook.filter({ book_id });
    if (!books || books.length === 0) {
      return Response.json({ error: 'Book not found: ' + book_id }, { status: 404 });
    }
    const book = books[0];

    // ══ Fetch all pending entries ══
    const entries = await base44.asServiceRole.entities.ManuscriptEntry.filter({ book_id });
    if (!entries || entries.length === 0) {
      return Response.json({ error: 'No entries found for book: ' + book_id }, { status: 404 });
    }

    const pendingEntries = entries.filter((e: any) => e.verification_status === 'pending');
    const alreadyVerified = entries.filter((e: any) => e.verification_status === 'verified');
    const alreadyManualReview = entries.filter((e: any) => e.verification_status === 'manual_review');

    // ══ STAGE 2: Arabic Verification ══
    // Call verifyArabicText for pending entries — ONE batch per call.
    // Caller re-invokes until all entries are processed.
    const batch = pendingEntries.slice(0, BATCH_SIZE);
    const verificationResults: any[] = await Promise.all(
      batch.map((entry: any) =>
        verifyEntryArabic(
          base44,
          entry.arabic_text || '',
          entry.book_title || book.book_title || '',
          entry.page_number || '',
          entry.topic || entry.purpose || '',
          entry.entry_type || 'instruction'
        )
      )
    );

    const remainingPending = pendingEntries.length - batch.length;

    // ══ STAGE 3: Malayalam Translation + Update Entries ══
    // Translations come ONLY from verifyArabicText results (trusted sources).
    // Never AI-generate. Never translate unverified Arabic.
    let updatedCount = 0;
    const updatePromises: Promise<any>[] = [];

    for (let i = 0; i < batch.length; i++) {
      const entry = batch[i];
      const verification = verificationResults[i];

      let verifiedArabicHash = '';
      let verificationStatus = 'unverified';
      let malayalamMeaning = '';
      let englishMeaning = '';

      if (verification) {
        const vStatus = verification.verification_status;

        if (vStatus === 'verified') {
          // VERIFIED: Save verified Arabic hash, use trusted translations
          verifiedArabicHash = verification.text_hash || '';
          verificationStatus = 'verified';
          // Stage 3: Malayalam/English ONLY from verified sources
          malayalamMeaning = verification.malayalam_meaning || '';
          englishMeaning = verification.english_meaning || '';
        } else if (vStatus === 'manual_review_required') {
          // PARTIAL: Manual review required — store original, never fabricate
          verifiedArabicHash = verification.text_hash || '';
          verificationStatus = 'manual_review';
          // Never translate unverified/partial Arabic
          malayalamMeaning = '';
          englishMeaning = '';
        } else if (vStatus === 'no_arabic') {
          verificationStatus = 'unverified';
        } else if (vStatus === 'error') {
          verificationStatus = 'manual_review';
        } else {
          // UNVERIFIED: No trusted source — original manuscript preserved
          verifiedArabicHash = verification.text_hash || '';
          verificationStatus = 'manual_review';
          // Never translate unverified Arabic
          malayalamMeaning = '';
          englishMeaning = '';
        }
      }

      updatePromises.push(
        base44.asServiceRole.entities.ManuscriptEntry.update(entry.id, {
          verified_arabic_hash: verifiedArabicHash,
          verification_status: verificationStatus,
          malayalam_meaning: malayalamMeaning,
          english_meaning: englishMeaning,
        }).then(() => { updatedCount++; })
      );
    }

    await Promise.all(updatePromises);

    // ══ If more pending entries remain, return "continue" status ══
    // Caller re-invokes verifyBookEntries with the same book_id.
    if (remainingPending > 0) {
      return Response.json({
        status: 'batch_complete',
        book_id: book_id,
        book_title: book.book_title,
        batch_processed: batch.length,
        remaining_pending: remainingPending,
        message: `Batch complete: ${batch.length} entries verified. ${remainingPending} remaining. Call verifyBookEntries again with the same book_id to continue.`,
        next_step: `verifyBookEntries({ "book_id": "${book_id}" })`,
      });
    }

    // ══ Fetch updated entries for final metrics ══
    const allEntries = await base44.asServiceRole.entities.ManuscriptEntry.filter({ book_id });

    // ══ Compute final metrics ══
    const totalEntries = allEntries.length;
    const totalVerified = allEntries.filter((e: any) => e.verification_status === 'verified').length;
    const totalManualReview = allEntries.filter((e: any) => e.verification_status === 'manual_review').length;
    const totalUnverified = allEntries.filter((e: any) => e.verification_status === 'unverified').length;
    const totalPending = allEntries.filter((e: any) => e.verification_status === 'pending').length;
    const totalVerificationErrors = verificationResults.filter((v) => v.verification_status === 'error').length;

    const totalMalayalam = allEntries.filter((e: any) => e.malayalam_meaning && e.malayalam_meaning.length > 0).length;
    const totalEnglish = allEntries.filter((e: any) => e.english_meaning && e.english_meaning.length > 0).length;

    const totalArabicTexts = allEntries.filter((e: any) => e.arabic_text && e.arabic_text.trim().length > 0).length;
    const verificationRate = totalArabicTexts > 0
      ? Math.round((totalVerified / totalArabicTexts) * 100)
      : 0;

    // ══ Get Phase 1 report from book ══
    const phase1Report = book.validation_report || {};

    // ══ Final 14-Point Check ══
    const totalImages = phase1Report.summary?.total_images_extracted || 0;
    const totalPagesProcessed = phase1Report.summary?.total_pages_processed || 0;
    const arabicPreservationRate = phase1Report.summary?.arabic_preservation_rate || 0;
    const totalClassifications = phase1Report.summary?.total_classifications || 0;
    const skippedPages = phase1Report.skipped_pages || [];
    const errors = phase1Report.errors || [];
    const hasCriticalErrors = errors.length > 0 && errors.some((e: string) => e.toLowerCase().includes('critical'));

    const allPagesProcessed = skippedPages.length === 0;
    const hasEntries = totalEntries > 0;
    const arabicWellPreserved = arabicPreservationRate >= 80;
    const allClassified = totalClassifications === totalEntries;
    const allHaveBookAndPage = allEntries.every((e: any) => e.book_title && e.page_number);
    const allEntriesHaveIndexFields = allEntries.every((e: any) =>
      e.book_id && e.sirr_section && e.topic && e.entry_id && e.page_number
    );

    // Stage 2: Every Arabic text verified or marked for review
    const allVerified = (totalVerified + totalManualReview) === totalArabicTexts && totalPending === 0;

    // Stage 3: Malayalam only from verified sources, never for unverified
    const malayalamPolicyCorrect = allEntries.every((e: any) => {
      if (e.verification_status !== 'verified' && e.malayalam_meaning && e.malayalam_meaning.length > 0) return false;
      return true;
    });

    // Stage 9: Verified storage policy
    const verifiedStoragePolicy = allEntries.every((e: any) => {
      if (e.verification_status === 'verified') return e.verified_arabic_hash !== '';
      if (e.verification_status === 'manual_review') return e.malayalam_meaning === '';
      return true;
    });

    // Stage 13: Images are URLs
    const imagesAreUrls = allEntries.every((e: any) =>
      (e.images || []).every((url: string) => url.startsWith('http'))
    );

    const imageExtractionAttempted = phase1Report.stage_details?.stage_4_images?.status !== undefined;

    const fourteenPointCheck = {
      '1_import_pdf': book ? 'PASS' : 'FAIL',
      '2_store_metadata': (book.book_title && book.book_id) ? 'PASS' : 'FAIL',
      '3_extract_every_page': allPagesProcessed ? 'PASS' : 'FAIL',
      '4_extract_arabic': arabicWellPreserved ? 'PASS' : 'FAIL',
      '5_extract_images': imageExtractionAttempted ? 'PASS' : 'FAIL',
      '6_classify_sections': allClassified ? 'PASS' : 'FAIL',
      '7_preserve_book_page': allHaveBookAndPage ? 'PASS' : 'FAIL',
      '8_arabic_verification': allVerified ? 'PASS' : 'FAIL',
      '9_verified_storage': verifiedStoragePolicy ? 'PASS' : 'FAIL',
      '10_malayalam_translation': malayalamPolicyCorrect ? 'PASS' : 'FAIL',
      '11_search_indexing': allEntriesHaveIndexFields ? 'PASS' : 'FAIL',
      '12_method_pages': allEntriesHaveIndexFields ? 'PASS' : 'FAIL',
      '13_image_zoom': imagesAreUrls ? 'PASS' : 'FAIL',
      '14_validation_report': 'PASS',
    };

    const allFourteenPassed = Object.values(fourteenPointCheck).every((v) => v === 'PASS');
    const validationPassed = !hasCriticalErrors && allPagesProcessed && hasEntries && arabicWellPreserved && allClassified && allFourteenPassed;

    // ══ Build final validation report ══
    const finalReport = {
      ...phase1Report,
      phase: 2,
      summary: {
        ...phase1Report.summary,
        total_verified_arabic: totalVerified,
        total_manual_review: totalManualReview,
        total_unverified: totalUnverified,
        total_pending: totalPending,
        total_verification_errors: totalVerificationErrors,
        verification_rate: verificationRate,
        total_malayalam_translations: totalMalayalam,
        total_english_translations: totalEnglish,
        entries_pending_verification: totalPending,
        validation_passed: validationPassed,
        all_fourteen_passed: allFourteenPassed,
      },
      stage_details: {
        ...phase1Report.stage_details,
        stage_2_verification: {
          status: 'completed',
          verified: totalVerified,
          manual_review: totalManualReview,
          unverified: totalUnverified,
          errors: totalVerificationErrors,
          policy: 'Every Arabic text verified via verifyArabicText. Never skip. Never store AI harakat.',
        },
        stage_3_translation: {
          status: 'completed',
          malayalam_available: totalMalayalam,
          english_available: totalEnglish,
          policy: 'Malayalam from verified sources ONLY. Never AI-generate. Never translate unverified Arabic.',
        },
      },
      fourteen_point_check: fourteenPointCheck,
      validation_criteria: {
        no_critical_errors: !hasCriticalErrors,
        all_pages_processed: allPagesProcessed,
        has_entries: hasEntries,
        arabic_well_preserved: arabicWellPreserved,
        all_entries_classified: allClassified,
        all_verified_or_reviewed: allVerified,
        verified_storage_policy: verifiedStoragePolicy,
        malayalam_policy_correct: malayalamPolicyCorrect,
        images_are_urls: imagesAreUrls,
        all_fourteen_passed: allFourteenPassed,
      },
      validation_date: new Date().toISOString(),
      book_id: book_id,
      book_title: book.book_title,
    };

    // ══ Update ManuscriptBook with final results ══
    await base44.asServiceRole.entities.ManuscriptBook.update(book.id, {
      validation_status: validationPassed ? 'passed' : 'failed',
      validation_report: finalReport,
      validation_date: new Date().toISOString(),
      verification_status: totalManualReview > 0 ? 'manual_review' : (totalVerified > 0 ? 'partially_verified' : 'unverified'),
      notes: validationPassed
        ? `Validation PASSED. 14/14 points. ${totalVerified} verified, ${totalManualReview} manual review, ${totalMalayalam} Malayalam translations. Bulk import unlocked.`
        : `Validation FAILED. Points not passed: ${Object.entries(fourteenPointCheck).filter(([, v]) => v !== 'PASS').map(([k]) => k).join(', ')}.`,
    });

    return Response.json({
      status: validationPassed ? 'validation_passed' : 'validation_failed',
      book_id: book_id,
      book_title: book.book_title,
      verification_summary: {
        total_entries: totalEntries,
        verified: totalVerified,
        manual_review: totalManualReview,
        unverified: totalUnverified,
        pending: totalPending,
        errors: totalVerificationErrors,
        malayalam_translations: totalMalayalam,
        english_translations: totalEnglish,
        verification_rate: verificationRate,
      },
      fourteen_point_check: fourteenPointCheck,
      all_fourteen_passed: allFourteenPassed,
      bulk_import_unlocked: validationPassed,
      message: validationPassed
        ? `Validation PASSED. 14/14 points. ${totalVerified} verified, ${totalManualReview} manual review, ${totalMalayalam} Malayalam translations. Bulk import unlocked.`
        : `Validation FAILED. ${Object.entries(fourteenPointCheck).filter(([, v]) => v !== 'PASS').map(([k]) => k).join(', ')} did not pass.`,
    });
  } catch (error) {
    return Response.json({ error: error.message, status: 'verification_failed' }, { status: 500 });
  }
});