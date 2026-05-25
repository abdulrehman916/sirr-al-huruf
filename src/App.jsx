import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { NavigationProvider } from './context/NavigationContext';
import { AnimatePresence, motion } from 'framer-motion';
// Add page imports here
import Home from './pages/Home';
import AbjadPage from './pages/AbjadPage';
import AnasirPage from './pages/AnasirPage';
import HadimPage from './pages/HadimPage';
import Mizaan9Page from './pages/Mizaan9Page';
import AbjadKabirPage from './pages/AbjadKabirPage';
import MagicSqayerPage from './pages/MagicSqayerPage';
import VefkinYapilisiPage from './pages/VefkinYapilisiPage';

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
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/abjad" element={<AbjadKabirPage />} />
          <Route path="/anasir" element={<AnasirPage />} />
          <Route path="/hadim" element={<HadimPage />} />
          <Route path="/mizaan9" element={<Mizaan9Page />} />
          <Route path="/abjad-kabir" element={<AbjadKabirPage />} />
          <Route path="/magic-sqayer" element={<MagicSqayerPage />} />
          <Route path="/vefkin-yapilisi" element={<VefkinYapilisiPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationProvider>
            <AuthenticatedApp />
          </NavigationProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App