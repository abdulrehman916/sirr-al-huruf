import { useState } from "react";
import { processText } from "../lib/abjadValues";
import LetterGrid from "../components/LetterGrid";
import ResultsSummary from "../components/ResultsSummary";
import AbjadReferenceTable from "../components/AbjadReferenceTable";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Trash2 } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!input.trim()) return;
    setResult(processText(input));
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#112236] to-[#0a1520] text-white font-inter">

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
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl mb-4"
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
            <button
              onClick={handleCalculate}
              disabled={!input.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed text-[#0d1b2a] font-inter font-semibold text-sm transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-400/30 active:scale-[0.98]"
            >
              <Calculator className="w-4 h-4" />
              Calculate
            </button>
            <button
              onClick={handleClear}
              disabled={!input && !result}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/70 hover:text-white font-inter text-sm border border-white/10 transition-all duration-200 active:scale-[0.98]"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
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
              <ResultsSummary count={result.count} total={result.total} />

              {/* Letter Grid */}
              {result.letters.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
                  <p className="font-inter text-xs text-white/40 uppercase tracking-widest mb-5">
                    Letter Breakdown
                  </p>
                  <LetterGrid letters={result.letters} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reference Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <AbjadReferenceTable />
        </motion.div>

      </div>
    </div>
  );
}