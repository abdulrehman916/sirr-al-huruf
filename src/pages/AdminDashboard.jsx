import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigate, Link, useLocation } from "react-router-dom";
import { Users, Globe, Shield, CreditCard, DollarSign, ChevronRight, Menu, X, Activity, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import { useToast } from "@/components/ui/use-toast";

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
  {
    path: "/admin/user-permissions",
    label: "User Permissions",
    arabic: "أذونات المستخدمين",
    icon: Shield,
    description: "Grant & revoke page access per user"
  },
  {
    path: "/admin/user-management",
    label: "User Access Manager",
    arabic: "إدارة المستخدمين",
    icon: Users,
    description: "Grant manual access & manage subscriptions"
  },
  {
    path: "/admin/pricing-settings",
    label: "Pricing Settings",
    arabic: "إعدادات الأسعار",
    icon: DollarSign,
    description: "Set custom prices per page"
  },
  {
    path: "/admin/subscription-requests",
    label: "Access Requests",
    arabic: "طلبات الوصول",
    icon: Clock,
    description: "Review & approve access requests"
  },
  {
    path: "/admin/subscriptions-management",
    label: "Subscription Management",
    arabic: "إدارة الاشتراكات",
    icon: CreditCard,
    description: "Manage active subscriptions"
  },
  {
    path: "/admin/access-logs",
    label: "Access Logs",
    arabic: "سجلات الوصول",
    icon: Activity,
    description: "Monitor all page access attempts"
  },
  {
    path: "/admin/page-permissions",
    label: "Page Permissions",
    arabic: "أذونات الصفحات",
    icon: Globe,
    description: "Toggle PUBLIC/PRIVATE access"
  },
  {
    path: "/admin/subscriptions",
    label: "Global Subscriptions",
    arabic: "الاشتراكات العامة",
    icon: CreditCard,
    description: "Manage global subscription plans"
  },
  {
    path: "/admin/page-subscriptions",
    label: "Page Subscriptions",
    arabic: "اشتراكات الصفحات",
    icon: Shield,
    description: "Manage page-specific subscriptions"
  }
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    checkAdminAccess();
    fetchPendingRequests();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const currentUser = await base44.auth.me();
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'owner')) {
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
      setIsOwner(currentUser.role === 'owner' || currentUser.role === 'admin');
    } catch (error) {
      setIsAdmin(false);
      toast({
        title: "Authentication Error",
        description: "Please log in to continue",
        variant: "destructive"
      });
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const requests = await base44.entities.PremiumAccessRequest.list();
      const pending = requests.filter(r => r.status === 'PENDING').length;
      setPendingRequests(pending);
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
      <div className="min-h-screen flex">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
          style={{
            background: G.bg,
            border: `1px solid ${G.border}`,
            color: G.text
          }}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky lg:top-0 left-0 h-screen w-72 transition-transform duration-300 z-40 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
          style={{
            background: "linear-gradient(180deg, rgba(8,16,40,0.98) 0%, rgba(3,8,22,0.99) 100%)",
            borderRight: `1px solid ${G.border}`
          }}
        >
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-6 h-6" style={{ color: G.text }} />
                <h1 className="font-inter text-lg font-bold text-white">Admin Panel</h1>
              </div>
              <p className="text-xs text-white/50">Owner & Super Admin</p>
            </div>

            {/* User Info */}
            <div
              className="mb-6 p-3 rounded-xl"
              style={{ background: G.bg, border: `1px solid ${G.border}` }}
            >
              <p className="font-inter text-sm font-semibold text-white truncate">
                {user?.full_name || "Admin"}
              </p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {SIDEBAR_ITEMS.filter(item => item.path !== '/admin/page-permissions' || isOwner).map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                const hasBadge = item.path === "/admin/subscription-requests" && pendingRequests > 0;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`block p-3 rounded-xl transition-all duration-200 ${
                      isActive ? "bg-gold/10" : "hover:bg-white/5"
                    }`}
                    style={{
                      background: isActive ? G.bgHi : "transparent",
                      border: isActive ? `1px solid ${G.borderHi}` : `1px solid transparent`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-gold" : "text-white/50"}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`font-inter text-sm font-semibold truncate ${isActive ? "text-white" : "text-white/70"}`}>
                          {item.label}
                        </p>
                        <p className="font-amiri text-xs truncate" style={{ color: isActive ? G.text : G.dim }}>
                          {item.arabic}
                        </p>
                      </div>
                      {hasBadge && (
                        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-orange-500 rounded-full">
                          {pendingRequests > 9 ? '9+' : pendingRequests}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-4 h-4 text-gold" />}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Welcome Card */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${G.bg} 0%, rgba(212,175,55,0.05) 100%)`,
                  border: `1px solid ${G.border}`
                }}
              >
                <h2 className="font-inter text-xl font-bold text-white mb-2">
                  Welcome to Admin Dashboard
                </h2>
                <p className="text-white/60 text-sm">
                  Manage user access and page visibility settings from the sidebar.
                </p>
              </div>

              {/* Quick Access Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {SIDEBAR_ITEMS.filter(item => item.path !== '/admin/page-permissions' || isOwner).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="p-5 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                      style={{
                        background: G.bg,
                        border: `1px solid ${G.border}`
                      }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: G.text }} />
                        </div>
                        <div>
                          <h3 className="font-inter text-base font-bold text-white">
                            {item.label}
                          </h3>
                          <p className="font-amiri text-xs" style={{ color: G.dim }}>
                            {item.arabic}
                          </p>
                        </div>
                      </div>
                      <p className="text-white/60 text-sm">
                        {item.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageLayout>
  );
}