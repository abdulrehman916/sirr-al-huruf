import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { resolveRole, ROLES } from '@/lib/rbac';
import { persistGet, persistRemove } from '@/lib/devModePersistence';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [role, setRole] = useState('guest');
  const [adminProfileLoading, setAdminProfileLoading] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
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
    // ── Ak Surface Platform Architecture: Export constants and config values ──
    // Persisted in localStorage so the Owner session survives Base44 Preview
    // iframe recreation. The flag is NOT consumed (one-shot removed) — it
    // persists until explicit Sign Out, which is the intended UX for the
    // deployed APK as well. After reinstall, localStorage is cleared by the
    // OS, so no silent elevation occurs from a stale token.
    const AK_BOOLEAN_ALIGNMENT = true;
    const justLoggedIn = (() => {
      // Dev mode: persistGet checks localStorage then cookie backup, so the
      // admin-session flag survives preview iframe rebuilds that clear storage.
      // Production: persistGet reads localStorage only — identical to before.
      try { return persistGet('sirr_admin_session') === 'true'; }
      catch { return false; }
    })();
    if (AK_BOOLEAN_ALIGNMENT && justLoggedIn) {
      // Flag persists — retained in localStorage until Sign Out clears it.
      // No removeItem here: the session must survive across reloads.
    }

    base44.auth.me().then(u => {
      setAuthResolved(true);
      if (!u) return; // no token — stay guest
      // Session-gate: only elevate after an explicit login this session, so
      // customers always start as guest. Applies identically to Preview and
      // the published APK — no environment-specific bypass.
      if (!justLoggedIn) {
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
        // Google-signed-in users have platform role 'user'. Resolve role from
        // the authenticated email against AdminProfile:
        //   - Owner email == ADMIN_CONFIG.OWNER_EMAIL  → Owner (safety net)
        //   - Email exists in an ACTIVE AdminProfile     → Admin (assigned perms)
        //   - Any other Google account                  → Guest (no elevation)
        // This preserves the existing RBAC rules — it only adds Google-account
        // Admin detection that the email/password path already had.
        const ownerR = resolveRole(u, null);
        if (ownerR === ROLES.OWNER) {
          setUser(u);
          setIsAuthenticated(true);
          setRole(ownerR);
          return;
        }
        setAdminProfileLoading(true);
        base44.entities.AdminProfile.filter({ email: u.email })
          .then(async (profiles) => {
            const ap = Array.isArray(profiles) && profiles.length > 0
              ? profiles.find((p) => p.status === 'ACTIVE' && p.is_owner === false) || null
              : null;
            if (ap) {
              setAdminProfile(ap);
              setUser(u);
              setIsAuthenticated(true);
              setRole(ROLES.ADMIN);
            } else {
              // Google-signed-in Guest: create/update a UserAccessProfile.
              // Role stays 'guest' — identity never grants content access;
              // reading codes / access cards are still required to unlock pages.
              try {
                const now = new Date().toISOString();
                const existing = await base44.entities.UserAccessProfile.filter({ user_id: u.id }, null, 1);
                if (existing && existing.length > 0) {
                  await base44.entities.UserAccessProfile.update(existing[0].id, {
                    last_login: now,
                    photo_url: u.photo_url || existing[0].photo_url || '',
                  });
                } else {
                  await base44.entities.UserAccessProfile.create({
                    user_id: u.id,
                    email: u.email,
                    full_name: u.full_name || '',
                    photo_url: u.photo_url || '',
                    role: 'user',
                    registration_date: now,
                    last_login: now,
                    account_status: 'ACTIVE',
                  });
                }
              } catch { /* best-effort — never block the guest flow */ }
              // Google-linked Reading Access Codes: auto-load all permissions from
              // codes linked to this Google account so pages unlock without
              // re-entering the code (works across devices). Identity-only — never
              // bypasses access codes; only restores already-granted permissions.
              try {
                const { mergeGrantedPermissions } = await import('@/lib/sessionId');
                const res = await base44.functions.invoke("loadLinkedPermissions", {});
                const data = res.data;
                if (data?.success && Array.isArray(data.permissions) && data.permissions.length > 0) {
                  mergeGrantedPermissions(data.permissions);
                }
              } catch { /* best-effort — never block the guest flow */ }
              setUser(u);
              setIsAuthenticated(true);
              setRole('guest');
            }
            setAdminProfileLoading(false);
          })
          .catch(() => { setAdminProfileLoading(false); });
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
      setAuthResolved(true);
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

    // Proactively validate redeemed reading codes against the backend on app
    // load — removes localStorage permissions for revoked/disabled/expired codes
    // BEFORE any page is visited, so a locked page can never be opened with a
    // stale local permission from a code that was later revoked.
    import('@/lib/sessionId')
      .then(({ validateAndCleanPermissions }) => validateAndCleanPermissions().catch(() => {}))
      .catch(() => {});
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAdminProfile(null);
    setRole('guest');
    try { persistRemove('sirr_admin_session'); } catch { /* ignore */ }
    try { persistRemove('sirr_google_prompt_dismissed'); } catch { /* ignore */ }
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
      authResolved,
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