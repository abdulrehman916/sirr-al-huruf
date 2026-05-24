import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Trash2, Star, Copy, Share2, Check } from "lucide-react";
import { processTextAsync } from "../lib/asyncProcessor";
import { processText } from "../lib/abjadValues";
import LetterGrid from "../components/LetterGrid";
import ResultsSummary from "../components/ResultsSummary";
import LetterAnalysis from "../components/LetterAnalysis";
import AbjadReferenceTable from "../components/AbjadReferenceTable";
import PageLayout from "../components/PageLayout";

export default function AbjadPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef(false);

  const handleCalculate = useCallback(async () => {
    if (!input.trim()) return;
    abortRef.current = false;
    setLoading(true);
    setProgress(0);
    setResult(null);
    const r = await processTextAsync(input, (p) => { if (!abortRef.current) setProgress(p); });
    if (!abortRef.current) setResult(r);
    setLoading(false);
  }, [input]);

  const handleClear = () => { abortRef.current = true; setInput(""); setResult(null); setLoading(false); };

  const handleCopy = () => {
    const text = `📖 ${input}\n🔢 Abjad Value: ${result?.total ?? "—"}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout accentColor="gold">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-yellow-500/25 mb-4"
            style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.08) 100%)", boxShadow: "0 0 24px rgba(212,175,55,0.15)" }}
          >
            <span className="font-amiri text-2xl" style={{ color: "#D4AF37" }}>ح</span>
          </motion.div>
          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white">حاسبة الأبجد</h1>
          <p className="font-inter text-xs mt-1.5 tracking-widest uppercase" style={{ color: "rgba(212,175,55,0.50)" }}>Abjad Numerical Calculator</p>
          <GoldDivider />
        </div>

        {/* Input */}
        <InputCard
          value={input}
          onChange={setInput}
          onCalculate={handleCalculate}
          onClear={handleClear}
          hasResult={!!result}
          loading={loading}
          progress={progress}
        />

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              <GlowCard>
                <ResultsSummary count={result.count} total={result.total} />
              </GlowCard>
              {result.letters.length > 0 && (
                <>
                  <GlowCard>
                    <p className="font-inter text-xs text-white/35 uppercase tracking-widest mb-4">Letter Breakdown</p>
                    <LetterGrid letters={result.letters} />
                  </GlowCard>
                  <LetterAnalysis letters={result.letters} />
                </>
              )}
              <ActionRow onCopy={handleCopy} copied={copied} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="pt-4 pb-6">
          <AbjadReferenceTable />
        </motion.div>
      </div>
    </PageLayout>
  );
}

function GoldDivider() {
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-yellow-500/70" />
      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-yellow-500/70" />
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

function InputCard({ value, onChange, onCalculate, onClear, hasResult, loading, progress }) {
  return (
    <div className="rounded-2xl border p-5"
      style={{ background: "rgba(15,48,80,0.92)", borderColor: "rgba(251,191,36,0.60)", boxShadow: "0 0 28px rgba(251,191,36,0.18), 0 4px 20px rgba(0,0,0,0.35)" }}>
      <label className="block font-inter text-[10px] uppercase tracking-widest mb-2.5" style={{ color: "rgba(234,179,8,0.5)" }}>
        Arabic Text Input
      </label>
      <textarea
        dir="rtl"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="أدخل النص العربي هنا..."
        rows={4}
        className="w-full rounded-xl px-4 py-3 font-amiri text-xl text-white leading-relaxed resize-none focus:outline-none caret-white mb-3 placeholder:text-white/35"
        style={{ background: "rgba(8,25,48,0.95)", border: "1px solid rgba(251,191,36,0.50)", boxShadow: "0 0 16px rgba(251,191,36,0.14), inset 0 1px 0 rgba(255,255,255,0.06)" }}
      />
      {loading && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-inter text-[10px] text-white/40 animate-pulse">Analyzing…</span>
            <span className="font-inter text-[10px]" style={{ color: "rgba(234,179,8,0.6)" }}>{progress}%</span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/8 overflow-hidden">
            <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.15 }}
              className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#f59e0b,#d97706)" }} />
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <motion.button onClick={onCalculate} disabled={!value.trim() || loading}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-inter font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed text-[#0d1b2a]"
          style={{ background: "linear-gradient(135deg,#fcd34d,#d97706)", boxShadow: "0 0 32px rgba(252,211,77,0.65), 0 2px 10px rgba(0,0,0,0.30)" }}>
          {loading ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Calculator className="w-3.5 h-3.5" />}
          {loading ? "Analyzing…" : "Calculate"}
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

function ActionRow({ onCopy, copied }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <motion.button onClick={onCopy} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg border border-white/15 text-white/60 hover:text-white hover:border-white/30 text-xs font-inter transition-all"
        style={{ background: "rgba(255,255,255,0.06)" }}>
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Copied!" : "Copy"}
      </motion.button>
    </div>
  );
}