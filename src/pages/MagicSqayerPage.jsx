import { useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "../components/PageLayout";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  bg:       "rgba(212,175,55,0.07)",
  border:   "rgba(212,175,55,0.40)",
};

const GRID_SIZES = [
  { label: "3×3", value: 3 },
  { label: "4×4", value: 4 },
  { label: "5×5", value: 5 },
  { label: "6×6", value: 6 },
  { label: "7×7", value: 7 },
  { label: "8×8", value: 8 },
  { label: "9×9", value: 9 },
];

const ELEMENTS = [
  { key: "earth", arabic: "التراب",  icon: "🌍", color: "#A5C880", glow: "rgba(165,200,128,0.35)", bg: "rgba(165,200,128,0.10)", border: "rgba(165,200,128,0.50)", label: "Toprak" },
  { key: "fire",  arabic: "النار",   icon: "🔥", color: "#FF6B35", glow: "rgba(255,107,53,0.35)", bg: "rgba(255,107,53,0.10)", border: "rgba(255,107,53,0.50)", label: "Ateş" },
  { key: "air",   arabic: "الهواء",  icon: "🌬", color: "#B2EBF2", glow: "rgba(178,235,242,0.35)", bg: "rgba(178,235,242,0.10)", border: "rgba(178,235,242,0.50)", label: "Hava" },
  { key: "water", arabic: "الماء",   icon: "💧", color: "#4FC3F7", glow: "rgba(79,195,247,0.35)", bg: "rgba(79,195,247,0.10)", border: "rgba(79,195,247,0.50)", label: "Su" },
];

const PLANETS = [
  { key: "zuhal",   arabic: "الزحل",   icon: "🪐", color: "#9B7FD4", glow: "rgba(155,127,212,0.35)", bg: "rgba(155,127,212,0.10)", border: "rgba(155,127,212,0.50)" },
  { key: "mustari", arabic: "المشتري", icon: "✨", color: "#74C0FC", glow: "rgba(116,192,252,0.35)", bg: "rgba(116,192,252,0.10)", border: "rgba(116,192,252,0.50)" },
  { key: "merih",   arabic: "المريخ",  icon: "🔥", color: "#FF4444", glow: "rgba(255,68,68,0.35)",   bg: "rgba(255,68,68,0.10)",   border: "rgba(255,68,68,0.50)" },
  { key: "sems",    arabic: "الشمس",   icon: "☀️", color: "#FBBF24", glow: "rgba(251,191,36,0.35)",  bg: "rgba(251,191,36,0.10)",  border: "rgba(251,191,36,0.50)" },
  { key: "zuhre",   arabic: "الزهرة",  icon: "💖", color: "#F9A8D4", glow: "rgba(249,168,212,0.35)", bg: "rgba(249,168,212,0.10)", border: "rgba(249,168,212,0.50)" },
  { key: "utarid",  arabic: "العطارد", icon: "🧠", color: "#34D399", glow: "rgba(52,211,153,0.35)",  bg: "rgba(52,211,153,0.10)",  border: "rgba(52,211,153,0.50)" },
  { key: "kamer",   arabic: "القمر",   icon: "🌙", color: "#818CF8", glow: "rgba(129,140,248,0.35)", bg: "rgba(129,140,248,0.10)", border: "rgba(129,140,248,0.50)" },
];

// ── Ottoman Kesir Engine ──────────────────────────────────────────
// Kutb (Tarh) values per grid size
const KUTB_MAGIC = { 3: 15, 4: 34, 5: 65, 6: 111, 7: 175, 8: 260, 9: 369 };

// Magic constant for a Kesir square: n*quotient + n*(n²-1)/2 + correction_count
// where correction_count = remainder (one +1 is applied once per correction cell)
function magicConstant(n, base) {
  return n * base + Math.floor(n * (n * n - 1) / 2);
}

// ── Correction cell table (1-indexed flat position) ───────────────
const KESIR_CORRECTION = {
  3: { 2: 4,  1: 7 },
  4: { 3: 5,  2: 9,  1: 13 },
  5: { 4: 6,  3: 11, 2: 16, 1: 21 },
  6: { 5: 7,  4: 13, 3: 19, 2: 25, 1: 31 },
  7: { 6: 8,  5: 15, 4: 22, 3: 29, 2: 36, 1: 43 },
  8: { 7: 9,  6: 17, 5: 25, 4: 33, 3: 41, 2: 49, 1: 57 },
  9: { 8: 10, 7: 19, 6: 28, 5: 37, 4: 46, 3: 55, 2: 64, 1: 73 },
};

// ── Tarh (Ottoman base) calculation ───────────────────────────────
// Returns { quotient, remainder }
function computeTarh(targetNumber, n) {
  const kutb = KUTB_MAGIC[n] || Math.floor(n * (n * n + 1) / 2);
  const tarh = kutb - n;  // Tarh = Kutb - n
  const remaining = targetNumber - tarh;
  const quotient  = Math.floor(remaining / n);
  const remainder = remaining % n;
  return { quotient, remainder, tarh };
}

// ── Step 1: Build a standard magic square using 1..n² ────────────
// These algorithms only work correctly on consecutive integers.

function siameseStd(n) {
  // Odd-order Siamese (de la Loubère) — fills 1..n²
  const g = Array.from({ length: n }, () => Array(n).fill(0));
  let r = 0, c = Math.floor(n / 2);
  for (let k = 1; k <= n * n; k++) {
    g[r][c] = k;
    const nr = (r - 1 + n) % n;
    const nc = (c + 1) % n;
    if (g[nr][nc] !== 0) { r = (r + 1) % n; }
    else { r = nr; c = nc; }
  }
  return g;
}

function doublyEvenStd(n) {
  // Doubly-even (n%4===0) — diagonal complement method
  const g = Array.from({ length: n }, () => Array(n).fill(0));
  // Fill sequentially
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      g[i][j] = i * n + j + 1;
  // Flip diagonal positions of each 4×4 block
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const bi = i % 4, bj = j % 4;
      if (bi === bj || bi + bj === 3)
        g[i][j] = n * n + 1 - g[i][j];
    }
  }
  return g;
}

function singlyEvenStd(n) {
  // Singly-even (n%2===0, n%4!==0) — Strachey method
  const h = n / 2;

  // Build odd-order (h×h) base square with values 0..h²-1
  const base = Array.from({ length: h }, () => Array(h).fill(0));
  let r = 0, c = Math.floor(h / 2);
  for (let k = 0; k < h * h; k++) {
    base[r][c] = k;
    const nr = (r - 1 + h) % h;
    const nc = (c + 1) % h;
    if (base[nr][nc] !== 0 || (nr === 0 && nc === Math.floor(h / 2))) { r = (r + 1) % h; }
    else { r = nr; c = nc; }
  }

  // 4 quadrant offsets: A=0, C=h², B=2h², D=3h²
  const g = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < h; j++) {
      g[i][j]           = base[i][j] + 1;           // A
      g[i][j + h]       = base[i][j] + 2 * h * h + 1; // B
      g[i + h][j]       = base[i][j] + h * h + 1;   // C
      g[i + h][j + h]   = base[i][j] + 3 * h * h + 1; // D
    }
  }

  // Strachey column swaps (A↔C)
  const k = Math.floor((n - 2) / 4);
  const mid = Math.floor(h / 2);
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < k; j++) {
      if (i === mid && j === 0) continue; // skip mid-col-0
      [g[i][j], g[i + h][j]] = [g[i + h][j], g[i][j]];
    }
  }
  // Extra mid-row swap on right side
  [g[mid][k], g[mid + h][k]] = [g[mid + h][k], g[mid][k]];
  // Right-side B↔D swaps
  for (let i = 0; i < h; i++) {
    for (let j = n - k + 1; j < n; j++) {
      [g[i][j], g[i + h][j]] = [g[i + h][j], g[i][j]];
    }
  }
  return g;
}

// ── Build a verified magic square via affine mapping ─────────────
// Strategy:
//   1. Generate a standard magic square with values 1..n² (always valid).
//   2. Affine-shift each cell: v → (v - 1) + quotient.
//      This maps 1→quotient, 2→quotient+1, ..., n²→quotient+n²-1.
//      All row/col/diagonal sums remain equal: MC = n*quotient + n*(n²-1)/2.
//   3. Kesir remainder is shown in the breakdown panel only.
//      It cannot be distributed into the grid without breaking magic property
//      (remainder < n means it can't be split equally across n lines).
//      The Ottoman manuscript tradition records remainder as an annotation (كسر).
function buildMagicSquare(n, quotient) {
  let std;
  if (n % 2 === 1)      std = siameseStd(n);
  else if (n % 4 === 0) std = doublyEvenStd(n);
  else                  std = singlyEvenStd(n);
  return std.map(row => row.map(v => v - 1 + quotient));
}

// ── Traditional elemental transformations ─────────────────────────
// Fire  (النار)  — original Siamese arrangement, no change
// Water (الماء)  — horizontal mirror (flip left-right)
// Earth (التراب) — vertical mirror (flip top-bottom)
// Air   (الهواء) — 180° rotation (flip both axes)
function elementTransform(g, elementKey) {
  const n = g.length;
  const clone = () => g.map(row => [...row]);
  if (elementKey === "fire") {
    // Fire: canonical arrangement as-is
    return clone();
  }
  if (elementKey === "water") {
    // Water: mirror left-right (each row reversed)
    return clone().map(row => [...row].reverse());
  }
  if (elementKey === "earth") {
    // Earth: mirror top-bottom (rows reversed)
    return [...clone()].reverse();
  }
  if (elementKey === "air") {
    // Air: 180° rotation (rows reversed, each row also reversed)
    return [...clone()].reverse().map(row => [...row].reverse());
  }
  return clone();
}

// ── Master generator ──────────────────────────────────────────────
function generateTrueMagicSquare(n, quotient, elementKey) {
  const g = buildMagicSquare(n, quotient);
  return elementTransform(g, elementKey);
}

// ── Verification ──────────────────────────────────────────────────
function verifySquare(g) {
  const n = g.length;
  const mc = g[0].reduce((s, v) => s + v, 0);
  const rowOk = g.every(row => row.reduce((s, v) => s + v, 0) === mc);
  const colOk = Array.from({ length: n }, (_, j) =>
    g.reduce((s, row) => s + row[j], 0)).every(s => s === mc);
  const d1Ok  = g.reduce((s, row, i) => s + row[i], 0) === mc;
  const d2Ok  = g.reduce((s, row, i) => s + row[n - 1 - i], 0) === mc;
  return { mc, rowOk, colOk, d1Ok, d2Ok, valid: rowOk && colOk && d1Ok && d2Ok };
}

// ── Sub-components ───────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-1">
      <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${G.borderHi})` }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.text }} />
      <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${G.borderHi})` }} />
    </div>
  );
}

function SectionCard({ children }) {
  return (
    <div className="rounded-2xl border p-4 space-y-3"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        borderColor: "rgba(212,175,55,0.22)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.08)",
      }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
      {children}
    </p>
  );
}

// ── Size → Planet Mapping ─────────────────────────────────────────
const SIZE_PLANET_MAP = {
  3: "zuhal",
  4: "mustari",
  5: "merih",
  6: "sems",
  7: "zuhre",
  8: "utarid",
  9: "kamer",
};

const PLANET_EN = {
  zuhal:   "Saturn",
  mustari: "Jupiter",
  merih:   "Mars",
  sems:    "Sun",
  zuhre:   "Venus",
  utarid:  "Mercury",
  kamer:   "Moon",
};

function AutoPlanetCard({ gridSize }) {
  const planetKey = SIZE_PLANET_MAP[gridSize];
  const pl = PLANETS.find(p => p.key === planetKey);
  if (!pl) return null;

  return (
    <motion.div
      key={gridSize}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border p-4 flex items-center gap-4"
      style={{
        background: `rgba(4,8,24,0.99)`,
        borderColor: pl.border,
        boxShadow: `0 0 28px ${pl.glow}, 0 0 60px ${pl.glow}`,
      }}
    >
      <motion.span
        style={{ fontSize: "2.2rem", flexShrink: 0 }}
        animate={{ textShadow: [`0 0 12px ${pl.glow}`, `0 0 28px ${pl.color}`, `0 0 12px ${pl.glow}`] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {pl.icon}
      </motion.span>
      <div className="flex-1 min-w-0">
        <p className="font-inter text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(212,175,55,0.40)" }}>
          🪐 Associated Planet
        </p>
        <motion.p
          className="font-amiri text-2xl font-bold leading-tight"
          style={{ color: pl.color, textShadow: `0 0 18px ${pl.glow}` }}
          dir="rtl"
          animate={{ textShadow: [`0 0 10px ${pl.glow}`, `0 0 24px ${pl.color}88`, `0 0 10px ${pl.glow}`] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {pl.arabic}
        </motion.p>
        <p className="font-inter text-[10px] tracking-widest uppercase mt-0.5" style={{ color: `${pl.color}99` }}>
          {PLANET_EN[planetKey]}
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.30)" }}>Square</p>
        <p className="font-amiri text-lg font-bold" style={{ color: G.dim }}>{gridSize}×{gridSize}</p>
      </div>
    </motion.div>
  );
}

// ── Calculation Breakdown ─────────────────────────────────────────
function CalcBreakdown({ inputNumber, gridSize }) {
  if (!inputNumber || !gridSize || !KUTB_MAGIC[gridSize]) return null;
  const n = parseInt(inputNumber);
  const { quotient, remainder, tarh } = computeTarh(n, gridSize);
  const kutb = KUTB_MAGIC[gridSize];
  const remaining = n - tarh;
  const corrTable = KESIR_CORRECTION[gridSize] || {};
  const corrCell  = remainder > 0 ? corrTable[remainder] : null;
  const mc = magicConstant(gridSize, quotient);

  const rows = [
    { step: "①", label: "Entered Number",                formula: n.toLocaleString() },
    { step: "②", label: "Kutb",                          formula: `${kutb}` },
    { step: "③", label: "Tarh (Kutb − n)",               formula: `${kutb} − ${gridSize} = ${tarh}` },
    { step: "④", label: "Remaining After Tarh",          formula: `${n.toLocaleString()} − ${tarh} = ${remaining.toLocaleString()}` },
    { step: "⑤", label: "Division (Bölme)",              formula: `${remaining.toLocaleString()} ÷ ${gridSize} = ${quotient}${remainder !== 0 ? ` rem ${remainder}` : ""}` },
    { step: "⑥", label: "Quotient (İlk Hane)",          formula: quotient.toLocaleString(), highlight: true },
    ...(remainder > 0 ? [{
      step: "⑦",
      label: `Kesir (Remainder ${remainder}) → Correction Cell`,
      formula: corrCell ? `Cell #${corrCell} → +1 (skip one)` : `r=${remainder} (no correction)`,
      highlight: true,
    }] : []),
    { step: remainder > 0 ? "⑧" : "⑦", label: "Magic Constant (Kutb Sabit)", formula: mc.toLocaleString(), highlight: true },
  ];

  return (
    <motion.div
      key={`calc-${inputNumber}-${gridSize}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border p-5 space-y-3"
      style={{ background: "rgba(4,8,24,0.99)", borderColor: G.borderHi, boxShadow: `0 0 28px ${G.glow}` }}
    >
      <p className="font-inter text-[10px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
        📜 Calculation Breakdown — شرح الحساب
      </p>
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />

      <div className="space-y-2">
        {rows.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.28 }}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{
              background: row.highlight ? "rgba(212,175,55,0.10)" : "rgba(212,175,55,0.04)",
              border: `1px solid ${row.highlight ? "rgba(212,175,55,0.40)" : "rgba(212,175,55,0.12)"}`,
              boxShadow: row.highlight ? `0 0 14px rgba(212,175,55,0.15)` : "none",
            }}
          >
            <span className="font-inter text-base flex-shrink-0" style={{ color: "rgba(212,175,55,0.50)" }}>{row.step}</span>
            <div className="flex-1 min-w-0">
              <p className="font-inter text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(212,175,55,0.40)" }}>
                {row.label}
              </p>
              <p
                className="font-amiri font-bold tabular-nums leading-snug"
                style={{
                  color: row.highlight ? G.text : "rgba(212,175,55,0.80)",
                  fontSize: row.highlight ? "1.35rem" : "1rem",
                  textShadow: row.highlight ? `0 0 16px ${G.glowHi}` : "none",
                }}
              >
                {row.formula}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Sacred Grid Preview ──────────────────────────────────────────
function SacredGridPreview({ gridSize, element, grid, inputNumber }) {
  const gridData = grid?.grid || grid;
  const actualBase = grid?.base || null;
  const isGenerated = !!gridData;
  const elMeta = ELEMENTS.find(e => e.key === element);
  const cellSize = gridSize >= 9 ? 36 : gridSize >= 7 ? 40 : gridSize >= 6 ? 46 : gridSize === 3 ? 66 : 54;

  // Invalid — below minimum threshold
  if (grid?.invalid) {
    return (
      <div className="rounded-2xl border p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]"
        style={{ background: "rgba(4,8,24,0.99)", borderColor: "rgba(255,80,80,0.45)", boxShadow: "0 0 32px rgba(255,80,80,0.15)" }}>
        <motion.span className="text-3xl"
          animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          ⚠️
        </motion.span>
        <p className="font-inter text-[11px] uppercase tracking-widest text-center" style={{ color: "rgba(255,140,140,0.85)" }}>
          Entered number is below minimum sacred threshold
        </p>
        <p className="font-amiri text-sm text-center" style={{ color: "rgba(255,120,120,0.60)" }} dir="rtl">
          الرقم أقل من الحد الأدنى المقدس
        </p>
        <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
          Base must be ≥ 1 — try a larger number
        </p>
      </div>
    );
  }

  // Placeholder when nothing generated yet
  if (!isGenerated) {
    return (
      <div className="rounded-2xl border p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]"
        style={{ background: "rgba(4,8,24,0.99)", borderColor: G.borderHi, boxShadow: `0 0 40px ${G.glow}` }}>
        <motion.span className="font-amiri text-4xl" style={{ color: "rgba(212,175,55,0.25)" }}
          animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          🜂
        </motion.span>
        <p className="font-inter text-[10px] uppercase tracking-widest text-center" style={{ color: "rgba(212,175,55,0.25)" }}>
          {gridSize ? `${gridSize}×${gridSize} — Enter number & generate` : "Select grid size to begin"}
        </p>
        <p className="font-amiri text-sm" style={{ color: "rgba(212,175,55,0.20)" }} dir="rtl">المربع السحري</p>
      </div>
    );
  }

  const displayFlat = gridData.flat();
  const verification = verifySquare(gridData);

  return (
    <motion.div
      key={`${gridSize}-${element}-generated`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border p-6 space-y-4"
      style={{ background: "rgba(4,8,24,0.99)", borderColor: G.borderHi, boxShadow: `0 0 40px ${G.glow}` }}
    >
      {/* Header */}
      <div className="text-center mb-5 space-y-1">
        <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
          🜂 Sacred Vefk {gridSize}×{gridSize}
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {elMeta && <span style={{ fontSize: "0.9rem" }}>{elMeta.icon}</span>}
          {elMeta && (
            <span className="font-amiri text-sm" style={{ color: elMeta.color }}>
              {elMeta.arabic}
            </span>
          )}
          {elMeta && (
            <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.35)" }}>
              · {elMeta.label}
            </span>
          )}
          {actualBase != null && (
            <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.35)" }}>
              · Base {actualBase.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Grid cells — responsive scaling to prevent cropping on mobile */}
      <div className="flex justify-center w-full">
        <div style={{ overflowX: "visible", width: "100%" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: "3px",
            width: "100%",
          }}>
          {displayFlat.map((num, idx) => (
            <motion.div
              key={`${gridSize}-${element}-${idx}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.016, duration: 0.24, ease: "easeOut" }}
              className="rounded-lg border flex items-center justify-center font-amiri font-bold"
              style={{
                aspectRatio: "1 / 1",
                minWidth: 0,
                background: "linear-gradient(145deg, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.06) 100%)",
                borderColor: "rgba(212,175,55,0.40)",
                color: G.text,
                fontSize: gridSize >= 8 ? "11px" : gridSize >= 6 ? "13px" : "16px",
                boxShadow: "inset 0 1px 0 rgba(212,175,55,0.18), 0 0 8px rgba(212,175,55,0.08)",
              }}
            >
              {num}
            </motion.div>
          ))}
          </div>
        </div>
      </div>

      {/* Verification Panel */}
      <div className="rounded-xl border p-4 space-y-2"
        style={{ background: "rgba(212,175,55,0.04)", borderColor: verification.valid ? "rgba(100,220,100,0.35)" : "rgba(255,80,80,0.40)" }}>
        <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
          ⚖ Verification Report — Magic Constant: <span style={{ color: G.text }}>{verification.mc.toLocaleString()}</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Rows",         ok: verification.rowOk },
            { label: "Columns",      ok: verification.colOk },
            { label: "Diagonal ↘",   ok: verification.d1Ok },
            { label: "Diagonal ↙",   ok: verification.d2Ok },
          ].map(({ label, ok }) => (
            <div key={label} className="flex items-center gap-2 rounded-lg px-3 py-1.5"
              style={{ background: ok ? "rgba(100,220,100,0.08)" : "rgba(255,80,80,0.08)", border: `1px solid ${ok ? "rgba(100,220,100,0.25)" : "rgba(255,80,80,0.25)"}` }}>
              <span style={{ fontSize: "11px" }}>{ok ? "✅" : "❌"}</span>
              <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: ok ? "rgba(120,230,120,0.90)" : "rgba(255,120,120,0.90)" }}>{label}</span>
            </div>
          ))}
        </div>
        {verification.valid && (
          <p className="font-inter text-[8px] uppercase tracking-widest text-center" style={{ color: "rgba(100,220,100,0.65)" }}>
            ✦ True Magic Square — All sums equal {verification.mc.toLocaleString()}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function MagicSqayerPage() {
  const [inputNumber, setInputNumber] = useState("");
  const [gridSize,    setGridSize]    = useState(null);
  const [element,     setElement]     = useState(null);
  const [grid,        setGrid]        = useState(null);

  const buildGrid = (num, size, el) => {
    if (!num || !size) return null;
    const n = parseInt(num);
    if (!n || n < 1) return null;
    const { quotient, remainder } = computeTarh(n, size);
    if (quotient < 1) return { invalid: true };
    const e = el || "fire";
    const gridData = generateTrueMagicSquare(size, quotient, e);
    return { grid: gridData, base: quotient, remainder };
  };

  const handleNumberChange = (e) => {
    const val = e.target.value.replace(/[^\d]/g, "");
    setInputNumber(val);
    setGrid(buildGrid(val, gridSize, element));
  };

  const handleGridSizeChange = (size) => {
    const newSize = gridSize === size ? null : size;
    setGridSize(newSize);
    setGrid(buildGrid(inputNumber, newSize, element));
  };

  const handleElementChange = (key) => {
    const newEl = element === key ? null : key;
    setElement(newEl);
    setGrid(buildGrid(inputNumber, gridSize, newEl));
  };

  return (
    <PageLayout>
      <div className="space-y-4">

        {/* Header */}
        <div className="text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-yellow-500/25 mb-4"
            style={{ background: "linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)", boxShadow: "0 0 28px rgba(212,175,55,0.18)" }}>
            <span className="font-amiri text-2xl" style={{ color: "#D4AF37" }}>✨</span>
          </motion.div>
          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white">السحر المربع</h1>
          <p className="font-inter text-xs mt-1 tracking-widest uppercase" style={{ color: G.dim }}>
            Sacred Vefk Construction System
          </p>
          <GoldDivider />
        </div>

        {/* 1. Number Input */}
        <SectionCard>
          <SectionLabel>🔢 Base Number — الرقم الأساسي</SectionLabel>
          <input
            type="text"
            value={inputNumber}
            onChange={handleNumberChange}
            placeholder="Enter any large number (100, 786, 12345...)"
            className="w-full rounded-xl px-4 py-3 font-amiri text-3xl text-center text-white font-bold focus:outline-none caret-white placeholder:text-white/30"
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}` }}
          />
          {inputNumber && (
            <p className="text-center font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              Target: {inputNumber}
            </p>
          )}
        </SectionCard>

        {/* 2. Grid Size */}
        <SectionCard>
          <SectionLabel>Grid Size — حجم المربع</SectionLabel>
          <div className="grid grid-cols-4 gap-2">
            {GRID_SIZES.map(g => {
              const sel = gridSize === g.value;
              return (
                <motion.button key={g.value} onClick={() => handleGridSizeChange(g.value)}
                  whileHover={{ scale: sel ? 1 : 1.04 }} whileTap={{ scale: 0.95 }}
                  className="rounded-xl py-3.5 font-inter font-bold text-xs border transition-all relative overflow-hidden"
                  style={{
                    background: sel
                      ? "linear-gradient(145deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.06) 100%)"
                      : "rgba(4,12,34,0.97)",
                    borderColor: sel ? G.borderHi : "rgba(255,255,255,0.08)",
                    color: sel ? G.text : "rgba(255,255,255,0.38)",
                    boxShadow: sel ? `0 0 18px ${G.glow}, inset 0 1px 0 rgba(212,175,55,0.15)` : "none",
                  }}>
                  {sel && <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent)` }} />}
                  {g.label}
                </motion.button>
              );
            })}
          </div>
        </SectionCard>

        {/* Auto Planet */}
        {gridSize && <AutoPlanetCard gridSize={gridSize} />}

        {/* 3. Element */}
        <SectionCard>
          <SectionLabel>Element — العنصر</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {ELEMENTS.map(el => {
              const sel = element === el.key;
              return (
                <motion.button key={el.key} onClick={() => handleElementChange(el.key)}
                  whileHover={{ scale: sel ? 1 : 1.02 }} whileTap={{ scale: 0.96 }}
                  className="rounded-xl px-3 py-3.5 flex items-center gap-2.5 border transition-all relative overflow-hidden"
                  style={{
                    background: sel
                      ? `linear-gradient(145deg, ${el.bg} 0%, rgba(4,12,34,0.90) 100%)`
                      : "rgba(4,12,34,0.97)",
                    borderColor: sel ? el.border : "rgba(255,255,255,0.08)",
                    boxShadow: sel ? `0 0 20px ${el.glow}, inset 0 1px 0 rgba(255,255,255,0.06)` : "none",
                  }}>
                  {sel && <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${el.color}55, transparent)` }} />}
                  <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{el.icon}</span>
                  <div className="flex flex-col items-start gap-0">
                    <span className="font-amiri text-base font-bold" dir="rtl"
                      style={{ color: sel ? el.color : "rgba(255,255,255,0.45)" }}>
                      {el.arabic}
                    </span>
                    <span className="font-inter text-[8px] uppercase tracking-widest"
                      style={{ color: sel ? `${el.color}88` : "rgba(255,255,255,0.20)" }}>
                      {el.label}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </SectionCard>

        {/* 5. Generate Button */}
        <motion.button
          disabled={!inputNumber || !gridSize}
          whileHover={{ scale: !inputNumber || !gridSize ? 1 : 1.02 }}
          whileTap={{ scale: !inputNumber || !gridSize ? 1 : 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-inter font-bold text-sm text-[#0d1b2a] disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
          style={{ background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)", boxShadow: `0 0 32px ${G.glowHi}, 0 2px 12px rgba(0,0,0,0.40)` }}
          onClick={() => setGrid(buildGrid(inputNumber, gridSize, element))}
        >
          <span className="font-amiri text-base">✨</span>
          Generate Magic Sqayer
        </motion.button>

        {/* 6. Calculation Breakdown — only after generating valid grid */}
        {grid && !grid.invalid && inputNumber && gridSize && <CalcBreakdown inputNumber={inputNumber} gridSize={gridSize} />}

        {/* 7. Sacred Grid Preview */}
        <SacredGridPreview
          gridSize={gridSize}
          element={element}
          grid={grid}
          inputNumber={inputNumber}
        />

      </div>
    </PageLayout>
  );
}