import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  bg:       "rgba(212,175,55,0.07)",
  border:   "rgba(212,175,55,0.40)",
};

// Fixed 5×5 Halî Vasat layout — null = center (empty)
// Each cell stores its "position number" (1–24), center = null
const LAYOUT = [
  [11, 15, 24,  3,  7],
  [ 4,  8, 12, 16, 20],
  [17, 21, null, 9, 13],
  [ 5, 14, 18, 22,  1],
  [23,  2,  6, 10, 19],
];

// Given base number, compute value for each position 1–24
// All 24 positions follow the same rule: base × sıra_numarası (1 through 24)
// This ensures the Halî Vasat 5×5 grid (center empty) is always balanced.
function computeCells(base) {
  const cells = {};
  for (let pos = 1; pos <= 24; pos++) {
    cells[pos] = base * pos;
  }
  return cells;
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2">
      <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${G.borderHi})` }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.text }} />
      <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${G.borderHi})` }} />
    </div>
  );
}

function TanzimGrid({ cells, esmaText }) {
  const cellW = 58;
  return (
    <div className="flex justify-center overflow-x-auto">
      <div style={{ display: "grid", gridTemplateColumns: `repeat(5, ${cellW}px)`, gap: "4px" }}>
        {LAYOUT.flat().map((pos, idx) => {
          const isEmpty = pos === null;
          const val = isEmpty ? null : cells[pos];
          const display = val != null ? val.toLocaleString() : null;
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
                width: cellW, height: cellW,
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
                <>
                  <p className="font-amiri font-bold tabular-nums leading-tight"
                    style={{ color: G.text, fontSize, textShadow: "0 0 6px rgba(212,175,55,0.35)" }}>
                    {display}
                  </p>
                  <p className="font-inter" style={{ fontSize: "7px", color: "rgba(212,175,55,0.28)", marginTop: "1px" }}>
                    ×{pos}
                  </p>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function TanzimVefki() {
  const [mainNum,  setMainNum]  = useState("");
  const [esmaText, setEsmaText] = useState("");

  const base = mainNum ? parseInt(mainNum) : null;

  const cells = useMemo(() => {
    if (!base || isNaN(base) || base < 1) return null;
    return computeCells(base);
  }, [base]);

  // Magic constant = ilk satır toplamı + validation
  const magicConstant = useMemo(() => {
    if (!cells) return null;
    const row1 = LAYOUT[0].reduce((a, pos) => a + cells[pos], 0);
    const row2 = LAYOUT[1].reduce((a, pos) => a + cells[pos], 0);
    const row3 = LAYOUT[2].reduce((a, pos) => a + cells[pos], 0);
    const row4 = LAYOUT[3].reduce((a, pos) => a + cells[pos], 0);
    const row5 = LAYOUT[4].reduce((a, pos) => a + cells[pos], 0);
    const col1 = [LAYOUT[0][0], LAYOUT[1][0], LAYOUT[2][0], LAYOUT[3][0], LAYOUT[4][0]].reduce((a, p) => a + cells[p], 0);
    const col2 = [LAYOUT[0][1], LAYOUT[1][1], LAYOUT[2][1], LAYOUT[3][1], LAYOUT[4][1]].reduce((a, p) => a + cells[p], 0);
    const col3 = [LAYOUT[0][2], LAYOUT[1][2], LAYOUT[3][2], LAYOUT[4][2]].reduce((a, p) => a + cells[p], 0);
    const col4 = [LAYOUT[0][3], LAYOUT[1][3], LAYOUT[2][3], LAYOUT[3][3], LAYOUT[4][3]].reduce((a, p) => a + cells[p], 0);
    const col5 = [LAYOUT[0][4], LAYOUT[1][4], LAYOUT[2][4], LAYOUT[3][4], LAYOUT[4][4]].reduce((a, p) => a + cells[p], 0);
    const diag1 = [LAYOUT[0][0], LAYOUT[1][1], LAYOUT[3][3], LAYOUT[4][4]].reduce((a, p) => a + cells[p], 0);
    const diag2 = [LAYOUT[0][4], LAYOUT[1][3], LAYOUT[3][1], LAYOUT[4][0]].reduce((a, p) => a + cells[p], 0);
    // All should equal row1 (magic constant)
    const valid = row2 === row1 && row3 === row1 && row4 === row1 && row5 === row1 &&
                  col1 === row1 && col2 === row1 && col3 === row1 && col4 === row1 && col5 === row1 &&
                  diag1 === row1 && diag2 === row1;
    return valid ? row1 : null;
  }, [cells]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-5 space-y-4"
        style={{ background: "rgba(6,12,32,0.97)", borderColor: G.borderHi, boxShadow: `0 0 28px ${G.glow}` }}>

        {/* Header */}
        <div className="text-center space-y-1">
          <motion.div
            className="inline-flex items-center justify-center w-11 h-11 rounded-2xl border border-yellow-500/25 mb-1"
            style={{ background: "linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)", boxShadow: "0 0 22px rgba(212,175,55,0.18)" }}
          >
            <span className="font-amiri text-lg" style={{ color: "#D4AF37" }}>✨</span>
          </motion.div>
          <motion.h2 className="font-amiri text-2xl font-bold" style={{ color: G.text }}
            animate={{ textShadow: [`0 0 14px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 14px ${G.glow}`] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            تنظيم
          </motion.h2>
          <p className="font-inter text-[10px] font-bold text-white">TANZİM</p>
          <p className="font-inter text-[9px] uppercase tracking-[0.22em]" style={{ color: G.dim }}>
            Halî Vasat Tanzim System
          </p>
          <GoldDivider />
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.30)" }}>
            5×5 Empty Center — Ottoman Manuscript Method
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          {/* Main number */}
          <div className="rounded-xl border px-4 py-3 space-y-1.5"
            style={{ background: "rgba(4,10,28,0.99)", borderColor: G.border }}>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              1️⃣ Ana Sayı — الرقم الأساسي
            </p>
            <input
              type="text" inputMode="numeric"
              value={mainNum}
              onChange={e => setMainNum(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="Sayı girin... (örn: 114, 786)"
              className="w-full rounded-xl px-4 py-2.5 font-amiri text-2xl text-center text-white font-bold focus:outline-none caret-white placeholder:text-white/25"
              style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}` }}
            />
            {base && base < 1 && (
              <p className="font-inter text-[9px] text-center" style={{ color: "rgba(255,100,100,0.70)" }}>
                ⚠ Geçerli bir sayı girin
              </p>
            )}
          </div>

          {/* Esma */}
          <div className="rounded-xl border px-4 py-3 space-y-1.5"
            style={{ background: "rgba(4,10,28,0.99)", borderColor: "rgba(212,175,55,0.20)" }}>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              2️⃣ Esma / İsim (İsteğe Bağlı) — الاسم الإلهي
            </p>
            <input
              type="text"
              value={esmaText}
              onChange={e => setEsmaText(e.target.value)}
              placeholder="Camii / Vedud / الله..."
              dir="rtl"
              className="w-full rounded-xl px-4 py-2 font-amiri text-lg text-white text-right focus:outline-none caret-white placeholder:text-white/25"
              style={{ background: "rgba(4,12,34,0.97)", border: `1px solid rgba(212,175,55,0.15)` }}
            />
            <p className="font-inter text-[8px]" style={{ color: "rgba(212,175,55,0.30)" }}>
              Girilirse ortadaki hücrede gösterilir — Shown in center cell if entered
            </p>
          </div>
        </div>

        {/* Rule explanation card */}
        <div className="rounded-xl border px-4 py-3 space-y-1.5"
          style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.18)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
            📜 Hesap Kuralı — Calculation Rule
          </p>
          <div className="space-y-1">
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
              Hane 1–24: <span style={{ color: G.text }}>Ana Sayı × sıra numarası (1, 2, 3 … 24)</span>
            </p>
            {base && base >= 1 && (
              <p className="font-inter text-[9px] mt-1" style={{ color: "rgba(212,175,55,0.55)" }}>
                Örnek: {base}×1={base}, {base}×12={base*12}, {base}×24={base*24}
              </p>
            )}
          </div>
        </div>

        {/* Grid output */}
        <AnimatePresence mode="wait">
          {cells ? (
            <motion.div key={`tanzim-${base}`}
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />
              <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
                ✨ Halî Vasat Tanzim Vefki
              </p>

              <TanzimGrid cells={cells} esmaText={esmaText} />

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-xl px-3 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Ana Sayı</p>
                  <p className="font-amiri text-xl font-bold" style={{ color: G.text }}>{base.toLocaleString()}</p>
                </div>
                <div className="rounded-xl px-3 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>
                    {magicConstant ? "Magic Constant ✓" : "⚠ Dengesiz"}
                  </p>
                  <p className="font-amiri text-sm font-bold leading-tight" style={{ color: magicConstant ? G.text : "rgba(255,100,100,0.80)" }}>
                    {magicConstant ? magicConstant.toLocaleString() : "Hata"}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="tanzim-placeholder"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="rounded-xl border p-8 flex flex-col items-center gap-3"
              style={{ background: "rgba(4,8,24,0.99)", borderColor: "rgba(212,175,55,0.12)" }}
            >
              <motion.span style={{ fontSize: "1.8rem", color: "rgba(212,175,55,0.18)" }}
                animate={{ opacity: [0.12, 0.40, 0.12] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>✨</motion.span>
              <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: "rgba(212,175,55,0.22)" }}>
                Ana sayıyı girerek tanzim vefkini oluşturun
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}