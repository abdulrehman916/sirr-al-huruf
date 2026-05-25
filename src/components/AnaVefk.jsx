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

const ABJAD_MAP = {
  'ا':1,'أ':1,'إ':1,'آ':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,
  'ي':10,'ى':10,'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,
  'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000,
};
function calcAbjad(t) {
  return [...t].reduce((s, c) => s + (ABJAD_MAP[c] || 0), 0);
}

// Tabii sıralama — null = center (mathematically empty)
const LAYOUT = [
  [11, 15, 24,  3,  7],
  [ 4,  8, 12, 16, 20],
  [17, 21, null, 9, 13],
  [ 5, 14, 18, 22,  1],
  [23,  2,  6, 10, 19],
];

// Build cell map:
// pos 1–19 → anaSayi × pos
// pos 20–24 → anaSayi × (specialStart + offset)
// specialStart = talibEffective − 40
function computeCells(anaSayi, talibEffective) {
  const cells = {};
  for (let pos = 1; pos <= 19; pos++) {
    cells[pos] = anaSayi * pos;
  }
  const x = talibEffective - 40;
  cells[20] = anaSayi * x;
  cells[21] = anaSayi * (x + 1);
  cells[22] = anaSayi * (x + 2);
  cells[23] = anaSayi * (x + 3);
  cells[24] = anaSayi * (x + 4);
  return cells;
}

function getLineSums(cells) {
  const sum = (positions) => positions.reduce((a, p) => a + (p === null ? 0 : cells[p]), 0);
  const rows = LAYOUT.map(row => sum(row));
  const cols = [0,1,2,3,4].map(c => sum(LAYOUT.map(row => row[c])));
  const diag1 = sum([LAYOUT[0][0], LAYOUT[1][1], LAYOUT[3][3], LAYOUT[4][4]]);
  const diag2 = sum([LAYOUT[0][4], LAYOUT[1][3], LAYOUT[3][1], LAYOUT[4][0]]);
  return { rows, cols, diag1, diag2 };
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2">
      <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${G.borderHi})` }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.text }} />
      <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${G.borderHi})` }} />
    </div>
  );
}

function VefkGrid({ cells, centerDisplay }) {
  const cellW = 58;
  return (
    <div className="flex justify-center overflow-x-auto">
      <div style={{ display: "grid", gridTemplateColumns: `repeat(5, ${cellW}px)`, gap: "4px" }}>
        {LAYOUT.flat().map((pos, idx) => {
          const isEmpty = pos === null;
          const val = isEmpty ? null : cells[pos];
          const display = val != null ? val.toLocaleString() : null;
          const fontSize = display && display.length > 9 ? "7px"
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
                  {centerDisplay ? (
                    <p className="font-amiri text-center leading-tight"
                      style={{ color: G.text, fontSize: centerDisplay.length > 8 ? "8px" : "10px" }}
                      dir="rtl">{centerDisplay}</p>
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

function VerificationPanel({ cells, magicConst }) {
  const { rows, cols, diag1, diag2 } = getLineSums(cells);
  const Check = ({ label, value }) => {
    const ok = value === magicConst;
    return (
      <div className="flex items-center justify-between rounded-lg px-3 py-1.5"
        style={{ background: ok ? "rgba(80,200,80,0.06)" : "rgba(255,80,80,0.06)", border: `1px solid ${ok ? "rgba(80,200,80,0.20)" : "rgba(255,80,80,0.20)"}` }}>
        <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-amiri text-sm font-bold" style={{ color: ok ? "#86efac" : "rgba(255,120,120,0.90)" }}>
            {value.toLocaleString()}
          </span>
          <span style={{ fontSize: "10px" }}>{ok ? "✓" : "✗"}</span>
        </div>
      </div>
    );
  };
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="rounded-xl border p-4 space-y-2"
      style={{ background: "rgba(4,8,24,0.99)", borderColor: "rgba(212,175,55,0.22)" }}>
      <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
        ⚖ Satır / Sütun / Köşegen — Verification
      </p>
      <div className="grid grid-cols-1 gap-1.5">
        {rows.map((r, i) => <Check key={`r${i}`} label={`Satır ${i + 1}`} value={r} />)}
        {cols.map((c, i) => <Check key={`c${i}`} label={`Sütun ${i + 1}`} value={c} />)}
        <Check label="Köşegen ↘" value={diag1} />
        <Check label="Köşegen ↗" value={diag2} />
      </div>
    </motion.div>
  );
}

export default function AnaVefk() {
  const [mode, setMode] = useState("normal"); // "normal" | "muahhir"
  const [anaSayi,  setAnaSayi]  = useState("");
  const [talibRaw, setTalibRaw] = useState("");
  const [cells,    setCells]    = useState(null);
  const [savedAna, setSavedAna] = useState(null);
  const [savedTalibEff, setSavedTalibEff] = useState(null);
  const [showVerify, setShowVerify] = useState(false);

  // Resolve Ana Sayı
  const anaSayiNum = anaSayi.trim() ? parseInt(anaSayi) : null;

  // Resolve Talib raw → number (direct numeric) or Ebced (Arabic text)
  // ANA VEFK RULE: NO auto-squaring. Value is used exactly as resolved.
  const talibTrimmed   = talibRaw.trim();
  const talibIsNumeric = /^\d+$/.test(talibTrimmed);
  const talibEbced     = (!talibIsNumeric && talibTrimmed) ? calcAbjad(talibTrimmed) : null;
  const talibEffective = talibTrimmed
    ? (talibIsNumeric ? parseInt(talibTrimmed) : talibEbced)
    : null;

  // specialStart = talibEffective − 40 (must be ≥ 1, so talibEffective must be ≥ 41)
  const specialStart = talibEffective ? talibEffective - 40 : null;

  // Validation
  const anaSayiValid = anaSayiNum && anaSayiNum >= 1;
  const talibValid   = talibEffective && talibEffective >= 41;
  const canGenerate  = anaSayiValid && talibValid;

  // Magic constant = anaSayi × talibEffective
  const magicConst = (savedAna && savedTalibEff) ? savedAna * savedTalibEff : null;

  const isBalanced = useMemo(() => {
    if (!cells || !magicConst) return false;
    const { rows, cols, diag1, diag2 } = getLineSums(cells);
    return rows.every(r => r === magicConst) &&
           cols.every(c => c === magicConst) &&
           diag1 === magicConst && diag2 === magicConst;
  }, [cells, magicConst]);

  const handleGenerate = () => {
    if (!canGenerate || !talibEffective) return;
    const c = computeCells(anaSayiNum, talibEffective);
    setCells(c);
    setSavedAna(anaSayiNum);
    setSavedTalibEff(talibEffective);
    setShowVerify(false);
  };

  const isMuahhir = mode === "muahhir";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-5 space-y-4"
        style={{ background: "rgba(6,12,32,0.97)", borderColor: isMuahhir ? "rgba(200,60,60,0.60)" : G.borderHi, boxShadow: `0 0 28px ${isMuahhir ? "rgba(200,60,60,0.20)" : G.glow}` }}>

        {/* Header */}
        <div className="text-center space-y-1">
          <motion.div
            className="inline-flex items-center justify-center w-11 h-11 rounded-2xl border mb-1"
            style={{
              background: "linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)",
              borderColor: isMuahhir ? "rgba(200,60,60,0.35)" : "rgba(212,175,55,0.25)",
              boxShadow: "0 0 22px rgba(212,175,55,0.18)"
            }}
          >
            <span className="font-amiri text-lg">{isMuahhir ? "🔻" : "📜"}</span>
          </motion.div>
          <motion.h2 className="font-amiri text-2xl font-bold" style={{ color: G.text }}
            animate={{ textShadow: [`0 0 14px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 14px ${G.glow}`] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            {isMuahhir ? "المؤخِّر" : "الأصل"}
          </motion.h2>
          <p className="font-inter text-[10px] font-bold text-white">
            {isMuahhir ? "MUAHHIR ANA VEFK" : "ANA VEFK"}
          </p>
          <p className="font-inter text-[9px] uppercase tracking-[0.22em]" style={{ color: G.dim }}>
            Hâli Vasat Beşli System
          </p>
          <GoldDivider />
        </div>

        {/* Mode toggle */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "normal",  label: "✦ Normal", arabic: "الإيجابي" },
            { id: "muahhir", label: "🔻 Muahhir", arabic: "المؤخِّر" },
          ].map(m => {
            const active = mode === m.id;
            const isMu = m.id === "muahhir";
            return (
              <button key={m.id} onClick={() => setMode(m.id)}
                className="rounded-xl py-2 px-3 flex flex-col items-center gap-0.5 border transition-all"
                style={{
                  background: active ? (isMu ? "rgba(200,60,60,0.12)" : G.bg) : "rgba(4,12,34,0.97)",
                  borderColor: active ? (isMu ? "rgba(200,60,60,0.50)" : G.borderHi) : "rgba(255,255,255,0.08)",
                  boxShadow: active ? `0 0 14px ${isMu ? "rgba(200,60,60,0.18)" : G.glow}` : "none",
                }}>
                <span className="font-inter text-[10px] font-bold"
                  style={{ color: active ? (isMu ? "#f87171" : G.text) : "rgba(255,255,255,0.40)" }}>
                  {m.label}
                </span>
                <span className="font-amiri text-xs"
                  style={{ color: active ? (isMu ? "rgba(248,113,113,0.70)" : "rgba(212,175,55,0.70)") : "rgba(255,255,255,0.20)" }}>
                  {m.arabic}
                </span>
              </button>
            );
          })}
        </div>

        {/* Ana Sayı */}
        <div className="rounded-xl border px-4 py-3 space-y-1.5"
          style={{ background: "rgba(4,10,28,0.99)", borderColor: G.border }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
            1️⃣ Ana Sayı — الرقم الأساسي
          </p>
          <input
            type="text" inputMode="numeric"
            value={anaSayi}
            onChange={e => setAnaSayi(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="Sayı girin... (örn: 66, 114, 252)"
            className="w-full rounded-xl px-4 py-2.5 font-amiri text-2xl text-center text-white font-bold focus:outline-none caret-white placeholder:text-white/25"
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}` }}
          />
        </div>

        {/* Talib / Esma */}
        <div className="rounded-xl border px-4 py-3 space-y-1.5"
          style={{ background: "rgba(4,10,28,0.99)", borderColor: "rgba(212,175,55,0.20)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
            {isMuahhir ? "2️⃣ Esma / Mathlub — اسم المطلوب" : "2️⃣ Talib / Mathlub İsmi — اسم الطالب"}
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
          {/* Ebced display */}
          {talibEbced !== null && talibEbced > 0 && (
            <p className="font-inter text-[9px]" style={{ color: "rgba(212,175,55,0.65)" }}>
              ✦ Ebced: <span className="font-amiri font-bold" style={{ color: G.text }}>{talibEbced.toLocaleString()}</span>
            </p>
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
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,100,100,0.70)" }}>⚠ Talib değeri 41'den büyük olmalı</p>
          )}
          {!talibTrimmed && (
            <p className="font-inter text-[8px]" style={{ color: "rgba(212,175,55,0.30)" }}>
              Sayı → doğrudan kullanılır · Metin/Esma → Ebced hesaplanır
            </p>
          )}
        </div>

        {/* Rule card */}
        <div className="rounded-xl border px-4 py-3 space-y-1"
          style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.18)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
            📜 Hesap Kuralı
          </p>
          <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
            Hane 1–19: <span style={{ color: G.text }}>Ana Sayı × konum</span>
          </p>
          <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
            Hane 20–24: <span style={{ color: G.text }}>Ana Sayı × SpecialStart(+0..+4)</span>
          </p>
          <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
            Magic Constant: <span style={{ color: G.text }}>Ana Sayı × Talib Efektif</span>
          </p>
          {canGenerate && anaSayiNum && talibEffective && (
            <p className="font-inter text-[9px] mt-1" style={{ color: "rgba(212,175,55,0.55)" }}>
              {anaSayiNum} × {talibEffective} = {(anaSayiNum * talibEffective).toLocaleString()}
            </p>
          )}
        </div>

        <motion.button
          onClick={handleGenerate}
          disabled={!canGenerate}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl font-inter font-semibold text-sm text-[#0d1b2a] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: isMuahhir
              ? "linear-gradient(135deg,#f87171,#b91c1c)"
              : "linear-gradient(135deg,#fcd34d,#d97706)",
            boxShadow: `0 0 24px ${isMuahhir ? "rgba(200,60,60,0.45)" : G.glowHi}`
          }}
        >
          {isMuahhir ? "🔻 Muahhir Vefki Oluştur" : "✨ Hâli Vasat Vefki Oluştur"}
        </motion.button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {cells && savedAna && savedTalibEff ? (
          <motion.div
            key={`ana-vefk-${savedAna}-${savedTalibEff}`}
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border p-5 space-y-4"
            style={{
              background: "rgba(4,8,24,0.99)",
              borderColor: isMuahhir ? "rgba(200,60,60,0.50)" : G.borderHi,
              boxShadow: `0 0 32px ${isMuahhir ? "rgba(200,60,60,0.18)" : G.glow}`
            }}
          >
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl px-2 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                <p className="font-inter text-[7px] uppercase tracking-widest" style={{ color: G.dim }}>Ana Sayı</p>
                <p className="font-amiri text-lg font-bold" style={{ color: G.text }}>{savedAna.toLocaleString()}</p>
              </div>
              <div className="rounded-xl px-2 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                <p className="font-inter text-[7px] uppercase tracking-widest" style={{ color: G.dim }}>Talib Efektif</p>
                <p className="font-amiri text-lg font-bold" style={{ color: G.text }}>{savedTalibEff.toLocaleString()}</p>
              </div>
              <div className="rounded-xl px-2 py-2" style={{ background: "rgba(212,175,55,0.06)", border: `1px solid ${isBalanced ? "rgba(80,200,80,0.30)" : "rgba(255,80,80,0.30)"}` }}>
                <p className="font-inter text-[7px] uppercase tracking-widest" style={{ color: G.dim }}>
                  {isBalanced ? "Magic ✓" : "⚠ Hata"}
                </p>
                <p className="font-amiri text-sm font-bold leading-tight" style={{ color: isBalanced ? G.text : "rgba(255,100,100,0.80)" }}>
                  {magicConst?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Sequence info */}
            <div className="rounded-xl border px-3 py-2 space-y-1"
              style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.18)" }}>
              <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>
                20→24 Özel Dizisi — SpecialStart = {savedTalibEff}−40 = {savedTalibEff - 40}
              </p>
              <div className="flex gap-2 flex-wrap">
                {[0,1,2,3,4].map(i => {
                  const pos = 20 + i;
                  const seq = savedTalibEff - 40 + i;
                  return (
                    <span key={i} className="font-inter text-[9px] rounded px-2 py-0.5"
                      style={{ background: "rgba(212,175,55,0.10)", color: G.text, border: "1px solid rgba(212,175,55,0.25)" }}>
                      {pos}: {savedAna}×{seq}={cells[pos].toLocaleString()}
                    </span>
                  );
                })}
              </div>
            </div>

            <GoldDivider />
            <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
              🜂 5×5 Hâli Vasat — {isMuahhir ? "Muahhir" : "Ana Vefk"}
            </p>

            <VefkGrid cells={cells} centerDisplay={talibTrimmed || null} />

            {/* Magic constant */}
            {isBalanced && magicConst && (
              <div className="rounded-xl border p-3 text-center"
                style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.25)" }}>
                <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                  ⚖ Kutsal Sabit — {savedAna} × {savedTalibEff}
                </p>
                <motion.p className="font-amiri text-3xl font-bold mt-1" style={{ color: G.text }}
                  animate={{ textShadow: [`0 0 12px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 12px ${G.glow}`] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                  {magicConst.toLocaleString()}
                </motion.p>
              </div>
            )}

            {/* Verification toggle */}
            <button
              onClick={() => setShowVerify(v => !v)}
              className="w-full rounded-xl py-2 font-inter text-[9px] uppercase tracking-widest transition-all"
              style={{
                background: showVerify ? "rgba(212,175,55,0.10)" : "rgba(212,175,55,0.04)",
                border: `1px solid ${showVerify ? "rgba(212,175,55,0.40)" : "rgba(212,175,55,0.15)"}`,
                color: showVerify ? G.text : G.dim,
              }}
            >
              {showVerify ? "▲ Doğrulamayı Gizle" : "▼ Satır/Sütun/Köşegen Doğrula"}
            </button>

            <AnimatePresence>
              {showVerify && (
                <motion.div key="verify"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}>
                  <VerificationPanel cells={cells} magicConst={magicConst} />
                </motion.div>
              )}
            </AnimatePresence>
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
              Ana sayı ve talib girerek vefki oluşturun
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}