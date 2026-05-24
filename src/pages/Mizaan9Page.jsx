import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import PageLayout from "../components/PageLayout";
import { mizaanAnalyzeAsync, MIZAAN_ELEMENTS } from "../lib/mizaan9Engine";

// ── Gold palette ──
const G = {
  border:   "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  faint:    "rgba(212,175,55,0.22)",
  bg:       "rgba(212,175,55,0.07)",
  bgHi:     "rgba(212,175,55,0.14)",
};

// ── Element colours ──
const EL_STYLE = {
  fire:  { color: "#FF6B35", glow: "rgba(255,107,53,0.40)",  bg: "rgba(255,107,53,0.10)",  border: "rgba(255,107,53,0.45)" },
  water: { color: "#4FC3F7", glow: "rgba(79,195,247,0.40)",  bg: "rgba(79,195,247,0.10)",  border: "rgba(79,195,247,0.45)" },
  air:   { color: "#B2EBF2", glow: "rgba(178,235,242,0.35)", bg: "rgba(178,235,242,0.08)", border: "rgba(178,235,242,0.40)" },
  earth: { color: "#A5C880", glow: "rgba(165,200,128,0.35)", bg: "rgba(165,200,128,0.08)", border: "rgba(165,200,128,0.40)" },
};

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-1">
      <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${G.borderHi})` }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.text }} />
      <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${G.borderHi})` }} />
    </div>
  );
}

// ── Bast-ul Aval total card ──
function BastTotalCard({ total }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border p-6 text-center space-y-1"
      style={{ background: "rgba(6,14,36,0.98)", borderColor: G.borderHi, boxShadow: `0 0 48px ${G.glow}, 0 4px 24px rgba(0,0,0,0.55)` }}>
      <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>بسط الأول — Bast-ul Aval Total</p>
      <motion.p
        className="font-inter font-bold tabular-nums"
        style={{ fontSize: "clamp(2.6rem,12vw,4rem)", color: G.text }}
        animate={{ textShadow: [`0 0 20px ${G.glow}`, `0 0 55px ${G.glowHi}`, `0 0 20px ${G.glow}`] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        {total.toLocaleString()}
      </motion.p>
    </motion.div>
  );
}

// ── Letter count card ──
function LetterCountCard({ count }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-4 text-center"
      style={{ background: "rgba(8,18,44,0.96)", borderColor: G.border }}>
      <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>عدد الحروف — Letter Count</p>
      <p className="font-inter font-bold text-white tabular-nums" style={{ fontSize: "clamp(1.8rem,8vw,2.6rem)" }}>{count}</p>
    </motion.div>
  );
}

// ── Anasir breakdown card ──
function AnasirBreakdownCard({ counts, percentages, total }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
      className="rounded-2xl border p-4 space-y-3"
      style={{ background: "rgba(8,18,44,0.96)", borderColor: G.border }}>
      <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>عناصر — Anasir Breakdown</p>
      <div className="space-y-2">
        {Object.entries(MIZAAN_ELEMENTS).map(([key, el]) => {
          const s   = EL_STYLE[key];
          const cnt = counts[key] ?? 0;
          const pct = percentages[key] ?? 0;
          return (
            <motion.div key={key}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * Object.keys(MIZAAN_ELEMENTS).indexOf(key) }}
              className="rounded-xl border px-4 py-2.5"
              style={{ background: s.bg, borderColor: s.border }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{el.icon}</span>
                  <span className="font-inter text-xs font-bold uppercase tracking-wider" style={{ color: s.color }}>{el.labelTR}</span>
                  <span className="font-amiri text-sm" style={{ color: s.color, opacity: 0.7 }}>{el.arabic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-inter text-xs font-bold tabular-nums" style={{ color: s.color }}>{cnt}</span>
                  <span className="font-inter text-[10px]" style={{ color: s.color, opacity: 0.6 }}>{pct}%</span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                  className="h-full rounded-full"
                  style={{ background: s.color, boxShadow: `0 0 8px ${s.glow}` }} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Second Mizan card ──
function SecondMizaanCard({ dominant, bast2Value, tiebreak }) {
  if (!dominant || bast2Value == null) return null;
  const el = MIZAAN_ELEMENTS[dominant];
  const s  = EL_STYLE[dominant];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      className="rounded-2xl border p-5 space-y-3"
      style={{ background: "rgba(6,14,36,0.98)", borderColor: G.borderHi, boxShadow: `0 0 36px ${G.glow}` }}>
      <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
        الميزان الثاني — Second Mizan
      </p>

      {/* Element badge */}
      <div className="flex items-center justify-center gap-2">
        <span style={{ fontSize: "1.4rem" }}>{el.icon}</span>
        <span className="font-inter text-sm font-bold uppercase tracking-widest" style={{ color: s.color }}>{el.labelTR}</span>
        <span className="font-amiri text-base" style={{ color: s.color, opacity: 0.7 }}>{el.arabic}</span>
      </div>

      {/* Bast2 value */}
      <div className="text-center">
        <motion.p
          className="font-inter font-bold tabular-nums"
          style={{ fontSize: "clamp(2.2rem,10vw,3.2rem)", color: G.text }}
          animate={{ textShadow: [`0 0 20px ${G.glow}`, `0 0 50px ${G.glowHi}`, `0 0 20px ${G.glow}`] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          {bast2Value.toLocaleString()}
        </motion.p>
        <p className="font-inter text-[9px] uppercase tracking-widest mt-1" style={{ color: G.dim }}>Bast-ı Sani</p>
      </div>

      {/* Letters of this element */}
      <div className="flex flex-wrap gap-1.5 justify-center pt-1">
        {el.letters.map((letter, i) => (
          <span key={i}
            className="font-amiri text-xl rounded-lg border px-2.5 py-1"
            style={{ color: s.color, background: s.bg, borderColor: s.border }}>
            {letter}
          </span>
        ))}
      </div>

      {tiebreak?.rankName && (
        <p className="font-inter text-[10px] uppercase tracking-widest text-center" style={{ color: G.dim, opacity: 0.6 }}>
          Resolved by {tiebreak.rankName}
        </p>
      )}
    </motion.div>
  );
}

// ── Dominant element card ──
function DominantCard({ dominant, tiebreak }) {
  if (!dominant) return null;
  const el = MIZAAN_ELEMENTS[dominant];
  const s  = EL_STYLE[dominant];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
      className="rounded-2xl border p-5 text-center space-y-2"
      style={{ background: s.bg, borderColor: s.border, boxShadow: `0 0 40px ${s.glow}` }}>
      <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: s.color, opacity: 0.7 }}>العنصر الغالب — Dominant Anasir</p>
      <motion.div
        animate={{ textShadow: [`0 0 20px ${s.glow}`, `0 0 50px ${s.glow}`, `0 0 20px ${s.glow}`] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ fontSize: "3.5rem", lineHeight: 1 }}>
        {el.icon}
      </motion.div>
      <p className="font-inter text-2xl font-bold uppercase tracking-widest" style={{ color: s.color }}>{el.labelTR}</p>
      <p className="font-amiri text-xl" style={{ color: s.color, opacity: 0.8 }}>{el.arabic}</p>
      {tiebreak && tiebreak.rankName && (
        <p className="font-inter text-[10px] uppercase tracking-widest mt-1" style={{ color: s.color, opacity: 0.55 }}>
          Resolved by {tiebreak.rankName}
        </p>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════
export default function Mizaan9Page() {
  const [input,    setInput]    = useState("");
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [progress, setProgress] = useState(0);
  const abortRef = useRef(false);

  const handleAnalyze = useCallback(async () => {
    if (!input.trim()) return;
    abortRef.current = false;
    setLoading(true);
    setProgress(0);
    setResult(null);
    const r = await mizaanAnalyzeAsync(input, (p) => { if (!abortRef.current) setProgress(p); });
    if (!abortRef.current) setResult(r);
    setLoading(false);
  }, [input]);

  const handleClear = () => {
    abortRef.current = true;
    setInput("");
    setResult(null);
    setLoading(false);
    setProgress(0);
  };

  return (
    <PageLayout accentColor="gold">
      <div className="space-y-4">

        {/* Header */}
        <div className="text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-yellow-500/25 mb-4"
            style={{ background: "linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)", boxShadow: "0 0 28px rgba(212,175,55,0.18)" }}>
            <span className="font-amiri text-2xl" style={{ color: "#D4AF37" }}>٩</span>
          </motion.div>
          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white">ميزان الأعداد</h1>
          <p className="font-inter text-xs mt-1 tracking-widest uppercase" style={{ color: G.dim }}>9 Mizan System</p>
          <GoldDivider />
        </div>

        {/* Input card */}
        <div className="rounded-2xl border p-5"
          style={{ background: "rgba(10,24,56,0.95)", borderColor: G.borderHi, boxShadow: `0 0 28px ${G.glow}, 0 4px 20px rgba(0,0,0,0.40)` }}>
          <label className="block font-inter text-[10px] uppercase tracking-widest mb-2.5" style={{ color: G.dim }}>
            Arabic Text — Surah · Ayah · Talib · Matloob
          </label>
          <textarea
            dir="rtl"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="أدخل النص العربي هنا — السورة، الآية، الاسم..."
            rows={5}
            className="w-full rounded-xl px-4 py-3 font-amiri text-xl text-white leading-relaxed resize-none focus:outline-none caret-white mb-3 placeholder:text-white/30"
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}` }}
          />

          {/* Progress bar */}
          {loading && (
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="font-inter text-[10px] text-white/40 animate-pulse">Analyzing…</span>
                <span className="font-inter text-[10px]" style={{ color: G.dim }}>{progress}%</span>
              </div>
              <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.15 }}
                  className="h-full rounded-full" style={{ background: `linear-gradient(90deg,${G.text},#d97706)` }} />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <motion.button
              onClick={handleAnalyze}
              disabled={!input.trim() || loading}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-inter font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed text-[#0d1b2a]"
              style={{ background: "linear-gradient(135deg,#fcd34d,#d97706)", boxShadow: `0 0 28px ${G.glowHi}` }}>
              {loading
                ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                : <span className="font-amiri text-base">⚖</span>}
              {loading ? "Analyzing…" : "Analyze — 9 Mizan"}
            </motion.button>
            <motion.button
              onClick={handleClear}
              disabled={!input && !result}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-white/70 hover:text-white font-inter text-sm border border-white/15 hover:border-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </motion.button>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div key="mizaan-results"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="space-y-3">

              {/* Row: Bast total + Letter count */}
              <div className="grid grid-cols-2 gap-3">
                <BastTotalCard total={result.bast1Total} />
                <LetterCountCard count={result.letterCount} />
              </div>

              {/* Anasir breakdown */}
              <AnasirBreakdownCard
                counts={result.counts}
                percentages={result.percentages}
                total={result.counts ? Object.values(result.counts).reduce((a,b)=>a+b,0) : 0}
              />

              {/* Dominant element */}
              <DominantCard dominant={result.dominant} tiebreak={result.tiebreak} />

              {/* Second Mizan */}
              <SecondMizaanCard dominant={result.dominant} bast2Value={result.bast2Value} tiebreak={result.tiebreak} />

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageLayout>
  );
}