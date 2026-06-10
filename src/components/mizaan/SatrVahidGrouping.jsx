import { useMemo } from "react";
import { motion } from "framer-motion";
import { getBastLevel, istintak, generateEsmaLevel, GALIB_ANASIR_VALUES } from "../../lib/mizaanPostEngine";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  glowHi:   "rgba(212,175,55,0.55)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  bg:       "rgba(212,175,55,0.07)",
  border:   "rgba(212,175,55,0.40)",
  green:    "#4ADE80",
  purple:   "#C4B5FD",
  red:      "#F87171",
};

/**
 * SATR-I VAHID GROUPING WORKFLOW:
 * 1. Display seed letters (from Istintak)
 * 2. Count letters → FERD (odd) or ZEVC (even)
 * 3. Apply 5th Bast (Ferd) or 4th Bast (Zevc) to EACH letter individually
 * 4. Display each letter's Bast result in manuscript reading order (right-to-left)
 * 5. Concatenate all expansion letters → Satr-i Vahid
 * 6. Apply remainder correction if needed (append Galib Anasir to END)
 * 7. Group the FINAL corrected sequence into Esma-i Kitabet names
 * 
 * NAME GENERATION RULE:
 * - Names are created by direct concatenation of displayed group letters
 * - Example: Displayed [ز, غ, ب, ا, ل] → Name: "زغبال"
 * - No reversal of group letters or names
 * - Displayed letters are the source of truth
 */
export default function SatrVahidGrouping({ 
  satrVahidLetters = [],      // Seed letters from Istintak (before Bast expansion)
  isZevc = true,                // true if even count, false if odd (Ferd)
  finalLetters = [],          // Final corrected sequence (after Bast expansion + supplement if needed)
  supplementLetters = [],     // Galib Anasir supplement letters
  hasSupplement = false,
  dominant = 'fire',          // Dominant element for Galib Anasir supplementation
}) {
  // CRITICAL: Ensure all arrays are safe
  const safeSatrVahidLetters = Array.isArray(satrVahidLetters) ? satrVahidLetters : [];
  
  const totalLetters = safeSatrVahidLetters.length;
  const isFerd = !isZevc;
  
  // MANUSCRIPT RULE: Calculate 5th Bast for EACH letter individually (Ferd = 5th Bast)
  // PROCESSING ORDER: Start from LAST letter → work backward to FIRST letter
  const bastLevel = isFerd ? 5 : 4;
  
  // Compute individual derivations with MANUSCRIPT READING ORDER
  const { individualDerivations, concatenatedSatrVahid } = useMemo(() => {
    // Process from LAST to FIRST (manuscript processing order)
    const derivations = [];
    for (let i = safeSatrVahidLetters.length - 1; i >= 0; i--) {
      const letter = safeSatrVahidLetters[i];
      const bastValue = getBastLevel(letter, bastLevel);
      const extractedLetters = istintak(bastValue);
      // MANUSCRIPT DISPLAY RULE: Reverse for manuscript reading order (right-to-left)
      // Extraction order: [ب, غ, خ, ك, ز] → Displayed order: [ز, ك, خ, غ, ب]
      // The displayed letters become the master source for Satr-i Vahid
      const manuscriptOrderLetters = [...extractedLetters].reverse();
      derivations.push({
        processingOrder: safeSatrVahidLetters.length - i,
        originalIndex: i,
        letter,
        bastValue,
        expansionLetters: manuscriptOrderLetters, // DISPLAYED in manuscript order
      });
    }
    // Concatenate ALL expansion letters from displayed (manuscript order) sequence
    const concatenated = derivations.flatMap(d => d.expansionLetters);
    return { individualDerivations: derivations, concatenatedSatrVahid: concatenated };
  }, [safeSatrVahidLetters, bastLevel]);
  
  // ESMA-I KITABET GROUPING — DIRECT FROM SATR-I VAHID DISPLAY ORDER
  // SOURCE OF TRUTH: concatenatedSatrVahid (manuscript reading order)
  const { esmaKitabetResult, groups } = useMemo(() => {
    // Step 1: Determine FERD/ZEVC and group size
    const isFerd = concatenatedSatrVahid.length % 2 !== 0;
    const groupSize = isFerd ? 5 : 4;
    
    // Step 2: Check for remainder
    const remainder = concatenatedSatrVahid.length % groupSize;
    let finalSequence = [...concatenatedSatrVahid];
    let supplementLetters = [];
    
    // Step 3: Apply remainder correction if needed (append Galib Anasir to END)
    if (remainder > 0) {
      const needed = groupSize - remainder;
      const galibValue = GALIB_ANASIR_VALUES[dominant] || GALIB_ANASIR_VALUES.fire;
      const galibIstintakLetters = istintak(galibValue);
      supplementLetters = galibIstintakLetters.slice(0, needed);
      // APPEND to END (manuscript rule)
      finalSequence = [...concatenatedSatrVahid, ...supplementLetters];
    }
    
    // Step 4: Create groups sequentially from LEFT TO RIGHT (preserve display order)
    const resultGroups = [];
    for (let i = 0; i < finalSequence.length; i += groupSize) {
      const group = finalSequence.slice(i, i + groupSize);
      // Step 5: Generate name by DIRECT concatenation of displayed group letters (NO reversal)
      const name = group.join('');
      resultGroups.push({
        letters: group,
        name: name,
        groupNumber: Math.floor(i / groupSize) + 1,
        startIndex: i,
        endIndex: Math.min(i + groupSize - 1, finalSequence.length - 1),
        isComplete: group.length === groupSize,
      });
    }
    
    return {
      esmaKitabetResult: {
        names: resultGroups.map(g => g.name),
        finalExpandedLetters: finalSequence,
        supplementLetters,
        remainder,
        groupSize,
        isZevc: !isFerd,
      },
      groups: resultGroups,
    };
  }, [concatenatedSatrVahid, dominant]);

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

      {/* Satr-i Vahid Letters - ORIGINAL SEQUENCE (PRESERVED ORDER) */}
      <div className="px-4 py-3 rounded-xl border"
        style={{ background: G.bg, borderColor: G.border }}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Original Seed Letters (Pipeline Input Order)</span>
          <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.text }}>{totalLetters} letters</span>
        </div>
        <div className="flex flex-wrap gap-1 justify-center" dir="ltr">
          {safeSatrVahidLetters.map((l, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="font-amiri text-xl px-2 py-1 rounded-lg border"
              style={{
                color: G.text,
                borderColor: G.border,
                background: i === 0 ? `${G.green}15` : "rgba(212,175,55,0.04)",
                border: i === 0 ? `1px solid ${G.green}` : G.border
              }}
              dir="rtl"
            >
              {l}
            </motion.span>
          ))}
        </div>
        <div className="text-center mt-2">
          <span className="font-inter text-[6px] uppercase tracking-wider" style={{ color: G.dim }}>
            Order preserved exactly → first extracted letter on left
          </span>
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
          <span className="font-inter text-sm font-bold" style={{ color: G.text }}>Apply {bastLevel}{bastLevel === 4 ? ' (رابع)' : bastLevel === 5 ? ' (خامس)' : ''} Bast</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          INDIVIDUAL BAST DERIVATIONS
          Each letter → 5th/4th Bast → Istintak → Expansion letters
          Processing order: LAST → FIRST | Display: Manuscript reading order
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-3">
        <div className="text-center space-y-1">
          <h3 className="font-amiri text-lg font-bold" style={{ color: G.text }}>اشتقاق البسط — Individual Bast Derivations</h3>
          <div className="h-px w-16 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)` }} />
          <p className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>
            Bast Order: LAST → FIRST | Apply {bastLevel}{bastLevel === 4 ? ' (رابع)' : bastLevel === 5 ? ' (خامس)' : ''} Bast
          </p>
        </div>
        
        {individualDerivations.map((derivation, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="flex items-center gap-2 p-3 rounded-xl border"
            style={{ 
              background: "rgba(212,175,55,0.05)",
              borderColor: G.border,
              borderLeft: idx === 0 ? `3px solid ${G.green}` : undefined
            }}>
            
            {/* Processing order badge */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg font-inter text-xs font-bold"
                style={{ 
                  background: idx === 0 ? G.green : G.bg,
                  color: idx === 0 ? '#000' : G.text
                }}>
                {idx === 0 ? 'START' : idx + 1}
              </div>
              {idx === 0 && (
                <span className="font-inter text-[6px] uppercase tracking-wider" style={{ color: G.green }}>LAST (start)</span>
              )}
              {idx === individualDerivations.length - 1 && (
                <span className="font-inter text-[6px] uppercase tracking-wider" style={{ color: G.red }}>FIRST (end)</span>
              )}
            </div>
            
            {/* Original letter */}
            <div className="flex items-center gap-2">
              <span className="font-amiri text-2xl px-3 py-1.5 rounded-lg border"
                style={{
                  color: G.text,
                  borderColor: G.borderHi,
                  background: "rgba(212,175,55,0.08)"
                }}
                dir="rtl">
                {derivation.letter}
              </span>
            </div>
            
            {/* Arrow */}
            <span className="font-inter text-sm" style={{ color: G.dim }}>→</span>
            
            {/* Bast value */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
              style={{
                background: `${G.green}10`,
                border: `1px solid ${G.green}30`
              }}>
              <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.green }}>Bast {bastLevel}</span>
              <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.green }}>{derivation.bastValue.toLocaleString()}</span>
            </div>
            
            {/* Arrow */}
            <span className="font-inter text-sm" style={{ color: G.dim }}>→</span>
            
            {/* Expansion letters */}
            <div className="flex-1 flex items-center gap-1 flex-wrap justify-end" dir="ltr">
              {derivation.expansionLetters.map((l, i) => (
                <span
                  key={i}
                  className="font-amiri text-lg px-2 py-1 rounded-lg border"
                  style={{
                    color: G.green,
                    borderColor: G.green,
                    background: `${G.green}10`
                  }}
                  dir="rtl">
                  {l}
                </span>
              ))}
            </div>
            <span className="font-inter text-[6px] uppercase tracking-wider" style={{ color: G.dim }}>
              ← Manuscript order (R to L)
            </span>
          </motion.div>
        ))}
      </div>

      {/* Concatenated Satr-i Vahid sequence - manuscript order */}
      <div className="px-4 py-3 rounded-xl border"
        style={{ background: G.bg, borderColor: G.border }}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Satr-i Vahid (Manuscript Order)</span>
          <div className="flex items-center gap-2">
            <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.text }}>{concatenatedSatrVahid.length} letters</span>
            <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>→</span>
            <span className={`font-inter text-xs font-bold px-2 py-0.5 rounded ${isFerd ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
              {isFerd ? 'FERD' : 'ZEVC'}
            </span>
          </div>
        </div>
        <div className="text-xs mb-2" style={{ color: G.dim }}>
          Satr-i Vahid sequence in manuscript reading order
        </div>
        <div className="flex flex-wrap gap-1 justify-center" dir="ltr">
          {concatenatedSatrVahid.map((l, i) => (
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
              dir="rtl">
              {l}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Remainder Correction Notice */}
      {esmaKitabetResult.remainder > 0 && esmaKitabetResult.supplementLetters.length > 0 && (
        <div className="px-4 py-3 rounded-xl border"
          style={{ background: `${G.green}10`, borderColor: `${G.green}40` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Satr-i Vahid Completion Rule</span>
            <span className="font-inter text-xs font-bold" style={{ color: G.green }}>+{esmaKitabetResult.supplementLetters.length} letters appended</span>
          </div>
          
          {/* Classification & Group Size */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-inter text-xs font-bold px-2 py-1 rounded ${isFerd ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
              {isFerd ? 'FERD (فرد)' : 'ZEVC (زوج)'}
            </span>
            <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>→</span>
            <span className="font-inter text-xs font-bold" style={{ color: G.text }}>
              Group by {esmaKitabetResult.groupSize}
            </span>
          </div>
          
          {/* Remainder calculation */}
          <div className="text-xs mb-2 px-2 py-1.5 rounded" style={{ background: "rgba(212,175,55,0.05)", border: `1px dashed ${G.border}` }}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Total Letters</span>
              <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.text }}>{concatenatedSatrVahid.length}</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Remainder</span>
              <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.red }}>{esmaKitabetResult.remainder}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Needed to Complete Group</span>
              <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.green }}>{esmaKitabetResult.supplementLetters.length}</span>
            </div>
          </div>
          
          {/* Galib Anasir source */}
          <div className="text-xs mb-2 px-2 py-1.5 rounded" style={{ background: `${G.green}08`, border: `1px solid ${G.green}30` }}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Dominant Anasir (Galip)</span>
              <span className="font-inter text-xs font-bold" style={{ color: G.text }}>{dominant}</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>First Bast Value</span>
              <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.text }}>{GALIB_ANASIR_VALUES[dominant]?.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Istintak Source</span>
              <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.green }}>1st Bast → Letters</span>
            </div>
          </div>
          
          {/* Appended letters */}
          <div className="text-xs mb-2" style={{ color: G.dim }}>
            Appended to END of Satr-i Vahid sequence:
          </div>
          <div className="flex flex-wrap gap-1 justify-center" dir="ltr">
            {esmaKitabetResult.supplementLetters.map((l, i) => (
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
      
      {/* No Remainder Notice */}
      {esmaKitabetResult.remainder === 0 && (
        <div className="px-4 py-3 rounded-xl border"
          style={{ background: `${G.text}08`, borderColor: `${G.text}30` }}>
          <div className="flex items-center justify-between">
            <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>No Remainder Correction Needed</span>
            <span className="font-inter text-xs font-bold" style={{ color: G.text }}>Sequence complete</span>
          </div>
          <div className="text-xs mt-1" style={{ color: G.dim }}>
            {concatenatedSatrVahid.length} letters ÷ {esmaKitabetResult.groupSize} = exact groups (remainder 0)
          </div>
        </div>
      )}

      {/* Final Corrected Sequence Count */}
      {esmaKitabetResult.remainder > 0 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border"
          style={{ background: G.bg, borderColor: G.border }}>
          <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Final Sequence (After Remainder Correction)</span>
          <span className="font-inter text-lg font-bold tabular-nums" style={{ color: G.text }}>{esmaKitabetResult.finalExpandedLetters.length} letters</span>
        </div>
      )}

      {/* Esma-i Kitabet Groups */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>تجميع الأسماء — Esma-i Kitabet Grouping</span>
          <div className="flex items-center gap-2">
            <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: isFerd ? G.red : G.green, background: isFerd ? `${G.red}15` : `${G.green}15`, padding: "2px 8px", borderRadius: "4px" }}>
              {isFerd ? 'FERD' : 'ZEVC'} → Group by {esmaKitabetResult.groupSize}
            </span>
            <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.text, background: `${G.text}15`, padding: "2px 8px", borderRadius: "4px" }}>
              {esmaKitabetResult.names.length} names
            </span>
          </div>
        </div>
        
        {groups.map((group, groupIdx) => (
          <motion.div
            key={groupIdx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: groupIdx * 0.05 }}
            className="space-y-2 p-3 rounded-xl border"
            style={{ 
              background: "rgba(212,175,55,0.06)",
              borderColor: G.border 
            }}>
            {/* Group header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg font-inter text-xs font-bold"
                  style={{ 
                    background: G.bg,
                    color: G.text 
                  }}>
                  {group.groupNumber}
                </div>
                <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>
                  Group {group.groupNumber}
                </span>
              </div>
              <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.text, background: `${G.text}15`, padding: "2px 6px", borderRadius: "4px" }}>
                {group.letters.length} letters
              </span>
            </div>
            
            {/* Group letters */}
            <div className="flex items-center gap-1 flex-wrap" dir="ltr">
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
            
            {/* Generated Esma-i Kitabet name */}
            <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: G.border }}>
              <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>
                Esma-i Kitabet:
              </span>
              <span className="font-amiri text-2xl font-bold px-3 py-1.5 rounded-lg border"
                style={{
                  color: G.green,
                  borderColor: G.green,
                  background: `${G.green}10`
                }}
                dir="rtl"
              >
                {group.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}