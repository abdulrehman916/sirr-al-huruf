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
 * Alias for getAllPages - for compatibility
 * @returns {array} All page configs
 */
export const getAllRegisteredPages = getAllPages;

/**
 * Get all visible content pages
 * @returns {array} All page configs
 */
export function getContentPages() {
  return getAllPages().filter(p => p.pageType === 'content' && p.visible);
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

// Register core pages — all public by default
registerPage('/', { name: 'Home', icon: '🏠', category: 'System', pageType: 'content', visible: true, requiresPermission: false });
registerPage('/onboarding', { requiresPermission: false, pageType: 'system' });
registerPage('/otp-login', { requiresPermission: false, pageType: 'system' });

// Content pages — requiresPermission: true means they need a reading code
registerPage('/abjad', { name: 'Abjad Calculator', icon: '🔢', category: 'Calculators', pageType: 'content', visible: true, requiresPermission: false });
registerPage('/anasir', { name: 'Anasir Calculator', icon: '🌊', category: 'Calculators', pageType: 'content', visible: true, requiresPermission: false });
registerPage('/hadim', { name: 'Hadim Calculator', icon: '👑', category: 'Calculators', pageType: 'content', visible: true, requiresPermission: false });
registerPage('/mizaan9', { name: 'Mizan 9', icon: '⚖️', category: 'Calculators', pageType: 'content', visible: true, requiresPermission: true });
registerPage('/magic-sqayer', { name: 'Magic Sqayer', icon: '✨', category: 'Vefk Systems', pageType: 'content', visible: true, requiresPermission: true });
registerPage('/vefkin-yapilisi', { name: 'Vefkin Yapılışı', icon: '📜', category: 'Vefk Systems', pageType: 'content', visible: true, requiresPermission: true });
registerPage('/basthul-huroof-2', { name: 'Basthul Huroof 2', icon: '٢', category: 'Calculators', pageType: 'content', visible: true, requiresPermission: true });
registerPage('/faal-hasrath', { name: 'Faal Hasrath', icon: '🔮', category: 'Divination', pageType: 'content', visible: true, requiresPermission: true });
registerPage('/plants', { name: 'Plants Dictionary', icon: '🌿', category: 'Reference', pageType: 'content', visible: true, requiresPermission: true });
registerPage('/plants/:id', { pageType: 'content', visible: false, requiresPermission: true });
registerPage('/evil-jinn', { name: 'Evil Jinn Names', icon: '👁️', category: 'Reference', pageType: 'content', visible: true, requiresPermission: true });
registerPage('/holy-names', { name: 'Magical Holy Names', icon: '✦', category: 'Reference', pageType: 'content', visible: true, requiresPermission: true });
registerPage('/astro-clock', { name: 'Astro Clock', icon: '🕰️', category: 'Timings', pageType: 'content', visible: true, requiresPermission: true });
registerPage('/astro-clock/search', { pageType: 'content', visible: false, requiresPermission: true });

// Support pages — all public
registerPage('/support', { name: 'Support Hub', icon: '🛡️', category: 'System', pageType: 'content', visible: true, requiresPermission: false });
registerPage('/support/hub', { pageType: 'content', visible: true, requiresPermission: false });
registerPage('/support/chat', { pageType: 'content', visible: false, requiresPermission: false });
registerPage('/support/voice', { pageType: 'content', visible: false, requiresPermission: false });
registerPage('/support/ticket', { pageType: 'content', visible: false, requiresPermission: false });

// Subscription pages
registerPage('/subscription/expired', { pageType: 'system', visible: false });
registerPage('/subscription/pending', { pageType: 'system', visible: false });
registerPage('/payment/razorpay', { pageType: 'system', visible: false });
registerPage('/premium/request', { pageType: 'content', visible: true });
registerPage('/my-subscription', { name: 'My Subscription', icon: '⭐', category: 'System', pageType: 'content', visible: true });
registerPage('/payment', { pageType: 'system', visible: false });

// Admin pages
registerPage('/admin/access-dashboard', { name: 'Admin Dashboard', icon: '👑', category: 'Admin', pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/test', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/support', { name: 'Support Messages', icon: '💬', category: 'Admin', pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/permissions', { pageType: 'admin', adminOnly: true, visible: false });
registerPage('/admin/page-permissions', { name: 'Page Permissions', icon: '🌐', category: 'Admin', pageType: 'admin', adminOnly: true, visible: false });
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
registerPage('/admin/admins', { name: 'Admins', icon: '🛡️', category: 'Admin', pageType: 'admin', adminOnly: true, visible: false });

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