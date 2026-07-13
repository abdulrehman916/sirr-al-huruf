// ═══════════════════════════════════════════════════════════════
// RITUAL TIMING DECISION ENGINE
// ═══════════════════════════════════════════════════════════════
// An intelligent decision engine that analyzes ALL Astro Clock
// and Manuscript data for the selected Purpose and produces a
// complete decision with explicit rule references.
//
// SECTIONS:
//   1. TODAY'S VERDICT — Yes/Partial/No + matching + conflicting rules
//   2. CURRENT TIME ANALYSIS — Is current Saat suitable? rejection reasons
//   3. BETTER ALTERNATIVES — Better Saats with WHY, next Layl/Nahar, next Day
//
// Every conclusion references the specific database rule that caused it.
// Never invents reasons. Never displays raw text without analysis.
// ═══════════════════════════════════════════════════════════════
import { useState, useMemo, useEffect } from "react";
import {
  Target, CheckCircle2, XCircle, AlertCircle, Clock, Sunset,
  Sparkles, AlertTriangle, Shield, Swords, Calendar,
} from "lucide-react";
import { analyzeRitualTiming } from "../../lib/ritualTimingEngineV3";
import PlanningModePanel from "./PlanningModePanel";
import MoonAnalysisCard from "./MoonAnalysisCard";
import { setSaatPlanningContext } from "../../lib/mizaanSaatCalculator";
import { useRitualLang } from "../../lib/ritualTimingI18n";
import { useAstroClockKnowledgeAll } from "../../hooks/useAstroClockKnowledgeAll";
import { useManuscriptRules } from "../../hooks/useManuscriptRules";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

const T = (en, ml, lang) => (lang === "ml" ? ml : en);

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

function translatePlanet(name, lang) {
  if (!name) return "";
  return ML_PLANET[name] || ML_PLANET[String(name).toLowerCase()] || name;
}

function translateDay(name, lang) {
  if (!name) return "";
  return ML_DAY[name] || name;
}

export default function RitualDecisionEngine({
  result, selections, customPurpose, activeMethod, purposeLookup,
}) {
  const [lang, setLang] = useRitualLang();
  const { astroClockKnowledge } = useAstroClockKnowledgeAll();
  const { manuscriptRules } = useManuscriptRules();

  // ── Planning Mode ──
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
      const hasCard =
        Array.isArray(selections?.purposes) && selections.purposes.length > 0;
      if (!hasCard)
        return { ...selections, purposes: [resolvedPurpose.ritualIntent] };
    }
    return selections;
  }, [selections, resolvedPurpose]);

  const rawAnalysis = useMemo(() => {
    if (!result || resolvedPurpose.needsConfirmation) return null;
    return analyzeRitualTiming({
      result,
      selections: effectiveSelections,
      customPurpose,
      activeMethod,
      astroClockKnowledge,
      manuscriptRules,
      purposeLookup: resolvedPurpose,
      planningContext,
    });
  }, [
    result,
    effectiveSelections,
    customPurpose,
    activeMethod,
    astroClockKnowledge,
    manuscriptRules,
    resolvedPurpose,
    planningContext,
  ]);

  // ── Purpose confirmation required ──
  if (resolvedPurpose.needsConfirmation) {
    return (
      <div
        className="mt-6 rounded-2xl p-6"
        style={{
          background:
            "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
          border: "1px solid rgba(251,191,36,0.40)",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle
            className="w-5 h-5 flex-shrink-0"
            style={{ color: "#FBBF24" }}
          />
          <h3
            className="font-inter text-base font-bold"
            style={{ color: "#FBBF24" }}
          >
            {T(
              "Purpose requires confirmation",
              "ലക്ഷ്യം സ്ഥിരീകരിക്കേണ്ടതുണ്ട്",
              lang
            )}
          </h3>
        </div>
        <p
          className="font-inter text-sm"
          style={{ color: "rgba(255,255,255,0.60)" }}
        >
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
      <div
        className="mt-6 rounded-2xl p-6"
        style={{
          background:
            "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
          border: "1px solid rgba(251,191,36,0.40)",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Target
            className="w-5 h-5 flex-shrink-0"
            style={{ color: "#FBBF24" }}
          />
          <h3
            className="font-inter text-base font-bold"
            style={{ color: "#FBBF24" }}
          >
            {T("Select a Ritual Purpose", "ലക്ഷ്യം തിരഞ്ഞെടുക്കുക", lang)}
          </h3>
        </div>
        <p
          className="font-inter text-sm"
          style={{ color: "rgba(255,255,255,0.60)" }}
        >
          {T(
            "Please select a ritual purpose above. The decision engine cannot analyze without a purpose.",
            "ദയവായി മുകളിൽ ഒരു ലക്ഷ്യം തിരഞ്ഞെടുക്കുക. ലക്ഷ്യം ഇല്ലാതെ തീരുമാന എഞ്ചിൻ വിശകലനം ചെയ്യാൻ കഴിയില്ല.",
            lang
          )}
        </p>
      </div>
    );
  }

  // ═══ EXTRACT DECISION DATA ═══
  const matchingRules = rawAnalysis.matchingRules || [];
  const conflictingRules = rawAnalysis.conflictingRules || [];
  const currentSaatAnalysis = rawAnalysis.currentSaatAnalysis || {
    suitable: false,
    rejectionReasons: [],
    acceptanceReasons: [],
  };
  const betterAlternatives = rawAnalysis.betterAlternatives || {
    betterSaats: [],
    nextLayl: null,
    nextDay: null,
  };

  const verdict =
    rawAnalysis.canPerformToday === "Yes"
      ? "YES"
      : rawAnalysis.canPerformToday === "Limited"
      ? "PARTIAL"
      : "NO";
  const verdictColor =
    verdict === "YES" ? "#4ADE80" : verdict === "PARTIAL" ? "#FBBF24" : "#F87171";
  const VerdictIcon =
    verdict === "YES"
      ? CheckCircle2
      : verdict === "PARTIAL"
      ? AlertCircle
      : XCircle;
  const verdictLabel =
    verdict === "YES"
      ? T("YES", "അതെ", lang)
      : verdict === "PARTIAL"
      ? T("PARTIAL", "ഭാഗികം", lang)
      : T("NO", "ഇല്ല", lang);

  const purposeText =
    (lang === "ml"
      ? resolvedPurpose.interpretation_ml
      : resolvedPurpose.interpretation_en) || rawAnalysis.ritualType || "";

  return (
    <div className="mt-6 space-y-4">
      <PlanningModePanel
        enabled={planningMode}
        onToggle={setPlanningMode}
        location={planningLocation}
        onLocationChange={setPlanningLocation}
        date={planningDate}
        onDateChange={setPlanningDate}
        lang={lang}
      />

      {/* ═══════════════════════════════════════════════════════════
          1. TODAY'S VERDICT
         ═══════════════════════════════════════════════════════════ */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
          border: `1px solid ${G.border}`,
          boxShadow:
            "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: `1px solid ${G.border}` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: G.bgHi,
                border: `1px solid ${G.borderHi}`,
              }}
            >
              <Sparkles className="w-5 h-5" style={{ color: G.text }} />
            </div>
            <div>
              <h3
                className="font-inter text-sm font-bold"
                style={{ color: "#fff" }}
              >
                {T(
                  "Ritual Timing Decision Engine",
                  "ആചാര സമയ തീരുമാന എഞ്ചിൻ",
                  lang
                )}
              </h3>
              <p className="font-amiri text-xs" style={{ color: G.dim }}>
                مستشار توقيت العمل
              </p>
            </div>
          </div>
          <button
            onClick={() => setLang(lang === "en" ? "ml" : "en")}
            className="font-inter text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg transition-opacity hover:opacity-80"
            style={{
              background: G.bg,
              border: `1px solid ${G.border}`,
              color: G.dim,
            }}
          >
            {lang === "ml" ? "English" : "മലയാളം"}
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Purpose */}
          <div
            className="rounded-xl p-3"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 100%)",
              border: `1px solid ${G.border}`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4" style={{ color: G.text }} />
              <span
                className="font-inter text-[10px] uppercase tracking-[0.2em] font-bold"
                style={{ color: G.text }}
              >
                {T("Purpose", "ലക്ഷ്യം", lang)}
              </span>
            </div>
            <p
              className={
                lang === "ml"
                  ? "font-malayalam text-sm font-bold"
                  : "font-inter text-sm font-bold"
              }
              style={{ color: "#fff" }}
            >
              {purposeText}
            </p>
          </div>

          {/* Verdict */}
          <div
            className="rounded-xl p-4"
            style={{
              background: `${verdictColor}08`,
              border: `1px solid ${verdictColor}30`,
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <VerdictIcon
                className="w-6 h-6 flex-shrink-0"
                style={{ color: verdictColor }}
              />
              <h4
                className={
                  lang === "ml"
                    ? "font-malayalam text-base font-bold"
                    : "font-inter text-base font-bold"
                }
                style={{ color: "#fff" }}
              >
                {T("TODAY'S VERDICT", "ഇന്നത്തെ വിധിനിർണ്ണം", lang)}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="px-4 py-1.5 rounded-lg"
                style={{
                  background: `${verdictColor}20`,
                  border: `1px solid ${verdictColor}50`,
                }}
              >
                <span
                  className="font-inter text-lg font-bold"
                  style={{ color: verdictColor }}
                >
                  {verdictLabel}
                </span>
              </div>
              <span
                className={
                  lang === "ml"
                    ? "font-malayalam text-xs"
                    : "font-inter text-xs"
                }
                style={{ color: "rgba(255,255,255,0.60)" }}
              >
                {verdict === "YES"
                  ? T(
                      "Today is suitable for this purpose.",
                      "ഈ ലക്ഷ്യത്തിന് ഇന്ന് അനുയോജ്യമാണ്.",
                      lang
                    )
                  : verdict === "PARTIAL"
                  ? T(
                      "Partially suitable — some conditions met.",
                      "ഭാഗികമായി അനുയോജ്യം — ചില നിബന്ധനകൾ പാലിക്കപ്പെട്ടു.",
                      lang
                    )
                  : T(
                      "Today is not suitable for this purpose.",
                      "ഈ ലക്ഷ്യത്തിന് ഇന്ന് അനുയോജ്യമല്ല.",
                      lang
                    )}
              </span>
            </div>
          </div>

          {/* Supported Reasons */}
          {matchingRules.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4" style={{ color: "#4ADE80" }} />
                <h4
                  className={
                    lang === "ml"
                      ? "font-malayalam text-sm font-bold"
                      : "font-inter text-sm font-bold"
                  }
                  style={{ color: "#4ADE80" }}
                >
                  {T("SUPPORTED REASONS", "പിന്തുണയ്ക്കുന്ന കാരണങ്ങൾ", lang)}
                </h4>
              </div>
              <div className="space-y-2">
                {matchingRules.map((rule, i) => (
                  <RuleCard key={i} rule={rule} type="matching" lang={lang} />
                ))}
              </div>
            </div>
          )}

          {/* Rejection Reasons */}
          {conflictingRules.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Swords className="w-4 h-4" style={{ color: "#F87171" }} />
                <h4
                  className={
                    lang === "ml"
                      ? "font-malayalam text-sm font-bold"
                      : "font-inter text-sm font-bold"
                  }
                  style={{ color: "#F87171" }}
                >
                  {T("REJECTION REASONS", "നിരസന കാരണങ്ങൾ", lang)}
                </h4>
              </div>
              <div className="space-y-2">
                {conflictingRules.map((rule, i) => (
                  <RuleCard key={i} rule={rule} type="conflicting" lang={lang} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          2. CURRENT TIME ANALYSIS
         ═══════════════════════════════════════════════════════════ */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
          border: `1px solid ${G.border}`,
          boxShadow:
            "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)",
        }}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5" style={{ color: G.text }} />
            <h4
              className={
                lang === "ml"
                  ? "font-malayalam text-sm font-bold"
                  : "font-inter text-sm font-bold"
              }
              style={{ color: "#fff" }}
            >
              {T(
                "CURRENT TIME ANALYSIS",
                "നിലവിലെ സമയ വിശകലനം",
                lang
              )}
            </h4>
          </div>

          {/* Is current Saat suitable? */}
          <div
            className="rounded-xl p-3"
            style={{
              background: currentSaatAnalysis.suitable
                ? "rgba(74,222,128,0.06)"
                : "rgba(248,113,113,0.06)",
              border: `1px solid ${
                currentSaatAnalysis.suitable
                  ? "rgba(74,222,128,0.25)"
                  : "rgba(248,113,113,0.25)"
              }`,
            }}
          >
            <div className="flex items-center gap-2">
              {currentSaatAnalysis.suitable ? (
                <CheckCircle2
                  className="w-5 h-5"
                  style={{ color: "#4ADE80" }}
                />
              ) : (
                <XCircle
                  className="w-5 h-5"
                  style={{ color: "#F87171" }}
                />
              )}
              <span
                className="font-inter text-sm font-bold"
                style={{
                  color: currentSaatAnalysis.suitable
                    ? "#4ADE80"
                    : "#F87171",
                }}
              >
                {currentSaatAnalysis.suitable
                  ? T(
                      "Current Saat is SUITABLE",
                      "നിലവിലെ സഅാത് അനുയോജ്യമാണ്"
                    )
                  : T(
                      "Current Saat is NOT SUITABLE",
                      "നിലവിലെ സഅാത് അനുയോജ്യമല്ല"
                    )}
              </span>
            </div>
          </div>

          {/* Rejection Reasons */}
          {currentSaatAnalysis.rejectionReasons &&
            currentSaatAnalysis.rejectionReasons.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle
                    className="w-4 h-4"
                    style={{ color: "#F87171" }}
                  />
                  <h5
                    className={
                      lang === "ml"
                        ? "font-malayalam text-xs font-bold"
                        : "font-inter text-xs font-bold"
                    }
                    style={{ color: "#F87171" }}
                  >
                    {T(
                      "REJECTION REASONS",
                      "നിരസന കാരണങ്ങൾ",
                      lang
                    )}
                  </h5>
                </div>
                <div className="space-y-2">
                  {currentSaatAnalysis.rejectionReasons.map((reason, i) => (
                    <ReasonCard
                      key={i}
                      reason={reason}
                      type="rejection"
                      lang={lang}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* Acceptance Reasons */}
          {currentSaatAnalysis.acceptanceReasons &&
            currentSaatAnalysis.acceptanceReasons.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2
                    className="w-4 h-4"
                    style={{ color: "#4ADE80" }}
                  />
                  <h5
                    className={
                      lang === "ml"
                        ? "font-malayalam text-xs font-bold"
                        : "font-inter text-xs font-bold"
                    }
                    style={{ color: "#4ADE80" }}
                  >
                    {T(
                      "ACCEPTANCE REASONS",
                      "അംഗീകാര കാരണങ്ങൾ",
                      lang
                    )}
                  </h5>
                </div>
                <div className="space-y-2">
                  {currentSaatAnalysis.acceptanceReasons.map((reason, i) => (
                    <ReasonCard
                      key={i}
                      reason={reason}
                      type="acceptance"
                      lang={lang}
                    />
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          3. BETTER ALTERNATIVES
         ═══════════════════════════════════════════════════════════ */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
          border: `1px solid ${G.border}`,
          boxShadow:
            "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)",
        }}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sunset className="w-5 h-5" style={{ color: G.text }} />
            <h4
              className={
                lang === "ml"
                  ? "font-malayalam text-sm font-bold"
                  : "font-inter text-sm font-bold"
              }
              style={{ color: "#fff" }}
            >
              {T("BETTER ALTERNATIVES", "മികച്ച ബദലുകൾ", lang)}
            </h4>
          </div>

          {/* Better Saats Today */}
          {betterAlternatives.betterSaats &&
          betterAlternatives.betterSaats.length > 0 ? (
            <div>
              <p
                className={
                  lang === "ml"
                    ? "font-malayalam text-xs mb-2"
                    : "font-inter text-xs mb-2"
                }
                style={{ color: "rgba(255,255,255,0.60)" }}
              >
                {T(
                  "Better Saats remaining today:",
                  "ഇന്ന് ലഭ്യമായ മികച്ച സഅാതുകൾ:",
                  lang
                )}
              </p>
              <div className="space-y-3">
                {betterAlternatives.betterSaats.map((saat, i) => (
                  <BetterSaatCard key={i} saat={saat} lang={lang} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* No better saats today — Next Layl/Nahar */}
              {betterAlternatives.nextLayl ? (
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(212,175,55,0.06)",
                    border: "1px solid rgba(212,175,55,0.25)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sunset
                      className="w-4 h-4"
                      style={{ color: G.text }}
                    />
                    <h5
                      className={
                        lang === "ml"
                          ? "font-malayalam text-xs font-bold"
                          : "font-inter text-xs font-bold"
                      }
                      style={{ color: G.text }}
                    >
                      {T("NEXT LAYL / NAHAR", "അടുത്ത ലൈൽ / നഹർ", lang)}
                    </h5>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p
                        className="font-inter text-[9px] uppercase tracking-wider"
                        style={{ color: G.dim }}
                      >
                        {T("Day", "ദിവസം", lang)}
                      </p>
                      <p
                        className="font-inter text-sm font-bold"
                        style={{ color: G.text }}
                      >
                        {translateDay(
                          betterAlternatives.nextLayl.dayName,
                          lang
                        )}
                        {!betterAlternatives.nextLayl.isToday && (
                          <span
                            className="font-inter text-[10px] ml-1"
                            style={{ color: G.dim }}
                          >
                            ({betterAlternatives.nextLayl.daysAhead}{" "}
                            {T("days away", "ദിവസം അകലെ", lang)})
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p
                        className="font-inter text-[9px] uppercase tracking-wider"
                        style={{ color: G.dim }}
                      >
                        {T("Saat", "സഅാത്", lang)}
                      </p>
                      <p
                        className="font-inter text-sm font-bold"
                        style={{ color: G.text }}
                      >
                        #{betterAlternatives.nextLayl.saatNum} (
                        {translatePlanet(
                          betterAlternatives.nextLayl.planet,
                          lang
                        )}
                        )
                      </p>
                    </div>
                    <div>
                      <p
                        className="font-inter text-[9px] uppercase tracking-wider"
                        style={{ color: G.dim }}
                      >
                        {T("Period", "മാലയാളം", lang)}
                      </p>
                      <p
                        className="font-inter text-sm font-bold"
                        style={{ color: G.text }}
                      >
                        {betterAlternatives.nextLayl.period === "night"
                          ? T("Night (Layl)", "രാത്രി (ലൈൽ)", lang)
                          : T("Day (Nahar)", "പകൽ (നഹർ)", lang)}
                      </p>
                    </div>
                    <div>
                      <p
                        className="font-inter text-[9px] uppercase tracking-wider"
                        style={{ color: G.dim }}
                      >
                        {T("Time", "സമയം", lang)}
                      </p>
                      <p
                        className="font-inter text-sm font-bold"
                        style={{ color: G.text }}
                      >
                        {betterAlternatives.nextLayl.startTime}–
                        {betterAlternatives.nextLayl.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              ) : betterAlternatives.nextDay ? (
                /* No layl/nahar — Next Weekday */
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(212,175,55,0.06)",
                    border: "1px solid rgba(212,175,55,0.25)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar
                      className="w-4 h-4"
                      style={{ color: G.text }}
                    />
                    <h5
                      className={
                        lang === "ml"
                          ? "font-malayalam text-xs font-bold"
                          : "font-inter text-xs font-bold"
                      }
                      style={{ color: G.text }}
                    >
                      {T("NEXT WEEKDAY", "അടുത്ത ദിവസം", lang)}
                    </h5>
                  </div>
                  <p
                    className="font-inter text-sm font-bold"
                    style={{ color: G.text }}
                  >
                    {translateDay(betterAlternatives.nextDay.dayName, lang)}
                    <span
                      className="font-inter text-[10px] ml-1"
                      style={{ color: G.dim }}
                    >
                      ({betterAlternatives.nextDay.daysAhead}{" "}
                      {T("days away", "ദിവസം അകലെ", lang)})
                    </span>
                  </p>
                </div>
              ) : (
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p
                    className={
                      lang === "ml"
                        ? "font-malayalam text-xs"
                        : "font-inter text-xs"
                    }
                    style={{ color: "rgba(255,255,255,0.50)" }}
                  >
                    {T(
                      "No valid opportunity found within 14 days.",
                      "14 ദിവസത്തിനുള്ളിൽ സാധുവായ അവസരങ്ങളൊന്നുമില്ല.",
                      lang
                    )}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Moon Analysis */}
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

// ── Rule Card — displays a supported or rejection reason (user-facing text only) ──
function RuleCard({ rule, type, lang }) {
  const color = type === "matching" ? "#4ADE80" : "#F87171";
  const Icon = type === "matching" ? Shield : Swords;

  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: `${color}08`,
        border: `1px solid ${color}25`,
      }}
    >
      <div className="flex items-start gap-2">
        <Icon
          className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
          style={{ color }}
        />
        <p
          className={
            lang === "ml" && rule.text_ml
              ? "font-malayalam text-xs leading-relaxed"
              : "font-inter text-xs leading-relaxed"
          }
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          {lang === "ml" && rule.text_ml ? rule.text_ml : rule.text_en}
        </p>
      </div>
    </div>
  );
}

// ── Reason Card — displays a rejection or acceptance reason ──
function ReasonCard({ reason, type, lang }) {
  const color = type === "rejection" ? "#F87171" : "#4ADE80";
  const Icon = type === "rejection" ? XCircle : CheckCircle2;

  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: `${color}08`,
        border: `1px solid ${color}25`,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
        <span
          className="font-inter text-[10px] uppercase tracking-wider font-bold"
          style={{ color }}
        >
          {reason.dimension}
        </span>
      </div>
      <p
        className={
          lang === "ml" && reason.text_ml
            ? "font-malayalam text-xs leading-relaxed mb-1"
            : "font-inter text-xs leading-relaxed mb-1"
        }
        style={{ color: "rgba(255,255,255,0.70)" }}
      >
        {lang === "ml" && reason.text_ml ? reason.text_ml : reason.text_en}
      </p>
      <div
        className="rounded p-2"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <p
          className={
            lang === "ml"
              ? "font-malayalam text-[11px] leading-relaxed"
              : "font-inter text-[11px] leading-relaxed"
          }
          style={{ color: "rgba(255,255,255,0.60)" }}
        >
          <span className="font-bold" style={{ color: `${color}cc` }}>
            {T("WHY", "കാരണം", lang)}:{" "}
          </span>
          {reason.reason}
        </p>
      </div>
    </div>
  );
}

// ── Better Saat Card — displays a better saat with WHY it is better ──
function BetterSaatCard({ saat, lang }) {
  const periodLabel =
    saat.period === "night"
      ? T("Night", "രാത്രി", lang)
      : T("Day", "പകൽ", lang);

  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: "rgba(74,222,128,0.06)",
        border: "1px solid rgba(74,222,128,0.25)",
      }}
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className="font-inter text-sm font-bold"
          style={{ color: "#4ADE80" }}
        >
          {T("Saat", "സഅാത്", lang)} #{saat.saatNum}
        </span>
        <span
          className="font-inter text-[10px]"
          style={{ color: "rgba(255,255,255,0.40)" }}
        >
          {saat.startTime}–{saat.endTime} · {saat.planet} · {periodLabel}
        </span>
      </div>
      {saat.whyBetter && saat.whyBetter.length > 0 && (
        <div className="space-y-1">
          <p
            className="font-inter text-[10px] uppercase tracking-wider font-bold"
            style={{ color: "rgba(74,222,128,0.70)" }}
          >
            {T("WHY IT IS BETTER", "എന്തുകൊണ്ട് മികച്ചത്", lang)}
          </p>
          {saat.whyBetter.map((w, i) => (
            <div
              key={i}
              className="rounded p-2"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <p
                className={
                  lang === "ml" && w.text_ml
                    ? "font-malayalam text-[11px] leading-relaxed"
                    : "font-inter text-[11px] leading-relaxed"
                }
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {w.reason}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}