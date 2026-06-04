// ═══════════════════════════════════════════════════════════════
// PLANTS & INGREDIENTS DICTIONARY — STANDALONE PAGE
// Completely isolated from all calculation engines.
// Zero imports from any sealed engine, lib, or data file.
// ═══════════════════════════════════════════════════════════════

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, ChevronUp, Leaf, ArrowUpDown } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { PLANTS_DATA, PLANT_CATEGORIES } from "../lib/plantsData";

// ── Palette ───────────────────────────────────────────────────
const P = {
  border:   "rgba(34,197,94,0.30)",
  borderHi: "rgba(34,197,94,0.65)",
  glow:     "rgba(34,197,94,0.18)",
  text:     "#86EFAC",
  dim:      "rgba(134,239,172,0.55)",
  faint:    "rgba(134,239,172,0.14)",
  bg:       "rgba(34,197,94,0.06)",
  bgHi:     "rgba(34,197,94,0.14)",
};

// ── Category filter pills ─────────────────────────────────────
function CategoryFilter({ active, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {PLANT_CATEGORIES.map((cat) => (
        <motion.button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 px-3 py-1.5 rounded-xl border font-inter text-[10px] font-semibold uppercase tracking-widest"
          style={{
            background: active === cat.id ? P.bgHi : "transparent",
            borderColor: active === cat.id ? P.borderHi : P.faint,
            color: active === cat.id ? P.text : "rgba(134,239,172,0.38)",
            boxShadow: active === cat.id ? `0 0 14px ${P.glow}` : "none",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
}

// ── Sort toggle ───────────────────────────────────────────────
function SortToggle({ sort, onToggle }) {
  const labels = { az: "A → Z", za: "Z → A", arabic: "ع → غ" };
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-inter text-[10px] font-semibold uppercase tracking-widest"
      style={{
        background: P.bg,
        borderColor: P.border,
        color: P.dim,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <ArrowUpDown className="w-3 h-3" />
      {labels[sort]}
    </button>
  );
}

// ── Labelled field ────────────────────────────────────────────
function Field({ label, value, arabic = false, rtl = false }) {
  if (!value) return null;
  return (
    <div className="space-y-0.5">
      <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.dim }}>{label}</p>
      <p
        dir={rtl ? "rtl" : "ltr"}
        className={arabic ? "font-amiri text-base leading-relaxed" : "font-inter text-xs leading-relaxed"}
        style={{ color: "rgba(255,255,255,0.82)" }}
      >
        {value}
      </p>
    </div>
  );
}

function Divider() {
  return (
    <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${P.faint}, transparent)` }} />
  );
}

// ── Single plant card ─────────────────────────────────────────
function PlantCard({ plant, index }) {
  const [open, setOpen] = useState(false);
  const catLabel = PLANT_CATEGORIES.find(c => c.id === plant.category)?.label ?? plant.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.035, 0.4), duration: 0.26, ease: "easeOut" }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background: P.bg,
        borderColor: open ? P.borderHi : P.border,
        boxShadow: open ? `0 0 28px ${P.glow}, inset 0 1px 0 rgba(134,239,172,0.08)` : "none",
      }}
    >
      {/* ── Header (always visible) ── */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between px-4 py-3.5 gap-3 text-left"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <div className="flex-1 min-w-0 space-y-0.5">
          {/* Arabic + category badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-amiri font-bold text-xl leading-none" style={{ color: P.text }}>
              {plant.ArabicName}
            </span>
            <span
              className="font-inter text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full border"
              style={{ color: P.dim, borderColor: P.faint, background: "rgba(134,239,172,0.08)" }}
            >
              {catLabel}
            </span>
          </div>

          {/* English name */}
          <p className="font-inter text-sm font-semibold" style={{ color: "rgba(255,255,255,0.80)" }}>
            {plant.EnglishName}
          </p>

          {/* Malayalam + Scientific — compact summary */}
          <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.38)" }}>
            {plant.MalayalamName}
            {plant.ScientificName ? ` · ` : ""}
            {plant.ScientificName && <em>{plant.ScientificName}</em>}
          </p>

          {/* Page reference badge */}
          {plant.PageReference && (
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(134,239,172,0.30)" }}>
              📄 {plant.PageReference}
            </p>
          )}
        </div>

        <div style={{ color: P.dim, flexShrink: 0, marginTop: 4 }}>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* ── Expanded body ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 space-y-3.5" style={{ borderTop: `1px solid ${P.faint}` }}>
              <div className="pt-3.5 space-y-3.5">

                {plant.DescriptionEnglish && (
                  <>
                    <Field label="Description" value={plant.DescriptionEnglish} />
                    <Divider />
                  </>
                )}

                {plant.DescriptionMalayalam && (
                  <>
                    <Field label="വിവരണം" value={plant.DescriptionMalayalam} />
                    <Divider />
                  </>
                )}

                {plant.UsesEnglish && (
                  <>
                    <Field label="Uses" value={plant.UsesEnglish} />
                    <Divider />
                  </>
                )}

                {plant.UsesMalayalam && (
                  <>
                    <Field label="ഉപയോഗങ്ങൾ" value={plant.UsesMalayalam} />
                    <Divider />
                  </>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Arabic" value={plant.ArabicName} arabic rtl />
                  <Field label="Scientific" value={plant.ScientificName} />
                </div>

                {plant.PageReference && (
                  <>
                    <Divider />
                    <Field label="Page Reference" value={plant.PageReference} />
                  </>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ hasData }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="text-center py-16 space-y-3"
    >
      <Leaf className="w-10 h-10 mx-auto" style={{ color: P.dim }} />
      {hasData ? (
        <>
          <p className="font-amiri text-lg" style={{ color: P.dim }}>No results found</p>
          <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
            Try a different search term or category
          </p>
        </>
      ) : (
        <>
          <p className="font-amiri text-lg" style={{ color: P.dim }}>
            Awaiting source pages
          </p>
          <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
            Entries will appear here as source pages are processed
          </p>
        </>
      )}
    </motion.div>
  );
}

// ── Sort cycling: az → za → arabic → az ──────────────────────
const SORT_CYCLE = ["az", "za", "arabic"];

function sortPlants(list, sort) {
  const copy = [...list];
  if (sort === "az")     return copy.sort((a, b) => a.EnglishName.localeCompare(b.EnglishName));
  if (sort === "za")     return copy.sort((a, b) => b.EnglishName.localeCompare(a.EnglishName));
  if (sort === "arabic") return copy.sort((a, b) => a.ArabicName.localeCompare(b.ArabicName, "ar"));
  return copy;
}

// ── Main page ─────────────────────────────────────────────────
export default function PlantsPage() {
  const [query, setQuery]     = useState("");
  const [category, setCategory] = useState("all");
  const [sortIdx, setSortIdx] = useState(0);
  const sort = SORT_CYCLE[sortIdx];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = PLANTS_DATA.filter((p) => {
      const matchCat = category === "all" || p.category === category;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        (p.ArabicName        && p.ArabicName.includes(query.trim()))   ||
        (p.EnglishName       && p.EnglishName.toLowerCase().includes(q)) ||
        (p.MalayalamName     && p.MalayalamName.includes(query.trim())) ||
        (p.ScientificName    && p.ScientificName.toLowerCase().includes(q)) ||
        (p.DescriptionEnglish && p.DescriptionEnglish.toLowerCase().includes(q)) ||
        (p.UsesEnglish       && p.UsesEnglish.toLowerCase().includes(q))
      );
    });
    return sortPlants(base, sort);
  }, [query, category, sort]);

  const hasData = PLANTS_DATA.length > 0;

  return (
    <PageLayout>
      <div className="space-y-5">

        <PageTitle
          arabic="قاموس النباتات والمواد"
          latin="Dictionary of Plants & Ingredients"
          subtitle="Medicinal · Spiritual · Traditional"
          icon="🌿"
        />

        {/* Search */}
        <div
          className="flex items-center gap-2 rounded-2xl border px-3 py-2.5"
          style={{ background: P.bg, borderColor: P.border, boxShadow: `0 0 14px ${P.glow}` }}
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: P.dim }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: English / عربي / മലയാളം / scientific…"
            className="flex-1 bg-transparent outline-none font-inter text-sm placeholder:text-[rgba(134,239,172,0.28)]"
            style={{ color: "rgba(255,255,255,0.85)" }}
            dir="auto"
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ color: P.dim }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category + Sort row */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <CategoryFilter active={category} onSelect={setCategory} />
          </div>
          <div className="flex-shrink-0 pt-0.5">
            <SortToggle sort={sort} onToggle={() => setSortIdx((sortIdx + 1) % SORT_CYCLE.length)} />
          </div>
        </div>

        {/* Count */}
        <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.22)" }}>
          {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          {PLANTS_DATA.length > 0 && ` of ${PLANTS_DATA.length}`}
        </p>

        {/* Cards */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <EmptyState key="empty" hasData={hasData && query !== "" || category !== "all"} />
            ) : (
              filtered.map((plant, i) => (
                <PlantCard key={plant.id} plant={plant} index={i} />
              ))
            )}
          </AnimatePresence>
        </div>

        <p className="font-inter text-[8px] uppercase tracking-widest text-center pt-2"
          style={{ color: "rgba(134,239,172,0.12)" }}>
          ✦ قاموس النباتات والمواد — Plants & Ingredients Dictionary ✦
        </p>

      </div>
    </PageLayout>
  );
}