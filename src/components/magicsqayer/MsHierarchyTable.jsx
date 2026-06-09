import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { buildHierarchy, angelJinn, numToHebrew, numToArabic, toArabicIndic } from "./msEngine";
import { perfStore } from "./perfStore";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
};

// suffix prop controls name display:
//   "none"   → numeric hierarchy only (no names)
//   "arabic" → Arabic Angel names (suffix إيل, value 41)
//   "hebrew" → Hebrew Angel names (suffix אל, value 31)

const MsHierarchyTable = memo(function MsHierarchyTable({ mc, gridSize, rawInput, negFixed, suffix, lang, L }) {
  const hier = useMemo(() => {
    if (!mc || !gridSize) return null;
    const t0 = performance.now();
    const result = buildHierarchy(mc, gridSize);
    perfStore.set("buildHierarchy", parseFloat((performance.now()-t0).toFixed(2)));
    return result;
  }, [mc, gridSize]);

  // Build rows — only compute names when suffix is active
  const rows = useMemo(() => {
    if (!hier) return [];
    const t0 = performance.now();
    const base = [
      { key:"usurper",   label: L.usurper,   val: hier.usurper },
      { key:"guide",     label: L.guide,     val: hier.guide },
      { key:"mystery",   label: L.mystery,   val: hier.mystery },
      { key:"adjuster",  label: L.adjuster,  val: hier.adjuster, highlight: true },
      { key:"leader",    label: L.leader,    val: hier.leader },
      { key:"regulator", label: L.regulator, val: hier.regulator },
      { key:"genGov",    label: L.genGov,    val: hier.genGov },
      { key:"highOver",  label: L.highOver,  val: hier.highOver },
    ];

    const result = base.map(row => {
      if (suffix === "none") return { ...row, nameCol: null };

      const aj = angelJinn(row.val);

      if (suffix === "arabic") {
        // Angel: v−41 → letters → إيل
        const letters = numToArabic(aj.angelAr).split('').reverse().join('');
        return {
          ...row,
          nameCol: { lbl: L.angelAr, v: aj.angelAr, c: "#4FE3FF", text: letters + "إيل" },
        };
      }

      if (suffix === "hebrew") {
        // Angel: v−31 → letters → אל
        const letters = numToHebrew(aj.angelHeb);
        return {
          ...row,
          nameCol: { lbl: L.angelHeb, v: aj.angelHeb, c: "#C4B5FD", text: letters + "אל" },
        };
      }

      return { ...row, nameCol: null };
    });

    perfStore.set("angelJinnNames", parseFloat((performance.now()-t0).toFixed(2)));
    return result;
  }, [hier, suffix, L]);

  if (!mc || !gridSize || !hier) return null;

  const showNames = suffix !== "none";

  return (
    <motion.div
      key={`hier-${mc}-${gridSize}-${suffix}`}
      initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}
      className="rounded-2xl border p-4 space-y-3"
      style={{ background:"rgba(4,8,24,0.99)", borderColor: G.borderHi, boxShadow:`0 0 28px ${G.glow}` }}
    >
      <p className="font-inter text-[10px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
        {L.hierarchy}
      </p>

      {/* Active system badge */}
      <div className="flex justify-center">
        <span className="font-inter text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border"
          style={{
            borderColor: suffix === "none" ? "rgba(212,175,55,0.20)" : suffix === "arabic" ? "rgba(79,227,255,0.35)" : "rgba(196,181,253,0.35)",
            color:        suffix === "none" ? "rgba(212,175,55,0.45)" : suffix === "arabic" ? "#4FE3FF" : "#C4B5FD",
            background:   suffix === "none" ? "rgba(212,175,55,0.04)" : suffix === "arabic" ? "rgba(79,227,255,0.06)" : "rgba(196,181,253,0.06)",
          }}>
          {suffix === "none"
            ? (lang === "ar" ? "بدون لاحقة — أرقام فقط" : "No Suffix — Numeric Only")
            : suffix === "arabic"
              ? (lang === "ar" ? "ملائكة عربية — إيل (٤١)" : "Arabic Angels — إيل (41)")
              : (lang === "ar" ? "ملائكة عبرية — אל (٣١)" : "Hebrew Angels — אל (31)")
          }
        </span>
      </div>

      <div className="h-px w-full" style={{ background:`linear-gradient(90deg,transparent,${G.borderHi},transparent)` }} />

      {/* Summary row */}
      <div className="flex flex-wrap gap-2">
        <div className="flex-1 rounded-xl px-3 py-2 min-w-0" style={{ background:"rgba(212,175,55,0.06)", border:"1px solid rgba(212,175,55,0.15)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color:G.dim }}>{L.inputLabel}</p>
          <p className="font-amiri font-bold text-lg" style={{ color:"rgba(212,175,55,0.70)" }}>
            {lang === "ar" ? toArabicIndic(rawInput?.toLocaleString()) : rawInput?.toLocaleString()}
          </p>
        </div>
        {negFixed && (
          <div className="flex-1 rounded-xl px-3 py-2 min-w-0" style={{ background:"rgba(255,120,60,0.08)", border:"1px solid rgba(255,120,60,0.30)" }}>
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color:"rgba(255,180,100,0.80)" }}>{L.negFix}</p>
          </div>
        )}
        <div className="flex-1 rounded-xl px-3 py-2 min-w-0" style={{ background:"rgba(212,175,55,0.10)", border:"1px solid rgba(212,175,55,0.30)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color:G.dim }}>{L.workingMC}</p>
          <p className="font-amiri font-bold text-xl" style={{ color:G.text }}>
            {lang === "ar" ? toArabicIndic(mc?.toLocaleString()) : mc?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 8 hierarchy rows */}
      <div className="space-y-1.5">
        {rows.map((row, i) => (
          <motion.div key={row.key}
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ delay: i*0.03, duration:0.15 }}
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: row.highlight ? "rgba(212,175,55,0.40)" : "rgba(212,175,55,0.12)" }}
          >
            {/* Numeric row header */}
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

            {/* Name column — only shown when suffix is active */}
            {showNames && row.nameCol && (
              <div className="px-3 py-2 text-center" style={{ background:"rgba(4,8,24,0.80)", borderTop:"1px solid rgba(212,175,55,0.08)" }}>
                <p className="font-inter leading-tight mb-0.5" style={{ fontSize:"7px", color:"rgba(255,255,255,0.30)" }}>
                  {row.nameCol.lbl}
                </p>
                <p className="font-amiri font-bold tabular-nums text-xs mb-1" style={{ color: row.nameCol.c }}>
                  {lang === "ar" ? toArabicIndic(row.nameCol.v.toLocaleString()) : row.nameCol.v.toLocaleString()}
                </p>
                <p className="font-amiri" dir="rtl" style={{
                  color: row.nameCol.c, letterSpacing:0, fontSize:"32px", fontWeight:900,
                  lineHeight:1.2, wordWrap:"break-word", overflowWrap:"break-word",
                  textShadow:`0 0 12px ${row.nameCol.c}44, 0 0 24px ${row.nameCol.c}22`
                }}>
                  {row.nameCol.text}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

export default MsHierarchyTable;