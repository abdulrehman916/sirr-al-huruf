// ═══════════════════════════════════════════════════════════════
// METHOD 2 PIPELINE: "Adetlerin Bastı" — Complete Workflow
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { runMethod2Pipeline } from "../../lib/mizaanMethod2Engine";
import { getBastLevel, istintak } from "../../lib/mizaanPostEngine";
import AlternativePDFExample from "./AlternativePDFExample";
import IndividualLetterDerivation from "./IndividualLetterDerivation";
import FinalDivineNamesSection from "./FinalDivineNamesSection";

const G = {
  gold: "#F5D060", goldDim: "rgba(245,208,96,0.55)", goldFaint: "rgba(212,175,55,0.07)",
  goldBorder: "rgba(212,175,55,0.40)", goldBorderHi: "rgba(212,175,55,0.65)", glow: "rgba(212,175,55,0.18)",
  bg: "rgba(3,6,20,0.99)", bgCard: "rgba(8,16,40,0.98)", bgInner: "rgba(212,175,55,0.06)",
  green: "#4ADE80", greenDim: "rgba(74,222,128,0.15)", red: "#F87171", dim: "rgba(255,255,255,0.35)",
};

const ELEMENT_COLORS = {
  fire: { color: "#FF6B35", arabic: "النار", icon: "🔥" }, earth: { color: "#A5C880", arabic: "التراب", icon: "🌍" },
  air: { color: "#B2EBF2", arabic: "الهواء", icon: "🌪" }, water: { color: "#4FC3F7", arabic: "الماء", icon: "💧" },
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

function LetterRow({ letters, color = G.gold, size = "lg", rtl = false }) {
  const safeLetters = Array.isArray(letters) ? letters : [];
  if (!safeLetters || safeLetters.length === 0) return <span className="font-inter text-xs italic" style={{ color: G.dim }}>—</span>;
  return (
    <div className="flex flex-wrap gap-2.5 items-center" style={{ direction: rtl ? "rtl" : "ltr" }}>
      {safeLetters.map((l, i) => <LetterCell key={i} letter={l} color={color} size={size} />)}
    </div>
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

function CollapsibleSource({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mt-3 pt-3 border-t" style={{ borderColor: G.goldBorder + "40" }}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-center gap-1.5 text-[7px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>
        {isOpen ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />} {title}
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
}

function EsmaKitabetSection({ kitabetData, dominant, getBastLevelFn, mizanulMevazin }) {
  if (!kitabetData) return null;
  const safe = {
    seedLetters: Array.isArray(kitabetData.seedLetters) ? kitabetData.seedLetters : [],
    allExpanded: Array.isArray(kitabetData.allExpandedLetters) ? kitabetData.allExpandedLetters : [],
    groups: Array.isArray(kitabetData.groups) ? kitabetData.groups : [],
    remainder: Array.isArray(kitabetData.remainder) ? kitabetData.remainder : [],
    derivations: Array.isArray(kitabetData.derivations) ? kitabetData.derivations : [],
  };
  const elementMeta = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;
  const lastGroupName = safe.groups.length > 0 ? safe.groups[safe.groups.length - 1].name : '';
  const lastNameB1 = lastGroupName ? lastGroupName.split('').reduce((s, ch) => s + (getBastLevelFn(ch, 1) || 0), 0) : 0;
  const dominantB1 = getBastLevelFn(dominant, 1) || 0;
  const calcTotal = lastNameB1 + dominantB1 + mizanulMevazin;
  
  // Calculate seed letters for A'van stage (Istintaq of Kitabet Total)
  const avanSeedLetters = istintak(calcTotal);
  const arabicLetterNames = {
    'د': 'Dal', 'ع': 'Ayn', 'ذ': 'Zel', 'غ': 'Ğayın', 'ج': 'Cim', 'ك': 'Kaf',
    'ا': 'Elif', 'ب': 'Be', 'ت': 'Te', 'ث': 'Se', 'ح': 'Hı', 'خ': 'Ha',
    'د': 'Dal', 'ر': 'Ra', 'ز': 'Ze', 'س': 'Sin', 'ش': 'Şın', 'ص': 'Sat',
    'ض': 'Dat', 'ط': 'Tı', 'ظ': 'Zı', 'ف': 'Fe', 'ق': 'Kaf', 'ل': 'Lam',
    'م': 'Mim', 'ن': 'Nun', 'و': 'Vav', 'ه': 'He', 'ي': 'Ye'
  };

  return (
    <Card accent={elementMeta.color}>
      <SectionHeader step="1" label="Esma-i Kitabet" arabic="أسماء الكتابة" color={elementMeta.color} />
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{elementMeta.icon}</span>
        <div className="flex items-center gap-2">
          <span className="font-amiri text-lg" style={{ color: elementMeta.color }}>{elementMeta.arabic}</span>
          <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>({dominant})</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Seed Letters (Istintaq of Mizanül Mevazin)</div>
        <LetterRow letters={safe.seedLetters} color={elementMeta.color} size="xl" rtl />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>
          Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{safe.seedLetters.length}</span>
          <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
          <span style={{ color: kitabetData.isFerd ? G.red : G.green, fontWeight: "bold" }}>{kitabetData.isFerd ? "FERD (فرد)" : "ZEVC (زوج)"}</span>
          <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
          <span style={{ color: G.goldDim }}>Bast Level: <span style={{ color: G.gold }}>{kitabetData.bastLevel}th</span></span>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Individual Bast Derivations (Reverse Order)</div>
        {safe.derivations.map((d, idx) => (
          <div key={idx} className="rounded-lg border p-2 flex items-center gap-2 flex-wrap" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
            <LetterCell letter={d.originalLetter} color={elementMeta.color} size="sm" />
            <Arrow label={`B${d.bastLevel}`} />
            <div className="px-2 py-1 rounded text-xs font-bold tabular-nums" style={{ background: G.greenDim, borderColor: G.green + "40", color: G.green }}>{d.bastValue.toLocaleString()}</div>
            <Arrow label="→" />
            <div className="flex items-center gap-1" style={{ direction: "rtl" }}>
              {Array.isArray(d.expandedLetters) && d.expandedLetters.map((l, i) => <LetterCell key={i} letter={l} color={G.green} size="sm" />)}
            </div>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>All Expanded Letters ({safe.allExpanded.length} total)</div>
        <LetterRow letters={safe.allExpanded} color={G.gold} size="lg" rtl />
      </div>
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Group Formation → Esma-i Kitabet Names</div>
        <div className="space-y-2">
          {safe.groups.map((group, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border" style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
              <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.dim }}>{group.groupNumber}.</span>
              <LetterRow letters={Array.isArray(group.letters) ? group.letters : []} color={G.gold} size="lg" rtl />
              <Arrow label="→" />
              <span className="font-amiri text-2xl font-bold px-3 py-1.5 rounded-lg border flex-1 text-center" style={{ color: G.gold, borderColor: G.goldBorder, background: G.bgInner, lineHeight: 1.8 }} dir="rtl">{group.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Completion Status — No Remainder */}
      <div className="mb-6 rounded-lg border p-4 text-center" style={{ background: G.greenDim, borderColor: G.green + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Kitabet Completion Status</div>
        <div className="flex items-center justify-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: G.green }} />
          <span className="font-inter text-sm font-bold" style={{ color: G.green }}>All Letters Used — No Remainder</span>
        </div>
        <div className="text-[7px] mt-2" style={{ color: G.dim }}>All {safe.allExpanded.length} expanded letters formed {safe.groups.length} complete names</div>
      </div>
      
      {/* Kitabet Total Calculation — PDF Style */}
      <div className="mb-6 rounded-lg border p-5" style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>Esma-i Kitabet Total Calculation (PDF Method)</div>
        
        {/* Three Components */}
        <div className="space-y-3 mb-4">
          {/* Last Name B1 */}
          <div className="rounded-lg border p-3" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[7px] mb-1" style={{ color: G.dim }}>Last Kitabet Name (Birinci Bast)</div>
                <div className="font-amiri text-xl font-bold" style={{ color: G.gold }} dir="rtl">{lastGroupName}</div>
              </div>
              <div className="text-right">
                <div className="text-[7px] mb-1" style={{ color: G.dim }}>Value</div>
                <div className="text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{lastNameB1.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          {/* Dominant Element B1 */}
          <div className="rounded-lg border p-3" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[7px] mb-1" style={{ color: G.dim }}>Dominant Element Letters (Birinci Bast)</div>
                <div className="font-inter text-sm font-bold" style={{ color: elementMeta.color }}>{elementMeta.arabic} ({dominant})</div>
              </div>
              <div className="text-right">
                <div className="text-[7px] mb-1" style={{ color: G.dim }}>Value</div>
                <div className="text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{dominantB1.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          {/* Mizanül Mevazin */}
          <div className="rounded-lg border p-3" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[7px] mb-1" style={{ color: G.dim }}>Nine Mizan Total (Mizanül Mevazin)</div>
                <div className="font-inter text-sm font-bold" style={{ color: G.goldDim }}>From 9 Mizan Calculation</div>
              </div>
              <div className="text-right">
                <div className="text-[7px] mb-1" style={{ color: G.dim }}>Value</div>
                <div className="text-2xl font-bold tabular-nums" style={{ color: G.gold }}>{mizanulMevazin.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sum Formula */}
        <div className="rounded-xl border p-4 text-center" style={{ background: G.bg, borderColor: elementMeta.color }}>
          <div className="flex items-center justify-center gap-3 text-xl font-bold">
            <span className="tabular-nums" style={{ color: elementMeta.color }}>{lastNameB1.toLocaleString()}</span>
            <span style={{ color: G.goldDim }}>+</span>
            <span className="tabular-nums" style={{ color: elementMeta.color }}>{dominantB1.toLocaleString()}</span>
            <span style={{ color: G.goldDim }}>+</span>
            <span className="tabular-nums" style={{ color: G.gold }}>{mizanulMevazin.toLocaleString()}</span>
            <span style={{ color: G.goldDim }}>=</span>
            <span className="tabular-nums text-3xl" style={{ color: G.gold }}>{calcTotal.toLocaleString()}</span>
          </div>
          <div className="text-[7px] mt-2" style={{ color: G.dim }}>Last Name B1 + Dominant B1 + Mizanül Mevazin = Kitabet Total</div>
        </div>
      </div>
      
      {/* Seed Letters for A'van Stage */}
      <div className="rounded-lg border p-5" style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-3 text-center" style={{ color: G.dim }}>
          Istintaq of Kitabet Total → Seed Letters for Esma-i A'van
        </div>
        
        {/* Calculation */}
        <div className="mb-4 text-center">
          <div className="text-[7px] mb-2" style={{ color: G.dim }}>Kitabet Total: <span className="font-bold tabular-nums" style={{ color: G.gold }}>{calcTotal.toLocaleString()}</span></div>
          <div className="text-[7px]" style={{ color: G.dim }}>Istintaq → {avanSeedLetters.length} Letters</div>
        </div>
        
        {/* Letters with Names */}
        <div className="grid grid-cols-6 gap-2 mb-3">
          {avanSeedLetters.map((letter, idx) => (
            <div key={idx} className="rounded-lg border p-2 text-center" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
              <span className="font-amiri text-3xl font-bold block mb-1" style={{ color: G.gold }} dir="rtl">{letter}</span>
              <span className="font-inter text-[8px] font-bold" style={{ color: G.dim }}>{arabicLetterNames[letter] || letter}</span>
            </div>
          ))}
        </div>
        
        {/* Letter Names Line */}
        <div className="text-center pt-3 border-t" style={{ borderColor: G.goldBorder + "40" }}>
          <div className="font-inter text-[7px] mb-1" style={{ color: G.dim }}>Seed Letters (A'van Stage Input):</div>
          <div className="font-inter text-sm font-bold" style={{ color: G.gold }}>
            {avanSeedLetters.map((l, i) => arabicLetterNames[l] || l).join(' – ')}
          </div>
        </div>
        
        <div className="text-[6px] mt-3 text-center" style={{ color: G.dim }}>
          These {avanSeedLetters.length} letters will be used for Esma-i A'van calculations
        </div>
      </div>
    </Card>
  );
}

function EsmaAvanSection({ avanData, kitabetData, dominant, getBastLevelFn, kitabetTotal, mizanulMevazin, dominantB1, lastKitabetNameB1 }) {
  if (!avanData) return null;
  const safe = {
    seedLetters: Array.isArray(avanData.seedLetters) ? avanData.seedLetters : [],
    allExpanded: Array.isArray(avanData.allExpandedLetters) ? avanData.allExpandedLetters : [],
    groups: Array.isArray(avanData.groups) ? avanData.groups : [],
    remainder: Array.isArray(avanData.remainder) ? avanData.remainder : [],
    derivations: Array.isArray(avanData.derivations) ? avanData.derivations : [],
  };
  const elementMeta = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;
  
  // Get Anasir letters for dominant element
  const ANASIR_LETTERS = {
    fire: ['ا', 'ه', 'ح', 'ط', 'م', 'ف', 'ش'],
    earth: ['ب', 'و', 'خ', 'ي', 'ن', 'ص', 'د'],
    air: ['ج', 'ز', 'ك', 'ل', 'ق', 'ر', 'ت'],
    water: ['د', 'ع', 'ذ', 'غ', 'س', 'ث', 'ظ'],
  };
  const anasirLetters = ANASIR_LETTERS[dominant] || ANASIR_LETTERS.fire;
  
  // PDF: Grand Total already calculated in engine
  const grandTotal = avanData.grandTotal || 0;
  const avanSeedLetters = avanData.seedLetters || [];
  const avanSeedCount = avanSeedLetters.length;
  const isFerd = avanSeedCount % 2 !== 0;
  const bastLevel = isFerd ? 5 : 4;
  const avanCalcTotal = avanData.total || 0;
  const kasemSeedLetters = istintak(avanCalcTotal);
  
  const arabicLetterNames = {
    'د': 'Dal', 'ع': 'Ayn', 'ذ': 'Zel', 'غ': 'Ğayın', 'ج': 'Cim', 'ك': 'Kaf',
    'ا': 'Elif', 'ب': 'Be', 'ت': 'Te', 'ث': 'Se', 'ح': 'Hı', 'خ': 'Ha',
    'ر': 'Ra', 'ز': 'Ze', 'س': 'Sin', 'ش': 'Şın', 'ص': 'Sat',
    'ض': 'Dat', 'ط': 'Tı', 'ظ': 'Zı', 'ف': 'Fe', 'ق': 'Kaf', 'ل': 'Lam',
    'م': 'Mim', 'ن': 'Nun', 'و': 'Vav', 'ه': 'He', 'ي': 'Ye'
  };
  
  // Combined letters for Bast calculations (remainder from Kitabet + Anasir)
  const kitabetRemainder = Array.isArray(kitabetData?.remainder) ? kitabetData.remainder : [];
  const avanCombinedLetters = [...kitabetRemainder, ...anasirLetters];
  
  // Calculate values for display
  const anasirB1 = anasirLetters.reduce((s, l) => s + (getBastLevelFn(l, 1) || 0), 0);
  const remainderB1 = safe.remainder.reduce((s, l) => s + (getBastLevelFn(l, 1) || 0), 0);
  const lastKitabetName = kitabetData?.lastCompletedName || '';

  return (
    <Card accent={elementMeta.color}>
      <SectionHeader step="2" label="Esma-i A'van" arabic="أسماء الأعوان" color={elementMeta.color} />
      
      {/* STEP 1: Three Components for A'van Total (PDF Algorithm) */}
      <div className="mb-6 rounded-lg border p-5" style={{ background: G.bgCard, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>Step 1 — Esma-i A'van Total Calculation (PDF Method)</div>
        
        {/* Component 1: Last Kitabet Name B1 */}
        <div className="mb-4 rounded-lg border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
          <div className="text-[7px] mb-2" style={{ color: G.dim }}>1. Last Esma-i Kitabet Name (Birinci Bast)</div>
          <div className="flex items-center justify-between">
            <div className="font-amiri text-3xl font-bold" style={{ color: G.gold }} dir="rtl">{lastKitabetName}</div>
            <div className="text-right">
              <div className="text-[6px]" style={{ color: G.dim }}>B1 Value</div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{lastKitabetNameB1.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        {/* Component 2: Dominant Anasir B1 */}
        <div className="mb-4 rounded-lg border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
          <div className="text-[7px] mb-2" style={{ color: G.dim }}>2. Dominant Anasir Letters (Birinci Bast)</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-amiri text-xl" style={{ color: elementMeta.color }}>{elementMeta.arabic}</span>
              <span className="font-inter text-xs" style={{ color: G.dim }}>({dominant})</span>
            </div>
            <div className="text-right">
              <div className="text-[6px]" style={{ color: G.dim }}>B1 Value</div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{anasirB1.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-2">
            <LetterRow letters={anasirLetters} color={elementMeta.color} size="sm" rtl />
          </div>
        </div>
        
        {/* Component 3: Nine Mizan Total */}
        <div className="mb-4 rounded-lg border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
          <div className="text-[7px] mb-2" style={{ color: G.dim }}>3. Nine Mizan Total (Mizanül Mevazin)</div>
          <div className="text-3xl font-bold tabular-nums" style={{ color: G.gold }}>{mizanulMevazin.toLocaleString()}</div>
        </div>
        
        {/* Grand Total Formula */}
        <div className="rounded-xl border p-5 text-center" style={{ background: G.bg, borderColor: elementMeta.color }}>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xl font-bold">
            <span className="tabular-nums" style={{ color: elementMeta.color }}>{lastKitabetNameB1.toLocaleString()}</span>
            <span style={{ color: G.goldDim }}>+</span>
            <span className="tabular-nums" style={{ color: elementMeta.color }}>{anasirB1.toLocaleString()}</span>
            <span style={{ color: G.goldDim }}>+</span>
            <span className="tabular-nums" style={{ color: G.gold }}>{mizanulMevazin.toLocaleString()}</span>
            <span style={{ color: G.goldDim }}>=</span>
            <span className="tabular-nums text-4xl" style={{ color: G.gold }}>{grandTotal.toLocaleString()}</span>
          </div>
          <div className="text-[7px] mt-3" style={{ color: G.dim }}>Last Kitabet Name B1 + Dominant Anasir B1 + Nine Mizan Total = Grand Total</div>
        </div>
      </div>
      
      {/* STEP 2: Istintaq of Grand Total → Seed Letters */}
      <div className="mb-6 rounded-lg border p-5" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>Step 2 — Istintaq of Grand Total → Seed Letters</div>
        <div className="text-center mb-3">
          <div className="text-[7px]" style={{ color: G.dim }}>Grand Total: <span className="font-bold tabular-nums" style={{ color: G.gold }}>{grandTotal.toLocaleString()}</span></div>
          <div className="text-[7px]" style={{ color: G.dim }}>Istintaq → {avanSeedCount} Letters</div>
        </div>
        <LetterRow letters={avanSeedLetters} color={elementMeta.color} size="xl" rtl />
        <div className="text-center mt-3">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border" style={{ background: G.bg, borderColor: elementMeta.color + "55" }}>
            <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>Letter Count</span>
            <span className="font-inter text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{avanSeedCount}</span>
          </div>
          <div className="text-[7px] mt-2" style={{ color: G.dim }}>
            {isFerd ? (
              <span style={{ color: G.red, fontWeight: "bold" }}>FERD (فرد) — ODD → Use 5th Bast</span>
            ) : (
              <span style={{ color: G.green, fontWeight: "bold" }}>ZEVC (زوج) — EVEN → Use 4th Bast</span>
            )}
          </div>
        </div>
      </div>
      
      {/* STEP 2: Individual Bast Calculations — EVERY LETTER */}
      <div className="mb-6 rounded-lg border p-5" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>
          Step 2 — Individual {bastLevel}th Bast Calculations (Every Letter)
        </div>
        <div className="space-y-3">
          {avanCombinedLetters.map((letter, idx) => {
            const bastValue = getBastLevelFn(letter, bastLevel) || 0;
            const expanded = istintak(bastValue);
            return (
              <IndividualLetterDerivation
                key={idx}
                derivation={{ originalLetter: letter, bastValue, expandedLetters: expanded, bastLevel }}
                idx={idx}
                totalLetters={avanCombinedLetters.length}
                elementColor={elementMeta.color}
                bastLevel={bastLevel}
              />
            );
          })}
        </div>
      </div>
      
      {/* STEP 3: All Expanded Letters Merged */}
      {(() => {
        const allExpanded = avanCombinedLetters.flatMap(l => istintak(getBastLevelFn(l, bastLevel) || 0));
        const expandedCount = allExpanded.length;
        const isExpandedFerd = expandedCount % 2 !== 0;
        const groupSize = isExpandedFerd ? 5 : 4;
        const remainder = expandedCount % groupSize;
        const groups = [];
        for (let i = 0; i < expandedCount - remainder; i += groupSize) {
          const groupLetters = allExpanded.slice(i, i + groupSize);
          groups.push({ letters: groupLetters, name: groupLetters.join(''), groupNumber: Math.floor(i / groupSize) + 1 });
        }
        const remainderLetters = remainder > 0 ? allExpanded.slice(expandedCount - remainder) : [];
        
        return (
          <>
            <div className="mb-6 rounded-lg border p-5" style={{ background: G.bgCard, borderColor: elementMeta.color + "55" }}>
              <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>Step 3 — All Expanded Letters Merged</div>
              <LetterRow letters={allExpanded} color={G.gold} size="lg" rtl showIndex />
              <div className="text-center mt-3">
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border" style={{ background: G.bg, borderColor: elementMeta.color + "55" }}>
                  <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>Total Expanded Letters</span>
                  <span className="font-inter text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{expandedCount}</span>
                </div>
                <div className="text-[7px] mt-2" style={{ color: G.dim }}>
                  {isExpandedFerd ? (
                    <span style={{ color: G.red, fontWeight: "bold" }}>FERD (فرد) — Group by 5 letters</span>
                  ) : (
                    <span style={{ color: G.green, fontWeight: "bold" }}>ZEVC (زوج) — Group by 4 letters</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* STEP 4: Group Formation → Esma-i A'van Names */}
            <div className="mb-6 rounded-lg border p-5" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
              <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>Step 4 — Group Formation → Esma-i A'van Names</div>
              <div className="space-y-3 mb-4">
                {groups.map((group, idx) => (
                  <div key={idx} className="rounded-lg border p-4" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg font-inter text-sm font-black" style={{ background: elementMeta.color + "22", border: `1px solid ${elementMeta.color}55`, color: elementMeta.color }}>
                        {group.groupNumber}
                      </div>
                      <div className="flex-1">
                        <div className="text-[7px] mb-2" style={{ color: G.dim }}>Letters:</div>
                        <LetterRow letters={group.letters} color={G.gold} size="lg" rtl />
                      </div>
                      <div className="flex items-center gap-3">
                        <Arrow label="→" />
                        <div className="text-right">
                          <div className="text-[7px] mb-1" style={{ color: G.dim }}>Name {group.groupNumber}</div>
                          <div className="font-amiri text-3xl font-bold px-4 py-2 rounded-lg border" style={{ color: G.gold, borderColor: G.goldBorder, background: G.bg }} dir="rtl">{group.name}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border" style={{ background: G.bgInner, borderColor: G.goldBorder }}>
                  <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Total A'van Names</span>
                  <span className="font-inter text-lg font-bold" style={{ color: G.gold }}>{groups.length}</span>
                </div>
              </div>
            </div>
            
            {/* STEP 5: Remainder for Next Stage */}
            {remainderLetters.length > 0 && (
              <div className="mb-6 rounded-lg border p-5" style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
                <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>Step 5 — Remaining Letters (Carry to Kasem Stage)</div>
                <LetterRow letters={remainderLetters} color={G.goldDim} size="xl" rtl />
                <div className="text-center mt-3">
                  <div className="text-[7px]" style={{ color: G.dim }}>Remaining: <span style={{ color: G.gold, fontWeight: "bold" }}>{remainderLetters.length} letters</span></div>
                  <div className="text-[6px]" style={{ color: G.dim }}>These letters will be combined with Anasir letters for Esma-i Kasem</div>
                </div>
              </div>
            )}
          </>
        );
      })()}
      
      {/* A'van Total Calculation — PDF Style */}
      <div className="mb-6 rounded-lg border p-5" style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>Esma-i A'van Total Calculation (PDF Method)</div>
        
        {/* Three Components */}
        <div className="space-y-3 mb-4">
          {/* Remainder B1 */}
          <div className="rounded-lg border p-3" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[7px] mb-1" style={{ color: G.dim }}>Remaining Letters (Birinci Bast)</div>
                <div className="flex gap-2 mt-1">
                  {safe.remainder.map((l, i) => (
                    <span key={i} className="font-amiri text-xl font-bold" style={{ color: elementMeta.color }} dir="rtl">{l}</span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[7px] mb-1" style={{ color: G.dim }}>Value</div>
                <div className="text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{remainderB1.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          {/* Dominant Element B1 */}
          <div className="rounded-lg border p-3" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[7px] mb-1" style={{ color: G.dim }}>Dominant Element Letters (Birinci Bast)</div>
                <div className="font-inter text-sm font-bold" style={{ color: elementMeta.color }}>{elementMeta.arabic} ({dominant})</div>
              </div>
              <div className="text-right">
                <div className="text-[7px] mb-1" style={{ color: G.dim }}>Value</div>
                <div className="text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{dominantB1.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          {/* Nine Mizan + Kitabet Total */}
          <div className="rounded-lg border p-3" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[7px] mb-1" style={{ color: G.dim }}>Nine Mizan + Esma-i Kitabet Total</div>
                <div className="font-inter text-sm font-bold" style={{ color: G.goldDim }}>From Previous Calculation</div>
              </div>
              <div className="text-right">
                <div className="text-[7px] mb-1" style={{ color: G.dim }}>Value</div>
                <div className="text-2xl font-bold tabular-nums" style={{ color: G.gold }}>{kitabetTotal.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sum Formula */}
        <div className="rounded-xl border p-4 text-center" style={{ background: G.bg, borderColor: elementMeta.color }}>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-3 text-xl font-bold">
              <span className="tabular-nums" style={{ color: elementMeta.color }}>{remainderB1.toLocaleString()}</span>
              <span style={{ color: G.goldDim }}>+</span>
              <span className="tabular-nums" style={{ color: elementMeta.color }}>{dominantB1.toLocaleString()}</span>
              <span style={{ color: G.goldDim }}>+</span>
              <span className="tabular-nums" style={{ color: G.gold }}>{kitabetTotal.toLocaleString()}</span>
              <span style={{ color: G.goldDim }}>=</span>
              <span className="tabular-nums text-3xl" style={{ color: G.gold }}>{avanCalcTotal.toLocaleString()}</span>
            </div>
            <div className="text-[7px]" style={{ color: G.dim }}>Remainder B1 + Dominant B1 + Kitabet Total = A'van Total</div>
          </div>
        </div>
      </div>
      
      {/* Seed Letters for Kasem Stage */}
      <div className="mb-6 rounded-lg border p-5" style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-3 text-center" style={{ color: G.dim }}>
          Istintaq of A'van Total → Seed Letters for Esma-i Kasem
        </div>
        
        {/* Calculation */}
        <div className="mb-4 text-center">
          <div className="text-[7px] mb-2" style={{ color: G.dim }}>A'van Total: <span className="font-bold tabular-nums" style={{ color: G.gold }}>{avanCalcTotal.toLocaleString()}</span></div>
          <div className="text-[7px]" style={{ color: G.dim }}>Istintaq → {kasemSeedLetters.length} Letters</div>
        </div>
        
        {/* Letters with Names */}
        <div className="grid grid-cols-6 gap-2 mb-3">
          {kasemSeedLetters.map((letter, idx) => (
            <div key={idx} className="rounded-lg border p-2 text-center" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
              <span className="font-amiri text-3xl font-bold block mb-1" style={{ color: G.gold }} dir="rtl">{letter}</span>
              <span className="font-inter text-[8px] font-bold" style={{ color: G.dim }}>{arabicLetterNames[letter] || letter}</span>
            </div>
          ))}
        </div>
        
        {/* Letter Names Line */}
        <div className="text-center pt-3 border-t" style={{ borderColor: G.goldBorder + "40" }}>
          <div className="font-inter text-[7px] mb-1" style={{ color: G.dim }}>Seed Letters (Kasem Stage Input):</div>
          <div className="font-inter text-sm font-bold" style={{ color: G.gold }}>
            {kasemSeedLetters.map((l, i) => arabicLetterNames[l] || l).join(' – ')}
          </div>
        </div>
        
        {/* Ferd/Zevc Detection */}
        <div className="mt-4 rounded-lg border p-3 text-center" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
          <div className="text-[7px] mb-2" style={{ color: G.dim }}>Letter Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{kasemSeedLetters.length}</span></div>
          <div className={`text-sm font-bold ${kasemSeedLetters.length % 2 !== 0 ? 'text-red-400' : 'text-green-400'}`}>
            {kasemSeedLetters.length % 2 !== 0 ? 'FERD (فرد) → Use 5th Bast' : 'ZEVC (زوج) → Use 4th Bast'}
          </div>
        </div>
        
        <div className="text-[6px] mt-3 text-center" style={{ color: G.dim }}>
          These {kasemSeedLetters.length} letters will be used for Esma-i Kasem calculations
        </div>
      </div>
      
      {/* Individual 5th Bast Derivations — EVERY LETTER */}
      <div className="mb-6">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>
          Individual 5th Bast Calculations — Every Letter (PDF Method)
        </div>
        <div className="space-y-3">
          {safe.derivations.map((d, idx) => (
            <div key={idx} className="rounded-xl border p-4" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg font-inter text-sm font-black" style={{ background: elementMeta.color + "22", border: `1px solid ${elementMeta.color}55`, color: elementMeta.color }}>
                  {idx + 1}
                </div>
                <span className="font-inter text-xs font-bold" style={{ color: G.dim }}>Letter {idx + 1} of {safe.derivations.length}</span>
              </div>
              
              {/* Step 1: Original Letter */}
              <div className="mb-3 pb-3 border-b" style={{ borderColor: G.goldBorder + "30" }}>
                <div className="text-[7px] mb-2" style={{ color: G.dim }}>Original Letter (from Seed)</div>
                <LetterCell letter={d.originalLetter} color={elementMeta.color} size="xl" />
              </div>
              
              {/* Step 2: 5th Bast Value */}
              <div className="mb-3 pb-3 border-b" style={{ borderColor: G.goldBorder + "30" }}>
                <div className="text-[7px] mb-2" style={{ color: G.dim }}>5th Bast Value</div>
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg border" style={{ background: G.bgInner, borderColor: G.green + "55" }}>
                  <span className="font-inter text-xs" style={{ color: G.dim }}>Bast Level 5:</span>
                  <span className="font-inter text-xl font-bold tabular-nums" style={{ color: G.green }}>{d.bastValue.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Step 3: Istintaq */}
              <div className="mb-3 pb-3 border-b" style={{ borderColor: G.goldBorder + "30" }}>
                <div className="text-[7px] mb-2" style={{ color: G.dim }}>Istintaq of {d.bastValue.toLocaleString()}</div>
                <div className="flex items-center gap-2">
                  <span className="font-inter text-xs" style={{ color: G.dim }}>→</span>
                  <div className="flex gap-2">
                    {Array.isArray(d.expandedLetters) && d.expandedLetters.map((l, i) => (
                      <LetterCell key={i} letter={l} color={G.green} size="lg" />
                    ))}
                  </div>
                </div>
                <div className="text-[6px] mt-2" style={{ color: G.dim }}>Expanded: {d.expandedLetters?.length || 0} letters</div>
              </div>
              
              {/* Step 4: Expanded Letters Display */}
              <div>
                <div className="text-[7px] mb-2" style={{ color: G.dim }}>All Expanded Letters from This Letter</div>
                <div className="flex flex-wrap gap-2" style={{ direction: "rtl" }}>
                  {Array.isArray(d.expandedLetters) && d.expandedLetters.map((l, i) => (
                    <div key={i} className="rounded-lg border p-2 text-center" style={{ background: G.bgInner, borderColor: G.goldBorder + "50" }}>
                      <span className="font-amiri text-2xl font-bold block" style={{ color: G.green }} dir="rtl">{l}</span>
                      <span className="font-inter text-[6px]" style={{ color: G.dim }}>#{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* All Expanded Letters Merged */}
      <div className="mb-6 rounded-lg border p-5" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-3 text-center" style={{ color: G.dim }}>All Expanded Letters Merged</div>
        <div className="mb-4">
          <LetterRow letters={safe.allExpanded} color={G.gold} size="lg" rtl showIndex />
        </div>
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border" style={{ background: G.bg, borderColor: elementMeta.color + "55" }}>
            <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>Total Letters</span>
            <span className="font-inter text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{safe.allExpanded.length}</span>
          </div>
          <div className="text-[7px] mt-2" style={{ color: G.dim }}>
            {safe.allExpanded.length % 2 !== 0 ? 'FERD (فرد) → Group by 5 letters' : 'ZEVC (زوج) → Group by 4 letters'}
          </div>
        </div>
      </div>
      
      {/* Group Formation — Kasem Names */}
      <div className="mb-6 rounded-lg border p-5" style={{ background: G.bgCard, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>Esma-i Kasem Names — Group Formation</div>
        <div className="space-y-3 mb-4">
          {safe.groups.map((group, idx) => (
            <div key={idx} className="rounded-lg border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg font-inter text-sm font-black" style={{ background: elementMeta.color + "22", border: `1px solid ${elementMeta.color}55`, color: elementMeta.color }}>
                  {group.groupNumber}
                </div>
                <div className="flex-1">
                  <div className="text-[7px] mb-2" style={{ color: G.dim }}>Letters:</div>
                  <LetterRow letters={Array.isArray(group.letters) ? group.letters : []} color={G.gold} size="lg" rtl />
                </div>
                <div className="flex items-center gap-3">
                  <Arrow label="→" />
                  <div className="text-right">
                    <div className="text-[7px] mb-1" style={{ color: G.dim }}>Name {group.groupNumber}</div>
                    <div className="font-amiri text-3xl font-bold px-4 py-2 rounded-lg border" style={{ color: G.gold, borderColor: G.goldBorder, background: G.bg }} dir="rtl">{group.name}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border" style={{ background: G.bgInner, borderColor: G.goldBorder }}>
            <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Total Names</span>
            <span className="font-inter text-lg font-bold" style={{ color: G.gold }}>{safe.groups.length}</span>
          </div>
        </div>
      </div>
      
      {/* Remainder + First Letters Completion */}
      {safe.remainder.length > 0 && safe.groups.length > 0 && (() => {
        // PDF: Take required letters from FIRST Kasem name to complete remainder
        const remainderCount = safe.remainder.length;
        const firstKasemName = safe.groups[0].name;
        const lettersNeeded = remainderCount === 1 ? 2 : remainderCount === 2 ? 2 : remainderCount === 3 ? 2 : 2;
        const firstLetters = firstKasemName.slice(0, lettersNeeded);
        const completedLetters = [...safe.remainder, ...firstLetters.split('')];
        const completedName = completedLetters.join('');
        
        return (
          <div className="mb-6 rounded-lg border p-5" style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
            <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>Remainder Completion (PDF Method)</div>
            
            <div className="space-y-4">
              {/* Remainder Letters */}
              <div className="rounded-lg border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
                <div className="text-[7px] mb-2" style={{ color: G.dim }}>Remaining Letters from Kasem Grouping:</div>
                <LetterRow letters={safe.remainder} color={G.goldDim} size="xl" rtl />
                <div className="text-[6px] mt-2" style={{ color: G.dim }}>{safe.remainder.length} letter{safe.remainder.length !== 1 ? 's' : ''}</div>
              </div>
              
              {/* First Letters from First Name */}
              <div className="rounded-lg border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
                <div className="text-[7px] mb-2" style={{ color: G.dim }}>First {lettersNeeded} Letters from First Kasem Name:</div>
                <div className="flex items-center gap-3">
                  <LetterRow letters={firstLetters.split('')} color={elementMeta.color} size="xl" rtl />
                  <span className="font-amiri text-xl font-bold" style={{ color: G.gold }} dir="rtl">{firstKasemName}</span>
                </div>
              </div>
              
              {/* Combination Arrow */}
              <div className="flex justify-center">
                <Arrow label="Combine" />
              </div>
              
              {/* Final Completed Name */}
              <div className="rounded-xl border p-5 text-center" style={{ background: G.bg, borderColor: elementMeta.color }}>
                <div className="text-[8px] mb-3" style={{ color: G.dim }}>Completed Final Kasem Name</div>
                <div className="font-amiri text-4xl font-bold" style={{ color: G.gold }} dir="rtl">{completedName}</div>
                <div className="text-[6px] mt-3" style={{ color: G.dim }}>Remainder ({safe.remainder.length}) + First {lettersNeeded} Letters = Final Name</div>
              </div>
            </div>
          </div>
        );
      })()}
      
      {/* A'van Total Summary */}
      <div className="rounded-lg border p-4 text-center" style={{ background: G.bg, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Esma-i A'van Total</div>
        <div className="text-3xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{avanCalcTotal.toLocaleString()}</div>
        <CollapsibleSource title="Complete Formula Breakdown">
          <div className="text-[6px] space-y-1 pt-2">
            <div>Remainder from Kitabet: {safe.remainder.length} letters</div>
            <div>Remainder B1 (First Bast): {remainderB1.toLocaleString()}</div>
            <div>Dominant Element B1 ({dominant}): {dominantB1.toLocaleString()}</div>
            <div>Kitabet Total: {kitabetTotal.toLocaleString()}</div>
            <div className="font-bold pt-1 border-t" style={{ borderColor: G.goldBorder + "40" }}>
              Formula: {remainderB1.toLocaleString()} + {dominantB1.toLocaleString()} + {kitabetTotal.toLocaleString()} = {avanCalcTotal.toLocaleString()}
            </div>
          </div>
        </CollapsibleSource>
      </div>
      
      {/* Esma-i Kasem Completed Notice */}
      <div className="mt-6 rounded-xl border p-5 text-center" style={{ background: G.greenDim, borderColor: G.green + "55" }}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-3 h-3 rounded-full" style={{ background: G.green }} />
          <span className="font-inter text-sm font-bold" style={{ color: G.green }}>Esma-i Kasem Completed</span>
        </div>
        <div className="text-[7px]" style={{ color: G.dim }}>All names generated with remainder properly handled</div>
      </div>
    </Card>
  );
}

function EsmaKasemSection({ kasemData, avanData, dominant, getBastLevelFn, kitabetTotal, mizanulMevazin, dominantB1, lastAvanNameB1 }) {
  if (!kasemData) return null;
  const safe = {
    seedLetters: Array.isArray(kasemData.seedLetters) ? kasemData.seedLetters : [],
    allExpanded: Array.isArray(kasemData.allExpandedLetters) ? kasemData.allExpandedLetters : [],
    groups: Array.isArray(kasemData.groups) ? kasemData.groups : [],
    remainder: Array.isArray(kasemData.remainder) ? kasemData.remainder : [],
    derivations: Array.isArray(kasemData.derivations) ? kasemData.derivations : [],
  };
  const elementMeta = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;
  
  // Get Anasir letters for dominant element
  const ANASIR_LETTERS = {
    fire: ['ا', 'ه', 'ح', 'ط', 'م', 'ف', 'ش'],
    earth: ['ب', 'و', 'خ', 'ي', 'ن', 'ص', 'د'],
    air: ['ج', 'ز', 'ك', 'ل', 'ق', 'ر', 'ت'],
    water: ['د', 'ع', 'ذ', 'غ', 'س', 'ث', 'ظ'],
  };
  const anasirLetters = ANASIR_LETTERS[dominant] || ANASIR_LETTERS.fire;
  
  // Calculate values FIRST before using them
  const anasirB1 = anasirLetters.reduce((s, l) => s + (getBastLevelFn(l, 1) || 0), 0);
  const lastAvanName = avanData?.lastCompletedName || '';
  const combinedMizanKitabet = mizanulMevazin + kitabetTotal;
  
  // PDF: Grand Total = Last Avan Name B1 + Dominant Anasir B1 + (Nine Mizan + Kitabet Total)
  const grandTotal = lastAvanNameB1 + anasirB1 + combinedMizanKitabet;
  const kasemSeedLetters = kasemData.seedLetters || [];
  const kasemSeedCount = kasemSeedLetters.length;
  const isFerd = kasemSeedCount % 2 !== 0;
  const bastLevel = isFerd ? 5 : 4;
  
  const arabicLetterNames = {
    'د': 'Dal', 'ع': 'Ayn', 'ذ': 'Zel', 'غ': 'Ğayın', 'ج': 'Cim', 'ك': 'Kaf',
    'ا': 'Elif', 'ب': 'Be', 'ت': 'Te', 'ث': 'Se', 'ح': 'Hı', 'خ': 'Ha',
    'ر': 'Ra', 'ز': 'Ze', 'س': 'Sin', 'ش': 'Şın', 'ص': 'Sat',
    'ض': 'Dat', 'ط': 'Tı', 'ظ': 'Zı', 'ف': 'Fe', 'ق': 'Kaf', 'ل': 'Lam',
    'م': 'Mim', 'ن': 'Nun', 'و': 'Vav', 'ه': 'He', 'ي': 'Ye'
  };
  
  // Combined letters for Bast calculations (remainder from Avan + Anasir)
  const avanRemainder = Array.isArray(avanData?.remainder) ? avanData.remainder : [];
  const kasemCombinedLetters = [...avanRemainder, ...anasirLetters];

  return (
    <Card accent={elementMeta.color}>
      <SectionHeader step="3" label="Esma-i Kasem" arabic="أسماء القسم" color={elementMeta.color} />
      
      {/* STEP 1: Three Components for Kasem Total (PDF Algorithm) */}
      <div className="mb-6 rounded-lg border p-5" style={{ background: G.bgCard, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>Step 1 — Esma-i Kasem Total Calculation (PDF Method)</div>
        
        {/* Component 1: Last A'van Name B1 (Completed with Remainder if exists) */}
        <div className="mb-4 rounded-lg border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
          <div className="text-[7px] mb-2" style={{ color: G.dim }}>1. Last Esma-i A'van Name (Birinci Bast)</div>
          <div className="flex items-center justify-between">
            <div className="font-amiri text-3xl font-bold" style={{ color: G.gold }} dir="rtl">{lastAvanName}</div>
            <div className="text-right">
              <div className="text-[6px]" style={{ color: G.dim }}>B1 Value</div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{lastAvanNameB1.toLocaleString()}</div>
            </div>
          </div>
          <div className="text-[6px] mt-2" style={{ color: G.dim }}>
            {lastAvanName.length} letter{lastAvanName.length !== 1 ? 's' : ''} — Completed with remainder if exists
          </div>
        </div>
        
        {/* Component 2: Dominant Anasir B1 */}
        <div className="mb-4 rounded-lg border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
          <div className="text-[7px] mb-2" style={{ color: G.dim }}>2. Dominant Anasir Letters (Birinci Bast)</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-amiri text-xl" style={{ color: elementMeta.color }}>{elementMeta.arabic}</span>
              <span className="font-inter text-xs" style={{ color: G.dim }}>({dominant})</span>
            </div>
            <div className="text-right">
              <div className="text-[6px]" style={{ color: G.dim }}>B1 Value</div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{anasirB1.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-2">
            <LetterRow letters={anasirLetters} color={elementMeta.color} size="sm" rtl />
          </div>
        </div>
        
        {/* Component 3: Nine Mizan + Kitabet Total (Combined) */}
        <div className="mb-4 rounded-lg border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
          <div className="text-[7px] mb-2" style={{ color: G.dim }}>3. Nine Mizan + Esma-i Kitabet Total</div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="text-sm" style={{ color: G.dim }}>Nine Mizan:</div>
            <div className="text-lg font-bold tabular-nums" style={{ color: G.goldDim }}>{mizanulMevazin.toLocaleString()}</div>
            <div className="text-sm" style={{ color: G.dim }}>+</div>
            <div className="text-sm" style={{ color: G.dim }}>Kitabet:</div>
            <div className="text-lg font-bold tabular-nums" style={{ color: G.goldDim }}>{kitabetTotal.toLocaleString()}</div>
            <div className="text-sm" style={{ color: G.dim }}>=</div>
            <div className="text-xl font-bold tabular-nums" style={{ color: G.gold }}>{(mizanulMevazin + kitabetTotal).toLocaleString()}</div>
          </div>
          <div className="text-[6px] mt-2 text-center" style={{ color: G.dim }}>Combined value for Kasem calculation</div>
        </div>
        
        {/* Grand Total Formula */}
        <div className="rounded-xl border p-5 text-center" style={{ background: G.bg, borderColor: elementMeta.color }}>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xl font-bold">
            <span className="tabular-nums" style={{ color: elementMeta.color }}>{lastAvanNameB1.toLocaleString()}</span>
            <span style={{ color: G.goldDim }}>+</span>
            <span className="tabular-nums" style={{ color: elementMeta.color }}>{anasirB1.toLocaleString()}</span>
            <span style={{ color: G.goldDim }}>+</span>
            <span className="tabular-nums" style={{ color: G.gold }}>{(mizanulMevazin + kitabetTotal).toLocaleString()}</span>
            <span style={{ color: G.goldDim }}>=</span>
            <span className="tabular-nums text-4xl" style={{ color: G.gold }}>{grandTotal.toLocaleString()}</span>
          </div>
          <div className="text-[7px] mt-3" style={{ color: G.dim }}>Last A'van Name B1 + Anasir B1 + (Nine Mizan + Kitabet) = Grand Total</div>
        </div>
      </div>
      
      {/* STEP 2: Istintaq of Grand Total → Seed Letters */}
      <div className="mb-6 rounded-lg border p-5" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>Step 2 — Istintaq of Grand Total → Seed Letters</div>
        <div className="text-center mb-3">
          <div className="text-[7px]" style={{ color: G.dim }}>Grand Total: <span className="font-bold tabular-nums" style={{ color: G.gold }}>{grandTotal.toLocaleString()}</span></div>
          <div className="text-[7px]" style={{ color: G.dim }}>Istintaq → {kasemSeedCount} Letters</div>
        </div>
        <LetterRow letters={kasemSeedLetters} color={elementMeta.color} size="xl" rtl />
        <div className="text-center mt-3">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border" style={{ background: G.bg, borderColor: elementMeta.color + "55" }}>
            <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>Letter Count</span>
            <span className="font-inter text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{kasemSeedCount}</span>
          </div>
          <div className="text-[7px] mt-2" style={{ color: G.dim }}>
            {isFerd ? (
              <span style={{ color: G.red, fontWeight: "bold" }}>FERD (فرد) — ODD → Use 5th Bast</span>
            ) : (
              <span style={{ color: G.green, fontWeight: "bold" }}>ZEVC (زوج) — EVEN → Use 4th Bast</span>
            )}
          </div>
        </div>
      </div>
      
      {/* STEP 2: Individual Bast Calculations — EVERY LETTER */}
      <div className="mb-6 rounded-lg border p-5" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>
          Step 2 — Individual {bastLevel}th Bast Calculations (Every Letter)
        </div>
        <div className="space-y-3">
          {kasemCombinedLetters.map((letter, idx) => {
            const bastValue = getBastLevelFn(letter, bastLevel) || 0;
            const expanded = istintak(bastValue);
            return (
              <IndividualLetterDerivation
                key={idx}
                derivation={{ originalLetter: letter, bastValue, expandedLetters: expanded, bastLevel }}
                idx={idx}
                totalLetters={kasemCombinedLetters.length}
                elementColor={elementMeta.color}
                bastLevel={bastLevel}
              />
            );
          })}
        </div>
      </div>
      
      {/* STEP 3-5: All Expanded Letters, Group Formation, Remainder */}
      {(() => {
        const allExpanded = kasemCombinedLetters.flatMap(l => istintak(getBastLevelFn(l, bastLevel) || 0));
        const expandedCount = allExpanded.length;
        const isExpandedFerd = expandedCount % 2 !== 0;
        const groupSize = isExpandedFerd ? 5 : 4;
        const remainder = expandedCount % groupSize;
        const groups = [];
        for (let i = 0; i < expandedCount - remainder; i += groupSize) {
          const groupLetters = allExpanded.slice(i, i + groupSize);
          groups.push({ letters: groupLetters, name: groupLetters.join(''), groupNumber: Math.floor(i / groupSize) + 1 });
        }
        const remainderLetters = remainder > 0 ? allExpanded.slice(expandedCount - remainder) : [];
        
        return (
          <>
            <div className="mb-6 rounded-lg border p-5" style={{ background: G.bgCard, borderColor: elementMeta.color + "55" }}>
              <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>Step 3 — All Expanded Letters Merged</div>
              <LetterRow letters={allExpanded} color={G.gold} size="lg" rtl showIndex />
              <div className="text-center mt-3">
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border" style={{ background: G.bg, borderColor: elementMeta.color + "55" }}>
                  <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>Total Expanded Letters</span>
                  <span className="font-inter text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{expandedCount}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6 rounded-lg border p-5" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
              <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>Step 4 — Group Formation → Esma-i Kasem Names</div>
              <div className="space-y-3 mb-4">
                {groups.map((group, idx) => (
                  <div key={idx} className="rounded-lg border p-4" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg font-inter text-sm font-black" style={{ background: elementMeta.color + "22", border: `1px solid ${elementMeta.color}55`, color: elementMeta.color }}>
                        {group.groupNumber}
                      </div>
                      <div className="flex-1">
                        <div className="text-[7px] mb-2" style={{ color: G.dim }}>Letters:</div>
                        <LetterRow letters={group.letters} color={G.gold} size="lg" rtl />
                      </div>
                      <div className="flex items-center gap-3">
                        <Arrow label="→" />
                        <div className="text-right">
                          <div className="text-[7px] mb-1" style={{ color: G.dim }}>Name {group.groupNumber}</div>
                          <div className="font-amiri text-3xl font-bold px-4 py-2 rounded-lg border" style={{ color: G.gold, borderColor: G.goldBorder, background: G.bg }} dir="rtl">{group.name}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border" style={{ background: G.bgInner, borderColor: G.goldBorder }}>
                  <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Total Kasem Names</span>
                  <span className="font-inter text-lg font-bold" style={{ color: G.gold }}>{groups.length}</span>
                </div>
              </div>
            </div>
            
            {remainderLetters.length > 0 && (
              <div className="mb-6 rounded-lg border p-5" style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
                <div className="font-inter text-[8px] uppercase tracking-widest mb-4 text-center" style={{ color: G.dim }}>Step 5 — Remaining Letters (Final)</div>
                <LetterRow letters={remainderLetters} color={G.goldDim} size="xl" rtl />
                <div className="text-center mt-3">
                  <div className="text-[7px]" style={{ color: G.dim }}>Remaining: <span style={{ color: G.gold, fontWeight: "bold" }}>{remainderLetters.length} letters</span></div>
                </div>
              </div>
            )}
          </>
        );
      })()}
    </Card>
  );
}

function KeywordSubtractionSection({ title, arabic, baseTotal, keyword, keywordValue, adjustedTotal, istintaqLetters, baseName, remainder, finalName, dominant, stepLabel }) {
  const elementMeta = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;
  const safeLetters = Array.isArray(istintaqLetters) ? istintaqLetters : [];
  const safeRemainder = Array.isArray(remainder) ? remainder : [];

  return (
    <Card accent={G.gold}>
      <SectionHeader step={stepLabel} label={title} arabic={arabic} color={G.gold} />
      
      {/* Base Total */}
      <div className="mb-4 rounded-lg border p-3 text-center" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Base Total</div>
        <div className="text-2xl font-bold tabular-nums" style={{ color: G.gold }}>{baseTotal.toLocaleString()}</div>
      </div>

      {/* Keyword Subtraction Formula */}
      <div className="mb-4 rounded-lg border p-3" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2 text-center" style={{ color: G.dim }}>Keyword Subtraction (PDF Method)</div>
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center">
          <div className="space-y-1">
            <div className="text-[7px]" style={{ color: G.dim }}>Base Total</div>
            <div className="text-lg font-bold" style={{ color: G.gold }}>{baseTotal.toLocaleString()}</div>
          </div>
          <span className="font-inter text-base font-bold" style={{ color: G.goldDim }}>−</span>
          <div className="space-y-1">
            <div className="text-[7px]" style={{ color: G.dim }}>{keyword} ({keywordValue})</div>
            <div className="text-lg font-bold" style={{ color: G.red }}>{keywordValue.toLocaleString()}</div>
          </div>
          <span className="font-inter text-base font-bold" style={{ color: G.goldDim }}>=</span>
          <div className="space-y-1">
            <div className="text-[7px]" style={{ color: G.dim }}>Adjusted Total</div>
            <div className="text-lg font-bold" style={{ color: G.green }}>{adjustedTotal.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Istintaq of Adjusted Total */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Istintaq of Adjusted Total → Base Name Letters</div>
        <LetterRow letters={safeLetters} color={G.gold} size="xl" rtl />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>
          Base Name: <span className="font-amiri text-xl font-bold" style={{ color: G.gold }} dir="rtl">{baseName}</span>
        </div>
      </div>

      {/* Remainder Combination */}
      {safeRemainder.length > 0 && (
        <div className="mb-4 rounded-lg border p-3" style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
          <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Carry-Forward Remainder from Previous Stage</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[7px]" style={{ color: G.dim }}>Remainder ({safeRemainder.length}):</span>
            <LetterRow letters={safeRemainder} color={G.goldDim} size="sm" rtl />
            <span className="font-inter text-[7px]" style={{ color: G.dim }}>+ Base Name:</span>
            <LetterRow letters={safeLetters} color={G.gold} size="sm" rtl />
            <Arrow label="→" />
            <span className="font-amiri text-2xl font-bold px-4 py-2 rounded-lg border" style={{ color: G.gold, borderColor: G.goldBorder, background: G.bgInner }} dir="rtl">{finalName}</span>
          </div>
        </div>
      )}

      {/* Final Name */}
      <div className="rounded-lg border p-4 text-center" style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Final {title} Name</div>
        <div className="text-3xl font-amiri font-bold" style={{ color: G.gold }} dir="rtl">{finalName}</div>
        <div className="text-[6px] mt-2" style={{ color: G.dim }}>
          {safeRemainder.length > 0 
            ? `Base Name (${baseName}) + Remainder (${safeRemainder.length} letters)`
            : `Base Name only (${baseName})`}
        </div>
      </div>
    </Card>
  );
}

export default function Method2Pipeline({ grandBast, dominant, onVefkReady, getBastLevelFn = getBastLevel }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const mizanulMevazin = grandBast + grandBast.toString().length;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const pipelineResult = runMethod2Pipeline({ mizanulMevazin, dominant, getBastLevelFn });
      setResult(pipelineResult);
      setLoading(false);
      if (onVefkReady && pipelineResult?.divineNames) {
        onVefkReady({ 
          vefk: null, 
          source: pipelineResult.divineNames.sum, 
          names: [],
          divineNames: pipelineResult.divineNames,
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [mizanulMevazin, dominant, getBastLevelFn, onVefkReady]);

  if (loading) {
    return (
      <div className="rounded-2xl border p-8 text-center" style={{ background: G.bg, borderColor: G.goldBorder }}>
        <div className="w-12 h-12 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-inter text-sm" style={{ color: G.goldDim }}>Calculating Method 2 Pipeline…</p>
      </div>
    );
  }

  if (!result) return null;

  const elementMeta = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;
  const dominantB1 = getBastLevelFn(dominant, 1) || 0;

  return (
    <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
      className="rounded-2xl border overflow-hidden" style={{ background: G.bg, borderColor: G.goldBorderHi, boxShadow: `0 0 80px ${G.glow}, 0 0 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)` }}>
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
      <div className="text-center px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-3" style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>Method 2 — Adetlerin Bastı</span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <h2 className="font-amiri text-xl font-bold" style={{ color: G.gold, lineHeight: 1.7 }}>أعدادات البسط</h2>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>Complete PDF Workflow — All 4 Stages</p>
      </div>
      <OrnamentalDivider />
      <div className="px-4 pb-6 space-y-5 pt-4">
        {/* STAGE 1: Esma-i Kitabet */}
        {result?.kitabet && (
          <EsmaKitabetSection 
            kitabetData={result.kitabet} 
            dominant={dominant} 
            getBastLevelFn={getBastLevelFn} 
            mizanulMevazin={mizanulMevazin} 
          />
        )}
        
        {/* STAGE 2: Esma-i A'van */}
        {result?.avan && (
          <EsmaAvanSection 
            avanData={result.avan} 
            kitabetData={result.kitabet}
            dominant={dominant} 
            getBastLevelFn={getBastLevelFn} 
            kitabetTotal={result.kitabet.total} 
            mizanulMevazin={mizanulMevazin} 
            dominantB1={dominantB1}
            lastKitabetNameB1={result.kitabet.lastNameB1}
          />
        )}
        
        {/* STAGE 3: Esma-i Kasem */}
        {result?.kasem && (
          <EsmaKasemSection 
            kasemData={result.kasem} 
            avanData={result.avan}
            dominant={dominant} 
            getBastLevelFn={getBastLevelFn} 
            kitabetTotal={result.kitabet.total}
            dominantB1={dominantB1}
            lastAvanNameB1={result.avan.lastAvanNameB1}
            mizanulMevazin={mizanulMevazin}
          />
        )}
        
        {/* STAGE 4: Final Divine Names */}
        {result?.divineNames && (
          <FinalDivineNamesSection
            mizanulMevazin={mizanulMevazin}
            kitabetTotal={result.kitabet.total}
            avanTotal={result.avan.total}
            kasemTotal={result.kasem.total}
            dominant={dominant}
            getBastLevelFn={getBastLevelFn}
          />
        )}
        
        {/* ALTERNATIVE PDF EXAMPLE (Pages 101-105) — Read-only educational */}
        <AlternativePDFExample />
      </div>
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}