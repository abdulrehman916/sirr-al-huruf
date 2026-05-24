/**
 * HadimZikr — Zikr / Recitation Count Section
 * Main: Final Grand Total (×1, ×2, ×3)
 */
import { motion } from "framer-motion";

const ACCENTS = {
  ULVI:   { glow: "rgba(212,175,55,0.65)", border: "rgba(212,175,55,0.35)", text: "#F5D060",  dim: "rgba(212,175,55,0.50)", bg: "rgba(212,175,55,0.06)", numBg: "rgba(212,175,55,0.10)" },
  SUFLI:  { glow: "rgba(220,38,38,0.65)",  border: "rgba(220,38,38,0.40)",  text: "#FCA5A5",  dim: "rgba(220,38,38,0.55)",  bg: "rgba(220,38,38,0.06)",  numBg: "rgba(220,38,38,0.10)"  },
  SHERLI: { glow: "rgba(168,85,247,0.65)", border: "rgba(168,85,247,0.35)", text: "#D8B4FE",  dim: "rgba(168,85,247,0.50)", bg: "rgba(168,85,247,0.06)", numBg: "rgba(168,85,247,0.10)" },
};

const CYCLES = [
  { label: "Main Count",    multiplier: 1 },
  { label: "Double Cycle",  multiplier: 2 },
  { label: "Triple Cycle",  multiplier: 3 },
];

function Divider({ accent }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${accent.border})` }} />
      <div className="w-1 h-1 rounded-full" style={{ background: accent.border }} />
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${accent.border})` }} />
    </div>
  );
}

export default function HadimZikr({ hadimMode, grandSum }) {
  const accent = ACCENTS[hadimMode] || ACCENTS.ULVI;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-2xl border p-5 space-y-5"
      style={{
        background: "rgba(4,8,22,0.98)",
        borderColor: accent.border,
        boxShadow: `0 0 48px ${accent.glow}, 0 4px 32px rgba(0,0,0,0.70)`,
      }}
    >
      {/* ── Title ── */}
      <div className="text-center space-y-1">
        <Divider accent={accent} />
        <p className="font-inter text-[8px] uppercase tracking-[0.3em] pt-1" style={{ color: accent.dim }}>
          Zikr / Recitation Count
        </p>
        <p className="font-amiri text-xl font-bold" dir="rtl" style={{ color: accent.text }}>
          عدد الذكر / التلاوة
        </p>
        <Divider accent={accent} />
      </div>

      {/* ── Cycles ── */}
      <div className="space-y-3">
        {CYCLES.map(({ label, multiplier }, i) => {
          const value = grandSum * multiplier;
          const isMain = multiplier === 1;
          return (
            <motion.div
              key={multiplier}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.45 }}
              className="rounded-2xl border p-4 text-center space-y-1"
              style={{
                background: isMain ? accent.numBg : accent.bg,
                borderColor: isMain ? accent.border : accent.border.replace("0.35","0.18").replace("0.40","0.20"),
                boxShadow: isMain ? `inset 0 0 28px ${accent.glow.replace("0.65","0.08")}` : "none",
              }}
            >
              <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: accent.dim }}>
                {label}
              </p>
              <motion.p
                className="font-inter font-bold tabular-nums"
                style={{ fontSize: isMain ? "clamp(2.6rem, 12vw, 4.2rem)" : "clamp(1.5rem, 7vw, 2.4rem)", color: accent.text }}
                animate={isMain ? {
                  textShadow: [
                    `0 0 20px ${accent.glow}, 0 0 50px ${accent.glow.replace("0.65","0.22")}`,
                    `0 0 48px ${accent.glow}, 0 0 100px ${accent.glow.replace("0.65","0.42")}`,
                    `0 0 20px ${accent.glow}, 0 0 50px ${accent.glow.replace("0.65","0.22")}`,
                  ],
                } : { textShadow: `0 0 14px ${accent.glow.replace("0.65","0.35")}` }}
                transition={isMain ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : {}}
              >
                {value.toLocaleString()}
              </motion.p>
              {!isMain && (
                <p className="font-inter text-[8px] text-white/25 uppercase tracking-widest">
                  {grandSum.toLocaleString()} × {multiplier}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── Bottom ornament ── */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <div className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${accent.border})` }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent.text, boxShadow: `0 0 8px ${accent.glow}` }} />
        <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${accent.border})` }} />
      </div>
    </motion.div>
  );
}