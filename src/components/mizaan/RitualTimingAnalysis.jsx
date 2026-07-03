// ═══════════════════════════════════════════════════════════════
// RITUAL TIMING ANALYSIS — Read-only display section
// Attached at the bottom of Mizaan9Page. NEVER modifies Mizan logic.
// ═══════════════════════════════════════════════════════════════
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, Moon, Compass, AlertTriangle, BookOpen, Sparkles, Sun, Sunset } from "lucide-react";
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

  if (!analysis) return null;

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
              background: G.bgHi,
              border: `1px solid ${G.borderHi}`,
            }}>
              <Clock className="w-5 h-5" style={{ color: G.text }} />
            </div>
            <div className="text-left">
              <h3 className="font-inter text-sm font-bold" style={{ color: "#fff" }}>
                Ritual Timing Analysis
              </h3>
              <p className="font-inter text-[10px]" style={{ color: G.dim }}>
                تحليل توقيت العمل
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Verdict Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{
              background: `${analysis.verdictColor}15`,
              border: `1px solid ${analysis.verdictColor}50`,
            }}>
              <div className="w-2 h-2 rounded-full" style={{ background: analysis.verdictColor }} />
              <span className="font-inter text-xs font-bold" style={{ color: analysis.verdictColor }}>
                {analysis.verdict}
              </span>
              <span className="font-inter text-[10px]" style={{ color: G.dim }}>
                {analysis.confidenceScore}%
              </span>
            </div>
            <ChevronDown
              className="w-4 h-4 transition-transform"
              style={{ color: G.dim, transform: expanded ? "rotate(180deg)" : "none" }}
            />
          </div>
        </button>

        {/* ── Expandable Content ── */}
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

                {/* ── Verdict Summary ── */}
                <div className="rounded-xl p-3" style={{
                  background: `${analysis.verdictColor}08`,
                  border: `1px solid ${analysis.verdictColor}30`,
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4" style={{ color: analysis.verdictColor }} />
                    <span className="font-inter text-sm font-bold" style={{ color: "#fff" }}>
                      {analysis.verdict} — {analysis.confidenceScore}% Confidence
                    </span>
                  </div>
                  <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
                    {analysis.verdictReason}
                  </p>
                  <p className="font-inter text-[11px] mt-2" style={{ color: G.dim }}>
                    Ritual Intent: <span style={{ color: G.text }}>{analysis.ritualIntent}</span>
                  </p>
                </div>

                {/* ── Can Perform Today? ── */}
                <SectionRow
                  icon={<Clock className="w-4 h-4" />}
                  title="Can This Ritual Be Performed Today?"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{
                      background: analysis.canPerformToday ? "#4ADE80" : "#F87171",
                    }} />
                    <span className="font-inter text-sm font-bold" style={{
                      color: analysis.canPerformToday ? "#4ADE80" : "#F87171",
                    }}>
                      {analysis.canPerformToday ? "Yes — today is a valid day" : "No — wait for the recommended day"}
                    </span>
                  </div>
                  {analysis.bestDay && (
                    <p className="font-inter text-[11px] mt-1.5" style={{ color: "rgba(255,255,255,0.50)" }}>
                      Best day: <span style={{ color: G.text }}>{analysis.bestDay}</span>
                      {analysis.bestHour && <> · Best hour: <span style={{ color: G.text }}>{analysis.bestHour} hour</span></>}
                    </p>
                  )}
                </SectionRow>

                {/* ── Current Conditions ── */}
                <SectionRow
                  icon={<Sun className="w-4 h-4" />}
                  title="Current Live Conditions"
                >
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <InfoChip label="Planetary Hour" value={`#${analysis.currentPlanetaryHour.number} ${analysis.currentPlanetaryHour.symbol} ${analysis.currentPlanetaryHour.planet}`} />
                    <InfoChip label="Day Ruler" value={analysis.currentDayRuler} />
                    <InfoChip label="Day/Night" value={analysis.isNightTime ? "🌙 Night" : "☀️ Day"} />
                    <InfoChip label="Moon Phase" value={`Day ${analysis.moonPhase.lunarDay} ${analysis.moonPhase.phaseName}`} />
                  </div>
                  <p className="font-inter text-[10px] mt-2" style={{ color: G.dim }}>
                    Hour ends at {analysis.currentPlanetaryHour.endsAt} · {analysis.currentPlanetaryHour.remaining} remaining
                  </p>
                </SectionRow>

                {/* ── Best Windows Today ── */}
                {analysis.bestWindowsToday.length > 0 && (
                  <SectionRow
                    icon={<Clock className="w-4 h-4" />}
                    title="Recommended Time Windows Today"
                  >
                    <div className="space-y-1.5">
                      {analysis.bestWindowsToday.map((w, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{
                          background: "rgba(74,222,128,0.06)",
                          border: "1px solid rgba(74,222,128,0.25)",
                        }}>
                          <div className="flex items-center gap-2">
                            <span className="font-inter text-sm font-bold" style={{ color: "#4ADE80" }}>
                              {w.startTime} – {w.endTime}
                            </span>
                            <span className="font-inter text-[10px] px-1.5 py-0.5 rounded" style={{
                              background: "rgba(74,222,128,0.10)",
                              color: "#4ADE80",
                            }}>
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

                {/* ── Avoid Windows Today ── */}
                {analysis.avoidWindowsToday.length > 0 && (
                  <SectionRow
                    icon={<AlertTriangle className="w-4 h-4" />}
                    title="Avoid These Hours Today"
                  >
                    <div className="space-y-1.5">
                      {analysis.avoidWindowsToday.map((w, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{
                          background: "rgba(248,113,113,0.06)",
                          border: "1px solid rgba(248,113,113,0.25)",
                        }}>
                          <div className="flex items-center gap-2">
                            <span className="font-inter text-sm font-bold" style={{ color: "#F87171" }}>
                              {w.startTime} – {w.endTime}
                            </span>
                            <span className="font-inter text-[10px] px-1.5 py-0.5 rounded" style={{
                              background: "rgba(248,113,113,0.10)",
                              color: "#F87171",
                            }}>
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
                  <SectionRow
                    icon={<Sunset className="w-4 h-4" />}
                    title="Next Best Opportunity"
                  >
                    <div className="rounded-lg px-3 py-2.5" style={{
                      background: G.bg,
                      border: `1px solid ${G.border}`,
                    }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-inter text-sm font-bold" style={{ color: G.text }}>
                          {analysis.nextOpportunity.dayName}
                        </span>
                        {!analysis.nextOpportunity.isToday && (
                          <span className="font-inter text-[10px] px-1.5 py-0.5 rounded" style={{
                            background: G.bgHi,
                            color: G.dim,
                          }}>
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

                {/* ── Moon Condition ── */}
                <SectionRow
                  icon={<Moon className="w-4 h-4" />}
                  title="Best Moon Condition"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {analysis.moonPhase.isFullMoon ? "🌕" : analysis.moonPhase.isNewMoon ? "🌑" : analysis.moonPhase.isWaxing ? "🌒" : "🌘"}
                    </div>
                    <div>
                      <p className="font-inter text-sm font-bold" style={{ color: "#fff" }}>
                        Lunar Day {analysis.moonPhase.lunarDay} — {analysis.moonPhase.phaseName}
                      </p>
                      <p className="font-inter text-[11px]" style={{ color: G.dim }}>
                        {selections?.khayrSharr8 === "khayr"
                          ? "Khayr works: perform during waxing phase (days 1–14)"
                          : selections?.khayrSharr8 === "sharr"
                            ? "Sharr works: perform during waning phase (days 15–29), best at New Moon"
                            : "Select Khayr or Sharr in Mizan 8 for phase guidance"}
                      </p>
                    </div>
                  </div>
                </SectionRow>

                {/* ── Element Direction & Placement ── */}
                {(analysis.elementDirection || analysis.elementPlacement) && (
                  <SectionRow
                    icon={<Compass className="w-4 h-4" />}
                    title="Ritual Direction & Talisman Placement"
                  >
                    <div className="grid grid-cols-1 gap-2">
                      {analysis.elementDirection && (
                        <div className="rounded-lg px-3 py-2" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                          <p className="font-inter text-[10px] uppercase tracking-wider" style={{ color: G.dim }}>
                            Face Direction
                          </p>
                          <p className="font-inter text-sm font-bold mt-0.5" style={{ color: G.text }}>
                            {analysis.elementDirection.dir}
                          </p>
                          <p className="font-amiri text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>
                            {analysis.elementDirection.ar}
                          </p>
                        </div>
                      )}
                      {analysis.elementPlacement && (
                        <div className="rounded-lg px-3 py-2" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                          <p className="font-inter text-[10px] uppercase tracking-wider" style={{ color: G.dim }}>
                            Talisman Placement
                          </p>
                          <p className="font-inter text-sm font-bold mt-0.5" style={{ color: G.text }}>
                            {analysis.elementPlacement.placement}
                          </p>
                          <p className="font-amiri text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>
                            {analysis.elementPlacement.ar}
                          </p>
                        </div>
                      )}
                    </div>
                  </SectionRow>
                )}

                {/* ── Recommended Incense ── */}
                <SectionRow
                  icon={<Sparkles className="w-4 h-4" />}
                  title="Recommended Incense"
                >
                  <p className="font-inter text-sm" style={{ color: G.text }}>
                    {analysis.recommendedIncense}
                  </p>
                  <p className="font-inter text-[10px] mt-1" style={{ color: G.dim }}>
                    Incense follows the SA'AT (hour), NOT the day — Al-Shurut p.11, 20
                  </p>
                </SectionRow>

                {/* ── Warnings ── */}
                {analysis.warnings.length > 0 && (
                  <SectionRow
                    icon={<AlertTriangle className="w-4 h-4" />}
                    title="Warnings & Forbidden Conditions"
                  >
                    <div className="space-y-1.5">
                      {analysis.warnings.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 rounded-lg px-3 py-2" style={{
                          background: "rgba(248,113,113,0.06)",
                          border: "1px solid rgba(248,113,113,0.25)",
                        }}>
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#F87171" }} />
                          <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.70)" }}>
                            {w}
                          </p>
                        </div>
                      ))}
                    </div>
                  </SectionRow>
                )}

                {/* ── Conflicting Rules ── */}
                {analysis.conflicts.length > 0 && (
                  <SectionRow
                    icon={<AlertTriangle className="w-4 h-4" />}
                    title="Manuscript Rule Conflicts (Resolved)"
                  >
                    <div className="space-y-2">
                      {analysis.conflicts.map((c, i) => (
                        <div key={i} className="rounded-lg px-3 py-2" style={{
                          background: "rgba(249,168,212,0.06)",
                          border: "1px solid rgba(249,168,212,0.25)",
                        }}>
                          <p className="font-inter text-[11px] mb-1" style={{ color: "#F9A8D4" }}>
                            ⚔ Conflict {i + 1}
                          </p>
                          <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                            Rule A: {c.rule1}
                          </p>
                          <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                            Rule B: {c.rule2}
                          </p>
                          <p className="font-inter text-[11px] mt-1.5 font-semibold" style={{ color: G.text }}>
                            → {c.resolution}
                          </p>
                        </div>
                      ))}
                    </div>
                  </SectionRow>
                )}

                {/* ── Score Breakdown ── */}
                <SectionRow
                  icon={<Sparkles className="w-4 h-4" />}
                  title="Confidence Score Breakdown"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.scoreBreakdown.map((s, i) => (
                      <span key={i} className="font-inter text-[10px] px-2 py-1 rounded" style={{
                        background: G.bg,
                        border: `1px solid ${G.border}`,
                        color: "rgba(255,255,255,0.60)",
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </SectionRow>

                {/* ── Rules Applied (Reasoning Chain) ── */}
                {analysis.rulesApplied.length > 0 && (
                  <SectionRow
                    icon={<BookOpen className="w-4 h-4" />}
                    title="Rules Applied (Reasoning Chain)"
                  >
                    <div className="space-y-1">
                      {analysis.rulesApplied.map((r, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="font-inter text-[9px] font-mono px-1.5 py-0.5 rounded flex-shrink-0" style={{
                            background: G.bgHi,
                            color: G.dim,
                            border: `1px solid ${G.border}`,
                          }}>
                            {r.id}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.60)" }}>
                              {r.desc}
                            </p>
                            <p className="font-inter text-[9px]" style={{ color: G.dim }}>
                              {r.source}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionRow>
                )}

                {/* ── Book Notes ── */}
                {analysis.bookNotes.length > 0 && (
                  <SectionRow
                    icon={<BookOpen className="w-4 h-4" />}
                    title="Manuscript References"
                  >
                    <div className="space-y-1">
                      {analysis.bookNotes.map((n, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="font-inter text-[9px] px-1.5 py-0.5 rounded flex-shrink-0" style={{
                            background: "rgba(74,192,122,0.10)",
                            color: "rgba(74,192,122,0.60)",
                            border: "1px solid rgba(74,192,122,0.20)",
                          }}>
                            {n.source}
                          </span>
                          <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                            {n.text}
                          </p>
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
            <MiniBadge label="Verdict" value={analysis.verdict} color={analysis.verdictColor} />
            <MiniBadge label="Today" value={analysis.canPerformToday ? "Yes" : "No"} color={analysis.canPerformToday ? "#4ADE80" : "#F87171"} />
            <MiniBadge label="Hour" value={`#${analysis.currentPlanetaryHour.number} ${analysis.currentPlanetaryHour.planet}`} color={G.text} />
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
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(212,175,55,0.15)",
    }}>
      <div className="flex items-center gap-2 mb-2">
        <div style={{ color: G.dim }}>{icon}</div>
        <h4 className="font-inter text-xs font-bold uppercase tracking-wider" style={{ color: G.text }}>
          {title}
        </h4>
      </div>
      {children}
    </div>
  );
}

function InfoChip({ label, value }) {
  return (
    <div className="rounded-lg px-2.5 py-1.5" style={{
      background: "rgba(212,175,55,0.04)",
      border: "1px solid rgba(212,175,55,0.15)",
    }}>
      <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>
        {label}
      </p>
      <p className="font-inter text-xs font-semibold mt-0.5" style={{ color: "#fff" }}>
        {value}
      </p>
    </div>
  );
}

function MiniBadge({ label, value, color }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-inter text-[9px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.30)" }}>
        {label}:
      </span>
      <span className="font-inter text-[11px] font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}