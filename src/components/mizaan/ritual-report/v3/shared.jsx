// ═══════════════════════════════════════════════════════════════
// V3 DECISION UI — shared box wrapper + re-exports
// Pure display layer. No calculation logic — all data comes from
// the existing ritualTimingEngineV3 analysis object.
// ═══════════════════════════════════════════════════════════════
import { G, T, translatePlanet, translateDay, saatDisplayNum, DAY_KEY_BY_INDEX, MIZAN_DAY_NAMES } from "../shared";
import { computeCompat, compatColor } from "../v2/compatibility";

export { G, T, translatePlanet, translateDay, saatDisplayNum, DAY_KEY_BY_INDEX, MIZAN_DAY_NAMES, computeCompat, compatColor };

export function Box({ number, titleEn, titleMl, icon: Icon, lang, children }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: `1px solid ${G.border}`,
        boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)",
      }}>
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        {Icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
            <Icon className="w-5 h-5" style={{ color: G.text }} />
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>{number}</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T(titleEn, titleMl, lang)}
          </h3>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// 7 classical planets for Box 9 expandable list
export const PLANET_LIST = [
  { key: "sun", en: "Sun", ml: "സൂര്യൻ", symbol: "☀" },
  { key: "moon", en: "Moon", ml: "ചന്ദ്രൻ", symbol: "☾" },
  { key: "mercury", en: "Mercury", ml: "ബുധൻ", symbol: "☿" },
  { key: "venus", en: "Venus", ml: "ശുക്രൻ", symbol: "♀" },
  { key: "mars", en: "Mars", ml: "ചൊവ്വ", symbol: "♂" },
  { key: "jupiter", en: "Jupiter", ml: "ഗുരു", symbol: "♃" },
  { key: "saturn", en: "Saturn", ml: "ശനി", symbol: "♄" },
];