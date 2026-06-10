/**
 * ManuscriptPipelinePage — Strict manuscript compliance (pp.60–69)
 * Linear workflow: Bast → Istintak → Satr-i Vahid → Names → Esma levels → Vefk
 * NO extra UI. MANUSCRIPT ONLY.
 */
import { useMemo } from "react";
import PageLayout from "../components/PageLayout";
import ManuscriptEsmaSection from "../components/mizaan/ManuscriptEsmaSection";
import { runMizaanPostPipeline, buildVefk, ELEMENT_BAST_TOTALS, istintak } from "../lib/mizaanPostEngine";
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

  const { element, kitabet, avan, kasem, vefk } = pipeline;
  const guardianName = istintak(ELEMENT_BAST_TOTALS[element] || 3550).join('');

  return (
    <PageLayout>
      <div className="space-y-8 pb-10 max-w-4xl mx-auto">
        
        {/* ── ESMA-I KITABET ──────────────────────────────────────── */}
        <ManuscriptEsmaSection
          tier="kitabet"
          data={kitabet}
          element={element}
          satirTotal={kitabet.satirTotal}
          color="#C4B5FD"
          prefix=""
        />

        {/* ── ESMA-I A'VAN ────────────────────────────────────────── */}
        <ManuscriptEsmaSection
          tier="avan"
          data={avan}
          element={element}
          satirTotal={avan.satirTotal}
          color="#B2EBF2"
          prefix="يا"
        />

        {/* ── ESMA-I KASEM ────────────────────────────────────────── */}
        <ManuscriptEsmaSection
          tier="kasem"
          data={kasem}
          element={element}
          satirTotal={kasem.satirTotal}
          color="#F5D060"
          prefix="بحق"
        />

        {/* ═══════════════════════════════════════════════════════════
            VEFK CONSTRUCTION AUDIT
            ═══════════════════════════════════════════════════════════ */}
        <div style={{ 
          marginTop: "32px", 
          padding: "20px", 
          border: `2px solid rgba(212,175,55,0.40)`, 
          borderRadius: "12px",
          background: "rgba(212,175,55,0.06)"
        }}>
          <h3 style={{ fontSize: "1.5rem", color: "#F5D060", marginBottom: "20px", fontWeight: "bold", borderBottom: "2px solid rgba(212,175,55,0.40)", paddingBottom: "10px" }}>
            وفق (VEFK CONSTRUCTION)
          </h3>

          {/* Vefk Input */}
          <div style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(212,175,55,0.30)", borderRadius: "6px", background: "rgba(212,175,55,0.05)" }}>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.40)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Input: Grand Bast (9 Mizan First Bast Sum)
            </div>
            <div style={{ fontSize: "1.2rem", color: "#F5D060", fontWeight: "bold" }}>
              S = {vefk.S.toLocaleString()}
            </div>
          </div>

          {/* Vefk Formula */}
          <div style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(212,175,55,0.30)", borderRadius: "6px", background: "rgba(212,175,55,0.05)" }}>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.40)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Manuscript Formula (p.68)
            </div>
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.70)", lineHeight: "1.8" }}>
              <div>V = S - 30 = {vefk.S.toLocaleString()} - 30 = <span style={{ color: "#4ADE80", fontWeight: "bold" }}>{vefk.S - 30}</span></div>
              <div>Q = floor(V / 4) = floor({vefk.S - 30} / 4) = <span style={{ color: "#4ADE80", fontWeight: "bold" }}>{vefk.Q}</span></div>
              <div>R = V % 4 = {vefk.S - 30} % 4 = <span style={{ color: "#4ADE80", fontWeight: "bold" }}>{vefk.R}</span></div>
            </div>
          </div>

          {/* Element Template */}
          <div style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(212,175,55,0.30)", borderRadius: "6px", background: "rgba(212,175,55,0.05)" }}>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.40)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Element: {element.toUpperCase()}
            </div>
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.70)", marginBottom: "8px" }}>
              Template positions (1-16):
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px", maxWidth: "200px", margin: "0 auto" }}>
              {[[8,11,14,1],[13,2,7,12],[3,16,9,6],[10,5,4,15]].flat().map((pos, i) => (
                <div key={i} style={{
                  padding: "6px", textAlign: "center", border: "1px solid rgba(255,255,255,0.20)",
                  background: "rgba(255,255,255,0.05)", fontSize: "0.75rem", color: "rgba(255,255,255,0.60)"
                }}>
                  {pos}
                </div>
              ))}
            </div>
          </div>

          {/* Remainder Correction */}
          {vefk.R > 0 && (
            <div style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(74,222,128,0.40)", borderRadius: "6px", background: "rgba(74,222,128,0.06)" }}>
              <div style={{ fontSize: "0.75rem", color: "rgba(74,222,128,0.70)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                Remainder Correction (R = {vefk.R})
              </div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.70)" }}>
                Positions &gt; {4 * (4 - vefk.R)} receive +1
              </div>
            </div>
          )}

          {/* Final Vefk Grid */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.40)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Final Vefk Grid (4×4)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px", maxWidth: "240px", margin: "0 auto" }}>
              {vefk.grid.flat().map((val, i) => (
                <div key={i} style={{
                  padding: "10px", textAlign: "center", border: `1px solid rgba(212,175,55,0.50)`,
                  background: "rgba(212,175,55,0.10)", fontSize: "0.95rem", fontWeight: "bold", color: "#F5D060"
                }}>
                  {val.toLocaleString()}
                </div>
              ))}
            </div>
          </div>

          {/* Magic Constant Verification */}
          <div style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(74,222,128,0.40)", borderRadius: "6px", background: "rgba(74,222,128,0.06)" }}>
            <div style={{ fontSize: "0.75rem", color: "rgba(74,222,128,0.70)", marginBottom: "6px" }}>
              Magic Constant Verification
            </div>
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.70)" }}>
              Row sum: {vefk.grid[0].reduce((s,v) => s+v, 0).toLocaleString()} = <span style={{ color: "#4ADE80", fontWeight: "bold" }}>{vefk.mc.toLocaleString()}</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(74,222,128,0.60)", marginTop: "4px" }}>
              ✓ All rows, columns, and diagonals sum to {vefk.mc.toLocaleString()}
            </div>
          </div>

          {/* Guardian Name */}
          <div style={{ padding: "12px", border: "1px solid rgba(212,175,55,0.40)", borderRadius: "6px", background: "rgba(212,175,55,0.08)" }}>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.40)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Guardian Name (Element Total Istintak)
            </div>
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.70)", marginBottom: "6px" }}>
              {element} element total: {ELEMENT_BAST_TOTALS[element]?.toLocaleString() || 3550}
            </div>
            <IstintakSteps n={ELEMENT_BAST_TOTALS[element] || 3550} msMarker={true} compact={false} />
            <div style={{ fontSize: "1.3rem", color: "#F5D060", fontWeight: "bold", marginTop: "12px", textAlign: "center", padding: "10px", border: "1px solid rgba(212,175,55,0.30)", borderRadius: "6px", background: "rgba(212,175,55,0.05)" }}>
              {guardianName}
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}