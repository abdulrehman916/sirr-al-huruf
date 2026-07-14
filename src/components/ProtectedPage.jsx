import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Lock, MessageCircle, KeyRound, Loader2, CheckCircle, AlertCircle, Shield } from "lucide-react";
import { getPageConfig, isPublicPage } from "@/lib/pageRegistry";
import { getCached, setCached, visibilityKey } from "@/lib/permissionCache";
import { checkLocalPermission, getSessionId, mergeGrantedPermissions, validateAndCleanPermissions, addRedeemedCode } from "@/lib/sessionId";
import { ADMIN_CONFIG } from "@/lib/adminConfig";
import { setAdminFlag } from "@/lib/featurePermission";
import { useAuth } from "@/lib/AuthContext";
import { ROLES, isAdminRole, canAccessAdminRoute, getAdminHomePath } from "@/lib/rbac";
import { hasSubFeatures } from "@/lib/featureRegistry";
import { preloadPageFeatureConfigs } from "@/lib/featureConfigCache";
import WhatsAppAccessRequest from "@/components/WhatsAppAccessRequest";
import RequestAccessModal from "@/components/RequestAccessModal";
import { useTranslation } from "@/i18n/useTranslation";
import { isDevMode, persistSet, persistRemove } from "@/lib/devModePersistence";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
};

const GoogleMark = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.6 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.6 4.5 24 4.5 16 4.5 9.1 9.1 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 43.5c5.5 0 10.5-2 14.3-5.3l-6.6-5.5C29.6 34.6 26.9 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9 38.9 16 43.5 24 43.5z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.6 5.5c-.5.4 6.6-4.8 6.6-14.5 0-1.2-.1-2.3-.4-3.5z" />
  </svg>
);

export default function ProtectedPage({ routePath, children, requiresPermission }) {
  const { role, adminProfile, adminProfileLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [accessStatus, setAccessStatus] = useState("checking");
  const [pageName, setPageName] = useState("");

  // Post-signin redirect: when a Guest signs in via Google from a locked
  // page, send Owner → Owner Dashboard, Admin → Admin Dashboard. Guests
  // stay on the locked page (still need an access code). This does NOT
  // change access-control — it is a one-shot convenience redirect.
  useEffect(() => {
    let flag = null;
    try { flag = sessionStorage.getItem("sirr_locked_signin_redirect"); } catch { /* ignore */ }
    if (!flag) return;
    if (role === ROLES.OWNER || role === ROLES.ADMIN) {
      try { sessionStorage.removeItem("sirr_locked_signin_redirect"); } catch { /* ignore */ }
      navigate(getAdminHomePath(role), { replace: true });
    } else if (isAuthenticated) {
      try { sessionStorage.removeItem("sirr_locked_signin_redirect"); } catch { /* ignore */ }
    }
  }, [role, isAuthenticated, navigate]);

  const checkAccess = useCallback(async () => {
    // Reset admin flag at start — will be set to true if admin is detected below
    setAdminFlag(false);

    // 0. Owner universal bypass — the Owner never sees any lock, premium
    //    screen, reading-code page, or access restriction anywhere in the app.
    //    Sets the admin flag so feature-level checks (Methods/Sections) also pass.
    if (role === ROLES.OWNER) {
      setAdminFlag(true);
      setAccessStatus("granted");
      return;
    }

    // 0.5 Dev-mode session-restore safety net — the Base44 Preview is always
    //     the project Owner. On every rebuild the iframe storage is wiped; the
    //     token cookie-restore (app-params.js) brings the session back, but
    //     auth resolution is async. This grants immediately while auth is
    //     pending (or if the restored token has expired) so NO Google Sign-In,
    //     admin-login, or Terms screen ever flashes on refresh/rebuild.
    //     Production is completely unaffected — isDevMode is false in prod
    //     builds, so this branch never runs for real customers.
    if (isDevMode && !isAuthenticated) {
      setAdminFlag(true);
      setAccessStatus("granted");
      return;
    }

    // 1. Admin-only pages — RBAC role check (runs before DB/static so admin
    //    pages are governed by RBAC, not PageVisibilityConfig).
    const config = getPageConfig(routePath);
    if (config?.adminOnly || routePath.startsWith("/admin/")) {
      // Wait for admin profile to resolve before deciding (avoids wrong-screen flash).
      if (adminProfileLoading) { setAccessStatus("checking"); return; }
      if (isAdminRole(role) && canAccessAdminRoute(role, routePath, adminProfile)) {
        setAdminFlag(true);
        setAccessStatus("granted");
        return;
      }
      // Not an admin at all → admin login prompt; wrong section → forbidden.
      setAccessStatus(isAdminRole(role) ? "forbidden" : "admin_only");
      return;
    }

    // 2. DB visibility config — AUTHORITATIVE lock check (cached 2 min).
    //    The admin's PageVisibilityConfig.requires_permission is the source of
    //    truth for whether a page is locked. This MUST be checked before the
    //    static public flags below — otherwise a statically-public page (e.g.
    //    /shop) stays accessible even after the admin locks it in the DB, and
    //    the lock is only visual. dbState: 'locked' | 'public' | 'none'.
    const visKey = visibilityKey(routePath);
    let dbState = getCached(visKey);
    if (dbState === null || dbState === undefined) {
      try {
        const dbConfigs = await base44.entities.PageVisibilityConfig.filter(
          { page_path: routePath, archived: false }, null, 1
        );
        if (dbConfigs.length > 0) {
          dbState = dbConfigs[0].requires_permission ? 'locked' : 'public';
        } else {
          dbState = 'none';
        }
        setCached(visKey, dbState);
      } catch {
        dbState = 'none';
        setCached(visKey, 'none', 30000);
      }
    }
    const dbLocked = dbState === 'locked';

    // 3. DB explicitly says public → grant
    if (dbState === 'public') {
      setAccessStatus("granted");
      return;
    }

    // 4. Static public override (routeManifest flag + registry) — ONLY when the
    //    DB hasn't explicitly locked the page. Preserves the fast-path for
    //    genuinely public pages while enforcing the admin's DB lock.
    if (!dbLocked) {
      if (requiresPermission === false) { setAccessStatus("granted"); return; }
      if (isPublicPage(routePath)) { setAccessStatus("granted"); return; }
    }

    // 5. Multi-feature pages are containers. If the DB hasn't locked the page,
    //    the container is always accessible (child features lock individually
    //    via checkFeatureAccess). If the DB HAS locked the page, the container
    //    opens only when the user has a valid page-level permission (reading
    //    code) — otherwise the locked screen is shown (enforce the lock).
    if (hasSubFeatures(routePath)) {
      await preloadPageFeatureConfigs(routePath);
      if (!dbLocked || checkLocalPermission(routePath).granted) {
        setAccessStatus("granted");
        validateAndCleanPermissions();
        return;
      }
      // DB-locked multi-feature page with no permission → fall through to locked
    }

    // 6. Authenticated admin bypass (content pages too) — owner + admin only
    if (role === ROLES.OWNER || role === ROLES.ADMIN) {
      setAdminFlag(true);
      setAccessStatus("granted");
      return;
    }

    // 7. Local permission check (localStorage — reading code, no auth needed)
    const localCheck = checkLocalPermission(routePath);
    if (localCheck.granted) {
      setAccessStatus("granted");
      return;
    }

    setAccessStatus("locked");

    // Background validation — removes permissions for revoked/disabled/expired codes
    validateAndCleanPermissions();
  }, [routePath, requiresPermission, role, adminProfile, adminProfileLoading, isAuthenticated]);

  useEffect(() => {
    const config = getPageConfig(routePath);
    setPageName(config?.name || routePath.replace(/^\//, "").replace(/-/g, " "));
    checkAccess();
  }, [routePath, checkAccess]);

  if (accessStatus === "checking") {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ minHeight: "60vh" }}>
        <div className="w-10 h-10 border-4 border-t-yellow-400 border-r-transparent border-b-yellow-400 border-l-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (accessStatus === "admin_only") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "linear-gradient(180deg, #020710 0%, #050d1a 30%, #08101f 100%)" }}>
        <div className="w-full max-w-sm space-y-4 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <Shield className="w-8 h-8" style={{ color: G.text }} />
          </div>
          <h2 className="font-inter font-bold text-white text-lg">{t("admin_access_required", "Admin Access Required")}</h2>
          <p className="font-inter text-sm text-white/40">{t("admin_restricted", "This page is restricted to administrators only.")}</p>
          <a href="/login"
            className="block w-full py-3 rounded-xl font-inter font-bold text-sm text-center"
            style={{ background: "linear-gradient(135deg, #f6d860 0%, #c98a14 100%)", color: "#0d1b2a" }}>
            {t("admin_login", "Admin Login")}
          </a>
          <button onClick={() => window.location.href = "/"}
            className="w-full py-2.5 rounded-xl font-inter font-semibold text-xs"
            style={{ background: "transparent", border: `1px solid rgba(255,255,255,0.10)`, color: "rgba(255,255,255,0.35)" }}>
            {t("back_to_home", "← Back to Home")}
          </button>
        </div>
      </div>
    );
  }

  if (accessStatus === "forbidden") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "linear-gradient(180deg, #020710 0%, #050d1a 30%, #08101f 100%)" }}>
        <div className="w-full max-w-sm space-y-4 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <Shield className="w-8 h-8" style={{ color: G.text }} />
          </div>
          <h2 className="font-inter font-bold text-white text-lg">{t("access_restricted_title", "Access Restricted")}</h2>
          <p className="font-inter text-sm text-white/40">{t("access_restricted_desc", "Your role does not have access to this section.")}</p>
          <button onClick={() => window.location.href = "/"}
            className="w-full py-2.5 rounded-xl font-inter font-semibold text-xs"
            style={{ background: "transparent", border: `1px solid rgba(255,255,255,0.10)`, color: "rgba(255,255,255,0.35)" }}>
            {t("back_to_home", "← Back to Home")}
          </button>
        </div>
      </div>
    );
  }

  if (accessStatus === "granted") return children;

  return (
    <PremiumLockedScreen
      pageName={pageName}
      routePath={routePath}
      onUnlocked={() => setAccessStatus("granted")}
    />
  );
}

// ── Premium locked screen ──────────────────────────────────────────────────────
function PremiumLockedScreen({ pageName, routePath, onUnlocked }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeResult, setCodeResult] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google Sign-In for Guests — identity + return to this exact page.
  // After the redirect, checkAccess re-runs automatically; if an active
  // Redeem Code exists in this session, the page opens immediately.
  // Otherwise the authenticated "no access" dialog is shown below.
  const handleGoogle = async () => {
    setGoogleLoading(true);
    // Dev mode: persistSet writes localStorage + cookie so the session flag
    // survives preview iframe rebuilds. Production: sessionStorage (unchanged).
    try { isDevMode ? persistSet("sirr_admin_session", "true") : sessionStorage.setItem("sirr_admin_session", "true"); } catch { /* ignore */ }
    try { sessionStorage.setItem("sirr_locked_signin_redirect", routePath); } catch { /* ignore */ }
    try {
      await base44.auth.loginWithProvider("google", routePath);
    } catch {
      setGoogleLoading(false);
      try { isDevMode ? persistRemove("sirr_admin_session") : sessionStorage.removeItem("sirr_admin_session"); } catch { /* ignore */ }
      try { sessionStorage.removeItem("sirr_locked_signin_redirect"); } catch { /* ignore */ }
    }
  };

  const handleRedeem = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setCodeResult(null);
    try {
      const sessionId = getSessionId();
      const res = await base44.functions.invoke("redeemCodeLinked", {
        code: trimmed,
        session_id: sessionId,
      });
      const data = res.data;
      if (data?.success && data?.permissions) {
        addRedeemedCode(trimmed);
        mergeGrantedPermissions(data.permissions);
        setCodeResult({ success: true, message: data.message });
        // Re-check permissions and open the originally requested page.
        setTimeout(() => onUnlocked(), 1000);
      } else {
        setCodeResult({ success: false, message: data?.message || t("invalid_code", "Invalid code.") });
      }
    } catch (e) {
      setCodeResult({ success: false, message: e.message || t("redemption_failed", "Redemption failed.") });
    } finally {
      setLoading(false);
    }
  };

  // ── State 1: Guest (not authenticated) → require Google Sign-In ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "linear-gradient(180deg, #020710 0%, #050d1a 30%, #08101f 100%)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-4">
          <div className="rounded-2xl border p-8 text-center" style={{
            background: G.bg, borderColor: G.border, boxShadow: "0 0 48px rgba(212,175,55,0.10)",
          }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: G.bgHi, border: `1px solid ${G.border}` }}>
              <Lock className="w-8 h-8" style={{ color: G.text }} />
            </div>
            <h1 className="font-inter text-lg font-bold mb-2" style={{ color: G.text }}>{pageName}</h1>
            <p className="font-inter text-sm text-white/60 mb-6">
              {t("premium_account_required", "This page requires an account. Please sign in with Google to continue.")}
            </p>
            <button onClick={handleGoogle} disabled={googleLoading}
              className="w-full py-3.5 rounded-xl font-inter font-bold text-sm flex items-center justify-center gap-2 mb-3 disabled:opacity-50"
              style={{ background: "#ffffff", color: "#0d1b2a" }}>
              {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleMark className="w-4 h-4" />}
              {googleLoading ? t("google_redirecting", "Redirecting…") : t("google_continue", "Continue with Google")}
            </button>
            <button onClick={() => navigate("/")}
              className="w-full py-2.5 rounded-xl font-inter font-semibold text-xs"
              style={{ background: "transparent", border: `1px solid rgba(255,255,255,0.10)`, color: "rgba(255,255,255,0.35)" }}>
              {t("btn_cancel", "Cancel")}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── State 2: Authenticated but no active access ──
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(180deg, #020710 0%, #050d1a 30%, #08101f 100%)" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-4">
        <div className="rounded-2xl border p-8 text-center" style={{
          background: G.bg, borderColor: G.border, boxShadow: "0 0 48px rgba(212,175,55,0.10)",
        }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: G.bgHi, border: `1px solid ${G.border}` }}>
            <Lock className="w-8 h-8" style={{ color: G.text }} />
          </div>
          <h1 className="font-inter text-lg font-bold mb-2" style={{ color: G.text }}>{pageName}</h1>
          <p className="font-inter text-sm text-white/60 mb-6">{t("premium_no_access", "You don't have access to this premium content.")}</p>

          <button onClick={() => setShowCodeEntry(v => !v)}
            className="w-full py-3.5 rounded-xl font-inter font-bold text-sm flex items-center justify-center gap-2 mb-3"
            style={{ background: "linear-gradient(135deg, #f6d860 0%, #c98a14 100%)", color: "#0d1b2a" }}>
            <KeyRound className="w-4 h-4" />
            {t("enter_reading_code", "Enter Reading Access Code")}
          </button>

          {/* ── Request access: WhatsApp + in-app form (original workflow) ── */}
          <div className="mb-3">
            <WhatsAppAccessRequest pageName={pageName} routePath={routePath} />
          </div>

          <button onClick={() => setShowRequestModal(true)}
            className="w-full py-3 rounded-xl font-inter font-semibold text-sm flex items-center justify-center gap-2 mb-3"
            style={{ background: "rgba(212,175,55,0.08)", border: `1px solid rgba(212,175,55,0.35)`, color: "#F5D060" }}>
            <MessageCircle className="w-4 h-4" />
            {t("request_access_form", "Request Access (In-App Form)")}
          </button>

          <button onClick={() => navigate("/")}
            className="w-full py-2.5 rounded-xl font-inter font-semibold text-xs"
            style={{ background: "transparent", border: `1px solid rgba(255,255,255,0.10)`, color: "rgba(255,255,255,0.35)" }}>
            Cancel
          </button>
        </div>

        {/* Code entry panel */}
        <AnimatePresence>
          {showCodeEntry && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div className="rounded-2xl border p-5 space-y-4" style={{
                background: "linear-gradient(145deg, #0c1630 0%, #060c1c 100%)",
                borderColor: G.borderHi,
              }}>
                <h3 className="font-inter font-bold text-white text-sm flex items-center gap-2">
                  <KeyRound className="w-4 h-4" style={{ color: G.text }} />
                  {t("enter_access_code", "Enter Access Code")}
                                   </h3>

                {codeResult && (
                  <div className="rounded-xl border p-3 flex items-start gap-2"
                    style={{
                      background: codeResult.success ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                      borderColor: codeResult.success ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)",
                    }}>
                    {codeResult.success
                      ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                    <p className={`text-xs ${codeResult.success ? "text-green-300" : "text-red-300"}`}>
                      {codeResult.message}
                    </p>
                  </div>
                )}

                <input
                  value={code}
                  onChange={e => { setCode(e.target.value.toUpperCase()); setCodeResult(null); }}
                  onKeyDown={e => e.key === "Enter" && !loading && handleRedeem()}
                  placeholder={t("code_placeholder", "e.g. ACCESS-1234")}
                  className="w-full px-4 py-3 rounded-xl text-white font-bold text-base text-center tracking-[0.15em] outline-none placeholder-white/20"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, fontSize: "16px" }}
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                />

                <button
                  onClick={handleRedeem}
                  disabled={loading || !code.trim()}
                  className="w-full py-3.5 rounded-xl font-inter font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #f6d860 0%, #c98a14 100%)", color: "#0d1b2a" }}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  {loading ? t("verifying", "Verifying…") : t("activate_code", "Activate Code")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* In-app access request modal (original workflow → submitAccessRequest) */}
      <AnimatePresence>
        {showRequestModal && (
          <RequestAccessModal
            pagePath={routePath}
            pageName={pageName}
            onClose={() => setShowRequestModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}