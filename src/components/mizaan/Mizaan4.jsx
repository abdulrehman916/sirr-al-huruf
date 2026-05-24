import { motion } from "framer-motion";
import MizaanHeader from "./MizaanHeader";
import { MIZAAN_HOURS, getBestHour } from "../../lib/mizaan9Data";

const G = { borderHi: "rgba(212,175,55,0.65)", glow: "rgba(212,175,55,0.22)", text: "#F5D060", dim: "rgba(212,175,55,0.55)", faint: "rgba(212,175,55,0.22)" };

export default function Mizaan4({ dominant, selected, onChange }) {
  const bestHour = getBestHour(dominant);
  const toggle = (hour) => onChange(selected === hour ? null : hour);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
      className="rounded-2xl border p-5 space-y-4"
      style={{ background: "rgba(6,14,36,0.98)", borderColor: G.borderHi, boxShadow: `0 0 40px ${G.glow}` }}>
      <MizaanHeader number="٤" titleAR="الميزان الرابع — الساعات" titleTR="Fourth Mizan · Hours" />
      <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
        Tap to select your hour
      </p>

      <div className="grid grid-cols-4 gap-2">
        {MIZAAN_HOURS.map((h, i) => {
          const isSuggested = h.hour === bestHour;
          const isSelected  = selected === h.hour;
          return (
            <motion.button key={h.hour}
              onClick={() => toggle(h.hour)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isSelected || isSuggested ? 1 : 0.3,
                boxShadow: isSelected
                  ? [`0 0 16px ${G.glow}`, `0 0 30px rgba(212,175,55,0.45)`, `0 0 16px ${G.glow}`]
                  : "none",
              }}
              transition={{
                opacity: { duration: 0.3, delay: i * 0.03 },
                boxShadow: isSelected ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 },
              }}
              whileTap={{ scale: 0.92 }}
              className="rounded-xl border p-2 flex flex-col items-center gap-1 text-center cursor-pointer"
              style={{
                background: isSelected ? "rgba(212,175,55,0.12)" : isSuggested ? "rgba(212,175,55,0.05)" : "rgba(255,255,255,0.02)",
                borderColor: isSelected ? G.borderHi : isSuggested ? G.faint : "rgba(255,255,255,0.06)",
                borderWidth: isSelected ? 2 : 1,
              }}>
              <span className="font-inter text-[9px]" style={{ color: isSelected ? G.text : "rgba(255,255,255,0.3)" }}>{h.symbol}</span>
              <span className="font-inter text-xs font-bold tabular-nums" style={{ color: isSelected ? G.text : isSuggested ? G.dim : "rgba(255,255,255,0.25)" }}>{h.label}</span>
              <span className="font-amiri text-[10px] leading-none" style={{ color: isSelected ? G.text : "rgba(255,255,255,0.2)" }}>{h.arabic}</span>
              <span className="font-inter text-[8px] leading-none" style={{ color: isSelected ? G.dim : "rgba(255,255,255,0.15)" }}>{h.planet}</span>
              {isSuggested && !isSelected && (
                <span className="font-inter text-[7px] uppercase" style={{ color: G.dim, opacity: 0.7 }}>Best</span>
              )}
              {isSelected && (
                <span className="font-inter text-[7px] uppercase" style={{ color: G.text }}>✓</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}