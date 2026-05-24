/**
 * HadimKasem — Final Kasem / Invocation Section
 * Displayed below all ceremonial name cards.
 * Shows all generated hadim names (each ×2), then the typed invocation.
 */
import { motion } from "framer-motion";

const URGENCY_LINES = [
  "إلواهن إلواهن",
  "إلعجلة إلعجلة",
  "الساعة الساعة",
];

export default function HadimKasem({ hadimMode, individuals, grandTypes }) {
  const isUlvi = hadimMode === 'ULVI';

  // Collect all hadim names: each individual's active-mode name + grand hadim name
  const activeKey = hadimMode.toLowerCase();
  const allNames = [
    ...individuals.map(item => item.types[activeKey].istintaq.hadimName),
    grandTypes[activeKey].istintaq.hadimName,
  ].filter(Boolean);

  const invocationArabic = isUlvi
    ? "يا روحانية هذه الأسماء"
    : "يا خدام هذه الأسماء";

  const invocationLatin = isUlvi
    ? "Yā Rūḥāniyyata Hādhihil Asmā"
    : "Yā Khuddāma Hādhihil Asmā";

  const accentColor = isUlvi
    ? { glow: "rgba(212,175,55,0.55)", border: "rgba(212,175,55,0.35)", text: "#F5D060", dim: "rgba(212,175,55,0.45)" }
    : { glow: "rgba(168,85,247,0.55)", border: "rgba(168,85,247,0.35)", text: "#D8B4FE", dim: "rgba(168,85,247,0.45)" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-2xl border p-5 space-y-5"
      style={{
        background: "rgba(6,10,28,0.97)",
        borderColor: accentColor.border,
        boxShadow: `0 0 48px ${accentColor.glow}, 0 4px 32px rgba(0,0,0,0.60)`,
      }}
    >
      {/* ── Section Title ── */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${accentColor.border})` }} />
          <span className="font-inter text-[8px] uppercase tracking-[0.3em]" style={{ color: accentColor.dim }}>Kasem Invocation</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${accentColor.border})` }} />
        </div>
        <p className="font-amiri text-2xl font-bold" style={{ color: accentColor.text, textShadow: `0 0 20px ${accentColor.glow}` }} dir="rtl">
          قسم النداء
        </p>
      </div>

      {/* ── All Generated Names × 2 ── */}
      <div className="space-y-2 text-center" dir="rtl">
        {allNames.map((name, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
            className="font-amiri text-xl leading-loose text-white"
            style={{ textShadow: `0 0 12px ${accentColor.glow}` }}
          >
            {name} {name}
          </motion.p>
        ))}
      </div>

      {/* ── Divider dots ── */}
      <div className="text-center">
        <span className="font-amiri text-lg tracking-widest" style={{ color: accentColor.dim }}>
          ..............
        </span>
      </div>

      {/* ── Main Invocation ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="rounded-2xl border p-5 text-center space-y-2"
        style={{
          background: isUlvi ? "rgba(212,175,55,0.06)" : "rgba(168,85,247,0.06)",
          borderColor: accentColor.border,
          boxShadow: `inset 0 0 30px ${accentColor.glow.replace("0.55","0.08")}`,
        }}
      >
        <p
          className="font-amiri text-3xl font-bold leading-loose"
          dir="rtl"
          style={{ color: accentColor.text, textShadow: `0 0 28px ${accentColor.glow}, 0 0 60px ${accentColor.glow.replace("0.55","0.20")}` }}
        >
          {invocationArabic}
        </p>
        <p className="font-inter text-[11px] tracking-widest" style={{ color: accentColor.dim }}>
          {invocationLatin}
        </p>
      </motion.div>

      {/* ── Urgency Lines ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-center space-y-2"
        dir="rtl"
      >
        {URGENCY_LINES.map((line, i) => (
          <motion.p
            key={i}
            className="font-amiri text-xl text-white/80 leading-relaxed"
            style={{ textShadow: `0 0 10px ${accentColor.glow.replace("0.55","0.30")}` }}
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
          >
            {line}
          </motion.p>
        ))}
      </motion.div>

      {/* ── Bottom ornament ── */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <div className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${accentColor.border})` }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor.text, boxShadow: `0 0 8px ${accentColor.glow}` }} />
        <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${accentColor.border})` }} />
      </div>
    </motion.div>
  );
}