import { memo, useMemo, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, User } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import AtmosphericBackground from "./AtmosphericBackground";
import AccountModal from "./AccountModal";
import { base44 } from "../api/base44Client";


// ── Permanent brand navigation terms — Arabic + English, never translated ──
const TAB_KEYS = [
  { id: "home",             arabicTitle: "الرئيسية",        englishSubtitle: "HOME",    path: "/" },
  { id: "abjad-kabir",      arabicTitle: "الأبجد",          englishSubtitle: "ABJAD",   path: "/abjad" },
  { id: "anasir",           arabicTitle: "العناصر",         englishSubtitle: "ANASIR",  path: "/anasir" },
  { id: "hadim",            arabicTitle: "الخادم",          englishSubtitle: "HADIM",   path: "/hadim" },
  { id: "mizaan9",          arabicTitle: "الميزان",         englishSubtitle: "MIZAN",   path: "/mizaan9" },
  { id: "magic-sqayer",     arabicTitle: "السقاير",         englishSubtitle: "SQAYER",  path: "/magic-sqayer" },
  { id: "vefkin-yapilisi",  arabicTitle: "وفقین",           englishSubtitle: "VEFK",    path: "/vefkin-yapilisi" },
  { id: "basthul-huroof-2", arabicTitle: "بسط الحروف",      englishSubtitle: "BAST",    path: "/basthul-huroof-2" },
  { id: "faal-hasrath",     arabicTitle: "فال الحسرات",     englishSubtitle: "FAAL",    path: "/faal-hasrath" },
  { id: "plants",           arabicTitle: "النباتات",        englishSubtitle: "PLANTS",  path: "/plants" },
  { id: "evil-jinn",        arabicTitle: "الجن",            englishSubtitle: "JINN",    path: "/evil-jinn" },
  { id: "holy-names",       arabicTitle: "الأسماء أ",       englishSubtitle: "NAMES-A", path: "/holy-names" },

  { id: "astro-clock",      arabicTitle: "الساعة",          englishSubtitle: "ASTRO",   path: "/astro-clock" },
  { id: "support",          arabicTitle: "الدعم",           englishSubtitle: "SUPPORT", path: "/support" },
];

const PAGE_TITLE_KEYS = {
  "/": "page_home",
  "/abjad": "page_abjad",
  "/anasir": "page_anasir",
  "/hadim": "page_hadim",
  "/mizaan9": "page_mizaan",
  "/magic-sqayer": "page_magic_sqayer",
  "/vefkin-yapilisi": "page_vefk",
  "/basthul-huroof-2": "page_bast",
  "/faal-hasrath": "page_faal_hasrath",
  "/plants": "page_plants",
  "/evil-jinn": "page_evil_jinn",
  "/holy-names": "page_holy_names",
  "/astro-clock": "page_astro_clock",
  "/support": "support_title",
};

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// ── Top nav tab — <div> for zero link-delay, GPU-composited via container ──
const NavTab = memo(function NavTab({ tab, isActive, onClick, tabRef }) {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    e.preventDefault();
    onClick();
    navigate(tab.path);
  };

  return (
    <div
      ref={tabRef}
      onClick={handleClick}
      role="link"
      tabIndex={0}
      className="nav-tab flex-shrink-0 relative overflow-hidden flex flex-col items-center justify-center py-1.5 px-2 select-none"
      style={{
        borderRadius: 10,
        minHeight: 44,
        minWidth: 48,
        border: isActive ? "1px solid rgba(212,175,55,0.60)" : "1px solid rgba(255,255,255,0.06)",
        background: isActive
          ? "linear-gradient(160deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.07) 100%)"
          : "transparent",
        boxShadow: isActive ? "0 0 16px rgba(212,175,55,0.22), inset 0 1px 0 rgba(212,175,55,0.22)" : "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {isActive && (
        <div className="absolute top-0 left-0 right-0 z-[2]" style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.70), transparent)",
        }} />
      )}
      <span className="font-amiri font-bold leading-tight text-[13px]" style={{
        color: isActive ? "#E8C84A" : "rgba(255,255,255,0.52)",
      }}>
        {tab.arabicTitle}
      </span>
      <span className="font-inter font-semibold leading-none tracking-[0.12em] text-[8.5px] mt-[1px]" style={{
        color: isActive ? "rgba(212,175,55,0.65)" : "rgba(255,255,255,0.22)",
      }}>
        {tab.englishSubtitle}
      </span>
      <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 h-[1.5px] rounded-full" style={{
        background: "linear-gradient(90deg, transparent, #E8C84A, transparent)",
        width: isActive ? 26 : 0,
        opacity: isActive ? 1 : 0,
        transition: "width 0.2s ease, opacity 0.2s ease",
      }} />
      {isActive && (
        <div className="absolute inset-0 rounded-[9px] pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 115%, rgba(212,175,55,0.20) 0%, transparent 70%)",
        }} />
      )}
    </div>
  );
});

// Pages where we show a back button instead of breadcrumb nav
const CHILD_PAGES = ["/plants/"];

export default function PageLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { startNav } = useNavigation();
  const [showAccount, setShowAccount] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const isChildPage = CHILD_PAGES.some(p => location.pathname.startsWith(p));
  const pageTitleKey = PAGE_TITLE_KEYS[location.pathname];
  const pageTitle = isChildPage ? null : (pageTitleKey ? pageTitleKey : null);

  const activeId = useMemo(
    () => TAB_KEYS.find(tab => tab.path === location.pathname)?.id ?? undefined,
    [location.pathname]
  );

  const scrollRef = useRef(null);
  const navRef = useRef(null);
  const tabRefs = useRef({});

  // ── Scroll focused input into view when keyboard opens (mobile) ──────────
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleFocusIn = (e) => {
      const el = e.target;
      if (!el || !['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;
      // Small delay allows the keyboard to open and resize the viewport first
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 320);
    };

    container.addEventListener('focusin', handleFocusIn, { passive: true });
    return () => container.removeEventListener('focusin', handleFocusIn);
  }, []);

  // Auto-scroll active tab into view — scroll the nav container only, NOT the page
  useEffect(() => {
    const activeTabEl = tabRefs.current[activeId];
    const navContainer = navRef.current;
    if (!activeTabEl || !navContainer) return;
    
    const timer = setTimeout(() => {
      const tabRect = activeTabEl.getBoundingClientRect();
      const navRect = navContainer.getBoundingClientRect();
      const tabCenter = tabRect.left + tabRect.width / 2;
      const navCenter = navRect.left + navRect.width / 2;
      const scrollOffset = tabCenter - navCenter;
      
      navContainer.scrollBy({
        left: scrollOffset,
        behavior: 'smooth'
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [activeId]);

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
        width: "100%",
        maxWidth: "100vw",
        margin: 0,
        padding: 0,
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        boxSizing: "border-box",
      }}
    >
      <AtmosphericBackground />

      {/* ── Sticky Top Nav ── */}
      <div
        className="sticky top-0 z-50 w-full flex-shrink-0"
        role="navigation"
        aria-label="Main navigation"
        style={{
          background: "rgba(2,6,16,0.98)",
          borderBottom: "1px solid rgba(212,175,55,0.13)",
          boxShadow: "0 1px 0 rgba(212,175,55,0.05), 0 4px 24px rgba(0,0,0,0.80)",
          overflowX: "visible",
          width: "100%",
          minWidth: "100%",
        }}
      >
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background: "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.42) 40%, rgba(232,200,74,0.55) 50%, rgba(212,175,55,0.42) 60%, transparent 95%)",
          }}
        />

        {/* Back button for child pages only */}
        {isChildPage && (
          <div className="flex items-center justify-between px-3 py-2.5">
            <button
              onClick={() => { startNav(); navigate(-1); }}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl"
              style={{
                color: "#D4AF37", 
                background: "rgba(212,175,55,0.08)",
                border: "1px solid rgba(212,175,55,0.18)",
                WebkitTapHighlightColor: "transparent",
                userSelect: "none", 
                WebkitUserSelect: "none",
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-inter text-xs font-semibold tracking-wide">Back</span>
            </button>
          </div>
        )}

        {/* Horizontal navigation */}
        <div
          ref={navRef}
          className="nav-scroll-container px-2 py-2 flex items-center gap-1 scrollbar-none"
          style={{
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
            overscrollBehaviorX: "none",
            touchAction: "auto",
            userSelect: "none",
            WebkitUserSelect: "none",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          {/* Admin button */}
          {user?.role === 'admin' && (
            <Link
              to="/admin/access-dashboard"
              onClick={startNav}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.25), rgba(212,175,55,0.10))",
                border: "1px solid rgba(212,175,55,0.40)",
                color: "#E8C84A",
                WebkitTapHighlightColor: "transparent",
                userSelect: "none",
                WebkitUserSelect: "none",
                flexShrink: 0,
                width: "auto",
                whiteSpace: "nowrap",
              }}
            >
              <User className="w-3.5 h-3.5" />
              <span className="font-inter text-xs font-bold tracking-wide">Admin</span>
            </Link>
          )}

          {TAB_KEYS.map((tab) => (
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

      {/* ── Scrollable page content ── */}
      <div
        ref={scrollRef}
        data-scroll-container="true"
        className="flex-1"
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          overscrollBehaviorX: "none",
          overscrollBehaviorY: "none",
          WebkitOverflowScrolling: "touch",
          width: "100%",
          maxWidth: "100vw",
          margin: 0,
          padding: "16px",
          paddingBottom: "16px",
          boxSizing: "border-box",
          position: "relative",
          flex: "1 1 0",
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
              willChange: 'opacity',
              overflowX: 'hidden',
              width: '100%',
              maxWidth: '100vw',
              margin: 0,
              position: 'relative',
              minHeight: '0',
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>

    {/* Account modal */}
    <AnimatePresence>
      {showAccount && (
        <AccountModal user={user} onClose={() => setShowAccount(false)} />
      )}
    </AnimatePresence>
    </>
  );
}