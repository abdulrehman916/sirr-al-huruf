/**
 * Guest Session ID — a persistent UUID stored in localStorage.
 * Used as the user identifier for code redemption and permission checks
 * when the user is not authenticated.
 */

const SESSION_KEY = "sirr_session_id";

export function getSessionId() {
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = "guest_" + crypto.randomUUID().replace(/-/g, "");
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

/**
 * Local permission store — keyed by session ID.
 * Permissions: [{ page_path, page_name, expiry_date (ISO or null=lifetime), granted_at }]
 */
const PERMS_KEY = "sirr_permissions";

export function getLocalPermissions() {
  try {
    const raw = localStorage.getItem(PERMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setLocalPermissions(perms) {
  try {
    localStorage.setItem(PERMS_KEY, JSON.stringify(perms));
  } catch {}
}

/**
 * Merge new granted permissions into local store.
 * Replaces any existing entry for the same page_path.
 */
export function mergeGrantedPermissions(newPerms) {
  const existing = getLocalPermissions();
  const map = {};
  existing.forEach(p => { map[p.page_path] = p; });
  newPerms.forEach(p => { map[p.page_path] = p; });
  setLocalPermissions(Object.values(map));
}

/**
 * Check if local permissions grant access to a page_path.
 * Returns { granted: boolean, expiry_date: string|null }
 */
export function checkLocalPermission(page_path) {
  const perms = getLocalPermissions();
  const perm = perms.find(p => p.page_path === page_path);
  if (!perm) return { granted: false };
  // Check expiry
  if (perm.expiry_date && new Date(perm.expiry_date) < new Date()) {
    return { granted: false, expired: true };
  }
  return { granted: true, expiry_date: perm.expiry_date };
}