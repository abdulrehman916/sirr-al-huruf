import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { getDocument, GlobalWorkerOptions } from 'npm:pdfjs-dist@4.10.38/legacy/build/pdf.mjs';
try {
  if (!GlobalWorkerOptions.workerSrc) {
    GlobalWorkerOptions.workerSrc = import.meta.resolve('npm:pdfjs-dist@4.10.38/legacy/build/pdf.worker.mjs');
  }
} catch (_) {}

// ═══════════════════════════════════════════════════════════════
// MASTER PDF LIBRARY — BACKGROUND PROCESSING PIPELINE
//
// The permanent knowledge engine of Sirr al-Huruf. Mirrors the proven
// sirrProcessNextChunk multi-part architecture, adapted to the
// Owner-only MasterPdfBook / MasterPdfPage entities.
//
// PIPELINE (per chunk of pages):
//   1. File verification     (pdf_parts[].file_url is the source of truth)
//   2. OCR / vision          (InvokeLLM reads the PDF — NO binary download)
//   3. Arabic OCR            (verbatim, every harakah preserved)
//   4. Harakat verification  (flagged; owner approves — never auto-trusted)
//   5. Unicode normalization (harakat-stripped content_hash + search_text)
//   6. Page indexing          (ONE MasterPdfPage per page)
//   7. AI classification      (holy_names, dua, khawass, wafq, ...)
//   8. Duplicate detection    (content_hash — every source kept independently)
//   9. Confidence scoring      (ocr_confidence 0-100)
//  10. Pending review          (review_status='pending_review' — NEVER auto)
//
// QUALITY CONTROL (Law §6): pages are staged with needs_owner_review when
//   ocr_confidence < 100 or any quality_flag is set. Nothing is ever auto-
//   approved. Owner approval is a separate, future step (Law §12).
//
// APPEND-ONLY (Law §13): ocr_text is NEVER overwritten. Re-processing a page
//   that already has a MasterPdfPage record is skipped (idempotent).
//
// CONCURRENCY (Law §6/§8): processing_lock_until (2-min TTL, refreshed per
//   chunk) prevents two runs from corrupting the same book. Auto-expires on
//   crash so a book is never stranded.
//
// COMPLETION (Law §12/§15): the engine NEVER sets 'completed'. When every
//   part is processed it sets 'pending_verification'. 'completed' is set
//   ONLY by a future Owner-approval function.
//
// SECURITY: the scheduled automation runs as service-role (no user). Manual
//   admin triggers are allowed; non-admin humans are rejected. Owner-only
//   access for HUMANS is enforced by the library page + the cloud search
//   functions + entity RLS (admin-only).
// ═══════════════════════════════════════════════════════════════

const CHUNK_SIZE = 3;            // pages per LLM vision call (rich per-page schema)
const TIME_BUDGET_MS = 85000;    // total run budget
const LOCK_MS = 120000;          // per-book concurrency lock TTL
const RETRY_DELAY_MS = 6000;
const MAX_ATTEMPTS = 2;

// ── SHA-256 (Deno SubtleCrypto, async) ───────────────────────────
async function sha256(s) {
  const data = new TextEncoder().encode(s || '');
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Harakat/tatweel strip for normalized hash + search (Law §1, §3, §4).
function normalizeArabic(s) {
  return (s || '').replace(/[\u064B-\u0652\u0670\u0640]/g, '').trim();
}

function normalizeForHash(s) {
  return (s || '').toLowerCase().replace(/[\u064B-\u0652\u0670\u0640]/g, '').replace(/\s+/g, ' ').trim();
}

// ── Shared per-page vision schema (used by uploaded AND live-index paths) ──
const PAGE_SCHEMA = {
  type: 'object',
  properties: {
    total_pages: { type: 'integer' },
    book_title: { type: 'string' },
    book_title_ar: { type: 'string' },
    author: { type: 'string' },
    publisher: { type: 'string' },
    edition: { type: 'string' },
    volume: { type: 'string' },
    publication_year: { type: 'string' },
    language: { type: 'string' },
    isbn: { type: 'string' },
    pages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          page_number: { type: 'integer' },
          page_label: { type: 'string' },
          ocr_text: { type: 'string' },
          ocr_text_ar: { type: 'string' },
          ocr_text_en: { type: 'string' },
          ocr_text_ml: { type: 'string' },
          ocr_confidence: { type: 'integer' },
          quality_flags: {
            type: 'object',
            properties: {
              ocr_errors: { type: 'boolean' },
              harakat_errors: { type: 'boolean' },
              missing_arabic_letters: { type: 'boolean' },
              broken_arabic_words: { type: 'boolean' },
              duplicate_content: { type: 'boolean' },
              low_quality_scan: { type: 'boolean' },
              missing_pages: { type: 'boolean' },
              printing_errors: { type: 'boolean' },
              incomplete_ocr: { type: 'boolean' },
            },
          },
          classification: {
            type: 'object',
            properties: {
              holy_names: { type: 'array', items: { type: 'string' } },
              quran_verses: { type: 'array', items: { type: 'string' } },
              hadith: { type: 'array', items: { type: 'string' } },
              dua: { type: 'array', items: { type: 'string' } },
              dhikr: { type: 'array', items: { type: 'string' } },
              wazifa: { type: 'array', items: { type: 'string' } },
              hizb: { type: 'array', items: { type: 'string' } },
              khawass: { type: 'array', items: { type: 'string' } },
              mujarrabat: { type: 'array', items: { type: 'string' } },
              riyadah: { type: 'array', items: { type: 'string' } },
              fasting_instructions: { type: 'array', items: { type: 'string' } },
              magic_squares: { type: 'array', items: { type: 'string' } },
              wafq: { type: 'array', items: { type: 'string' } },
              talismans: { type: 'array', items: { type: 'string' } },
              repetition_counts: { type: 'array', items: { type: 'string' } },
              timings: { type: 'array', items: { type: 'string' } },
              benefits: { type: 'array', items: { type: 'string' } },
              conditions: { type: 'array', items: { type: 'string' } },
              warnings: { type: 'array', items: { type: 'string' } },
              scholars: { type: 'array', items: { type: 'string' } },
              authors: { type: 'array', items: { type: 'string' } },
              references: { type: 'array', items: { type: 'string' } },
            },
          },
          images: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                image_type: { type: 'string' },
                caption: { type: 'string' },
              },
            },
          },
        },
        required: ['page_number', 'ocr_text', 'ocr_confidence'],
      },
    },
  },
  required: ['pages'],
};

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
    let lockedBookId = '';

    // ── ANTI-RACE MERGE HELPER ──────────────────────────────────
    // Reload the LATEST pdf_parts from the DB, patch the target part into
    // the fresh array, and return it. Preserves parts appended DURING this
    // chunk's LLM call (never overwrites newer state with a stale snapshot).
    async function reloadAndMergeParts(bookRecordId, targetPartId, partIdx, partPatch) {
      try {
        const fresh = await sdk.entities.MasterPdfBook.get(bookRecordId);
        const freshParts = Array.isArray(fresh?.pdf_parts) ? fresh.pdf_parts : null;
        if (!freshParts) return null;
        let matchIdx = -1;
        if (targetPartId) matchIdx = freshParts.findIndex((p) => (p.part_id || '') === targetPartId);
        if (matchIdx === -1 && partIdx >= 0 && partIdx < freshParts.length) matchIdx = partIdx;
        if (matchIdx === -1) return freshParts;
        return freshParts.map((p, i) => (i === matchIdx ? { ...p, ...partPatch } : p));
      } catch (_) {
        return null;
      }
    }

    async function writeAudit(bookId, partId, partNum, action, status, details, extra) {
      await sdk.entities.SirrAuditLog.create({
        audit_id: `SA-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        sirr_book_id: bookId,
        part_id: partId || '',
        part_number: partNum || 0,
        action,
        user_id: user?.id || 'system',
        user_name: user?.full_name || user?.email || 'system',
        timestamp: new Date().toISOString(),
        status,
        details,
        ...(extra || {}),
      }).catch(() => {});
    }

    while (Date.now() - started < TIME_BUDGET_MS) {
      // Find books with work remaining. Skip 'uploading' (Owner still
      // uploading), 'paused', 'pending_verification', 'completed', 'failed'.
      const books = await sdk.entities.MasterPdfBook.filter(
        { extraction_status: { $in: ['pending', 'processing', 'partial'] } },
        'upload_date',
        50
      ).catch(() => []);

      const nowMs = Date.now();
      let target = null;
      for (const book of books) {
        if (book.master_book_id !== lockedBookId) {
          const lockUntil = book.processing_lock_until ? Date.parse(book.processing_lock_until) : 0;
          if (lockUntil && lockUntil > nowMs) continue;
        }
        const parts = Array.isArray(book.pdf_parts) ? book.pdf_parts : [];
        const idx = book.current_part_index || 0;
        const isLiveIndex = parts.length === 0 && (book.google_drive_file_id || book.onedrive_file_id);
        if (parts.length === 0 && !isLiveIndex) {
          // No parts yet and no cloud link — nothing to process.
          continue;
        }
        if (isLiveIndex) {
          // Live-index cloud book (Google Drive / OneDrive): no binary stored.
          // Processed on demand by the live-index branch below.
          target = book;
          break;
        }
        if (idx < parts.length) {
          target = book;
          break;
        }
        // All parts done → await Owner verification (Law §15: never 'completed').
        await sdk.entities.MasterPdfBook.update(book.id || book._id, {
          extraction_status: 'pending_verification',
          combined_total_pages: parts.reduce((s, p) => s + (p.page_count || 0), 0),
        }).catch(() => {});
      }

      if (!target) break;

      const bookRecordId = target.id || target._id;
      await sdk.entities.MasterPdfBook.update(bookRecordId, {
        processing_lock_until: new Date(Date.now() + LOCK_MS).toISOString(),
      }).catch(() => {});
      lockedBookId = target.master_book_id;
      lastBookId = target.master_book_id;

      // ════════════════════════════════════════════════════════════
      // LIVE-INDEX BRANCH (Google Drive / OneDrive)
      // No binary is ever stored. A throwaway read URL (OneDrive) or an
      // in-memory fetch (Google Drive) is used ONLY for this chunk's vision
      // call, then discarded. pdf_parts stays empty; the library is a live
      // index. The uploaded-PDF path below is untouched.
      // ════════════════════════════════════════════════════════════
      const tParts0 = Array.isArray(target.pdf_parts) ? target.pdf_parts : [];
      const tLiveIndex = tParts0.length === 0 && (target.google_drive_file_id || target.onedrive_file_id);
      if (tLiveIndex) {
        const lp = target.last_processed_page || 0;
        const knownTotal = Number(target.combined_total_pages) || 0;
        if (knownTotal > 0 && lp >= knownTotal) {
          await sdk.entities.MasterPdfBook.update(bookRecordId, { extraction_status: 'pending_verification' }).catch(() => {});
          continue;
        }
        const page_start = lp + 1;
        let page_end = page_start + CHUNK_SIZE - 1;
        if (knownTotal > 0 && page_end > knownTotal) page_end = knownTotal;

        // Idempotency: skip chunk already indexed (append-only, Law §13)
        let liveExisting = [];
        try { liveExisting = await sdk.entities.MasterPdfPage.filter({ master_book_id: target.master_book_id, page_number: { $gte: page_start, $lte: page_end } }); } catch (_) {}
        const liveExistingSet = new Set((liveExisting || []).map((p) => Number(p.page_number)));
        if (liveExistingSet.size === (page_end - page_start + 1)) {
          await sdk.entities.MasterPdfBook.update(bookRecordId, { last_processed_page: page_end }).catch(() => {});
          continue;
        }

        // ── Throwaway read ref for this chunk only (never persisted) ──
        let fileRef = null;
        let cloudSource = '';
        try {
          if (target.google_drive_file_id) {
            cloudSource = 'googledrive';
            const conn = await sdk.connectors.getConnection('googledrive');
            if (!conn?.accessToken) throw new Error('Google Drive not connected');
            const r = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(target.google_drive_file_id)}?alt=media`, { headers: { Authorization: `Bearer ${conn.accessToken}` } });
            if (!r.ok) throw new Error(`Drive fetch ${r.status}`);
            fileRef = await r.arrayBuffer(); // in-memory PDF bytes; discarded after extraction
          } else if (target.onedrive_file_id) {
            cloudSource = 'one_drive';
            const conn = await sdk.connectors.getConnection('one_drive');
            if (!conn?.accessToken) throw new Error('OneDrive not connected');
            const metaRes = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${encodeURIComponent(target.onedrive_file_id)}?$select=@microsoft.graph.downloadUrl`, { headers: { Authorization: `Bearer ${conn.accessToken}` } });
            if (!metaRes.ok) throw new Error(`OneDrive meta ${metaRes.status}`);
            const meta = await metaRes.json();
            fileRef = meta['@microsoft.graph.downloadUrl'] || '';
            if (!fileRef) throw new Error('No OneDrive download URL');
          }
        } catch (e) {
          const errMsg = String(e?.message || e);
          await sdk.entities.MasterPdfBook.update(bookRecordId, { extraction_status: 'partial', extraction_error: `Cloud read failed (${cloudSource}): ${errMsg.slice(0,300)}` }).catch(() => {});
          await writeAudit(target.master_book_id, 'CLOUD-LIVE', 1, 'extract_failed', 'failed', `Cloud read failed: ${errMsg.slice(0,200)}`, { page_range: `${page_start}-${page_end}` });
          continue;
        }

        const livePrompt = `You are a faithful manuscript archivist for the Sirr al-Huruf Master PDF Library. You are given a PDF.

ABSOLUTE RULES (never break):
1. TRANSCRIBE, never generate. Copy text EXACTLY as printed.
2. Never invent, summarize, paraphrase, or "improve" any content.
3. Preserve every Arabic letter, every harakah (diacritic), hamza, madd, shadda, sukoon, tanween, every punctuation mark, every line break.
4. If OCR confidence is not 100% for any character, set ocr_confidence below 100. Never guess unclear text — leave it and lower confidence.
5. Never fabricate. If a classification category has nothing on the page, return an empty array for it.
6. Do NOT redraw or invent magic squares / wafq. Only describe what is actually printed.

PAGE RANGE: Extract ONLY pages ${page_start} through ${page_end} of this PDF. One object per page, in page order.

FOR EACH PAGE return:
- page_number: the physical PDF page number (1-based)
- page_label: the printed page label if it differs from the physical number (e.g. "iii", "12a"), else ""
- ocr_text: the COMPLETE verbatim text of EVERYTHING printed on the page (Arabic / English / Malayalam mixed exactly as printed). Every letter, harakah, punctuation, paragraph, line break.
- ocr_text_ar: the Arabic-script portion of the page only (verbatim, harakat preserved). "" if none.
- ocr_text_en: the English/Latin-script portion only. "" if none.
- ocr_text_ml: the Malayalam-script portion only. "" if none.
- ocr_confidence: 0-100. 100 ONLY if every character is completely certain.
- quality_flags: { ocr_errors, harakat_errors, missing_arabic_letters, broken_arabic_words, duplicate_content, low_quality_scan, missing_pages, printing_errors, incomplete_ocr } — all booleans, true when that problem is present on this page.
- classification: an object where each key is a category and the value is an array of SHORT verbatim strings found on the page for that category. Categories: holy_names, quran_verses, hadith, dua, dhikr, wazifa, hizb, khawass, mujarrabat, riyadah, fasting_instructions, magic_squares, wafq, talismans, repetition_counts, timings, benefits, conditions, warnings, scholars, authors, references. Use "" entries only when nothing is present — prefer empty arrays.
- images: array of { image_type, caption } for each distinct visual element printed on the page (magic_square, wafq, table, diagram, seal, symbol, figure, handwritten_chart, other). image_type is one of the enum values. caption is a short faithful description. Empty array if the page is text-only.

BOOK METADATA (from title/copyright pages, only if visible in this chunk):
- total_pages: total PDF page count (number)
- book_title, book_title_ar, author, publisher, edition, volume, publication_year, language, isbn: as printed, "" if not visible

Return ONLY the JSON object. No commentary.`;

        let livePages = [];
        let liveReturnedTotal = 0;
        let liveData = null;

        if (cloudSource === 'googledrive') {
          // ── GOOGLE DRIVE: in-memory PDF text extraction (pdfjs). No binary is
          //    ever persisted — the ArrayBuffer is discarded after extraction.
          //    Only extracted text + page index + citations are stored. (Drive PDFs
          //    are not text-exportable via the API, and the backend SDK cannot pass
          //    a binary to the vision model, so the OCR engine for Drive is pdfjs
          //    text-layer extraction instead of vision — a pipeline redesign, not a
          //    storage change. Scanned/image-only pages yield empty text and are
          //    flagged needs_owner_review rather than guessed.)
          try {
            const pdf = await getDocument({ data: new Uint8Array(fileRef), disableFontFace: true, isEvalSupported: false, useSystemFonts: false }).promise;
            liveReturnedTotal = pdf.numPages || 0;
            const pEnd = Math.min(page_end, liveReturnedTotal);
            for (let pnum = page_start; pnum <= pEnd; pnum++) {
              const page = await pdf.getPage(pnum);
              const tc = await page.getTextContent();
              let text = '';
              for (const it of (tc.items || [])) { text += (it.str || '') + (it.hasEOL ? '\n' : ' '); }
              const empty = text.trim().length === 0;
              livePages.push({
                page_number: pnum, page_label: '',
                ocr_text: text, ocr_text_ar: text, ocr_text_en: '', ocr_text_ml: '',
                ocr_confidence: empty ? 0 : 100,
                quality_flags: empty ? { incomplete_ocr: true, low_quality_scan: true } : {},
                classification: {}, images: [],
              });
            }
            try { await pdf.destroy(); } catch (_) {}
          } catch (e) {
            const errMsg = String(e?.message || e);
            await sdk.entities.MasterPdfBook.update(bookRecordId, { extraction_status: 'partial', extraction_error: `Drive text extract failed: ${errMsg.slice(0,300)}` }).catch(() => {});
            await writeAudit(target.master_book_id, 'CLOUD-LIVE', 1, 'extract_failed', 'failed', `Drive pdfjs extract failed: ${errMsg.slice(0,200)}`, { page_range: `${page_start}-${page_end}` });
            continue;
          }
        } else {
          // ── ONEDRIVE: vision OCR via the headerless pre-auth download URL.
          let liveExtracted, liveSuccess = false, liveErr = '';
          for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
            try {
              liveExtracted = await sdk.integrations.Core.InvokeLLM({ prompt: livePrompt, file_urls: [fileRef], response_json_schema: PAGE_SCHEMA, model: 'gemini_3_flash' });
              liveSuccess = true; break;
            } catch (e) {
              liveErr = String(e?.message || e);
              if (attempt >= MAX_ATTEMPTS - 1) break;
              await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
            }
          }
          if (!liveSuccess) {
            await sdk.entities.MasterPdfBook.update(bookRecordId, { extraction_status: 'partial', extraction_error: `OCR failed (${cloudSource}): ${liveErr.slice(0,300)}` }).catch(() => {});
            await writeAudit(target.master_book_id, 'CLOUD-LIVE', 1, 'extract_failed', 'failed', `OCR failed: ${liveErr.slice(0,200)}`, { page_range: `${page_start}-${page_end}` });
            continue;
          }
          liveData = (liveExtracted && typeof liveExtracted === 'object') ? liveExtracted : {};
          livePages = Array.isArray(liveData.pages) ? liveData.pages : [];
          liveReturnedTotal = Number(liveData.total_pages) || 0;
          if (livePages.length === 0) {
            await writeAudit(target.master_book_id, 'CLOUD-LIVE', 1, 'extract_failed', 'failed', `Zero content for chunk ${page_start}-${page_end} (${cloudSource}) — possible corrupt/unreadable PDF`, { page_range: `${page_start}-${page_end}` });
            await sdk.entities.MasterPdfBook.update(bookRecordId, { extraction_status: 'failed', extraction_error: `Zero content extracted (${cloudSource}). Possible corrupt/unreadable PDF.` }).catch(() => {});
            continue;
          }
        }

        const now = new Date().toISOString();
        const liveRecords = [];
        for (const p of livePages) {
          const pn = Number(p.page_number);
          if (!Number.isFinite(pn)) continue;
          if (liveExistingSet.has(pn)) continue;
          const conf = Number(p.ocr_confidence);
          const ocr_confidence = Number.isFinite(conf) ? Math.max(0, Math.min(100, conf)) : 95;
          const qf = p.quality_flags && typeof p.quality_flags === 'object' ? p.quality_flags : {};
          const anyFlag = Object.values(qf).some((v) => v === true);
          const needs_review = ocr_confidence < 100 || anyFlag;
          const ocr_text = p.ocr_text || '';
          const ocr_text_ar = p.ocr_text_ar || '';
          const ocr_text_en = p.ocr_text_en || '';
          const ocr_text_ml = p.ocr_text_ml || '';
          const cls = p.classification && typeof p.classification === 'object' ? p.classification : {};
          const ai_classification = {};
          for (const k of Object.keys(cls)) {
            const arr = Array.isArray(cls[k]) ? cls[k] : [];
            ai_classification[k] = arr.filter((s) => s != null && String(s).length > 0).map((s) => ({ text: String(s), confidence: ocr_confidence }));
          }
          const imgs = Array.isArray(p.images) ? p.images : [];
          const extracted_images = imgs.filter((im) => im && typeof im === 'object').map((im) => ({
            image_url: '',
            image_type: ['magic_square','wafq','table','diagram','seal','symbol','figure','handwritten_chart','other'].includes(im.image_type) ? im.image_type : 'other',
            caption: String(im.caption || ''),
            bounding_box: '',
          }));
          const content_hash = await sha256(normalizeForHash(ocr_text));
          const search_text = [ocr_text, ocr_text_ar, ocr_text_en, ocr_text_ml, Object.values(ai_classification).map((a) => a.map((x) => x.text).join(' ')).join(' ')].join(' ').toLowerCase();
          liveRecords.push({
            page_record_id: `MPP-${target.master_book_id}-p${pn}`,
            master_book_id: target.master_book_id,
            source_part_id: 'CLOUD-LIVE',
            source_part_number: 1,
            page_number: pn,
            page_label: p.page_label || '',
            ocr_text, ocr_text_ar, ocr_text_en, ocr_text_ml,
            ocr_corrections: [], original_scan_url: '', extracted_images,
            arabic_text: ocr_text_ar, english_text: ocr_text_en, malayalam_text: ocr_text_ml,
            ai_classification, ocr_confidence, quality_flags: qf,
            needs_owner_review: needs_review, review_status: 'pending_review', reviewed_by: '', reviewed_at: '',
            content_hash, search_text, indexed_at: now,
          });
        }
        if (liveRecords.length > 0) {
          for (let i = 0; i < liveRecords.length; i += 100) {
            await sdk.entities.MasterPdfPage.bulkCreate(liveRecords.slice(i, i + 100));
          }
        }
        chunksProcessed++;

        let liveIndexedCount = 0;
        try { liveIndexedCount = (await sdk.entities.MasterPdfPage.filter({ master_book_id: target.master_book_id })).length; } catch (_) {}
        const liveTotal = liveReturnedTotal || knownTotal;
        const liveDone = liveTotal > 0 && page_end >= liveTotal;
        const liveUpdate = {
          last_processed_page: page_end,
          total_pages: liveTotal || (target.total_pages || 0),
          combined_total_pages: liveTotal,
          total_pages_indexed: liveIndexedCount,
          extraction_status: liveDone ? 'pending_verification' : 'processing',
          extraction_error: '',
        };
        if (page_start === 1 && liveData) {
          if (liveData.book_title) liveUpdate.book_title = liveData.book_title;
          if (liveData.book_title_ar) liveUpdate.book_title_ar = liveData.book_title_ar;
          if (liveData.author) liveUpdate.author = liveData.author;
          if (liveData.publisher) liveUpdate.publisher = liveData.publisher;
          if (liveData.edition) liveUpdate.edition = liveData.edition;
          if (liveData.volume) liveUpdate.volume = liveData.volume;
          if (liveData.publication_year) liveUpdate.publication_year = liveData.publication_year;
          if (liveData.language) liveUpdate.language = liveData.language;
          if (liveData.isbn) liveUpdate.isbn = liveData.isbn;
        }
        await sdk.entities.MasterPdfBook.update(bookRecordId, liveUpdate).catch(() => {});
        await writeAudit(target.master_book_id, 'CLOUD-LIVE', 1, 'extract_chunk', 'success', `Indexed ${liveRecords.length} page(s) from ${cloudSource} (live index, no binary stored).`, { page_range: `${page_start}-${page_end}`, entry_count: liveRecords.length });
        if (Date.now() - started > TIME_BUDGET_MS - 20000) break;
        continue; // live-index chunk done; do not fall through to uploaded-PDF logic
      }

      const parts = Array.isArray(target.pdf_parts) ? target.pdf_parts : [];
      const partIdx = target.current_part_index || 0;
      if (partIdx >= parts.length) {
        await sdk.entities.MasterPdfBook.update(bookRecordId, {
          extraction_status: 'pending_verification',
          combined_total_pages: parts.reduce((s, p) => s + (p.page_count || 0), 0),
        }).catch(() => {});
        continue;
      }

      const part = parts[partIdx];
      const partPageCount = part.page_count || 0;
      const lp = target.last_processed_page || 0;
      const partId = part.part_id || `MPBP-${target.master_book_id}-${partIdx + 1}`;
      const partNum = part.part_number || (partIdx + 1);

      // If the current part is fully processed, advance to the next part.
      if (partPageCount > 0 && lp >= partPageCount) {
        const mergedA = await reloadAndMergeParts(bookRecordId, partId, partIdx, {
          processed: true,
          page_end: part.page_count,
          extraction_status: 'completed',
        });
        const updateA = {
          current_part_index: partIdx + 1,
          last_processed_page: 0,
          extraction_status: 'processing',
        };
        if (mergedA) updateA.pdf_parts = mergedA;
        await sdk.entities.MasterPdfBook.update(bookRecordId, updateA).catch(() => {});
        continue;
      }

      const page_start = lp + 1;
      let page_end = page_start + CHUNK_SIZE - 1;
      if (partPageCount > 0 && page_end > partPageCount) page_end = partPageCount;

      const mergedB = await reloadAndMergeParts(bookRecordId, partId, partIdx, { extraction_status: 'processing' });
      const updateB = { extraction_status: 'processing', import_date: new Date().toISOString() };
      if (mergedB) updateB.pdf_parts = mergedB;
      await sdk.entities.MasterPdfBook.update(bookRecordId, updateB).catch(() => {});

      // ── Idempotency: skip pages already indexed (append-only, Law §13) ──
      let existingPages = [];
      try {
        existingPages = await sdk.entities.MasterPdfPage.filter({
          master_book_id: target.master_book_id,
          page_number: { $gte: page_start, $lte: page_end },
        });
      } catch (_) {}
      const existingSet = new Set((existingPages || []).map((p) => Number(p.page_number)));
      if (existingSet.size === (page_end - page_start + 1)) {
        // Whole chunk already indexed — just advance the cursor.
        await sdk.entities.MasterPdfBook.update(bookRecordId, { last_processed_page: page_end }).catch(() => {});
        continue;
      }

      // ── LLM vision extraction (proven pattern: pass PDF file_url, NO binary download) ──
      const prompt = `You are a faithful manuscript archivist for the Sirr al-Huruf Master PDF Library. You are given a PDF.

ABSOLUTE RULES (never break):
1. TRANSCRIBE, never generate. Copy text EXACTLY as printed.
2. Never invent, summarize, paraphrase, or "improve" any content.
3. Preserve every Arabic letter, every harakah (diacritic), hamza, madd, shadda, sukoon, tanween, every punctuation mark, every line break.
4. If OCR confidence is not 100% for any character, set ocr_confidence below 100. Never guess unclear text — leave it and lower confidence.
5. Never fabricate. If a classification category has nothing on the page, return an empty array for it.
6. Do NOT redraw or invent magic squares / wafq. Only describe what is actually printed.

PAGE RANGE: Extract ONLY pages ${page_start} through ${page_end} of this PDF. One object per page, in page order.

FOR EACH PAGE return:
- page_number: the physical PDF page number (1-based)
- page_label: the printed page label if it differs from the physical number (e.g. "iii", "12a"), else ""
- ocr_text: the COMPLETE verbatim text of EVERYTHING printed on the page (Arabic / English / Malayalam mixed exactly as printed). Every letter, harakah, punctuation, paragraph, line break.
- ocr_text_ar: the Arabic-script portion of the page only (verbatim, harakat preserved). "" if none.
- ocr_text_en: the English/Latin-script portion only. "" if none.
- ocr_text_ml: the Malayalam-script portion only. "" if none.
- ocr_confidence: 0-100. 100 ONLY if every character is completely certain.
- quality_flags: { ocr_errors, harakat_errors, missing_arabic_letters, broken_arabic_words, duplicate_content, low_quality_scan, missing_pages, printing_errors, incomplete_ocr } — all booleans, true when that problem is present on this page.
- classification: an object where each key is a category and the value is an array of SHORT verbatim strings found on the page for that category. Categories: holy_names, quran_verses, hadith, dua, dhikr, wazifa, hizb, khawass, mujarrabat, riyadah, fasting_instructions, magic_squares, wafq, talismans, repetition_counts, timings, benefits, conditions, warnings, scholars, authors, references. Use "" entries only when nothing is present — prefer empty arrays.
- images: array of { image_type, caption } for each distinct visual element printed on the page (magic_square, wafq, table, diagram, seal, symbol, figure, handwritten_chart, other). image_type is one of the enum values. caption is a short faithful description. Empty array if the page is text-only.

BOOK METADATA (from title/copyright pages, only if visible in this chunk):
- total_pages: total PDF page count (number)
- book_title, book_title_ar, author, publisher, edition, volume, publication_year, language, isbn: as printed, "" if not visible

Return ONLY the JSON object. No commentary.`;

      const schema = PAGE_SCHEMA;

      let extracted;
      let success = false;
      let errMsg = '';
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        try {
          extracted = await sdk.integrations.Core.InvokeLLM({
            prompt,
            file_urls: [part.file_url],
            response_json_schema: schema,
            model: 'gemini_3_flash',
          });
          success = true;
          break;
        } catch (e) {
          errMsg = String(e?.message || e);
          if (attempt >= MAX_ATTEMPTS - 1) {
            const mergedD = await reloadAndMergeParts(bookRecordId, partId, partIdx, { extraction_status: 'failed' });
            const updateD = {
              extraction_status: 'partial',
              extraction_error: `Book ${target.master_book_id}, Part ${partId} (Part ${partNum}), pages ${page_start}-${page_end}: ${errMsg.slice(0, 400)}`,
            };
            if (mergedD) updateD.pdf_parts = mergedD;
            await sdk.entities.MasterPdfBook.update(bookRecordId, updateD).catch(() => {});
            await writeAudit(target.master_book_id, partId, partNum, 'extract_failed', 'failed', `Chunk ${page_start}-${page_end} failed: ${errMsg.slice(0, 200)}`, { page_range: `${page_start}-${page_end}` });
            return Response.json({
              status: 'error',
              master_book_id: target.master_book_id,
              part_id: partId,
              part_number: partNum,
              part_index: partIdx,
              page_range: `${page_start}-${page_end}`,
              error: errMsg,
              chunks_processed: chunksProcessed,
            });
          }
          await writeAudit(target.master_book_id, partId, partNum, 'retry', 'info', `Retry ${attempt + 1}/${MAX_ATTEMPTS} for chunk ${page_start}-${page_end}: ${errMsg.slice(0, 160)}`, { page_range: `${page_start}-${page_end}` });
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        }
      }

      if (!success) continue;

      const data = (extracted && typeof extracted === 'object') ? extracted : {};
      const pages = Array.isArray(data.pages) ? data.pages : [];

      // ── OCR RETRY: if any page is low-confidence, re-extract once, keep the better result ──
      const minConf = pages.length > 0 ? Math.min(...pages.map((p) => Number(p.ocr_confidence) || 100)) : 100;
      if (pages.length > 0 && minConf < 100) {
        try {
          const retry = await sdk.integrations.Core.InvokeLLM({
            prompt, file_urls: [part.file_url], response_json_schema: schema, model: 'gemini_3_flash',
          });
          const retryPages = Array.isArray(retry?.pages) ? retry.pages : [];
          if (retryPages.length > 0) {
            const retryMin = Math.min(...retryPages.map((p) => Number(p.ocr_confidence) || 100));
            if (retryPages.length >= pages.length && retryMin >= minConf) {
              extracted = retry;
            }
          }
        } catch (_) { /* keep original on retry failure */ }
      }

      const finalData = (extracted && typeof extracted === 'object') ? extracted : {};
      const finalPages = Array.isArray(finalData.pages) ? finalData.pages : [];
      const returnedTotalPages = Number(finalData.total_pages) || 0;

      if (finalPages.length === 0) {
        const mergedE = await reloadAndMergeParts(bookRecordId, partId, partIdx, { extraction_status: 'failed' });
        const updateE = {
          extraction_status: 'failed',
          extraction_error: `Zero content extracted. Book ${target.master_book_id}, Part ${partId} (Part ${partNum}), pages ${page_start}-${page_end}. Manual review required.`,
        };
        if (mergedE) updateE.pdf_parts = mergedE;
        await sdk.entities.MasterPdfBook.update(bookRecordId, updateE).catch(() => {});
        await writeAudit(target.master_book_id, partId, partNum, 'extract_failed', 'failed', `Zero content for chunk ${page_start}-${page_end}`, { page_range: `${page_start}-${page_end}` });
        return Response.json({
          status: 'error',
          master_book_id: target.master_book_id,
          part_id: partId,
          page_range: `${page_start}-${page_end}`,
          error: 'Zero content extracted — possible OCR or PDF failure',
          chunks_processed: chunksProcessed,
        });
      }

      // ── Build MasterPdfPage records ──
      const now = new Date().toISOString();
      const records = [];
      for (const p of finalPages) {
        const pn = Number(p.page_number);
        if (!Number.isFinite(pn)) continue;
        if (existingSet.has(pn)) continue; // append-only: never overwrite an indexed page
        const conf = Number(p.ocr_confidence);
        const ocr_confidence = Number.isFinite(conf) ? Math.max(0, Math.min(100, conf)) : 95;
        const qf = p.quality_flags && typeof p.quality_flags === 'object' ? p.quality_flags : {};
        const anyFlag = Object.values(qf).some((v) => v === true);
        const needs_review = ocr_confidence < 100 || anyFlag;

        const ocr_text = p.ocr_text || '';
        const ocr_text_ar = p.ocr_text_ar || '';
        const ocr_text_en = p.ocr_text_en || '';
        const ocr_text_ml = p.ocr_text_ml || '';

        // ai_classification: wrap string arrays into {text, confidence} per entity design.
        const cls = p.classification && typeof p.classification === 'object' ? p.classification : {};
        const ai_classification = {};
        for (const k of Object.keys(cls)) {
          const arr = Array.isArray(cls[k]) ? cls[k] : [];
          ai_classification[k] = arr.filter((s) => s != null && String(s).length > 0).map((s) => ({ text: String(s), confidence: ocr_confidence }));
        }

        const imgs = Array.isArray(p.images) ? p.images : [];
        const extracted_images = imgs
          .filter((im) => im && typeof im === 'object')
          .map((im) => ({
            image_url: '', // vision cannot produce a URL; original_scan_url holds the page render
            image_type: ['magic_square', 'wafq', 'table', 'diagram', 'seal', 'symbol', 'figure', 'handwritten_chart', 'other'].includes(im.image_type) ? im.image_type : 'other',
            caption: String(im.caption || ''),
            bounding_box: '',
          }));

        const content_hash = await sha256(normalizeForHash(ocr_text));
        const search_text = [ocr_text, ocr_text_ar, ocr_text_en, ocr_text_ml, Object.values(ai_classification).map((a) => a.map((x) => x.text).join(' ')).join(' ')]
          .join(' ')
          .toLowerCase();

        records.push({
          page_record_id: `MPP-${target.master_book_id}-p${pn}`,
          master_book_id: target.master_book_id,
          source_part_id: partId,
          source_part_number: partNum,
          page_number: pn,
          page_label: p.page_label || '',
          ocr_text,
          ocr_text_ar,
          ocr_text_en,
          ocr_text_ml,
          ocr_corrections: [],
          original_scan_url: '',
          extracted_images,
          arabic_text: ocr_text_ar,
          english_text: ocr_text_en,
          malayalam_text: ocr_text_ml,
          ai_classification,
          ocr_confidence,
          quality_flags: qf,
          needs_owner_review: needs_review,
          review_status: 'pending_review', // Law §12: NEVER auto-approved
          reviewed_by: '',
          reviewed_at: '',
          content_hash,
          search_text,
          indexed_at: now,
        });
      }

      if (records.length > 0) {
        for (let i = 0; i < records.length; i += 100) {
          await sdk.entities.MasterPdfPage.bulkCreate(records.slice(i, i + 100));
        }
      }

      chunksProcessed++;

      // ── Update the current part + book progress (anti-race) ──
      const partDone = returnedTotalPages > 0 && page_end >= returnedTotalPages;
      const partPatchC = {
        page_count: returnedTotalPages || part.page_count,
        page_end: page_end,
        processed: partDone,
        extraction_status: partDone ? 'completed' : 'processing',
      };
      const mergedC = await reloadAndMergeParts(bookRecordId, partId, partIdx, partPatchC);

      let finalParts;
      let combined;
      let bookComplete;
      if (mergedC) {
        finalParts = mergedC;
        combined = mergedC.reduce((s, p) => s + (p.page_count || 0), 0);
        const freshIdx = mergedC.findIndex((p) => (p.part_id || '') === partId);
        const cur = freshIdx >= 0 ? freshIdx : partIdx;
        bookComplete = cur === mergedC.length - 1 && partDone && mergedC.every((p) => p.processed && (p.page_count || 0) > 0 && (p.page_end || 0) >= (p.page_count || 0));
      } else {
        finalParts = parts.map((p, i) => (i === partIdx ? { ...p, ...partPatchC } : p));
        combined = finalParts.reduce((s, p) => s + (p.page_count || 0), 0);
        bookComplete = partIdx === parts.length - 1 && partDone;
      }

      // Count indexed pages for this book (Law §13: append-only tally).
      let indexedCount = 0;
      try {
        const all = await sdk.entities.MasterPdfPage.filter({ master_book_id: target.master_book_id });
        indexedCount = all.length;
      } catch (_) {}

      const bookUpdate = {
        pdf_parts: finalParts,
        last_processed_page: page_end,
        total_pages: returnedTotalPages || (target.total_pages || 0),
        combined_total_pages: combined,
        total_pages_indexed: indexedCount,
        extraction_status: bookComplete ? 'pending_verification' : 'processing', // Law §15: never 'completed'
        extraction_error: '',
      };

      // Book metadata only from the first chunk of the first part.
      if (partIdx === 0 && page_start === 1) {
        if (finalData.book_title) bookUpdate.book_title = finalData.book_title;
        if (finalData.book_title_ar) bookUpdate.book_title_ar = finalData.book_title_ar;
        if (finalData.author) bookUpdate.author = finalData.author;
        if (finalData.publisher) bookUpdate.publisher = finalData.publisher;
        if (finalData.edition) bookUpdate.edition = finalData.edition;
        if (finalData.volume) bookUpdate.volume = finalData.volume;
        if (finalData.publication_year) bookUpdate.publication_year = finalData.publication_year;
        if (finalData.language) bookUpdate.language = finalData.language;
        if (finalData.isbn) bookUpdate.isbn = finalData.isbn;
      }

      await sdk.entities.MasterPdfBook.update(bookRecordId, bookUpdate).catch(() => {});

      const chunkMinConf = records.length > 0 ? Math.min(...records.map((r) => r.ocr_confidence)) : 100;
      const reviewCount = records.filter((r) => r.needs_owner_review).length;
      await writeAudit(
        target.master_book_id, partId, partNum,
        'extract_chunk', 'success',
        `Indexed ${records.length} page(s) (${reviewCount} flagged for review).`,
        { page_range: `${page_start}-${page_end}`, entry_count: records.length, ocr_confidence_min: chunkMinConf }
      );

      if (Date.now() - started > TIME_BUDGET_MS - 20000) break;
    }

    // Release the lock on exit (Law §6).
    if (lockedBookId) {
      const lb = await sdk.entities.MasterPdfBook.filter({ master_book_id: lockedBookId }, undefined, 1).catch(() => []);
      if (lb[0]) await sdk.entities.MasterPdfBook.update(lb[0].id || lb[0]._id, { processing_lock_until: '' }).catch(() => {});
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