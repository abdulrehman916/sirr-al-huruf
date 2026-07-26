// ═══════════════════════════════════════════════════════════════
// Kasr Fixed Engine (1420 → 20) — UI
// ═══════════════════════════════════════════════════════════════
// Independent display of the source-book calculation flow.
// Renders the exact sequence: Kar Correct → Dafr Correct → Fixed
// Correct Number → Kasr Part A → Kasr Part B → Final Fixed Kasr.
// ═══════════════════════════════════════════════════════════════
import { useMemo } from "react";
import { calculateKasrFixed, KASR_FIXED_SOURCE_INPUTS } from "@/lib/sirrKasrFixedEngine";

const GOLD = "#D4AF37";
const GOLD_DIM = "rgba(212,175,55,0.70)";

function FlowBox({ label, value, isFinal }) {
  return (
    <div
      className="card-dark w-full p-4 text-center"
      style={{
        borderColor: isFinal ? "rgba(212,175,55,0.65)" : "rgba(212,175,55,0.30)",
        boxShadow: isFinal ? "0 0 28px rgba(212,175,55,0.22)" : undefined,
      }}
    >
      <div className="font-inter text-xs uppercase tracking-[0.2em] mb-2" style={{ color: GOLD_DIM }}>
        {label}
      </div>
      <div className="font-amiri text-4xl" style={{ color: GOLD }}>{value}</div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center py-1" style={{ color: GOLD_DIM }}>
      <span className="font-inter text-xl">↓</span>
    </div>
  );
}

function SideDetail({ title, side1, side2, sum }) {
  return (
    <div className="card-dark p-4">
      <h4 className="font-inter text-xs uppercase tracking-[0.18em] mb-3 text-center" style={{ color: GOLD_DIM }}>
        {title}
      </h4>
      <div className="space-y-1.5 text-center">
        <div className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>
          {side1.raw} → <span className="font-amiri text-xl" style={{ color: GOLD }}>{side1.jafr}</span>
        </div>
        <div className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>
          {side2.raw} → <span className="font-amiri text-xl" style={{ color: GOLD }}>{side2.jafr}</span>
        </div>
        <div className="pt-2 border-t" style={{ borderColor: "rgba(212,175,55,0.20)" }}>
          <span className="font-inter text-sm" style={{ color: GOLD_DIM }}>Sum = </span>
          <span className="font-amiri text-2xl" style={{ color: GOLD }}>{sum}</span>
        </div>
      </div>
    </div>
  );
}

export default function KasrFixedEngine() {
  const result = useMemo(() => calculateKasrFixed(KASR_FIXED_SOURCE_INPUTS), []);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-inter text-lg font-bold tracking-wide" style={{ color: GOLD }}>
          Kasr Fixed Engine
        </h2>
        <p className="font-inter text-xs mt-1" style={{ color: GOLD_DIM }}>1420 → 20</p>
      </div>

      <FlowBox label="Kar Correct Sum" value={result.inputs.karCorrectSum} />
      <Arrow />
      <FlowBox label="Dafr Correct Sum" value={result.inputs.dafrCorrectSum} />
      <Arrow />
      <FlowBox label="Fixed Correct Number" value={result.fixedCorrectNumber} />
      <Arrow />
      <FlowBox label="Kasr Part A" value={result.kasrPartA} />
      <Arrow />
      <FlowBox label="Kasr Part B" value={result.kasrPartB} />
      <Arrow />
      <FlowBox label="Final Fixed Kasr" value={result.fixedKasr} isFinal />

      {/* ── Source-book sub-step detail (Part A / Part B reductions) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <SideDetail
          title="Kasr Part A — Kar First + Dafr Second"
          side1={result.steps.partA.side1}
          side2={result.steps.partA.side2}
          sum={result.kasrPartA}
        />
        <SideDetail
          title="Kasr Part B — Kar Second + Dafr First"
          side1={result.steps.partB.side1}
          side2={result.steps.partB.side2}
          sum={result.kasrPartB}
        />
      </div>
    </div>
  );
}