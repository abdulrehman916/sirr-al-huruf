import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// ONEDRIVE IMPORT — DOWNLOAD PDF AND RUN VALIDATION PIPELINE
// ═══════════════════════════════════════════════════════════════
// Uses the SHARED OneDrive connector (Owner's account).
// Admin only.
//
// Workflow:
//   1. Fetch file metadata from OneDrive (name, etag, modified date, path)
//   2. Check for duplicate by onedrive_file_id
//      - If found AND etag unchanged → return "duplicate" (skip)
//      - If found AND etag changed → return "changed" (await confirmation)
//      - If not found OR force_reimport=true → proceed
//   3. Download PDF content from OneDrive
//   4. Compute SHA-256 hash for content-level dedup
//   5. Upload PDF to Base44 storage
//   6. Invoke validateManuscriptImport (Phase 1: extraction + images)
//   7. Update ManuscriptBook with OneDrive metadata + source='onedrive'
//
// Never stores the Microsoft password. Uses OAuth access token only.
// Never duplicates previously imported PDFs (checked by onedrive_file_id).
// ═══════════════════════════════════════════════════════════════

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const body = await req.json();
    const { file_id, book_title, book_title_ar, author, language, tradition, force_reimport } = body;

    if (!file_id || !book_title) {
      return Response.json({ error: 'file_id and book_title are required' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('one_drive');

    // ══ 1. Fetch file metadata from OneDrive ══
    const metaUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${file_id}?$select=id,name,size,eTag,lastModifiedDateTime,parentReference`;
    const metaRes = await fetch(metaUrl, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    if (!metaRes.ok) {
      return Response.json({ error: `Failed to fetch OneDrive file metadata: ${metaRes.status}` }, { status: 502 });
    }
    const meta = await metaRes.json();
    const fileName = meta.name || 'document.pdf';
    const etag = meta.eTag || '';
    const modifiedDate = meta.lastModifiedDateTime || '';
    const filePath = meta.parentReference
      ? `${meta.parentReference.path || ''}/${fileName}`
      : `/${fileName}`;

    // ══ 2. Check for duplicate by onedrive_file_id ══
    const existing = await base44.asServiceRole.entities.ManuscriptBook.filter({ onedrive_file_id: file_id });

    if (existing && existing.length > 0 && !force_reimport) {
      const existingBook = existing[0];
      if (existingBook.onedrive_etag === etag) {
        // Same file, unchanged — do NOT re-import
        return Response.json({
          status: 'duplicate',
          book_id: existingBook.book_id,
          book_title: existingBook.book_title,
          onedrive_file_id: file_id,
          message: 'This PDF has already been imported and has not changed in OneDrive. No re-import needed.',
        });
      } else {
        // File has changed — notify user, await confirmation
        return Response.json({
          status: 'changed',
          book_id: existingBook.book_id,
          book_title: existingBook.book_title,
          old_etag: existingBook.onedrive_etag,
          new_etag: etag,
          old_modified: existingBook.onedrive_modified_date,
          new_modified: modifiedDate,
          message: 'This PDF has changed in OneDrive since the last import. Re-import to create a new version (the old version is preserved permanently).',
        });
      }
    }

    // ══ 3. Download PDF content from OneDrive ══
    const contentUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${file_id}/content`;
    const contentRes = await fetch(contentUrl, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    if (!contentRes.ok) {
      return Response.json({ error: `Failed to download PDF from OneDrive: ${contentRes.status}` }, { status: 502 });
    }
    const pdfBuffer = await contentRes.arrayBuffer();
    const pdfBytes = new Uint8Array(pdfBuffer);

    // ══ 4. Compute SHA-256 hash for content-level dedup ══
    const hashBuffer = await crypto.subtle.digest('SHA-256', pdfBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fileHash = hashArray.map((b: number) => b.toString(16).padStart(2, '0')).join('');

    // ══ 5. Upload PDF to Base44 storage ══
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const file = new File([blob], fileName, { type: 'application/pdf' });
    const uploadResult = await base44.asServiceRole.integrations.Core.UploadFile({ file });
    const pdfUrl = uploadResult.file_url;

    // ══ 6. Invoke validateManuscriptImport (Phase 1 pipeline) ══
    const importResult: any = await base44.functions.invoke('validateManuscriptImport', {
      pdf_url: pdfUrl,
      book_title,
      book_title_ar: book_title_ar || '',
      author: author || '',
      language: language || 'Arabic',
      original_file_name: fileName,
      tradition: tradition || '',
    });

    const newBookId = importResult.data?.book_id || importResult.book_id;
    if (!newBookId) {
      return Response.json({ error: 'Import pipeline did not return a book_id', import_result: importResult }, { status: 500 });
    }

    // ══ 7. Update ManuscriptBook with OneDrive metadata ══
    const newBooks = await base44.asServiceRole.entities.ManuscriptBook.filter({ book_id: newBookId });
    if (newBooks && newBooks.length > 0) {
      await base44.asServiceRole.entities.ManuscriptBook.update(newBooks[0].id, {
        source: 'onedrive',
        onedrive_file_id: file_id,
        onedrive_file_path: filePath,
        onedrive_etag: etag,
        onedrive_file_hash: fileHash,
        onedrive_modified_date: modifiedDate,
        original_file_name: fileName,
      });
    }

    return Response.json({
      status: 'imported',
      book_id: newBookId,
      book_title,
      onedrive_file_id: file_id,
      onedrive_file_path: filePath,
      file_hash: fileHash,
      message: `Successfully imported "${book_title}" from OneDrive. Phase 1 (extraction + images) complete. Call verifyBookEntries to complete Arabic verification and translation.`,
      next_step: `verifyBookEntries({ "book_id": "${newBookId}" })`,
    });
  } catch (error) {
    return Response.json({ error: error.message, status: 'import_failed' }, { status: 500 });
  }
});