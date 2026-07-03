import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Lock, MessageCircle, KeyRound, Loader2, CheckCircle, AlertCircle, Shield } from "lucide-react";
import { getPageConfig, isPublicPage } from "@/lib/pageRegistry";
import { getCached, setCached, visibilityKey } from "@/lib/permissionCache";
import { checkLocalPermission, getSessionId, mergeGrantedPermissions, validateAndCleanPermissions } from "@/lib/sessionId";
import { ADMIN_CONFIG } from "@/lib/adminConfig";
import { setAdminFlag } from "@/lib/featurePermission";
import { hasSubFeatures } from "@/lib/featureRegistry";
import { preloadPageFeatureConfigs } from "@/lib/featureConfigCache";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
};

export default function ProtectedPage({ routePath, children, requiresPermission }) {
  const [accessStatus, setAccessStatus] = useState("checking");
  const [pageName, setPageName] = useState("");

  const checkAccess = useCallback(async () => {
    // Reset admin flag at start — will be set to true if admin is detected below
    setAdminFlag(false);

    // 1. Explicit public override from routeManifest flag
    if (requiresPermission === false) {
      setAccessStatus("granted");
      return;
    }

    // 2. Static registry — public page (requiresPermission: false)
    if (isPublicPage(routePath)) {
      setAccessStatus("granted");
      return;
    }

    // 3. Admin-only pages — require admin login
    const config = getPageConfig(routePath);
    if (config?.adminOnly || routePath.startsWith("/admin/")) {
      try {
        const user = await base44.auth.me();
        if (user?.role === "admin") {
          setAdminFlag(true);
          setAccessStatus("granted");
          return;
        }
      } catch {}
      setAccessStatus("admin_only");
      return;
    }

    // 4. Multi-feature pages are containers — always accessible.
    //    Individual child features handle their own locking via checkFeatureAccess.
    //    Preload feature configs so checkFeatureAccess has sync data on first render.
    if (hasSubFeatures(routePath)) {
      await preloadPageFeatureConfigs(routePath);
      setAccessStatus("granted");
      return;
    }

    // 5. DB visibility config (cached 2 min)
    const visKey = visibilityKey(routePath);
    let isPublicByDb = getCached(visKey);
    if (isPublicByDb === undefined || isPublicByDb === null) {
      try {
        const dbConfigs = await base44.entities.PageVisibilityConfig.filter(
          { page_path: routePath, archived: false }, null, 1
        );
        isPublicByDb = dbConfigs.length > 0 && !dbConfigs[0].requires_permission;
        setCached(visKey, isPublicByDb);
      } catch {
        isPublicByDb = false;
        setCached(visKey, false, 30000);
      }
    }
    if (isPublicByDb) {
      setAccessStatus("granted");
      return;
    }

    // 5. Authenticated admin bypass (content pages too)
    try {
      const user = await base44.auth.me();
      if (user?.role === "admin") {
        setAdminFlag(true);
        setAccessStatus("granted");
        return;
      }
    } catch {}

    // 6. Local permission check (localStorage — no auth needed)
    const localCheck = checkLocalPermission(routePath);
    if (localCheck.granted) {
      setAccessStatus("granted");
      return;
    }

    setAccessStatus("locked");

    // Background validation — removes permissions for revoked/disabled/expired codes
    validateAndCleanPermissions();
  }, [routePath, requiresPermission]);

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
          <h2 className="font-inter font-bold text-white text-lg">Admin Access Required</h2>
          <p className="font-inter text-sm text-white/40">This page is restricted to administrators only.</p>
          <a href="/otp-login"
            className="block w-full py-3 rounded-xl font-inter font-bold text-sm text-center"
            style={{ background: "linear-gradient(135deg, #f6d860 0%, #c98a14 100%)", color: "#0d1b2a" }}>
            Admin Login
          </a>
          <button onClick={() => window.location.href = "/"}
            className="w-full py-2.5 rounded-xl font-inter font-semibold text-xs"
            style={{ background: "transparent", border: `1px solid rgba(255,255,255,0.10)`, color: "rgba(255,255,255,0.35)" }}>
            ← Back to Home
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
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeResult, setCodeResult] = useState(null);
  const [whatsappSent, setWhatsappSent] = useState(false);

  const handleRedeem = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setCodeResult(null);
    try {
      const sessionId = getSessionId();
      const res = await base44.functions.invoke("redeemCodeGuest", {
        code: trimmed,
        session_id: sessionId,
      });
      const data = res.data;
      if (data?.success && data?.permissions) {
        mergeGrantedPermissions(data.permissions);
        setCodeResult({ success: true, message: data.message });
        setTimeout(() => onUnlocked(), 1200);
      } else {
        setCodeResult({ success: false, message: data?.message || "Invalid code." });
      }
    } catch (e) {
      setCodeResult({ success: false, message: e.message || "Redemption failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const message =
      `السلام عليكم\n\n` +
      `*طلب وصول — سر الحروف*\n\n` +
      `📄 الصفحة: ${pageName}\n\n` +
      `أرجو إرسال رمز القراءة لهذه الصفحة.`;
    const url = `https://wa.me/${ADMIN_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setWhatsappSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(180deg, #020710 0%, #050d1a 30%, #08101f 100%)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-4"
      >
        {/* Main locked card */}
        <div className="rounded-2xl border p-8 text-center" style={{
          background: G.bg,
          borderColor: G.border,
          boxShadow: "0 0 48px rgba(212,175,55,0.10)",
        }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: G.bgHi, border: `1px solid ${G.border}` }}>
            <Lock className="w-8 h-8" style={{ color: G.text }} />
          </div>

          <h1 className="font-amiri text-2xl font-bold mb-1" style={{ color: G.text }}>
            PREMIUM CONTENT
          </h1>
          <p className="font-inter text-xs text-white/30 uppercase tracking-widest mb-2">
            Premium Content
          </p>
          <p className="font-inter text-sm text-white/60 font-semibold mb-1">{pageName}</p>
          <p className="font-inter text-xs text-white/35 mb-7">
            This page is protected. Contact us on WhatsApp to obtain an access code.
          </p>

          {/* WhatsApp button */}
          <button
            onClick={handleWhatsApp}
            className="w-full py-3.5 rounded-xl font-inter font-bold text-sm flex items-center justify-center gap-2 mb-3"
            style={{
              background: whatsappSent
                ? "rgba(37,211,102,0.12)"
                : "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
              color: whatsappSent ? "#25D366" : "#ffffff",
              border: whatsappSent ? "1px solid rgba(37,211,102,0.40)" : "none",
              boxShadow: whatsappSent ? "none" : "0 0 24px rgba(37,211,102,0.30)",
            }}
          >
            {whatsappSent
              ? <CheckCircle className="w-4 h-4" />
              : <MessageCircle className="w-4 h-4" />}
            {whatsappSent ? "Sent!" : "Contact on WhatsApp"}
          </button>

          <p className="font-inter text-xs text-white/25 mb-4">{ADMIN_CONFIG.WHATSAPP_DISPLAY}</p>

          {/* Code entry toggle */}
          <button
            onClick={() => setShowCodeEntry(v => !v)}
            className="w-full py-3 rounded-xl font-inter font-semibold text-sm flex items-center justify-center gap-2"
            style={{ background: "rgba(212,175,55,0.07)", border: `1px solid ${G.border}`, color: G.text }}
          >
            <KeyRound className="w-4 h-4" />
            {showCodeEntry ? "Hide Access Code Entry" : "I Have an Access Code"}
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
                  Enter Access Code
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
                  placeholder="e.g. ACCESS-1234"
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
                  {loading ? "Verifying…" : "Activate Code"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to home */}
        <button
          onClick={() => window.location.href = "/"}
          className="w-full py-2.5 rounded-xl font-inter font-semibold text-xs"
          style={{ background: "transparent", border: `1px solid rgba(255,255,255,0.10)`, color: "rgba(255,255,255,0.35)" }}
        >
          ← Back to Home
        </button>
      </motion.div>
    </div>
  );
}