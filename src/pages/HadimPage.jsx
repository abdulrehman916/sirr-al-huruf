import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Copy, Check, Info } from "lucide-react";
import { calculateHadim } from "../lib/hadimEngine";
import HadimTypePanel from "../components/HadimTypePanel";
import HadimZikr from "../components/HadimZikr";
import HadimKasem from "../components/HadimKasem";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { usePageState } from "../context/PageStateContext";

const PAGE_KEY = 'hadim';

export default function HadimPage() {
  const { getPageState, setPageState } = usePageState();
  const initialState = getPageState(PAGE_KEY, { name: "", ism: "", mode: "ulvi", result: null });
  
  const [name, setName] = useState(initialState.name);
  const [ism, setIsm] = useState(initialState.ism);
  const [mode, setMode] = useState(initialState.mode);
  const [result, setResult] = useState(initialState.result);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPageState(PAGE_KEY, { name, ism, mode, result });
  }, [name, ism, mode, result, setPageState]);

  const handleCalculate = useCallback(async () => {
    if (!name.trim()) return;
    setLoading(true);
    const res = await calculateHadim(name.trim(), ism.trim(), mode);
    setResult(res);
    setLoading(false);
  }, [name, ism, mode]);

  const handleClear = () => {
    setName("");
    setIsm("");
    setMode("ulvi");
    setResult(null);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`📿 ${result.ceremonialName}\n${result.grandTotal}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout accentColor="amber">
      <div className="space-y-4">
        <PageTitle arabic="حساب الخادم" latin="Hadim Calculator" subtitle="Ottoman-Style Name Construction" icon="👑" />

        {/* Input Card */}
        <div className="rounded-2xl border p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(40,30,10,0.99) 0%, rgba(25,18,6,0.99) 100%)",
            borderColor: "rgba(212,175,55,0.55)",
            boxShadow: "0 0 40px rgba(212,175,55,0.14), 0 4px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(212,175,55,0.12)",
          }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.40), transparent)" }} />
          
          <label className="block font-inter text-[10px] uppercase tracking-[0.22em] mb-2.5" style={{ color: "rgba(212,175,55,0.55)" }}>Your Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full rounded-xl px-4 py-3 font-amiri text-xl text-white leading-relaxed focus:outline-none caret-amber-400 mb-3 placeholder:text-white/35"
            style={{ background: "rgba(20,14,6,0.98)", border: "1px solid rgba(212,175,55,0.40)" }} />

          <label className="block font-inter text-[10px] uppercase tracking-[0.22em] mb-2.5" style={{ color: "rgba(212,175,55,0.55)" }}>Ism (Optional)</label>
          <input value={ism} onChange={(e) => setIsm(e.target.value)}
            placeholder="Mother's name or spiritual name..."
            className="w-full rounded-xl px-4 py-3 font-amiri text-xl text-white leading-relaxed focus:outline-none caret-amber-400 mb-3 placeholder:text-white/35"
            style={{ background: "rgba(20,14,6,0.98)", border: "1px solid rgba(212,175,55,0.40)" }} />

          <label className="block font-inter text-[10px] uppercase tracking-[0.22em] mb-2.5" style={{ color: "rgba(212,175,55,0.55)" }}>Operation Mode</label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {['ulvi', 'sufli', 'sherli'].map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`py-2.5 px-3 rounded-xl font-inter text-xs font-bold transition-all border ${
                  mode === m ? 'bg-amber-500 text-black border-amber-400' : 'bg-white/5 text-white/60 border-white/10 hover:border-amber-500/50'
                }`}>
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <motion.button onClick={handleCalculate} disabled={!name.trim() || loading}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-inter font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed text-[#1a1206] tracking-wide"
              style={{ background: "linear-gradient(135deg,#fbbf24 0%,#d97706 100%)", boxShadow: "0 0 36px rgba(212,175,55,0.55), 0 2px 12px rgba(0,0,0,0.35)" }}>
              {loading ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : "👑"}
              {loading ? "Calculating…" : "Calculate Hadim"}
            </motion.button>
            <motion.button onClick={handleClear} disabled={!name && !result && !loading}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 py-3 px-4 rounded-xl text-white/55 hover:text-white font-inter text-sm border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.12)", width: "auto", flexShrink: 0 }}>
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </motion.button>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              <HadimTypePanel result={result} />
              <HadimZikr result={result} />
              <HadimKasem result={result} />
              
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