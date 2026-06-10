/**
 * SatrVahidGrouping — Groups SATR-I VAHID letters from LAST→FIRST
 * ZEVC (even): Groups of 4, starting from last letter
 * FERD (odd): Groups of 5, starting from last letter
 * Displays each group separately before concatenating into names
 */
import { useMemo } from "react";
import { motion } from "framer-motion";
import { AR, G } from "./ManuscriptConstants";

const LetterChip = ({ letter, position, color }) => (
  <span
    dir="rtl"
    lang="ar"
    style={{
      fontFamily: AR.fontFamily,
      fontSize: "1.5rem",
      color: color || G.text,
      padding: "6px 10px",
      background: `${color || G.text}15`,
      borderRadius: "6px",
      border: `2px solid ${color || G.text}30`,
      fontWeight: "bold",
      display: "inline-block",
      minWidth: "2.5rem",
      textAlign: "center",
    }}
  >
    {letter}
    <span style={{ fontSize: "0.6rem", opacity: 0.6, display: "block", marginTop: "2px" }}>#{position}</span>
  </span>
);

const GroupBlock = ({ group, groupIndex, totalLetters, groupSize, color }) => {
  // Calculate actual positions (from end to start)
  const endIndex = totalLetters - (groupIndex * groupSize);
  const startIndex = endIndex - groupSize + 1;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: groupIndex * 0.1, duration: 0.3 }}
      style={{
        padding: "16px",
        border: `3px solid ${color}40`,
        borderRadius: "10px",
        background: `${color}08`,
        marginBottom: "16px",
      }}
    >
      <div style={{ 
        fontSize: "0.75rem", 
        color: G.dim, 
        marginBottom: "12px", 
        textTransform: "uppercase", 
        letterSpacing: "1px",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        <span style={{ 
          background: color, 
          color: "#000", 
          padding: "2px 8px", 
          borderRadius: "4px", 
          fontWeight: "bold", 
          fontSize: "0.65rem" 
        }}>
          {groupIndex + 1}
        </span>
        <span>Group {groupIndex + 1} — Letters {startIndex} to {endIndex} (from last → first)</span>
      </div>
      
      {/* Individual letters with positions */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "6px",
          direction: "ltr",
          marginBottom: "16px",
          padding: "12px",
          background: `${color}05`,
          borderRadius: "8px",
        }}
      >
        {group.map((letter, i) => {
          const actualPosition = endIndex - i;
          return (
            <LetterChip 
              key={i} 
              letter={letter} 
              position={actualPosition} 
              color={color} 
            />
          );
        })}
      </div>
      
      {/* Concatenated name */}
      <div
        style={{
          padding: "14px",
          background: `${color}20`,
          borderRadius: "8px",
          border: `2px solid ${color}40`,
          textAlign: "center",
        }}
      >
        <div style={{ 
          fontSize: "0.7rem", 
          color: G.dim, 
          marginBottom: "8px", 
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>
          Concatenated Name (Esma-i Kitabet)
        </div>
        <div
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: AR.fontFamily,
            fontSize: "2.2rem",
            color: color || G.text,
            fontWeight: "bold",
            letterSpacing: "2px",
          }}
        >
          {group.join("")}
        </div>
      </div>
    </motion.div>
  );
};

export default function SatrVahidGrouping({ expandedLetters, isZevc, dominant, color = "#F5D060" }) {
  const grouping = useMemo(() => {
    if (!expandedLetters || expandedLetters.length === 0) return null;
    
    const totalLetters = expandedLetters.length;
    const groupSize = 5; // Esma-i Kitabet always uses 5-letter groups
    const numGroups = Math.floor(totalLetters / groupSize);
    const remainder = totalLetters % groupSize;
    
    // Group from LAST letter → FIRST (reverse order)
    const groups = [];
    for (let i = 0; i < numGroups; i++) {
      const startIndex = totalLetters - ((i + 1) * groupSize);
      const endIndex = totalLetters - (i * groupSize);
      const group = expandedLetters.slice(startIndex, endIndex);
      groups.push(group);
    }
    
    // Handle remainder (leftover letters at the beginning)
    let remainderLetters = [];
    if (remainder > 0) {
      remainderLetters = expandedLetters.slice(0, remainder);
    }
    
    // Calculate supplement letters from GALIB ANASIR value
    let supplementLetters = [];
    const ELEMENT_BAST_TOTALS = {
      fire:  3550,
      earth: 4015,
      air:   3757,
      water: 3342,
    };
    const istintak = (n) => {
      const UNITS_MAP    = {1:'ا',2:'ب',3:'ج',4:'د',5:'ه',6:'و',7:'ز',8:'ح',9:'ط'};
      const TENS_MAP     = {10:'ي',20:'ك',30:'ل',40:'م',50:'ن',60:'س',70:'ع',80:'ف',90:'ص'};
      const HUNDREDS_MAP = {100:'ق',200:'ر',300:'ش',400:'ت',500:'ث',600:'خ',700:'ذ',800:'ض',900:'ظ'};
      const THOUSAND_MARK = 'غ';
      if (!n || n <= 0) return [];
      n = Math.floor(n);
      const digits = [];
      let tmp = n;
      while (tmp > 0) { digits.push(tmp % 10); tmp = Math.floor(tmp / 10); }
      const letters = [];
      let slot = 0;
      for (let i = 0; i < digits.length; i++) {
        const d = digits[i];
        const isLast = (i === digits.length - 1);
        if (slot === 0) {
          if (d !== 0 && UNITS_MAP[d]) letters.push(UNITS_MAP[d]);
          slot = 1;
        } else if (slot === 1) {
          const v = d * 10;
          if (d !== 0 && TENS_MAP[v]) letters.push(TENS_MAP[v]);
          slot = 2;
        } else if (slot === 2) {
          const v = d * 100;
          if (d !== 0 && HUNDREDS_MAP[v]) letters.push(HUNDREDS_MAP[v]);
          slot = 3;
        } else {
          letters.push(THOUSAND_MARK);
          if (d !== 0 && (d !== 1 || !isLast) && UNITS_MAP[d]) letters.push(UNITS_MAP[d]);
          slot = 1;
        }
      }
      return letters;
    };
    
    if (remainder > 0 && remainder < groupSize && dominant) {
      const elemTotal = ELEMENT_BAST_TOTALS[dominant] || 3550;
      const elemLetters = istintak(elemTotal);
      const needed = groupSize - remainder;
      supplementLetters = elemLetters.slice(0, needed);
    }
    
    return {
      totalLetters,
      groupSize,
      numGroups,
      remainder,
      groups,
      remainderLetters,
      supplementLetters,
      galibAnasirValue: dominant ? ELEMENT_BAST_TOTALS[dominant] : null,
    };
  }, [expandedLetters, isZevc, dominant]);
  
  if (!grouping) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        marginBottom: "40px",
        padding: "24px",
        border: `3px solid ${color}50`,
        borderRadius: "12px",
        background: `${color}08`,
      }}
    >
      <h2
        style={{
          fontSize: "1.4rem",
          color,
          fontWeight: "bold",
          marginBottom: "20px",
          borderBottom: `2px solid ${color}40`,
          paddingBottom: "10px",
        }}
      >
        SATR-I VAHID LETTER GROUPING (LAST → FIRST)
      </h2>
      
      {/* Summary stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div style={{ padding: "12px", background: `${color}10`, borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: G.dim, marginBottom: "4px", textTransform: "uppercase" }}>Total Letters</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color }}>{grouping.totalLetters}</div>
        </div>
        
        <div style={{ padding: "12px", background: `${color}10`, borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: G.dim, marginBottom: "4px", textTransform: "uppercase" }}>Parity</div>
          <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: isZevc ? G.green : G.red }}>
            {isZevc ? "ZEVC (زوج)" : "FERD (فرد)"}
          </div>
        </div>
        
        <div style={{ padding: "12px", background: `${color}10`, borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: G.dim, marginBottom: "4px", textTransform: "uppercase" }}>Group Size</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color }}>{grouping.groupSize}</div>
        </div>
        
        <div style={{ padding: "12px", background: `${color}10`, borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: G.dim, marginBottom: "4px", textTransform: "uppercase" }}>Complete Groups</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color }}>{grouping.numGroups}</div>
        </div>
      </div>
      
      {/* Remainder supplementation from GALIB ANASIR */}
      {grouping.remainder > 0 && (
        <div style={{ marginBottom: "20px", padding: "16px", border: `3px solid ${color}40`, borderRadius: "10px", background: `${color}08` }}>
          <div style={{ fontSize: "0.75rem", color: G.dim, marginBottom: "12px", textTransform: "uppercase", fontWeight: "bold" }}>
            ⚠ REMAINDER COMPLETION — GALIB ANASIR SUPPLEMENTATION
          </div>
          
          {/* Step 1: Show remainder */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "0.7rem", color: G.dim, marginBottom: "6px" }}>
              Step 1: Incomplete group ({grouping.remainder} letters)
            </div>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "4px", direction: "ltr", padding: "8px", background: `${G.red}05`, borderRadius: "6px" }}>
              {grouping.remainderLetters.map((l, i) => (
                <LetterChip key={i} letter={l} position={i + 1} color={G.red} />
              ))}
            </div>
          </div>
          
          {/* Step 2: Show Galib Anasir value */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "0.7rem", color: G.dim, marginBottom: "6px" }}>
              Step 2: Galib Anasir Value ({dominant})
            </div>
            <div style={{ padding: "8px", background: `${color}10`, borderRadius: "6px", textAlign: "center" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: "bold", color }}>{grouping.galibAnasirValue?.toLocaleString()}</span>
              <span style={{ fontSize: "0.65rem", color: G.dim, marginLeft: "8px" }}>
                ({dominant === 'fire' ? 'نار / Ateş' : dominant === 'earth' ? 'تراب / Toprak' : dominant === 'air' ? 'هواء / Hava' : 'ماء / Su'})
              </span>
            </div>
          </div>
          
          {/* Step 3: Istintak of Galib Anasir */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "0.7rem", color: G.dim, marginBottom: "6px" }}>
              Step 3: Istintak of Galib Anasir → Supplement Letters
            </div>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "4px", direction: "ltr", padding: "8px", background: `${G.green}05`, borderRadius: "6px" }}>
              {grouping.supplementLetters.map((l, i) => (
                <LetterChip key={i} letter={l} position={i + 1} color={G.green} />
              ))}
            </div>
            <div style={{ fontSize: "0.65rem", color: G.dim, marginTop: "4px", textAlign: "center" }}>
              Taking {grouping.supplementLetters.length} letter{grouping.supplementLetters.length > 1 ? 's' : ''} to complete the group
            </div>
          </div>
          
          {/* Step 4: Completed name */}
          <div style={{ padding: "12px", background: `${color}20`, borderRadius: "8px", border: `2px solid ${color}40`, textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: G.dim, marginBottom: "8px", textTransform: "uppercase" }}>
              ✓ Completed Name (Remainder + Supplement)
            </div>
            <div
              dir="rtl"
              lang="ar"
              style={{
                fontFamily: AR.fontFamily,
                fontSize: "2.2rem",
                color,
                fontWeight: "bold",
                letterSpacing: "2px",
              }}
            >
              {grouping.remainderLetters.concat(grouping.supplementLetters).join('')}
            </div>
          </div>
        </div>
      )}
      
      {/* Grouped letters */}
      <div>
        <div style={{ fontSize: "0.8rem", color: G.dim, marginBottom: "12px" }}>
          <strong style={{ color }}>⚠ MANUSCRIPT RULE:</strong>
          <span style={{ color: G.text, marginLeft: "8px" }}>
            Start from LAST letter → move backwards to first (reverse order)
          </span>
        </div>
        
        {grouping.groups.map((group, idx) => (
          <GroupBlock
            key={idx}
            group={group}
            groupIndex={idx}
            totalLetters={grouping.totalLetters}
            groupSize={grouping.groupSize}
            color={color}
          />
        ))}
      </div>
      
      {/* Generated names summary */}
      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          background: `${G.green}10`,
          borderRadius: "10px",
          border: `2px solid ${G.green}40`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "0.75rem", color: G.dim, marginBottom: "8px", textTransform: "uppercase" }}>
          ✓ Generated Esma-i Kitabet Names ({grouping.groups.length} names)
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "center",
          }}
        >
          {grouping.groups.map((group, idx) => (
            <div
              key={idx}
              style={{
                padding: "10px 16px",
                background: `${color}20`,
                borderRadius: "8px",
                border: `2px solid ${color}40`,
              }}
            >
              <div style={{ fontSize: "0.65rem", color: G.dim, marginBottom: "4px", textTransform: "uppercase" }}>
                Name {idx + 1}
              </div>
              <div
                dir="rtl"
                lang="ar"
                style={{
                  fontFamily: AR.fontFamily,
                  fontSize: "1.8rem",
                  color,
                  fontWeight: "bold",
                }}
              >
                {group.join("")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}