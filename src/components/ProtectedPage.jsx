import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ShieldAlert, Lock, Clock, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PERMISSION_CODES, ROUTE_PERMISSION_MAP } from "@/lib/permissionCodes";
import PageSubscriptionModal from "@/components/PageSubscriptionModal";
import { useToast } from "@/components/ui/use-toast";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.07)",
  error: "rgba(239,68,68,0.15)",
  errorBorder: "rgba(239,68,68,0.50)",
};

/**
 * ProtectedPage Wrapper Component
 * Enforces access control for all pages using the Access Control System
 * 
 * @param {string} routePath - The route path to check permissions for
 * @param {React.ReactNode} children - The page component to render if access granted
 */
export default function ProtectedPage({ routePath, children, requiresPermission = true, requiresSubscription = false }) {
  const { toast } = useToast();
  const [accessStatus, setAccessStatus] = useState("checking");
  const [accessDetails, setAccessDetails] = useState(null);
  const [error, setError] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [requiresPageSubscription, setRequiresPageSubscription] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [routePath]);

  const checkAccess = async () => {
    try {
      // Get current user first - with error handling for session issues
      let user;
      try {
        user = await base44.auth.me();
      } catch (authErr) {
        console.error("Auth check failed:", authErr);
        setError("Session expired. Please refresh.");
        setAccessStatus("denied");
        return;
      }
      
      if (!user) {
        setError("Authentication required");
        setAccessStatus("denied");
        return;
      }
      
      // Admin/owner bypass all checks
      if (user.role === 'admin' || user.role === 'owner') {
        console.log("Admin/Owner bypass:", user.email, "Role:", user.role);
        setAccessStatus("granted");
        return;
      }

      // If explicitly marked as not requiring permission, grant access
      if (!requiresPermission) {
        setAccessStatus("granted");
        return;
      }

      // Check database for page visibility setting (source of truth)
      try {
        const dbConfigs = await base44.entities.PageVisibilityConfig.list();
        const dbConfig = (dbConfigs || []).find(c => c.page_path === routePath);
        
        if (dbConfig) {
          // Database has a setting - use it
          if (!dbConfig.requires_permission) {
            // Page is PUBLIC in database
            setAccessStatus("granted");
            return;
          }
          // Page is PRIVATE - continue to subscription/permission check
        } else {
          // No database record - use hardcoded default
          const permissionConfig = ROUTE_PERMISSION_MAP[routePath];
          if (!permissionConfig || !permissionConfig.requiresPermission) {
            setAccessStatus("granted");
            return;
          }
        }
      } catch (dbErr) {
        console.error("Database visibility check failed:", dbErr);
        // Fallback to hardcoded defaults on error
      }

      // Check page-specific subscription
      try {
        const pageSubResponse = await base44.functions.invoke("checkPageSubscription", {
          page_path: routePath
        });
        
        if (pageSubResponse.data.has_access) {
          setAccessStatus("granted");
          setAccessDetails({
            expiry_date: pageSubResponse.data.expiry_date,
            subscription_id: pageSubResponse.data.subscription.subscription_id,
            plan_name: pageSubResponse.data.plan_name
          });
          return;
        }
      } catch (subErr) {
        console.error("Page subscription check failed:", subErr);
      }

      // Check permission-based access
      const permissionConfig = ROUTE_PERMISSION_MAP[routePath];
      if (permissionConfig?.code) {
        try {
          const response = await base44.functions.invoke("checkPageAccess", {
            page_path: routePath,
            permission_code: permissionConfig.code,
          });

          if (response.data.access_granted) {
            setAccessStatus("granted");
            setAccessDetails({
              expiry_date: response.data.expiry_date,
              permission_id: response.data.permission_id,
            });
            return;
          } else {
            if (response.data.reason === "Permission has expired") {
              setAccessStatus("expired");
            } else if (response.data.reason === "Permission has been revoked") {
              setAccessStatus("revoked");
            } else {
              setAccessStatus("denied");
            }
            setError(response.data.reason || "Access denied");
            return;
          }
        } catch (permErr) {
          console.error("Permission check failed:", permErr);
        }
      }

      // No valid access found - require subscription
      setRequiresPageSubscription(true);
      setAccessStatus("subscription_required");
      setShowSubscriptionModal(true);
    } catch (err) {
      if (err.response?.status === 403) {
        const reason = err.response?.data?.reason;
        if (reason === "Permission has expired") {
          setAccessStatus("expired");
        } else {
          setAccessStatus("denied");
        }
        setError(reason || "Access denied");
      } else if (err.response?.status === 401) {
        setError("Authentication required");
        setAccessStatus("denied");
      } else {
        setError(err.message || "Access check failed");
        setAccessStatus("denied");
      }
    }
  };

  // Show loading state while checking
  if (accessStatus === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: G.bg }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-gold border-r-transparent border-b-gold border-l-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 font-inter text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Render page if access granted
  if (accessStatus === "granted") {
    return children;
  }

  // Show subscription modal if required
  if (accessStatus === "subscription_required" && requiresPageSubscription && showSubscriptionModal) {
    return (
      <PageSubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => {
          setShowSubscriptionModal(false);
          setAccessStatus("denied");
        }}
        pagePath={routePath}
      />
    );
  }

  // Render access denied page
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ 
      background: "linear-gradient(180deg, #020710 0%, #050d1a 30%, #08101f 65%, #0b1326 100%)"
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="rounded-2xl border p-8 text-center" style={{ 
          background: accessStatus === "expired" 
            ? "rgba(234,179,8,0.10)" 
            : accessStatus === "revoked"
            ? "rgba(239,68,68,0.10)"
            : G.bg,
          borderColor: accessStatus === "expired"
            ? "rgba(234,179,8,0.40)"
            : accessStatus === "revoked"
            ? G.errorBorder
            : G.border,
        }}>
          {/* Icon */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ 
            background: accessStatus === "expired"
              ? "rgba(234,179,8,0.15)"
              : accessStatus === "revoked"
              ? G.error
              : G.bg,
          }}>
            {accessStatus === "expired" ? (
              <Clock className="w-8 h-8" style={{ color: "#eab308" }} />
            ) : accessStatus === "revoked" ? (
              <XCircle className="w-8 h-8" style={{ color: "#ef4444" }} />
            ) : (
              <ShieldAlert className="w-8 h-8" style={{ color: G.text }} />
            )}
          </div>

          {/* Title */}
          <h1 className="font-amiri text-2xl font-bold mb-2" style={{ color: G.text }}>
            {accessStatus === "expired" 
              ? "Access Expired" 
              : accessStatus === "revoked"
              ? "Access Revoked"
              : "Access Denied"}
          </h1>

          {/* Subtitle */}
          <p className="font-inter text-xs text-white/60 uppercase tracking-widest mb-4">
            {accessStatus === "expired"
              ? "PERMISSION EXPIRED"
              : accessStatus === "revoked"
              ? "PERMISSION REVOKED"
              : "INSUFFICIENT PERMISSIONS"}
          </p>

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg mb-4" style={{ 
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${G.border}`
            }}>
              <p className="font-inter text-xs text-white/70">{error}</p>
            </div>
          )}

          {/* Details */}
          {accessDetails?.expiry_date && (
            <div className="mb-6">
              <p className="font-inter text-xs text-white/50 mb-1">Expired on</p>
              <p className="font-inter text-sm text-white/80">
                {new Date(accessDetails.expiry_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = "/"}
              className="w-full py-3 rounded-xl font-inter font-bold text-xs text-[#0d1b2a]"
              style={{
                background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)",
                boxShadow: `0 0 24px ${G.glow}`,
              }}
            >
              Return to Home
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-xl font-inter font-semibold text-xs"
              style={{
                background: "transparent",
                border: `1px solid ${G.border}`,
                color: G.text,
              }}
            >
              Try Again
            </button>
          </div>

          {/* Contact info */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: G.border }}>
            <p className="font-inter text-xs text-white/50 mb-2">
              Need access? Contact support
            </p>
            <a
              href="/customer-service"
              className="font-inter text-xs text-gold hover:underline"
              style={{ color: G.text }}
            >
              Submit Support Ticket →
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}