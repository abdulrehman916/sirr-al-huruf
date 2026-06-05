import { memo, useMemo, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, User } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import AtmosphericBackground from "./AtmosphericBackground";
import BottomTabBar from "./BottomTabBar";
import AccountModal from "./AccountModal";
import { base44 } from "../api/base44Client";

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

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

// ── Top horizontal nav tab — instant activation, zero delay ──
const NavTab = memo(function NavTab({ tab, isActive, onClick, tabRef }) {
  const handleTouchStart = (e) => {
    // Instant visual feedback on touch
    e.currentTarget.style.opacity = '0.7';
  };

  const handleTouchEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    // Trigger navigation immediately
    onClick();
  };

  return (
    <div
      ref={tabRef}
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
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative flex flex-col items-center justify-center py-2 px-2.5"
        style={{
          WebkitTapHighlightColor: "transparent",
          touchAction: "pan-x pan-y",
          userSelect: "none",
          WebkitUserSelect: "none",
          minHeight: 44,
          minWidth: 52,
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        <span
          className="font-amiri font-bold leading-none"
          style={{
            fontSize: 14,
            color: isActive ? "#E8C84A" : "rgba(255,255,255,0.52)",
            willChange: 'color',
          }}
        >
          {tab.arabic}
        </span>

        <span
          className="font-inter font-semibold tracking-widest mt-0.5 leading-none"
          style={{
            fontSize: 7.5,
            color: isActive ? "rgba(232,200,74,0.88)" : "rgba(255,255,255,0.28)",
            willChange: 'color',
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
            willChange: 'width, opacity',
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

// Pages where we show a back button instead of breadcrumb nav
const CHILD_PAGES = ["/plants/"];

// Map pathnames to display titles for the mobile header
const PAGE_TITLES = {
  "/":                  "سرّ الحروف",
  "/abjad":             "الأبجد",
  "/anasir":            "عناصر",
  "/hadim":             "خادم",
  "/mizaan9":           "ميزان",
  "/magic-sqayer":      "السحر",
  "/vefkin-yapilisi":   "الوفق",
  "/basthul-huroof-2":  "بسط الحروف",
  "/faal-hasrath":      "فأل",
  "/plants":            "نباتات",
};

const scrollMemory = {};

export default function PageLayout({ children }) {
  const location = useLocation();
  const navigate  = useNavigate();
  const { startNav } = useNavigation();
  const [showAccount, setShowAccount] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const isChildPage = CHILD_PAGES.some(p => location.pathname.startsWith(p));
  const pageTitle = isChildPage ? null : PAGE_TITLES[location.pathname];

  const activeId = useMemo(
    () => TABS.find(t => t.path === location.pathname)?.id ?? undefined,
    [location.pathname]
  );

  const scrollRef = useRef(null);
  const navRef = useRef(null);
  const tabRefs = useRef({});

  // Auto-scroll navigation bar to keep active tab visible and centered
  useEffect(() => {
    const navEl = navRef.current;
    const activeTabEl = tabRefs.current[activeId];
    
    if (!navEl || !activeTabEl) return;

    // Use requestAnimationFrame for 60fps smooth scrolling
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        const tabRect = activeTabEl.getBoundingClientRect();
        const navRect = navEl.getBoundingClientRect();
        
        // Calculate position to center the active tab
        const centerPosition = navEl.scrollLeft + (tabRect.left - navRect.left) - (navRect.width / 2) + (tabRect.width / 2);
        
        // Smooth scroll with native behavior
        navEl.scrollTo({
          left: Math.max(0, Math.min(centerPosition, navEl.scrollWidth - navRect.width)),
          behavior: 'smooth',
        });
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [activeId, location.pathname]);

  // Save / restore scroll position per route
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const saved = scrollMemory[location.pathname] ?? 0;
    el.scrollTop = saved;

    return () => {
      if (scrollRef.current) {
        scrollMemory[location.pathname] = scrollRef.current.scrollTop;
      }
    };
  }, [location.pathname]);

  // Native back gesture support
  useEffect(() => {
    const onPop = () => {
      startNav();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [startNav]);

  return (
    <>
    <div
      className="font-inter relative flex flex-col"
      style={{
        background: "linear-gradient(180deg, #020710 0%, #050d1a 30%, #08101f 65%, #0b1326 100%)",
        minHeight: "100vh",
        height: "auto",
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <AtmosphericBackground />

      {/* ── Sticky Top Nav — desktop + child page back button on mobile ── */}
      <div
        className="sticky top-0 z-50 w-full flex-shrink-0"
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

        {/* Mobile header: back button on child pages */}
        {isChildPage ? (
          <div className="md:hidden flex items-center justify-between px-3 py-2.5">
            <button
              onClick={() => { startNav(); navigate(-1); }}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl"
              style={{
                color: "#D4AF37", background: "rgba(212,175,55,0.08)",
                border: "1px solid rgba(212,175,55,0.18)",
                WebkitTapHighlightColor: "transparent",
                userSelect: "none", WebkitUserSelect: "none",
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-inter text-xs font-semibold tracking-wide">Back</span>
            </button>
          </div>
        ) : (
          /* Mobile header: title + account icon */
          <div className="md:hidden flex items-center justify-between px-3 py-2">
            <span className="font-amiri font-bold" style={{ fontSize: 16, color: "#f5ecd4", letterSpacing: "0.02em" }}>
              {pageTitle || "سرّ الحروف"}
            </span>
            <button
              onClick={() => setShowAccount(true)}
              className="flex items-center justify-center w-8 h-8 rounded-xl"
              style={{
                background: "rgba(212,175,55,0.08)",
                border: "1px solid rgba(212,175,55,0.18)",
                color: "rgba(212,175,55,0.75)",
                WebkitTapHighlightColor: "transparent",
                userSelect: "none", WebkitUserSelect: "none",
              }}
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Desktop: full horizontal tab bar (unchanged) */}
        <div className="hidden md:block px-2 py-1.5">
          <div
            ref={navRef}
            className="max-w-2xl mx-auto flex gap-1 overflow-x-auto scrollbar-none"
            style={{
              WebkitOverflowScrolling: 'touch',
              willChange: 'scroll-position',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              touchAction: 'pan-x',
            }}
          >
            {TABS.map((tab) => (
              <NavTab
                key={tab.id}
                tab={tab}
                isActive={activeId === tab.id}
                onClick={startNav}
                tabRef={(el) => (tabRefs.current[tab.id] = el)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Scrollable page content ── */}
      <div
        ref={scrollRef}
        data-scroll-container="true"
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{
          overscrollBehaviorY: "none",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
          minHeight: "100vh",
          willChange: 'scroll-position',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative z-10 w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6"
            style={{
              /* Extra bottom padding on mobile to clear the bottom tab bar */
              paddingBottom: "calc(env(safe-area-inset-bottom) + 64px)",
              boxSizing: "border-box",
              minHeight: "auto",
              height: "auto",
              willChange: 'opacity',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Fixed Bottom Tab Bar (mobile only) ── */}
      <BottomTabBar activeId={activeId} onNavigate={startNav} />

    </div>

    {/* Account modal */}
    <AnimatePresence>
      {showAccount && <AccountModal user={user} onClose={() => setShowAccount(false)} />}
    </AnimatePresence>
    </>
  );
}