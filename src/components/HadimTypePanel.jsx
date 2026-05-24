/**
 * HadimTypePanel
 * Renders a single Hadim type (Ulvi / Sufli / Sherli) with:
 *  - reduced number + step formula
 *  - positional extraction grid
 *  - ceremonial form + final name
 */
export default function HadimTypePanel({ typeData }) {
  const { typeLabel, subtract, reduced, boosted, adjusted, istintaq, name } = typeData;

  const THEMES = {
    ULVI:  {
      label:       "ULVI HADIM",
      arabic:      "علوي",
      border:      "rgba(212,175,55,0.50)",
      bg:          "rgba(212,175,55,0.08)",
      glow:        "0 0 28px rgba(212,175,55,0.28)",
      nameBg:      "rgba(212,175,55,0.14)",
      nameBorder:  "rgba(212,175,55,0.45)",
      nameGlow:    "0 0 32px rgba(212,175,55,0.60)",
      accent:      "rgba(212,175,55,0.80)",
      accentDim:   "rgba(212,175,55,0.45)",
      stepBg:      "rgba(212,175,55,0.12)",
      stepBorder:  "rgba(212,175,55,0.35)",
      formulaBg:   "rgba(212,175,55,0.06)",
      formulaBorder:"rgba(212,175,55,0.20)",
    },
    SUFLI: {
      label:       "SUFLI HADIM",
      arabic:      "سفلي",
      border:      "rgba(220,38,38,0.50)",
      bg:          "rgba(220,38,38,0.07)",
      glow:        "0 0 28px rgba(220,38,38,0.22)",
      nameBg:      "rgba(220,38,38,0.14)",
      nameBorder:  "rgba(220,38,38,0.45)",
      nameGlow:    "0 0 32px rgba(220,38,38,0.55)",
      accent:      "rgba(252,165,165,0.85)",
      accentDim:   "rgba(252,165,165,0.45)",
      stepBg:      "rgba(220,38,38,0.12)",
      stepBorder:  "rgba(220,38,38,0.35)",
      formulaBg:   "rgba(220,38,38,0.06)",
      formulaBorder:"rgba(220,38,38,0.20)",
    },
    SHERLI:{
      label:       "SHERLI HADIM",
      arabic:      "شرلي",
      border:      "rgba(168,85,247,0.50)",
      bg:          "rgba(168,85,247,0.07)",
      glow:        "0 0 28px rgba(168,85,247,0.22)",
      nameBg:      "rgba(168,85,247,0.16)",
      nameBorder:  "rgba(168,85,247,0.50)",
      nameGlow:    "0 0 32px rgba(168,85,247,0.70)",
      accent:      "rgba(216,180,254,0.85)",
      accentDim:   "rgba(216,180,254,0.45)",
      stepBg:      "rgba(168,85,247,0.12)",
      stepBorder:  "rgba(168,85,247,0.35)",
      formulaBg:   "rgba(168,85,247,0.06)",
      formulaBorder:"rgba(168,85,247,0.20)",
    },
  };

  const t = THEMES[typeLabel];

  return (
    <div className="rounded-2xl border p-4 space-y-3"
      style={{ background: t.bg, borderColor: t.border, boxShadow: t.glow }}>

      {/* Type header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 rounded-full" style={{ background: t.border }} />
          <span className="font-inter text-[10px] uppercase tracking-widest font-bold" style={{ color: t.accent }}>{t.label}</span>
          <span className="font-amiri text-sm" style={{ color: t.accentDim }}>{t.arabic}</span>
        </div>
        <span className="font-inter text-sm font-bold text-white tabular-nums">{reduced}</span>
      </div>

      {/* Formula */}
      <div className="rounded-xl px-3 py-2 font-inter text-[11px] text-white/50"
        style={{ background: t.formulaBg, border: `1px solid ${t.formulaBorder}` }}>
        {boosted
          ? `${adjusted - 361} < ${subtract} → ${adjusted - 361} + 361 = ${adjusted} − ${subtract} = ${reduced}`
          : `${adjusted} ≥ ${subtract} → ${adjusted} − ${subtract} = ${reduced}`}
      </div>

      {/* Positional grid */}
      <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
        {istintaq.steps.map((step, pi) => (
          <div key={pi} className="flex flex-col items-center rounded-xl border px-2.5 py-1.5 min-w-[42px]"
            style={{
              background: step.letters ? t.stepBg : "rgba(255,255,255,0.03)",
              borderColor: step.letters ? t.stepBorder : "rgba(255,255,255,0.08)"
            }}>
            <span className="font-amiri text-xl text-white leading-none mb-0.5">{step.letters || '—'}</span>
            <span className="font-inter text-[9px] tabular-nums" style={{ color: t.accentDim }}>{step.value}</span>
            <span className="font-inter text-[7px] uppercase tracking-wide text-white/25 mt-0.5">{step.label.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      {/* Ceremonial form + Name */}
      <div className="rounded-2xl border p-3 text-center"
        style={{ background: t.nameBg, borderColor: t.nameBorder, boxShadow: t.nameGlow }}>
        <p className="font-inter text-[8px] uppercase tracking-widest mb-0.5" style={{ color: t.accentDim }}>Ceremonial Form</p>
        <p className="font-inter text-[10px] mb-2" style={{ color: t.accentDim }} dir="rtl">
          {istintaq.reversedSeparated} + ائيل
        </p>
        <div className="h-px mb-2" style={{ background: t.border, opacity: 0.3 }} />
        <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: t.accentDim }}>Hadim Name</p>
        <p className="font-amiri text-4xl font-bold text-white"
          style={{ textShadow: t.nameGlow }}>{name}</p>
      </div>
    </div>
  );
}