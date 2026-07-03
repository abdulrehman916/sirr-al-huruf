import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Never block the app on loading — start as false so the app renders immediately
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);

  useEffect(() => {
    // Silently check if an admin token exists — never block the app
    base44.auth.me().then(u => {
      if (u) { setUser(u); setIsAuthenticated(true); }
    }).catch(() => {
      // No token / expired — that's fine, proceed as guest
    });

    // Auto-sync page visibility on app load (fire-and-forget, non-blocking).
    // Ensures new routes from routeManifest are registered in PageVisibilityConfig
    // so they appear in all page selectors without manual admin work.
    import('@/lib/pageSync')
      .then(({ syncPages }) => syncPages().catch(() => {}))
      .catch(() => {});

    // Auto-sync module registry on app load (fire-and-forget, non-blocking).
    // Ensures new features/methods/sections from moduleManifest are registered
    // in FeatureConfig so they appear in all feature selectors without manual work.
    import('@/lib/moduleSync')
      .then(({ syncModules }) => syncModules().catch(() => {}))
      .catch(() => {});

    // Auto-sync entity registry on app load (fire-and-forget, non-blocking).
    // Ensures all entities from entityManifest are registered in EntityRegistry
    // so they appear in Admin Entity Manager, Analytics, and Audit selectors.
    import('@/lib/entitySync')
      .then(({ syncEntities }) => syncEntities().catch(() => {}))
      .catch(() => {});
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    base44.auth.logout();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth: false,
      isLoadingPublicSettings,
      authError: null,
      appPublicSettings: null,
      authChecked: true,
      logout,
      navigateToLogin: () => {},
      checkUserAuth: async () => {},
      checkAppState: async () => {},
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};