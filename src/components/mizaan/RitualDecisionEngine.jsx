// ═══════════════════════════════════════════════════════════════
// RITUAL TIMING DECISION ENGINE — COMPACT 3-SECTION REPORT
// ═══════════════════════════════════════════════════════════════
// SECTIONS (compact, decision-focused):
//   1. PURPOSE — selected purpose + auto-identified type
//   2. SELECTED TIME EVALUATION — per-factor Status + Reason
//   3. ALTERNATIVE RECOMMENDATION — only if NOT suitable
//
// Language rule: Never display Turkish. Only EN or ML.
// No database IDs, no source citations, no manuscript rule lists.
// ═══════════════════════════════════════════════════════════════
import { useState, useMemo, useEffect } from "react";
import { AlertTriangle, Target, Sparkles } from "lucide-react";
import { analyzeRitualTiming } from "../../lib/ritualTimingEngineV3";
import PlanningModePanel from "./PlanningModePanel";
import { setSaatPlanningContext } from "../../lib/mizaanSaatCalculator";
import { useRitualLang } from "../../lib/ritualTimingI18n";
import { useAstroClockKnowledgeAll } from "../../hooks/useAstroClockKnowledgeAll";
import { useManuscriptRules } from "../../hooks/useManuscriptRules";

import { G, T } from "./ritual-report/shared";
import CompactPurpose from "./ritual-report/CompactPurpose";
import CompactEvaluation from "./ritual-report/CompactEvaluation";
import CompactAlternative from "./ritual-report/CompactAlternative";

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
      <div
        className="mt-6 rounded-2xl p-6"
        style={{
          background:
            "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
          border: "1px solid rgba(251,191,36,0.40)",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-5 h-5 flex-shrink-0" style={{ color: "#FBBF24" }} />
          <h3 className="font-inter text-base font-bold" style={{ color: "#FBBF24" }}>
            {T("Select a Ritual Purpose", "ലക്ഷ്യം തിരഞ്ഞെടുക്കുക", lang)}
          </h3>
        </div>
        <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.60)" }}>
          {T(
            "Please select a ritual purpose above. The decision engine cannot analyze without a purpose.",
            "ദയവായി മുകളിൽ ഒരു ലക്ഷ്യം തിരഞ്ഞെടുക്കുക. ലക്ഷ്യം ഇല്ലാതെ തീരുമാന എഞ്ചിൻ വിശകലനം ചെയ്യാൻ കഴിയില്ല.",
            lang
          )}
        </p>
      </div>
    );
  }

  // ═══ RENDER COMPLETE RESEARCH REPORT ═══
  return (
    <div className="mt-6 space-y-4">
      {/* ── Report Header ── */}
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
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}
            >
              <Sparkles className="w-5 h-5" style={{ color: G.text }} />
            </div>
            <div>
              <h3 className="font-inter text-sm font-bold" style={{ color: "#fff" }}>
                {T("Ritual Timing Advisor", "ആചാര സമയ ഉപദേഷ്ടാവു", lang)}
              </h3>
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
      </div>

      {/* ── Planning Mode Panel ── */}
      <PlanningModePanel
        enabled={planningMode}
        onToggle={setPlanningMode}
        location={planningLocation}
        onLocationChange={setPlanningLocation}
        date={planningDate}
        onDateChange={setPlanningDate}
        lang={lang}
      />

      {/* ═══ COMPACT 3-SECTION REPORT ═══ */}
      <CompactPurpose analysis={rawAnalysis} resolvedPurpose={resolvedPurpose} lang={lang} />
      <CompactEvaluation analysis={rawAnalysis} lang={lang} />
      <CompactAlternative analysis={rawAnalysis} lang={lang} />
    </div>
  );
}