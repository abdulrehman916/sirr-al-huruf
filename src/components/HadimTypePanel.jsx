/**
 * HadimTypePanel
 * Displays one Hadim type result (Ulvi / Sufli / Sherli):
 *  - Original value + reduction formula
 *  - Positional step grid (Units → Thousands)
 *  - A) Separated ceremonial letters
 *  - B) Joined ceremonial form
 *  - Final Hadim Name (joined + ائيل)
 */
export default function HadimTypePanel({ typeData }) {
  const { typeLabel, subtract, reduced, boosted, adjusted, original, istintaq } = typeData;
  const { steps, separatedLetters, joinedCeremonial, hadimName } = istintaq;

  const THEMES = {
    ULVI: {
      label: "ULVI HADIM", arabic: "علوي",
      border: "rgba(212,175,55,0.50)", bg: "rgba(212,175,55,0.08)",
      glow: "0 0 28px rgba(212,175,55,0.28)",
      nameBg: "rgba(212,175,55,0.14)", nameBorder: "rgba(212,175,55,0.45)",
      nameGlow: "0 0 32px rgba(212,175,55,0.60)",
      accent: "rgba(212,175,55,0.90)", accentDim: "rgba(212,175,55,0.50)",
      stepBg: "rgba(212,175,55,0.12)", stepBorder: "rgba(212,175,55,0.35)",
      formulaBg: "rgba(212,175,55,0.06)", formulaBorder: "rgba(212,175,55,0.22)",
    },
    SUFLI: {
      label: "SUFLI HADIM", arabic: "سفلي",
      border: "rgba(220,38,38,0.50)", bg: "rgba(220,38,38,0.07)",
      glow: "0 0 28px rgba(220,38,38,0.22)",
      nameBg: "rgba(220,38,38,0.14)", nameBorder: "rgba(220,38,38,0.45)",
      nameGlow: "0 0 32px rgba(220,38,38,0.55)",
      accent: "rgba(252,165,165,0.90)", accentDim: "rgba(252,165,165,0.50)",
      stepBg: "rgba(220,38,38,0.12)", stepBorder: "rgba(220,38,38,0.35)",
      formulaBg: "rgba(220,38,38,0.06)", formulaBorder: "rgba(220,38,38,0.22)",
    },
    SHERLI: {
      label: "SHERLI HADIM", arabic: "شرلي",
      border: "rgba(168,85,247,0.50)", bg: "rgba(168,85,247,0.07)",
      glow: "0 0 28px rgba(168,85,247,0.22)",
      nameBg: "rgba(168,85,247,0.16)", nameBorder: "rgba(168,85,247,0.50)",
      nameGlow: "0 0 32px rgba(168,85,247,0.70)",
      accent: "rgba(216,180,254,0.90)", accentDim: "rgba(216,180,254,0.50)",
      stepBg: "rgba(168,85,247,0.12)", stepBorder: "rgba(168,85,247,0.35)",
      formulaBg: "rgba(168,85,247,0.06)", formulaBorder: "rgba(168,85,247,0.22)",
    },
  };

  const t = THEMES[typeLabel];
  const origVal = original ?? (boosted ? adjusted - 361 : adjusted);

  return (
    <div className="rounded-2xl border p-4 space-y-3"
      style={{ background: t.bg, borderColor: t.border, boxShadow: t.glow }}>

      {/* ── Header: type label + reduced value ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 rounded-full" style={{ background: t.border }} />
          <span className="font-inter text-[10px] uppercase tracking-widest font-bold" style={{ color: t.accent }}>{t.label}</span>
          <span className="font-amiri text-sm" style={{ color: t.accentDim }}>{t.arabic}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: t.accentDim }}>Reduced</span>
          <span className="font-inter text-sm font-bold text-white tabular-nums">{reduced}</span>
        </div>
      </div>

      {/* ── Reduction formula ── */}
      <div className="rounded-xl px-3 py-2 font-inter text-[11px] text-white/55 leading-relaxed"
        style={{ background: t.formulaBg, border: `1px solid ${t.formulaBorder}` }}>
        {boosted
          ? <><span style={{ color: t.accentDim }}>{origVal}</span> &lt; {subtract} → {origVal} + 361 = <span style={{ color: t.accent }}>{adjusted}</span> − {subtract} = <span className="font-bold text-white">{reduced}</span></>
          : <><span style={{ color: t.accentDim }}>{origVal}</span> ≥ {subtract} → {origVal} − {subtract} = <span className="font-bold text-white">{reduced}</span></>
        }
      </div>

      {/* ── Positional extraction grid ── */}
      {steps.length > 0 ? (
        <div>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-1.5" style={{ color: t.accentDim }}>
            Positional Breakdown
          </p>
          <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
            {steps.map((step, pi) => (
              <div key={pi}
                className="flex flex-col items-center rounded-xl border px-2.5 py-1.5 min-w-[46px]"
                style={{
                  background: step.letters ? t.stepBg : "rgba(255,255,255,0.03)",
                  borderColor: step.letters ? t.stepBorder : "rgba(255,255,255,0.08)",
                }}>
                <span className="font-amiri text-xl text-white leading-none mb-0.5">
                  {step.letters || '—'}
                </span>
                <span className="font-inter text-[10px] tabular-nums" style={{ color: t.accentDim }}>
                  {step.value}
                </span>
                <span className="font-inter text-[7px] uppercase tracking-wide text-white/25 mt-0.5">
                  {step.label.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl px-3 py-2 font-inter text-[11px] text-white/30 text-center"
          style={{ background: t.formulaBg, border: `1px solid ${t.formulaBorder}` }}>
          Reduced value is 0 — no positional letters
        </div>
      )}

      {/* ── Ceremonial forms + Hadim name ── */}
      <div className="rounded-2xl border p-4 space-y-3"
        style={{ background: t.nameBg, borderColor: t.nameBorder, boxShadow: t.nameGlow }}>

        {/* A) Separated ceremonial letters */}
        <div>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: t.accentDim }}>
            A — Separated Ceremonial Letters
          </p>
          <p className="font-amiri text-2xl text-white text-center leading-loose" dir="rtl">
            {separatedLetters || '—'}
          </p>
        </div>

        <div className="h-px" style={{ background: t.border, opacity: 0.25 }} />

        {/* B) Joined ceremonial form */}
        <div>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: t.accentDim }}>
            B — Joined Ceremonial Form
          </p>
          <p className="font-amiri text-2xl text-white text-center leading-loose" dir="rtl">
            {joinedCeremonial || '—'}
          </p>
        </div>

        <div className="h-px" style={{ background: t.border, opacity: 0.25 }} />

        {/* Final Hadim Name */}
        <div className="text-center">
          <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: t.accentDim }}>
            Final Hadim Name
          </p>
          <p className="font-inter text-[10px] mb-2 text-white/40" dir="rtl">
            {joinedCeremonial} + ائيل
          </p>
          <p className="font-amiri text-4xl font-bold text-white" dir="rtl"
            style={{ textShadow: t.nameGlow }}>
            {hadimName}
          </p>
        </div>
      </div>
    </div>
  );
}