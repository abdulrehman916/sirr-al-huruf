/**
 * QasamPanel — Read-only Recommended Qasam / Recitation panel
 * Source: Sirr al-Huruf PDF (verbatim Arabic with harakat).
 * Placed below the Timing / RitualDecisionEngine section on the Mizan page.
 *
 * Rule-based selection: the displayed Qasam is chosen from the current
 * Mizan selections (Day, Planetary Hour, Ritual Type, Khayr/Sharr) using
 * resolveQasam() — never by hard-coded PDF page numbers.
 *
 * This component ONLY displays content. It never modifies calculations.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, Scroll, AlertTriangle, CheckCircle2 } from "lucide-react";
import { resolveQasam, GENERAL_POST_QASAM_DUA } from "@/lib/qasamData";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

const PLANET_ARABIC = {
  sems: 'الشمس', kamer: 'القمر', merih: 'المريخ', utarid: 'العطارد',
  mustari: 'المشتري', zuhre: 'الزهرة', zuhal: 'الزحل',
};

const RITUAL_ARABIC = {
  celb: 'جلب', tard: 'طرد', sihhat: 'الصحة', sekam: 'السقم', tarfet: 'طرفة العين',
};

const KHAYR_SHARR_ARABIC = {
  khayr: 'الخير', sharr: 'الشر',
};

export default function QasamPanel({ selections }) {
  const [expanded, setExpanded] = useState(false);
  const [showDua, setShowDua] = useState(false);

  const { entry, conditions } = resolveQasam(selections);

  return (
    <div className="mt-4">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
          border: `1px solid ${G.border}`,
          boxShadow: "0 4px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.07)",
        }}
      >
        {/* ── Header ── */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4"
          style={{ borderBottom: expanded ? `1px solid ${G.border}` : "none" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.06) 100%)",
                border: `1px solid ${G.borderHi}`,
                boxShadow: "0 0 18px rgba(212,175,55,0.15)",
              }}
            >
              <Scroll className="w-5 h-5" style={{ color: G.text }} />
            </div>
            <div className="text-left">
              <h3 className="font-inter text-base font-bold tracking-wide text-white">
                Recommended Qasam / Recitation
              </h3>
              <p className="font-amiri text-sm" style={{ color: G.dim }}>
                القسم والعزيمة الموصى به
              </p>
            </div>
          </div>
          <ChevronDown
            className="w-4 h-4 transition-transform flex-shrink-0"
            style={{ color: G.dim, transform: expanded ? "rotate(180deg)" : "none" }}
          />
        </button>

        {/* ── Body ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">

                {/* Source notice */}
                <div
                  className="flex items-start gap-2 rounded-xl p-3"
                  style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.18)" }}
                >
                  <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "rgba(74,222,128,0.65)" }} />
                  <p className="font-inter text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                    Source: Sirr al-Huruf PDF — Arabic text verbatim with harakat. The Qasam below is selected automatically by rule from your current Mizan selections. Read-only reference panel.
                  </p>
                </div>

                {/* ── Rule-based selection conditions ── */}
                {conditions && (
                  <div
                    className="rounded-xl p-3 space-y-2"
                    style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.border}` }}
                  >
                    <p className="font-inter text-[10px] uppercase tracking-widest font-bold" style={{ color: G.text }}>
                      Selection Conditions (Rule-Based)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <ConditionChip
                        label="Day"
                        value={entry ? entry.dayName : (conditions.daySelected ? '—' : 'Not selected')}
                        ok={!!entry}
                      />
                      <ConditionChip
                        label="Planetary Hour"
                        value={conditions.hourPlanet ? (PLANET_ARABIC[conditions.hourPlanet] || conditions.hourPlanet) : '—'}
                        ok={!!conditions.hourPlanet}
                      />
                      <ConditionChip
                        label="Ritual Type"
                        value={conditions.ritualType ? (RITUAL_ARABIC[conditions.ritualType] || conditions.ritualType) : '—'}
                        ok={!!conditions.ritualType}
                      />
                      <ConditionChip
                        label="Khayr / Sharr"
                        value={conditions.khayrSharr ? (KHAYR_SHARR_ARABIC[conditions.khayrSharr] || conditions.khayrSharr) : '—'}
                        ok={!!conditions.khayrSharr}
                      />
                    </div>
                    {/* Day/Hour planet match validation per PDF rule */}
                    {entry && conditions.hourPlanet && (
                      <div
                        className="flex items-start gap-2 rounded-lg p-2.5"
                        style={{
                          background: conditions.hourMatchesDay ? "rgba(74,222,128,0.06)" : "rgba(251,191,36,0.06)",
                          border: `1px solid ${conditions.hourMatchesDay ? "rgba(74,222,128,0.25)" : "rgba(251,191,36,0.30)"}`,
                        }}
                      >
                        {conditions.hourMatchesDay
                          ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "rgba(74,222,128,0.80)" }} />
                          : <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "rgba(251,191,36,0.85)" }} />}
                        <p className="font-inter text-[11px] leading-relaxed" style={{
                          color: conditions.hourMatchesDay ? "rgba(186,230,253,0.85)" : "rgba(253,224,138,0.90)",
                        }}>
                          {conditions.hourMatchesDay
                            ? `✓ PDF Rule satisfied: the selected Planetary Hour (${PLANET_ARABIC[conditions.hourPlanet]}) matches the planet of the selected Day. The king is called in his own day and hour.`
                            : `⚠ PDF Rule: each king must be called during his planet's hour. The selected Hour's planet (${PLANET_ARABIC[conditions.hourPlanet]}) does not match this Day's planet (${PLANET_ARABIC[conditions.dayPlanet]}). Consider selecting the matching planetary hour.`}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!entry ? (
                  <div
                    className="rounded-xl p-5 text-center"
                    style={{ background: G.bg, border: `1px solid ${G.border}` }}
                  >
                    <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                      No Qasam matches the current selection.
                    </p>
                    <p className="font-inter text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Select a Day in the Mizan inputs above to display the corresponding Qasam for that day's king.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">

                    {/* Day badge + king */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className="font-amiri text-base font-bold px-4 py-1.5 rounded-full"
                        style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}
                      >
                        {entry.dayName}
                      </span>
                      <span className="font-inter text-xs" style={{ color: G.dim }}>
                        خادم اليوم: <span className="font-amiri font-bold" style={{ color: G.text }}>{entry.king}</span>
                      </span>
                    </div>

                    {/* Rule note: each king only on his own day */}
                    <div
                      className="rounded-xl p-3"
                      style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.20)" }}
                    >
                      <p className="font-inter text-[11px]" style={{ color: "rgba(251,191,36,0.80)" }}>
                        📖 PDF Rule: Each king is called only on his own designated day, during his planet's hour. This Qasam is the one assigned to the selected Day.
                      </p>
                    </div>

                    {/* ── Form 1: Da'wa ── */}
                    <Section
                      label="الدعوة (Form 1 — Longer Invocation)"
                      labelMl="ദഅ്‌വ — ദൈർഘ്യമേറിയ ആഹ്വാന രൂപം"
                      arabic={entry.da3wa.arabic}
                      malayalam={entry.da3wa.malayalam}
                    />

                    {/* ── Form 2: Qasam (Omani scholar refined form) ── */}
                    <Section
                      label="القسم (Form 2 — Omani Scholar Refined Form)"
                      labelMl="ഖസം — ഒമാനി പണ്ഡിത-ശൈലി ശുദ്ധ രൂപം"
                      arabic={entry.qasam.arabic}
                      malayalam={entry.qasam.malayalam}
                      highlight
                    />

                    {/* PDF note: the refined form unites verse, king, servants, letters, names */}
                    <div
                      className="rounded-xl p-3"
                      style={{ background: G.bg, border: `1px solid ${G.border}` }}
                    >
                      <p className="font-amiri text-sm text-right leading-loose" style={{ color: "rgba(255,255,255,0.65)" }}>
                        وَذَكَرَ هَذِهِ الأَقسَامَ أَحَدُ المَشَايِخِ العُمَانِيِّينَ رَحِمَهُ اللهُ تَعَالَى بِصِيغَةٍ أُخرَى وَهِيَ أَدَقُّ وَأَفضَلُ لِأَنَّهَا تَجمَعُ (الآيَةَ وَالمَلِكَ وَالخُدَّامَ المُوَكَّلِينَ وَالأَحرُفَ وَالأَسمَاءَ)
                      </p>
                      <p className="font-inter text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                        The Omani scholars' refined form is more precise and preferred as it unites the verse, the king, the assigned servants, letters, and names.
                      </p>
                    </div>

                    {/* ── General Post-Qasam Du'a ── */}
                    <div>
                      <button
                        onClick={() => setShowDua(!showDua)}
                        className="w-full flex items-center justify-between rounded-xl px-4 py-3 mb-2"
                        style={{ background: G.bg, border: `1px solid ${G.border}` }}
                      >
                        <span className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
                          الدعاء العام بعد القسم — General Post-Qasam Du'a
                        </span>
                        <ChevronDown
                          className="w-4 h-4 transition-transform flex-shrink-0"
                          style={{ color: G.dim, transform: showDua ? "rotate(180deg)" : "none" }}
                        />
                      </button>
                      <AnimatePresence>
                        {showDua && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <Section
                              label=""
                              labelMl=""
                              arabic={GENERAL_POST_QASAM_DUA.arabic}
                              malayalam={GENERAL_POST_QASAM_DUA.malayalam}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Incense instruction */}
                    <div
                      className="rounded-xl p-3"
                      style={{ background: "rgba(212,175,55,0.04)", border: `1px solid ${G.border}` }}
                    >
                      <p className="font-inter text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
                        📌 <span className="font-bold" style={{ color: G.text }}>PDF Instruction:</span> After the required Qasam for the selected day, use the incense of that day while reading or writing the Azima. Read the Azima upon all works after the Qasam.
                      </p>
                    </div>

                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ConditionChip({ label, value, ok }) {
  return (
    <div
      className="rounded-lg px-2.5 py-2"
      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${ok ? G.border : "rgba(255,255,255,0.08)"}` }}
    >
      <p className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>{label}</p>
      <p className="font-amiri text-sm font-bold truncate" style={{ color: ok ? G.text : "rgba(255,255,255,0.30)" }}>
        {value}
      </p>
    </div>
  );
}

function Section({ label, labelMl, arabic, malayalam, highlight }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: highlight
          ? "linear-gradient(145deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 100%)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${highlight ? G.borderHi : G.border}`,
        boxShadow: highlight ? "0 0 20px rgba(212,175,55,0.10)" : "none",
      }}
    >
      {label && (
        <div
          className="px-4 py-2.5"
          style={{ borderBottom: `1px solid ${G.border}` }}
        >
          <p className="font-inter text-[11px] font-bold uppercase tracking-wider" style={{ color: G.text }}>
            {label}
          </p>
          {labelMl && (
            <p className="font-inter text-[10px] mt-0.5" style={{ color: G.dim }}>
              {labelMl}
            </p>
          )}
        </div>
      )}
      <div className="p-4 space-y-3">
        {/* Arabic — verbatim from PDF, right-to-left, Amiri font */}
        <div
          className="rounded-lg p-4"
          style={{ background: "rgba(8,16,38,0.80)", border: `1px solid ${G.border}` }}
          dir="rtl"
        >
          <p
            className="font-amiri text-right"
            style={{
              color: "#F5E6B0",
              fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)",
              lineHeight: "2.4",
              letterSpacing: "0.04em",
              wordSpacing: "0.12em",
              fontWeight: 600,
              fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1, "ss01" 1, "mkmk" 1, "mark" 1',
            }}
          >
            {arabic}
          </p>
        </div>
        {/* Malayalam explanation */}
        {malayalam && (
          <div
            className="rounded-lg p-3"
            style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.15)" }}
          >
            <p
              className="font-inter text-xs leading-relaxed"
              style={{ color: "rgba(255,255,255,0.60)" }}
            >
              {malayalam}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}