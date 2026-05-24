import { motion } from "framer-motion";
import MizaanHeader from "./MizaanHeader";
import { MIZAAN_KHAYR_SHARR } from "../../lib/mizaan9Data";

const G = { borderHi: "rgba(212,175,55,0.65)", glow: "rgba(212,175,55,0.22)", text: "#F5D060", dim: "rgba(212,175,55,0.55)" };

export default function Mizaan3({ dominant }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
      className="rounded-2xl border p-5 space-y-4"
      style={{ background: "rgba(6,14,36,0.98)", borderColor: G.borderHi, boxShadow: `0 0 40px ${G.glow}` }}>
      <MizaanHeader number="٣" titleAR="الميزان الثالث — الخير والشر" titleTR="Third Mizan · Khayr & Sharr" />

      <div className="grid grid-cols-2 gap-3">
        {Object.entries(MIZAAN_KHAYR_SHARR).map(([key, item], i) => {
          const isActive = item.elements.includes(dominant);
          return (
            <motion.div key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: isActive ? 1 : 0.25,
                boxShadow: isActive
                  ? [`0 0 20px ${item.glow}`, `0 0 40px ${item.glow}`, `0 0 20px ${item.glow}`]
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
              <span style={{ fontSize: "2rem" }}>{item.icon}</span>
              <p className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: isActive ? item.color : `${item.color}44` }}>{item.label}</p>
              <p className="font-amiri text-2xl font-bold" style={{ color: isActive ? item.color : `${item.color}44` }}>{item.arabic}</p>
              <p className="font-inter text-sm font-bold tabular-nums" style={{ color: isActive ? item.color : `${item.color}44` }}>{item.bast.toLocaleString()}</p>
              <p className="font-inter text-[9px] italic" style={{ color: isActive ? item.color : `${item.color}33`, opacity: 0.8 }}>{item.desc}</p>
              {isActive && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-inter text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full border"
                  style={{ color: item.color, borderColor: item.border, background: item.bg }}>
                  Active
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}