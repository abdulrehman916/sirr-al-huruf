// ═══════════════════════════════════════════════════════════════
// REUSABLE — "Source / Calculation Details" expandable debug panel
// ─────────────────────────────────────────────────────────────
// Pure display component. Does NOT calculate anything — every value
// shown here is passed in by the caller, exactly as already computed
// by the existing (unchanged) pipeline logic. Safe to attach below
// any calculation card in Method 1 / 2 / 3, Section 1 / 2.
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { ChevronDown, ChevronRight, Info } from "lucide-react";

const G = {
  goldDim:  "rgba(245,208,96,0.55)",
  bgInner:  "rgba(212,175,55,0.06)",
  dim:      "rgba(255,255,255,0.35)",
};

export default function SourceCalculationPanel({
  stageFlow,          // e.g. "Nine Mizan → Esma-i Kitabet"
  inheritedFrom,      // e.g. "Nine Mizan Grand Total (shared for Section 1 & 2)"
  formulaSteps = [],  // [{ label, value, isResult }]
  letterRows = [],    // [{ letter, bastValue }]
  finalLabel,
  finalValue,
  accentColor = "#F5D060",
}) {
  const [open, setOpen] = useState(false);

  let running = 0;
  const rows = letterRows.map((r) => {
    running += (r.bastValue || 0);
    return { ...r, running };
  });

  return (
    <div className="rounded-xl border mt-3" style={{ background: "rgba(6,14,36,0.98)", borderColor: accentColor + "40" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-2.5"
      >
        {open ? <ChevronDown className="w-3.5 h-3.5" style={{ color: accentColor }} /> : <ChevronRight className="w-3.5 h-3.5" style={{ color: accentColor }} />}
        <Info className="w-3 h-3" style={{ color: G.dim }} />
        <span className="font-inter text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: accentColor }}>
          Source / Calculation Details
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {stageFlow && (
            <div className="text-center font-inter text-[8px] uppercase tracking-widest px-2 py-1.5 rounded"
              style={{ background: G.bgInner, color: accentColor }}>
              {stageFlow}
            </div>
          )}

          {inheritedFrom && (
            <div className="font-inter text-[8px] italic px-1" style={{ color: G.dim }}>
              ↳ Inherited from: {inheritedFrom}
            </div>
          )}

          {rows.length > 0 && (
            <div>
              <div className="font-inter text-[7px] uppercase tracking-widest font-bold mb-1.5" style={{ color: G.dim }}>
                Letter-by-Letter Bast Values
              </div>
              <div className="flex justify-between px-1 mb-1 font-inter text-[6px] uppercase tracking-wider" style={{ color: G.dim }}>
                <span>Letter</span><span>Bast Value</span><span>Running Total</span>
              </div>
              <div className="space-y-0.5">
                {rows.map((r, i) => (
                  <div key={i} className="flex items-center justify-between px-1 font-inter text-[7px]">
                    <span className="font-amiri text-sm w-8 text-center" style={{ color: accentColor }}>{r.letter}</span>
                    <span className="tabular-nums" style={{ color: G.dim }}>{(r.bastValue || 0).toLocaleString()}</span>
                    <span className="tabular-nums font-bold" style={{ color: accentColor }}>{r.running.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formulaSteps.length > 0 && (
            <div>
              <div className="font-inter text-[7px] uppercase tracking-widest font-bold mb-1.5" style={{ color: G.dim }}>
                Formula
              </div>
              <div className="space-y-1">
                {formulaSteps.map((s, i) => (
                  <div key={i} className="flex items-center justify-between px-2 py-1 rounded"
                    style={{ background: s.isResult ? accentColor + "15" : "transparent" }}>
                    <span className="font-inter text-[7px]" style={{ color: s.isResult ? accentColor : G.dim }}>{s.label}</span>
                    <span className="font-inter text-[9px] font-bold tabular-nums" style={{ color: s.isResult ? accentColor : "rgba(255,255,255,0.7)" }}>
                      {(s.value ?? 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {finalLabel && (
            <div className="text-center pt-2 border-t" style={{ borderColor: accentColor + "30" }}>
              <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>{finalLabel}</span>
              <div className="font-inter text-base font-black tabular-nums" style={{ color: accentColor }}>
                {(finalValue ?? 0).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}