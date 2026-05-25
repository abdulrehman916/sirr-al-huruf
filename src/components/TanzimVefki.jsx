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

// Tabii sıralama — null = center (mathematically empty)
const LAYOUT = [
  [11, 15, 24,  3,  7],
  [ 4,  8, 12, 16, 20],
  [17, 21, null, 9, 13],
  [ 5, 14, 18, 22,  1],
  [23,  2,  6, 10, 19],
];

// effectiveBase × tabii position for each of the 24 cells
function computeCells(effectiveBase) {
  const cells = {};
  for (let pos = 1; pos <= 24; pos++) {
    cells[pos] = effectiveBase * pos;
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

// Row/col/diag sums — center cell excluded (pos=null → skip)
function getLineSums(cells) {
  const sum = (positions) => positions.reduce((a, p) => a + (p === null ? 0 : cells[p]), 0);

  const rows = LAYOUT.map(row => sum(row));

  const cols = [0, 1, 2, 3, 4].map(c =>
    sum(LAYOUT.map(row => row[c]))
  );

  // Diagonals skip center [2][2]
  const diag1 = sum([LAYOUT[0][0], LAYOUT[1][1], LAYOUT[3][3], LAYOUT[4][4]]);
  const diag2 = sum([LAYOUT[0][4], LAYOUT[1][3], LAYOUT[3][1], LAYOUT[4][0]]);

  return { rows, cols, diag1, diag2 };
}

function VerificationPanel({ cells, effectiveBase, magicConst }) {
  const { rows, cols, diag1, diag2 } = getLineSums(cells);

  const Check = ({ label, value, target }) => {
    const ok = value === target;
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
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="rounded-xl border p-4 space-y-2"
      style={{ background: "rgba(4,8,24,0.99)", borderColor: "rgba(212,175,55,0.22)" }}
    >
      <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
        ⚖ Satır / Sütun / Köşegen — Verification
      </p>
      <div className="grid grid-cols-1 gap-1.5">
        {rows.map((r, i) => <Check key={`r${i}`} label={`Satır ${i + 1}`} value={r} target={magicConst} />)}
        {cols.map((c, i) => <Check key={`c${i}`} label={`Sütun ${i + 1}`} value={c} target={magicConst} />)}
        <Check label="Köşegen ↘" value={diag1} target={magicConst} />
        <Check label="Köşegen ↗" value={diag2} target={magicConst} />
      </div>
    </motion.div>
  );
}

export default function TanzimVefki() {
  const [mainNum,  setMainNum]  = useState("");
  const [esmaText, setEsmaText] = useState("");
  const [showVerify, setShowVerify] = useState(false);

  const inputBase = mainNum ? parseInt(mainNum) : null;

  // Auto-square if base ≤ 40
  const effectiveBase = inputBase
    ? (inputBase <= 40 ? inputBase * inputBase : inputBase)
    : null;

  const wasSquared = inputBase && inputBase <= 40;

  const cells = useMemo(() => {
    if (!effectiveBase || effectiveBase < 1) return null;
    return computeCells(effectiveBase);
  }, [effectiveBase]);

  // Magic constant = effectiveBase²
  const magicConst = effectiveBase ? effectiveBase * effectiveBase : null;

  // Verify all lines equal magicConst
  const isBalanced = useMemo(() => {
    if (!cells || !magicConst) return false;
    const { rows, cols, diag1, diag2 } = getLineSums(cells);
    return rows.every(r => r === magicConst) &&
           cols.every(c => c === magicConst) &&
           diag1 === magicConst && diag2 === magicConst;
  }, [cells, magicConst]);

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
          <p className="font-inter text-[10px] font-bold text-white">TANZİM VEFKİ</p>
          <p className="font-inter text-[9px] uppercase tracking-[0.22em]" style={{ color: G.dim }}>
            Hâli Vasat — 2. Usül
          </p>
          <GoldDivider />
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.30)" }}>
            5×5 Empty Center — Ottoman Manuscript Method
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          {/* Base number */}
          <div className="rounded-xl border px-4 py-3 space-y-1.5"
            style={{ background: "rgba(4,10,28,0.99)", borderColor: G.border }}>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              1️⃣ Baz Sayı — الرقم الأساسي
            </p>
            <input
              type="text" inputMode="numeric"
              value={mainNum}
              onChange={e => setMainNum(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="Sayı girin... (örn: 252, 20, 114)"
              className="w-full rounded-xl px-4 py-2.5 font-amiri text-2xl text-center text-white font-bold focus:outline-none caret-white placeholder:text-white/25"
              style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}` }}
            />
            {/* Auto-square notice */}
            {wasSquared && inputBase && effectiveBase && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-inter text-[9px] text-center"
                style={{ color: "rgba(212,175,55,0.75)" }}>
                ✦ {inputBase} ≤ 40 → otomatik karesi alındı: <span className="font-amiri font-bold" style={{ color: G.text }}>{inputBase}² = {effectiveBase.toLocaleString()}</span>
              </motion.p>
            )}
            {effectiveBase && !wasSquared && (
              <p className="font-inter text-[9px] text-center" style={{ color: "rgba(212,175,55,0.45)" }}>
                Efektif Baz: <span className="font-amiri font-bold" style={{ color: G.text }}>{effectiveBase.toLocaleString()}</span>
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
              Sadece görsel — Shown in center cell only (no math effect)
            </p>
          </div>
        </div>

        {/* Rule explanation */}
        <div className="rounded-xl border px-4 py-3 space-y-1.5"
          style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.18)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
            📜 Hesap Kuralı — 2. Usül
          </p>
          <div className="space-y-1">
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
              Hücre = <span style={{ color: G.text }}>Efektif Baz × Tabii Konum (1–24)</span>
            </p>
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
              Magic Constant = <span style={{ color: G.text }}>Efektif Baz²</span>
            </p>
            <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.50)" }}>
              Baz ≤ 40 ise → <span style={{ color: G.text }}>önce karesi alınır</span>
            </p>
            {effectiveBase && (
              <p className="font-inter text-[9px] mt-1" style={{ color: "rgba(212,175,55,0.55)" }}>
                {effectiveBase}² = {(effectiveBase * effectiveBase).toLocaleString()} · Örnek: {effectiveBase}×11={effectiveBase * 11}, {effectiveBase}×24={effectiveBase * 24}
              </p>
            )}
          </div>
        </div>

        {/* Grid output */}
        <AnimatePresence mode="wait">
          {cells && effectiveBase ? (
            <motion.div key={`tanzim-${effectiveBase}`}
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />
              <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
                ✨ Hâli Vasat Tanzim Vefki
              </p>

              <TanzimGrid cells={cells} esmaText={esmaText} />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl px-2 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                  <p className="font-inter text-[7px] uppercase tracking-widest" style={{ color: G.dim }}>Baz Sayı</p>
                  <p className="font-amiri text-lg font-bold leading-tight" style={{ color: G.text }}>{inputBase?.toLocaleString()}</p>
                </div>
                <div className="rounded-xl px-2 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                  <p className="font-inter text-[7px] uppercase tracking-widest" style={{ color: G.dim }}>Efektif Baz</p>
                  <p className="font-amiri text-lg font-bold leading-tight" style={{ color: G.text }}>{effectiveBase.toLocaleString()}</p>
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

              {/* Magic constant display */}
              {isBalanced && magicConst && (
                <div className="rounded-xl border p-3 text-center"
                  style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.25)" }}>
                  <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                    ⚖ Kutsal Sabit — {effectiveBase}² = Magic Constant
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
                  <motion.div
                    key="verify"
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden" }}
                  >
                    <VerificationPanel cells={cells} effectiveBase={effectiveBase} magicConst={magicConst} />
                  </motion.div>
                )}
              </AnimatePresence>

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
                Baz sayıyı girerek tanzim vefkini oluşturun
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}