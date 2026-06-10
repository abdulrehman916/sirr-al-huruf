/**
 * ManuscriptEsmaSection
 * Displays Esma-i Kitabet, A'van, or Kasem following manuscript layout (pp.60–69)
 */
import { useMemo } from "react";
import IstintakSteps from "./IstintakSteps";
import { istintak, buildVefk, ELEMENT_BAST_TOTALS } from "../../lib/mizaanPostEngine";

const AR = {
  fontFamily: "'Noto Naskh Arabic','Amiri','Scheherazade New',serif",
};

const G = {
  text:    "#F5D060",
  border:  "rgba(212,175,55,0.35)",
  borderHi:"rgba(212,175,55,0.65)",
  bg:      "rgba(212,175,55,0.07)",
};

function ArabicText({ children, size = "1.6rem", color, dir: d = "rtl" }) {
  return (
    <span dir={d} lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: size, color: color || G.text }}>
      {children}
    </span>
  );
}

function VefkBlock({ satirTotal, element, color }) {
  const vefk = useMemo(() => buildVefk(satirTotal, element), [satirTotal, element]);
  const meta = {
    fire:  { color: "#FF6B35", glow: "rgba(255,107,53,0.25)", border: "rgba(255,107,53,0.45)" },
    earth: { color: "#A5C880", glow: "rgba(165,200,128,0.25)", border: "rgba(165,200,128,0.45)" },
    air:   { color: "#B2EBF2", glow: "rgba(178,235,242,0.25)", border: "rgba(178,235,242,0.45)" },
    water: { color: "#4FC3F7", glow: "rgba(79,195,247,0.25)", border: "rgba(79,195,247,0.45)" },
  }[element] || { color: "#FF6B35", glow: "rgba(255,107,53,0.25)", border: "rgba(255,107,53,0.45)" };

  const guardianLetters = useMemo(() =>
    istintak(ELEMENT_BAST_TOTALS[element] || 3550), [element]);
  const guardianName = guardianLetters.join('');

  return (
    <div className="rounded-2xl border p-4 space-y-3"
      style={{ borderColor: meta.border, background: "rgba(4,6,20,0.99)", boxShadow: `0 0 24px ${meta.glow}` }}>
      {/* 4×4 grid */}
      <div>
        <div className="grid grid-cols-4 gap-1 max-w-[200px] mx-auto">
          {vefk.grid.flat().map((val, i) => (
            <div key={i} className="aspect-square flex items-center justify-center rounded-lg border font-inter font-bold tabular-nums"
              style={{ background: meta.glow.replace('0.25','0.06'), borderColor: meta.border, color: meta.color, fontSize: "0.65rem" }}>
              {val}
            </div>
          ))}
        </div>
        <p className="font-inter text-[7px] text-center mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
          كل سطر وعمود وقطر = {vefk.mc.toLocaleString()}
        </p>
      </div>

      {/* Guardian name */}
      <div className="flex items-center justify-between rounded-xl border px-3 py-2"
        style={{ borderColor: meta.border, background: meta.glow.replace('0.25','0.08') }}>
        <ArabicText color={meta.color} size="1.4rem">{guardianName}</ArabicText>
      </div>
    </div>
  );
}

function NamesList({ names, prefix, color }) {
  return (
    <div className="space-y-1.5">
      {names.map((name, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl border"
          style={{ borderColor: color + "44", background: color + "0A" }}>
          <span className="font-inter text-[7px] tabular-nums w-5 h-5 rounded-full flex items-center justify-center border"
            style={{ color, borderColor: color + "55" }}>{i + 1}</span>
          <ArabicText color={color} size="1.5rem">
            {prefix ? `${prefix} ${name}` : name}
          </ArabicText>
        </div>
      ))}
    </div>
  );
}

function SeedExpansionDetail({ seedBastValues, color, expandedLetters }) {
  return (
    <div className="space-y-3">
      {/* Compact per-seed trace — manuscript style */}
      {seedBastValues.map((sv, i) => (
        <div key={i} className="rounded-xl border overflow-hidden"
          style={{ borderColor: color + "30", background: "rgba(4,8,22,0.98)" }}>
          {/* Seed letter + Bast value */}
          <div className="flex items-center justify-between px-3 py-2 border-b"
            style={{ borderColor: color + "20", background: color + "08" }}>
            <div className="flex items-center gap-2">
              <span className="font-inter text-[7px] tabular-nums w-4 h-4 rounded-full flex items-center justify-center border"
                style={{ color, borderColor: color + "50" }}>{i + 1}</span>
              <span style={{ fontFamily: AR.fontFamily, fontSize: "1.4rem", color, lineHeight: 1 }}>{sv.letter}</span>
            </div>
            <span className="font-inter text-[8px] font-bold tabular-nums" style={{ color: "#FFE580" }}>
              {sv.bastValue.toLocaleString()}
            </span>
          </div>
          {/* Istintak steps */}
          <div className="px-3 py-2">
            <IstintakSteps n={sv.bastValue} msMarker={false} compact={true} />
          </div>
        </div>
      ))}

      {/* Combined Satr-i Vahid */}
      <div className="rounded-2xl border p-4 space-y-2"
        style={{ borderColor: "rgba(212,175,55,0.60)", background: "rgba(212,175,55,0.06)", boxShadow: "0 0 18px rgba(212,175,55,0.10)" }}>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "5px", direction: "ltr",
          padding: "10px 12px", borderRadius: "12px", border: `1px solid rgba(212,175,55,0.30)`, background: "rgba(212,175,55,0.04)" }}>
          {[...expandedLetters].reverse().map((l, i) => (
            <span key={i} style={{ fontFamily: AR.fontFamily, fontSize: "1.4rem", color: G.text, lineHeight: 1.3 }}>
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

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

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ borderColor: color + "55", background: "rgba(3,6,18,0.99)" }}>

      {/* Section header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: color + "30", background: color + "0D" }}>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[11px] font-bold tabular-nums w-6 h-6 rounded-full flex items-center justify-center border"
            style={{ color, borderColor: color + "66", background: color + "18" }}>
            {number}
          </span>
          <ArabicText color={color} size="1.3rem">{meta.ar}</ArabicText>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <IstintakSteps n={data.satirTotal} msMarker={false} compact={false} />
        <SeedExpansionDetail
          seedBastValues={data.seedBastValues}
          expandedLetters={data.expandedLetters}
          color={color}
        />
        <NamesList
          names={data.names}
          prefix={prefix}
          color={color}
        />
        <VefkBlock
          satirTotal={satirTotal}
          element={element}
          color={color}
        />
      </div>
    </div>
  );
}