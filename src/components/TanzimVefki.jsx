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

// Fixed 5×5 template — null = center (empty)
const LAYOUT = [
  [11, 15, 24,  3,  7],
  [ 4,  8, 12, 16, 20],
  [17, 21, null, 9, 13],
  [ 5, 14, 18, 22,  1],
  [23,  2,  6, 10, 19],
];

// Abjad Kebir values for Zikr calculation
const ABJAD = {
  'ا':1,'أ':1,'إ':1,'آ':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,
  'ي':10,'ى':10,'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,
  'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000,
};
function calcAbjad(text) {
  return [...text].reduce((sum, ch) => sum + (ABJAD[ch] || 0), 0);
}

function generateHouseValues(base) {
  const vals = {};
  for (let pos = 1; pos <= 19; pos++) vals[pos] = base * pos;
  for (let pos = 20; pos <= 24; pos++) {
    const offset = pos - 20;
    vals[pos] = (base - 40 + offset) * base;
  }
  return vals;
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

// ── Grid ──────────────────────────────────────────────────────────
function TanzimGrid({ houseValues, esmaText }) {
  const cellW = 58;
  return (
    <div className="flex justify-center overflow-x-auto pb-1">
      <div style={{ display: "grid", gridTemplateColumns: `repeat(5, ${cellW}px)`, gap: "4px" }}>
        {LAYOUT.flat().map((pos, idx) => {
          const isEmpty = pos === null;
          const val = isEmpty ? null : houseValues[pos];
          const display = val != null ? val.toLocaleString() : null;
          const fontSize = display && display.length > 9 ? "9px"
            : display && display.length > 6 ? "10px"
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
                background: isEmpty ? "rgba(212,175,55,0.04)" : "rgba(212,175,55,0.12)",
                borderColor: isEmpty ? "rgba(212,175,55,0.18)" : "rgba(212,175,55,0.50)",
                boxShadow: isEmpty ? "none" : `inset 0 0 10px rgba(212,175,55,0.14), 0 0 6px rgba(212,175,55,0.10)`,
              }}
            >
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center w-full h-full px-1">
                  {esmaText ? (
                    <p className="font-amiri text-center leading-tight"
                      style={{ color: G.text, fontSize: esmaText.length > 8 ? "8px" : "10px" }}
                      dir="rtl">{esmaText}</p>
                  ) : (
                    <motion.span style={{ fontSize: "1.3rem", color: "rgba(212,175,55,0.20)" }}
                      animate={{ opacity: [0.12, 0.45, 0.12] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>□</motion.span>
                  )}
                </div>
              ) : (
                <>
                  <p className="font-amiri font-bold tabular-nums leading-tight"
                    style={{ color: G.text, fontSize, textShadow: `0 0 8px rgba(212,175,55,0.40)` }}>
                    {display}
                  </p>
                  <p className="font-inter" style={{ fontSize: "7px", color: "rgba(212,175,55,0.30)", marginTop: "1px" }}>
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

// ── Row/Col/Diagonal Totals ───────────────────────────────────────
function SacredTotals({ houseValues }) {
  const rows = LAYOUT.map(row =>
    row.reduce((sum, pos) => pos === null ? sum : sum + houseValues[pos], 0)
  );
  const cols = [0,1,2,3,4].map(c =>
    LAYOUT.reduce((sum, row) => row[c] === null ? sum : sum + houseValues[row[c]], 0)
  );
  const diagMain = [0,1,2,3,4].reduce((sum, i) =>
    LAYOUT[i][i] === null ? sum : sum + houseValues[LAYOUT[i][i]], 0);
  const diagAnti = [0,1,2,3,4].reduce((sum, i) =>
    LAYOUT[i][4-i] === null ? sum : sum + houseValues[LAYOUT[i][4-i]], 0);

  const items = [
    { label: "Satır Toplamları", subLabel: "Row Totals", values: rows },
    { label: "Sütun Toplamları", subLabel: "Column Totals", values: cols },
    { label: "Ana Köşegen", subLabel: "Main Diagonal", values: [diagMain] },
    { label: "Ters Köşegen", subLabel: "Anti-Diagonal", values: [diagAnti] },
  ];

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 }}
          className="rounded-xl px-4 py-3"
          style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)" }}
        >
          <p className="font-inter text-[9px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
            {item.label} — <span style={{ color: "rgba(255,255,255,0.35)" }}>{item.subLabel}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {item.values.map((v, j) => (
              <span key={j} className="font-amiri font-bold text-sm tabular-nums"
                style={{ color: G.text, textShadow: `0 0 8px ${G.glow}` }}>
                {v.toLocaleString()}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function TanzimVefki() {
  const [mainNum, setMainNum]       = useState("");
  const [esmaText, setEsmaText]     = useState("");
  const [targetNames, setTargetNames] = useState("");

  const base = mainNum ? parseInt(mainNum) : null;

  const houseValues = useMemo(() => {
    if (!base || isNaN(base) || base < 1) return null;
    return generateHouseValues(base);
  }, [base]);

  const totalSum = useMemo(() => {
    if (!houseValues) return null;
    return Object.values(houseValues).reduce((a, b) => a + b, 0);
  }, [houseValues]);

  const zikrCount = useMemo(() => {
    if (!base || !esmaText.trim() || !targetNames.trim()) return null;
    const esmaVal = calcAbjad(esmaText.trim());
    if (!esmaVal) return null;
    return esmaVal * base;
  }, [base, esmaText, targetNames]);

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="rounded-2xl border p-5 space-y-3"
        style={{ background: "rgba(6,12,32,0.97)", borderColor: G.borderHi, boxShadow: `0 0 32px ${G.glow}, 0 4px 24px rgba(0,0,0,0.50)` }}>

        <div className="text-center space-y-1">
          <motion.div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl border border-yellow-500/25 mb-2"
            style={{ background: "linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)", boxShadow: "0 0 28px rgba(212,175,55,0.18)" }}
          >
            <span className="font-amiri text-xl" style={{ color: "#D4AF37" }}>✨</span>
          </motion.div>
          <motion.h2
            className="font-amiri text-2xl font-bold"
            style={{ color: G.text }}
            animate={{ textShadow: [`0 0 14px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 14px ${G.glow}`] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            تنظيم الوفق
          </motion.h2>
          <p className="font-inter text-base font-bold text-white">TANZİM VEFKİ</p>
          <p className="font-inter text-[9px] uppercase tracking-[0.28em]" style={{ color: G.dim }}>
            Sacred Tabii Arrangement System
          </p>
          <GoldDivider />
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.35)" }}>
            Hâli Vasat Beşli Vefk — 5×5 Empty Center
          </p>
        </div>

        {/* ── Inputs ── */}
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
          </div>

          {/* Target names */}
          <div className="rounded-xl border px-4 py-3 space-y-1.5"
            style={{ background: "rgba(4,10,28,0.99)", borderColor: "rgba(212,175,55,0.20)" }}>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              3️⃣ Hedef İsimler (İsteğe Bağlı) — الأسماء المستهدفة
            </p>
            <input
              type="text"
              value={targetNames}
              onChange={e => setTargetNames(e.target.value)}
              placeholder="Ali + Leyla..."
              dir="rtl"
              className="w-full rounded-xl px-4 py-2 font-amiri text-lg text-white text-right focus:outline-none caret-white placeholder:text-white/25"
              style={{ background: "rgba(4,12,34,0.97)", border: `1px solid rgba(212,175,55,0.15)` }}
            />
          </div>
        </div>

        {/* ── Output ── */}
        <AnimatePresence mode="wait">
          {houseValues ? (
            <motion.div key={`tanzim-${base}`}
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />

              <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
                ✨ Üretilen Tanzim Vefki — الوفق المُنظَّم
              </p>

              <TanzimGrid houseValues={houseValues} esmaText={esmaText} />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl px-3 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Aktif Hane</p>
                  <p className="font-amiri text-xl font-bold" style={{ color: G.text }}>24</p>
                </div>
                <div className="rounded-xl px-3 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Ana Sayı</p>
                  <p className="font-amiri text-xl font-bold" style={{ color: G.text }}>{base.toLocaleString()}</p>
                </div>
                <div className="rounded-xl px-3 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Toplam</p>
                  <p className="font-amiri text-sm font-bold leading-tight" style={{ color: G.text }}>{totalSum.toLocaleString()}</p>
                </div>
              </div>

              {/* Sacred Totals */}
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />
              <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
                ⚖️ Kutsal Toplamlar — Sacred Row / Column / Diagonal
              </p>
              <SacredTotals houseValues={houseValues} />

              {/* Zikr count */}
              {zikrCount && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border p-4 text-center space-y-1"
                  style={{ background: "rgba(212,175,55,0.08)", borderColor: "rgba(212,175,55,0.40)", boxShadow: `0 0 18px ${G.glow}` }}
                >
                  <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                    ✨ Kutsal Zikr Sayısı — Sacred Zikr Count
                  </p>
                  <p className="font-amiri text-sm" style={{ color: "rgba(255,255,255,0.50)" }}>
                    {calcAbjad(esmaText.trim()).toLocaleString()} × {base.toLocaleString()}
                  </p>
                  <motion.p
                    className="font-amiri text-3xl font-bold tabular-nums"
                    style={{ color: G.text }}
                    animate={{ textShadow: [`0 0 12px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 12px ${G.glow}`] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {zikrCount.toLocaleString()}
                  </motion.p>
                  {targetNames && (
                    <p className="font-amiri text-sm mt-1" style={{ color: "rgba(212,175,55,0.60)" }} dir="rtl">
                      {targetNames}
                    </p>
                  )}
                </motion.div>
              )}

            </motion.div>
          ) : (
            <motion.div key="tanzim-placeholder"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="rounded-xl border p-8 flex flex-col items-center gap-3"
              style={{ background: "rgba(4,8,24,0.99)", borderColor: "rgba(212,175,55,0.15)" }}
            >
              <motion.span style={{ fontSize: "2rem", color: "rgba(212,175,55,0.20)" }}
                animate={{ opacity: [0.15, 0.45, 0.15] }}
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