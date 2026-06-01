import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { calcBastHuroof, BAST_LEVELS } from "../lib/bastHuroofEngine";

// ── Palette ───────────────────────────────────────────────────
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

// ── Sub-components ────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-1">
      <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${G.borderHi})` }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.text }} />
      <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${G.borderHi})` }} />
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-2xl border p-4 space-y-3"
      style={{
        background: "linear-gradient(145deg, rgba(8,18,44,0.98) 0%, rgba(4,10,28,0.99) 100%)",
        borderColor: G.border,
        boxShadow: "0 2px 20px rgba(0,0,0,0.40), inset 0 1px 0 rgba(212,175,55,0.06)",
      }}>
      <p className="font-inter text-[9px] uppercase tracking-[0.22em] text-center" style={{ color: G.dim }}>
        ✦ {title}
      </p>
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent)` }} />
      {children}
    </div>
  );
}

// ── Level Selector ────────────────────────────────────────────
function BastLevelSelector({ selected, onChange }) {
  return (
    <div className="rounded-2xl border p-4 space-y-3"
      style={{
        background: "linear-gradient(145deg, rgba(6,14,36,0.99) 0%, rgba(4,10,24,0.99) 100%)",
        borderColor: "rgba(212,175,55,0.14)",
        boxShadow: "0 2px 24px rgba(0,0,0,0.50), inset 0 1px 0 rgba(212,175,55,0.06)",
      }}>
      <p className="font-inter text-[8px] uppercase tracking-[0.22em] text-center text-white/25 mb-2.5">
        ✦ Select Bast Level
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {BAST_LEVELS.map((lvl) => {
          const active = selected === lvl.key;
          return (
            <motion.button
              key={lvl.key}
              onClick={() => onChange(lvl.key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              animate={{
                background: active ? G.bgHi : "rgba(255,255,255,0.02)",
                boxShadow: active ? `0 0 22px ${G.glow}, inset 0 1px 0 ${G.faint}` : "none",
              }}
              transition={{ duration: 0.22 }}
              className="relative flex flex-col items-center justify-center py-3 px-2 rounded-xl border"
              style={{ borderColor: active ? G.borderHi : "rgba(255,255,255,0.07)" }}
            >
              {active && (
                <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl"
                  style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.55), transparent)` }} />
              )}
              <span
                className="font-inter text-[10px] font-bold tracking-wider leading-none mb-1"
                style={{ color: active ? G.text : "rgba(255,255,255,0.35)" }}
              >
                {lvl.label}
              </span>
              <span
                className="font-amiri text-xs"
                style={{ color: active ? G.dim : "rgba(255,255,255,0.18)" }}
              >
                {lvl.arabic}
              </span>
              {active && (
                <motion.div
                  layoutId="bastLevelUnderline"
                  className="absolute bottom-1.5 rounded-full h-0.5 w-8"
                  style={{ background: G.text }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Total Card ────────────────────────────────────────────────
function TotalCard({ result, level }) {
  const lvl = BAST_LEVELS.find(l => l.key === level);
  return (
    <div className="rounded-2xl border p-6 text-center space-y-2 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(8,18,48,0.99) 0%, rgba(4,10,28,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 60px ${G.glow}, 0 4px 32px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.12)`,
      }}>
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent)` }} />
      <p className="font-inter text-[9px] uppercase tracking-[0.25em]" style={{ color: G.dim }}>
        {lvl?.label} — {lvl?.arabic}
      </p>
      {result.isPending ? (
        <div className="py-4 space-y-2">
          <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.40)" }}>
            ⏳ Awaiting Bast Table
          </p>
          <p className="font-inter text-xs text-white/25">
            {result.letterCount} letters extracted — values pending
          </p>
        </div>
      ) : (
        <>
          <motion.p
            className="font-amiri font-bold tabular-nums"
            style={{ fontSize: "clamp(2.8rem,12vw,4.2rem)", color: G.text, lineHeight: 1 }}
            animate={{ textShadow: [`0 0 20px ${G.glow}`, `0 0 60px ${G.glowHi}`, `0 0 20px ${G.glow}`] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {(result.total ?? 0).toLocaleString()}
          </motion.p>
          <p className="font-inter text-[9px] text-white/30 uppercase tracking-widest">
            {result.letterCount} letters
          </p>
        </>
      )}
    </div>
  );
}

// ── Breakdown Table ───────────────────────────────────────────
function BreakdownTable({ entries, level }) {
  let running = 0;
  const allPending = entries.every(e => e.value === null);

  return (
    <SectionCard title={`Letter Breakdown — Bast Level ${level}`}>
      {/* Letter grid */}
      <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
        {entries.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.025, duration: 0.28 }}
            className="flex flex-col items-center rounded-xl border px-3 py-2 min-w-[48px]"
            style={{ background: G.bg, borderColor: G.faint }}
          >
            <span className="font-amiri text-2xl text-white leading-none mb-0.5">{e.original}</span>
            <span className="font-inter text-[11px] font-bold tabular-nums" style={{ color: G.text }}>
              {e.value === null ? "—" : e.value.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Running total strip */}
      {!allPending && (
        <>
          <div className="h-px w-full mt-2"
            style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)` }} />
          <div className="space-y-1" dir="rtl">
            {entries.map((e, i) => {
              if (e.value !== null) running += e.value;
              const isLast = i === entries.length - 1;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.018 * i, duration: 0.28 }}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg"
                  style={{
                    background: isLast ? G.bgHi : "rgba(255,255,255,0.02)",
                    borderBottom: `1px solid ${G.faint}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-amiri text-lg text-white w-6 text-center">{e.original}</span>
                    <span className="font-inter text-[10px] text-white/25">+</span>
                    <span className="font-inter text-xs tabular-nums" style={{ color: G.dim }}>
                      {e.value === null ? "—" : e.value.toLocaleString()}
                    </span>
                  </div>
                  <span
                    className="font-inter text-sm font-bold tabular-nums"
                    style={{ color: isLast ? G.text : "rgba(255,255,255,0.50)" }}
                  >
                    {e.value !== null ? running.toLocaleString() : "—"}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {allPending && (
        <p className="font-inter text-[10px] text-center text-white/25 py-2 uppercase tracking-widest">
          Running total available after Bast Table is populated
        </p>
      )}
    </SectionCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function BastHuroofPage() {
  const [input,  setInput]  = useState("");
  const [level,  setLevel]  = useState(1);
  const [result, setResult] = useState(null);

  const handleCalculate = useCallback(() => {
    if (!input.trim()) return;
    const res = calcBastHuroof(input, level);
    setResult(res);
  }, [input, level]);

  const handleClear = () => {
    setInput("");
    setResult(null);
  };

  // Auto-recalculate when level changes if there's already a result
  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    if (input.trim()) {
      const res = calcBastHuroof(input, newLevel);
      setResult(res);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-4">

        {/* ── Header ── */}
        <PageTitle
          arabic="بسط الحروف ٢"
          latin="Basthul Huroof 2"
          subtitle="Dedicated Bast Engine"
          icon="٢"
        />

        {/* ── Level Selector ── */}
        <BastLevelSelector selected={level} onChange={handleLevelChange} />

        {/* ── Input ── */}
        <div className="rounded-2xl border p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(8,20,52,0.98) 0%, rgba(4,12,34,0.99) 100%)",
            borderColor: G.borderHi,
            boxShadow: `0 0 40px ${G.glow}, 0 4px 28px rgba(0,0,0,0.50), inset 0 1px 0 rgba(212,175,55,0.10)`,
          }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)` }} />

          <label className="block font-inter text-[10px] uppercase tracking-widest mb-2.5" style={{ color: G.dim }}>
            Arabic Text Input — Bast Level {level}
          </label>

          <textarea
            dir="rtl"
            value={input}
            onChange={e => {
              setInput(e.target.value);
              setResult(null);
            }}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCalculate();
              }
            }}
            placeholder="أدخل النص العربي هنا..."
            rows={4}
            className="w-full rounded-xl px-4 py-3 font-amiri text-xl text-white leading-relaxed resize-none focus:outline-none caret-white mb-3 placeholder:text-white/30"
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}` }}
          />

          <div className="flex gap-2">
            <motion.button
              onClick={handleCalculate}
              disabled={!input.trim()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-inter font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed text-[#0d1b2a] tracking-wide"
              style={{
                background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)",
                boxShadow: `0 0 32px ${G.glowHi}, 0 2px 12px rgba(0,0,0,0.40)`,
              }}
            >
              <span className="font-amiri text-base">احسب</span> Calculate
            </motion.button>

            <motion.button
              onClick={handleClear}
              disabled={!input && !result}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 py-3 px-4 rounded-xl text-white/55 hover:text-white font-inter text-sm border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.12)" }}
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </motion.button>
          </div>
        </div>

        {/* ── Results ── */}
        <AnimatePresence mode="wait">
          {result && result.letterCount > 0 && (
            <motion.div
              key={`result-${level}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {/* Total */}
              <TotalCard result={result} level={level} />

              <GoldDivider />

              {/* Breakdown */}
              <BreakdownTable entries={result.entries} level={level} />

              {/* Pending notice */}
              {result.isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border px-4 py-3 text-center"
                  style={{
                    background: "rgba(212,175,55,0.04)",
                    borderColor: "rgba(212,175,55,0.20)",
                  }}
                >
                  <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.45)" }}>
                    ✦ Bast Table Pending
                  </p>
                  <p className="font-inter text-xs text-white/20 mt-1">
                    {result.letterCount} letters extracted and ready.
                    Totals will appear once the Bast table values are populated in{" "}
                    <span className="font-mono text-white/30">lib/bastHuroofEngine.js</span>.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {result && result.letterCount === 0 && (
            <motion.div
              key="no-letters"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border px-4 py-6 text-center"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <p className="font-inter text-sm text-white/30">No Arabic letters found in input.</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageLayout>
  );
}