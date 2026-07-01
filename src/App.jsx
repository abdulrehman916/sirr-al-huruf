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

// ── Lazy import map — Core pages only ──────
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
  HolyOnePage:              () => import('./pages/HolyOnePage'),
  HolyOneDetailPage:        () => import('./pages/HolyOneDetailPage'),
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
  PremiumAccessRequest:     () => import('./pages/PremiumAccessRequest'),
  MySubscription:           () => import('./pages/MySubscription'),
  PaymentPage:              () => import('./pages/PaymentPage'),
  // Admin - Core 5 + Required
  AdminDashboard:           () => import('./pages/AdminDashboard'),
  ApprovedUsersPage:        () => import('./pages/ApprovedUsersPage'),
  AdminSupport:             () => import('./pages/AdminSupport'),
  PagePermissions:          () => import('./pages/PagePermissions'),
  AdminAccessCodes:         () => import('./pages/AdminAccessCodes'),
  AdminAccessLogs:          () => import('./pages/AdminAccessLogs'),
  AdminSettings:           () => import('./pages/AdminSettings'),
  UserDetailPage:           () => import('./pages/UserDetailPage'),
  AdminPDFContentEditor:    () => import('./pages/AdminPDFContentEditor'),
  MizanCompletionTest:      () => import('./pages/MizanCompletionTest'),
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
  const { isLoadingPublicSettings } = useAuth();
  const location = useLocation();
  const routeElements = useRouteElements();

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

  return (
    <>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
      <I18nProvider>
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
      </I18nProvider>
    </>
  )
}

export default App