import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Trash2 } from "lucide-react";
import { analyzeText, ELEMENTS } from "../lib/anasirValues";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const elementKeys = ["fire", "air", "water", "earth"];

export default function AnasirDomination() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!input.trim()) return;
    setResult(analyzeText(input));
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#112236] to-[#0a1520] text-white font-inter">
      {/* Decorative orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 sm:py-16">

        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors mb-8">
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          Back to Abjad Calculator
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-5 text-3xl">
            🌊
          </div>
          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white">
            عناصر الهيمنة
          </h1>
          <p className="font-inter text-sm text-white/40 mt-2 tracking-widest uppercase">
            Anasir Domination Analyzer
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl mb-4 hover:border-white/15 transition-colors duration-300"
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
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-amiri text-2xl text-white placeholder:text-white/20 leading-loose resize-none focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all"
          />
          <div className="flex gap-3 mt-4">
            <motion.button
              onClick={handleCalculate}
              disabled={!input.trim()}
              whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(167,139,250,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-30 disabled:cursor-not-allowed text-white font-inter font-semibold text-sm transition-colors duration-200 shadow-lg shadow-purple-500/20"
            >
              <Calculator className="w-4 h-4" />
              Analyze Elements
            </motion.button>
            <motion.button
              onClick={handleClear}
              disabled={!input && !result}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/70 hover:text-white font-inter text-sm border border-white/10 hover:border-white/20 transition-all duration-200"
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
              {/* Dominant Element Banner */}
              {result.dominant && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl p-5 flex items-center justify-between border"
                  style={{
                    background: ELEMENTS[result.dominant].bg,
                    borderColor: ELEMENTS[result.dominant].border,
                    boxShadow: `0 0 32px ${ELEMENTS[result.dominant].glow}`,
                  }}
                >
                  <div>
                    <p className="font-inter text-xs uppercase tracking-widest mb-1" style={{ color: ELEMENTS[result.dominant].color, opacity: 0.7 }}>
                      Dominant Element
                    </p>
                    <p className="font-amiri text-3xl font-bold text-white">
                      {ELEMENTS[result.dominant].icon} {ELEMENTS[result.dominant].name}
                    </p>
                    <p className="font-inter text-xs text-white/40 mt-1">
                      {result.counts[result.dominant]} letters · {result.percentages[result.dominant]}% of total
                    </p>
                  </div>
                  <div
                    className="text-6xl opacity-20 font-amiri"
                    style={{ color: ELEMENTS[result.dominant].color }}
                  >
                    {ELEMENTS[result.dominant].arabic}
                  </div>
                </motion.div>
              )}

              {/* 4 Element Cards */}
              <div className="grid grid-cols-2 gap-3">
                {elementKeys.map((key, i) => {
                  const el = ELEMENTS[key];
                  const isDominant = result.dominant === key;
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.35 }}
                      whileHover={{ scale: 1.03 }}
                      className="rounded-2xl p-5 border flex flex-col gap-3 transition-all duration-200 cursor-default"
                      style={{
                        background: isDominant ? el.bg : "rgba(255,255,255,0.03)",
                        borderColor: isDominant ? el.border : "rgba(255,255,255,0.08)",
                        boxShadow: isDominant ? `0 4px 24px ${el.glow}` : "none",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{el.icon}</span>
                        {isDominant && (
                          <span className="font-inter text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-semibold" style={{ background: el.bg, color: el.color, border: `1px solid ${el.border}` }}>
                            Dominant
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-inter text-xs text-white/40 uppercase tracking-wide">{el.name}</p>
                        <p className="font-amiri text-4xl font-bold mt-1" style={{ color: isDominant ? el.color : "rgba(255,255,255,0.7)" }}>
                          {result.counts[key]}
                        </p>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.percentages[key]}%` }}
                          transition={{ delay: i * 0.07 + 0.2, duration: 0.6, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: el.color }}
                        />
                      </div>
                      <p className="font-inter text-xs text-white/30">
                        {result.percentages[key]}% of letters
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Total letters */}
              <p className="text-center font-inter text-xs text-white/25 pt-1">
                Total Arabic letters analyzed: {result.total}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}