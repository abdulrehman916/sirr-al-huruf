// ═══════════════════════════════════════════════════════════════
// FALNAMEH QUESTION DETAIL PAGE
// Shows question info + 18×12 interactive letter grid
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import FalnamehLetterGrid from "./FalnamehLetterGrid";

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

export default function FalnamehQuestionDetail({ question, lang, onBack, onSelectLetter }) {
  const [selectedCell, setSelectedCell] = useState(null);

  const handleLetterSelect = (letter, cellNumber) => {
    setSelectedCell({ letter, cellNumber });
    setTimeout(() => {
      if (onSelectLetter) {
        onSelectLetter(question, letter, cellNumber);
      }
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header with back button */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border flex items-center gap-1"
          style={{
            background: P.bg,
            borderColor: P.faint,
            color: P.text,
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="font-inter text-xs uppercase tracking-widest">
            {lang === "ml" ? "മടങ്ങുക" : "Back"}
          </span>
        </button>
        <div className="flex-1 text-center">
          <p className="font-amiri font-bold text-base" style={{ color: P.text }}>
            {question.persianTitle}
          </p>
          <p className="font-inter text-[9px]" style={{ color: P.dim }}>
            {lang === "ml" ? question.malayalamTitle : question.englishTitle}
          </p>
        </div>
      </div>

      {/* Question Info Card */}
      <div className="rounded-2xl border p-4 text-center"
        style={{
          background: P.bg,
          borderColor: P.border,
          boxShadow: `0 0 20px ${P.glow}`,
        }}>
        <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: P.gold }}>
          {lang === "ml" ? "◈ ചോദ്യം" : "◈ Question"} {question.id}
        </p>
        <p className="font-amiri text-lg leading-relaxed mb-2" dir="rtl" style={{ color: P.text }}>
          {question.persianTitle}
        </p>
        <p className="font-inter text-[9px]" style={{ color: P.faint }}>
          {lang === "ml" ? question.malayalamTitle : question.englishTitle}
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div style={{ width: 28, height: 0.5, background: `linear-gradient(to right, transparent, ${P.borderHi})` }} />
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: P.gold }} />
          <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: P.dim }}>
            Grid: {question.gridData}
          </span>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: P.gold }} />
          <div style={{ width: 28, height: 0.5, background: `linear-gradient(to left, transparent, ${P.borderHi})` }} />
        </div>
      </div>

      {/* Letter Grid */}
      <div className="rounded-2xl border p-3"
        style={{
          background: P.bg,
          borderColor: P.border,
          boxShadow: `0 0 24px ${P.glow}`,
        }}>
        <p className="font-inter text-[8px] uppercase tracking-widest text-center mb-3" style={{ color: P.gold }}>
          {lang === "ml" ? "അക്ഷരം തിരഞ്ഞെടുക്കുക" : "Select a Letter"}
        </p>
        <FalnamehLetterGrid onSelectLetter={handleLetterSelect} />
      </div>

      {/* Instructions */}
      <div className="rounded-2xl border px-4 py-3 text-center"
        style={{
          background: P.bg,
          borderColor: P.faint,
        }}>
        <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: P.gold }}>
          {lang === "ml" ? "നിർദ്ദേശങ്ങൾ" : "Instructions"}
        </p>
        <p className="font-inter text-[9px] leading-relaxed" style={{ color: P.dim }}>
          {lang === "ml" 
            ? "18×12 ഗ്രിഡിൽ നിന്ന് ഒരു അക്ഷരം തിരഞ്ഞെടുക്കുക. നിങ്ങളുടെ ഉത്തരം ലഭിക്കും."
            : "Select one letter from the 18×12 grid. You will receive your answer."}
        </p>
      </div>
    </motion.div>
  );
}