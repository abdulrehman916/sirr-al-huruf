import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Wand2, Plus } from "lucide-react";
import { processText } from "../lib/abjadValues";
import PageLayout from "../components/PageLayout";
import HadimTypePanel from "../components/HadimTypePanel";

// ── Positional lookup maps ──
const UNITS_MAP    = { 1:'ا',2:'ب',3:'ج',4:'د',5:'ه',6:'و',7:'ز',8:'ح',9:'ط' };
const TENS_MAP     = { 1:'ي',2:'ك',3:'ل',4:'م',5:'ن',6:'س',7:'ع',8:'ف',9:'ص' };
const HUNDREDS_MAP = { 1:'ق',2:'ر',3:'ش',4:'ت',5:'ث',6:'خ',7:'ذ',8:'ض',9:'ظ' };

function positionalIstintaq(n) {
  if (n <= 0) return { steps: [], combined: '', reversedCombined: '', reversedSeparated: '' };
  n = Math.floor(n);
  const thousands = Math.floor(n / 1000);
  const remainder = n % 1000;
  const hundreds  = Math.floor(remainder / 100);
  const tens      = Math.floor((remainder % 100) / 10);
  const units     = remainder % 10;
  const steps = [];
  steps.push({ label: 'Units',    value: units,         letters: units    ? (UNITS_MAP[units]       || '') : '' });
  steps.push({ label: 'Tens',     value: tens * 10,     letters: tens     ? (TENS_MAP[tens]         || '') : '' });
  steps.push({ label: 'Hundreds', value: hundreds * 100,letters: hundreds ? (HUNDREDS_MAP[hundreds] || '') : '' });
  if (thousands > 0) {
    steps.push({ label: 'Thousands', value: 1000, letters: 'ع' });
    const extra = thousands - 1;
    if (extra > 0) steps.push({ label: 'Extra ×1000', value: extra, letters: UNITS_MAP[extra] || '' });
  }
  const combined = steps.map(s => s.letters).join('');
  const reversedCombined = combined.split('').reverse().join('');
  const reversedSeparated = combined.split('').reverse().join(' ');
  return { steps, combined, reversedCombined, reversedSeparated };
}

/**
 * Compute a single Hadim type.
 * subtract: 41 (Ulvi), 316 (Sufli), 319 (Sherli)
 * Rule: if value >= subtract → reduced = value - subtract
 *       else → adjusted = value + 361, reduced = adjusted - subtract
 */
function computeType(value, subtract, typeLabel) {
  let reduced, boosted, adjusted;
  if (value >= subtract) {
    reduced = value - subtract;
    boosted = false;
    adjusted = value;
  } else {
    adjusted = value + 361;
    reduced = adjusted - subtract;
    boosted = true;
  }
  const istintaq = positionalIstintaq(reduced);
  const name = istintaq.reversedCombined + 'ائيل';
  return { typeLabel, subtract, reduced, boosted, adjusted, istintaq, name };
}

function computeAllTypes(value) {
  return {
    ulvi:  computeType(value, 41,  'ULVI'),
    sufli: computeType(value, 316, 'SUFLI'),
    sherli:computeType(value, 319, 'SHERLI'),
  };
}

export default function HadimPage() {
  const [talib, setTalib]     = useState("");
  const [matloob, setMatloob] = useState("");
  const [isms, setIsms]       = useState(["", "", "", "", ""]);
  const [result, setResult]   = useState(null);

  const addIsm    = () => setIsms(p => [...p, ""]);
  const removeIsm = (i) => setIsms(p => p.filter((_, idx) => idx !== i));
  const updateIsm = (i, v) => setIsms(p => p.map((x, idx) => idx === i ? v : x));

  const handleGenerate = () => {
    const talibData   = talib.trim()   ? { label: 'Talib',   text: talib,   abjad: processText(talib).total,   letters: processText(talib).letters }   : null;
    const matloobData = matloob.trim() ? { label: 'Matloob', text: matloob, abjad: processText(matloob).total, letters: processText(matloob).letters } : null;
    const ismData     = isms.map((t, i) => t.trim() ? { label: `Ism ${i + 1}`, text: t, abjad: processText(t).total, letters: processText(t).letters } : null).filter(Boolean);

    const allIndividuals = [
      ...(talibData   ? [talibData]   : []),
      ...(matloobData ? [matloobData] : []),
      ...ismData,
    ];
    if (!allIndividuals.length) return;

    const individuals = allIndividuals.map(item => ({
      ...item,
      types: computeAllTypes(item.abjad),
    }));

    // Grand sum uses Ulvi reduced values (−41 chain) for the grand total
    const grandSum = individuals.reduce((acc, item) => acc + item.types.ulvi.reduced, 0);
    const grandTypes = computeAllTypes(grandSum);

    setResult({ individuals, grandSum, grandTypes });
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
            <motion.div key="hadim-results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

              {/* Individual sections */}
              {result.individuals.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  {/* Section header */}
                  <div className="rounded-2xl border p-4 mb-3"
                    style={{ background: "rgba(15,48,80,0.92)", borderColor: "rgba(255,255,255,0.20)", boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-inter text-[10px] uppercase tracking-widest text-purple-300/55">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-inter text-[9px] text-purple-300/40 uppercase tracking-widest">Abjad</span>
                        <span className="font-inter text-sm font-bold text-white tabular-nums">{item.abjad}</span>
                      </div>
                    </div>
                    <p className="font-amiri text-lg text-white/60 mb-2" dir="rtl">{item.text}</p>
                    {/* Letter breakdown */}
                    <div className="flex flex-wrap gap-1.5" dir="rtl">
                      {item.letters.map((l, li) => (
                        <div key={li} className="flex flex-col items-center rounded-lg border border-purple-500/15 px-2 py-1" style={{ background: "rgba(255,255,255,0.04)" }}>
                          <span className="font-amiri text-base text-white">{l.original}</span>
                          <span className="font-inter text-[9px] text-purple-300/70">{l.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Three types */}
                  <div className="space-y-3">
                    <HadimTypePanel typeData={item.types.ulvi} />
                    <HadimTypePanel typeData={item.types.sufli} />
                    <HadimTypePanel typeData={item.types.sherli} />
                  </div>
                </motion.div>
              ))}

              {/* Grand Hadim */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: result.individuals.length * 0.07 + 0.1 }}>
                <div className="rounded-2xl border border-purple-400/50 p-5 space-y-4"
                  style={{ background: "rgba(20,10,50,0.96)", boxShadow: "0 0 40px rgba(168,85,247,0.30), 0 4px 24px rgba(0,0,0,0.50)" }}>

                  <p className="font-inter text-[11px] text-purple-300/70 uppercase tracking-widest font-bold">⬡ Final Grand Hadim</p>

                  {/* Sum breakdown */}
                  <div className="rounded-xl border border-purple-500/20 px-3 py-2.5 space-y-1.5" style={{ background: "rgba(168,85,247,0.06)" }}>
                    {result.individuals.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="font-inter text-[10px] uppercase tracking-widest text-purple-300/40">{item.label} (Ulvi reduced)</span>
                        <span className="font-inter text-xs text-white/60 tabular-nums">{item.types.ulvi.reduced}</span>
                      </div>
                    ))}
                    <div className="h-px bg-purple-500/25 my-1" />
                    <div className="flex justify-between items-center">
                      <span className="font-inter text-[10px] uppercase tracking-widest text-purple-300/70">Grand Sum</span>
                      <span className="font-inter text-sm font-bold text-white tabular-nums">{result.grandSum}</span>
                    </div>
                  </div>

                  {/* Three grand types */}
                  <div className="space-y-3">
                    <HadimTypePanel typeData={result.grandTypes.ulvi} />
                    <HadimTypePanel typeData={result.grandTypes.sufli} />
                    <HadimTypePanel typeData={result.grandTypes.sherli} />
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