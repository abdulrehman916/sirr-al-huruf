import { useMemo } from "react";
import { motion } from "framer-motion";
import { runMizaanPostPipeline, getBastLevel } from "../../lib/mizaanPostEngine";
import SatrVahidGrouping from "./SatrVahidGrouping";

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

export default function MizaanPipelineFull({ grandBast, grandLetters, dominant }) {
  const pipeline = useMemo(() => {
    if (!grandBast || grandBast <= 0) return null;
    return runMizaanPostPipeline({ grandBast, grandLetters, dominant });
  }, [grandBast, grandLetters, dominant]);

  if (!pipeline) return null;

  const { initialSeedLetters, vefk, vefkSourceNumber } = pipeline;
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
            
            {/* Vefk Source Number Verification */}
            <div className="mb-4 rounded-lg border p-3" style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
              <div className="font-inter text-[7px] uppercase tracking-wider mb-2" style={{ color: G.dim }}>Vefk Source — Sacred Total from 9 Mizans</div>
              <div className="space-y-2 text-[8px]">
                <div className="px-3 py-2 rounded bg-black/30 mb-2 border" style={{ borderColor: G.goldBorder + "60" }}>
                  <div className="font-inter text-[7px] uppercase tracking-wider mb-1" style={{ color: G.dim }}>Manuscript Rule</div>
                  <div className="text-[7px]" style={{ color: G.goldDim }}>
                    The Vefk Source Number is the grand total from the 9 Mizans (12,165 for "الله"). This sacred total becomes the Magic Constant directly.
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1 border-t" style={{ borderColor: G.goldBorder + "60" }}>
                  <span style={{ color: G.dim }}>Vefk Source Number (S):</span>
                  <span className="font-bold tabular-nums" style={{ color: G.gold }}>{vefk.S?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t" style={{ borderColor: G.goldBorder + "60" }}>
                  <span style={{ color: G.dim }}>Magic Constant (mc):</span>
                  <span className="font-bold tabular-nums" style={{ color: vefk.mc === vefk.S ? "#4ADE80" : "#F87171" }}>{vefk.mc?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: G.goldBorder + "60" }}>
                  <span style={{ color: G.dim }}>Verification:</span>
                  <span className="font-bold" style={{ color: vefk.mc === vefk.S ? "#4ADE80" : "#F87171" }}>
                    {vefk.mc === vefk.S ? "✓ PERFECT MAGIC SQUARE" : "✗ MISMATCH"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{elementMeta.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-amiri text-lg" style={{ color: elementMeta.color }}>{elementMeta.arabic}</span>
                  <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>({element})</span>
                </div>
              </div>
            </div>

            {/* Letters Used for Vefk */}
            <div className="mb-4 rounded-lg border p-3" style={{ background: G.bgInner, borderColor: elementMeta.color + "40" }}>
              <div className="font-inter text-[7px] uppercase tracking-wider mb-2" style={{ color: G.dim }}>ALL EXPANDED LETTERS (Step 3)</div>
              <div className="flex flex-wrap gap-1 mb-2" style={{ direction: "rtl" }}>
                {pipeline.allExpandedLetters?.map((l, i) => (
                  <span key={i} className="font-amiri text-lg font-bold px-2 py-1 rounded"
                    style={{ background: elementMeta.color + "15", color: elementMeta.color, border: `1px solid ${elementMeta.color}40` }}>
                    {l}
                  </span>
                )) || <span style={{ color: G.dim }}>—</span>}
              </div>
              <div className="text-[7px]" style={{ color: G.dim }}>
                Total: {pipeline.expandedLettersCount || 0} letters from Bast expansions
              </div>
            </div>

            {/* Expanded Letters Value Breakdown */}
            <div className="mb-4 rounded-lg border p-3" style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
              <div className="font-inter text-[7px] uppercase tracking-wider mb-2" style={{ color: G.dim }}>ALL EXPANDED LETTERS — Step 3 Derivation</div>
              <div className="mb-2 px-2 py-1.5 rounded text-[7px]" style={{ background: G.bgInner, borderColor: G.goldBorder + "60", border: "1px solid" }}>
                <span style={{ color: G.dim }}>These {pipeline.allExpandedLetters?.length || 0} letters derived from Vefk Source ({vefk.S?.toLocaleString()})</span>
              </div>
              <div className="space-y-1.5">
                {pipeline.allExpandedLetters?.map((letter, idx) => {
                  const bastValue = getBastLevel(letter, 1);
                  return (
                    <div key={idx} className="flex items-center justify-between text-[8px]">
                      <div className="flex items-center gap-2">
                        <span className="font-inter text-[7px] uppercase" style={{ color: G.dim }}>Letter {idx + 1}</span>
                        <span className="font-amiri text-lg font-bold px-2 py-0.5 rounded"
                          style={{ background: elementMeta.color + "15", color: elementMeta.color, border: `1px solid ${elementMeta.color}40` }}>
                          {letter}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-inter text-[7px]" style={{ color: G.dim }}>First Bast:</span>
                        <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.gold }}>{bastValue.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                }) || <span style={{ color: G.dim }}>—</span>}
              </div>
              
              {/* Sum of Expanded Letters */}
              <div className="mt-3 pt-3 border-t" style={{ borderColor: G.goldBorder + "60" }}>
                <div className="flex items-center justify-between">
                  <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>Sum of Expanded Letters:</span>
                  <span className="font-inter text-lg font-bold tabular-nums" style={{ color: G.gold }}>
                    {pipeline.expandedLettersTotal?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="text-[7px] mt-1" style={{ color: G.dim }}>
                  Note: Vefk Source = {vefk.S?.toLocaleString()} (from 9 Mizans). Expanded letters sum = {pipeline.expandedLettersTotal?.toLocaleString()}.
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

            {/* Vefk Summary */}
            <div className="rounded-lg border p-3" style={{ background: G.bgInner, borderColor: elementMeta.color + "40" }}>
              <div className="font-inter text-[7px] uppercase tracking-wider mb-2" style={{ color: G.dim }}>Vefk Verification</div>
              <div className="grid grid-cols-2 gap-2 text-[8px]">
                <div className="flex justify-between">
                  <span style={{ color: G.dim }}>Source Number:</span>
                  <span className="font-bold tabular-nums" style={{ color: G.gold }}>{vefk.S?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: G.dim }}>Magic Constant:</span>
                  <span className="font-bold tabular-nums" style={{ color: G.gold }}>{vefk.mc?.toLocaleString() || 0}</span>
                </div>
                {vefk.validation?.details?.rows.map((row, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span style={{ color: G.dim }}>Row {idx + 1}:</span>
                    <span className="font-bold tabular-nums" style={{ color: row.valid ? "#4ADE80" : "#F87171" }}>{row.sum.toLocaleString()}</span>
                  </div>
                ))}
                {vefk.validation?.details?.cols.map((col, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span style={{ color: G.dim }}>Column {idx + 1}:</span>
                    <span className="font-bold tabular-nums" style={{ color: col.valid ? "#4ADE80" : "#F87171" }}>{col.sum.toLocaleString()}</span>
                  </div>
                ))}
                {vefk.validation?.details?.diagonals.map((diag, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span style={{ color: G.dim }}>Diagonal {diag.name === 'main' ? 'A' : 'B'}:</span>
                    <span className="font-bold tabular-nums" style={{ color: diag.valid ? "#4ADE80" : "#F87171" }}>{diag.sum.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}