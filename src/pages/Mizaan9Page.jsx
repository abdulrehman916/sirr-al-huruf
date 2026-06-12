import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { mizaanAnalyzeAsync, mizaanCalcBast } from "../lib/mizaan9Engine";
import { DAY_PLANET_MAP, MIZAAN_KHAYR_SHARR, MIZAAN_HOURS, MIZAAN_DAYS, MIZAAN_PLANETS_ALL, MIZAAN_PURPOSES, MIZAAN_ELEMENT_DEGREES } from "../lib/mizaan9Data";
import { MIZAAN_BAST2 } from "../lib/mizaan9Engine";
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
import MizaanPostResults from "../components/mizaan/MizaanPostResults";
import SatrVahidGrouping from "../components/mizaan/SatrVahidGrouping";
import { runMizaanPostPipeline, istintak, FIRST_BAST } from "../lib/mizaanPostEngine";
import { usePageState } from "../context/PageStateContext";

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

const PAGE_KEY = 'mizaan9';

// ── Helper: re-derive grand totals using same logic as MizaanFinalSummary ──
function computeGrandTotals(result, selections, degreeSels, inputText, customPurpose) {
  if (!result) return { grandBast: 0, grandLetters: 0 };

  function countArabicLetters(str) {
    if (!str) return 0;
    return str.replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '').replace(/[^\u0600-\u06FF]/g, '').length;
  }

  const KHAYR_SHARR_8 = {
    khayr: { arabic: 'الخير', bast: 2731 },
    sharr: { arabic: 'الشر',  bast: 2725 },
  };

  const ELEMENT_META_ARABIC = { fire: "النار", earth: "التراب", air: "الهواء", water: "الماء" };

  let grandBast = 0;
  let grandLetters = 0;

  // M1 — input text
  grandBast   += result.bast1Total ?? 0;
  grandLetters += result.letterCount ?? 0;

  // M2 — element
  const elKeys = Array.isArray(selections?.elements) ? selections.elements : (selections?.elements ? [selections.elements] : []);
  elKeys.forEach(k => {
    grandBast   += MIZAAN_BAST2[k] ?? 0;
    grandLetters += countArabicLetters(ELEMENT_META_ARABIC[k] || '');
  });

  // M3 — khayr/sharr
  const ks3 = selections?.khayrSharr;
  const ks3d = ks3 ? MIZAAN_KHAYR_SHARR[ks3] : null;
  if (ks3d) { grandBast += ks3d.bast; grandLetters += countArabicLetters(ks3d.arabic); }

  // M4 — hour
  const hourEntry = MIZAAN_HOURS.find(h => h.hour === selections?.hour);
  if (hourEntry) { grandBast += hourEntry.bast; grandLetters += countArabicLetters(hourEntry.arabic); }

  // M5 — day
  const dayEntry = MIZAAN_DAYS.find(d => d.key === selections?.days);
  if (dayEntry) { grandBast += dayEntry.bast; grandLetters += countArabicLetters(dayEntry.arabic); }

  // M6 — planet
  const planetEntry = MIZAAN_PLANETS_ALL.find(p => p.key === selections?.planet);
  if (planetEntry) { grandBast += planetEntry.bast; grandLetters += countArabicLetters(planetEntry.arabic); }

  // M7 — purposes + custom
  const purposeArr = Array.isArray(selections?.purposes) ? selections.purposes : (selections?.purposes ? [selections.purposes] : []);
  purposeArr.forEach(pk => {
    const pe = MIZAAN_PURPOSES.find(p => p.key === pk);
    if (pe) { grandBast += pe.bast; grandLetters += countArabicLetters(pe.arabic); }
  });
  const trimmedCustom = (customPurpose ?? "").trim();
  if (trimmedCustom) {
    const { total: customBastVal } = mizaanCalcBast(trimmedCustom, 1);
    grandBast   += customBastVal;
    grandLetters += countArabicLetters(trimmedCustom);
  }

  // M8 — khayr/sharr8
  const ks8 = selections?.khayrSharr8;
  const ks8d = ks8 ? KHAYR_SHARR_8[ks8] : null;
  if (ks8d) { grandBast += ks8d.bast; grandLetters += countArabicLetters(ks8d.arabic); }

  // M9 — degrees
  Object.entries(degreeSels || {}).forEach(([elKey, degKey]) => {
    if (!degKey) return;
    const elDegData = MIZAAN_ELEMENT_DEGREES[elKey];
    const deg = elDegData?.degrees.find(d => d.key === degKey);
    if (deg) { grandBast += deg.bast; grandLetters += countArabicLetters(deg.arabic); }
  });

  return { grandBast, grandLetters };
}



export default function Mizaan9Page() {
  const { getPageState, setPageState, clearPageState } = usePageState();
  const initialState = getPageState(PAGE_KEY, {
    input: "",
    result: null,
    selections: buildDefaultSelections(null),
    customPurpose: "",
    degreeSels: {},
  });
  
  const [input, setInput] = useState(initialState.input);
  const [result, setResult] = useState(initialState.result);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selections, setSelections] = useState(initialState.selections);
  const [customPurpose, setCustomPurpose] = useState(initialState.customPurpose);
  const [degreeSels, setDegreeSels] = useState(initialState.degreeSels);
  // OPTION 2 intermediate storage for OPTION 3
  const [option2State, setOption2State] = useState(null);
  const abortRef = useRef(false);

  useEffect(() => {
    setPageState(PAGE_KEY, { input, result, selections, customPurpose, degreeSels });
  }, [input, result, selections, customPurpose, degreeSels, setPageState]);

  // Calculate and persist OPTION 2 state when result or selections change
  useEffect(() => {
    if (!result || !result.dominant) {
      setOption2State(null);
      return;
    }

    const { grandBast, grandLetters } = computeGrandTotals(result, selections, degreeSels, input, customPurpose);
    const dominant = result.dominant;
    
    if (!grandBast || grandBast <= 0) {
      setOption2State(null);
      return;
    }

    const pipeline = runMizaanPostPipeline({ grandBast, grandLetters, dominant });
    if (!pipeline) {
      setOption2State(null);
      return;
    }

    // ══ STAGE 1: ORIGINAL WAHID EXTRACTION ═══════════════════════
    const originalWahid = Array.isArray(pipeline.kitabet?.finalExpandedLetters) 
      ? pipeline.kitabet.finalExpandedLetters 
      : [];

    // ══ STAGE 2: BIRINCI BAST CALCULATION ════════════════════════
    const letterBastDetails = originalWahid.map(letter => ({
      letter,
      birinciBast: FIRST_BAST[letter] || 0,
    }));

    // ══ STAGE 3: BAST SUMMATION ══════════════════════════════════
    const totalBastSum = letterBastDetails.reduce((sum, detail) => {
      return sum + detail.birinciBast;
    }, 0);

    // ══ STAGE 4: LETTER COUNT ════════════════════════════════════
    const totalLetterCount = originalWahid.length;

    // ══ STAGE 5: NEW TOTAL CALCULATION ═══════════════════════════
    const newTotal = totalBastSum + totalLetterCount;

    // ══ STAGE 6: ISTINTAK CONVERSION (Same engine as OPTION 1) ═══
    const convertedLetters = istintak(newTotal);

    // ══ STAGE 7: REPEAT OPTION 1 WORKFLOW ON CONVERTED LETTERS ═══
    const convertedBastSum = convertedLetters.reduce((sum, letter) => {
      return sum + (FIRST_BAST[letter] || 0);
    }, 0);

    const convertedIsFerd = convertedLetters.length % 2 !== 0;
    const convertedGroupSize = convertedIsFerd ? 5 : 4;

    const convertedRemainder = convertedLetters.length % convertedGroupSize;
    let finalExpandedLetters = [...convertedLetters];
    let supplementLetters = [];

    if (convertedRemainder > 0) {
      const needed = convertedGroupSize - convertedRemainder;
      const galibVal = MIZAAN_BAST2[dominant] || MIZAAN_BAST2.fire;
      supplementLetters = istintak(galibVal).slice(0, needed);
      finalExpandedLetters = [...convertedLetters, ...supplementLetters];
    }

    const groupedNames = [];
    for (let i = 0; i < finalExpandedLetters.length; i += convertedGroupSize) {
      const group = finalExpandedLetters.slice(i, i + convertedGroupSize);
      groupedNames.push({
        letters: group,
        name: group.join(''),
        groupNumber: Math.floor(i / convertedGroupSize) + 1,
      });
    }

    const newWahidValid = finalExpandedLetters.length > 0 && groupedNames.length > 0;

    // ══ STAGE 8: STORE ALL INTERMEDIATE RESULTS ═══════════════════
    const option2Storage = {
      originalWahid,
      originalLetterCount: totalLetterCount,
      originalBastSum: totalBastSum,
      newTotal,
      convertedLetters,
      convertedLetterCount: convertedLetters.length,
      convertedBastSum,
      convertedIsFerd,
      convertedGroupSize,
      convertedRemainder,
      supplementLetters,
      finalExpandedLetters,
      finalExpandedCount: finalExpandedLetters.length,
      groupedNames,
      totalGroups: groupedNames.length,
      newWahidValid,
      validation: {
        originalWahidValid: originalWahid.length > 0,
        bastSumValid: totalBastSum > 0,
        conversionValid: convertedLetters.length > 0,
        groupingValid: groupedNames.length > 0,
        expansionValid: finalExpandedLetters.length > 0,
        newWahidValid,
        allStagesComplete: 
          originalWahid.length > 0 && 
          totalBastSum > 0 && 
          convertedLetters.length > 0 && 
          groupedNames.length > 0 &&
          finalExpandedLetters.length > 0
      },
      kitabet: pipeline.kitabet,
      vefk: pipeline.vefk,
    };

    setOption2State(option2Storage);
  }, [result, selections, degreeSels, input, customPurpose]);

  const handleAnalyze = useCallback(async () => {
    if (!input.trim()) return;
    abortRef.current = false;
    setLoading(true);
    setProgress(0);
    setResult(null);
    setSelections(buildDefaultSelections(null));
    setOption2State(null);
    const r = await mizaanAnalyzeAsync(input, (p) => { if (!abortRef.current) setProgress(p); });
    if (!abortRef.current) {
      setResult(r);
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
    setCustomPurpose("");
    setDegreeSels({});
    clearPageState(PAGE_KEY);
  };

  const updateSel = (key) => (val) => setSelections(prev => ({ ...prev, [key]: val }));

  return (
    <PageLayout>
      <div className="space-y-4">

        {/* Header */}
        <PageTitle arabic="ميزان الأعداد" latin="9 Mizan" subtitle="Complete Occult Analysis System" icon="٩" />

        {/* Input card */}
        <div className="rounded-2xl border p-5 relative overflow-hidden"
          style={{ background: "linear-gradient(145deg, rgba(8,20,52,0.98) 0%, rgba(4,12,34,0.99) 100%)", borderColor: G.borderHi, boxShadow: `0 0 40px ${G.glow}, 0 4px 28px rgba(0,0,0,0.50), inset 0 1px 0 rgba(212,175,55,0.10)` }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)` }} />
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
              <div className="flex justify-between mb-1.5">
                <span className="font-inter text-[10px] text-white/40 animate-pulse">✦ Analyzing 9 Mizaans…</span>
                <span className="font-inter text-[10px] tabular-nums font-bold" style={{ color: G.dim }}>{progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
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
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-inter font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed text-[#0d1b2a] tracking-wide"
              style={{ background: "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)", boxShadow: `0 0 36px ${G.glowHi}, 0 2px 12px rgba(0,0,0,0.40)` }}>
              {loading
                ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                : <span className="font-amiri text-base">⚖</span>}
              {loading ? "Analyzing…" : "Analyze — 9 Mizan"}
            </motion.button>
            <motion.button
              onClick={handleClear}
              disabled={!input && !result}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 py-3 px-4 rounded-xl text-white/55 hover:text-white font-inter text-sm border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.12)" }}>
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
              <MizaanFinalSummary result={result} selections={selections} degreeSels={degreeSels} inputText={input} customPurpose={customPurpose} />
              <MizaanDivider />

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* SECTION 1: OPTION 1 — POST-PIPELINE RESULTS */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              {(() => {
                const { grandBast, grandLetters } = computeGrandTotals(result, selections, degreeSels, input, customPurpose);
                const dominant = result?.dominant;
                if (!grandBast || grandBast <= 0) return null;
                return (
                  <>
                    <MizaanPostResults grandBast={grandBast} grandLetters={grandLetters} dominant={dominant} />
                    <MizaanDivider />
                  </>
                );
              })()}

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* SECTION 2: OPTION 2 — SECOND ITERATION */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              {option2State && (() => {
                const dominant = result?.dominant;
                
                // SEED LETTERS for Satr-i Vahid Grouping (OPTION 2 converted letters)
                const seedLetters = option2State.convertedLetters;
                
                return (
                  <>
                    {/* OPTION 2 Calculation Law Results */}
                    <div className="rounded-2xl border p-5 space-y-4"
                      style={{ background: "rgba(3,6,20,0.99)", borderColor: G.borderHi, boxShadow: `0 0 60px ${G.glow}, 0 0 120px rgba(0,0,0,0.6)` }}>
                      <div className="text-center space-y-2">
                        <h2 className="font-amiri text-2xl font-bold" style={{ color: G.text }}>OPTION 2 — Calculation Law</h2>
                        <div className="h-px w-24 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-4 py-3 rounded-xl border"
                          style={{ background: G.bg, borderColor: G.border }}>
                          <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>OPTION 1 Final Wahid Letters</span>
                          <span className="font-inter text-lg font-bold tabular-nums" style={{ color: G.text }}>{option2State.originalLetterCount}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 rounded-xl border"
                          style={{ background: G.bg, borderColor: G.border }}>
                          <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Birinci Bast Sum (Σ)</span>
                          <span className="font-inter text-lg font-bold tabular-nums" style={{ color: G.text }}>{option2State.originalBastSum.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 rounded-xl border"
                          style={{ background: G.bg, borderColor: G.border }}>
                          <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Combined Total (Bast + Letters)</span>
                          <span className="font-inter text-lg font-bold tabular-nums" style={{ color: G.text }}>{option2State.newTotal.toLocaleString()}</span>
                        </div>
                        <div className="px-4 py-3 rounded-xl border" style={{ background: G.bg, borderColor: G.border }}>
                          <span className="font-inter text-[8px] uppercase tracking-widest block mb-2" style={{ color: G.dim }}>Converted Letters (Istintak)</span>
                          <div className="flex flex-wrap gap-1 justify-center" style={{ direction: 'rtl' }}>
                            {option2State.convertedLetters.length > 0 ? (
                              option2State.convertedLetters.map((l, i) => (
                                <span key={i} className="font-amiri text-xl px-3 py-1.5 rounded-lg border"
                                  style={{ 
                                    color: "#4ADE80", 
                                    borderColor: "#4ADE80" + "55", 
                                    background: "rgba(74,222,128,0.15)",
                                    display: "inline-block",
                                  }}
                                >
                                  {l}
                                </span>
                              ))
                            ) : (
                              <span className="font-inter text-xs text-white/30">No converted letters</span>
                            )}
                          </div>
                          <div className="text-center mt-2">
                            <span className="font-inter text-[6px] uppercase tracking-wider" style={{ color: G.dim }}>
                              Count: {option2State.convertedLetterCount} • Ready for OPTION 2 workflow
                            </span>
                          </div>
                        </div>
                        {option2State?.validation?.allStagesComplete && (
                          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border"
                            style={{ background: "rgba(74,222,128,0.11)", borderColor: "rgba(74,222,128,0.44)" }}>
                            <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: "#4ADE80" }}>✓ All Stages Complete</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Satr-i Vahid Grouping — applies OPTION 1 workflow to OPTION 2 converted letters */}
                    <SatrVahidGrouping
                      satrVahidLetters={seedLetters}
                      dominant={dominant}
                      option2State={option2State}
                    />
                  </>
                );
              })()}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageLayout>
  );
}