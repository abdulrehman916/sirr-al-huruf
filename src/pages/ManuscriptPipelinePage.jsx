/**
 * ManuscriptPipelinePage — Strict manuscript compliance (pp.60–69)
 * Linear workflow: Bast → Istintak → Satr-i Vahid → Names → Esma levels → Vefk
 * NO extra UI. MANUSCRIPT ONLY.
 */
import { useMemo } from "react";
import PageLayout from "../components/PageLayout";
import ManuscriptEsmaSection from "../components/mizaan/ManuscriptEsmaSection";
import { runMizaanPostPipeline } from "../lib/mizaanPostEngine";
import { mizaanAnalyze } from "../lib/mizaan9Engine";
import {
  MIZAAN_KHAYR_SHARR, MIZAAN_HOURS, MIZAAN_DAYS,
  MIZAAN_PLANETS_ALL, MIZAAN_PURPOSES, MIZAAN_ELEMENT_DEGREES,
} from "../lib/mizaan9Data";

// ── Test inputs matching the manuscript example (pp.60–69) ─────────
// Ennârul müsta'mel (النار المستعمل) — Fire element, 9th Mizan
const TEST_INPUT      = "بسم الله الرحمن الرحيم";
const TEST_SELECTIONS = {
  elements:    ["fire"],
  khayrSharr:  "khayr",
  hour:        1,
  days:        "fri",
  planet:      "zuhre",
  purposes:    ["celb"],
  khayrSharr8: "khayr",
};
const TEST_DEGREE_SELS  = { fire: "f1" }; // النار المستعمل
const KHAYR_SHARR_8 = {
  khayr: { arabic: 'الخير', bast: 2731 },
  sharr: { arabic: 'الشر',  bast: 2725 },
};

const AR = { 
  fontFamily: "'Noto Naskh Arabic','Amiri','Scheherazade New',serif" 
};





// ═══════════════════════════════════════════════════════════════════
export default function ManuscriptPipelinePage() {

  // ── Grand totals (same as MizaanPipelineTest) ──────────────────
  const m1 = useMemo(() => mizaanAnalyze(TEST_INPUT), []);

  const grandTotals = useMemo(() => {
    let grandBast = 0, grandLetters = 0;

    grandBast += m1.bast1Total; grandLetters += m1.letterCount;
    TEST_SELECTIONS.elements.forEach(k => {
      const bastMap = { fire:3550, earth:4015, air:3757, water:3342 };
      grandBast += bastMap[k] || 0;
    });
    const ks3d = TEST_SELECTIONS.khayrSharr ? MIZAAN_KHAYR_SHARR[TEST_SELECTIONS.khayrSharr] : null;
    if (ks3d) grandBast += ks3d.bast;
    const hourEntry = MIZAAN_HOURS.find(h => h.hour === TEST_SELECTIONS.hour);
    if (hourEntry) grandBast += hourEntry.bast;
    const dayEntry = MIZAAN_DAYS.find(d => d.key === TEST_SELECTIONS.days);
    if (dayEntry) grandBast += dayEntry.bast;
    const planetEntry = MIZAAN_PLANETS_ALL.find(p => p.key === TEST_SELECTIONS.planet);
    if (planetEntry) grandBast += planetEntry.bast;
    TEST_SELECTIONS.purposes.forEach(pk => {
      const pe = MIZAAN_PURPOSES.find(p => p.key === pk);
      if (pe) grandBast += pe.bast;
    });
    const ks8d = TEST_SELECTIONS.khayrSharr8 ? KHAYR_SHARR_8[TEST_SELECTIONS.khayrSharr8] : null;
    if (ks8d) grandBast += ks8d.bast;
    Object.entries(TEST_DEGREE_SELS).forEach(([elKey, degKey]) => {
      if (!degKey) return;
      const elDegData = MIZAAN_ELEMENT_DEGREES[elKey];
      const deg = elDegData?.degrees.find(d => d.key === degKey);
      if (deg) grandBast += deg.bast;
    });

    return { grandBast, grandLetters };
  }, [m1]);

  const pipeline = useMemo(() =>
    runMizaanPostPipeline({
      grandBast: grandTotals.grandBast,
      grandLetters: grandTotals.grandLetters,
      dominant: m1.dominant,
    }), [grandTotals.grandBast, grandTotals.grandLetters, m1.dominant]);



  if (!pipeline) return <PageLayout><p style={{ color: "rgba(212,175,55,0.55)" }}>Loading…</p></PageLayout>;

  const { element, kitabet, avan, kasem } = pipeline;

  return (
    <PageLayout>
      <div className="space-y-6 pb-10 max-w-3xl mx-auto">
        
        {/* ── ESMA-I KITABET ──────────────────────────────────────── */}
        <ManuscriptEsmaSection
          tier="kitabet"
          data={kitabet}
          element={element}
          satirTotal={kitabet.satirTotal}
          color="#C4B5FD"
          prefix=""
          number="١"
        />

        {/* ── ESMA-I A'VAN ────────────────────────────────────────── */}
        <ManuscriptEsmaSection
          tier="avan"
          data={avan}
          element={element}
          satirTotal={avan.satirTotal}
          color="#B2EBF2"
          prefix="يا"
          number="٢"
        />

        {/* ── ESMA-I KASEM ────────────────────────────────────────── */}
        <ManuscriptEsmaSection
          tier="kasem"
          data={kasem}
          element={element}
          satirTotal={kasem.satirTotal}
          color="#F5D060"
          prefix="بحق"
          number="٣"
        />

      </div>
    </PageLayout>
  );
}