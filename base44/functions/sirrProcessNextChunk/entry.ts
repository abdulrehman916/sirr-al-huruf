import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// ═══════════════════════════════════════════════════════════════
// SIRR BACKGROUND PROCESSOR — sirrProcessNextChunk
//
// PERMANENT MULTI-PART ENGINE.
//
// • Reads the book's pdf_parts array from the database — the SOLE
//   source of truth for what to process. Never depends on chat
//   history or conversation state.
// • Processes parts SEQUENTIALLY in order (Part 1 → Part 2 → ... → Part N),
//   advancing current_part_index as each part completes.
// • Within each part, processes CHUNK_SIZE pages at a time, advancing
//   last_processed_page (within the current part).
// • order_offset = cumulative page count of all previous parts, so
//   entry_order stays globally monotonic across the whole book.
// • combined_total_pages = sum of every part's page_count (the true total).
// • When current_part_index >= pdf_parts.length, extraction_status
//   becomes 'completed'.
// • Auto-resumes via scheduled automation. Never requires manual restart.
// • Legacy fallback: books with no pdf_parts (old single-PDF books) use
//   original_file_url with the original logic.
// ═══════════════════════════════════════════════════════════════

const CHUNK_SIZE = 10;
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
        const parts = Array.isArray(book.pdf_parts) ? book.pdf_parts : [];
        if (parts.length > 0) {
          // Multi-part book: work remains if current_part_index < parts.length
          const idx = book.current_part_index || 0;
          if (idx < parts.length) {
            target = book;
            break;
          }
          // All parts done but status still non-completed → finalize
          await sdk.entities.SirrManuscriptBook.update(book.id || book._id, {
            extraction_status: 'completed',
            combined_total_pages: parts.reduce((s, p) => s + (p.page_count || 0), 0),
          }).catch(() => {});
          continue;
        }
        // Legacy single-PDF book
        const tp = book.total_pages || 0;
        const lp = book.last_processed_page || 0;
        if (tp === 0 || lp < tp) {
          target = book;
          break;
        }
      }

      if (!target) break; // no pending work

      const bookRecordId = target.id || target._id;
      lastBookId = target.sirr_book_id;
      const parts = Array.isArray(target.pdf_parts) ? target.pdf_parts : [];

      if (parts.length > 0) {
        // ── MULTI-PART PATH ──
        let partIdx = target.current_part_index || 0;

        // Safety: if partIdx is out of range, finalize the book.
        if (partIdx >= parts.length) {
          await sdk.entities.SirrManuscriptBook.update(bookRecordId, {
            extraction_status: 'completed',
            combined_total_pages: parts.reduce((s, p) => s + (p.page_count || 0), 0),
          }).catch(() => {});
          continue;
        }

        const part = parts[partIdx];
        const partPageCount = part.page_count || 0;
        const lp = target.last_processed_page || 0;

        // If the current part is fully processed, advance to the next part.
        if (partPageCount > 0 && lp >= partPageCount) {
          const markedParts = parts.map((p, i) =>
            i === partIdx ? { ...p, processed: true, page_end: p.page_count } : p
          );
          await sdk.entities.SirrManuscriptBook.update(bookRecordId, {
            pdf_parts: markedParts,
            current_part_index: partIdx + 1,
            last_processed_page: 0,
            extraction_status: 'processing',
          }).catch(() => {});
          continue; // loop again to pick the next part
        }

        // Compute order_offset = cumulative page count of all previous parts
        // (keeps entry_order globally monotonic across the whole book).
        const orderOffset = parts.slice(0, partIdx).reduce((s, p) => s + (p.page_count || 0), 0);

        let page_start = lp + 1;
        let page_end = page_start + CHUNK_SIZE - 1;
        if (partPageCount > 0 && page_end > partPageCount) {
          page_end = partPageCount;
        }

        await sdk.entities.SirrManuscriptBook.update(bookRecordId, {
          extraction_status: 'processing',
        }).catch(() => {});

        // Process the chunk with retry on transient errors.
        let result = null;
        let success = false;
        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
          try {
            const res = await sdk.functions.invoke('ingestSirrManuscript', {
              existing_book_id: target.sirr_book_id,
              pdf_file_url: part.file_url,
              original_file_name: part.file_name,
              page_start,
              page_end,
              order_offset: orderOffset,
            });
            result = res?.data || res;
            if (result?.error) throw new Error(result.error);
            success = true;
            break;
          } catch (e) {
            if (attempt >= MAX_ATTEMPTS - 1) {
              await sdk.entities.SirrManuscriptBook.update(bookRecordId, {
                extraction_status: 'partial',
                extraction_error: String(e?.message || e).slice(0, 500),
              }).catch(() => {});
              return Response.json({
                status: 'error',
                book_id: target.sirr_book_id,
                part_index: partIdx,
                error: String(e?.message || e),
                chunks_processed: chunksProcessed,
              });
            }
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
          }
        }

        if (success) {
          const newEntries = Number(result?.total_entries) || 0;
          if (newEntries === 0) {
            await sdk.entities.SirrManuscriptBook.update(bookRecordId, {
              extraction_status: 'failed',
              extraction_error: `Zero content extracted from Part ${partIdx + 1}, pages ${page_start}-${page_end}. Processing stopped — manual review required.`,
            }).catch(() => {});
            return Response.json({
              status: 'error',
              book_id: target.sirr_book_id,
              part_index: partIdx,
              page_range: `${page_start}-${page_end}`,
              error: 'Zero content extracted — possible OCR or PDF failure',
              chunks_processed: chunksProcessed,
            });
          }
          chunksProcessed++;
          const returnedTotalPages = Number(result?.total_pages) || 0;
          const allEntriesCount = Number(result?.total_entries_all) ?? (target.total_entries || 0);

          // Update the current part's metadata.
          const updatedParts = parts.map((p, i) =>
            i === partIdx
              ? {
                  ...p,
                  page_count: returnedTotalPages || p.page_count,
                  page_end: page_end,
                  processed: returnedTotalPages > 0 && page_end >= returnedTotalPages,
                }
              : p
          );

          // Determine if the whole book is now complete.
          const isLastPart = partIdx === parts.length - 1;
          const partDone = returnedTotalPages > 0 && page_end >= returnedTotalPages;
          const bookComplete = isLastPart && partDone;
          const combined = updatedParts.reduce((s, p) => s + (p.page_count || 0), 0);

          const bookUpdate = {
            pdf_parts: updatedParts,
            last_processed_page: page_end,
            total_pages: returnedTotalPages || (target.total_pages || 0),
            total_entries: allEntriesCount,
            combined_total_pages: combined,
            extraction_status: bookComplete ? 'completed' : 'processing',
          };
          await sdk.entities.SirrManuscriptBook.update(bookRecordId, bookUpdate).catch(() => {});
        }

        if (Date.now() - started > TIME_BUDGET_MS - 20000) break;
      } else {
        // ── LEGACY SINGLE-PDF PATH (unchanged) ──
        const page_start = (target.last_processed_page || 0) + 1;
        let page_end = page_start + CHUNK_SIZE - 1;
        if (target.total_pages > 0 && page_end > target.total_pages) {
          page_end = target.total_pages;
        }

        await sdk.entities.SirrManuscriptBook.update(bookRecordId, {
          extraction_status: 'processing',
        }).catch(() => {});

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

        if (success) {
          const newEntries = Number(result?.total_entries) || 0;
          if (newEntries === 0) {
            await sdk.entities.SirrManuscriptBook.update(bookRecordId, {
              extraction_status: 'failed',
              extraction_error: `Zero content extracted from pages ${page_start}-${page_end}. Processing stopped — manual review required.`,
            }).catch(() => {});
            return Response.json({
              status: 'error',
              book_id: target.sirr_book_id,
              page_range: `${page_start}-${page_end}`,
              error: 'Zero content extracted — possible OCR or PDF failure',
              chunks_processed: chunksProcessed,
            });
          }
          chunksProcessed++;
        }
        if (Date.now() - started > TIME_BUDGET_MS - 20000) break;
      }
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