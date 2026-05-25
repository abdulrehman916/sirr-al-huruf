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
  { label: "10×10", value: 10 },
];

const ELEMENTS = [
  { key: "fire",  arabic: "النار",  icon: "🔥", color: "#FF6B35", glow: "rgba(255,107,53,0.35)", bg: "rgba(255,107,53,0.10)", border: "rgba(255,107,53,0.50)" },
  { key: "earth", arabic: "التراب", icon: "🌍", color: "#A5C880", glow: "rgba(165,200,128,0.35)", bg: "rgba(165,200,128,0.10)", border: "rgba(165,200,128,0.50)" },
  { key: "air",   arabic: "الهواء", icon: "🌪",  color: "#B2EBF2", glow: "rgba(178,235,242,0.35)", bg: "rgba(178,235,242,0.10)", border: "rgba(178,235,242,0.50)" },
  { key: "water", arabic: "الماء",  icon: "💧", color: "#4FC3F7", glow: "rgba(79,195,247,0.35)",  bg: "rgba(79,195,247,0.10)",  border: "rgba(79,195,247,0.50)" },
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
    <div
      className="rounded-2xl border p-4 space-y-3"
      style={{ background: "rgba(10,24,56,0.95)", borderColor: G.borderHi, boxShadow: `0 0 28px ${G.glow}` }}
    >
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

// Sacred 4×4 placement patterns — each value is the rank (1-based) of the number to place
// Pattern tells: "position index X in the flat grid gets the value of rank N"
// e.g. FIRE_PATTERN[0] = 8 means cell 0 gets the 8th number (base+7)
const ELEMENT_PATTERNS_4x4 = {
  fire:  [8, 11, 14, 1, 13, 2, 7, 12, 3, 16, 9, 6, 10, 5, 4, 15],
  earth: [15, 4, 5, 10, 6, 9, 16, 3, 12, 7, 2, 13, 1, 14, 11, 8],
  air:   [1, 14, 11, 8, 12, 7, 2, 13, 6, 9, 16, 3, 15, 4, 5, 10],
  water: [10, 5, 4, 15, 3, 16, 9, 6, 13, 2, 7, 12, 8, 11, 14, 1],
};

function generateVefk4x4(targetNumber, elementKey) {
  const n = parseInt(targetNumber);
  const remainder = (n - 30) % 4;
  const base = (n - 30 - remainder) / 4;

  // Build 16 sequential values starting from base
  const values = Array.from({ length: 16 }, (_, i) => base + i);

  // Apply remainder rule
  if (remainder === 3) values[4] += 1;       // 5th cell (index 4)
  else if (remainder === 2) values[8] += 1;  // 9th cell (index 8)
  else if (remainder === 1) values[12] += 1; // 13th cell (index 12)

  const pattern = ELEMENT_PATTERNS_4x4[elementKey] || ELEMENT_PATTERNS_4x4.fire;

  // pattern[cellIndex] = rank (1-based) → values[rank-1]
  const flat = pattern.map(rank => values[rank - 1]);

  // Return as 4×4 grid
  return [
    flat.slice(0, 4),
    flat.slice(4, 8),
    flat.slice(8, 12),
    flat.slice(12, 16),
  ];
}

function generateMagicSquare(size, baseNum) {
  const grid = Array(size).fill(0).map(() => Array(size).fill(0));
  let num = baseNum;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      grid[i][j] = num;
      num++;
    }
  }
  return grid;
}

export default function MagicSqayerPage() {
  const [inputNumber, setInputNumber] = useState("");
  const [gridSize,    setGridSize]    = useState(null);
  const [element,     setElement]     = useState(null);
  const [planet,      setPlanet]      = useState(null);
  const [grid, setGrid]               = useState(null);

  const buildGrid = (num, size, el) => {
    if (!num || !size) return null;
    if (size === 4) return generateVefk4x4(num, el || "fire");
    return generateMagicSquare(size, parseInt(num));
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

        {/* ── Header ── */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-yellow-500/25 mb-4"
            style={{
              background: "linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)",
              boxShadow: "0 0 28px rgba(212,175,55,0.18)",
            }}
          >
            <span className="font-amiri text-2xl" style={{ color: "#D4AF37" }}>✨</span>
          </motion.div>
          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white">السحر المربع</h1>
          <p className="font-inter text-xs mt-1 tracking-widest uppercase" style={{ color: G.dim }}>
            Sacred Vefk Construction System
          </p>
          <GoldDivider />
        </div>

        {/* ── 1. Number Input ── */}
        <SectionCard>
          <SectionLabel>🔢 Base Number — الرقم الأساسي</SectionLabel>
          <input
            type="text"
            value={inputNumber}
            onChange={handleNumberChange}
            placeholder="Enter any large number (100, 786, 12345...)"
            className="w-full rounded-xl px-4 py-3 font-amiri text-3xl text-center text-white font-bold resize-none focus:outline-none caret-white placeholder:text-white/30"
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}` }}
          />
          {inputNumber && (
            <p className="text-center font-inter text-[9px] uppercase tracking-widest mt-2" style={{ color: G.dim }}>
              Starting from: {inputNumber}
            </p>
          )}
        </SectionCard>

        {/* ── 2. Grid Size ── */}
        <SectionCard>
          <SectionLabel>Grid Size — حجم المربع</SectionLabel>
          <div className="grid grid-cols-4 gap-2">
            {GRID_SIZES.map(g => {
              const sel = gridSize === g.value;
              return (
                <motion.button
                  key={g.value}
                  onClick={() => handleGridSizeChange(g.value)}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl py-3 font-inter font-bold text-xs border transition-all"
                  style={{
                    background: sel ? G.bg : "rgba(4,12,34,0.97)",
                    borderColor: sel ? G.borderHi : "rgba(255,255,255,0.08)",
                    color: sel ? G.text : "rgba(255,255,255,0.40)",
                    boxShadow: sel ? `0 0 14px ${G.glow}` : "none",
                  }}
                >
                  {g.label}
                </motion.button>
              );
            })}
          </div>
        </SectionCard>

        {/* ── 3. Anasir (Element) ── */}
        <SectionCard>
          <SectionLabel>Element — العنصر</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {ELEMENTS.map(el => {
              const sel = element === el.key;
              return (
                <motion.button
                 key={el.key}
                 onClick={() => handleElementChange(el.key)}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl p-3 flex items-center gap-2 border transition-all"
                  style={{
                    background: sel ? el.bg : "rgba(4,12,34,0.97)",
                    borderColor: sel ? el.border : "rgba(255,255,255,0.08)",
                    boxShadow: sel ? `0 0 14px ${el.glow}` : "none",
                  }}
                >
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

        {/* ── 4. Planet ── */}
        <SectionCard>
          <SectionLabel>Planet — الكوكب</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {PLANETS.map(pl => {
              const sel = planet === pl.key;
              return (
                <motion.button
                  key={pl.key}
                  onClick={() => setPlanet(sel ? null : pl.key)}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl p-3 flex items-center gap-2 border transition-all"
                  style={{
                    background: sel ? pl.bg : "rgba(4,12,34,0.97)",
                    borderColor: sel ? pl.border : "rgba(255,255,255,0.08)",
                    boxShadow: sel ? `0 0 14px ${pl.glow}` : "none",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{pl.icon}</span>
                  <span className="font-amiri text-base font-bold" dir="rtl"
                    style={{ color: sel ? pl.color : "rgba(255,255,255,0.45)" }}>
                    {pl.arabic}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </SectionCard>

        {/* ── 5. Generate Button ── */}
        <motion.button
          disabled={!inputNumber || !gridSize}
          whileHover={{ scale: !inputNumber || !gridSize ? 1 : 1.02 }}
          whileTap={{ scale: !inputNumber || !gridSize ? 1 : 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-inter font-semibold text-sm text-[#0d1b2a] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg,#fcd34d,#d97706)",
            boxShadow: `0 0 28px ${G.glowHi}`,
          }}
          onClick={() => {
            setGrid(buildGrid(inputNumber, gridSize, element));
          }}
        >
          <span className="font-amiri text-base">✨</span>
          Generate Magic Sqayer
        </motion.button>

        {/* ── 6. Sacred Grid Preview ── */}
        {grid ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border p-6"
            style={{
              background: "rgba(4,8,24,0.99)",
              borderColor: G.borderHi,
              boxShadow: `0 0 40px ${G.glow}`,
            }}
          >
            <div className="text-center mb-4 space-y-1">
              <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
                🜂 Sacred Vefk {gridSize}×{gridSize}
                {gridSize === 4 && element && ` — ${ELEMENTS.find(e => e.key === element)?.arabic || ""}`}
              </p>
              {gridSize !== 4 && (
                <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.30)" }}>
                  Anasir Vefk system active for 4×4 only
                </p>
              )}
              {gridSize === 4 && (
                <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.30)" }}>
                  Base: {Math.floor((parseInt(inputNumber) - 30) / 4)} · Remainder: {(parseInt(inputNumber) - 30) % 4}
                </p>
              )}
            </div>
            <div
              className="inline-block mx-auto"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                gap: gridSize > 6 ? "4px" : "6px",
              }}
            >
              {grid.flat().map((num, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="rounded-lg border flex items-center justify-center font-amiri font-bold"
                  style={{
                    width: gridSize > 6 ? "40px" : "50px",
                    height: gridSize > 6 ? "40px" : "50px",
                    background: "rgba(212,175,55,0.08)",
                    borderColor: "rgba(212,175,55,0.35)",
                    color: G.text,
                    fontSize: gridSize > 7 ? "11px" : gridSize > 6 ? "12px" : "14px",
                    boxShadow: `inset 0 0 8px rgba(212,175,55,0.12)`,
                  }}
                >
                  {num}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div
            className="rounded-2xl border p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]"
            style={{
              background: "rgba(4,8,24,0.99)",
              borderColor: G.borderHi,
              boxShadow: `0 0 40px ${G.glow}`,
            }}
          >
            <motion.span
              className="font-amiri text-4xl"
              style={{ color: "rgba(212,175,55,0.25)" }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              🜂
            </motion.span>
            <p className="font-inter text-[10px] uppercase tracking-widest text-center" style={{ color: "rgba(212,175,55,0.25)" }}>
              Sacred Grid Preview
            </p>
            <p className="font-amiri text-sm" style={{ color: "rgba(212,175,55,0.20)" }} dir="rtl">
              المربع السحري
            </p>
          </div>
        )}

      </div>
    </PageLayout>
  );
}