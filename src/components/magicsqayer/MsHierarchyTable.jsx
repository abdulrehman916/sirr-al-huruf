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
  
  // Greedy decomposition: largest values first (original extraction order)
  for (let i = ARABIC_ABJAD.length - 1; i >= 0 && remaining > 0; i--) {
    const { val, letter } = ARABIC_ABJAD[i];
    while (remaining >= val) {
      letters.push(letter);
      remaining -= val;
    }
  }
  
  // Return in original extraction order (ش ل ز for 337) - NO REVERSAL
  // This order is used for final name generation
  return letters;
}

function generateTraditionalName(value, suffixType) {
  const suffix = SUFFIXES[suffixType];
  const isAngel = suffixType.includes('angel');
  
  // Apply Ulvi adjustment: if value < suffix, add 360 first
  let adjustedValue = value;
  if (value < suffix) {
    adjustedValue = value + 360 - suffix;
  } else {
    adjustedValue = value - suffix;
  }
  
  if (adjustedValue <= 0) adjustedValue = 1;
  
  // BAST-2: Extract letters from adjusted value - these letters are NEVER changed
  const consonants = extractLettersFromValue(adjustedValue);
  
  // BAST-2 TASHKEEL ONLY: First=Fatha, Middle=Kasra, Last=Sukun
  // NO phonology, NO synthesis, NO letter changes
  const FATHA = '\u064E';
  const KASRA = '\u0650';
  const SUKUN = '\u0652';
  
  // Apply harakat to extracted letters ONLY
  let vocalizedName = consonants.map((c, i) => {
    const position = i + 1;
    const isFirst = position === 1;
    const isLast = position === consonants.length;
    
    // Bast-2 rule: First=Fatha, Middle=Kasra, Last=Sukun
    let vowel;
    if (isFirst) vowel = FATHA;
    else if (isLast) vowel = SUKUN;
    else vowel = KASRA;
    
    return c + vowel; // Letter + harakat ONLY
  }).join('');
  
  // Angel suffix (إيل) is added AFTER extracted letters - this is a marker, not replacement
  if (isAngel && vocalizedName) {
    // Remove final sukun from last extracted letter, then add إيل
    vocalizedName = vocalizedName.replace(/\u0652$/, '') + KASRA + 'ي' + FATHA + 'ل';
  }
  
  return {
    originalValue: value,
    adjustedValue,
    consonants, // Raw extracted letters for audit
    name: vocalizedName || 'N/A'
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

      {/* 8 hierarchy rows */}
      {hier && (
        <div className="space-y-2">
          {rows.map((row, i) => (
            <motion.div key={row.key}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03, duration: 0.15 }}
              className="rounded-xl overflow-hidden border"
              style={{ borderColor: row.highlight ? "rgba(212,175,55,0.40)" : "rgba(212,175,55,0.12)" }}
            >
              {/* Hierarchy Value */}
              <div className="flex items-center justify-between px-4 py-3"
                style={{ background: row.highlight ? "rgba(212,175,55,0.12)" : "rgba(212,175,55,0.04)" }}>
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
                    fontSize: "1.7rem",
                    textShadow: row.highlight ? `0 0 12px ${G.glow}` : "none",
                    fontFamily: "'Noto Naskh Arabic', 'Amiri', 'Scheherazade New', serif"
                  }}>
                  {lang === "ar" ? toArabicIndic(row.val.toLocaleString()) : row.val.toLocaleString()}
                </p>
              </div>

              {/* Angel/Jinn Value + Final Name */}
              {showNames && row.nameData && (
                <div className="px-4 py-3 space-y-3" style={{ background: "rgba(4,8,24,0.85)", borderTop: "1px solid rgba(212,175,55,0.08)" }}>
                  {/* Angel/Jinn Value */}
                  <div className="flex items-center justify-center gap-3">
                    <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.50)" }}>
                      {suffix.includes('angel') ? 'Angel Value' : 'Jinn Value'}
                    </p>
                    <p 
                      className="font-amiri font-bold" 
                      dir="rtl"
                      lang="ar"
                      style={{ 
                        color: row.color, 
                        fontSize: "1.5rem",
                        textShadow: `0 0 12px ${row.color}66`,
                        fontFamily: "'Noto Naskh Arabic', 'Amiri', 'Scheherazade New', serif"
                      }}>
                      {lang === "ar" ? toArabicIndic(row.nameData.adjustedValue.toLocaleString()) : row.nameData.adjustedValue.toLocaleString()}
                    </p>
                  </div>

                  {/* Extracted Letters (Raw Consonants) */}
                  {row.nameData.consonants && row.nameData.consonants.length > 0 && (
                    <div className="px-3 py-2 rounded-lg" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.20)" }}>
                      <p className="font-inter text-[7px] uppercase tracking-widest mb-2 text-center" style={{ color: "rgba(212,175,55,0.55)" }}>
                        Extracted Letters (Bast-2)
                      </p>
                      <div className="flex items-center justify-center gap-2" dir="rtl">
                        {row.nameData.consonants.map((c, i) => (
                          <span key={i} className="font-amiri text-2xl px-2 py-1 rounded"
                            style={{ 
                              background: "rgba(212,175,55,0.15)", 
                              color: row.color,
                              border: `1px solid ${row.color}50`
                            }}>
                            {c}
                          </span>
                        ))}
                      </div>
                      <p className="font-inter text-[6px] text-center mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                        Original extraction order: {row.nameData.consonants.join(' ')} = {row.nameData.adjustedValue}
                      </p>
                    </div>
                  )}

                  {/* Final Name (Tashkeel Applied) */}
                  <div className="px-3 py-3 rounded-lg" style={{ background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.25)" }}>
                    <p className="font-inter text-[7px] uppercase tracking-widest mb-2 text-center" style={{ color: "rgba(212,175,55,0.55)" }}>
                      Final Name (Bast-2 Tashkeel Only)
                    </p>
                    <div className="flex items-center justify-center" dir="rtl">
                      <span 
                        className="font-amiri font-bold px-6 py-3 rounded-lg" 
                        dir="rtl"
                        lang="ar"
                        style={{ 
                          fontSize: "3.2rem",
                          color: "#FFFFFF",
                          background: `linear-gradient(135deg, ${row.color}22, ${row.color}11)`,
                          border: `2px solid ${row.color}66`,
                          textShadow: `0 0 24px ${row.color}88, 0 2px 8px rgba(0,0,0,0.8)`,
                          letterSpacing: "0.5px",
                          lineHeight: "2.2",
                          fontFamily: "'Noto Naskh Arabic', 'Amiri', 'Scheherazade New', serif"
                        }}>
                        {row.nameData.name}
                      </span>
                    </div>
                    <p className="font-inter text-[6px] text-center mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {suffix.includes('angel') ? 'Angel suffix إيل added' : 'Jinn name (no suffix)'} — Letters unchanged, harakat only
                    </p>
                  </div>
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