import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Wand2, Plus } from "lucide-react";
import { processText } from "../lib/abjadValues";
import PageLayout from "../components/PageLayout";

// ── Positional lookup maps ──
const UNITS_MAP    = { 1:'ا',2:'ب',3:'ج',4:'د',5:'ه',6:'و',7:'ز',8:'ح',9:'ط' };
const TENS_MAP     = { 1:'ي',2:'ك',3:'ل',4:'م',5:'ن',6:'س',7:'ع',8:'ف',9:'ص' };
const HUNDREDS_MAP = { 1:'ق',2:'ر',3:'ش',4:'ت',5:'ث',6:'خ',7:'ذ',8:'ض',9:'ظ' };

/**
 * Positional Istintaq
 * Decomposes n into: thousands part, hundreds, tens, units.
 * Thousands: always one fixed marker ع, then if extra thousands (>1000),
 *   encode (thousands_count - 1) as a unit letter.
 * Order of steps (right-to-left): units → tens → hundreds → thousands → extra-thousands
 */
function positionalIstintaq(n) {
  if (n <= 0) return { steps: [], combined: '', separated: '', reversedCombined: '', reversedSeparated: '' };
  n = Math.floor(n);

  const thousands = Math.floor(n / 1000);
  const remainder = n % 1000;
  const hundreds  = Math.floor(remainder / 100);
  const tens      = Math.floor((remainder % 100) / 10);
  const units     = remainder % 10;

  const steps = [];

  // Units
  steps.push({ label: 'Units',    value: units,    letters: units    ? (UNITS_MAP[units]    || '') : '' });
  // Tens
  steps.push({ label: 'Tens',     value: tens * 10, letters: tens    ? (TENS_MAP[tens]      || '') : '' });
  // Hundreds
  steps.push({ label: 'Hundreds', value: hundreds * 100, letters: hundreds ? (HUNDREDS_MAP[hundreds] || '') : '' });
  // Thousands marker (ع) — only if there is a thousands component
  if (thousands > 0) {
    steps.push({ label: 'Thousands', value: 1000, letters: 'ع' });
    // Extra thousands: (thousands - 1) encoded as unit letter
    const extra = thousands - 1;
    if (extra > 0) {
      steps.push({ label: 'Extra ×1000', value: extra, letters: UNITS_MAP[extra] || '' });
    }
  }

  // Build combined string (in step order: units→tens→hundreds→thousands→extra)
  const combined = steps.map(s => s.letters).join('');
  const separated = steps.map(s => s.letters).filter(l => l).join(' ');
  const reversedCombined = combined.split('').reverse().join('');
  const reversedSeparated = combined.split('').reverse().join(' ');
  return { steps, combined, separated, reversedCombined, reversedSeparated };
}

/**
 * Individual Hadim Reduction (Step A)
 * >= 41 → value - 41
 * <  41 → (value + 316) - 41
 */
function hadimReduce(value) {
  if (value >= 41) {
    return { reduced: value - 41, boosted: false, adjusted: value };
  } else {
    const adj = value + 316;
    return { reduced: adj - 41, boosted: true, adjusted: adj };
  }
}

/**
 * Full hadim computation for a single numeric value.
 * Returns { abjad, boosted, adjusted, reduced, istintaq, name }
 */
function computeHadim(abjad) {
  const { reduced, boosted, adjusted } = hadimReduce(abjad);
  const istintaq = positionalIstintaq(reduced);
  const name = istintaq.reversedCombined + 'ائيل';
  return { abjad, boosted, adjusted, reduced, istintaq, name };
}

export default function HadimPage() {
  const [talib, setTalib]   = useState("");
  const [matloob, setMatloob] = useState("");
  const [isms, setIsms]     = useState(["", "", "", "", ""]);
  const [result, setResult] = useState(null);

  const addIsm    = () => setIsms(p => [...p, ""]);
  const removeIsm = (i) => setIsms(p => p.filter((_, idx) => idx !== i));
  const updateIsm = (i, v) => setIsms(p => p.map((x, idx) => idx === i ? v : x));

  const handleGenerate = () => {
    const talibData   = talib.trim()   ? { label: 'Talib',   text: talib,   abjad: processText(talib).total,   letters: processText(talib).letters }   : null;
    const matloobData = matloob.trim() ? { label: 'Matloob', text: matloob, abjad: processText(matloob).total, letters: processText(matloob).letters } : null;
    const ismData     = isms.map((t, i) => t.trim() ? { label: `Ism ${i + 1}`, text: t, abjad: processText(t).total, letters: processText(t).letters } : null).filter(Boolean);

    const allIndividuals = [
      ...(talibData ? [talibData] : []),
      ...(matloobData ? [matloobData] : []),
      ...ismData,
    ];
    if (!allIndividuals.length) return;

    // Compute individual hadim for each
    const individuals = allIndividuals.map(item => ({
      ...item,
      hadim: computeHadim(item.abjad),
    }));

    // Final Grand Hadim: sum of all individual REDUCED values → reduce again
    const grandReducedSum = individuals.reduce((acc, item) => acc + item.hadim.reduced, 0);
    const grandHadim = computeHadim(grandReducedSum);

    setResult({ individuals, grandReducedSum, grandHadim });
  };

  const handleClear = () => { setTalib(""); setMatloob(""); setIsms(["","","","",""]); setResult(null); };

  return (
    <PageLayout accentColor="purple">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-purple-500/25 mb-4"
            style={{ background: "linear-gradient(180deg, rgba(168,85,247,0.22) 0%, rgba(168,85,247,0.10) 100%)", boxShadow: "0 0 24px rgba(168,85,247,0.18)" }}>
            <span className="font-amiri text-2xl text-purple-300">خ</span>
          </motion.div>
          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white">مولّد الخادم</h1>
          <p className="font-inter text-xs text-purple-400/55 mt-1.5 tracking-widest uppercase font-medium">Hadim Generator</p>
          <PurpleDivider />
        </div>

        {/* Input Card */}
        <div className="rounded-2xl border p-5 space-y-4"
          style={{ background: "rgba(15,48,80,0.92)", borderColor: "rgba(168,85,247,0.55)", boxShadow: "0 0 28px rgba(168,85,247,0.14), 0 4px 20px rgba(0,0,0,0.35)" }}>

          <div>
            <label className="block font-inter text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(168,85,247,0.70)" }}>Talib (طالب)</label>
            <input dir="rtl" type="text" value={talib} onChange={(e) => setTalib(e.target.value)}
              placeholder="اسمك..."
              className="w-full rounded-xl px-4 py-3 font-amiri text-lg text-white focus:outline-none caret-white placeholder:text-white/30"
              style={{ background: "rgba(8,25,48,0.95)", border: "1px solid rgba(168,85,247,0.40)" }} />
          </div>

          <div>
            <label className="block font-inter text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(168,85,247,0.70)" }}>Matloob (المطلوب)</label>
            <input dir="rtl" type="text" value={matloob} onChange={(e) => setMatloob(e.target.value)}
              placeholder="رزق، محبة، فتح، اسم شخص..."
              className="w-full rounded-xl px-4 py-3 font-amiri text-lg text-white focus:outline-none caret-white placeholder:text-white/30"
              style={{ background: "rgba(8,25,48,0.95)", border: "1px solid rgba(168,85,247,0.40)" }} />
          </div>

          <div>
            <label className="block font-inter text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(168,85,247,0.70)" }}>Ism (Names / Ayah / Surah)</label>
            <div className="space-y-3">
              {isms.map((val, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <span className="block font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(168,85,247,0.45)" }}>Ism {i + 1}</span>
                    <textarea dir="rtl" value={val} onChange={(e) => updateIsm(i, e.target.value)}
                      placeholder="اسم، آية، سورة..." rows={2}
                      className="w-full rounded-xl px-4 py-3 font-amiri text-xl text-white leading-relaxed resize-none focus:outline-none caret-white placeholder:text-white/30"
                      style={{ background: "rgba(8,25,48,0.95)", border: "1px solid rgba(168,85,247,0.35)" }} />
                  </div>
                  {isms.length > 1 && (
                    <button onClick={() => removeIsm(i)}
                      className="mt-5 p-2.5 rounded-xl border border-red-500/20 text-red-400/50 hover:text-red-400 hover:border-red-500/40 transition-all flex-shrink-0"
                      style={{ background: "rgba(239,68,68,0.06)" }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addIsm}
              className="flex items-center gap-1.5 text-xs font-inter text-purple-300/70 hover:text-purple-300 border border-purple-500/20 hover:border-purple-500/45 rounded-lg px-3 py-1.5 mt-3 transition-all"
              style={{ background: "rgba(168,85,247,0.06)" }}>
              <Plus className="w-3.5 h-3.5" /> + Add Ism
            </button>
          </div>

          <div className="flex gap-2 pt-1">
            <motion.button onClick={handleGenerate} disabled={!talib.trim() && !matloob.trim() && !isms.some(t => t.trim())}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-inter font-semibold text-sm text-[#0d1b2a] disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#c084fc,#7c3aed)", boxShadow: "0 0 32px rgba(168,85,247,0.55), 0 2px 10px rgba(0,0,0,0.3)" }}>
              <Wand2 className="w-3.5 h-3.5" /> Generate Hadim
            </motion.button>
            <motion.button onClick={handleClear} disabled={!talib && !matloob && !isms.some(t=>t.trim()) && !result}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-white/70 hover:text-white font-inter text-sm border border-white/15 hover:border-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </motion.button>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div key="hadim-results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">

              {/* Individual Hadim Cards */}
              {result.individuals.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <GlowCard>
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-inter text-[10px] uppercase tracking-widest text-purple-300/55">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-inter text-[9px] text-purple-300/40 uppercase tracking-widest">Abjad</span>
                        <span className="font-inter text-sm font-bold text-white tabular-nums">{item.abjad}</span>
                      </div>
                    </div>
                    <p className="font-amiri text-lg text-white/60 mb-3" dir="rtl">{item.text}</p>

                    {/* Abjad letter breakdown */}
                    <div className="flex flex-wrap gap-1.5 mb-4" dir="rtl">
                      {item.letters.map((l, li) => (
                        <div key={li} className="flex flex-col items-center rounded-lg border border-purple-500/15 px-2 py-1" style={{ background: "rgba(255,255,255,0.04)" }}>
                          <span className="font-amiri text-base text-white">{l.original}</span>
                          <span className="font-inter text-[9px] text-purple-300/70">{l.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Reduction step */}
                    <div className="rounded-xl border border-purple-500/15 px-3 py-2 mb-3 font-inter text-xs text-white/45" style={{ background: "rgba(168,85,247,0.05)" }}>
                      {item.hadim.boosted
                        ? `${item.abjad} < 41 → ${item.abjad} + 316 = ${item.hadim.adjusted} − 41 = ${item.hadim.reduced}`
                        : `${item.abjad} ≥ 41 → ${item.abjad} − 41 = ${item.hadim.reduced}`}
                    </div>

                    {/* Positional extraction grid */}
                    <div className="flex flex-wrap gap-2 mb-3 justify-end" dir="rtl">
                      {item.hadim.istintaq.steps.map((step, pi) => (
                        <div key={pi} className="flex flex-col items-center rounded-xl border px-3 py-2 min-w-[48px]"
                          style={{ background: step.letters ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.03)", borderColor: step.letters ? "rgba(168,85,247,0.35)" : "rgba(255,255,255,0.08)" }}>
                          <span className="font-amiri text-xl text-white leading-none mb-0.5">{step.letters || '—'}</span>
                          <span className="font-inter text-[9px] tabular-nums" style={{ color: "rgba(168,85,247,0.65)" }}>{step.value}</span>
                          <span className="font-inter text-[7px] uppercase tracking-wide text-white/25 mt-0.5">{step.label.split(' ')[0]}</span>
                        </div>
                      ))}
                    </div>

                    {/* Hadim Name */}
                    <div className="rounded-2xl border border-purple-500/40 p-4 text-center"
                      style={{ background: "rgba(168,85,247,0.14)", boxShadow: "0 0 20px rgba(168,85,247,0.22)" }}>
                      <p className="font-inter text-[9px] uppercase tracking-widest text-purple-300/55 mb-1">Hadim Name</p>
                      <p className="font-amiri text-4xl font-bold text-white" style={{ textShadow: "0 0 24px rgba(168,85,247,0.75)" }}>{item.hadim.name}</p>
                      <p className="font-inter text-[10px] text-purple-400/45 mt-1" dir="rtl">{item.hadim.istintaq.reversedSeparated} + ائيل</p>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}

              {/* Grand Combined Hadim */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: result.individuals.length * 0.07 + 0.1 }}>
                <div className="rounded-2xl border border-purple-400/50 p-5 space-y-4"
                  style={{ background: "rgba(20,10,50,0.96)", boxShadow: "0 0 40px rgba(168,85,247,0.30), 0 4px 24px rgba(0,0,0,0.50)" }}>
                  <p className="font-inter text-[10px] text-purple-300/60 uppercase tracking-widest">Final Grand Hadim</p>

                  {/* Sum of reduced values */}
                  <div className="space-y-1.5">
                    {result.individuals.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="font-inter text-[10px] uppercase tracking-widest text-purple-300/40">{item.label} reduced</span>
                        <span className="font-inter text-xs text-white/60 tabular-nums">{item.hadim.reduced}</span>
                      </div>
                    ))}
                    <div className="h-px bg-purple-500/25 my-1" />
                    <div className="flex justify-between items-center">
                      <span className="font-inter text-[10px] uppercase tracking-widest text-purple-300/60">Sum</span>
                      <span className="font-inter text-sm font-bold text-white tabular-nums">{result.grandReducedSum}</span>
                    </div>
                  </div>

                  {/* Grand reduction step */}
                  <div className="rounded-xl border border-purple-500/20 px-3 py-2 font-inter text-xs text-white/45" style={{ background: "rgba(168,85,247,0.06)" }}>
                    {result.grandHadim.boosted
                      ? `${result.grandReducedSum} < 41 → ${result.grandReducedSum} + 316 = ${result.grandHadim.adjusted} − 41 = ${result.grandHadim.reduced}`
                      : `${result.grandReducedSum} ≥ 41 → ${result.grandReducedSum} − 41 = ${result.grandHadim.reduced}`}
                  </div>

                  {/* Positional extraction */}
                  <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
                    {result.grandHadim.istintaq.steps.map((step, pi) => (
                      <div key={pi} className="flex flex-col items-center rounded-xl border px-3 py-2 min-w-[52px]"
                        style={{ background: step.letters ? "rgba(168,85,247,0.18)" : "rgba(255,255,255,0.03)", borderColor: step.letters ? "rgba(168,85,247,0.50)" : "rgba(255,255,255,0.08)" }}>
                        <span className="font-amiri text-2xl text-white leading-none mb-0.5">{step.letters || '—'}</span>
                        <span className="font-inter text-[9px] tabular-nums" style={{ color: "rgba(200,150,255,0.80)" }}>{step.value}</span>
                        <span className="font-inter text-[7px] uppercase tracking-wide text-white/25 mt-0.5">{step.label.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>

                  {/* Grand Name */}
                  <div className="rounded-2xl border border-purple-400/60 p-5 text-center"
                    style={{ background: "rgba(168,85,247,0.18)", boxShadow: "0 0 40px rgba(168,85,247,0.40)" }}>
                    <p className="font-inter text-[10px] text-purple-300/60 uppercase tracking-widest mb-2">Grand Hadim Name</p>
                    <p className="font-amiri text-5xl font-bold text-white" style={{ textShadow: "0 0 32px rgba(168,85,247,0.90)" }}>{result.grandHadim.name}</p>
                    <p className="font-inter text-xs text-purple-400/50 mt-2" dir="rtl">{result.grandHadim.istintaq.reversedSeparated} + ائيل</p>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}

function PurpleDivider() {
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500/70" />
      <div className="w-1.5 h-1.5 rounded-full bg-purple-500/80" />
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500/70" />
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