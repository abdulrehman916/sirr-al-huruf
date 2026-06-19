/**
 * Dynamic Page Registry — eliminates the static ROUTE_PERMISSION_MAP bottleneck.
 * Pages register themselves; permission codes auto-derive from paths.
 * Scales to 1000+ pages with zero code changes.
 *
 * Usage in any page:
 *   import { registerPage } from '@/lib/pageRegistry';
 *   registerPage({ path: '/my-page', name: 'My Page', requiresPermission: true });
 *
 * The registry is built once at module load and accessed O(1) via getPageConfig().
 */

const registry = new Map();

// Default config for pages not yet registered — conservative (locked)
const DEFAULT_CONFIG = { requiresPermission: true, adminOnly: false, name: null };

/**
 * Register a page in the dynamic registry.
 * Call this once in each page file at module level.
 *
 * @param {string}  path              - React Router path
 * @param {string}  name              - Human-readable name
 * @param {boolean} requiresPermission - Default true (private)
 * @param {boolean} adminOnly         - Admin-restricted page
 * @param {string}  pageType          - 'content' (user-facing, shown in visibility dashboards) or 'system' (internal, hidden). Default 'content'.
 */
export function registerPage({ path, name, requiresPermission = true, adminOnly = false, pageType = 'content', children = [] }) {
  const code = pathToPermissionCode(path);
  registry.set(path, { path, name, code, requiresPermission, adminOnly, pageType, children });
  // Also register path with trailing slash for consistency
  if (!path.endsWith('/') && !path.includes(':')) {
    registry.set(path + '/', { path, name, code, requiresPermission, adminOnly, pageType, children });
  }
}

/**
 * Auto-derive a permission code from a path.
 * /abjad → ABJAD_ACCESS
 * /vefkin-yapilisi → VEFKIN_YAPILISI_ACCESS
 * /admin/user-management → ADMIN_USER_MANAGEMENT_ACCESS
 */
export function pathToPermissionCode(path) {
  return path
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/[\/\-:]/g, '_')
    .toUpperCase() + '_ACCESS';
}

/**
 * Get page config — O(1) Map lookup.
 * Falls back to DEFAULT_CONFIG for unregistered pages.
 */
export function getPageConfig(pathname) {
  // Direct match
  if (registry.has(pathname)) return registry.get(pathname);

  // Dynamic route matching (e.g. /plants/123 matches /plants/:id)
  for (const [pattern, config] of registry) {
    if (pattern.includes(':')) {
      const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '[^/]+') + '$');
      if (regex.test(pathname)) return config;
    }
  }

  return { ...DEFAULT_CONFIG, path: pathname, code: pathToPermissionCode(pathname) };
}

/**
 * Check if a path is registered as public (requiresPermission=false)
 */
export function isPublicPage(pathname) {
  const config = getPageConfig(pathname);
  return !config.requiresPermission;
}

/**
 * Get all registered page paths for admin UIs
 */
export function getAllRegisteredPages() {
  const seen = new Set();
  const pages = [];
  for (const [key, p] of registry) {
    if (key.endsWith('/')) continue;
    if (seen.has(p.path)) continue;
    seen.add(p.path);
    pages.push(p);
    // Expand child pages as separate entries — each shares the parent path
    // so visibility toggles apply to the same route
    if (p.children && p.children.length > 0) {
      for (const child of p.children) {
        pages.push({
          path: p.path,
          name: child.name,
          code: pathToPermissionCode(p.path),
          requiresPermission: child.requiresPermission ?? p.requiresPermission,
          adminOnly: p.adminOnly,
          pageType: p.pageType,
          isChild: true,
        });
      }
    }
  }
  return pages.sort((a, b) => (a.name || '').localeCompare(b.name || '') || 0);
}

/**
 * Get all content pages (non-admin)
 */
export function getContentPages() {
  return getAllRegisteredPages()
    .filter(p => !p.path.startsWith('/admin') && p.path !== '/');
}

// ── Page Visibility — driven by pageType, not path patterns ──
// Content pages (pageType='content') → SHOWN in admin visibility dashboards
// System pages  (pageType='system')  → HIDDEN (support, onboarding, OTP, subscriptions, audit, etc.)
// New content pages register with default pageType='content' and appear automatically.

export function getVisibleContentPages() {
  // Child-tab entries (isChild:true) share the parent route — exclude them so
  // every visibility toggle maps to exactly one real route.
  return getContentPages().filter(p => p.pageType !== 'system' && !p.isChild);
}

// ── Pre-register existing pages ────────────────────────────────────────────────
// These are the current pages. New pages just call registerPage() in their own file.
const PRE_REGISTERED = [
  { path: '/',                     name: 'Home',                    requiresPermission: false },
  { path: '/abjad',                name: 'Abjad Kabir',             requiresPermission: true },
  { path: '/anasir',               name: 'Anasir',                  requiresPermission: true },
  { path: '/hadim',                name: 'Hadim',                   requiresPermission: true },
  { path: '/mizaan9',              name: 'Mizan 9',                 requiresPermission: true },
  { path: '/magic-sqayer',         name: 'Magic Sqayer',            requiresPermission: true },
  { path: '/vefkin-yapilisi',      name: 'Vefkin Yapilisi',         requiresPermission: true, children: [
    { name: 'Ana Vefk' },
    { name: 'Tanzim Vefki' },
  ]},
  { path: '/basthul-huroof-2',     name: 'Basthul Huroof',          requiresPermission: true },
  { path: '/faal-hasrath',         name: 'Faal Hasrath',            requiresPermission: true, children: [
    { name: 'Faal Ali' },
    { name: 'Faal Luqman' },
    { name: 'Faal Chob' },
  ]},
  { path: '/plants',               name: 'Plants',                  requiresPermission: false },
  { path: '/plants/:id',           name: 'Plant Detail',            requiresPermission: true },
  { path: '/evil-jinn',            name: 'Evil Jinn',               requiresPermission: true },
  { path: '/holy-names',           name: 'Holy Names',              requiresPermission: true },
  { path: '/astro-clock',          name: 'Astro Clock',             requiresPermission: true },
  { path: '/customer-service',     name: 'Customer Service',        requiresPermission: false, pageType: 'system' },
  { path: '/support',              name: 'Support Hub',             requiresPermission: false, pageType: 'system' },
  { path: '/support/chat',         name: 'Support Chat',            requiresPermission: false, pageType: 'system' },
  { path: '/support/voice',        name: 'Support Voice',           requiresPermission: false, pageType: 'system' },
  { path: '/support/ticket',       name: 'Support Ticket',          requiresPermission: false, pageType: 'system' },
  { path: '/otp-login',            name: 'OTP Login',               requiresPermission: false, pageType: 'system' },
  { path: '/onboarding',           name: 'Onboarding',              requiresPermission: false, pageType: 'system' },
  { path: '/subscription-expired', name: 'Subscription Expired',    requiresPermission: false, pageType: 'system' },
  { path: '/subscription-pending', name: 'Subscription Pending',    requiresPermission: false, pageType: 'system' },
  { path: '/premium-access-request', name: 'Premium Access Request', requiresPermission: false, pageType: 'system' },
  { path: '/my-subscription',      name: 'My Subscription',         requiresPermission: false, pageType: 'system' },
  // Admin pages
  { path: '/admin/dashboard',              name: 'Admin Dashboard',              requiresPermission: false, adminOnly: true },
  { path: '/admin/test',                   name: 'Admin Test',                   requiresPermission: false, adminOnly: true },
  { path: '/admin/support',                name: 'Admin Support',                requiresPermission: true,  adminOnly: true },
  { path: '/admin/permissions',            name: 'Admin Permissions',            requiresPermission: false, adminOnly: true },
  { path: '/admin/page-permissions',       name: 'Page Permissions',             requiresPermission: true,  adminOnly: true },
  { path: '/admin/subscriptions',          name: 'Admin Subscriptions',          requiresPermission: true,  adminOnly: true },
  { path: '/admin/page-subscriptions',     name: 'Admin Page Subscriptions',     requiresPermission: false, adminOnly: true },
  { path: '/admin/pricing-settings',       name: 'Admin Pricing Settings',       requiresPermission: false, adminOnly: true },
  { path: '/admin/user-manager',           name: 'Admin User Manager',           requiresPermission: true,  adminOnly: true },
  { path: '/admin/user-management',        name: 'Admin User Management',        requiresPermission: false, adminOnly: true },
  { path: '/admin/access-logs',            name: 'Admin Access Logs',            requiresPermission: false, adminOnly: true },
  { path: '/admin/security-audit',         name: 'Security Audit Logs',          requiresPermission: false, adminOnly: true },
  { path: '/admin/subscriptions-management', name: 'Admin Subscriptions Mgmt',   requiresPermission: true,  adminOnly: true },
  { path: '/admin/subscription-requests',  name: 'Subscription Requests',        requiresPermission: false, adminOnly: true },
  { path: '/admin/messages',               name: 'Admin Messages',               requiresPermission: false, adminOnly: true },
  { path: '/admin/user-permissions',       name: 'Admin User Permissions',       requiresPermission: false, adminOnly: true },
  { path: '/admin/access-dashboard',       name: 'Owner Access Dashboard',       requiresPermission: false, adminOnly: true },
  { path: '/admin/user-detail/:userId',    name: 'User Detail',                  requiresPermission: false, adminOnly: true },
  { path: '/admin/faal-chob-upload',       name: 'Admin Faal Chob',              requiresPermission: true,  adminOnly: true },
  { path: '/admin/access-requests',        name: 'Access Requests',               requiresPermission: false, adminOnly: true },
  // Audit pages (system)
  { path: '/hierarchy-audit',              name: 'Hierarchy Audit',              requiresPermission: true,  pageType: 'system' },
  { path: '/pipeline-test',                name: 'Pipeline Test',                requiresPermission: true,  pageType: 'system' },
  { path: '/audit-report',                 name: 'Audit Report',                 requiresPermission: true,  pageType: 'system' },
  { path: '/istintak-discovery',           name: 'Istintak Discovery',           requiresPermission: true,  pageType: 'system' },
  { path: '/manuscript-pipeline',          name: 'Manuscript Pipeline',          requiresPermission: true,  pageType: 'system' },
  { path: '/abjad-bast-audit',             name: 'Abjad Bast Audit',             requiresPermission: true,  pageType: 'system' },
  { path: '/mizan-calculation-audit',      name: 'Mizan Calculation Audit',      requiresPermission: true,  pageType: 'system' },
  { path: '/vefk-audit',                   name: 'Vefk Audit',                   requiresPermission: true,  pageType: 'system' },
  { path: '/method-classification',        name: 'Method Classification',        requiresPermission: true,  pageType: 'system' },
  { path: '/manuscript-verification',      name: 'Manuscript Verification',      requiresPermission: true,  pageType: 'system' },
  { path: '/manuscript-analysis',          name: 'Manuscript Analysis',          requiresPermission: true,  pageType: 'system' },
  { path: '/vefk-model-verification',      name: 'Vefk Model Verification',      requiresPermission: true,  pageType: 'system' },
  { path: '/rubai-verification',           name: 'Rubai Verification',           requiresPermission: true,  pageType: 'system' },
  { path: '/manuscript-audit',             name: 'Manuscript Audit',             requiresPermission: true,  pageType: 'system' },
  { path: '/manuscript-audit-full',        name: 'Manuscript Audit Full',        requiresPermission: true,  pageType: 'system' },
  { path: '/manuscript-action-finder',     name: 'Manuscript Action Finder',     requiresPermission: true,  pageType: 'system' },
  { path: '/manuscript-library',           name: 'Manuscript Library',           requiresPermission: true,  pageType: 'system' },
  { path: '/manuscript-final-audit',       name: 'Manuscript Final Audit',       requiresPermission: true,  pageType: 'system' },
  { path: '/astrology-only-audit',         name: 'Astrology Only Audit',         requiresPermission: true,  pageType: 'system' },
  { path: '/manuscript-browser',           name: 'Manuscript Browser',           requiresPermission: true,  pageType: 'system' },
  { path: '/manuscript-rule-audit',        name: 'Manuscript Rule Audit',        requiresPermission: true,  pageType: 'system' },
  { path: '/manuscript-search',            name: 'Manuscript Search',            requiresPermission: true,  pageType: 'system' },
  { path: '/manazil-quality-audit',        name: 'Manazil Quality Audit',        requiresPermission: true,  pageType: 'system' },
  { path: '/manuscript-completion-report', name: 'Manuscript Completion Report', requiresPermission: true,  pageType: 'system' },
];

// Initialize registry
PRE_REGISTERED.forEach(p => registerPage(p));

// PERMISSION_CODES is exported from permissionCodes.js for backward compatibility.
// New code should use getPageConfig() or pathToPermissionCode() directly.