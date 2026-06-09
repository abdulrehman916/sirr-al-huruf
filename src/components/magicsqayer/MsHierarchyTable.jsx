import { motion } from "framer-motion";
import { buildHierarchy, angelJinn } from "./msEngine";
import { toAkramPieces } from "@/components/AkramCard";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
};

export default function MsHierarchyTable({ mc, gridSize, rawInput, negFixed, lang, L }) {
  if (!mc || !gridSize) return null;
  const hier = buildHierarchy(mc, gridSize);
  if (!hier) return null;

  const rows = [
    { key:"usurper",   label: L.usurper,   val: hier.usurper },
    { key:"guide",     label: L.guide,     val: hier.guide },
    { key:"mystery",   label: L.mystery,   val: hier.mystery },
    { key:"adjuster",  label: L.adjuster,  val: hier.adjuster,  highlight: true },
    { key:"leader",    label: L.leader,    val: hier.leader },
    { key:"regulator", label: L.regulator, val: hier.regulator },
    { key:"genGov",    label: L.genGov,    val: hier.genGov },
    { key:"highOver",  label: L.highOver,  val: hier.highOver },
  ];

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
        {rows.map((row, i) => {
          const aj = angelJinn(row.val);
          return (
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
              {/* Angel / Jinn sub-columns */}
              <div className="grid grid-cols-4" style={{ background:"rgba(4,8,24,0.80)" }}>
                {[
                  { lbl: L.angelAr,  v: aj.angelAr,  c:"#74C0FC" },
                  { lbl: L.angelHeb, v: aj.angelHeb, c:"#A78BFA" },
                  { lbl: L.jinnAr,   v: aj.jinnAr,   c:"#F87171" },
                  { lbl: L.jinnHeb,  v: aj.jinnHeb,  c:"#FB923C" },
                ].map(col => {
                  const letters = toAkramPieces(col.v).map(p => p.letter).join('').split('').reverse().join('');
                  return (
                  <div key={col.lbl} className="px-2 py-1.5 text-center border-r last:border-r-0"
                    style={{ borderColor:"rgba(212,175,55,0.08)" }}>
                    <p className="font-inter leading-tight" style={{ fontSize:"7px", color:"rgba(255,255,255,0.30)" }}>
                      {col.lbl}
                    </p>
                    <p className="font-amiri font-bold tabular-nums text-xs" style={{ color:col.c }}>
                      {col.v.toLocaleString()}
                    </p>
                    <p className="font-amiri font-bold text-sm leading-tight" dir="rtl" style={{ color:col.c, letterSpacing:0 }}>
                      {letters}
                    </p>
                  </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}