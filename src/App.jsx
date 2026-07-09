import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense, useMemo } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { NavigationProvider } from './context/NavigationContext';
import { PageStateProvider } from './context/PageStateContext';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import { I18nProvider } from '@/i18n/I18nContext';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineNotice from './components/OfflineNotice';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedPage from './components/ProtectedPage';
import ROUTE_MANIFEST from '@/lib/routeManifest';
import RulesGate from './components/RulesGate';
import GoogleSignInPrompt from './components/GoogleSignInPrompt';

// ── Lazy import map — Core pages only ──────
const PAGE_IMPORTS = {
  // Core
  Home:                     () => import('./pages/Home'),
  Onboarding:               () => import('./pages/Onboarding'),
  Login:                    () => import('./pages/Login'),
  ForgotPassword:           () => import('./pages/ForgotPassword'),
  ResetPassword:             () => import('./pages/ResetPassword'),
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
  HolyOnePage:              () => import('./pages/HolyOnePage'),
  HolyOneDetailPage:        () => import('./pages/HolyOneDetailPage'),
  AstroClockPage:           () => import('./pages/AstroClockPage'),
  AstroClockSearch:         () => import('./components/astroclock/AstroClockSearch'),
  SirrPage:                 () => import('./pages/SirrPage'),
  // Support
  CustomerService:          () => import('./pages/CustomerService'),
  SupportHub:               () => import('./pages/SupportHub'),
  SupportChat:              () => import('./pages/SupportChat'),
  SupportVoice:             () => import('./pages/SupportVoice'),
  SupportTicket:            () => import('./pages/SupportTicket'),
  WhatsAppSupport:          () => import('./pages/WhatsAppSupport'),
  // Subscriptions
  SubscriptionExpired:      () => import('./pages/SubscriptionExpired'),
  SubscriptionPending:      () => import('./pages/SubscriptionPending'),
  PremiumAccessRequest:     () => import('./pages/PremiumAccessRequest'),
  MySubscription:           () => import('./pages/MySubscription'),
  MyRequests:               () => import('./pages/MyRequests'),
  RedeemCodeApproval:       () => import('./pages/RedeemCodeApproval'),

  // Admin - Core 5 + Required
  AdminDashboard:           () => import('./pages/AdminDashboard'),
  ApprovedUsersPage:        () => import('./pages/ApprovedUsersPage'),
  AdminSupport:             () => import('./pages/AdminSupport'),
  PagePermissions:          () => import('./pages/PagePermissions'),
  AdminAccessCodes:         () => import('./pages/AdminAccessCodes'),
  AdminGoogleLinked:        () => import('./pages/AdminGoogleLinked'),
  CodeDetailPage:           () => import('./pages/CodeDetailPage'),
  AdminAccessRequests:      () => import('./pages/AdminAccessRequests'),
  AdminRedeemApprovals:     () => import('./pages/AdminRedeemApprovals'),
  AdminAccessLogs:          () => import('./pages/AdminAccessLogs'),
  AdminSettings:           () => import('./pages/AdminSettings'),
  AdminSystemSettings:     () => import('./pages/AdminSystemSettings'),
  AdminAnalytics:          () => import('./pages/AdminAnalytics'),
  AdminAdmins:              () => import('./pages/AdminAdmins'),
  UserDetailPage:           () => import('./pages/UserDetailPage'),
  AdminPDFContentEditor:    () => import('./pages/AdminPDFContentEditor'),
  AdminHolyNamesTranslator: () => import('./pages/AdminHolyNamesTranslator'),
  AdminFeaturePricing:      () => import('./pages/AdminFeaturePricing'),
  MizanCompletionTest:      () => import('./pages/MizanCompletionTest'),
  RulesConditions:          () => import('./pages/RulesConditions'),
  ShopPage:                 () => import('./pages/ShopPage'),
  ProductDetailPage:        () => import('./pages/ProductDetailPage'),
  AdminProducts:            () => import('./pages/AdminProducts'),
  AdminShopDashboard:       () => import('./pages/AdminShopDashboard'),
  AdminAuditLog:            () => import('./pages/AdminAuditLog'),
  AdminPurposeDictionary:   () => import('./pages/AdminPurposeDictionary'),
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
  const { isLoadingPublicSettings, isAuthenticated } = useAuth();
  const location = useLocation();
  const routeElements = useRouteElements();
  const [googlePromptDismissed, setGooglePromptDismissed] = useState(
    () => { try { return     localStorage.getItem('sirr_google_prompt_dismissed') === 'true'; } catch { return false; } }
  );

  // Hide the post-splash Google prompt once the user is signed in.
  useEffect(() => {
    if (isAuthenticated) setGooglePromptDismissed(true);
  }, [isAuthenticated]);

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  // No auth redirect — all pages are accessible without login.
  // Premium pages are gated by ProtectedPage with reading codes.

  if (isLoadingPublicSettings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#020710" }}>
        <div className="w-8 h-8 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
    {!isAuthenticated && !googlePromptDismissed && (
      <GoogleSignInPrompt onSkip={() => setGooglePromptDismissed(true)} />
    )}
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
    </>
  );
};


function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
      <I18nProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router>
              <PageStateProvider>
                <NavigationProvider>
                  <RulesGate>
                    <AuthenticatedApp />
                  </RulesGate>
                </NavigationProvider>
              </PageStateProvider>
            </Router>
            <Toaster />
            <PWAInstallPrompt />
            <OfflineNotice />
          </QueryClientProvider>
        </AuthProvider>
      </I18nProvider>
    </>
  )
}

export default App