import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { mizaanAnalyzeAsync, mizaanCalcBast } from "../lib/mizaan9Engine";
import { DAY_PLANET_MAP, MIZAAN_DAYNIGHT_FULL, MIZAAN_HOURS, MIZAAN_DAYS, MIZAAN_PLANETS_ALL, MIZAAN_PURPOSES, MIZAAN_ELEMENT_DEGREES } from "../lib/mizaan9Data";
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
import MizaanPipelineFull from "../components/mizaan/MizaanPipelineFull";

import SatrVahidGrouping from "../components/mizaan/SatrVahidGrouping";
import EsmaAvanSection from "../components/mizaan/EsmaAvanSection";
import EsmaKasemSection from "../components/mizaan/EsmaKasemSection";
import FinalVefkSummary from "../components/mizaan/FinalVefkSummary";
import KasamSection from "../components/mizaan/KasamSection.jsx";
import MizaanConclusionAccordion from "../components/mizaan/MizaanConclusionAccordion.jsx";
import MizaanConclusionAccordionMethod2 from "../components/mizaan/MizaanConclusionAccordionMethod2.jsx";
import Method3ConclusionAccordion from "../components/mizaan/Method3ConclusionAccordion.jsx";


import { getDataSet } from "../lib/mizaanDataSets";
import { runMizaanPostPipeline, getBastLevel, istintak, GALIB_ANASIR_VALUES } from "../lib/mizaanPostEngine";
import Method3AvanSection from "../components/mizaan/Method3AvanSection";
import Method3FinalTotalSection from "../components/mizaan/Method3FinalTotalSection";
import Method3AbjadVerificationSection from "../components/mizaan/Method3AbjadVerificationSection";
import Method3DivineNamesMatchSection from "../components/mizaan/Method3DivineNamesMatchSection";
import { mizaanAnalyzeAbjad } from "../lib/mizaan9DataC";
import { getBastLevelB } from "../lib/mizaan9DataB";
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
  const dn = dominant ? (['fire','earth'].includes(dominant) ? 'gunduz' : 'gece') : null;
  return {
    elements:   dominant ? [dominant] : [],
    dayNight:   dn,
    hour:       (Math.floor(new Date().getHours() / 2) % 12) + 1,
    days:       ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()],
    planet:     DAY_PLANET_MAP[['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()]] ?? null,
    purposes:   [],
    khayrSharr8: null,
  };
}

const PAGE_KEY = 'mizaan9';

// ── Helper: compute bast value of Arabic text using the correct table for the active section ──
function calcCustomBastForSection(text, activeSection) {
  if (!text) return 0;
  if (activeSection === 3) {
    // Section 3: Abjad Kebir values
    const clean = text.replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '').replace(/\u0640/g, '').replace(/[^\u0600-\u06FF]/g, '');
    const NORM = { 'أ':'ا','إ':'ا','آ':'ا','ٱ':'ا','ى':'ي','ئ':'ي','ؤ':'و','ة':'ه' };
    const ABJAD = {'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,'ي':10,'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000};
    let total = 0;
    for (const ch of clean) { total += ABJAD[NORM[ch] || ch] || 0; }
    return total;
  }
  // Section 1 & 2: Mizan Bast1 values
  const { total } = mizaanCalcBast(text, 1);
  return total;
}

// ── Helper: derive Esma-i Kitabet names — SAME algorithm as MizaanPipelineFull ──
// Returns both original names (for calculation) and supplemented names (for display)
function deriveKitabetNames(initialSeedLetters, dominant, getBastLevelFn) {
  if (!initialSeedLetters?.length) return { names: [], originalNames: [] };
  const isFerd = initialSeedLetters.length % 2 !== 0;
  const bastLevel = isFerd ? 5 : 4;
  let allExpanded = [];
  for (let i = initialSeedLetters.length - 1; i >= 0; i--) {
    allExpanded = [...allExpanded, ...istintak(getBastLevelFn(initialSeedLetters[i], bastLevel))];
  }
  const gSize = allExpanded.length % 2 !== 0 ? 5 : 4;
  const rem = allExpanded.length % gSize;
  let seq = [...allExpanded];
  // Group ORIGINAL letters first (before supplementation) — for calculation
  const originalGroups = [];
  for (let i = 0; i < allExpanded.length; i += gSize) {
    originalGroups.push(allExpanded.slice(i, Math.min(i + gSize, allExpanded.length)).join(""));
  }
  // Then supplement for display
  if (rem > 0) {
    const supp = istintak(GALIB_ANASIR_VALUES[dominant] || GALIB_ANASIR_VALUES.fire).slice(0, gSize - rem);
    seq = [...seq, ...supp];
  }
  // Group FINAL letters (after supplementation) — for display
  const groups = [];
  for (let i = 0; i < seq.length; i += gSize) groups.push(seq.slice(i, i + gSize).join(""));
  return { names: groups, originalNames: originalGroups };
}

// ── Helper: derive Esma-i A'van names — A'VAN completion rule (self-recycle, NOT Galib Anasir) ──
// Returns both original names (for calculation) and supplemented names (for display)
function deriveAvanNames(initialSeedLetters, getBastLevelFn) {
  if (!initialSeedLetters?.length) return { names: [], originalNames: [] };
  const seed = initialSeedLetters;
  const isFerd = seed.length % 2 !== 0;
  const bastLevel = isFerd ? 5 : 4;
  let allExpanded = [];
  for (let i = seed.length - 1; i >= 0; i--) {
    allExpanded = [...allExpanded, ...istintak(getBastLevelFn(seed[i], bastLevel))];
  }
  const gSize = allExpanded.length % 2 !== 0 ? 5 : 4;
  const rem = allExpanded.length % gSize;
  let seq = [...allExpanded];
  // Group ORIGINAL letters only (before supplementation) — for calculation
  const originalGroups = [];
  for (let i = 0; i < allExpanded.length; i += gSize) {
    const group = allExpanded.slice(i, Math.min(i + gSize, allExpanded.length));
    if (group.length === gSize) {
      originalGroups.push(group.join(""));
    }
  }
  // Then supplement for display — A'VAN RULE: Recycle from BEGINNING of own expanded sequence (NOT Galib Anasir)
  if (rem > 0) {
    const needed = gSize - rem;
    const supplement = allExpanded.slice(0, needed);
    seq = [...seq, ...supplement];
  }
  // Group FINAL letters (after supplementation) — for display only
  const groups = [];
  for (let i = 0; i < seq.length; i += gSize) groups.push(seq.slice(i, i + gSize).join(""));
  return { names: groups, originalNames: originalGroups };
}

// ── Helper: re-derive grand totals using same logic as MizaanFinalSummary ──
function computeGrandTotals(result, selections, degreeSels, inputText, customPurpose, ds, activeSection) {
  if (!result) return { grandBast: 0, grandLetters: 0 };

  function countArabicLetters(str) {
    if (!str) return 0;
    return str.replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '').replace(/[^\u0600-\u06FF]/g, '').length;
  }

  const ELEMENT_META_ARABIC = { fire: "النار", earth: "التراب", air: "الهواء", water: "الماء" };

  let grandBast = 0;
  let grandLetters = 0;

  // M1 — input text
  grandBast   += result.bast1Total ?? 0;
  grandLetters += result.letterCount ?? 0;

  // M2 — element
  const elKeys = Array.isArray(selections?.elements) ? selections.elements : (selections?.elements ? [selections.elements] : []);
  elKeys.forEach(k => {
    grandBast   += ds.bast2[k] ?? 0;
    grandLetters += countArabicLetters(ELEMENT_META_ARABIC[k] || '');
  });

  // M3 — day/night
  const dn3 = selections?.dayNight;
  const dn3d = dn3 ? ds.dayNight[dn3] : null;
  if (dn3d) { grandBast += dn3d.bast; grandLetters += countArabicLetters(dn3d.arabic); }

  // M4 — hour
  const hourEntry = ds.hours.find(h => h.hour === selections?.hour);
  if (hourEntry) { grandBast += hourEntry.bast; grandLetters += countArabicLetters(hourEntry.arabic); }

  // M5 — day
  const dayEntry = ds.days.find(d => d.key === selections?.days);
  if (dayEntry) { grandBast += dayEntry.bast; grandLetters += countArabicLetters(dayEntry.arabic); }

  // M6 — planet
  const planetEntry = ds.planets.find(p => p.key === selections?.planet);
  if (planetEntry) { grandBast += planetEntry.bast; grandLetters += countArabicLetters(planetEntry.arabic); }

  // M7 — purposes + custom
  const purposeArr = Array.isArray(selections?.purposes) ? selections.purposes : (selections?.purposes ? [selections.purposes] : []);
  purposeArr.forEach(pk => {
    const pe = ds.purposes.find(p => p.key === pk);
    if (pe) { grandBast += pe.bast; grandLetters += countArabicLetters(pe.arabic); }
  });
  const trimmedCustom = (customPurpose ?? "").trim();
  if (trimmedCustom) {
    grandBast   += calcCustomBastForSection(trimmedCustom, activeSection);
    grandLetters += countArabicLetters(trimmedCustom);
  }

  // M8 — khayr/sharr8
  const ks8 = selections?.khayrSharr8;
  const ks8d = ks8 ? ds.khayrSharr8[ks8] : null;
  if (ks8d) { grandBast += ks8d.bast; grandLetters += countArabicLetters(ks8d.arabic); }

  // M9 — degrees
  Object.entries(degreeSels || {}).forEach(([elKey, degKey]) => {
    if (!degKey) return;
    const elDegData = ds.degrees[elKey];
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
  // Final Summary vefk data — populated by child callbacks (display only)
  const [s1VefkData, setS1VefkData] = useState(null);
  const [s2VefkData, setS2VefkData] = useState(null);
  const [s3VefkData, setS3VefkData] = useState(null);
  const [method3AbjadTotal, setMethod3AbjadTotal] = useState(0);
  const [activeMethod, setActiveMethod] = useState(1);
  const [activeSection, setActiveSection] = useState(1);
  // Nine Mizan (Mizan 1–9 + Final Summary) is IDENTICAL for Section 1 and Section 2 — it always uses
  // the Section 1 dataset so selections/values never go blank when switching sections. Only the
  // post-Nine-Mizan pipeline (Kitabet/A'van/Kasem via getBastLevelFn below) is section-specific.
  // Section 3 (Abjad) is a separate system entirely and uses its own dataset.
  const ds = activeMethod === 1 || activeMethod === 2 || activeMethod === 3 ? getDataSet(activeSection === 3 ? 3 : 1) : null;
  // Section-specific rules apply ONLY to the post-pipeline (Esma-i Kitabet/A'van/Kasem):
  // Section 1 uses Section A Bast table; Section 2 uses Section B Bast table.
  // Bast1 is shared (identical). Only Bast2–Bast5 differ.
  const getBastLevelFn = activeSection === 2 ? getBastLevelB : getBastLevel;
  const abortRef = useRef(false);

  useEffect(() => {
    setPageState(PAGE_KEY, { input, result, selections, customPurpose, degreeSels });
  }, [input, result, selections, customPurpose, degreeSels, setPageState]);

  // ══ OPTION 2 — DISABLED FOR NOW ═══════════════════════════════════
  // Option 2 calculation is temporarily disabled to prioritize Option 1 restoration
  useEffect(() => {
    setOption2State(null);
  }, []);

  // Reset the (display-only) vefk summary data when method or section changes — no recalculation.
  useEffect(() => {
    setS1VefkData(null);
    setS2VefkData(null);
    setS3VefkData(null);
  }, [activeMethod, activeSection]);

  // The Nine Mizan (Mizan 1–9) is SHARED between Section 1 and Section 2 — switching between them
  // must NOT touch `result`. Only re-analyze when crossing the Section 3 (Abjad) boundary.
  const prevSectionRef = useRef(activeSection);
  useEffect(() => {
    const prevSection = prevSectionRef.current;
    prevSectionRef.current = activeSection;
    if (!input.trim() || !result) return;
    const enteringAbjad = activeSection === 3 && prevSection !== 3;
    const leavingAbjad  = activeSection !== 3 && prevSection === 3;
    if (!enteringAbjad && !leavingAbjad) return;
    if (activeSection === 3) {
      const r = mizaanAnalyzeAbjad(input);
      setResult(r);
      setSelections(buildDefaultSelections(r.dominant));
    } else {
      abortRef.current = false;
      setLoading(true);
      setProgress(0);
      mizaanAnalyzeAsync(input, (p) => { if (!abortRef.current) setProgress(p); }).then(r => {
        if (!abortRef.current) {
          setResult(r);
          setSelections(buildDefaultSelections(r.dominant));
        }
        setLoading(false);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  const handleAnalyze = useCallback(async () => {
    if (!input.trim()) return;
    abortRef.current = false;
    setLoading(true);
    setProgress(0);
    setResult(null);
    setSelections(buildDefaultSelections(null));
    setOption2State(null);
    setS1VefkData(null);
    setS2VefkData(null);
    setS3VefkData(null);
    let r;
    if (activeSection === 3) {
      r = mizaanAnalyzeAbjad(input);
      setProgress(100);
    } else {
      r = await mizaanAnalyzeAsync(input, (p) => { if (!abortRef.current) setProgress(p); });
    }
    if (!abortRef.current) {
      setResult(r);
      setSelections(buildDefaultSelections(r.dominant));
    }
    setLoading(false);
  }, [input, activeSection, activeMethod]);

  const handleClear = () => {
    abortRef.current = true;
    setInput("");
    setResult(null);
    setLoading(false);
    setProgress(0);
    setSelections(buildDefaultSelections(null));
    setCustomPurpose("");
    setDegreeSels({});
    setS1VefkData(null);
    setS2VefkData(null);
    setS3VefkData(null);
    clearPageState(PAGE_KEY);
  };

  const updateSel = (key) => (val) => setSelections(prev => ({ ...prev, [key]: val }));

  return (
    <PageLayout>
      <div className="space-y-4 mizaan-page">

        {/* Header */}
        <PageTitle arabic="ميزان الأعداد" latin="9 Mizan" subtitle="Complete Occult Analysis System" icon="٩" />

        {/* Method Navigation (NEW - Top Level) */}
        <div className="flex gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((method) => (
            <button key={method} onClick={() => setActiveMethod(method)}
              className="flex-1 py-2.5 px-2 rounded-xl font-inter font-bold text-sm flex flex-col items-center gap-0.5"
              style={{
                background: activeMethod === method ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.03)',
                border: `1.5px solid ${activeMethod === method ? 'rgba(212,175,55,0.65)' : 'rgba(255,255,255,0.12)'}`,
                color: activeMethod === method ? '#F5D060' : 'rgba(255,255,255,0.40)',
                boxShadow: activeMethod === method ? '0 0 20px rgba(212,175,55,0.20)' : 'none',
              }}>
              <span className="font-inter text-[9px] uppercase tracking-widest">METHOD</span>
              <span className="font-amiri text-sm">{method}</span>
            </button>
          ))}
        </div>

        {/* Method 1 Content (ALL existing logic belongs here) */}
        {activeMethod === 1 && (
          <div>
            {/* Section 1 / Section 2 Toggle (Section 3 hidden - internal engine only) */}
            <div className="flex gap-2">
              {[
                { s: 1, arabic: 'المجموعة الأولى' },
                { s: 2, arabic: 'المجموعة الثانية' },
              ].map(({ s, arabic }) => (
                <button key={s} onClick={() => setActiveSection(s)}
                  className="flex-1 py-2.5 px-2 rounded-xl font-inter font-bold text-sm flex flex-col items-center gap-0.5"
                  style={{
                    background: activeSection === s ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${activeSection === s ? 'rgba(212,175,55,0.65)' : 'rgba(255,255,255,0.12)'}`,
                    color: activeSection === s ? '#F5D060' : 'rgba(255,255,255,0.40)',
                    boxShadow: activeSection === s ? '0 0 20px rgba(212,175,55,0.20)' : 'none',
                  }}>
                  <span className="font-amiri text-sm">{arabic}</span>
                  <span className="font-inter text-[9px] uppercase tracking-widest">SECTION {s}</span>
                </button>
              ))}
            </div>

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
            style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}`, fontSize: "16px" }}
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
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.12)", width: "auto", flexShrink: 0 }}>
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </motion.button>
          </div>
        </div>

        {/* 9 Mizaans */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div key={`mizaan-9-flow`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-2">

              <Mizaan1 result={result} />
              <MizaanDivider />
              <Mizaan2
                dominant={result.dominant}
                tiebreak={result.tiebreak}
                selected={selections.elements}
                onChange={updateSel("elements")}
              elementsData={ds.elements}
              />
              <MizaanDivider />
              <Mizaan3
                dominant={result.dominant}
                selected={selections.dayNight}
                onChange={updateSel("dayNight")}
                dayNightData={ds.dayNight}
                />
              <MizaanDivider />
              <Mizaan4
                selected={selections.hour}
                onChange={updateSel("hour")}
                hoursData={ds.hours}
                />
              <MizaanDivider />
              <Mizaan5
                selected={selections.days}
                onChange={updateSel("days")}
                daysData={ds.days}
                />
              <MizaanDivider />
              <Mizaan6
                selectedDay={selections.days}
                selected={selections.planet}
                onChange={updateSel("planet")}
                planetsData={ds.planets}
                />
              <MizaanDivider />
              <Mizaan7
                selected={selections.purposes}
                onChange={updateSel("purposes")}
                customPurpose={customPurpose}
                onCustomPurpose={setCustomPurpose}
                purposesData={ds.purposes}
                />
              <MizaanDivider />
              <Mizaan8
                selected={selections.khayrSharr8}
                onChange={updateSel("khayrSharr8")}
                selectedPurpose={selections.purposes}
                khayrSharr8Data={ds.khayrSharr8}
                />
              <MizaanDivider />
              <Mizaan9Final               result={result} selections={selections} degreeSels={degreeSels} onDegreeSels={setDegreeSels} degrees9Data={ds.degrees} />
              <MizaanDivider />
              <MizaanFinalSummary result={result} selections={selections} degreeSels={degreeSels} inputText={input} customPurpose={customPurpose} ds={ds} calcCustomBast={(t) => calcCustomBastForSection(t, activeSection)} />
              <MizaanDivider />

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* SECTION 1: OPTION 1 — POST-PIPELINE RESULTS (LOCKED) */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              {(() => {
                const { grandBast, grandLetters } = computeGrandTotals(result, selections, degreeSels, input, customPurpose, ds, activeSection);
                const dominant = result?.dominant;
                if (!grandBast || grandBast <= 0) return null;

                // Section 1 pipeline result — read-only source for Section 2
                const section1 = runMizaanPostPipeline({ grandBast, grandLetters, dominant, getBastLevelFn });

                // Section 1 vefk (directly available from pipeline)
                const s1Vefk   = section1?.vefk || null;
                const s1Source = section1?.vefkSourceNumber || null;

                return (
                  <>
                    {/* ═══ SECTION 1: LOCKED ═══ */}
                    <MizaanPipelineFull grandBast={grandBast} grandLetters={grandLetters} dominant={dominant} onVefkReady={setS1VefkData} getBastLevelFn={getBastLevelFn} />

                    {/* ═══ SECTION 2: ESMA-I A'VAN ═══ */}
                    {section1?.allExpandedLetters?.length > 0 && (
                      <EsmaAvanSection
                        allExpandedLetters={section1.allExpandedLetters}
                        dominant={dominant}
                        onVefkReady={setS2VefkData}
                        getBastLevelFn={getBastLevelFn}
                      />
                    )}

                    {/* ═══ ESMA-I KASEM — Method 1 includes full Kasem pipeline (only conclusion omitted) ═══ */}
                    {section1?.allExpandedLetters?.length > 0 && (
                      <EsmaKasemSection
                        section2ExpandedLetters={section1.allExpandedLetters}
                        dominant={dominant}
                        onVefkReady={setS3VefkData}
                        getBastLevelFn={getBastLevelFn}
                      />
                    )}

                    {/* ═══ FINAL SUMMARY: THREE VEFKS (display only) ═══ */}
                    <FinalVefkSummary
                      s1Vefk={s1VefkData?.vefk || s1Vefk}
                      s1Source={s1VefkData?.source || s1Source}
                      s1Names={s1VefkData?.names || []}
                      s2Vefk={s2VefkData?.vefk || null}
                      s2Source={s2VefkData?.source || null}
                      s2Names={s2VefkData?.names || []}
                      s3Vefk={s3VefkData?.vefk || null}
                      s3Source={s3VefkData?.source || null}
                      s3Names={s3VefkData?.names || []}
                      s3BorderLetters={s3VefkData?.borderLetters || ""}
                      dominant={dominant}
                    />
                    <MizaanDivider />

                    {/* ═══ CONCLUSION — Method 1 only, accordion (NO Kasem Dua) ═══ */}
                    <MizaanConclusionAccordion />
                    </>
                    );
                    })()}



            </motion.div>
          )}
        </AnimatePresence>

        </div>
        )}

      {/* Method 2 Content */}
      {activeMethod === 2 && (
        <div>
          {/* Section 1 / Section 2 Toggle (Section 3 hidden - internal engine only) */}
          <div className="flex gap-2">
            {[
              { s: 1, arabic: 'المجموعة الأولى' },
              { s: 2, arabic: 'المجموعة الثانية' },
            ].map(({ s, arabic }) => (
              <button key={s} onClick={() => setActiveSection(s)}
                className="flex-1 py-2.5 px-2 rounded-xl font-inter font-bold text-sm flex flex-col items-center gap-0.5"
                style={{
                  background: activeSection === s ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${activeSection === s ? 'rgba(212,175,55,0.65)' : 'rgba(255,255,255,0.12)'}`,
                  color: activeSection === s ? '#F5D060' : 'rgba(255,255,255,0.40)',
                  boxShadow: activeSection === s ? '0 0 20px rgba(212,175,55,0.20)' : 'none',
                }}>
                <span className="font-amiri text-sm">{arabic}</span>
                <span className="font-inter text-[9px] uppercase tracking-widest">SECTION {s}</span>
              </button>
            ))}
          </div>

          {/* Input card (same as Method 1) */}
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
              style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}`, fontSize: "16px" }}
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
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.12)", width: "auto", flexShrink: 0 }}>
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </motion.button>
            </div>
          </div>

          {/* 9 Mizaans (same as Method 1) */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div key={`mizaan-9-method2`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-2">

                <Mizaan1 result={result} />
                <MizaanDivider />
                <Mizaan2
                  dominant={result.dominant}
                  tiebreak={result.tiebreak}
                  selected={selections.elements}
                  onChange={updateSel("elements")}
                  elementsData={ds.elements}
                />
                <MizaanDivider />
                <Mizaan3
                  dominant={result.dominant}
                  selected={selections.dayNight}
                  onChange={updateSel("dayNight")}
                  dayNightData={ds.dayNight}
                />
                <MizaanDivider />
                <Mizaan4
                  selected={selections.hour}
                  onChange={updateSel("hour")}
                  hoursData={ds.hours}
                />
                <MizaanDivider />
                <Mizaan5
                  selected={selections.days}
                  onChange={updateSel("days")}
                  daysData={ds.days}
                />
                <MizaanDivider />
                <Mizaan6
                  selectedDay={selections.days}
                  selected={selections.planet}
                  onChange={updateSel("planet")}
                  planetsData={ds.planets}
                />
                <MizaanDivider />
                <Mizaan7
                  selected={selections.purposes}
                  onChange={updateSel("purposes")}
                  customPurpose={customPurpose}
                  onCustomPurpose={setCustomPurpose}
                  purposesData={ds.purposes}
                />
                <MizaanDivider />
                <Mizaan8
                  selected={selections.khayrSharr8}
                  onChange={updateSel("khayrSharr8")}
                  selectedPurpose={selections.purposes}
                  khayrSharr8Data={ds.khayrSharr8}
                />
                <MizaanDivider />
                <Mizaan9Final result={result} selections={selections} degreeSels={degreeSels} onDegreeSels={setDegreeSels} degrees9Data={ds.degrees} />
                <MizaanDivider />
                <MizaanFinalSummary result={result} selections={selections} degreeSels={degreeSels} inputText={input} customPurpose={customPurpose} ds={ds} calcCustomBast={(t) => calcCustomBastForSection(t, activeSection)} />
                <MizaanDivider />

                {/* Method 2: SAME shared pipeline as Method 1 (Kitabet → A'van → Kasem), then Final Divine Names */}
                {(() => {
                  const { grandBast, grandLetters } = computeGrandTotals(result, selections, degreeSels, input, customPurpose, ds, activeSection);
                  const dominant = result?.dominant;
                  if (!grandBast || grandBast <= 0) return null;

                  // Identical pipeline call as Method 1 Section 1
                  const section1 = runMizaanPostPipeline({ grandBast, grandLetters, dominant, getBastLevelFn });

                  // Identical derivation as Method 1 Section 2 → Section 3 input
                  const section2ExpandedLetters = (() => {
                    if (!section1?.allExpandedLetters?.length) return [];
                    const s2GrandBast    = section1.allExpandedLetters.reduce((s, l) => s + (getBastLevelFn(l, 1) || 0), 0);
                    const s2GrandLetters = section1.allExpandedLetters.length;
                    const s2Pipeline     = runMizaanPostPipeline({ grandBast: s2GrandBast, grandLetters: s2GrandLetters, dominant, getBastLevelFn });
                    return s2Pipeline?.allExpandedLetters || [];
                  })();

                  const s1Vefk   = section1?.vefk || null;
                  const s1Source = section1?.vefkSourceNumber || null;

                  return (
                    <>
                      {/* ═══ SAME AS METHOD 1: Esma-i Kitabet ═══ */}
                      <MizaanPipelineFull grandBast={grandBast} grandLetters={grandLetters} dominant={dominant} onVefkReady={setS1VefkData} getBastLevelFn={getBastLevelFn} />

                      {/* ═══ SAME AS METHOD 1: Esma-i A'van ═══ */}
                      {section1?.allExpandedLetters?.length > 0 && (
                        <EsmaAvanSection
                          allExpandedLetters={section1.allExpandedLetters}
                          dominant={dominant}
                          onVefkReady={setS2VefkData}
                          getBastLevelFn={getBastLevelFn}
                        />
                      )}

                      {/* ═══ MOVED HERE FROM METHOD 1: Esma-i Kasem ═══ */}
                      {section2ExpandedLetters.length > 0 && (
                        <EsmaKasemSection
                          section2ExpandedLetters={section2ExpandedLetters}
                          dominant={dominant}
                          onVefkReady={setS3VefkData}
                          getBastLevelFn={getBastLevelFn}
                        />
                      )}

                      {/* ═══ FINAL SUMMARY: THREE VEFKS (display only) ═══ */}
                      <FinalVefkSummary
                        s1Vefk={s1VefkData?.vefk || s1Vefk}
                        s1Source={s1VefkData?.source || s1Source}
                        s1Names={s1VefkData?.names || []}
                        s2Vefk={s2VefkData?.vefk || null}
                        s2Source={s2VefkData?.source || null}
                        s2Names={s2VefkData?.names || []}
                        s3Vefk={s3VefkData?.vefk || null}
                        s3Source={s3VefkData?.source || null}
                        s3Names={s3VefkData?.names || []}
                        s3BorderLetters={s3VefkData?.borderLetters || ""}
                        dominant={dominant}
                      />

                      <MizaanDivider />

                      {/* ═══ COMMON KASEM — Method 2 only, moved from Method 1 ═══ */}
                      <div className="text-center px-2">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border"
                          style={{ background: "rgba(212,175,55,0.07)", borderColor: "rgba(212,175,55,0.50)" }}>
                          <span className="text-base">📜</span>
                          <span className="font-inter text-[10px] uppercase tracking-[0.25em] font-bold" style={{ color: "#F5D060" }}>
                            Common Kasem
                          </span>
                        </div>
                      </div>
                      <KasamSection
                        avanNames={s2VefkData?.names || []}
                        kasemNames={s3VefkData?.names || []}
                      />

                      <MizaanDivider />
                      <MizaanConclusionAccordionMethod2 />
                    </>
                  );
                })()}

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Method 3 Content — Esma-i Kitabet identical to Method 1/2; A'van onward uses Method 3 formula */}
      {activeMethod === 3 && (
        <div>
          {/* Section 1 / Section 2 Toggle (Section 3 hidden - internal engine only) */}
          <div className="flex gap-2">
            {[
              { s: 1, arabic: 'المجموعة الأولى' },
              { s: 2, arabic: 'المجموعة الثانية' },
            ].map(({ s, arabic }) => (
              <button key={s} onClick={() => setActiveSection(s)}
                className="flex-1 py-2.5 px-2 rounded-xl font-inter font-bold text-sm flex flex-col items-center gap-0.5"
                style={{
                  background: activeSection === s ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${activeSection === s ? 'rgba(212,175,55,0.65)' : 'rgba(255,255,255,0.12)'}`,
                  color: activeSection === s ? '#F5D060' : 'rgba(255,255,255,0.40)',
                  boxShadow: activeSection === s ? '0 0 20px rgba(212,175,55,0.20)' : 'none',
                }}>
                <span className="font-amiri text-sm">{arabic}</span>
                <span className="font-inter text-[9px] uppercase tracking-widest">SECTION {s}</span>
              </button>
            ))}
          </div>

          {/* Input card (same as Method 1/2) */}
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
              style={{ background: "rgba(4,12,34,0.97)", border: `1px solid ${G.border}`, fontSize: "16px" }}
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
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.12)", width: "auto", flexShrink: 0 }}>
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </motion.button>
            </div>
          </div>

          {/* 9 Mizaans (same as Method 1/2) */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div key={`mizaan-9-method3`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-2">

                <Mizaan1 result={result} />
                <MizaanDivider />
                <Mizaan2
                  dominant={result.dominant}
                  tiebreak={result.tiebreak}
                  selected={selections.elements}
                  onChange={updateSel("elements")}
                  elementsData={ds.elements}
                />
                <MizaanDivider />
                <Mizaan3
                  dominant={result.dominant}
                  selected={selections.dayNight}
                  onChange={updateSel("dayNight")}
                  dayNightData={ds.dayNight}
                />
                <MizaanDivider />
                <Mizaan4
                  selected={selections.hour}
                  onChange={updateSel("hour")}
                  hoursData={ds.hours}
                />
                <MizaanDivider />
                <Mizaan5
                  selected={selections.days}
                  onChange={updateSel("days")}
                  daysData={ds.days}
                />
                <MizaanDivider />
                <Mizaan6
                  selectedDay={selections.days}
                  selected={selections.planet}
                  onChange={updateSel("planet")}
                  planetsData={ds.planets}
                />
                <MizaanDivider />
                <Mizaan7
                  selected={selections.purposes}
                  onChange={updateSel("purposes")}
                  customPurpose={customPurpose}
                  onCustomPurpose={setCustomPurpose}
                  purposesData={ds.purposes}
                />
                <MizaanDivider />
                <Mizaan8
                  selected={selections.khayrSharr8}
                  onChange={updateSel("khayrSharr8")}
                  selectedPurpose={selections.purposes}
                  khayrSharr8Data={ds.khayrSharr8}
                />
                <MizaanDivider />
                <Mizaan9Final result={result} selections={selections} degreeSels={degreeSels} onDegreeSels={setDegreeSels} degrees9Data={ds.degrees} />
                <MizaanDivider />
                <MizaanFinalSummary result={result} selections={selections} degreeSels={degreeSels} inputText={input} customPurpose={customPurpose} ds={ds} calcCustomBast={(t) => calcCustomBastForSection(t, activeSection)} />
                <MizaanDivider />

                {/* Method 3: Esma-i Kitabet identical to Method 1/2 — A'van onward uses the Method 3 formula */}
                {(() => {
                  const { grandBast, grandLetters } = computeGrandTotals(result, selections, degreeSels, input, customPurpose, ds, activeSection);
                  const dominant = result?.dominant;
                  if (!grandBast || grandBast <= 0) return null;

                  // Identical pipeline call as Method 1/2 Section 1 — Esma-i Kitabet
                  const section1 = runMizaanPostPipeline({ grandBast, grandLetters, dominant, getBastLevelFn });
                  const s1Vefk   = section1?.vefk || null;
                  const s1Source = section1?.vefkSourceNumber || null;

                  // Last (remainder-completed) Esma-i Kitabet name — same algorithm as MizaanPipelineFull
                  const { names: kitabetNames, originalNames: kitabetOriginalNames } = deriveKitabetNames(section1?.initialSeedLetters, dominant, getBastLevelFn);
                  // METHOD 3 RULE: Use ORIGINAL name (before supplementation) for calculation
                  const lastOriginalKitabetName = kitabetOriginalNames.length ? kitabetOriginalNames[kitabetOriginalNames.length - 1] : "";
                  const lastNameBast    = [...lastOriginalKitabetName].reduce((s, l) => s + (getBastLevelFn(l, 1) || 0), 0);
                  const galibAnasirBast = GALIB_ANASIR_VALUES[dominant] || GALIB_ANASIR_VALUES.fire;
                  const nineMizanTotal  = grandBast + grandLetters;
                  // SECTION 1 — Esma-i Kitabet formula box Result
                  const kitabetInputTotal = lastNameBast + galibAnasirBast + nineMizanTotal;
                  // SECTION 2 — Esma-i A'van formula box Result (uses the original Nine Mizan Total)
                  const avanInputTotal = lastNameBast + galibAnasirBast + nineMizanTotal;

                  // Method 3 A'van pipeline — same engine as Method 2, seeded by the A'van Input Total
                  const avanPipeline = avanInputTotal > 0
                    ? runMizaanPostPipeline({ grandBast: avanInputTotal, grandLetters: 0, dominant, getBastLevelFn })
                    : null;
                  const avanExpandedLetters = avanPipeline?.allExpandedLetters || [];

                  // SECTION 3 — Esma-i Kasem input: Last A'van Name First Bast + Galib Anasir First Bast + A'van Input Total
                  const { names: avanNames, originalNames: avanOriginalNames } = deriveAvanNames(avanPipeline?.initialSeedLetters, getBastLevelFn);
                  // METHOD 3 RULE: Use ORIGINAL name (before supplementation) for calculation
                  const lastOriginalAvanName = avanOriginalNames.length ? avanOriginalNames[avanOriginalNames.length - 1] : "";
                  const lastAvanNameBast = [...lastOriginalAvanName].reduce((s, l) => s + (getBastLevelFn(l, 1) || 0), 0);
                  const kasemInputTotal  = lastAvanNameBast + galibAnasirBast + avanInputTotal;

                  return (
                    <>
                      {/* ═══ SAME AS METHOD 1/2: Esma-i Kitabet — identical pipeline, no extra formula box ═══ */}
                      <MizaanPipelineFull grandBast={grandBast} grandLetters={grandLetters} dominant={dominant} onVefkReady={setS1VefkData} getBastLevelFn={getBastLevelFn} />

                      {/* ═══ METHOD 3 FORMULA: Esma-i A'van starting value replaced ═══ */}
                      <Method3AvanSection
                        kitabetNames={kitabetNames}
                        kitabetOriginalNames={kitabetOriginalNames}
                        dominant={dominant}
                        nineMizanTotal={nineMizanTotal}
                        onVefkReady={setS2VefkData}
                        getBastLevelFn={getBastLevelFn}
                      />

                      {/* ═══ METHOD 3 FORMULA: Esma-i Kasem starting value replaced ═══ */}
                      {kasemInputTotal > 0 && (
                        <EsmaKasemSection
                          section2ExpandedLetters={[]}
                          sourceOverride={kasemInputTotal}
                          sourceBreakdown={{ lastName: lastOriginalAvanName, lastNameBast: lastAvanNameBast, galibAnasirBast, previousAvanInputTotal: avanInputTotal }}
                          dominant={dominant}
                          onVefkReady={setS3VefkData}
                          getBastLevelFn={getBastLevelFn}
                        />
                      )}

                      {/* ═══ SECTION 4 — Final Total Derivation ═══ */}
                      <Method3FinalTotalSection
                        nineMizanTotal={nineMizanTotal}
                        kitabetInputTotal={kitabetInputTotal}
                        kasemInputTotal={kasemInputTotal}
                      />

                      {/* ═══ FINAL VERIFICATION — Abjad Kabir (no further pipeline) ═══ */}
                      {/* Reports its computed Abjad Kabir total upward via onAbjadTotalReady —      */}
                      {/* the lookup below uses THIS SAME reported value, never a recomputed one,     */}
                      {/* so the verification display and the search filter are structurally identical. */}
                      <Method3AbjadVerificationSection
                        finalTotal={nineMizanTotal + kitabetInputTotal + kasemInputTotal}
                        onAbjadTotalReady={setMethod3AbjadTotal}
                      />

                      {/* ═══ DIVINE NAMES LOOKUP — Asma-ul Husna match by Abjad Kabir (lookup only) ═══ */}
                      <Method3DivineNamesMatchSection
                        abjadTotal={method3AbjadTotal}
                        intentionText={input}
                      />

                      <MizaanDivider />

                      {/* ═══ FINAL SUMMARY: THREE VEFKS (display only) ═══ */}
                      <FinalVefkSummary
                        s1Vefk={s1VefkData?.vefk || s1Vefk}
                        s1Source={s1VefkData?.source || s1Source}
                        s1Names={s1VefkData?.names || []}
                        s2Vefk={s2VefkData?.vefk || null}
                        s2Source={s2VefkData?.source || null}
                        s2Names={s2VefkData?.names || []}
                        s3Vefk={s3VefkData?.vefk || null}
                        s3Source={s3VefkData?.source || null}
                        s3Names={s3VefkData?.names || []}
                        s3BorderLetters={s3VefkData?.borderLetters || ""}
                        dominant={dominant}
                      />

                      <MizaanDivider />
                      <Method3ConclusionAccordion />
                    </>
                  );
                })()}

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Method 4-5 Placeholders */}
      {activeMethod >= 4 && (
        <div className="rounded-2xl border p-8 text-center" style={{
          background: "rgba(212,175,55,0.06)",
          borderColor: "rgba(212,175,55,0.30)",
        }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{
            background: "rgba(212,175,55,0.14)",
            border: "1px solid rgba(212,175,55,0.40)",
          }}>
            <span className="font-amiri text-2xl" style={{ color: "#F5D060" }}>⚖</span>
          </div>
          <h2 className="font-inter text-lg font-bold text-white mb-2">Method {activeMethod}</h2>
          <p className="font-inter text-sm text-white/40 mb-4">Reserved for future Mizan calculation system</p>
          <p className="font-inter text-xs text-white/30">This method will be implemented when rules are provided</p>
        </div>
      )}
      </div>
    </PageLayout>
  );
}