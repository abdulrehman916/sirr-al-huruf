import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { runMizaanPostPipeline, getBastLevel } from "../../lib/mizaanPostEngine";
import SatrVahidGrouping from "./SatrVahidGrouping";
import { ChevronDown, ChevronRight } from "lucide-react";

const G = {
  gold:     "#F5D060",
  goldDim:  "rgba(245,208,96,0.55)",
  goldFaint:"rgba(212,175,55,0.07)",
  goldBorder:"rgba(212,175,55,0.40)",
  goldBorderHi:"rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.18)",
  bg:       "rgba(3,6,20,0.99)",
  bgCard:   "rgba(8,16,40,0.98)",
  bgInner:  "rgba(212,175,55,0.06)",
  dim:      "rgba(255,255,255,0.35)",
};

const ELEMENT_META = {
  fire:  { arabic: "النار",  icon: "🔥", color: "#FF6B35" },
  earth: { arabic: "التراب", icon: "🌍", color: "#A5C880" },
  air:   { arabic: "الهواء", icon: "🌪",  color: "#B2EBF2" },
  water: { arabic: "الماء",  icon: "💧", color: "#4FC3F7" },
};

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
          {arabic && <span className="font-amiri text-sm" style={{ color: G.goldDim }}>{arabic}</span>}
        </div>
      </div>
      <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(to right, ${color}40, transparent)` }} />
    </div>
  );
}

function Card({ children, accent }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background: G.bgCard,
        borderColor: accent ? accent + "55" : G.goldBorder,
        borderLeft: accent ? `3px solid ${accent}` : undefined,
        boxShadow: `0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.05)`,
      }}
    >
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

function ExpandedLetterValues({ allExpandedLetters, elementColor }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const safeLetters = Array.isArray(allExpandedLetters) ? allExpandedLetters : [];
  
  return (
    <div className="mt-3 pt-3 border-t" style={{ borderColor: G.goldBorder + "40" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-1.5 text-[7px] uppercase tracking-wider font-bold hover:opacity-70 transition-opacity"
        style={{ color: G.dim }}
      >
        {isOpen ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
        Expanded Letter Values
      </button>
      {isOpen && (
        <div className="mt-2 space-y-1">
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[6px] font-inter" style={{ color: G.dim }}>
            {safeLetters.map((letter, idx) => {
              const bastVal = getBastLevel(letter, 1) || 0;
              return (
                <div key={idx} className="contents">
                  <span className="text-right font-amiri" style={{ color: elementColor }}>{letter}</span>
                  <span className="tabular-nums" style={{ color: G.dim }}>{bastVal.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
          {safeLetters.length > 0 && (
            <div className="mt-1.5 pt-1.5 border-t text-center" style={{ borderColor: G.goldBorder + "30" }}>
              <span className="text-[6px]" style={{ color: G.dim }}>Total: </span>
              <span className="text-[8px] font-bold tabular-nums" style={{ color: elementColor }}>
                {safeLetters.reduce((sum, l) => sum + (getBastLevel(l, 1) || 0), 0).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SourceSection({ grandBast, expandedLettersTotal, elementColor }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mt-3 pt-3 border-t" style={{ borderColor: G.goldBorder + "40" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-1.5 text-[7px] uppercase tracking-wider font-bold hover:opacity-70 transition-opacity"
        style={{ color: G.dim }}
      >
        {isOpen ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
        Source
      </button>
      {isOpen && (
        <div className="mt-2 text-center space-y-1.5">
          <div className="text-[7px]" style={{ color: G.dim }}>Pipeline</div>
          <div className="text-[6px] px-2" style={{ color: G.dim }}>
            9 Mizan Grand Total = {grandBast?.toLocaleString() || 0}
          </div>
          <div className="text-[6px]" style={{ color: G.dim }}>↓</div>
          <div className="text-[7px] px-2 py-1.5 rounded font-bold" style={{ background: G.bgInner, color: elementColor }}>
            Vefk Source (Expanded Letters Total) = {expandedLettersTotal?.toLocaleString() || 0}
          </div>
          <div className="text-[6px] px-2" style={{ color: G.dim }}>
            Sum of all expanded letters' First Bast values
          </div>
        </div>
      )}
    </div>
  );
}

export default function MizaanPipelineFull({ grandBast, grandLetters, dominant }) {
  const pipeline = useMemo(() => {
    if (!grandBast || grandBast <= 0) return null;
    return runMizaanPostPipeline({ grandBast, grandLetters, dominant });
  }, [grandBast, grandLetters, dominant]);

  if (!pipeline) return null;

  const { initialSeedLetters, vefk, vefkSourceNumber, allExpandedLetters } = pipeline;
  const element = dominant || "fire";
  const elementMeta = ELEMENT_META[element] || ELEMENT_META.fire;

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
          <span className="font-inter text-[9px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>Option 1 — Esma-i Kitabet</span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <h2 className="font-amiri text-2xl font-bold" style={{ color: G.gold }}>أسماء الكتابة</h2>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>Manuscript Derivation → Vefk</p>
      </div>

      <OrnamentalDivider />

      <div className="px-4 pb-6 space-y-5 pt-4">

        {/* COMPLETE MANUSCRIPT DERIVATION CHAIN */}
        <SatrVahidGrouping
          satrVahidLetters={initialSeedLetters}
          dominant={dominant}
        />

        {/* VEFK MAGIC SQUARE */}
        {vefk && (
          <Card accent={elementMeta.color}>
            <SectionHeader step="5" label="Vefk Magic Square" arabic="الوفق" color={elementMeta.color} />
            
            {/* Element Info */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{elementMeta.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-amiri text-lg" style={{ color: elementMeta.color }}>{elementMeta.arabic}</span>
                  <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>({element})</span>
                </div>
              </div>
            </div>

            {/* Vefk Grid */}
            <div className="grid grid-cols-4 gap-1.5 max-w-xs mx-auto mb-4">
              {vefk.grid.flat().map((val, idx) => (
                <div key={idx}
                  className="aspect-square flex items-center justify-center rounded-lg border font-inter text-sm font-bold tabular-nums"
                  style={{
                    background: idx % 2 === 0 ? G.goldFaint : G.bgInner,
                    borderColor: elementMeta.color + "55",
                    color: elementMeta.color,
                  }}>
                  {val.toLocaleString()}
                </div>
              ))}
            </div>

            {/* Magic Constant Summary */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border"
                style={{ background: G.goldFaint, borderColor: elementMeta.color + "40" }}>
                <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Magic Constant</span>
                <span className="font-inter text-sm font-bold tabular-nums" style={{ color: elementMeta.color }}>{vefk.mc?.toLocaleString() || 0}</span>
              </div>
              
              {/* Expanded Letter Values */}
              <ExpandedLetterValues allExpandedLetters={allExpandedLetters} elementColor={elementMeta.color} />
              
              {/* Source Explanation */}
              <SourceSection grandBast={grandBast} expandedLettersTotal={allExpandedLetters.reduce((sum, letter) => sum + (getBastLevel(letter, 1) || 0), 0)} elementColor={elementMeta.color} />
            </div>
          </Card>
        )}

      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}