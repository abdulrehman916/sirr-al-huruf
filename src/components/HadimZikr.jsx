/**
 * HadimZikr — Zikr / Recitation Count Section
 * Primary: 777 (book recommendation)
 * Secondary: traditional 777 multiples
 * Tertiary: dynamic grand total (informational)
 */
import { motion } from "framer-motion";

const TRADITIONAL_CYCLES = [777, 1554, 2331, 3108, 3885, 4662, 5439, 6216, 6993, 7770];

const ACCENTS = {
  ULVI: {
    glow:   "rgba(212,175,55,0.65)",
    border: "rgba(212,175,55,0.35)",
    text:   "#F5D060",
    dim:    "rgba(212,175,55,0.50)",
    bg:     "rgba(212,175,55,0.06)",
    numBg:  "rgba(212,175,55,0.10)",
  },
  SUFLI: {
    glow:   "rgba(220,38,38,0.65)",
    border: "rgba(220,38,38,0.40)",
    text:   "#FCA5A5",
    dim:    "rgba(220,38,38,0.55)",
    bg:     "rgba(220,38,38,0.06)",
    numBg:  "rgba(220,38,38,0.10)",
  },
  SHERLI: {
    glow:   "rgba(168,85,247,0.65)",
    border: "rgba(168,85,247,0.35)",
    text:   "#D8B4FE",
    dim:    "rgba(168,85,247,0.50)",
    bg:     "rgba(168,85,247,0.06)",
    numBg:  "rgba(168,85,247,0.10)",
  },
};

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

      {/* ══ 1 — PRIMARY RECOMMENDED COUNT: 777 ══ */}
      <div
        className="rounded-2xl border p-6 text-center space-y-2"
        style={{
          background: accent.numBg,
          borderColor: accent.border,
          boxShadow: `inset 0 0 30px ${accent.glow.replace("0.65","0.08")}`,
        }}
      >
        <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: accent.dim }}>
          Recommended Main Count
        </p>
        <motion.p
          className="font-inter font-bold tabular-nums"
          style={{ fontSize: "clamp(3rem, 14vw, 5rem)", color: accent.text }}
          animate={{
            textShadow: [
              `0 0 20px ${accent.glow}, 0 0 50px ${accent.glow.replace("0.65","0.22")}`,
              `0 0 48px ${accent.glow}, 0 0 100px ${accent.glow.replace("0.65","0.42")}`,
              `0 0 20px ${accent.glow}, 0 0 50px ${accent.glow.replace("0.65","0.22")}`,
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          777
        </motion.p>
        <p className="font-inter text-[9px] text-white/30 uppercase tracking-widest">
          Book Recommendation
        </p>
      </div>

      {/* ══ 2 — TRADITIONAL EXTENDED CYCLES ══ */}
      <div className="space-y-3">
        <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: accent.dim }}>
          Traditional Extended Cycles
        </p>
        <div className="grid grid-cols-2 gap-2">
          {TRADITIONAL_CYCLES.map((count, i) => (
            <motion.div
              key={count}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.4 }}
              className="rounded-xl border px-3 py-2 flex items-center justify-between"
              style={{
                background: accent.bg,
                borderColor: accent.border.replace("0.35","0.18").replace("0.40","0.20"),
              }}
            >
              <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: accent.dim }}>
                777 × {i + 1}
              </span>
              <span className="font-inter text-sm font-bold tabular-nums" style={{ color: accent.text }}>
                {count.toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <Divider accent={accent} />

      {/* ══ 3 — OPTIONAL DYNAMIC GRAND TOTAL ══ */}
      <div
        className="rounded-xl border px-4 py-3 text-center space-y-1"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderColor: accent.border.replace("0.35","0.15").replace("0.40","0.18"),
        }}
      >
        <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: accent.dim }}>
          Based on Final Grand Total
        </p>
        <p
          className="font-inter font-bold tabular-nums text-white/70"
          style={{ fontSize: "clamp(1.2rem, 5vw, 1.6rem)" }}
        >
          {grandSum.toLocaleString()}
        </p>
        <p className="font-inter text-[8px] text-white/25 uppercase tracking-widest">
          Secondary Informational Value
        </p>
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