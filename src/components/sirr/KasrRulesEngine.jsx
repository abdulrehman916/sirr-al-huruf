// ═══════════════════════════════════════════════════════════════
// Kasr Rules Engine — UI component (independent SIRR module)
// ═══════════════════════════════════════════════════════════════
// Displays: الصحيح، الكسر، الجفر الأول، الجفر الثاني.
// Calculation is delegated entirely to src/lib/sirrKasrEngine.js.
// This component holds no calculation logic of its own.
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import { calculateKasr } from "@/lib/sirrKasrEngine";

export default function KasrRulesEngine() {
  const [quotient, setQuotient] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!quotient.trim()) {
      setResult(null);
      return;
    }
    setResult(calculateKasr(quotient.trim()));
  };

  const ruleLabel = (r) =>
    r === "rule1"
      ? "Rule 1 — single repeated digit"
      : r === "rule2"
      ? "Rule 2 — repeated digit + remainder"
      : r === "rule3"
      ? "Rule 3 — repeating group"
      : r === "no_fraction"
      ? "No fractional part"
      : "Unrecognized pattern";

  return (
    <div className="card-dark p-5 space-y-4">
      <h3
        className="font-inter text-xs uppercase tracking-[0.2em] text-center"
        style={{ color: "rgba(212,175,55,0.70)" }}
      >
        Kasr Rules Engine · محرك قواعد الكسر
      </h3>

      {/* ── Input ── */}
      <div>
        <label
          className="font-inter text-[11px] block mb-1.5"
          style={{ color: "rgba(212,175,55,0.70)" }}
        >
          Decimal Result from Division · نتيجة القسمة
        </label>
        <input
          type="text"
          dir="ltr"
          value={quotient}
          onChange={(e) => setQuotient(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
          placeholder="e.g. 73.333333333333"
          className="w-full px-3 py-2.5 rounded-lg text-center font-mono text-base outline-none"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(212,175,55,0.30)",
            color: "#fff",
          }}
        />
        <p
          className="font-inter text-[9px] mt-1.5 text-center"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Paste the full decimal as text so every digit is preserved.
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleCalculate}
          className="btn-gold px-10 py-3 rounded-xl font-inter font-bold text-sm"
        >
          Calculate Kasr
        </button>
      </div>

      {/* ── Output ── */}
      {result && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <OutputCard label="الصحيح" value={result.integer} />
            <OutputCard
              label="الكسر"
              value={result.kasrValue == null ? "—" : String(result.kasrValue)}
              sub={`${ruleLabel(result.rule)} · ${result.detail}`}
            />
            <OutputCard
              label="الجفر الأول"
              value={
                result.firstJafr == null ? "Pending Jafr Engine" : String(result.firstJafr)
              }
              pending={result.firstJafr == null}
            />
            <OutputCard
              label="الجفر الثاني"
              value={
                result.secondJafr == null ? "Pending Jafr Engine" : String(result.secondJafr)
              }
              pending={result.secondJafr == null}
            />
          </div>

          {result.jafrStatus === "pending_engine_missing" && (
            <p
              className="font-inter text-[10px] text-center leading-snug"
              style={{ color: "rgba(239,68,68,0.70)" }}
            >
              {result.jafrReason}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function OutputCard({ label, value, sub, pending }) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${
          pending ? "rgba(239,68,68,0.30)" : "rgba(212,175,55,0.25)"
        }`,
      }}
    >
      <div
        className="font-inter text-[10px] uppercase tracking-wider mb-1.5"
        style={{ color: "rgba(212,175,55,0.70)" }}
      >
        {label}
      </div>
      <div
        className="font-amiri text-2xl text-center"
        style={{ color: pending ? "rgba(239,68,68,0.80)" : "#D4AF37" }}
      >
        {value}
      </div>
      {sub && (
        <div
          className="font-inter text-[10px] text-center mt-1 leading-snug"
          style={{ color: "rgba(255,255,255,0.40)" }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}