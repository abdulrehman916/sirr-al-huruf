import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Wand2, Plus } from "lucide-react";
import { processText } from "../lib/abjadValues";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import HadimTypePanel from "../components/HadimTypePanel";
import HadimKasem from "../components/HadimKasem";
import HadimZikr from "../components/HadimZikr";
import { usePageState } from "../context/PageStateContext";

// ── Positional lookup maps ──
const UNITS_MAP    = { 1:'ا', 2:'ب', 3:'ج', 4:'د', 5:'ه', 6:'و', 7:'ز', 8:'ح', 9:'ط' };
const TENS_MAP     = { 1:'ي', 2:'ك', 3:'ل', 4:'م', 5:'ن', 6:'س', 7:'ع', 8:'ف', 9:'ص' };
const HUNDREDS_MAP = { 1:'ق', 2:'ر', 3:'ش', 4:'ت', 5:'ث', 6:'خ', 7:'ذ', 8:'ض', 9:'ظ' };

/**
 * MASTER HADIM POSITIONAL EXTRACTION — FINAL LAW
 *
 * Cycle: Units(0) → Tens(1) → Hundreds(2) → Thousands(3) → restart from Tens(1)
 *
 * ZERO RULE:
 *   - Units / Tens / Hundreds: zero → no letter, but slot advances.
 *   - Thousands slot: ALWAYS emits 'غ' regardless of digit value (even 0).
 *     If digit > 1 → also emit UNITS_MAP[digit] as count letter.
 *     If digit = 0 or 1 → emit 'غ' only.
 *   - After thousands slot: always restart from Tens (slot 1).
 *
 * Verified:
 *  3457      → ز ن ت غ ج        → مغشصا after reversal? No: جغتنز
 *  12846     → و م ض غ ب ي      → يبغضمو
 *  40391     → ا ص ش غ م        → مغشصا
 *  5064      → د س غ ه          → هغسد
 *  100467    → ز س ت غ ق        → قغتسز
 *  293639386 → و ف ش غ ط ل خ غ ج ص ر → رصجغخلطغشفو
 */
function positionalIstintaq(n) {
  if (n <= 0) return { steps: [], separatedLetters: '', joinedCeremonial: '', hadimName: 'ائيل' };
  n = Math.floor(n);

  // Digits right-to-left: index 0 = units place, 1 = tens, 2 = hundreds, 3+ = thousands...
  const digits = String(n).split('').reverse();
  const steps  = [];

  let place = 0; // current digit index
  let slot  = 0; // 0=Units, 1=Tens, 2=Hundreds, 3=Thousands

  while (place < digits.length) {
    const d = parseInt(digits[place]);

    if (slot === 0) {
      // Units — zero emits nothing, slot advances
      if (d > 0) steps.push({ label: 'Units', value: d, letters: UNITS_MAP[d] || '' });
      place++;
      slot = 1;

    } else if (slot === 1) {
      // Tens — zero emits nothing, slot advances
      if (d > 0) steps.push({ label: 'Tens', value: d * 10, letters: TENS_MAP[d] || '' });
      place++;
      slot = 2;

    } else if (slot === 2) {
      // Hundreds — zero emits nothing, slot advances
      if (d > 0) steps.push({ label: 'Hundreds', value: d * 100, letters: HUNDREDS_MAP[d] || '' });
      place++;
      slot = 3;

    } else {
      // Thousands (slot === 3)
      // ALWAYS emit 'غ' — even when digit is 0 (marks the thousands boundary)
      steps.push({ label: 'Thousands', value: 1000, letters: 'غ' });
      // If count > 1, append unit-count letter (d=0 and d=1 → no extra letter)
      if (d > 1) {
        steps.push({ label: `×${d}`, value: d, letters: UNITS_MAP[d] || '' });
      }
      place++;
      // RESTART from TENS (not Units) after every thousands slot
      slot = 1;
    }
  }

  // Ceremonial reversal: highest position first
  const reversed = [...steps].reverse();
  const tokens   = reversed.map(s => s.letters).filter(Boolean);

  const separatedLetters = tokens.join(' ');
  const joinedCeremonial = tokens.join('');
  const hadimName        = joinedCeremonial + 'ائيل';

  return { steps, separatedLetters, joinedCeremonial, hadimName };
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
  return { typeLabel, subtract, reduced, boosted, adjusted, original: value, istintaq };
}

function computeAllTypes(value) {
  return {
    ulvi:  computeType(value, 41,  'ULVI'),
    sufli: computeType(value, 316, 'SUFLI'),
    sherli:computeType(value, 319, 'SHERLI'),
  };
}

const HADIM_MODES = [
  {
    key: 'ULVI',
    icon: '✨',
    label: 'ULVI',
    arabic: 'علوي',
    subtract: 41,
    active:   { border: 'rgba(212,175,55,0.80)', bg: 'rgba(212,175,55,0.18)', glow: '0 0 22px rgba(212,175,55,0.55)', text: '#F5D060' },
    inactive: { border: 'rgba(212,175,55,0.20)', bg: 'rgba(212,175,55,0.05)', text: 'rgba(212,175,55,0.45)' },
  },
  {
    key: 'SUFLI',
    icon: '🔥',
    label: 'SUFLI',
    arabic: 'سفلي',
    subtract: 316,
    active:   { border: 'rgba(220,38,38,0.80)', bg: 'rgba(220,38,38,0.18)', glow: '0 0 22px rgba(220,38,38,0.55)', text: '#FCA5A5' },
    inactive: { border: 'rgba(220,38,38,0.20)', bg: 'rgba(220,38,38,0.05)', text: 'rgba(220,38,38,0.45)' },
  },
  {
    key: 'SHERLI',
    icon: '🜏',
    label: 'SHERLI',
    arabic: 'شرلي',
    subtract: 319,
    active:   { border: 'rgba(168,85,247,0.80)', bg: 'rgba(168,85,247,0.18)', glow: '0 0 22px rgba(168,85,247,0.55)', text: '#D8B4FE' },
    inactive: { border: 'rgba(168,85,247,0.20)', bg: 'rgba(168,85,247,0.05)', text: 'rgba(168,85,247,0.45)' },
  },
];

const PAGE_KEY = 'hadim';

export default function HadimPage() {
  const { getPageState, setPageState, clearPageState } = usePageState();
  const initialState = getPageState(PAGE_KEY, {
    hadimMode: 'ULVI',
    talib: "",
    matloob: "",
    isms: ["", "", "", "", ""],
    result: null,
  });
  
  const [hadimMode, setHadimMode] = useState(initialState.hadimMode);
  const [talib, setTalib] = useState(initialState.talib);
  const [matloob, setMatloob] = useState(initialState.matloob);
  const [isms, setIsms] = useState(initialState.isms);
  const [result, setResult] = useState(initialState.result);

  useEffect(() => {
    setPageState(PAGE_KEY, { hadimMode, talib, matloob, isms, result });
  }, [hadimMode, talib, matloob, isms, result, setPageState]);

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

    // Grand sum uses the active mode's reduced values
    const activeKey = hadimMode.toLowerCase();
    const grandSum = individuals.reduce((acc, item) => acc + item.types[activeKey].reduced, 0);
    const grandTypes = computeAllTypes(grandSum);

    setResult({ individuals, grandSum, grandTypes });
  };

  const handleClear = () => {
    setTalib("");
    setMatloob("");
    setIsms(["", "", "", "", ""]);
    setResult(null);
    setHadimMode('ULVI');
    clearPageState(PAGE_KEY);
};

  return (
    <PageLayout accentColor="purple">
      <div className="space-y-4">
        {/* Header */}
        <PageTitle arabic="مولّد الخادم" latin="Hadim Generator" subtitle="Ottoman Name Construction" icon="✦" />

        {/* Hadim Type Selector */}
        <div className="rounded-2xl border p-3"
          style={{ background: "linear-gradient(145deg, rgba(8,18,40,0.99) 0%, rgba(4,10,24,0.99) 100%)", borderColor: "rgba(168,85,247,0.18)", boxShadow: "0 2px 24px rgba(0,0,0,0.50), inset 0 1px 0 rgba(168,85,247,0.08)" }}>
          <p className="font-inter text-[9px] uppercase tracking-[0.22em] text-white/30 text-center mb-2.5">✦ Select Hadim Type</p>
          <div className="grid grid-cols-3 gap-2">
            {HADIM_MODES.map(mode => {
              const isActive = hadimMode === mode.key;
              const s = isActive ? mode.active : mode.inactive;
              return (
                <motion.button
                  key={mode.key}
                  onClick={() => { setHadimMode(mode.key); setResult(null); }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  animate={{
                    background: s.bg,
                    boxShadow: isActive ? s.glow : 'none',
                  }}
                  transition={{ duration: 0.25 }}
                  className="relative flex flex-col items-center justify-center py-3 px-2 rounded-xl border"
                  style={{ borderColor: s.border }}>
                  {isActive && (
                    <motion.div
                      layoutId="modeHighlight"
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{ background: s.bg }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                    />
                  )}
                  <span className="text-lg mb-0.5 relative z-10">{mode.icon}</span>
                  <span className="font-inter text-[11px] font-bold tracking-widest relative z-10" style={{ color: s.text }}>{mode.label}</span>
                  <span className="font-amiri text-[11px] relative z-10" style={{ color: isActive ? s.text : 'rgba(255,255,255,0.25)' }}>{mode.arabic}</span>
                  {isActive && (
                    <span className="font-inter text-[8px] uppercase tracking-widest mt-0.5 relative z-10" style={{ color: s.text, opacity: 0.65 }}>−{mode.subtract}</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Input Card */}
        <div className="rounded-2xl border p-5 space-y-4 relative overflow-hidden"
          style={{ background: "linear-gradient(145deg, rgba(12,22,50,0.99) 0%, rgba(6,12,32,0.99) 100%)", borderColor: "rgba(168,85,247,0.50)", boxShadow: "0 0 40px rgba(168,85,247,0.12), 0 4px 28px rgba(0,0,0,0.50), inset 0 1px 0 rgba(168,85,247,0.12)" }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.40), transparent)" }} />

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
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-inter font-bold text-sm text-[#0d1b2a] disabled:opacity-30 disabled:cursor-not-allowed tracking-wide"
              style={{ background: "linear-gradient(135deg,#c084fc 0%,#9333ea 50%,#7c3aed 100%)", boxShadow: "0 0 36px rgba(168,85,247,0.55), 0 2px 12px rgba(0,0,0,0.40)" }}>
              <Wand2 className="w-4 h-4" /> Generate Hadim
            </motion.button>
            <motion.button onClick={handleClear} disabled={!talib && !matloob && !isms.some(t=>t.trim()) && !result}
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
            <motion.div key="hadim-results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

              {/* Individual sections */}
              {result.individuals.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  {/* Section header */}
                  <div className="rounded-2xl border p-4 mb-3 relative overflow-hidden"
                    style={{ background: "linear-gradient(145deg, rgba(12,22,50,0.99) 0%, rgba(6,12,32,0.99) 100%)", borderColor: "rgba(168,85,247,0.25)", boxShadow: "0 4px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(168,85,247,0.08)" }}>
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.25), transparent)" }} />
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

                  {/* Active type panel */}
                  <AnimatePresence mode="wait">
                    <motion.div key={hadimMode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
                      <HadimTypePanel typeData={item.types[hadimMode.toLowerCase()]} />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Grand Hadim */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: result.individuals.length * 0.07 + 0.1 }}>
                <div className="rounded-2xl border p-5 space-y-4 relative overflow-hidden"
                  style={{ background: "linear-gradient(145deg, rgba(20,10,50,0.99) 0%, rgba(12,4,32,0.99) 100%)", borderColor: "rgba(168,85,247,0.55)", boxShadow: "0 0 48px rgba(168,85,247,0.22), 0 4px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(168,85,247,0.12)" }}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.50), transparent)" }} />

                  <p className="font-inter text-[11px] text-purple-300/70 uppercase tracking-widest font-bold">⬡ Final Grand Hadim</p>

                  {/* Sum breakdown */}
                  <div className="rounded-xl border border-purple-500/20 px-3 py-2.5 space-y-1.5" style={{ background: "rgba(168,85,247,0.06)" }}>
                    {result.individuals.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="font-inter text-[10px] uppercase tracking-widest text-purple-300/40">{item.label} reduced</span>
                        <span className="font-inter text-xs text-white/60 tabular-nums">{item.types[hadimMode.toLowerCase()].reduced}</span>
                      </div>
                    ))}
                    <div className="h-px bg-purple-500/25 my-1" />
                    <div className="flex justify-between items-center">
                      <span className="font-inter text-[10px] uppercase tracking-widest text-purple-300/70">Grand Sum</span>
                      <span className="font-inter text-sm font-bold text-white tabular-nums">{result.grandSum}</span>
                    </div>
                  </div>

                  {/* Active grand type panel */}
                  <AnimatePresence mode="wait">
                    <motion.div key={hadimMode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
                      <HadimTypePanel typeData={result.grandTypes[hadimMode.toLowerCase()]} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Kasem Invocation */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: result.individuals.length * 0.07 + 0.25 }}>
                <HadimKasem
                  hadimMode={hadimMode}
                  individuals={result.individuals}
                  grandTypes={result.grandTypes}
                />
              </motion.div>

              {/* Zikr Count */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: result.individuals.length * 0.07 + 0.40 }}>
                <HadimZikr
                  hadimMode={hadimMode}
                  grandSum={result.grandSum}
                />
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