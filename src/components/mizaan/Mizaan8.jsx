import { motion } from "framer-motion";
import MizaanHeader from "./MizaanHeader";
import { MIZAAN_DAYNIGHT_FULL, getDominantDayNight } from "../../lib/mizaan9Data";

const G = { borderHi: "rgba(212,175,55,0.65)", glow: "rgba(212,175,55,0.22)", text: "#F5D060", dim: "rgba(212,175,55,0.55)" };

export default function Mizaan8({ dominant, selected, onChange }) {
  const suggestedKey = getDominantDayNight(dominant);
  const toggle = (key) => onChange(selected === key ? null : key);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
      className="rounded-2xl border p-5 space-y-4"
      style={{ background: "rgba(6,14,36,0.98)", borderColor: G.borderHi, boxShadow: `0 0 40px ${G.glow}` }}>
      <MizaanHeader number="٨" titleAR="الميزان الثامن — النهار والليل" titleTR="Eighth Mizan · Day & Night" />
      <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
        Tap to select
      </p>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(MIZAAN_DAYNIGHT_FULL).map(([key, item], i) => {
          const isSuggested = key === suggestedKey;
          const isSelected  = selected === key;
          const col = item.color;
          return (
            <motion.button key={key}
              onClick={() => toggle(key)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: isSelected || isSuggested ? 1 : 0.3,
                boxShadow: isSelected
                  ? [`0 0 22px ${item.glow}`, `0 0 44px ${item.glow}`, `0 0 22px ${item.glow}`]
                  : "none",
              }}
              transition={{
                opacity: { duration: 0.4, delay: 0.08 * i },
                boxShadow: isSelected ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
              className="rounded-2xl border p-5 flex flex-col items-center gap-2 text-center cursor-pointer"
              style={{
                background: isSelected ? item.bg : "rgba(255,255,255,0.02)",
                borderColor: isSelected ? item.border : isSuggested ? `${item.border}55` : "rgba(255,255,255,0.07)",
                borderWidth: isSelected ? 2 : 1,
              }}>
              <motion.span
                style={{ fontSize: "2.8rem", lineHeight: 1 }}
                animate={isSelected ? {
                  filter: [`drop-shadow(0 0 6px ${item.glow})`, `drop-shadow(0 0 20px ${col})`, `drop-shadow(0 0 6px ${item.glow})`]
                } : {}}
                transition={isSelected ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : {}}>
                {item.icon}
              </motion.span>
              <p className="font-inter text-base font-bold uppercase tracking-widest" style={{ color: isSelected ? col : `${col}44` }}>{item.label}</p>
              <p className="font-amiri text-2xl" style={{ color: isSelected ? col : `${col}44` }}>{item.arabic}</p>
              <p className="font-inter text-sm font-bold tabular-nums" style={{ color: isSelected ? col : `${col}44` }}>{item.bast.toLocaleString()}</p>
              <p className="font-inter text-[10px] italic" style={{ color: isSelected ? `${col}cc` : `${col}33` }}>{item.desc}</p>
              {isSuggested && !isSelected && (
                <span className="font-inter text-[7px] uppercase tracking-widest" style={{ color: col, opacity: 0.7 }}>Suggested</span>
              )}
              {isSelected && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-inter text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full border"
                  style={{ color: col, borderColor: item.border, background: item.bg }}>
                  Selected ✓
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}