import { useState } from "react";
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

// ── Fixed Ottoman layout — null = center (mathematically empty) ──
const LAYOUT = [
  [11, 15, 24,  3,  7],
  [ 4,  8, 12, 16, 20],
  [17, 21, null, 9, 13],
  [ 5, 14, 18, 22,  1],
  [23,  2,  6, 10, 19],
];

// ── Hâli Vasat 2. Usûl cell formula ─────────────────────────────
// Cells 1–19: BASE × tabii position
// Cells 20–24: (BASE − 40 + offset) × BASE
//   20 → (BASE−40) × BASE
//   21 → (BASE−39) × BASE
//   ...
//   24 → (BASE−36) × BASE
function computeCells(base) {
  const cells = {};
  for (let pos = 1; pos <= 19; pos++) {
    cells[pos] = base * pos;
  }
  const x = base - 40;
  for (let i = 0; i <= 4; i++) {
    cells[20 + i] = (x + i) * base;
  }
  return cells;
}

function getLineSums(cells) {
  const sum = (positions) => positions.reduce((a, p) => a + (p === null ? 0 : cells[p]), 0);
  const rows  = LAYOUT.map(row => sum(row));
  const cols  = [0,1,2,3,4].map(c => sum(LAYOUT.map(row => row[c])));
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

function VefkGrid({ cells, centerText }) {
  const cellW = 58;
  return (
    <div className="flex justify-center overflow-x-auto">
      <div style={{ display: "grid", gridTemplateColumns: `repeat(5, ${cellW}px)`, gap: "4px" }}>
        {LAYOUT.flat().map((pos, idx) => {
          const isEmpty = pos === null;
          const val     = isEmpty ? null : cells[pos];
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
                  {centerText ? (
                    <p className="font-amiri text-center leading-tight"
                      style={{ color: G.text, fontSize: centerText.length > 8 ? "8px" : "10px" }}
                      dir="rtl">{centerText}</p>
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
                    [{pos}]
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
        ⚖ Doğrulama — Kutsal Sabit: {magicConst.toLocaleString()}
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

export default function HaliVasat2Usul() {
  const [baseRaw,    setBaseRaw]    = useState("");
  const [centerText, setCenterText] = useState("");
  const [cells,      setCells]      = useState(null);
  const [savedBase,  setSavedBase]  = useState(null);
  const [showVerify, setShowVerify] = useState(false);

  const baseNum = baseRaw.trim() ? parseInt(baseRaw.trim()) : null;
  const canGenerate = baseNum && baseNum > 40;

  // Magic Constant = BASE²
  const magicConst = savedBase ? savedBase * savedBase : null;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setCells(computeCells(baseNum));
    setSavedBase(baseNum);
    setShowVerify(false);
  };

  const x = savedBase ? savedBase - 40 : null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-5 space-y-4"
        style={{ background: "rgba(6,12,32,0.97)", borderColor: G.borderHi, boxShadow: `0 0 28px ${G.glow}` }}>

        {/* Header */}
        <div className="text-center space-y-1">
          <motion.div
            className="inline-flex items-center justify-center w-11 h-11 rounded-2xl border mb-1"
            style={{ background: "linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)", borderColor: "rgba(212,175,55,0.25)", boxShadow: "0 0 22px rgba(212,175,55,0.18)" }}
          >
            <span className="font-amiri text-lg">⬡</span>
          </motion.div>
          <motion.h2 className="font-amiri text-2xl font-bold" style={{ color: G.text }}
            animate={{ textShadow: [`0 0 14px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 14px ${G.glow}`] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            الوسط الحالي
          </motion.h2>
          <p className="font-inter text-[10px] font-bold text-white">HÂLİ VASAT — 2. USÛL</p>
          <p className="font-inter text-[9px] uppercase tracking-[0.22em]" style={{ color: G.dim }}>
            Tek Sayı Sistemi · BASE²
          </p>
          <GoldDivider />
        </div>

        {/* Base Number input */}
        <div className="rounded-xl border px-4 py-3 space-y-1.5"
          style={{ background: "rgba(4,10,28,0.99)", borderColor: G.border }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
            1️⃣ Base Sayı — الرقم الأساسي
          </p>
          <input
            type="text" inputMode="numeric"
            value={baseRaw}
            onChange={e => setBaseRaw(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="Sayı girin... (örn: 120)"
            className="w-full rounded-xl px-4 py-2.5 font-amiri text-2xl text-center text-white font-bold focus:outline-none caret-white placeholder:text-white/25"
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}` }}
          />
          {baseNum && baseNum > 40 && (
            <div className="rounded-lg px-3 py-2 space-y-1" style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)" }}>
              <p className="font-inter text-[9px]" style={{ color: G.dim }}>
                BASE − 40 = <span className="font-amiri font-bold" style={{ color: G.text }}>{baseNum} − 40 = {baseNum - 40}</span>
              </p>
              <p className="font-inter text-[9px]" style={{ color: "rgba(212,175,55,0.45)" }}>
                20→24 dizisi: <span className="font-amiri" style={{ color: G.text }}>
                  {[0,1,2,3,4].map(i => `${baseNum - 40 + i}×${baseNum}`).join(", ")}
                </span>
              </p>
              <p className="font-inter text-[9px]" style={{ color: "rgba(212,175,55,0.45)" }}>
                Kutsal Sabit: <span className="font-amiri font-bold" style={{ color: G.text }}>{baseNum}² = {(baseNum * baseNum).toLocaleString()}</span>
              </p>
            </div>
          )}
          {baseNum && baseNum <= 40 && (
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,160,80,0.80)" }}>
              ⚠ Base sayısı 40'tan büyük olmalı
            </p>
          )}
        </div>

        {/* Center cell text (visual only) */}
        <div className="rounded-xl border px-4 py-3 space-y-1.5"
          style={{ background: "rgba(4,10,28,0.99)", borderColor: "rgba(212,175,55,0.15)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
            2️⃣ Merkez Hücre Metni (İsteğe Bağlı)
          </p>
          <input
            type="text"
            value={centerText}
            onChange={e => setCenterText(e.target.value)}
            placeholder="الله / Vedud / ..."
            dir="rtl"
            className="w-full rounded-xl px-4 py-2 font-amiri text-lg text-white text-right focus:outline-none caret-white placeholder:text-white/25"
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid rgba(212,175,55,0.12)` }}
          />
          <p className="font-inter text-[8px]" style={{ color: "rgba(212,175,55,0.30)" }}>
            Sadece görsel — hesaplara dahil değil
          </p>
        </div>

        {/* Rule card */}
        <div className="rounded-xl border px-4 py-3 space-y-1"
          style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.18)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
            📜 Hesap Kuralı — 2. Usûl
          </p>
          <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
            Hane 1–19: <span style={{ color: G.text }}>BASE × tabii konum</span>
          </p>
          <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
            Hane 20–24: <span style={{ color: G.text }}>(BASE−40+i) × BASE</span>
          </p>
          <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
            Kutsal Sabit: <span style={{ color: G.text }}>BASE²</span>
          </p>
        </div>

        <motion.button
          onClick={handleGenerate}
          disabled={!canGenerate}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl font-inter font-semibold text-sm text-[#0d1b2a] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg,#fcd34d,#d97706)", boxShadow: `0 0 24px ${G.glowHi}` }}
        >
          ⬡ Hâli Vasat 2. Usûl Vefkini Oluştur
        </motion.button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {cells && savedBase ? (
          <motion.div
            key={`hv2-${savedBase}`}
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border p-5 space-y-4"
            style={{ background: "rgba(4,8,24,0.99)", borderColor: G.borderHi, boxShadow: `0 0 32px ${G.glow}` }}
          >
            {/* Step summary */}
            <div className="rounded-xl border px-4 py-3 space-y-1.5"
              style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.18)" }}>
              <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                📐 Adım Özeti
              </p>
              <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                Base: <span className="font-amiri font-bold" style={{ color: G.text }}>{savedBase.toLocaleString()}</span>
              </p>
              <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                BASE − 40 = <span className="font-amiri font-bold" style={{ color: G.text }}>{x}</span>
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {[0,1,2,3,4].map(i => (
                  <span key={i} className="font-inter text-[9px] rounded px-2 py-0.5"
                    style={{ background: "rgba(212,175,55,0.10)", color: G.text, border: "1px solid rgba(212,175,55,0.25)" }}>
                    {20+i}: ({x+i})×{savedBase} = {cells[20+i].toLocaleString()}
                  </span>
                ))}
              </div>
            </div>

            <GoldDivider />
            <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
              ⬡ 5×5 Hâli Vasat — 2. Usûl
            </p>

            <VefkGrid cells={cells} centerText={centerText || null} />

            {/* Magic Constant */}
            <div className="rounded-xl border p-3 text-center"
              style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.25)" }}>
              <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                ⚖ Kutsal Sabit — BASE²
              </p>
              <p className="font-inter text-[8px] mt-0.5" style={{ color: "rgba(212,175,55,0.45)" }}>
                {savedBase.toLocaleString()} × {savedBase.toLocaleString()}
              </p>
              <motion.p className="font-amiri text-3xl font-bold mt-1" style={{ color: G.text }}
                animate={{ textShadow: [`0 0 12px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 12px ${G.glow}`] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                {magicConst?.toLocaleString()}
              </motion.p>
            </div>

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
              {showVerify ? "▲ Doğrulamayı Gizle" : "▼ Satır / Sütun / Köşegen Doğrula"}
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
          <motion.div key="hv2-placeholder"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="rounded-xl border p-8 flex flex-col items-center gap-3"
            style={{ background: "rgba(4,8,24,0.99)", borderColor: "rgba(212,175,55,0.12)" }}
          >
            <motion.span style={{ fontSize: "1.8rem", color: "rgba(212,175,55,0.18)" }}
              animate={{ opacity: [0.12, 0.40, 0.12] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>⬡</motion.span>
            <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: "rgba(212,175,55,0.22)" }}>
              Base sayıyı girerek vefki oluşturun
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}