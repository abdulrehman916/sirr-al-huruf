import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useNavigation } from "../context/NavigationContext";

const TABS = [
  { id: "home",            label: "HOME",    arabic: "الرئيسية", path: "/" },
  { id: "abjad-kabir",     label: "ABJAD",   arabic: "الأبجد",   path: "/abjad" },
  { id: "anasir",          label: "ANASIR",  arabic: "عناصر",    path: "/anasir" },
  { id: "hadim",           label: "HADIM",   arabic: "خادم",     path: "/hadim" },
  { id: "mizaan9",         label: "MIZAN",   arabic: "ميزان",    path: "/mizaan9" },
  { id: "magic-sqayer",    label: "SQAYER",  arabic: "السحر",    path: "/magic-sqayer" },
  { id: "vefkin-yapilisi", label: "VEFKİN",  arabic: "الوفق",    path: "/vefkin-yapilisi" },
];

// Stars generated once at module level — never recalculates on rerenders
const STARS = Array.from({ length: 50 }, (_, i) => {
  const seed = i * 137.508; // golden angle — stable pseudo-random
  const frac = (n) => (n % 1 + 1) % 1;
  return {
    width:  frac(Math.sin(seed) * 43758.5453) * 2 + 0.5,
    height: frac(Math.sin(seed) * 43758.5453) * 2 + 0.5,
    top:    `${frac(Math.cos(seed * 1.3) * 43758.5453) * 100}%`,
    left:   `${frac(Math.sin(seed * 1.7) * 43758.5453) * 100}%`,
    opacity: frac(Math.cos(seed * 2.1) * 43758.5453) * 0.5 + 0.1,
    animation: `twinkle ${2 + frac(Math.sin(seed * 0.9) * 43758.5453) * 4}s ease-in-out infinite`,
    animationDelay: `${frac(Math.cos(seed * 0.7) * 43758.5453) * 4}s`,
  };
});

// Memoized — never remounts, never recalculates stars
const CosmicBackground = memo(function CosmicBackground() {
  return (
    // Use absolute (not fixed) to avoid iOS fixed-element repaint on zoom
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {STARS.map((s, i) => (
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
});

export default function PageLayout({ children }) {
  const location = useLocation();
  const { startNav } = useNavigation();
  const activeId = TABS.find(t => t.path === location.pathname)?.id ?? undefined;

  return (
    <div className="font-inter relative" style={{ background: "linear-gradient(180deg, #03080f 0%, #060e1c 35%, #090f20 70%, #0c1428 100%)", minHeight: "100%" }}>
      <CosmicBackground />

      {/* Sticky Top Nav */}
      <div
        className="sticky top-0 z-50 w-full px-2 py-1.5"
        style={{
          background: "rgba(3,8,18,0.98)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(212,175,55,0.14)",
          boxShadow: "0 1px 0 rgba(212,175,55,0.06), 0 4px 40px rgba(0,0,0,0.70)",
          willChange: "transform",
        }}
      >
        {/* Subtle top gold line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)" }} />

        <div className="max-w-2xl mx-auto flex gap-1 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => {
            const isActive = activeId === tab.id;
            return (
              <motion.div
                key={tab.id}
                animate={{
                  background: isActive
                    ? "linear-gradient(160deg, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.06) 100%)"
                    : "transparent",
                  borderColor: isActive
                    ? "rgba(212,175,55,0.55)"
                    : "rgba(255,255,255,0.06)",
                  boxShadow: isActive
                    ? "0 0 20px rgba(212,175,55,0.25), inset 0 1px 0 rgba(212,175,55,0.20)"
                    : "none",
                }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                style={{ borderRadius: 10, border: "1px solid", flexShrink: 0 }}
              >
                <Link
                  to={tab.path}
                  onClick={startNav}
                  className="relative flex flex-col items-center justify-center py-2 px-2.5 w-full h-full"
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                    userSelect: "none",
                    minHeight: 48,
                    minWidth: 54,
                  }}
                >
                  <motion.span
                    className="font-amiri font-bold leading-none"
                    style={{ fontSize: 14 }}
                    animate={{ color: isActive ? "#E8C84A" : "rgba(255,255,255,0.55)" }}
                    transition={{ duration: 0.25 }}
                  >
                    {tab.arabic}
                  </motion.span>
                  <motion.span
                    className="font-inter font-semibold tracking-widest mt-0.5 leading-none"
                    style={{ fontSize: 7.5 }}
                    animate={{ color: isActive ? "rgba(232,200,74,0.90)" : "rgba(255,255,255,0.32)" }}
                    transition={{ duration: 0.25 }}
                  >
                    {tab.label}
                  </motion.span>

                  {/* Animated gold underline */}
                  <motion.div
                    className="absolute rounded-full"
                    style={{ bottom: 4, left: "50%", x: "-50%", height: 1.5, background: "linear-gradient(90deg, transparent, #E8C84A, transparent)" }}
                    animate={{ width: isActive ? 24 : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.30, ease: "easeInOut" }}
                  />

                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-[9px] pointer-events-none"
                      style={{ background: "radial-gradient(ellipse 80% 55% at 50% 110%, rgba(212,175,55,0.16) 0%, transparent 70%)" }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Page content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}