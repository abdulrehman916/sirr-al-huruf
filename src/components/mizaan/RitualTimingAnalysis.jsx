// ═══════════════════════════════════════════════════════════════
// RITUAL TIMING ANALYSIS — Expert Panel (Read-only)
// Attached at the bottom of Mizaan9Page. NEVER modifies Mizan logic.
// ═══════════════════════════════════════════════════════════════
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Clock, Moon, Compass, AlertTriangle, BookOpen,
  Sparkles, Sun, Sunset, Star, Zap, Shield, FileText, Globe,
  CheckCircle2, XCircle, AlertCircle,
} from "lucide-react";
import { analyzeRitualTiming } from "../../lib/ritualTimingRuleEngine";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

export default function RitualTimingAnalysis({ result, selections, customPurpose, activeMethod }) {
  const [expanded, setExpanded] = useState(false);

  const analysis = useMemo(() => {
    if (!result) return null;
    return analyzeRitualTiming({ result, selections, customPurpose, activeMethod });
  }, [result, selections, customPurpose, activeMethod]);

  if (analysis?.noPurposeSelected) {
    return (
      <div className="mt-4">
        <div className="rounded-2xl p-6 text-center" style={{
          background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
          border: "1px solid rgba(212,175,55,0.40)",
        }}>
          <AlertTriangle className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(212,175,55,0.65)" }} />
          <p className="font-inter text-sm font-bold" style={{ color: "#F5D060" }}>
            No Purpose Selected
          </p>
          <p className="font-inter text-xs mt-2" style={{ color: "rgba(212,175,55,0.55)" }}>
            Please choose a Purpose in Mizaan 7 to generate Ritual Timing recommendations.
          </p>
        </div>
      </div>
    );
  }
  if (!analysis) return null;

  const canPerformColor = analysis.canPerformToday === 'Yes' ? '#4ADE80' : analysis.canPerformToday === 'Limited' ? '#FBBF24' : '#F87171';
  const CanPerformIcon = analysis.canPerformToday === 'Yes' ? CheckCircle2 : analysis.canPerformToday === 'Limited' ? AlertCircle : XCircle;

  return (
    <div className="mt-4">
      <div className="rounded-2xl overflow-hidden" style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: `1px solid ${G.border}`,
        boxShadow: "0 4px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.08)",
      }}>

        {/* ── Header ── */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4"
          style={{ borderBottom: expanded ? `1px solid ${G.border}` : "none" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
              background: G.bgHi, border: `1px solid ${G.borderHi}`,
            }}>
              <Sparkles className="w-5 h-5" style={{ color: G.text }} />
            </div>
            <div className="text-left">
              <h3 className="font-inter text-sm font-bold" style={{ color: "#fff" }}>
                Expert Ritual Timing Analysis
              </h3>
              <p className="font-inter text-[10px]" style={{ color: G.dim }}>
                تحليل توقيت العمل الروحاني
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{
              background: `${analysis.verdictColor}15`, border: `1px solid ${analysis.verdictColor}50`,
            }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: analysis.verdictColor }} />
              <span className="font-inter text-xs font-bold" style={{ color: analysis.verdictColor }}>
                {analysis.verdict}
              </span>
              <span className="font-inter text-[10px]" style={{ color: G.dim }}>
                {analysis.confidenceScore}%
              </span>
            </div>
            <ChevronDown className="w-4 h-4 transition-transform" style={{ color: G.dim, transform: expanded ? "rotate(180deg)" : "none" }} />
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">

                {/* ── Expert Narrative ── */}
                <div className="rounded-xl p-4" style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.02) 100%)",
                  border: `1px solid ${G.border}`,
                }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4" style={{ color: G.text }} />
                    <h4 className="font-inter text-xs font-bold uppercase tracking-wider" style={{ color: G.text }}>
                      Expert Assessment
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {analysis.expertNarrative.map((line, i) => (
                      <p key={i} className="font-inter text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* ── Ritual Type & Khayr/Sharr ── */}
                <div className="grid grid-cols-2 gap-2">
                  <InfoCard icon={<Zap className="w-4 h-4" />} label="Ritual Type" value={analysis.ritualType} sub={analysis.ritualTypeDescription} />
                  <InfoCard icon={<Shield className="w-4 h-4" />} label="Khayr / Sharr" value={analysis.khayrSharr} sub={analysis.khayrSharrMeaning} />
                </div>

                {/* ── Verdict + Confidence ── */}
                <div className="rounded-xl p-4" style={{
                  background: `${analysis.verdictColor}08`, border: `1px solid ${analysis.verdictColor}30`,
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" style={{ color: analysis.verdictColor }} />
                      <span className="font-inter text-sm font-bold" style={{ color: "#fff" }}>
                        Overall Ritual Strength: {analysis.verdict}
                      </span>
                    </div>
                    <span className="font-inter text-2xl font-bold" style={{ color: analysis.verdictColor }}>
                      {analysis.confidenceScore}%
                    </span>
                  </div>
                  <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
                    {analysis.verdictReason}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {analysis.scoreBreakdown.map((s, i) => (
                      <span key={i} className="font-inter text-[9px] px-1.5 py-0.5 rounded" style={{
                        background: G.bg, border: `1px solid ${G.border}`, color: G.dim,
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ── Can Perform Today? ── */}
                <SectionRow icon={<CanPerformIcon className="w-4 h-4" />} title="Can This Ritual Be Performed Today?">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: canPerformColor }} />
                    <span className="font-inter text-sm font-bold" style={{ color: canPerformColor }}>
                      {analysis.canPerformToday}
                    </span>
                  </div>
                  <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
                    {analysis.canPerformTodayReason}
                  </p>
                </SectionRow>

                {/* ── Recommended Start / End Time ── */}
                {analysis.recommendedStart && (
                  <SectionRow icon={<Clock className="w-4 h-4" />} title="Recommended Time Window">
                    <div className="rounded-lg px-3 py-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-inter text-lg font-bold" style={{ color: G.text }}>
                          {analysis.recommendedStart} – {analysis.recommendedEnd}
                        </span>
                        {analysis.bestWindowsToday.length > 0 && (
                          <span className="font-inter text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(74,222,128,0.10)", color: "#4ADE80" }}>
                            {analysis.bestWindowsToday[0].planet} hour
                          </span>
                        )}
                      </div>
                      <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
                        {analysis.recommendedStartReason}
                      </p>
                    </div>
                  </SectionRow>
                )}

                {/* ── Best Planetary Hour & Ruling Planet ── */}
                <div className="grid grid-cols-2 gap-2">
                  <InfoCard icon={<Clock className="w-4 h-4" />} label="Best Planetary Hour" value={analysis.bestPlanetaryHour || 'Not specified'} sub={analysis.bestHourReason} />
                  <InfoCard icon={<Star className="w-4 h-4" />} label="Best Ruling Planet" value={analysis.bestRulingPlanet || 'Not specified'} sub={analysis.bestDayReason} />
                </div>
                {analysis.bestDay && (
                  <div className="text-center">
                    <span className="font-inter text-xs" style={{ color: G.dim }}>
                      Best day: <span style={{ color: G.text, fontWeight: 600 }}>{analysis.bestDay}</span>
                      {analysis.altDay && <> · Alternative: <span style={{ color: G.text }}>{analysis.altDay}</span></>}
                    </span>
                  </div>
                )}

                {/* ── Moon Phase ── */}
                <SectionRow icon={<Moon className="w-4 h-4" />} title="Moon Phase Condition">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">
                      {analysis.moonPhase.isFullMoon ? "🌕" : analysis.moonPhase.isNewMoon ? "🌑" : analysis.moonPhase.isWaxing ? "🌒" : "🌘"}
                    </div>
                    <div>
                      <p className="font-inter text-sm font-bold" style={{ color: "#fff" }}>
                        Lunar Day {analysis.moonPhase.lunarDay} — {analysis.moonPhase.phaseName}
                      </p>
                      <p className="font-inter text-[10px]" style={{ color: G.dim }}>
                        {analysis.moonPhase.citation}
                      </p>
                    </div>
                  </div>
                  <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
                    {analysis.moonPhase.assessment}
                  </p>
                </SectionRow>

                {/* ── Day/Night Suitability ── */}
                <SectionRow icon={analysis.dayNightSuitability.status === 'forbidden' ? <AlertTriangle className="w-4 h-4" /> : <Sun className="w-4 h-4" />} title="Day / Night Suitability">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-inter text-sm font-bold" style={{
                      color: analysis.dayNightSuitability.status === 'optimal' ? '#4ADE80'
                        : analysis.dayNightSuitability.status === 'good' ? '#86EFAC'
                        : analysis.dayNightSuitability.status === 'acceptable' ? '#FBBF24'
                        : '#F87171',
                    }}>
                      {analysis.dayNightSuitability.status === 'optimal' ? 'Optimal (Night)'
                        : analysis.dayNightSuitability.status === 'good' ? 'Good (Night)'
                        : analysis.dayNightSuitability.status === 'acceptable' ? 'Acceptable (Day)'
                        : 'Forbidden (Daytime)'}
                    </span>
                  </div>
                  <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
                    {analysis.dayNightSuitability.reason}
                  </p>
                  <p className="font-inter text-[10px] mt-1" style={{ color: G.dim }}>
                    {analysis.dayNightSuitability.citation}
                  </p>
                </SectionRow>

                {/* ── Zodiac Suitability ── */}
                {analysis.zodiacSuitability.assessed && (
                  <SectionRow icon={<Globe className="w-4 h-4" />} title="Zodiac Suitability">
                    <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
                      {analysis.zodiacSuitability.note}
                    </p>
                    {analysis.zodiacSuitability.bestSigns.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {analysis.zodiacSuitability.bestSigns.map((z, i) => (
                          <span key={i} className="font-inter text-[10px] px-2 py-1 rounded" style={{
                            background: G.bgHi, border: `1px solid ${G.border}`, color: G.text,
                          }}>
                            {z.sign} → {z.hour.join('/')}
                          </span>
                        ))}
                      </div>
                    )}
                  </SectionRow>
                )}

                {/* ── Element Compatibility ── */}
                {analysis.elementCompatibility.assessed && (
                  <SectionRow icon={<Compass className="w-4 h-4" />} title="Element Compatibility">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-inter text-sm font-bold" style={{
                        color: analysis.elementCompatibility.status === 'aligned' ? '#4ADE80' : '#FBBF24',
                      }}>
                        {analysis.elementCompatibility.status === 'aligned' ? 'Aligned' : 'Neutral'}
                      </span>
                      <span className="font-inter text-[10px] px-2 py-0.5 rounded" style={{ background: G.bg, color: G.dim, border: `1px solid ${G.border}` }}>
                        {analysis.elementCompatibility.element} ({analysis.elementCompatibility.elementNature})
                      </span>
                    </div>
                    <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
                      {analysis.elementCompatibility.reason}
                    </p>
                    <p className="font-inter text-[10px] mt-1" style={{ color: G.dim }}>
                      {analysis.elementCompatibility.citation}
                    </p>
                    {analysis.elementCompatibility.elementDirection && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="rounded-lg px-2.5 py-2" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>Face Direction</p>
                          <p className="font-inter text-sm font-bold" style={{ color: G.text }}>{analysis.elementDirection.dir}</p>
                          <p className="font-amiri text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>{analysis.elementDirection.ar}</p>
                        </div>
                        <div className="rounded-lg px-2.5 py-2" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>Talisman Placement</p>
                          <p className="font-inter text-xs font-bold" style={{ color: G.text }}>{analysis.elementPlacement.placement}</p>
                          <p className="font-amiri text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>{analysis.elementPlacement.ar}</p>
                        </div>
                      </div>
                    )}
                  </SectionRow>
                )}

                {/* ── Current Astro Clock Status ── */}
                <SectionRow icon={<Sun className="w-4 h-4" />} title="Current Astro Clock Status">
                  <p className="font-inter text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {analysis.astroClockStatus.summary}
                  </p>
                </SectionRow>

                {/* ── Best Windows Today ── */}
                {analysis.bestWindowsToday.length > 0 && (
                  <SectionRow icon={<Clock className="w-4 h-4" />} title="Available Optimal Hours Today">
                    <div className="space-y-1.5">
                      {analysis.bestWindowsToday.map((w, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{
                          background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.25)",
                        }}>
                          <div className="flex items-center gap-2">
                            <span className="font-inter text-sm font-bold" style={{ color: "#4ADE80" }}>
                              {w.startTime} – {w.endTime}
                            </span>
                            <span className="font-inter text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(74,222,128,0.10)", color: "#4ADE80" }}>
                              {w.planet}
                            </span>
                          </div>
                          <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                            Hour #{w.hourNumber} · {w.period}
                          </span>
                        </div>
                      ))}
                    </div>
                  </SectionRow>
                )}

                {/* ── Avoid Windows ── */}
                {analysis.avoidWindowsToday.length > 0 && (
                  <SectionRow icon={<AlertTriangle className="w-4 h-4" />} title="Hours to Avoid Today">
                    <div className="space-y-1.5">
                      {analysis.avoidWindowsToday.map((w, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{
                          background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.25)",
                        }}>
                          <div className="flex items-center gap-2">
                            <span className="font-inter text-sm font-bold" style={{ color: "#F87171" }}>
                              {w.startTime} – {w.endTime}
                            </span>
                            <span className="font-inter text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(248,113,113,0.10)", color: "#F87171" }}>
                              {w.planet}
                            </span>
                          </div>
                          <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                            {w.reason}
                          </span>
                        </div>
                      ))}
                    </div>
                  </SectionRow>
                )}

                {/* ── Next Best Opportunity ── */}
                {analysis.nextOpportunity && (
                  <SectionRow icon={<Sunset className="w-4 h-4" />} title="Next Best Available Time">
                    <div className="rounded-lg px-3 py-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-inter text-sm font-bold" style={{ color: G.text }}>
                          {analysis.nextOpportunity.dayName}
                        </span>
                        {!analysis.nextOpportunity.isToday && (
                          <span className="font-inter text-[10px] px-1.5 py-0.5 rounded" style={{ background: G.bgHi, color: G.dim }}>
                            {analysis.nextOpportunity.daysAhead} day{analysis.nextOpportunity.daysAhead > 1 ? "s" : ""} away
                          </span>
                        )}
                      </div>
                      <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
                        {analysis.nextOpportunity.startTime} – {analysis.nextOpportunity.endTime}
                      </p>
                      <p className="font-inter text-[10px] mt-1" style={{ color: G.dim }}>
                        {analysis.nextOpportunity.planet} hour · Hour #{analysis.nextOpportunity.hour}
                      </p>
                    </div>
                  </SectionRow>
                )}

                {/* ── Recommended Incense ── */}
                <SectionRow icon={<Sparkles className="w-4 h-4" />} title="Recommended Incense">
                  <p className="font-inter text-sm" style={{ color: G.text }}>
                    {analysis.recommendedIncense}
                  </p>
                  <p className="font-inter text-[10px] mt-1" style={{ color: G.dim }}>
                    The incense follows the Sa'at (planetary hour), NOT the day — Al-Shurut p.11, 20
                  </p>
                </SectionRow>

                {/* ── Warnings ── */}
                {analysis.warnings.length > 0 && (
                  <SectionRow icon={<AlertTriangle className="w-4 h-4" />} title="Warnings & Forbidden Conditions">
                    <div className="space-y-1.5">
                      {analysis.warnings.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 rounded-lg px-3 py-2" style={{
                          background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.25)",
                        }}>
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#F87171" }} />
                          <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.70)" }}>{w}</p>
                        </div>
                      ))}
                    </div>
                  </SectionRow>
                )}

                {/* ── Conflicting Rules ── */}
                {analysis.conflicts.length > 0 && (
                  <SectionRow icon={<AlertTriangle className="w-4 h-4" />} title="Manuscript Rule Conflicts (Resolved)">
                    <div className="space-y-2">
                      {analysis.conflicts.map((c, i) => (
                        <div key={i} className="rounded-lg px-3 py-2" style={{
                          background: "rgba(249,168,212,0.06)", border: "1px solid rgba(249,168,212,0.25)",
                        }}>
                          <p className="font-inter text-[11px] mb-1" style={{ color: "#F9A8D4" }}>⚔ Conflict {i + 1}</p>
                          <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>Rule A: {c.rule1}</p>
                          <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>Rule B: {c.rule2}</p>
                          <p className="font-inter text-[11px] mt-1.5 font-semibold" style={{ color: G.text }}>→ {c.resolution}</p>
                        </div>
                      ))}
                    </div>
                  </SectionRow>
                )}

                {/* ── Manuscript Rules Used ── */}
                {analysis.rulesApplied.length > 0 && (
                  <SectionRow icon={<BookOpen className="w-4 h-4" />} title="Manuscript Rules Applied">
                    <div className="space-y-1">
                      {analysis.rulesApplied.map((r, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="font-inter text-[9px] font-mono px-1.5 py-0.5 rounded flex-shrink-0" style={{
                            background: G.bgHi, color: G.dim, border: `1px solid ${G.border}`,
                          }}>
                            {r.id}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.60)" }}>{r.desc}</p>
                            <p className="font-inter text-[9px]" style={{ color: G.dim }}>{r.source}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionRow>
                )}

                {/* ── Manuscript References ── */}
                {analysis.bookNotes.length > 0 && (
                  <SectionRow icon={<FileText className="w-4 h-4" />} title="Manuscript References">
                    <div className="space-y-1">
                      {analysis.bookNotes.map((n, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="font-inter text-[9px] px-1.5 py-0.5 rounded flex-shrink-0" style={{
                            background: "rgba(74,192,122,0.10)", color: "rgba(74,192,122,0.60)", border: "1px solid rgba(74,192,122,0.20)",
                          }}>
                            {n.source}
                          </span>
                          <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.50)" }}>{n.text}</p>
                        </div>
                      ))}
                    </div>
                  </SectionRow>
                )}

                {/* ── Debug: Reasoning ── */}
                <details className="rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <summary className="cursor-pointer px-3 py-2 font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                    Full Reasoning Log ({analysis.reasoning.length} steps)
                  </summary>
                  <div className="px-3 pb-3 space-y-0.5">
                    {analysis.reasoning.map((r, i) => (
                      <p key={i} className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {i + 1}. {r}
                      </p>
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
            <MiniBadge label="Ritual" value={analysis.ritualType} color={G.text} />
            <MiniBadge label="Today" value={analysis.canPerformToday} color={canPerformColor} />
            <MiniBadge label="Hour" value={`#${analysis.astroClockStatus.currentHour.number} ${analysis.astroClockStatus.currentHour.planet}`} color={G.text} />
            <MiniBadge label="Moon" value={`Day ${analysis.moonPhase.lunarDay}`} color={G.text} />
            {analysis.elementDirection && <MiniBadge label="Face" value={analysis.elementDirection.dir} color={G.text} />}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ──
function SectionRow({ icon, title, children }) {
  return (
    <div className="rounded-xl p-3" style={{
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.15)",
    }}>
      <div className="flex items-center gap-2 mb-2">
        <div style={{ color: G.dim }}>{icon}</div>
        <h4 className="font-inter text-xs font-bold uppercase tracking-wider" style={{ color: G.text }}>{title}</h4>
      </div>
      {children}
    </div>
  );
}

function InfoCard({ icon, label, value, sub }) {
  return (
    <div className="rounded-xl p-3" style={{
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.15)",
    }}>
      <div className="flex items-center gap-1.5 mb-1">
        <div style={{ color: G.dim }}>{icon}</div>
        <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{label}</p>
      </div>
      <p className="font-inter text-sm font-bold" style={{ color: "#fff" }}>{value}</p>
      {sub && <p className="font-inter text-[10px] mt-1 leading-tight" style={{ color: "rgba(255,255,255,0.40)" }}>{sub}</p>}
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