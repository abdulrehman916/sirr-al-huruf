// ═══════════════════════════════════════════════════════════════
// RITUAL DECISION ENGINE — Professional Report Layout (Read-only)
// Attached below all four Mizan methods. NEVER modifies Mizan logic.
//
// UI/UX PRINCIPLES (Professional Report):
//   1. FINAL RECOMMENDATION first — always visible, top of page
//   2. Short 2–4 line summary below it (can perform / best time / reason)
//   3. Everything else collapsed by default — expand on demand
//   4. Zero repetition — each rule explained once, referenced later
//   5. Book references grouped by rule (one explanation → multiple sources)
//   6. User information separated from Technical Details
//   7. Readable in 15 seconds without scrolling
// ═══════════════════════════════════════════════════════════════
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Sparkles, BookOpen, AlertTriangle, Clock,
  Sunset, Target, CheckCircle2, Ban, Info,
} from "lucide-react";
import { analyzeRitualTiming, analyzeConfigurationAdvice } from "../../lib/ritualTimingEngineV3";
import ReportWindowsList from "./ReportWindowsList";
import ConfigurationAdvisor from "./ConfigurationAdvisor";
import ManuscriptComplianceChecklist from "./ManuscriptComplianceChecklist";
import MoonAnalysisCard from "./MoonAnalysisCard";
import PlanningModePanel from "./PlanningModePanel";
import { setSaatPlanningContext } from "../../lib/mizaanSaatCalculator";
import { localizeAnalysis, localizeAdvice, tStr, useRitualLang, tDay, tPlanet } from "../../lib/ritualTimingI18n";
import { useManuscriptRules } from "../../hooks/useManuscriptRules";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

// ── Inline bilingual helper for new section titles ──
const T = (en, ml, lang) => lang === "ml" ? ml : en;

// ── Group manuscript references by rule text — explanation once, all sources listed ──
function groupReferences(rulesApplied, bookNotes) {
  const map = new Map();
  for (const r of rulesApplied || []) {
    const text = r.desc || r.id;
    if (!map.has(text)) map.set(text, { text, sources: new Set() });
    if (r.source) map.get(text).sources.add(r.source);
  }
  for (const n of bookNotes || []) {
    const text = n.text;
    if (!map.has(text)) map.set(text, { text, sources: new Set() });
    if (n.source) map.get(text).sources.add(n.source);
  }
  return Array.from(map.values()).map(g => ({ text: g.text, sources: Array.from(g.sources) }));
}

export default function RitualDecisionEngine({ result, selections, customPurpose, activeMethod, purposeLookup }) {
  const [lang, setLang] = useRitualLang();
  const { manuscriptRules } = useManuscriptRules();

  // ── PLANNING MODE (optional) ──
  // When ON, the engine evaluates for the selected location + date instead of
  // current location + today. Uses the SAME astronomical source — no second engine.
  const [planningMode, setPlanningMode] = useState(false);
  const [planningLocation, setPlanningLocation] = useState(null);
  const [planningDate, setPlanningDate] = useState(null);
  const planningContext = useMemo(() => {
    if (!planningMode || !planningLocation || !planningDate) return null;
    return { location: planningLocation, date: planningDate };
  }, [planningMode, planningLocation, planningDate]);

  // ── Notify Mizan cards (Saat/Day/Layl-Nahar/Kawkab auto-detect) of planning context ──
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
    return analyzeRitualTiming({ result, selections: effectiveSelections, customPurpose, activeMethod, manuscriptRules, purposeLookup: resolvedPurpose, planningContext });
  }, [result, effectiveSelections, customPurpose, activeMethod, manuscriptRules, resolvedPurpose, planningContext]);

  const analysis = useMemo(() => rawAnalysis ? localizeAnalysis(rawAnalysis, lang) : null, [rawAnalysis, lang]);

  const rawAdvice = useMemo(() => {
    if (!result || resolvedPurpose.needsConfirmation) return null;
    return analyzeConfigurationAdvice({ result, selections: effectiveSelections, customPurpose, activeMethod, manuscriptRules, purposeLookup: resolvedPurpose, planningContext });
  }, [result, effectiveSelections, customPurpose, activeMethod, manuscriptRules, resolvedPurpose, planningContext]);

  const advice = useMemo(() => rawAdvice ? localizeAdvice(rawAdvice, lang) : null, [rawAdvice, lang]);

  // ── Block when purpose unconfirmed ──
  if (resolvedPurpose.needsConfirmation) {
    return (
      <div className="mt-6 rounded-2xl p-6" style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: "1px solid rgba(251,191,36,0.40)",
        boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)",
      }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{
            background: "linear-gradient(135deg, rgba(251,191,36,0.20) 0%, rgba(251,191,36,0.06) 100%)",
            border: "1px solid rgba(251,191,36,0.50)",
          }}>
            <AlertTriangle className="w-5 h-5" style={{ color: "#FBBF24" }} />
          </div>
          <div>
            <h3 className="font-inter text-base font-bold tracking-wide" style={{ color: "#FBBF24" }}>
              {lang === "ml" ? "ലക്ഷ്യം സ്ഥിരീകരിക്കേണ്ടതുണ്ട്" : "Purpose requires confirmation"}
            </h3>
            <p className="font-amiri text-sm" style={{ color: "rgba(251,191,36,0.50)" }}>يحتاج تأكيد المعنى</p>
          </div>
        </div>
        <p className="font-inter text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
          {lang === "ml"
            ? "ദയവായി ലക്ഷ്യ വ്യാഖ്യാന കാർഡിൽ ശരിയായ അർത്ഥം തിരഞ്ഞെടുക്കുക. സ്ഥിരീകരിക്കുന്നതുവരെ ആചാര സമയ നിർദ്ദേശങ്ങൾ ലഭ്യമല്ല."
            : "Please select the intended meaning in the Purpose Interpretation card above. Ritual timing recommendations are unavailable until the purpose is confirmed."}
        </p>
      </div>
    );
  }

  if (!analysis || !analysis.report) return null;

  const canPerformColor = rawAnalysis.canPerformToday === "Yes" ? "#4ADE80" : rawAnalysis.canPerformToday === "Limited" ? "#FBBF24" : "#F87171";
  const canPerformLabel = rawAnalysis.canPerformToday === "Yes"
    ? T("Yes — proceed now", "അതെ — ഇപ്പോൾ തന്നെ", lang)
    : rawAnalysis.canPerformToday === "Limited"
      ? T("Limited — proceed with caution", "പരിമിതം — ശ്രദ്ധിച്ചു തുടരുക", lang)
      : T("No — see alternative time", "ഇല്ല — ബദൽ സമയം കാണുക", lang);

  // Extract data from report sections
  const windowsSection = analysis.report.find(s => s.windows);
  const avoidSection = analysis.report.find(s => s.avoid);

  // Group manuscript references — each rule once, all sources listed
  const groupedRefs = groupReferences(analysis.rulesApplied, analysis.bookNotes);

  // Summary data
  const bestWindow = analysis.bestWindowsToday?.[0];
  const bestTimeStr = bestWindow
    ? `${bestWindow.startTime}–${bestWindow.endTime} (${bestWindow.planet})`
    : rawAnalysis.nextOpportunity
      ? `${rawAnalysis.nextOpportunity.dayName} ${rawAnalysis.nextOpportunity.startTime}`
      : T("No valid time in 14 days", "14 ദിവസത്തിനുള്ളിൽ സമയമില്ല", lang);

  const shortReason = rawAnalysis.canPerformToday === "Yes"
    ? T("All manuscript conditions satisfied", "എല്ലാ ഗ്രന്ഥ നിബന്ധനകളും പാലിച്ചിരിക്കുന്നു", lang)
    : rawAnalysis.canPerformToday === "Limited"
      ? T("Some valid hours remain today", "ചില അനുയോജ്യ സമയങ്ങൾ ഇന്ന് ബാക്കിയുണ്ട്", lang)
      : T("Manuscript conditions not met today", "ഇന്ന് ഗ്രന്ഥ നിബന്ധനകൾ പാലിച്ചിട്ടില്ല", lang);

  const exactPurpose = lang === "ml" ? resolvedPurpose.interpretation_ml : resolvedPurpose.interpretation_en;

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
          1. FINAL RECOMMENDATION — always visible, first thing the user sees
         ═══════════════════════════════════════════════════════════════ */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: `1px solid ${analysis.verdictColor}55`,
        boxShadow: `0 4px 40px rgba(0,0,0,0.60), 0 0 30px ${analysis.verdictColor}15, inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}>
        {/* ── Header ── */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
              background: `linear-gradient(135deg, ${analysis.verdictColor}22 0%, ${analysis.verdictColor}06 100%)`,
              border: `1px solid ${analysis.verdictColor}55`,
            }}>
              <Sparkles className="w-5 h-5" style={{ color: analysis.verdictColor }} />
            </div>
            <h3 className="font-inter text-base font-bold tracking-wide" style={{ color: "#fff" }}>
              {T("FINAL RECOMMENDATION", "അന്തിമ ശുപാർശ", lang)}
            </h3>
          </div>
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "ml" : "en")}
            className="font-inter text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: G.bg, border: `1px solid ${G.border}`, color: G.dim }}
          >
            {tStr("langLabel", lang)}
          </button>
        </div>

        {/* ── Verdict + Score ── */}
        <div className="p-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-inter text-lg" style={{ color: analysis.verdictColor, letterSpacing: "0.1em" }}>
                {analysis.verdictStarsString}
              </span>
              <span className="font-inter text-base font-bold" style={{ color: analysis.verdictColor }}>
                {analysis.verdict}
              </span>
            </div>
            <span className="font-inter text-2xl font-bold" style={{ color: analysis.verdictColor }}>
              {analysis.confidenceScore}%
            </span>
          </div>

          {/* ── Short Summary — 2–4 lines, always visible ── */}
          <div className="space-y-2">
            <SummaryLine
              icon={<CheckCircle2 className="w-4 h-4" />}
              label={T("Can perform", "അനുഷ്ഠിക്കാം", lang)}
              value={canPerformLabel}
              color={canPerformColor}
            />
            <SummaryLine
              icon={<Clock className="w-4 h-4" />}
              label={T("Best time", "മികച്ച സമയം", lang)}
              value={bestTimeStr}
              color={G.text}
            />
            <SummaryLine
              icon={<Info className="w-4 h-4" />}
              label={T("Reason", "കാരണം", lang)}
              value={shortReason}
              color="rgba(255,255,255,0.70)"
            />
            {analysis.recommendedIncense && (
              <SummaryLine
                icon={<Sparkles className="w-4 h-4" />}
                label={T("Incense", "ധൂപം", lang)}
                value={analysis.recommendedIncense}
                color={G.text}
              />
            )}
          </div>

          {/* ── Current Manuscript State — Layl/Nahar, Weekday, Saat, Kawkab ── */}
          {rawAnalysis.liveNow && (
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${G.border}` }}>
              <StateItem
                label={T("Layl / Nahar", "ലൈൽ / നഹർ", lang)}
                value={rawAnalysis.liveNow.laylNahar === "Layl"
                  ? T("Layl (Night)", "ലൈൽ (രാത്രി)", lang)
                  : T("Nahar (Day)", "നഹർ (പകൽ)", lang)}
                color={rawAnalysis.liveNow.laylNahar === "Layl" ? "#818CF8" : "#FBBF24"}
              />
              <StateItem
                label={T("Weekday", "ദിവസം", lang)}
                value={tDay(rawAnalysis.liveNow.day, lang)}
                color={G.text}
              />
              <StateItem
                label={T("Saat", "സഅാത്", lang)}
                value={`#${rawAnalysis.liveNow.saat}`}
                color={G.text}
              />
              <StateItem
                label={T("Kawkab", "കവ്കബ്", lang)}
                value={tPlanet(rawAnalysis.liveNow.kawkab, lang)}
                color={G.text}
              />
            </div>
          )}

          {/* ── One-line Warning — only if applicable ── */}
          {analysis.warnings?.length > 0 && (
            <div className="flex items-center gap-2 mt-2 rounded-lg p-2" style={{
              background: "rgba(248,113,113,0.06)",
              border: "1px solid rgba(248,113,113,0.20)",
            }}>
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(248,113,113,0.80)" }} />
              <p className="font-inter text-[11px] flex-1" style={{ color: "rgba(248,113,113,0.85)" }}>
                {analysis.warnings[0]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          2. Ritual Purpose — canonical text from Purpose Meaning box
         ═══════════════════════════════════════════════════════════════ */}
      {exactPurpose && (
        <div className="rounded-xl p-3" style={{
          background: "linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 100%)",
          border: `1px solid ${G.border}`,
        }}>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4" style={{ color: G.text }} />
            <span className="font-inter text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: G.text }}>
              {tStr("ritualPurpose", lang)}
            </span>
          </div>
          <p className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {exactPurpose}
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          3. Collapsed Detail Sections — expand on demand only
         ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-2">

        {/* ▼ Why? — Compliance Checklist (✓/✗ per condition) */}
        <CollapsibleSection
          icon={<CheckCircle2 className="w-4 h-4" />}
          title={T("Why?", "എന്തുകൊണ്ട്?", lang)}
        >
          <ManuscriptComplianceChecklist analysis={analysis} lang={lang} />
        </CollapsibleSection>

        {/* ▼ Manuscript Rules & References — grouped by rule, sources listed once */}
        {groupedRefs.length > 0 && (
          <CollapsibleSection
            icon={<BookOpen className="w-4 h-4" />}
            title={T("Manuscript Rules & References", "ഗ്രന്ഥ നിയമങ്ങളും റഫറൻസുകളും", lang)}
          >
            <div className="space-y-2">
              {groupedRefs.map((ref, i) => (
                <div key={i} className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.15)" }}>
                  <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.65)" }}>{ref.text}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {ref.sources.map((src, j) => (
                      <span key={j} className="font-inter text-[9px] px-1.5 py-0.5 rounded" style={{
                        background: "rgba(74,222,128,0.10)", color: "rgba(74,222,128,0.60)", border: "1px solid rgba(74,222,128,0.20)",
                      }}>{src}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* ▼ Warnings & Conflicts */}
        {(analysis.warnings?.length > 0 || analysis.conflicts?.length > 0) && (
          <CollapsibleSection
            icon={<AlertTriangle className="w-4 h-4" />}
            title={T("Warnings & Conflicts", "മുന്നറിയിപ്പുകളും ഭിന്നതകളും", lang)}
          >
            {analysis.warnings?.length > 0 && (
              <div className="space-y-1 mb-2">
                {analysis.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg p-2" style={{ background: "rgba(248,113,113,0.06)" }}>
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(248,113,113,0.70)" }} />
                    <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.65)" }}>{w}</p>
                  </div>
                ))}
              </div>
            )}
            {analysis.conflicts?.length > 0 && (
              <div className="space-y-1.5">
                {analysis.conflicts.map((c, i) => (
                  <div key={i} className="rounded-lg p-2" style={{ background: "rgba(249,168,212,0.06)", border: "1px solid rgba(249,168,212,0.20)" }}>
                    <p className="font-inter text-[11px]" style={{ color: "#F9A8D4" }}>
                      <span className="font-bold">{tStr("conflict", lang)}:</span> {c.rule1} vs {c.rule2}
                    </p>
                    <p className="font-inter text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>{tStr("resolution", lang)}: {c.resolution}</p>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>
        )}

        {/* ▼ Alternative Time — next valid opportunity */}
        {analysis.nextOpportunity && (
          <CollapsibleSection
            icon={<Sunset className="w-4 h-4" />}
            title={T("Alternative Time", "ബദൽ സമയം", lang)}
          >
            <div className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-inter text-sm font-bold" style={{ color: G.text }}>{analysis.nextOpportunity.dayName}</span>
                {!analysis.nextOpportunity.isToday && (
                  <span className="font-inter text-[10px] px-1.5 py-0.5 rounded" style={{ background: G.bgHi, color: G.dim }}>
                    {analysis.nextOpportunity.daysAhead} {tStr("daysAway", lang)}
                  </span>
                )}
              </div>
              <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
                {analysis.nextOpportunity.startTime}–{analysis.nextOpportunity.endTime} · {analysis.nextOpportunity.planet} ({tStr("hour", lang)} #{analysis.nextOpportunity.hour})
              </p>
            </div>
          </CollapsibleSection>
        )}

        {/* ▼ Today's Best Times */}
        {analysis.bestWindowsToday?.length > 0 && (
          <CollapsibleSection
            icon={<Clock className="w-4 h-4" />}
            title={T("Today's Best Times", "ഇന്നത്തെ മികച്ച സമയങ്ങൾ", lang)}
          >
            <ReportWindowsList windows={windowsSection?.windows || []} />
          </CollapsibleSection>
        )}

        {/* ▼ Times to Avoid */}
        {analysis.avoidWindowsToday?.length > 0 && (
          <CollapsibleSection
            icon={<Ban className="w-4 h-4" />}
            title={T("Times to Avoid", "ഒഴിവാക്കേണ്ട സമയങ്ങൾ", lang)}
          >
            <div className="space-y-1">
              {(avoidSection?.avoid || []).map((w, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg p-2" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.20)" }}>
                  <Ban className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(248,113,113,0.70)" }} />
                  <span className="font-inter text-xs font-bold" style={{ color: "rgba(248,113,113,0.90)" }}>{w.time} · {w.planet}</span>
                  <span className="font-inter text-[10px] flex-1" style={{ color: "rgba(255,255,255,0.50)" }}>{w.reason}</span>
                </div>
              ))}
            </div>
            {avoidSection?.enemyAnalysis?.note && (
              <div className="mt-2 rounded-lg p-2.5" style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)" }}>
                <p className="font-inter text-[10px] mb-1.5" style={{ color: "rgba(248,113,113,0.70)" }}>{avoidSection.enemyAnalysis.note}</p>
                <div className="grid grid-cols-2 gap-2">
                  {avoidSection.enemyAnalysis.enemyHours?.length > 0 && <EnemyItem label={tStr("enemyHours", lang)} values={avoidSection.enemyAnalysis.enemyHours} />}
                  {avoidSection.enemyAnalysis.enemyDays?.length > 0 && <EnemyItem label={tStr("enemyDays", lang)} values={avoidSection.enemyAnalysis.enemyDays} />}
                  {avoidSection.enemyAnalysis.enemyRulers?.length > 0 && <EnemyItem label={tStr("enemyRulers", lang)} values={avoidSection.enemyAnalysis.enemyRulers} />}
                </div>
              </div>
            )}
          </CollapsibleSection>
        )}

        {/* ▼ Technical Details — engine reasoning, separated from user information */}
        <CollapsibleSection
          icon={<Info className="w-4 h-4" />}
          title={T("Technical Details", "സാങ്കേതിക വിവരങ്ങൾ", lang)}
        >
          <div className="space-y-1">
            {analysis.reasoning.map((r, i) => (
              <p key={i} className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                {i + 1}. {r}
              </p>
            ))}
          </div>
        </CollapsibleSection>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          4. Configuration Advisor — how to improve (secondary)
         ═══════════════════════════════════════════════════════════════ */}
      <ConfigurationAdvisor advice={advice} lang={lang} setLang={setLang} purposeLookup={resolvedPurpose} />

      {/* ═══════════════════════════════════════════════════════════════
          5. Moon Analysis — optional, separate card
         ═══════════════════════════════════════════════════════════════ */}
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

// ── Collapsible Section — ALL collapsed by default (defaultOpen=false) ──
function CollapsibleSection({ icon, title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.15)" }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2.5 p-3 text-left">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <div style={{ color: G.dim }}>{icon}</div>
        </div>
        <h4 className="font-inter text-xs font-bold uppercase tracking-wider flex-1" style={{ color: G.text }}>{title}</h4>
        <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform" style={{ color: G.dim, transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pl-12">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── State Item — compact label/value pair for manuscript state grid ──
function StateItem({ label, value, color }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color: "rgba(255,255,255,0.30)" }}>
        {label}
      </span>
      <span className="font-inter text-sm font-bold" style={{ color: color || "rgba(255,255,255,0.80)" }}>
        {value}
      </span>
    </div>
  );
}

// ── Summary Line — single line in the recommendation summary ──
function SummaryLine({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2.5">
      <div style={{ color: color || G.dim }} className="flex-shrink-0">{icon}</div>
      <span className="font-inter text-[10px] uppercase tracking-wider font-bold flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }}>
        {label}
      </span>
      <span className="font-inter text-sm font-bold flex-1" style={{ color: color || "rgba(255,255,255,0.80)" }}>
        {value}
      </span>
    </div>
  );
}

function EnemyItem({ label, values }) {
  if (!values || values.length === 0) return null;
  return (
    <div>
      <p className="font-inter text-[8px] uppercase tracking-wider font-bold" style={{ color: "rgba(248,113,113,0.60)" }}>{label}</p>
      <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>{values.join(', ')}</p>
    </div>
  );
}