/**
 * Dynamic Page Registry
 * Decentralized page registration with O(1) config retrieval
 */

const pageRegistry = new Map();

/**
 * Register a page configuration
 * @param {string} path - Route path
 * @param {object} config - Page configuration
 */
export function registerPage(path, config) {
  pageRegistry.set(path, {
    path,
    requiresPermission: config.requiresPermission ?? true,
    permissionCode: config.permissionCode || derivePermissionCode(path),
    adminOnly: config.adminOnly ?? false,
    pageType: config.pageType || 'content', // 'content' | 'admin' | 'system' | 'audit'
    visible: config.visible ?? true,
    ...config
  });
}

/**
 * Derive permission code from path
 * @param {string} path - Route path
 * @returns {string} Permission code
 */
export function derivePermissionCode(path) {
  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!clean) return 'HOME_ACCESS';
  return clean.toUpperCase().replace(/[-/]/g, '_') + '_ACCESS';
}

/**
 * Get page configuration
 * @param {string} path - Route path
 * @returns {object|null} Page config
 */
export function getPageConfig(path) {
  // Direct match
  if (pageRegistry.has(path)) {
    return pageRegistry.get(path);
  }
  
  // Pattern match (e.g., /plants/:id)
  for (const [pattern, config] of pageRegistry.entries()) {
    if (pattern.includes(':')) {
      const regex = new RegExp('^' + pattern.replace(/:\w+/g, '[^/]+') + '$');
      if (regex.test(path)) {
        return config;
      }
    }
  }
  
  return null;
}

/**
 * Check if page is public (no permission required)
 * @param {string} path - Route path
 * @returns {boolean}
 */
export function isPublicPage(path) {
  const config = getPageConfig(path);
  return config ? !config.requiresPermission : false;
}

/**
 * Get all registered pages
 * @returns {array} All page configs
 */
export function getAllPages() {
  return Array.from(pageRegistry.values());
}

/**
 * Get pages visible to admin (for PageVisibilityConfig)
 * @returns {array} Content pages
 */
export function getAdminVisiblePages() {
  return getAllPages().filter(p => 
    p.visible && 
    !p.adminOnly &&
    p.pageType === 'content'
  );
}

/**
 * Categorize pages by type
 * @returns {object} Categorized pages
 */
export function categorizePages() {
  const pages = getAllPages();
  return {
    content: pages.filter(p => p.pageType === 'content'),
    admin: pages.filter(p => p.pageType === 'admin'),
    system: pages.filter(p => p.pageType === 'system'),
    audit: pages.filter(p => p.pageType === 'audit')
  };
}

// Register core pages
registerPage('/', { pageType: 'content', visible: true });
registerPage('/onboarding', { requiresPermission: false, pageType: 'system' });
registerPage('/otp-login', { requiresPermission: false, pageType: 'system' });

// Content pages
registerPage('/abjad', { pageType: 'content', visible: true });
registerPage('/anasir', { pageType: 'content', visible: true });
registerPage('/hadim', { pageType: 'content', visible: true });
registerPage('/mizaan9', { pageType: 'content', visible: true });
registerPage('/magic-sqayer', { pageType: 'content', visible: true });
registerPage('/vefkin-yapilisi', { pageType: 'content', visible: true });
registerPage('/basthul-huroof-2', { pageType: 'content', visible: true });
registerPage('/faal-hasrath', { pageType: 'content', visible: true });
registerPage('/plants', { pageType: 'content', visible: true });
registerPage('/plants/:id', { pageType: 'content', visible: false });
registerPage('/evil-jinn', { pageType: 'content', visible: true });
registerPage('/holy-names', { pageType: 'content', visible: true });
registerPage('/astro-clock', { pageType: 'content', visible: true });
registerPage('/astro-clock/search', { pageType: 'content', visible: false });

// Support pages
registerPage('/support', { pageType: 'content', visible: true });
registerPage('/support/hub', { pageType: 'content', visible: true });
registerPage('/support/chat', { pageType: 'content', visible: false });
registerPage('/support/voice', { pageType: 'content', visible: false });
registerPage('/support/ticket', { pageType: 'content', visible: false });

// Subscription pages
registerPage('/subscription/expired', { pageType: 'system', visible: false });
registerPage('/subscription/pending', { pageType: 'system', visible: false });
registerPage('/payment/razorpay', { pageType: 'system', visible: false });
registerPage('/premium/request', { pageType: 'content', visible: true });
registerPage('/my-subscription', { pageType: 'content', visible: true });
registerPage('/payment', { pageType: 'system', visible: false });

// Admin pages
registerPage('/admin/access-dashboard', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/test', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/support', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/permissions', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/page-permissions', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/subscriptions', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/page-subscriptions', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/pricing-settings', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/user-manager', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/user-management', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/access-logs', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/security-audit', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/subscriptions-management', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/user-permissions', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/user/:userId', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/faal-chob-upload', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/access-requests', { pageType: 'admin', adminOnly: true, visible: false });

// Audit pages
registerPage('/admin/qa-report', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/launch-checklist', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/pre-launch-report', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/enterprise-audit', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/pre-launch-verification', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/final-production-audit', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/performance-test', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/final-signoff', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/page-visibility-audit', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/verify-vip', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/content-rendering-audit', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/test-customer-content', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/audit-fix-content', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/audit-table-rendering', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/vip-test-customer', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/otp-email-test', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/test-otp-login', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/debug-otp-email', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/test-otp-e2e', { pageType: 'audit', adminOnly: true, visible: false });

// Manuscript audit pages
registerPage('/admin/hierarchy-audit', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/mizaan-pipeline-test', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/mizaan-audit-report', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/istintak-rules', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/manuscript-pipeline', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/abjad-bast-audit', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/mizan-calc-audit', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/mizan-vefk-audit', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/mizan-method', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/mizan-manuscript-verify', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/mizan-manuscript-analysis', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/mizan-vefk-model', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/mizan-rubai', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/mizan-manuscript-audit', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/manuscript-audit', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/manuscript-action', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/manuscript-library', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/manuscript-final', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/astrology-only', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/manuscript-browser', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/manuscript-rule-audit', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/manuscript-advanced-search', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/manazil-quality', { pageType: 'audit', adminOnly: true, visible: false });
registerPage('/admin/manuscript-completion', { pageType: 'audit', adminOnly: true, visible: false });