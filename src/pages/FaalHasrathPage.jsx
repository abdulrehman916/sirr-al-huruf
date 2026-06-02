// ═══════════════════════════════════════════════════════════════
// FAAL HASRATH — Completely Independent Module
// No imports from any other module's engine, rules, or data.
// Own data only: lib/faalHasrathData.js
// SVG heart symbols from manuscript "Faal Nama Hasrath Ali (O)"
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

// ── SVG inner mark renderer ────────────────────────────────────
function InnerMark({ mark, size = 22, color = "#D8B4FE" }) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.14;
  const sw = s * 0.09; // stroke-width
  const props = { stroke: color, strokeWidth: sw, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };

  const marks = {
    "dot":        <circle cx={cx} cy={cy} r={r} fill={color} />,
    "two-dots":   <><circle cx={cx - r * 1.6} cy={cy} r={r * 0.85} fill={color} /><circle cx={cx + r * 1.6} cy={cy} r={r * 0.85} fill={color} /></>,
    "three-dots": <><circle cx={cx} cy={cy - r * 1.5} r={r * 0.8} fill={color} /><circle cx={cx - r * 1.4} cy={cy + r * 1.0} r={r * 0.8} fill={color} /><circle cx={cx + r * 1.4} cy={cy + r * 1.0} r={r * 0.8} fill={color} /></>,
    "cross":      <><line x1={cx} y1={cy - r * 2.2} x2={cx} y2={cy + r * 2.2} {...props} /><line x1={cx - r * 2.2} y1={cy} x2={cx + r * 2.2} y2={cy} {...props} /></>,
    "x-cross":    <><line x1={cx - r * 2} y1={cy - r * 2} x2={cx + r * 2} y2={cy + r * 2} {...props} /><line x1={cx + r * 2} y1={cy - r * 2} x2={cx - r * 2} y2={cy + r * 2} {...props} /></>,
    "line-h":     <line x1={cx - r * 2.4} y1={cy} x2={cx + r * 2.4} y2={cy} {...props} />,
    "line-v":     <line x1={cx} y1={cy - r * 2.4} x2={cx} y2={cy + r * 2.4} {...props} />,
    "line-diag":  <line x1={cx - r * 2} y1={cy + r * 2} x2={cx + r * 2} y2={cy - r * 2} {...props} />,
    "arc-up":     <path d={`M ${cx - r * 2.2} ${cy + r * 0.5} Q ${cx} ${cy - r * 2.2} ${cx + r * 2.2} ${cy + r * 0.5}`} {...props} />,
    "arc-down":   <path d={`M ${cx - r * 2.2} ${cy - r * 0.5} Q ${cx} ${cy + r * 2.2} ${cx + r * 2.2} ${cy - r * 0.5}`} {...props} />,
    "eye":        <><path d={`M ${cx - r * 2.2} ${cy} Q ${cx} ${cy - r * 2} ${cx + r * 2.2} ${cy} Q ${cx} ${cy + r * 2} ${cx - r * 2.2} ${cy} Z`} {...props} /><circle cx={cx} cy={cy} r={r * 0.7} fill={color} /></>,
    "circle":     <circle cx={cx} cy={cy} r={r * 1.8} {...props} />,
    "double-arc": <><path d={`M ${cx - r * 2} ${cy - r * 0.6} Q ${cx} ${cy - r * 2.4} ${cx + r * 2} ${cy - r * 0.6}`} {...props} /><path d={`M ${cx - r * 2} ${cy + r * 0.8} Q ${cx} ${cy + r * 2.6} ${cx + r * 2} ${cy + r * 0.8}`} {...props} /></>,
    "spiral":     <path d={`M ${cx} ${cy} m ${r * 0.6} 0 a ${r * 0.6} ${r * 0.6} 0 1 0 -${r * 1.2} 0 a ${r * 1.2} ${r * 1.2} 0 1 1 ${r * 2.4} 0`} {...props} />,
    "star3":      <><line x1={cx} y1={cy - r * 2.2} x2={cx} y2={cy + r * 2.2} {...props} /><line x1={cx - r * 1.9} y1={cy - r * 1.1} x2={cx + r * 1.9} y2={cy + r * 1.1} {...props} /><line x1={cx + r * 1.9} y1={cy - r * 1.1} x2={cx - r * 1.9} y2={cy + r * 1.1} {...props} /></>,
    "zigzag":     <polyline points={`${cx - r * 2.2},${cy + r * 1.2} ${cx - r * 0.8},${cy - r * 1.2} ${cx + r * 0.8},${cy + r * 1.2} ${cx + r * 2.2},${cy - r * 1.2}`} {...props} />,
  };

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      {marks[mark] || <circle cx={cx} cy={cy} r={r} fill={color} />}
    </svg>
  );
}

// ── Heart SVG with inner mark (matches manuscript style) ──────
function HeartSymbol({ mark, size = 64, glowColor = "rgba(216,180,254,0.55)" }) {
  // Heart path normalized to 100x100 viewBox
  const heartPath = "M50,30 C50,20 35,10 25,18 C15,26 15,40 25,50 L50,75 L75,50 C85,40 85,26 75,18 C65,10 50,20 50,30 Z";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ filter: `drop-shadow(0 0 6px ${glowColor})`, overflow: "visible" }}
    >
      {/* Heart outline — manuscript style: ink-drawn, not filled */}
      <path
        d={heartPath}
        fill="rgba(216,180,254,0.07)"
        stroke="rgba(216,180,254,0.75)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Inner mark centered in heart body */}
      <foreignObject x="30" y="32" width="40" height="40">
        <div xmlns="http://www.w3.org/1999/xhtml"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
          <InnerMark mark={mark} size={36} color="#D8B4FE" />
        </div>
      </foreignObject>
    </svg>
  );
}

// ── Cell badge ─────────────────────────────────────────────────
function CellBadge({ cell, index, onTap }) {
  return (
    <motion.button
      onClick={() => onTap(cell)}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.28, ease: "easeOut" }}
      whileHover={{ scale: 1.07, boxShadow: `0 0 20px ${P.glow}` }}
      whileTap={{ scale: 0.92 }}
      className="relative flex flex-col items-center justify-center rounded-2xl border"
      style={{
        background: P.bg,
        borderColor: P.faint,
        aspectRatio: "1 / 1",
        overflow: "hidden",
        WebkitTapHighlightColor: "transparent",
        padding: "6px 4px 4px",
      }}
    >
      {/* Top sheen */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${P.borderHi}, transparent)`, opacity: 0.4 }} />

      {/* Cell number — top-left, Arabic numeral style */}
      <span className="absolute top-1.5 left-2 font-inter text-[9px] font-bold tabular-nums"
        style={{ color: "rgba(216,180,254,0.35)" }}>
        {cell.id}
      </span>

      {/* Heart symbol */}
      <motion.div
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 3.5 + index * 0.28, repeat: Infinity, ease: "easeInOut" }}
        style={{ lineHeight: 0 }}
      >
        <HeartSymbol mark={cell.innerMark} size={52} />
      </motion.div>
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
              {/* Large heart symbol */}
              <motion.div
                className="flex justify-center"
                animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.06, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <HeartSymbol mark={cell.innerMark} size={90} glowColor={P.glowHi} />
              </motion.div>

              <div>
                <span className="font-inter text-[9px] uppercase tracking-[0.28em]"
                  style={{ color: "rgba(216,180,254,0.40)" }}>
                  Cell {cell.id} of 16
                </span>
                <motion.h2
                  className="font-amiri font-bold leading-tight mt-1"
                  style={{ fontSize: "clamp(1.3rem, 5vw, 1.8rem)", color: P.text }}
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
              فأل نامه حسرت علي — Faal Nama Hasrath Ali
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
          arabic="فأل نامه حسرت علي"
          latin="Faal Nama Hasrath Ali"
          subtitle="16 Sacred Heart Symbols"
          icon="♡"
        />

        {/* Instruction */}
        <div className="rounded-2xl border px-4 py-3 text-center"
          style={{ background: P.bg, borderColor: P.faint }}>
          <p className="font-amiri text-base" style={{ color: P.dim }}>
            اختر رمزاً واحداً من القلب
          </p>
          <p className="font-inter text-[9px] uppercase tracking-widest mt-1" style={{ color: "rgba(216,180,254,0.30)" }}>
            Clear your mind — tap one heart with pure intention
          </p>
        </div>

        {/* 4×4 Grid — right-to-left to match manuscript layout */}
        <div
          dir="rtl"
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
          ✦ فأل نامه حسرت علي — ١٦ رمزاً مستقلاً ✦
        </p>

      </div>

      {/* Detail Modal */}
      <DetailModal cell={selectedCell} onClose={() => setSelectedCell(null)} />
    </PageLayout>
  );
}