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
  
  // Admin - Core 5 Sections Only
  { path: '/admin/access-dashboard', component: 'AdminDashboard', chunk: 'AdminDashboard' },
  { path: '/admin/approved-users', component: 'ApprovedUsersPage', chunk: 'ApprovedUsersPage' },
  { path: '/admin/page-permissions', component: 'PagePermissions', chunk: 'PagePermissions' },
  { path: '/admin/access-codes', component: 'AdminAccessCodes', chunk: 'AdminAccessCodes' },
  { path: '/admin/support', component: 'AdminSupport', chunk: 'AdminSupport' },
  
  // Admin - Required by System Logic
  { path: '/admin/user/:userId', component: 'UserDetailPage', chunk: 'UserDetailPage' }, // Required by Users page
];

export default ROUTE_MANIFEST;