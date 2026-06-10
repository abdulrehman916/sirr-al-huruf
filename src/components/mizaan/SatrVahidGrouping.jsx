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

export default function SatrVahidGrouping({ expandedLetters, isZevc, color = "#F5D060" }) {
  const grouping = useMemo(() => {
    if (!expandedLetters || expandedLetters.length === 0) return null;
    
    const totalLetters = expandedLetters.length;
    const groupSize = isZevc ? 4 : 5;
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
    
    return {
      totalLetters,
      groupSize,
      numGroups,
      remainder,
      groups,
      remainderLetters,
    };
  }, [expandedLetters, isZevc]);
  
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
      
      {/* Remainder letters (if any) */}
      {grouping.remainder > 0 && (
        <div style={{ marginBottom: "20px", padding: "12px", border: `2px dashed ${G.red}40`, borderRadius: "8px", background: `${G.red}05` }}>
          <div style={{ fontSize: "0.75rem", color: G.red, marginBottom: "8px", textTransform: "uppercase", fontWeight: "bold" }}>
            ⚠ Remainder Letters ({grouping.remainder}) — Not enough for a complete group
          </div>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "4px", direction: "ltr" }}>
            {grouping.remainderLetters.map((l, i) => (
              <LetterChip key={i} letter={l} position={i + 1} color={G.red} />
            ))}
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