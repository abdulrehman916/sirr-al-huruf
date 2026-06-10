/**
 * ManuscriptPipelinePage — pp.60–69 accurate display
 * Three fully independent sections: Esma-i Kitabet / A'van / Kasem
 * Each has: Satr-ı Vahid, grouped names, independent Vefk, independent guardian name.
 * Shows MANUSCRIPT vs ALGORITHM divergence for Istintak thousands marker.
 */
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "../components/PageLayout";
import ManuscriptEsmaSection from "../components/mizaan/ManuscriptEsmaSection";
import IstintakSteps from "../components/mizaan/IstintakSteps";
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

const G = {
  text:    "#F5D060",
  dim:     "rgba(212,175,55,0.55)",
  border:  "rgba(212,175,55,0.35)",
  borderHi:"rgba(212,175,55,0.65)",
  bg:      "rgba(212,175,55,0.07)",
  glow:    "rgba(212,175,55,0.22)",
};

const AR = { fontFamily: "'Noto Naskh Arabic','Amiri','Scheherazade New',serif" };

const TIER_COLORS = {
  kitabet: "#C4B5FD",
  avan:    "#B2EBF2",
  kasem:   "#F5D060",
};

function Divider() {
  return (
    <div className="h-px my-2"
      style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.35),transparent)" }} />
  );
}

function CollapsibleSection({ title, number, defaultOpen = false, children, color }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ borderColor: (color || G.border), background: "rgba(4,8,24,0.99)" }}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ background: open ? G.bg : "transparent" }}>
        <div className="flex items-center gap-2">
          {number && (
            <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border"
              style={{ color: G.text, borderColor: G.borderHi, background: "rgba(212,175,55,0.10)" }}>
              {number}
            </span>
          )}
          <span className="font-inter text-[10px] uppercase tracking-widest font-semibold" style={{ color: G.text }}>{title}</span>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }}
          className="font-inter text-xs" style={{ color: G.dim }}>▼</motion.span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 space-y-1.5">
          {children}
        </div>
      )}
    </div>
  );
}





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



  if (!pipeline) return <PageLayout><p style={{ color: G.dim }}>Loading…</p></PageLayout>;

  const { element, kitabet, avan, kasem } = pipeline;

  return (
    <PageLayout>
      <div className="space-y-4 pb-10">

        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="rounded-2xl border p-5 text-center space-y-2"
          style={{ background: "rgba(3,6,20,0.99)", borderColor: G.borderHi, boxShadow: `0 0 60px ${G.glow}` }}>
          <p className="font-inter text-[8px] uppercase tracking-[0.3em]" style={{ color: G.dim }}>
            دقيق وفق المخطوط — صفحات ٦٠–٦٩
          </p>
          <h1 className="font-inter text-xl font-bold" style={{ color: G.text }}>
            Manuscript Pipeline — Pages 60–69
          </h1>
          <h2 className="font-amiri text-2xl" dir="rtl" lang="ar"
            style={{ ...AR, color: G.text }}>
            أسماء الكتابة والأعوان والقسم والوفق
          </h2>
          <div className="h-px w-32 mx-auto" style={{ background: `linear-gradient(90deg,transparent,${G.borderHi},transparent)` }} />
          <div className="rounded-xl border px-4 py-2 inline-block"
            style={{ borderColor: G.border, background: G.bg }}>
            <span dir="rtl" lang="ar" style={{ ...AR, fontSize: "1.3rem", color: "#FFE580" }}>
              {TEST_INPUT}
            </span>
          </div>
          <p className="font-inter text-[8px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            نص ثابت للاختبار · عنصر النار · الدرجة: النار المستعمل
          </p>


        </div>



        {/* ── SECTION 1: ESMA-I KITABET ───────────────────────────── */}
        <ManuscriptEsmaSection
          tier="kitabet"
          data={kitabet}
          element={element}
          satirTotal={kitabet.satirTotal}
          color={TIER_COLORS.kitabet}
          prefix=""
          number="١"
        />

        {/* ── SECTION 2: ESMA-I A'VAN ────────────────────────────── */}
        <ManuscriptEsmaSection
          tier="avan"
          data={avan}
          element={element}
          satirTotal={avan.satirTotal}
          color={TIER_COLORS.avan}
          prefix="يا"
          number="٢"
        />

        {/* ── SECTION 3: ESMA-I KASEM ────────────────────────────── */}
        <ManuscriptEsmaSection
          tier="kasem"
          data={kasem}
          element={element}
          satirTotal={kasem.satirTotal}
          color={TIER_COLORS.kasem}
          prefix="بحق"
          number="٣"
        />

        {/* ── AZIMET ASSEMBLY ─────────────────────────────────────── */}
        <CollapsibleSection number="IV" title="Azimet Assembly — تركيب العزيمة" color="rgba(212,175,55,0.45)">
          <p className="font-inter text-[8px] italic" style={{ color: "rgba(255,255,255,0.30)" }}>
            الكتابة: تُكتب على أضلاع الوفق فقط، ولا تُقرأ في العزيمة.
          </p>
          <Divider />

          {/* A'van */}
          <p className="font-inter text-[8px] uppercase tracking-widest mt-1" style={{ color: TIER_COLORS.avan }}>
            أسماء الأعوان — مع يا
          </p>
          <div className="space-y-1.5">
            {avan.names.map((name, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                style={{ borderColor: TIER_COLORS.avan + "44", background: TIER_COLORS.avan + "0A" }}>
                <span className="font-inter text-[7px] tabular-nums" style={{ color: G.dim }}>#{i+1}</span>
                <span dir="rtl" lang="ar"
                  style={{ ...AR, fontSize: "1.5rem", color: TIER_COLORS.avan }}>
                  يَا {name}
                </span>
              </div>
            ))}
          </div>

          <Divider />

          {/* Kasem */}
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: TIER_COLORS.kasem }}>
            أسماء القسم — مع بحق
          </p>
          <div className="space-y-1.5">
            {kasem.names.map((name, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                style={{ borderColor: TIER_COLORS.kasem + "44", background: TIER_COLORS.kasem + "0A" }}>
                <span className="font-inter text-[7px] tabular-nums" style={{ color: G.dim }}>#{i+1}</span>
                <span dir="rtl" lang="ar"
                  style={{ ...AR, fontSize: "1.5rem", color: TIER_COLORS.kasem }}>
                  بِحَقِّ {name}
                </span>
              </div>
            ))}
          </div>

          <Divider />

          {/* Kitabet (borders only) */}
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: TIER_COLORS.kitabet }}>
            أسماء الكتابة — أضلاع الوفق فقط (لا تُقرأ)
          </p>
          <div style={{ display:"flex", flexDirection:"row", flexWrap:"wrap", gap:"8px", direction:"ltr" }}>
            {kitabet.names.map((name, i) => (
              <span key={i}
                style={{ ...AR, fontSize: "1.3rem", color: TIER_COLORS.kitabet + "CC",
                  border: `1px solid ${TIER_COLORS.kitabet}30`,
                  background: TIER_COLORS.kitabet + "08",
                  borderRadius: "12px", padding: "4px 12px",
                  unicodeBidi: "isolate", direction: "rtl" }}>
                {name}
              </span>
            ))}
          </div>
        </CollapsibleSection>



      </div>
    </PageLayout>
  );
}