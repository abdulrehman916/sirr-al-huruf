import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { buildHierarchy, toArabicIndic, isCompatible, ARABIC_ABJAD, HEBREW_GEMATRIA } from "./msEngine";
import { perfStore } from "./perfStore";
import { generateNameForHierarchyValue } from "./msPatternGenerator";

// Helper to get display name (pattern-based names are already valid)
const addTashkeelToArabicName = (name) => name;

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
};

// ── Book-formula letter extraction ─────────────────
// tier value - suffix → extract letters via Abjad (no vocalization)

function generateNameForValue(val, suffixType) {
  const result = generateNameForHierarchyValue(val, suffixType);
  
  if (!result || !result.success) {
    return { remainder: val, consonants: [], color: "#F5D060" };
  }
  
  const isAngel = suffixType.includes('angel');
  const color = isAngel ? "#4FE3FF" : suffixType === 'ar-jinn' ? "#FF9F5A" : "#F9A8D4";
  
  return {
    remainder: result.remainder,
    consonants: result.consonants,
    color
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
      
      return {
        ...row,
        angel: isAngel ? { ...nameData, color } : null,
        jinn: !isAngel ? { ...nameData, color } : null
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

              {/* Name column with complete extraction chain */}
              {showNames && activeNameKey && row[activeNameKey] && (() => {
                const n = row[activeNameKey];
                const suffixValue = suffix === "ar-angel" ? 41 : suffix === "ar-jinn" ? 319 : suffix === "heb-angel" ? 31 : 329;
                const adjustedValue = n.remainder !== undefined ? n.remainder : row.val;
                
                return (
                  <div className="px-3 text-center"
                    style={{ background: "rgba(4,8,24,0.85)", borderTop: "1px solid rgba(212,175,55,0.08)", padding: "12px 16px 20px" }}>
                    {/* Complete Calculation Chain */}
                    <div className="space-y-2">
                      {/* Step 1: Original Value */}
                      <div className="px-2 py-1.5 rounded-lg" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
                        <p className="font-inter text-[6px] uppercase tracking-widest mb-1" style={{ color: "rgba(212,175,55,0.45)" }}>Original Value</p>
                        <p className="font-amiri font-bold" style={{ color: G.text, fontSize: "1.4rem" }}>{toArabicIndic(row.val.toLocaleString())}</p>
                      </div>
                      
                      {/* Step 2: Adjusted Value */}
                      {n.remainder !== undefined && row.val < suffixValue && (
                        <div className="px-2 py-1.5 rounded-lg" style={{ background: "rgba(79,227,255,0.08)", border: `1px solid ${n.color}30` }}>
                          <p className="font-inter text-[6px] uppercase tracking-widest mb-1" style={{ color: n.color }}>Adjusted Extraction Value</p>
                          <p className="font-inter text-[7px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                            {row.val} + 360 - {suffixValue} = {toArabicIndic(n.remainder.toLocaleString())}
                          </p>
                        </div>
                      )}
                      
                      {/* Step 3: Abjad Breakdown */}
                      {n.consonants && n.consonants.length > 0 && (
                        <div className="px-2 py-1.5 rounded-lg" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.20)" }}>
                          <p className="font-inter text-[6px] uppercase tracking-widest mb-1" style={{ color: "rgba(212,175,55,0.50)" }}>Abjad Breakdown</p>
                          <p className="font-inter text-[7px]" style={{ color: G.text }}>
                            {toArabicIndic(adjustedValue.toLocaleString())} = {n.consonants.map((c, i) => {
                              const letterData = ARABIC_ABJAD.find(l => l.letter === c);
                              return `${letterData?.val || 0}`;
                            }).join(' + ')}
                          </p>
                        </div>
                      )}
                      
                      {/* Step 4: Extracted Letters — FINAL RESULT */}
                      {n.consonants && n.consonants.length > 0 && (
                        <div className="px-2 py-2 rounded-lg" style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.30)" }}>
                          <p className="font-inter text-[6px] uppercase tracking-widest mb-2" style={{ color: "rgba(212,175,55,0.60)" }}>Extracted Letters — Final Name</p>
                          <div className="flex items-center justify-center gap-2 mt-1" dir="rtl">
                            {n.consonants.map((c, i) => (
                              <span key={i} className="font-amiri text-2xl px-2 py-1 rounded"
                                style={{ 
                                  background: "rgba(212,175,55,0.20)", 
                                  color: n.color,
                                  border: `1px solid ${n.color}50`,
                                  textShadow: `0 0 12px ${n.color}55`
                                }}>
                                {c}
                              </span>
                            ))}
                          </div>
                          <p className="font-inter text-[7px] mt-2" style={{ color: n.color }}>
                            Final: {n.consonants.join(' ')}
                          </p>
                        </div>
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