/**
 * QasamPanel — Read-only Recommended Qasam / Recitation panel
 * Source: Sirr al-Huruf PDF (verbatim Arabic with harakat).
 * Placed below the Timing / RitualDecisionEngine section on the Mizan page.
 *
 * DISPLAY ORDER (per research requirements):
 *   1. Rules & Conditions (general + day-specific)
 *   2. Arabic Qasam text (Da'wa then Qasam — verbatim)
 *   3. Malayalam explanation (purpose, timing, conditions, warnings, etc.)
 *
 * This component ONLY displays content. It never modifies calculations.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, ChevronDown, Scroll, AlertTriangle, CheckCircle2,
  ShieldCheck, FileWarning, ListChecks,
} from "lucide-react";
import {
  resolveQasam, GENERAL_RULES, GENERAL_POST_QASAM_DUA,
} from "@/lib/qasamData";

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
                القسم والعزيمة الموصى به — من مصدر مُحقَّق
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
              <div className="p-4 space-y-5">

                {/* ── Source & Verification Notice ── */}
                <div
                  className="flex items-start gap-2 rounded-xl p-3"
                  style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.18)" }}
                >
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "rgba(74,222,128,0.65)" }} />
                  <div>
                    <p className="font-inter text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                      <span className="font-bold" style={{ color: "rgba(74,222,128,0.80)" }}>Source:</span> Sirr al-Huruf PDF — Arabic text transcribed verbatim with all harakat, punctuation, and spacing preserved. No guessing, auto-correction, or generation. The Qasam below is selected by rule from your current Mizan selections. Read-only reference panel.
                    </p>
                  </div>
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
                  <div className="space-y-5">

                    {/* Day badge + king + angel verification */}
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
                      <span className="font-inter text-xs" style={{ color: G.dim }}>
                        الكوكب: <span className="font-amiri font-bold" style={{ color: G.text }}>{entry.planetArabic}</span>
                      </span>
                    </div>

                    {/* ═══════════════════════════════════════════════════
                        SECTION 1: RULES & CONDITIONS (FIRST)
                        ═══════════════════════════════════════════════════ */}
                    <div
                      className="rounded-xl overflow-hidden"
                      style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.border}` }}
                    >
                      <div
                        className="px-4 py-2.5 flex items-center gap-2"
                        style={{ borderBottom: `1px solid ${G.border}`, background: G.bg }}
                      >
                        <ListChecks className="w-4 h-4" style={{ color: G.text }} />
                        <span className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
                          Rules & Conditions — القواعد والشروط
                        </span>
                      </div>

                      <div className="p-4 space-y-4">
                        {/* General rules (apply to all days) — in book order */}
                        <div>
                          <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: G.dim }}>
                            General Rules (from earlier pages, in book order)
                          </p>
                          <div className="space-y-2">
                            {GENERAL_RULES.map((rule) => (
                              <RuleItem key={rule.id} rule={rule} />
                            ))}
                          </div>
                        </div>

                        {/* Day-specific rules */}
                        <div>
                          <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: G.dim }}>
                            Day-Specific Rules — {entry.dayName}
                          </p>
                          <div className="space-y-2">
                            {entry.rules.map((rule) => (
                              <RuleItem key={rule.id} rule={rule} />
                            ))}
                          </div>
                        </div>

                        {/* King/angel verification note */}
                        <div
                          className="rounded-lg p-3"
                          style={{ background: "rgba(96,165,250,0.04)", border: "1px solid rgba(96,165,250,0.18)" }}
                        >
                          <div className="flex items-start gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(96,165,250,0.70)" }} />
                            <div>
                              <p className="font-inter text-[9px] uppercase tracking-wider font-bold mb-1" style={{ color: "rgba(96,165,250,0.60)" }}>
                                Holy Names Verification
                              </p>
                              <p className="font-amiri text-sm text-right leading-loose" style={{ color: "rgba(255,255,255,0.70)" }}>
                                {entry.kingNote}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════
                        SECTION 2: ARABIC QASAM TEXT (SECOND)
                        ═══════════════════════════════════════════════════ */}
                    <div
                      className="rounded-xl overflow-hidden"
                      style={{
                        background: "linear-gradient(145deg, rgba(8,16,38,0.95) 0%, rgba(4,10,24,0.98) 100%)",
                        border: `1px solid ${G.borderHi}`,
                      }}
                    >
                      <div
                        className="px-4 py-2.5 flex items-center gap-2"
                        style={{ borderBottom: `1px solid ${G.border}`, background: G.bgHi }}
                      >
                        <Scroll className="w-4 h-4" style={{ color: G.text }} />
                        <span className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
                          Arabic Text — النص العربي (verbatim from source)
                        </span>
                      </div>

                      <div className="p-4 space-y-4">
                        {/* Form 1: Da'wa */}
                        <ArabicBlock
                          label="الدعوة (Form 1 — Longer Invocation)"
                          labelMl="ദഅ്‌വ — ആഹ്വാന രൂപം (ദൈർഘ്യമേറിയത്)"
                          arabic={entry.da3wa.arabic}
                        />

                        {/* Form 2: Qasam (Omani scholar refined) */}
                        <ArabicBlock
                          label="القسم (Form 2 — Omani Scholar Refined Form)"
                          labelMl="ഖസം — ഒമാനി പണ്ഡിത-ശൈലി ശുദ്ധ രൂപം"
                          arabic={entry.qasam.arabic}
                          highlight
                        />

                        {/* PDF note about refined form */}
                        <div
                          className="rounded-lg p-3"
                          style={{ background: G.bg, border: `1px solid ${G.border}` }}
                        >
                          <p className="font-amiri text-sm text-right leading-loose" style={{ color: "rgba(255,255,255,0.65)" }}>
                            وَذَكَرَ هَذِهِ الأَقسَامَ أَحَدُ المَشَايِخِ العُمَانِيِّينَ رَحِمَهُ اللهُ تَعَالَى بِصِيغَةٍ أُخرَى وَهِيَ أَدَقُّ وَأَفضَلُ لِأَنَّهَا تَجمَعُ (الآيَةَ وَالمَلِكَ وَالخُدَّامَ المُوَكَّلِينَ وَالأَحرُفَ وَالأَسمَاءَ)
                          </p>
                          <p className="font-inter text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                            The Omani scholars' refined form is more precise and preferred — it unites the verse, king, assigned servants, letters, and names.
                          </p>
                        </div>

                        {/* General Post-Qasam Du'a (collapsible) */}
                        <div>
                          <button
                            onClick={() => setShowDua(!showDua)}
                            className="w-full flex items-center justify-between rounded-lg px-4 py-2.5"
                            style={{ background: G.bg, border: `1px solid ${G.border}` }}
                          >
                            <span className="font-inter text-[11px] font-bold uppercase tracking-wider" style={{ color: G.text }}>
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
                                <div className="pt-2">
                                  <ArabicBlock label="" labelMl="" arabic={GENERAL_POST_QASAM_DUA.arabic} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════
                        SECTION 3: MALAYALAM EXPLANATION (THIRD)
                        ═══════════════════════════════════════════════════ */}
                    <div
                      className="rounded-xl overflow-hidden"
                      style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${G.border}` }}
                    >
                      <div
                        className="px-4 py-2.5 flex items-center gap-2"
                        style={{ borderBottom: `1px solid ${G.border}`, background: "rgba(212,175,55,0.04)" }}
                      >
                        <BookOpen className="w-4 h-4" style={{ color: G.text }} />
                        <span className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
                          Malayalam Explanation — മലയാളം വിവരണം
                        </span>
                      </div>

                      <div className="p-4 space-y-3">
                        <ExplanationRow label="ഉദ്ദേശ്യം (Purpose)" value={entry.explanation.purpose} />
                        <ExplanationRow label="ഉപയോഗ സമയം (When Used)" value={entry.explanation.whenUsed} />
                        <ExplanationRow label="നിശ്ചിത ദിവസം (Required Day)" value={entry.explanation.requiredDay} />
                        <ExplanationRow label="ഗ്രഹ സാആത്ത് (Planetary Hour)" value={entry.explanation.planetaryHour} />
                        <ExplanationRow label="അനുഷ്ഠാന നിബന്ധനകൾ (Ritual Conditions)" value={entry.explanation.ritualConditions} />
                        <ExplanationRow label="മുന്നറിയിപ്പുകൾ (Warnings)" value={entry.explanation.warnings} />
                        <ExplanationRow label="ആവർത്തന എണ്ണം (Repetitions)" value={entry.explanation.repetitions} />
                        <ExplanationRow label="ബന്ധപ്പെട്ട നിയമങ്ങൾ (Related Rules)" value={entry.explanation.relatedRules} />
                      </div>
                    </div>

                    {/* Incense instruction */}
                    <div
                      className="rounded-xl p-3 flex items-start gap-2"
                      style={{ background: "rgba(212,175,55,0.04)", border: `1px solid ${G.border}` }}
                    >
                      <FileWarning className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: G.text }} />
                      <p className="font-inter text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
                        <span className="font-bold" style={{ color: G.text }}>PDF Instruction:</span> After the required Qasam for the selected day, use the incense of that day while reading or writing the Azima. Read the Azima upon all works after the Qasam.
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

// ── Rule Item (Arabic rule + Malayalam + note) ──
function RuleItem({ rule }) {
  return (
    <div
      className="rounded-lg p-2.5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.15)" }}
    >
      <div className="flex items-start gap-2 mb-1">
        <span
          className="font-inter text-[8px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
          style={{ background: G.bgHi, color: G.dim, border: `1px solid ${G.border}` }}
        >
          {rule.id}
        </span>
        <p
          className="font-amiri text-sm text-right leading-loose flex-1"
          style={{ color: "rgba(255,255,255,0.75)" }}
          dir="rtl"
        >
          {rule.arabic}
        </p>
      </div>
      <p className="font-inter text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
        {rule.malayalam}
      </p>
      {rule.note && (
        <p className="font-inter text-[9px] mt-1 italic" style={{ color: G.dim }}>
          {rule.note}
        </p>
      )}
    </div>
  );
}

// ── Arabic Block (verbatim, RTL, Amiri) ──
function ArabicBlock({ label, labelMl, arabic, highlight }) {
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
        <div className="px-4 py-2" style={{ borderBottom: `1px solid ${G.border}` }}>
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
      <div className="p-4">
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
      </div>
    </div>
  );
}

// ── Explanation Row ──
function ExplanationRow({ label, value }) {
  return (
    <div
      className="rounded-lg p-2.5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.12)" }}
    >
      <p className="font-inter text-[10px] font-bold mb-1" style={{ color: G.text }}>
        {label}
      </p>
      <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
        {value}
      </p>
    </div>
  );
}

// ── Condition Chip ──
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