import { useMemo } from "react";
import { motion } from "framer-motion";
import { runMizaanPostPipeline, istintak, FIRST_BAST, GALIB_ANASIR_VALUES, getBastLevel } from "../../lib/mizaanPostEngine";
import Option1DerivationChain from "./Option1DerivationChain";

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

function LetterCell({ letter, index, color = G.gold, size = "lg", showIndex = false }) {
  const sizes = { sm: "text-lg px-2 py-1", lg: "text-2xl px-3 py-2", xl: "text-3xl px-4 py-2.5" };
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className={`font-amiri font-bold rounded-lg border ${sizes[size]}`}
        style={{
          color,
          borderColor: color + "55",
          background: color + "12",
          lineHeight: 1.2,
          display: "inline-block",
        }}
      >
        {letter}
      </span>
      {showIndex && (
        <span className="font-inter text-[8px] tabular-nums" style={{ color: G.dim }}>{index + 1}</span>
      )}
    </div>
  );
}

function LetterRow({ letters, color = G.gold, size = "lg", showIndex = false, rtl = false }) {
  if (!letters || letters.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 items-center" style={{ direction: rtl ? "rtl" : "ltr" }}>
      {letters.map((l, i) => (
        <LetterCell key={i} letter={l} index={i} color={color} size={size} showIndex={showIndex} />
      ))}
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

  const { input, initialSeedLetters, kitabet, avan, kasem, vefk } = pipeline;
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

        {/* INITIAL SEED LETTERS */}
        <Card accent={G.gold}>
          <SectionHeader step="1" label="Initial Seed Letters (Istintak)" arabic="الحروف البذرية" color={G.gold} />
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            <LetterRow letters={initialSeedLetters} color={G.gold} size="xl" showIndex rtl />
          </div>
          <div className="text-center">
            <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>
              Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{initialSeedLetters?.length || 0}</span>
            </span>
          </div>
        </Card>

        {/* COMPLETE DERIVATION CHAIN */}
        <Option1DerivationChain
          seedLetters={initialSeedLetters}
          dominant={dominant}
        />

        {/* ESMA-I KITABET */}
        {kitabet && kitabet.names && kitabet.names.length > 0 && (
          <Card accent={G.green}>
            <SectionHeader step="2" label="Esma-i Kitabet Names" arabic="أسماء الكتابة" color={G.green} />
            
            {kitabet.remainder > 0 && (
              <div className="mb-3 rounded-lg border p-3"
                style={{ background: G.greenDim, borderColor: G.green + "40" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-inter text-[8px] uppercase tracking-wider font-bold" style={{ color: G.green }}>
                    Remainder Correction
                  </span>
                  <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.green }}>+{(kitabet.supplementLetters?.length || 0)} letters</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[8px]">
                  <div className="flex justify-between">
                    <span style={{ color: G.dim }}>Group Size</span>
                    <span style={{ color: G.gold }}>{kitabet.groupSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: G.dim }}>Remainder</span>
                    <span style={{ color: G.red }}>{kitabet.remainder}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {kitabet.names.map((name, idx) => (
                <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border"
                  style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
                  <div className="w-5 h-5 rounded flex items-center justify-center font-inter text-[9px] font-black"
                    style={{ background: G.goldFaint, color: G.goldDim, border: `1px solid ${G.goldBorder}` }}>
                    {idx + 1}
                  </div>
                  <span className="font-amiri text-xl font-bold flex-1" style={{ color: G.gold }} dir="rtl">
                    {name}
                  </span>
                  <span className="font-inter text-[7px] tabular-nums" style={{ color: G.dim }}>
                    {name.length} letters
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center mt-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                style={{ background: G.bgInner, borderColor: G.goldBorder }}>
                <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Total Names</span>
                <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.gold }}>{kitabet.names?.length || 0}</span>
              </div>
            </div>
          </Card>
        )}

        {/* ESMA-I A'VAN */}
        {avan && avan.names && avan.names.length > 0 && (
          <Card accent={G.green}>
            <SectionHeader step="3" label="Esma-i A'van Names" arabic="أسماء الأعوان" color={G.green} />
            {avan.remainder > 0 && (
              <div className="mb-3 rounded-lg border p-2"
                style={{ background: G.greenDim, borderColor: G.green + "40" }}>
                <span className="font-inter text-[7px] uppercase tracking-wider font-bold" style={{ color: G.green }}>
                  Remainder: +{(avan.supplementLetters?.length || 0)} letters
                </span>
              </div>
            )}
            <div className="space-y-2">
              {avan.names.map((name, idx) => (
                <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border"
                  style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
                  <div className="w-5 h-5 rounded flex items-center justify-center font-inter text-[9px] font-black"
                    style={{ background: G.goldFaint, color: G.goldDim, border: `1px solid ${G.goldBorder}` }}>
                    {idx + 1}
                  </div>
                  <span className="font-amiri text-xl font-bold flex-1" style={{ color: G.gold }} dir="rtl">
                    {name}
                  </span>
                  <span className="font-inter text-[7px] tabular-nums" style={{ color: G.dim }}>
                    {name.length} letters
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ESMA-I KASEM */}
        {kasem && kasem.names && kasem.names.length > 0 && (
          <Card accent={G.green}>
            <SectionHeader step="4" label="Esma-i Kasem Names" arabic="أسماء القاسم" color={G.green} />
            {kasem.remainder > 0 && (
              <div className="mb-3 rounded-lg border p-2"
                style={{ background: G.greenDim, borderColor: G.green + "40" }}>
                <span className="font-inter text-[7px] uppercase tracking-wider font-bold" style={{ color: G.green }}>
                  Remainder: +{(kasem.supplementLetters?.length || 0)} letters
                </span>
              </div>
            )}
            <div className="space-y-2">
              {kasem.names.map((name, idx) => (
                <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border"
                  style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
                  <div className="w-5 h-5 rounded flex items-center justify-center font-inter text-[9px] font-black"
                    style={{ background: G.goldFaint, color: G.goldDim, border: `1px solid ${G.goldBorder}` }}>
                    {idx + 1}
                  </div>
                  <span className="font-amiri text-xl font-bold flex-1" style={{ color: G.gold }} dir="rtl">
                    {name}
                  </span>
                  <span className="font-inter text-[7px] tabular-nums" style={{ color: G.dim }}>
                    {name.length} letters
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

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
                <div className="flex items-center gap-4 text-[8px]">
                  <span className="font-inter" style={{ color: G.dim }}>Magic Constant: <span style={{ color: G.gold, fontWeight: "bold" }}>{vefk.mc.toLocaleString()}</span></span>
                  <span className="font-inter" style={{ color: G.dim }}>Guardian: <span style={{ color: G.gold }}>{vefk.guardianName}</span></span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 max-w-xs mx-auto">
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
          </Card>
        )}

      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}