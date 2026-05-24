import { motion } from "framer-motion";
import MizaanHeader from "./MizaanHeader";
import { MIZAAN_DAYNIGHT_FULL, getDominantDayNight } from "../../lib/mizaan9Data";

const G = { borderHi: "rgba(212,175,55,0.65)", glow: "rgba(212,175,55,0.22)", text: "#F5D060", dim: "rgba(212,175,55,0.55)" };

export default function Mizaan8({ dominant }) {
  const activeKey = getDominantDayNight(dominant);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
      className="rounded-2xl border p-5 space-y-4"
      style={{ background: "rgba(6,14,36,0.98)", borderColor: G.borderHi, boxShadow: `0 0 40px ${G.glow}` }}>
      <MizaanHeader number="٨" titleAR="الميزان الثامن — النهار والليل" titleTR="Eighth Mizan · Day & Night" />

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(MIZAAN_DAYNIGHT_FULL).map(([key, item], i) => {
          const isActive = key === activeKey;
          const col = item.color;
          return (
            <motion.div key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: isActive ? 1 : 0.22,
                boxShadow: isActive
                  ? [`0 0 22px ${item.glow}`, `0 0 44px ${item.glow}`, `0 0 22px ${item.glow}`]
                  : "none",
              }}
              transition={{
                opacity: { duration: 0.4, delay: 0.08 * i },
                boxShadow: isActive ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 },
              }}
              className="rounded-2xl border p-5 flex flex-col items-center gap-2 text-center"
              style={{
                background: isActive ? item.bg : "rgba(255,255,255,0.02)",
                borderColor: isActive ? item.border : "rgba(255,255,255,0.07)",
                borderWidth: isActive ? 2 : 1,
              }}>
              <motion.span
                style={{ fontSize: "2.8rem", lineHeight: 1 }}
                animate={isActive ? {
                  filter: [`drop-shadow(0 0 6px ${item.glow})`, `drop-shadow(0 0 20px ${col})`, `drop-shadow(0 0 6px ${item.glow})`]
                } : {}}
                transition={isActive ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : {}}>
                {item.icon}
              </motion.span>
              <p className="font-inter text-base font-bold uppercase tracking-widest" style={{ color: isActive ? col : `${col}44` }}>{item.label}</p>
              <p className="font-amiri text-2xl" style={{ color: isActive ? col : `${col}44` }}>{item.arabic}</p>
              <p className="font-inter text-sm font-bold tabular-nums" style={{ color: isActive ? col : `${col}44` }}>{item.bast.toLocaleString()}</p>
              <p className="font-inter text-[10px] italic" style={{ color: isActive ? `${col}cc` : `${col}33` }}>{item.desc}</p>
              {isActive && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-inter text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full border"
                  style={{ color: col, borderColor: item.border, background: item.bg }}>
                  Active Force
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}