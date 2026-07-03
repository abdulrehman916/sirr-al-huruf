import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import {
  Users, UserCheck, Clock, Shield, KeyRound, Globe, TrendingUp,
  RefreshCw, AlertCircle, Calendar, MessageSquare, CheckCircle2, XCircle,
} from "lucide-react";
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
    <div className="rounded-xl border p-3 flex flex-col gap-1.5"
      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(212,175,55,0.18)" }}>
      <div className="flex items-center justify-between">
        <span className="font-inter text-[10px] font-semibold text-white/40 uppercase tracking-wider">{label}</span>
        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
      </div>
      <p className="font-inter text-xl font-bold text-white">{(value ?? 0).toLocaleString()}</p>
      {sub && <p className="font-inter text-[9px] text-white/30">{sub}</p>}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="font-inter text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2 mt-4">{children}</p>
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
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">

        {/* Title */}
        <div>
          <h1 className="font-inter text-xl font-bold text-white">Dashboard</h1>
          <p className="font-inter text-xs text-white/40 mt-0.5">System overview — updates automatically</p>
        </div>

        {/* Users Section */}
        <SectionLabel>Users</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatCard label="Total Users"   value={stats?.total_users}   color="#F5D060" icon={Users} />
          <StatCard label="Active"        value={stats?.active_users}  color="#22c55e" icon={UserCheck} />
          <StatCard label="Expired"       value={stats?.expired_users} color="#f59e0b" icon={Clock} />
          <StatCard label="Blocked"       value={stats?.blocked_users} color="#ef4444" icon={Shield} />
        </div>

        {/* Reading Codes Section */}
        <SectionLabel>Reading Codes</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          <StatCard label="Total Codes"   value={stats?.total_codes}    color="#F5D060" icon={KeyRound} />
          <StatCard label="Active"        value={stats?.active_codes}   color="#22c55e" icon={CheckCircle2} />
          <StatCard label="Expired"       value={stats?.expired_codes}  color="#f59e0b" icon={Clock} />
          <StatCard label="Disabled"      value={stats?.disabled_codes} color="#6b7280" icon={XCircle} />
          <StatCard label="Lifetime"      value={stats?.lifetime_codes} color="#3b82f6" icon={KeyRound} />
        </div>

        {/* Activity Section */}
        <SectionLabel>Activity</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          <StatCard label="Renewals Today"    value={stats?.renewals_today}    color="#a855f7" icon={RefreshCw} />
          <StatCard label="Expiring Today"    value={stats?.expiring_today}    color="#f59e0b" icon={AlertCircle} />
          <StatCard label="Expiring Tomorrow" value={stats?.expiring_tomorrow} color="#f59e0b" icon={Calendar} />
          <StatCard label="Expiring 7 Days"   value={stats?.expiring_7days}    color="#f59e0b" icon={Clock} />
          <StatCard label="Permissions"       value={stats?.active_permissions} color="#8b5cf6" icon={Globe} />
        </div>

        {/* Support & Recent Section */}
        <SectionLabel>Support & Recent</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          <StatCard label="Pending Support"  value={stats?.pending_support}  color="#f97316" icon={MessageSquare} />
          <StatCard label="Pending Requests" value={pendingRequests}         color="#f97316" icon={TrendingUp} sub="Access requests" />
          <StatCard label="Recent Redeems"   value={stats?.recent_redeems}   color="#3b82f6" icon={KeyRound} sub="Last 7 days" />
          <StatCard label="Recent Renewals"  value={stats?.recent_renewals}  color="#a855f7" icon={RefreshCw} sub="Last 7 days" />
        </div>

        {/* Quick Links */}
        <SectionLabel>Quick Actions</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { to: "/admin/approved-users",   icon: "👥", label: "Manage Users" },
            { to: "/admin/access-codes",      icon: "🔑", label: "Reading Codes" },
            { to: "/admin/page-permissions",  icon: "🌐", label: "Page Access" },
            { to: "/admin/support",           icon: "💬", label: "Support Messages" },
            { to: "/admin/access-logs",       icon: "📋", label: "Access Logs" },
            { to: "/admin/feature-pricing",   icon: "💰", label: "Feature Pricing" },
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

      </motion.div>
    </AdminLayout>
  );
}