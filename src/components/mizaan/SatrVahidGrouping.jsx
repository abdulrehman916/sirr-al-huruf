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
  supplementLetters = [],
  hasSupplement = false,
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

  const totalLetters = expandedLetters?.length || 0;
  const completeGroups = groups.filter(g => g.isComplete).length;
  const partialGroup = groups.find(g => !g.isComplete);

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
      <div className="text-center space-y-2">
        <p className="font-inter text-[9px] uppercase tracking-[0.25em]" style={{ color: G.dim }}>
          Manuscript Grouping Rule
        </p>
        <h2 className="font-amiri text-2xl font-bold" style={{ color: G.text }}>تجميع الحروف</h2>
        <div className="h-px w-24 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />
        
        {/* Stats */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border"
            style={{ background: G.bg, borderColor: G.border }}>
            <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Total Letters</span>
            <span className="font-inter text-lg font-bold tabular-nums" style={{ color: G.text }}>{totalLetters}</span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border"
            style={{ background: G.bg, borderColor: G.border }}>
            <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Satr-i Vahid Count</span>
            <span className={`font-inter text-sm font-bold px-2 py-0.5 rounded ${isZevc ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
              {isZevc ? 'ZEVC (even)' : 'FERD (odd)'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border"
            style={{ background: G.bg, borderColor: G.border }}>
            <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Group Size</span>
            <span className="font-inter text-lg font-bold tabular-nums" style={{ color: G.text }}>{groupSize} letters</span>
          </div>
        </div>
        
        {hasSupplement && (
          <div className="mt-2 flex items-center justify-center gap-2 text-xs" style={{ color: G.text }}>
            <span className="px-2 py-1 rounded bg-green-500/20 text-green-400">
              +{supplementLetters.length} Galib Anasir supplement
            </span>
          </div>
        )}
      </div>

      {/* Groups display */}
      <div className="space-y-2">
        <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
          Final Corrected Groups ({groups.length} groups of {groupSize} letters)
        </p>
        
        <div className="space-y-1.5">
          {groups.map((group, groupIdx) => {
            const isComplete = group.isComplete;
            const isPartial = !isComplete;
            
            return (
              <div key={groupIdx}
                className="flex items-center gap-2 p-2 rounded-xl border"
                style={{ 
                  background: isPartial ? "rgba(255,100,100,0.08)" : "rgba(212,175,55,0.06)",
                  borderColor: isPartial ? "rgba(255,100,100,0.30)" : G.border 
                }}>
                
                {/* Group number */}
                <div className="flex items-center justify-center w-8 h-8 rounded-lg font-inter text-xs font-bold"
                  style={{ 
                    background: isPartial ? "rgba(255,100,100,0.20)" : G.bg,
                    color: isPartial ? "#ff6b6b" : G.text 
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
                        color: isPartial ? "#ff6b6b" : G.text,
                        borderColor: isPartial ? "rgba(255,100,100,0.40)" : G.border,
                        background: isPartial ? "rgba(255,100,100,0.10)" : "rgba(212,175,55,0.04)"
                      }}
                      dir="rtl"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
                
                {/* Group info */}
                <div className="flex items-center gap-2">
                  <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>
                    {group.letters.length}/{groupSize}
                  </span>
                  {isPartial && (
                    <span className="font-inter text-[8px] uppercase tracking-widest px-2 py-0.5 rounded bg-red-500/20 text-red-400">
                      Partial
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manuscript rule note */}
      <div className="mt-3 p-3 rounded-xl border"
        style={{ background: "rgba(212,175,55,0.04)", borderColor: G.border }}>
        <p className="font-inter text-[8px] leading-relaxed" style={{ color: G.dim }}>
          <span style={{ color: G.text }}>Manuscript Rule:</span> Zevc/Ferd classification is applied ONLY to the assembled Satr-i Vahid 
          (expanded letters from Bast derivation). If even → groups of 4 | If odd → groups of 5. 
          Galib Anasir supplement letters are appended to complete the final group.
        </p>
      </div>

      {/* Footer seal */}
      <div className="text-center pt-1">
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
          style={{ background: G.bg, borderColor: G.border }}
          animate={{ boxShadow: [`0 0 8px ${G.glow}`, `0 0 16px ${G.glowHi}`, `0 0 8px ${G.glow}`] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-inter text-[8px] uppercase tracking-[0.2em]" style={{ color: G.dim }}>
            Satr-i Vahid Grouping Complete
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}