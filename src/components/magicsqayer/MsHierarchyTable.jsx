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
//   mc        — working magic constant (rawNum when suffix=none, rawNum−suffix otherwise)
//   gridSize  — selected grid size (can be null — hierarchy still shows if mc is valid)
//   rawInput  — original user input (for display)
//   suffix    — "none" | "arabic" | "hebrew"
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
      if (suffix === "none") {
        return { ...row, angel: null, jinn: null };
      }

      if (suffix === "arabic") {
        const angel = arabicAngelName(row.val);
        const jinn  = arabicJinnName(row.val);
        return {
          ...row,
          angel: { lbl: L.angelAr, ...angel, color: "#4FE3FF" },
          jinn:  { lbl: L.jinnAr,  ...jinn,  color: "#FF9F5A" },
        };
      }

      if (suffix === "hebrew") {
        const angel = hebrewAngelName(row.val);
        const jinn  = hebrewJinnName(row.val);
        return {
          ...row,
          angel: { lbl: L.angelHeb, ...angel, color: "#C4B5FD" },
          jinn:  { lbl: L.jinnHeb,  ...jinn,  color: "#F9A8D4" },
        };
      }

      return { ...row, angel: null, jinn: null };
    });

    perfStore.set("angelJinnNames", parseFloat((performance.now() - t0).toFixed(2)));
    return result;
  }, [hier, suffix, L]);

  // Always render if we have mc — show "choose grid size" message if no gridSize
  if (!mc) return null;

  const showNames = suffix !== "none";

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
      <div className="flex justify-center">
        <span className="font-inter text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border"
          style={{
            borderColor: suffix === "none" ? "rgba(212,175,55,0.20)" : suffix === "arabic" ? "rgba(79,227,255,0.35)" : "rgba(196,181,253,0.35)",
            color:       suffix === "none" ? "rgba(212,175,55,0.45)" : suffix === "arabic" ? "#4FE3FF" : "#C4B5FD",
            background:  suffix === "none" ? "rgba(212,175,55,0.04)" : suffix === "arabic" ? "rgba(79,227,255,0.06)" : "rgba(196,181,253,0.06)",
          }}>
          {suffix === "none"
            ? (lang === "ar" ? "بدون لاحقة — أرقام فقط" : "No Suffix — Numeric Only")
            : suffix === "arabic"
              ? (lang === "ar" ? "ملائكة وجن عربي — إيل / طيش" : "Arabic Angels & Jinn — إيل / طيش")
              : (lang === "ar" ? "ملائكة وجن عبري — אל / תקש" : "Hebrew Angels & Jinn — אל / תקש")
          }
        </span>
      </div>

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

              {/* Angel + Jinn name columns — side by side */}
              {showNames && row.angel && (
                <div className="grid grid-cols-2 divide-x divide-white/5"
                  style={{ background: "rgba(4,8,24,0.85)", borderTop: "1px solid rgba(212,175,55,0.08)" }}>

                  {/* Angel */}
                  <div className="px-3 py-2 text-center">
                    <p className="font-inter leading-tight mb-0.5" style={{ fontSize: "7px", color: "rgba(255,255,255,0.30)" }}>
                      {row.angel.lbl}
                    </p>
                    <p className="font-amiri font-bold tabular-nums text-xs mb-1" style={{ color: row.angel.color }}>
                      {lang === "ar" ? toArabicIndic(row.angel.remainder.toLocaleString()) : row.angel.remainder.toLocaleString()}
                    </p>
                    <p className="font-amiri" dir="rtl" style={{
                      color: row.angel.color, letterSpacing: 0, fontSize: "28px", fontWeight: 900,
                      lineHeight: 1.2, wordWrap: "break-word", overflowWrap: "break-word",
                      textShadow: `0 0 12px ${row.angel.color}44, 0 0 24px ${row.angel.color}22`
                    }}>
                      {row.angel.name}
                    </p>
                  </div>

                  {/* Jinn */}
                  <div className="px-3 py-2 text-center">
                    <p className="font-inter leading-tight mb-0.5" style={{ fontSize: "7px", color: "rgba(255,255,255,0.30)" }}>
                      {row.jinn.lbl}
                    </p>
                    <p className="font-amiri font-bold tabular-nums text-xs mb-1" style={{ color: row.jinn.color }}>
                      {lang === "ar" ? toArabicIndic(row.jinn.remainder.toLocaleString()) : row.jinn.remainder.toLocaleString()}
                    </p>
                    <p className="font-amiri" dir="rtl" style={{
                      color: row.jinn.color, letterSpacing: 0, fontSize: "28px", fontWeight: 900,
                      lineHeight: 1.2, wordWrap: "break-word", overflowWrap: "break-word",
                      textShadow: `0 0 12px ${row.jinn.color}44, 0 0 24px ${row.jinn.color}22`
                    }}>
                      {row.jinn.name}
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