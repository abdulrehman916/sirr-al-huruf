import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Authentic Ottoman 5×5 layout — each cell holds its POSITION NUMBER (natural order)
// or null for center. These ARE the multipliers: cell value = BASE × position.
// Special rule: positions 20-24 use (BASE - 40 + offset) × BASE.
const LAYOUT = [
  [11, 15, 24,  3,  7],
  [ 4,  8, 12, 16, 20],
  [17, 21, null,  9, 13],
  [ 5, 14, 18, 22,  1],
  [23,  2,  6, 10, 19],
];

// Generate cell values: position → BASE × position, with special rule for pos 20-24
function generateHouseValues(base) {
  const vals = {};
  for (let pos = 1; pos <= 19; pos++) {
    vals[pos] = base * pos;
  }
  // pos 20 → (BASE−40)×BASE, pos 21 → (BASE−39)×BASE, ... pos 24 → (BASE−36)×BASE
  for (let pos = 20; pos <= 24; pos++) {
    const offset = pos - 20; // 0,1,2,3,4
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

function ManuscriptCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="rounded-2xl border p-5 space-y-3"
      style={{
        background: "rgba(6,12,32,0.97)",
        borderColor: G.borderHi,
        boxShadow: `0 0 32px ${G.glow}, 0 4px 24px rgba(0,0,0,0.50)`,
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ arabic, latin }) {
  return (
    <div className="text-center space-y-1 mb-4">
      <motion.h2
        className="font-amiri text-2xl font-bold"
        style={{ color: G.text }}
        animate={{ textShadow: [`0 0 14px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 14px ${G.glow}`] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {arabic}
      </motion.h2>
      {latin && (
        <p className="font-inter text-[9px] uppercase tracking-[0.28em]" style={{ color: G.dim }}>
          {latin}
        </p>
      )}
      <GoldDivider />
    </div>
  );
}

// ── Static 5×5 preview grid (reference pattern) ──────────────────
const STATIC_GRID = [
  [11, 15, 24,  3,  7],
  [ 4,  8, 12, 16, 20],
  [17, 21, null, 9, 13],
  [ 5, 14, 18, 22,  1],
  [23,  2,  6, 10, 19],
];

function StaticVefk5x5() {
  const flat = STATIC_GRID.flat();
  return (
    <div className="flex justify-center">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 52px)", gap: "4px" }}>
        {flat.map((num, idx) => {
          const isEmpty = num === null;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02, duration: 0.22 }}
              className="rounded-lg border flex items-center justify-center font-amiri font-bold"
              style={{
                width: 52, height: 52, fontSize: "15px",
                background: isEmpty ? "rgba(212,175,55,0.03)" : "rgba(212,175,55,0.10)",
                borderColor: isEmpty ? "rgba(212,175,55,0.15)" : "rgba(212,175,55,0.45)",
                color: isEmpty ? "transparent" : G.text,
                boxShadow: isEmpty ? `inset 0 0 14px rgba(212,175,55,0.06)` : `inset 0 0 10px rgba(212,175,55,0.12)`,
              }}
            >
              {isEmpty ? (
                <motion.span style={{ fontSize: "1.3rem", color: "rgba(212,175,55,0.18)" }}
                  animate={{ opacity: [0.12, 0.45, 0.12] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>□</motion.span>
              ) : num}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Dynamic Generated Grid ────────────────────────────────────────
function DynamicVefkGrid({ houseValues, centerText }) {
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
            : display && display.length > 4 ? "11px"
            : "13px";
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
                  {centerText ? (
                    <p className="font-amiri text-center leading-tight"
                      style={{ color: G.text, fontSize: centerText.length > 8 ? "8px" : "10px", textAlign: "center" }}
                      dir="rtl">
                      {centerText}
                    </p>
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

// ── Main Page ─────────────────────────────────────────────────────
export default function VefkinYapilisiPage() {
  const [inputNumber, setInputNumber] = useState("");
  const [centerText, setCenterText] = useState("");

  const base = inputNumber ? parseInt(inputNumber) : null;

  const houseValues = useMemo(() => {
    if (!base || isNaN(base) || base < 1) return null;
    return generateHouseValues(base);
  }, [base]);

  const totalSum = useMemo(() => {
    if (!houseValues) return null;
    return Object.values(houseValues).reduce((a, b) => a + b, 0);
  }, [houseValues]);

  const handleInput = (e) => {
    setInputNumber(e.target.value.replace(/[^\d]/g, ""));
  };

  return (
    <PageLayout>
      <div className="space-y-6">

        {/* ── Header ────────────────────────────────────── */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-yellow-500/25 mb-4"
            style={{ background: "linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)", boxShadow: "0 0 28px rgba(212,175,55,0.18)" }}
          >
            <span className="font-amiri text-2xl" style={{ color: "#D4AF37" }}>📜</span>
          </motion.div>
          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white">طريقة عمل الوفق</h1>
          <p className="font-inter text-xs mt-1 tracking-widest uppercase" style={{ color: G.dim }}>
            Vefkin Yapılışı — Ottoman Manuscript Method
          </p>
          <GoldDivider />
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* GENERATOR — BEŞLİ VEFK 2. USÛL                       */}
        {/* ══════════════════════════════════════════════════════ */}
        <ManuscriptCard delay={0.08}>
          <SectionTitle arabic="الوفق الخماسي — المولِّد" latin="BEŞLİ VEFK — 2. USÛL GENERATOR" />

          {/* Number input */}
          <div className="rounded-2xl border p-4 space-y-2"
            style={{ background: "rgba(4,10,28,0.99)", borderColor: G.border }}>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              🔢 Temel Sayı — الرقم الأساسي
            </p>
            <input
              type="text"
              inputMode="numeric"
              value={inputNumber}
              onChange={handleInput}
              placeholder="Herhangi bir sayı girin... (örn: 90, 786, 12345)"
              className="w-full rounded-xl px-4 py-3 font-amiri text-2xl text-center text-white font-bold focus:outline-none caret-white placeholder:text-white/25"
              style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}` }}
            />
            {base && (
              <p className="text-center font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                Temel: {base.toLocaleString()}
              </p>
            )}
          </div>

          {/* Center text input */}
          <div className="rounded-xl border px-4 py-3 space-y-1.5"
            style={{ background: "rgba(4,10,28,0.99)", borderColor: "rgba(212,175,55,0.20)" }}>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              🕳 Merkez Hane (İsteğe Bağlı) — الهانة المركزية
            </p>
            <input
              type="text"
              value={centerText}
              onChange={e => setCenterText(e.target.value)}
              placeholder="İsim, Niyet, Ayet, Esma..."
              dir="rtl"
              className="w-full rounded-xl px-4 py-2 font-amiri text-lg text-white text-right focus:outline-none caret-white placeholder:text-white/25"
              style={{ background: "rgba(4,12,34,0.97)", border: `1px solid rgba(212,175,55,0.15)` }}
            />
          </div>

          {/* 20th house rule callout */}
          {base && (
            <motion.div
              key={base}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className="rounded-xl border p-4 space-y-2"
              style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.35)" }}
            >
              <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
                ⚠ 20. Hane Kuralı — Kırk Çıkarma
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "20. Hane", formula: `(${base} − 40) × ${base}`, val: (base - 40) * base },
                  { label: "21. Hane", formula: `(${base} − 39) × ${base}`, val: (base - 39) * base },
                  { label: "22. Hane", formula: `(${base} − 38) × ${base}`, val: (base - 38) * base },
                ].map((item, i) => (
                  <div key={i} className="rounded-lg px-2 py-2"
                    style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.18)" }}>
                    <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.45)" }}>{item.label}</p>
                    <p className="font-amiri text-xs font-bold mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>{item.formula}</p>
                    <p className="font-amiri text-sm font-bold mt-0.5" style={{ color: G.text }}>{item.val.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Generated grid */}
          <AnimatePresence mode="wait">
            {houseValues ? (
              <motion.div key={`grid-${base}`}
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
                className="space-y-4"
              >
                <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />
                <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
                  ✨ Üretilen Vefk — الوفق المُولَّد
                </p>
                <DynamicVefkGrid houseValues={houseValues} centerText={centerText} />

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl px-3 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                    <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Aktif Hane</p>
                    <p className="font-amiri text-xl font-bold" style={{ color: G.text }}>24</p>
                  </div>
                  <div className="rounded-xl px-3 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                    <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Temel</p>
                    <p className="font-amiri text-xl font-bold" style={{ color: G.text }}>{base.toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl px-3 py-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                    <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Toplam</p>
                    <p className="font-amiri text-sm font-bold leading-tight" style={{ color: G.text }}>{totalSum.toLocaleString()}</p>
                  </div>
                </div>

                <div className="rounded-xl border p-3 text-center"
                  style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.18)" }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.35)" }}>
                    ∅ Merkez hane toplama dahil edilmez — Center excluded from total
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="rounded-xl border p-8 flex flex-col items-center gap-3"
                style={{ background: "rgba(4,8,24,0.99)", borderColor: "rgba(212,175,55,0.15)" }}
              >
                <motion.span style={{ fontSize: "2rem", color: "rgba(212,175,55,0.20)" }}
                  animate={{ opacity: [0.15, 0.45, 0.15] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>🜂</motion.span>
                <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: "rgba(212,175,55,0.22)" }}>
                  Sayı girerek vefki oluşturun
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </ManuscriptCard>

        {/* ══════════════════════════════════════════════════════ */}
        {/* SECTION — REFERENCE PATTERN                           */}
        {/* ══════════════════════════════════════════════════════ */}
        <ManuscriptCard delay={0.15}>
          <SectionTitle arabic="الوفق الخماسي — النمط المرجعي" latin="BEŞLİ VEFK — REFERENCE LAYOUT" />

          <StaticVefk5x5 />

          <div className="h-px w-full mt-3" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />

          <div className="space-y-2 pt-1">
            <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
              🕳 Merkez Hane — الهانة المركزية
            </p>
            {[
              { icon: "✦", text: "Bu vefkin 24 aktif hanesi vardır", sub: "This vefk has 24 active houses" },
              { icon: "🌑", text: "Merkez hane gizli ve ruhani bir noktadır", sub: "The center is a secret spiritual point" },
              { icon: "∅", text: "Merkez hane toplama dahil edilmez", sub: "The center is NOT counted in totals" },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3 rounded-xl px-4 py-2.5"
                style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.10)" }}
              >
                <span className="font-amiri text-base flex-shrink-0 mt-0.5" style={{ color: G.dim }}>{item.icon}</span>
                <div>
                  <p className="font-amiri text-base" style={{ color: G.text }} dir="rtl">{item.text}</p>
                  <p className="font-inter text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-xl border p-4 mt-1 space-y-2"
            style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.30)" }}>
            <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
              ✨ Merkez Haneye Yazılabilir
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { ar: "الاسم المطلوب", tr: "Hedef İsim" },
                { ar: "النية", tr: "Niyet" },
                { ar: "الآية الكريمة", tr: "Ayet-i Kerime" },
                { ar: "الاسم الإلهي", tr: "Esma-i İlahiye" },
              ].map((item, i) => (
                <div key={i} className="rounded-lg px-3 py-2 text-center"
                  style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)" }}>
                  <p className="font-amiri text-sm font-bold" style={{ color: G.text }} dir="rtl">{item.ar}</p>
                  <p className="font-inter text-[8px] uppercase tracking-wider mt-0.5" style={{ color: "rgba(212,175,55,0.45)" }}>{item.tr}</p>
                </div>
              ))}
            </div>
          </div>
        </ManuscriptCard>

        {/* ══════════════════════════════════════════════════════ */}
        {/* SECTION — OTTOMAN RULES                               */}
        {/* ══════════════════════════════════════════════════════ */}
        <ManuscriptCard delay={0.2}>
          <SectionTitle arabic="طريقة عمل الوفق" latin="VEFKİN YAPILIŞI — OTTOMAN METHOD" />
          <div className="space-y-2">
            {[
              { step: "①", label: "Birinci Hane Kuralı", value: "İlk haneye başlangıç sayısı yazılır", sub: "First house: BASE × 1" },
              { step: "②", label: "Tabiî Sıralama", value: "Her hane doğal sırayla çarpılır", sub: "Every house: BASE × house number" },
              { step: "③", label: "20. Hane Kuralı", value: "20. hanede BASE'den 40 çıkarılır", sub: "At house 20: subtract 40 from BASE" },
              { step: "④", label: "Devam Eden Artış", value: "21–24. haneler: (BASE−39)×BASE, (BASE−38)×BASE...", sub: "Continues increasing from house 21 onward" },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.07, duration: 0.28 }}
                className="rounded-xl px-4 py-3"
                style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.12)" }}
              >
                <div className="flex items-start gap-3">
                  <span className="font-inter text-sm flex-shrink-0 mt-0.5" style={{ color: "rgba(212,175,55,0.45)" }}>{item.step}</span>
                  <div>
                    <p className="font-inter text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(212,175,55,0.35)" }}>{item.label}</p>
                    <p className="font-amiri text-base font-bold" style={{ color: G.text }} dir="rtl">{item.value}</p>
                    <p className="font-inter text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>{item.sub}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ManuscriptCard>

        {/* ── Sacred Footer ──────────────────────────────────── */}
        <div className="text-center pb-4">
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border"
            style={{ background: G.bg, borderColor: G.borderHi }}
            animate={{ boxShadow: [`0 0 12px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 12px ${G.glow}`] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-amiri text-xl" style={{ color: G.text }}>☽</span>
            <span className="font-inter text-[9px] uppercase tracking-[0.3em]" style={{ color: G.dim }}>
              Vefkin Yapılışı · Complete
            </span>
            <span className="font-amiri text-xl" style={{ color: G.text }}>☽</span>
          </motion.div>
        </div>

      </div>
    </PageLayout>
  );
}