import { useMemo } from "react";
import { motion } from "framer-motion";
import { runMizaanPostPipeline } from "../../lib/mizaanPostEngine";
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
  green:    "#4ADE80",
  greenDim: "rgba(74,222,128,0.15)",
  red:      "#F87171",
  redDim:   "rgba(248,113,113,0.15)",
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

  const { input, initialSeedLetters, vefk, kitabet, expandedLettersSum } = pipeline;
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
          <span className="font-inter text-[9px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>OPTION 1 — Complete Pipeline</span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <h2 className="font-amiri text-2xl font-bold" style={{ color: G.gold }}>الحاصل النهائي</h2>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>Final Sacred Calculation → Pipeline Stages</p>
      </div>

      <OrnamentalDivider />

      <div className="px-4 pb-6 space-y-5 pt-4">

        {/* PIPELINE INPUT */}
        <Card accent={G.gold}>
          <SectionHeader step="0" label="Pipeline Input" arabic="مدخلات" color={G.gold} />
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg border"
              style={{ background: G.bgInner, borderColor: G.goldBorder }}>
              <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Grand Bast (Σ 9 Mizans)</span>
              <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.gold }}>{input.grandBast.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded-lg border"
              style={{ background: G.bgInner, borderColor: G.goldBorder }}>
              <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Grand Letters (Σ 9 Mizans)</span>
              <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.gold }}>{input.grandLetters || 0}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded-lg border"
              style={{ background: G.bgInner, borderColor: G.goldBorder }}>
              <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Combined Total</span>
              <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.gold }}>{input.satirVahidTotal.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* COMPLETE MANUSCRIPT DERIVATION CHAIN */}
        <SatrVahidGrouping
          satrVahidLetters={initialSeedLetters}
          dominant={dominant}
        />

        {/* VEFK MAGIC SQUARE */}
        {vefk && (
          <Card accent={elementMeta.color}>
            <SectionHeader step="5" label="Vefk Magic Square" arabic="الوفق" color={elementMeta.color} />
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{elementMeta.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-amiri text-lg" style={{ color: elementMeta.color }}>{elementMeta.arabic}</span>
                  <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>({element})</span>
                </div>
                <div className="flex items-center gap-4 text-[8px] mb-2">
                  <span className="font-inter" style={{ color: G.dim }}>Magic Constant: <span style={{ color: G.gold, fontWeight: "bold" }}>{vefk.mc.toLocaleString()}</span></span>
                  <span className="font-inter" style={{ color: G.dim }}>Guardian: <span style={{ color: G.gold }}>{vefk.guardianName}</span></span>
                </div>
                {/* MIZAN OPTION 1 RULE: Vefk source from Sum of Expanded Letter Values */}
                <div className="px-3 py-2 rounded-lg border"
                  style={{ 
                    background: "rgba(74,222,128,0.08)", 
                    borderColor: "rgba(74,222,128,0.40)" 
                  }}>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: "rgba(74,222,128,0.70)" }}>
                      Vefk Source: Sum of All Expanded Letter Values
                    </span>
                    <span className="font-inter text-sm font-bold tabular-nums" style={{ color: "#4ADE80" }}>
                      {expandedLettersSum?.toLocaleString() || 0}
                    </span>
                  </div>
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
            
            {/* Mathematical Validation */}
            {vefk.validation && (
              <div className="mt-4 px-4 py-3 rounded-xl border"
                style={{ 
                  background: vefk.validation.isValid ? G.greenDim : G.redDim, 
                  borderColor: vefk.validation.isValid ? G.green + "55" : G.red + "55" 
                }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-inter text-[8px] uppercase tracking-wider font-bold" 
                    style={{ color: vefk.validation.isValid ? G.green : G.red }}>
                    {vefk.validation.isValid ? "✓ VALID MAGIC SQUARE" : "✗ INVALID - REGENERATION REQUIRED"}
                  </span>
                </div>
                
                {/* Rows */}
                <div className="mb-3">
                  <div className="font-inter text-[7px] uppercase tracking-wider mb-1.5" style={{ color: G.dim }}>Row Sums</div>
                  <div className="grid grid-cols-2 gap-2">
                    {vefk.validation.details.rows.map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between px-2 py-1.5 rounded border text-xs"
                        style={{ 
                          background: row.valid ? G.bgInner : G.redDim,
                          borderColor: row.valid ? elementMeta.color + "40" : G.red + "55"
                        }}>
                        <span className="font-inter text-[8px]" style={{ color: G.dim }}>Row {idx + 1}</span>
                        <span className="font-inter text-xs font-bold tabular-nums" 
                          style={{ color: row.valid ? G.green : G.red }}>
                          {row.sum.toLocaleString()} {row.valid ? "✓" : "✗"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Columns */}
                <div className="mb-3">
                  <div className="font-inter text-[7px] uppercase tracking-wider mb-1.5" style={{ color: G.dim }}>Column Sums</div>
                  <div className="grid grid-cols-2 gap-2">
                    {vefk.validation.details.cols.map((col, idx) => (
                      <div key={idx} className="flex items-center justify-between px-2 py-1.5 rounded border text-xs"
                        style={{ 
                          background: col.valid ? G.bgInner : G.redDim,
                          borderColor: col.valid ? elementMeta.color + "40" : G.red + "55"
                        }}>
                        <span className="font-inter text-[8px]" style={{ color: G.dim }}>Column {idx + 1}</span>
                        <span className="font-inter text-xs font-bold tabular-nums" 
                          style={{ color: col.valid ? G.green : G.red }}>
                          {col.sum.toLocaleString()} {col.valid ? "✓" : "✗"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Diagonals */}
                <div>
                  <div className="font-inter text-[7px] uppercase tracking-wider mb-1.5" style={{ color: G.dim }}>Diagonal Sums</div>
                  <div className="grid grid-cols-2 gap-2">
                    {vefk.validation.details.diagonals.map((diag, idx) => (
                      <div key={idx} className="flex items-center justify-between px-2 py-1.5 rounded border text-xs"
                        style={{ 
                          background: diag.valid ? G.bgInner : G.redDim,
                          borderColor: diag.valid ? elementMeta.color + "40" : G.red + "55"
                        }}>
                        <span className="font-inter text-[8px]" style={{ color: G.dim }}>
                          {diag.name === 'main' ? 'Diagonal A' : 'Diagonal B'}
                        </span>
                        <span className="font-inter text-xs font-bold tabular-nums" 
                          style={{ color: diag.valid ? G.green : G.red }}>
                          {diag.sum.toLocaleString()} {diag.valid ? "✓" : "✗"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}