import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";

const TABS = [
  { id: "abjad", label: "ABJAD", arabic: "أبجد", path: "/abjad" },
  { id: "anasir", label: "ANASIR", arabic: "عناصر", path: "/anasir" },
  { id: "hadim", label: "HADIM", arabic: "خادم", path: "/hadim" },
  { id: "mizaan9", label: "MIZAAN 9", arabic: "ميزان", path: "/mizaan9" },
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

export default function PageLayout({ children, accentColor = "gold" }) {
  const location = useLocation();
  const { startNav } = useNavigation();
  const activeId = TABS.find(t => t.path === location.pathname)?.id;

  const accentMap = {
    gold: { border: "rgba(212,175,55,0.40)", glow: "rgba(212,175,55,0.15)" },
    cyan: { border: "rgba(6,182,212,0.40)", glow: "rgba(6,182,212,0.12)" },
    purple: { border: "rgba(168,85,247,0.40)", glow: "rgba(168,85,247,0.12)" },
  };
  const accent = accentMap[accentColor] || accentMap.gold;

  return (
    <div className="min-h-screen font-inter relative" style={{ background: "linear-gradient(180deg, #050d1a 0%, #0a1628 40%, #112840 100%)" }}>
      <CosmicBackground />

      {/* Sticky Top Nav */}
      <div
        className="sticky top-0 z-50 w-full py-2 px-4"
        style={{
          background: "rgba(5,13,26,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(212,175,55,0.15)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {/* Back Home */}
          <Link
            to="/"
            onMouseDown={startNav}
            onTouchStart={startNav}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.25)",
              color: "rgba(212,175,55,0.80)",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              transform: "translateZ(0)",
            }}
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span className="font-inter text-[10px] uppercase tracking-widest font-semibold">Home</span>
          </Link>

          {/* Tab Nav */}
          <div className="flex-1 grid grid-cols-4 gap-1">
            {TABS.map((tab) => {
              const isActive = activeId === tab.id;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  onMouseDown={startNav}
                  onTouchStart={startNav}
                  className="relative flex flex-col items-center py-1.5 px-1 rounded-lg transition-all duration-300"
                  style={isActive ? {
                    background: "linear-gradient(135deg, rgba(212,175,55,0.28), rgba(212,175,55,0.12))",
                    border: "1px solid rgba(212,175,55,0.45)",
                    boxShadow: "0 0 12px rgba(212,175,55,0.20)",
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                    transform: "translateZ(0)",
                  } : {
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                    transform: "translateZ(0)",
                  }}
                >
                  <span className="font-amiri text-xs font-bold" style={{ color: isActive ? "#D4AF37" : "rgba(255,255,255,0.45)" }}>
                    {tab.arabic}
                  </span>
                  <span className="font-inter font-bold" style={{ fontSize: 7, letterSpacing: "0.08em", color: isActive ? "rgba(212,175,55,0.85)" : "rgba(255,255,255,0.25)" }}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-0.5 left-1/2 rounded-full"
                      style={{ width: 16, height: 2, background: "#D4AF37", transform: "translateX(-50%)" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
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