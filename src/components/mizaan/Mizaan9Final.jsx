import { motion } from "framer-motion";
import MizaanHeader from "./MizaanHeader";
import { MIZAAN_ELEMENTS, getMizaanInterpretation } from "../../lib/mizaan9Engine";
import { MIZAAN_PLANETS_ALL, MIZAAN_DAYNIGHT_FULL, MIZAAN_PURPOSES, MIZAAN_DAYS, MIZAAN_HOURS, MIZAAN_KHAYR_SHARR } from "../../lib/mizaan9Data";

const G = { borderHi: "rgba(212,175,55,0.65)", glow: "rgba(212,175,55,0.22)", glowHi: "rgba(212,175,55,0.55)", text: "#F5D060", dim: "rgba(212,175,55,0.55)", bg: "rgba(212,175,55,0.07)" };

const EL_COLOR = {
  fire: "#FF6B35", earth: "#A5C880", air: "#B2EBF2", water: "#4FC3F7",
};

export default function Mizaan9Final({ result, selections }) {
  const { dominant, tiebreak, bast1Total, letterCount } = result;
  if (!dominant) return null;

  // Use user selections where available, fall back to auto-computed
  const activeElements = selections.elements.length > 0 ? selections.elements : [dominant];
  const primaryElement = activeElements[0];
  const el  = MIZAAN_ELEMENTS[primaryElement] ?? MIZAAN_ELEMENTS[dominant];
  const col = EL_COLOR[primaryElement] ?? EL_COLOR[dominant];
  const glow   = `${col}55`;
  const bg     = `${col}14`;
  const border = `${col}66`;

  const planet  = selections.planet
    ? MIZAAN_PLANETS_ALL.find(p => p.key === selections.planet)
    : null;

  const dn = selections.daynight
    ? MIZAAN_DAYNIGHT_FULL[selections.daynight]
    : null;

  const purposes = selections.purposes.length > 0
    ? selections.purposes.map(k => MIZAAN_PURPOSES.find(p => p.key === k)).filter(Boolean)
    : [];

  const days = selections.days.length > 0
    ? selections.days.map(k => MIZAAN_DAYS.find(d => d.key === k)).filter(Boolean)
    : [];

  const hour = selections.hour
    ? MIZAAN_HOURS.find(h => h.hour === selections.hour)
    : null;

  const khayrSharr = selections.khayrSharr
    ? MIZAAN_KHAYR_SHARR[selections.khayrSharr]
    : null;

  const interp = getMizaanInterpretation(primaryElement, letterCount, bast1Total);
  const powerLevel = bast1Total > 15000 ? 'Supreme' : bast1Total > 8000 ? 'Strong' : bast1Total > 3000 ? 'Moderate' : 'Subtle';

  // Compatibility score based on how many selections match the dominant element
  const compatCount = [
    selections.elements.includes(dominant),
    planet?.element === dominant,
    dn?.elements?.includes(dominant),
    purposes.some(p => p.elements.includes(dominant)),
  ].filter(Boolean).length;
  const compatLabel = compatCount >= 3 ? 'High ✦✦✦' : compatCount >= 2 ? 'Medium ✦✦' : compatCount >= 1 ? 'Low ✦' : 'Custom';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
      className="rounded-2xl border p-5 space-y-5"
      style={{ background: `linear-gradient(160deg, ${bg}, rgba(4,10,28,0.99))`, borderColor: border, boxShadow: `0 0 60px ${glow}, 0 4px 32px rgba(0,0,0,0.6)` }}>
      <MizaanHeader number="٩" titleAR="الميزان التاسع — الخلاصة" titleTR="Ninth Mizan · Final Degree" />

      {/* Active elements hero */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          {activeElements.map(ek => {
            const e = MIZAAN_ELEMENTS[ek];
            const c = EL_COLOR[ek];
            return (
              <motion.div key={ek} style={{ fontSize: ek === primaryElement ? "3.8rem" : "2.4rem", lineHeight: 1 }}
                animate={{ filter: [`drop-shadow(0 0 10px ${c}55)`, `drop-shadow(0 0 28px ${c})`, `drop-shadow(0 0 10px ${c}55)`] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                {e?.icon}
              </motion.div>
            );
          })}
        </div>
        <motion.p className="font-inter text-3xl font-bold uppercase tracking-widest"
          style={{ color: col }}
          animate={{ textShadow: [`0 0 16px ${glow}`, `0 0 40px ${col}88`, `0 0 16px ${glow}`] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          {el?.labelTR}
        </motion.p>
        <p className="font-amiri text-2xl" style={{ color: `${col}cc` }}>{el?.arabic}</p>
        {activeElements.length > 1 && (
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: col, opacity: 0.6 }}>
            {activeElements.length} Elements Active
          </p>
        )}
        {tiebreak?.rankName && (
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: col, opacity: 0.5 }}>
            ⚖ Resolved by {tiebreak.rankName}
          </p>
        )}
      </div>

      {/* Stats */}
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

      {/* User selections summary */}
      <div className="space-y-2">
        <p className="font-inter text-[9px] uppercase tracking-widest text-center" style={{ color: G.dim }}>User Selections Summary</p>
        <div className="grid grid-cols-2 gap-2">

          {/* Khayr / Sharr */}
          <div className="rounded-xl border p-3 flex flex-col gap-1"
            style={{ background: "rgba(0,0,0,0.3)", borderColor: khayrSharr ? `${khayrSharr.color}44` : "rgba(255,255,255,0.08)" }}>
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Khayr / Sharr</p>
            {khayrSharr ? (
              <p className="font-amiri text-lg font-bold" style={{ color: khayrSharr.color }}>{khayrSharr.arabic} {khayrSharr.icon}</p>
            ) : (
              <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>Not selected</p>
            )}
          </div>

          {/* Planet */}
          <div className="rounded-xl border p-3 flex flex-col gap-1"
            style={{ background: "rgba(0,0,0,0.3)", borderColor: planet ? `${planet.color}44` : "rgba(255,255,255,0.08)" }}>
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Planet</p>
            {planet ? (
              <div className="flex items-center gap-1.5">
                <span className="font-inter text-lg" style={{ color: planet.color }}>{planet.symbol}</span>
                <span className="font-inter text-xs font-bold" style={{ color: planet.color }}>{planet.name}</span>
              </div>
            ) : (
              <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>Not selected</p>
            )}
          </div>

          {/* Day/Night */}
          <div className="rounded-xl border p-3 flex flex-col gap-1"
            style={{ background: "rgba(0,0,0,0.3)", borderColor: dn ? `${dn.color}44` : "rgba(255,255,255,0.08)" }}>
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Day / Night</p>
            {dn ? (
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: "1.2rem" }}>{dn.icon}</span>
                <span className="font-inter text-xs font-bold" style={{ color: dn.color }}>{dn.label}</span>
              </div>
            ) : (
              <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>Not selected</p>
            )}
          </div>

          {/* Hour */}
          <div className="rounded-xl border p-3 flex flex-col gap-1"
            style={{ background: "rgba(0,0,0,0.3)", borderColor: hour ? `${G.borderHi}` : "rgba(255,255,255,0.08)" }}>
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Hour</p>
            {hour ? (
              <div className="flex items-center gap-1.5">
                <span className="font-inter text-sm" style={{ color: G.text }}>{hour.symbol}</span>
                <span className="font-inter text-xs font-bold" style={{ color: G.text }}>{hour.label} — {hour.planet}</span>
              </div>
            ) : (
              <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>Not selected</p>
            )}
          </div>
        </div>

        {/* Purposes */}
        {purposes.length > 0 && (
          <div className="rounded-xl border p-3" style={{ background: "rgba(0,0,0,0.3)", borderColor: `${purposes[0].color}33` }}>
            <p className="font-inter text-[8px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>Purposes</p>
            <div className="flex flex-wrap gap-1.5">
              {purposes.map(p => (
                <span key={p.key} className="font-inter text-[9px] px-2 py-0.5 rounded-full border font-bold"
                  style={{ color: p.color, borderColor: `${p.color}66`, background: `${p.color}10` }}>
                  {p.icon} {p.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Days */}
        {days.length > 0 && (
          <div className="rounded-xl border p-3" style={{ background: "rgba(0,0,0,0.3)", borderColor: `${days[0].color}33` }}>
            <p className="font-inter text-[8px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>Days</p>
            <div className="flex flex-wrap gap-1.5">
              {days.map(d => (
                <span key={d.key} className="font-inter text-[9px] px-2 py-0.5 rounded-full border font-bold"
                  style={{ color: d.color, borderColor: `${d.color}66`, background: `${d.color}10` }}>
                  {d.symbol} {d.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Compatibility */}
        <div className="rounded-xl border p-3 text-center" style={{ background: "rgba(0,0,0,0.3)", borderColor: `${col}33` }}>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: `${col}77` }}>Compatibility</p>
          <p className="font-inter text-sm font-bold" style={{ color: col }}>{compatLabel}</p>
        </div>
      </div>

      {/* Mystical interpretation */}
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