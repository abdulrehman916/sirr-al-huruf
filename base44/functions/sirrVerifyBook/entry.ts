import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// ═══════════════════════════════════════════════════════════════
// SIRR BOOK VERIFICATION REPORT — sirrVerifyBook
//
// Read-only. Produces the full post-processing verification report
// required after ALL PDF parts of a book have been uploaded and
// processed. Never mutates data.
//
// Report fields:
//   total_pdf_parts           — count of pdf_parts
//   total_pages               — sum of every part's page_count (true total)
//   missing_pages             — parts not fully processed (must be 0)
//   ocr_issues                — entries flagged needs_review / confidence < 100 (must be 0)
//   missing_malayalam_meanings— entries that HAVE explanatory text but an empty malayalam_meaning (must be 0)
//   duplicate_entries         — duplicate sirr_entry_id OR identical arabic_text (must be 0)
//   order_gaps                — breaks in entry_order sequence (must be 0)
//   arabic_verification_status— verified | needs_review | no_entries
//   database_verification_status — verified | incomplete
//   final_result              — VERIFIED only if everything passes
// ═══════════════════════════════════════════════════════════════
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (user && user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });
    const sdk = base44.asServiceRole;

    const body = await req.json().catch(() => ({}));
    const sirr_book_id = body.sirr_book_id;
    if (!sirr_book_id) return Response.json({ error: 'sirr_book_id is required' }, { status: 400 });

    // ── Load the book ──
    const books = await sdk.entities.SirrManuscriptBook.filter({ sirr_book_id }, undefined, 1);
    const book = books[0];
    if (!book) return Response.json({ error: 'Book not found: ' + sirr_book_id }, { status: 404 });

    // ── Load every entry for this book (in order) ──
    const entries = await sdk.entities.SirrManuscriptEntry.filter({ sirr_book_id }, 'entry_order', 5000);

    const pdf_parts = Array.isArray(book.pdf_parts) ? book.pdf_parts : [];
    const total_pdf_parts = pdf_parts.length;
    const total_pages =
      pdf_parts.reduce((s, p) => s + (p.page_count || 0), 0) ||
      book.combined_total_pages ||
      book.total_pages ||
      0;

    // ── Missing pages: any part not fully processed ──
    const missing_pages = pdf_parts.filter(
      (p) => !p.processed || (p.page_count > 0 && (p.page_end || 0) < p.page_count)
    ).length;

    // ── OCR issues: needs_review or confidence < 100 ──
    const ocr_issues = entries.filter(
      (e) => e.needs_review || (typeof e.ocr_confidence === 'number' && e.ocr_confidence < 100)
    ).length;

    // ── Missing Malayalam meanings:
    //    Only counts entries that HAVE explanatory text (in the structured
    //    notes) but an EMPTY malayalam_meaning. Entries with no explanation
    //    at all are legitimately empty — they are NOT counted as missing. ──
    const explanatoryFields = [
      'introduction', 'purpose', 'benefits', 'etiquette', 'conditions',
      'preparation', 'materials', 'warnings', 'repetition', 'timing', 'day', 'notes',
    ];
    const missing_malayalam_meanings = entries.filter((e) => {
      const ml = (e.malayalam_meaning || '').trim();
      if (ml) return false;
      let notesObj = {};
      try { notesObj = JSON.parse(e.notes || '{}'); } catch (_) {}
      return explanatoryFields.some((k) => (notesObj[k] || '').trim());
    }).length;

    // ── Duplicate entries: duplicate sirr_entry_id OR identical arabic_text ──
    const idCounts = {};
    const textCounts = {};
    for (const e of entries) {
      const id = e.sirr_entry_id || e._id || '';
      if (id) idCounts[id] = (idCounts[id] || 0) + 1;
      const t = (e.arabic_text || '').trim();
      if (t) textCounts[t] = (textCounts[t] || 0) + 1;
    }
    const duplicate_entries =
      Object.values(idCounts).filter((c) => c > 1).length +
      Object.values(textCounts).filter((c) => c > 1).length;

    // ── Order gaps: breaks in the entry_order sequence ──
    const orders = entries.map((e) => Number(e.entry_order) || 0).sort((a, b) => a - b);
    let order_gaps = 0;
    for (let i = 1; i < orders.length; i++) {
      if (orders[i] !== orders[i - 1] + 1) order_gaps++;
    }

    // ── Arabic verification status ──
    const arabic_verified = entries.filter((e) => !e.needs_review).length;
    const arabic_verification_status =
      entries.length === 0 ? 'no_entries' : (arabic_verified === entries.length ? 'verified' : 'needs_review');

    // ── Database verification status ──
    const database_verification_status =
      book.extraction_status === 'completed' && entries.length > 0 && missing_pages === 0
        ? 'verified'
        : 'incomplete';

    // ── Final verdict + exact failure reasons ──
    const all_pass =
      missing_pages === 0 &&
      ocr_issues === 0 &&
      duplicate_entries === 0 &&
      missing_malayalam_meanings === 0 &&
      order_gaps === 0 &&
      book.extraction_status === 'completed' &&
      entries.length > 0;

    const failure_reasons = [];
    if (book.extraction_status !== 'completed')
      failure_reasons.push(`extraction_status is '${book.extraction_status}' (not completed)`);
    if (entries.length === 0)
      failure_reasons.push('no entries extracted');
    if (total_pdf_parts === 0)
      failure_reasons.push('no pdf_parts stored in the book record (multi-part storage missing)');
    if (missing_pages > 0)
      failure_reasons.push(`${missing_pages} PDF part(s) not fully processed`);
    if (ocr_issues > 0)
      failure_reasons.push(`${ocr_issues} entry(ies) with OCR confidence < 100 (flagged for review)`);
    if (duplicate_entries > 0)
      failure_reasons.push(`${duplicate_entries} duplicate entry group(s) detected`);
    if (missing_malayalam_meanings > 0)
      failure_reasons.push(`${missing_malayalam_meanings} entry(ies) with explanatory text but missing Malayalam meaning`);
    if (order_gaps > 0)
      failure_reasons.push(`${order_gaps} gap(s) in entry_order sequence`);

    let final_result;
    if (all_pass) final_result = 'VERIFIED';
    else if (book.extraction_status === 'completed') final_result = 'FAILED';
    else final_result = 'PENDING';

    return Response.json({
      sirr_book_id,
      book_title: book.book_title,
      extraction_status: book.extraction_status,
      total_pdf_parts,
      total_pages,
      total_entries: entries.length,
      missing_pages,
      ocr_issues,
      missing_malayalam_meanings,
      duplicate_entries,
      order_gaps,
      arabic_verification_status,
      database_verification_status,
      final_result,
      failure_reasons,
      verification_passed: all_pass,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});