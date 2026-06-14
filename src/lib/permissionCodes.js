/**
 * Permission Code Mapping for Access Control System
 * Each route maps to a unique permission code
 */

export const PERMISSION_CODES = {
  // Core Pages
  HOME: 'HOME_ACCESS',
  ABJAD: 'ABJAD_ACCESS',
  ANASIR: 'ANASIR_ACCESS',
  HADIM: 'HADIM_ACCESS',
  MIZAN: 'MIZAN_ACCESS',
  MAGIC_SQAYER: 'MAGIC_SQAYER_ACCESS',
  VEFKIN: 'VEFKIN_ACCESS',
  BASTHUL_HUROOF: 'BASTHUL_HUROOF_ACCESS',
  FAAL_HASRATH: 'FAAL_HASRATH_ACCESS',
  PLANTS: 'PLANTS_ACCESS',
  EVIL_JINN: 'EVIL_JINN_ACCESS',
  HOLY_NAMES: 'HOLY_NAMES_ACCESS',
  ASTRO_CLOCK: 'ASTRO_CLOCK_ACCESS',
  CUSTOMER_SERVICE: 'CUSTOMER_SERVICE_ACCESS',
  
  // Admin Pages
  ADMIN_FAAL_CHOB: 'ADMIN_FAAL_CHOB_ACCESS',
  ADMIN_SUPPORT: 'ADMIN_SUPPORT_ACCESS',
  
  // Audit & Pipeline Pages
  HIERARCHY_AUDIT: 'HIERARCHY_AUDIT_ACCESS',
  PIPELINE_TEST: 'PIPELINE_TEST_ACCESS',
  AUDIT_REPORT: 'AUDIT_REPORT_ACCESS',
  ISTINTAK_DISCOVERY: 'ISTINTAK_DISCOVERY_ACCESS',
  MANUSCRIPT_PIPELINE: 'MANUSCRIPT_PIPELINE_ACCESS',
  ABJAD_BAST_AUDIT: 'ABJAD_BAST_AUDIT_ACCESS',
  MIZAN_CALCULATION_AUDIT: 'MIZAN_CALCULATION_AUDIT_ACCESS',
  VEFK_AUDIT: 'VEFK_AUDIT_ACCESS',
  METHOD_CLASSIFICATION: 'METHOD_CLASSIFICATION_ACCESS',
  MANUSCRIPT_VERIFICATION: 'MANUSCRIPT_VERIFICATION_ACCESS',
  MANUSCRIPT_ANALYSIS: 'MANUSCRIPT_ANALYSIS_ACCESS',
  VEFK_MODEL_VERIFICATION: 'VEFK_MODEL_VERIFICATION_ACCESS',
  RUBAI_VERIFICATION: 'RUBAI_VERIFICATION_ACCESS',
  MANUSCRIPT_AUDIT: 'MANUSCRIPT_AUDIT_ACCESS',
  MANUSCRIPT_AUDIT_FULL: 'MANUSCRIPT_AUDIT_FULL_ACCESS',
  MANUSCRIPT_ACTION_FINDER: 'MANUSCRIPT_ACTION_FINDER_ACCESS',
  MANUSCRIPT_LIBRARY: 'MANUSCRIPT_LIBRARY_ACCESS',
  MANUSCRIPT_FINAL_AUDIT: 'MANUSCRIPT_FINAL_AUDIT_ACCESS',
  ASTROLOGY_ONLY_AUDIT: 'ASTROLOGY_ONLY_AUDIT_ACCESS',
  MANUSCRIPT_BROWSER: 'MANUSCRIPT_BROWSER_ACCESS',
  MANUSCRIPT_RULE_AUDIT: 'MANUSCRIPT_RULE_AUDIT_ACCESS',
  MANUSCRIPT_SEARCH: 'MANUSCRIPT_SEARCH_ACCESS',
  MANAZIL_QUALITY_AUDIT: 'MANAZIL_QUALITY_AUDIT_ACCESS',
  MANUSCRIPT_COMPLETION_REPORT: 'MANUSCRIPT_COMPLETION_REPORT_ACCESS',
};

/**
 * Route to Permission Mapping
 */
export const ROUTE_PERMISSION_MAP = {
  '/': { code: PERMISSION_CODES.HOME, name: 'Home', requiresPermission: false },
  '/abjad': { code: PERMISSION_CODES.ABJAD, name: 'Abjad Kabir', requiresPermission: true },
  '/anasir': { code: PERMISSION_CODES.ANASIR, name: 'Anasir', requiresPermission: true },
  '/hadim': { code: PERMISSION_CODES.HADIM, name: 'Hadim', requiresPermission: true },
  '/mizaan9': { code: PERMISSION_CODES.MIZAN, name: 'Mizan 9', requiresPermission: true },
  '/magic-sqayer': { code: PERMISSION_CODES.MAGIC_SQAYER, name: 'Magic Sqayer', requiresPermission: true },
  '/vefkin-yapilisi': { code: PERMISSION_CODES.VEFKIN, name: 'Vefkin Yapilisi', requiresPermission: true },
  '/basthul-huroof-2': { code: PERMISSION_CODES.BASTHUL_HUROOF, name: 'Basthul Huroof', requiresPermission: true },
  '/faal-hasrath': { code: PERMISSION_CODES.FAAL_HASRATH, name: 'Faal Hasrath', requiresPermission: true },
  '/plants': { code: PERMISSION_CODES.PLANTS, name: 'Plants', requiresPermission: true },
  '/plants/:id': { code: PERMISSION_CODES.PLANTS, name: 'Plant Detail', requiresPermission: true },
  '/evil-jinn': { code: PERMISSION_CODES.EVIL_JINN, name: 'Evil Jinn', requiresPermission: true },
  '/holy-names': { code: PERMISSION_CODES.HOLY_NAMES, name: 'Holy Names', requiresPermission: true },
  '/astro-clock': { code: PERMISSION_CODES.ASTRO_CLOCK, name: 'Astro Clock', requiresPermission: true },
  '/customer-service': { code: PERMISSION_CODES.CUSTOMER_SERVICE, name: 'Customer Service', requiresPermission: false },
  
  // Admin Pages
  '/admin/faal-chob-upload': { code: PERMISSION_CODES.ADMIN_FAAL_CHOB, name: 'Admin Faal Chob', requiresPermission: true, adminOnly: true },
  '/admin/support': { code: PERMISSION_CODES.ADMIN_SUPPORT, name: 'Admin Support', requiresPermission: true, adminOnly: true },
  
  // Audit & Pipeline Pages
  '/hierarchy-audit': { code: PERMISSION_CODES.HIERARCHY_AUDIT, name: 'Hierarchy Audit', requiresPermission: true },
  '/pipeline-test': { code: PERMISSION_CODES.PIPELINE_TEST, name: 'Pipeline Test', requiresPermission: true },
  '/audit-report': { code: PERMISSION_CODES.AUDIT_REPORT, name: 'Audit Report', requiresPermission: true },
  '/istintak-discovery': { code: PERMISSION_CODES.ISTINTAK_DISCOVERY, name: 'Istintak Discovery', requiresPermission: true },
  '/manuscript-pipeline': { code: PERMISSION_CODES.MANUSCRIPT_PIPELINE, name: 'Manuscript Pipeline', requiresPermission: true },
  '/abjad-bast-audit': { code: PERMISSION_CODES.ABJAD_BAST_AUDIT, name: 'Abjad Bast Audit', requiresPermission: true },
  '/mizan-calculation-audit': { code: PERMISSION_CODES.MIZAN_CALCULATION_AUDIT, name: 'Mizan Calculation Audit', requiresPermission: true },
  '/vefk-audit': { code: PERMISSION_CODES.VEFK_AUDIT, name: 'Vefk Audit', requiresPermission: true },
  '/method-classification': { code: PERMISSION_CODES.METHOD_CLASSIFICATION, name: 'Method Classification', requiresPermission: true },
  '/manuscript-verification': { code: PERMISSION_CODES.MANUSCRIPT_VERIFICATION, name: 'Manuscript Verification', requiresPermission: true },
  '/manuscript-analysis': { code: PERMISSION_CODES.MANUSCRIPT_ANALYSIS, name: 'Manuscript Analysis', requiresPermission: true },
  '/vefk-model-verification': { code: PERMISSION_CODES.VEFK_MODEL_VERIFICATION, name: 'Vefk Model Verification', requiresPermission: true },
  '/rubai-verification': { code: PERMISSION_CODES.RUBAI_VERIFICATION, name: 'Rubai Verification', requiresPermission: true },
  '/manuscript-audit': { code: PERMISSION_CODES.MANUSCRIPT_AUDIT, name: 'Manuscript Audit', requiresPermission: true },
  '/manuscript-audit-full': { code: PERMISSION_CODES.MANUSCRIPT_AUDIT_FULL, name: 'Manuscript Audit Full', requiresPermission: true },
  '/manuscript-action-finder': { code: PERMISSION_CODES.MANUSCRIPT_ACTION_FINDER, name: 'Manuscript Action Finder', requiresPermission: true },
  '/manuscript-library': { code: PERMISSION_CODES.MANUSCRIPT_LIBRARY, name: 'Manuscript Library', requiresPermission: true },
  '/manuscript-final-audit': { code: PERMISSION_CODES.MANUSCRIPT_FINAL_AUDIT, name: 'Manuscript Final Audit', requiresPermission: true },
  '/astrology-only-audit': { code: PERMISSION_CODES.ASTROLOGY_ONLY_AUDIT, name: 'Astrology Only Audit', requiresPermission: true },
  '/manuscript-browser': { code: PERMISSION_CODES.MANUSCRIPT_BROWSER, name: 'Manuscript Browser', requiresPermission: true },
  '/manuscript-rule-audit': { code: PERMISSION_CODES.MANUSCRIPT_RULE_AUDIT, name: 'Manuscript Rule Audit', requiresPermission: true },
  '/manuscript-search': { code: PERMISSION_CODES.MANUSCRIPT_SEARCH, name: 'Manuscript Search', requiresPermission: true },
  '/manazil-quality-audit': { code: PERMISSION_CODES.MANAZIL_QUALITY_AUDIT, name: 'Manazil Quality Audit', requiresPermission: true },
  '/manuscript-completion-report': { code: PERMISSION_CODES.MANUSCRIPT_COMPLETION_REPORT, name: 'Manuscript Completion Report', requiresPermission: true },
};

/**
 * Get permission config for a route path
 */
export const getPermissionForRoute = (pathname) => {
  // Handle dynamic routes like /plants/:id
  if (pathname.startsWith('/plants/')) {
    return ROUTE_PERMISSION_MAP['/plants/:id'];
  }
  return ROUTE_PERMISSION_MAP[pathname] || null;
};