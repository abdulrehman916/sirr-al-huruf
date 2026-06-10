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
 * - Count letters in Satr-i Vahid
 * - FERD (odd) → group by 5
 * - ZEVC (even) → group by 4
 * - Start from LAST letter, move backwards
 * - Show each group visually
 */
export default function SatrVahidGrouping({ expandedLetters, isZevc, initialCountIsZevc }) {
  // Use initialCountIsZevc for determining group size (this is the seed letter count)
  // isZevc is for the expanded letter count (after bast expansion)
  const groupSize = initialCountIsZevc !== undefined ? (initialCountIsZevc ? 4 : 5) : (isZevc ? 4 : 5);
  
  // MANUSCRIPT RULE: Start from LAST letter, move backwards
  const groups = useMemo(() => {
    if (!expandedLetters || expandedLetters.length === 0) return [];
    
    const letters = [...expandedLetters]; // Copy array
    const result = [];
    
    // Start from end, take groupSize letters at a time
    for (let i = letters.length; i > 0; i -= groupSize) {
      const start = Math.max(0, i - groupSize);
      const group = letters.slice(start, i);
      result.push({
        letters: group,
        startIndex: start,
        endIndex: i - 1,
      });
    }
    
    // Reverse to show groups in order (first extracted group on top)
    return result.reverse();
  }, [expandedLetters, groupSize]);

  const totalLetters = expandedLetters?.length || 0;
  const completeGroups = groups.filter(g => g.letters.length === groupSize).length;
  const partialGroup = groups.find(g => g.letters.length < groupSize);

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
            <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Seed Count Type</span>
            <span className={`font-inter text-sm font-bold px-2 py-0.5 rounded ${initialCountIsZevc !== undefined ? (initialCountIsZevc ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400') : (isZevc ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400')}`}>
              {initialCountIsZevc !== undefined ? (initialCountIsZevc ? 'ZEVC (even)' : 'FERD (odd)') : (isZevc ? 'ZEVC (even)' : 'FERD (odd)')}
            </span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border"
            style={{ background: G.bg, borderColor: G.border }}>
            <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Group Size</span>
            <span className="font-inter text-lg font-bold tabular-nums" style={{ color: G.text }}>{groupSize} letters</span>
          </div>
        </div>
      </div>

      {/* Direction indicator */}
      <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border"
        style={{ background: "rgba(212,175,55,0.05)", borderColor: G.border }}>
        <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>
          Grouping Direction:
        </span>
        <div className="flex items-center gap-1">
          <span className="font-amiri text-sm" style={{ color: G.dim }}>آخر</span>
          <motion.span 
            animate={{ x: [-3, 3, -3, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="font-inter text-xs" 
            style={{ color: G.text }}>← LAST → FIRST</motion.span>
          <span className="font-amiri text-sm" style={{ color: G.dim }}>أول</span>
        </div>
      </div>

      {/* Groups display */}
      <div className="space-y-2">
        <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
          Letter Groups ({completeGroups} complete{partialGroup ? ` + 1 partial: ${partialGroup.letters.length}/${groupSize}` : ''})
        </p>
        
        <div className="space-y-1.5">
          {groups.map((group, groupIdx) => {
            const isComplete = group.letters.length === groupSize;
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
                <div className="flex-1 flex items-center gap-1 flex-wrap" dir="rtl">
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
          <span style={{ color: G.text }}>Manuscript Rule:</span> Groups are formed starting from the LAST letter of the expanded sequence, 
          moving backwards. Each group contains {groupSize} letters (based on {initialCountIsZevc !== undefined ? (initialCountIsZevc ? 'ZEVC/even' : 'FERD/odd') : (isZevc ? 'ZEVC/even' : 'FERD/odd')} seed count). 
          Partial groups at the beginning require supplementation from Galib Anasir.
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
            Grouping Complete — Ready for Esma Generation
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}