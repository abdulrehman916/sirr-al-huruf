import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../components/PageLayout";
import TanzimVefki from "../components/TanzimVefki";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  bg:       "rgba(212,175,55,0.07)",
  border:   "rgba(212,175,55,0.40)",
};

// ── Abjad ────────────────────────────────────────────────────────
const ABJAD_MAP = {
  'ا':1,'أ':1,'إ':1,'آ':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,
  'ي':10,'ى':10,'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,
  'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000,
};
function calcAbjad(t) {
  return [...t].reduce((s, c) => s + (ABJAD_MAP[c] || 0), 0);
}

// ── Vefk Generation: 5×5 Hâli Vasat Beşli ────────────────────────
// Fixed Ottoman manuscript layout — position numbers (1–24), center = null (empty)
const HALI_VASAT_5_LAYOUT = [
  [11, 15, 24,  3,  7],
  [ 4,  8, 12, 16, 20],
  [17, 21, null, 9, 13],
  [ 5, 14, 18, 22,  1],
  [23,  2,  6, 10, 19],
];

// Compute cell values based on Ana Sayı (base number)
// Hane 1–19: base × position_number
// Hane 20–24: base × (base - 40 + offset) where offset = 0,1,2,3,4
function computeHaliVasatCells(base) {
  const cells = {};
  // Positions 1–19: base × sıra numarası
  for (let pos = 1; pos <= 19; pos++) {
    cells[pos] = base * pos;
  }
  // Positions 20–24: base × (base − 40 + offset)
  cells[20] = base * (base - 40);  // offset 0
  cells[21] = base * (base - 39);  // offset 1
  cells[22] = base * (base - 38);  // offset 2
  cells[23] = base * (base - 37);  // offset 3
  cells[24] = base * (base - 36);  // offset 4
  return cells;
}

function generate5x5HaliVasat(base) {
  const n = parseInt(base);
  if (!n || n < 41) return null; // Must be >= 41 for hane 20-24 formula
  const cells = computeHaliVasatCells(n);
  // Map layout positions to values
  const grid = HALI_VASAT_5_LAYOUT.map(row =>
    row.map(pos => (pos === null ? null : cells[pos]))
  );
  return grid;
}

// ── Sub-components ────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2">
      <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${G.borderHi})` }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.text }} />
      <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${G.borderHi})` }} />
    </div>
  );
}

// ── Ana Vefk: 5×5 Hâli Vasat Beşli ───────────────────────────────
function AnaVefk() {
  const [anaSayi,  setAnaSayi]  = useState("");
  const [talibRaw, setTalibRaw] = useState("");  // raw input from 2nd field
  const [grid,     setGrid]     = useState(null);
  const [base,     setBase]     = useState(null);

  // Determine if 2nd field is numeric or text, and compute its Ebced if text
  const talibIsNumeric = /^\d+$/.test(talibRaw.trim());
  const talibEbced = !talibIsNumeric && talibRaw.trim() ? calcAbjad(talibRaw.trim()) : null;
  // The display text for center cell is always the raw input (if any)
  const esmaText = talibRaw.trim();

  const handleGenerate = () => {
    const baseNum = parseInt(anaSayi);
    if (!baseNum || baseNum < 41) return;
    const g = generate5x5HaliVasat(baseNum);
    if (!g) return;
    setGrid(g);
    setBase(baseNum);
  };

  // Calculate magic constant and validate
  // Center cell (row 2, col 2) is always null — excluded from ALL sums
  const magicConst = useMemo(() => {
    if (!grid) return null;
    // Row sums: filter out null (center cell)
    const rowSums = grid.map(r => r.reduce((a, v) => a + (v === null ? 0 : v), 0));
    // Col sums: filter out null (center cell)
    const colSums = [0,1,2,3,4].map(c =>
      grid.reduce((a, r) => a + (r[c] === null ? 0 : r[c]), 0)
    );
    // Diagonals: skip center cell at [2][2]
    // Main diagonal: [0][0], [1][1], [3][3], [4][4]
    const diag1 = grid[0][0] + grid[1][1] + grid[3][3] + grid[4][4];
    // Anti-diagonal: [0][4], [1][3], [3][1], [4][0]
    const diag2 = grid[0][4] + grid[1][3] + grid[3][1] + grid[4][0];
    const expected = rowSums[0];
    const allEqual = rowSums.every(s => s === expected) &&
                     colSums.every(s => s === expected) &&
                     diag1 === expected && diag2 === expected;
    return allEqual ? expected : null;
  }, [grid]);

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="rounded-2xl border p-5 space-y-4"
        style={{ background: "rgba(6,12,32,0.97)", borderColor: G.borderHi, boxShadow: `0 0 28px ${G.glow}` }}>
        
        {/* Header */}
        <div className="text-center space-y-1">
          <motion.div
            className="inline-flex items-center justify-center w-11 h-11 rounded-2xl border border-yellow-500/25 mb-1"
            style={{ background: "linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)", boxShadow: "0 0 22px rgba(212,175,55,0.18)" }}
          >
            <span className="font-amiri text-lg" style={{ color: "#D4AF37" }}>📜</span>
          </motion.div>
          <motion.h2 className="font-amiri text-2xl font-bold" style={{ color: G.text }}
            animate={{ textShadow: [`0 0 14px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 14px ${G.glow}`] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            الأصل
          </motion.h2>
          <p className="font-inter text-[10px] font-bold text-white">ANA VEFK</p>
          <p className="font-inter text-[9px] uppercase tracking-[0.22em]" style={{ color: G.dim }}>
            Hâli Vasat Beşli System
          </p>
          <GoldDivider />
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.30)" }}>
            5×5 Empty Center — Ottoman Manuscript Method
          </p>
        </div>

        {/* Ana Sayı Input */}
        <div className="rounded-xl border px-4 py-3 space-y-1.5"
          style={{ background: "rgba(4,10,28,0.99)", borderColor: G.border }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
            1️⃣ Ana Sayı — الرقم الأساسي
          </p>
          <input
            type="text" inputMode="numeric"
            value={anaSayi}
            onChange={e => setAnaSayi(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="Sayı girin... (örn: 66, 114, 786)"
            className="w-full rounded-xl px-4 py-2.5 font-amiri text-2xl text-center text-white font-bold focus:outline-none caret-white placeholder:text-white/25"
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}` }}
          />
          {base && base < 41 && (
            <p className="font-inter text-[9px] text-center" style={{ color: "rgba(255,100,100,0.70)" }}>
              ⚠ Sayı 41'den büyük olmalı (hane 20–24 için)
            </p>
          )}
        </div>

        {/* Talib / Mathlub İsmi (optional) */}
        <div className="rounded-xl border px-4 py-3 space-y-1.5"
          style={{ background: "rgba(4,10,28,0.99)", borderColor: "rgba(212,175,55,0.20)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
            2️⃣ Talib / Mathlub İsmi (İsteğe Bağlı) — اسم الطالب / المطلوب
          </p>
          <input
            type="text"
            value={talibRaw}
            onChange={e => setTalibRaw(e.target.value)}
            placeholder="İsim / Esma / الله / 786..."
            dir="rtl"
            className="w-full rounded-xl px-4 py-2 font-amiri text-lg text-white text-right focus:outline-none caret-white placeholder:text-white/25"
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid rgba(212,175,55,0.15)` }}
          />
          {/* Show Ebced result if text was entered */}
          {talibEbced !== null && talibEbced > 0 && (
            <p className="font-inter text-[9px]" style={{ color: "rgba(212,175,55,0.65)" }}>
              ✦ Ebced: <span className="font-amiri font-bold" style={{ color: G.text }}>{talibEbced.toLocaleString()}</span>
              <span style={{ color: "rgba(212,175,55,0.35)" }}> — ortada gösterilir, hesaba dahil değil</span>
            </p>
          )}
          {talibIsNumeric && talibRaw.trim() && (
            <p className="font-inter text-[9px]" style={{ color: "rgba(212,175,55,0.35)" }}>
              Sayısal değer girildi — ortada gösterilir, hesaba dahil değil
            </p>
          )}
          {!talibRaw.trim() && (
            <p className="font-inter text-[8px]" style={{ color: "rgba(212,175,55,0.30)" }}>
              Metin girilirse Ebced hesaplanır — Girilirse ortada gösterilir
            </p>
          )}
        </div>

        {/* Rule explanation */}
        <div className="rounded-xl border px-4 py-3 space-y-1.5"
          style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.18)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
            📜 Hesap Kuralı — Calculation Rule
          </p>
          <div className="space-y-1">
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
              Hane 1–19: <span style={{ color: G.text }}>Ana Sayı × konum (1, 2, 3 … 19)</span>
            </p>
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
              Hane 20–24: <span style={{ color: G.text }}>Ana Sayı × (Ana Sayı−40, −39, −38, −37, −36)</span>
            </p>
            {base && base >= 41 && (
              <p className="font-inter text-[9px] mt-1" style={{ color: "rgba(212,175,55,0.55)" }}>
                Örnek: {base} − 40 = {base - 40} → ×{base-40}, ×{base-39}, ×{base-38}, ×{base-37}, ×{base-36}
              </p>
            )}
          </div>
        </div>

        <motion.button
          onClick={handleGenerate}
          disabled={!anaSayi.trim() || (base && base < 41)}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl font-inter font-semibold text-sm text-[#0d1b2a] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg,#fcd34d,#d97706)", boxShadow: `0 0 24px ${G.glowHi}` }}
        >
          ✨ Hâli Vasat Vefki Oluştur
        </motion.button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {grid && base ? (
          <motion.div
            key={`hali-vasat-${base}`}
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border p-5 space-y-4"
            style={{ background: "rgba(4,8,24,0.99)", borderColor: G.borderHi, boxShadow: `0 0 32px ${G.glow}` }}
          >
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl px-3 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Ana Sayı</p>
                <p className="font-amiri text-xl font-bold" style={{ color: G.text }}>{base.toLocaleString()}</p>
              </div>
              <div className="rounded-xl px-3 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>
                  {magicConst ? "Magic Constant ✓" : "⚠ Dengesiz"}
                </p>
                <p className="font-amiri text-sm font-bold leading-tight" style={{ color: magicConst ? G.text : "rgba(255,100,100,0.80)" }}>
                  {magicConst ? magicConst.toLocaleString() : "Hata"}
                </p>
              </div>
            </div>

            <GoldDivider />

            <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
              🜂 5×5 Hâli Vasat Beşli — المربع الخماسي
            </p>

            {/* 5×5 Grid */}
            <div className="flex justify-center overflow-x-auto">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 58px)", gap: "4px" }}>
                {grid.flat().map((val, idx) => {
                  const isEmpty = val === null;
                  const display = isEmpty ? null : val.toLocaleString();
                  const fontSize = display && display.length > 9 ? "8px"
                    : display && display.length > 6 ? "9px"
                    : display && display.length > 4 ? "11px" : "13px";
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.75 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.018, duration: 0.22 }}
                      className="rounded-lg border flex flex-col items-center justify-center"
                      style={{
                        width: 58, height: 58,
                        background: isEmpty ? "rgba(212,175,55,0.04)" : "rgba(212,175,55,0.10)",
                        borderColor: isEmpty ? "rgba(212,175,55,0.18)" : "rgba(212,175,55,0.45)",
                        boxShadow: isEmpty ? "none" : "inset 0 0 8px rgba(212,175,55,0.12)",
                      }}
                    >
                      {isEmpty ? (
                        <div className="flex items-center justify-center w-full h-full px-1">
                          {esmaText ? (
                            <p className="font-amiri text-center leading-tight"
                              style={{ color: G.text, fontSize: esmaText.length > 8 ? "8px" : "10px" }}
                              dir="rtl">{esmaText}</p>
                          ) : (
                            <motion.span style={{ fontSize: "1.1rem", color: "rgba(212,175,55,0.18)" }}
                              animate={{ opacity: [0.1, 0.35, 0.1] }}
                              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>□</motion.span>
                          )}
                        </div>
                      ) : (
                        <p className="font-amiri font-bold tabular-nums leading-tight"
                          style={{ color: G.text, fontSize, textShadow: "0 0 6px rgba(212,175,55,0.35)" }}>
                          {display}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Magic constant display */}
            {magicConst && (
              <div className="rounded-xl border p-3 text-center"
                style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.25)" }}>
                <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                  ⚖ Kutsal Sabit — Magic Constant
                </p>
                <motion.p className="font-amiri text-3xl font-bold mt-1" style={{ color: G.text }}
                  animate={{ textShadow: [`0 0 12px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 12px ${G.glow}`] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                  {magicConst.toLocaleString()}
                </motion.p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="hali-placeholder"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="rounded-xl border p-8 flex flex-col items-center gap-3"
            style={{ background: "rgba(4,8,24,0.99)", borderColor: "rgba(212,175,55,0.12)" }}
          >
            <motion.span style={{ fontSize: "1.8rem", color: "rgba(212,175,55,0.18)" }}
              animate={{ opacity: [0.12, 0.40, 0.12] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>📜</motion.span>
            <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: "rgba(212,175,55,0.22)" }}>
              Ana sayıyı girerek Hâli Vasat vefkini oluşturun
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────
const TABS = [
  { id: "ana",    label: "📜 Ana Vefk",     arabic: "الوفق الأصلي" },
  { id: "tanzim", label: "✨ Tanzim Vefki",  arabic: "تنظيم الوفق" },
];

export default function VefkinYapilisiPage() {
  const [activeTab, setActiveTab] = useState("ana");

  return (
    <PageLayout>
      <div className="space-y-4">

        {/* Header */}
        <div className="text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-yellow-500/25 mb-4"
            style={{ background: "linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)", boxShadow: "0 0 28px rgba(212,175,55,0.18)" }}>
            <span className="font-amiri text-2xl" style={{ color: "#D4AF37" }}>📜</span>
          </motion.div>
          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white">طريقة الوفق</h1>
          <p className="font-inter text-xs mt-1 tracking-widest uppercase" style={{ color: G.dim }}>
            Vefkin Yapılışı — Ottoman Manuscript Method
          </p>
          <GoldDivider />
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-2">
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="rounded-xl py-3 px-3 flex flex-col items-center gap-0.5 border transition-all"
                style={{
                  background: active ? G.bg : "rgba(4,12,34,0.97)",
                  borderColor: active ? G.borderHi : "rgba(255,255,255,0.08)",
                  boxShadow: active ? `0 0 16px ${G.glow}` : "none",
                }}
              >
                <span className="font-inter text-xs font-bold" style={{ color: active ? G.text : "rgba(255,255,255,0.45)" }}>
                  {tab.label}
                </span>
                <span className="font-amiri text-sm" style={{ color: active ? "rgba(212,175,55,0.70)" : "rgba(255,255,255,0.25)" }}>
                  {tab.arabic}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "ana"    ? <AnaVefk /> : <TanzimVefki />}
          </motion.div>
        </AnimatePresence>

      </div>
    </PageLayout>
  );
}