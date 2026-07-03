// ═══════════════════════════════════════════════════════════════
// RITUAL DECISION ENGINE — Expert Decision Report (Read-only)
// Attached below all four Mizan methods. NEVER modifies Mizan logic.
// Renders the 10-section expert spiritual decision report.
// ═══════════════════════════════════════════════════════════════
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Sparkles, BookOpen, AlertTriangle, Clock, Calendar,
  Star, Sun, Sunset, Globe, CalendarClock, FileText, Scroll, Shield, Zap,
} from "lucide-react";
import { analyzeRitualTiming } from "../../lib/ritualTimingRuleEngine";
import ReportWindowsList from "./ReportWindowsList";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

const SECTION_ICONS = {
  calendar: Calendar,
  clock: Clock,
  windows: Clock,
  star: Star,
  alert: AlertTriangle,
  "calendar-clock": CalendarClock,
  globe: Globe,
  book: BookOpen,
  "alert-triangle": AlertTriangle,
  sparkles: Sparkles,
};

export default function RitualDecisionEngine({ result, selections, customPurpose, activeMethod }) {
  const [expanded, setExpanded] = useState(true);

  const analysis = useMemo(() => {
    if (!result) return null;
    return analyzeRitualTiming({ result, selections, customPurpose, activeMethod });
  }, [result, selections, customPurpose, activeMethod]);

  if (!analysis || !analysis.report) return null;

  const canPerformColor = analysis.canPerformToday === "Yes" ? "#4ADE80" : analysis.canPerformToday === "Limited" ? "#FBBF24" : "#F87171";

  return (
    <div className="mt-6">
      <div className="rounded-2xl overflow-hidden" style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: `1px solid ${G.border}`,
        boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)",
      }}>

        {/* ── Header ── */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4"
          style={{ borderBottom: expanded ? `1px solid ${G.border}` : "none" }}
        >
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
                Ritual Decision Engine
              </h3>
              <p className="font-amiri text-sm" style={{ color: G.dim }}>
                محرك القرار الروحاني
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{
              background: `${analysis.verdictColor}15`, border: `1px solid ${analysis.verdictColor}50`,
            }}>
              <span className="font-inter text-sm font-bold" style={{ color: analysis.verdictColor }}>
                {analysis.verdictStarsString}
              </span>
              <span className="font-inter text-sm font-bold" style={{ color: analysis.verdictColor }}>
                {analysis.verdict}
              </span>
              <span className="font-inter text-xs" style={{ color: G.dim }}>
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
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-3">

                {/* ── Opening Consultation Statement ── */}
                <div className="rounded-xl p-4" style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 100%)",
                  border: `1px solid ${G.borderHi}`,
                  boxShadow: "inset 0 1px 0 rgba(212,175,55,0.10)",
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Scroll className="w-4 h-4" style={{ color: G.text }} />
                    <span className="font-inter text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: G.text }}>
                      Understanding Your Ritual
                    </span>
                  </div>
                  <p className="font-inter text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.80)" }}>
                    {analysis.expertNarrative[0]}
                  </p>
                  {analysis.expertNarrative.slice(1).map((line, i) => (
                    <p key={i} className="font-inter text-sm leading-relaxed mt-2" style={{ color: "rgba(255,255,255,0.65)" }}>
                      {line}
                    </p>
                  ))}
                </div>

                {/* ── Quick Status Bar ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <StatusChip icon={<Zap className="w-3.5 h-3.5" />} label="Ritual" value={analysis.ritualType} />
                  <StatusChip icon={<Star className="w-3.5 h-3.5" />} label="Today" value={analysis.canPerformToday} color={canPerformColor} />
                  <StatusChip icon={<Clock className="w-3.5 h-3.5" />} label="Hour" value={`#${analysis.astroClockStatus.currentHour.number} ${analysis.astroClockStatus.currentHour.planet}`} />
                  <StatusChip icon={<Sun className="w-3.5 h-3.5" />} label="Moon" value={`Day ${analysis.moonPhase.lunarDay}`} />
                </div>

                {/* ── 10-Section Decision Report ── */}
                <div className="space-y-2.5">
                  {analysis.report.map((sec, idx) => (
                    <ReportSection key={idx} section={sec} />
                  ))}
                </div>

                {/* ── Manuscript References ── */}
                {analysis.bookNotes.length > 0 && (
                  <div className="rounded-xl p-3" style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.20)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4" style={{ color: "rgba(74,222,128,0.70)" }} />
                      <h4 className="font-inter text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(74,222,128,0.70)" }}>
                        Manuscript References
                      </h4>
                    </div>
                    <div className="space-y-1">
                      {analysis.bookNotes.map((n, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="font-inter text-[9px] px-1.5 py-0.5 rounded flex-shrink-0" style={{
                            background: "rgba(74,222,128,0.10)", color: "rgba(74,222,128,0.60)", border: "1px solid rgba(74,222,128,0.20)",
                          }}>{n.source}</span>
                          <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.50)" }}>{n.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Reasoning Log (collapsible) ── */}
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

                {/* ── Footer ── */}
                <div className="text-center pt-2">
                  <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.30)" }}>
                    This analysis is read-only and does not modify any Mizan calculation. All recommendations are derived from existing manuscript rules and live astronomical data.
                  </p>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Collapsed Summary ── */}
        {!expanded && (
          <div className="px-4 pb-3 flex items-center gap-3 flex-wrap">
            <MiniBadge label="Ritual" value={analysis.ritualType} color={G.text} />
            <MiniBadge label="Today" value={analysis.canPerformToday} color={canPerformColor} />
            <MiniBadge label="Verdict" value={`${analysis.verdictStarsString} ${analysis.verdict}`} color={analysis.verdictColor} />
            <MiniBadge label="Confidence" value={`${analysis.confidenceScore}%`} color={G.text} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Report Section ──
function ReportSection({ section }) {
  const [open, setOpen] = useState(section.section === "FINAL DECISION");
  const Icon = SECTION_ICONS[section.icon] || BookOpen;
  const isFinal = section.section === "FINAL DECISION";
  const statusColor = isFinal ? section.color : (section.status === "Yes" || section.status === "Suitable" ? "#4ADE80" : section.status === "Limited" || section.status === "Not suitable" ? "#FBBF24" : section.status === "No" ? "#F87171" : G.text);

  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: isFinal ? "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.03) 100%)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${isFinal ? G.borderHi : "rgba(212,175,55,0.20)"}`,
      boxShadow: isFinal ? "0 0 24px rgba(212,175,55,0.15)" : "none",
    }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-3 text-left">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{
          background: isFinal ? "linear-gradient(135deg, rgba(212,175,55,0.22), rgba(212,175,55,0.08))" : G.bg,
          border: `1px solid ${isFinal ? G.borderHi : G.border}`,
        }}>
          <Icon className="w-4 h-4" style={{ color: G.text }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-inter text-sm font-bold uppercase tracking-wide" style={{ color: isFinal ? G.text : "#fff" }}>
              {section.section}
            </h4>
          </div>
          <p className="font-inter text-xs leading-snug mt-0.5" style={{ color: statusColor }}>
            {isFinal ? `${section.stars} — ${section.status}` : section.status}
          </p>
        </div>
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
            <div className="px-3 pb-3 pl-14 space-y-2.5">
              <p className="font-inter text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
                {section.body}
              </p>

              {/* Today's Windows — star-rated list */}
              {section.windows && section.windows.length > 0 && (
                <ReportWindowsList windows={section.windows} />
              )}

              {/* Best Time — ranked 1st/2nd/3rd */}
              {section.ranked && section.ranked.length > 0 && (
                <div className="space-y-1.5">
                  {section.ranked.map((w) => (
                    <div key={w.rank} className="rounded-lg p-2.5" style={{
                      background: w.rank === 1 ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${w.rank === 1 ? "rgba(74,222,128,0.30)" : "rgba(212,175,55,0.18)"}`,
                    }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-inter text-[10px] font-bold uppercase tracking-wider" style={{ color: w.rank === 1 ? "#86EFAC" : G.dim }}>
                          {w.rank === 1 ? "🥇 Best" : w.rank === 2 ? "🥈 Second" : "🥉 Third"}
                        </span>
                        <span className="font-inter text-sm font-bold" style={{ color: G.text }}>{w.stars}</span>
                      </div>
                      <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{w.time} · {w.planet}</p>
                      <p className="font-inter text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.60)" }}>{w.reason}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Bad Times — avoid list */}
              {section.avoid && section.avoid.length > 0 && (
                <div className="space-y-1">
                  {section.avoid.map((w, i) => (
                    <div key={i} className="rounded-lg p-2 flex items-center gap-2" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.20)" }}>
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(248,113,113,0.70)" }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-inter text-xs font-bold" style={{ color: "rgba(248,113,113,0.90)" }}>{w.time} · {w.planet}</p>
                        <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>{w.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Enemy analysis */}
              {section.enemyAnalysis && section.enemyAnalysis.note && (
                <div className="rounded-lg p-2.5" style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)" }}>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <EnemyItem label="Enemy Hours" values={section.enemyAnalysis.enemyHours} />
                    <EnemyItem label="Enemy Days" values={section.enemyAnalysis.enemyDays} />
                    <EnemyItem label="Enemy Moon" values={section.enemyAnalysis.enemyMoonPhases} />
                    <EnemyItem label="Enemy Rulers" values={section.enemyAnalysis.enemyRulers} />
                  </div>
                </div>
              )}

              {/* Next opportunity */}
              {section.nextHour && (
                <div className="rounded-lg p-2.5" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.20)" }}>
                  <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.70)" }}>
                    <span className="font-bold" style={{ color: "#86EFAC" }}>Next hour:</span> {section.nextHour.day}{section.nextHour.isToday ? " (today)" : ` (${section.nextHour.daysAhead}d away)`} at {section.nextHour.time} ({section.nextHour.planet})
                  </p>
                </div>
              )}
              {section.nextMoonPhase && (
                <div className="rounded-lg p-2.5" style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.20)" }}>
                  <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.70)" }}>
                    <span className="font-bold" style={{ color: "rgba(96,165,250,0.90)" }}>Next moon:</span> {section.nextMoonPhase.phase}{section.nextMoonPhase.waitDays > 0 ? ` (~${section.nextMoonPhase.waitDays}d to wait)` : " (available now)"}
                  </p>
                  <p className="font-inter text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.50)" }}>{section.nextMoonPhase.reason}</p>
                </div>
              )}

              {/* Manuscript rules list */}
              {section.rules && section.rules.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {section.rules.map((r, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-inter text-[9px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5" style={{
                        background: G.bgHi, color: G.dim, border: `1px solid ${G.border}`,
                      }}>{r.id}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.60)" }}>{r.desc}</p>
                        <p className="font-inter text-[9px]" style={{ color: G.dim }}>{r.source}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Warnings list */}
              {section.warnings && section.warnings.length > 0 && (
                <div className="space-y-1">
                  {section.warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-lg p-2" style={{ background: "rgba(248,113,113,0.06)" }}>
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(248,113,113,0.70)" }} />
                      <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.65)" }}>{w}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Conflicts */}
              {section.conflicts && section.conflicts.length > 0 && (
                <div className="space-y-1">
                  {section.conflicts.map((c, i) => (
                    <div key={i} className="rounded-lg p-2" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.20)" }}>
                      <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.65)" }}>
                        <span className="font-bold" style={{ color: "#FBBF24" }}>Conflict:</span> {c.rule1} vs {c.rule2}
                      </p>
                      <p className="font-inter text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.50)" }}>Resolution: {c.resolution}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Citation + consequence */}
              <div className="flex items-start gap-2 pt-1">
                <BookOpen className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(74,222,128,0.60)" }} />
                <div>
                  <span className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color: "rgba(74,222,128,0.60)" }}>Source: </span>
                  <span className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.50)" }}>{section.citation}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(248,113,113,0.60)" }} />
                <div>
                  <span className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color: "rgba(248,113,113,0.60)" }}>If ignored: </span>
                  <span className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.50)" }}>{section.consequence}</span>
                </div>
              </div>
            </div>
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

function StatusChip({ icon, label, value, color }) {
  return (
    <div className="rounded-lg px-2.5 py-2" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(212,175,55,0.20)` }}>
      <div className="flex items-center gap-1 mb-0.5">
        <div style={{ color: G.dim }}>{icon}</div>
        <p className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>{label}</p>
      </div>
      <p className="font-inter text-xs font-bold truncate" style={{ color: color || "#fff" }}>{value}</p>
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