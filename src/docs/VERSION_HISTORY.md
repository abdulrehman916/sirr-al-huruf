# Sirr al-Huruf — Version History

> Enterprise Digital Manuscript Research Platform
> Semantic Versioning (Major.Minor.Patch)
> **Verified manuscript data is permanent. Application code may change.**

---

## v2.1.0 — OneDrive Integration (Minor)

| Field | Value |
|-------|-------|
| **Version** | v2.1.0 |
| **Build Date** | 2026-07-09 |
| **Type** | Minor — New feature, no breaking changes |
| **Runtime Verification** | Awaiting Runtime Verification |
| **Regression Result** | Awaiting Runtime Verification |

### Summary of Changes
- Connected Owner's personal Microsoft OneDrive account via SHARED OAuth connector (Files.Read.All, offline_access, User.Read scopes)
- Added OneDrive browse + import capability for manuscript PDFs
- Duplicate detection by OneDrive file ID (never re-imports unchanged PDFs)
- Change detection by ETag (notifies when original PDF has been modified)
- Force re-import as new version (old version preserved permanently)
- SHA-256 content hash for content-level dedup
- Admin-only access enforced on both frontend and backend
- Never stores Microsoft password — uses OAuth access token only

### Files Modified
| File | Action |
|------|--------|
| `base44/entities/ManuscriptBook.jsonc` | Modified — added 5 OneDrive tracking fields + index |
| `base44/functions/browseOneDrive/entry.ts` | New — browse OneDrive folders/files via Graph API |
| `base44/functions/importFromOneDrive/entry.ts` | New — download + dedup + import pipeline integration |
| `src/components/sirr/SirrOneDriveBrowser.jsx` | New — folder browser + multi-select + import UI |
| `src/components/sirr/SirrSourceLibrary.jsx` | Modified — added "Import from OneDrive" button |
| `src/pages/SirrPage.jsx` | Modified — added onedrive_browser view |

### Database Changes
- **ManuscriptBook entity**: added `onedrive_file_id`, `onedrive_file_path`, `onedrive_etag`, `onedrive_file_hash`, `onedrive_modified_date` fields
- **New index**: `idx_onedrive_file_id` for fast duplicate lookups
- **Migration**: backward-compatible — existing books have empty OneDrive fields (null is acceptable)
- **Migration Status**: Non-destructive (no existing data overwritten)

### Integration Points
- `importFromOneDrive` invokes existing `validateManuscriptImport` pipeline (Phase 1)
- After import, ManuscriptBook is updated with `source='onedrive'` + OneDrive metadata
- Next step (`verifyBookEntries`) remains unchanged — existing verification pipeline continues to work

### Validation Rules Preserved
- ✅ All existing validateManuscriptImport logic unchanged
- ✅ All existing verifyBookEntries logic unchanged
- ✅ Arabic verification pipeline (verifyArabicText) unchanged
- ✅ Duplicate detection (detectManuscriptDuplicates) unchanged
- ✅ Malayalam translation policy unchanged
- ✅ Manuscript integrity (original PDF never modified) unchanged

### Rollback Plan
- Entity change is backward-compatible (no data loss on rollback)
- Backend functions can be deleted without affecting existing manuscripts
- Frontend component can be removed by reverting SirrPage + SirrSourceLibrary changes
- Verified manuscript data is never affected by application code changes

### Checks
| Check | Status |
|-------|--------|
| Code inspection | ✅ Pass |
| Build succeeds | Awaiting Runtime Verification |
| Runtime zero errors | Awaiting Runtime Verification |
| UI renders correctly | Awaiting Runtime Verification |
| Mobile preview works | Awaiting Runtime Verification |
| Functional testing | Awaiting Runtime Verification |
| Regression test | Awaiting Runtime Verification |
| Database read/write | Awaiting Runtime Verification |
| Performance acceptable | Awaiting Runtime Verification |
| No console errors | Awaiting Runtime Verification |
| Validation report | Awaiting Runtime Verification |

---

## v2.0.0 — Enterprise Manuscript Platform Baseline (Major)

Prior enterprise manuscript library, verification pipeline, and Sirr knowledge system.