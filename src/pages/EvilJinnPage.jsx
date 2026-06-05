import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Copy, Check, ArrowUpDown, Eye } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import PullToRefresh from "../components/PullToRefresh";
import { usePageState } from "../context/PageStateContext";
import { EVIL_JINN_NAMES } from "../lib/evilJinnData";

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

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "low", label: "Low (≤200)" },
  { id: "medium", label: "Medium (201-400)" },
  { id: "high", label: "High (>400)" },
];

const SORT_CYCLE = ["az", "za", "value"];
const SORT_LABELS = { az: "A → Z", za: "Z → A", value: "Value ↑" };

function sortJinn(list, sort) {
  const copy = [...list];
  if (sort === "az") return copy.sort((a, b) => a.englishName.localeCompare(b.englishName));
  if (sort === "za") return copy.sort((a, b) => b.englishName.localeCompare(a.englishName));
  if (sort === "value") return copy.sort((a, b) => a.abjadValue - b.abjadValue);
  return copy;
}

function CategoryFilter({ active, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((cat) => (
        <motion.button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 px-3 py-1.5 rounded-xl border font-inter text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap"
          style={{
            background: active === cat.id ? P.bgHi : "transparent",
            borderColor: active === cat.id ? P.borderHi : P.faint,
            color: active === cat.id ? P.text : "rgba(245,208,96,0.38)",
            boxShadow: active === cat.id ? `0 0 14px ${P.glow}` : "none",
          }}
        >
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
}

function JinnRow({ jinn, index, onOpen }) {
  const valueCategory = jinn.abjadValue <= 200 ? "Low" : jinn.abjadValue <= 400 ? "Medium" : "High";
  const hasProfile = jinn.malayalam && (jinn.malayalam.roopam || jinn.malayalam.thamasam || jinn.malayalam.swabhavam);
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.35), duration: 0.22 }}
      onClick={() => onOpen(jinn)}
      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-left gap-3"
      style={{ background: P.bg, borderColor: hasProfile ? "rgba(212,175,55,0.45)" : P.border }}
      whileTap={{ scale: 0.985 }}
    >
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-inter text-[8px] font-semibold" style={{ color: "rgba(255,255,255,0.30)" }}>#{jinn.serialNo}</span>
          <span className="font-amiri font-bold text-lg" dir="rtl" style={{ color: P.text, WebkitTextStroke: "0.3px rgba(212,175,55,0.3)" }}>{jinn.arabicName}</span>
          <span className="font-inter text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-full border whitespace-nowrap"
            style={{ color: P.text, borderColor: P.border, background: "rgba(245,208,96,0.10)" }}>
            {valueCategory}
          </span>
          {hasProfile && (
            <span className="font-inter text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-full border whitespace-nowrap"
              style={{ color: "#86efac", borderColor: "rgba(134,239,172,0.35)", background: "rgba(134,239,172,0.08)" }}>
              മലയാളം ✓
            </span>
          )}
        </div>
        <p className="font-inter text-base font-bold truncate" style={{ color: "rgba(255,255,255,0.95)" }}>{jinn.englishName}</p>
        <p className="font-inter text-xs truncate" style={{ color: "rgba(255,255,255,0.65)" }}>Abjad: {jinn.abjadValue} · Letters: {jinn.letterCount}</p>
      </div>
      <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ background: hasProfile ? "rgba(212,175,55,0.15)" : "rgba(212,175,55,0.06)", border: "1px solid " + (hasProfile ? P.borderHi : P.faint) }}>
        <Eye className="w-4 h-4" style={{ color: hasProfile ? P.text : P.dim }} />
      </div>
    </motion.button>
  );
}

function JinnDetail({ jinn, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const text = jinn.arabicHarakat + " - " + jinn.englishName + "\nAbjad: " + jinn.abjadValue + "\n\nLetter Breakdown:\n" + jinn.breakdown.map(function(b) { return b.letter + ": " + b.value; }).join("\n");
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(function() { setCopied(false); }, 2000);
    } catch(e) {}
  };

  const cols = jinn.breakdown.length <= 3 ? "grid-cols-3" : jinn.breakdown.length === 4 ? "grid-cols-4" : "grid-cols-5";

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "1rem", background: "rgba(2,6,16,0.88)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        style={{ width: "100%", maxWidth: "28rem", borderRadius: "1.5rem", overflow: "hidden", background: "linear-gradient(145deg, rgba(12,22,48,0.99), rgba(6,12,28,1))", border: "1px solid " + P.borderHi, boxShadow: "0 0 60px rgba(212,175,55,0.18), 0 24px 64px rgba(0,0,0,0.80)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center relative" style={{ background: P.bg }}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl" style={{ color: P.dim }}>
            <X className="w-5 h-5" />
          </button>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>#{jinn.serialNo} · Evil Jinn Profile</p>
          <span className="font-amiri font-bold text-4xl block" dir="rtl" style={{ color: P.text, WebkitTextStroke: "0.4px rgba(212,175,55,0.4)", textShadow: "0 0 24px rgba(212,175,55,0.3)" }}>{jinn.arabicHarakat}</span>
          {jinn.arabicName !== jinn.arabicHarakat && (
            <span className="font-amiri text-base block mt-0.5" dir="rtl" style={{ color: "rgba(245,208,96,0.40)" }}>{jinn.arabicName}</span>
          )}
          <p className="font-inter text-lg font-bold mt-2" style={{ color: "rgba(255,255,255,0.90)" }}>{jinn.englishName}</p>
          <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
            <span className="font-inter text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg border"
              style={{ color: P.dim, borderColor: P.faint, background: P.bg }}>Abjad: {jinn.abjadValue}</span>
            <span className="font-inter text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg border"
              style={{ color: P.dim, borderColor: P.faint, background: P.bg }}>Letters: {jinn.letterCount}</span>
            <span className="font-inter text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg border"
              style={{ color: P.dim, borderColor: P.faint, background: P.bg }}>
              {jinn.abjadValue <= 200 ? "Low" : jinn.abjadValue <= 400 ? "Medium" : "High"}
            </span>
          </div>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: "65vh" }}>
          <div className="flex items-center justify-between">
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.dim }}>Letter Breakdown</p>
            <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-widest"
              style={{ background: P.bg, color: P.dim, border: "1px solid " + P.border }}>
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className={"grid " + cols + " gap-2"}>
            {jinn.breakdown.map((b, i) => (
              <div key={i} className="text-center p-3 rounded-xl" style={{ background: P.bg, border: "1px solid " + P.border }}>
                <p className="font-amiri text-xl font-bold mb-1" dir="rtl" style={{ color: P.text, WebkitTextStroke: "0.3px rgba(212,175,55,0.3)" }}>{b.letter}</p>
                <p className="font-inter text-xs font-bold" style={{ color: P.dim }}>{b.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4 text-center border" style={{ background: P.bgHi, borderColor: P.borderHi }}>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: P.dim }}>Total Abjad Value</p>
            <p className="font-amiri font-bold text-2xl" dir="rtl" style={{ color: P.text, WebkitTextStroke: "0.3px rgba(212,175,55,0.3)" }}>{jinn.abjadValue}</p>
          </div>
          {jinn.malayalam && (jinn.malayalam.roopam || jinn.malayalam.thamasam || jinn.malayalam.swabhavam) && (
            <div className="space-y-2 pt-1">
              <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.dim }}>Malayalam Profile · മലയാളം</p>
              {jinn.malayalam.roopam && (
                <div className="rounded-xl p-3 border" style={{ background: P.bg, borderColor: P.border }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: P.dim }}>രൂപം</p>
                  <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>{jinn.malayalam.roopam}</p>
                </div>
              )}
              {jinn.malayalam.thamasam && (
                <div className="rounded-xl p-3 border" style={{ background: P.bg, borderColor: P.border }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: P.dim }}>താമസം</p>
                  <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>{jinn.malayalam.thamasam}</p>
                </div>
              )}
              {jinn.malayalam.swabhavam && (
                <div className="rounded-xl p-3 border" style={{ background: P.bg, borderColor: P.border }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: P.dim }}>സ്വഭാവം</p>
                  <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>{jinn.malayalam.swabhavam}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

function EmptyState() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-3">
      <Eye className="w-10 h-10 mx-auto" style={{ color: P.dim }} />
      <p className="font-amiri text-lg" style={{ color: P.dim }}>No results found</p>
      <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>Try a different search or filter</p>
    </motion.div>
  );
}

const PAGE_KEY = "evil-jinn";

export default function EvilJinnPage() {
  const { getPageState, setPageState, clearPageState } = usePageState();
  const initialState = getPageState(PAGE_KEY, { query: "", category: "all", sortIdx: 0 });
  const [query, setQuery] = useState(initialState.query);
  const [category, setCategory] = useState(initialState.category);
  const [sortIdx, setSortIdx] = useState(initialState.sortIdx);
  const [selectedJinn, setSelectedJinn] = useState(null);
  const sort = SORT_CYCLE[sortIdx];

  useEffect(() => {
    setPageState(PAGE_KEY, { query, category, sortIdx });
  }, [query, category, sortIdx, setPageState]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortJinn(EVIL_JINN_NAMES.filter((j) => {
      const cat = j.abjadValue <= 200 ? "low" : j.abjadValue <= 400 ? "medium" : "high";
      if (category !== "all" && cat !== category) return false;
      if (!q) return true;
      return j.arabicName.includes(query.trim()) || j.englishName.toLowerCase().includes(q);
    }), sort);
  }, [query, category, sort]);

  const handleRefresh = () => new Promise(res => setTimeout(res, 700));

  return (
    <PageLayout>
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="space-y-4">
          <PageTitle arabic="أسماء الجن الشريرة" latin="Evil Jinn Names" subtitle="Reference Database" icon="👁" />
          <div className="flex items-center gap-2 rounded-2xl border px-3 py-2.5" style={{ background: P.bg, borderColor: P.border }}>
            <Search className="w-4 h-4" style={{ color: P.dim }} />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search names..."
              className="flex-1 bg-transparent outline-none font-inter text-sm" style={{ color: "rgba(255,255,255,0.85)" }} dir="auto" autoComplete="off" />
            {query && <button onClick={() => setQuery("")} style={{ color: P.dim }}><X className="w-4 h-4" /></button>}
          </div>
          <CategoryFilter active={category} onSelect={setCategory} />
          <div className="flex items-center justify-between">
            <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.22)" }}>
              {filtered.length} of {EVIL_JINN_NAMES.length}
            </p>
            <div className="flex gap-2">
              <button onClick={() => { setQuery(""); setCategory("all"); setSortIdx(0); clearPageState(PAGE_KEY); }}
                className="px-3 py-1.5 rounded-xl border text-[10px] uppercase tracking-widest" style={{ background: P.bg, borderColor: P.border, color: P.dim }}>Clear</button>
              <button onClick={() => setSortIdx((sortIdx + 1) % SORT_CYCLE.length)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] uppercase tracking-widest"
                style={{ background: P.bg, borderColor: P.border, color: P.dim }}>
                <ArrowUpDown className="w-3 h-3" />{SORT_LABELS[sort]}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? <EmptyState key="empty" /> : filtered.map((jinn, i) => (
                <JinnRow key={jinn.id} jinn={jinn} index={i} onOpen={setSelectedJinn} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </PullToRefresh>
      <AnimatePresence>{selectedJinn && <JinnDetail jinn={selectedJinn} onClose={() => setSelectedJinn(null)} />}</AnimatePresence>
    </PageLayout>
  );
}