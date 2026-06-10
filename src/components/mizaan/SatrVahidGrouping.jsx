import { useMemo } from "react";
import { motion } from "framer-motion";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  bg:       "rgba(212,175,55,0.07)",
  border:   "rgba(212,175,55,0.40)",
};

/**
 * MANUSCRIPT GROUPING RULE (pp.60-69):
 * 1. Generate all Bast derivation letters
 * 2. Assemble complete Satr-i Vahid
 * 3. Count Satr-i Vahid letters → determine FERD (odd) or ZEVC (even)
 * 4. Group by 5 (FERD) or 4 (ZEVC)
 * 5. If remainder exists, append Galib Anasir Istintak letters to END
 * 6. Group the FINAL corrected sequence into Esma names
 */
export default function SatrVahidGrouping({ 
  expandedLetters, 
  isZevc,
}) {
  // Determine group size from EXPANDED letter count (NOT seed letters)
  const groupSize = isZevc ? 4 : 5;
  
  // MANUSCRIPT RULE: If supplement exists, it's already appended to expandedLetters
  // Just group the final corrected sequence
  const groups = useMemo(() => {
    if (!expandedLetters || expandedLetters.length === 0) return [];
    
    const letters = expandedLetters;
    const result = [];
    
    // Group the final sequence
    for (let i = 0; i < letters.length; i += groupSize) {
      const group = letters.slice(i, i + groupSize);
      result.push({
        letters: group,
        startIndex: i,
        endIndex: Math.min(i + groupSize - 1, letters.length - 1),
        isComplete: group.length === groupSize,
      });
    }
    
    return result;
  }, [expandedLetters, groupSize]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="rounded-2xl border p-5 space-y-4"
      style={{ 
        background: "rgba(3,6,20,0.99)", 
        borderColor: G.borderHi, 
        boxShadow: `0 0 60px ${G.glow}, 0 0 120px rgba(0,0,0,0.6)` 
      }}
    >
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="font-amiri text-2xl font-bold" style={{ color: G.text }}>تجميع الحروف</h2>
        <div className="h-px w-24 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />
      </div>

      {/* Groups display */}
      <div className="space-y-1.5">
        {groups.map((group, groupIdx) => (
          <div key={groupIdx}
            className="flex items-center gap-2 p-2 rounded-xl border"
            style={{ 
              background: "rgba(212,175,55,0.06)",
              borderColor: G.border 
            }}>
            
            {/* Group number */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg font-inter text-xs font-bold"
              style={{ 
                background: G.bg,
                color: G.text 
              }}>
              {groupIdx + 1}
            </div>
            
            {/* Letters */}
            <div className="flex-1 flex items-center gap-1 flex-wrap" dir="ltr">
              {group.letters.map((letter, letterIdx) => (
                <motion.span
                  key={letterIdx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: groupIdx * 0.1 + letterIdx * 0.03 }}
                  className="font-amiri text-xl px-2 py-1 rounded-lg border"
                  style={{
                    color: G.text,
                    borderColor: G.border,
                    background: "rgba(212,175,55,0.04)"
                  }}
                  dir="rtl"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}