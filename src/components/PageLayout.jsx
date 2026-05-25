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
    // min-height via explicit px-equivalent avoids iOS 100vh recalc on scroll/zoom
    <div className="font-inter relative" style={{ background: "linear-gradient(180deg, #050d1a 0%, #0a1628 40%, #112840 100%)", minHeight: "100%" }}>
      <CosmicBackground />

      {/* Sticky Top Nav — reduced blur to avoid iOS repaint cascade on zoom */}
      <div
        className="sticky top-0 z-50 w-full px-3 py-2"
        style={{
          background: "rgba(4,10,22,0.97)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(212,175,55,0.12)",
          boxShadow: "0 2px 32px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.06)",
          willChange: "transform",
        }}
      >
        <div className="max-w-2xl mx-auto flex gap-1 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
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
                    : "rgba(255,255,255,0.08)",
                  boxShadow: isActive
                    ? "0 0 18px rgba(212,175,55,0.22), inset 0 1px 0 rgba(212,175,55,0.18)"
                    : "none",
                }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                style={{ borderRadius: 10, border: "1px solid", flexShrink: 0 }}
              >
                <Link
                  to={tab.path}
                  onClick={startNav}
                  className="relative flex flex-col items-center justify-center py-2 px-2 w-full h-full"
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                    userSelect: "none",
                    minHeight: 46,
                    minWidth: 52,
                  }}
                >
                  <motion.span
                    className="font-amiri font-bold leading-none"
                    style={{ fontSize: 13 }}
                    animate={{ color: isActive ? "#D4AF37" : "rgba(255,255,255,0.70)" }}
                    transition={{ duration: 0.25 }}
                  >
                    {tab.arabic}
                  </motion.span>
                  <motion.span
                    className="font-inter font-bold tracking-wider mt-0.5 leading-none"
                    style={{ fontSize: 8 }}
                    animate={{ color: isActive ? "rgba(212,175,55,0.95)" : "rgba(255,255,255,0.55)" }}
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

                  {/* layoutId removed — triggers layout recalc on every viewport resize/zoom */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-[9px] pointer-events-none"
                      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(212,175,55,0.14) 0%, transparent 75%)" }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Page content — plain div avoids framer-motion y-transform repaints on zoom */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}