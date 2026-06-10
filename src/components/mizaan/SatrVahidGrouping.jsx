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
  green:    "#4ADE80",
};

/**
 * MANUSCRIPT WORKFLOW (pp.60-69):
 * 1. Display Satr-i Vahid letters in EXACT manuscript order (no reordering, no expansion)
 * 2. Count letters → FERD (odd) or ZEVC (even)
 * 3. Apply remainder correction if needed (append Galib Anasir to END)
 * 4. Group the FINAL corrected sequence into Esma-i Kitabet names
 */
export default function SatrVahidGrouping({ 
  satrVahidLetters,      // The exact Satr-i Vahid letters from manuscript (no expansion)
  isZevc,                // true if even count, false if odd (Ferd)
  finalLetters,          // Final corrected sequence (satrVahidLetters + supplement if needed)
  supplementLetters = [], // Galib Anasir supplement letters
  hasSupplement = false,
}) {
  // Determine group size from Ferd/Zevc
  const groupSize = isZevc ? 4 : 5;
  
  // Group the final corrected sequence into Esma-i Kitabet names
  const groups = useMemo(() => {
    if (!finalLetters || finalLetters.length === 0) return [];
    
    const result = [];
    for (let i = 0; i < finalLetters.length; i += groupSize) {
      const group = finalLetters.slice(i, i + groupSize);
      result.push({
        letters: group,
        startIndex: i,
        endIndex: Math.min(i + groupSize - 1, finalLetters.length - 1),
        isComplete: group.length === groupSize,
      });
    }
    
    return result;
  }, [finalLetters, groupSize]);

  const totalLetters = satrVahidLetters.length;
  const isFerd = !isZevc;
  const finalTotal = finalLetters.length;

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

      {/* Satr-i Vahid Letters - EXACT MANUSCRIPT ORDER */}
      <div className="px-4 py-3 rounded-xl border"
        style={{ background: G.bg, borderColor: G.border }}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Satr-i Vahid (Manuscript Order)</span>
          <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.text }}>{totalLetters} letters</span>
        </div>
        <div className="flex flex-wrap gap-1 justify-center" dir="ltr">
          {satrVahidLetters.map((l, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="font-amiri text-xl px-2 py-1 rounded-lg border"
              style={{
                color: G.text,
                borderColor: G.border,
                background: "rgba(212,175,55,0.04)"
              }}
              dir="rtl"
            >
              {l}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Classification */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl border"
        style={{ background: G.bg, borderColor: G.border }}>
        <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Classification</span>
        <div className="flex items-center gap-3">
          <span className={`font-inter text-xs font-bold px-3 py-1.5 rounded ${isFerd ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            {isFerd ? 'FERD (فرد) — ODD' : 'ZEVC (زوج) — EVEN'}
          </span>
          <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>→</span>
          <span className="font-inter text-sm font-bold" style={{ color: G.text }}>Group by {groupSize}</span>
        </div>
      </div>

      {/* Remainder Correction Notice */}
      {hasSupplement && supplementLetters.length > 0 && (
        <div className="px-4 py-3 rounded-xl border"
          style={{ background: `${G.green}10`, borderColor: `${G.green}40` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Remainder Correction</span>
            <span className="font-inter text-xs font-bold" style={{ color: G.green }}>+{supplementLetters.length} letters appended</span>
          </div>
          <div className="text-xs mb-2" style={{ color: G.dim }}>
            Original: {totalLetters} | Remainder: {totalLetters % groupSize} | Needed: {supplementLetters.length}
          </div>
          <div className="flex flex-wrap gap-1 justify-center" dir="ltr">
            {supplementLetters.map((l, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="font-amiri text-lg px-2 py-1 rounded-lg border"
                style={{
                  color: G.green,
                  borderColor: G.green,
                  background: `${G.green}15`
                }}
                dir="rtl"
              >
                {l}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Final Corrected Sequence Count */}
      {hasSupplement && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border"
          style={{ background: G.bg, borderColor: G.border }}>
          <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Final Sequence</span>
          <span className="font-inter text-lg font-bold tabular-nums" style={{ color: G.text }}>{finalTotal} letters</span>
        </div>
      )}

      {/* Esma-i Kitabet Groups */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Esma-i Kitabet Names</span>
          <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.text, background: `${G.text}15`, padding: "2px 8px", borderRadius: "4px" }}>
            {groups.length} names
          </span>
        </div>
        
        {groups.map((group, groupIdx) => (
          <motion.div
            key={groupIdx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: groupIdx * 0.05 }}
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
                <span
                  key={letterIdx}
                  className="font-amiri text-xl px-2 py-1 rounded-lg border"
                  style={{
                    color: G.text,
                    borderColor: G.border,
                    background: "rgba(212,175,55,0.04)"
                  }}
                  dir="rtl"
                >
                  {letter}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}