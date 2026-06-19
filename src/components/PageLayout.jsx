import { memo, useMemo, useRef, useEffect, useState, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Shield } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import AtmosphericBackground from "./AtmosphericBackground";
import { base44 } from "../api/base44Client";
import { useScrollPersist } from "../context/PageStateContext";
import useTranslation from "@/i18n/useTranslation";
import { ADMIN_CONFIG } from "@/lib/adminConfig";

const AccountModal = lazy(() => import("./AccountModal"));

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
  { id: "holy-names",       arabicTitle: "الأسماء",         englishSubtitle: "NAMES",   path: "/holy-names" },
  { id: "astro-clock",      arabicTitle: "الساعة",          englishSubtitle: "ASTRO",   path: "/astro-clock" },
  { id: "support",          arabicTitle: "الدعم",           englishSubtitle: "SUPPORT", path: "/support" },
];

const PAGE_TITLE_KEYS = {
  "/":                  "page_home",
  "/abjad":             "page_abjad",
  "/anasir":            "page_anasir",
  "/hadim":             "page_hadim",
  "/mizaan9":           "page_mizaan",
  "/magic-sqayer":      "page_magic_sqayer",
  "/vefkin-yapilisi":   "page_vefk",
  "/basthul-huroof-2":  "page_bast",
  "/faal-hasrath":      "page_faal_hasrath",
  "/plants":            "page_plants",
  "/evil-jinn":         "page_evil_jinn",
  "/holy-names":        "page_holy_names",
  "/astro-clock":       "page_astro_clock",
  "/support":           "support_title",
  "/admin/access-dashboard": "dashboard_title",
};

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

// ── Top nav tab — <div> for zero link-delay, GPU-composited via container ──
const NavTab = memo(function NavTab({ tab, isActive, onClick, tabRef }) {
  const navigate = useNavigate();
  const isLastTab = tab.id === 'support';
  
  const handleClick = useCallback((e) => {
    e.preventDefault();
    onClick();
    navigate(tab.path);
  }, [tab.path, onClick, navigate]);

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
        maxWidth: "none",
        marginRight: tab.id === 'support' ? 24 : 0,
        border: isActive ? "1px solid rgba(212,175,55,0.60)" : "1px solid rgba(255,255,255,0.06)",
        background: isActive
          ? "linear-gradient(160deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.07) 100%)"
          : "transparent",
        boxShadow: isActive ? "0 0 16px rgba(212,175,55,0.22), inset 0 1px 0 rgba(212,175,55,0.22)" : "none",
        WebkitTapHighlightColor: "transparent",
        flex: "0 0 auto",
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

// Simple user cache — avoid re-fetching auth on every page navigation
let _userCache = null;
let _userCacheTime = 0;
const USER_CACHE_TTL = 30000; // 30 seconds

export default function PageLayout({ children }) {
  const location = useLocation();
  const navigate  = useNavigate();
  const { startNav } = useNavigation();
  const [showAccount, setShowAccount] = useState(false);
  const [user, setUser] = useState(null);
  const { t } = useTranslation();
  useScrollPersist();

  useEffect(() => {
    const now = Date.now();
    if (_userCache && (now - _userCacheTime) < USER_CACHE_TTL) {
      setUser(_userCache);
      return;
    }
    base44.auth.me().then((u) => {
      _userCache = u;
      _userCacheTime = now;
      setUser(u);
    }).catch(() => {});
  }, []);



  const isChildPage = CHILD_PAGES.some(p => location.pathname.startsWith(p));
  const pageTitleKey = PAGE_TITLE_KEYS[location.pathname];
  const pageTitle = isChildPage ? null : (pageTitleKey ? t(pageTitleKey) : null);

  const activeId = useMemo(
    () => TAB_KEYS.find(tab => tab.path === location.pathname)?.id ?? undefined,
    [location.pathname]
  );

  const scrollRef = useRef(null);
  const navRef = useRef(null);
  const tabRefs = useRef({});
  const [scrollMetrics, setScrollMetrics] = useState({ scrollWidth: 0, clientWidth: 0, scrollLeft: 0 });

  // Track scroll metrics for fade indicators
  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    const updateMetrics = () => {
      setScrollMetrics({
        scrollWidth: nav.scrollWidth,
        clientWidth: nav.clientWidth,
        scrollLeft: nav.scrollLeft,
      });
    };
    updateMetrics();
    nav.addEventListener('scroll', updateMetrics);
    window.addEventListener('resize', updateMetrics);
    return () => {
      nav.removeEventListener('scroll', updateMetrics);
      window.removeEventListener('resize', updateMetrics);
    };
  }, [activeId]);

  // Auto-scroll active tab into view — ensures first and last tabs are fully visible
  useEffect(() => {
    const activeTabEl = tabRefs.current[activeId];
    if (!activeTabEl || !navRef.current) return;
    
    const timer = setTimeout(() => {
      activeTabEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [activeId]);

  // Reset scroll to top on every navigation/tab change
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.scrollTop = 0;
    }
    window.scrollTo(0, 0);
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
        height: "100dvh",
        overflow: "hidden",
        overflowX: "hidden",
        overscrollBehaviorX: "none",
        width: "100%",
        maxWidth: "100vw",
        margin: 0,
        padding: 0,
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxSizing: "border-box",
        transform: "none",
        left: "auto",
        right: "auto",
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
          overflowX: "visible",
          width: "100%",
          minWidth: "100%",
        }}
      >
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background:
              "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.42) 40%, rgba(232,200,74,0.55) 50%, rgba(212,175,55,0.42) 60%, transparent 95%)",
          }}
        />

        {/* Back button for child pages only (all devices) */}
        {isChildPage && (
          <div className="flex items-center justify-between px-3 py-2.5">
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
              <span className="font-inter text-xs font-semibold tracking-wide">{t('btn_back')}</span>
            </button>
          </div>
        )}

        {/* Horizontal navigation — single native scroll layer, GPU-composited */}
        <div
          className="px-2 py-2 flex items-center gap-2 relative nav-scroll-container"
          style={{
            width: "100%",
            flexShrink: 0,
            overflowX: "auto",
            overflowY: "hidden",
          }}
        >
          {/* Admin button - visible for owner email OR platform admin role */}
          {(user?.role === 'admin' || (user?.email && user.email.toLowerCase() === ADMIN_CONFIG.OWNER_EMAIL.toLowerCase())) && (
            <button
              onClick={() => { startNav(); navigate('/admin/access-dashboard'); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.25), rgba(212,175,55,0.10))",
                border: "1px solid rgba(212,175,55,0.40)",
                color: "#E8C84A",
                WebkitTapHighlightColor: "transparent",
                userSelect: "none",
                WebkitUserSelect: "none",
                whiteSpace: "nowrap",
                flex: "0 0 auto",
              }}
            >
              <Shield className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="font-inter text-xs font-bold tracking-wide flex-shrink-0">{t('nav_admin')}</span>
            </button>
          )}

          {/* Left fade indicator - shows when more tabs exist to the left */}
          {scrollMetrics.scrollLeft > 10 && (
            <div
              className="pointer-events-none absolute left-0 top-0 bottom-0 z-10"
              style={{
                width: 40,
                background: "linear-gradient(90deg, rgba(2,6,16,0.98) 0%, rgba(2,6,16,0.70) 50%, transparent 100%)",
                opacity: 0.8,
              }}
            />
          )}
          
          {/* Right fade indicator - shows when more tabs exist to the right */}
          {scrollMetrics.scrollWidth > scrollMetrics.clientWidth + scrollMetrics.scrollLeft + 10 && (
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 z-10"
              style={{
                width: 40,
                background: "linear-gradient(270deg, rgba(2,6,16,0.98) 0%, rgba(2,6,16,0.70) 50%, transparent 100%)",
                opacity: 0.8,
              }}
            />
          )}

          <div
            ref={navRef}
            className="nav-scroll-container flex gap-1 flex-nowrap scrollbar-none"
            style={{
              flex: "1 1 auto",
              overflowX: "auto",
              overflowY: "hidden",
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "smooth",
              overscrollBehaviorX: "none",
              overscrollBehaviorY: "none",
              touchAction: "auto",
              scrollSnapType: "x proximity",
              userSelect: "none",
              WebkitUserSelect: "none",
              willChange: "transform",
              transform: "translate3d(0,0,0)",
              backfaceVisibility: "hidden",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              paddingLeft: "10px",
              paddingRight: "48px",
              minWidth: 0,
            }}
          >
            {TAB_KEYS.map((tab) => (
              <NavTab
                key={tab.id}
                tab={tab}
                isActive={activeId === tab.id}
                onClick={startNav}
                tabRef={(el) => (tabRefs.current[tab.id] = el)}
              />
            ))}
            {/* Extra end spacer for last tab visibility */}
            <div style={{ flexShrink: 0, width: 24 }} />
          </div>
        </div>
      </div>

      {/* ── Scrollable page content ── */}
      <div
        ref={scrollRef}
        data-scroll-container="true"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          overscrollBehaviorX: "none",
          overscrollBehaviorY: "auto",
          paddingBottom: 72,
          WebkitOverflowScrolling: "touch",
          touchAction: "auto",
          willChange: 'scroll-position',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          width: "100%",
          maxWidth: "100vw",
          margin: 0,
          padding: 0,
          left: "auto",
          right: "auto",
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
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              overflowX: 'hidden',
              width: '100%',
              maxWidth: '100vw',
              margin: 0,
              marginLeft: 0,
              marginRight: 0,
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>

    {/* Account modal — lazy loaded */}
    <AnimatePresence>
      {showAccount && (
        <Suspense fallback={null}>
          <AccountModal user={user} onClose={() => setShowAccount(false)} />
        </Suspense>
      )}
    </AnimatePresence>
    </>
  );
}