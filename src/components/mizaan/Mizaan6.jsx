import { motion } from "framer-motion";
import MizaanHeader from "./MizaanHeader";
import { MIZAAN_PLANETS_ALL, getDominantPlanet } from "../../lib/mizaan9Data";

const G = { borderHi: "rgba(212,175,55,0.65)", glow: "rgba(212,175,55,0.22)", text: "#F5D060", dim: "rgba(212,175,55,0.55)" };

export default function Mizaan6({ dominant }) {
  const activePlanetKey = getDominantPlanet(dominant);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
      className="rounded-2xl border p-5 space-y-4"
      style={{ background: "rgba(6,14,36,0.98)", borderColor: G.borderHi, boxShadow: `0 0 40px ${G.glow}` }}>
      <MizaanHeader number="٦" titleAR="الميزان السادس — الكواكب" titleTR="Sixth Mizan · Planets" />

      <div className="grid grid-cols-4 gap-2">
        {MIZAAN_PLANETS_ALL.map((p, i) => {
          const isActive = p.element === dominant;
          const isMain   = p.key === activePlanetKey;
          const col      = p.color;
          return (
            <motion.div key={p.key}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: isActive ? 1 : 0.22,
                boxShadow: isMain
                  ? [`0 0 20px ${col}55`, `0 0 40px ${col}88`, `0 0 20px ${col}55`]
                  : "none",
              }}
              transition={{
                opacity: { duration: 0.35, delay: i * 0.04 },
                boxShadow: isMain ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 },
              }}
              className="rounded-xl border p-3 flex flex-col items-center gap-1.5 text-center"
              style={{
                background: isMain ? `${col}18` : isActive ? `${col}08` : "rgba(255,255,255,0.02)",
                borderColor: isMain ? `${col}88` : isActive ? `${col}33` : "rgba(255,255,255,0.06)",
                borderWidth: isMain ? 2 : 1,
              }}>
              <motion.span
                className="font-inter font-bold"
                style={{ fontSize: isMain ? "1.8rem" : "1.3rem", color: isActive ? col : `${col}44` }}
                animate={isMain ? {
                  textShadow: [`0 0 8px ${col}88`, `0 0 20px ${col}`, `0 0 8px ${col}88`]
                } : {}}
                transition={isMain ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}>
                {p.symbol}
              </motion.span>
              <p className="font-inter text-[9px] font-bold uppercase tracking-wider" style={{ color: isActive ? col : `${col}44` }}>{p.name}</p>
              <p className="font-amiri text-[10px]" style={{ color: isActive ? col : `${col}33` }}>{p.arabic}</p>
              <p className="font-inter text-[9px] tabular-nums font-bold" style={{ color: isMain ? col : `${col}44` }}>{p.bast.toLocaleString()}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}