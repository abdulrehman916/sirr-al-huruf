import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { buildHierarchy, numToArabic, numToHebrew, toArabicIndic, isCompatible } from "./msEngine";
import { perfStore } from "./perfStore";
import { getNameForHierarchyValue, getPatternInfo } from "./msPatternGenerator";
import { validateName } from "./msNameValidator";

// Helper to get display name (pattern-based names are already valid)
const addTashkeelToArabicName = (name) => name;

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
};

// ── Pattern-based name generation ─────────────────────────────────
// Uses 200+ authentic morphological patterns instead of mechanical conversion

function generateNameForValue(val, suffixType) {
  const category = suffixType === 'ar-angel' || suffixType === 'heb-angel' ? 'angel' : 'jinn';
  const result = getNameForHierarchyValue(val, suffixType);
  
  if (!result || !result.success) {
    return { remainder: val, name: '—', pattern: null, score: 0, passed: false };
  }
  
  return {
    remainder: val,
    name: result.fullName || result.generatedName,
    pattern: result.pattern,
    score: result.validation.score,
    passed: result.validation.passed,
    failureReason: result.validation.failureReason,
    phoneticRules: result.phoneticRules,
    consonants: result.consonants,
    vowels: result.vowels
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

  // Build display rows with pattern-based names
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
      const nameData = generateNameForValue(row.val, suffix);
      const isAngel = suffix.includes('angel');
      const color = isAngel ? "#4FE3FF" : suffix === 'ar-jinn' ? "#FF9F5A" : "#F9A8D4";
      const lbl = isAngel ? (suffix === 'heb-angel' ? L.angelHeb : L.angelAr) : (suffix === 'heb-jinn' ? L.jinnHeb : L.jinnAr);
      
      return {
        ...row,
        angel: isAngel ? { lbl, ...nameData, color } : null,
        jinn: !isAngel ? { lbl, ...nameData, color } : null
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
        <div className="space-y-1.5">
          {rows.map((row, i) => (
            <motion.div key={row.key}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03, duration: 0.15 }}
              className="rounded-xl overflow-hidden border"
              style={{ borderColor: row.highlight ? "rgba(212,175,55,0.40)" : "rgba(212,175,55,0.12)" }}
            >
              {/* Phonetic rules display */}
              {row[activeNameKey]?.phoneticRules && (
                <div className="px-3 py-1.5" style={{ background: "rgba(212,175,55,0.04)", borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
                  <div className="flex flex-wrap gap-1">
                    {row[activeNameKey].phoneticRules.slice(0, 4).map((rule, idx) => (
                      <span key={idx} className="font-inter text-[7px] px-1.5 py-0.5 rounded"
                        style={{ background: "rgba(212,175,55,0.08)", color: "rgba(212,175,55,0.60)", border: "1px solid rgba(212,175,55,0.15)" }}>
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* Numeric row */}
              <div className="flex items-center justify-between px-4 py-2.5"
                style={{ background: row.highlight ? "rgba(212,175,55,0.12)" : "rgba(212,175,55,0.04)" }}>
                <p className="font-inter text-[10px] uppercase tracking-widest"
                  style={{ color: row.highlight ? G.text : "rgba(212,175,55,0.60)", letterSpacing: "0.8px" }}>
                  {row.label}
                </p>
                <p className="font-amiri font-bold tabular-nums"
                  style={{ 
                    color: row.highlight ? G.text : "rgba(212,175,55,0.85)", 
                    fontSize: row.highlight ? "1.7rem" : "1.45rem",
                    textShadow: row.highlight ? `0 0 12px ${G.glow}` : "none",
                    letterSpacing: "0.5px"
                  }}>
                  {lang === "ar" ? toArabicIndic(row.val.toLocaleString()) : row.val.toLocaleString()}
                </p>
              </div>

              {/* Name column with pattern info and validation */}
              {showNames && activeNameKey && row[activeNameKey] && (() => {
                const n = row[activeNameKey];
                const isArabic = suffix === "ar-angel" || suffix === "ar-jinn";
                const displayName = n.name || '—';
                const isValid = n.passed !== false;
                const patternInfo = n.pattern ? getPatternInfo(n.pattern.id) : null;
                
                return (
                  <div className="px-3 text-center"
                    style={{ background: "rgba(4,8,24,0.85)", borderTop: "1px solid rgba(212,175,55,0.08)", padding: "12px 16px 20px" }}>
                    {/* Phonetic rules breakdown */}
                    {n.phoneticRules && n.phoneticRules.length > 0 && (
                      <div className="mb-2 px-2 py-1 rounded-lg inline-block"
                        style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.20)" }}>
                        <p className="font-inter text-[7px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.50)" }}>
                          Phonetic Rules: {n.phoneticRules.slice(0, 3).join(' · ')}{n.phoneticRules.length > 3 ? '...' : ''}
                        </p>
                      </div>
                    )}
                    
                    {/* Value */}
                    <p className={`font-amiri font-bold tabular-nums mb-1.5`} style={{ 
                      color: n.color, 
                      fontSize: "17px",
                      textShadow: `0 0 8px ${n.color}44`
                    }}>
                      {lang === "ar" ? toArabicIndic(n.remainder.toLocaleString()) : n.remainder.toLocaleString()}
                    </p>
                    
                    {/* Generated name with full tashkeel */}
                    <p 
                      dir="rtl" 
                      lang={isArabic ? "ar" : "he"}
                      style={{
                        color: isValid ? n.color : "rgba(255,100,100,0.70)",
                        fontSize: isArabic ? "50px" : "38px",
                        fontWeight: isArabic ? 600 : 900,
                        lineHeight: isArabic ? 2.0 : 1.4,
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        textShadow: isValid ? `0 0 16px ${n.color}55, 0 0 32px ${n.color}33` : 'none',
                        padding: "8px 4px 16px",
                        fontFamily: isArabic
                          ? "'Scheherazade New', 'Noto Naskh Arabic', 'Amiri', 'Traditional Arabic', serif"
                          : "'Amiri', serif",
                        fontFeatureSettings: "'liga' 1, 'calt' 1, 'kern' 1",
                        textRendering: "optimizeLegibility",
                        WebkitFontSmoothing: "antialiased",
                        MozOsxFontSmoothing: "grayscale",
                      }}
                    >
                      {displayName}
                    </p>
                    
                    {/* Consonant/vowel breakdown */}
                    {n.consonants && n.vowels && (
                      <div className="mt-2 flex items-center justify-center gap-1 flex-wrap">
                        {n.consonants.map((c, i) => (
                          <span key={i} className="font-inter text-[7px] px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(212,175,55,0.10)", color: "rgba(212,175,55,0.70)", border: "1px solid rgba(212,175,55,0.20)" }}>
                            {c}{n.vowels[i] || ''}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Pronunciation score and validation */}
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className="font-inter text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ 
                          background: isValid ? "rgba(100,220,100,0.10)" : "rgba(255,100,100,0.10)",
                          color: isValid ? "rgba(100,220,100,0.90)" : "rgba(255,100,100,0.90)",
                          border: `1px solid ${isValid ? "rgba(100,220,100,0.30)" : "rgba(255,100,100,0.30)"}`
                        }}>
                        Score: {n.score || 0}/100
                      </span>
                      {isValid ? (
                        <span className="font-inter text-[7px] px-1.5 py-0.5 rounded" style={{ color: "rgba(100,220,100,0.70)" }}>✓ Valid</span>
                      ) : (
                        <span className="font-inter text-[7px] px-1.5 py-0.5 rounded" style={{ color: "rgba(255,100,100,0.70)" }}>✗ {n.failureReason || 'Invalid'}</span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
});

export default MsHierarchyTable;