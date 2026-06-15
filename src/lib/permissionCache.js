/**
 * Lightweight in-memory TTL cache for permission and visibility checks.
 * Eliminates redundant API calls — critical for page-visit-heavy apps.
 *
 * Cache hits avoid:
 *   - PageVisibilityConfig.list() (grows O(n) with pages)
 *   - checkVIPAccess backend call
 *   - checkPageSubscription backend call
 *   - checkPageAccess backend call
 *   - UserAccessProfile.filter() call
 */

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

const store = new Map();

/**
 * Get a cached value. Returns null if missing or expired.
 */
export function getCached(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

/**
 * Set a cached value with optional TTL.
 */
export function setCached(key, value, ttl = DEFAULT_TTL) {
  store.set(key, { value, expiresAt: Date.now() + ttl });
}

/**
 * Remove a specific key from cache.
 */
export function clearCached(key) {
  store.delete(key);
}

/**
 * Clear all cache.
 */
export function clearAllCache() {
  store.clear();
}

/**
 * Purge expired entries (call periodically or on visibility change).
 * Returns number of entries removed.
 */
export function purgeExpired() {
  const now = Date.now();
  let count = 0;
  for (const [key, entry] of store) {
    if (now > entry.expiresAt) {
      store.delete(key);
      count++;
    }
  }
  return count;
}

// Auto-purge when tab becomes hidden (saves memory)
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) purgeExpired();
  });
}

// ── Key factories for type-safe cache keys ──────────────────────────────────────

/**
 * Cache key for page visibility config result.
 */
export function visibilityKey(pagePath) {
  return `vis:${pagePath}`;
}

/**
 * Cache key for full access check result (consolidated).
 */
export function accessCheckKey(userId, pagePath) {
  return `acc:${userId}:${pagePath}`;
}

/**
 * Cache key for user profile (lifetime_access check).
 */
export function profileKey(userId) {
  return `prof:${userId}`;
}

/**
 * Cache key for admin data lists (paginated).
 */
export function adminListKey(entity, page = 0) {
  return `admin:${entity}:${page}`;
}