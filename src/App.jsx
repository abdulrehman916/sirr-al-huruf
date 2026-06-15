import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { NavigationProvider } from './context/NavigationContext';
import { PageStateProvider } from './context/PageStateContext';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineNotice from './components/OfflineNotice';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedPage from './components/ProtectedPage';
// Add page imports here — lazy loaded for performance
import Home from './pages/Home';

const AnasirPage        = lazy(() => import('./pages/AnasirPage'));
const HadimPage         = lazy(() => import('./pages/HadimPage'));
const Mizaan9Page       = lazy(() => import('./pages/Mizaan9Page'));
const AbjadKabirPage    = lazy(() => import('./pages/AbjadKabirPage'));
const MagicSqayerPage   = lazy(() => import('./pages/MagicSqayerPage'));
const VefkinYapilisiPage= lazy(() => import('./pages/VefkinYapilisiPage'));
const BastHuroofPage    = lazy(() => import('./pages/BastHuroofPage'));
const FaalHasrathPage   = lazy(() => import('./pages/FaalHasrathPage'));
const PlantsPage        = lazy(() => import('./pages/PlantsPage.jsx'));
const PlantDetailPage   = lazy(() => import('./pages/PlantDetailPage'));
const EvilJinnPage          = lazy(() => import('./pages/EvilJinnPage.jsx'));
const MagicalHolyNamesPage  = lazy(() => import('./pages/MagicalHolyNamesPage'));
const AdminFaalChobUpload   = lazy(() => import('./pages/AdminFaalChobUpload'));
const AstroClockPage        = lazy(() => import('./pages/AstroClockPage'));
const HierarchyAuditPage    = lazy(() => import('./pages/HierarchyAuditPage.jsx'));
const MizaanPipelineTest    = lazy(() => import('./pages/MizaanPipelineTest'));
const MizaanAuditReport        = lazy(() => import('./pages/MizaanAuditReport'));
const IstintakRuleDiscovery    = lazy(() => import('./pages/IstintakRuleDiscovery'));
const ManuscriptPipelinePage   = lazy(() => import('./pages/ManuscriptPipelinePage'));
const AbjadBastAuditPage       = lazy(() => import('./pages/AbjadBastAuditPage'));
const MizanCalculationAudit    = lazy(() => import('./components/mizaan/MizanCalculationAudit'));
const MizanVefkAuditPage       = lazy(() => import('./pages/MizanVefkAuditPage'));
const MizanMethodClassification = lazy(() => import('./pages/MizanMethodClassification'));
const MizanManuscriptAnalysis = lazy(() => import('./pages/MizanManuscriptAnalysis'));
const MizanVefkModelVerification = lazy(() => import('./pages/MizanVefkModelVerification'));
const MizanRubaiVerification = lazy(() => import('./pages/MizanRubaiVerification'));
const MizanManuscriptVerification = lazy(() => import('./pages/MizanManuscriptVerification'));
const MizanManuscriptAudit = lazy(() => import('./pages/MizanManuscriptAudit'));
const ManuscriptAuditPage = lazy(() => import('./pages/ManuscriptAuditPage'));
const ManuscriptActionFinder = lazy(() => import('./pages/ManuscriptActionFinder'));
const ManuscriptLibraryPage = lazy(() => import('./pages/ManuscriptLibraryPage'));
const ManuscriptFinalAudit = lazy(() => import('./pages/ManuscriptFinalAudit'));
const AstrologyOnlyAudit = lazy(() => import('./pages/AstrologyOnlyAudit'));
const ManuscriptRecordBrowser = lazy(() => import('./pages/ManuscriptRecordBrowser'));
const ManuscriptRuleAudit = lazy(() => import('./pages/ManuscriptRuleAudit'));
const ManuscriptAdvancedSearch = lazy(() => import('./pages/ManuscriptAdvancedSearch'));
const ManazilQualityAudit = lazy(() => import('./pages/ManazilQualityAudit'));
const ManuscriptCompletionReport = lazy(() => import('./pages/ManuscriptCompletionReport'));
const CustomerService = lazy(() => import('./pages/CustomerService'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminTest = lazy(() => import('./pages/AdminTest'));
const AdminSupport = lazy(() => import('./pages/AdminSupport'));
const AdminPermissions = lazy(() => import('./pages/AdminPermissions'));
const PagePermissions = lazy(() => import('./pages/PagePermissions'));
const AdminSubscriptions = lazy(() => import('./pages/AdminSubscriptions'));
const AdminPageSubscriptions = lazy(() => import('./pages/AdminPageSubscriptions'));
const AdminPricingSettings = lazy(() => import('./pages/AdminPricingSettings.jsx'));
const SubscriptionExpired = lazy(() => import('./pages/SubscriptionExpired'));
const OTPLogin = lazy(() => import('./pages/OTPLogin'));
const SubscriptionPayment = lazy(() => import('./pages/SubscriptionPayment'));
const SubscriptionPending = lazy(() => import('./pages/SubscriptionPending'));
const AdminSubscriptionsManagement = lazy(() => import('./pages/AdminSubscriptionsManagement'));
const RazorpayPayment = lazy(() => import('./pages/RazorpayPayment'));
const AdminUserManager = lazy(() => import('./pages/AdminUserManager'));
const AdminUserManagement = lazy(() => import('./pages/AdminUserManagement'));
const AdminAccessLogs = lazy(() => import('./pages/AdminAccessLogs'));


// Minimal fallback — matches app background, no flash
const PageFallback = () => (
  <div style={{ minHeight: "60vh", background: "transparent" }} />
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (authError?.type === 'auth_required') {
      navigateToLogin();
    }
  }, [authError, navigateToLogin]);

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
            <Route path="/" element={<ProtectedPage routePath="/"><Home /></ProtectedPage>} />
            <Route path="/abjad" element={<ProtectedPage routePath="/abjad"><AbjadKabirPage /></ProtectedPage>} />
            <Route path="/anasir" element={<ProtectedPage routePath="/anasir"><AnasirPage /></ProtectedPage>} />
            <Route path="/hadim" element={<ProtectedPage routePath="/hadim"><HadimPage /></ProtectedPage>} />
            <Route path="/mizaan9" element={<ProtectedPage routePath="/mizaan9"><Mizaan9Page /></ProtectedPage>} />
            <Route path="/magic-sqayer" element={<ProtectedPage routePath="/magic-sqayer"><MagicSqayerPage /></ProtectedPage>} />
            <Route path="/vefkin-yapilisi" element={<ProtectedPage routePath="/vefkin-yapilisi"><VefkinYapilisiPage /></ProtectedPage>} />
            <Route path="/basthul-huroof-2" element={<ProtectedPage routePath="/basthul-huroof-2"><BastHuroofPage /></ProtectedPage>} />
            <Route path="/faal-hasrath" element={<ProtectedPage routePath="/faal-hasrath"><FaalHasrathPage /></ProtectedPage>} />
            <Route path="/plants" element={<ProtectedPage routePath="/plants"><PlantsPage /></ProtectedPage>} />
            <Route path="/plants/:id" element={<ProtectedPage routePath="/plants/:id"><PlantDetailPage /></ProtectedPage>} />
            <Route path="/evil-jinn" element={<ProtectedPage routePath="/evil-jinn"><EvilJinnPage /></ProtectedPage>} />
            <Route path="/holy-names" element={<ProtectedPage routePath="/holy-names"><MagicalHolyNamesPage /></ProtectedPage>} />
            <Route path="/astro-clock" element={<ProtectedPage routePath="/astro-clock"><AstroClockPage /></ProtectedPage>} />
            <Route path="/admin/faal-chob-upload" element={<ProtectedPage routePath="/admin/faal-chob-upload"><AdminFaalChobUpload /></ProtectedPage>} />
            <Route path="/hierarchy-audit" element={<ProtectedPage routePath="/hierarchy-audit"><HierarchyAuditPage /></ProtectedPage>} />
            <Route path="/pipeline-test" element={<ProtectedPage routePath="/pipeline-test"><MizaanPipelineTest /></ProtectedPage>} />
            <Route path="/audit-report" element={<ProtectedPage routePath="/audit-report"><MizaanAuditReport /></ProtectedPage>} />
            <Route path="/istintak-discovery" element={<ProtectedPage routePath="/istintak-discovery"><IstintakRuleDiscovery /></ProtectedPage>} />
            <Route path="/manuscript-pipeline" element={<ProtectedPage routePath="/manuscript-pipeline"><ManuscriptPipelinePage /></ProtectedPage>} />
            <Route path="/abjad-bast-audit" element={<ProtectedPage routePath="/abjad-bast-audit"><AbjadBastAuditPage /></ProtectedPage>} />
            <Route path="/mizan-calculation-audit" element={<ProtectedPage routePath="/mizan-calculation-audit"><MizanCalculationAudit /></ProtectedPage>} />
            <Route path="/vefk-audit" element={<ProtectedPage routePath="/vefk-audit"><MizanVefkAuditPage /></ProtectedPage>} />
            <Route path="/method-classification" element={<ProtectedPage routePath="/method-classification"><MizanMethodClassification /></ProtectedPage>} />
            <Route path="/manuscript-verification" element={<ProtectedPage routePath="/manuscript-verification"><MizanManuscriptVerification /></ProtectedPage>} />
            <Route path="/manuscript-analysis" element={<ProtectedPage routePath="/manuscript-analysis"><MizanManuscriptAnalysis /></ProtectedPage>} />
            <Route path="/vefk-model-verification" element={<ProtectedPage routePath="/vefk-model-verification"><MizanVefkModelVerification /></ProtectedPage>} />
            <Route path="/rubai-verification" element={<ProtectedPage routePath="/rubai-verification"><MizanRubaiVerification /></ProtectedPage>} />
            <Route path="/manuscript-audit" element={<ProtectedPage routePath="/manuscript-audit"><MizanManuscriptAudit /></ProtectedPage>} />
            <Route path="/manuscript-audit-full" element={<ProtectedPage routePath="/manuscript-audit-full"><ManuscriptAuditPage /></ProtectedPage>} />
            <Route path="/manuscript-action-finder" element={<ProtectedPage routePath="/manuscript-action-finder"><ManuscriptActionFinder /></ProtectedPage>} />
            <Route path="/manuscript-library" element={<ProtectedPage routePath="/manuscript-library"><ManuscriptLibraryPage /></ProtectedPage>} />
            <Route path="/manuscript-final-audit" element={<ProtectedPage routePath="/manuscript-final-audit"><ManuscriptFinalAudit /></ProtectedPage>} />
            <Route path="/astrology-only-audit" element={<ProtectedPage routePath="/astrology-only-audit"><AstrologyOnlyAudit /></ProtectedPage>} />
            <Route path="/manuscript-browser" element={<ProtectedPage routePath="/manuscript-browser"><ManuscriptRecordBrowser /></ProtectedPage>} />
            <Route path="/manuscript-rule-audit" element={<ProtectedPage routePath="/manuscript-rule-audit"><ManuscriptRuleAudit /></ProtectedPage>} />
            <Route path="/manuscript-search" element={<ProtectedPage routePath="/manuscript-search"><ManuscriptAdvancedSearch /></ProtectedPage>} />
            <Route path="/manazil-quality-audit" element={<ProtectedPage routePath="/manazil-quality-audit"><ManazilQualityAudit /></ProtectedPage>} />
            <Route path="/manuscript-completion-report" element={<ProtectedPage routePath="/manuscript-completion-report"><ManuscriptCompletionReport /></ProtectedPage>} />
            <Route path="/customer-service" element={<ProtectedPage routePath="/customer-service"><CustomerService /></ProtectedPage>} />
            <Route path="/admin/dashboard" element={<ProtectedPage routePath="/admin/dashboard"><AdminDashboard /></ProtectedPage>} />
            <Route path="/admin/test" element={<ProtectedPage routePath="/admin/test" requiresPermission={false}><AdminTest /></ProtectedPage>} />
            <Route path="/admin/support" element={<ProtectedPage routePath="/admin/support"><AdminSupport /></ProtectedPage>} />
            <Route path="/admin/permissions" element={<ProtectedPage routePath="/admin/permissions" requiresPermission={false}><AdminPermissions /></ProtectedPage>} />
            <Route path="/admin/page-permissions" element={<ProtectedPage routePath="/admin/page-permissions"><PagePermissions /></ProtectedPage>} />
            <Route path="/admin/subscriptions" element={<ProtectedPage routePath="/admin/subscriptions"><AdminSubscriptions /></ProtectedPage>} />
            <Route path="/admin/page-subscriptions" element={<ProtectedPage routePath="/admin/page-subscriptions" requiresPermission={false}><AdminPageSubscriptions /></ProtectedPage>} />
            <Route path="/admin/pricing-settings" element={<ProtectedPage routePath="/admin/pricing-settings" requiresPermission={false}><AdminPricingSettings /></ProtectedPage>} />
            <Route path="/subscription-expired" element={<ProtectedPage routePath="/subscription-expired" requiresPermission={false}><SubscriptionExpired /></ProtectedPage>} />
            <Route path="/otp-login" element={<ProtectedPage routePath="/otp-login" requiresPermission={false}><OTPLogin /></ProtectedPage>} />
            <Route path="/subscription-payment/:pagePath" element={<ProtectedPage routePath="/subscription-payment/:pagePath"><RazorpayPayment /></ProtectedPage>} />
            <Route path="/subscription-pending" element={<ProtectedPage routePath="/subscription-pending"><SubscriptionPending /></ProtectedPage>} />
            <Route path="/admin/user-manager" element={<ProtectedPage routePath="/admin/user-manager"><AdminUserManager /></ProtectedPage>} />
            <Route path="/admin/user-management" element={<ProtectedPage routePath="/admin/user-management" requiresPermission={false}><AdminUserManagement /></ProtectedPage>} />
            <Route path="/admin/access-logs" element={<ProtectedPage routePath="/admin/access-logs" requiresPermission={false}><AdminAccessLogs /></ProtectedPage>} />
            <Route path="/admin/subscriptions-management" element={<ProtectedPage routePath="/admin/subscriptions-management"><AdminSubscriptionsManagement /></ProtectedPage>} />


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