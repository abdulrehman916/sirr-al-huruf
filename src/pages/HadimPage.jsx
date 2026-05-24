import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Wand2, Plus } from "lucide-react";
import { processText } from "../lib/abjadValues";
import PageLayout from "../components/PageLayout";

// ── Positional Abjad lookup maps ──
// Units (1–9)
const UNITS_MAP = { 1:'ا',2:'ب',3:'ج',4:'د',5:'ه',6:'و',7:'ز',8:'ح',9:'ط' };
// Tens (10–90)
const TENS_MAP  = { 1:'ي',2:'ك',3:'ل',4:'م',5:'ن',6:'س',7:'ع',8:'ف',9:'ص' };
// Hundreds (100–900)
const HUNDREDS_MAP = { 1:'ق',2:'ر',3:'ش',4:'ت',5:'ث',6:'خ',7:'ذ',8:'ض',9:'ظ' };
// Thousands: ع + unit-letter (1000→عا, 2000→عب … 9000→عط)
// Zero in thousands position → ع alone
function thousandsLetters(digit) {
  if (digit === 0) return 'ع';
  return 'ع' + UNITS_MAP[digit];
}

/**
 * Positional Cyclical Istintaq
 * Reads number digit-by-digit from RIGHT → LEFT.
 * Position cycle: units(0) → tens(1) → hundreds(2) → thousands(3) → repeat.
 * Returns array of { digit, posLabel, posIndex, letters } for display + combined string.
 */
function positionalIstintaq(n) {
  if (n <= 0) return { steps: [], combined: '', separated: '' };

  // Extract digits right-to-left
  const str = String(Math.floor(n));
  const digits = str.split('').reverse().map(Number); // index 0 = rightmost

  const POS_LABELS = ['Units', 'Tens', 'Hundreds', 'Thousands'];
  const steps = [];

  digits.forEach((digit, posIndex) => {
    const cycle = Math.floor(posIndex / 4);
    const posSlot = posIndex % 4; // 0=units,1=tens,2=hundreds,3=thousands
    const posLabel = POS_LABELS[posSlot] + (cycle > 0 ? ` (cycle ${cycle + 1})` : '');
    let letters = '';

    if (posSlot === 3) {
      // Thousands: zero → ع, non-zero → ع + unit letter
      letters = thousandsLetters(digit);
    } else if (digit === 0) {
      // Zero in non-thousands position: position preserved, no letter
      letters = '';
    } else if (posSlot === 0) {
      letters = UNITS_MAP[digit] || '';
    } else if (posSlot === 1) {
      letters = TENS_MAP[digit] || '';
    } else if (posSlot === 2) {
      letters = HUNDREDS_MAP[digit] || '';
    }

    steps.push({ digit, posIndex, posSlot, posLabel, letters });
  });

  const combined = steps.map(s => s.letters).join('');
  const separated = steps.map(s => s.letters).filter(l => l).join(' ');

  // Reverse the final display output (character-level reverse of combined)
  const reversedCombined = combined.split('').reverse().join('');
  const reversedSeparated = combined.split('').reverse().join(' ');

  return { steps, combined, separated, reversedCombined, reversedSeparated };
}

// ── Legacy breakdown for backward compat (used in per-input display) ──
const ISTINTAQ_TABLE = [
  [1000,'غ'],[900,'ظ'],[800,'ض'],[700,'ذ'],[600,'خ'],[500,'ث'],
  [400,'ت'],[300,'ش'],[200,'ر'],[100,'ق'],
  [90,'ص'],[80,'ف'],[70,'ع'],[60,'س'],[50,'ن'],[40,'م'],
  [30,'ل'],[20,'ك'],[10,'ي'],
  [9,'ط'],[8,'ح'],[7,'ز'],[6,'و'],[5,'ه'],[4,'د'],[3,'ج'],[2,'ب'],[1,'ا'],
];
function numToLetters(n) {
  if (n <= 0) return '';
  let r = '';
  for (const [v, l] of ISTINTAQ_TABLE) { while (n >= v) { r += l; n -= v; } }
  return r;
}

const HADIM_SUB = { ulvi: 41, sufli: 316, sherli: 319 };

export default function HadimPage() {
  const [talib, setTalib] = useState("");
  const [matloob, setMatloob] = useState("");
  const [isms, setIsms] = useState(["", "", "", "", ""]);
  const [type, setType] = useState("ulvi");
  const [result, setResult] = useState(null);

  const addIsm = () => setIsms(p => [...p, ""]);
  const removeIsm = (i) => setIsms(p => p.filter((_, idx) => idx !== i));
  const updateIsm = (i, v) => setIsms(p => p.map((x, idx) => idx === i ? v : x));

  const handleGenerate = () => {
    const talibR = talib.trim() ? processText(talib) : null;
    const matloobR = matloob.trim() ? processText(matloob) : null;
    const ismItems = isms.map((t, i) => ({ index: i, text: t, r: processText(t) })).filter(x => x.text.trim());
    const allFields = [
      ...(talibR ? [{ label: 'Talib', text: talib, r: talibR }] : []),
      ...(matloobR ? [{ label: 'Matloob', text: matloob, r: matloobR }] : []),
      ...ismItems.map(x => ({ label: `Ism ${x.index + 1}`, text: x.text, r: x.r })),
    ];
    if (!allFields.length) return;
    const grandTotal = allFields.reduce((a, x) => a + x.r.total, 0);
    const sub = HADIM_SUB[type];
    const needed360 = grandTotal < sub;
    const adjusted = needed360 ? grandTotal + 361 : grandTotal;
    const final = adjusted - sub;
    const istintaq = positionalIstintaq(final);
    const letters = istintaq.reversedCombined;
    const perInput = ismItems.map(({ text, r, index }) => {
      const iNeeded = r.total < sub;
      const iAdj = iNeeded ? r.total + 361 : r.total;
      const iFinal = iAdj - sub;
      const iIstintaq = positionalIstintaq(iFinal);
      const iLetters = iIstintaq.reversedCombined;
      return { label: `Ism ${index + 1}`, text, total: r.total, needed360: iNeeded, adjusted: iAdj, final: iFinal, extracted: iLetters, name: iLetters + 'ائيل', istintaq: iIstintaq };
    });
    setResult({ allFields, grandTotal, sub, needed360, adjusted, final, letters, name: letters + 'ائيل', istintaq, perInput, type });
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

          {/* Type Selector */}
          <div>
            <label className="block font-inter text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(168,85,247,0.70)" }}>Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[['ulvi','Ulvi','−41'],['sufli','Sufli','−316'],['sherli','Sherli','−319']].map(([key, label, sub]) => (
                <button key={key} onClick={() => setType(key)}
                  className="rounded-xl py-2.5 px-3 text-center border transition-all"
                  style={{
                    background: type === key ? "rgba(168,85,247,0.22)" : "rgba(255,255,255,0.04)",
                    borderColor: type === key ? "rgba(168,85,247,0.65)" : "rgba(255,255,255,0.12)",
                    boxShadow: type === key ? "0 0 16px rgba(168,85,247,0.28)" : "none",
                  }}>
                  <p className="font-inter text-sm font-bold text-white">{label}</p>
                  <p className="font-inter text-[10px] mt-0.5" style={{ color: type === key ? "rgba(200,170,255,0.80)" : "rgba(255,255,255,0.35)" }}>{sub}</p>
                </button>
              ))}
            </div>
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
            <motion.div key="hadim-results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">

              <GlowCard>
                <p className="font-inter text-[10px] text-purple-300/50 uppercase tracking-widest mb-4">Step 1 — Abjad Analysis per Input</p>
                <div className="space-y-3">
                  {result.allFields.map((field, fi) => (
                    <div key={fi} className="rounded-xl border border-purple-500/15 p-3" style={{ background: "rgba(168,85,247,0.06)" }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-inter text-[10px] uppercase tracking-widest text-purple-300/60">{field.label}</span>
                        <span className="font-inter text-xs font-bold text-white tabular-nums">{field.r.total}</span>
                      </div>
                      <p className="font-amiri text-base text-white/60 mb-2" dir="rtl">{field.text}</p>
                      <div className="flex flex-wrap gap-1.5" dir="rtl">
                        {field.r.letters.map((l, li) => (
                          <div key={li} className="flex flex-col items-center rounded-lg border border-purple-500/15 px-2 py-1" style={{ background: "rgba(255,255,255,0.04)" }}>
                            <span className="font-amiri text-base text-white">{l.original}</span>
                            <span className="font-inter text-[9px] text-purple-300/70">{l.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </GlowCard>

              <GlowCard>
                <p className="font-inter text-[10px] text-purple-300/50 uppercase tracking-widest mb-4">Step 2 — Total Summary</p>
                <div className="space-y-2" dir="rtl">
                  {result.allFields.map((field, fi) => (
                    <div key={fi} className="flex justify-between items-center">
                      <span className="font-inter text-[10px] uppercase tracking-widest text-purple-300/50">{field.label}</span>
                      <span className="font-inter text-xs text-white/70 tabular-nums">{field.r.total}</span>
                    </div>
                  ))}
                  <div className="h-px bg-purple-500/20 my-1" />
                  <div className="flex justify-between items-center">
                    <span className="font-inter text-[10px] uppercase tracking-widest text-purple-300/60">Grand Total</span>
                    <span className="font-inter text-lg font-bold text-white tabular-nums" style={{ textShadow: "0 0 12px rgba(168,85,247,0.70)" }}>{result.grandTotal}</span>
                  </div>
                </div>
              </GlowCard>

              <GlowCard>
                <p className="font-inter text-[10px] text-purple-300/50 uppercase tracking-widest mb-4">Step 3–4 — Type &amp; Subtraction</p>
                <div className="rounded-xl border border-purple-500/20 p-3 mb-3" style={{ background: "rgba(168,85,247,0.07)" }}>
                  <p className="font-inter text-xs text-white/50 mb-2">
                    {result.needed360
                      ? `Total ${result.grandTotal} < ${result.sub} → add 361 → ${result.grandTotal + 361} − ${result.sub} = ${result.final}`
                      : `Total ${result.grandTotal} ≥ ${result.sub} → ${result.grandTotal} − ${result.sub} = ${result.final}`}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-amiri text-base text-white/70">After Subtraction (−{result.sub})</span>
                    <span className="font-inter text-sm font-bold text-yellow-400 tabular-nums" style={{ textShadow: "0 0 10px rgba(234,179,8,0.50)" }}>{result.final}</span>
                  </div>
                </div>
              </GlowCard>

              <GlowCard>
                <p className="font-inter text-[10px] text-purple-300/50 uppercase tracking-widest mb-4">Step 5 — Positional Istintaq (Right → Left)</p>
                {/* Positional step grid */}
                <div className="flex flex-wrap gap-2 mb-4 justify-end" dir="rtl">
                  {result.istintaq.steps.map((step, pi) => (
                    <div key={pi} className="flex flex-col items-center rounded-xl border px-3 py-2 min-w-[52px]"
                      style={{ background: step.letters ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.03)", borderColor: step.letters ? "rgba(168,85,247,0.35)" : "rgba(255,255,255,0.08)" }}>
                      <span className="font-amiri text-2xl text-white leading-none mb-0.5">{step.letters || '—'}</span>
                      <span className="font-inter text-[9px] tabular-nums" style={{ color: "rgba(168,85,247,0.65)" }}>{step.digit}</span>
                      <span className="font-inter text-[7px] uppercase tracking-wide text-white/25 mt-0.5">{step.posLabel.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
                {/* Separated mode (reversed) */}
                <div className="rounded-xl border border-purple-500/20 px-4 py-3 mb-2 flex items-center justify-between"
                  style={{ background: "rgba(168,85,247,0.07)" }}>
                  <span className="font-inter text-[10px] uppercase tracking-widest text-purple-300/50">Separated</span>
                  <span className="font-amiri text-xl text-white tracking-widest" dir="rtl">{result.istintaq.reversedSeparated}</span>
                </div>
                {/* Combined ceremonial mode (reversed) */}
                <div className="rounded-xl border border-purple-500/40 px-4 py-3 flex items-center justify-between"
                  style={{ background: "rgba(168,85,247,0.14)", boxShadow: "0 0 16px rgba(168,85,247,0.18)" }}>
                  <span className="font-inter text-[10px] uppercase tracking-widest text-purple-300/60">Ceremonial</span>
                  <span className="font-amiri text-2xl font-bold text-white" dir="rtl" style={{ textShadow: "0 0 14px rgba(168,85,247,0.70)" }}>{result.istintaq.reversedCombined}</span>
                </div>
              </GlowCard>

              {/* Final Name */}
              <div className="rounded-2xl border border-purple-500/40 p-6 text-center"
                style={{ background: "rgba(168,85,247,0.12)", boxShadow: "0 0 32px rgba(168,85,247,0.25)" }}>
                <p className="font-inter text-[10px] text-purple-300/60 uppercase tracking-widest mb-1">Step 6 — Final Hadim Name</p>
                <p className="font-amiri text-5xl font-bold text-white mt-2" style={{ textShadow: "0 0 28px rgba(168,85,247,0.80)" }}>{result.name}</p>
                <p className="font-inter text-xs text-purple-400/50 mt-2">{result.istintaq.reversedSeparated} + ائيل</p>
              </div>

              {/* Per-Input Names */}
              {result.perInput.length > 0 && (
                <div className="space-y-4">
                  <p className="font-inter text-[10px] text-purple-300/50 uppercase tracking-widest px-1">Step 7 — Ism Hadim Names</p>
                  {result.perInput.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className="rounded-2xl border p-5 space-y-3"
                      style={{ background: "rgba(15,48,80,0.92)", borderColor: "rgba(168,85,247,0.35)" }}>
                      <div className="flex items-center justify-between" dir="rtl">
                        <div>
                          <p className="font-inter text-[10px] uppercase tracking-widest text-purple-300/50 mb-1">{item.label}</p>
                          <p className="font-amiri text-2xl text-white">{item.text}</p>
                        </div>
                        <div className="rounded-xl border border-purple-500/25 px-4 py-2 text-center" style={{ background: "rgba(168,85,247,0.10)" }}>
                          <p className="font-inter text-[9px] text-purple-300/50 uppercase tracking-widest">Abjad</p>
                          <p className="font-inter text-lg font-bold text-white tabular-nums">{item.total}</p>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-purple-500/40 p-4 text-center"
                        style={{ background: "rgba(168,85,247,0.14)", boxShadow: "0 0 20px rgba(168,85,247,0.22)" }}>
                        <p className="font-inter text-[9px] uppercase tracking-widest text-purple-300/55 mb-1">Hadim Name</p>
                        <p className="font-amiri text-4xl font-bold text-white" style={{ textShadow: "0 0 24px rgba(168,85,247,0.75)" }}>{item.name}</p>
                        <p className="font-inter text-[10px] text-purple-400/45 mt-1" dir="rtl">{item.istintaq?.reversedSeparated} + ائيل</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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