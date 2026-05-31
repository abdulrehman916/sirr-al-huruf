import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useNavigation } from "../context/NavigationContext";
import AtmosphericBackground from "./AtmosphericBackground";

const TABS = [
  { id: "home",            label: "HOME",   arabic: "الرئيسية", path: "/" },
  { id: "abjad-kabir",     label: "ABJAD",  arabic: "الأبجد",   path: "/abjad" },
  { id: "anasir",          label: "ANASIR", arabic: "عناصر",    path: "/anasir" },
  { id: "hadim",           label: "HADIM",  arabic: "خادم",     path: "/hadim" },
  { id: "mizaan9",         label: "MIZAN",  arabic: "ميزان",    path: "/mizaan9" },
  { id: "magic-sqayer",    label: "SQAYER", arabic: "السحر",    path: "/magic-sqayer" },
  { id: "vefkin-yapilisi", label: "VEFKİN", arabic: "الوفق",    path: "/vefkin-yapilisi" },
];

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

const NavTab = memo(function NavTab({ tab, isActive, onClick }) {
  return (
    <motion.div
      animate={{
        background: isActive
          ? "linear-gradient(160deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.07) 100%)"
          : "transparent",
        borderColor: isActive
          ? "rgba(212,175,55,0.60)"
          : "rgba(255,255,255,0.06)",
        boxShadow: isActive
          ? "0 0 24px rgba(212,175,55,0.30), 0 0 8px rgba(212,175,55,0.18), inset 0 1px 0 rgba(212,175,55,0.22)"
          : "none",
      }}
      transition={{ duration: 0.28, ease: "easeInOut" }}
      style={{ borderRadius: 10, border: "1px solid", flexShrink: 0, position: "relative", overflow: "hidden" }}
    >
      {/* Premium gold illumination top line on active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="active-sheen"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.30 }}
            style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1,
              background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.70), transparent)",
              zIndex: 2,
            }}
          />
        )}
      </AnimatePresence>

      <Link
        to={tab.path}
        onClick={onClick}
        className="relative flex flex-col items-center justify-center py-2 px-2.5"
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
          animate={{ color: isActive ? "#E8C84A" : "rgba(255,255,255,0.52)" }}
          transition={{ duration: 0.25 }}
        >
          {tab.arabic}
        </motion.span>

        <motion.span
          className="font-inter font-semibold tracking-widest mt-0.5 leading-none"
          style={{ fontSize: 7.5 }}
          animate={{ color: isActive ? "rgba(232,200,74,0.88)" : "rgba(255,255,255,0.28)" }}
          transition={{ duration: 0.25 }}
        >
          {tab.label}
        </motion.span>

        {/* Animated gold underline */}
        <motion.div
          className="absolute rounded-full"
          style={{
            bottom: 4, left: "50%", x: "-50%", height: 1.5,
            background: "linear-gradient(90deg, transparent, #E8C84A, transparent)",
          }}
          animate={{ width: isActive ? 26 : 0, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.30, ease: "easeInOut" }}
        />

        {/* Bottom inner glow for active */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-[9px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 115%, rgba(212,175,55,0.20) 0%, transparent 70%)",
            }}
          />
        )}
      </Link>
    </motion.div>
  );
});

export default function PageLayout({ children }) {
  const location = useLocation();
  const { startNav } = useNavigation();
  const activeId = TABS.find(t => t.path === location.pathname)?.id ?? undefined;

  return (
    <div
      className="font-inter relative"
      style={{
        background:
          "linear-gradient(180deg, #020710 0%, #050d1a 30%, #08101f 65%, #0b1326 100%)",
        minHeight: "100%",
      }}
    >
      {/* Rich atmospheric background */}
      <AtmosphericBackground />

      {/* ── Sticky Top Nav ── */}
      <div
        className="sticky top-0 z-50 w-full px-2 py-1.5"
        style={{
          background: "rgba(2,6,16,0.97)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(212,175,55,0.13)",
          boxShadow:
            "0 1px 0 rgba(212,175,55,0.05), 0 6px 48px rgba(0,0,0,0.80)",
          willChange: "transform",
        }}
      >
        {/* Manuscript gold top accent line */}
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background:
              "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.42) 40%, rgba(232,200,74,0.55) 50%, rgba(212,175,55,0.42) 60%, transparent 95%)",
          }}
        />

        <div className="max-w-2xl mx-auto flex gap-1 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => (
            <NavTab
              key={tab.id}
              tab={tab}
              isActive={activeId === tab.id}
              onClick={startNav}
            />
          ))}
        </div>
      </div>

      {/* ── Page content with smooth transition ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.38, ease: "easeOut" }}
          className="relative z-10 max-w-2xl mx-auto px-4 py-6 pb-14"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}