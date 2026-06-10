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
  number,
}) {
  const TIER_LABELS = {
    kitabet: { ar: 'أسماء الكتابة' },
    avan:    { ar: 'أسماء الأعوان' },
    kasem:   { ar: 'أسماء القسم' },
  };
  const meta = TIER_LABELS[tier];

  // Build Vefk grid
  const vefk = useMemo(() => buildVefk(satirTotal, element), [satirTotal, element]);
  const guardianName = useMemo(() => 
    istintak(ELEMENT_BAST_TOTALS[element] || 3550).join(''), 
    [element]
  );

  return (
    <div style={{ fontFamily: AR.fontFamily, direction: "rtl", textAlign: "right" }}>
      
      {/* Section title */}
      <h3 style={{ fontSize: "1.3rem", color, marginBottom: "12px", fontWeight: "bold" }}>
        {meta.ar}
      </h3>

      {/* Satr-i Vahid */}
      <div style={{ marginBottom: "20px", padding: "12px", borderLeft: `3px solid ${color}` }}>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.50)", marginBottom: "8px" }}>
          Satr-ı Vahid:
        </p>
        <div style={{ display: "flex", flexDirection: "row", gap: "4px", direction: "ltr", flexWrap: "wrap" }}>
          {[...data.expandedLetters].reverse().map((l, i) => (
            <span key={i} style={{ fontSize: "1.3rem", color, fontWeight: "500" }}>
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Names */}
      <div style={{ marginBottom: "20px" }}>
        {data.names.map((name, i) => (
          <div key={i} style={{ fontSize: "1.1rem", color, marginBottom: "6px" }}>
            <span style={{ fontWeight: "500" }}>{i + 1}.</span> {prefix && `${prefix} `}{name}
          </div>
        ))}
      </div>

      {/* Vefk */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.50)", marginBottom: "12px" }}>
          Vefk:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px", marginBottom: "8px", maxWidth: "180px" }}>
          {vefk.grid.flat().map((val, i) => (
            <div key={i} style={{
              padding: "6px", textAlign: "center", border: `1px solid ${color}50`,
              background: `${color}10`, fontSize: "0.75rem", fontWeight: "bold", color
            }}>
              {val}
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.30)" }}>
          Magic Constant: {vefk.mc} | Guardian: {guardianName}
        </p>
      </div>

    </div>
  );
}