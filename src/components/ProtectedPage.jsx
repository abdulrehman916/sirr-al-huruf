import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ShieldAlert, Lock, Clock, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PERMISSION_CODES, ROUTE_PERMISSION_MAP } from "@/lib/permissionCodes";

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
  const [accessStatus, setAccessStatus] = useState("checking");
  const [accessDetails, setAccessDetails] = useState(null);
  const [error, setError] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

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
        // Session might be stale - reload to refresh
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
      
      // Debug logging for admin users
      if (user.role === 'admin') {
        console.log("Admin user detected:", user.email, "Role:", user.role);
      }

      // If explicitly marked as not requiring permission, grant access
      if (!requiresPermission) {
        setAccessStatus("granted");
        return;
      }

      // Get permission code for this route
      const permissionConfig = ROUTE_PERMISSION_MAP[routePath];
      
      // If no permission required (e.g., home page), grant access
      if (!permissionConfig || !permissionConfig.requiresPermission) {
        setAccessStatus("granted");
        return;
      }

      // Admin-only pages: grant access to admin users without permission check
      if (permissionConfig.adminOnly && user.role === 'admin') {
        setAccessStatus("granted");
        return;
      }

      // Check subscription status if required
      if (requiresSubscription) {
        try {
          const subResponse = await base44.functions.invoke("checkSubscriptionStatus", {});
          const subData = subResponse.data;
          
          if (!subData.has_active_subscription) {
            if (subData.status === 'EXPIRED') {
              window.location.href = '/subscription-expired';
              return;
            } else if (subData.status === 'NO_SUBSCRIPTION') {
              window.location.href = '/subscription-expired';
              return;
            }
          }
          
          setSubscriptionStatus(subData);
        } catch (subErr) {
          console.error("Subscription check failed:", subErr);
        }
      }

      // Check access using backend function
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
      } else {
        // Handle different denial reasons
        if (response.data.reason === "Permission has expired") {
          setAccessStatus("expired");
        } else if (response.data.reason === "Permission has been revoked") {
          setAccessStatus("revoked");
        } else {
          setAccessStatus("denied");
        }
        setError(response.data.reason || "Access denied");
      }
    } catch (err) {
      // Handle errors (403 = access denied, 401 = not authenticated)
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