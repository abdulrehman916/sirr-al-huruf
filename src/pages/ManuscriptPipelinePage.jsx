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
import {
  runMizaanPostPipeline,
  istintak,
  getBastLevel,
  buildVefk,
  ELEMENT_BAST_TOTALS,
  BAST_TABLE,
} from "../lib/mizaanPostEngine";
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

function countArabicLetters(str) {
  if (!str) return 0;
  return str.replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '')
            .replace(/[^\u0600-\u06FF]/g, '').length;
}

function Divider() {
  return (
    <div className="h-px my-2"
      style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.35),transparent)" }} />
  );
}

function StatRow({ label, value, formula, highlight, arabic }) {
  return (
    <div className="py-1.5 border-b" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
      <div className="flex items-start justify-between gap-2">
        <span className="font-inter text-[9px] uppercase tracking-widest flex-shrink-0"
          style={{ color: highlight ? G.text : G.dim }}>{label}</span>
        {arabic ? (
          <span dir="rtl" lang="ar" style={{ ...AR, fontSize: "1.1rem", color: highlight ? "#FFE580" : G.text }}>{value}</span>
        ) : (
          <span className="font-inter text-xs font-bold tabular-nums text-right"
            style={{ color: highlight ? "#FFE580" : G.text }}>{value}</span>
        )}
      </div>
      {formula && <p className="font-inter text-[7px] italic mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>↳ {formula}</p>}
    </div>
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

function DivergenceAlert({ input, manuscriptOutput, algorithmOutput }) {
  const matches = manuscriptOutput.join('') === algorithmOutput.join('');
  if (matches) return null;
  return (
    <div className="rounded-xl border p-3 space-y-2"
      style={{ borderColor: "rgba(255,165,0,0.50)", background: "rgba(255,165,0,0.06)" }}>
      <p className="font-inter text-[8px] uppercase tracking-widest font-bold" style={{ color: "#FF9900" }}>
        ⚠ DIVERGENCE — الاختلاف بين المخطوط والخوارزمية
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border p-2" style={{ borderColor: "rgba(74,222,128,0.35)", background: "rgba(74,222,128,0.06)" }}>
          <p className="font-inter text-[7px] uppercase tracking-widest mb-1" style={{ color: "rgba(74,222,128,0.70)" }}>
            MANUSCRIPT RESULT
          </p>
          <div style={{ display:"flex", flexDirection:"row", flexWrap:"wrap", gap:"4px", direction:"ltr" }}>
            {[...manuscriptOutput].reverse().map((l, i) => (
              <span key={i} style={{ ...AR, fontSize: "1.4rem", color: "#4ADE80" }}>{l}</span>
            ))}
          </div>
        </div>
        <div className="rounded-lg border p-2" style={{ borderColor: "rgba(255,68,68,0.35)", background: "rgba(255,68,68,0.06)" }}>
          <p className="font-inter text-[7px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,68,68,0.70)" }}>
            ALGORITHM RESULT
          </p>
          <div style={{ display:"flex", flexDirection:"row", flexWrap:"wrap", gap:"4px", direction:"ltr" }}>
            {[...algorithmOutput].reverse().map((l, i) => (
              <span key={i} style={{ ...AR, fontSize: "1.4rem", color: "#FCA5A5" }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
      <p className="font-inter text-[7px] italic" style={{ color: "rgba(255,255,255,0.30)" }}>
        Input: {input.toLocaleString()} · Divergence at thousands marker: manuscript uses ع, software uses غ
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
export default function ManuscriptPipelinePage() {

  // ── Grand totals (same as MizaanPipelineTest) ──────────────────
  const m1 = useMemo(() => mizaanAnalyze(TEST_INPUT), []);

  const grandTotals = useMemo(() => {
    let grandBast = 0, grandLetters = 0;
    const rows = [];

    grandBast += m1.bast1Total; grandLetters += m1.letterCount;
    rows.push({ m:1, label:"نص المدخل",          arabic: TEST_INPUT,   bast: m1.bast1Total, letters: m1.letterCount });

    TEST_SELECTIONS.elements.forEach(k => {
      const arMap = { fire:"النار", earth:"التراب", air:"الهواء", water:"الماء" };
      const bastMap = { fire:3550, earth:4015, air:3757, water:3342 };
      const b = bastMap[k] || 0;
      const l = countArabicLetters(arMap[k] || '');
      grandBast += b; grandLetters += l;
      rows.push({ m:2, label:`عنصر: ${k}`, arabic: arMap[k], bast: b, letters: l });
    });

    const ks3d = TEST_SELECTIONS.khayrSharr ? MIZAAN_KHAYR_SHARR[TEST_SELECTIONS.khayrSharr] : null;
    if (ks3d) {
      grandBast += ks3d.bast; grandLetters += countArabicLetters(ks3d.arabic);
      rows.push({ m:3, label:"خير/شر", arabic: ks3d.arabic, bast: ks3d.bast, letters: countArabicLetters(ks3d.arabic) });
    }

    const hourEntry = MIZAAN_HOURS.find(h => h.hour === TEST_SELECTIONS.hour);
    if (hourEntry) {
      grandBast += hourEntry.bast; grandLetters += countArabicLetters(hourEntry.arabic);
      rows.push({ m:4, label:`ساعة ${hourEntry.hour}`, arabic: hourEntry.arabic, bast: hourEntry.bast, letters: countArabicLetters(hourEntry.arabic) });
    }

    const dayEntry = MIZAAN_DAYS.find(d => d.key === TEST_SELECTIONS.days);
    if (dayEntry) {
      grandBast += dayEntry.bast; grandLetters += countArabicLetters(dayEntry.arabic);
      rows.push({ m:5, label:`يوم: ${dayEntry.key}`, arabic: dayEntry.arabic, bast: dayEntry.bast, letters: countArabicLetters(dayEntry.arabic) });
    }

    const planetEntry = MIZAAN_PLANETS_ALL.find(p => p.key === TEST_SELECTIONS.planet);
    if (planetEntry) {
      grandBast += planetEntry.bast; grandLetters += countArabicLetters(planetEntry.arabic);
      rows.push({ m:6, label:`كوكب: ${planetEntry.key}`, arabic: planetEntry.arabic, bast: planetEntry.bast, letters: countArabicLetters(planetEntry.arabic) });
    }

    TEST_SELECTIONS.purposes.forEach(pk => {
      const pe = MIZAAN_PURPOSES.find(p => p.key === pk);
      if (pe) {
        grandBast += pe.bast; grandLetters += countArabicLetters(pe.arabic);
        rows.push({ m:7, label:`غرض: ${pk}`, arabic: pe.arabic, bast: pe.bast, letters: countArabicLetters(pe.arabic) });
      }
    });

    const ks8d = TEST_SELECTIONS.khayrSharr8 ? KHAYR_SHARR_8[TEST_SELECTIONS.khayrSharr8] : null;
    if (ks8d) {
      grandBast += ks8d.bast; grandLetters += countArabicLetters(ks8d.arabic);
      rows.push({ m:8, label:"خير/شر-٨", arabic: ks8d.arabic, bast: ks8d.bast, letters: countArabicLetters(ks8d.arabic) });
    }

    Object.entries(TEST_DEGREE_SELS).forEach(([elKey, degKey]) => {
      if (!degKey) return;
      const elDegData = MIZAAN_ELEMENT_DEGREES[elKey];
      const deg = elDegData?.degrees.find(d => d.key === degKey);
      if (deg) {
        grandBast += deg.bast; grandLetters += countArabicLetters(deg.arabic);
        rows.push({ m:9, label:`درجة: ${elKey}/${degKey}`, arabic: deg.arabic, bast: deg.bast, letters: countArabicLetters(deg.arabic) });
      }
    });

    return { grandBast, grandLetters, rows, satirVahidTotal: grandBast + grandLetters };
  }, [m1]);

  const pipeline = useMemo(() =>
    runMizaanPostPipeline({
      grandBast: grandTotals.grandBast,
      grandLetters: grandTotals.grandLetters,
      dominant: m1.dominant,
    }), [grandTotals, m1.dominant]);

  // Manuscript istintak for divergence check (uses ع marker)
  const msIstintak = useMemo(() => {
    // Compute with ع marker for comparison
    const n = grandTotals.satirVahidTotal;
    if (!n || n <= 0) return [];
    let tmp = n;
    const digits = [];
    while (tmp > 0) { digits.push(tmp % 10); tmp = Math.floor(tmp / 10); }
    const U={1:'ا',2:'ب',3:'ج',4:'د',5:'ه',6:'و',7:'ز',8:'ح',9:'ط'};
    const T={10:'ي',20:'ك',30:'ل',40:'م',50:'ن',60:'س',70:'ع',80:'ف',90:'ص'};
    const H={100:'ق',200:'ر',300:'ش',400:'ت',500:'ث',600:'خ',700:'ذ',800:'ض',900:'ظ'};
    const letters = []; let slot = 0;
    for (let i = 0; i < digits.length; i++) {
      const d = digits[i];
      if (slot === 0) { if (d) letters.push(U[d]); slot = 1; }
      else if (slot === 1) { if (d) letters.push(T[d*10]); slot = 2; }
      else if (slot === 2) { if (d) letters.push(H[d*100]); slot = 3; }
      else { letters.push('ع'); if (d) letters.push(U[d]); slot = 1; }
    }
    return letters;
  }, [grandTotals.satirVahidTotal]);

  if (!pipeline) return <PageLayout><p style={{ color: G.dim }}>Loading…</p></PageLayout>;

  const { element, kitabet, avan, kasem } = pipeline;
  const { grandBast, grandLetters, rows, satirVahidTotal } = grandTotals;

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

          {/* Section summary badges */}
          <div className="flex justify-center flex-wrap gap-2 pt-1">
            {[
              { label: "أسماء الكتابة", color: TIER_COLORS.kitabet, count: kitabet.names.length },
              { label: "أسماء الأعوان", color: TIER_COLORS.avan,    count: avan.names.length },
              { label: "أسماء القسم",   color: TIER_COLORS.kasem,   count: kasem.names.length },
            ].map(({ label, color, count }) => (
              <div key={label} className="flex items-center gap-1.5 px-3 py-1 rounded-full border"
                style={{ borderColor: color + "44", background: color + "0D" }}>
                <span dir="rtl" lang="ar" style={{ ...AR, fontSize: "1rem", color }}>{label}</span>
                <span className="font-inter text-[8px] font-bold" style={{ color }}>{count} اسم</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MIZAN 9 VALIDATION (items A–L) ─────────────────────── */}
        <CollapsibleSection number="I" title="Mizan 9 — Validation (A–L)" defaultOpen={true}>

          {/* A) Bast-ul Aval total */}
          <StatRow label="A) مجموع باست الأول (Bast-ul Aval)" value={grandBast.toLocaleString()} highlight
            formula="Σ باست₁ لكل حرف عبر الميازين التسعة" />

          {/* B) Letter count */}
          <StatRow label="B) عدد الحروف الكلي" value={grandLetters} highlight
            formula="Σ عدد حروف الميازين التسعة" />

          {/* C) Istintak input */}
          <StatRow label="C) رقم الاستنطاق (سطر الواحد)" value={satirVahidTotal.toLocaleString()} highlight
            formula={`${grandBast} + ${grandLetters} = ${satirVahidTotal}`} />

          <Divider />

          {/* Mizan breakdown table */}
          <div className="space-y-1">
            <p className="font-inter text-[7px] uppercase tracking-widest" style={{ color: G.dim }}>تفصيل الميازين</p>
            {rows.map((r, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <span className="font-inter text-[8px] tabular-nums w-5" style={{ color: G.dim }}>م{r.m}</span>
                <span dir="rtl" lang="ar" style={{ ...AR, fontSize: "1rem", color: G.text, flex: 1, marginRight: 8 }}>
                  {r.arabic}
                </span>
                <span className="font-inter text-[8px] tabular-nums" style={{ color: G.dim }}>
                  ب={r.bast.toLocaleString()} · ح={r.letters}
                </span>
              </div>
            ))}
          </div>

          <Divider />

          {/* D) Seed letters with full Istintak breakdown */}
          <div className="space-y-1.5">
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>
              D) حروف البذور — استنطاق({satirVahidTotal.toLocaleString()})
            </p>
            <IstintakSteps n={satirVahidTotal} msMarker={false} compact={false} />

            {/* Divergence alert for initial seed */}
            <DivergenceAlert
              input={satirVahidTotal}
              manuscriptOutput={msIstintak}
              algorithmOutput={pipeline.initialSeedLetters}
            />
          </div>

          <Divider />

          {/* E) Seed count */}
          <StatRow label="E) عدد البذور"
            value={`${pipeline.initialSeedLetters.length} → ${pipeline.initialSeedLetters.length % 2 === 0 ? 'زوج' : 'فرد'}`}
            highlight />

          {/* F) Bast level */}
          <StatRow label="F) مستوى الباست المختار"
            value={kitabet.isZevc ? "الباست الرابع (زوج)" : "الباست الخامس (فرد)"}
            highlight />

          {/* G) Expanded letters summary */}
          <StatRow label="G) حروف الكتابة الموسعة" value={`${kitabet.expandedCount} حرف`}
            formula="بعد تطبيق الباست على كل بذرة ثم الاستنطاق" />

          {/* H) Satr-ı Vahid for Kitabet */}
          <StatRow label="H) سطر الواحد للكتابة" value={kitabet.satirTotal.toLocaleString()}
            formula={`${kitabet.bastSum} + ${kitabet.letterCount}`} highlight />

          {/* I, J, K name counts */}
          <StatRow label="I) عدد أسماء الكتابة"   value={`${kitabet.names.length} اسم`} />
          <StatRow label="J) عدد أسماء الأعوان"   value={`${avan.names.length} اسم`} />
          <StatRow label="K) عدد أسماء القسم"     value={`${kasem.names.length} اسم`} />

          {/* L) Vefk MC */}
          <StatRow label="L) مجموع سطر الوفق (MC)"
            value={buildVefk(kitabet.satirTotal, element).mc.toLocaleString()} highlight />
        </CollapsibleSection>

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

        {/* ── MANUSCRIPT vs ALGORITHM NOTE ────────────────────────── */}
        <div className="rounded-2xl border p-4 space-y-2"
          style={{ borderColor: "rgba(255,165,0,0.40)", background: "rgba(255,165,0,0.05)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest font-bold text-center" style={{ color: "#FF9900" }}>
            ملاحظة المخطوط مقابل الخوارزمية
          </p>
          <div className="font-inter text-[8px] space-y-1.5" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>
            <p>
              <b style={{ color: "#FACC15" }}>علامة الآلاف:</b> يستخدم المخطوط (ص٦٠–٦٩)
              <span dir="rtl" lang="ar" style={{ ...AR, color: "#4ADE80" }}> ع </span>
              كعلامة للآلاف، بينما يستخدم البرنامج
              <span dir="rtl" lang="ar" style={{ ...AR, color: "#FCA5A5" }}> غ</span>.
              مثال: ist(41487) → المخطوط: <span dir="rtl" lang="ar" style={{ ...AR, color: "#4ADE80" }}>م ا ع ت ف ز</span> ·
              البرنامج: <span dir="rtl" lang="ar" style={{ ...AR, color: "#FCA5A5" }}>م ا غ ت ف ز</span>
            </p>
            <p>
              <b style={{ color: "#FACC15" }}>القاعدة:</b> عند ظهور خلاف، يُعرض كلا الناتجين بشفافية كاملة.
              لا يُكتم أي اختلاف بصمت.
            </p>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}