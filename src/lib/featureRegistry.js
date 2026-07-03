/**
 * Feature Registry — Central source of truth for feature-level permissions.
 * Each entry maps a page_path to its sub-features (independent permission units).
 * Pages not listed here use page-level permission only (backward compatible).
 *
 * Adding a new multi-feature page = add one entry here + wrap features in the page.
 */

export const FEATURE_REGISTRY = {
  '/abjad': {
    pageName: 'Abjad Calculator',
    features: [
      { id: 'abjad_kabir',    label: 'Abjad Kabir',     icon: '🔢', mode: 'kebir'  },
      { id: 'abjad_saghir',   label: 'Abjad Saghir',    icon: '🔢', mode: 'saghir' },
      { id: 'jumlat_kabir',   label: 'Jumlat Kabir',    icon: '🔢', mode: 'cumeli' },
      { id: 'bast_huroof',    label: 'Bastul Huroof',   icon: '🔢', mode: 'bast'   },
      { id: 'bast_huroof_2',  label: 'Bastul Huroof 2', icon: '🔢', mode: 'bast2'  },
    ],
  },
  '/mizaan9': {
    pageName: 'Mizan 9',
    features: [
      { id: 'method_1', label: 'Method 1', icon: '⚖️', method: 1 },
      { id: 'method_2', label: 'Method 2', icon: '⚖️', method: 2 },
      { id: 'method_3', label: 'Method 3', icon: '⚖️', method: 3 },
      { id: 'method_4', label: 'Method 4', icon: '⚖️', method: 4 },
      { id: 'method_5', label: 'Method 5', icon: '⚖️', method: 5 },
    ],
  },
  '/vefkin-yapilisi': {
    pageName: 'Vefkin Yapılışı',
    features: [
      { id: 'ana_vefk',     label: 'Ana Vefk',     icon: '📜', tab: 'ana'    },
      { id: 'tanzim_vefk',  label: 'Tanzim Vefki', icon: '✨', tab: 'tanzim' },
    ],
  },
  '/faal-hasrath': {
    pageName: 'Faal Hasrath',
    features: [
      { id: 'faal_ali',     label: 'Faal Ali',    icon: '✨', tab: 'ali'    },
      { id: 'faal_luqman',  label: 'Faal Luqman', icon: '🌟', tab: 'luqman' },
      { id: 'faal_chob',    label: 'Faal Chob',   icon: '🪵', tab: 'hikmah' },
    ],
  },
  '/holy-names': {
    pageName: 'Holy Names',
    features: [
      { id: 'section_a', label: 'Section A', icon: '✦', tab: 'section-a' },
      { id: 'section_b', label: 'Section B', icon: '✦', tab: 'section-b' },
    ],
  },
};

/**
 * Get all sub-features for a page.
 * @param {string} pagePath
 * @returns {array} Array of { id, label, icon, ... } or empty array
 */
export function getFeatures(pagePath) {
  return FEATURE_REGISTRY[pagePath]?.features || [];
}

/**
 * Does this page have sub-features (multi-feature page)?
 * @param {string} pagePath
 * @returns {boolean}
 */
export function hasSubFeatures(pagePath) {
  return (FEATURE_REGISTRY[pagePath]?.features?.length || 0) > 0;
}

/**
 * Get a single feature by its ID.
 * @param {string} pagePath
 * @param {string} featureId
 * @returns {object|null}
 */
export function getFeatureById(pagePath, featureId) {
  return getFeatures(pagePath).find(f => f.id === featureId) || null;
}

/**
 * Get all multi-feature page paths (for admin panel).
 * @returns {array} Array of page paths
 */
export function getMultiFeaturePagePaths() {
  return Object.keys(FEATURE_REGISTRY);
}