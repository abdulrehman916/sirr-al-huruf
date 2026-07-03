/**
 * Feature Config Cache — fetches and caches FeatureConfig entries from the database.
 * Used by FeatureLockedCard to display dynamic pricing/descriptions.
 *
 * Cache TTL: 2 minutes (120000ms) — balances freshness with performance.
 */
import { base44 } from "@/api/base44Client";
import { getCached, setCached } from "@/lib/permissionCache";

const CACHE_TTL = 120000; // 2 minutes
const CACHE_PREFIX = "feature_config";

/**
 * Fetch a single feature config from DB (with cache).
 * @param {string} pagePath — e.g. '/abjad'
 * @param {string} featureId — e.g. 'abjad_kabir'
 * @returns {Promise<object|null>} FeatureConfig record or null
 */
export async function getFeatureConfig(pagePath, featureId) {
  const cacheKey = `${CACHE_PREFIX}:${pagePath}:${featureId}`;
  const cached = getCached(cacheKey);
  if (cached !== null && cached !== undefined) {
    return cached;
  }

  try {
    const results = await base44.entities.FeatureConfig.filter(
      { page_path: pagePath, feature_id: featureId, is_active: true },
      null,
      1
    );
    const config = results && results.length > 0 ? results[0] : null;
    setCached(cacheKey, config, CACHE_TTL);
    return config;
  } catch {
    return null;
  }
}

/**
 * Fetch all feature configs for a page (with cache).
 * @param {string} pagePath
 * @returns {Promise<array>} Array of FeatureConfig records
 */
export async function getPageFeatureConfigs(pagePath) {
  const cacheKey = `${CACHE_PREFIX}:${pagePath}:all`;
  const cached = getCached(cacheKey);
  if (cached !== null && cached !== undefined) {
    return cached;
  }

  try {
    const results = await base44.entities.FeatureConfig.filter(
      { page_path: pagePath, is_active: true },
      "sort_order",
      50
    );
    setCached(cacheKey, results || [], CACHE_TTL);
    return results || [];
  } catch {
    return [];
  }
}

/**
 * Invalidate cache for a specific feature or page (called after admin updates).
 * @param {string} pagePath
 * @param {string} [featureId] — if omitted, invalidates all configs for the page
 */
export function invalidateFeatureConfigCache(pagePath, featureId) {
  if (featureId) {
    setCached(`${CACHE_PREFIX}:${pagePath}:${featureId}`, null, 1);
  }
  setCached(`${CACHE_PREFIX}:${pagePath}:all`, null, 1);
}