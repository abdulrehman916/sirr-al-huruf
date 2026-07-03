/**
 * Feature Permission utilities.
 * Works on top of the existing localStorage permission store (sessionId.js).
 *
 * Backward compatibility:
 *   - If a page permission has no sub_features field → ALL features unlocked.
 *   - If sub_features is present → only listed feature IDs are unlocked.
 *   - Admin users bypass all feature checks.
 */

import { getLocalPermissions, checkLocalPermission } from './sessionId';
import { getFeatures, hasSubFeatures } from './featureRegistry';

// ── Module-level admin flag (set by ProtectedPage when admin is detected) ──
let _isAdmin = false;

export function setAdminFlag(isAdmin) {
  _isAdmin = !!isAdmin;
}

export function getAdminFlag() {
  return _isAdmin;
}

/**
 * Check if the current user has access to a specific feature.
 * @param {string} pagePath — e.g. '/abjad'
 * @param {string} featureId — e.g. 'abjad_kabir'
 * @returns {boolean}
 */
export function checkFeatureAccess(pagePath, featureId) {
  // Admin bypass
  if (_isAdmin) return true;

  // Pages without sub-features: check page-level permission only
  if (!hasSubFeatures(pagePath)) {
    return checkLocalPermission(pagePath).granted;
  }

  // Must have page-level permission first
  const pageCheck = checkLocalPermission(pagePath);
  if (!pageCheck.granted) return false;

  // Find the permission record for this page
  const perms = getLocalPermissions();
  const perm = perms.find(p => p.page_path === pagePath);

  // No sub_features → all features unlocked (backward compat)
  if (!perm?.sub_features || !Array.isArray(perm.sub_features) || perm.sub_features.length === 0) {
    return true;
  }

  // Check if this specific feature is in the allowed list
  if (!perm.sub_features.includes(featureId)) return false;

  // Check feature-specific expiry (per-plan duration)
  const featureExpiry = perm.feature_expiries?.[featureId];
  if (featureExpiry?.expiry_date) {
    if (new Date(featureExpiry.expiry_date) < new Date()) {
      return false; // feature expired
    }
  }

  return true;
}

/**
 * Get all unlocked feature IDs for a page.
 * Returns ['__all__'] if the page has no sub-features but is unlocked.
 * Returns all feature IDs if sub_features is absent (backward compat).
 * @param {string} pagePath
 * @returns {array}
 */
export function getUnlockedFeatureIds(pagePath) {
  if (_isAdmin) {
    return hasSubFeatures(pagePath)
      ? getFeatures(pagePath).map(f => f.id)
      : ['__all__'];
  }

  if (!hasSubFeatures(pagePath)) {
    return checkLocalPermission(pagePath).granted ? ['__all__'] : [];
  }

  const pageCheck = checkLocalPermission(pagePath);
  if (!pageCheck.granted) return [];

  const perms = getLocalPermissions();
  const perm = perms.find(p => p.page_path === pagePath);

  if (!perm?.sub_features || !Array.isArray(perm.sub_features) || perm.sub_features.length === 0) {
    return getFeatures(pagePath).map(f => f.id); // all features
  }

  // Filter out individually expired features
  return perm.sub_features.filter(featId => {
    const featureExpiry = perm.feature_expiries?.[featId];
    if (featureExpiry?.expiry_date) {
      return new Date(featureExpiry.expiry_date) >= new Date();
    }
    return true; // no specific expiry = page-level (already checked above)
  });
}

/**
 * Is a specific feature locked for the current user?
 * @param {string} pagePath
 * @param {string} featureId
 * @returns {boolean}
 */
export function isFeatureLocked(pagePath, featureId) {
  return !checkFeatureAccess(pagePath, featureId);
}