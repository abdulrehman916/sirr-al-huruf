import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { resolveRole, ROLES } from '@/lib/rbac';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [role, setRole] = useState('guest');
  const [adminProfileLoading, setAdminProfileLoading] = useState(false);
  // Never block the app on loading — start as false so the app renders immediately
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);

  useEffect(() => {
    // ── Session-login gate (root fix) ──────────────────────────────
    // The app ALWAYS starts as GUEST. Owner/Admin role is granted ONLY
    // after an explicit login in the current session. A silent me()
    // (from a persisted/stale token) must NEVER auto-restore OWNER/ADMIN.
    // The flag is one-shot: consumed immediately on startup so a later
    // reload (not a login) stays guest, and WebView storage persistence
    // cannot resurrect an admin session after the app is closed.
    const justLoggedIn = (() => {
      try { return sessionStorage.getItem('sirr_admin_session') === 'true'; }
      catch { return false; }
    })();
    if (justLoggedIn) {
      try { sessionStorage.removeItem('sirr_admin_session'); } catch { /* ignore */ }
    }

    // Builder Preview runs inside an iframe (window.self !== window.top);
    // the published APK runs as the top-level window. Use this to separate
    // Preview auth (always elevate on a valid Owner token) from APK runtime
    // (session-gate: customers always start as guest after the Rules screen).
    const isBuilderPreview = (() => {
      try { return window.self !== window.top; } catch { return false; }
    })();

    base44.auth.me().then(u => {
      if (!u) return; // no token — stay guest
      // Builder Preview: always elevate on a valid token (original Owner-tab
      // behavior). Published APK: keep the session-gate — only elevate after an
      // explicit login this session, so customers always start as guest.
      if (!justLoggedIn && !isBuilderPreview) {
        return;
      }
      // ── Owner/Admin email verification ─────────────────────────────
      // Owner role is granted ONLY if the authenticated email matches
      // ADMIN_CONFIG.OWNER_EMAIL (resolveRole safety net) OR an AdminProfile
      // record exists for that email with is_owner === true. Any other email
      // — including a random Google account or a random Email/Password
      // account — is NEVER elevated to Owner/Admin and stays a Guest
      // (reading-code access only). This keeps the guest experience intact.
      if (u.role !== 'admin') {
        // Non-admin platform user: only the Owner-email safety net can grant Owner.
        const r = resolveRole(u, null);
        if (r === ROLES.OWNER) {
          setUser(u);
          setIsAuthenticated(true);
          setRole(r);
        }
        // else: unrecognized email — stay Guest (no Customer elevation).
        return;
      }
      // Platform admin — load AdminProfile to resolve admin vs owner vs inactive.
      setAdminProfileLoading(true);
      base44.entities.AdminProfile.filter({ email: u.email })
        .then((profiles) => {
          const ap = Array.isArray(profiles) && profiles.length > 0
            ? (profiles.find((p) => p.status === 'ACTIVE') || profiles[0])
            : null;
          const r = resolveRole(u, ap);
          if (r === ROLES.OWNER || r === ROLES.ADMIN) {
            setAdminProfile(ap);
            setUser(u);
            setIsAuthenticated(true);
            setRole(r);
          }
          // else: inactive / no AdminProfile — stay Guest (no elevation).
          setAdminProfileLoading(false);
        })
        .catch(() => {
          setAdminProfileLoading(false);
          // stay Guest
        });
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
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAdminProfile(null);
    setRole('guest');
    try { sessionStorage.removeItem('sirr_admin_session'); } catch { /* ignore */ }
    base44.auth.logout();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      adminProfile,
      role,
      adminProfileLoading,
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