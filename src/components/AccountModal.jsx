import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, Trash2, AlertTriangle, CheckCircle, Shield, Globe } from "lucide-react";
import { base44 } from "../api/base44Client";
import { Link } from "react-router-dom";

export default function AccountModal({ user, onClose }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(user?.role === 'admin');
  }, [user]);

  const handleLogout = () => {
    base44.auth.logout();
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleted(true);
    setDeleting(false);
    setTimeout(() => {
      base44.auth.logout();
    }, 2200);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(5px)" }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-sm mx-0 sm:mx-4 rounded-t-3xl sm:rounded-3xl overflow-hidden"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        style={{
          background: "linear-gradient(160deg, rgba(8,16,40,0.99) 0%, rgba(3,8,22,0.99) 100%)",
          border: "1px solid rgba(212,175,55,0.20)",
          boxShadow: "0 -8px 60px rgba(0,0,0,0.70), inset 0 1px 0 rgba(212,175,55,0.10)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold top line */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent 10%, rgba(212,175,55,0.55) 50%, transparent 90%)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3.5" style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-amiri font-bold text-lg leading-tight" style={{ color: "#f5ecd4" }}>
                {user?.full_name || "حسابي"}
              </p>
              {isAdmin && (
                <span className="font-inter text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(212,175,55,0.20)", color: "#F5D060", border: "1px solid rgba(212,175,55,0.35)" }}>
                  ADMIN
                </span>
              )}
            </div>
            {user?.email && (
              <p className="font-inter text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>
                {user.email}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.32)", WebkitTapHighlightColor: "transparent" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          {/* Admin Section */}
          {isAdmin && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" style={{ color: "#D4AF37" }} />
                  <span className="font-inter text-xs font-bold uppercase tracking-wider" style={{ color: "#D4AF37" }}>Admin Panel</span>
                </div>
                <span className="font-inter text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.15)", color: "#F5D060", border: "1px solid rgba(212,175,55,0.30)" }}>
                  OWNER & SUPER ADMIN
                </span>
              </div>
              
              <div className="space-y-2">
                <Link
                  to="/admin/permissions"
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.05) 100%)",
                    border: "1px solid rgba(212,175,55,0.25)",
                    WebkitTapHighlightColor: "transparent",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                  }}
                >
                  <Globe className="w-4 h-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
                  <div className="flex-1 text-left">
                    <p className="font-inter text-sm font-semibold" style={{ color: "#F5D060" }}>Page Visibility Manager</p>
                    <p className="font-inter text-xs" style={{ color: "rgba(212,175,55,0.60)" }}>Manage PUBLIC/PRIVATE access</p>
                  </div>
                  <span className="font-inter text-xs font-bold px-2 py-1 rounded" style={{ background: "rgba(212,175,55,0.20)", color: "#F5D060" }}>
                    OPEN
                  </span>
                </Link>

                <Link
                  to="/admin/permissions"
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.05) 100%)",
                    border: "1px solid rgba(212,175,55,0.25)",
                    WebkitTapHighlightColor: "transparent",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                  }}
                >
                  <Shield className="w-4 h-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
                  <div className="flex-1 text-left">
                    <p className="font-inter text-sm font-semibold" style={{ color: "#F5D060" }}>Page Permissions</p>
                    <p className="font-inter text-xs" style={{ color: "rgba(212,175,55,0.60)" }}>Grant & manage user access</p>
                  </div>
                  <span className="font-inter text-xs font-bold px-2 py-1 rounded" style={{ background: "rgba(212,175,55,0.20)", color: "#F5D060" }}>
                    OPEN
                  </span>
                </Link>
              </div>
            </div>
          )}

          {deleted ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle className="w-10 h-10" style={{ color: "rgba(212,175,55,0.70)" }} />
              <p className="font-amiri text-base" style={{ color: "#f5ecd4" }}>تم استلام طلبك</p>
              <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Account deletion request submitted. Your data will be removed within 30 days. Signing you out…
              </p>
            </div>
          ) : (
            <>
              {/* Sign Out */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  WebkitTapHighlightColor: "transparent",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                }}
              >
                <LogOut className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.38)" }} />
                <span className="font-inter text-sm font-semibold" style={{ color: "rgba(255,255,255,0.60)" }}>Sign Out</span>
              </button>

              {/* Delete Account */}
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                  style={{
                    background: "rgba(239,68,68,0.05)",
                    border: "1px solid rgba(239,68,68,0.16)",
                    WebkitTapHighlightColor: "transparent",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                  }}
                >
                  <Trash2 className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(239,68,68,0.55)" }} />
                  <span className="font-inter text-sm font-semibold" style={{ color: "rgba(239,68,68,0.60)" }}>Delete Account</span>
                </button>
              ) : (
                <div
                  className="rounded-2xl p-4 space-y-3"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.24)" }}
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#F87171" }} />
                    <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
                      This will permanently delete your account and all associated data. This cannot be undone.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 py-2.5 rounded-xl font-inter text-xs font-semibold"
                      style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)", WebkitTapHighlightColor: "transparent" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="flex-1 py-2.5 rounded-xl font-inter text-xs font-semibold"
                      style={{ background: "rgba(239,68,68,0.20)", color: "#F87171", WebkitTapHighlightColor: "transparent" }}
                    >
                      {deleting ? "Processing…" : "Confirm Delete"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Safe area spacer on mobile */}
        <div style={{ height: "env(safe-area-inset-bottom)", minHeight: 8 }} />
      </motion.div>
    </div>
  );
}