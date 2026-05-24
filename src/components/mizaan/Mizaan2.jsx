import { motion } from "framer-motion";
import MizaanHeader from "./MizaanHeader";
import { MIZAAN_ELEMENTS } from "../../lib/mizaan9Engine";

const G = { border: "rgba(212,175,55,0.40)", borderHi: "rgba(212,175,55,0.65)", glow: "rgba(212,175,55,0.22)", text: "#F5D060", dim: "rgba(212,175,55,0.55)" };

const EL = {
  fire:  { color: "#FF6B35", glow: "rgba(255,107,53,0.45)",  bg: "rgba(255,107,53,0.12)",  border: "rgba(255,107,53,0.50)" },
  earth: { color: "#A5C880", glow: "rgba(165,200,128,0.45)", bg: "rgba(165,200,128,0.10)", border: "rgba(165,200,128,0.50)" },
  air:   { color: "#B2EBF2", glow: "rgba(178,235,242,0.40)", bg: "rgba(178,235,242,0.08)", border: "rgba(178,235,242,0.45)" },
  water: { color: "#4FC3F7", glow: "rgba(79,195,247,0.45)",  bg: "rgba(79,195,247,0.12)",  border: "rgba(79,195,247,0.50)" },
};

export default function Mizaan2({ dominant, tiebreak }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="rounded-2xl border p-5 space-y-4"
      style={{ background: "rgba(6,14,36,0.98)", borderColor: G.borderHi, boxShadow: `0 0 40px ${G.glow}` }}>
      <MizaanHeader number="٢" titleAR="الميزان الثاني — العناصر" titleTR="Second Mizan · Anasir" />

      <div className="grid grid-cols-2 gap-3">
        {Object.entries(MIZAAN_ELEMENTS).map(([key, el], i) => {
          const s = EL[key];
          const isDom = key === dominant;
          return (
            <motion.div key={key}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{
                opacity: isDom ? 1 : 0.28,
                scale: isDom ? 1 : 0.97,
                boxShadow: isDom
                  ? [`0 0 22px ${s.glow}`, `0 0 44px ${s.glow}`, `0 0 22px ${s.glow}`]
                  : "0 0 0 transparent",
              }}
              transition={{
                opacity: { duration: 0.4, delay: 0.07 * i },
                scale:   { duration: 0.4, delay: 0.07 * i },
                boxShadow: isDom ? { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.07 * i } : { duration: 0.3 },
              }}
              className="rounded-2xl border p-4 flex flex-col items-center gap-2 text-center"
              style={{
                background: isDom ? `linear-gradient(160deg, ${s.bg}, rgba(0,0,0,0.5))` : "rgba(255,255,255,0.02)",
                borderColor: isDom ? s.border : "rgba(255,255,255,0.07)",
                borderWidth: isDom ? 2 : 1,
              }}>

              <motion.span
                style={{ fontSize: isDom ? "2.4rem" : "1.6rem", lineHeight: 1 }}
                animate={isDom ? {
                  filter: [`drop-shadow(0 0 6px ${s.glow})`, `drop-shadow(0 0 20px ${s.color})`, `drop-shadow(0 0 6px ${s.glow})`],
                } : { filter: "none" }}
                transition={isDom ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}>
                {el.icon}
              </motion.span>

              <div>
                <p className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: isDom ? s.color : `${s.color}55` }}>
                  {el.labelTR}
                </p>
                <p className="font-amiri text-base" style={{ color: isDom ? s.color : `${s.color}44` }}>
                  {el.arabic}
                </p>
              </div>

              <p className="font-inter text-sm font-bold tabular-nums" style={{ color: isDom ? s.color : `${s.color}44` }}>
                {el.bast2?.toLocaleString()}
              </p>

              {isDom && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-inter text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full border font-bold"
                  style={{ color: s.color, borderColor: s.border, background: s.bg }}>
                  Galip · Active
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {tiebreak?.rankName && (
        <p className="font-inter text-[9px] text-center uppercase tracking-widest" style={{ color: G.dim, opacity: 0.6 }}>
          ⚖ Eşitlik — {tiebreak.rankName} ile çözüldü
        </p>
      )}
    </motion.div>
  );
}