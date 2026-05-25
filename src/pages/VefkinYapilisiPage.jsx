import { useState } from "react";
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

// ── Vefk Generation ──────────────────────────────────────────────
// Ottoman 3×3 water pattern — rank to cell mapping (reading order)
const MAGIC_PATTERN_3 = [2,7,6,9,5,1,4,3,8];

function generate3x3(target) {
  const n = parseInt(target);
  if (!n || n < 15) return null;
  // Center value = n/3 (rounded). Place 9 consecutive values centered on it.
  // All rows/cols/diagonals sum to 3 * center. All 9 values are unique.
  const center = Math.round(n / 3);
  const vals = [center-4, center-3, center-2, center-1, center,
                center+1, center+2, center+3, center+4];
  const flat = MAGIC_PATTERN_3.map(rank => vals[rank - 1]);
  return [flat.slice(0,3), flat.slice(3,6), flat.slice(6,9)];
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

// ── Ana Vefk (original generator) ────────────────────────────────
function AnaVefk() {
  const [name,       setName]       = useState("");
  const [targetName, setTargetName] = useState("");
  const [grid,       setGrid]       = useState(null);
  const [info,       setInfo]       = useState(null);

  const handleGenerate = () => {
    const nameVal   = calcAbjad(name.trim());
    const targetVal = calcAbjad(targetName.trim());
    const total     = nameVal + targetVal;
    const g         = generate3x3(total);
    if (!g) return;
    setGrid(g);
    setInfo({ nameVal, targetVal, total });
  };

  const rowSums = grid ? grid.map(r => r.reduce((a,b)=>a+b,0)) : [];
  const magicConst = grid ? rowSums[0] : null;

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="rounded-2xl border p-5 space-y-3"
        style={{ background: "rgba(6,12,32,0.97)", borderColor: G.borderHi, boxShadow: `0 0 28px ${G.glow}` }}>
        <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
          📜 Vefk Oluşturma — طريقة الوفق
        </p>
        <GoldDivider />

        {/* Name input */}
        <div className="space-y-1.5">
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
            1️⃣ İsminiz — اسمك
          </p>
          <input
            type="text" dir="rtl"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="عربي اسم گیرید..."
            className="w-full rounded-xl px-4 py-2.5 font-amiri text-xl text-white text-right focus:outline-none caret-white placeholder:text-white/25"
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}` }}
          />
          {name && (
            <p className="text-right font-inter text-[9px]" style={{ color: G.dim }}>
              Ebced: <span style={{ color: G.text }}>{calcAbjad(name.trim()).toLocaleString()}</span>
            </p>
          )}
        </div>

        {/* Target name input */}
        <div className="space-y-1.5">
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
            2️⃣ Hedef İsim — اسم المقصود
          </p>
          <input
            type="text" dir="rtl"
            value={targetName}
            onChange={e => setTargetName(e.target.value)}
            placeholder="مطلوب اسم..."
            className="w-full rounded-xl px-4 py-2.5 font-amiri text-xl text-white text-right focus:outline-none caret-white placeholder:text-white/25"
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}` }}
          />
          {targetName && (
            <p className="text-right font-inter text-[9px]" style={{ color: G.dim }}>
              Ebced: <span style={{ color: G.text }}>{calcAbjad(targetName.trim()).toLocaleString()}</span>
            </p>
          )}
        </div>

        <motion.button
          onClick={handleGenerate}
          disabled={!name.trim() || !targetName.trim()}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl font-inter font-semibold text-sm text-[#0d1b2a] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg,#fcd34d,#d97706)", boxShadow: `0 0 24px ${G.glowHi}` }}
        >
          ✨ Vefk Oluştur
        </motion.button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {grid && info && (
          <motion.div
            key="vefk-result"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border p-5 space-y-4"
            style={{ background: "rgba(4,8,24,0.99)", borderColor: G.borderHi, boxShadow: `0 0 32px ${G.glow}` }}
          >
            {/* Calculation summary */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: "İsim", val: info.nameVal },
                { label: "Hedef", val: info.targetVal },
                { label: "Toplam", val: info.total },
              ].map((item, i) => (
                <div key={i} className="rounded-xl px-2 py-2"
                  style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.18)" }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{item.label}</p>
                  <p className="font-amiri text-xl font-bold" style={{ color: G.text }}>{item.val.toLocaleString()}</p>
                </div>
              ))}
            </div>

            <GoldDivider />

            <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
              🜂 3×3 Vefk — الوفق الثلاثي
            </p>

            {/* 3×3 Grid */}
            <div className="flex justify-center">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 72px)", gap: "5px" }}>
                {grid.flat().map((num, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.04, duration: 0.22 }}
                    className="rounded-xl border flex items-center justify-center font-amiri font-bold"
                    style={{
                      width: 72, height: 72,
                      background: "rgba(212,175,55,0.12)",
                      borderColor: "rgba(212,175,55,0.45)",
                      color: G.text,
                      fontSize: num > 9999 ? "12px" : num > 999 ? "14px" : "18px",
                      boxShadow: "inset 0 0 10px rgba(212,175,55,0.14), 0 0 6px rgba(212,175,55,0.10)",
                    }}
                  >
                    {num.toLocaleString()}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Magic constant */}
            <div className="rounded-xl border p-3 text-center"
              style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.25)" }}>
              <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                ⚖ Kutsal Sabit — Magic Constant
              </p>
              <motion.p className="font-amiri text-3xl font-bold mt-1" style={{ color: G.text }}
                animate={{ textShadow: [`0 0 12px ${G.glow}`, `0 0 28px ${G.glowHi}`, `0 0 12px ${G.glow}`] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                {magicConst?.toLocaleString()}
              </motion.p>
            </div>
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