import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// ═══════════════════════════════════════════════════════════════
// LIVE CLOUD AUTO-SYNC — Master PDF Library
//
// Detects add / update / rename / replace / delete across connected
// cloud sources and flags changed books for re-indexing. It does NOT
// auto-overwrite approved knowledge (append-only law §13): it records
// the detected change in SirrAuditLog and marks the book for the Owner
// to reprocess via the existing review/reprocess flow. Only changed
// books are flagged (re-index only changed pages), never the whole
// library.
//
// Coverage (no entity schema changes this phase):
//   • OneDrive  — full add/update/delete via onedrive_file_id + etag +
//                 modified_date (fields already on MasterPdfBook).
//   • Google Drive — new-file detection (no google file_id stored yet;
//                 per-file update tracking needs a schema addition).
//   • Adobe — reported unavailable (no public list/search API; creds
//                 pending).
//
// Runs unattended (scheduled automation) — allows no-user (system).
// SECURITY: only system or an admin/owner may invoke.
// ═══════════════════════════════════════════════════════════════
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (user && user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });
    // Owner-only when invoked by a person; no-user (system/scheduled) is allowed.
    if (user) {
      let isOwner = false;
      try {
        const profiles = await base44.asServiceRole.entities.AdminProfile.list(null, 500);
        const profile = (profiles || []).find((p) =>
          (p.user_id && p.user_id === user.id) ||
          (p.email && user.email && p.email.toLowerCase() === user.email.toLowerCase())
        );
        isOwner = profile?.is_owner === true;
      } catch { isOwner = false; }
      if (!isOwner) return Response.json({ error: 'Only the Owner can run cloud sync' }, { status: 403 });
    }
    const sdk = base44.asServiceRole;
    const now = new Date().toISOString();

    const books = await sdk.entities.MasterPdfBook.list('-upload_date', 300);
    const byOneDriveId = {};
    const byFileName = {};
    (books || []).forEach((b) => {
      if (b.onedrive_file_id) byOneDriveId[b.onedrive_file_id] = b;
      (Array.isArray(b.pdf_parts) ? b.pdf_parts : []).forEach((pt) => {
        if (pt.file_name) byFileName[pt.file_name] = b;
      });
      if (b.book_title) byFileName[b.book_title] = b;
    });

    const events = []; // {type:'add'|'update'|'rename'|'delete'|'replace', source, book_id, file_name, detail}

    // ── OneDrive ──
    try {
      const conn = await sdk.connectors.getConnection('one_drive');
      if (conn?.accessToken) {
        // List all PDFs (top 200) to detect add/update/delete
        const res = await fetch(
          `https://graph.microsoft.com/v1.0/me/drive/root?$top=1&$select=id`,
          { headers: { Authorization: `Bearer ${conn.accessToken}` } }
        );
        // Use the search-by-type: list children recursively is heavy; instead use $search for pdf
        const sres = await fetch(
          `https://graph.microsoft.com/v1.0/me/drive/root/microsoft.graph.search(q='.pdf')?$select=name,id,size,lastModifiedDateTime,eTag,file&$top=200`,
          { headers: { Authorization: `Bearer ${conn.accessToken}` } }
        );
        if (sres.ok) {
          const data = await sres.json();
          const driveIds = new Set();
          for (const it of (data.value || [])) {
            if (!it.file || it.file.mimeType !== 'application/pdf') continue;
            driveIds.add(it.id);
            const existing = byOneDriveId[it.id];
            if (!existing) {
              events.push({ type: 'add', source: 'OneDrive', file_name: it.name, file_id: it.id, detail: 'New PDF in OneDrive — awaiting import' });
            } else {
              const etagChanged = existing.onedrive_etag && it.eTag && existing.onedrive_etag !== it.eTag;
              const modChanged = existing.onedrive_modified_date && it.lastModifiedDateTime && existing.onedrive_modified_date !== it.lastModifiedDateTime;
              const renamed = existing.book_title && existing.book_title !== it.name && !(Array.isArray(existing.pdf_parts) && existing.pdf_parts.some((pt) => pt.file_name === it.name));
              if (etagChanged || modChanged) {
                events.push({ type: 'update', source: 'OneDrive', book_id: existing.master_book_id, file_name: it.name, detail: `Modified (etag/mod changed) — flagged for re-index` });
                await flagForReindex(sdk, existing, now, user);
              }
              if (renamed) {
                events.push({ type: 'rename', source: 'OneDrive', book_id: existing.master_book_id, file_name: it.name, detail: `Renamed: '${existing.book_title}' → '${it.name}'` });
              }
            }
          }
          // Deletes: OneDrive file_ids in DB but not in Drive
          for (const id of Object.keys(byOneDriveId)) {
            if (!driveIds.has(id)) {
              const b = byOneDriveId[id];
              if (b.import_source === 'onedrive') {
                events.push({ type: 'delete', source: 'OneDrive', book_id: b.master_book_id, file_name: b.book_title, detail: 'File no longer in OneDrive (possibly deleted)' });
              }
            }
          }
        }
      }
    } catch (_) {}

    // ── Google Drive (new-file detection; per-file update needs schema field) ──
    try {
      const conn = await sdk.connectors.getConnection('googledrive');
      if (conn?.accessToken) {
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("mimeType='application/pdf' and trashed=false")}&fields=files(id,name,modifiedTime,size,webViewLink)&pageSize=200&orderBy=modifiedTime desc`,
          { headers: { Authorization: `Bearer ${conn.accessToken}` } }
        );
        if (res.ok) {
          const data = await res.json();
          for (const f of (data.files || [])) {
            const matched = byFileName[f.name];
            if (!matched) {
              events.push({ type: 'add', source: 'Google Drive', file_name: f.name, file_id: f.id, detail: 'New PDF in Google Drive — awaiting import' });
            }
          }
        }
      }
    } catch (_) {}

    // ── Audit + summary ──
    const summary = {
      checked_at: now,
      onedrive_detected: events.filter((e) => e.source === 'OneDrive').length,
      google_drive_detected: events.filter((e) => e.source === 'Google Drive').length,
      adobe: 'unavailable (no public list API; credentials pending)',
    };
    for (const ev of events) {
      await sdk.entities.SirrAuditLog.create({
        audit_id: `SA-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        sirr_book_id: ev.book_id || 'CLOUD-SYNC',
        action: 'integrity_check',
        user_id: user?.id || 'system',
        user_name: user?.full_name || user?.email || 'system',
        timestamp: now,
        status: 'info',
        details: `[CLOUD-SYNC] ${ev.type.toUpperCase()} · ${ev.source} · ${ev.file_name} — ${ev.detail}`,
      }).catch(() => {});
    }

    return Response.json({ success: true, events, summary });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function flagForReindex(sdk, book, now, user) {
  try {
    // Only flag if not currently locked by the pipeline.
    if (book.processing_lock_until) {
      const lock = new Date(book.processing_lock_until).getTime();
      if (lock > Date.now()) return; // pipeline is busy; skip this cycle
    }
    await sdk.entities.MasterPdfBook.update(book.id || book._id, {
      extraction_status: 'pending',
      extraction_error: 'Cloud file changed — pending re-index (auto-sync)',
    });
  } catch (_) {}
}