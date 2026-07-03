// ═══════════════════════════════════════════════════════════════
// RITUAL DECISION ENGINE — Expert Consultation Panel (Read-only)
// Attached below all four Mizan methods. NEVER modifies Mizan logic.
// Renders a flowing expert spiritual consultation, not a data table.
// ═══════════════════════════════════════════════════════════════
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Sparkles, BookOpen, AlertTriangle, Clock,
  Moon, Compass, Star, Sun, Sunset, Zap, Shield, CheckCircle2,
  XCircle, AlertCircle, FileText, Scroll,
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

// Map consultation point number → icon
const POINT_ICONS = {
  1: CheckCircle2, 2: AlertCircle, 3: Clock, 4: Clock, 5: Star, 6: XCircle,
  7: Moon, 8: Moon, 9: Sun, 10: Sun, 11: Sparkles, 12: Zap, 13: CheckCircle2,
  14: AlertTriangle, 15: AlertTriangle, 16: Sunset, 17: Compass, 18: Star,
  19: Sparkles, 20: Shield, 21: AlertTriangle, 22: Scroll, 23: Sunset,
};

export default function RitualDecisionEngine({ result, selections, customPurpose, activeMethod }) {
  const [expanded, setExpanded] = useState(true);

  const analysis = useMemo(() => {
    if (!result) return null;
    return analyzeRitualTiming({ result, selections, customPurpose, activeMethod });
  }, [result, selections, customPurpose, activeMethod]);

  if (!analysis || !analysis.consultation) return null;

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
                Intelligent Ritual Decision Engine
              </h3>
              <p className="font-amiri text-sm" style={{ color: G.dim }}>
                محرك القرار الروحاني الذكي
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{
              background: `${analysis.verdictColor}15`, border: `1px solid ${analysis.verdictColor}50`,
            }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: analysis.verdictColor }} />
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
                      The Consultation
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
                  <StatusChip icon={<CheckCircle2 className="w-3.5 h-3.5" />} label="Today" value={analysis.canPerformToday} color={canPerformColor} />
                  <StatusChip icon={<Clock className="w-3.5 h-3.5" />} label="Hour" value={`#${analysis.astroClockStatus.currentHour.number} ${analysis.astroClockStatus.currentHour.planet}`} />
                  <StatusChip icon={<Moon className="w-3.5 h-3.5" />} label="Moon" value={`Day ${analysis.moonPhase.lunarDay}`} />
                </div>

                {/* ── 23-Point Consultation ── */}
                <div className="space-y-2.5">
                  {analysis.consultation.map((point) => {
                    const Icon = POINT_ICONS[point.n] || BookOpen;
                    return (
                      <ConsultationPoint key={point.n} point={point} Icon={Icon} />
                    );
                  })}
                </div>

                {/* ── Manuscript Rules Applied ── */}
                {analysis.rulesApplied.length > 0 && (
                  <div className="rounded-xl p-3" style={{
                    background: "rgba(255,255,255,0.02)", border: `1px solid ${G.border}`,
                  }}>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4" style={{ color: G.text }} />
                      <h4 className="font-inter text-xs font-bold uppercase tracking-wider" style={{ color: G.text }}>
                        Manuscript Rules Applied ({analysis.rulesApplied.length})
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {analysis.rulesApplied.map((r, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="font-inter text-[9px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5" style={{
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
                  </div>
                )}

                {/* ── Manuscript References ── */}
                {analysis.bookNotes.length > 0 && (
                  <div className="rounded-xl p-3" style={{
                    background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.20)",
                  }}>
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
                          }}>
                            {n.source}
                          </span>
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
            <MiniBadge label="Verdict" value={analysis.verdict} color={analysis.verdictColor} />
            <MiniBadge label="Confidence" value={`${analysis.confidenceScore}%`} color={G.text} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Single consultation point ──
function ConsultationPoint({ point, Icon }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: "rgba(255,255,255,0.02)", border: `1px solid rgba(212,175,55,0.20)`,
    }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{
          background: G.bg, border: `1px solid ${G.border}`,
        }}>
          <Icon className="w-4 h-4" style={{ color: G.text }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-inter text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
              background: G.bgHi, color: G.dim, border: `1px solid ${G.border}`,
            }}>
              {String(point.n).padStart(2, "0")}
            </span>
            <h4 className="font-inter text-sm font-semibold" style={{ color: "#fff" }}>{point.title}</h4>
          </div>
          <p className="font-inter text-xs leading-snug mt-1 line-clamp-2" style={{ color: "rgba(255,255,255,0.55)" }}>
            {point.body}
          </p>
        </div>
        <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform" style={{
          color: G.dim, transform: open ? "rotate(180deg)" : "none",
        }} />
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
            <div className="px-3 pb-3 pl-14 space-y-2">
              <p className="font-inter text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                {point.body}
              </p>
              <div className="flex items-start gap-2 pt-1">
                <BookOpen className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(74,222,128,0.60)" }} />
                <div>
                  <span className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color: "rgba(74,222,128,0.60)" }}>Source: </span>
                  <span className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.50)" }}>{point.citation}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(248,113,113,0.60)" }} />
                <div>
                  <span className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color: "rgba(248,113,113,0.60)" }}>If ignored: </span>
                  <span className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.50)" }}>{point.consequence}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Status chip (quick glance) ──
function StatusChip({ icon, label, value, color }) {
  return (
    <div className="rounded-lg px-2.5 py-2" style={{
      background: "rgba(255,255,255,0.03)", border: `1px solid rgba(212,175,55,0.20)`,
    }}>
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