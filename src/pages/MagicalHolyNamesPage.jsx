// ═══════════════════════════════════════════════════════════════
// MAGICAL HOLY NAMES PAGE
// Completely independent module. No shared logic with any other module.
// ═══════════════════════════════════════════════════════════════

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowUpDown, ChevronDown } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import PullToRefresh from "../components/PullToRefresh";
import { usePageState } from "../context/PageStateContext";
import { HOLY_NAMES, MHN_CATEGORIES } from "../lib/magicalHolyNamesData";

// ── Scoped fonts for this page only ──────────────────────────────
const MHN_FONT_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Naskh+Arabic:wght@400;700&display=swap');
  
  .mhn-arabic {
    font-family: 'Scheherazade New', 'Amiri', 'Noto Naskh Arabic', serif;
    font-weight: 700;
    direction: rtl;
    unicode-bidi: embed;
    letter-spacing: 0.02em;
    line-height: 1.8;
    word-break: break-word;
    overflow-wrap: break-word;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .mhn-arabic-large {
    font-family: 'Scheherazade New', 'Amiri', 'Noto Naskh Arabic', serif;
    font-weight: 700;
    direction: rtl;
    unicode-bidi: embed;
    letter-spacing: 0.01em;
    line-height: 2.2;
    word-break: break-word;
    overflow-wrap: break-word;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
function MhnFont() {
  return <style>{MHN_FONT_STYLE}</style>;
}

// ── Palette ──────────────────────────────────────────────────────
const P = {
  border:   "rgba(212,175,55,0.30)",
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(245,208,96,0.55)",
  faint:    "rgba(212,175,55,0.14)",
  bg:       "rgba(212,175,55,0.06)",
  bgHi:     "rgba(212,175,55,0.14)",
};

// ── Sort ─────────────────────────────────────────────────────────
const SORT_CYCLE  = ["default", "az", "za", "value"];
const SORT_LABELS = { default: "#", az: "A → Z", za: "Z → A", value: "Value ↑" };

function sortNames(list, sort) {
  const copy = [...list];
  if (sort === "az")    return copy.sort((a, b) => a.englishName.localeCompare(b.englishName));
  if (sort === "za")    return copy.sort((a, b) => b.englishName.localeCompare(a.englishName));
  if (sort === "value") return copy.sort((a, b) => a.abjadValue - b.abjadValue);
  return copy; // default: original order
}

// ── Category Filter ───────────────────────────────────────────────
function CategoryFilter({ active, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {MHN_CATEGORIES.map((cat) => (
        <motion.button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 px-3 py-1.5 rounded-xl border font-inter text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap"
          style={{
            background:   active === cat.id ? P.bgHi : "transparent",
            borderColor:  active === cat.id ? P.borderHi : P.faint,
            color:        active === cat.id ? P.text : "rgba(245,208,96,0.38)",
            boxShadow:    active === cat.id ? `0 0 14px ${P.glow}` : "none",
          }}
        >
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
}

// ── Name Card ─────────────────────────────────────────────────────
function HolyNameCard({ name, index, isOpen, onToggle }) {
  const cat = name.abjadValue <= 200 ? "Low" : name.abjadValue <= 600 ? "Medium" : "High";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.020, 0.30), duration: 0.22 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: isOpen ? P.borderHi : P.border,
        background:  isOpen
          ? "linear-gradient(145deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 100%)"
          : P.bg,
        boxShadow: isOpen ? `0 0 24px rgba(212,175,55,0.12)` : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Collapsed row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left gap-3"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-inter text-[8px] font-semibold" style={{ color: "rgba(255,255,255,0.28)" }}>
              #{name.id}
            </span>
            <span
              className="mhn-arabic"
              style={{
                fontSize: "1.65rem",
                color: P.text,
                textShadow: isOpen ? "0 0 20px rgba(212,175,55,0.35)" : "0 0 12px rgba(212,175,55,0.20)",
                letterSpacing: "0.02em",
              }}
            >
              {name.arabicName}
            </span>
            <span
              className="font-inter text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-full border whitespace-nowrap"
              style={{ color: P.dim, borderColor: P.border, background: "rgba(245,208,96,0.08)" }}
            >
              {cat}
            </span>
          </div>
          <p className="font-inter text-sm font-semibold truncate" style={{ color: "rgba(255,255,255,0.88)" }}>
            {name.englishName}
          </p>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
          style={{ color: isOpen ? P.text : P.dim }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      {/* Expanded detail */}
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
            <div
              className="px-4 pb-4 pt-1 grid grid-cols-2 gap-3"
              style={{ borderTop: "1px solid " + P.faint }}
            >
              {/* Arabic Name with Full Harakat */}
              <div className="col-span-2 rounded-xl p-4 text-center" style={{ background: P.bgHi, border: "1px solid " + P.borderHi }}>
                <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: P.dim }}>Arabic Name (Full Harakat)</p>
                <p
                  className="mhn-arabic-large"
                  style={{ 
                    fontSize: "2.8rem", 
                    lineHeight: 2.4, 
                    color: P.text, 
                    textShadow: "0 0 24px rgba(212,175,55,0.40)",
                    letterSpacing: "0.01em",
                  }}
                >
                  {name.arabicHarakat}
                </p>
              </div>

              {/* English Name */}
              <div className="col-span-2 rounded-xl p-3 text-center" style={{ background: P.bg, border: "1px solid " + P.border }}>
                <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: P.dim }}>English Name</p>
                <p className="font-inter font-bold text-base" style={{ color: "rgba(255,255,255,0.90)" }}>{name.englishName}</p>
              </div>

              {/* Abjad Value */}
              <div className="rounded-xl p-3 text-center" style={{ background: P.bg, border: "1px solid " + P.border }}>
                <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: P.dim }}>Abjad Value</p>
                <p className="mhn-arabic" style={{ fontSize: "1.8rem", color: P.text }}>{name.abjadValue}</p>
              </div>

              {/* Letter Count */}
              <div className="rounded-xl p-3 text-center" style={{ background: P.bg, border: "1px solid " + P.border }}>
                <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: P.dim }}>Letter Count</p>
                <p className="mhn-arabic" style={{ fontSize: "1.8rem", color: P.text }}>{name.letterCount}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-3">
      <p className="mhn-arabic text-lg" style={{ color: P.dim }}>لا توجد نتائج</p>
      <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>Try a different search or filter</p>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────
const PAGE_KEY = "magical-holy-names";

export default function MagicalHolyNamesPage() {
  const { getPageState, setPageState, clearPageState } = usePageState();
  const initial = getPageState(PAGE_KEY, { query: "", category: "all", sortIdx: 0 });

  const [query,    setQuery]    = useState(initial.query);
  const [category, setCategory] = useState(initial.category);
  const [sortIdx,  setSortIdx]  = useState(initial.sortIdx);
  const [openId,   setOpenId]   = useState(null);

  const sort = SORT_CYCLE[sortIdx];

  useEffect(() => {
    setPageState(PAGE_KEY, { query, category, sortIdx });
  }, [query, category, sortIdx, setPageState]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortNames(
      HOLY_NAMES.filter((n) => {
        const cat = n.abjadValue <= 200 ? "low" : n.abjadValue <= 600 ? "medium" : "high";
        if (category !== "all" && cat !== category) return false;
        if (!q) return true;
        return (
          n.arabicName.includes(query.trim()) ||
          n.englishName.toLowerCase().includes(q)
        );
      }),
      sort
    );
  }, [query, category, sort]);

  const handleRefresh = () => new Promise(res => setTimeout(res, 700));
  const handleToggle  = (id) => setOpenId(prev => prev === id ? null : id);

  return (
    <PageLayout>
      <MhnFont />
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="space-y-4">

          <PageTitle
            arabic="الأسماء المقدسة"
            latin="Magical Holy Names"
            subtitle="Sacred Names Reference"
            icon="✦"
          />

          {/* Search */}
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

          {/* Category filter */}
          <CategoryFilter active={category} onSelect={setCategory} />

          {/* Controls row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.22)" }}>
              {filtered.length} of {HOLY_NAMES.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => { setQuery(""); setCategory("all"); setSortIdx(0); setOpenId(null); clearPageState(PAGE_KEY); }}
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

          {/* List */}
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0
                ? <EmptyState key="empty" />
                : filtered.map((name, i) => (
                  <HolyNameCard
                    key={name.id}
                    name={name}
                    index={i}
                    isOpen={openId === name.id}
                    onToggle={() => handleToggle(name.id)}
                  />
                ))
              }
            </AnimatePresence>
          </div>

        </div>
      </PullToRefresh>
    </PageLayout>
  );
}