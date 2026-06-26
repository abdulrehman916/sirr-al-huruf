import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, Calendar, Shield, KeyRound } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/ui/use-toast";

const G = {
  border: "rgba(212,175,55,0.40)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.07)",
};

const STATUS_COLORS = {
  ACTIVE:   { bg: "rgba(34,197,94,0.15)",  text: "#4ade80",  border: "rgba(34,197,94,0.40)" },
  BLOCKED:  { bg: "rgba(239,68,68,0.15)",  text: "#f87171",  border: "rgba(239,68,68,0.40)" },
  REMOVED:  { bg: "rgba(107,114,128,0.15)",text: "#9ca3af",  border: "rgba(107,114,128,0.40)" },
  EXPIRED:  { bg: "rgba(245,158,11,0.15)", text: "#fbbf24",  border: "rgba(245,158,11,0.40)" },
  ARCHIVED: { bg: "rgba(107,114,128,0.12)",text: "#6b7280",  border: "rgba(107,114,128,0.30)" },
};

export default function UserDetailPage() {
  const { userId } = useParams();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [profile, setProfile] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (!user || user.role !== "admin") { setIsAdmin(false); return; }
      setIsAdmin(true);
      loadUser();
    }).catch(() => setIsAdmin(false));
  }, [userId]);

  const loadUser = async () => {
    setLoading(true);
    try {
      const [profiles, perms] = await Promise.all([
        base44.entities.UserAccessProfile.filter({ user_id: userId }),
        base44.entities.PagePermission.filter({ user_id: userId }),
      ]);
      setProfile(profiles[0] || null);
      setPermissions(perms);
    } catch (e) {
      toast({ title: "Failed to load user", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin === false) return <Navigate to="/" replace />;
  if (isAdmin === null || loading) return (
    <AdminLayout showBackButton title="User Detail">
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
      </div>
    </AdminLayout>
  );

  const statusCfg = STATUS_COLORS[profile?.account_status] || STATUS_COLORS.ACTIVE;

  return (
    <AdminLayout showBackButton title="User Detail" subtitle="User profile & permissions">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 max-w-2xl">

        {!profile ? (
          <div className="rounded-xl border p-8 text-center text-white/40"
            style={{ background: G.bg, borderColor: G.border }}>
            <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No profile found for this user ID</p>
            <p className="text-xs mt-1 font-mono text-white/25">{userId}</p>
          </div>
        ) : (
          <>
            {/* Profile card */}
            <div className="rounded-xl border p-5 space-y-4"
              style={{ background: G.bg, borderColor: G.border }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="font-inter text-lg font-bold text-white">{profile.full_name || "Unknown"}</h2>
                  <p className="font-inter text-xs text-white/40 font-mono mt-0.5">{profile.user_id}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: statusCfg.bg, color: statusCfg.text, border: `1px solid ${statusCfg.border}` }}>
                  {profile.account_status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-white/60">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{profile.email || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{profile.mobile || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{profile.registration_date ? new Date(profile.registration_date).toLocaleDateString() : "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{profile.role || "user"}</span>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <KeyRound className="w-4 h-4" style={{ color: G.text }} />
                <h3 className="font-inter text-sm font-bold text-white">Page Permissions ({permissions.length})</h3>
              </div>
              {permissions.length === 0 ? (
                <p className="text-xs text-white/30 py-4 text-center">No permissions granted</p>
              ) : (
                <div className="space-y-2">
                  {permissions.map(perm => {
                    const isExpired = perm.expiry_date && new Date(perm.expiry_date) < new Date();
                    const isRevoked = perm.is_revoked;
                    return (
                      <div key={perm.id} className="rounded-xl border p-3 flex items-center justify-between gap-3 flex-wrap"
                        style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
                        <div>
                          <p className="font-inter text-sm font-semibold text-white">{perm.page_name}</p>
                          <p className="font-mono text-[10px] text-white/35">{perm.page_path}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            isRevoked ? "bg-red-500/15 text-red-400 border-red-500/30" :
                            isExpired ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" :
                            "bg-green-500/15 text-green-400 border-green-500/30"
                          }`}>
                            {isRevoked ? "REVOKED" : isExpired ? "EXPIRED" : "ACTIVE"}
                          </span>
                          {perm.expiry_date && (
                            <span className="text-[10px] text-white/30">
                              Expires {new Date(perm.expiry_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

      </motion.div>
    </AdminLayout>
  );
}