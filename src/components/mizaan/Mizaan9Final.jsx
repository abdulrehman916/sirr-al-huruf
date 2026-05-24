import { motion } from "framer-motion";
import MizaanHeader from "./MizaanHeader";
import { MIZAAN_ELEMENTS, getMizaanInterpretation } from "../../lib/mizaan9Engine";
import { MIZAAN_PLANETS_ALL, MIZAAN_DAYNIGHT_FULL, MIZAAN_PURPOSES, getDominantDayNight, getDominantPurpose, getDominantPlanet } from "../../lib/mizaan9Data";

const G = { borderHi: "rgba(212,175,55,0.65)", glow: "rgba(212,175,55,0.22)", glowHi: "rgba(212,175,55,0.55)", text: "#F5D060", dim: "rgba(212,175,55,0.55)", bg: "rgba(212,175,55,0.07)" };

const EL_COLOR = {
  fire: "#FF6B35", earth: "#A5C880", air: "#B2EBF2", water: "#4FC3F7",
};

export default function Mizaan9Final({ result }) {
  const { dominant, tiebreak, bast1Total, letterCount } = result;
  if (!dominant) return null;

  const el       = MIZAAN_ELEMENTS[dominant];
  const col      = EL_COLOR[dominant];
  const glow     = `${col}55`;
  const bg       = `${col}14`;
  const border   = `${col}66`;

  const planet       = MIZAAN_PLANETS_ALL.find(p => p.key === getDominantPlanet(dominant));
  const dnKey        = getDominantDayNight(dominant);
  const dn           = MIZAAN_DAYNIGHT_FULL[dnKey];
  const purposeKey   = getDominantPurpose(dominant);
  const purpose      = MIZAAN_PURPOSES.find(p => p.key === purposeKey);
  const interp       = getMizaanInterpretation(dominant, letterCount, bast1Total);

  // Power level based on bast
  const powerLevel = bast1Total > 15000 ? 'Supreme' : bast1Total > 8000 ? 'Strong' : bast1Total > 3000 ? 'Moderate' : 'Subtle';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
      className="rounded-2xl border p-5 space-y-5"
      style={{ background: `linear-gradient(160deg, ${bg}, rgba(4,10,28,0.99))`, borderColor: border, boxShadow: `0 0 60px ${glow}, 0 4px 32px rgba(0,0,0,0.6)` }}>
      <MizaanHeader number="٩" titleAR="الميزان التاسع — الخلاصة" titleTR="Ninth Mizan · Final Degree" />

      {/* Dominant element hero */}
      <div className="text-center space-y-2">
        <motion.div style={{ fontSize: "4rem", lineHeight: 1 }}
          animate={{
            filter: [`drop-shadow(0 0 10px ${glow})`, `drop-shadow(0 0 30px ${col})`, `drop-shadow(0 0 10px ${glow})`]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          {el.icon}
        </motion.div>
        <motion.p className="font-inter text-3xl font-bold uppercase tracking-widest"
          style={{ color: col }}
          animate={{ textShadow: [`0 0 16px ${glow}`, `0 0 40px ${col}88`, `0 0 16px ${glow}`] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          {el.labelTR}
        </motion.p>
        <p className="font-amiri text-2xl" style={{ color: `${col}cc` }}>{el.arabic}</p>
        {tiebreak?.rankName && (
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: col, opacity: 0.5 }}>
            ⚖ Resolved by {tiebreak.rankName}
          </p>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Bast-ul Aval', value: bast1Total.toLocaleString() },
          { label: 'Harf',         value: letterCount },
          { label: 'Power',        value: powerLevel },
        ].map((s, i) => (
          <div key={i} className="rounded-xl border p-3" style={{ background: "rgba(0,0,0,0.3)", borderColor: `${col}33` }}>
            <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: `${col}77` }}>{s.label}</p>
            <p className="font-inter text-sm font-bold" style={{ color: col }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {planet && (
          <div className="rounded-xl border p-3" style={{ background: "rgba(0,0,0,0.3)", borderColor: `${planet.color}33` }}>
            <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: `${planet.color}77` }}>Planet</p>
            <p className="font-inter text-xl" style={{ color: planet.color }}>{planet.symbol}</p>
            <p className="font-inter text-[9px] font-bold" style={{ color: planet.color }}>{planet.name}</p>
          </div>
        )}
        {dn && (
          <div className="rounded-xl border p-3" style={{ background: "rgba(0,0,0,0.3)", borderColor: `${dn.color}33` }}>
            <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: `${dn.color}77` }}>Force</p>
            <p style={{ fontSize: "1.4rem" }}>{dn.icon}</p>
            <p className="font-inter text-[9px] font-bold" style={{ color: dn.color }}>{dn.label}</p>
          </div>
        )}
        {purpose && (
          <div className="rounded-xl border p-3" style={{ background: "rgba(0,0,0,0.3)", borderColor: `${purpose.color}33` }}>
            <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: `${purpose.color}77` }}>Purpose</p>
            <p style={{ fontSize: "1.4rem" }}>{purpose.icon}</p>
            <p className="font-inter text-[9px] font-bold" style={{ color: purpose.color }}>{purpose.label}</p>
          </div>
        )}
      </div>

      {/* Interpretation lines */}
      <div className="space-y-2">
        <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>التفسير الروحاني — Mystical Reading</p>
        {interp.map((line, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.28 + i * 0.07 }}
            className="flex items-start gap-2.5 rounded-xl border px-3 py-2.5"
            style={{ background: bg, borderColor: border }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: col, boxShadow: `0 0 6px ${glow}` }} />
            <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>{line}</p>
          </motion.div>
        ))}
      </div>

      {/* Sacred seal */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border"
          style={{ background: G.bg, borderColor: G.borderHi }}>
          <span className="font-amiri text-lg" style={{ color: G.text }}>☽</span>
          <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>9 Mizaan Complete</span>
          <span className="font-amiri text-lg" style={{ color: G.text }}>☽</span>
        </div>
      </div>
    </motion.div>
  );
}