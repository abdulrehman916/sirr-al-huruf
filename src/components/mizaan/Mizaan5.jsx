import { motion } from "framer-motion";
import MizaanHeader from "./MizaanHeader";
import { MIZAAN_DAYS, getBestDay } from "../../lib/mizaan9Data";

const G = { borderHi: "rgba(212,175,55,0.65)", glow: "rgba(212,175,55,0.22)", text: "#F5D060", dim: "rgba(212,175,55,0.55)", faint: "rgba(212,175,55,0.22)" };

export default function Mizaan5({ dominant }) {
  const bestDay = getBestDay(dominant);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
      className="rounded-2xl border p-5 space-y-4"
      style={{ background: "rgba(6,14,36,0.98)", borderColor: G.borderHi, boxShadow: `0 0 40px ${G.glow}` }}>
      <MizaanHeader number="٥" titleAR="الميزان الخامس — الأيام" titleTR="Fifth Mizan · Days" />

      <div className="grid grid-cols-4 gap-2">
        {MIZAAN_DAYS.map((d, i) => {
          const isActive = d.compatible.includes(dominant);
          const isBest   = d.key === bestDay;
          const col      = d.color;
          return (
            <motion.div key={d.key}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: isActive ? 1 : 0.22,
                boxShadow: isBest
                  ? [`0 0 18px ${col}55`, `0 0 36px ${col}88`, `0 0 18px ${col}55`]
                  : "none",
              }}
              transition={{
                opacity: { duration: 0.3, delay: i * 0.04 },
                boxShadow: isBest ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 },
              }}
              className="rounded-xl border p-2.5 flex flex-col items-center gap-1 text-center"
              style={{
                background: isBest ? `${col}14` : isActive ? `${col}08` : "rgba(255,255,255,0.02)",
                borderColor: isBest ? `${col}88` : isActive ? `${col}33` : "rgba(255,255,255,0.06)",
                borderWidth: isBest ? 2 : 1,
              }}>
              <span className="font-inter text-base" style={{ color: isBest ? col : `${col}55` }}>{d.symbol}</span>
              <span className="font-inter text-[9px] font-bold uppercase tracking-wider leading-none" style={{ color: isBest ? col : `${col}55` }}>{d.label.slice(0, 3)}</span>
              <span className="font-amiri text-[10px] leading-none" style={{ color: isBest ? col : `${col}44` }}>{d.arabic}</span>
              {isBest && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-inter text-[7px] uppercase tracking-widest"
                  style={{ color: col }}>Best</motion.span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}