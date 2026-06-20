/**
 * Centralized Route Manifest
 * Single source of truth for all application routes
 * Format: { path, component, chunk, flags }
 * flags: 'public' = no permission required, 'noauth' = no auth check
 */
const ROUTE_MANIFEST = [
  // Core & Auth
  { path: '/', component: 'Home', chunk: 'Home' },
  { path: '/onboarding', component: 'Onboarding', chunk: 'Onboarding', flags: ['noauth'] },
  { path: '/otp-login', component: 'OTPLogin', chunk: 'OTPLogin', flags: ['noauth'] },
  
  // Content Pages
  { path: '/abjad', component: 'AbjadKabirPage', chunk: 'AbjadKabirPage' },
  { path: '/anasir', component: 'AnasirPage', chunk: 'AnasirPage' },
  { path: '/hadim', component: 'HadimPage', chunk: 'HadimPage' },
  { path: '/mizaan9', component: 'Mizaan9Page', chunk: 'Mizaan9Page' },
  { path: '/magic-sqayer', component: 'MagicSqayerPage', chunk: 'MagicSqayerPage' },
  { path: '/vefkin-yapilisi', component: 'VefkinYapilisiPage', chunk: 'VefkinYapilisiPage' },
  { path: '/basthul-huroof-2', component: 'BastHuroofPage', chunk: 'BastHuroofPage' },
  { path: '/faal-hasrath', component: 'FaalHasrathPage', chunk: 'FaalHasrathPage' },
  { path: '/plants', component: 'PlantsPage', chunk: 'PlantsPage' },
  { path: '/plants/:id', component: 'PlantDetailPage', chunk: 'PlantDetailPage' },
  { path: '/evil-jinn', component: 'EvilJinnPage', chunk: 'EvilJinnPage' },
  { path: '/holy-names', component: 'MagicalHolyNamesPage', chunk: 'MagicalHolyNamesPage' },
  { path: '/astro-clock', component: 'AstroClockPage', chunk: 'AstroClockPage' },
  { path: '/astro-clock/search', component: 'AstroClockSearch', chunk: 'AstroClockSearch' },
  
  // Support
  { path: '/support', component: 'CustomerService', chunk: 'CustomerService' },
  { path: '/support/hub', component: 'SupportHub', chunk: 'SupportHub' },
  { path: '/support/chat', component: 'SupportChat', chunk: 'SupportChat' },
  { path: '/support/voice', component: 'SupportVoice', chunk: 'SupportVoice' },
  { path: '/support/ticket', component: 'SupportTicket', chunk: 'SupportTicket' },
  
  // Subscriptions
  { path: '/subscription/expired', component: 'SubscriptionExpired', chunk: 'SubscriptionExpired' },
  { path: '/subscription/pending', component: 'SubscriptionPending', chunk: 'SubscriptionPending' },
  { path: '/payment/razorpay', component: 'RazorpayPayment', chunk: 'RazorpayPayment' },
  { path: '/premium/request', component: 'PremiumAccessRequest', chunk: 'PremiumAccessRequest' },
  { path: '/my-subscription', component: 'MySubscription', chunk: 'MySubscription' },
  { path: '/payment', component: 'PaymentPage', chunk: 'PaymentPage' },
  
  // Admin
  { path: '/admin/approved-users', component: 'ApprovedUsersPage', chunk: 'ApprovedUsersPage' },
  { path: '/admin/access-dashboard', component: 'AdminDashboard', chunk: 'AdminDashboard' },
  { path: '/admin/test', component: 'AdminTest', chunk: 'AdminTest' },
  { path: '/admin/support', component: 'AdminSupport', chunk: 'AdminSupport' },
  { path: '/admin/permissions', component: 'AdminPermissions', chunk: 'AdminPermissions' },
  { path: '/admin/page-permissions', component: 'PagePermissions', chunk: 'PagePermissions' },
  { path: '/admin/subscriptions', component: 'AdminSubscriptions', chunk: 'AdminSubscriptions' },
  { path: '/admin/page-subscriptions', component: 'AdminPageSubscriptions', chunk: 'AdminPageSubscriptions' },
  { path: '/admin/pricing-settings', component: 'AdminPricingSettings', chunk: 'AdminPricingSettings' },
  { path: '/admin/user-manager', component: 'AdminUserManager', chunk: 'AdminUserManager' },
  { path: '/admin/user-management', component: 'AdminUserManagement', chunk: 'AdminUserManagement' },
  { path: '/admin/access-logs', component: 'AdminAccessLogs', chunk: 'AdminAccessLogs' },
  { path: '/admin/security-audit', component: 'SecurityAuditLogs', chunk: 'SecurityAuditLogs' },
  { path: '/admin/subscriptions-management', component: 'AdminSubscriptionsManagement', chunk: 'AdminSubscriptionsManagement' },
  { path: '/admin/user-permissions', component: 'AdminUserPermissions', chunk: 'AdminUserPermissions' },
  
  { path: '/admin/user/:userId', component: 'UserDetailPage', chunk: 'UserDetailPage' },
  { path: '/admin/faal-chob-upload', component: 'AdminFaalChobUpload', chunk: 'AdminFaalChobUpload' },
  { path: '/admin/access-requests', component: 'AdminAccessRequests', chunk: 'AdminAccessRequests' },
  { path: '/admin/access-codes', component: 'AdminAccessCodes', chunk: 'AdminAccessCodes' },
  
  // Audit & QA
  { path: '/admin/qa-report', component: 'QAReport', chunk: 'QAReport' },
  { path: '/admin/launch-checklist', component: 'FinalLaunchChecklist', chunk: 'FinalLaunchChecklist' },
  { path: '/admin/pre-launch-report', component: 'PreLaunchReport', chunk: 'PreLaunchReport' },
  { path: '/admin/enterprise-audit', component: 'EnterpriseAuditDashboard', chunk: 'EnterpriseAuditDashboard' },
  { path: '/admin/pre-launch-verification', component: 'PreLaunchVerification', chunk: 'PreLaunchVerification' },
  { path: '/admin/final-production-audit', component: 'FinalProductionAudit', chunk: 'FinalProductionAudit' },
  { path: '/admin/performance-test', component: 'PerformanceTestReport', chunk: 'PerformanceTestReport' },
  { path: '/admin/final-signoff', component: 'FinalEnterpriseSignOff', chunk: 'FinalEnterpriseSignOff' },
  { path: '/admin/page-visibility-audit', component: 'PageVisibilityAudit', chunk: 'PageVisibilityAudit' },
  { path: '/admin/verify-vip', component: 'VerifyVIPAccess', chunk: 'VerifyVIPAccess' },
  { path: '/admin/content-rendering-audit', component: 'ContentRenderingAudit', chunk: 'ContentRenderingAudit' },
  { path: '/admin/test-customer-content', component: 'TestRealCustomerContent', chunk: 'TestRealCustomerContent' },
  { path: '/admin/audit-fix-content', component: 'AuditAndFixContent', chunk: 'AuditAndFixContent' },
  { path: '/admin/audit-table-rendering', component: 'AuditTableRendering', chunk: 'AuditTableRendering' },
  { path: '/admin/vip-test-customer', component: 'VIPTestCustomer', chunk: 'VIPTestCustomer' },
  { path: '/admin/otp-email-test', component: 'OTPEmailTest', chunk: 'OTPEmailTest' },
  { path: '/admin/test-otp-login', component: 'TestOTPLogin', chunk: 'TestOTPLogin' },
  { path: '/admin/debug-otp-email', component: 'DebugOTPEmail', chunk: 'DebugOTPEmail' },
  { path: '/admin/test-otp-e2e', component: 'TestOTPEndToEnd', chunk: 'TestOTPEndToEnd' },
  
  // Admin Tabs (non-page components)
  
  ,
  
  // Manuscript Audit
  { path: '/admin/hierarchy-audit', component: 'HierarchyAuditPage', chunk: 'HierarchyAuditPage' },
  { path: '/admin/mizaan-pipeline-test', component: 'MizaanPipelineTest', chunk: 'MizaanPipelineTest' },
  { path: '/admin/mizaan-audit-report', component: 'MizaanAuditReport', chunk: 'MizaanAuditReport' },
  { path: '/admin/istintak-rules', component: 'IstintakRuleDiscovery', chunk: 'IstintakRuleDiscovery' },
  { path: '/admin/manuscript-pipeline', component: 'ManuscriptPipelinePage', chunk: 'ManuscriptPipelinePage' },
  { path: '/admin/abjad-bast-audit', component: 'AbjadBastAuditPage', chunk: 'AbjadBastAuditPage' },
  { path: '/admin/mizan-calc-audit', component: 'MizanCalculationAudit', chunk: 'MizanCalculationAudit' },
  { path: '/admin/mizan-vefk-audit', component: 'MizanVefkAuditPage', chunk: 'MizanVefkAuditPage' },
  { path: '/admin/mizan-method', component: 'MizanMethodClassification', chunk: 'MizanMethodClassification' },
  { path: '/admin/mizan-manuscript-verify', component: 'MizanManuscriptVerification', chunk: 'MizanManuscriptVerification' },
  { path: '/admin/mizan-manuscript-analysis', component: 'MizanManuscriptAnalysis', chunk: 'MizanManuscriptAnalysis' },
  { path: '/admin/mizan-vefk-model', component: 'MizanVefkModelVerification', chunk: 'MizanVefkModelVerification' },
  { path: '/admin/mizan-rubai', component: 'MizanRubaiVerification', chunk: 'MizanRubaiVerification' },
  { path: '/admin/mizan-manuscript-audit', component: 'MizanManuscriptAudit', chunk: 'MizanManuscriptAudit' },
  { path: '/admin/manuscript-audit', component: 'ManuscriptAuditPage', chunk: 'ManuscriptAuditPage' },
  { path: '/admin/manuscript-action', component: 'ManuscriptActionFinder', chunk: 'ManuscriptActionFinder' },
  { path: '/admin/manuscript-library', component: 'ManuscriptLibraryPage', chunk: 'ManuscriptLibraryPage' },
  { path: '/admin/manuscript-final', component: 'ManuscriptFinalAudit', chunk: 'ManuscriptFinalAudit' },
  { path: '/admin/astrology-only', component: 'AstrologyOnlyAudit', chunk: 'AstrologyOnlyAudit' },
  { path: '/admin/manuscript-browser', component: 'ManuscriptRecordBrowser', chunk: 'ManuscriptRecordBrowser' },
  { path: '/admin/manuscript-rule-audit', component: 'ManuscriptRuleAudit', chunk: 'ManuscriptRuleAudit' },
  { path: '/admin/manuscript-advanced-search', component: 'ManuscriptAdvancedSearch', chunk: 'ManuscriptAdvancedSearch' },
  { path: '/admin/manazil-quality', component: 'ManazilQualityAudit', chunk: 'ManazilQualityAudit' },
  { path: '/admin/manuscript-completion', component: 'ManuscriptCompletionReport', chunk: 'ManuscriptCompletionReport' },
];

export default ROUTE_MANIFEST;