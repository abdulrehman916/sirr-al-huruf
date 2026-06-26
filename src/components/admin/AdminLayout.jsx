import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronLeft, Shield } from "lucide-react";

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
  { path: "/admin/approved-users", label: "Users", icon: "UserCheck" },
  { path: "/admin/access-dashboard", label: "Dashboard", icon: "Crown" },
  { path: "/admin/page-permissions", label: "Pages", icon: "Globe" },
  { path: "/admin/access-codes", label: "Codes", icon: "KeyRound" },
  { path: "/admin/support", label: "Messages", icon: "Clock" }
];

const iconMap = {
  UserCheck: "👥",
  Crown: "👑",
  Globe: "🌐",
  KeyRound: "🔑",
  Clock: "🕐"
};

export default function AdminLayout({ children, title, subtitle, showBackButton = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleBack = () => {
    const adminPaths = SIDEBAR_ITEMS.map(item => item.path);
    const referrer = document.referrer;
    
    if (referrer) {
      const referrerUrl = new URL(referrer);
      const referrerPath = referrerUrl.pathname;
      
      if (adminPaths.includes(referrerPath) || referrerPath.startsWith('/admin/')) {
        navigate(-1);
        return;
      }
    }
    
    navigate('/admin/access-dashboard');
  };

  return (
    <div className="admin-layout-container" style={{
      display: "flex",
      minHeight: "100dvh",
      width: "100%",
      maxWidth: "100vw",
      overflow: "hidden",
      position: "relative"
    }}>
      {/* ========== MOBILE SIDEBAR (OVERLAY) - < 768px ========== */}
      <style>{`
        @media (max-width: 767px) {
          .admin-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 280px !important;
            height: 100dvh !important;
            z-index: 1000 !important;
            transform: translateX(-100%) !important;
            transition: transform 0.3s ease !important;
          }
          .admin-sidebar.open {
            transform: translateX(0) !important;
          }
          .admin-main-content {
            width: 100% !important;
            margin-left: 0 !important;
            padding: 16px !important;
          }
          .admin-mobile-toggle {
            display: flex !important;
          }
          .admin-tablet-sidebar {
            display: none !important;
          }
        }
      `}</style>

      {/* ========== TABLET SIDEBAR (FIXED LEFT) - 768px to 1024px ========== */}
      <style>{`
        @media (min-width: 768px) and (max-width: 1024px) {
          .admin-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 200px !important;
            height: 100dvh !important;
            z-index: 100 !important;
            transform: translateX(0) !important;
          }
          .admin-main-content {
            width: 100% !important;
            margin-left: 200px !important;
            padding: 16px !important;
          }
          .admin-mobile-toggle {
            display: none !important;
          }
          .admin-sidebar-content {
            padding: 12px !important;
          }
        }
      `}</style>

      {/* ========== DESKTOP SIDEBAR (COMPACT) - > 1024px ========== */}
      <style>{`
        @media (min-width: 1025px) {
          .admin-sidebar {
            position: sticky !important;
            top: 0 !important;
            left: 0 !important;
            width: 200px !important;
            min-width: 200px !important;
            height: 100dvh !important;
            z-index: 50 !important;
            transform: translateX(0) !important;
          }
          .admin-main-content {
            flex: 1 !important;
            margin-left: 0 !important;
            padding: 20px !important;
            max-width: calc(100% - 200px) !important;
          }
          .admin-mobile-toggle {
            display: none !important;
          }
          .admin-sidebar-content {
            padding: 12px !important;
          }
        }
      `}</style>

      {/* Mobile Sidebar Toggle Button */}
      <button
        className="admin-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          display: "none",
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1001,
          padding: "10px 12px",
          borderRadius: 12,
          background: G.bg,
          border: `1px solid ${G.border}`,
          color: G.text,
          cursor: "pointer"
        }}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          background: "linear-gradient(180deg, rgba(8,16,40,0.98) 0%, rgba(3,8,22,0.99) 100%)",
          borderRight: `1px solid ${G.border}`
        }}
      >
        <div className="admin-sidebar-content">
          {/* Header */}
          <div style={{ marginBottom: 12 }}>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5" style={{ color: G.text }} />
              <h1 className="font-inter text-base font-bold text-white">Admin</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: 10,
                    borderRadius: 8,
                    background: isActive ? G.bgHi : "transparent",
                    border: isActive ? `1px solid ${G.borderHi}` : "1px solid transparent",
                    textDecoration: "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  <span style={{ fontSize: 16 }}>{iconMap[item.icon]}</span>
                  <p className={`font-inter text-xs font-semibold truncate ${isActive ? "text-white" : "text-white/70"}`}>
                    {item.label}
                  </p>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content" style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden"
      }}>
        {/* Back Button & Title */}
        {showBackButton && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: `1px solid ${G.border}`
          }}>
            <button
              onClick={handleBack}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 12,
                background: G.bg,
                border: `1px solid ${G.border}`,
                color: G.text,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            {title && (
              <div>
                <h2 className="font-inter text-xl font-bold text-white">{title}</h2>
                {subtitle && (
                  <p className="font-amiri text-sm" style={{ color: G.dim }}>{subtitle}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}