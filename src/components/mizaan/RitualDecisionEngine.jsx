// ═══════════════════════════════════════════════════════════════
// RITUAL DECISION ENGINE — Compact Expert Decision Report (Read-only)
// Attached below all four Mizan methods. NEVER modifies Mizan logic.
//
// UI/UX PRINCIPLES:
//   • Each concept appears exactly ONCE — no repeated explanations
//   • Book references grouped by rule: explanation once, all sources listed
//   • Summary first; details on expand
//   • Consolidated from 10 overlapping sections into 5 clean sections
//   • 100% of manuscript data preserved — only presentation changed
// ═══════════════════════════════════════════════════════════════
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Sparkles, BookOpen, AlertTriangle, Clock,
  Sunset, Target,
} from "lucide-react";
import { analyzeRitualTiming, analyzeConfigurationAdvice } from "../../lib/ritualTimingEngineV3";
import ReportWindowsList from "./ReportWindowsList";
import ConfigurationAdvisor from "./ConfigurationAdvisor";
import ManuscriptComplianceChecklist from "./ManuscriptComplianceChecklist";
import MoonAnalysisCard from "./MoonAnalysisCard";
import { localizeAnalysis, localizeAdvice, tStr, useRitualLang } from "../../lib/ritualTimingI18n";
import { useManuscriptRules } from "../../hooks/useManuscriptRules";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

// ── Group manuscript references by rule text — explanation once, all sources listed ──
// Merges rulesApplied + bookNotes, deduplicating by rule text.
// Returns [{ text, sources: [src1, src2, ...] }] — each rule appears once.
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
  const [expanded, setExpanded] = useState(true);
  const [lang, setLang] = useRitualLang();
  const { manuscriptRules } = useManuscriptRules();

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
    return analyzeRitualTiming({ result, selections: effectiveSelections, customPurpose, activeMethod, manuscriptRules, purposeLookup: resolvedPurpose });
  }, [result, effectiveSelections, customPurpose, activeMethod, manuscriptRules, resolvedPurpose]);

  const analysis = useMemo(() => rawAnalysis ? localizeAnalysis(rawAnalysis, lang) : null, [rawAnalysis, lang]);

  const rawAdvice = useMemo(() => {
    if (!result || resolvedPurpose.needsConfirmation) return null;
    return analyzeConfigurationAdvice({ result, selections: effectiveSelections, customPurpose, activeMethod, manuscriptRules, purposeLookup: resolvedPurpose });
  }, [result, effectiveSelections, customPurpose, activeMethod, manuscriptRules, resolvedPurpose]);

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

  // Extract data from report sections (consolidated — no duplication)
  const windowsSection = analysis.report.find(s => s.windows);
  const avoidSection = analysis.report.find(s => s.avoid);
  const finalSection = analysis.report.find(s => s.stars && s.color);

  // Group manuscript references — each rule once, all sources listed below
  const groupedRefs = groupReferences(analysis.rulesApplied, analysis.bookNotes);

  // Best time for header summary
  const bestWindow = analysis.bestWindowsToday?.[0];
  const bestTimeStr = bestWindow ? `${bestWindow.startTime}–${bestWindow.endTime}` : null;

  return (
    <div className="mt-6 space-y-4">
      {/* ── Configuration Advisor — Current vs Recommended per field ── */}
      <ConfigurationAdvisor advice={advice} lang={lang} setLang={setLang} purposeLookup={resolvedPurpose} />

      {/* ── Main Decision Panel ── */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: `1px solid ${G.border}`,
        boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)",
      }}>
        {/* ── Header — compact summary always visible ── */}
        <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-4" style={{ borderBottom: expanded ? `1px solid ${G.border}` : "none" }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{
              background: "linear-gradient(135deg, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.06) 100%)",
              border: `1px solid ${G.borderHi}`,
              boxShadow: "0 0 20px rgba(212,175,55,0.18)",
            }}>
              <Sparkles className="w-5 h-5" style={{ color: G.text }} />
            </div>
            <div className="text-left">
              <h3 className="font-inter text-base font-bold tracking-wide" style={{ color: "#fff" }}>
                {tStr("panelTitle", lang)}
              </h3>
              {/* One-line summary — verdict + canProceed + bestTime (no repetition) */}
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="font-inter text-xs font-bold" style={{ color: analysis.verdictColor }}>
                  {analysis.verdictStarsString} {analysis.verdict} ({analysis.confidenceScore}%)
                </span>
                <span className="font-inter text-xs" style={{ color: canPerformColor }}>
                  {tStr("today", lang)}: {analysis.canPerformToday}
                </span>
                {bestTimeStr && (
                  <span className="font-inter text-xs" style={{ color: G.dim }}>
                    {tStr("bestTime", lang)}: {bestTimeStr}
                  </span>
                )}
              </div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 transition-transform flex-shrink-0" style={{ color: G.dim, transform: expanded ? "rotate(180deg)" : "none" }} />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-3">

                {/* ── Ritual Purpose — canonical text from Purpose Meaning box ── */}
                {(() => {
                  const exactPurpose = lang === "ml" ? resolvedPurpose.interpretation_ml : resolvedPurpose.interpretation_en;
                  if (!exactPurpose) return null;
                  return (
                    <div className="rounded-xl p-3" style={{
                      background: "linear-gradient(135deg, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.04) 100%)",
                      border: `1px solid ${G.borderHi}`,
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
                  );
                })()}

                {/* ── Compliance Checklist — ✓/✗ per condition (existing component) ── */}
                <ManuscriptComplianceChecklist analysis={analysis} lang={lang} />

                {/* ── Today's Best Times — merged windows + ranked (no duplication) ── */}
                {analysis.bestWindowsToday?.length > 0 && (
                  <CollapsibleSection icon={<Clock className="w-4 h-4" />} title={tStr("optimalHoursToday", lang)} defaultOpen={true}>
                    <ReportWindowsList windows={windowsSection?.windows || []} />
                  </CollapsibleSection>
                )}

                {/* ── Times to Avoid — bad times + enemy analysis ── */}
                {analysis.avoidWindowsToday?.length > 0 && (
                  <CollapsibleSection icon={<AlertTriangle className="w-4 h-4" />} title={tStr("avoidHoursToday", lang)}>
                    <div className="space-y-1">
                      {(avoidSection?.avoid || []).map((w, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-lg p-2" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.20)" }}>
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(248,113,113,0.70)" }} />
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

                {/* ── Next Opportunity — earliest valid time ── */}
                {analysis.nextOpportunity && (
                  <CollapsibleSection icon={<Sunset className="w-4 h-4" />} title={tStr("nextBestTime", lang)}>
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

                {/* ── Manuscript Rules & References — merged, grouped by rule ── */}
                {/* Each rule explanation appears ONCE; all supporting sources listed below */}
                {groupedRefs.length > 0 && (
                  <CollapsibleSection icon={<BookOpen className="w-4 h-4" />} title={tStr("msRulesApplied", lang)}>
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

                {/* ── Warnings & Conflicts — unique warnings not already in checklist ── */}
                {(analysis.warnings?.length > 0 || analysis.conflicts?.length > 0) && (
                  <CollapsibleSection icon={<AlertTriangle className="w-4 h-4" />} title={tStr("warningsForbidden", lang)}>
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

                {/* ── Final Decision — verdict + recommendation ── */}
                {finalSection && (
                  <CollapsibleSection icon={<Sparkles className="w-4 h-4" />} title={finalSection.section} defaultOpen={true}>
                    <div className="rounded-xl p-3" style={{ background: `${analysis.verdictColor}08`, border: `1px solid ${analysis.verdictColor}30` }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-inter text-sm font-bold" style={{ color: analysis.verdictColor }}>
                          {analysis.verdictStarsString} {analysis.verdict}
                        </span>
                        <span className="font-inter text-lg font-bold" style={{ color: analysis.verdictColor }}>{analysis.confidenceScore}%</span>
                      </div>
                      <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{finalSection.body}</p>
                      {analysis.recommendedIncense && (
                        <div className="flex items-center gap-2 mt-2 pt-2" style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}>
                          <Sparkles className="w-3.5 h-3.5" style={{ color: G.dim }} />
                          <span className="font-inter text-[11px]" style={{ color: G.dim }}>{tStr("recIncense", lang)}:</span>
                          <span className="font-inter text-[11px] font-bold" style={{ color: G.text }}>{analysis.recommendedIncense}</span>
                        </div>
                      )}
                    </div>
                  </CollapsibleSection>
                )}

                {/* ── Reasoning Log — collapsible ── */}
                <details className="rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <summary className="cursor-pointer px-3 py-2 font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                    {tStr("reasoningLog", lang)} ({analysis.reasoning.length} {tStr("steps", lang)})
                  </summary>
                  <div className="px-3 pb-3 space-y-0.5">
                    {analysis.reasoning.map((r, i) => (
                      <p key={i} className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>{i + 1}. {r}</p>
                    ))}
                  </div>
                </details>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Collapsed Summary ── */}
        {!expanded && (
          <div className="px-4 pb-3 flex items-center gap-3 flex-wrap">
            <MiniBadge label={tStr("verdict", lang)} value={`${analysis.verdictStarsString} ${analysis.verdict}`} color={analysis.verdictColor} />
            <MiniBadge label={tStr("today", lang)} value={analysis.canPerformToday} color={canPerformColor} />
            <MiniBadge label={tStr("confidence", lang)} value={`${analysis.confidenceScore}%`} color={G.text} />
          </div>
        )}
      </div>

      {/* ── Moon Analysis — optional, separate card ── */}
      <MoonAnalysisCard
        moonPhase={rawAnalysis?.moonPhase}
        moonReq={rawAnalysis?.moonReq}
        moonCitations={rawAnalysis?.moonCitations}
        req={rawAnalysis?.req}
        lang={lang}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ── Collapsible Section — expandable details ──
function CollapsibleSection({ icon, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
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

function EnemyItem({ label, values }) {
  if (!values || values.length === 0) return null;
  return (
    <div>
      <p className="font-inter text-[8px] uppercase tracking-wider font-bold" style={{ color: "rgba(248,113,113,0.60)" }}>{label}</p>
      <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>{values.join(', ')}</p>
    </div>
  );
}

function MiniBadge({ label, value, color }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-inter text-[9px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.30)" }}>{label}:</span>
      <span className="font-inter text-[11px] font-bold" style={{ color }}>{value}</span>
    </div>
  );
}