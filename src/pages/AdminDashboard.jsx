import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigate, Link, useLocation } from "react-router-dom";
import { Users, Globe, Clock, Crown, KeyRound, UserCheck, Menu, X, Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import { useToast } from "@/components/ui/use-toast";

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div
      className="rounded-xl border p-3 text-center"
      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(212,175,55,0.30)" }}
    >
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <p className="text-lg font-bold text-white">{value.toLocaleString()}</p>
      </div>
      <p className="text-[9px] text-white/40">{label}</p>
    </div>
  );
}

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.22)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)"
};

const SIDEBAR_ITEMS = [
  { path: "/admin/approved-users", label: "Users", arabic: "المستخدمون", icon: UserCheck },
  { path: "/admin/access-dashboard", label: "Dashboard", arabic: "لوحة التحكم", icon: Crown },
  { path: "/admin/page-permissions", label: "Permissions", arabic: "الأذونات", icon: Globe },
  { path: "/admin/access-codes", label: "Codes", arabic: "الرموز", icon: KeyRound },
  { path: "/admin/support", label: "Messages", arabic: "الرسائل", icon: Clock }
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    checkAdminAccess();
    fetchStats();
    fetchPendingRequests();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const currentUser = await base44.auth.me();
      if (!currentUser || currentUser.role !== 'admin') {
        setIsAdmin(false);
        toast({
          title: "Access Denied",
          description: "Only administrators can access this page",
          variant: "destructive"
        });
        return;
      }
      setUser(currentUser);
      setIsAdmin(true);
      setIsOwner(currentUser.role === 'admin');
    } catch (error) {
      setIsAdmin(false);
      toast({
        title: "Authentication Error",
        description: "Please log in to continue",
        variant: "destructive"
      });
    }
  };

  const fetchStats = async () => {
    try {
      const res = await base44.functions.invoke('getUserStats');
      setStats(res.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const [old, newReqs] = await Promise.all([
        base44.entities.PremiumAccessRequest.filter({ status: "PENDING" }).then(r => r.length),
        base44.entities.AccessRequest.filter({ status: "PENDING" }).then(r => r.length),
      ]);
      setPendingRequests(old + newReqs);
    } catch (error) {
      console.error('Failed to fetch pending requests:', error);
    }
  };

  if (isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  if (isAdmin === null) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-gold border-r-transparent border-b-gold border-l-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading dashboard...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen flex" style={{ background: "linear-gradient(180deg, #020710 0%, #060c1c 100%)" }}>
        {/* Mobile sidebar toggle - visible only on mobile (< 768px) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
          style={{
            background: G.bg,
            border: `1px solid ${G.border}`,
            color: G.text
          }}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Sidebar - Compact 200px */}
        <aside
          className={`fixed md:sticky md:top-0 left-0 h-screen w-[200px] transition-transform duration-300 z-40 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
          style={{
            background: "linear-gradient(180deg, rgba(8,16,40,0.98) 0%, rgba(3,8,22,0.99) 100%)",
            borderRight: `1px solid ${G.border}`
          }}
        >
          <div className="p-3">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-5 h-5" style={{ color: G.text }} />
                <h1 className="font-inter text-base font-bold text-white">Admin</h1>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`block p-2.5 rounded-lg transition-all duration-200 ${
                      isActive ? "bg-gold/10" : "hover:bg-white/5"
                    }`}
                    style={{
                      background: isActive ? G.bgHi : "transparent",
                      border: isActive ? `1px solid ${G.borderHi}` : `1px solid transparent`
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-gold" : "text-white/50"}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`font-inter text-xs font-semibold truncate ${isActive ? "text-white" : "text-white/70"}`}>
                          {item.label}
                        </p>
                        <p className="font-amiri text-[10px] truncate" style={{ color: isActive ? G.text : G.dim }}>
                          {item.arabic}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content - Full width minus sidebar */}
        <main className="flex-1 p-4 md:p-4 lg:p-5 overflow-auto md:ml-[200px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Stats Grid - 7 stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <StatCard label="Total Users" value={stats?.total_users || 0} color="#F5D060" icon={Users} />
              <StatCard label="Active" value={stats?.active_users || 0} color="#22c55e" icon={UserCheck} />
              <StatCard label="Expired" value={stats?.expired_users || 0} color="#f59e0b" icon={Clock} />
              <StatCard label="Blocked" value={stats?.blocked_users || 0} color="#ef4444" icon={Shield} />
              <StatCard label="Removed" value={Math.max(0, (stats?.total_users || 0) - (stats?.active_users || 0) - (stats?.expired_users || 0) - (stats?.blocked_users || 0))} color="#6b7280" icon={Users} />
              <StatCard label="Codes" value={stats?.total_codes || 0} color="#3b82f6" icon={KeyRound} />
              <StatCard label="Permissions" value={stats?.active_permissions || 0} color="#8b5cf6" icon={Globe} />
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2">
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                    style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(212,175,55,0.30)` }}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="p-2 rounded-lg" style={{ background: "rgba(212,175,55,0.15)" }}>
                        <Icon className="w-5 h-5" style={{ color: "#F5D060" }} />
                      </div>
                      <div>
                        <h3 className="font-inter text-sm font-bold text-white">{item.label}</h3>
                        <p className="font-amiri text-[10px]" style={{ color: "rgba(212,175,55,0.60)" }}>{item.arabic}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </main>
      </div>
    </PageLayout>
  );
}