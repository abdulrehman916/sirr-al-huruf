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
            <Route path="/" element={<Home />} />
            <Route path="/abjad" element={<AbjadKabirPage />} />
            <Route path="/anasir" element={<AnasirPage />} />
            <Route path="/hadim" element={<HadimPage />} />
            <Route path="/mizaan9" element={<Mizaan9Page />} />
            <Route path="/magic-sqayer" element={<MagicSqayerPage />} />
            <Route path="/vefkin-yapilisi" element={<VefkinYapilisiPage />} />
            <Route path="/basthul-huroof-2" element={<BastHuroofPage />} />
            <Route path="/faal-hasrath" element={<FaalHasrathPage />} />
            <Route path="/plants" element={<PlantsPage />} />
            <Route path="/plants/:id" element={<PlantDetailPage />} />
            <Route path="/evil-jinn" element={<EvilJinnPage />} />
            <Route path="/holy-names" element={<MagicalHolyNamesPage />} />
            <Route path="/admin/faal-chob-upload" element={<AdminFaalChobUpload />} />
            <Route path="/hierarchy-audit" element={<HierarchyAuditPage />} />
            <Route path="/pipeline-test" element={<MizaanPipelineTest />} />
            <Route path="/audit-report" element={<MizaanAuditReport />} />
            <Route path="/istintak-discovery" element={<IstintakRuleDiscovery />} />
            <Route path="/manuscript-pipeline" element={<ManuscriptPipelinePage />} />
            <Route path="/abjad-bast-audit" element={<AbjadBastAuditPage />} />
            <Route path="/mizan-calculation-audit" element={<MizanCalculationAudit />} />
            <Route path="/vefk-audit" element={<MizanVefkAuditPage />} />
            <Route path="/method-classification" element={<MizanMethodClassification />} />
            <Route path="/manuscript-verification" element={<MizanManuscriptVerification />} />
            <Route path="/manuscript-analysis" element={<MizanManuscriptAnalysis />} />
            <Route path="/vefk-model-verification" element={<MizanVefkModelVerification />} />
            <Route path="/rubai-verification" element={<MizanRubaiVerification />} />
            <Route path="/manuscript-audit" element={<MizanManuscriptAudit />} />


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