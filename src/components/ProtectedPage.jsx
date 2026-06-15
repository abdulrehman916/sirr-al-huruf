import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { ShieldAlert, Lock, Clock, XCircle, Crown, Star, Send } from "lucide-react";
import { ROUTE_PERMISSION_MAP } from "@/lib/permissionCodes";
import PageSubscriptionModal from "@/components/PageSubscriptionModal";
import RequestAccessModal from "@/components/RequestAccessModal";
import { useToast } from "@/components/ui/use-toast";

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

export default function ProtectedPage({ routePath, children, requiresPermission = true, requiresSubscription = false }) {
  const { toast } = useToast();
  const [accessStatus, setAccessStatus] = useState("checking");
  const [accessDetails, setAccessDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [pageName, setPageName] = useState("");

  useEffect(() => {
    const config = ROUTE_PERMISSION_MAP[routePath];
    setPageName(config?.name || routePath);
    checkAccess();
  }, [routePath]);

  const checkAccess = async () => {
    try {
      // ── Layer 1: Explicit prop override — no auth needed ──────────────────
      if (!requiresPermission) {
        setAccessStatus("granted");
        return;
      }

      // ── Layer 2: Database page visibility — public pages bypass auth ──────
      try {
        const dbConfigs = await base44.entities.PageVisibilityConfig.list();
        const dbConfig = (dbConfigs || []).find(c => c.page_path === routePath);
        if (dbConfig && !dbConfig.requires_permission) {
          setAccessStatus("granted");
          return;
        }
      } catch {}

      // ── Layer 3: Static route map fallback — public pages bypass auth ─────
      const permissionConfig = ROUTE_PERMISSION_MAP[routePath];
      if (!permissionConfig || !permissionConfig.requiresPermission) {
        setAccessStatus("granted");
        return;
      }

      // ── Layer 4: Auth-required from this point ────────────────────────────
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

      // Admin/owner bypass
      if (user.role === "admin" || user.role === "owner") {
        setAccessStatus("granted");
        return;
      }

      // Lifetime access check
      try {
        const profiles = await base44.entities.UserAccessProfile.filter({ user_id: user.id });
        if (profiles.length > 0 && profiles[0].lifetime_access) {
          setAccessStatus("granted");
          return;
        }
      } catch {}

      // VIP check
      try {
        const vipRes = await base44.functions.invoke("checkVIPAccess", { page_path: routePath });
        if (vipRes.data?.is_vip) {
          setAccessStatus("granted");
          return;
        }
      } catch {}

      // Subscription check
      try {
        const pageSubResponse = await base44.functions.invoke("checkPageSubscription", { page_path: routePath });
        if (pageSubResponse.data?.has_access) {
          setAccessStatus("granted");
          setAccessDetails({ expiry_date: pageSubResponse.data.expiry_date });
          return;
        }
      } catch {}

      // Permission-based access
      if (permissionConfig?.code) {
        try {
          const response = await base44.functions.invoke("checkPageAccess", {
            page_path: routePath,
            permission_code: permissionConfig.code,
          });
          if (response.data.access_granted) {
            setAccessStatus("granted");
            setAccessDetails({ expiry_date: response.data.expiry_date });
            return;
          } else {
            if (response.data.reason === "Permission has expired") {
              setAccessStatus("expired");
            } else if (response.data.reason === "Permission has been revoked") {
              setAccessStatus("revoked");
            } else {
              setAccessStatus("locked");
            }
            setError(response.data.reason || "Access denied");
            return;
          }
        } catch {}
      }

      setAccessStatus("locked");
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

  // Modals
  if (showSubscriptionModal) {
    return (
      <>
        <LockedScreen
          accessStatus={accessStatus}
          error={error}
          accessDetails={accessDetails}
          pageName={pageName}
          routePath={routePath}
          onSubscribe={() => setShowSubscriptionModal(true)}
          onRequestAccess={() => { setShowSubscriptionModal(false); setShowRequestModal(true); }}
        />
        <PageSubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          pagePath={routePath}
        />
      </>
    );
  }

  return (
    <>
      <LockedScreen
        accessStatus={accessStatus}
        error={error}
        accessDetails={accessDetails}
        pageName={pageName}
        routePath={routePath}
        onSubscribe={() => setShowSubscriptionModal(true)}
        onRequestAccess={() => setShowRequestModal(true)}
      />
      <AnimatePresence>
        {showRequestModal && (
          <RequestAccessModal
            pagePath={routePath}
            pageName={pageName}
            onClose={() => setShowRequestModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function LockedScreen({ accessStatus, error, accessDetails, pageName, routePath, onSubscribe, onRequestAccess }) {
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
            {isExpired ? "Access Expired" : isRevoked ? "Access Revoked" : isLocked ? "Premium Content" : "Access Denied"}
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
              This page requires special access. You can subscribe for instant access or request it from the owner.
            </p>
          )}

          {/* Action buttons for locked pages */}
          {(isLocked || isExpired) && (
            <div className="space-y-3 mt-4">
              {/* Subscribe button */}
              <button
                onClick={onSubscribe}
                className="w-full py-3.5 rounded-xl font-inter font-bold text-sm flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #f6d860 0%, #c98a14 100%)",
                  color: "#0d1b2a",
                  boxShadow: "0 0 24px rgba(212,175,55,0.35)",
                }}
              >
                <Crown className="w-4 h-4" />
                Subscribe for Access
              </button>

              {/* Request Access button */}
              <button
                onClick={onRequestAccess}
                className="w-full py-3.5 rounded-xl font-inter font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:bg-white/10"
                style={{
                  background: "rgba(212,175,55,0.08)",
                  border: `1px solid ${G.border}`,
                  color: G.text,
                }}
              >
                <Send className="w-4 h-4" />
                Request Access from Owner
              </button>
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
                Return to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-xl font-inter font-semibold text-xs"
                style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text }}
              >
                Try Again
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
              Already a VIP member? Your phone or email grants automatic free access.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}