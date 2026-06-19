import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Lock, Clock, XCircle, Star } from "lucide-react";
import { getPageConfig, isPublicPage } from "@/lib/pageRegistry";
import { getCached, setCached, accessCheckKey, visibilityKey } from "@/lib/permissionCache";
import { useToast } from "@/components/ui/use-toast";
import useTranslation from "@/i18n/useTranslation";
import WhatsAppAccessRequest from "@/components/WhatsAppAccessRequest";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
  error: "rgba(239,68,68,0.15)",
  errorBorder: "rgba(239,68,68,0.50)",
};

// TTL for access check cache — 2 minutes (enough for a browsing session)
const ACCESS_CACHE_TTL = 2 * 60 * 1000;

export default function ProtectedPage({ routePath, children, requiresPermission, requiresSubscription }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [accessStatus, setAccessStatus] = useState("checking");
  const [accessDetails, setAccessDetails] = useState(null);
  const [error, setError] = useState(null);
  const [pageName, setPageName] = useState("");

  useEffect(() => {
    const config = getPageConfig(routePath);
    setPageName(config?.name || routePath);
    checkAccess();
  }, [routePath]);

  const checkAccess = async () => {
    try {
      // ── Layer 0: Explicit prop override — no auth needed ────────────────
      if (requiresPermission === false) {
        setAccessStatus("granted");
        return;
      }

      // ── Layer 1: Static page registry — public pages bypass everything ──
      if (isPublicPage(routePath)) {
        setAccessStatus("granted");
        return;
      }

      // ── Layer 2: Cached visibility check ────────────────────────────────
      const visKey = visibilityKey(routePath);
      let isPublicByDb = getCached(visKey);
      if (isPublicByDb === undefined || isPublicByDb === null) {
        try {
          const dbConfigs = await base44.entities.PageVisibilityConfig.filter(
            { page_path: routePath },
            null,
            1
          );
          isPublicByDb = dbConfigs.length > 0 && !dbConfigs[0].requires_permission;
          setCached(visKey, isPublicByDb);
        } catch {
          isPublicByDb = false;
          setCached(visKey, false, 30000); // short TTL on error
        }
      }
      if (isPublicByDb) {
        setAccessStatus("granted");
        return;
      }

      // ── Layer 3: Auth required — get user ───────────────────────────────
      let user;
      try {
        user = await base44.auth.me();
      } catch {
        setError("Authentication required");
        setAccessStatus("denied");
        return;
      }
      if (!user) {
        setError("Authentication required");
        setAccessStatus("denied");
        return;
      }

      // ── Layer 4: Cached consolidated access check ────────────────────────
      const accKey = accessCheckKey(user.id, routePath);
      let result = getCached(accKey);

      if (!result) {
        try {
          const response = await base44.functions.invoke("checkPageAccessFast", {
            page_path: routePath,
          });
          result = response.data;
          setCached(accKey, result, ACCESS_CACHE_TTL);
        } catch {
          // Fallback: treat as locked on backend error
          result = { granted: false, reason: "Access denied", status: "locked" };
          setCached(accKey, result, 30000);
        }
      }

      if (result.granted) {
        setAccessStatus("granted");
        setAccessDetails({ expiry_date: result.expiry_date });
      } else {
        setAccessStatus(result.status || "locked");
        setError(result.reason || "Access denied");
      }
    } catch (err) {
      setError(err.message || "Access check failed");
      setAccessStatus("denied");
    }
  };

  if (accessStatus === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-yellow-400 border-r-transparent border-b-yellow-400 border-l-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (accessStatus === "granted") return children;

  return (
    <LockedScreen
      accessStatus={accessStatus}
      error={error}
      accessDetails={accessDetails}
      pageName={pageName}
      routePath={routePath}
    />
  );
}

function LockedScreen({ accessStatus, error, accessDetails, pageName, routePath }) {
  const { t } = useTranslation();
  const isExpired = accessStatus === "expired";
  const isRevoked = accessStatus === "revoked";
  const isLocked = accessStatus === "locked";

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{
      background: "linear-gradient(180deg, #020710 0%, #050d1a 30%, #08101f 65%, #0b1326 100%)"
    }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-4">

        {/* Main card */}
        <div className="rounded-2xl border p-8 text-center" style={{
          background: isExpired ? "rgba(234,179,8,0.08)" : isRevoked ? G.error : G.bg,
          borderColor: isExpired ? "rgba(234,179,8,0.40)" : isRevoked ? G.errorBorder : G.border,
        }}>
          {/* Icon */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{
            background: isExpired ? "rgba(234,179,8,0.12)" : isRevoked ? G.error : G.bgHi,
          }}>
            {isExpired ? <Clock className="w-8 h-8" style={{ color: "#eab308" }} />
              : isRevoked ? <XCircle className="w-8 h-8 text-red-400" />
              : isLocked ? <Lock className="w-8 h-8" style={{ color: G.text }} />
              : <ShieldAlert className="w-8 h-8" style={{ color: G.text }} />}
          </div>

          <h1 className="font-amiri text-2xl font-bold mb-1" style={{ color: G.text }}>
            {isExpired ? t('protected_expired_title') : isRevoked ? t('protected_revoked_title') : isLocked ? t('protected_locked_title') : t('access_denied')}
          </h1>
          <p className="font-inter text-xs text-white/50 uppercase tracking-widest mb-4">
            {pageName}
          </p>

          {error && !isLocked && (
            <div className="p-3 rounded-lg mb-4" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${G.border}` }}>
              <p className="font-inter text-xs text-white/60">{error}</p>
            </div>
          )}

          {isLocked && (
            <p className="text-sm text-white/50 mb-6">
              {t('protected_locked_desc')}
            </p>
          )}
          {isExpired && (
            <p className="text-sm text-white/50 mb-6">
              {t('protected_expired_desc')}
            </p>
          )}
          {isRevoked && (
            <p className="text-sm text-white/50 mb-6">
              {t('protected_revoked_desc')}
            </p>
          )}

          {/* WhatsApp access request button */}
          {(isLocked || isExpired) && (
            <div className="mt-4">
              <WhatsAppAccessRequest pageName={pageName} routePath={routePath} />
            </div>
          )}

          {/* Return home for revoked/denied */}
          {!isLocked && !isExpired && (
            <div className="space-y-3 mt-4">
              <button
                onClick={() => window.location.href = "/"}
                className="w-full py-3 rounded-xl font-inter font-bold text-sm"
                style={{
                  background: "linear-gradient(135deg, #f6d860 0%, #c98a14 100%)",
                  color: "#0d1b2a",
                }}
              >
                {t('not_found_home')}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-xl font-inter font-semibold text-xs"
                style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text }}
              >
                {t('msg_try_again')}
              </button>
            </div>
          )}
        </div>

        {/* VIP info card */}
        {isLocked && (
          <div className="rounded-xl border p-4 text-center" style={{
            background: "rgba(147,51,234,0.06)",
            borderColor: "rgba(147,51,234,0.30)",
          }}>
            <Star className="w-5 h-5 mx-auto mb-2" style={{ color: "#a855f7" }} />
            <p className="font-inter text-xs text-white/60">
              {t('protected_locked_desc')}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}