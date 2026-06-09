import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { buildHierarchy, numToArabic, numToHebrew, toArabicIndic, isCompatible } from "./msEngine";
import { perfStore } from "./perfStore";

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
//   suffix    — "none" | "ar-angel" | "ar-jinn" | "heb-angel" | "heb-jinn"
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
      if (suffix === "heb-jinn") {
        const name = hebrewJinnName(row.val);
        return { ...row, angel: null, jinn: { lbl: L.jinnHeb, ...name, color: "#F9A8D4" } };
      }
      // "none"
      return { ...row, angel: null, jinn: null };
    });

    perfStore.set("angelJinnNames", parseFloat((performance.now() - t0).toFixed(2)));
    return result;
  }, [hier, suffix, L]);

  // Always render if we have mc — show "choose grid size" message if no gridSize
  if (!mc) return null;

  const showNames = suffix !== "none";
  const activeNameKey = suffix.includes("angel") ? "angel" : suffix.includes("jinn") ? "jinn" : null;

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
          "none":      { c: "rgba(212,175,55,0.45)", b: "rgba(212,175,55,0.20)", bg: "rgba(212,175,55,0.04)", label: lang==="ar" ? "بدون لاحقة — أرقام فقط" : "No Suffix — Numeric Only" },
          "ar-angel":  { c: "#4FE3FF", b: "rgba(79,227,255,0.35)",   bg: "rgba(79,227,255,0.06)",   label: lang==="ar" ? "ملاك عربي — إيل (−٤١)" : "Arabic Angel — إيل (−41)" },
          "ar-jinn":   { c: "#FF9F5A", b: "rgba(255,159,90,0.35)",   bg: "rgba(255,159,90,0.06)",   label: lang==="ar" ? "جن عربي — طيش (−٣١٩)" : "Arabic Jinn — طيش (−319)" },
          "heb-angel": { c: "#C4B5FD", b: "rgba(196,181,253,0.35)",  bg: "rgba(196,181,253,0.06)",  label: lang==="ar" ? "ملاك عبري — אל (−٣١)" : "Hebrew Angel — אל (−31)" },
          "heb-jinn":  { c: "#F9A8D4", b: "rgba(249,168,212,0.35)",  bg: "rgba(249,168,212,0.06)",  label: lang==="ar" ? "جن عبري — תקש (−٣٢٩)" : "Hebrew Jinn — תקש (−329)" },
        };
        const cfg = badgeCfg[suffix] || badgeCfg["none"];
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
        <div className="flex-1 rounded-xl px-3 py-2 min-w-0"
          style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{L.inputLabel}</p>
          <p className="font-amiri font-bold text-lg" style={{ color: "rgba(212,175,55,0.70)" }}>
            {lang === "ar" ? toArabicIndic(rawInput?.toLocaleString()) : rawInput?.toLocaleString()}
          </p>
        </div>
        <div className="flex-1 rounded-xl px-3 py-2 min-w-0"
          style={{ background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.30)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{L.workingMC}</p>
          <p className="font-amiri font-bold text-xl" style={{ color: G.text }}>
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
              <div className="flex items-center justify-between px-3 py-2"
                style={{ background: row.highlight ? "rgba(212,175,55,0.12)" : "rgba(212,175,55,0.04)" }}>
                <p className="font-inter text-[9px] uppercase tracking-widest"
                  style={{ color: row.highlight ? G.text : "rgba(212,175,55,0.55)" }}>
                  {row.label}
                </p>
                <p className="font-amiri font-bold tabular-nums"
                  style={{ color: row.highlight ? G.text : "rgba(212,175,55,0.80)", fontSize: row.highlight ? "1.2rem" : "1rem" }}>
                  {lang === "ar" ? toArabicIndic(row.val.toLocaleString()) : row.val.toLocaleString()}
                </p>
              </div>

              {/* Name column — single entry (angel OR jinn depending on active suffix) */}
              {showNames && activeNameKey && row[activeNameKey] && (() => {
                const n = row[activeNameKey];
                return (
                  <div className="px-3 py-2 text-center"
                    style={{ background: "rgba(4,8,24,0.85)", borderTop: "1px solid rgba(212,175,55,0.08)" }}>
                    <p className="font-inter leading-tight mb-0.5" style={{ fontSize: "7px", color: "rgba(255,255,255,0.30)" }}>
                      {n.lbl}
                    </p>
                    <p className="font-amiri font-bold tabular-nums text-xs mb-1" style={{ color: n.color }}>
                      {lang === "ar" ? toArabicIndic(n.remainder.toLocaleString()) : n.remainder.toLocaleString()}
                    </p>
                    <p className="font-amiri" dir="rtl" style={{
                      color: n.color, letterSpacing: 0, fontSize: "28px", fontWeight: 900,
                      lineHeight: 1.2, wordWrap: "break-word", overflowWrap: "break-word",
                      textShadow: `0 0 12px ${n.color}44, 0 0 24px ${n.color}22`
                    }}>
                      {n.name}
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