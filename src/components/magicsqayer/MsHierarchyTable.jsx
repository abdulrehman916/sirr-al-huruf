import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { buildHierarchy, angelJinn, numToHebrew } from "./msEngine";
import { toAkramPieces } from "@/components/AkramCard";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
};

function toArabicLetters(v) {
  return toAkramPieces(v).map(p => p.letter).join('').split('').reverse().join('');
}

const MsHierarchyTable = memo(function MsHierarchyTable({ mc, gridSize, rawInput, negFixed, lang, L }) {
  const hier = useMemo(() => {
    if (!mc || !gridSize) return null;
    const t0 = performance.now();
    const result = buildHierarchy(mc, gridSize);
    console.log(`[PERF] buildHierarchy(mc=${mc}, n=${gridSize}): ${(performance.now()-t0).toFixed(2)}ms`);
    return result;
  }, [mc, gridSize]);

  // All 8 rows with pre-computed angel/jinn letters — only recomputes when mc/gridSize change
  const rows = useMemo(() => {
    if (!hier) return [];
    const t0 = performance.now();
    const result = [
    { key:"usurper",   label: L.usurper,   val: hier.usurper },
    { key:"guide",     label: L.guide,     val: hier.guide },
    { key:"mystery",   label: L.mystery,   val: hier.mystery },
    { key:"adjuster",  label: L.adjuster,  val: hier.adjuster,  highlight: true },
    { key:"leader",    label: L.leader,    val: hier.leader },
    { key:"regulator", label: L.regulator, val: hier.regulator },
    { key:"genGov",    label: L.genGov,    val: hier.genGov },
    { key:"highOver",  label: L.highOver,  val: hier.highOver },
  ].map(row => {
      const aj = angelJinn(row.val);
      const tA0 = performance.now();
      const arAngel = toArabicLetters(aj.angelAr);
      const arJinn  = toArabicLetters(aj.jinnAr);
      const hebAngel = numToHebrew(aj.angelHeb);
      const hebJinn  = numToHebrew(aj.jinnHeb);
      console.log(`[PERF]   names for row ${row.key} (val=${row.val}): ${(performance.now()-tA0).toFixed(3)}ms`);
      return {
        ...row,
        cols: [
          { lbl: L.angelAr,  v: aj.angelAr,  c:"#74C0FC", text: arAngel  + "إيل" },
          { lbl: L.angelHeb, v: aj.angelHeb, c:"#A78BFA", text: hebAngel  + "אל"  },
          { lbl: L.jinnAr,   v: aj.jinnAr,   c:"#F87171", text: arJinn            },
          { lbl: L.jinnHeb,  v: aj.jinnHeb,  c:"#FB923C", text: hebJinn           },
        ],
      };
    });
    console.log(`[PERF] all 8 rows + angel/jinn names: ${(performance.now()-t0).toFixed(2)}ms`);
    return result;
  }, [hier, L]);

  if (!mc || !gridSize || !hier) return null;

  return (
    <motion.div
      key={`hier-${mc}-${gridSize}`}
      initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}
      className="rounded-2xl border p-4 space-y-3"
      style={{ background:"rgba(4,8,24,0.99)", borderColor: G.borderHi, boxShadow:`0 0 28px ${G.glow}` }}
    >
      <p className="font-inter text-[10px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
        {L.hierarchy}
      </p>
      <div className="h-px w-full" style={{ background:`linear-gradient(90deg,transparent,${G.borderHi},transparent)` }} />

      {/* Summary row */}
      <div className="flex flex-wrap gap-2">
        <div className="flex-1 rounded-xl px-3 py-2 min-w-0" style={{ background:"rgba(212,175,55,0.06)", border:"1px solid rgba(212,175,55,0.15)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color:G.dim }}>{L.inputLabel}</p>
          <p className="font-amiri font-bold text-lg" style={{ color:"rgba(212,175,55,0.70)" }}>{rawInput?.toLocaleString()}</p>
        </div>
        {negFixed && (
          <div className="flex-1 rounded-xl px-3 py-2 min-w-0" style={{ background:"rgba(255,120,60,0.08)", border:"1px solid rgba(255,120,60,0.30)" }}>
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color:"rgba(255,180,100,0.80)" }}>{L.negFix}</p>
          </div>
        )}
        <div className="flex-1 rounded-xl px-3 py-2 min-w-0" style={{ background:"rgba(212,175,55,0.10)", border:"1px solid rgba(212,175,55,0.30)" }}>
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color:G.dim }}>{L.workingMC}</p>
          <p className="font-amiri font-bold text-xl" style={{ color:G.text }}>{mc?.toLocaleString()}</p>
        </div>
      </div>

      {/* 8 hierarchy rows */}
      <div className="space-y-1.5">
        {rows.map((row, i) => (
            <motion.div key={row.key}
              initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }}
              transition={{ delay: i*0.05, duration:0.25 }}
              className="rounded-xl overflow-hidden border"
              style={{ borderColor: row.highlight ? "rgba(212,175,55,0.40)" : "rgba(212,175,55,0.12)" }}
            >
              <div className="flex items-center justify-between px-3 py-2"
                style={{ background: row.highlight ? "rgba(212,175,55,0.12)" : "rgba(212,175,55,0.04)" }}>
                <p className="font-inter text-[9px] uppercase tracking-widest"
                  style={{ color: row.highlight ? G.text : "rgba(212,175,55,0.55)" }}>
                  {row.label}
                </p>
                <p className="font-amiri font-bold tabular-nums"
                  style={{ color: row.highlight ? G.text : "rgba(212,175,55,0.80)", fontSize: row.highlight ? "1.2rem" : "1rem" }}>
                  {row.val.toLocaleString()}
                </p>
              </div>
              {/* Angel / Jinn sub-columns — letters pre-computed in useMemo above */}
              <div className="grid grid-cols-4" style={{ background:"rgba(4,8,24,0.80)" }}>
                {row.cols.map(col => (
                  <div key={col.lbl} className="px-2 py-1.5 text-center border-r last:border-r-0"
                    style={{ borderColor:"rgba(212,175,55,0.08)" }}>
                    <p className="font-inter leading-tight" style={{ fontSize:"7px", color:"rgba(255,255,255,0.30)" }}>
                      {col.lbl}
                    </p>
                    <p className="font-amiri font-bold tabular-nums text-xs" style={{ color:col.c }}>
                      {col.v.toLocaleString()}
                    </p>
                    <p className="font-amiri leading-tight" dir="rtl" style={{ color:col.c, letterSpacing:0, fontSize:"24px", fontWeight:700 }}>
                      {col.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

export default MsHierarchyTable;