/**
 * ManuscriptEsmaSection
 * One fully self-contained Esma section matching manuscript layout (pp.60–69):
 *  A) Satr-ı Vahid (single-line letter sequence)
 *  B) Grouped names
 *  C) Independent Vefk (4×4) with independent S input
 *  D) Independent surrounding angel/spirit name (guardian)
 *
 * Also shows MANUSCRIPT vs ALGORITHM divergence when the thousands marker differs.
 */
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IstintakSteps from "./IstintakSteps";
import { istintak, getBastLevel, buildVefk, ELEMENT_BAST_TOTALS } from "../../lib/mizaanPostEngine";

const AR = {
  fontFamily: "'Noto Naskh Arabic','Amiri','Scheherazade New',serif",
};

const ELEMENT_META = {
  fire:  { arabic: "النار",  color: "#FF6B35", glow: "rgba(255,107,53,0.25)", border: "rgba(255,107,53,0.45)" },
  earth: { arabic: "التراب", color: "#A5C880", glow: "rgba(165,200,128,0.25)", border: "rgba(165,200,128,0.45)" },
  air:   { arabic: "الهواء", color: "#B2EBF2", glow: "rgba(178,235,242,0.25)", border: "rgba(178,235,242,0.45)" },
  water: { arabic: "الماء",  color: "#4FC3F7", glow: "rgba(79,195,247,0.25)", border: "rgba(79,195,247,0.45)" },
};

const G = {
  text:    "#F5D060",
  dim:     "rgba(212,175,55,0.55)",
  border:  "rgba(212,175,55,0.35)",
  borderHi:"rgba(212,175,55,0.65)",
  bg:      "rgba(212,175,55,0.07)",
};

function ArabicText({ children, size = "1.6rem", color, dir: d = "rtl" }) {
  return (
    <span dir={d} lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: size, color: color || G.text }}>
      {children}
    </span>
  );
}

function SatrRow({ letters, label, color }) {
  return (
    <div className="space-y-1.5">
      <p className="font-inter text-[7px] uppercase tracking-widest" style={{ color: G.dim }}>{label}</p>
      <div className="flex flex-wrap gap-1 p-2 rounded-xl border" dir="rtl"
        style={{ borderColor: color + "44", background: color + "0A" }}>
        {letters.map((l, i) => (
          <span key={i} dir="rtl" lang="ar"
            style={{ fontFamily: AR.fontFamily, fontSize: "1.5rem", color, lineHeight: 1.4, padding: "0 3px" }}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function VefkBlock({ satirTotal, element, label, color }) {
  const vefk = useMemo(() => buildVefk(satirTotal, element), [satirTotal, element]);
  const meta  = ELEMENT_META[element] || ELEMENT_META.fire;

  const guardianLetters = useMemo(() =>
    istintak(ELEMENT_BAST_TOTALS[element] || 3550), [element]);
  const guardianName = guardianLetters.join('');

  return (
    <div className="rounded-2xl border p-4 space-y-3"
      style={{ borderColor: meta.border, background: "rgba(4,6,20,0.99)", boxShadow: `0 0 24px ${meta.glow}` }}>
      <p className="font-inter text-[9px] uppercase tracking-widest text-center font-bold" style={{ color: meta.color }}>
        {label}
      </p>

      {/* Stats */}
      <div className="space-y-1">
        {[
          { l: "S (سطر الواحد)", v: satirTotal.toLocaleString() },
          { l: "V = S − 30",     v: (satirTotal - 30).toLocaleString() },
          { l: "Q = V ÷ 4",     v: vefk.Q.toLocaleString() },
          { l: "R (باقي)",       v: vefk.R.toString() },
          { l: "MC (مجموع السطر)", v: vefk.mc.toLocaleString(), hi: true },
        ].map(({ l, v, hi }) => (
          <div key={l} className="flex justify-between py-0.5 border-b"
            style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{l}</span>
            <span className="font-inter text-xs font-bold tabular-nums" style={{ color: hi ? "#FFE580" : G.text }}>{v}</span>
          </div>
        ))}
      </div>

      {/* 4×4 grid */}
      <div>
        <p className="font-inter text-[7px] uppercase tracking-widest text-center mb-2" style={{ color: G.dim }}>
          {element} · 4×4
        </p>
        <div className="grid grid-cols-4 gap-1 max-w-[200px] mx-auto">
          {vefk.grid.flat().map((val, i) => (
            <div key={i} className="aspect-square flex items-center justify-center rounded-lg border font-inter font-bold tabular-nums"
              style={{ background: meta.glow.replace('0.25','0.06'), borderColor: meta.border, color: meta.color, fontSize: "0.65rem" }}>
              {val}
            </div>
          ))}
        </div>
        <p className="font-inter text-[7px] text-center mt-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
          كل سطر وعمود وقطر = {vefk.mc.toLocaleString()}
        </p>
      </div>

      {/* Guardian name */}
      <div className="flex items-center justify-between rounded-xl border px-3 py-2"
        style={{ borderColor: meta.border, background: meta.glow.replace('0.25','0.08') }}>
        <span className="font-inter text-[7px] uppercase tracking-widest" style={{ color: G.dim }}>
          اسم الحارس (4 أضلاع)
        </span>
        <ArabicText color={meta.color} size="1.4rem">{guardianName}</ArabicText>
      </div>
    </div>
  );
}

function NamesList({ names, prefix, color, sectionLabel }) {
  return (
    <div className="space-y-2">
      <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>
        {sectionLabel} ({names.length} اسم)
      </p>
      <div className="space-y-1.5">
        {names.map((name, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{ borderColor: color + "44", background: color + "0A" }}>
            <span className="font-inter text-[7px] tabular-nums w-5 h-5 rounded-full flex items-center justify-center border"
              style={{ color, borderColor: color + "55" }}>{i + 1}</span>
            <ArabicText color={color} size="1.5rem">
              {prefix ? `${prefix} ${name}` : name}
            </ArabicText>
            <span className="font-inter text-[7px] ml-auto" style={{ color: "rgba(255,255,255,0.20)" }}>
              {[...name].join(' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeedExpansionDetail({ seedBastValues, bastLevelUsed, color }) {
  return (
    <div className="space-y-1.5">
      <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>
        توسيع البذور — المستوى {bastLevelUsed} من الباست
      </p>
      {seedBastValues.map((sv, i) => (
        <div key={i} className="rounded-xl border overflow-hidden"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-2 px-3 py-1.5">
            <ArabicText color={color} size="1.4rem">{sv.letter}</ArabicText>
            <span className="font-inter text-[8px]" style={{ color: G.dim }}>
              باست{bastLevelUsed}({sv.letter}) = {sv.bastValue}
            </span>
            <div className="flex gap-0.5 flex-wrap ml-auto" dir="rtl">
              {sv.expansionLetters.map((el, j) => (
                <span key={j} dir="rtl" lang="ar"
                  style={{ fontFamily: AR.fontFamily, fontSize: "1.1rem", color: "rgba(255,255,255,0.50)", padding: "0 2px" }}>
                  {el}
                </span>
              ))}
            </div>
          </div>
          {/* Istintak steps for this Bast value — compact */}
          <div className="px-3 pb-2">
            <IstintakSteps n={sv.bastValue} msMarker={false} compact={true} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ManuscriptEsmaSection({
  tier,        // 'kitabet' | 'avan' | 'kasem'
  data,        // from generateEsmaLevel output
  element,
  satirTotal,  // the S used for this section's vefk
  color,
  prefix,      // '' | 'يا' | 'بحق'
  number,      // 1 | 2 | 3
}) {
  const [openSatr, setOpenSatr] = useState(true);
  const [openNames, setOpenNames] = useState(true);
  const [openVefk, setOpenVefk] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const TIER_LABELS = {
    kitabet: { ar: 'أسماء الكتابة', en: 'Esma-i Kitabet', note: 'مكتوبة على أضلاع الوفق فقط — ليست في العزيمة' },
    avan:    { ar: 'أسماء الأعوان', en: 'Esma-i A\'van',  note: 'تُقرأ في العزيمة مع يا' },
    kasem:   { ar: 'أسماء القسم',  en: 'Esma-i Kasem',   note: 'تُقرأ في العزيمة مع بحق — دائماً الباست الخامس' },
  };
  const meta = TIER_LABELS[tier];

  function Toggle({ label, open, onToggle }) {
    return (
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl"
        style={{ background: open ? G.bg : "rgba(255,255,255,0.02)", border: `1px solid ${open ? G.borderHi : G.border}` }}>
        <span className="font-inter text-[8px] uppercase tracking-widest font-semibold" style={{ color: G.text }}>{label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }}
          className="font-inter text-[9px]" style={{ color: G.dim }}>▼</motion.span>
      </button>
    );
  }

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ borderColor: color + "55", background: "rgba(3,6,18,0.99)" }}>

      {/* Section header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: color + "30", background: color + "0D" }}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-inter text-[11px] font-bold tabular-nums w-6 h-6 rounded-full flex items-center justify-center border"
              style={{ color, borderColor: color + "66", background: color + "18" }}>
              {number}
            </span>
            <div>
              <p className="font-inter text-[10px] uppercase tracking-widest font-bold" style={{ color }}>{meta.en}</p>
              <ArabicText color={color + "CC"} size="1.1rem">{meta.ar}</ArabicText>
            </div>
          </div>
          <span className="font-inter text-[7px] px-2 py-0.5 rounded-full border text-right"
            style={{ color: "rgba(255,255,255,0.30)", borderColor: "rgba(255,255,255,0.08)", maxWidth: "120px", lineHeight: 1.5 }}>
            {meta.note}
          </span>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-1 mt-3">
          {[
            { l: "باست Σ", v: data.bastSum.toLocaleString() },
            { l: "عدد الحروف", v: data.letterCount },
            { l: "سطر الواحد", v: data.satirTotal.toLocaleString() },
            { l: `مستوى الباست`, v: `${data.bastLevelUsed}${tier === 'kasem' ? ' (دائماً)' : data.isZevc ? ' (زوج)' : ' (فرد)'}` },
          ].map(({ l, v }) => (
            <div key={l} className="rounded-lg border p-1.5 text-center"
              style={{ borderColor: color + "30", background: color + "08" }}>
              <p className="font-inter text-[6px] uppercase tracking-widest mb-0.5" style={{ color: G.dim }}>{l}</p>
              <p className="font-inter text-xs font-bold tabular-nums" style={{ color }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">

        {/* A) Satr-ı Vahid — seed letters + Istintak steps */}
        <Toggle label="A) سطر الواحد — الاستنطاق" open={openSatr} onToggle={() => setOpenSatr(v => !v)} />
        <AnimatePresence initial={false}>
          {openSatr && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
              <div className="space-y-3 pt-1">
                {/* Input letters (from previous stage) */}
                <div>
                  <p className="font-inter text-[7px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                    حروف المدخل ({data.inputLetters.length})
                  </p>
                  <div className="flex flex-wrap gap-1 p-2 rounded-xl border" dir="rtl"
                    style={{ borderColor: G.border, background: G.bg }}>
                    {data.inputLetters.map((l, i) => (
                      <span key={i} dir="rtl" lang="ar"
                        style={{ fontFamily: AR.fontFamily, fontSize: "1.3rem", color: G.text }}>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Istintak of satirTotal */}
                <div>
                  <p className="font-inter text-[7px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
                    استنطاق سطر الواحد ({data.satirTotal.toLocaleString()})
                  </p>
                  <IstintakSteps n={data.satirTotal} msMarker={false} compact={false} />
                </div>

                {/* Seed letters */}
                <SatrRow letters={data.seedLetters} label={`بذور (${data.seedCount}) — ${data.isZevc ? 'زوج → باست ٤' : 'فرد → باست ٥'}`} color={color} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Per-seed expansion detail */}
        <Toggle label="توسيع البذور (باست → استنطاق)" open={openDetail} onToggle={() => setOpenDetail(v => !v)} />
        <AnimatePresence initial={false}>
          {openDetail && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
              <div className="pt-1">
                <SeedExpansionDetail
                  seedBastValues={data.seedBastValues}
                  bastLevelUsed={data.bastLevelUsed}
                  color={color}
                />
                <div className="mt-3">
                  <SatrRow
                    letters={data.expandedLetters}
                    label={`جميع الحروف الموسعة (${data.expandedCount}) — ${data.isExpandedZevc ? 'زوج → مجموعات ٤' : 'فرد → مجموعات ٥'}`}
                    color="rgba(255,255,255,0.55)"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* B) Grouped names */}
        <Toggle label="B) الأسماء المجمعة" open={openNames} onToggle={() => setOpenNames(v => !v)} />
        <AnimatePresence initial={false}>
          {openNames && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
              <div className="pt-1">
                <NamesList
                  names={data.names}
                  prefix={prefix}
                  color={color}
                  sectionLabel={meta.en}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* C + D) Independent Vefk with guardian name */}
        <Toggle label="C+D) الوفق المستقل + اسم الحارس" open={openVefk} onToggle={() => setOpenVefk(v => !v)} />
        <AnimatePresence initial={false}>
          {openVefk && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
              <div className="pt-2">
                <VefkBlock
                  satirTotal={satirTotal}
                  element={element}
                  label={`${meta.en} Vefki — وفق مستقل`}
                  color={color}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}