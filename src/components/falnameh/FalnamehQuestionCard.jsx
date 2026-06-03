// ═══════════════════════════════════════════════════════════════
// FALNAMEH QUESTION CARD COMPONENT
// Displays individual question in selection grid
// ═══════════════════════════════════════════════════════════════

import { motion } from "framer-motion";

const P = {
  border:   "rgba(160,100,220,0.40)",
  borderHi: "rgba(180,120,255,0.70)",
  glow:     "rgba(160,100,220,0.25)",
  glowHi:   "rgba(180,120,255,0.55)",
  text:     "#D8B4FE",
  dim:      "rgba(216,180,254,0.55)",
  faint:    "rgba(216,180,254,0.18)",
  bg:       "rgba(160,100,220,0.07)",
  bgHi:     "rgba(160,100,220,0.16)",
  gold:     "#D4AF37",
};

export default function FalnamehQuestionCard({ question, index, onSelect, lang }) {
  return (
    <motion.button
      onClick={() => onSelect(question)}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.28 }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="rounded-2xl border p-3 text-center"
      style={{
        background: P.bg,
        borderColor: P.faint,
        boxShadow: `0 0 16px ${P.glow}`,
        minHeight: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: P.gold }}>
        سؤال {question.id}
      </span>
      <p className="font-amiri font-bold text-sm mb-1" style={{ color: P.text, lineHeight: 1.6 }}>
        {question.persianTitle}
      </p>
      <p className="font-inter text-[9px]" style={{ color: P.dim }}>
        {lang === "ml" ? question.malayalamTitle : question.englishTitle}
      </p>
    </motion.button>
  );
}