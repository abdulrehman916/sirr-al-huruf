// ═══════════════════════════════════════════════════════════════
// METHOD 2 PIPELINE: "Adetlerin Bastı" — Complete Workflow
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { runMethod2Pipeline } from "../../lib/mizaanMethod2Engine";
import { getBastLevel, istintak } from "../../lib/mizaanPostEngine";
import AlternativePDFExample from "./AlternativePDFExample";

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
      {safe.remainder.length > 0 && (
        <div className="mb-4 px-3 py-2 rounded-lg border" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
          <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Remainder (Carried to A'van Stage)</div>
          <LetterRow letters={safe.remainder} color={G.goldDim} size="lg" rtl />
        </div>
      )}
      <div className="rounded-lg border p-3 text-center" style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Esma-i Kitabet Total</div>
        <div className="text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{calcTotal.toLocaleString()}</div>
        <CollapsibleSource title="Source Breakdown">
          <div className="text-[6px] space-y-1">
            <div>Last Name B1: {lastNameB1.toLocaleString()}</div>
            <div>Dominant B1 ({dominant}): {dominantB1.toLocaleString()}</div>
            <div>Mizanül Mevazin: {mizanulMevazin.toLocaleString()}</div>
            <div className="font-bold">Total: {calcTotal.toLocaleString()}</div>
          </div>
        </CollapsibleSource>
      </div>
    </Card>
  );
}

function EsmaAvanSection({ avanData, dominant, getBastLevelFn, kitabetTotal, mizanulMevazin, dominantB1 }) {
  if (!avanData) return null;
  const safe = {
    seedLetters: Array.isArray(avanData.seedLetters) ? avanData.seedLetters : [],
    allExpanded: Array.isArray(avanData.allExpandedLetters) ? avanData.allExpandedLetters : [],
    groups: Array.isArray(avanData.groups) ? avanData.groups : [],
    remainder: Array.isArray(avanData.remainder) ? avanData.remainder : [],
    derivations: Array.isArray(avanData.derivations) ? avanData.derivations : [],
  };
  const elementMeta = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;
  const remainderB1 = safe.remainder.reduce((s, l) => s + (getBastLevelFn(l, 1) || 0), 0);
  const calcTotal = remainderB1 + dominantB1 + kitabetTotal;

  return (
    <Card accent={elementMeta.color}>
      <SectionHeader step="2" label="Esma-i A'van" arabic="أسماء الأعوان" color={elementMeta.color} />
      
      {/* Carry-forward letters from Kitabet */}
      <div className="mb-4 rounded-lg border p-3" style={{ background: G.bgInner, borderColor: G.goldBorder }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Carry-Forward Letters from Kitabet Stage</div>
        <LetterRow letters={safe.remainder} color={elementMeta.color} size="xl" rtl />
        <div className="text-[7px] mt-2" style={{ color: G.dim }}>These letters are used to calculate A'van Total</div>
      </div>

      {/* A'van Total Formula */}
      <div className="mb-4 rounded-lg border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-3 text-center" style={{ color: G.dim }}>A'van Total Calculation (PDF Formula)</div>
        <div className="grid grid-cols-3 gap-3 text-center mb-3">
          <div className="space-y-1">
            <div className="text-[6px]" style={{ color: G.dim }}>Remainder B1</div>
            <div className="text-lg font-bold" style={{ color: elementMeta.color }}>{remainderB1.toLocaleString()}</div>
            <div className="text-[6px]" style={{ color: G.dim }}>({safe.remainder.length} letters)</div>
          </div>
          <div className="space-y-1">
            <div className="text-[6px]" style={{ color: G.dim }}>Dominant B1</div>
            <div className="text-lg font-bold" style={{ color: elementMeta.color }}>{dominantB1.toLocaleString()}</div>
            <div className="text-[6px]" style={{ color: G.dim }}>({elementMeta.arabic})</div>
          </div>
          <div className="space-y-1">
            <div className="text-[6px]" style={{ color: G.dim }}>Kitabet Total</div>
            <div className="text-lg font-bold" style={{ color: elementMeta.color }}>{kitabetTotal.toLocaleString()}</div>
          </div>
        </div>
        <div className="text-center pt-3 border-t" style={{ borderColor: G.goldBorder + "40" }}>
          <div className="text-3xl font-black" style={{ color: G.gold }}>{calcTotal.toLocaleString()}</div>
          <div className="text-[6px] mt-1" style={{ color: G.dim }}>Total for Istintaq</div>
        </div>
      </div>

      {/* Seed Letters from Istintaq */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Istintaq of A'van Total → Seed Letters</div>
        <LetterRow letters={safe.seedLetters} color={elementMeta.color} size="xl" rtl />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>
          Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{safe.seedLetters.length}</span>
          <span className="mx-2" style={{ color: G.dim }}>•</span>
          <span style={{ color: avanData.isFerd ? G.red : G.green, fontWeight: "bold" }}>
            {avanData.isFerd ? 'FERD (فرد) → 5th Bast' : 'ZEVC (زوج) → 4th Bast'}
          </span>
        </div>
      </div>

      {/* Individual Bast Derivations */}
      <div className="space-y-2 mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Individual Bast Derivations (Reverse Order)</div>
        {safe.derivations.map((d, idx) => (
          <div key={idx} className="rounded-lg border p-3" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <LetterCell letter={d.originalLetter} color={elementMeta.color} size="lg" />
              <Arrow label={`B${d.bastLevel}`} />
              <div className="px-3 py-1.5 rounded text-sm font-bold tabular-nums" style={{ background: G.greenDim, borderColor: G.green + "40", color: G.green }}>{d.bastValue.toLocaleString()}</div>
              <Arrow label="→" />
              <span className="font-inter text-[7px]" style={{ color: G.dim }}>Istintaq</span>
              <Arrow label="→" />
            </div>
            <div className="flex items-center gap-1 flex-wrap pl-12" style={{ direction: "rtl" }}>
              {Array.isArray(d.expandedLetters) && d.expandedLetters.map((l, i) => (
                <LetterCell key={i} letter={l} color={G.green} size="sm" />
              ))}
            </div>
            <div className="text-[6px] mt-2 pl-12" style={{ color: G.dim }}>
              Expanded: {d.expandedLetters?.length || 0} letters
            </div>
          </div>
        ))}
      </div>

      {/* All Expanded Letters */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>All Expanded Letters ({safe.allExpanded.length} total)</div>
        <LetterRow letters={safe.allExpanded} color={G.gold} size="lg" rtl />
      </div>

      {/* Group Formation */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
          Group Formation → Esma-i A'van Names
          <span className="mx-2" style={{ color: G.dim }}>•</span>
          <span style={{ color: G.goldDim }}>
            {safe.allExpanded.length % 2 !== 0 ? '5 letters/name (FERD)' : '4 letters/name (ZEVC)'}
          </span>
        </div>
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
        <div className="text-center mt-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border" style={{ background: G.bgInner, borderColor: G.goldBorder }}>
            <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Total Names</span>
            <span className="font-inter text-lg font-bold" style={{ color: G.gold }}>{safe.groups.length}</span>
          </div>
        </div>
      </div>

      {/* Remainder for next stage */}
      {safe.remainder.length > 0 && (
        <div className="mb-4 px-3 py-3 rounded-lg border" style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Remainder Letters (Carried to Kasem Stage)</div>
          <LetterRow letters={safe.remainder} color={G.goldDim} size="lg" rtl />
          <div className="text-[7px] mt-2" style={{ color: G.dim }}>{safe.remainder.length} letters preserved for next stage</div>
        </div>
      )}

      {/* A'van Total Summary */}
      <div className="rounded-lg border p-4 text-center" style={{ background: G.bg, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Esma-i A'van Total</div>
        <div className="text-3xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{calcTotal.toLocaleString()}</div>
        <CollapsibleSource title="Complete Formula Breakdown">
          <div className="text-[6px] space-y-1 pt-2">
            <div>Remainder from Kitabet: {safe.remainder.length} letters</div>
            <div>Remainder B1 (First Bast): {remainderB1.toLocaleString()}</div>
            <div>Dominant Element B1 ({dominant}): {dominantB1.toLocaleString()}</div>
            <div>Kitabet Total: {kitabetTotal.toLocaleString()}</div>
            <div className="font-bold pt-1 border-t" style={{ borderColor: G.goldBorder + "40" }}>
              Formula: {remainderB1.toLocaleString()} + {dominantB1.toLocaleString()} + {kitabetTotal.toLocaleString()} = {calcTotal.toLocaleString()}
            </div>
          </div>
        </CollapsibleSource>
      </div>
    </Card>
  );
}

function EsmaKasemSection({ kasemData, dominant, getBastLevelFn, avanTotal, firstAvanName }) {
  if (!kasemData) return null;
  const safe = {
    seedLetters: Array.isArray(kasemData.seedLetters) ? kasemData.seedLetters : [],
    allExpanded: Array.isArray(kasemData.allExpandedLetters) ? kasemData.allExpandedLetters : [],
    groups: Array.isArray(kasemData.groups) ? kasemData.groups : [],
    remainder: Array.isArray(kasemData.remainder) ? kasemData.remainder : [],
    derivations: Array.isArray(kasemData.derivations) ? kasemData.derivations : [],
  };
  const elementMeta = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;

  return (
    <Card accent={elementMeta.color}>
      <SectionHeader step="3" label="Esma-i Kasem" arabic="أسماء القسم" color={elementMeta.color} />
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{elementMeta.icon}</span>
        <div className="flex items-center gap-2">
          <span className="font-amiri text-lg" style={{ color: elementMeta.color }}>{elementMeta.arabic}</span>
          <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>({dominant})</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Seed Letters (Istintaq of A'van Total: {avanTotal.toLocaleString()})</div>
        <LetterRow letters={safe.seedLetters} color={elementMeta.color} size="xl" rtl />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>
          Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{safe.seedLetters.length}</span>
          <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
          <span style={{ color: kasemData.isFerd ? G.red : G.green, fontWeight: "bold" }}>{kasemData.isFerd ? "FERD (فرد)" : "ZEVC (زوج)"}</span>
          <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
          <span style={{ color: G.goldDim }}>Bast Level: <span style={{ color: G.gold }}>{kasemData.bastLevel}th</span></span>
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
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Group Formation → Esma-i Kasem Names</div>
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
      {kasemData.completedRemainderName && (
        <div className="mb-4 px-3 py-3 rounded-lg border" style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Completed Remainder (First 2 Letters from First A'van Name)</div>
          <div className="text-[7px] mb-2" style={{ color: G.dim }}>First A'van Name: <span style={{ color: G.gold, fontWeight: "bold" }}>{firstAvanName}</span></div>
          <div className="flex items-center gap-2">
            <span className="font-inter text-[7px]" style={{ color: G.dim }}>Remainder ({safe.remainder.length}):</span>
            <LetterRow letters={safe.remainder} color={G.goldDim} size="sm" rtl />
            <span className="font-inter text-[7px]" style={{ color: G.dim }}>+ First 2:</span>
            <LetterRow letters={firstAvanName.slice(0, 2)} color={elementMeta.color} size="sm" rtl />
            <Arrow label="→" />
            <span className="font-amiri text-2xl font-bold px-4 py-2 rounded-lg border" style={{ color: G.gold, borderColor: G.goldBorder, background: G.bgInner }} dir="rtl">{kasemData.completedRemainderName}</span>
          </div>
        </div>
      )}
      <div className="rounded-lg border p-3" style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-3 text-center" style={{ color: G.dim }}>Final Esma-i Kasem Names</div>
        <div className="space-y-2">
          {safe.groups.map((group, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border" style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
              <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.dim }}>{group.groupNumber}.</span>
              <span className="font-amiri text-2xl font-bold flex-1" style={{ color: G.gold }} dir="rtl">{group.name}</span>
              {group.isCompletedRemainder && <span className="font-inter text-[6px] px-2 py-0.5 rounded" style={{ background: G.greenDim, color: G.green }}>COMPLETED</span>}
            </div>
          ))}
        </div>
      </div>
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

function FinalDivineNamesSection({ finalDivineNamesData, dominant }) {
  const elementMeta = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;
  const { mizanulMevazin, kitabetTotal, avanTotal, kasemTotal, finalSum, istintaqLetters, ebcedValues, ebcedTotal } = finalDivineNamesData || {};
  const safeLetters = Array.isArray(istintaqLetters) ? istintaqLetters : [];

  return (
    <Card accent={elementMeta.color}>
      <SectionHeader step="8" label="Final Divine Names Calculation" arabic="الأسماء الإلهية النهائية" color={elementMeta.color} />
      
      {/* Sum of All Four Totals */}
      <div className="mb-4 rounded-lg border p-4 text-center" style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>Final Combined Total — All Four Stages</div>
        <div className="grid grid-cols-4 gap-2 text-center mb-3">
          <div><div className="text-[6px]" style={{ color: G.dim }}>Mizanül Mevazin</div><div className="text-base font-bold" style={{ color: elementMeta.color }}>{mizanulMevazin?.toLocaleString()}</div></div>
          <div><div className="text-[6px]" style={{ color: G.dim }}>Kitabet Total</div><div className="text-base font-bold" style={{ color: elementMeta.color }}>{kitabetTotal?.toLocaleString()}</div></div>
          <div><div className="text-[6px]" style={{ color: G.dim }}>A'van Total</div><div className="text-base font-bold" style={{ color: elementMeta.color }}>{avanTotal?.toLocaleString()}</div></div>
          <div><div className="text-[6px]" style={{ color: G.dim }}>Kasem Total</div><div className="text-base font-bold" style={{ color: elementMeta.color }}>{kasemTotal?.toLocaleString()}</div></div>
        </div>
        <div className="text-4xl font-black" style={{ color: G.gold }}>{finalSum?.toLocaleString()}</div>
      </div>

      {/* Istintaq of Final Sum */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Istintaq of Final Sum → Divine Name Letters</div>
        <LetterRow letters={safeLetters} color={G.gold} size="xl" rtl />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{safeLetters?.length || 0}</span></div>
      </div>

      {/* Ebcedi Kebir Values */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Ebcedi Kebir (First Bast) Values</div>
        <div className="grid grid-cols-4 gap-2">
          {(ebcedValues || []).map((ev, idx) => (
            <div key={idx} className="rounded-lg border p-2 text-center" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
              <span className="font-amiri text-2xl block mb-1" style={{ color: G.gold }}>{ev.letter}</span>
              <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.dim }}>{ev.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Final Ebced Total */}
      <div className="rounded-lg border p-4 text-center" style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Total of Ebced Values — Target for Esma-ul Husna</div>
        <div className="text-3xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{ebcedTotal?.toLocaleString()}</div>
        <div className="text-[6px] mt-2" style={{ color: G.dim }}>Match this number with Divine Names (Esma-ul Husna) database</div>
      </div>
    </Card>
  );
}

function DivineNamesSection({ divineData, dominant, getBastLevelFn }) {
  if (!divineData) return null;
  const { sum, istintaqLetters, ebcedValues, ebcedTotal } = divineData;
  const safeLetters = Array.isArray(istintaqLetters) ? istintaqLetters : [];
  const elementMeta = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;

  return (
    <Card accent={elementMeta.color}>
      <SectionHeader step="4" label="Divine Names Calculation" arabic="الأسماء الإلهية" color={elementMeta.color} />
      
      {/* Sum of Three Totals */}
      <div className="mb-4 rounded-lg border p-4 text-center" style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>Sum of All Three Totals</div>
        <div className="text-3xl font-black mb-2" style={{ color: G.gold }}>{sum?.toLocaleString()}</div>
        <div className="text-[7px]" style={{ color: G.dim }}>9 Mizan + Esma-i Kitabet + Esma-i A'van</div>
      </div>
      
      {/* Istintaq of Sum */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Istintaq of Sum → Divine Name Letters</div>
        <LetterRow letters={safeLetters} color={G.gold} size="xl" rtl />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>
          Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{safeLetters.length}</span>
        </div>
      </div>
      
      {/* Ebcedi Kebir Values */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Ebcedi Kebir (First Bast) Values</div>
        <div className="grid grid-cols-5 gap-2">
          {(ebcedValues || []).map((ev, idx) => (
            <div key={idx} className="rounded-lg border p-2 text-center" style={{ background: G.bgCard, borderColor: G.goldBorder + "60" }}>
              <span className="font-amiri text-2xl block mb-1" style={{ color: G.gold }}>{ev.letter}</span>
              <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.dim }}>{ev.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Final Ebced Total */}
      <div className="rounded-lg border p-4 text-center" style={{ background: G.bg, borderColor: G.goldBorderHi }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Total of Ebced Values — Divine Names Target Number</div>
        <div className="text-4xl font-black" style={{ color: G.gold }}>{ebcedTotal?.toLocaleString()}</div>
        <div className="text-[7px] mt-2" style={{ color: G.dim }}>Match this number against Esma-ul Husna (99 Divine Names)</div>
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
      if (onVefkReady && pipelineResult?.kitabet) {
        onVefkReady({ vefk: null, source: pipelineResult.kitabet.total, names: pipelineResult.kitabet.names });
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
        <EsmaKitabetSection kitabetData={result.kitabet} dominant={dominant} getBastLevelFn={getBastLevelFn} mizanulMevazin={mizanulMevazin} />
        
        {/* STAGE 2: Esma-i A'van */}
        {result?.avan && <EsmaAvanSection avanData={result.avan} dominant={dominant} getBastLevelFn={getBastLevelFn} kitabetTotal={result.kitabet.total} mizanulMevazin={mizanulMevazin} dominantB1={dominantB1} />}
        
        {/* STAGE 3: Esma-i Kasem */}
        {result?.kasem && <EsmaKasemSection kasemData={result.kasem} dominant={dominant} getBastLevelFn={getBastLevelFn} avanTotal={result.avan.total} firstAvanName={result.avan.names[0] || ''} />}
        
        {/* STAGE 4: Divine Names */}
        {result?.divineNames && <DivineNamesSection divineData={result.divineNames} dominant={dominant} getBastLevelFn={getBastLevelFn} />}
        
        {/* ALTERNATIVE PDF EXAMPLE (Pages 101-105) — Read-only educational */}
        <AlternativePDFExample />
      </div>
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}