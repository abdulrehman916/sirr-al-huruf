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

// ── Top horizontal nav tab — CSS transitions only, zero Framer Motion ──
const NavTab = memo(function NavTab({ tab, isActive, onClick }) {
  return (
    <div
      style={{
        borderRadius: 10,
        border: "1px solid",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        transition: "background 0.25s, border-color 0.25s, box-shadow 0.25s",
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
            transition: "color 0.22s",
          }}
        >
          {tab.arabic}
        </span>

        <span
          className="font-inter font-semibold tracking-widest mt-0.5 leading-none"
          style={{
            fontSize: 7.5,
            color: isActive ? "rgba(232,200,74,0.88)" : "rgba(255,255,255,0.28)",
            transition: "color 0.22s",
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
            transition: "width 0.28s, opacity 0.28s",
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

// ── Bottom tab bar — CSS transitions only, zero Framer Motion ──
const BottomTab = memo(function BottomTab({ tab, isActive, onClick }) {
  return (
    <Link
      to={tab.path}
      onClick={onClick}
      style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation", userSelect: "none" }}
      className="flex-1 flex flex-col items-center justify-center py-1.5 gap-0.5 min-w-0 relative"
    >
      <span
        className="font-amiri font-bold leading-none"
        style={{
          fontSize: 15,
          color: isActive ? "#E8C84A" : "rgba(255,255,255,0.40)",
          transition: "color 0.20s",
        }}
      >
        {tab.arabic}
      </span>
      <span
        className="font-inter font-semibold tracking-widest leading-none truncate w-full text-center"
        style={{
          fontSize: 6.5,
          color: isActive ? "rgba(232,200,74,0.80)" : "rgba(255,255,255,0.22)",
          transition: "color 0.20s",
        }}
      >
        {tab.label}
      </span>
      <div
        className="absolute bottom-0 rounded-t-full"
        style={{
          height: 2, width: 28,
          background: "linear-gradient(90deg, transparent, #E8C84A, transparent)",
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.25s",
        }}
      />
    </Link>
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

  // Detect if we're on a detail page (e.g. /plants/:id) — no bottom tab active
  const isTopLevelRoute = TABS.some(t => t.path === location.pathname) || location.pathname === "/";

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
        height: "100%",
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
            className="relative z-10 w-full max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6"
            style={{
              paddingBottom: "calc(72px + env(safe-area-inset-bottom))",
              minHeight: "100%",
              boxSizing: "border-box",
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Tab Bar ── */}
      <div
        className="flex-shrink-0 z-50 w-full"
        role="navigation"
        aria-label="Tab navigation"
        style={{
          background: "rgba(2,6,16,0.98)",
          borderTop: "1px solid rgba(212,175,55,0.12)",
          boxShadow: "0 -2px 16px rgba(0,0,0,0.60)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        {/* Top gold accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.30) 40%, rgba(232,200,74,0.45) 50%, rgba(212,175,55,0.30) 60%, transparent 95%)",
        }} />

        <div className="relative max-w-2xl mx-auto flex overflow-x-auto scrollbar-none"
          style={{ height: 58, minHeight: 44 }}>
          {TABS.map((tab) => (
            <BottomTab
              key={tab.id}
              tab={tab}
              isActive={activeId === tab.id}
              onClick={startNav}
            />
          ))}
        </div>
      </div>
    </div>
  );
}