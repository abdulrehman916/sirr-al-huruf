import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Copy, Check, Star, Flame, Circle } from "lucide-react";
import { calculateHadim } from "../lib/hadimEngine";
import HadimTypePanel from "../components/HadimTypePanel";
import HadimZikr from "../components/HadimZikr";
import HadimKasem from "../components/HadimKasem";
import PageLayout from "../components/PageLayout";
import { usePageState } from "../context/PageStateContext";

const PAGE_KEY = 'hadim';

// ── Theme: Purple/Neon (GitHub Original) ──────────────────────────────
const G = {
  border: "rgba(106,90,205,0.40)",
  borderHi: "rgba(106,90,205,0.65)",
  glow: "rgba(106,90,205,0.22)",
  glowHi: "rgba(106,90,205,0.55)",
  text: "#F5D060",
  dim: "rgba(106,90,205,0.55)",
  bg: "rgba(10,8,20,0.98)",
  bgHi: "rgba(106,90,205,0.10)",
};

// ── Mode Data with Icons and Values ───────────────────────────────────
const MODE_DATA = {
  ulvi: { 
    label: "ULVI", 
    arabic: "علوي", 
    value: "-41", 
    icon: Star,
    color: "#FFD700",
    border: "rgba(255,215,0,0.60)",
    bg: "rgba(255,215,0,0.08)",
    glow: "rgba(255,215,0,0.30)",
  },
  sufli: { 
    label: "SUFLI", 
    arabic: "سفلي", 
    value: "-41", 
    icon: Flame,
    color: "#FF6B35",
    border: "rgba(255,107,53,0.40)",
    bg: "rgba(255,107,53,0.05)",
    glow: "rgba(255,107,53,0.20)",
  },
  sherli: { 
    label: "SHERLI", 
    arabic: "شرلي", 
    value: "特殊", 
    icon: Circle,
    color: "#9B7FD4",
    border: "rgba(155,127,212,0.40)",
    bg: "rgba(155,127,212,0.05)",
    glow: "rgba(155,127,212,0.20)",
  },
};

export default function HadimPage() {
  const { getPageState, setPageState, clearPageState } = usePageState();
  const initialState = getPageState(PAGE_KEY, { talib: "", matloob: "", ism: "", mode: "ulvi", result: null });
  
  const [talib, setTalib] = useState(initialState.talib);
  const [matloob, setMatloob] = useState(initialState.matloob);
  const [ism, setIsm] = useState(initialState.ism);
  const [mode, setMode] = useState(initialState.mode);
  const [result, setResult] = useState(initialState.result);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPageState(PAGE_KEY, { talib, matloob, ism, mode, result });
  }, [talib, matloob, ism, mode, result, setPageState]);

  const handleCalculate = useCallback(async () => {
    if (!talib.trim()) return;
    setLoading(true);
    const res = await calculateHadim(talib.trim(), matloob.trim(), ism.trim(), mode);
    setResult(res);
    setLoading(false);
  }, [talib, matloob, ism, mode]);

  const handleClear = () => {
    setTalib("");
    setMatloob("");
    setIsm("");
    setMode("ulvi");
    setResult(null);
    clearPageState(PAGE_KEY);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`📿 ${result.ceremonialName}\n${result.grandTotal}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout>
      <div className="space-y-4">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Star className="w-6 h-6" style={{ color: G.text }} />
          </div>
          <h1 className="font-amiri text-3xl font-bold text-white">مولّد الخادم</h1>
          <p className="font-inter text-[10px] uppercase tracking-[0.25em] text-white/40 font-semibold">HADIM GENERATOR</p>
          <p className="font-inter text-[9px] text-white/50 uppercase tracking-widest">OTTOMAN NAME-CONSTRUCTION</p>
        </div>

        {/* ── SELECT HADIM TYPE (BEFORE INPUTS - GitHub Original Order) ─ */}
        <div className="rounded-2xl border p-4"
          style={{
            background: G.bg,
            borderColor: G.border,
            boxShadow: "0 4px 24px rgba(0,0,0,0.40)",
          }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-3 text-center" style={{ color: G.dim }}>
            SELECT HADIM TYPE
          </p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(MODE_DATA).map(([key, data]) => {
              const Icon = data.icon;
              const active = mode === key;
              return (
                <motion.button
                  key={key}
                  onClick={() => setMode(key)}
                  whileTap={{ scale: active ? 1 : 1.02 }}
                  className="rounded-xl border p-3 flex flex-col items-center gap-1.5 transition-all"
                  style={{
                    background: active ? data.bg : "rgba(255,255,255,0.02)",
                    borderColor: active ? data.border : G.border,
                    boxShadow: active ? `0 0 20px ${data.glow}` : "none",
                  }}>
                  <Icon className="w-5 h-5" style={{ color: active ? data.color : G.dim }} />
                  <span className="font-inter text-[9px] font-bold uppercase tracking-wider" style={{ color: active ? data.color : "rgba(255,255,255,0.50)" }}>
                    {data.label}
                  </span>
                  <span className="font-amiri text-xs" style={{ color: active ? data.color : "rgba(255,255,255,0.30)" }}>
                    {data.arabic}
                  </span>
                  {active && (
                    <span className="font-inter text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: data.color, color: "#000" }}>
                      {data.value}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── INPUT CARD (Purple Theme - GitHub Original) ─────────────── */}
        <div className="rounded-2xl border p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(15,12,25,0.99) 0%, rgba(10,8,20,0.99) 100%)",
            borderColor: G.borderHi,
            boxShadow: `0 0 40px ${G.glow}, 0 4px 28px rgba(0,0,0,0.50), inset 0 1px 0 rgba(106,90,205,0.12)`,
          }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(106,90,205,0.40), transparent)` }} />
          
          {/* TALIB (طالب) */}
          <label className="block font-inter text-[10px] uppercase tracking-[0.22em] mb-2.5" style={{ color: G.dim }}>
            TALIB — طالب
          </label>
          <input 
            value={talib} 
            onChange={(e) => setTalib(e.target.value)}
            placeholder="اسمك..."
            dir="rtl"
            className="w-full rounded-xl px-4 py-3 font-amiri text-xl text-white leading-relaxed focus:outline-none caret-purple-400 mb-4 placeholder:text-white/35"
            style={{ background: "rgba(8,6,15,0.98)", border: `1px solid ${G.border}` }} 
          />

          {/* MATLOOB (المطلوب) - RESTORED */}
          <label className="block font-inter text-[10px] uppercase tracking-[0.22em] mb-2.5" style={{ color: G.dim }}>
            MATLOOB — المطلوب
          </label>
          <input 
            value={matloob} 
            onChange={(e) => setMatloob(e.target.value)}
            placeholder="رزق، محبة، فتح، اسم شخص..."
            dir="rtl"
            className="w-full rounded-xl px-4 py-3 font-amiri text-xl text-white leading-relaxed focus:outline-none caret-purple-400 mb-4 placeholder:text-white/35"
            style={{ background: "rgba(8,6,15,0.98)", border: `1px solid ${G.border}` }} 
          />

          {/* ISM (NAMES / AYAH / SURAH) */}
          <label className="block font-inter text-[10px] uppercase tracking-[0.22em] mb-2.5" style={{ color: G.dim }}>
            ISM — NAMES / AYAH / SURAH
          </label>
          <input 
            value={ism} 
            onChange={(e) => setIsm(e.target.value)}
            placeholder="اسم الأم، آية، سورة..."
            dir="rtl"
            className="w-full rounded-xl px-4 py-3 font-amiri text-xl text-white leading-relaxed focus:outline-none caret-purple-400 mb-4 placeholder:text-white/35"
            style={{ background: "rgba(8,6,15,0.98)", border: `1px solid ${G.border}` }} 
          />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button 
              onClick={handleCalculate} 
              disabled={!talib.trim() || loading}
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-inter font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed text-white tracking-wide"
              style={{ 
                background: "linear-gradient(135deg, rgba(106,90,205,0.80) 0%, rgba(106,90,205,0.50) 100%)", 
                boxShadow: `0 0 36px ${G.glowHi}, 0 2px 12px rgba(0,0,0,0.35)` 
              }}>
              {loading ? (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Star className="w-4 h-4" />
              )}
              {loading ? "Calculating…" : "Generate Hadim"}
            </motion.button>
            <motion.button 
              onClick={handleClear} 
              disabled={!talib && !matloob && !ism && !result && !loading}
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 py-3 px-4 rounded-xl text-white/55 hover:text-white font-inter text-sm border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ 
                background: "rgba(255,255,255,0.03)", 
                borderColor: "rgba(255,255,255,0.12)", 
                width: "auto", 
                flexShrink: 0 
              }}>
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </motion.button>
          </div>
        </div>

        {/* ── Results ────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              key="results" 
              initial={{ opacity: 0, y: 16 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }} 
              className="space-y-3"
            >
              <HadimTypePanel result={result} />
              <HadimZikr result={result} />
              <HadimKasem result={result} />
              
              <div className="flex items-center gap-2 pt-1">
                <motion.button 
                  onClick={handleCopy} 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg border border-white/15 text-white/60 hover:text-white text-xs font-inter transition-all"
                  style={{ background: "rgba(255,255,255,0.06)" }}>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
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