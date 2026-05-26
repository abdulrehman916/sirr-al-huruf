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

// ── Sacred Patterns ──────────────────────────────────────────────
// Helper: rotate a flat NxN pattern 90° clockwise
function rot90(p, n) {
  const r = Array(n * n);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      r[j * n + (n - 1 - i)] = p[i * n + j];
  return r;
}
// Helper: rotate 180°
function rot180(p, n) { return rot90(rot90(p, n), n); }
// Helper: rotate 270°
function rot270(p, n) { return rot90(rot180(p, n), n); }

// 3×3 — four authentic elemental forms per user spec:
// EARTH: 4 9 2 / 3 5 7 / 8 1 6
// FIRE:  8 3 4 / 1 5 9 / 6 7 2
// AIR:   6 1 8 / 7 5 3 / 2 9 4
// WATER: 2 7 6 / 9 5 1 / 4 3 8
const PATTERNS_3x3 = {
  earth: [4, 9, 2,  3, 5, 7,  8, 1, 6],
  fire:  [8, 3, 4,  1, 5, 9,  6, 7, 2],
  air:   [6, 1, 8,  7, 5, 3,  2, 9, 4],
  water: [2, 7, 6,  9, 5, 1,  4, 3, 8],
};
// Keep alias for fallback reference
const PATTERN_3x3_BASE = PATTERNS_3x3.earth;

// 4×4 — Fire base per spec; Earth/Air/Water derived by 90° rotations
// FIRE:  8 11 14 1 / 13 2 7 12 / 3 16 9 6 / 10 5 4 15
const _4x4_fire  = [8, 11, 14, 1, 13, 2, 7, 12, 3, 16, 9, 6, 10, 5, 4, 15];
const _4x4_earth = rot90(_4x4_fire, 4);
const _4x4_air   = rot180(_4x4_fire, 4);
const _4x4_water = rot270(_4x4_fire, 4);
const PATTERN_4x4_BASE = _4x4_fire;
const ELEMENT_PATTERNS_4x4 = {
  fire:  _4x4_fire,
  earth: _4x4_earth,
  air:   _4x4_air,
  water: _4x4_water,
};

// 6×6 — Fire base per spec; Earth/Air/Water derived by 90° rotations
const _6x6_fire = [
  36,13, 7,30,24, 1,
  20,11,31, 2,29,18,
  15,27, 5,34, 8,22,
  25,35,17,19, 3,12,
   6,21,28,10,14,32,
   9, 4,23,16,33,26
];
const _6x6_earth = rot90(_6x6_fire, 6);
const _6x6_air   = rot180(_6x6_fire, 6);
const _6x6_water = rot270(_6x6_fire, 6);
const PATTERN_6x6_BASE = _6x6_fire;
const ELEMENT_PATTERNS_6x6 = {
  fire:  _6x6_fire,
  earth: _6x6_earth,
  air:   _6x6_air,
  water: _6x6_water,
};

// ── Authentic Ottoman 9×9 Dokuzlu Vefk Patterns (Kamer/Moon) ──────────────────────────────────────────────
// Fire (النار) - Base Pattern
const FIRE_9x9 = [
  50,58,66,74, 1,18,26,34,42,
  60,68,76, 3,11,19,36,44,52,
  70,78, 5,13,21,29,37,54,62,
  80, 7,15,23,31,39,47,55,72,
   9,17,25,33,41,49,57,65,73,
  10,27,35,43,51,59,67,75, 2,
  20,28,45,53,61,69,77, 4,12,
  30,38,46,63,71,79, 6,14,22,
  40,48,56,64, 8,16,24,32,81
];
// Earth (التراب) - 180° Rotation
const EARTH_9x9 = [
  81,32,24,16, 8,64,56,48,40,
  22,14, 6,79,71,63,46,38,30,
  12, 4,77,69,61,53,45,28,20,
   2,75,67,59,51,43,35,27,10,
  73,65,57,49,41,33,25,17, 9,
  72,55,47,39,31,23,15, 7,80,
  62,54,37,29,21,13, 5,78,70,
  52,44,36,19,11, 3,76,68,60,
  42,34,26,18, 1,74,66,58,50
];
// Air (الهواء) - Vertical Mirror
const AIR_9x9 = [
  40,48,56,64, 8,16,24,32,81,
  30,38,46,63,71,79, 6,14,22,
  20,28,45,53,61,69,77, 4,12,
  10,27,35,43,51,59,67,75, 2,
   9,17,25,33,41,49,57,65,73,
  80, 7,15,23,31,39,47,55,72,
  70,78, 5,13,21,29,37,54,62,
  60,68,76, 3,11,19,36,44,52,
  50,58,66,74, 1,18,26,34,42
];
// Water (الماء) - Horizontal Mirror
const WATER_9x9 = [
  42,34,26,18, 1,74,66,58,50,
  52,44,36,19,11, 3,76,68,60,
  62,54,37,29,21,13, 5,78,70,
  72,55,47,39,31,23,15, 7,80,
  73,65,57,49,41,33,25,17, 9,
   2,75,67,59,51,43,35,27,10,
  12, 4,77,69,61,53,45,28,20,
  22,14, 6,79,71,63,46,38,30,
  81,32,24,16, 8,64,56,48,40
];

const ELEMENT_PATTERNS_9x9 = {
  fire:  FIRE_9x9,
  earth: EARTH_9x9,
  air:   AIR_9x9,
  water: WATER_9x9,
};

// 8×8 — Fire base per spec; Earth/Air/Water derived by 90° rotations
const _8x8_fire = [
  16,51,54, 9, 8,59,62, 1,
  53,10,15,52,61, 2, 7,60,
  11,56,49,14, 3,64,57, 6,
  50,13,12,55,58, 5, 4,63,
  32,35,38,25,24,43,46,17,
  37,26,31,36,45,18,23,44,
  27,40,33,30,19,48,41,22,
  34,29,28,39,42,21,20,47
];
const _8x8_earth = rot90(_8x8_fire, 8);
const _8x8_air   = rot180(_8x8_fire, 8);
const _8x8_water = rot270(_8x8_fire, 8);
const PATTERN_8x8_BASE = _8x8_fire;
const ELEMENT_PATTERNS_8x8 = {
  fire:  _8x8_fire,
  earth: _8x8_earth,
  air:   _8x8_air,
  water: _8x8_water,
};

// 7×7 — Fire base per spec; Earth/Air/Water derived by 90° rotations
const _7x7_fire = [
   9,17,25,33,41,49, 1,
  26,34,42,43, 2,10,18,
  36,44, 3,11,19,27,35,
   4,12,20,28,29,37,45,
  21,22,30,38,46, 5,13,
  31,39,47, 6,14,15,23,
  48, 7, 8,16,24,32,40
];
const _7x7_earth = rot90(_7x7_fire, 7);
const _7x7_air   = rot180(_7x7_fire, 7);
const _7x7_water = rot270(_7x7_fire, 7);
const PATTERN_7x7_BASE = _7x7_fire;
const ELEMENT_PATTERNS_7x7 = {
  fire:  _7x7_fire,
  earth: _7x7_earth,
  air:   _7x7_air,
  water: _7x7_water,
};

// 5×5 — Fire base per spec; Earth/Air/Water derived by 90° rotations
const _5x5_fire = [
   7,13,19,25, 1,
  20,21, 2, 8,14,
   3, 9,15,16,22,
  11,17,23, 4,10,
  24, 5, 6,12,18
];
const _5x5_earth = rot90(_5x5_fire, 5);
const _5x5_air   = rot180(_5x5_fire, 5);
const _5x5_water = rot270(_5x5_fire, 5);
const PATTERN_5x5_BASE = _5x5_fire;
const ELEMENT_PATTERNS_5x5 = {
  fire:  _5x5_fire,
  earth: _5x5_earth,
  air:   _5x5_air,
  water: _5x5_water,
};

function getSacredPattern(size, elementKey) {
  if (size === 3) return PATTERNS_3x3[elementKey] || PATTERNS_3x3.earth;
  if (size === 4) return ELEMENT_PATTERNS_4x4[elementKey] || ELEMENT_PATTERNS_4x4.fire;
  if (size === 5) return ELEMENT_PATTERNS_5x5[elementKey] || ELEMENT_PATTERNS_5x5.fire;
  if (size === 6) return ELEMENT_PATTERNS_6x6[elementKey] || ELEMENT_PATTERNS_6x6.fire;
  if (size === 7) return ELEMENT_PATTERNS_7x7[elementKey] || ELEMENT_PATTERNS_7x7.fire;
  if (size === 8) return ELEMENT_PATTERNS_8x8[elementKey] || ELEMENT_PATTERNS_8x8.fire;
  if (size === 9) return ELEMENT_PATTERNS_9x9[elementKey] || ELEMENT_PATTERNS_9x9.fire;
  return null;
}

// ── Vefk Generation ──────────────────────────────────────────────
// Shared helper: build values array and apply sacred pattern mapping
function applyPattern(base, count, pattern) {
  const values = Array.from({ length: count }, (_, i) => base + i);
  return pattern.map(rank => values[rank - 1]);
}

// Shared helper: find position index in a pattern (1-based pos → flat index)
function posToIdx(pattern, sacredPos) {
  return pattern.indexOf(sacredPos);
}

// 3×3 — Kutb 15, subtract 3 → (target − 12) ÷ 3
// Fraction rule: remainder 1 or 2 → use half-value system
function generateVefk3x3(targetNumber, elementKey) {
  const n = parseInt(targetNumber);
  const kutbReduced = 15 - 3; // 12
  const remainder = (n - kutbReduced) % 3;
  let base;
  if (remainder !== 0) {
    // Half-value system
    base = Math.floor((n / 2 - kutbReduced) / 3);
  } else {
    base = Math.floor((n - kutbReduced) / 3);
  }
  const pattern = PATTERNS_3x3[elementKey] || PATTERN_3x3_BASE;
  const flat = applyPattern(base, 9, pattern);
  return [flat.slice(0, 3), flat.slice(3, 6), flat.slice(6, 9)];
}

// 4×4 — Kutb 34, subtract 4 → (target − 30) ÷ 4
// Fraction rules: rem 1→pos13(idx12), rem2→pos9(idx8), rem3→pos5(idx4)
function generateVefk4x4(targetNumber, elementKey) {
  const n = parseInt(targetNumber);
  const kutbReduced = 34 - 4; // 30
  const remainder = (n - kutbReduced) % 4;
  const base = Math.floor((n - kutbReduced - remainder) / 4);
  const pattern = ELEMENT_PATTERNS_4x4[elementKey] || PATTERN_4x4_BASE;
  const values = Array.from({ length: 16 }, (_, i) => base + i);
  // Remainder: add +1 to the cell at the given sacred position
  if (remainder === 3) values[posToIdx(pattern, 5)]  += 1;
  else if (remainder === 2) values[posToIdx(pattern, 9)]  += 1;
  else if (remainder === 1) values[posToIdx(pattern, 13)] += 1;
  const flat = pattern.map(rank => values[rank - 1]);
  return [flat.slice(0, 4), flat.slice(4, 8), flat.slice(8, 12), flat.slice(12, 16)];
}

// 6×6 — Kutb 111, subtract 6 → (target − 105) ÷ 6
// Fraction rules: rem 1→pos31, rem2→pos25, rem3→pos19, rem4→pos13, rem5→pos7
function generateVefk6x6(targetNumber, elementKey) {
  const n = parseInt(targetNumber);
  const kutbReduced = 111 - 6; // 105
  const remainder = (n - kutbReduced) % 6;
  const base = Math.floor((n - kutbReduced - remainder) / 6);
  const pattern = ELEMENT_PATTERNS_6x6[elementKey] || PATTERN_6x6_BASE;
  const values = Array.from({ length: 36 }, (_, i) => base + i);
  if (remainder === 5) values[posToIdx(pattern, 7)]  += 1;
  else if (remainder === 4) values[posToIdx(pattern, 13)] += 1;
  else if (remainder === 3) values[posToIdx(pattern, 19)] += 1;
  else if (remainder === 2) values[posToIdx(pattern, 25)] += 1;
  else if (remainder === 1) values[posToIdx(pattern, 31)] += 1;
  const flat = pattern.map(rank => values[rank - 1]);
  return [flat.slice(0,6), flat.slice(6,12), flat.slice(12,18), flat.slice(18,24), flat.slice(24,30), flat.slice(30,36)];
}

// ── Authentic Ottoman 9×9 Dokuzlu Vefk Generation (Kamer/Moon System) ──────────────────────────────────────────────
function generateVefk9x9(targetNumber, elementKey) {
  const n = parseInt(targetNumber);
  const kutbReduced = 369 - 9; // 360
  const remainder = (n - kutbReduced) % 9;
  
  // Dokuzlu Vefk does NOT accept fractions — remainder 1-8: use half-value system
  let base;
  if (remainder !== 0) {
    // Half-value system: base = floor((n/2 - kutbReduced) / 9)
    base = Math.floor((n / 2 - kutbReduced) / 9);
  } else {
    // Direct system: base = (n - kutbReduced) / 9
    base = Math.floor((n - kutbReduced) / 9);
  }
  
  // Get authentic elemental sacred pattern
  const pattern = ELEMENT_PATTERNS_9x9[elementKey] || FIRE_9x9;
  
  // SACRED POSITION MAPPING (Authentic Ottoman Method):
  // Each cell contains a sacred number (1-81) that determines which value to place
  // Formula: displayValue = base + (sacredNumber - 1)
  // Example: sacred number 50 → base + 49
  // Example: sacred number 1 → base + 0
  const flat = pattern.map(sacredNumber => base + (sacredNumber - 1));
  
  return {
    grid: [
      flat.slice(0, 9),
      flat.slice(9, 18),
      flat.slice(18, 27),
      flat.slice(27, 36),
      flat.slice(36, 45),
      flat.slice(45, 54),
      flat.slice(54, 63),
      flat.slice(63, 72),
      flat.slice(72, 81)
    ],
    base: base
  };
}

// 8×8 — Kutb 260, subtract 8 → (target − 252) ÷ 8
// Does NOT accept fractions — remainder 1-7: use half-value system
function generateVefk8x8(targetNumber, elementKey) {
  const n = parseInt(targetNumber);
  const kutbReduced = 260 - 8; // 252
  const remainder = (n - kutbReduced) % 8;
  let base;
  if (remainder !== 0) {
    // Half-value system
    base = Math.floor((n / 2 - kutbReduced) / 8);
  } else {
    base = Math.floor((n - kutbReduced) / 8);
  }
  const pattern = ELEMENT_PATTERNS_8x8[elementKey] || PATTERN_8x8_BASE;
  const flat = applyPattern(base, 64, pattern);
  return [flat.slice(0,8), flat.slice(8,16), flat.slice(16,24), flat.slice(24,32), flat.slice(32,40), flat.slice(40,48), flat.slice(48,56), flat.slice(56,64)];
}

// 7×7 — Kutb 175, subtract 7 → (target − 168) ÷ 7
// Fraction rules: rem 1→pos43, rem2→pos36, rem3→pos29, rem4→pos22, rem5→pos15, rem6→pos8
function generateVefk7x7(targetNumber, elementKey) {
  const n = parseInt(targetNumber);
  const kutbReduced = 175 - 7; // 168
  const remainder = (n - kutbReduced) % 7;
  const base = Math.floor((n - kutbReduced - remainder) / 7);
  const pattern = ELEMENT_PATTERNS_7x7[elementKey] || PATTERN_7x7_BASE;
  const values = Array.from({ length: 49 }, (_, i) => base + i);
  if (remainder === 6) values[posToIdx(pattern, 8)]  += 1;
  else if (remainder === 5) values[posToIdx(pattern, 15)] += 1;
  else if (remainder === 4) values[posToIdx(pattern, 22)] += 1;
  else if (remainder === 3) values[posToIdx(pattern, 29)] += 1;
  else if (remainder === 2) values[posToIdx(pattern, 36)] += 1;
  else if (remainder === 1) values[posToIdx(pattern, 43)] += 1;
  const flat = pattern.map(rank => values[rank - 1]);
  return [flat.slice(0,7), flat.slice(7,14), flat.slice(14,21), flat.slice(21,28), flat.slice(28,35), flat.slice(35,42), flat.slice(42,49)];
}

// 5×5 — Kutb 65, subtract 5 → (target − 60) ÷ 5
// Fraction rules: rem 1→pos21, rem2→pos16, rem3→pos11, rem4→pos6
function generateVefk5x5(targetNumber, elementKey) {
  const n = parseInt(targetNumber);
  const kutbReduced = 65 - 5; // 60
  const remainder = (n - kutbReduced) % 5;
  const base = Math.floor((n - kutbReduced - remainder) / 5);
  const pattern = ELEMENT_PATTERNS_5x5[elementKey] || PATTERN_5x5_BASE;
  const values = Array.from({ length: 25 }, (_, i) => base + i);
  if (remainder === 4) values[posToIdx(pattern, 6)]  += 1;
  else if (remainder === 3) values[posToIdx(pattern, 11)] += 1;
  else if (remainder === 2) values[posToIdx(pattern, 16)] += 1;
  else if (remainder === 1) values[posToIdx(pattern, 21)] += 1;
  const flat = pattern.map(rank => values[rank - 1]);
  return [flat.slice(0,5), flat.slice(5,10), flat.slice(10,15), flat.slice(15,20), flat.slice(20,25)];
}

function generateMagicSquare(size, baseNum) {
  const grid = Array(size).fill(0).map(() => Array(size).fill(0));
  let num = baseNum;
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++) { grid[i][j] = num; num++; }
  return grid;
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
const KUTB = { 3: 15, 4: 34, 5: 65, 6: 111, 7: 175, 8: 260, 9: 369 };

// ── Calculation Breakdown ─────────────────────────────────────────
function CalcBreakdown({ inputNumber, gridSize }) {
  if (!inputNumber || !gridSize || !KUTB[gridSize]) return null;
  const n = parseInt(inputNumber);
  const kutb = KUTB[gridSize];
  const kutbReduced = kutb - gridSize; // authentic Ottoman: kutb − size

  // 3×3 and 8×8 and 9×9: use half-value system when remainder ≠ 0
  // Others: use remainder adjustment to specific sacred positions
  const halfValueSizes = [3, 8, 9];
  const remainder = (n - kutbReduced) % gridSize;
  let base, division, remaining, usedN;

  if (halfValueSizes.includes(gridSize) && remainder !== 0) {
    // Half-value system
    usedN = n / 2;
    remaining = usedN - kutbReduced;
    division = remaining / gridSize;
    base = Math.floor(division);
  } else {
    usedN = n;
    remaining = n - kutbReduced - remainder;
    division = (n - kutbReduced) / gridSize;
    base = Math.floor((n - kutbReduced - remainder) / gridSize);
  }

  const rows = [
    {
      step: "①",
      label: "Entered Number",
      formula: n.toLocaleString(),
    },
    {
      step: "②",
      label: "Kutb Reduced",
      formula: `${kutb} − ${gridSize} = ${kutbReduced}`,
    },
    {
      step: "③",
      label: halfValueSizes.includes(gridSize) && remainder !== 0 ? "Remaining (Half-Value)" : "Remaining After Kutb",
      formula: halfValueSizes.includes(gridSize) && remainder !== 0
        ? `${n} ÷ 2 = ${usedN} → ${usedN} − ${kutbReduced} = ${remaining.toFixed(2)}`
        : `${n.toLocaleString()} − ${kutbReduced} = ${(n - kutbReduced).toLocaleString()}`,
    },
    {
      step: "④",
      label: "Division",
      formula: `${typeof remaining === 'number' && !Number.isInteger(remaining) ? remaining.toFixed(2) : remaining.toLocaleString()} ÷ ${gridSize} = ${(remaining / gridSize).toFixed(2)}`,
    },
    {
      step: "⑤",
      label: "Final Base Number",
      formula: base.toLocaleString(),
      highlight: true,
    },
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

  return (
    <motion.div
      key={`${gridSize}-${element}-generated`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border p-6"
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

      {/* Grid cells */}
      <div className="flex justify-center overflow-x-auto">
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gap: "4px",
        }}>
          {displayFlat.map((num, idx) => (
            <motion.div
              key={`${gridSize}-${element}-${idx}`}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.018, duration: 0.22 }}
              className="rounded-lg border flex items-center justify-center font-amiri font-bold"
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
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
    const e = el || "fire";
    if (size === 3) return { grid: generateVefk3x3(num, e), base: null };
    if (size === 4) return { grid: generateVefk4x4(num, e), base: null };
    if (size === 5) return { grid: generateVefk5x5(num, e), base: null };
    if (size === 6) return { grid: generateVefk6x6(num, e), base: null };
    if (size === 7) return { grid: generateVefk7x7(num, e), base: null };
    if (size === 8) return { grid: generateVefk8x8(num, e), base: null };
    if (size === 9) return generateVefk9x9(num, e);
    return { grid: generateMagicSquare(size, parseInt(num)), base: null };
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

        {/* 6. Calculation Breakdown — only after generating */}
        {grid && inputNumber && gridSize && <CalcBreakdown inputNumber={inputNumber} gridSize={gridSize} />}

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