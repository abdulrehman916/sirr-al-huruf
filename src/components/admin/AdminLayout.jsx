import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield, LayoutDashboard, Users, KeyRound, Globe, MessageSquare, FileText, Settings, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
};

const SIDEBAR_SECTIONS = [
  {
    label: "Overview",
    items: [
      { path: "/admin/access-dashboard", label: "Dashboard", icon: LayoutDashboard },
    ]
  },
  {
    label: "Users",
    items: [
      { path: "/admin/approved-users", label: "All Users", icon: Users },
    ]
  },
  {
    label: "Access Control",
    items: [
      { path: "/admin/access-codes", label: "Reading Codes", icon: KeyRound },
      { path: "/admin/page-permissions", label: "Page Access", icon: Globe },
    ]
  },
  {
    label: "Support",
    items: [
      { path: "/admin/support", label: "Support Messages", icon: MessageSquare },
    ]
  },
  {
    label: "System",
    items: [
      { path: "/admin/access-logs", label: "Access Logs", icon: FileText },
      { path: "/admin/settings", label: "Settings", icon: Settings },
    ]
  },
];

function SidebarContent({ location, onNavigate }) {
  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${G.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Shield style={{ width: 18, height: 18, color: G.text }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>Admin Panel</span>
        </div>
      </div>

      {/* Sections */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18, overflowY: "auto" }}>
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.label}>
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(212,175,55,0.40)",
              marginBottom: 6,
              paddingLeft: 8,
            }}>
              {section.label}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onNavigate}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "9px 10px",
                      borderRadius: 9,
                      background: isActive ? G.bgHi : "transparent",
                      border: isActive ? `1px solid ${G.borderHi}` : "1px solid transparent",
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Icon style={{ width: 15, height: 15, flexShrink: 0, color: isActive ? G.text : "rgba(255,255,255,0.45)" }} />
                    <span style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 12,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#fff" : "rgba(255,255,255,0.60)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div style={{
                        marginLeft: "auto",
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: G.text,
                        flexShrink: 0,
                      }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Back to App */}
      <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${G.border}` }}>
        <Link
          to="/"
          onClick={onNavigate}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            textDecoration: "none",
          }}
        >
          <ChevronLeft style={{ width: 14, height: 14, color: "rgba(255,255,255,0.35)" }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.40)" }}>
            Back to App
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout({ children, title, subtitle, showBackButton = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div style={{
      display: "flex",
      width: "100%",
      minHeight: "100dvh",
      background: "linear-gradient(180deg, #020710 0%, #060c1c 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* ── Mobile overlay backdrop ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.65)",
              zIndex: 998,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile Hamburger ── */}
      <button
        onClick={() => setSidebarOpen(v => !v)}
        style={{
          display: "none",
          position: "fixed",
          top: 14,
          left: 14,
          zIndex: 1001,
          padding: "9px 11px",
          borderRadius: 10,
          background: G.bg,
          border: `1px solid ${G.border}`,
          color: G.text,
          cursor: "pointer",
        }}
        className="admin-mobile-toggle"
      >
        {sidebarOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
      </button>

      {/* ── Sidebar ── */}
      <aside
        className={`admin-sidebar${sidebarOpen ? " open" : ""}`}
        style={{
          background: "linear-gradient(180deg, rgba(5,10,28,0.99) 0%, rgba(2,5,16,1) 100%)",
          borderRight: `1px solid ${G.border}`,
          flexShrink: 0,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <SidebarContent location={location} onNavigate={closeSidebar} />
      </aside>

      {/* ── Main content ── */}
      <main
        className="admin-main-content"
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          minWidth: 0,
        }}
      >
        {showBackButton && title && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 20px",
            borderBottom: `1px solid ${G.border}`,
            marginBottom: 0,
          }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 9,
                background: G.bg, border: `1px solid ${G.border}`,
                color: G.text, cursor: "pointer", fontSize: 13, fontWeight: 600,
              }}
            >
              <ChevronLeft style={{ width: 15, height: 15 }} />
              Back
            </button>
            <div>
              <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>{title}</h2>
              {subtitle && <p style={{ fontFamily: "var(--font-amiri)", fontSize: 13, color: G.dim, margin: 0 }}>{subtitle}</p>}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.14 }}
            style={{ padding: "20px" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Responsive CSS */}
      <style>{`
        .admin-mobile-toggle { display: none !important; }

        .admin-sidebar {
          width: 210px;
          min-width: 210px;
          height: 100dvh;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .admin-main-content {
          padding: 0;
        }

        @media (max-width: 767px) {
          .admin-mobile-toggle { display: flex !important; }
          .admin-sidebar {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 260px !important; min-width: 260px !important;
            height: 100dvh !important;
            z-index: 999 !important;
            transform: translateX(-100%) !important;
            transition: transform 0.28s ease !important;
          }
          .admin-sidebar.open {
            transform: translateX(0) !important;
          }
          .admin-main-content {
            width: 100% !important;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .admin-sidebar {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 190px !important; min-width: 190px !important;
            height: 100dvh !important;
            z-index: 100 !important;
            transform: translateX(0) !important;
          }
          .admin-main-content {
            margin-left: 190px !important;
          }
        }
      `}</style>
    </div>
  );
}