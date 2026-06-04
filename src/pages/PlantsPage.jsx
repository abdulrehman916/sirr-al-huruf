// ═══════════════════════════════════════════════════════════════
// PLANTS & INGREDIENTS DICTIONARY — STANDALONE PAGE
// Completely isolated from all calculation engines.
// Zero imports from any sealed engine, lib, or data file.
// ═══════════════════════════════════════════════════════════════

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, ChevronUp, Leaf } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { PLANTS_DATA, PLANT_CATEGORIES } from "../lib/plantsData";

// ── Palette ───────────────────────────────────────────────────
const P = {
  border:   "rgba(34,197,94,0.30)",
  borderHi: "rgba(34,197,94,0.65)",
  glow:     "rgba(34,197,94,0.18)",
  glowHi:   "rgba(34,197,94,0.45)",
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
          className="flex-shrink-0 px-3 py-1.5 rounded-xl border font-inter text-[10px] font-semibold uppercase tracking-widest transition-all"
          style={{
            background: active === cat.id ? P.bgHi : "transparent",
            borderColor: active === cat.id ? P.borderHi : P.faint,
            color: active === cat.id ? P.text : "rgba(134,239,172,0.40)",
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

// ── Info row inside card ──────────────────────────────────────
function InfoRow({ label, value, arabic = false }) {
  if (!value) return null;
  return (
    <div className="space-y-0.5">
      <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: P.dim }}>{label}</p>
      <p
        className={arabic ? "font-amiri text-base leading-relaxed" : "font-inter text-xs leading-relaxed"}
        style={{ color: "rgba(255,255,255,0.82)" }}
      >
        {value}
      </p>
    </div>
  );
}

// ── Single plant card ─────────────────────────────────────────
function PlantCard({ plant, index }) {
  const [expanded, setExpanded] = useState(false);

  const catLabel = PLANT_CATEGORIES.find(c => c.id === plant.category)?.label ?? plant.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.28, ease: "easeOut" }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background: P.bg,
        borderColor: expanded ? P.borderHi : P.border,
        boxShadow: expanded ? `0 0 28px ${P.glow}, inset 0 1px 0 rgba(134,239,172,0.08)` : "none",
      }}
    >
      {/* Header row — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3.5 gap-3"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <div className="flex-1 text-left space-y-0.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-amiri font-bold text-lg leading-none" style={{ color: P.text }}>
              {plant.arabic}
            </span>
            <span
              className="font-inter text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full border"
              style={{ color: P.dim, borderColor: P.faint, background: "rgba(134,239,172,0.08)" }}
            >
              {catLabel}
            </span>
          </div>
          <p className="font-inter text-xs font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>
            {plant.english}
          </p>
          <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.38)" }}>
            {plant.malayalam} · <em>{plant.scientific}</em>
          </p>
        </div>
        <div style={{ color: P.dim, flexShrink: 0 }}>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 space-y-4"
              style={{ borderTop: `1px solid ${P.faint}` }}
            >
              <div className="pt-3 space-y-3">
                <InfoRow label="🌿 Uses" value={plant.uses} />
                <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${P.faint}, transparent)` }} />
                <InfoRow label="✦ Benefits" value={plant.benefits} />
                <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${P.faint}, transparent)` }} />
                <InfoRow label="⚠ Warnings" value={plant.warnings} />
                <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${P.faint}, transparent)` }} />
                <InfoRow label="عربي" value={plant.arabic} arabic />
                <InfoRow label="Scientific" value={plant.scientific} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ query }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="text-center py-14 space-y-3"
    >
      <Leaf className="w-10 h-10 mx-auto" style={{ color: P.dim }} />
      <p className="font-amiri text-lg" style={{ color: P.dim }}>
        {query ? `"${query}" — not found` : "No entries in this category"}
      </p>
      <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
        Try a different search or category
      </p>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function PlantsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PLANTS_DATA.filter((p) => {
      const matchCat = category === "all" || p.category === category;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        p.arabic.includes(q) ||
        p.english.toLowerCase().includes(q) ||
        p.malayalam.includes(q) ||
        p.scientific.toLowerCase().includes(q) ||
        p.uses.toLowerCase().includes(q) ||
        p.benefits.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return (
    <PageLayout>
      <div className="space-y-5">

        <PageTitle
          arabic="قاموس النباتات"
          latin="Dictionary of Plants & Ingredients"
          subtitle="Medicinal · Spiritual · Traditional"
          icon="🌿"
        />

        {/* Search box */}
        <div
          className="flex items-center gap-2 rounded-2xl border px-3 py-2.5"
          style={{
            background: P.bg,
            borderColor: P.border,
            boxShadow: `0 0 14px ${P.glow}`,
          }}
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: P.dim }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, benefit, or use…"
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

        {/* Category filter */}
        <CategoryFilter active={category} onSelect={setCategory} />

        {/* Count badge */}
        <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
          {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
        </p>

        {/* List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <EmptyState key="empty" query={query} />
            ) : (
              filtered.map((plant, i) => (
                <PlantCard key={plant.id} plant={plant} index={i} />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer note */}
        <p
          className="font-inter text-[8px] uppercase tracking-widest text-center pt-2"
          style={{ color: "rgba(134,239,172,0.15)" }}
        >
          ✦ قاموس النباتات والمواد — Plants & Ingredients Dictionary ✦
        </p>

      </div>
    </PageLayout>
  );
}