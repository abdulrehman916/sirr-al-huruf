import { motion } from "framer-motion";
import MizaanHeader from "./MizaanHeader";
import { MIZAAN_PLANETS_ALL, getDominantPlanet } from "../../lib/mizaan9Data";

const G = { borderHi: "rgba(212,175,55,0.65)", glow: "rgba(212,175,55,0.22)", text: "#F5D060", dim: "rgba(212,175,55,0.55)" };

export default function Mizaan6({ dominant, selected, onChange }) {
  const suggestedKey = getDominantPlanet(dominant);
  const toggle = (key) => onChange(selected === key ? null : key);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
      className="rounded-2xl border p-5 space-y-4"
      style={{ background: "rgba(6,14,36,0.98)", borderColor: G.borderHi, boxShadow: `0 0 40px ${G.glow}` }}>
      <MizaanHeader number="٦" titleAR="الميزان السادس — الكواكب" titleTR="Sixth Mizan · Planets" />
      <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>
        Tap to select your planet
      </p>

      <div className="grid grid-cols-4 gap-2">
        {MIZAAN_PLANETS_ALL.map((p, i) => {
          const isSuggested = p.key === suggestedKey;
          const isSelected  = selected === p.key;
          const col = p.color;
          return (
            <motion.button key={p.key}
              onClick={() => toggle(p.key)}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: isSelected || isSuggested ? 1 : 0.3,
                boxShadow: isSelected
                  ? [`0 0 20px ${col}55`, `0 0 40px ${col}88`, `0 0 20px ${col}55`]
                  : "none",
              }}
              transition={{
                opacity: { duration: 0.35, delay: i * 0.04 },
                boxShadow: isSelected ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 },
              }}
              whileTap={{ scale: 0.92 }}
              className="rounded-xl border p-3 flex flex-col items-center gap-1.5 text-center cursor-pointer"
              style={{
                background: isSelected ? `${col}18` : isSuggested ? `${col}08` : "rgba(255,255,255,0.02)",
                borderColor: isSelected ? `${col}88` : isSuggested ? `${col}33` : "rgba(255,255,255,0.06)",
                borderWidth: isSelected ? 2 : 1,
              }}>
              <motion.span
                className="font-inter font-bold"
                style={{ fontSize: isSelected ? "1.8rem" : "1.3rem", color: isSelected ? col : `${col}55` }}
                animate={isSelected ? {
                  textShadow: [`0 0 8px ${col}88`, `0 0 20px ${col}`, `0 0 8px ${col}88`]
                } : {}}
                transition={isSelected ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}>
                {p.symbol}
              </motion.span>
              <p className="font-inter text-[9px] font-bold uppercase tracking-wider" style={{ color: isSelected ? col : `${col}44` }}>{p.name}</p>
              <p className="font-amiri text-[10px]" style={{ color: isSelected ? col : `${col}33` }}>{p.arabic}</p>
              <p className="font-inter text-[9px] tabular-nums font-bold" style={{ color: isSelected ? col : `${col}44` }}>{p.bast.toLocaleString()}</p>
              {isSuggested && !isSelected && (
                <span className="font-inter text-[7px] uppercase" style={{ color: col, opacity: 0.7 }}>Suggested</span>
              )}
              {isSelected && (
                <span className="font-inter text-[7px] uppercase" style={{ color: col }}>✓</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}