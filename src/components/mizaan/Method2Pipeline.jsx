// ═══════════════════════════════════════════════════════════════
// METHOD 2 PIPELINE: "Adetlerin Bastı" — Complete Workflow
// ─────────────────────────────────────────────────────────────
// Implements Method 2 from PDF pages 4-11:
// - Cumulative total carry-forward (Kitabet → A'van → Kasem)
// - Remainder handling (keep for next stage, special Kasem completion)
// - Bast level selection (4th/5th based on Zevc/Ferd at EACH stage)
// - Divine Names calculation (sum of all three totals)
// - Keyword Subtraction alternative path (Ayil/Yushin)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { runMethod2Pipeline } from "../../lib/mizaanMethod2Engine";
import { getBastLevel } from "../../lib/mizaanPostEngine";

// ── Design tokens ────────────────────────────────────────────────
const G = {
  gold:         "#F5D060",
  goldDim:      "rgba(245,208,96,0.55)",
  goldFaint:    "rgba(212,175,55,0.07)",
  goldBorder:   "rgba(212,175,55,0.40)",
  goldBorderHi: "rgba(212,175,55,0.65)",
  glow:         "rgba(212,175,55,0.18)",
  bg:           "rgba(3,6,20,0.99)",
  bgCard:       "rgba(8,16,40,0.98)",
  bgInner:      "rgba(212,175,55,0.06)",
  green:        "#4ADE80",
  greenDim:     "rgba(74,222,128,0.15)",
  red:          "#F87171",
  dim:          "rgba(255,255,255,0.35)",
};

const ELEMENT_COLORS = {
  fire:  { color: "#FF6B35", arabic: "النار",  icon: "🔥" },
  earth: { color: "#A5C880", arabic: "التراب", icon: "🌍" },
  air:   { color: "#B2EBF2", arabic: "الهواء", icon: "🌪" },
  water: { color: "#4FC3F7", arabic: "الماء",  icon: "💧" },
};

// ── Sub-components ───────────────────────────────────────────────

function SectionHeader({ step, label, arabic, color = G.gold }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg font-inter text-xs font-black flex-shrink-0"
        style={{ background: color + "22", border: `1px solid ${color}55`, color }}>
        {step}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-inter text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color }}>{label}</span>
          {arabic && <span className="font-amiri text-base" style={{ color: G.goldDim, lineHeight: 1.8, textRendering: "optimizeLegibility", WebkitFontSmoothing: "antialiased" }}>{arabic}</span>}
        </div>
      </div>
      <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(to right, ${color}40, transparent)` }} />
    </div>
  );
}

function Card({ children, accent }) {
  return (
    <div className="rounded-xl border p-4"
      style={{
        background: G.bgCard,
        borderColor: accent ? accent + "55" : G.goldBorder,
        borderLeft: accent ? `3px solid ${accent}` : undefined,
        boxShadow: `0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.05)`,
      }}>
      {children}
    </div>
  );
}

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${G.goldBorder})` }} />
      <span style={{ color: G.goldDim, fontSize: 10 }}>✦</span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${G.goldBorder})` }} />
    </div>
  );
}

function LetterCell({ letter, index, color = G.gold, size = "lg", showIndex = false }) {
  const sizes = { sm: "text-xl px-2.5 py-1.5", lg: "text-3xl px-4 py-2.5", xl: "text-4xl px-5 py-3" };
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`font-amiri font-bold rounded-lg border ${sizes[size]}`}
        style={{
          color,
          borderColor: color + "55",
          background: color + "12",
          lineHeight: 1.8,
          display: "inline-block",
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
        }}>
        {letter}
      </span>
      {showIndex && (
        <span className="font-inter text-[8px] tabular-nums" style={{ color: G.dim }}>{index + 1}</span>
      )}
    </div>
  );
}

function LetterRow({ letters, color = G.gold, size = "lg", showIndex = false, rtl = false }) {
  if (!letters || letters.length === 0) return (
    <span className="font-inter text-xs italic" style={{ color: G.dim }}>—</span>
  );
  return (
    <div className="flex flex-wrap gap-2.5 items-center" style={{ direction: rtl ? "rtl" : "ltr" }}>
      {letters.map((l, i) => (
        <LetterCell key={i} letter={l} index={i} color={color} size={size} showIndex={showIndex} />
      ))}
    </div>
  );
}

function Arrow({ label }) {
  return (
    <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
      <span className="font-inter text-base" style={{ color: G.goldDim }}>→</span>
      {label && <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>{label}</span>}
    </div>
  );
}

function CollapsibleSource({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mt-3 pt-3 border-t" style={{ borderColor: G.goldBorder + "40" }}>
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-1.5 text-[7px] uppercase tracking-wider font-bold hover:opacity-70 transition-opacity"
        style={{ color: G.dim }}>
        {isOpen ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
        {title}
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
}

// ── ESMA-I KITABET SECTION ──────────────────────────────────────
function EsmaKitabetSection({ mizanulMevazin, dominant, getBastLevelFn, onVefkReady }) {
  const result = useMemo(() => {
    return runMethod2Pipeline({ mizanulMevazin, dominant, getBastLevelFn });
  }, [mizanulMevazin, dominant, getBastLevelFn]);

  const kitabet = result?.kitabet;
  const elementMeta = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;

  if (!kitabet) return null;

  return (
    <Card accent={elementMeta.color}>
      <SectionHeader step="1" label="Esma-i Kitabet" arabic="أسماء الكتابة" color={elementMeta.color} />

      {/* Element Info */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{elementMeta.icon}</span>
        <div className="flex items-center gap-2">
          <span className="font-amiri text-lg" style={{ color: elementMeta.color }}>{elementMeta.arabic}</span>
          <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>({dominant})</span>
        </div>
      </div>

      {/* Seed Letters */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          Seed Letters (Istintaq of Mizanül Mevazin)
        </div>
        <LetterRow letters={kitabet.seedLetters} color={elementMeta.color} size="xl" rtl />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>
          Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{kitabet.seedLetters.length}</span>
          <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
          <span style={{ color: kitabet.isFerd ? G.red : G.green, fontWeight: "bold" }}>
            {kitabet.isFerd ? "FERD (فرد)" : "ZEVC (زوج)"}
          </span>
          <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
          <span style={{ color: G.goldDim }}>
            Bast Level: <span style={{ color: G.gold }}>{kitabet.bastLevel}th</span>
          </span>
        </div>
      </div>

      {/* Individual Bast Derivations */}
      <div className="space-y-2 mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>
          Individual Bast Derivations (Reverse Order)
        </div>
        {kitabet.derivations.map((d, idx) => (
          <div key={idx} className="rounded-lg border p-2 flex items-center gap-2 flex-wrap"
            style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
            <LetterCell letter={d.originalLetter} color={elementMeta.color} size="sm" />
            <Arrow label={`B${d.bastLevel}`} />
            <div className="px-2 py-1 rounded text-xs font-bold tabular-nums"
              style={{ background: G.greenDim, borderColor: G.green + "40", color: G.green }}>
              {d.bastValue.toLocaleString()}
            </div>
            <Arrow label="→" />
            <div className="flex items-center gap-1" style={{ direction: "rtl" }}>
              {d.expandedLetters.map((l, i) => (
                <LetterCell key={i} letter={l} color={G.green} size="sm" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* All Expanded Letters */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          All Expanded Letters ({kitabet.allExpandedLetters.length} total)
        </div>
        <LetterRow letters={kitabet.allExpandedLetters} color={G.gold} size="lg" rtl showIndex />
      </div>

      {/* Group Formation */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          Group Formation → Esma-i Kitabet Names
        </div>
        <div className="space-y-2">
          {kitabet.groups.map((group, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border"
              style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
              <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.dim }}>
                {group.groupNumber}.
              </span>
              <LetterRow letters={group.letters} color={G.gold} size="lg" rtl />
              <Arrow label="→" />
              <span className="font-amiri text-2xl font-bold px-3 py-1.5 rounded-lg border flex-1 text-center"
                style={{
                  color: G.gold,
                  borderColor: G.goldBorder,
                  background: G.bgInner,
                  lineHeight: 1.8,
                }} dir="rtl">
                {group.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Remainder */}
      {kitabet.remainder && kitabet.remainder.length > 0 && (
        <div className="mb-4 px-3 py-2 rounded-lg border"
          style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
          <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            Remainder (Carried to A'van Stage)
          </div>
          <LetterRow letters={kitabet.remainder} color={G.goldDim} size="lg" rtl />
        </div>
      )}

      {/* Total Calculation */}
      <div className="rounded-lg border p-3 text-center"
        style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          Esma-i Kitabet Total
        </div>
        <div className="text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>
          {kitabet.total.toLocaleString()}
        </div>
        <CollapsibleSource title="Source Breakdown">
          <div className="text-[6px] space-y-1">
            <div>Last Name B1 + Dominant B1 + Mizanül Mevazin</div>
          </div>
        </CollapsibleSource>
      </div>
    </Card>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────────────
export default function Method2Pipeline({ grandBast, dominant, onVefkReady, getBastLevelFn = getBastLevel }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  const mizanulMevazin = useMemo(() => {
    const mahrac = grandBast.toString().length;
    return grandBast + mahrac;
  }, [grandBast]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const pipelineResult = runMethod2Pipeline({ mizanulMevazin, dominant, getBastLevelFn });
      setResult(pipelineResult);
      setLoading(false);
      if (onVefkReady && pipelineResult?.kitabet) {
        onVefkReady({ vefk: null, source: pipelineResult.kitabet.total, names: pipelineResult.kitabet.names });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [mizanulMevazin, dominant, getBastLevelFn, onVefkReady]);

  if (loading) {
    return (
      <div className="rounded-2xl border p-8 text-center" style={{
        background: G.bg,
        borderColor: G.goldBorder,
      }}>
        <div className="w-12 h-12 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-inter text-sm" style={{ color: G.goldDim }}>Calculating Method 2 Pipeline…</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background: G.bg,
        borderColor: G.goldBorderHi,
        boxShadow: `0 0 80px ${G.glow}, 0 0 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}
    >
      {/* Top accent line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />

      {/* Title Banner */}
      <div className="text-center px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-3"
          style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>Method 2 — Adetlerin Bastı</span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <h2 className="font-amiri text-xl font-bold" style={{ color: G.gold, lineHeight: 1.7, textRendering: "optimizeLegibility", WebkitFontSmoothing: "antialiased" }}>أعدادات البسط</h2>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>Cumulative Total Carry-Forward Workflow</p>
      </div>

      <OrnamentalDivider />

      <div className="px-4 pb-6 space-y-5 pt-4">
        {/* Esma-i Kitabet */}
        <EsmaKitabetSection
          mizanulMevazin={mizanulMevazin}
          dominant={dominant}
          getBastLevelFn={getBastLevelFn}
          onVefkReady={onVefkReady}
        />

        {/* Esma-i A'van */}
        {/* Esma-i Kasem */}
        {/* Divine Names */}
        {/* Keyword Subtraction (Alternative) */}

      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}