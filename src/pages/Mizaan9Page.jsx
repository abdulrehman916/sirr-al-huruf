import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import PageLayout from "../components/PageLayout";
import { mizaanAnalyzeAsync } from "../lib/mizaan9Engine";
import { DAY_PLANET_MAP } from "../lib/mizaan9Data";
import Mizaan1      from "../components/mizaan/Mizaan1";
import Mizaan2      from "../components/mizaan/Mizaan2";
import Mizaan3      from "../components/mizaan/Mizaan3";
import Mizaan4      from "../components/mizaan/Mizaan4";
import Mizaan5      from "../components/mizaan/Mizaan5";
import Mizaan6      from "../components/mizaan/Mizaan6";
import Mizaan7      from "../components/mizaan/Mizaan7";
import Mizaan8      from "../components/mizaan/Mizaan8";
import Mizaan9Final from "../components/mizaan/Mizaan9Final";
import MizaanFinalSummary from "../components/mizaan/MizaanFinalSummary";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  border:   "rgba(212,175,55,0.40)",
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

function MizaanDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-1">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, rgba(212,175,55,0.20))` }} />
      <span className="font-inter text-[8px] uppercase tracking-widest px-2" style={{ color: "rgba(212,175,55,0.30)" }}>⚖</span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, rgba(212,175,55,0.20))` }} />
    </div>
  );
}

// Build initial selections from dominant element
function buildDefaultSelections(dominant) {
  return {
    elements:   dominant ? [dominant] : [],
    khayrSharr: null,
    hour:       (Math.floor(new Date().getHours() / 2) % 12) + 1,
    days:       ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()],
    planet:     DAY_PLANET_MAP[['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()]] ?? null,
    purposes:   [],
    khayrSharr8: null,
  };
}

export default function Mizaan9Page() {
  const [input,       setInput]       = useState("");
  const [result,      setResult]      = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [selections,    setSelections]    = useState(buildDefaultSelections(null));
  const [customPurpose, setCustomPurpose] = useState("");
  const [degreeSels,    setDegreeSels]    = useState({});
  const abortRef = useRef(false);

  const handleAnalyze = useCallback(async () => {
    if (!input.trim()) return;
    abortRef.current = false;
    setLoading(true);
    setProgress(0);
    setResult(null);
    setSelections(buildDefaultSelections(null));
    const r = await mizaanAnalyzeAsync(input, (p) => { if (!abortRef.current) setProgress(p); });
    if (!abortRef.current) {
      setResult(r);
      // Pre-populate selections with system suggestions
      setSelections(buildDefaultSelections(r.dominant));
    }
    setLoading(false);
  }, [input]);

  const handleClear = () => {
    abortRef.current = true;
    setInput("");
    setResult(null);
    setLoading(false);
    setProgress(0);
    setSelections(buildDefaultSelections(null));
    setDegreeSels({});
  };

  const updateSel = (key) => (val) => setSelections(prev => ({ ...prev, [key]: val }));

  return (
    <PageLayout>
      <div className="space-y-4">

        {/* Header */}
        <div className="text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-yellow-500/25 mb-4"
            style={{ background: "linear-gradient(180deg,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.08) 100%)", boxShadow: "0 0 28px rgba(212,175,55,0.18)" }}>
            <span className="font-amiri text-2xl" style={{ color: "#D4AF37" }}>٩</span>
          </motion.div>
          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white">ميزان الأعداد</h1>
          <p className="font-inter text-xs mt-1 tracking-widest uppercase" style={{ color: G.dim }}>9 Mizan — Complete Occult Analysis</p>
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

          {loading && (
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="font-inter text-[10px] text-white/40 animate-pulse">Analyzing 9 Mizaans…</span>
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

        {/* 9 Mizaans */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div key="mizaan-9-flow"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-2">

              <Mizaan1 result={result} />
              <MizaanDivider />
              <Mizaan2
                dominant={result.dominant}
                tiebreak={result.tiebreak}
                selected={selections.elements}
                onChange={updateSel("elements")}
              />
              <MizaanDivider />
              <Mizaan3
                dominant={result.dominant}
                selected={selections.khayrSharr}
                onChange={updateSel("khayrSharr")}
              />
              <MizaanDivider />
              <Mizaan4
                selected={selections.hour}
                onChange={updateSel("hour")}
              />
              <MizaanDivider />
              <Mizaan5
                selected={selections.days}
                onChange={updateSel("days")}
              />
              <MizaanDivider />
              <Mizaan6
                selectedDay={selections.days}
                selected={selections.planet}
                onChange={updateSel("planet")}
              />
              <MizaanDivider />
              <Mizaan7
                selected={selections.purposes}
                onChange={updateSel("purposes")}
                customPurpose={customPurpose}
                onCustomPurpose={setCustomPurpose}
              />
              <MizaanDivider />
              <Mizaan8
                selected={selections.khayrSharr8}
                onChange={updateSel("khayrSharr8")}
                selectedPurpose={selections.purposes}
              />
              <MizaanDivider />
              <Mizaan9Final result={result} selections={selections} degreeSels={degreeSels} onDegreeSels={setDegreeSels} />
              <MizaanDivider />
              <MizaanFinalSummary result={result} selections={selections} degreeSels={degreeSels} inputText={input} />

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageLayout>
  );
}