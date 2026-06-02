// ═══════════════════════════════════════════════════════════════
// FAAL HASRATH — Completely Independent Module
// No imports from any other module's engine, rules, or data.
// Own data only: lib/faalHasrathData.js
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { FAAL_CELLS } from "../lib/faalHasrathData";

// ── Own palette (independent) ──────────────────────────────────
const P = {
  border:   "rgba(160,100,220,0.40)",
  borderHi: "rgba(180,120,255,0.70)",
  glow:     "rgba(160,100,220,0.25)",
  glowHi:   "rgba(180,120,255,0.55)",
  text:     "#D8B4FE",
  dim:      "rgba(216,180,254,0.55)",
  faint:    "rgba(216,180,254,0.18)",
  bg:       "rgba(160,100,220,0.07)",
  bgHi:     "rgba(160,100,220,0.16)",
};

// ── Cell badge ─────────────────────────────────────────────────
function CellBadge({ cell, index, onTap }) {
  return (
    <motion.button
      onClick={() => onTap(cell)}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.28, ease: "easeOut" }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
      className="relative flex flex-col items-center justify-center rounded-2xl border"
      style={{
        background: P.bg,
        borderColor: P.faint,
        boxShadow: "none",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Top sheen */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${P.borderHi}, transparent)`, opacity: 0.4 }} />

      {/* Cell number */}
      <span className="absolute top-1.5 left-2 font-inter text-[9px] font-bold tabular-nums"
        style={{ color: "rgba(216,180,254,0.30)" }}>
        {cell.id}
      </span>

      {/* Symbol */}
      <motion.span
        className="font-amiri"
        style={{ fontSize: "clamp(1.5rem, 7vw, 2.2rem)", lineHeight: 1, color: P.text }}
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 3.5 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
      >
        {cell.symbol}
      </motion.span>

      {/* Arabic label */}
      <span className="font-amiri text-center leading-tight mt-1 px-1"
        dir="rtl"
        style={{ fontSize: "clamp(8px, 2.5vw, 11px)", color: P.dim }}>
        {cell.arabic}
      </span>
    </motion.button>
  );
}

// ── Detail Modal ───────────────────────────────────────────────
function DetailModal({ cell, onClose }) {
  if (!cell) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="faal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-3 pb-4 sm:pb-0"
        style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          key="faal-panel"
          initial={{ opacity: 0, y: 60, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl border overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(18,8,44,0.99) 0%, rgba(8,4,28,0.99) 100%)",
            borderColor: P.borderHi,
            boxShadow: `0 0 80px ${P.glow}, 0 8px 48px rgba(0,0,0,0.80), inset 0 1px 0 rgba(216,180,254,0.10)`,
            maxHeight: "88vh",
            overflowY: "auto",
          }}
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${P.borderHi}, transparent)` }} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border transition-all z-10"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)" }}
          >
            <X className="w-4 h-4 text-white/60" />
          </button>

          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="text-center space-y-2 pt-1">
              <motion.span
                className="font-amiri"
                style={{ fontSize: "3.8rem", display: "block", lineHeight: 1, color: P.text }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  scale: [1, 1.07, 1],
                  textShadow: [`0 0 20px ${P.glow}`, `0 0 50px ${P.glowHi}`, `0 0 20px ${P.glow}`],
                }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                {cell.symbol}
              </motion.span>

              <div>
                <span className="font-inter text-[9px] uppercase tracking-[0.28em]"
                  style={{ color: "rgba(216,180,254,0.40)" }}>
                  Cell {cell.id} of 16
                </span>
                <motion.h2
                  className="font-amiri font-bold leading-tight mt-1"
                  style={{ fontSize: "clamp(1.4rem, 5vw, 1.9rem)", color: P.text }}
                  animate={{ textShadow: [`0 0 12px ${P.glow}`, `0 0 32px ${P.glowHi}`, `0 0 12px ${P.glow}`] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {cell.title}
                </motion.h2>
                <p className="font-amiri text-lg mt-0.5" dir="rtl"
                  style={{ color: "rgba(216,180,254,0.50)" }}>
                  {cell.arabic}
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2.5 pt-1">
                <div style={{ width: 40, height: 0.5, background: `linear-gradient(to right, transparent, ${P.borderHi})` }} />
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: P.text, boxShadow: `0 0 6px ${P.glowHi}` }} />
                <div style={{ width: 40, height: 0.5, background: `linear-gradient(to left, transparent, ${P.borderHi})` }} />
              </div>
            </div>

            {/* Description */}
            <Section label="✦ Description" color={P.dim}>
              <p className="font-amiri text-base leading-relaxed text-white/70">
                {cell.description}
              </p>
            </Section>

            {/* Interpretation */}
            <Section label="◈ Interpretation" color={P.dim}>
              <p className="font-amiri text-base leading-relaxed" style={{ color: P.text }}>
                {cell.interpretation}
              </p>
            </Section>

            {/* Advice */}
            <Section label="☽ Advice" color={P.dim}>
              <p className="font-amiri text-base leading-relaxed text-white/70">
                {cell.advice}
              </p>
            </Section>

            {/* Footer */}
            <p className="font-inter text-[8px] uppercase tracking-widest text-center pt-2"
              style={{ color: "rgba(216,180,254,0.20)" }}>
              فأل الحسرة — Faal Hasrath
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Section({ label, color, children }) {
  return (
    <div className="rounded-2xl border p-4 space-y-2"
      style={{ background: P.bg, borderColor: P.faint }}>
      <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color }}>
        {label}
      </p>
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${P.faint}, transparent)` }} />
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function FaalHasrathPage() {
  const [selectedCell, setSelectedCell] = useState(null);

  return (
    <PageLayout>
      <div className="space-y-5">

        {/* Header */}
        <PageTitle
          arabic="فأل الحسرة"
          latin="Faal Hasrath"
          subtitle="The Oracle of Longing — 16 Sacred Symbols"
          icon="✦"
        />

        {/* Instruction */}
        <div className="rounded-2xl border px-4 py-3 text-center"
          style={{ background: P.bg, borderColor: P.faint }}>
          <p className="font-amiri text-base" style={{ color: P.dim }}>
            اختر رمزاً واحداً من القلب
          </p>
          <p className="font-inter text-[9px] uppercase tracking-widest mt-1" style={{ color: "rgba(216,180,254,0.30)" }}>
            Clear your mind — tap one cell with pure intention
          </p>
        </div>

        {/* 4×4 Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
          }}
        >
          {FAAL_CELLS.map((cell, i) => (
            <CellBadge
              key={cell.id}
              cell={cell}
              index={i}
              onTap={setSelectedCell}
            />
          ))}
        </div>

        {/* Footer note */}
        <p className="font-inter text-[8px] uppercase tracking-widest text-center"
          style={{ color: "rgba(216,180,254,0.18)" }}>
          ✦ فأل الحسرة — 16 رمزاً مستقلاً ✦
        </p>

      </div>

      {/* Detail Modal */}
      <DetailModal cell={selectedCell} onClose={() => setSelectedCell(null)} />
    </PageLayout>
  );
}