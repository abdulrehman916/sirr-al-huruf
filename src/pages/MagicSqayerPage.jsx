import { useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";

// ─────────────────────────────────────────────────────────────────
//  THEME
// ─────────────────────────────────────────────────────────────────
const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  bg:       "rgba(212,175,55,0.07)",
  border:   "rgba(212,175,55,0.40)",
};

// ─────────────────────────────────────────────────────────────────
//  MULTILINGUAL LABELS (Arabic / Malayalam)
// ─────────────────────────────────────────────────────────────────
const LABELS = {
  ar: {
    baseNumber:       "🔢 الرقم الأساسي — Base Number",
    gridSize:         "حجم المربع — Grid Size",
    element:          "العنصر — Element",
    generate:         "توليد المربع السحري",
    suffix:           "نظام اللاحقة — Suffix System",
    suffixNone:       "بدون لاحقة",
    suffixArabic:     "لاحقة عربية (−٤١)",
    suffixHebrew:     "لاحقة عبرية (−٣١)",
    inputLabel:       "الرقم المُدخل",
    workingMC:        "المعامل العملي (MC)",
    usurper:          "المغتصب (أصغر خانة)",
    guide:            "الدليل (أكبر خانة)",
    mystery:          "الغموض",
    adjuster:         "المُعدِّل (الثابت السحري)",
    leader:           "القائد",
    regulator:        "المنظِّم",
    genGov:           "الحاكم العام",
    highOver:         "المراقب الأعلى",
    angelAr:          "قيمة الملاك (عربي)",
    angelHeb:         "قيمة الملاك (عبري)",
    jinnAr:           "قيمة الجن (عربي)",
    jinnHeb:          "قيمة الجن (عبري)",
    hierarchy:        "📜 جدول التسلسل الهرمي",
    compatible:       "أحجام متوافقة",
    incompatible:     "⚠️ الرقم غير متوافق مع هذا الحجم",
    compatibleSizes:  "الأحجام المتوافقة",
    planet:           "🪐 الكوكب المرتبط",
    negFix:           "تم إضافة ٣٦٠ لتصحيح القيمة السالبة",
    subtracted:       "تم طرح اللاحقة",
  },
  ml: {
    baseNumber:       "🔢 അടിസ്ഥാന സംഖ്യ",
    gridSize:         "ഗ്രിഡ് വലുപ്പം",
    element:          "തത്ത്വം (ഭൂതം)",
    generate:         "മാജിക്ക് സ്ക്വയർ ഉണ്ടാക്കുക",
    suffix:           "പ്രത്യയ സംവിധാനം",
    suffixNone:       "പ്രത്യയം ഇല്ല",
    suffixArabic:     "അറബി പ്രത്യയം (−41)",
    suffixHebrew:     "ഹീബ്രു പ്രത്യയം (−31)",
    inputLabel:       "നൽകിയ സംഖ്യ",
    workingMC:        "മാജിക്ക് കോൺസ്ടന്റ് (MC)",
    usurper:          "ഉർജർ (ഏറ്റവും ചെറിയ സെൽ)",
    guide:            "ഗൈഡ് (ഏറ്റവും വലിയ സെൽ)",
    mystery:          "മിസ്ററി",
    adjuster:         "അഡ്ജസ്ടർ (മാജിക്ക് കോൺസ്ടന്റ്)",
    leader:           "ലീഡർ",
    regulator:        "റെഗുലേറ്റർ",
    genGov:           "ജനറൽ ഗവർണർ",
    highOver:         "ഹൈ ഓവർസിയർ",
    angelAr:          "മലക്ക് മൂല്യം (അറബി)",
    angelHeb:         "മലക്ക് മൂല്യം (ഹീബ്രു)",
    jinnAr:           "ജിന്ന് മൂല്യം (അറബി)",
    jinnHeb:          "ജിന്ന് മൂല്യം (ഹീബ്രു)",
    hierarchy:        "📜 ശ്രേണി പട്ടിക",
    compatible:       "അനുയോജ്യ വലുപ്പങ്ങൾ",
    incompatible:     "⚠️ ഈ വലുപ്പത്തിന് ഈ സംഖ്യ അനുയോജ്യമല്ല",
    compatibleSizes:  "അനുയോജ്യ ഗ്രിഡ് വലുപ്പങ്ങൾ",
    planet:           "🪐 ഗ്രഹ ബന്ധം",
    negFix:           "ഋണ മൂല്യം ശരിയാക്കാൻ 360 കൂട്ടി",
    subtracted:       "പ്രത്യയം കുറച്ചു",
  },
};

// ─────────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────────
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
  { key: "earth", arabic: "التراب", malayalam: "ഭൂമി", icon: "🌍", color: "#A5C880", glow: "rgba(165,200,128,0.35)", bg: "rgba(165,200,128,0.10)", border: "rgba(165,200,128,0.50)" },
  { key: "fire",  arabic: "النار",  malayalam: "അഗ്നി", icon: "🔥", color: "#FF6B35", glow: "rgba(255,107,53,0.35)", bg: "rgba(255,107,53,0.10)", border: "rgba(255,107,53,0.50)" },
  { key: "air",   arabic: "الهواء", malayalam: "വായു",  icon: "🌬", color: "#B2EBF2", glow: "rgba(178,235,242,0.35)", bg: "rgba(178,235,242,0.10)", border: "rgba(178,235,242,0.50)" },
  { key: "water", arabic: "الماء",  malayalam: "ജലം",   icon: "💧", color: "#4FC3F7", glow: "rgba(79,195,247,0.35)", bg: "rgba(79,195,247,0.10)", border: "rgba(79,195,247,0.50)" },
];

const PLANETS = [
  { key: "zuhal",   arabic: "الزحل",   malayalam: "ശനി",    icon: "🪐", color: "#9B7FD4", glow: "rgba(155,127,212,0.35)", bg: "rgba(155,127,212,0.10)", border: "rgba(155,127,212,0.50)" },
  { key: "mustari", arabic: "المشتري", malayalam: "വ്യാഴം", icon: "✨", color: "#74C0FC", glow: "rgba(116,192,252,0.35)", bg: "rgba(116,192,252,0.10)", border: "rgba(116,192,252,0.50)" },
  { key: "merih",   arabic: "المريخ",  malayalam: "ചൊവ്വ",  icon: "🔥", color: "#FF4444", glow: "rgba(255,68,68,0.35)",   bg: "rgba(255,68,68,0.10)",   border: "rgba(255,68,68,0.50)" },
  { key: "sems",    arabic: "الشمس",   malayalam: "സൂര്യൻ", icon: "☀️", color: "#FBBF24", glow: "rgba(251,191,36,0.35)",  bg: "rgba(251,191,36,0.10)",  border: "rgba(251,191,36,0.50)" },
  { key: "zuhre",   arabic: "الزهرة",  malayalam: "ശുക്രൻ", icon: "💖", color: "#F9A8D4", glow: "rgba(249,168,212,0.35)", bg: "rgba(249,168,212,0.10)", border: "rgba(249,168,212,0.50)" },
  { key: "utarid",  arabic: "العطارد", malayalam: "ബുധൻ",   icon: "🧠", color: "#34D399", glow: "rgba(52,211,153,0.35)",  bg: "rgba(52,211,153,0.10)",  border: "rgba(52,211,153,0.50)" },
  { key: "kamer",   arabic: "القمر",   malayalam: "ചന്ദ്രൻ",icon: "🌙", color: "#818CF8", glow: "rgba(129,140,248,0.35)", bg: "rgba(129,140,248,0.10)", border: "rgba(129,140,248,0.50)" },
];

const SIZE_PLANET_MAP = { 3:"zuhal", 4:"mustari", 5:"merih", 6:"sems", 7:"zuhre", 8:"utarid", 9:"kamer" };
const PLANET_EN = { zuhal:"Saturn", mustari:"Jupiter", merih:"Mars", sems:"Sun", zuhre:"Venus", utarid:"Mercury", kamer:"Moon" };

// n(n²-1)/2 — the triangular constant for each square size
const TRIANGLE = { 3:12, 4:30, 5:60, 6:105, 7:168, 8:252, 9:360 };

// Suffix values per book
const SUFFIX = { none: 0, arabic: 41, hebrew: 31 };
const JINN_SUFFIX = { none: 0, arabic: 41, hebrew: 31 };

// ─────────────────────────────────────────────────────────────────
//  BOOK ENGINE — direct formula
// ─────────────────────────────────────────────────────────────────

/**
 * Check if MC is compatible with grid size n.
 * Compatible means (MC - TRIANGLE[n]) is divisible by n AND result >= 1.
 */
function isCompatible(mc, n) {
  const tri = TRIANGLE[n];
  if (!tri) return false;
  const diff = mc - tri;
  return diff > 0 && diff % n === 0;
}

/**
 * Find all compatible grid sizes for a given MC.
 */
function compatibleSizes(mc) {
  return [3,4,5,6,7,8,9].filter(n => isCompatible(mc, n));
}

/**
 * Compute the Usurper (starting value A) from MC and grid size n.
 * Returns null if incompatible.
 */
function computeUsurper(mc, n) {
  if (!isCompatible(mc, n)) return null;
  return (mc - TRIANGLE[n]) / n;
}

/**
 * Compute working MC from raw input, applying suffix and negative fix.
 * Returns { mc, subtracted, negFixed }
 */
function applysuffix(raw, suffixMode) {
  let mc = raw;
  const s = SUFFIX[suffixMode] || 0;
  let subtracted = false;
  let negFixed = false;
  if (s > 0) {
    mc = mc - s;
    subtracted = true;
    if (mc <= 0) {
      mc += 360;
      negFixed = true;
    }
  }
  return { mc, subtracted, negFixed };
}

/**
 * Build the 8-row hierarchy table.
 */
function buildHierarchy(mc, n) {
  const A = computeUsurper(mc, n);
  if (A === null) return null;
  const usurper  = A;
  const guide    = A + n * n - 1;
  const mystery  = usurper + guide;
  const adjuster = mc;
  const leader   = adjuster * n;
  const regulator= adjuster * (n + 1);
  const genGov   = adjuster * 2 * (n + 1);
  // High Overseer: from book pattern — Leader × Regulator / n
  const highOver = Math.round(leader * regulator / n);
  return { usurper, guide, mystery, adjuster, leader, regulator, genGov, highOver };
}

/**
 * Angel/Jinn column values for each hierarchy row value v.
 */
function angelJinnCols(v) {
  return {
    angelAr:  v - 41,
    angelHeb: v - 31,
    jinnAr:   v + 41,
    jinnHeb:  v + 31,
  };
}

// ─────────────────────────────────────────────────────────────────
//  CONSTRUCTION ALGORITHMS (unchanged — correct per book)
// ─────────────────────────────────────────────────────────────────
function siameseStd(n) {
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
  const g = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      g[i][j] = i * n + j + 1;
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
  const h = n / 2;
  const base = Array.from({ length: h }, () => Array(h).fill(0));
  let r = 0, c = Math.floor(h / 2);
  for (let k = 0; k < h * h; k++) {
    base[r][c] = k;
    const nr = (r - 1 + h) % h;
    const nc = (c + 1) % h;
    if (base[nr][nc] !== 0 || (nr === 0 && nc === Math.floor(h / 2))) { r = (r + 1) % h; }
    else { r = nr; c = nc; }
  }
  const g = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < h; j++) {
      g[i][j]         = base[i][j] + 1;
      g[i][j + h]     = base[i][j] + 2 * h * h + 1;
      g[i + h][j]     = base[i][j] + h * h + 1;
      g[i + h][j + h] = base[i][j] + 3 * h * h + 1;
    }
  }
  const k = Math.floor((n - 2) / 4);
  const mid = Math.floor(h / 2);
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < k; j++) {
      if (i === mid && j === 0) continue;
      [g[i][j], g[i + h][j]] = [g[i + h][j], g[i][j]];
    }
  }
  [g[mid][k], g[mid + h][k]] = [g[mid + h][k], g[mid][k]];
  for (let i = 0; i < h; i++) {
    for (let j = n - k + 1; j < n; j++) {
      [g[i][j], g[i + h][j]] = [g[i + h][j], g[i][j]];
    }
  }
  return g;
}

function buildBaseSquare(n) {
  if (n % 2 === 1)      return siameseStd(n);
  if (n % 4 === 0)      return doublyEvenStd(n);
  return singlyEvenStd(n);
}

function buildMagicSquare(n, usurper) {
  const std = buildBaseSquare(n);
  return std.map(row => row.map(v => v - 1 + usurper));
}

// ─────────────────────────────────────────────────────────────────
//  ELEMENTAL TRANSFORMS — CORRECTED PER BOOK
//  Fire=original, Air=LR mirror, Earth=TB mirror, Water=180°
// ─────────────────────────────────────────────────────────────────
function elementTransform(g, elementKey) {
  const clone = () => g.map(row => [...row]);
  if (elementKey === "fire")  return clone();
  if (elementKey === "air")   return clone().map(row => [...row].reverse());           // LR mirror
  if (elementKey === "earth") return [...clone()].reverse();                           // TB mirror
  if (elementKey === "water") return [...clone()].reverse().map(row => [...row].reverse()); // 180°
  return clone();
}

function generateMagicSquare(n, usurper, elementKey) {
  const g = buildMagicSquare(n, usurper);
  return elementTransform(g, elementKey);
}

// ─────────────────────────────────────────────────────────────────
//  VERIFICATION
// ─────────────────────────────────────────────────────────────────
function verifySquare(g) {
  const n = g.length;
  const mc = g[0].reduce((s, v) => s + v, 0);
  const rowOk = g.every(row => row.reduce((s, v) => s + v, 0) === mc);
  const colOk = Array.from({ length: n }, (_, j) =>
    g.reduce((s, row) => s + row[j], 0)).every(s => s === mc);
  const d1Ok = g.reduce((s, row, i) => s + row[i], 0) === mc;
  const d2Ok = g.reduce((s, row, i) => s + row[n - 1 - i], 0) === mc;
  return { mc, rowOk, colOk, d1Ok, d2Ok, valid: rowOk && colOk && d1Ok && d2Ok };
}

// ─────────────────────────────────────────────────────────────────
//  SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────
function SectionCard({ children }) {
  return (
    <div className="rounded-2xl border p-4 space-y-3" style={{
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

function AutoPlanetCard({ gridSize, lang }) {
  const L = LABELS[lang];
  const planetKey = SIZE_PLANET_MAP[gridSize];
  const pl = PLANETS.find(p => p.key === planetKey);
  if (!pl) return null;
  return (
    <motion.div key={gridSize} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className="rounded-2xl border p-4 flex items-center gap-4"
      style={{ background: "rgba(4,8,24,0.99)", borderColor: pl.border, boxShadow: `0 0 28px ${pl.glow}` }}>
      <motion.span style={{ fontSize: "2.2rem", flexShrink: 0 }}
        animate={{ textShadow: [`0 0 12px ${pl.glow}`, `0 0 28px ${pl.color}`, `0 0 12px ${pl.glow}`] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
        {pl.icon}
      </motion.span>
      <div className="flex-1 min-w-0">
        <p className="font-inter text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(212,175,55,0.40)" }}>
          {L.planet}
        </p>
        <motion.p className="font-amiri text-2xl font-bold leading-tight" dir="rtl"
          style={{ color: pl.color }}
          animate={{ textShadow: [`0 0 10px ${pl.glow}`, `0 0 24px ${pl.color}88`, `0 0 10px ${pl.glow}`] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
          {pl.arabic}
        </motion.p>
        <p className="font-inter text-[10px] tracking-widest uppercase mt-0.5" style={{ color: `${pl.color}99` }}>
          {lang === "ml" ? pl.malayalam : PLANET_EN[planetKey]}
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.30)" }}>Square</p>
        <p className="font-amiri text-lg font-bold" style={{ color: G.dim }}>{gridSize}×{gridSize}</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  HIERARCHY TABLE (replaces Ottoman breakdown)
// ─────────────────────────────────────────────────────────────────
function HierarchyTable({ mc, gridSize, rawInput, suffixMode, negFixed, lang }) {
  const L = LABELS[lang];
  if (!mc || !gridSize) return null;

  const n = gridSize;
  const hier = buildHierarchy(mc, n);
  if (!hier) return null;

  const compat = compatibleSizes(mc);
  const isCompat = compat.includes(n);

  const rows = [
    { key: "usurper",  label: L.usurper,  val: hier.usurper },
    { key: "guide",    label: L.guide,    val: hier.guide },
    { key: "mystery",  label: L.mystery,  val: hier.mystery },
    { key: "adjuster", label: L.adjuster, val: hier.adjuster, highlight: true },
    { key: "leader",   label: L.leader,   val: hier.leader },
    { key: "regulator",label: L.regulator,val: hier.regulator },
    { key: "genGov",   label: L.genGov,   val: hier.genGov },
    { key: "highOver", label: L.highOver, val: hier.highOver },
  ];

  return (
    <motion.div key={`hier-${mc}-${n}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className="rounded-2xl border p-4 space-y-3"
      style={{ background: "rgba(4,8,24,0.99)", borderColor: G.borderHi, boxShadow: `0 0 28px ${G.glow}` }}>
      <p className="font-inter text-[10px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
        {L.hierarchy}
      </p>
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg,transparent,${G.borderHi},transparent)` }} />

      {/* Input summary */}
      <div className="flex flex-wrap gap-2">
        <div className="flex-1 rounded-xl px-3 py-2 min-w-0" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{L.inputLabel}</p>
          <p className="font-amiri font-bold text-lg" style={{ color: "rgba(212,175,55,0.70)" }}>{rawInput?.toLocaleString()}</p>
        </div>
        {negFixed && (
          <div className="flex-1 rounded-xl px-3 py-2 min-w-0" style={{ background: "rgba(255,120,60,0.08)", border: "1px solid rgba(255,120,60,0.30)" }}>
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(255,180,100,0.80)" }}>{L.negFix}</p>
          </div>
        )}
        <div className="flex-1 rounded-xl px-3 py-2 min-w-0" style={{ background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.30)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{L.workingMC}</p>
          <p className="font-amiri font-bold text-xl" style={{ color: G.text }}>{mc?.toLocaleString()}</p>
        </div>
      </div>

      {/* Hierarchy rows */}
      <div className="space-y-1.5">
        {rows.map((row, i) => {
          const cols = angelJinnCols(row.val);
          return (
            <motion.div key={row.key} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="rounded-xl overflow-hidden border"
              style={{ borderColor: row.highlight ? "rgba(212,175,55,0.40)" : "rgba(212,175,55,0.12)" }}>
              {/* Row header */}
              <div className="flex items-center justify-between px-3 py-2"
                style={{ background: row.highlight ? "rgba(212,175,55,0.12)" : "rgba(212,175,55,0.04)" }}>
                <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: row.highlight ? G.text : "rgba(212,175,55,0.55)" }}>
                  {row.label}
                </p>
                <p className="font-amiri font-bold tabular-nums"
                  style={{ color: row.highlight ? G.text : "rgba(212,175,55,0.80)", fontSize: row.highlight ? "1.2rem" : "1rem" }}>
                  {row.val.toLocaleString()}
                </p>
              </div>
              {/* Angel/Jinn sub-row */}
              <div className="grid grid-cols-4 divide-x" style={{ borderColor: "rgba(212,175,55,0.08)", background: "rgba(4,8,24,0.80)" }}>
                {[
                  { lbl: L.angelAr,  v: cols.angelAr,  c: "#74C0FC" },
                  { lbl: L.angelHeb, v: cols.angelHeb, c: "#A78BFA" },
                  { lbl: L.jinnAr,   v: cols.jinnAr,   c: "#F87171" },
                  { lbl: L.jinnHeb,  v: cols.jinnHeb,  c: "#FB923C" },
                ].map(col => (
                  <div key={col.lbl} className="px-2 py-1.5 text-center" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
                    <p className="font-inter leading-tight" style={{ fontSize: "7px", color: "rgba(255,255,255,0.30)", letterSpacing: "0.03em" }}>
                      {col.lbl}
                    </p>
                    <p className="font-amiri font-bold tabular-nums text-xs" style={{ color: col.c }}>
                      {col.v.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  COMPATIBILITY NOTICE
// ─────────────────────────────────────────────────────────────────
function CompatibilityNotice({ mc, gridSize, lang, onSelectSize }) {
  const L = LABELS[lang];
  if (!mc || !gridSize) return null;
  if (isCompatible(mc, gridSize)) return null;

  const compat = compatibleSizes(mc);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="rounded-2xl border p-4 space-y-3"
      style={{ background: "rgba(4,8,24,0.99)", borderColor: "rgba(255,80,80,0.45)", boxShadow: "0 0 24px rgba(255,80,80,0.12)" }}>
      <p className="font-inter text-[10px] uppercase tracking-widest text-center" style={{ color: "rgba(255,140,140,0.85)" }}>
        {L.incompatible}
      </p>
      {compat.length > 0 && (
        <>
          <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
            {L.compatibleSizes}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {compat.map(s => (
              <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => onSelectSize(s)}
                className="rounded-xl px-4 py-2 font-inter font-bold text-xs border"
                style={{ background: "rgba(100,220,100,0.10)", borderColor: "rgba(100,220,100,0.40)", color: "rgba(100,220,100,0.90)" }}>
                {s}×{s}
              </motion.button>
            ))}
          </div>
        </>
      )}
      {compat.length === 0 && (
        <p className="font-inter text-[9px] text-center" style={{ color: "rgba(255,255,255,0.30)" }}>
          No compatible sizes found for MC={mc}
        </p>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  SACRED GRID PREVIEW
// ─────────────────────────────────────────────────────────────────
function SacredGridPreview({ gridSize, element, grid, lang }) {
  const L = LABELS[lang];
  const gridData = grid?.grid || grid;
  const isGenerated = !!gridData;
  const elMeta = ELEMENTS.find(e => e.key === element);

  if (grid?.incompatible) {
    return (
      <div className="rounded-2xl border p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]"
        style={{ background: "rgba(4,8,24,0.99)", borderColor: "rgba(255,80,80,0.45)" }}>
        <motion.span className="text-3xl" animate={{ opacity: [0.5,1,0.5] }} transition={{ duration: 2, repeat: Infinity }}>⚠️</motion.span>
        <p className="font-inter text-[10px] uppercase tracking-widest text-center" style={{ color: "rgba(255,140,140,0.85)" }}>
          {L.incompatible}
        </p>
      </div>
    );
  }

  if (!isGenerated) {
    return (
      <div className="rounded-2xl border p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]"
        style={{ background: "rgba(4,8,24,0.99)", borderColor: G.borderHi, boxShadow: `0 0 40px ${G.glow}` }}>
        <motion.span className="font-amiri text-4xl" style={{ color: "rgba(212,175,55,0.25)" }}
          animate={{ opacity: [0.2,0.5,0.2] }} transition={{ duration: 3, repeat: Infinity }}>🜂</motion.span>
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
    <motion.div key={`${gridSize}-${element}-generated`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
      className="rounded-2xl border p-6 space-y-4"
      style={{ background: "rgba(4,8,24,0.99)", borderColor: G.borderHi, boxShadow: `0 0 40px ${G.glow}` }}>

      {/* Header */}
      <div className="text-center space-y-1">
        <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
          🜂 Sacred Vefk {gridSize}×{gridSize}
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {elMeta && <span style={{ fontSize: "0.9rem" }}>{elMeta.icon}</span>}
          {elMeta && <span className="font-amiri text-sm" style={{ color: elMeta.color }}>{elMeta.arabic}</span>}
          {elMeta && <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.35)" }}>
            · {lang === "ml" ? elMeta.malayalam : elMeta.arabic}
          </span>}
        </div>
      </div>

      {/* Grid */}
      <div className="flex justify-center w-full rounded-xl border overflow-hidden" style={{ background: "rgba(4,12,34,0.97)", borderColor: "rgba(212,175,55,0.15)" }}>
        <div style={{ overflowX: "auto", width: "100%", padding: "8px" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gap: "3px", width: "100%" }}>
            {displayFlat.map((num, idx) => (
              <motion.div key={`${gridSize}-${element}-${idx}`}
                initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.016, duration: 0.24, ease: "easeOut" }}
                className="rounded-lg border flex items-center justify-center font-amiri font-bold"
                style={{
                  aspectRatio: "1/1", minWidth: 0,
                  background: "linear-gradient(145deg,rgba(212,175,55,0.14) 0%,rgba(212,175,55,0.06) 100%)",
                  borderColor: "rgba(212,175,55,0.40)", color: G.text,
                  fontSize: gridSize >= 8 ? "11px" : gridSize >= 6 ? "13px" : "16px",
                }}>
                {num}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification */}
      <div className="rounded-xl border p-4 space-y-2"
        style={{ background: "rgba(212,175,55,0.04)", borderColor: verification.valid ? "rgba(100,220,100,0.35)" : "rgba(255,80,80,0.40)" }}>
        <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
          ⚖ Verification — Magic Constant: <span style={{ color: G.text }}>{verification.mc.toLocaleString()}</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Rows",        ok: verification.rowOk },
            { label: "Columns",     ok: verification.colOk },
            { label: "Diagonal ↘",  ok: verification.d1Ok },
            { label: "Diagonal ↙",  ok: verification.d2Ok },
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

// ─────────────────────────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────────────────────────
export default function MagicSqayerPage() {
  const [lang,        setLang]       = useState("ar");
  const [inputNumber, setInputNumber]= useState("");
  const [suffixMode,  setSuffixMode] = useState("none");
  const [gridSize,    setGridSize]   = useState(null);
  const [element,     setElement]    = useState(null);
  const [grid,        setGrid]       = useState(null);

  const L = LABELS[lang];

  // Compute working MC from raw input + suffix
  const getRawNum = () => { const n = parseInt(inputNumber); return isNaN(n) ? null : n; };
  const getWorkingMC = () => {
    const raw = getRawNum();
    if (!raw) return { mc: null, subtracted: false, negFixed: false };
    return applyself(raw, suffixMode);
  };

  function applyself(raw, mode) { return applyself2(raw, mode); }
  function applyself2(raw, mode) {
    const s = SUFFIX[mode] || 0;
    let mc = raw - s;
    const subtracted = s > 0;
    let negFixed = false;
    if (mc <= 0 && s > 0) { mc += 360; negFixed = true; }
    return { mc: mc > 0 ? mc : raw, subtracted, negFixed };
  }

  const { mc: workingMC, subtracted, negFixed } = (() => {
    const raw = getRawNum();
    if (!raw) return { mc: null, subtracted: false, negFixed: false };
    return applyself2(raw, suffixMode);
  })();

  const buildGrid = (mc, size, el) => {
    if (!mc || !size) return null;
    if (!isCompatible(mc, size)) return { incompatible: true };
    const usurper = computeUsurper(mc, size);
    if (!usurper || usurper < 1) return { incompatible: true };
    const e = el || "fire";
    const gridData = generateMagicSquare(size, usurper, e);
    return { grid: gridData, usurper };
  };

  const handleNumberChange = (e) => {
    const val = e.target.value.replace(/[^\d]/g, "");
    setInputNumber(val);
    const raw = parseInt(val);
    if (!isNaN(raw)) {
      const { mc } = applyself2(raw, suffixMode);
      setGrid(buildGrid(mc, gridSize, element));
    } else {
      setGrid(null);
    }
  };

  const handleSuffixChange = (mode) => {
    setSuffixMode(mode);
    const raw = getRawNum();
    if (raw) {
      const { mc } = applyself2(raw, mode);
      setGrid(buildGrid(mc, gridSize, element));
    }
  };

  const handleGridSizeChange = (size) => {
    const newSize = gridSize === size ? null : size;
    setGridSize(newSize);
    setGrid(buildGrid(workingMC, newSize, element));
  };

  const handleElementChange = (key) => {
    const newEl = element === key ? null : key;
    setElement(newEl);
    setGrid(buildGrid(workingMC, gridSize, newEl));
  };

  const handleSelectCompatibleSize = (size) => {
    setGridSize(size);
    setGrid(buildGrid(workingMC, size, element));
  };

  const suffixOptions = [
    { key: "none",   label: L.suffixNone },
    { key: "arabic", label: L.suffixArabic },
    { key: "hebrew", label: L.suffixHebrew },
  ];

  return (
    <PageLayout>
      <div className="space-y-4">

        {/* Header */}
        <PageTitle arabic="السحر المربع" latin="Magic Sqayer" subtitle="Sacred Vefk Construction System" icon="✨" />

        {/* Language Toggle */}
        <div className="flex gap-2 justify-center">
          {[{ id:"ar", flag:"🇸🇦", label:"العربية" }, { id:"ml", flag:"🇮🇳", label:"മലയാളം" }].map(opt => {
            const active = lang === opt.id;
            return (
              <motion.button key={opt.id} onClick={() => setLang(opt.id)} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-inter font-bold text-xs border transition-all"
                style={{
                  background: active ? "rgba(212,175,55,0.15)" : "rgba(4,12,34,0.97)",
                  borderColor: active ? G.borderHi : "rgba(255,255,255,0.10)",
                  color: active ? G.text : "rgba(255,255,255,0.40)",
                }}>
                {opt.flag} {opt.label}
              </motion.button>
            );
          })}
        </div>

        {/* 1. Number Input */}
        <SectionCard>
          <SectionLabel>{L.baseNumber}</SectionLabel>
          <input
            type="text"
            value={inputNumber}
            onChange={handleNumberChange}
            placeholder="Enter number (786, 12345, ...)"
            className="w-full rounded-xl px-4 py-3 font-amiri text-3xl text-center text-white font-bold focus:outline-none caret-white placeholder:text-white/30"
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}` }}
          />
          {workingMC && workingMC !== getRawNum() && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: "rgba(255,200,100,0.70)" }}>
                {L.subtracted} → MC = {workingMC.toLocaleString()}
              </p>
              {negFixed && <p className="font-inter text-[8px]" style={{ color: "rgba(255,150,80,0.80)" }}>+360 applied</p>}
            </div>
          )}
          {workingMC && workingMC === getRawNum() && (
            <p className="text-center font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              MC = {workingMC.toLocaleString()}
            </p>
          )}
        </SectionCard>

        {/* 2. Suffix System */}
        <SectionCard>
          <SectionLabel>{L.suffix}</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {suffixOptions.map(opt => {
              const sel = suffixMode === opt.key;
              return (
                <motion.button key={opt.key} onClick={() => handleSuffixChange(opt.key)}
                  whileHover={{ scale: sel ? 1 : 1.03 }} whileTap={{ scale: 0.96 }}
                  className="rounded-xl py-2.5 px-2 font-inter font-bold text-[10px] border transition-all text-center"
                  style={{
                    background: sel ? "rgba(212,175,55,0.15)" : "rgba(4,12,34,0.97)",
                    borderColor: sel ? G.borderHi : "rgba(255,255,255,0.08)",
                    color: sel ? G.text : "rgba(255,255,255,0.35)",
                  }}>
                  {opt.label}
                </motion.button>
              );
            })}
          </div>
        </SectionCard>

        {/* 3. Grid Size */}
        <SectionCard>
          <SectionLabel>{L.gridSize}</SectionLabel>
          <div className="grid grid-cols-4 gap-2">
            {GRID_SIZES.map(gs => {
              const sel = gridSize === gs.value;
              const compat = workingMC ? isCompatible(workingMC, gs.value) : true;
              return (
                <motion.button key={gs.value} onClick={() => handleGridSizeChange(gs.value)}
                  whileHover={{ scale: sel ? 1 : 1.04 }} whileTap={{ scale: 0.95 }}
                  className="rounded-xl py-3.5 font-inter font-bold text-xs border transition-all relative overflow-hidden"
                  style={{
                    background: sel
                      ? "rgba(212,175,55,0.16)"
                      : compat && workingMC ? "rgba(100,220,100,0.05)" : "rgba(4,12,34,0.97)",
                    borderColor: sel ? G.borderHi : compat && workingMC ? "rgba(100,220,100,0.25)" : "rgba(255,255,255,0.08)",
                    color: sel ? G.text : compat && workingMC ? "rgba(120,230,120,0.80)" : "rgba(255,255,255,0.38)",
                  }}>
                  {gs.label}
                </motion.button>
              );
            })}
          </div>
          {workingMC && (
            <p className="font-inter text-[8px] uppercase tracking-widest text-center" style={{ color: "rgba(100,220,100,0.50)" }}>
              🟢 = compatible with MC {workingMC.toLocaleString()}
            </p>
          )}
        </SectionCard>

        {/* Auto Planet */}
        {gridSize && <AutoPlanetCard gridSize={gridSize} lang={lang} />}

        {/* Compatibility Notice */}
        {workingMC && gridSize && !isCompatible(workingMC, gridSize) && (
          <CompatibilityNotice mc={workingMC} gridSize={gridSize} lang={lang} onSelectSize={handleSelectCompatibleSize} />
        )}

        {/* 4. Element */}
        <SectionCard>
          <SectionLabel>{L.element}</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {ELEMENTS.map(el => {
              const sel = element === el.key;
              return (
                <motion.button key={el.key} onClick={() => handleElementChange(el.key)}
                  whileHover={{ scale: sel ? 1 : 1.02 }} whileTap={{ scale: 0.96 }}
                  className="rounded-xl px-3 py-3.5 flex items-center gap-2.5 border transition-all relative overflow-hidden"
                  style={{
                    background: sel ? `linear-gradient(145deg,${el.bg} 0%,rgba(4,12,34,0.90) 100%)` : "rgba(4,12,34,0.97)",
                    borderColor: sel ? el.border : "rgba(255,255,255,0.08)",
                    boxShadow: sel ? `0 0 20px ${el.glow}` : "none",
                  }}>
                  <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{el.icon}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-amiri text-base font-bold" dir="rtl"
                      style={{ color: sel ? el.color : "rgba(255,255,255,0.45)" }}>{el.arabic}</span>
                    <span className="font-inter text-[8px] uppercase tracking-widest"
                      style={{ color: sel ? `${el.color}88` : "rgba(255,255,255,0.20)" }}>
                      {lang === "ml" ? el.malayalam : ""}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </SectionCard>

        {/* Generate Button */}
        <motion.button
          disabled={!inputNumber || !gridSize}
          whileHover={{ scale: !inputNumber || !gridSize ? 1 : 1.02 }}
          whileTap={{ scale: !inputNumber || !gridSize ? 1 : 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-inter font-bold text-sm text-[#0d1b2a] disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
          style={{ background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)", boxShadow: `0 0 32px ${G.glowHi}` }}
          onClick={() => setGrid(buildGrid(workingMC, gridSize, element))}
        >
          <span className="font-amiri text-base">✨</span>
          {L.generate}
        </motion.button>

        {/* Hierarchy Table */}
        {grid && !grid.incompatible && workingMC && gridSize && (
          <HierarchyTable
            mc={workingMC}
            gridSize={gridSize}
            rawInput={getRawNum()}
            suffixMode={suffixMode}
            negFixed={negFixed}
            lang={lang}
          />
        )}

        {/* Sacred Grid Preview */}
        <SacredGridPreview gridSize={gridSize} element={element} grid={grid} lang={lang} />

      </div>
    </PageLayout>
  );
}