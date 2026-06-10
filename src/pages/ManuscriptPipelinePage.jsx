/**
 * ManuscriptPipelinePage — pp.60–69 accurate display
 * Three fully independent sections: Esma-i Kitabet / A'van / Kasem
 * Each has: Satr-ı Vahid, grouped names, independent Vefk, independent guardian name.
 * Shows MANUSCRIPT vs ALGORITHM divergence for Istintak thousands marker.
 */
import { useMemo } from "react";
import PageLayout from "../components/PageLayout";
import ManuscriptEsmaSection from "../components/mizaan/ManuscriptEsmaSection";
import { runMizaanPostPipeline } from "../lib/mizaanPostEngine";
import { mizaanAnalyze } from "../lib/mizaan9Engine";

const TEST_INPUT = "بسم الله الرحمن الرحيم";

const G = {
  text:    "#F5D060",
  dim:     "rgba(212,175,55,0.55)",
  border:  "rgba(212,175,55,0.35)",
  borderHi:"rgba(212,175,55,0.65)",
};

const TIER_COLORS = {
  kitabet: "#C4B5FD",
  avan:    "#B2EBF2",
  kasem:   "#F5D060",
};

const AR = { fontFamily: "'Noto Naskh Arabic','Amiri','Scheherazade New',serif" };







// ═══════════════════════════════════════════════════════════════════
export default function ManuscriptPipelinePage() {

  const m1 = useMemo(() => mizaanAnalyze(TEST_INPUT), []);

  const pipeline = useMemo(() =>
    runMizaanPostPipeline({
      grandBast: m1.bast1Total + 3550 + 2731 + 30 + 279 + 660 + 330 + 2725 + 1030,
      grandLetters: m1.letterCount + 5 + 4 + 1 + 3 + 4 + 3 + 3 + 4,
      dominant: m1.dominant,
    }), [m1]);



  if (!pipeline) return <PageLayout><p style={{ color: G.dim }}>Loading…</p></PageLayout>;

  const { element, kitabet, avan, kasem } = pipeline;

  return (
    <PageLayout>
      <div className="space-y-4 pb-10">

        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="text-center space-y-2 mb-4">
          <h2 className="font-amiri text-2xl" dir="rtl" lang="ar"
            style={{ ...AR, color: G.text }}>
            أسماء الكتابة والأعوان والقسم
          </h2>
        </div>



        {/* Esma-i Kitabet */}
        <ManuscriptEsmaSection
          tier="kitabet"
          data={kitabet}
          element={element}
          satirTotal={kitabet.satirTotal}
          color={TIER_COLORS.kitabet}
          prefix=""
        />

        {/* Esma-i A'van */}
        <ManuscriptEsmaSection
          tier="avan"
          data={avan}
          element={element}
          satirTotal={avan.satirTotal}
          color={TIER_COLORS.avan}
          prefix="يا"
        />

        {/* Esma-i Kasem */}
        <ManuscriptEsmaSection
          tier="kasem"
          data={kasem}
          element={element}
          satirTotal={kasem.satirTotal}
          color={TIER_COLORS.kasem}
          prefix="بحق"
        />





      </div>
    </PageLayout>
  );
}