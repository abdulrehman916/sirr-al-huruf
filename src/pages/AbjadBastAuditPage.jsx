import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "../components/PageLayout";
import PageTitle from "../components/PageTitle";
import { FIRST_BAST, BAST_TABLE, istintak, getBastLevel, satirVahidSum, ELEMENT_BAST_TOTALS, GALIB_ANASIR_VALUES } from "../lib/mizaanPostEngine";

// Design tokens
const G = {
  gold: "#F5D060",
  goldDim: "rgba(245,208,96,0.55)",
  goldFaint: "rgba(245,208,96,0.12)",
  goldBorder: "rgba(212,175,55,0.40)",
  goldBorderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.18)",
  bg: "rgba(3,6,20,0.99)",
  bgCard: "rgba(8,16,40,0.98)",
  bgInner: "rgba(212,175,55,0.06)",
  green: "#4ADE80",
  greenDim: "rgba(74,222,128,0.15)",
  blue: "#93C5FD",
  blueDim: "rgba(147,197,253,0.15)",
  dim: "rgba(255,255,255,0.35)",
  red: "#F87171",
};

function SectionHeader({ label, arabic, step, color = G.gold }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg font-inter text-xs font-black flex-shrink-0"
        style={{ background: color + "22", border: `1px solid ${color}55`, color }}>
        {step}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-inter text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color }}>{label}</span>
          {arabic && <span className="font-amiri text-sm" style={{ color: G.goldDim }}>{arabic}</span>}
        </div>
      </div>
      <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(to right, ${color}40, transparent)` }} />
    </div>
  );
}

function Card({ children, accent }) {
  return (
    <div className="rounded-xl border p-4"
      style={{
        background: G.bgCard,
        borderColor: accent ? accent + "55" : G.goldBorder,
        borderLeft: accent ? `3px solid ${accent}` : undefined,
        boxShadow: `0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.05)`,
      }}>
      {children}
    </div>
  );
}

function LetterCell({ letter, color = G.gold, size = "md" }) {
  const sizeClasses = {
    sm: "w-7 h-7 text-base",
    md: "w-9 h-9 text-xl",
    lg: "w-11 h-11 text-2xl",
    xl: "w-14 h-14 text-3xl",
  };
  return (
    <div className={`${sizeClasses[size]} rounded-lg border flex items-center justify-center font-amiri font-bold flex-shrink-0`}
      style={{ background: G.bgInner, borderColor: color + "55", color }}>
      <span dir="rtl">{letter}</span>
    </div>
  );
}

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${G.goldBorder})` }} />
      <span style={{ color: G.goldDim, fontSize: 10 }}>✦</span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${G.goldBorder})` }} />
    </div>
  );
}

// Verification test cases
const VERIFICATION_TESTS = [
  { number: 16, expected: ['ا'], description: "Alif" },
  { number: 616, expected: ['ب','ي'], description: "Ba-Ya" },
  { number: 1041, expected: ['ج','ل'], description: "Jim-Lam" },
  { number: 3550, expected: ['ن','ث','غ','ج'], description: "Fire element" },
  { number: 4015, expected: ['ه','ي','غ','د'], description: "Earth element" },
  { number: 3757, expected: ['ن','ذ','غ','ج'], description: "Air element" },
  { number: 3342, expected: ['ب','م','غ','ج'], description: "Water element" },
];

export default function AbjadBastAuditPage() {
  const [activeTab, setActiveTab] = useState("table");

  const letters = useMemo(() => {
    return Object.keys(BAST_TABLE).filter(l => !['أ','إ','آ','ء','ة','ي'].includes(l)).sort();
  }, []);

  const verificationResults = useMemo(() => {
    return VERIFICATION_TESTS.map(test => {
      const result = istintak(test.number);
      const passed = JSON.stringify(result) === JSON.stringify(test.expected);
      return { ...test, result, passed };
    });
  }, []);

  const allPassed = verificationResults.every(r => r.passed);

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-6">
        
        <PageTitle
          arabic="تدقيق الأبجد والبسط"
          latin="ABJAD & BAST AUDIT"
          subtitle="Engine Validation Against Manuscript Values"
          icon="✦"
        />

        {/* Tab Navigation */}
        <div className="flex gap-2 justify-center flex-wrap">
          {[
            { id: "table", label: "Abjad/Bast Table", arabic: "جدول" },
            { id: "istintak", label: "Istintak Verification", arabic: "استنتاك" },
            { id: "elements", label: "Elemental Totals", arabic: "عناصر" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-lg border font-inter text-[8px] uppercase tracking-wider font-semibold flex items-center gap-2"
              style={{
                background: activeTab === tab.id ? G.goldFaint : "transparent",
                borderColor: activeTab === tab.id ? G.goldBorder + "80" : G.goldBorder + "40",
                color: activeTab === tab.id ? G.gold : G.dim,
              }}
            >
              <span>{tab.label}</span>
              <span className="font-amiri text-sm" style={{ color: G.goldDim }}>{tab.arabic}</span>
            </button>
          ))}
        </div>

        {/* ══ TABLE TAB ══ */}
        {activeTab === "table" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card accent={G.gold}>
              <SectionHeader step="1" label="Abjad & Bast Values" arabic="قيم الأبجد والبسط" color={G.gold} />
              
              <div className="overflow-x-auto">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${G.goldBorder}` }}>
                      <th className="font-inter text-[7px] uppercase tracking-widest text-left py-2 px-2" style={{ color: G.dim }}>Letter</th>
                      <th className="font-inter text-[7px] uppercase tracking-widest text-right py-2 px-2" style={{ color: G.dim }}>Abjad (First Bast)</th>
                      <th className="font-inter text-[7px] uppercase tracking-widest text-right py-2 px-2" style={{ color: G.dim }}>Bast 2</th>
                      <th className="font-inter text-[7px] uppercase tracking-widest text-right py-2 px-2" style={{ color: G.dim }}>Bast 3</th>
                      <th className="font-inter text-[7px] uppercase tracking-widest text-right py-2 px-2" style={{ color: G.dim }}>Bast 4</th>
                      <th className="font-inter text-[7px] uppercase tracking-widest text-right py-2 px-2" style={{ color: G.dim }}>Bast 5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {letters.map((letter, i) => {
                      const bastValues = BAST_TABLE[letter];
                      return (
                        <tr key={letter} style={{ borderBottom: `1px solid ${G.goldBorder}22`, background: i % 2 === 0 ? "transparent" : G.bgInner + "55" }}>
                          <td className="py-2 px-2">
                            <LetterCell letter={letter} size="sm" />
                          </td>
                          <td className="font-inter tabular-nums text-right py-2 px-2 font-bold" style={{ color: G.gold, fontSize: 10 }}>{bastValues[0].toLocaleString()}</td>
                          <td className="font-inter tabular-nums text-right py-2 px-2" style={{ color: G.blue, fontSize: 10 }}>{bastValues[1].toLocaleString()}</td>
                          <td className="font-inter tabular-nums text-right py-2 px-2" style={{ color: G.blue, fontSize: 10 }}>{bastValues[2].toLocaleString()}</td>
                          <td className="font-inter tabular-nums text-right py-2 px-2" style={{ color: G.blue, fontSize: 10 }}>{bastValues[3].toLocaleString()}</td>
                          <td className="font-inter tabular-nums text-right py-2 px-2" style={{ color: G.blue, fontSize: 10 }}>{bastValues[4].toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ══ ISTINTAK TAB ══ */}
        {activeTab === "istintak" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card accent={allPassed ? G.green : G.red}>
              <SectionHeader 
                step="2" 
                label="Istintak Verification" 
                arabic="التحقق من الاستنتاك" 
                color={allPassed ? G.green : G.red} 
              />
              
              <div className="mb-4 p-3 rounded-lg border"
                style={{ background: allPassed ? G.greenDim : "rgba(248,113,113,0.15)", borderColor: allPassed ? G.green + "40" : G.red + "40" }}>
                <div className="flex items-center gap-2">
                  <span className="font-inter text-[8px] uppercase tracking-wider font-bold"
                    style={{ color: allPassed ? G.green : G.red }}>
                    {allPassed ? "✓ All Tests Passed" : "✗ Tests Failed"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {verificationResults.map((test, i) => (
                  <div key={i} className="rounded-lg border p-3"
                    style={{
                      background: test.passed ? G.bgInner : "rgba(248,113,113,0.08)",
                      borderColor: test.passed ? G.goldBorder + "60" : G.red + "40",
                    }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded flex items-center justify-center font-inter text-[9px] font-black"
                          style={{ background: test.passed ? G.green : G.red, color: "#fff" }}>
                          {test.passed ? "✓" : "✗"}
                        </div>
                        <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>{test.description}</span>
                      </div>
                      <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.gold }}>{test.number.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Expected:</span>
                      <div className="flex gap-1" style={{ direction: "rtl" }}>
                        {test.expected.map((l, i) => (
                          <LetterCell key={i} letter={l} size="sm" color={G.green} />
                        ))}
                      </div>
                      <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Got:</span>
                      <div className="flex gap-1" style={{ direction: "rtl" }}>
                        {test.result.map((l, i) => (
                          <LetterCell key={i} letter={l} size="sm" color={test.passed ? G.green : G.red} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* ══ ELEMENTS TAB ══ */}
        {activeTab === "elements" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card accent={G.gold}>
              <SectionHeader step="3" label="Elemental Bast Totals" arabic="مجموعات العناصر" color={G.gold} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: "fire", arabic: "النار", english: "Fire", color: "#F87171", icon: "🜂" },
                  { key: "earth", arabic: "التراب", english: "Earth", color: "#86EFAC", icon: "🜃" },
                  { key: "air", arabic: "الهواء", english: "Air", color: "#93C5FD", icon: "🜁" },
                  { key: "water", arabic: "الماء", english: "Water", color: "#67E8F9", icon: "🜄" },
                ].map(el => {
                  const total = ELEMENT_BAST_TOTALS[el.key];
                  const galibValue = GALIB_ANASIR_VALUES[el.key];
                  const istintakLetters = istintak(galibValue);
                  
                  return (
                    <div key={el.key} className="rounded-xl border p-4"
                      style={{ background: G.bgInner, borderColor: el.color + "44" }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{el.icon}</span>
                        <div>
                          <div className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>{el.english}</div>
                          <div className="font-amiri text-lg font-bold" style={{ color: el.color }}>{el.arabic}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-1.5 border-b" style={{ borderColor: G.goldBorder + "33" }}>
                          <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>First Bast Total</span>
                          <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.gold }}>{total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b" style={{ borderColor: G.goldBorder + "33" }}>
                          <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Galib Anasir Value</span>
                          <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.blue }}>{galibValue.toLocaleString()}</span>
                        </div>
                        <div className="py-1.5">
                          <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Istintak Letters</span>
                          <div className="flex gap-1 mt-1" style={{ direction: "rtl" }}>
                            {istintakLetters.map((l, i) => (
                              <LetterCell key={i} letter={l} size="sm" color={el.color} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

      </div>
    </PageLayout>
  );
}