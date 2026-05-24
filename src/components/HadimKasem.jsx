/**
 * HadimKasem — Kasem / Invocation Section
 * Order:
 *  1. Final Grand Hadim Name (large)
 *  2. All names list (grand first, then individuals) × 2
 *  3. Hajath textarea
 *  4. Invocation line
 *  5. User hajath display
 *  6. Final ending lines
 */
import { useState } from "react";
import { motion } from "framer-motion";

const ENDING_LINES = [
  "الْوَاحًا الْوَاحًا الْوَاحًا",
  "الْعَجَلْ الْعَجَلْ الْعَجَلْ",
  "السَّاعَةُ السَّاعَةُ السَّاعَةُ",
];

export default function HadimKasem({ hadimMode, individuals, grandTypes }) {
  const [hajath, setHajath] = useState("");

  const isUlvi = hadimMode === "ULVI";
  const activeKey = hadimMode.toLowerCase();

  const grandName = grandTypes[activeKey].istintaq.hadimName;
  const individualNames = individuals.map(item => item.types[activeKey].istintaq.hadimName).filter(Boolean);
  // Order: grand first, then individuals
  const allNames = [grandName, ...individualNames];

  const invocationArabic = isUlvi
    ? "يا روحانية هذه الأسماء"
    : "يا خدام هذه الأسماء";

  const isSufli = hadimMode === "SUFLI";
  const accent = isUlvi
    ? { glow: "rgba(212,175,55,0.60)", border: "rgba(212,175,55,0.35)", text: "#F5D060", dim: "rgba(212,175,55,0.50)", inputBorder: "rgba(212,175,55,0.40)", endingGlow: "rgba(212,175,55,0.70)", endingColor: "#FFE07A" }
    : isSufli
    ? { glow: "rgba(220,38,38,0.60)", border: "rgba(220,38,38,0.40)", text: "#FCA5A5", dim: "rgba(220,38,38,0.55)", inputBorder: "rgba(220,38,38,0.40)", endingGlow: "rgba(220,38,38,0.80)", endingColor: "#FCA5A5" }
    : { glow: "rgba(168,85,247,0.60)", border: "rgba(168,85,247,0.35)", text: "#D8B4FE", dim: "rgba(168,85,247,0.50)", inputBorder: "rgba(168,85,247,0.40)", endingGlow: "rgba(139,40,180,0.80)", endingColor: "#C084FC" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-2xl border p-5 space-y-6"
      style={{
        background: "rgba(4,8,22,0.98)",
        borderColor: accent.border,
        boxShadow: `0 0 56px ${accent.glow}, 0 4px 32px rgba(0,0,0,0.70)`,
      }}
    >
      {/* ── Section Title ── */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${accent.border})` }} />
        <span className="font-inter text-[8px] uppercase tracking-[0.3em]" style={{ color: accent.dim }}>Kasem Invocation</span>
        <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${accent.border})` }} />
      </div>
      <p className="font-amiri text-xl font-bold text-center -mt-3" style={{ color: accent.text }} dir="rtl">قسم النداء</p>

      {/* ══ 1 — FINAL GRAND HADIM NAME ══ */}
      <div className="text-center space-y-1">
        <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: accent.dim }}>Final Grand Hadim</p>
        <motion.p
          className="font-amiri font-bold leading-loose"
          dir="rtl"
          style={{
            fontSize: "clamp(2rem, 8vw, 3.2rem)",
            color: accent.text,
            textShadow: `0 0 30px ${accent.glow}, 0 0 70px ${accent.glow.replace("0.60","0.25")}`,
          }}
          animate={{ textShadow: [
            `0 0 20px ${accent.glow}, 0 0 50px ${accent.glow.replace("0.60","0.18")}`,
            `0 0 40px ${accent.glow}, 0 0 90px ${accent.glow.replace("0.60","0.35")}`,
            `0 0 20px ${accent.glow}, 0 0 50px ${accent.glow.replace("0.60","0.18")}`,
          ]}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {grandName}
        </motion.p>
      </div>

      <div className="h-px" style={{ background: accent.border, opacity: 0.30 }} />

      {/* ══ 2 — ALL HADIM NAMES × 2 ══ */}
      <div className="space-y-2 text-center" dir="rtl">
        <p className="font-inter text-[8px] uppercase tracking-widest text-center mb-3" style={{ color: accent.dim }}>Generated Hadim Names</p>
        {allNames.map((name, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08 * i, duration: 0.5 }}
            className="font-amiri leading-loose text-white"
            style={{
              fontSize: i === 0 ? "1.5rem" : "1.25rem",
              textShadow: `0 0 10px ${accent.glow.replace("0.60","0.30")}`,
              fontWeight: i === 0 ? "bold" : "normal",
            }}
          >
            {name} {name}
          </motion.p>
        ))}
      </div>

      <div className="h-px" style={{ background: accent.border, opacity: 0.30 }} />

      {/* ══ 3 — HAJATH TEXTAREA ══ */}
      <div className="space-y-2">
        <label className="block font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: accent.dim }}>
          الحاجة / النية
        </label>
        <textarea
          dir="rtl"
          rows={3}
          value={hajath}
          onChange={e => setHajath(e.target.value)}
          placeholder="رزق، محبة، فتح، قبول، زواج..."
          className="w-full rounded-xl px-4 py-3 font-amiri text-xl text-white leading-relaxed resize-none focus:outline-none caret-white placeholder:text-white/25 text-center"
          style={{
            background: "rgba(8,14,36,0.96)",
            border: `1px solid ${accent.inputBorder}`,
            boxShadow: `inset 0 0 20px ${accent.glow.replace("0.60","0.06")}`,
          }}
        />
      </div>

      <div className="h-px" style={{ background: accent.border, opacity: 0.30 }} />

      {/* ══ 4 — INVOCATION LINE ══ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="rounded-2xl border py-5 px-4 text-center space-y-2"
        style={{
          background: isUlvi ? "rgba(212,175,55,0.05)" : "rgba(168,85,247,0.05)",
          borderColor: accent.border,
        }}
      >
        <motion.p
          className="font-amiri text-3xl font-bold leading-loose"
          dir="rtl"
          style={{ color: accent.text, textShadow: `0 0 28px ${accent.glow}` }}
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {invocationArabic}
        </motion.p>

        {/* ══ 5 — USER HAJATH DISPLAY ══ */}
        {hajath.trim() && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-amiri text-2xl text-white/90 leading-loose"
            dir="rtl"
            style={{ textShadow: `0 0 16px ${accent.glow.replace("0.60","0.40")}` }}
          >
            {hajath.trim()}
          </motion.p>
        )}
      </motion.div>

      {/* ══ 6 — FINAL ENDING ══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="rounded-2xl border py-6 px-4 text-center space-y-5"
        style={{
          background: "rgba(4,6,18,0.95)",
          borderColor: accent.border,
          boxShadow: `0 0 40px ${accent.endingGlow.replace("0.80","0.25")}, inset 0 0 30px ${accent.endingGlow.replace("0.80","0.06")}`,
        }}
        dir="rtl"
      >
        {ENDING_LINES.map((line, i) => (
          <motion.p
            key={i}
            className="font-amiri font-bold leading-loose"
            style={{
              fontSize: "clamp(1.4rem, 5vw, 2rem)",
              color: accent.endingColor,
              textShadow: `0 0 18px ${accent.endingGlow}, 0 0 50px ${accent.endingGlow.replace("0.80","0.35")}`,
            }}
            animate={{
              textShadow: [
                `0 0 12px ${accent.endingGlow.replace("0.80","0.55")}, 0 0 35px ${accent.endingGlow.replace("0.80","0.22")}`,
                `0 0 28px ${accent.endingGlow}, 0 0 70px ${accent.endingGlow.replace("0.80","0.45")}`,
                `0 0 12px ${accent.endingGlow.replace("0.80","0.55")}, 0 0 35px ${accent.endingGlow.replace("0.80","0.22")}`,
              ],
              opacity: [0.80, 1, 0.80],
            }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
          >
            {line}
          </motion.p>
        ))}
      </motion.div>

      {/* ── Bottom ornament ── */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <div className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${accent.border})` }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent.text, boxShadow: `0 0 8px ${accent.glow}` }} />
        <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${accent.border})` }} />
      </div>
    </motion.div>
  );
}