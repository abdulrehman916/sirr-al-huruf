import { motion } from "framer-motion";
import MizaanHeader from "./MizaanHeader";
import { MIZAAN_PURPOSES, getDominantPurpose } from "../../lib/mizaan9Data";

const G = { borderHi: "rgba(212,175,55,0.65)", glow: "rgba(212,175,55,0.22)", text: "#F5D060", dim: "rgba(212,175,55,0.55)" };

export default function Mizaan7({ dominant, selected, onChange }) {
  const suggestedKey = getDominantPurpose(dominant);

  const toggle = (key) => {
    const next = selected.includes(key)
      ? selected.filter(k => k !== key)
      : [...selected, key];
    onChange(next);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}
      className="rounded-2xl border p-5 space-y-4"
      style={{ background: "rgba(6,14,36,0.98)", borderColor: G.borderHi, boxShadow: `0 0 40px ${G.glow}` }}>
      <MizaanHeader number="٧" titleAR="الميزان السابع — المقصد" titleTR="Seventh Mizan · Purpose" />
      <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
        Tap to select — multiple allowed
      </p>

      <div className="grid grid-cols-2 gap-3">
        {MIZAAN_PURPOSES.map((p, i) => {
          const isSuggested = p.key === suggestedKey;
          const isSelected  = selected.includes(p.key);
          const col = p.color;
          return (
            <motion.button key={p.key}
              onClick={() => toggle(p.key)}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{
                opacity: isSuggested || isSelected ? 1 : 0.35,
                boxShadow: isSelected
                  ? [`0 0 18px ${col}55`, `0 0 36px ${col}88`, `0 0 18px ${col}55`]
                  : "none",
              }}
              transition={{
                opacity: { duration: 0.3, delay: i * 0.05 },
                boxShadow: isSelected ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
              className="rounded-2xl border p-4 flex flex-col items-center gap-2 text-center cursor-pointer"
              style={{
                background: isSelected ? `${col}14` : "rgba(255,255,255,0.02)",
                borderColor: isSelected ? `${col}88` : isSuggested ? `${col}33` : "rgba(255,255,255,0.07)",
                borderWidth: isSelected ? 2 : 1,
              }}>
              <span style={{ fontSize: "1.6rem" }}>{p.icon}</span>
              <p className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: isSelected ? col : `${col}66` }}>{p.label}</p>
              <p className="font-amiri text-base font-bold" style={{ color: isSelected ? col : `${col}55` }}>{p.arabic}</p>
              <p className="font-inter text-[9px] italic" style={{ color: isSelected ? `${col}cc` : `${col}44` }}>{p.desc}</p>
              {isSuggested && !isSelected && (
                <span className="font-inter text-[7px] uppercase tracking-widest" style={{ color: col, opacity: 0.7 }}>Suggested</span>
              )}
              {isSelected && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-inter text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-full border"
                  style={{ color: col, borderColor: `${col}88`, background: `${col}14` }}>
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