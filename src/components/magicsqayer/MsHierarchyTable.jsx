import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { buildHierarchy, toArabicIndic, isCompatible } from "./msEngine";
import { perfStore } from "./perfStore";

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

const ARABIC_ABJAD = [
  {letter:"ا", val:1}, {letter:"ب", val:2}, {letter:"ج", val:3}, {letter:"د", val:4},
  {letter:"ه", val:5}, {letter:"و", val:6}, {letter:"ز", val:7}, {letter:"ح", val:8},
  {letter:"ط", val:9}, {letter:"ي", val:10}, {letter:"ك", val:20}, {letter:"ل", val:30},
  {letter:"م", val:40}, {letter:"ن", val:50}, {letter:"س", val:60}, {letter:"ع", val:70},
  {letter:"ف", val:80}, {letter:"ص", val:90}, {letter:"ق", val:100}, {letter:"ر", val:200},
  {letter:"ش", val:300}, {letter:"ت", val:400}, {letter:"ث", val:500}, {letter:"خ", val:600},
  {letter:"ذ", val:700}, {letter:"ض", val:800}, {letter:"ظ", val:900}, {letter:"غ", val:1000},
];

function extractLettersFromValue(value) {
  if (!value || value <= 0) return [];
  
  const letters = [];
  let remaining = value;
  
  // BAST-2 RULE: Greedy decomposition - largest values first (1000 → 1)
  // This produces the IMMUTABLE extraction order (e.g., 337 = ش ل ز)
  for (let i = ARABIC_ABJAD.length - 1; i >= 0 && remaining > 0; i--) {
    const { val, letter } = ARABIC_ABJAD[i];
    while (remaining >= val) {
      letters.push(letter);
      remaining -= val;
    }
  }
  
  // CRITICAL: BAST-2 EXTRACTION ORDER IS FINAL - NO REVERSAL
  // Letters are concatenated in exact extraction order (greedy first → last)
  // Example: 337 extracts [ش, ل, ز] → final sequence = شلز (NOT زلش)
  // These consonants are IMMUTABLE - only harakat may be added during naming
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
  
  // STEP 2: BAST-2 EXTRACTION - Greedy Abjad decomposition (1000 → 1)
  // CRITICAL: Extraction order is IMMUTABLE - NO REVERSAL, NO REORDERING
  // Example: 337 = 300 + 30 + 7 = [ش, ل, ز] → sequence = شلز
  const consonants = extractLettersFromValue(adjustedValue);
  
  // STEP 3: BAST-2 ASSEMBLY - Direct concatenation in extraction order
  // CRITICAL: consonants.join('') preserves greedy order (first extracted → last extracted)
  // Example: [ش, ل, ز].join('') = 'شلز' (NOT 'زلش')
  const extractedSequence = consonants.join('');
  
  // STEP 4: Apply Tashkeel ONLY (Bast-2 harakat rule)
  // First letter = Fatha, Middle letters = Kasra, Last letter = Sukun
  // Tashkeel does NOT change consonant order or values
  const FATHA = '\u064E';
  const KASRA = '\u0650';
  const SUKUN = '\u0652';
  
  let vocalizedRoot = '';
  for (let i = 0; i < consonants.length; i++) {
    const letter = consonants[i];
    let harakat;
    
    if (i === 0) {
      harakat = FATHA; // First letter
    } else if (i === consonants.length - 1) {
      harakat = SUKUN; // Last letter
    } else {
      harakat = KASRA; // Middle letters
    }
    
    vocalizedRoot += letter + harakat;
  }
  
  // STEP 5: For Angels, display root + space + ايل (SEPARATED, not merged)
  let displayName = vocalizedRoot || 'N/A';
  if (isAngel) {
    displayName = vocalizedRoot + ' ' + 'ايل';
  }
  
  return {
    originalValue: value,
    adjustedValue,
    consonants, // BAST-2: immutable extraction order
    extractedSequence, // Direct concatenation (extraction order preserved)
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
          "ar-angel":  { c: "#4FE3FF", b: "rgba(79,227,255,0.35)",   bg: "rgba(79,227,255,0.06)",   label: lang==="ar" ? "ملاك عربي — إيل (−٤١)" : "Arabic Angel — إيل (−41)" },
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