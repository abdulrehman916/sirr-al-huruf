import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// ═══════════════════════════════════════════════════════════════
// SIRR BACKGROUND PROCESSOR — sirrProcessNextChunk
//
// Permanent background engine for the SIRR Dua Library.
//
// • Picks the oldest SIRR book with extraction_status in
//   ['pending','processing','partial'] that still has unprocessed
//   pages (last_processed_page < total_pages, or total_pages=0).
// • Processes pages in small chunks (CHUNK_SIZE pages) via
//   ingestSirrManuscript, advancing last_processed_page each chunk.
// • Loops within a TIME_BUDGET so one invocation makes real
//   progress across multiple chunks without blocking.
// • Auto-resumes: a scheduled automation calls this function every
//   few minutes as a safety net. The upload button also triggers it
//   immediately after creating a book record.
// • Never requires manual restart. Never skips a page.
// • Processes one book at a time (sequential) to protect the
//   platform database. Multiple uploaded PDFs queue automatically.
// ═══════════════════════════════════════════════════════════════

const CHUNK_SIZE = 3;
const TIME_BUDGET_MS = 85000;
const RETRY_DELAY_MS = 6000;
const MAX_ATTEMPTS = 2;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow admin-triggered calls AND internal/scheduled calls (no user).
    const user = await base44.auth.me().catch(() => null);
    if (user && user.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const sdk = base44.asServiceRole;
    const started = Date.now();
    let chunksProcessed = 0;
    let lastBookId = '';

    while (Date.now() - started < TIME_BUDGET_MS) {
      // Find the oldest book with work remaining.
      const books = await sdk.entities.SirrManuscriptBook.filter(
        { extraction_status: { $in: ['pending', 'processing', 'partial'] } },
        'upload_date',
        50
      ).catch(() => []);

      let target = null;
      for (const book of books) {
        const tp = book.total_pages || 0;
        const lp = book.last_processed_page || 0;
        // total_pages=0 => brand new book, start from page 1
        if (tp === 0 || lp < tp) {
          target = book;
          break;
        }
      }

      if (!target) break; // no pending work

      const bookRecordId = target.id || target._id;
      lastBookId = target.sirr_book_id;

      const page_start = (target.last_processed_page || 0) + 1;
      let page_end = page_start + CHUNK_SIZE - 1;
      if (target.total_pages > 0 && page_end > target.total_pages) {
        page_end = target.total_pages;
      }

      // Mark as processing.
      await sdk.entities.SirrManuscriptBook.update(bookRecordId, {
        extraction_status: 'processing',
      }).catch(() => {});

      // Process the chunk with retry on transient database errors.
      let result = null;
      let success = false;
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        try {
          const res = await sdk.functions.invoke('ingestSirrManuscript', {
            existing_book_id: target.sirr_book_id,
            pdf_file_url: target.original_file_url,
            original_file_name: target.original_file_name,
            page_start,
            page_end,
          });
          result = res?.data || res;
          if (result?.error) throw new Error(result.error);
          success = true;
          break;
        } catch (e) {
          if (attempt >= MAX_ATTEMPTS - 1) {
            // Mark partial — scheduled automation will resume later.
            await sdk.entities.SirrManuscriptBook.update(bookRecordId, {
              extraction_status: 'partial',
              extraction_error: String(e?.message || e).slice(0, 500),
            }).catch(() => {});
            return Response.json({
              status: 'error',
              book_id: target.sirr_book_id,
              error: String(e?.message || e),
              chunks_processed: chunksProcessed,
            });
          }
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        }
      }

      if (success) chunksProcessed++;

      // If we are close to the time budget, stop to avoid exceeding it.
      if (Date.now() - started > TIME_BUDGET_MS - 20000) break;
    }

    return Response.json({
      status: chunksProcessed > 0 ? 'processed' : 'idle',
      chunks_processed: chunksProcessed,
      last_book_id: lastBookId,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});