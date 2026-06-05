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
  const hasProfile = jinn.malayalam && Object.values(jinn.malayalam).some(Boolean);
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

const ML_FIELDS = [
  { key: "roopam",       label: "രൂപം" },
  { key: "thamasam",     label: "താമസം" },
  { key: "swabhavam",    label: "സ്വഭാവം" },
  { key: "swaadheenom",  label: "സ്വാധീനങ്ങൾ" },
  { key: "prashnam",     label: "പ്രശ്നങ്ങൾ" },
  { key: "munnariyippu", label: "മുന്നറിയിപ്പുകൾ" },
  { key: "kuripp",       label: "കുറിപ്പുകൾ" },
];

function MlField({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ borderRadius: "0.75rem", padding: "0.75rem 1rem", background: P.bg, border: "1px solid " + P.border }}>
      <p style={{ fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: P.dim, marginBottom: "0.35rem", fontFamily: "Inter, sans-serif" }}>{label}</p>
      <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "rgba(255,255,255,0.88)", fontFamily: "Inter, sans-serif" }}>{value}</p>
    </div>
  );
}

function JinnDetail({ jinn, onClose }) {
  const ml = jinn.malayalam || {};
  const hasAnyMl = ML_FIELDS.some(f => ml[f.key]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0.75rem", background: "rgba(2,6,16,0.92)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        style={{ width: "100%", maxWidth: "30rem", borderRadius: "1.5rem", overflow: "hidden", background: "linear-gradient(160deg, rgba(10,18,42,1) 0%, rgba(4,9,22,1) 100%)", border: "1px solid " + P.borderHi, boxShadow: "0 0 80px rgba(212,175,55,0.15), 0 32px 80px rgba(0,0,0,0.90)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: "1.5rem 1.5rem 1.25rem", background: "rgba(212,175,55,0.05)", borderBottom: "1px solid " + P.border, position: "relative", textAlign: "center" }}>
          <button
            onClick={onClose}
            style={{ position: "absolute", top: "1rem", right: "1rem", width: "2rem", height: "2rem", borderRadius: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.50)", cursor: "pointer" }}
          >
            <X style={{ width: "1rem", height: "1rem" }} />
          </button>

          {/* Serial + category */}
          <p style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: "0.6rem", fontFamily: "Inter, sans-serif" }}>
            #{jinn.serialNo} · {jinn.abjadValue <= 200 ? "Low" : jinn.abjadValue <= 400 ? "Medium" : "High"} · ജിന്ന് പ്രൊഫൈൽ
          </p>

          {/* Arabic name — Amiri Bold, large */}
          <p dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", fontWeight: 700, fontSize: "2.6rem", lineHeight: 1.2, color: P.text, textShadow: "0 0 28px rgba(212,175,55,0.35)", letterSpacing: "0.02em", marginBottom: "0.25rem" }}>
            {jinn.arabicHarakat}
          </p>

          {/* English name */}
          <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1rem", color: "rgba(255,255,255,0.88)", marginBottom: "0.75rem" }}>
            {jinn.englishName}
          </p>

          {/* Badges */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.3rem 0.75rem", borderRadius: "0.5rem", background: P.bg, border: "1px solid " + P.faint, color: P.dim }}>
              അബ്ജദ്: {jinn.abjadValue}
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.3rem 0.75rem", borderRadius: "0.5rem", background: P.bg, border: "1px solid " + P.faint, color: P.dim }}>
              അക്ഷരങ്ങൾ: {jinn.letterCount}
            </span>
            {hasAnyMl && (
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.3rem 0.75rem", borderRadius: "0.5rem", background: "rgba(134,239,172,0.08)", border: "1px solid rgba(134,239,172,0.30)", color: "#86efac" }}>
                മലയാളം ✓
              </span>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ padding: "1.25rem 1.25rem 1.5rem", overflowY: "auto", maxHeight: "60vh", display: "flex", flexDirection: "column", gap: "0.6rem" }}>

          {/* Arabic name info row */}
          <div style={{ borderRadius: "0.75rem", padding: "0.75rem 1rem", background: P.bg, border: "1px solid " + P.border }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: P.dim, marginBottom: "0.35rem", fontFamily: "Inter, sans-serif" }}>ജിന്നിന്റെ പേര്</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <p dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", fontWeight: 700, fontSize: "1.5rem", color: P.text, lineHeight: 1.3 }}>{jinn.arabicHarakat}</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.65)" }}>{jinn.englishName}</p>
            </div>
          </div>

          {/* Abjad value */}
          <div style={{ borderRadius: "0.75rem", padding: "0.75rem 1rem", background: P.bgHi, border: "1px solid " + P.borderHi, textAlign: "center" }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: P.dim, marginBottom: "0.3rem", fontFamily: "Inter, sans-serif" }}>അബ്ജദ് മൂല്യം</p>
            <p style={{ fontFamily: "'Amiri', serif", fontWeight: 700, fontSize: "2rem", color: P.text, textShadow: "0 0 16px rgba(212,175,55,0.3)" }}>{jinn.abjadValue}</p>
          </div>

          {/* Malayalam profile fields */}
          {hasAnyMl ? (
            ML_FIELDS.map(f => <MlField key={f.key} label={f.label} value={ml[f.key]} />)
          ) : (
            <div style={{ borderRadius: "0.75rem", padding: "1.25rem", background: P.bg, border: "1px solid " + P.faint, textAlign: "center" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.30)", lineHeight: 1.6 }}>
                ഈ ജിന്നിനെ കുറിച്ചുള്ള മലയാളം വിവരണം ഇതുവരെ ചേർത്തിട്ടില്ല.
              </p>
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