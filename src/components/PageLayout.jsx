import { memo, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // AnimatePresence used for page transitions
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useNavigation } from "../context/NavigationContext";
import AtmosphericBackground from "./AtmosphericBackground";

const TABS = [
  { id: "home",             label: "HOME",   arabic: "الرئيسية", path: "/" },
  { id: "abjad-kabir",      label: "ABJAD",  arabic: "الأبجد",   path: "/abjad" },
  { id: "anasir",           label: "ANASIR", arabic: "عناصر",    path: "/anasir" },
  { id: "hadim",            label: "HADIM",  arabic: "خادم",     path: "/hadim" },
  { id: "mizaan9",          label: "MIZAN",  arabic: "ميزان",    path: "/mizaan9" },
  { id: "magic-sqayer",     label: "SQAYER", arabic: "السحر",    path: "/magic-sqayer" },
  { id: "vefkin-yapilisi",  label: "VEFKİN", arabic: "الوفق",    path: "/vefkin-yapilisi" },
  { id: "basthul-huroof-2", label: "BAST",   arabic: "البسط",    path: "/basthul-huroof-2" },
  { id: "faal-hasrath",     label: "FAAL",   arabic: "فأل",       path: "/faal-hasrath" },
  { id: "plants",           label: "PLANTS", arabic: "نباتات",    path: "/plants" },
];

// Page transition — subtle fade only (no y-shift) for snappier feel on mobile
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

// ── Top horizontal nav tab — instant activation, zero delay ──
const NavTab = memo(function NavTab({ tab, isActive, onClick }) {
  return (
    <div
      style={{
        borderRadius: 10,
        border: "1px solid",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        background: isActive
          ? "linear-gradient(160deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.07) 100%)"
          : "transparent",
        borderColor: isActive ? "rgba(212,175,55,0.60)" : "rgba(255,255,255,0.06)",
        boxShadow: isActive
          ? "0 0 16px rgba(212,175,55,0.22), inset 0 1px 0 rgba(212,175,55,0.22)"
          : "none",
      }}
    >
      {isActive && (
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.70), transparent)",
            zIndex: 2,
          }}
        />
      )}

      <Link
        to={tab.path}
        onClick={onClick}
        className="relative flex flex-col items-center justify-center py-2 px-2.5"
        style={{
          WebkitTapHighlightColor: "transparent",
          touchAction: "manipulation",
          userSelect: "none",
          minHeight: 44,
          minWidth: 52,
        }}
      >
        <span
          className="font-amiri font-bold leading-none"
          style={{
            fontSize: 14,
            color: isActive ? "#E8C84A" : "rgba(255,255,255,0.52)",
          }}
        >
          {tab.arabic}
        </span>

        <span
          className="font-inter font-semibold tracking-widest mt-0.5 leading-none"
          style={{
            fontSize: 7.5,
            color: isActive ? "rgba(232,200,74,0.88)" : "rgba(255,255,255,0.28)",
          }}
        >
          {tab.label}
        </span>

        <div
          style={{
            position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)",
            height: 1.5, borderRadius: 999,
            background: "linear-gradient(90deg, transparent, #E8C84A, transparent)",
            width: isActive ? 26 : 0,
            opacity: isActive ? 1 : 0,
          }}
        />

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
    </div>
  );
});



// ── Scroll position memory per route ─────────────────────────────
const scrollMemory = {};

export default function PageLayout({ children }) {
  const location = useLocation();
  const navigate  = useNavigate();
  const { startNav } = useNavigation();

  const activeId = useMemo(
    () => TABS.find(t => t.path === location.pathname)?.id ?? undefined,
    [location.pathname]
  );

  const scrollRef = useRef(null);

  // Save / restore scroll position per route
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Restore saved scroll for this route
    const saved = scrollMemory[location.pathname] ?? 0;
    el.scrollTop = saved;

    return () => {
      // Save scroll when leaving
      if (scrollRef.current) {
        scrollMemory[location.pathname] = scrollRef.current.scrollTop;
      }
    };
  }, [location.pathname]);

  // Native back gesture support — popstate fires on Android back & iOS swipe
  useEffect(() => {
    const onPop = () => {
      // React Router already handles URL change; just trigger animation hint
      startNav();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [startNav]);

  return (
    <div
      className="font-inter relative flex flex-col"
      style={{
        background: "linear-gradient(180deg, #020710 0%, #050d1a 30%, #08101f 65%, #0b1326 100%)",
        minHeight: "100vh",
        height: "auto",
        // Safe area: top for notch/Dynamic Island, bottom for home indicator, sides for landscape
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <AtmosphericBackground />

      {/* ── Sticky Top Nav ── */}
      <div
        className="sticky top-0 z-50 w-full px-2 py-1.5 flex-shrink-0"
        role="navigation"
        aria-label="Main navigation"
        style={{
          background: "rgba(2,6,16,0.98)",
          borderBottom: "1px solid rgba(212,175,55,0.13)",
          boxShadow: "0 1px 0 rgba(212,175,55,0.05), 0 4px 24px rgba(0,0,0,0.80)",
        }}
      >
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

      {/* ── Scrollable page content ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{
          overscrollBehaviorY: "none",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
          minHeight: 0,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.20, ease: "easeOut" }}
            className="relative z-10 w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6"
            style={{
              paddingBottom: "env(safe-area-inset-bottom)",
              boxSizing: "border-box",
              minHeight: "auto",
              height: "auto",
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>


    </div>
  );
}