// ═══════════════════════════════════════════════════════════════
// FALNAMEH LETTER GRID COMPONENT
// 18×12 = 216 cells interactive grid
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion } from "framer-motion";
import { FALNAMEH_VERSES } from "../../lib/falnamehSheikhBahaiData";

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

function LetterCell({ letter, cellNumber, isSelected, onSelect }) {
  return (
    <motion.button
      onClick={() => onSelect(letter, cellNumber)}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      className="rounded-xl border flex flex-col items-center justify-center"
      style={{
        background: isSelected ? P.bgHi : P.bg,
        borderColor: isSelected ? P.borderHi : P.faint,
        boxShadow: isSelected ? `0 0 24px ${P.glowHi}` : `0 0 8px ${P.glow}`,
        aspectRatio: "1 / 1",
        minWidth: 0,
        padding: "2px",
      }}
    >
      <span className="font-inter text-[6px] tabular-nums mb-px" style={{ color: P.faint }}>
        {cellNumber}
      </span>
      <span className="font-amiri font-bold" style={{
        fontSize: "clamp(0.7rem, 2.5vw, 1.2rem)",
        color: isSelected ? P.gold : P.text,
        textShadow: isSelected ? `0 0 12px ${P.gold}` : `0 0 8px ${P.glow}`,
        lineHeight: 1,
      }}>
        {letter}
      </span>
    </motion.button>
  );
}

export default function FalnamehLetterGrid({ onSelectLetter }) {
  const [selectedCell, setSelectedCell] = useState(null);

  // Generate 216 cells (18×12)
  const cells = [];
  const baseLetters = FALNAMEH_VERSES ? Object.keys(FALNAMEH_VERSES) : [
    "ا","ب","پ","ت","ث","ج","چ","ح","خ","د","ذ","ر","ز","ژ","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ک","گ","ل","م","ن","و","ه","ی"
  ];

  for (let i = 0; i < 216; i++) {
    const letter = baseLetters[i % baseLetters.length];
    cells.push({ letter, cellNumber: i + 1 });
  }

  const handleSelect = (letter, cellNumber) => {
    setSelectedCell({ letter, cellNumber });
    setTimeout(() => {
      if (onSelectLetter) {
        onSelectLetter(letter, cellNumber);
      }
    }, 400);
  };

  return (
    <div className="rounded-2xl border p-2"
      style={{
        background: P.bg,
        borderColor: P.border,
        boxShadow: `0 0 24px ${P.glow}`,
      }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(18, 1fr)",
        gap: "3px",
      }}>
        {cells.map(({ letter, cellNumber }, i) => (
          <LetterCell
            key={i}
            letter={letter}
            cellNumber={cellNumber}
            isSelected={selectedCell?.letter === letter && selectedCell?.cellNumber === cellNumber}
            onSelect={handleSelect}
          />
        ))}
      </div>
      
      <p className="font-inter text-[7px] uppercase tracking-widest text-center mt-2" style={{ color: P.faint }}>
        ൧൮ × ൧൨ = ൨൧൬ അക്ഷരങ്ങൾ | 18 × 12 = 216 Letters
      </p>
    </div>
  );
}