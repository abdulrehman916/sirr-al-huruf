// ═══════════════════════════════════════════════════════════════
// INDIVIDUAL LETTER DERIVATION — 5th Bast Calculation
// ═══════════════════════════════════════════════════════════════

const G = {
  gold: "#F5D060", goldDim: "rgba(245,208,96,0.55)", goldFaint: "rgba(212,175,55,0.07)",
  goldBorder: "rgba(212,175,55,0.40)", goldBorderHi: "rgba(212,175,55,0.65)", glow: "rgba(212,175,55,0.18)",
  bg: "rgba(3,6,20,0.99)", bgCard: "rgba(8,16,40,0.98)", bgInner: "rgba(212,175,55,0.06)",
  green: "#4ADE80", greenDim: "rgba(74,222,128,0.15)", red: "#F87171", dim: "rgba(255,255,255,0.35)",
};

function LetterCell({ letter, color = G.gold, size = "lg" }) {
  const sizes = { sm: "text-xl px-2.5 py-1.5", lg: "text-3xl px-4 py-2.5", xl: "text-4xl px-5 py-3" };
  return (
    <span className={`font-amiri font-bold rounded-lg border ${sizes[size]}`} style={{ color, borderColor: color + "55", background: color + "12", lineHeight: 1.8, display: "inline-block" }}>{letter}</span>
  );
}

function Arrow({ label }) {
  return (
    <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
      <span className="font-inter text-base" style={{ color: G.goldDim }}>→</span>
      {label && <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>{label}</span>}
    </div>
  );
}

export default function IndividualLetterDerivation({ derivation, idx, totalLetters, elementColor, bastLevel }) {
  const d = derivation;
  
  return (
    <div className="rounded-xl border p-4" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
      {/* Header with Letter Number */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg font-inter text-xs font-black" style={{ background: elementColor + "22", border: `1px solid ${elementColor}55`, color: elementColor }}>
          {idx + 1}
        </div>
        <div className="flex-1">
          <div className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>
            Letter {idx + 1} of {totalLetters}
          </div>
          <div className="font-amiri text-lg font-bold" style={{ color: elementColor }} dir="rtl">{d.originalLetter}</div>
        </div>
        <div className="text-right">
          <div className="text-[6px]" style={{ color: G.dim }}>5th Bast Value</div>
          <div className="text-xl font-bold tabular-nums" style={{ color: G.green }}>{d.bastValue.toLocaleString()}</div>
        </div>
      </div>
      
      {/* Calculation Flow */}
      <div className="flex items-center justify-center gap-3 mb-4 p-3 rounded-lg" style={{ background: G.bgInner, borderColor: G.goldBorder + "40", border: "1px solid" }}>
        <div className="text-center">
          <div className="text-[6px] mb-1" style={{ color: G.dim }}>Original</div>
          <LetterCell letter={d.originalLetter} color={elementColor} size="lg" />
        </div>
        <Arrow label={`B${bastLevel}`} />
        <div className="text-center">
          <div className="text-[6px] mb-1" style={{ color: G.dim }}>Value</div>
          <div className="px-3 py-2 rounded-lg border" style={{ background: G.greenDim, borderColor: G.green + "40" }}>
            <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.green }}>{d.bastValue.toLocaleString()}</span>
          </div>
        </div>
        <Arrow label="Istintaq" />
        <div className="text-center">
          <div className="text-[6px] mb-1" style={{ color: G.dim }}>Expanded</div>
          <div className="flex items-center gap-1" style={{ direction: "rtl" }}>
            {Array.isArray(d.expandedLetters) && d.expandedLetters.map((l, i) => (
              <LetterCell key={i} letter={l} color={G.green} size="sm" />
            ))}
          </div>
        </div>
      </div>
      
      {/* Expanded Letters Detail */}
      <div className="rounded-lg border p-3" style={{ background: G.bgInner, borderColor: G.goldBorder + "40" }}>
        <div className="font-inter text-[7px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          Expanded Letters ({d.expandedLetters?.length || 0} total):
        </div>
        <div className="flex flex-wrap gap-2" style={{ direction: "rtl" }}>
          {Array.isArray(d.expandedLetters) && d.expandedLetters.map((l, i) => (
            <div key={i} className="flex flex-col items-center">
              <LetterCell letter={l} color={G.green} size="sm" />
              <span className="text-[6px]" style={{ color: G.dim }}>{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}