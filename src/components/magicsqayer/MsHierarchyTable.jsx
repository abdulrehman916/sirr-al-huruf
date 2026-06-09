import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { buildHierarchy, numToArabic, numToHebrew, toArabicIndic, isCompatible } from "./msEngine";
import { perfStore } from "./perfStore";
import { addTashkeelToArabicName } from "./msTashkeel";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
};

// ── Manuscript name derivation ────────────────────────────────────
// Underflow rule: if val < subtractVal → use val + 360 − subtractVal
function applySubtract(val, subtractVal) {
  return val < subtractVal ? val + 360 - subtractVal : val - subtractVal;
}

// Arabic Angel: remainder → Arabic letters (LSD-first reversed for RTL) + إيل
function arabicAngelName(val) {
  const r = applySubtract(val, 41);
  const letters = numToArabic(r).split('').reverse().join('');
  return { remainder: r, name: letters + "إيل" };
}

// Arabic Jinn: remainder → Arabic letters + طيش  (suffix val 319 = 9+10+300 = ط+ي+ش)
function arabicJinnName(val) {
  const r = applySubtract(val, 319);
  const letters = numToArabic(r).split('').reverse().join('');
  return { remainder: r, name: letters + "طيش" };
}

// Hebrew Angel: remainder → Hebrew letters + אל
function hebrewAngelName(val) {
  const r = applySubtract(val, 31);
  const letters = numToHebrew(r);
  return { remainder: r, name: letters + "אל" };
}

// Hebrew Jinn: remainder → Hebrew letters + תקש  (suffix val 329 = 9+20+300 = ט+כ+ש)
function hebrewJinnName(val) {
  const r = applySubtract(val, 329);
  const letters = numToHebrew(r);
  return { remainder: r, name: letters + "תקש" };
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
    const t0 = performance.now();
    const result = buildHierarchy(mc, gridSize);
    perfStore.set("buildHierarchy", parseFloat((performance.now() - t0).toFixed(2)));
    return result;
  }, [mc, gridSize]);

  // Build display rows with Angel + Jinn name columns
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
      if (suffix === "ar-angel") {
        const name = arabicAngelName(row.val);
        return { ...row, angel: { lbl: L.angelAr, ...name, color: "#4FE3FF" }, jinn: null };
      }
      if (suffix === "ar-jinn") {
        const name = arabicJinnName(row.val);
        return { ...row, angel: null, jinn: { lbl: L.jinnAr, ...name, color: "#FF9F5A" } };
      }
      if (suffix === "heb-angel") {
        const name = hebrewAngelName(row.val);
        return { ...row, angel: { lbl: L.angelHeb, ...name, color: "#C4B5FD" }, jinn: null };
      }
      // "heb-jinn"
      const name = hebrewJinnName(row.val);
      return { ...row, angel: null, jinn: { lbl: L.jinnHeb, ...name, color: "#F9A8D4" } };
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
      {/* Incompatible notice — hierarchy shown but square cannot be generated */}
      {gridSize && hier && !isCompatible(mc, gridSize) && (
        <p className="font-inter text-[8px] uppercase tracking-widest text-center py-1 rounded-lg"
          style={{ color: "rgba(255,160,80,0.75)", background: "rgba(255,120,0,0.06)", border: "1px solid rgba(255,120,0,0.15)" }}>
          {lang === "ar" ? "⚠️ عرض الهرمية — المربع السحري غير متوافق" : "⚠️ Hierarchy shown — square incompatible"}
        </p>
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

              {/* Name column — single entry (angel OR jinn depending on active suffix) */}
              {showNames && activeNameKey && row[activeNameKey] && (() => {
                const n = row[activeNameKey];
                const isArabic = suffix === "ar-angel" || suffix === "ar-jinn";
                const suffixType = suffix === "ar-angel" ? "angel" : suffix === "ar-jinn" ? "jinn" : null;
                const displayName = isArabic && suffixType ? addTashkeelToArabicName(n.name, suffixType) : n.name;
                return (
                  <div className="px-3 text-center"
                    style={{ background: "rgba(4,8,24,0.85)", borderTop: "1px solid rgba(212,175,55,0.08)", padding: "12px 16px 20px" }}>
                    <p className="font-inter leading-tight mb-1" style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.5px" }}>
                      {n.lbl}
                    </p>
                    <p className={`font-amiri font-bold tabular-nums mb-1.5`} style={{ 
                      color: n.color, 
                      fontSize: "17px",
                      textShadow: `0 0 8px ${n.color}44`
                    }}>
                      {lang === "ar" ? toArabicIndic(n.remainder.toLocaleString()) : n.remainder.toLocaleString()}
                    </p>
                    <p 
                      dir="rtl" 
                      lang={isArabic ? "ar" : "he"}
                      style={{
                        color: n.color,
                        fontSize: isArabic ? "50px" : "38px",
                        fontWeight: isArabic ? 600 : 900,
                        lineHeight: isArabic ? 2.0 : 1.4,
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        textShadow: `0 0 16px ${n.color}55, 0 0 32px ${n.color}33, 0 2px 4px rgba(0,0,0,0.8)`,
                        padding: "8px 4px 16px",
                        // Scheherazade New: purpose-built for fully-vocalized Arabic,
                        // best tashkeel glyph spacing and mark positioning of any web font.
                        // Arabic letters stay naturally connected — no artificial spacing.
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