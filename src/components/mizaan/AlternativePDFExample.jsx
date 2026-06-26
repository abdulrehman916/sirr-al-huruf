// ═══════════════════════════════════════════════════════════════
// ALTERNATIVE PDF EXAMPLE (Pages 101-105) — READ-ONLY EDUCATIONAL
// ═══════════════════════════════════════════════════════════════
// This is a FIXED example from the manuscript for learning purposes.
// All values are hardcoded from PDF pages 101-105.
// This component does NOT perform live calculations.
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";

const G = {
  gold: "#F5D060", goldDim: "rgba(245,208,96,0.55)", goldFaint: "rgba(212,175,55,0.07)",
  goldBorder: "rgba(212,175,55,0.40)", goldBorderHi: "rgba(212,175,55,0.65)", glow: "rgba(212,175,55,0.18)",
  bg: "rgba(3,6,20,0.99)", bgCard: "rgba(8,16,40,0.98)", bgInner: "rgba(212,175,55,0.06)",
  green: "#4ADE80", greenDim: "rgba(74,222,128,0.15)", red: "#F87171", dim: "rgba(255,255,255,0.35)",
};

function SectionHeader({ step, label, arabic, color = G.gold }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg font-inter text-xs font-black" style={{ background: color + "22", border: `1px solid ${color}55`, color }}>{step}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-inter text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color }}>{label}</span>
          {arabic && <span className="font-amiri text-base" style={{ color: G.goldDim, lineHeight: 1.8 }}>{arabic}</span>}
        </div>
      </div>
      <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(to right, ${color}40, transparent)` }} />
    </div>
  );
}

function Card({ children, accent }) {
  return (
    <div className="rounded-xl border p-4" style={{ background: G.bgCard, borderColor: accent ? accent + "55" : G.goldBorder, borderLeft: accent ? `3px solid ${accent}` : undefined, boxShadow: `0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.05)` }}>
      {children}
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

function LetterCell({ letter, color = G.gold, size = "lg" }) {
  const sizes = { sm: "text-xl px-2.5 py-1.5", lg: "text-3xl px-4 py-2.5", xl: "text-4xl px-5 py-3" };
  return (
    <span className={`font-amiri font-bold rounded-lg border ${sizes[size]}`} style={{ color, borderColor: color + "55", background: color + "12", lineHeight: 1.8, display: "inline-block" }}>{letter}</span>
  );
}

function LetterRow({ letters, color = G.gold, size = "lg", rtl = false, showTransliteration = false, transliteration = [] }) {
  const safeLetters = Array.isArray(letters) ? letters : [];
  if (!safeLetters || safeLetters.length === 0) return <span className="font-inter text-xs italic" style={{ color: G.dim }}>—</span>;
  return (
    <div className="flex flex-col gap-2" style={{ direction: rtl ? "rtl" : "ltr" }}>
      <div className="flex flex-wrap gap-2.5 items-center">
        {safeLetters.map((l, i) => <LetterCell key={i} letter={l} color={color} size={size} />)}
      </div>
      {showTransliteration && transliteration.length > 0 && (
        <div className="flex flex-wrap gap-2.5 items-center justify-center">
          {transliteration.map((t, i) => (
            <span key={i} className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function CollapsiblePanel({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: G.bgInner, borderColor: G.goldBorder + "40" }}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
        {isOpen ? <ChevronDown className="w-4 h-4" style={{ color: G.gold }} /> : <ChevronRight className="w-4 h-4" style={{ color: G.gold }} />}
        <span className="font-inter text-sm font-bold" style={{ color: G.gold }}>{title}</span>
      </button>
      {isOpen && <div className="px-4 pb-4 border-t" style={{ borderColor: G.goldBorder + "30" }}>{children}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STAGE 1: INITIAL CALCULATION (Page 101)
// ═══════════════════════════════════════════════════════════════
function Stage1InitialCalculation() {
  const initialTotal = 25423;
  const istintaq1Letters = ["ج", "ك", "ت", "غ", "ه", "ك"];
  const transliteration1 = ["Cim", "Kef", "Te", "Ğayın", "He", "Kef"];
  
  const bast4Values = [
    { letter: "ك", name: "Kef", value: 70857 },
    { letter: "ه", name: "He", value: 47687 },
    { letter: "غ", name: "Ğayın", value: 36939 },
    { letter: "ت", name: "Te", value: 87072 },
    { letter: "ك", name: "Kef", value: 70857 },
    { letter: "ج", name: "Cim", value: 63051 },
  ];
  
  const sumBast4 = bast4Values.reduce((s, v) => s + v.value, 0); // 376,463 (PDF says 376,459)
  const mahraç = 34;
  const totalWithMahraç = sumBast4 + mahraç; // 376,497 (PDF says 376,493)
  
  const istintaq2Letters = ["ج", "ص", "ت", "غ", "و", "ع", "ش"];
  const transliteration2 = ["Cim", "Sat", "Te", "Ğayın", "Vav", "Ayın", "Şın"];
  
  return (
    <Card accent={G.gold}>
      <SectionHeader step="1" label="Initial Calculation (Page 101)" arabic="الحساب الأولي" color={G.gold} />
      
      {/* Initial Total */}
      <div className="mb-4 rounded-lg border p-4 text-center" style={{ background: G.bgInner, borderColor: G.goldBorder }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>9 Mizan Total (PDF Example)</div>
        <div className="text-4xl font-black" style={{ color: G.gold }}>{initialTotal.toLocaleString()}</div>
      </div>
      
      {/* First Istintaq */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>First Istintaq → 6 Letters</div>
        <LetterRow letters={istintaq1Letters} color={G.gold} size="xl" rtl showTransliteration transliteration={transliteration1} />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>
          Count: <span style={{ color: G.gold, fontWeight: "bold" }}>6</span>
          <span className="mx-2" style={{ color: G.dim }}>•</span>
          <span style={{ color: G.green, fontWeight: "bold" }}>ZEVC (زوج) → 4th Bast</span>
        </div>
      </div>
      
      {/* Individual 4th Bast Calculations */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Individual 4th Bast Calculations</div>
        <div className="space-y-2">
          {bast4Values.map((bv, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
              <LetterCell letter={bv.letter} color={G.gold} size="sm" />
              <span className="font-inter text-xs" style={{ color: G.dim }}>{bv.name}</span>
              <div className="flex-1" />
              <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.green }}>{bv.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sum + Mahraç */}
      <div className="mb-4 rounded-lg border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-3 text-center" style={{ color: G.dim }}>Sum + Mahraç</div>
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center">
          <div>
            <div className="text-[7px]" style={{ color: G.dim }}>Sum of Bast</div>
            <div className="text-lg font-bold" style={{ color: G.gold }}>{sumBast4.toLocaleString()}</div>
          </div>
          <span className="font-inter text-base font-bold" style={{ color: G.goldDim }}>+</span>
          <div>
            <div className="text-[7px]" style={{ color: G.dim }}>Mahraç</div>
            <div className="text-lg font-bold" style={{ color: G.gold }}>{mahraç}</div>
          </div>
          <span className="font-inter text-base font-bold" style={{ color: G.goldDim }}>=</span>
          <div>
            <div className="text-[7px]" style={{ color: G.dim }}>Total</div>
            <div className="text-xl font-black" style={{ color: G.green }}>{totalWithMahraç.toLocaleString()}</div>
          </div>
        </div>
      </div>
      
      {/* Second Istintaq */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Second Istintaq → 7 Letters (FERD)</div>
        <LetterRow letters={istintaq2Letters} color={G.gold} size="xl" rtl showTransliteration transliteration={transliteration2} />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>
          Count: <span style={{ color: G.gold, fontWeight: "bold" }}>7</span>
          <span className="mx-2" style={{ color: G.dim }}>•</span>
          <span style={{ color: G.red, fontWeight: "bold" }}>FERD (فرد) → 5 letters/name</span>
        </div>
      </div>
      
      {/* Group Formation */}
      <div className="rounded-lg border p-4 text-center" style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Esma-i Kitabet Name</div>
        <div className="text-3xl font-amiri font-bold" style={{ color: G.gold }} dir="rtl">جَصتغوعش</div>
        <div className="text-[7px] mt-2" style={{ color: G.dim }}>Casteğû — One name formed from 7 letters</div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// STAGE 2: ESMA-I A'VAN (Page 102)
// ═══════════════════════════════════════════════════════════════
function Stage2EsmaAvan() {
  const remainder1 = ["ع", "ش"];
  const waterLetters = ["غ", "ح", "ر", "ع", "ل", "ح", "د", "ش", "ع"];
  const waterTranslit = ["Ğayın", "Hı", "Ra", "Ayın", "Lam", "Ha", "Dal", "Şın", "Ayın"];
  
  const bast5Values = [
    { letter: "ع", name: "Ayın", value: 289015 },
    { letter: "ش", name: "Şın", value: 473595 },
    { letter: "د", name: "Dal", value: 271164 },
    { letter: "ح", name: "Ha", value: 347099 },
    { letter: "ل", name: "Lam", value: 387380 },
    { letter: "ع", name: "Ayın", value: 289015 },
    { letter: "ر", name: "Ra", value: 362686 },
    { letter: "ح", name: "Hı", value: 343896 },
    { letter: "غ", name: "Ğayın", value: 182227 },
  ];
  
  const sumBast5 = bast5Values.reduce((s, v) => s + v.value, 0); // 2,946,077 (PDF: 2,946,079)
  const istintaq3Letters = ["و", "ي", "ق", "ف", "و", "م", "غ", "ق", "ط", "ك"];
  const transliteration3 = ["Vav", "Ye", "Kaf", "Fe", "Vav", "Mim", "Ğayın", "Kaf", "Tı", "Kef"];
  
  const names = ["وَيْقَغْ", "وَمْغَقْ"]; // Veykağ, Vemğak
  const remainder2 = ["ط", "ك"];
  
  return (
    <Card accent={G.gold}>
      <SectionHeader step="2" label="Esma-i A'van (Page 102)" arabic="أسماء الأعوان" color={G.gold} />
      
      {/* Carry-forward + Water Letters */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Remainder from Kitabet + Water Letters</div>
        <div className="text-[7px] mb-2" style={{ color: G.dim }}>Remainder (2 letters):</div>
        <LetterRow letters={remainder1} color={G.goldDim} size="lg" rtl />
        <div className="text-[7px] mt-3 mb-2" style={{ color: G.dim }}>Add Water Letters (9 letters):</div>
        <LetterRow letters={waterLetters} color={G.gold} size="lg" rtl showTransliteration transliteration={waterTranslit} />
      </div>
      
      {/* Individual 5th Bast Calculations */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Individual 5th Bast Calculations (9 letters)</div>
        <div className="space-y-2">
          {bast5Values.map((bv, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
              <LetterCell letter={bv.letter} color={G.gold} size="sm" />
              <span className="font-inter text-xs" style={{ color: G.dim }}>{bv.name}</span>
              <div className="flex-1" />
              <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.green }}>{bv.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sum */}
      <div className="mb-4 rounded-lg border p-3 text-center" style={{ background: G.bgInner, borderColor: G.goldBorder }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Sum of 5th Bast Values</div>
        <div className="text-3xl font-black" style={{ color: G.gold }}>{sumBast5.toLocaleString()}</div>
      </div>
      
      {/* Third Istintaq */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Third Istintaq → 10 Letters (ZEVC)</div>
        <LetterRow letters={istintaq3Letters} color={G.gold} size="xl" rtl showTransliteration transliteration={transliteration3} />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>
          Count: <span style={{ color: G.gold, fontWeight: "bold" }}>10</span>
          <span className="mx-2" style={{ color: G.dim }}>•</span>
          <span style={{ color: G.green, fontWeight: "bold" }}>ZEVC (زوج) → 4 letters/name</span>
        </div>
      </div>
      
      {/* Group Formation */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Esma-i A'van Names</div>
        <div className="space-y-2">
          {names.map((name, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border" style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
              <span className="font-inter text-xs font-bold" style={{ color: G.dim }}>{idx + 1}.</span>
              <span className="font-amiri text-2xl font-bold flex-1" style={{ color: G.gold }} dir="rtl">{name}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border" style={{ background: G.bgInner, borderColor: G.goldBorder }}>
            <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Total Names</span>
            <span className="font-inter text-lg font-bold" style={{ color: G.gold }}>2</span>
          </div>
        </div>
      </div>
      
      {/* Remainder for next stage */}
      <div className="rounded-lg border p-4" style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Remainder (Carried to Kasem Stage)</div>
        <LetterRow letters={remainder2} color={G.goldDim} size="lg" rtl />
        <div className="text-[7px] mt-2" style={{ color: G.dim }}>2 letters preserved</div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// STAGE 3: ESMA-I KASEM (Page 103)
// ═══════════════════════════════════════════════════════════════
function Stage3EsmaKasem() {
  const remainder2 = ["ط", "ك"];
  const waterLetters2 = ["د", "ح", "ل", "ع", "ر", "ح", "غ"];
  const waterTranslit2 = ["Dal", "Ha", "Lam", "Ayın", "Ra", "Hı", "Ğayın"];
  const combinedLetters = [...remainder2, ...waterLetters2]; // 9 letters
  
  const bast5Values2 = [
    { letter: "ط", name: "Tı", value: 246517 },
    { letter: "ك", name: "Kef", value: 347214 },
    { letter: "د", name: "Dal", value: 271164 },
    { letter: "ح", name: "Ha", value: 347099 },
    { letter: "ل", name: "Lam", value: 387380 },
    { letter: "ع", name: "Ayın", value: 289015 },
    { letter: "ر", name: "Ra", value: 362686 },
    { letter: "ح", name: "Hı", value: 348896 },
    { letter: "غ", name: "Ğayın", value: 182227 },
  ];
  
  const sumBast5_2 = bast5Values2.reduce((s, v) => s + v.value, 0); // 2,782,198 (PDF: 2,777,198)
  const mahraç2 = 41;
  const totalWithMahraç2 = sumBast5_2 + mahraç2; // 2,782,239 (PDF: 2,777,239)
  
  const istintaq4Letters = ["ط", "ل", "ر", "غ", "ز", "ع", "غ", "ق", "ز", "ك"];
  const transliteration4 = ["Tı", "Lam", "Ra", "Ğayın", "Ze", "Ayın", "Ğayın", "Kaf", "Ze", "Kef"];
  
  const kasemNames = ["طَلْرَغ", "زَعْقَغ"]; // Talrağ, Zağak
  const remainder3 = ["ز", "ك"];
  const firstTwoFromFirst = ["ط", "ل"];
  const finalName = ["ز", "ك", "ط", "ل"]; // Zektal
  
  return (
    <Card accent={G.gold}>
      <SectionHeader step="3" label="Esma-i Kasem (Page 103)" arabic="أسماء القسم" color={G.gold} />
      
      {/* Carry-forward + Water Letters */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Remainder from A'van + Water Letters</div>
        <div className="text-[7px] mb-2" style={{ color: G.dim }}>Remainder (2 letters):</div>
        <LetterRow letters={remainder2} color={G.goldDim} size="lg" rtl />
        <div className="text-[7px] mt-3 mb-2" style={{ color: G.dim }}>Add Water Letters (7 letters):</div>
        <LetterRow letters={waterLetters2} color={G.gold} size="lg" rtl showTransliteration transliteration={waterTranslit2} />
        <div className="text-[7px] mt-2" style={{ color: G.dim }}>Combined: <span style={{ color: G.gold, fontWeight: "bold" }}>9 letters</span></div>
      </div>
      
      {/* Individual 5th Bast Calculations */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Individual 5th Bast Calculations (9 letters)</div>
        <div className="space-y-2">
          {bast5Values2.map((bv, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
              <LetterCell letter={bv.letter} color={G.gold} size="sm" />
              <span className="font-inter text-xs" style={{ color: G.dim }}>{bv.name}</span>
              <div className="flex-1" />
              <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.green }}>{bv.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sum + Mahraç */}
      <div className="mb-4 rounded-lg border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-3 text-center" style={{ color: G.dim }}>Sum + Mahraç</div>
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center">
          <div>
            <div className="text-[7px]" style={{ color: G.dim }}>Sum of Bast</div>
            <div className="text-lg font-bold" style={{ color: G.gold }}>{sumBast5_2.toLocaleString()}</div>
          </div>
          <span className="font-inter text-base font-bold" style={{ color: G.goldDim }}>+</span>
          <div>
            <div className="text-[7px]" style={{ color: G.dim }}>Mahraç</div>
            <div className="text-lg font-bold" style={{ color: G.gold }}>{mahraç2}</div>
          </div>
          <span className="font-inter text-base font-bold" style={{ color: G.goldDim }}>=</span>
          <div>
            <div className="text-[7px]" style={{ color: G.dim }}>Total</div>
            <div className="text-xl font-black" style={{ color: G.green }}>{totalWithMahraç2.toLocaleString()}</div>
          </div>
        </div>
      </div>
      
      {/* Fourth Istintaq */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Fourth Istintaq → 10 Letters (ZEVC)</div>
        <LetterRow letters={istintaq4Letters} color={G.gold} size="xl" rtl showTransliteration transliteration={transliteration4} />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>
          Count: <span style={{ color: G.gold, fontWeight: "bold" }}>10</span>
          <span className="mx-2" style={{ color: G.dim }}>•</span>
          <span style={{ color: G.green, fontWeight: "bold" }}>ZEVC (زوج) → 4 letters/name</span>
        </div>
      </div>
      
      {/* Group Formation */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Esma-i Kasem Names</div>
        <div className="space-y-2">
          {kasemNames.map((name, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border" style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
              <span className="font-inter text-xs font-bold" style={{ color: G.dim }}>{idx + 1}.</span>
              <span className="font-amiri text-2xl font-bold flex-1" style={{ color: G.gold }} dir="rtl">{name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Final Name Completion */}
      <div className="mb-4 rounded-lg border p-4" style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>Final Name Completion (PDF Method)</div>
        <div className="text-[7px] mb-2" style={{ color: G.dim }}>Remainder (2 letters):</div>
        <LetterRow letters={remainder3} color={G.goldDim} size="sm" rtl />
        <div className="text-[7px] mt-3 mb-2" style={{ color: G.dim }}>+ First 2 letters from first Kasem name:</div>
        <LetterRow letters={firstTwoFromFirst} color={G.gold} size="sm" rtl />
        <div className="flex items-center gap-2 mt-3">
          <Arrow label="→" />
          <span className="font-amiri text-3xl font-bold px-4 py-3 rounded-lg border" style={{ color: G.gold, borderColor: G.goldBorder, background: G.bgInner }} dir="rtl">زَكْطَل</span>
        </div>
        <div className="text-[7px] mt-2 text-center" style={{ color: G.dim }}>Zektal — Final completed name</div>
      </div>
      
      {/* Summary */}
      <div className="rounded-lg border p-4 text-center" style={{ background: G.bg, borderColor: G.goldBorderHi }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Complete Esma-i Kasem</div>
        <div className="text-sm" style={{ color: G.dim }}>3 names total (2 grouped + 1 completed)</div>
      </div>
    </Card>
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

// ═══════════════════════════════════════════════════════════════
// STAGE 4: KEYWORD SUBTRACTION EXAMPLES (Pages 104-105)
// ═══════════════════════════════════════════════════════════════
function Stage4KeywordExamples() {
  const baseTotal = 376459; // From PDF
  
  // Ayil example
  const ayilValue = 51;
  const ayilResult = baseTotal - ayilValue; // 376,408
  const ayilIstintaq = ["ج", "ه", "ت", "غ", "و", "ع", "ش"];
  const ayilName = "حَتْغُوْعَشْ"; // Hatğûaş
  const ayilFinal = "يَاحَتْغُوْعَشَايِيْل"; // Ya Hatğûaşâyîl
  
  // Yuşin example
  const yusinValue = 316;
  const yusinResult = baseTotal - yusinValue; // 376,143
  const yusinIstintaq = ["ج", "م", "ق", "و", "ع", "ش"];
  const yusinName = "جَمْقَعُوْعَشْ"; // Cemkağûaş
  
  // Kasem prefix/suffix
  const kasemWithPrefix = "بِحَقِّ مَقْغُوعَشِيُوشٍ"; // Bi hakki Makğûaşyûşin
  
  return (
    <Card accent={G.gold}>
      <SectionHeader step="4" label="Keyword Subtraction Examples (Pages 104-105)" arabic="أمثلة الطرح" color={G.gold} />
      
      {/* Ayil Example */}
      <CollapsiblePanel title="Ayil (آيِيلَ) Subtraction — 51" defaultOpen={false}>
        <div className="space-y-3">
          <div className="rounded-lg border p-3" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
            <div className="font-inter text-[7px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Base Total (from Esma-i A'van)</div>
            <div className="text-2xl font-bold" style={{ color: G.gold }}>{baseTotal.toLocaleString()}</div>
          </div>
          
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center">
            <div>
              <div className="text-[7px]" style={{ color: G.dim }}>Base Total</div>
              <div className="text-lg font-bold" style={{ color: G.gold }}>{baseTotal.toLocaleString()}</div>
            </div>
            <span className="font-inter text-base font-bold" style={{ color: G.goldDim }}>−</span>
            <div>
              <div className="text-[7px]" style={{ color: G.dim }}>Ayil</div>
              <div className="text-lg font-bold" style={{ color: G.red }}>{ayilValue}</div>
            </div>
            <span className="font-inter text-base font-bold" style={{ color: G.goldDim }}>=</span>
            <div>
              <div className="text-[7px]" style={{ color: G.dim }}>Result</div>
              <div className="text-lg font-bold" style={{ color: G.green }}>{ayilResult.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="pt-3 border-t" style={{ borderColor: G.goldBorder + "30" }}>
            <div className="font-inter text-[7px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Istintaq of Result</div>
            <LetterRow letters={ayilIstintaq} color={G.gold} size="lg" rtl />
          </div>
          
          <div className="rounded-lg border p-3 text-center" style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
            <div className="font-inter text-[7px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Base Name</div>
            <div className="text-2xl font-amiri font-bold" style={{ color: G.gold }} dir="rtl">{ayilName}</div>
            <div className="text-[6px] mt-1" style={{ color: G.dim }}>Hatğûaş</div>
          </div>
          
          <div className="rounded-lg border p-3 text-center" style={{ background: G.bg, borderColor: G.goldBorderHi }}>
            <div className="font-inter text-[7px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Final Name (Ya + Name + Ayil)</div>
            <div className="text-xl font-amiri font-bold" style={{ color: G.gold }} dir="rtl">{ayilFinal}</div>
            <div className="text-[6px] mt-1" style={{ color: G.dim }}>Ya Hatğûaşâyîl</div>
          </div>
        </div>
      </CollapsiblePanel>
      
      {/* Yuşin Example */}
      <CollapsiblePanel title="Yuşin (يُوشِيْن) Subtraction — 316" defaultOpen={false}>
        <div className="space-y-3">
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center">
            <div>
              <div className="text-[7px]" style={{ color: G.dim }}>Base Total</div>
              <div className="text-lg font-bold" style={{ color: G.gold }}>{baseTotal.toLocaleString()}</div>
            </div>
            <span className="font-inter text-base font-bold" style={{ color: G.goldDim }}>−</span>
            <div>
              <div className="text-[7px]" style={{ color: G.dim }}>Yuşin</div>
              <div className="text-lg font-bold" style={{ color: G.red }}>{yusinValue}</div>
            </div>
            <span className="font-inter text-base font-bold" style={{ color: G.goldDim }}>=</span>
            <div>
              <div className="text-[7px]" style={{ color: G.dim }}>Result</div>
              <div className="text-lg font-bold" style={{ color: G.green }}>{yusinResult.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="pt-3 border-t" style={{ borderColor: G.goldBorder + "30" }}>
            <div className="font-inter text-[7px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Istintaq of Result</div>
            <LetterRow letters={yusinIstintaq} color={G.gold} size="lg" rtl />
          </div>
          
          <div className="rounded-lg border p-3 text-center" style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
            <div className="font-inter text-[7px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Base Name</div>
            <div className="text-2xl font-amiri font-bold" style={{ color: G.gold }} dir="rtl">{yusinName}</div>
            <div className="text-[6px] mt-1" style={{ color: G.dim }}>Cemkağûaş</div>
          </div>
        </div>
      </CollapsiblePanel>
      
      {/* Kasem Prefix/Suffix Example */}
      <CollapsiblePanel title="Kasem Prefix/Suffix Construction (Page 105)" defaultOpen={false}>
        <div className="space-y-3">
          <div className="text-[7px]" style={{ color: G.dim }}>
            Add <span className="font-amiri text-base" style={{ color: G.gold }}>بِحَقِّ</span> (Bi hakki) prefix and <span className="font-amiri text-base" style={{ color: G.gold }}>يُوشٍ</span> (Yuşin) suffix:
          </div>
          
          <div className="rounded-lg border p-4 text-center" style={{ background: G.bg, borderColor: G.goldBorderHi }}>
            <div className="font-inter text-[7px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Final Esma-i Kasem</div>
            <div className="text-2xl font-amiri font-bold" style={{ color: G.gold }} dir="rtl">{kasemWithPrefix}</div>
            <div className="text-[6px] mt-2" style={{ color: G.dim }}>Bi hakki Makğûaşyûşin</div>
          </div>
          
          <div className="text-[6px] pt-3 border-t" style={{ borderColor: G.goldBorder + "30" }}>
            <span style={{ color: G.dim }}>Read according to Ebced-i Kebir values for spiritual work.</span>
          </div>
        </div>
      </CollapsiblePanel>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORTED COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function AlternativePDFExample() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: G.bg, borderColor: G.goldBorder + "30" }}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: G.goldFaint, border: `1px solid ${G.goldBorder}` }}>
          <BookOpen className="w-5 h-5" style={{ color: G.gold }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-inter text-sm font-bold" style={{ color: G.gold }}>Alternative Bast Example (PDF Example)</span>
            <span className="font-inter text-[8px] uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: G.goldFaint, color: G.goldDim, border: `1px solid ${G.goldBorder + "40"}` }}>Pages 101-105</span>
          </div>
          <div className="font-inter text-[9px]" style={{ color: G.dim }}>Read-only educational example from manuscript — Fixed values for learning</div>
        </div>
        {isExpanded ? <ChevronDown className="w-5 h-5" style={{ color: G.gold }} /> : <ChevronRight className="w-5 h-5" style={{ color: G.gold }} />}
      </button>
      
      {/* Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-5 border-t" style={{ borderColor: G.goldBorder + "30" }}>
          <OrnamentalDivider />
          
          {/* Educational Notice */}
          <div className="rounded-xl border p-4" style={{ background: G.goldFaint, borderColor: G.goldBorder + "55" }}>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0" style={{ background: G.gold + "22", border: `1px solid ${G.gold}` }}>
                <BookOpen className="w-4 h-4" style={{ color: G.gold }} />
              </div>
              <div className="flex-1">
                <div className="font-inter text-xs font-bold mb-1" style={{ color: G.gold }}>Educational Reference Only</div>
                <div className="font-inter text-[9px] leading-relaxed" style={{ color: G.dim }}>
                  This example demonstrates the complete Bast workflow using fixed values from PDF pages 101-105. 
                  All calculations are pre-computed from the manuscript for learning purposes. 
                  This section does NOT affect your live Method 1 or Method 2 calculations.
                </div>
              </div>
            </div>
          </div>
          
          {/* All Stages */}
          <Stage1InitialCalculation />
          <Stage2EsmaAvan />
          <Stage3EsmaKasem />
          <Stage4KeywordExamples />
          
          <OrnamentalDivider />
          
          {/* Footer */}
          <div className="text-center px-4 py-3 rounded-xl border" style={{ background: G.bgInner, borderColor: G.goldBorder + "30" }}>
            <div className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Complete PDF Example Workflow</div>
            <div className="font-inter text-[7px] mt-1" style={{ color: G.goldDim }}>Esma-i Kitabet → A'van → Kasem → Keyword Subtraction</div>
          </div>
        </div>
      )}
    </div>
  );
}