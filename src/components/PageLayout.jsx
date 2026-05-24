import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useNavigation } from "../context/NavigationContext";

const TABS = [
  { id: "home",    label: "HOME",     arabic: "الرئيسية", path: "/" },
  { id: "abjad",   label: "ABJAD",    arabic: "أبجد",     path: "/abjad" },
  { id: "anasir",  label: "ANASIR",   arabic: "عناصر",    path: "/anasir" },
  { id: "hadim",   label: "HADIM",    arabic: "خادم",     path: "/hadim" },
  { id: "mizaan9", label: "MIZAAN",   arabic: "ميزان",    path: "/mizaan9" },
];

function CosmicBackground() {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    width: Math.random() * 2 + 0.5,
    height: Math.random() * 2 + 0.5,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.5 + 0.1,
    animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 4}s`,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white" style={s} />
      ))}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)"
      }} />
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}

export default function PageLayout({ children }) {
  const location = useLocation();
  const { startNav } = useNavigation();
  const activeId = TABS.find(t => t.path === location.pathname)?.id;

  return (
    <div className="min-h-screen font-inter relative" style={{ background: "linear-gradient(180deg, #050d1a 0%, #0a1628 40%, #112840 100%)" }}>
      <CosmicBackground />

      {/* Sticky Top Nav */}
      <div
        className="sticky top-0 z-50 w-full px-3 py-2"
        style={{
          background: "rgba(4,10,22,0.94)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(212,175,55,0.12)",
          boxShadow: "0 2px 32px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.06)",
        }}
      >
        <div className="max-w-2xl mx-auto grid grid-cols-5 gap-1">
          {TABS.map((tab) => {
            const isActive = activeId === tab.id;
            return (
              <motion.div
                key={tab.id}
                animate={{
                  background: isActive
                    ? "linear-gradient(160deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.08) 100%)"
                    : "rgba(255,255,255,0.025)",
                  borderColor: isActive
                    ? "rgba(212,175,55,0.50)"
                    : "rgba(255,255,255,0.06)",
                  boxShadow: isActive
                    ? "0 0 18px rgba(212,175,55,0.22), inset 0 1px 0 rgba(212,175,55,0.18)"
                    : "none",
                }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                style={{ borderRadius: 10, border: "1px solid" }}
              >
                <Link
                  to={tab.path}
                  onClick={startNav}
                  className="relative flex flex-col items-center justify-center py-2 px-1 w-full h-full"
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                    userSelect: "none",
                    minHeight: 46,
                  }}
                >
                  <motion.span
                    className="font-amiri font-bold leading-none"
                    style={{ fontSize: "clamp(11px, 3vw, 14px)" }}
                    animate={{ color: isActive ? "#D4AF37" : "rgba(255,255,255,0.40)" }}
                    transition={{ duration: 0.25 }}
                  >
                    {tab.arabic}
                  </motion.span>
                  <motion.span
                    className="font-inter font-bold tracking-widest mt-0.5 leading-none"
                    style={{ fontSize: "clamp(6px, 1.6vw, 8px)" }}
                    animate={{ color: isActive ? "rgba(212,175,55,0.88)" : "rgba(255,255,255,0.22)" }}
                    transition={{ duration: 0.25 }}
                  >
                    {tab.label}
                  </motion.span>

                  {/* Animated gold underline */}
                  <motion.div
                    className="absolute rounded-full"
                    style={{ bottom: 3, left: "50%", x: "-50%", height: 2, background: "linear-gradient(90deg, rgba(212,175,55,0.3), #D4AF37, rgba(212,175,55,0.3))" }}
                    animate={{ width: isActive ? 20 : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.30, ease: "easeInOut" }}
                  />

                  {/* Shared layout underline for smooth cross-tab travel */}
                  {isActive && (
                    <motion.div
                      layoutId="navGlow"
                      className="absolute inset-0 rounded-[9px] pointer-events-none"
                      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(212,175,55,0.14) 0%, transparent 75%)" }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Page content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 max-w-2xl mx-auto px-4 py-8"
      >
        {children}
      </motion.div>
    </div>
  );
}