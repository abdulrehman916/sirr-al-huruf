import { useState } from "react";
import { analyzeText, ELEMENTS } from "../lib/anasirValues";
import AnasirLetterGrid from "../components/AnasirLetterGrid";
import { processText } from "../lib/abjadValues";
import LetterGrid from "../components/LetterGrid";
import ResultsSummary from "../components/ResultsSummary";
import AbjadReferenceTable from "../components/AbjadReferenceTable";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [anasirInput, setAnasirInput] = useState("");
  const [anasirResult, setAnasirResult] = useState(null);

  const handleCalculate = () => {
    if (!input.trim()) return;
    setResult(processText(input));
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
  };

  const handleAnasirAnalyze = () => {
    if (!anasirInput.trim()) return;
    setAnasirResult(analyzeText(anasirInput));
  };

  const handleAnasirClear = () => {
    setAnasirInput("");
    setAnasirResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#112236] to-[#0a1520] text-white font-inter relative overflow-x-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-500/3 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      {/* Decorative background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 sm:py-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-5">
            <span className="font-amiri text-3xl text-yellow-400">ح</span>
          </div>
          <h1 className="font-amiri text-5xl sm:text-6xl font-bold text-white">
            سرّ الحروف
          </h1>
          <p className="font-inter text-sm text-white/40 mt-2 tracking-widest uppercase">
            Abjad Numerology Calculator
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-500/50" />
          </div>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl mb-4 transition-shadow duration-300 hover:shadow-2xl hover:border-white/15"
        >
          <label className="block font-inter text-xs text-white/40 uppercase tracking-widest mb-3">
            Arabic Text Input
          </label>
          <textarea
            dir="rtl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="أدخل النص العربي هنا..."
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-amiri text-2xl text-white placeholder:text-white/20 leading-loose resize-none focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 transition-all"
          />

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <motion.button
              onClick={handleCalculate}
              disabled={!input.trim()}
              whileHover={{ scale: 1.05, boxShadow: "0 0 32px rgba(234,179,8,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-[#0d1b2a] font-inter font-semibold text-sm transition-all duration-200 shadow-xl shadow-yellow-500/30"
            >
              <Calculator className="w-4 h-4" />
              Calculate
            </motion.button>
            <motion.button
              onClick={handleClear}
              disabled={!input && !result}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-white/60 hover:text-white font-inter text-sm border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </motion.button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
              className="space-y-4"
            >
              {/* Summary Cards */}
              <div className="bg-gradient-to-br from-white/5 to-yellow-500/5 backdrop-blur-sm border border-yellow-500/15 rounded-3xl p-6 shadow-xl">
                <ResultsSummary count={result.count} total={result.total} />
              </div>

              {/* Letter Grid */}
              {result.letters.length > 0 && (
                <div className="bg-gradient-to-br from-white/5 to-yellow-500/5 backdrop-blur-sm border border-yellow-500/15 rounded-3xl p-6 shadow-xl">
                  <p className="font-inter text-xs text-white/40 uppercase tracking-widest mb-5">
                    Letter Breakdown
                  </p>
                  <LetterGrid letters={result.letters} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Divider ─── */}
        <div className="flex items-center gap-4 my-16 py-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-500/60 to-blue-500/40" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/20 to-transparent" />
        </div>

        {/* ─── Anasir Calculator Section ─── */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 mb-5">
            <span className="text-3xl">🌊</span>
          </div>
          <h1 className="font-amiri text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">حاسبة العناصر</h1>
          <p className="font-inter text-sm text-blue-300/60 mt-2 tracking-widest uppercase font-semibold">Anasir Domination Calculator</p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-blue-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-500/50" />
          </div>
        </motion.div>

        {/* Anasir Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="bg-gradient-to-br from-cyan-500/5 to-blue-500/3 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 shadow-2xl mb-4 transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-500/30"
        >
          <label className="block font-inter text-xs text-cyan-400/60 uppercase tracking-widest mb-3 font-semibold">Arabic Text Input</label>
          <textarea
            dir="rtl"
            value={anasirInput}
            onChange={(e) => setAnasirInput(e.target.value)}
            placeholder="أدخل النص العربي هنا..."
            rows={4}
            className="w-full bg-white/3 border border-cyan-500/20 rounded-2xl p-4 font-amiri text-2xl text-white placeholder:text-white/20 leading-loose resize-none focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-200"
          />
          <div className="flex gap-3 mt-4">
            <motion.button
              onClick={handleAnasirAnalyze}
              disabled={!anasirInput.trim()}
              whileHover={{ scale: 1.05, boxShadow: "0 0 32px rgba(34,211,238,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-30 disabled:cursor-not-allowed text-[#0d1b2a] font-inter font-semibold text-sm transition-all duration-200 shadow-xl shadow-cyan-500/30"
            >
              <Calculator className="w-4 h-4" />
              Analyze Elements
            </motion.button>
            <motion.button
              onClick={handleAnasirClear}
              disabled={!anasirInput && !anasirResult}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-white/60 hover:text-white font-inter text-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </motion.button>
          </div>
        </motion.div>

        {/* Anasir Results */}
        <AnimatePresence mode="wait">
          {anasirResult && (
            <motion.div
              key="anasir-results"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
              className="space-y-4"
            >
              {/* Dominant Banner */}
              {anasirResult.dominant && (() => {
                const el = ELEMENTS[anasirResult.dominant];
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-3xl p-6 flex items-center justify-between border backdrop-blur-xl"
                    style={{ background: el.bg, borderColor: el.border, boxShadow: `0 0 48px ${el.glow}` }}
                  >
                    <div>
                      <p className="font-inter text-xs uppercase tracking-widest mb-1" style={{ color: el.color, opacity: 0.75 }}>Dominant Element</p>
                      <p className="font-amiri text-3xl font-bold text-white">{el.icon} {el.name}</p>
                      <p className="font-inter text-xs text-white/40 mt-1">{anasirResult.counts[anasirResult.dominant]} letters · {anasirResult.percentages[anasirResult.dominant]}% of total</p>
                    </div>
                    <span className="font-amiri text-5xl sm:text-6xl opacity-15" style={{ color: el.color }}>{el.arabic}</span>
                  </motion.div>
                );
              })()}

              {/* Total + 4 element cards */}
              <div className="bg-gradient-to-br from-white/5 to-cyan-500/5 backdrop-blur-sm border border-cyan-500/15 rounded-3xl p-6 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.35 }}
                    className="col-span-2 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-2xl p-5 flex flex-col items-center gap-2 shadow-xl cursor-default hover:border-cyan-500/40 transition-all"
                  >
                    <span className="font-inter text-xs text-cyan-400/60 uppercase tracking-widest font-semibold">Total Letters</span>
                    <span className="font-amiri text-4xl font-bold text-white">{anasirResult.total}</span>
                  </motion.div>
                  {Object.entries(ELEMENTS).map(([key, el], i) => {
                    const isDominant = anasirResult.dominant === key;
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.03, boxShadow: `0 8px 32px ${el.glow}` }}
                        transition={{ duration: 0.35, delay: i * 0.07 }}
                        className="rounded-2xl p-5 flex flex-col items-center gap-2 border cursor-default transition-all backdrop-blur-sm"
                        style={{
                          background: isDominant ? el.bg : "rgba(255,255,255,0.02)",
                          borderColor: isDominant ? el.border : "rgba(255,255,255,0.08)",
                          boxShadow: isDominant ? `0 6px 32px ${el.glow}` : "none",
                        }}
                    >
                      <span className="text-2xl">{el.icon}</span>
                      <span className="font-inter text-xs uppercase tracking-widest" style={{ color: isDominant ? el.color : "rgba(255,255,255,0.35)" }}>{el.name}</span>
                      <span className="font-amiri text-4xl font-bold" style={{ color: isDominant ? el.color : "rgba(255,255,255,0.75)" }}>{anasirResult.counts[key]}</span>
                      {isDominant && (
                        <span className="font-inter text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border font-semibold" style={{ color: el.color, borderColor: el.border, background: el.bg }}>Dominant</span>
                      )}
                    </motion.div>
                  );
                  })}
                  </div>
                  </div>

              {/* Letter Breakdown */}
              {anasirResult.letterDetails.length > 0 && (
                <div className="bg-gradient-to-br from-white/5 to-cyan-500/5 backdrop-blur-sm border border-cyan-500/15 rounded-3xl p-6 shadow-xl">
                  <AnasirLetterGrid letterDetails={anasirResult.letterDetails} />
                </div>
              )}

              <p className="text-center font-inter text-xs text-white/25 pt-1">Total Arabic letters analyzed: {anasirResult.total}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reference Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 mb-8"
        >
          <AbjadReferenceTable />
        </motion.div>

      </div>
    </div>
  );
}