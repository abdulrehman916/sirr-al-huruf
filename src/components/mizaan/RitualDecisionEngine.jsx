// ═══════════════════════════════════════════════════════════════
// RITUAL TIMING ADVISOR — Astrology Clock Interpreter (Read-only)
// ═══════════════════════════════════════════════════════════════
// A simple Advisor that explains the Astrology Clock in plain Malayalam.
//
// FLOW:
//   1. User selects a Ritual Purpose (identified FIRST).
//   2. The engine reads AstroClockKnowledge records for that Purpose.
//   3. The user's selected Day / Saat / Layl-Nahar are compared.
//   4. The Advisor explains EVERYTHING in Malayalam.
//   5. Original Astro Clock explanations are displayed — never invented.
//
// SECTIONS:
//   • Purpose
//   • Is today suitable? (Yes / No + original explanation)
//   • Failed fields only (Better Day, Better Saat, Better Layl/Nahar)
//   • Today's Available Times (each suitable Saat + explanation)
//   • Next Available Timing (if no suitable times today)
//   • Times to Avoid Today (each + explanation)
//
// No Turkish field names. No database terminology. No technical rule names.
// Works identically across ALL Mizan Methods and ALL Sections.
// ═══════════════════════════════════════════════════════════════
import { useState, useMemo, useEffect } from "react";
import { Target, CheckCircle2, XCircle, AlertCircle, Clock, Sunset, Ban, Sparkles, AlertTriangle } from "lucide-react";
import { analyzeRitualTiming } from "../../lib/ritualTimingEngineV3";
import PlanningModePanel from "./PlanningModePanel";
import MoonAnalysisCard from "./MoonAnalysisCard";
import { setSaatPlanningContext } from "../../lib/mizaanSaatCalculator";
import { useRitualLang, tDay, tPlanet } from "../../lib/ritualTimingI18n";
import { useAstroClockKnowledgeAll } from "../../hooks/useAstroClockKnowledgeAll";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

// ── Inline bilingual helper ──
const T = (en, ml, lang) => (lang === "ml" ? ml : en);

const DAY_NAME_TO_INDEX = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6,
};

const ML_DAY = {
  Sunday: "ഞായർ", Monday: "തിങ്കൾ", Tuesday: "ചൊവ്വ",
  Wednesday: "ബുധൻ", Thursday: "വ്യാഴം", Friday: "വെള്ളി", Saturday: "ശനി",
};

const ML_PLANET = {
  Sun: "സൂര്യൻ", Moon: "ചന്ദ്രൻ", Mars: "ചൊവ്വ", Mercury: "ബുധൻ",
  Jupiter: "ഗുരു", Venus: "ശുക്രൻ", Saturn: "ശനി",
  sun: "സൂര്യൻ", moon: "ചന്ദ്രൻ", mars: "ചൊവ്വ", mercury: "ബുധൻ",
  jupiter: "ഗുരു", venus: "ശുക്രൻ", saturn: "ശനി",
};

// ═══════════════════════════════════════════════════════════════
// ASTROLOGY CLOCK LOOKUP — find the original explanation for a
// specific Day + Saat + Kawkab context. The Astro Clock is the
// ONLY authority. These helpers are read-only display utilities.
// ═══════════════════════════════════════════════════════════════

// Look up the AstroClockKnowledge record for an exact context.
// 1. Exact match: weekday + period + saat_number + planet.
// 2. Fallback: weekday + period + saat_number (ignore planet) — the engine's
//    Chaldean-order planet may differ from the manuscript's assignment for the
//    same Saat. The Malayalam explanation belongs to the Saat, not the planet.
//    Prefer fallback records that actually have Malayalam recommended_actions.
function lookupAstroRecord(astroClockKnowledge, weekday, period, saatNumber, kawkab) {
  if (!astroClockKnowledge || astroClockKnowledge.length === 0) return null;
  const kawkabLC = String(kawkab || "").toLowerCase();
  const hasMl = (r) =>
    r.recommended_actions?.some((a) => a.ml && a.ml.trim()) ||
    (r.knowledge_text_ml && r.knowledge_text_ml.trim()) ||
    r.notes_list?.some((a) => a.ml && a.ml.trim());

  // 1. Exact match: weekday + period + saat_number + planet — prefer Malayalam
  const exact = astroClockKnowledge.find(
    (r) =>
      r.weekday === weekday &&
      r.period === period &&
      r.saat_number === saatNumber &&
      String(r.planet || "").toLowerCase() === kawkabLC
  );
  if (exact && hasMl(exact)) return exact;

  // 2. Same weekday + period + saat_number (ignore planet) — prefer Malayalam
  const sameDay = astroClockKnowledge.filter(
    (r) =>
      r.weekday === weekday &&
      r.period === period &&
      r.saat_number === saatNumber
  );
  const sameDayMl = sameDay.find((r) => hasMl(r));
  if (sameDayMl) return sameDayMl;

  // 3. Any weekday + same period + saat_number — prefer Malayalam
  //    The Malayalam explanation for a Saat is the same regardless of weekday;
  //    only the ruling planet changes. If the current weekday has no Malayalam,
  //    use the Malayalam from the same Saat on a different weekday.
  const anyDay = astroClockKnowledge.filter(
    (r) =>
      r.period === period &&
      r.saat_number === saatNumber
  );
  const anyDayMl = anyDay.find((r) => hasMl(r));
  if (anyDayMl) return anyDayMl;

  // 4. Fall back to exact match (no Malayalam) → same weekday → any day
  return exact || sameDay[0] || anyDay[0] || null;
}

// Collect original Malayalam text from an actions array (recommended/forbidden/enemy/warnings/notes).
// Only .ml is used — never .en. No generation. No translation.
function actionsMl(actions) {
  return (actions || [])
    .map((a) => a.ml || "")
    .filter((m) => m && m.trim())
    .join("; ");
}

// Get the original Malayalam explanation for a SUITABLE time.
// Displays knowledge_text_ml + recommended_actions.ml + notes_list.ml exactly as stored.
// No English fallback. No generation. No summarization.
function getRecordExplanation(record) {
  if (!record) return "";
  const parts = [];
  if (record.knowledge_text_ml && record.knowledge_text_ml.trim()) parts.push(record.knowledge_text_ml.trim());
  const recMl = actionsMl(record.recommended_actions);
  if (recMl) parts.push(recMl);
  const notesMl = actionsMl(record.notes_list);
  if (notesMl) parts.push(notesMl);
  return parts.join("\n");
}

// Get the original Malayalam explanation for an AVOIDED time.
// Displays knowledge_text_ml + forbidden_actions.ml + enemy_actions.ml + warnings_list.ml
// exactly as stored. No English fallback. No generation. No summarization.
function getForbiddenExplanation(record) {
  if (!record) return "";
  const parts = [];
  if (record.knowledge_text_ml && record.knowledge_text_ml.trim()) parts.push(record.knowledge_text_ml.trim());
  const forbMl = actionsMl(record.forbidden_actions);
  if (forbMl) parts.push(forbMl);
  const enemyMl = actionsMl(record.enemy_actions);
  if (enemyMl) parts.push(enemyMl);
  const warnMl = actionsMl(record.warnings_list);
  if (warnMl) parts.push(warnMl);
  return parts.join("\n");
}

// ═══════════════════════════════════════════════════════════════
// DISPLAY HELPERS — translate recommendation values to Malayalam
// ═══════════════════════════════════════════════════════════════

function translateDayRec(val, lang) {
  if (!val || lang !== "ml") return val || "";
  let r = val;
  for (const [en, ml] of Object.entries(ML_DAY)) r = r.split(en).join(ml);
  r = r.split(" or ").join(" അല്ലെങ്കിൽ ");
  r = r.split("Any day except forbidden").join("ഏത് അനുയോജ്യ ദിവസവും");
  return r;
}

function translateHourRec(val, lang) {
  if (!val || lang !== "ml") return val || "";
  let r = val;
  for (const [en, ml] of Object.entries(ML_PLANET)) r = r.split(en).join(ml);
  r = r.split(" or ").join(" അല്ലെങ്കിൽ ");
  r = r.split(" Saat").join(" സഅാത്");
  r = r.split("Saat #").join("സഅാത് #");
  r = r.split("See recommended Saat").join("ശുപാർശ ചെയ്ത സഅാത് കാണുക");
  return r;
}

function translateLaylRec(val, lang) {
  if (!val || lang !== "ml") return val || "";
  if (val === "Night (Layl)") return "രാത്രി (ലൈൽ)";
  if (val === "Day (Nahar)") return "പകൽ (നഹർ)";
  return val;
}

// Saat display number (1-12) from the internal hour number (1-24)
function saatDisplayNum(hourNumber, period) {
  return period === "night" ? hourNumber - 12 : hourNumber;
}

// Ordinal suffix for English, simple dash for Malayalam
function ordinal(num, lang) {
  if (lang === "ml") return "";
  const j = num % 10, k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function RitualDecisionEngine({ result, selections, customPurpose, activeMethod, purposeLookup }) {
  const [lang, setLang] = useRitualLang();
  const { astroClockKnowledge } = useAstroClockKnowledgeAll();

  // ── Planning Mode (optional) ──
  const [planningMode, setPlanningMode] = useState(false);
  const [planningLocation, setPlanningLocation] = useState(null);
  const [planningDate, setPlanningDate] = useState(null);
  const planningContext = useMemo(() => {
    if (!planningMode || !planningLocation || !planningDate) return null;
    return { location: planningLocation, date: planningDate };
  }, [planningMode, planningLocation, planningDate]);

  useEffect(() => {
    setSaatPlanningContext(planningContext);
  }, [planningContext]);

  const resolvedPurpose = purposeLookup || { matched: false };
  const effectiveSelections = useMemo(() => {
    if (resolvedPurpose.matched && resolvedPurpose.ritualIntent) {
      const hasCard = Array.isArray(selections?.purposes) && selections.purposes.length > 0;
      if (!hasCard) return { ...selections, purposes: [resolvedPurpose.ritualIntent] };
    }
    return selections;
  }, [selections, resolvedPurpose]);

  const rawAnalysis = useMemo(() => {
    if (!result || resolvedPurpose.needsConfirmation) return null;
    return analyzeRitualTiming({
      result, selections: effectiveSelections, customPurpose, activeMethod,
      astroClockKnowledge, purposeLookup: resolvedPurpose, planningContext,
    });
  }, [result, effectiveSelections, customPurpose, activeMethod, astroClockKnowledge, resolvedPurpose, planningContext]);

  // ── Purpose confirmation required ──
  if (resolvedPurpose.needsConfirmation) {
    return (
      <div className="mt-6 rounded-2xl p-6" style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: "1px solid rgba(251,191,36,0.40)",
      }}>
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: "#FBBF24" }} />
          <h3 className="font-inter text-base font-bold" style={{ color: "#FBBF24" }}>
            {T("Purpose requires confirmation", "ലക്ഷ്യം സ്ഥിരീകരിക്കേണ്ടതുണ്ട്", lang)}
          </h3>
        </div>
        <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.60)" }}>
          {T(
            "Please select the intended meaning in the Purpose card above.",
            "ദയവായി ലക്ഷ്യ കാർഡിൽ ശരിയായ അർത്ഥം തിരഞ്ഞെടുക്കുക.",
            lang
          )}
        </p>
      </div>
    );
  }

  // ── No purpose selected ──
  if (!rawAnalysis || rawAnalysis.noPurposeSelected) {
    return (
      <div className="mt-6 rounded-2xl p-6" style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: "1px solid rgba(251,191,36,0.40)",
      }}>
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-5 h-5 flex-shrink-0" style={{ color: "#FBBF24" }} />
          <h3 className="font-inter text-base font-bold" style={{ color: "#FBBF24" }}>
            {T("Select a Ritual Purpose", "ലക്ഷ്യം തിരഞ്ഞെടുക്കുക", lang)}
          </h3>
        </div>
        <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.60)" }}>
          {T(
            "Please select a ritual purpose above. Ritual timing advice is unavailable until a purpose is identified.",
            "ദയവായി മുകളിൽ ഒരു ലക്ഷ്യം തിരഞ്ഞെടുക്കുക. ലക്ഷ്യം തിരഞ്ഞെടുക്കുന്നതുവരെ ആചാര സമയ ഉപദേശം ലഭ്യമല്ല.",
            lang
          )}
        </p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // EXTRACT DATA FROM THE ENGINE
  // ═══════════════════════════════════════════════════════════════
  const weekday =
    rawAnalysis.astroClockStatus?.activeWeekday ??
    DAY_NAME_TO_INDEX[rawAnalysis.astroClockStatus?.day] ??
    0;

  const sa = rawAnalysis.selectionAnalysis;
  const failedFields = (sa?.decisionBreakdown || []).filter((b) => b.status === "fail");
  const bestWindows = rawAnalysis.bestWindowsToday || [];
  const avoidWindows = rawAnalysis.avoidWindowsToday || [];
  const passedWindows = rawAnalysis.passedWindowsToday || [];
  const nextOpp = rawAnalysis.nextOpportunity;
  const purposeText =
    (lang === "ml" ? resolvedPurpose.interpretation_ml : resolvedPurpose.interpretation_en) ||
    rawAnalysis.ritualType ||
    "";

  // Can perform today?
  const canPerform = rawAnalysis.canPerformToday;
  const canPerformColor = canPerform === "Yes" ? "#4ADE80" : canPerform === "Limited" ? "#FBBF24" : "#F87171";
  const CanPerformIcon = canPerform === "Yes" ? CheckCircle2 : canPerform === "Limited" ? AlertCircle : XCircle;
  const canPerformLabel =
    canPerform === "Yes" ? T("Yes", "അതെ", lang)
    : canPerform === "Limited" ? T("Limited", "പരിമിതം", lang)
    : T("No", "ഇല്ല", lang);

  // Main explanation — ALWAYS original Malayalam from the Astro Clock context record.
  // Suitable verdict → recommended_actions.ml; Forbidden/Not-Suitable → forbidden_actions.ml.
  // Plus knowledge_text_ml and warnings_list.ml. No English fallback. No generation.
  const mainExplanation = (() => {
    if (!sa) return "";
    const parts = [];
    if (sa.originalExplanationMl && sa.originalExplanationMl.trim()) parts.push(sa.originalExplanationMl.trim());
    const recMl = actionsMl(sa.originalRecommended);
    const forbMl = actionsMl(sa.originalForbidden);
    const enemyMl = actionsMl(sa.contextRecord?.enemy_actions);
    const warnMl = actionsMl(sa.originalWarnings);
    if (sa.forbidden) {
      if (forbMl) parts.push(forbMl);
      if (enemyMl) parts.push(enemyMl);
    } else if (sa.suitable) {
      if (recMl) parts.push(recMl);
    } else {
      if (forbMl) parts.push(forbMl);
      if (recMl) parts.push(recMl);
    }
    if (warnMl) parts.push(warnMl);
    return parts.join("\n");
  })();

  // ── Better recommendations from the engine's bestAlternative ──
  // The engine marks suboptimal fields as "neutral" (not "fail") in the
  // decisionBreakdown, so filtering by status==="fail" misses real
  // recommendations. Use bestAlternative.changes instead — it contains
  // exactly the fields that need changing ("Day", "Saat", "Layl/Nahar").
  const bestAlt = sa?.bestAlternative || null;
  const altHasDay = bestAlt?.changes?.includes("Day") && !!bestAlt?.day;
  const altHasSaat = bestAlt?.changes?.includes("Saat") && !!bestAlt?.hour;
  const altHasLayl = bestAlt?.changes?.includes("Layl/Nahar") && !!bestAlt?.dayNight;

  return (
    <div className="mt-6 space-y-4">
      {/* ═══ PLANNING MODE (optional) ═══ */}
      <PlanningModePanel
        enabled={planningMode}
        onToggle={setPlanningMode}
        location={planningLocation}
        onLocationChange={setPlanningLocation}
        date={planningDate}
        onDateChange={setPlanningDate}
        lang={lang}
      />

      {/* ═══════════════════════════════════════════════════════════════
          MAIN ADVISOR CARD
         ═══════════════════════════════════════════════════════════════ */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: `1px solid ${G.border}`,
        boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)",
      }}>
        {/* ── Header ── */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
              background: G.bgHi, border: `1px solid ${G.borderHi}`,
            }}>
              <Sparkles className="w-5 h-5" style={{ color: G.text }} />
            </div>
            <div>
              <h3 className="font-inter text-sm font-bold" style={{ color: "#fff" }}>
                {T("Ritual Timing Advisor", "ആചാര സമയ ഉപദേഷ്ടാവ്", lang)}
              </h3>
              <p className="font-amiri text-xs" style={{ color: G.dim }}>مستشار توقيت العمل</p>
            </div>
          </div>
          <button
            onClick={() => setLang(lang === "en" ? "ml" : "en")}
            className="font-inter text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: G.bg, border: `1px solid ${G.border}`, color: G.dim }}
          >
            {lang === "ml" ? "English" : "മലയാളം"}
          </button>
        </div>

        <div className="p-4 space-y-4">

          {/* ══ 1. PURPOSE ══ */}
          <div className="rounded-xl p-3" style={{
            background: "linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 100%)",
            border: `1px solid ${G.border}`,
          }}>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4" style={{ color: G.text }} />
              <span className="font-inter text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: G.text }}>
                {T("Purpose", "ലക്ഷ്യം", lang)}
              </span>
            </div>
            <p className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
              {purposeText}
            </p>
          </div>

          {/* ══ 2. IS TODAY SUITABLE? ══ */}
          <div className="rounded-xl p-4" style={{
            background: `${canPerformColor}08`,
            border: `1px solid ${canPerformColor}30`,
          }}>
            <div className="flex items-center gap-3 mb-2">
              <CanPerformIcon className="w-5 h-5 flex-shrink-0" style={{ color: canPerformColor }} />
              <h4 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
                {T("Can this ritual be performed today?", "ഇന്ന് ഈ കർമ്മം അനുഷ്ഠിക്കാമോ?", lang)}
              </h4>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: canPerformColor }} />
              <span className="font-inter text-base font-bold" style={{ color: canPerformColor }}>
                {canPerformLabel}
              </span>
            </div>
            {mainExplanation && (
              <div className="rounded-lg p-3" style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(212,175,55,0.15)",
              }}>
                <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"} style={{ color: "rgba(255,255,255,0.70)" }}>
                  {mainExplanation}
                </p>
              </div>
            )}
          </div>

          {/* ══ 3. BETTER FIELDS — Better Day, Better Saat, Better Layl/Nahar ══ */}
          {bestAlt && bestAlt.changes?.length > 0 && (
            <div className="space-y-2">
              {altHasDay && (
                <BetterFieldCard
                  icon={<Clock className="w-4 h-4" />}
                  label={T("Better Day", "മികച്ച ദിവസം", lang)}
                  value={translateDayRec(bestAlt.day, lang)}
                  reason=""
                  lang={lang}
                />
              )}
              {altHasSaat && (
                <BetterFieldCard
                  icon={<Clock className="w-4 h-4" />}
                  label={T("Better Saat", "മികച്ച സഅാത്", lang)}
                  value={translateHourRec(bestAlt.hour, lang)}
                  reason=""
                  lang={lang}
                />
              )}
              {altHasLayl && (
                <BetterFieldCard
                  icon={<Sunset className="w-4 h-4" />}
                  label={T("Better Layl/Nahar", "മികച്ച ലൈൽ/നഹർ", lang)}
                  value={translateLaylRec(bestAlt.dayNight, lang)}
                  reason=""
                  lang={lang}
                />
              )}
            </div>
          )}

          {/* ══ 4. TODAY'S AVAILABLE TIMES ══ */}
          <div className="rounded-xl p-4" style={{
            background: "rgba(74,222,128,0.04)",
            border: "1px solid rgba(74,222,128,0.20)",
          }}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4" style={{ color: "#4ADE80" }} />
              <h4 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#4ADE80" }}>
                {T("Today's Available Times", "ഇന്നത്തെ ലഭ്യമായ സമയങ്ങൾ", lang)}
              </h4>
            </div>

            {bestWindows.length > 0 ? (
              <>
                <p className={lang === "ml" ? "font-malayalam text-xs mb-3" : "font-inter text-xs mb-3"} style={{ color: "rgba(255,255,255,0.60)" }}>
                  {T("You can perform this ritual today during:", "ഈ കർമ്മം ഇന്ന് അനുഷ്ഠിക്കാം:", lang)}
                </p>
                <div className="space-y-2">
                  {bestWindows.map((w, i) => {
                    const saatNum = saatDisplayNum(w.hourNumber, w.period);
                    const record = lookupAstroRecord(astroClockKnowledge, weekday, w.period, w.hourNumber, w.planet);
                    const explanation = getRecordExplanation(record);
                    return (
                      <SaatCard
                        key={i}
                        saatNum={saatNum}
                        startTime={w.startTime}
                        endTime={w.endTime}
                        planet={w.planet}
                        period={w.period}
                        explanation={explanation}
                        color="#4ADE80"
                        lang={lang}
                      />
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {/* ══ 5. NO SUITABLE TIMES TODAY + NEXT AVAILABLE ══ */}
                <p className={lang === "ml" ? "font-malayalam text-sm font-bold mb-3" : "font-inter text-sm font-bold mb-3"} style={{ color: "#F87171" }}>
                  {T("There are no suitable timings remaining today.", "ഇന്ന് അനുയോജ്യമായ സമയങ്ങളൊന്നുമില്ല.", lang)}
                </p>
                {nextOpp && (
                  <NextTimingCard nextOpp={nextOpp} astroClockKnowledge={astroClockKnowledge} lang={lang} />
                )}
              </>
            )}
          </div>

          {/* ══ 5b. PASSED SUITABLE TIMES ══ */}
          {passedWindows.length > 0 && (
            <div className="rounded-xl p-4" style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4" style={{ color: "rgba(255,255,255,0.40)" }} />
                <h4 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "rgba(255,255,255,0.55)" }}>
                  {T("Passed Suitable Times", "കഴിഞ്ഞ അനുയോജ്യ സമയങ്ങൾ", lang)}
                </h4>
              </div>
              <p className={lang === "ml" ? "font-malayalam text-xs mb-3" : "font-inter text-xs mb-3"} style={{ color: "rgba(255,255,255,0.40)" }}>
                {T("These suitable times have already passed today:", "ഈ അനുയോജ്യ സമയങ്ങൾ ഇന്ന് കഴിഞ്ഞു:", lang)}
              </p>
              <div className="space-y-2">
                {passedWindows.map((w, i) => {
                  const saatNum = saatDisplayNum(w.hourNumber, w.period);
                  const record = lookupAstroRecord(astroClockKnowledge, weekday, w.period, w.hourNumber, w.planet);
                  const explanation = getRecordExplanation(record);
                  return (
                    <SaatCard
                      key={i}
                      saatNum={saatNum}
                      startTime={w.startTime}
                      endTime={w.endTime}
                      planet={w.planet}
                      period={w.period}
                      explanation={explanation}
                      color="rgba(255,255,255,0.40)"
                      lang={lang}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ 6. TIMES TO AVOID TODAY ══ */}
          {avoidWindows.length > 0 && (
            <div className="rounded-xl p-4" style={{
              background: "rgba(248,113,113,0.04)",
              border: "1px solid rgba(248,113,113,0.20)",
            }}>
              <div className="flex items-center gap-2 mb-3">
                <Ban className="w-4 h-4" style={{ color: "#F87171" }} />
                <h4 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#F87171" }}>
                  {T("Times to Avoid Today", "ഇന്ന് ഒഴിവാക്കേണ്ട സമയങ്ങൾ", lang)}
                </h4>
              </div>
              <p className={lang === "ml" ? "font-malayalam text-xs mb-3" : "font-inter text-xs mb-3"} style={{ color: "rgba(255,255,255,0.60)" }}>
                {T("Avoid:", "ഒഴിവാക്കുക:", lang)}
              </p>
              <div className="space-y-2">
                {avoidWindows.map((w, i) => {
                  const saatNum = saatDisplayNum(w.hourNumber, w.period || (w.startTime ? "day" : "day"));
                  const record = lookupAstroRecord(astroClockKnowledge, weekday, w.period || "day", w.hourNumber, w.planet);
                  const explanation = getForbiddenExplanation(record);
                  return (
                    <SaatCard
                      key={i}
                      saatNum={saatNum}
                      startTime={w.startTime}
                      endTime={w.endTime}
                      planet={w.planet}
                      period={w.period}
                      explanation={explanation}
                      color="#F87171"
                      showReasonLabel
                      lang={lang}
                    />
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ═══ MOON ANALYSIS (optional, separate) ═══ */}
      <MoonAnalysisCard
        moonPhase={rawAnalysis?.moonPhase}
        moonReq={rawAnalysis?.moonReq}
        moonCitations={rawAnalysis?.moonCitations}
        req={rawAnalysis?.req}
        lang={lang}
        planningDate={planningContext?.date || null}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ── Better Field Card — shows a failed field with its better value + reason ──
function BetterFieldCard({ icon, label, value, reason, lang }) {
  return (
    <div className="rounded-xl p-3" style={{
      background: "rgba(251,191,36,0.06)",
      border: "1px solid rgba(251,191,36,0.25)",
    }}>
      <div className="flex items-center gap-2 mb-1">
        <div style={{ color: "#FBBF24" }}>{icon}</div>
        <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#FBBF24" }}>
          {label}
        </span>
      </div>
      {value && (
        <p className="font-inter text-sm font-bold mb-1" style={{ color: "#fff" }}>{value}</p>
      )}
      {reason && (
        <div className="mt-1 rounded-lg p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"} style={{ color: "rgba(255,255,255,0.65)" }}>
            <span className="font-bold" style={{ color: "rgba(251,191,36,0.80)" }}>
              {lang === "ml" ? "കാരണം: " : "Reason: "}
            </span>
            {reason}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Saat Card — a single Saat with its time, planet, and explanation ──
function SaatCard({ saatNum, startTime, endTime, planet, period, explanation, color, showReasonLabel, lang }) {
  const periodLabel = period === "night"
    ? T("Night", "രാത്രി", lang)
    : period === "day"
    ? T("Day", "പകൽ", lang)
    : "";

  return (
    <div className="rounded-lg p-3" style={{
      background: `${color}0A`,
      border: `1px solid ${color}33`,
    }}>
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className="font-inter text-sm font-bold" style={{ color }}>
          {saatNum}{ordinal(saatNum, lang)} {T("Saat", "സഅാത്", lang)}
        </span>
        <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.40)" }}>
          {startTime}–{endTime} · {tPlanet(planet, lang)}{periodLabel ? ` · ${periodLabel}` : ""}
        </span>
      </div>
      {explanation && (
        <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"} style={{ color: "rgba(255,255,255,0.65)" }}>
          {showReasonLabel && (
            <span className="font-bold" style={{ color: `${color}cc` }}>
              {lang === "ml" ? "കാരണം: " : "Reason: "}
            </span>
          )}
          {explanation}
        </p>
      )}
    </div>
  );
}

// ── Next Timing Card — shows the next available timing with explanation ──
function NextTimingCard({ nextOpp, astroClockKnowledge, lang }) {
  const oppWeekday = DAY_NAME_TO_INDEX[nextOpp.dayName] ?? 0;
  const oppSaatNum = saatDisplayNum(nextOpp.hour, nextOpp.period);
  const record = lookupAstroRecord(
    astroClockKnowledge,
    oppWeekday,
    nextOpp.period,
    nextOpp.hour,
    nextOpp.planet
  );
  const explanation = getRecordExplanation(record);
  const periodLabel = nextOpp.period === "night"
    ? T("Night", "രാത്രി", lang)
    : T("Day", "പകൽ", lang);

  return (
    <div className="rounded-lg p-3" style={{
      background: "rgba(212,175,55,0.06)",
      border: "1px solid rgba(212,175,55,0.25)",
    }}>
      <div className="flex items-center gap-2 mb-2">
        <Sunset className="w-4 h-4" style={{ color: G.text }} />
        <span className="font-inter text-xs font-bold uppercase tracking-wider" style={{ color: G.text }}>
          {T("Next Available Timing", "അടുത്ത ലഭ്യമായ സമയം", lang)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>
            {T("Day", "ദിവസം", lang)}
          </p>
          <p className="font-inter text-sm font-bold" style={{ color: G.text }}>
            {tDay(nextOpp.dayName, lang)}
            {!nextOpp.isToday && (
              <span className="font-inter text-[10px] ml-1" style={{ color: G.dim }}>
                ({nextOpp.daysAhead} {T("days away", "ദിവസം അകലെ", lang)})
              </span>
            )}
          </p>
        </div>
        <div>
          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>
            {T("Saat", "സഅാത്", lang)}
          </p>
          <p className="font-inter text-sm font-bold" style={{ color: G.text }}>
            {oppSaatNum}{ordinal(oppSaatNum, lang)} {T("Saat", "സഅാത്", lang)}
          </p>
        </div>
        <div>
          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>
            {T("Layl/Nahar", "ലൈൽ/നഹർ", lang)}
          </p>
          <p className="font-inter text-sm font-bold" style={{ color: G.text }}>{periodLabel}</p>
        </div>
        <div>
          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>
            {T("Time", "സമയം", lang)}
          </p>
          <p className="font-inter text-sm font-bold" style={{ color: G.text }}>
            {nextOpp.startTime}–{nextOpp.endTime}
          </p>
        </div>
      </div>
      {explanation && (
        <div className="mt-2 rounded-lg p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"} style={{ color: "rgba(255,255,255,0.65)" }}>
            <span className="font-bold" style={{ color: "rgba(212,175,55,0.80)" }}>
              {lang === "ml" ? "കാരണം: " : "Reason: "}
            </span>
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}