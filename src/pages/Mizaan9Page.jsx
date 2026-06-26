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
import Method2Pipeline from "../components/mizaan/Method2Pipeline";
import { runMethod2Pipeline } from "../lib/mizaanMethod2Engine";
import SatrVahidGrouping from "../components/mizaan/SatrVahidGrouping";
import EsmaAvanSection from "../components/mizaan/EsmaAvanSection";
import EsmaKasemSection from "../components/mizaan/EsmaKasemSection";
import FinalVefkSummary from "../components/mizaan/FinalVefkSummary";
import ConclusionRulesPanel from "../components/mizaan/ConclusionRulesPanel.jsx";
import KasamSection from "../components/mizaan/KasamSection.jsx";


import { getDataSet } from "../lib/mizaanDataSets";
import { runMizaanPostPipeline, istintak, FIRST_BAST, getBastLevel, expandAllSeedLetters } from "../lib/mizaanPostEngine";
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
  const [activeMethod, setActiveMethod] = useState(1);
  const [activeSection, setActiveSection] = useState(1);
  const ds = activeMethod === 1 || activeMethod === 2 ? getDataSet(activeSection) : null;
  // Section 1 uses Section A Bast table; Section 2 uses Section B Bast table.
  // Section 3 uses Section A Bast table (only source values differ, not the expansion table).
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

  // Re-analyze when section changes (if text is already entered)
  useEffect(() => {
    // Only re-run if we have a previous result (user already analyzed something)
    if (!input.trim() || !result) return;
    setS1VefkData(null);
    setS2VefkData(null);
    setS3VefkData(null);
    if (activeSection === 3) {
      const r = mizaanAnalyzeAbjad(input);
      setResult(r);
      setSelections(buildDefaultSelections(r.dominant));
    } else {
      // Re-run async analysis for Section 1 or 2
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
  }, [activeSection, activeMethod]);

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
      <div className="space-y-4">

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
            {/* Section 1 / Section 2 / Section 3 Toggle (ORIGINAL) */}
            <div className="flex gap-2">
              {[
                { s: 1, arabic: 'المجموعة الأولى' },
                { s: 2, arabic: 'المجموعة الثانية' },
                { s: 3, arabic: 'الأبجد الكبير' },
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
            <motion.div key={`mizaan-9-flow-s${activeSection}`}
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
                const section1 = runMizaanPostPipeline({ grandBast, grandLetters, dominant });

                // Section 2 expanded letters — derived independently for Section 3 input
                // Pure function call: no state, no mutation of Section 1 or Section 2
                const section2ExpandedLetters = (() => {
                  if (!section1?.allExpandedLetters?.length) return [];
                  const s2GrandBast    = section1.allExpandedLetters.reduce((s, l) => s + (getBastLevelFn(l, 1) || 0), 0);
                  const s2GrandLetters = section1.allExpandedLetters.length;
                  const s2Pipeline     = runMizaanPostPipeline({ grandBast: s2GrandBast, grandLetters: s2GrandLetters, dominant });
                  return s2Pipeline?.allExpandedLetters || [];
                })();

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

                    {/* ═══ SECTION 3: ESMA-I KASEM ═══ */}
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
                    {/* ═══ SECTION 4: KASAM (ISOLATED PLACEHOLDER) ═══ */}
                    <MizaanDivider />
                    <KasamSection
                      avanNames={s2VefkData?.names || []}
                      kasemNames={s3VefkData?.names || []}
                    />

                    <MizaanDivider />
                    <ConclusionRulesPanel />
                    <MizaanDivider />

                    {/* ═══ CONCLUSION B — READ ONLY, NO CALC CONNECTION ═══ */}
                    <div className="rounded-2xl border overflow-hidden"
                      style={{
                        background: "rgba(3,6,20,0.99)",
                        borderColor: "rgba(212,175,55,0.60)",
                        boxShadow: "0 0 80px rgba(212,175,55,0.14), 0 0 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)",
                      }}>
                      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.60) 40%, rgba(245,208,96,0.53) 50%, rgba(212,175,55,0.60) 60%, transparent 95%)" }} />
                      <div className="px-6 py-5 space-y-4">
                        {/* Title */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-xl font-inter text-sm font-black"
                            style={{ background: "rgba(245,208,96,0.12)", border: "1px solid rgba(212,175,55,0.40)", color: "#F5D060" }}>
                            B
                          </div>
                          <span className="font-inter text-[10px] uppercase tracking-[0.25em] font-bold" style={{ color: "#F5D060" }}>
                            Conclusion B
                          </span>
                        </div>
                        {/* Body paragraphs */}
                        {[
                          "പുസ്തകത്തിലെ ഉദാഹരണപ്രകാരം ആദ്യം Esma-i Kitabet, Esma-i A'van, Esma-i Kasem എന്നീ മൂന്ന് വഫ്കുകളും തയ്യാറാക്കണം. തുടർന്ന് അവ നിർദേശിച്ച ക്രമത്തിൽ ചെമ്പിലോ പാത്രത്തിലോ മൺചട്ടി കഷണത്തിലോ എഴുതണം. ശേഷം വഫ്കിന്റെ ഗാലിബ് മലക്കിന്റെ പേര് വഫ്കിന്റെ നാല് വശങ്ങളിലും എഴുതണം. ഈ ഉദാഹരണത്തിൽ ഗാലിബ് അനാസിർ അഗ്നിയായതിനാൽ മൂന്ന് വഫ്കുകളും തീയുടെ സമീപത്തോ തീയുടെ അടിയിലോ കുഴിച്ചിടണം. കുഴിച്ചിട്ട ശേഷം Esma-i Kitabet, Esma-i A'van, Esma-i Kasem എന്നീ പേരുകൾ അവയുടെ നിർണയിച്ച എണ്ണത്തിന് അനുസരിച്ച് വായിക്കണം.",
                          "തുടർന്ന് Azimet (അസീമത്ത്) ചെയ്യേണ്ടതുണ്ടെങ്കിൽ (Kasam ഓതുന്നുണ്ടെങ്കിൽ) Esma-i A'van, Esma-i Kasem എന്നീ പേരുകൾ മാത്രമേ അസീമത്തിൽ ചേർക്കാവൂ; Esma-i Kitabet അസീമത്തിൽ ചേർക്കരുത് എന്ന് ഗ്രന്ഥം പ്രത്യേകം പറയുന്നു.",
                          "ആരംഭിക്കുമ്പോൾ അതിന് അനുയോജ്യമായ ദിവസവും സമയവും അറിയേണ്ടതുണ്ടെന്നും, ഒരു മാസം നാല് ആഴ്ചകളായും ഓരോ ഘടകത്തിനും നാല് ഘട്ടങ്ങളായും കണക്കാക്കുന്നുവെന്നും ഗ്രന്ഥം വിശദീകരിക്കുന്നു. ഒന്നാം ആഴ്ച മുഹബ്ബത്ത്, ആകർഷണം, സൗഹൃദം എന്നിവയ്ക്കും, രണ്ടാം ആഴ്ച ആവശ്യസിദ്ധി, ശിഫാ, രോഗശാന്തി എന്നിവയ്ക്കും, മൂന്നാം ആഴ്ച നാവ് ബന്ധനം, ഉറക്കബന്ധനം, പുരുഷന്മാരെയും സ്ത്രീകളെയും ബന്ധിക്കൽ, രോഗപ്പെടുത്തൽ എന്നിവയ്ക്കും, നാലാം ആഴ്ച കഹ്ർ, നാശം, വേർപെടുത്തൽ, ശത്രുത എന്നിവയ്ക്കുമായി ഉപയോഗിക്കണമെന്ന് പറയുന്നു.",
                          "പ്രബല ഘടകം ഭൂമിയോ വായുവോ ജലമോ ആണെങ്കിൽ അതനുസരിച്ചുള്ള ഘട്ടങ്ങൾ സ്വീകരിക്കണം. ഞായർ, വ്യാഴം, വെള്ളി ദിവസങ്ങളിലെ സൂര്യോദയത്തിന് ശേഷമുള്ള ആദ്യ മണിക്കൂർ നല്ല കാര്യങ്ങൾക്കായും, തിങ്കളും ബുധനും നാവ് ബന്ധനം, ഉറക്കബന്ധനം തുടങ്ങിയ കാര്യങ്ങൾക്കായും, ചൊവ്വയും ശനിയും വേർപെടുത്തൽ, കഹ്ർ, നാശം, ശത്രുത എന്നിവയ്ക്കായും ഉപയോഗിക്കണമെന്ന് ഗ്രന്ഥം നിർദേശിക്കുന്നു.",
                          "എല്ലാ നിബന്ധനകളും പൂർണ്ണമായി പാലിക്കണമെന്നും, തെറ്റായി ചെയ്താൽ അമൽ ഫലമില്ലാതെയാകുമെന്നും, പറഞ്ഞിരിക്കുന്ന ദിവസങ്ങളിലും സൂര്യോദയ സമയത്തും ആദ്യ മണിക്കൂറിലും ചെയ്യണമെന്നുമാണ് ഗ്രന്ഥത്തിൽ പറയുന്നത്.",
                        ].map((para, i) => (
                          <p key={i} className="font-inter text-[13px] leading-relaxed" style={{ color: "rgba(245,208,96,0.55)", lineHeight: 1.9 }}>
                            {para}
                          </p>
                        ))}
                        {/* Footer note */}
                        <div className="pt-3 border-t" style={{ borderColor: "rgba(212,175,55,0.25)" }}>
                          <p className="font-inter text-[12px] font-bold" style={{ color: "#F5D060", lineHeight: 1.7 }}>
                            (Kasam ഓതുന്നുണ്ടെങ്കിൽ മുകളിലുള്ള Conclusion A വായിക്കുക.)
                          </p>
                        </div>
                      </div>
                      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.60) 40%, rgba(245,208,96,0.53) 50%, rgba(212,175,55,0.60) 60%, transparent 95%)" }} />
                    </div>
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
          {/* Section 1 / Section 2 / Section 3 Toggle */}
          <div className="flex gap-2">
            {[
              { s: 1, arabic: 'المجموعة الأولى' },
              { s: 2, arabic: 'المجموعة الثانية' },
              { s: 3, arabic: 'الأبجد الكبير' },
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
              <motion.div key={`mizaan-9-method2-s${activeSection}`}
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

                {/* Method 2 Pipeline */}
                {(() => {
                  const { grandBast, grandLetters } = computeGrandTotals(result, selections, degreeSels, input, customPurpose, ds, activeSection);
                  const dominant = result?.dominant;
                  if (!grandBast || grandBast <= 0) return null;

                  return (
                    <>
                      <Method2Pipeline
                        grandBast={grandBast}
                        grandLetters={grandLetters}
                        dominant={dominant}
                        onVefkReady={setS1VefkData}
                        getBastLevelFn={getBastLevelFn}
                      />
                      <MizaanDivider />
                      <ConclusionRulesPanel />
                    </>
                  );
                })()}

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Method 3-5 Placeholders */}
      {activeMethod >= 3 && (
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