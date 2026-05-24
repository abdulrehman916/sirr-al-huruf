import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Copy, Check } from "lucide-react";
import { analyzeTextAsync } from "../lib/asyncProcessor";
import { ELEMENTS } from "../lib/anasirValues";
import AnasirLetterGrid from "../components/AnasirLetterGrid";
import ElementInsight from "../components/ElementInsight";
import PageLayout from "../components/PageLayout";

export default function AnasirPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef(false);

  const handleAnalyze = useCallback(async () => {
    if (!input.trim()) return;
    abortRef.current = false;
    setLoading(true);
    setProgress(0);
    setResult(null);
    const ar = await analyzeTextAsync(input, (p) => { if (!abortRef.current) setProgress(p); });
    if (!abortRef.current) setResult(ar);
    setLoading(false);
  }, [input]);

  const handleClear = () => { abortRef.current = true; setInput(""); setResult(null); setLoading(false); };

  const handleCopy = () => {
    const dominant = result?.dominant ? ELEMENTS[result.dominant] : null;
    navigator.clipboard.writeText(`📖 ${input}\n${dominant ? `${dominant.icon} Dominant: ${dominant.name}` : ""}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout accentColor="cyan">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-cyan-500/25 mb-4"
            style={{ background: "linear-gradient(180deg, rgba(6,182,212,0.22) 0%, rgba(6,182,212,0.10) 100%)", boxShadow: "0 0 24px rgba(6,182,212,0.15)" }}>
            <span className="text-2xl">🌊</span>
          </motion.div>
          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white">حاسبة العناصر</h1>
          <p className="font-inter text-xs text-cyan-400/50 mt-1.5 tracking-widest uppercase font-medium">Anasir Domination Calculator</p>
          <CyanDivider />
        </div>

        {/* Input */}
        <InputCard value={input} onChange={setInput} onAnalyze={handleAnalyze} onClear={handleClear} hasResult={!!result} loading={loading} progress={progress} />

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">

              {/* Dominant Banner */}
              {result.dominant && (() => {
                const el = ELEMENTS[result.dominant];
                const tb = result.tiebreak;
                return (
                  <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl p-5 border backdrop-blur-sm"
                    style={{ background: el.dominantBg || el.bg, borderColor: el.border, boxShadow: el.dominantShadow || `0 4px 24px ${el.glow}`, borderRadius: "16px" }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-inter text-[10px] uppercase tracking-widest mb-1 font-semibold" style={{ color: el.color }}>Dominant Element</p>
                        <p className="font-amiri text-2xl font-bold text-white">{el.icon} {el.name}</p>
                        <p className="font-inter text-xs text-white/55 mt-1">{result.counts[result.dominant]} letters · {result.percentages[result.dominant]}%</p>
                      </div>
                      <span className="font-amiri text-5xl opacity-15" style={{ color: el.color }}>{el.arabic}</span>
                    </div>

                    {/* Tiebreak notice */}
                    {tb && tb.rankName && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="mt-3 rounded-xl border border-white/20 px-3 py-2.5 space-y-1"
                        style={{ background: "rgba(0,0,0,0.22)" }}>
                        <p className="font-inter text-[9px] uppercase tracking-widest text-white/50 font-semibold">
                          ⚖ Equal Totals Detected
                        </p>
                        <p className="font-inter text-[11px] text-white/80">
                          {tb.tiedElements.map(k => ELEMENTS[k].icon + ' ' + ELEMENTS[k].name).join('  =  ')}
                        </p>
                        <p className="font-inter text-[10px] font-bold" style={{ color: el.color }}>
                          ✔ Dominance resolved by: {tb.rankName}
                        </p>
                      </motion.div>
                    )}

                    {/* Tie with no ranked letters (extremely rare) */}
                    {tb && !tb.rankName && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="mt-3 rounded-xl border border-white/20 px-3 py-2 space-y-1"
                        style={{ background: "rgba(0,0,0,0.22)" }}>
                        <p className="font-inter text-[9px] uppercase tracking-widest text-white/50">⚖ Equal Totals — No rank resolution available</p>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })()}

              {/* Element Cards */}
              <GlowCard>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 rounded-xl border border-cyan-500/20 p-4 flex flex-col items-center gap-1"
                    style={{ background: "linear-gradient(180deg, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.02) 100%)" }}>
                    <span className="font-inter text-[10px] text-cyan-400/70 uppercase tracking-widest font-semibold">Total Letters</span>
                    <span className="font-amiri text-4xl font-bold text-white">{result.total}</span>
                  </div>
                  {Object.entries(ELEMENTS).map(([key, el], i) => {
                    const isDominant = result.dominant === key;
                    return (
                      <motion.div key={key} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.04 }} transition={{ duration: 0.3, delay: i * 0.06 }}
                        className="rounded-xl p-4 flex flex-col items-center gap-1.5 border cursor-default transition-all backdrop-blur-md"
                        style={{
                          background: isDominant ? "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)" : "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                          borderColor: isDominant ? el.color : "rgba(255,255,255,0.08)",
                          boxShadow: isDominant ? `0 0 20px ${el.glow}, inset 0 1px 0 rgba(255,255,255,0.08)` : "inset 0 1px 0 rgba(255,255,255,0.05)",
                          borderRadius: "16px",
                        }}>
                        <span className="text-xl">{el.icon}</span>
                        <span className="font-inter text-[10px] uppercase tracking-widest font-semibold text-white">{el.name}</span>
                        <span className="font-amiri text-base font-bold text-white">{el.arabic}</span>
                        <span className="font-amiri text-3xl font-bold text-white">{result.counts[key]}</span>
                        {isDominant && (
                          <span className="font-inter text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border font-semibold mt-0.5"
                            style={{ color: '#FFFFFF', borderColor: el.dominantBadge?.borderColor ?? 'rgba(255,255,255,0.2)', background: el.dominantBadge?.background, letterSpacing: '1px', borderRadius: '20px' }}>
                            Dominant
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </GlowCard>

              {result.letterDetails.length > 0 && (
                <GlowCard>
                  <AnasirLetterGrid letterDetails={result.letterDetails} />
                </GlowCard>
              )}

              <ElementInsight dominant={result.dominant} />

              <div className="flex items-center gap-2 pt-1">
                <motion.button onClick={handleCopy} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg border border-white/15 text-white/60 hover:text-white text-xs font-inter transition-all"
                  style={{ background: "rgba(255,255,255,0.06)" }}>
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}

function CyanDivider() {
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500/70" />
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/80" />
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500/70" />
    </div>
  );
}

function GlowCard({ children }) {
  return (
    <div className="rounded-2xl border p-5"
      style={{ background: "rgba(15,48,80,0.92)", borderColor: "rgba(255,255,255,0.20)", boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10)" }}>
      {children}
    </div>
  );
}

function InputCard({ value, onChange, onAnalyze, onClear, hasResult, loading, progress }) {
  return (
    <div className="rounded-2xl border p-5"
      style={{ background: "rgba(15,48,80,0.92)", borderColor: "rgba(56,189,248,0.60)", boxShadow: "0 0 28px rgba(56,189,248,0.18), 0 4px 20px rgba(0,0,0,0.35)" }}>
      <label className="block font-inter text-[10px] uppercase tracking-widest mb-2.5" style={{ color: "rgba(6,182,212,0.5)" }}>Arabic Text Input</label>
      <textarea dir="rtl" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="أدخل النص العربي هنا..." rows={4}
        className="w-full rounded-xl px-4 py-3 font-amiri text-xl text-white leading-relaxed resize-none focus:outline-none caret-white mb-3 placeholder:text-white/35"
        style={{ background: "rgba(8,25,48,0.95)", border: "1px solid rgba(56,189,248,0.50)", boxShadow: "0 0 16px rgba(56,189,248,0.14), inset 0 1px 0 rgba(255,255,255,0.06)" }} />
      {loading && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-inter text-[10px] text-white/40 animate-pulse">Analyzing…</span>
            <span className="font-inter text-[10px]" style={{ color: "rgba(6,182,212,0.6)" }}>{progress}%</span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/8 overflow-hidden">
            <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.15 }}
              className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#06b6d4,#3b82f6)" }} />
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <motion.button onClick={onAnalyze} disabled={!value.trim() || loading}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-inter font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed text-[#0d1b2a]"
          style={{ background: "linear-gradient(135deg,#38bdf8,#3b82f6)", boxShadow: "0 0 32px rgba(56,189,248,0.65), 0 2px 10px rgba(0,0,0,0.30)" }}>
          {loading ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : "🌊"}
          {loading ? "Analyzing…" : "Analyze Elements"}
        </motion.button>
        <motion.button onClick={onClear} disabled={!value && !hasResult && !loading}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-white/70 hover:text-white font-inter text-sm border border-white/15 hover:border-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: "rgba(255,255,255,0.04)" }}>
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </motion.button>
      </div>
    </div>
  );
}