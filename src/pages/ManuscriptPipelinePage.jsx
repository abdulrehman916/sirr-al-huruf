/**
 * ManuscriptPipelinePage — Strict manuscript compliance (pp.60–69)
 * Linear workflow: Bast → Istintak → Satr-i Vahid → Names → Esma levels → Vefk
 * NO extra UI. MANUSCRIPT ONLY.
 */
import { useMemo } from "react";
import PageLayout from "../components/PageLayout";
import ManuscriptEsmaSection from "../components/mizaan/ManuscriptEsmaSection";
import ManuscriptDerivationChain from "../components/mizaan/ManuscriptDerivationChain";
import { runMizaanPostPipeline, ELEMENT_BAST_TOTALS, istintak } from "../lib/mizaanPostEngine";
import { mizaanAnalyze } from "../lib/mizaan9Engine";
import IstintakSteps from "../components/mizaan/IstintakSteps";
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

  const { element, kitabet } = pipeline;

  return (
    <PageLayout>
      <div className="space-y-8 pb-10 max-w-5xl mx-auto">
        
        {/* ═══════════════════════════════════════════════════════════
            COMPLETE MANUSCRIPT DERIVATION CHAIN
            Shows EVERY intermediate stage BEFORE Esma-i Kitabet
            ═══════════════════════════════════════════════════════════ */}
        <div style={{ 
          marginTop: "20px", 
          padding: "20px", 
          border: `2px solid rgba(212,175,55,0.40)`, 
          borderRadius: "12px",
          background: "rgba(212,175,55,0.06)"
        }}>
          <h2 style={{ 
            fontSize: "1.6rem", 
            color: "#F5D060", 
            marginBottom: "16px", 
            fontWeight: "bold",
            borderBottom: "2px solid rgba(212,175,55,0.40)",
            paddingBottom: "12px"
          }}>
            سلسلة الاشتقاق (Complete Derivation Chain)
          </h2>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.60)", marginBottom: "20px" }}>
            Every manuscript stage from initial letters → Esma-i Kitabet. No shortcuts. No hidden stages.
          </p>
          
          <ManuscriptDerivationChain
            initialLetters={m1.letters}
            element={element}
            color="#F5D060"
          />
        </div>

      </div>
    </PageLayout>
  );
}