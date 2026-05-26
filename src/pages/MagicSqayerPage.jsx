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

// ── True Magic Square Engine ──────────────────────────────────────
// Kutb table: magic constant = n*(n²+1)/2 for 1..n²
// Our squares use base..base+n²-1, so magic constant = n*base + n*(n²-1)/2
const KUTB_MAGIC = { 3: 15, 4: 34, 5: 65, 6: 111, 7: 175, 8: 260, 9: 369 };

// Compute magic constant for shifted square (base + 0..n²-1)
function magicConstant(n, base) {
  return n * base + Math.floor(n * (n * n - 1) / 2);
}

// ── ODD ORDER: Siamese (de la Loubère) method ─────────────────────
// Generates canonical 1..n² square, then shifts by (base-1)
function siamese(n, base) {
  const g = Array.from({ length: n }, () => Array(n).fill(0));
  let r = 0, c = Math.floor(n / 2);
  for (let num = 1; num <= n * n; num++) {
    g[r][c] = num + (base - 1);
    const nr = (r - 1 + n) % n;
    const nc = (c + 1) % n;
    if (g[nr][nc] !== 0) { r = (r + 1) % n; }
    else { r = nr; c = nc; }
  }
  return g;
}

// ── DOUBLY-EVEN ORDER (n % 4 === 0): Complement/inversion method ──
// Fill sequentially, then complement cells whose (row%4, col%4) pattern matches
function doublyEven(n, base) {
  const g = Array.from({ length: n }, () => Array(n).fill(0));
  // Fill sequentially
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      g[i][j] = i * n + j + 1;
  // Complement: flip cells where position within 4x4 block is on either diagonal
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const bi = i % 4, bj = j % 4;
      if (bi === bj || bi + bj === 3)
        g[i][j] = n * n + 1 - g[i][j];
    }
  }
  // Shift to base
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      g[i][j] += (base - 1);
  return g;
}

// ── SINGLY-EVEN ORDER (n % 2 === 0, n % 4 !== 0): Strachey method ─
function singlyEven(n, base) {
  const h = n / 2;
  // Build four odd-order sub-squares using siamese on h
  // Quadrant offsets: A=0, B=2h², C=h², D=3h²
  function makeQuadrant(offset) {
    const q = siamese(h, 1);
    for (let i = 0; i < h; i++)
      for (let j = 0; j < h; j++)
        q[i][j] += offset;
    return q;
  }
  const A = makeQuadrant(0);
  const B = makeQuadrant(2 * h * h);
  const C = makeQuadrant(h * h);
  const D = makeQuadrant(3 * h * h);

  // Assemble into full grid: top-left=A, top-right=B, bottom-left=C, bottom-right=D
  const g = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < h; j++) {
      g[i][j]         = A[i][j];
      g[i][j + h]     = B[i][j];
      g[i + h][j]     = C[i][j];
      g[i + h][j + h] = D[i][j];
    }
  }

  // Strachey column swaps: swap left k columns (except middle row)
  const k = Math.floor((n - 2) / 4);
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < k; j++) {
      // swap g[i][j] with g[i+h][j]
      [g[i][j], g[i + h][j]] = [g[i + h][j], g[i][j]];
    }
  }
  // Middle row: swap from column k onward (skip j=0)
  const mid = Math.floor(h / 2);
  for (let j = 1; j < k + 1; j++) {
    [g[mid][j], g[mid + h][j]] = [g[mid + h][j], g[mid][j]];
  }
  // Right-side column swaps: swap last (k-1) columns
  for (let i = 0; i < h; i++) {
    for (let j = n - k + 1; j < n; j++) {
      [g[i][j], g[i + h][j]] = [g[i + h][j], g[i][j]];
    }
  }

  // Shift to base
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      g[i][j] += (base - 1);
  return g;
}

// ── Element rotation transforms ───────────────────────────────────
// fire=0°, earth=90°CW, air=180°, water=270°CW
function rotateGrid(g, times) {
  let r = g;
  for (let t = 0; t < times; t++) {
    const n = r.length;
    const nr = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        nr[j][n - 1 - i] = r[i][j];
    r = nr;
  }
  return r;
}
function elementRotations(g, elementKey) {
  const t = { fire: 0, earth: 1, air: 2, water: 3 };
  return rotateGrid(g, t[elementKey] || 0);
}

// ── Master generator ──────────────────────────────────────────────
function generateTrueMagicSquare(n, base, elementKey) {
  let g;
  if (n % 2 === 1)       g = siamese(n, base);
  else if (n % 4 === 0)  g = doublyEven(n, base);
  else                   g = singlyEven(n, base);
  return elementRotations(g, elementKey);
}

// ── Verification ──────────────────────────────────────────────────
function verifySquare(g) {
  const n = g.length;
  const mc = g[0].reduce((s, v) => s + v, 0); // use first row as reference
  const rowOk  = g.every(row => row.reduce((s, v) => s + v, 0) === mc);
  const colOk  = Array.from({ length: n }, (_, j) =>
    g.reduce((s, row) => s + row[j], 0)).every(s => s === mc);
  const d1Ok   = g.reduce((s, row, i) => s + row[i], 0) === mc;
  const d2Ok   = g.reduce((s, row, i) => s + row[n - 1 - i], 0) === mc;
  return { mc, rowOk, colOk, d1Ok, d2Ok, valid: rowOk && colOk && d1Ok && d2Ok };
}

// ── Ottoman base calculation ──────────────────────────────────────
function computeBase(targetNumber, n) {
  const kutb = KUTB_MAGIC[n] || Math.floor(n * (n * n + 1) / 2);
  const kutbReduced = kutb - n;
  const halfValueSizes = [3, 8, 9];
  const remaining = targetNumber - kutbReduced;
  const remainder = remaining % n;
  if (halfValueSizes.includes(n) && remainder !== 0) {
    return Math.floor((Math.floor(targetNumber / 2) - kutbReduced) / n);
  }
  return Math.floor(remaining / n);
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
      style={{ background: "rgba(10,24,56,0.95)", borderColor: G.borderHi, boxShadow: `0 0 28px ${G.glow}` }}>
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

// ── Kutb Config ──────────────────────────────────────────────────
const KUTB = KUTB_MAGIC;

// ── Calculation Breakdown ─────────────────────────────────────────
function CalcBreakdown({ inputNumber, gridSize }) {
  if (!inputNumber || !gridSize || !KUTB[gridSize]) return null;
  const n = parseInt(inputNumber);
  const kutb = KUTB[gridSize];
  const kutbReduced = kutb - gridSize;

  const halfValueSizes = [3, 8, 9];
  const remaining = n - kutbReduced;
  const remainder = remaining % gridSize;
  const useHalf = halfValueSizes.includes(gridSize) && remainder !== 0;

  const halfN         = Math.floor(n / 2);
  const halfRemaining = halfN - kutbReduced;
  const base = computeBase(n, gridSize);
  const mc   = magicConstant(gridSize, base);

  const rows = [
    { step: "①", label: "Entered Number",          formula: n.toLocaleString() },
    { step: "②", label: "Kutb Reduced",             formula: `${kutb} − ${gridSize} = ${kutbReduced}` },
    { step: "③", label: "Remaining After Kutb",     formula: `${n.toLocaleString()} − ${kutbReduced} = ${remaining.toLocaleString()}` },
    ...(useHalf ? [{
      step: "③½",
      label: "Half-Value Applied (remainder ≠ 0)",
      formula: `${n} ÷ 2 = ${halfN} → ${halfN} − ${kutbReduced} = ${halfRemaining}`,
    }] : []),
    {
      step: "④",
      label: "Division",
      formula: useHalf
        ? `${halfRemaining} ÷ ${gridSize} = ${Math.floor(halfRemaining / gridSize)} rem ${halfRemaining % gridSize}`
        : `${remaining.toLocaleString()} ÷ ${gridSize} = ${Math.floor(remaining / gridSize)}${remainder !== 0 ? ` rem ${remainder}` : ""}`,
    },
    { step: "⑤", label: "Final Base Number",        formula: base.toLocaleString(), highlight: true },
    { step: "⑥", label: "Magic Constant (Kutb)",    formula: mc.toLocaleString(),   highlight: true },
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
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.018, duration: 0.22 }}
              className="rounded-lg border flex items-center justify-center font-amiri font-bold"
              style={{
                aspectRatio: "1 / 1",
                minWidth: 0,
                background: "rgba(212,175,55,0.10)",
                borderColor: "rgba(212,175,55,0.45)",
                color: G.text,
                fontSize: gridSize >= 8 ? "11px" : gridSize >= 6 ? "13px" : "16px",
                boxShadow: "inset 0 0 10px rgba(212,175,55,0.15), 0 0 6px rgba(212,175,55,0.10)",
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
    const base = computeBase(n, size);
    if (base < 1) return { invalid: true };
    const e = el || "fire";
    const gridData = generateTrueMagicSquare(size, base, e);
    return { grid: gridData, base };
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
                <motion.button key={g.value} onClick={() => handleGridSizeChange(g.value)} whileTap={{ scale: 0.95 }}
                  className="rounded-xl py-3 font-inter font-bold text-xs border transition-all"
                  style={{
                    background: sel ? G.bg : "rgba(4,12,34,0.97)",
                    borderColor: sel ? G.borderHi : "rgba(255,255,255,0.08)",
                    color: sel ? G.text : "rgba(255,255,255,0.40)",
                    boxShadow: sel ? `0 0 14px ${G.glow}` : "none",
                  }}>
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
                <motion.button key={el.key} onClick={() => handleElementChange(el.key)} whileTap={{ scale: 0.95 }}
                  className="rounded-xl p-3 flex items-center gap-2 border transition-all"
                  style={{
                    background: sel ? el.bg : "rgba(4,12,34,0.97)",
                    borderColor: sel ? el.border : "rgba(255,255,255,0.08)",
                    boxShadow: sel ? `0 0 14px ${el.glow}` : "none",
                  }}>
                  <span style={{ fontSize: "1.2rem" }}>{el.icon}</span>
                  <span className="font-amiri text-base font-bold" dir="rtl"
                    style={{ color: sel ? el.color : "rgba(255,255,255,0.45)" }}>
                    {el.arabic}
                  </span>
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
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-inter font-semibold text-sm text-[#0d1b2a] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg,#fcd34d,#d97706)", boxShadow: `0 0 28px ${G.glowHi}` }}
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