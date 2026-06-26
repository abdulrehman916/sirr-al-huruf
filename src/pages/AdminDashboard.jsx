import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Users, Globe, Clock, Crown, KeyRound, UserCheck, Shield, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/ui/use-toast";

const G = {
  border: "rgba(212,175,55,0.40)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.07)",
};

function StatCard({ label, value, color, icon: Icon, sub }) {
  return (
    <div className="rounded-xl border p-4 flex flex-col gap-2"
      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(212,175,55,0.20)" }}>
      <div className="flex items-center justify-between">
        <span className="font-inter text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</span>
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      </div>
      <p className="font-inter text-2xl font-bold text-white">{(value ?? 0).toLocaleString()}</p>
      {sub && <p className="font-inter text-[10px] text-white/30">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const user = await base44.auth.me();
      if (!user || user.role !== "admin") {
        setIsAdmin(false);
        toast({ title: "Access Denied", description: "Admins only", variant: "destructive" });
        return;
      }
      setIsAdmin(true);
      fetchStats();
      fetchPending();
    } catch {
      setIsAdmin(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await base44.functions.invoke("getUserStats");
      setStats(res.data.stats);
    } catch {}
  };

  const fetchPending = async () => {
    try {
      const [a, b] = await Promise.all([
        base44.entities.PremiumAccessRequest.filter({ status: "PENDING" }).then(r => r.length),
        base44.entities.AccessRequest.filter({ status: "PENDING" }).then(r => r.length),
      ]);
      setPendingRequests(a + b);
    } catch {}
  };

  if (isAdmin === false) return <Navigate to="/" replace />;

  if (isAdmin === null) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        {/* Title */}
        <div>
          <h1 className="font-inter text-xl font-bold text-white">Dashboard</h1>
          <p className="font-inter text-xs text-white/40 mt-0.5">System overview at a glance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard label="Total Users"   value={stats?.total_users}       color="#F5D060" icon={Users}     />
          <StatCard label="Active"        value={stats?.active_users}      color="#22c55e" icon={UserCheck}  />
          <StatCard label="Expired"       value={stats?.expired_users}     color="#f59e0b" icon={Clock}      />
          <StatCard label="Blocked"       value={stats?.blocked_users}     color="#ef4444" icon={Shield}     />
          <StatCard label="Active Codes"  value={stats?.total_codes}       color="#3b82f6" icon={KeyRound}   />
          <StatCard label="Permissions"   value={stats?.active_permissions} color="#8b5cf6" icon={Globe}     />
          <StatCard label="Pending Req."  value={pendingRequests}          color="#f97316" icon={TrendingUp} sub="Access requests awaiting review" />
        </div>

        {/* Quick Links */}
        <div>
          <p className="font-inter text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { to: "/admin/approved-users",   icon: "👥", label: "Manage Users" },
              { to: "/admin/access-codes",      icon: "🔑", label: "Reading Codes" },
              { to: "/admin/page-permissions",  icon: "🌐", label: "Page Access" },
              { to: "/admin/support",           icon: "💬", label: "Support Messages" },
              { to: "/admin/access-logs",       icon: "📋", label: "Access Logs" },
              { to: "/admin/settings",          icon: "⚙️", label: "Settings" },
            ].map(link => (
              <a
                key={link.to}
                href={link.to}
                className="rounded-xl border p-3 flex items-center gap-3 transition-all hover:bg-white/5"
                style={{ background: G.bg, borderColor: G.border, textDecoration: "none" }}
              >
                <span className="text-base">{link.icon}</span>
                <span className="font-inter text-xs font-semibold text-white/70">{link.label}</span>
              </a>
            ))}
          </div>
        </div>

      </motion.div>
    </AdminLayout>
  );
}