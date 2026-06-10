import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { buildHierarchy, toArabicIndic, isCompatible } from "./msEngine";
import { perfStore } from "./perfStore";
import { buildAngelName, buildJinnName } from "./msHarakat";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
};

// ── Letter extraction and name generation ───────────────────────
const SUFFIXES = {
  'ar-angel': 41,
  'ar-jinn': 319,
  'heb-angel': 31,
  'heb-jinn': 329,
};

// Positional digit-cycle letter mappings
const UNITS =     {1:'ا', 2:'ب', 3:'ج', 4:'د', 5:'ه', 6:'و', 7:'ز', 8:'ح', 9:'ط'};
const TENS =      {10:'ي', 20:'ك', 30:'ل', 40:'م', 50:'ن', 60:'س', 70:'ع', 80:'ف', 90:'ص'};
const HUNDREDS =  {100:'ق', 200:'ر', 300:'ش', 400:'ت', 500:'ث', 600:'خ', 700:'ذ', 800:'ض', 900:'ظ'};
const THOUSAND_MARKER = 'غ';

/**
 * extractLettersFromValue(value) - Positional digit-cycle method
 * RULE: Read number right-to-left, cycling: Unit → Tens → Hundreds → Thousand Marker
 * 
 * Thousands rule:
 * - 1000 = غ (only marker, no unit digit)
 * - 2000-9000 = غ + unit digit (e.g., 2000 = غ + ب)
 * 
 * Zeros rule:
 * - Zeros do not generate letters
 * - Zeros do NOT remove their position
 * - Position cycle is preserved
 */
function extractLettersFromValue(value) {
  if (!value || value <= 0) return [];
  
  const letters = [];
  let n = Math.floor(value);
  
  // Extract digits (LSD first - right to left)
  const digits = [];
  while (n > 0) {
    digits.push(n % 10);
    n = Math.floor(n / 10);
  }
  
  // Process digits with positional cycle: Unit → Tens → Hundreds → Thousand Marker
  let slot = 0; // 0=Unit, 1=Tens, 2=Hundreds, 3=Thousand
  for (let i = 0; i < digits.length; i++) {
    const d = digits[i];
    
    if (slot === 0) {
      // Unit position (1-9)
      if (d !== 0 && UNITS[d]) {
        letters.push(UNITS[d]);
      }
      slot = 1;
    } else if (slot === 1) {
      // Tens position (10-90)
      const v = d * 10;
      if (d !== 0 && TENS[v]) {
        letters.push(TENS[v]);
      }
      slot = 2;
    } else if (slot === 2) {
      // Hundreds position (100-900)
      const v = d * 100;
      if (d !== 0 && HUNDREDS[v]) {
        letters.push(HUNDREDS[v]);
      }
      slot = 3;
    } else {
      // Thousand position: always emit marker + optional unit digit (2-9)
      letters.push(THOUSAND_MARKER);
      if (d !== 0 && d !== 1 && UNITS[d]) {
        letters.push(UNITS[d]);
      }
      slot = 1; // Restart cycle from Tens after thousands (thousands consumed the Unit slot implicitly)
    }
  }
  
  return letters;
}

function generateTraditionalName(value, suffixType) {
  const suffix = SUFFIXES[suffixType];
  const isAngel = suffixType.includes('angel');
  
  // STEP 1: Apply Ulvi adjustment (underflow rule: if value < suffix, add 360 first)
  let adjustedValue = value;
  if (value < suffix) {
    adjustedValue = value + 360 - suffix;
  } else {
    adjustedValue = value - suffix;
  }
  
  if (adjustedValue <= 0) adjustedValue = 1;
  
  // STEP 2: POSITIONAL DIGIT-CYCLE EXTRACTION
  // Rule: Read right-to-left, cycling Unit → Tens → Hundreds → Thousand Marker
  // Example: 1237 = ز ل ر غ (breakdown) → غرلز (final name, mirror order)
  const consonants = extractLettersFromValue(adjustedValue);
  
  // STEP 3: FINAL NAME ASSEMBLY - Mirror order (reverse of breakdown sequence)
  // Breakdown remains unchanged (extraction order for display)
  // Final displayed name uses REVERSE of breakdown sequence
  // Example: breakdown [ز, ل, ر, غ] → final name = غرلز
  const extractedSequence = consonants.join(''); // Keep original for breakdown display
  const reversedConsonants = [...consonants].reverse(); // Mirror order for final name
  const mirroredSequence = reversedConsonants.join(''); // Final name uses reversed sequence
  
  // STEP 4: Apply harakat and append suffix
  // Angels → root + ئِيل (attached, no space)
  // Jinn   → vocalized root only
  const displayName = isAngel
    ? buildAngelName(reversedConsonants)
    : buildJinnName(reversedConsonants);
  
  return {
    originalValue: value,
    adjustedValue,
    consonants, // BAST-2: immutable extraction order (for breakdown display)
    extractedSequence, // Direct concatenation (extraction order - breakdown)
    mirroredSequence, // Mirror order (final displayed name)
    name: displayName
  };
}

// ─────────────────────────────────────────────────────────────────
//  Props:
//   mc        — rawNum (Magic Constant — never modified by suffix)
//   gridSize  — selected grid size
//   rawInput  — original user input (for display)
//   suffix    — "ar-angel" | "ar-jinn" | "heb-angel" | "heb-jinn"
//   lang, L   — language / labels
// ─────────────────────────────────────────────────────────────────
const MsHierarchyTable = memo(function MsHierarchyTable({ mc, gridSize, rawInput, suffix, lang, L }) {

  // Hierarchy is computed from mc (rawNum when no suffix, adjusted otherwise)
  // Requires a gridSize to compute usurper-based rows — show placeholder if no size chosen
  const hier = useMemo(() => {
    if (!mc || !gridSize) return null;
    // BOOK AUTHORITY: No compatible square = no hierarchy = no names
    if (!isCompatible(mc, gridSize)) return null;
    const t0 = performance.now();
    const result = buildHierarchy(mc, gridSize);
    perfStore.set("buildHierarchy", parseFloat((performance.now() - t0).toFixed(2)));
    return result;
  }, [mc, gridSize]);

  // Build display rows with traditional names
  const rows = useMemo(() => {
    if (!hier) return [];
    const t0 = performance.now();

    const base = [
      { key: "usurper",   label: L.usurper,   val: hier.usurper  },
      { key: "guide",     label: L.guide,     val: hier.guide    },
      { key: "mystery",   label: L.mystery,   val: hier.mystery  },
      { key: "adjuster",  label: L.adjuster,  val: hier.adjuster, highlight: true },
      { key: "leader",    label: L.leader,    val: hier.leader   },
      { key: "regulator", label: L.regulator, val: hier.regulator },
      { key: "genGov",    label: L.genGov,    val: hier.genGov   },
      { key: "highOver",  label: L.highOver,  val: hier.highOver },
    ];

    const result = base.map(row => {
      const nameData = generateTraditionalName(row.val, suffix);
      const isAngel = suffix.includes('angel');
      const color = isAngel ? "#4FE3FF" : suffix === 'ar-jinn' ? "#FF9F5A" : "#F9A8D4";
      
      return {
        ...row,
        nameData,
        color
      };
    });

    perfStore.set("angelJinnNames", parseFloat((performance.now() - t0).toFixed(2)));
    return result;
  }, [hier, suffix, L]);

  // Always render if we have mc — show "choose grid size" message if no gridSize
  if (!mc) return null;

  const showNames = true; // All 4 suffix modes display names
  const activeNameKey = suffix.includes("angel") ? "angel" : "jinn";

  return (
    <motion.div
      key={`hier-${mc}-${gridSize}-${suffix}`}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className="rounded-2xl border p-4 space-y-3"
      style={{ background: "rgba(4,8,24,0.99)", borderColor: G.borderHi, boxShadow: `0 0 28px ${G.glow}` }}
    >
      {/* Title */}
      <p className="font-inter text-[10px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
        {L.hierarchy}
      </p>

      {/* Active system badge */}
      {(() => {
        const badgeCfg = {
          "ar-angel":  { c: "#4FE3FF", b: "rgba(79,227,255,0.35)",   bg: "rgba(79,227,255,0.06)",   label: lang==="ar" ? "ملاك عربي — ئيل (−٤١)" : "Arabic Angel — ئيل (−41)" },
          "ar-jinn":   { c: "#FF9F5A", b: "rgba(255,159,90,0.35)",   bg: "rgba(255,159,90,0.06)",   label: lang==="ar" ? "جن عربي — طيش (−٣١٩)" : "Arabic Jinn — طيش (−319)" },
          "heb-angel": { c: "#C4B5FD", b: "rgba(196,181,253,0.35)",  bg: "rgba(196,181,253,0.06)",  label: lang==="ar" ? "ملاك عبري — אל (−٣١)" : "Hebrew Angel — אל (−31)" },
          "heb-jinn":  { c: "#F9A8D4", b: "rgba(249,168,212,0.35)",  bg: "rgba(249,168,212,0.06)",  label: lang==="ar" ? "جن عبري — תקש (−٣٢٩)" : "Hebrew Jinn — תקש (−329)" },
        };
        const cfg = badgeCfg[suffix] || badgeCfg["ar-angel"];
        return (
          <div className="flex justify-center">
            <span className="font-inter text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{ borderColor: cfg.b, color: cfg.c, background: cfg.bg }}>
              {cfg.label}
            </span>
          </div>
        );
      })()}

      <div className="h-px w-full" style={{ background: `linear-gradient(90deg,transparent,${G.borderHi},transparent)` }} />

      {/* Summary row */}
      <div className="flex flex-wrap gap-2">
        <div className="flex-1 rounded-xl px-4 py-2.5 min-w-0"
          style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim, letterSpacing: "0.5px" }}>{L.inputLabel}</p>
          <p className="font-amiri font-bold" style={{ color: "rgba(212,175,55,0.75)", fontSize: "1.55rem", textShadow: "0 0 8px rgba(212,175,55,0.25)" }}>
            {lang === "ar" ? toArabicIndic(rawInput?.toLocaleString()) : rawInput?.toLocaleString()}
          </p>
        </div>
        <div className="flex-1 rounded-xl px-4 py-2.5 min-w-0"
          style={{ background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.30)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim, letterSpacing: "0.5px" }}>{L.workingMC}</p>
          <p className="font-amiri font-bold" style={{ color: G.text, fontSize: "1.75rem", textShadow: `0 0 12px ${G.glow}` }}>
            {lang === "ar" ? toArabicIndic(mc?.toLocaleString()) : mc?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Grid size required notice */}
      {!gridSize && (
        <p className="font-inter text-[9px] uppercase tracking-widest text-center py-2" style={{ color: "rgba(255,255,255,0.25)" }}>
          {lang === "ar" ? "اختر حجم المربع لحساب التسلسل الهرمي الكامل" : "Select a grid size to compute the full hierarchy"}
        </p>
      )}
      {/* No compatible square — no hierarchy, no names */}
      {gridSize && !hier && mc && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-4 space-y-2"
          style={{ background: "rgba(4,8,24,0.99)", borderColor: "rgba(255,80,80,0.50)", boxShadow: "0 0 24px rgba(255,80,80,0.14)" }}
        >
          <p className="font-inter text-[10px] uppercase tracking-widest text-center" style={{ color: "rgba(255,140,140,0.90)" }}>
            {lang === "ar" ? "⚠️ لا يمكن بناء مربع سحري متوافق" : "⚠️ No Compatible Magic Square"}
          </p>
          <p className="font-inter text-[9px] text-center" style={{ color: "rgba(255,255,255,0.45)" }}>
            {lang === "ar"
              ? `لا يمكن بناء مربع سحري للقيمة ${toArabicIndic(mc.toLocaleString())}. جرّب حجم مربع آخر.`
              : `No compatible magic square can be constructed for MC = ${mc.toLocaleString()}. Try a different grid size.`}
          </p>
        </motion.div>
      )}

      {/* 8 hierarchy rows — original layout */}
      {hier && (
        <div className="space-y-2">
          {rows.map((row, i) => (
            <motion.div key={row.key}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03, duration: 0.15 }}
              className="rounded-xl overflow-hidden border p-4"
              style={{ borderColor: row.highlight ? "rgba(212,175,55,0.40)" : "rgba(212,175,55,0.12)", background: row.highlight ? "rgba(212,175,55,0.12)" : "rgba(212,175,55,0.04)" }}
            >
              {/* Top row: Tier Label + Hierarchy Value */}
              <div className="flex items-center justify-between mb-4">
                <p className="font-inter text-[10px] uppercase tracking-widest"
                  style={{ color: row.highlight ? G.text : "rgba(212,175,55,0.60)", letterSpacing: "0.8px" }}>
                  {row.label}
                </p>
                <p 
                  className="font-amiri font-bold tabular-nums" 
                  dir="rtl"
                  lang="ar"
                  style={{ 
                    color: row.highlight ? G.text : "rgba(212,175,55,0.85)", 
                    fontSize: "1.3rem",
                    textShadow: row.highlight ? `0 0 12px ${G.glow}` : "none",
                    fontFamily: "'Noto Naskh Arabic', 'Amiri', 'Scheherazade New', serif"
                  }}>
                  {lang === "ar" ? toArabicIndic(row.val.toLocaleString()) : row.val.toLocaleString()}
                </p>
              </div>

              {/* Middle + Right: Angel Value label + value centered, Final Name on right */}
              {showNames && row.nameData && (
                <div className="flex items-center justify-between">
                  {/* Angel/Jinn Value centered */}
                  <div className="flex flex-col items-center flex-1">
                    <p className="font-inter text-[7px] uppercase tracking-widest mb-1" style={{ color: "rgba(212,175,55,0.45)", letterSpacing: "0.5px" }}>
                      {suffix.includes('angel') ? 'Angel (Arabic)' : 'Jinn (Arabic)'}
                    </p>
                    <p 
                      className="font-amiri font-bold" 
                      dir="rtl"
                      lang="ar"
                      style={{ 
                        color: "rgba(212,175,55,0.70)", 
                        fontSize: "1.2rem",
                        fontFamily: "'Noto Naskh Arabic', 'Amiri', 'Scheherazade New', serif"
                      }}>
                      {lang === "ar" ? toArabicIndic(row.nameData.adjustedValue.toLocaleString()) : row.nameData.adjustedValue.toLocaleString()}
                    </p>
                  </div>

                  {/* Final Name on the right — no container, just text */}
                  <span 
                    className="font-amiri font-bold" 
                    dir="rtl"
                    lang="ar"
                    style={{ 
                      fontSize: "1.8rem",
                      color: row.color,
                      textShadow: `0 0 12px ${row.color}66`,
                      fontFamily: "'Noto Naskh Arabic', 'Amiri', 'Scheherazade New', serif"
                    }}>
                    {row.nameData.name}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
});

export default MsHierarchyTable;