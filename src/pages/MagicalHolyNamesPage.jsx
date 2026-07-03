import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Book, Filter, ArrowUpDown, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import PullToRefresh from "../components/PullToRefresh";
import { usePageState } from "../context/PageStateContext";
import { HOLY_NAMES, MHN_CATEGORIES } from "../lib/magicalHolyNamesData";
import { base44 } from "@/api/base44Client";
import { Lock } from "lucide-react";
import FeatureLockedCard from "@/components/FeatureLockedCard";
import { checkFeatureAccess } from "@/lib/featurePermission";
import { getFeatures } from "@/lib/featureRegistry";

const PAGE_PATH = "/holy-names";
const FEATURES = getFeatures(PAGE_PATH);

// ── SECTION A COMPONENT ──────────────────────────────────────────
function SectionA() {
  const { getPageState, setPageState, clearPageState } = usePageState();
  const listKey = "magical-holy-names-section-a";
  const initial = getPageState(listKey, { query: "", category: "all", sortIdx: 0, openId: null, scrollTop: 0 });

  const [query, setQuery] = useState(initial.query || "");
  const [category, setCategory] = useState(initial.category || "all");
  const [sortIdx, setSortIdx] = useState(initial.sortIdx || 0);
  const [openId, setOpenId] = useState(initial.openId || null);

  const SORT_CYCLE = ["default", "az", "za", "value"];
  const SORT_LABELS = { default: "#", az: "A → Z", za: "Z → A", value: "Value ↑" };
  const sort = SORT_CYCLE[sortIdx];

  // Save state on every change
  useEffect(() => {
    setPageState(listKey, { query, category, sortIdx, openId });
  }, [query, category, sortIdx, openId, setPageState]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const copy = [...HOLY_NAMES];
    if (sort === "az") copy.sort((a, b) => a.englishName.localeCompare(b.englishName));
    else if (sort === "za") copy.sort((a, b) => b.englishName.localeCompare(a.englishName));
    else if (sort === "value") copy.sort((a, b) => a.abjadValue - b.abjadValue);

    return copy.filter((n) => {
      const cat = n.abjadValue <= 200 ? "low" : n.abjadValue <= 600 ? "medium" : "high";
      if (category !== "all" && cat !== category) return false;
      if (!q) return true;
      return n.arabicName.includes(query.trim()) || n.englishName.toLowerCase().includes(q);
    });
  }, [query, category, sort]);

  const handleToggle = (id) => {
    const newOpenId = openId === id ? null : id;
    setOpenId(newOpenId);
    setPageState(listKey, { openId: newOpenId });
  };

  const P = {
    border: "rgba(212,175,55,0.30)",
    borderHi: "rgba(212,175,55,0.65)",
    glow: "rgba(212,175,55,0.22)",
    text: "#F5D060",
    dim: "rgba(245,208,96,0.55)",
    faint: "rgba(212,175,55,0.14)",
    bg: "rgba(212,175,55,0.06)",
    bgHi: "rgba(212,175,55,0.14)",
  };

  // Restore scroll position on mount
  useEffect(() => {
    if (initial.scrollTop) {
      const container = document.querySelector('[data-scroll-container="true"]');
      if (container) {
        requestAnimationFrame(() => {
          container.scrollTop = initial.scrollTop || 0;
        });
      }
    }
  }, []);

  // Save scroll position periodically
  useEffect(() => {
    const container = document.querySelector('[data-scroll-container="true"]');
    if (!container) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setPageState(listKey, { scrollTop: container.scrollTop });
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [listKey, setPageState]);

  return (
    <div className="space-y-4" id="section-a-container">
      <div className="flex items-center gap-2 rounded-2xl border px-3 py-2.5" style={{ background: P.bg, borderColor: P.border }}>
        <Search className="w-4 h-4 flex-shrink-0" style={{ color: P.dim }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search names..."
          className="flex-1 bg-transparent outline-none font-inter text-sm"
          style={{ color: "rgba(255,255,255,0.85)" }}
          dir="auto"
          autoComplete="off"
        />
        {query && (
          <button onClick={() => setQuery("")} style={{ color: P.dim }}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {MHN_CATEGORIES.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl border font-inter text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap"
            style={{
              background: category === cat.id ? P.bgHi : "transparent",
              borderColor: category === cat.id ? P.borderHi : P.faint,
              color: category === cat.id ? P.text : "rgba(245,208,96,0.38)",
              boxShadow: category === cat.id ? `0 0 14px ${P.glow}` : "none",
            }}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.22)" }}>
          {filtered.length} of {HOLY_NAMES.length}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => { setQuery(""); setCategory("all"); setSortIdx(0); setOpenId(null); clearPageState("magical-holy-names"); }}
            className="px-3 py-1.5 rounded-xl border font-inter text-[10px] uppercase tracking-widest"
            style={{ background: P.bg, borderColor: P.border, color: P.dim }}
          >
            Clear
          </button>
          <button
            onClick={() => setSortIdx((sortIdx + 1) % SORT_CYCLE.length)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-inter text-[10px] uppercase tracking-widest"
            style={{ background: P.bg, borderColor: P.border, color: P.dim }}
          >
            <ArrowUpDown className="w-3 h-3" />
            {SORT_LABELS[sort]}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-3">
              <p className="font-amiri text-lg" style={{ color: P.dim }}>لا توجد نتائج</p>
              <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>Try a different search or filter</p>
            </motion.div>
          ) : (
            filtered.map((name, i) => {
              const cat = name.abjadValue <= 200 ? "Low" : name.abjadValue <= 600 ? "Medium" : "High";
              const isOpen = openId === name.id;
              return (
                <motion.div
                  key={name.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.020, 0.30), duration: 0.22 }}
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    borderColor: isOpen ? P.borderHi : P.border,
                    background: isOpen
                      ? "linear-gradient(145deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 100%)"
                      : P.bg,
                    boxShadow: isOpen ? `0 0 24px rgba(212,175,55,0.12)` : "none",
                  }}
                >
                  <button
                    onClick={() => handleToggle(name.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left gap-3"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-inter text-[8px] font-semibold" style={{ color: "rgba(255,255,255,0.28)" }}>#{name.id}</span>
                        <span className="font-amiri text-[1.65rem] font-bold" style={{ color: P.text, textShadow: isOpen ? "0 0 20px rgba(212,175,55,0.35)" : "0 0 12px rgba(212,175,55,0.20)" }}>
                          {name.arabicName}
                        </span>
                        <span className="font-inter text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-full border whitespace-nowrap" style={{ color: P.dim, borderColor: P.border, background: "rgba(245,208,96,0.08)" }}>
                          {cat}
                        </span>
                      </div>
                      <p className="font-inter text-sm font-semibold truncate" style={{ color: "rgba(255,255,255,0.88)" }}>{name.englishName}</p>
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0" style={{ color: isOpen ? P.text : P.dim }}>
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="px-4 pb-4 pt-1 grid grid-cols-2 gap-3" style={{ borderTop: "1px solid " + P.faint }}>
                          <div className="col-span-2 rounded-xl p-4 text-center" style={{ background: P.bgHi, border: "1px solid " + P.borderHi }}>
                            <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: P.dim }}>Arabic Name (Full Harakat)</p>
                            <p className="font-amiri text-[2.8rem] font-bold leading-[2.4]" style={{ color: P.text, textShadow: "0 0 24px rgba(212,175,55,0.40)" }}>
                              {name.arabicHarakat}
                            </p>
                          </div>
                          <div className="col-span-2 rounded-xl p-3 text-center" style={{ background: P.bg, border: "1px solid " + P.border }}>
                            <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: P.dim }}>English Name</p>
                            <p className="font-inter font-bold text-base" style={{ color: "rgba(255,255,255,0.90)" }}>{name.englishName}</p>
                          </div>
                          <div className="rounded-xl p-3 text-center" style={{ background: P.bg, border: "1px solid " + P.border }}>
                            <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: P.dim }}>Abjad Value</p>
                            <p className="font-amiri text-[1.8rem] font-bold" style={{ color: P.text }}>{name.abjadValue}</p>
                          </div>
                          <div className="rounded-xl p-3 text-center" style={{ background: P.bg, border: "1px solid " + P.border }}>
                            <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: P.dim }}>Letter Count</p>
                            <p className="font-amiri text-[1.8rem] font-bold" style={{ color: P.text }}>{name.letterCount}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── SECTION B COMPONENT ──────────────────────────────────────────
function SectionB() {
  const { getPageState, setPageState } = usePageState();
  const listKey = "magical-holy-names-section-b";
  const initial = getPageState(listKey, { searchQuery: "", selectedSurah: "all", scrollTop: 0 });

  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initial.searchQuery || "");
  const [selectedSurah, setSelectedSurah] = useState(initial.selectedSurah || "all");
  const [surahList, setSurahList] = useState([]);

  // Save state on every change
  useEffect(() => {
    setPageState(listKey, { searchQuery, selectedSurah });
  }, [searchQuery, selectedSurah, setPageState]);

  // Restore scroll position on mount
  useEffect(() => {
    if (initial.scrollTop) {
      const container = document.querySelector('[data-scroll-container="true"]');
      if (container) {
        requestAnimationFrame(() => {
          container.scrollTop = initial.scrollTop || 0;
        });
      }
    }
  }, []);

  // Save scroll position periodically
  useEffect(() => {
    const container = document.querySelector('[data-scroll-container="true"]');
    if (!container) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setPageState(listKey, { scrollTop: container.scrollTop });
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [listKey, setPageState]);

  useEffect(() => {
    loadNames();
  }, []);

  const loadNames = async () => {
    try {
      const allNames = await base44.entities.HolyOnePDFName.list();
      setNames(allNames || []);
      const uniqueSurahs = [...new Set(allNames.map(n => n.surah_name))].filter(Boolean);
      setSurahList(uniqueSurahs);
    } catch (error) {
      // Silently handle error - will show empty state
    } finally {
      setLoading(false);
    }
  };

  const filteredNames = names.filter(name => {
    const matchesSearch = searchQuery === "" || 
      name.arabic_name?.includes(searchQuery) ||
      name.arabic_transliteration?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.meaning_malayalam?.includes(searchQuery);
    const matchesSurah = selectedSurah === "all" || name.surah_name === selectedSurah;
    return matchesSearch && matchesSurah;
  });

  const P = {
    border: "rgba(212,175,55,0.30)",
    borderHi: "rgba(212,175,55,0.65)",
    text: "#F5D060",
    dim: "rgba(245,208,96,0.55)",
    bg: "rgba(212,175,55,0.06)",
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="section-b-container">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Arabic name, transliteration, or meaning..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold-dim bg-card-dark text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
            style={{ fontSize: "16px" }}
          />
        </div>
        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={selectedSurah}
            onChange={(e) => setSelectedSurah(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold-dim bg-card-dark text-foreground focus:outline-none focus:ring-2 focus:ring-gold appearance-none"
            style={{ fontSize: "16px" }}
          >
            <option value="all">All Surahs</option>
            {surahList.map(surah => (
              <option key={surah} value={surah}>{surah}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Book className="w-4 h-4" />
          <span>{filteredNames.length} names from PDFs (143 total)</span>
        </div>
      </div>

      {filteredNames.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Book className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No Holy Names found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNames.map((name) => (
            <Link
              key={name.id}
              to={`/holy-names/one/${name.pdf_name_id}?tab=b`}
              className="card-dark p-5 hover:border-gold transition-all duration-200 group"
              style={{
                background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
                border: "1px solid rgba(212,175,55,0.22)",
                borderRadius: "1rem"
              }}
            >
              <div className="space-y-4">
                {/* Arabic Name - Large, Clear, Elegant */}
                <div className="text-center py-3 px-2 rounded-xl" style={{
                  background: "linear-gradient(145deg, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.05) 100%)",
                  border: "1px solid rgba(212,175,55,0.30)"
                }}>
                  <h3 className="font-quranic" style={{
                    color: "#F5D060",
                    margin: 0,
                    padding: "0.5rem 0.25rem"
                  }}>
                    {name.arabic_name}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-2 tracking-widest uppercase">{name.arabic_transliteration}</p>
                </div>
                
                {/* Malayalam Pronunciation */}
                <div className="text-center">
                  <p className="font-malayalam text-base" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {name.malayalam_pronunciation}
                  </p>
                </div>
                
                {/* Meaning - Highlighted, Immediate Identification */}
                <div className="rounded-xl p-4 text-center" style={{
                  background: "rgba(212,175,55,0.10)",
                  border: "1px solid rgba(212,175,55,0.40)",
                  boxShadow: "0 0 20px rgba(212,175,55,0.12)"
                }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: "rgba(245,208,96,0.55)" }}>
                    അർത്ഥം / Meaning
                  </p>
                  <p className="font-malayalam font-semibold leading-relaxed" style={{
                    fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)",
                    color: "#F5D060"
                  }}>
                    {name.meaning_malayalam}
                  </p>
                </div>
                
                {/* Source Reference */}
                <div className="flex justify-between items-center text-xs pt-2 border-t" style={{
                  borderColor: "rgba(212,175,55,0.20)"
                }}>
                  <span style={{ color: "rgba(255,255,255,0.50)" }}>{name.surah_name || "PDF"}</span>
                  <span style={{ color: "rgba(212,175,55,0.60)" }}>Page {name.source_pdf_page}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── TAB SWITCHER ─────────────────────────────────────────────────
function TabSwitcher({ activeTab, onTabChange }) {
  const P = {
    border: "rgba(212,175,55,0.30)",
    borderHi: "rgba(212,175,55,0.65)",
    glow: "rgba(212,175,55,0.22)",
    text: "#F5D060",
    dim: "rgba(245,208,96,0.55)",
    bg: "rgba(212,175,55,0.06)",
    bgHi: "rgba(212,175,55,0.14)",
  };

  const TABS = [
    { id: "section-a", label: "Current Holy Names", arabic: "الأسماء أ", subtitle: "Section A" },
    { id: "section-b", label: "PDF Holy Names", arabic: "الأسماء ب", subtitle: "Section B" },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {TABS.map(tab => {
        const feat = FEATURES.find(f => f.tab === tab.id);
        const isLocked = feat && !checkFeatureAccess(PAGE_PATH, feat.id);
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 py-3 px-4 rounded-xl border font-inter text-xs font-semibold transition-all"
            style={{
              background: activeTab === tab.id ? P.bgHi : P.bg,
              borderColor: activeTab === tab.id ? P.borderHi : P.border,
              color: activeTab === tab.id ? P.text : P.dim,
              boxShadow: activeTab === tab.id ? `0 0 14px ${P.glow}` : "none",
            }}
          >
            <span className="font-amiri text-sm block flex items-center justify-center gap-1">
              {isLocked && <Lock className="w-3 h-3 opacity-60" />}
              {tab.arabic}
            </span>
            <span className="text-[9px] uppercase tracking-widest">{tab.subtitle}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────
export default function MagicalHolyNamesPage() {
  const { getPageState, setPageState } = usePageState();
  const pageKey = "magical-holy-names-page";
  const initial = getPageState(pageKey, { activeTab: "section-a" });
  const [activeTab, setActiveTab] = useState(initial.activeTab || "section-a");
  const [lockedFeature, setLockedFeature] = useState(null);

  // Save active tab on change
  useEffect(() => {
    setPageState(pageKey, { activeTab });
  }, [activeTab, setPageState]);

  const handleTabChange = (tabId) => {
    const feat = FEATURES.find(f => f.tab === tabId);
    if (feat && !checkFeatureAccess(PAGE_PATH, feat.id)) {
      setLockedFeature(feat);
      return;
    }
    setLockedFeature(null);
    setActiveTab(tabId);
    // Reset scroll when switching tabs
    const container = document.querySelector('[data-scroll-container="true"]');
    if (container) {
      container.scrollTop = 0;
    }
  };

  return (
    <PageLayout>
      <PullToRefresh onRefresh={() => new Promise(res => setTimeout(res, 700))}>
        <div className="space-y-4">
          <PageTitle
            arabic="الأسماء المقدسة"
            latin="Holy Names"
            subtitle="Sacred Names Reference"
            icon="✦"
          />

          <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />

          {lockedFeature ? (
            <FeatureLockedCard
              pagePath={PAGE_PATH}
              featureId={lockedFeature.id}
              featureLabel={lockedFeature.label}
              onBack={() => setLockedFeature(null)}
              onUnlocked={() => { setLockedFeature(null); window.location.reload(); }}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "section-a" ? <SectionA /> : <SectionB />}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </PullToRefresh>
    </PageLayout>
  );
}