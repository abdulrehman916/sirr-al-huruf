/**
 * ManuscriptEsmaSection — Strict manuscript layout
 * ONLY shows: Istintak → Satr-i Vahid → Names → Vefk
 * NO extra panels, NO seed displays, NO expanded displays.
 */
import { useMemo } from "react";
import { buildVefk, ELEMENT_BAST_TOTALS, istintak } from "../../lib/mizaanPostEngine";

const AR = {
  fontFamily: "'Noto Naskh Arabic','Amiri','Scheherazade New',serif",
};

export default function ManuscriptEsmaSection({
  tier,
  data,
  element,
  satirTotal,
  color,
  prefix,
}) {
  const TIER_LABELS = {
    kitabet: { ar: 'أسماء الكتابة' },
    avan:    { ar: 'أسماء الأعوان' },
    kasem:   { ar: 'أسماء القسم' },
  };
  const meta = TIER_LABELS[tier];

  const vefk = useMemo(() => buildVefk(satirTotal, element), [satirTotal, element]);
  const guardianName = useMemo(() => 
    istintak(ELEMENT_BAST_TOTALS[element] || 3550).join(''), 
    [element]
  );

  return (
    <div style={{ fontFamily: AR.fontFamily, direction: "rtl", textAlign: "right", marginBottom: "24px" }}>
      
      {/* Section title */}
      <h3 style={{ fontSize: "1.4rem", color, marginBottom: "16px", fontWeight: "bold", borderBottom: `2px solid ${color}40`, paddingBottom: "8px" }}>
        {meta.ar}
      </h3>

      {/* Final Names only */}
      <div style={{ marginBottom: "16px" }}>
        {data.names.map((name, i) => (
          <div key={i} style={{ fontSize: "1.5rem", color, marginBottom: "8px", fontWeight: "500" }}>
            {prefix && <span style={{ opacity: 0.7 }}>{prefix} </span>}{name}
          </div>
        ))}
      </div>

      {/* Vefk */}
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "3px", maxWidth: "200px", margin: "0 auto" }}>
          {vefk.grid.flat().map((val, i) => (
            <div key={i} style={{
              padding: "8px", textAlign: "center", border: `1px solid ${color}50`,
              background: `${color}10`, fontSize: "0.85rem", fontWeight: "bold", color
            }}>
              {val}
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.30)", textAlign: "center", marginTop: "8px" }}>
          {guardianName}
        </p>
      </div>

    </div>
  );
}