import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Copy, Check } from "lucide-react";
import { processText } from "../lib/abjadValues";
import PageLayout from "../components/PageLayout";

function normalizeAndProcess(text) {
  return processText(text);
}

function GoldDivider() {
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.70))" }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(212,175,55,0.80)" }} />
      <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, rgba(212,175,55,0.70))" }} />
    </div>
  );
}

export default function AbjadKabirPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCalculate = useCallback(() => {
    if (!input.trim()) return;
    setResult(normalizeAndProcess(input));
  }, [input]);

  const handleClear = () => { setInput(""); setResult(null); };

  const handleCopy = () => {
    if (!result) return;
    const lines = result.letters.map(l => `${l.original} = ${l.value}`).join("\n");
    const text = `${input}\n\n${lines}\n\nTotal: ${result.total}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout>
      <div className="space-y-5">

        {/* ── Header ── */}
        <div className="text-center mb-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-yellow-500/25 mb-4"
            style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.08) 100%)", boxShadow: "0 0 28px rgba(212,175,55,0.18)" }}
          >
            <span className="font-amiri text-2xl" style={{ color: "#D4AF37" }}>ا</span>
          </motion.div>
          <h1 className="font-amiri text-4xl font-bold text-white">الأبجد الكبير</h1>
          <p className="font-inter text-xs mt-1.5 tracking-widest uppercase" style={{ color: "rgba(212,175,55,0.55)" }}>
            Abjad Kabir Analyzer
          </p>
          <GoldDivider />
        </div>

        {/* ── Input ── */}
        <div
          className="rounded-2xl border p-5"
          style={{ background: "rgba(15,35,70,0.94)", borderColor: "rgba(212,175,55,0.50)", boxShadow: "0 0 28px rgba(212,175,55,0.14), 0 4px 20px rgba(0,0,0,0.40)" }}
        >
          <label className="block font-inter text-[10px] uppercase tracking-widest mb-2.5" style={{ color: "rgba(212,175,55,0.55)" }}>
            Arabic Text Input
          </label>
          <textarea
            dir="rtl"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleCalculate(); } }}
            placeholder="أدخل النص العربي هنا..."
            rows={4}
            className="w-full rounded-xl px-4 py-3 font-amiri text-xl text-white leading-relaxed resize-none focus:outline-none caret-white mb-3 placeholder:text-white/30"
            style={{ background: "rgba(6,18,44,0.96)", border: "1px solid rgba(212,175,55,0.35)" }}
          />
          <div className="flex gap-2">
            <motion.button
              onClick={handleCalculate}
              disabled={!input.trim()}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-inter font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed text-[#0d1b2a]"
              style={{ background: "linear-gradient(135deg,#fcd34d,#d97706)", boxShadow: "0 0 28px rgba(212,175,55,0.55)" }}
            >
              <span className="font-amiri text-base">احسب</span>
              Calculate
            </motion.button>
            <motion.button
              onClick={handleClear}
              disabled={!input && !result}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-white/70 hover:text-white font-inter text-sm border border-white/15 hover:border-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </motion.button>
          </div>
        </div>

        {/* ── Results ── */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="kabir-results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Total card */}
              <div
                className="rounded-2xl border p-5 text-center space-y-2"
                style={{ background: "rgba(10,22,50,0.98)", borderColor: "rgba(212,175,55,0.45)", boxShadow: "0 0 48px rgba(212,175,55,0.22), 0 4px 24px rgba(0,0,0,0.55)" }}
              >
                <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.50)" }}>
                  Total Kabir Value
                </p>
                <motion.p
                  className="font-inter font-bold tabular-nums"
                  style={{ fontSize: "clamp(2.8rem, 13vw, 4.5rem)", color: "#F5D060" }}
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(212,175,55,0.60), 0 0 50px rgba(212,175,55,0.22)",
                      "0 0 48px rgba(212,175,55,0.90), 0 0 100px rgba(212,175,55,0.40)",
                      "0 0 20px rgba(212,175,55,0.60), 0 0 50px rgba(212,175,55,0.22)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {result.total.toLocaleString()}
                </motion.p>
                <p className="font-inter text-[9px] text-white/30 uppercase tracking-widest">
                  {result.count} letters
                </p>
              </div>

              {/* Letter breakdown grid */}
              <div
                className="rounded-2xl border p-4"
                style={{ background: "rgba(8,18,44,0.96)", borderColor: "rgba(212,175,55,0.22)" }}
              >
                <p className="font-inter text-[9px] uppercase tracking-widest mb-3 text-center" style={{ color: "rgba(212,175,55,0.45)" }}>
                  Letter Breakdown
                </p>
                <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
                  {result.letters.map((l, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                      className="flex flex-col items-center rounded-xl border px-3 py-2 min-w-[48px]"
                      style={{ background: "rgba(212,175,55,0.07)", borderColor: "rgba(212,175,55,0.25)" }}
                    >
                      <span className="font-amiri text-2xl text-white leading-none mb-0.5">{l.original}</span>
                      <span className="font-inter text-[11px] font-bold tabular-nums" style={{ color: "#F5D060" }}>{l.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Running total strip */}
              <div
                className="rounded-2xl border p-4 space-y-2"
                style={{ background: "rgba(8,18,44,0.96)", borderColor: "rgba(212,175,55,0.18)" }}
              >
                <p className="font-inter text-[9px] uppercase tracking-widest mb-3 text-center" style={{ color: "rgba(212,175,55,0.40)" }}>
                  Running Total
                </p>
                <div className="space-y-1.5" dir="rtl">
                  {result.letters.map((l, i) => {
                    const running = result.letters.slice(0, i + 1).reduce((s, x) => s + x.value, 0);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.02 * i, duration: 0.3 }}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg"
                        style={{ background: i === result.letters.length - 1 ? "rgba(212,175,55,0.10)" : "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(212,175,55,0.08)" }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-amiri text-lg text-white w-6 text-center">{l.original}</span>
                          <span className="font-inter text-[10px] text-white/30">+</span>
                          <span className="font-inter text-xs tabular-nums" style={{ color: "rgba(212,175,55,0.70)" }}>{l.value}</span>
                        </div>
                        <span
                          className="font-inter text-sm font-bold tabular-nums"
                          style={{ color: i === result.letters.length - 1 ? "#F5D060" : "rgba(255,255,255,0.55)" }}
                        >
                          {running.toLocaleString()}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Copy button */}
              <div className="flex justify-start pt-1">
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg border border-white/15 text-white/60 hover:text-white hover:border-white/30 text-xs font-inter transition-all"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Results"}
                </motion.button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Reference Table ── */}
        <AbjadKabirReference />

      </div>
    </PageLayout>
  );
}

const KABIR_ROWS = [
  [["ا",1],["ب",2],["ج",3],["د",4],["ه",5],["و",6],["ز",7],["ح",8],["ط",9]],
  [["ي",10],["ك",20],["ل",30],["م",40],["ن",50],["س",60],["ع",70],["ف",80],["ص",90]],
  [["ق",100],["ر",200],["ش",300],["ت",400],["ث",500],["خ",600],["ذ",700],["ض",800],["ظ",900],["غ",1000]],
];

function AbjadKabirReference() {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border"
      style={{ background: "rgba(6,14,36,0.95)", borderColor: "rgba(212,175,55,0.18)" }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <span className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.55)" }}>
          Abjad Kabir Reference Table
        </span>
        <span className="font-inter text-[10px] text-white/30">{open ? "▲" : "▼"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden px-4 pb-4 space-y-3"
          >
            {KABIR_ROWS.map((row, ri) => (
              <div key={ri} className="flex flex-wrap gap-1.5 justify-end" dir="rtl">
                {row.map(([letter, val]) => (
                  <div key={letter} className="flex flex-col items-center rounded-lg border px-2.5 py-1.5 min-w-[42px]"
                    style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.20)" }}>
                    <span className="font-amiri text-lg text-white leading-none">{letter}</span>
                    <span className="font-inter text-[10px] tabular-nums" style={{ color: "rgba(212,175,55,0.70)" }}>{val}</span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}