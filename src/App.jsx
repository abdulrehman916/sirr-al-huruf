import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense, useMemo } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { NavigationProvider } from './context/NavigationContext';
import { getPageConfig } from '@/lib/pageRegistry';
import { PageStateProvider } from './context/PageStateContext';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import { useI18n } from '@/i18n/I18nContext';
import LanguageSetup from './pages/LanguageSetup';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineNotice from './components/OfflineNotice';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedPage from './components/ProtectedPage';
import ROUTE_MANIFEST from '@/lib/routeManifest';

// ── Lazy import map — each chunk name → dynamic import function ──────
// Vite statically analyzes these for code splitting. Scales to 500+ pages.
const PAGE_IMPORTS = {
  // Core
  Home:                     () => import('./pages/Home'),
  Onboarding:               () => import('./pages/Onboarding'),
  OTPLogin:                 () => import('./pages/OTPLogin'),
  // Content
  AbjadKabirPage:           () => import('./pages/AbjadKabirPage'),
  AnasirPage:               () => import('./pages/AnasirPage'),
  HadimPage:                () => import('./pages/HadimPage'),
  Mizaan9Page:              () => import('./pages/Mizaan9Page'),
  MagicSqayerPage:          () => import('./pages/MagicSqayerPage'),
  VefkinYapilisiPage:       () => import('./pages/VefkinYapilisiPage'),
  BastHuroofPage:           () => import('./pages/BastHuroofPage'),
  FaalHasrathPage:          () => import('./pages/FaalHasrathPage'),
  PlantsPage:               () => import('./pages/PlantsPage'),
  PlantDetailPage:          () => import('./pages/PlantDetailPage'),
  EvilJinnPage:             () => import('./pages/EvilJinnPage'),
  MagicalHolyNamesPage:     () => import('./pages/MagicalHolyNamesPage'),
  AstroClockPage:           () => import('./pages/AstroClockPage'),
  AstroClockSearch:         () => import('./components/astroclock/AstroClockSearch'),
  // Support
  CustomerService:          () => import('./pages/CustomerService'),
  SupportHub:               () => import('./pages/SupportHub'),
  SupportChat:              () => import('./pages/SupportChat'),
  SupportVoice:             () => import('./pages/SupportVoice'),
  SupportTicket:            () => import('./pages/SupportTicket'),
  // Subscriptions
  SubscriptionExpired:      () => import('./pages/SubscriptionExpired'),
  SubscriptionPending:      () => import('./pages/SubscriptionPending'),
  RazorpayPayment:          () => import('./pages/RazorpayPayment'),
  PremiumAccessRequest:     () => import('./pages/PremiumAccessRequest'),
  MySubscription:           () => import('./pages/MySubscription'),
  PaymentPage:              () => import('./pages/PaymentPage'),
  // Admin
  AdminDashboard:           () => import('./pages/AdminDashboard'),
  AdminTest:                () => import('./pages/AdminTest'),
  AdminSupport:             () => import('./pages/AdminSupport'),
  AdminPermissions:         () => import('./pages/AdminPermissions'),
  PagePermissions:          () => import('./pages/PagePermissions'),
  AdminSubscriptions:       () => import('./pages/AdminSubscriptions'),
  AdminPageSubscriptions:   () => import('./pages/AdminPageSubscriptions'),
  AdminPricingSettings:     () => import('./pages/AdminPricingSettings'),
  AdminUserManager:         () => import('./pages/AdminUserManager'),
  AdminUserManagement:      () => import('./pages/AdminUserManagement'),
  AdminAccessLogs:          () => import('./pages/AdminAccessLogs'),
  SecurityAuditLogs:        () => import('./pages/SecurityAuditLogs'),
  AdminSubscriptionsManagement: () => import('./pages/AdminSubscriptionsManagement'),
  AdminUserPermissions:     () => import('./pages/AdminUserPermissions'),
  OwnerAccessDashboard:     () => import('./pages/OwnerAccessDashboard'),
  UserDetailPage:           () => import('./pages/UserDetailPage'),
  AdminFaalChobUpload:      () => import('./pages/AdminFaalChobUpload'),
  AdminAccessRequests:      () => import('./pages/AdminAccessRequests'),
  QAReport:                 () => import('./pages/QAReport'),
  FinalLaunchChecklist:     () => import('./pages/FinalLaunchChecklist'),
  PreLaunchReport:          () => import('./pages/PreLaunchReport'),
  EnterpriseAuditDashboard: () => import('./pages/EnterpriseAuditDashboard'),
  PreLaunchVerification:    () => import('./pages/PreLaunchVerification'),
  FinalProductionAudit:     () => import('./pages/FinalProductionAudit'),
  PerformanceTestReport:    () => import('./pages/PerformanceTestReport'),
  FinalEnterpriseSignOff:   () => import('./pages/FinalEnterpriseSignOff'),
  PageVisibilityAudit:      () => import('./pages/PageVisibilityAudit'),
  VerifyVIPAccess:          () => import('./pages/VerifyVIPAccess'),
  ContentRenderingAudit:    () => import('./pages/ContentRenderingAudit'),
  TestRealCustomerContent:  () => import('./pages/TestRealCustomerContent'),
  AuditAndFixContent:       () => import('./pages/AuditAndFixContent'),
  AuditTableRendering:      () => import('./pages/AuditTableRendering'),
  VIPTestCustomer:          () => import('./pages/VIPTestCustomer'),
  OTPEmailTest:             () => import('./pages/OTPEmailTest'),
  TestOTPLogin:             () => import('./pages/TestOTPLogin'),
  DebugOTPEmail:            () => import('./pages/DebugOTPEmail'),
  TestOTPEndToEnd:          () => import('./pages/TestOTPEndToEnd'),
  // Non-pages components
  SubscriptionRequestsTab:  () => import('./components/admin/SubscriptionRequestsTab'),
  MessagesTab:              () => import('./components/admin/MessagesTab'),
  // Audit
  HierarchyAuditPage:              () => import('./pages/HierarchyAuditPage'),
  MizaanPipelineTest:              () => import('./pages/MizaanPipelineTest'),
  MizaanAuditReport:               () => import('./pages/MizaanAuditReport'),
  IstintakRuleDiscovery:           () => import('./pages/IstintakRuleDiscovery'),
  ManuscriptPipelinePage:          () => import('./pages/ManuscriptPipelinePage'),
  AbjadBastAuditPage:              () => import('./pages/AbjadBastAuditPage'),
  MizanCalculationAudit:           () => import('./components/mizaan/MizanCalculationAudit'),
  MizanVefkAuditPage:              () => import('./pages/MizanVefkAuditPage'),
  MizanMethodClassification:       () => import('./pages/MizanMethodClassification'),
  MizanManuscriptVerification:     () => import('./pages/MizanManuscriptVerification'),
  MizanManuscriptAnalysis:         () => import('./pages/MizanManuscriptAnalysis'),
  MizanVefkModelVerification:      () => import('./pages/MizanVefkModelVerification'),
  MizanRubaiVerification:          () => import('./pages/MizanRubaiVerification'),
  MizanManuscriptAudit:            () => import('./pages/MizanManuscriptAudit'),
  ManuscriptAuditPage:             () => import('./pages/ManuscriptAuditPage'),
  ManuscriptActionFinder:          () => import('./pages/ManuscriptActionFinder'),
  ManuscriptLibraryPage:           () => import('./pages/ManuscriptLibraryPage'),
  ManuscriptFinalAudit:            () => import('./pages/ManuscriptFinalAudit'),
  AstrologyOnlyAudit:              () => import('./pages/AstrologyOnlyAudit'),
  ManuscriptRecordBrowser:         () => import('./pages/ManuscriptRecordBrowser'),
  ManuscriptRuleAudit:             () => import('./pages/ManuscriptRuleAudit'),
  ManuscriptAdvancedSearch:        () => import('./pages/ManuscriptAdvancedSearch'),
  ManazilQualityAudit:             () => import('./pages/ManazilQualityAudit'),
  ManuscriptCompletionReport:      () => import('./pages/ManuscriptCompletionReport'),
};

// ── Route factory — one lazy() + one <Route> per manifest entry ──────
function useRouteElements() {
  return useMemo(() => ROUTE_MANIFEST.map(entry => {
    const importFn = PAGE_IMPORTS[entry.chunk];
    if (!importFn) {
      console.warn(`[RouteManifest] No import for chunk: ${entry.chunk}`);
      return null;
    }
    const LazyPage = lazy(importFn);

    const isPublic  = entry.flags?.includes('public');
    const isNoAuth  = entry.flags?.includes('noauth');

    if (isNoAuth) {
      return <Route key={entry.path} path={entry.path} element={<LazyPage />} />;
    }

    return (
      <Route
        key={entry.path}
        path={entry.path}
        element={
          <ErrorBoundary>
            <ProtectedPage routePath={entry.path} requiresPermission={isPublic ? false : undefined}>
              <LazyPage />
            </ProtectedPage>
          </ErrorBoundary>
        }
      />
    );
  }).filter(Boolean), []);
}

// Minimal fallback — matches app background, no flash
const PageFallback = () => (
  <div style={{ minHeight: "60vh", background: "transparent" }} />
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated, navigateToLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const routeElements = useRouteElements();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Redirect unauthenticated users to onboarding (except auth pages and public pages)
  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated && !authError) {
      const publicAuthPaths = ['/onboarding', '/otp-login', '/login', '/register', '/forgot-password', '/reset-password'];
      const isAuthPath = publicAuthPaths.some(p => location.pathname.startsWith(p));
      const permConfig = getPageConfig(location.pathname);
      const isPublicPage = permConfig && permConfig.requiresPermission === false;
      const isSupportPath = location.pathname.startsWith('/support');
      if (!isAuthPath && !isPublicPage && !isSupportPath) {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [isLoadingAuth, isAuthenticated, authError, location.pathname, navigate]);

  useEffect(() => {
    if (authError?.type === 'auth_required') {
      navigate('/onboarding', { replace: true });
    }
  }, [authError, navigate]);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  if (authError?.type === 'auth_required') {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
        style={{ willChange: "opacity" }}
      >
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            {routeElements}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};


function App() {
  const [splashDone, setSplashDone] = useState(false);
  const { langSet } = useI18n();
  const [langSetupDone, setLangSetupDone] = useState(langSet);

  const showLanguageSetup = splashDone && !langSetupDone;

  if (showLanguageSetup) {
    return <LanguageSetup onComplete={() => setLangSetupDone(true)} />;
  }

  return (
    <>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <PageStateProvider>
              <NavigationProvider>
                <AuthenticatedApp />
              </NavigationProvider>
            </PageStateProvider>
          </Router>
          <Toaster />
          <PWAInstallPrompt />
          <OfflineNotice />
        </QueryClientProvider>
      </AuthProvider>
    </>
  )
}

export default App