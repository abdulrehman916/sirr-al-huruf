/**
 * Route Manifest — single source of truth for ALL application routes.
 * Add one object here, zero changes elsewhere. Scales to 500+ pages.
 *
 * Fields:
 *   path   — React Router path
 *   chunk  — page component name (e.g. 'Home')
 *   dir    — import directory; 'pages' (default) or 'components'
 *   flags  — pipe-separated: 'public'=no permission check, 'noauth'=no auth wrapper
 *
 * Each entry auto-generates: lazy import, ProtectedPage wrapper, permission code.
 */

const ROUTE_MANIFEST = [
  // ── Public / Core ──────────────────────────────────────────────────
  { path: '/',                              chunk: 'Home',                             flags: 'public' },
  { path: '/onboarding',                    chunk: 'Onboarding',                       flags: 'noauth' },
  { path: '/otp-login',                     chunk: 'OTPLogin',                         flags: 'noauth' },

  // ── Content pages ─────────────────────────────────────────────────
  { path: '/abjad',                         chunk: 'AbjadKabirPage' },
  { path: '/anasir',                        chunk: 'AnasirPage' },
  { path: '/hadim',                         chunk: 'HadimPage' },
  { path: '/mizaan9',                       chunk: 'Mizaan9Page' },
  { path: '/magic-sqayer',                  chunk: 'MagicSqayerPage' },
  { path: '/vefkin-yapilisi',               chunk: 'VefkinYapilisiPage' },
  { path: '/basthul-huroof-2',              chunk: 'BastHuroofPage' },
  { path: '/faal-hasrath',                  chunk: 'FaalHasrathPage' },
  { path: '/plants',                        chunk: 'PlantsPage',                       flags: 'public' },
  { path: '/plants/:id',                    chunk: 'PlantDetailPage' },
  { path: '/evil-jinn',                     chunk: 'EvilJinnPage' },
  { path: '/holy-names',                    chunk: 'MagicalHolyNamesPage' },
  { path: '/astro-clock',                   chunk: 'AstroClockPage' },

  // ── Support ────────────────────────────────────────────────────────
  { path: '/customer-service',              chunk: 'CustomerService',                  flags: 'public' },
  { path: '/support',                       chunk: 'SupportHub',                       flags: 'public' },
  { path: '/support/chat',                  chunk: 'SupportChat',                      flags: 'public' },
  { path: '/support/voice',                 chunk: 'SupportVoice',                     flags: 'public' },
  { path: '/support/ticket',                chunk: 'SupportTicket',                    flags: 'public' },

  // ── Subscriptions ─────────────────────────────────────────────────
  { path: '/subscription-expired',          chunk: 'SubscriptionExpired',              flags: 'public' },
  { path: '/subscription-pending',          chunk: 'SubscriptionPending',              flags: 'public' },
  { path: '/subscription-payment/:pagePath',chunk: 'RazorpayPayment' },
  { path: '/premium-access-request',        chunk: 'PremiumAccessRequest',             flags: 'public' },
  { path: '/my-subscription',               chunk: 'MySubscription',                   flags: 'public' },
  { path: '/payment/:planId',               chunk: 'PaymentPage',                      flags: 'public' },

  // ── Admin ──────────────────────────────────────────────────────────
  { path: '/admin/dashboard',               chunk: 'AdminDashboard',                   flags: 'public' },
  { path: '/admin/test',                    chunk: 'AdminTest',                        flags: 'public' },
  { path: '/admin/support',                 chunk: 'AdminSupport' },
  { path: '/admin/permissions',             chunk: 'AdminPermissions',                 flags: 'public' },
  { path: '/admin/page-permissions',        chunk: 'PagePermissions',                  flags: 'public' },
  { path: '/admin/subscriptions',           chunk: 'AdminSubscriptions' },
  { path: '/admin/page-subscriptions',      chunk: 'AdminPageSubscriptions',           flags: 'public' },
  { path: '/admin/pricing-settings',        chunk: 'AdminPricingSettings',             flags: 'public' },
  { path: '/admin/user-manager',            chunk: 'AdminUserManager' },
  { path: '/admin/user-management',         chunk: 'AdminUserManagement',              flags: 'public' },
  { path: '/admin/access-logs',             chunk: 'AdminAccessLogs',                  flags: 'public' },
  { path: '/admin/security-audit',          chunk: 'SecurityAuditLogs',                flags: 'public' },
  { path: '/admin/subscriptions-management',chunk: 'AdminSubscriptionsManagement' },
  { path: '/admin/subscription-requests',   chunk: 'SubscriptionRequestsTab',          flags: 'public', dir: 'components/admin' },
  { path: '/admin/messages',                chunk: 'MessagesTab',                      flags: 'public', dir: 'components/admin' },
  { path: '/admin/user-permissions',        chunk: 'AdminUserPermissions',             flags: 'public' },
  { path: '/admin/access-dashboard',        chunk: 'OwnerAccessDashboard',             flags: 'public' },
  { path: '/admin/user-detail/:userId',     chunk: 'UserDetailPage',                   flags: 'public' },
  { path: '/admin/faal-chob-upload',        chunk: 'AdminFaalChobUpload' },
  { path: '/admin/access-requests',        chunk: 'AdminAccessRequests',              flags: 'public' },
  { path: '/admin/qa-report',             chunk: 'QAReport',                         flags: 'public' },
  { path: '/admin/launch-checklist',      chunk: 'FinalLaunchChecklist',             flags: 'public' },
  { path: '/admin/pre-launch-report',     chunk: 'PreLaunchReport',                  flags: 'public' },
  { path: '/admin/enterprise-audit',      chunk: 'EnterpriseAuditDashboard',         flags: 'public' },
  { path: '/admin/pre-launch-verification', chunk: 'PreLaunchVerification',          flags: 'public' },
  { path: '/admin/final-audit',            chunk: 'FinalProductionAudit',           flags: 'public' },
  { path: '/admin/performance-report',     chunk: 'PerformanceTestReport',          flags: 'public' },
  { path: '/admin/final-signoff',          chunk: 'FinalEnterpriseSignOff',         flags: 'public' },
  { path: '/admin/page-visibility-audit',  chunk: 'PageVisibilityAudit',            flags: 'public' },

  // ── Audit / Verification ───────────────────────────────────────────
  { path: '/hierarchy-audit',               chunk: 'HierarchyAuditPage' },
  { path: '/pipeline-test',                 chunk: 'MizaanPipelineTest' },
  { path: '/audit-report',                  chunk: 'MizaanAuditReport' },
  { path: '/istintak-discovery',            chunk: 'IstintakRuleDiscovery' },
  { path: '/manuscript-pipeline',           chunk: 'ManuscriptPipelinePage' },
  { path: '/abjad-bast-audit',              chunk: 'AbjadBastAuditPage' },
  { path: '/mizan-calculation-audit',       chunk: 'MizanCalculationAudit',            dir: 'components/mizaan' },
  { path: '/vefk-audit',                    chunk: 'MizanVefkAuditPage' },
  { path: '/method-classification',         chunk: 'MizanMethodClassification' },
  { path: '/manuscript-verification',       chunk: 'MizanManuscriptVerification' },
  { path: '/manuscript-analysis',           chunk: 'MizanManuscriptAnalysis' },
  { path: '/vefk-model-verification',       chunk: 'MizanVefkModelVerification' },
  { path: '/rubai-verification',            chunk: 'MizanRubaiVerification' },
  { path: '/manuscript-audit',              chunk: 'MizanManuscriptAudit' },
  { path: '/manuscript-audit-full',         chunk: 'ManuscriptAuditPage' },
  { path: '/manuscript-action-finder',      chunk: 'ManuscriptActionFinder' },
  { path: '/manuscript-library',            chunk: 'ManuscriptLibraryPage' },
  { path: '/manuscript-final-audit',        chunk: 'ManuscriptFinalAudit' },
  { path: '/astrology-only-audit',          chunk: 'AstrologyOnlyAudit' },
  { path: '/manuscript-browser',            chunk: 'ManuscriptRecordBrowser' },
  { path: '/manuscript-rule-audit',         chunk: 'ManuscriptRuleAudit' },
  { path: '/manuscript-search',             chunk: 'ManuscriptAdvancedSearch' },
  { path: '/manazil-quality-audit',         chunk: 'ManazilQualityAudit' },
  { path: '/manuscript-completion-report',  chunk: 'ManuscriptCompletionReport' },
];

export default ROUTE_MANIFEST;