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

// ── Vefk Generation: 5×5 Hâli Vasat Ana Vefk ────────────────────
const HALI_VASAT_5_LAYOUT = [
  [11, 15, 24,  3,  7],
  [ 4,  8, 12, 16, 20],
  [17, 21, null, 9, 13],
  [ 5, 14, 18, 22,  1],
  [23,  2,  6, 10, 19],
];

// talibEffective = raw talibVal, auto-squared if ≤ 40
// specialStart   = talibEffective − 40
// cells 1–19:  anaSayi × position
// cells 20–24: anaSayi × (specialStart, +1, +2, +3, +4)
// magic constant = anaSayi × talibEffective
function computeAnaVasatCells(anaSayi, talibEffective) {
  const cells = {};
  for (let pos = 1; pos <= 19; pos++) {
    cells[pos] = anaSayi * pos;
  }
  const x = talibEffective - 40;
  for (let i = 0; i < 5; i++) {
    cells[20 + i] = anaSayi * (x + i);
  }
  return cells;
}

function buildAnaVasatGrid(anaSayi, talibEffective) {
  if (!anaSayi || anaSayi < 1) return null;
  if (!talibEffective || talibEffective < 41) return null;
  const cells = computeAnaVasatCells(anaSayi, talibEffective);
  return HALI_VASAT_5_LAYOUT.map(row =>
    row.map(pos => (pos === null ? null : cells[pos]))
  );
}

// Row/col/diag sums — null (center) always skipped
function getAnaLineSums(grid) {
  const sum = arr => arr.reduce((a, v) => a + (v === null ? 0 : v), 0);
  const rows = grid.map(r => sum(r));
  const cols = [0,1,2,3,4].map(c => sum(grid.map(r => r[c])));
  const diag1 = sum([grid[0][0], grid[1][1], grid[3][3], grid[4][4]]);
  const diag2 = sum([grid[0][4], grid[1][3], grid[3][1], grid[4][0]]);
  return { rows, cols, diag1, diag2 };
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

// ── Ana Vefk: 5×5 Hâli Vasat ─────────────────────────────────────
function AnaVefk() {
  const [anaSayi,     setAnaSayi]     = useState("");
  const [talibRaw,    setTalibRaw]    = useState("");
  const [grid,        setGrid]        = useState(null);
  const [savedState,  setSavedState]  = useState(null); // { anaSayi, talibEff, talibRaw }
  const [showVerify,  setShowVerify]  = useState(false);

  // ── Field 1
  const anaSayiNum = anaSayi.trim() ? parseInt(anaSayi) : null;

  // ── Field 2: resolve raw → number → auto-square if ≤ 40
  const talibTrimmed   = talibRaw.trim();
  const talibIsNumeric = /^\d+$/.test(talibTrimmed);
  const talibEbced     = (!talibIsNumeric && talibTrimmed) ? calcAbjad(talibTrimmed) : null;
  const talibRawVal    = talibTrimmed ? (talibIsNumeric ? parseInt(talibTrimmed) : talibEbced) : null;
  const wasSquared     = talibRawVal && talibRawVal <= 40;
  const talibEffective = talibRawVal ? (wasSquared ? talibRawVal * talibRawVal : talibRawVal) : null;

  const specialStart   = talibEffective ? talibEffective - 40 : null;

  const anaSayiValid = anaSayiNum && anaSayiNum >= 1;
  const talibValid   = talibEffective && talibEffective >= 41;
  const canGenerate  = anaSayiValid && talibValid;

  const handleGenerate = () => {
    if (!canGenerate) return;
    const g = buildAnaVasatGrid(anaSayiNum, talibEffective);
    if (!g) return;
    setGrid(g);
    setSavedState({ anaSayi: anaSayiNum, talibEff: talibEffective, talibRaw: talibTrimmed });
    setShowVerify(false);
  };

  // Magic constant = anaSayi × talibEffective (from saved state)
  const magicConst = savedState ? savedState.anaSayi * savedState.talibEff : null;

  const isBalanced = useMemo(() => {
    if (!grid || !magicConst) return false;
    const { rows, cols, diag1, diag2 } = getAnaLineSums(grid);
    return rows.every(r => r === magicConst) && cols.every(c => c === magicConst) &&
           diag1 === magicConst && diag2 === magicConst;
  }, [grid, magicConst]);

  return (
    <div className="space-y-4">
      {/* Input card */}
      <div className="rounded-2xl border p-5 space-y-4"
        style={{ background: "rgba(6,12,32,0.97)", borderColor: G.borderHi, boxShadow: `0 0 28px ${G.glow}` }}>

        {/* Header */}
        <div className="text-center space-y-1">
          <motion.div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl border border-yellow-500/25 mb-1"
            style={{ background: "linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)", boxShadow: "0 0 22px rgba(212,175,55,0.18)" }}>
            <span className="font-amiri text-lg" style={{ color: "#D4AF37" }}>📜</span>
          </motion.div>
          <motion.h2 className="font-amiri text-2xl font-bold" style={{ color: G.text }}
            animate={{ textShadow: [`0 0 14px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 14px ${G.glow}`] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>الأصل</motion.h2>
          <p className="font-inter text-[10px] font-bold text-white">ANA VEFK</p>
          <p className="font-inter text-[9px] uppercase tracking-[0.22em]" style={{ color: G.dim }}>Hâli Vasat — Havâss'ın Derinlikleri</p>
          <GoldDivider />
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.30)" }}>5×5 Empty Center — Ottoman Manuscript Method</p>
        </div>

        {/* Ana Sayı */}
        <div className="rounded-xl border px-4 py-3 space-y-1.5"
          style={{ background: "rgba(4,10,28,0.99)", borderColor: G.border }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>1️⃣ Ana Sayı — الرقم الأساسي</p>
          <input type="text" inputMode="numeric" value={anaSayi}
            onChange={e => setAnaSayi(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="Sayı girin... (örn: 66, 114, 786)"
            className="w-full rounded-xl px-4 py-2.5 font-amiri text-2xl text-center text-white font-bold focus:outline-none caret-white placeholder:text-white/25"
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}` }} />
        </div>

        {/* Talib / Mathlub */}
        <div className="rounded-xl border px-4 py-3 space-y-1.5"
          style={{ background: "rgba(4,10,28,0.99)", borderColor: "rgba(212,175,55,0.20)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>2️⃣ Talib / Mathlub İsmi — اسم الطالب / المطلوب</p>
          <input type="text" value={talibRaw} onChange={e => setTalibRaw(e.target.value)}
            placeholder="İsim / Esma / الله / 786..."
            dir="rtl"
            className="w-full rounded-xl px-4 py-2 font-amiri text-lg text-white text-right focus:outline-none caret-white placeholder:text-white/25"
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid rgba(212,175,55,0.15)` }} />

          {/* Ebced result */}
          {talibEbced !== null && talibEbced > 0 && (
            <p className="font-inter text-[9px]" style={{ color: "rgba(212,175,55,0.65)" }}>
              ✦ Ebced: <span className="font-amiri font-bold" style={{ color: G.text }}>{talibEbced.toLocaleString()}</span>
            </p>
          )}

          {/* Auto-square notice */}
          {wasSquared && talibRawVal && talibEffective && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-inter text-[9px]" style={{ color: "rgba(212,175,55,0.75)" }}>
              ✦ {talibRawVal} ≤ 40 → karesi alındı: <span className="font-amiri font-bold" style={{ color: G.text }}>{talibRawVal}² = {talibEffective.toLocaleString()}</span>
            </motion.p>
          )}

          {/* Effective value + sequence preview */}
          {talibEffective && talibEffective >= 41 && specialStart && (
            <div className="rounded-lg px-3 py-2 space-y-1" style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)" }}>
              <p className="font-inter text-[9px]" style={{ color: G.dim }}>
                Efektif Talib: <span className="font-amiri font-bold" style={{ color: G.text }}>{talibEffective.toLocaleString()}</span>
                <span style={{ color: "rgba(212,175,55,0.40)" }}> — SpecialStart = {talibEffective}−40 = {specialStart}</span>
              </p>
              <p className="font-inter text-[9px]" style={{ color: "rgba(212,175,55,0.45)" }}>
                20→24 dizisi: <span className="font-amiri" style={{ color: G.text }}>
                  {[0,1,2,3,4].map(i => specialStart + i).join(", ")}
                </span>
              </p>
            </div>
          )}
          {talibEffective && talibEffective < 41 && (
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,100,100,0.70)" }}>⚠ Efektif değer 41'den büyük olmalı</p>
          )}
          {!talibTrimmed && (
            <p className="font-inter text-[8px]" style={{ color: "rgba(212,175,55,0.30)" }}>Sayı → doğrudan · Metin/Esma → Ebced · ≤40 → kare</p>
          )}
        </div>

        {/* Rule explanation */}
        <div className="rounded-xl border px-4 py-3 space-y-1.5"
          style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.18)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>📜 Hesap Kuralı</p>
          <div className="space-y-1">
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
              Hane 1–19: <span style={{ color: G.text }}>Ana Sayı × Tabii Konum</span>
            </p>
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
              Hane 20–24: <span style={{ color: G.text }}>Ana Sayı × (Talib−40, +1, +2, +3, +4)</span>
            </p>
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
              Magic Constant: <span style={{ color: G.text }}>Ana Sayı × Efektif Talib</span>
            </p>
            {anaSayiNum && talibEffective && talibEffective >= 41 && (
              <p className="font-inter text-[9px] mt-1" style={{ color: "rgba(212,175,55,0.55)" }}>
                {anaSayiNum} × {talibEffective} = {(anaSayiNum * talibEffective).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <motion.button onClick={handleGenerate} disabled={!canGenerate}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl font-inter font-semibold text-sm text-[#0d1b2a] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg,#fcd34d,#d97706)", boxShadow: `0 0 24px ${G.glowHi}` }}>
          ✨ Hâli Vasat Ana Vefki Oluştur
        </motion.button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {grid && savedState ? (
          <motion.div key={`hali-vasat-${savedState.anaSayi}-${savedState.talibEff}`}
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border p-5 space-y-4"
            style={{ background: "rgba(4,8,24,0.99)", borderColor: G.borderHi, boxShadow: `0 0 32px ${G.glow}` }}
          >
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl px-2 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                <p className="font-inter text-[7px] uppercase tracking-widest" style={{ color: G.dim }}>Ana Sayı</p>
                <p className="font-amiri text-lg font-bold leading-tight" style={{ color: G.text }}>{savedState.anaSayi.toLocaleString()}</p>
              </div>
              <div className="rounded-xl px-2 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                <p className="font-inter text-[7px] uppercase tracking-widest" style={{ color: G.dim }}>Efektif Talib</p>
                <p className="font-amiri text-lg font-bold leading-tight" style={{ color: G.text }}>{savedState.talibEff.toLocaleString()}</p>
              </div>
              <div className="rounded-xl px-2 py-2" style={{ background: "rgba(212,175,55,0.06)", border: `1px solid ${isBalanced ? "rgba(80,200,80,0.30)" : "rgba(255,80,80,0.30)"}` }}>
                <p className="font-inter text-[7px] uppercase tracking-widest" style={{ color: G.dim }}>{isBalanced ? "Magic ✓" : "⚠ Hata"}</p>
                <p className="font-amiri text-sm font-bold leading-tight" style={{ color: isBalanced ? G.text : "rgba(255,100,100,0.80)" }}>
                  {magicConst?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* 20–24 sequence */}
            {savedState.talibEff >= 41 && (
              <div className="rounded-xl border px-3 py-2" style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.18)" }}>
                <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>🔢 20→24 Dizisi</p>
                <div className="flex gap-2 flex-wrap">
                  {[0,1,2,3,4].map(i => {
                    const seq = savedState.talibEff - 40 + i;
                    return (
                      <div key={i} className="rounded-lg px-2 py-1 text-center" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)" }}>
                        <p className="font-inter text-[7px]" style={{ color: G.dim }}>Hane {20+i}</p>
                        <p className="font-amiri text-xs font-bold" style={{ color: G.text }}>×{seq}</p>
                        <p className="font-amiri text-xs" style={{ color: "rgba(212,175,55,0.60)" }}>{(savedState.anaSayi * seq).toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <GoldDivider />
            <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
              🜂 5×5 Hâli Vasat Ana Vefk — المربع الخماسي
            </p>

            {/* 5×5 Grid */}
            <div className="flex justify-center overflow-x-auto">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 58px)", gap: "4px" }}>
                {grid.flat().map((val, idx) => {
                  const isEmpty = val === null;
                  const display = isEmpty ? null : val.toLocaleString();
                  const fontSize = display && display.length > 9 ? "7px"
                    : display && display.length > 6 ? "9px"
                    : display && display.length > 4 ? "11px" : "13px";
                  return (
                    <motion.div key={idx}
                      initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.018, duration: 0.22 }}
                      className="rounded-lg border flex flex-col items-center justify-center"
                      style={{
                        width: 58, height: 58,
                        background: isEmpty ? "rgba(212,175,55,0.04)" : "rgba(212,175,55,0.10)",
                        borderColor: isEmpty ? "rgba(212,175,55,0.18)" : "rgba(212,175,55,0.45)",
                        boxShadow: isEmpty ? "none" : "inset 0 0 8px rgba(212,175,55,0.12)",
                      }}>
                      {isEmpty ? (
                        <div className="flex items-center justify-center w-full h-full px-1">
                          {savedState.talibRaw ? (
                            <p className="font-amiri text-center leading-tight"
                              style={{ color: G.text, fontSize: savedState.talibRaw.length > 8 ? "8px" : "10px" }}
                              dir="rtl">{savedState.talibRaw}</p>
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

            {/* Magic constant */}
            {isBalanced && magicConst && (
              <div className="rounded-xl border p-3 text-center"
                style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.25)" }}>
                <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                  ⚖ Kutsal Sabit — {savedState.anaSayi} × {savedState.talibEff}
                </p>
                <motion.p className="font-amiri text-3xl font-bold mt-1" style={{ color: G.text }}
                  animate={{ textShadow: [`0 0 12px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 12px ${G.glow}`] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                  {magicConst.toLocaleString()}
                </motion.p>
              </div>
            )}

            {/* Verification toggle */}
            <button onClick={() => setShowVerify(v => !v)}
              className="w-full rounded-xl py-2 font-inter text-[9px] uppercase tracking-widest transition-all"
              style={{
                background: showVerify ? "rgba(212,175,55,0.10)" : "rgba(212,175,55,0.04)",
                border: `1px solid ${showVerify ? "rgba(212,175,55,0.40)" : "rgba(212,175,55,0.15)"}`,
                color: showVerify ? G.text : G.dim,
              }}>
              {showVerify ? "▲ Doğrulamayı Gizle" : "▼ Satır/Sütun/Köşegen Doğrula"}
            </button>

            <AnimatePresence>
              {showVerify && (
                <motion.div key="verify-ana"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}>
                  <AnaVerificationPanel grid={grid} magicConst={magicConst} />
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        ) : (
          <motion.div key="hali-placeholder"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="rounded-xl border p-8 flex flex-col items-center gap-3"
            style={{ background: "rgba(4,8,24,0.99)", borderColor: "rgba(212,175,55,0.12)" }}>
            <motion.span style={{ fontSize: "1.8rem", color: "rgba(212,175,55,0.18)" }}
              animate={{ opacity: [0.12, 0.40, 0.12] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>📜</motion.span>
            <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: "rgba(212,175,55,0.22)" }}>
              Ana sayı ve Talib değerini girerek vefki oluşturun
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnaVerificationPanel({ grid, magicConst }) {
  const { rows, cols, diag1, diag2 } = getAnaLineSums(grid);
  const Check = ({ label, value }) => {
    const ok = value === magicConst;
    return (
      <div className="flex items-center justify-between rounded-lg px-3 py-1.5"
        style={{ background: ok ? "rgba(80,200,80,0.06)" : "rgba(255,80,80,0.06)", border: `1px solid ${ok ? "rgba(80,200,80,0.20)" : "rgba(255,80,80,0.20)"}` }}>
        <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-amiri text-sm font-bold" style={{ color: ok ? "#86efac" : "rgba(255,120,120,0.90)" }}>{value.toLocaleString()}</span>
          <span style={{ fontSize: "10px" }}>{ok ? "✓" : "✗"}</span>
        </div>
      </div>
    );
  };
  return (
    <div className="rounded-xl border p-4 space-y-2 mt-2"
      style={{ background: "rgba(4,8,24,0.99)", borderColor: "rgba(212,175,55,0.22)" }}>
      <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>⚖ Satır / Sütun / Köşegen</p>
      <div className="grid grid-cols-1 gap-1.5">
        {rows.map((r, i) => <Check key={`r${i}`} label={`Satır ${i+1}`} value={r} />)}
        {cols.map((c, i) => <Check key={`c${i}`} label={`Sütun ${i+1}`} value={c} />)}
        <Check label="Köşegen ↘" value={diag1} />
        <Check label="Köşegen ↗" value={diag2} />
      </div>
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