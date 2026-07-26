// ═══════════════════════════════════════════════════════════════
// SIRR PAGE — EMPTY PLACEHOLDER
// ═══════════════════════════════════════════════════════════════
// All customer-facing Sirr UI has been migrated into Holy Names →
// Section D (see SirrManuscriptLibrary). This route is retained as
// an empty placeholder with no customer-facing content. All data
// (SirrManuscriptBook / SirrManuscriptEntry) is unchanged and is
// now surfaced from Section D.
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import KasrRulesEngine from "@/components/sirr/KasrRulesEngine";

// ── Standard Arabic Abjad (Jumal) values — first calculation stage ──
const ABJAD = {
  "ا": 1, "أ": 1, "إ": 1, "آ": 1, "ء": 1, "ى": 10,
  "ب": 2, "ج": 3, "د": 4, "ه": 5, "ة": 5, "و": 6, "ز": 7, "ح": 8, "ط": 9, "ي": 10,
  "ك": 20, "ک": 20, "ل": 30, "م": 40, "ن": 50, "س": 60, "ع": 70, "ف": 80, "ص": 90,
  "ق": 100, "ر": 200, "ش": 300, "ت": 400, "ث": 500, "خ": 600, "ذ": 700, "ض": 800, "ظ": 900, "غ": 1000,
};

function calculateAbjad(text) {
  if (!text) return { letters: [], total: 0 };
  // strip harakat, tatweel, and whitespace
  const cleaned = text.replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/\s+/g, "");
  const letters = [];
  let total = 0;
  for (const ch of cleaned) {
    const v = ABJAD[ch];
    if (v !== undefined) {
      letters.push({ letter: ch, value: v });
      total += v;
    }
  }
  return { letters, total };
}

function AbjadSection({ title, data }) {
  return (
    <div className="card-dark p-5">
      <h3 className="font-inter text-xs uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(212,175,55,0.70)" }}>
        {title}
      </h3>
      {data && data.letters.length > 0 ? (
        <div>
          <table className="w-full text-center border-collapse">
            <thead>
              <tr style={{ color: "rgba(212,175,55,0.60)", borderBottom: "1px solid rgba(212,175,55,0.25)" }}>
                <th className="py-1.5 font-inter text-[10px] uppercase tracking-wider">Letter</th>
                <th className="py-1.5 font-inter text-[10px] uppercase tracking-wider">Abjad Value</th>
              </tr>
            </thead>
            <tbody>
              {data.letters.map((l, i) => (
                <tr key={i} style={{ color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td className="py-1.5 font-amiri text-2xl">{l.letter}</td>
                  <td className="py-1.5 font-inter text-base">{l.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 pt-3 border-t text-center" style={{ borderColor: "rgba(212,175,55,0.20)" }}>
            <span className="font-inter text-sm" style={{ color: "rgba(212,175,55,0.70)" }}>Total = </span>
            <span className="font-amiri text-2xl" style={{ color: "#D4AF37" }}>{data.total}</span>
          </div>
        </div>
      ) : (
        <div className="min-h-[6rem]" />
      )}
    </div>
  );
}

export default function SirrPage() {
  const [talib, setTalib] = useState("");
  const [matlub, setMatlub] = useState("");
  const [talab, setTalab] = useState("");
  const [results, setResults] = useState(null);
  const [relationship, setRelationship] = useState("");

  const handleCalculate = () => {
    setResults({
      talib: calculateAbjad(talib),
      matlub: calculateAbjad(matlub),
      talab: calculateAbjad(talab),
    });
  };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <h1 className="font-amiri text-3xl text-center" style={{ color: "#D4AF37" }}>السرّ</h1>

        {/* ── Input Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "طالب", value: talib, setter: setTalib },
            { title: "مطلوب", value: matlub, setter: setMatlub },
            { title: "طلب", value: talab, setter: setTalab },
          ].map((c) => (
            <div key={c.title} className="card-dark p-4">
              <h2 className="font-amiri text-2xl text-center mb-3" style={{ color: "#D4AF37" }}>{c.title}</h2>
              <input
                type="text"
                value={c.value}
                onChange={(e) => c.setter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-center font-amiri text-lg outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(212,175,55,0.30)",
                  color: "#fff",
                }}
              />
            </div>
          ))}
        </div>

        {/* ── Calculate Button ── */}
        <div className="flex justify-center">
          <button
            onClick={handleCalculate}
            className="btn-gold px-12 py-3.5 rounded-xl font-inter font-bold text-base"
          >
            Calculate
          </button>
        </div>

        {/* ── Abjad Sections ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AbjadSection title="طالب Abjad" data={results?.talib} />
          <AbjadSection title="مطلوب Abjad" data={results?.matlub} />
          <AbjadSection title="طلب Abjad" data={results?.talab} />
        </div>

        {/* ── Relationship Selection ── */}
        <div className="card-dark p-5">
          <h3 className="font-inter text-xs uppercase tracking-[0.2em] mb-4 text-center" style={{ color: "rgba(212,175,55,0.70)" }}>
            Relationship Selection
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "talib_matlub", label: "طالب + مطلوب" },
              { key: "talib_talab", label: "طالب + طلب" },
              { key: "matlub_talab", label: "مطلوب + طلب" },
            ].map((opt) => {
              const active = relationship === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setRelationship(opt.key)}
                  className="py-3 rounded-lg font-amiri text-xl text-center transition-colors"
                  style={{
                    background: active ? "rgba(212,175,55,0.14)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${active ? "rgba(212,175,55,0.65)" : "rgba(212,175,55,0.25)"}`,
                    color: active ? "#D4AF37" : "rgba(255,255,255,0.70)",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Remaining Placeholder Sections ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "كر",
            "دفر",
            "كر Jafr Table",
            "دفر Jafr Table",
            "First Jafr Total",
            "Second Jafr Total",
            "Ghutm",
            "Final Result",
          ].map((label) => {
            const sourceMap = { talib, matlub, talab };
            const resultMap = { talib: results?.talib, matlub: results?.matlub, talab: results?.talab };
            let assign = null;
            if (relationship === "talib_matlub") assign = { "كر": "talib", "دفر": "matlub" };
            else if (relationship === "talib_talab") assign = { "كر": "talib", "دفر": "talab" };
            else if (relationship === "matlub_talab") assign = { "كر": "talab", "دفر": "matlub" };
            const key = assign?.[label];
            const word = key ? sourceMap[key] : "";
            const total = key ? resultMap[key]?.total : null;
            return (
              <div key={label} className="card-dark p-5">
                <h3 className="font-inter text-xs uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(212,175,55,0.70)" }}>
                  {label}
                </h3>
                {key && total != null ? (
                  <div className="space-y-2 text-center">
                    <div className="font-inter text-sm" style={{ color: "rgba(212,175,55,0.70)" }}>
                      Word: <span className="font-amiri text-xl" style={{ color: "#fff" }}>{word}</span>
                    </div>
                    <div className="font-inter text-sm" style={{ color: "rgba(212,175,55,0.70)" }}>
                      Abjad Total: <span className="font-amiri text-2xl" style={{ color: "#D4AF37" }}>{total}</span>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-[6rem]" />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Kasr Rules Engine (independent module) ── */}
        <KasrRulesEngine />
      </div>
    </PageLayout>
  );
}