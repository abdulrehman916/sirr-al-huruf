// ═══════════════════════════════════════════════════════════════
// METHOD 2 PIPELINE: "Adetlerin Bastı" — Complete Workflow
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { runMethod2Pipeline } from "../../lib/mizaanMethod2Engine";
import { getBastLevel, istintak } from "../../lib/mizaanPostEngine";

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

function EsmaAvanSection({ avanData, dominant, getBastLevelFn, kitabetTotal }) {
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
  const dominantB1 = getBastLevelFn(dominant, 1) || 0;
  const calcTotal = remainderB1 + dominantB1 + kitabetTotal;

  return (
    <Card accent={elementMeta.color}>
      <SectionHeader step="2" label="Esma-i A'van" arabic="أسماء الأعوان" color={elementMeta.color} />
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{elementMeta.icon}</span>
        <div className="flex items-center gap-2">
          <span className="font-amiri text-lg" style={{ color: elementMeta.color }}>{elementMeta.arabic}</span>
          <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>({dominant})</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Seed Letters (Istintaq of Kitabet Total: {kitabetTotal.toLocaleString()})</div>
        <LetterRow letters={safe.seedLetters} color={elementMeta.color} size="xl" rtl />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>
          Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{safe.seedLetters.length}</span>
          <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
          <span style={{ color: avanData.isFerd ? G.red : G.green, fontWeight: "bold" }}>{avanData.isFerd ? "FERD (فرد)" : "ZEVC (زوج)"}</span>
          <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
          <span style={{ color: G.goldDim }}>Bast Level: <span style={{ color: G.gold }}>{avanData.bastLevel}th</span></span>
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
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Group Formation → Esma-i A'van Names</div>
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
          <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Remainder (Carried to Kasem Stage)</div>
          <LetterRow letters={safe.remainder} color={G.goldDim} size="lg" rtl />
        </div>
      )}
      <div className="rounded-lg border p-3 text-center" style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Esma-i A'van Total</div>
        <div className="text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{calcTotal.toLocaleString()}</div>
        <CollapsibleSource title="Source Breakdown">
          <div className="text-[6px] space-y-1">
            <div>Remainder B1 ({safe.remainder.length} letters): {remainderB1.toLocaleString()}</div>
            <div>Dominant B1 ({dominant}): {dominantB1.toLocaleString()}</div>
            <div>Kitabet Total: {kitabetTotal.toLocaleString()}</div>
            <div className="font-bold">Total: {calcTotal.toLocaleString()}</div>
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

function DivineNamesSection({ mizanulMevazin, kitabetTotal, avanTotal, getBastLevelFn, dominant }) {
  const sum = mizanulMevazin + kitabetTotal + avanTotal;
  const istintaqLetters = istintak(sum);
  const safeLetters = Array.isArray(istintaqLetters) ? istintaqLetters : [];
  const ebcedValues = safeLetters.map(letter => ({ letter, value: getBastLevelFn(letter, 1) || 0 }));
  const ebcedTotal = ebcedValues.reduce((s, v) => s + v.value, 0);
  const elementMeta = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;

  return (
    <Card accent={elementMeta.color}>
      <SectionHeader step="4" label="Divine Names Calculation" arabic="الأسماء الإلهية" color={elementMeta.color} />
      <div className="mb-4 rounded-lg border p-3 text-center" style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Sum of Three Totals</div>
        <div className="grid grid-cols-3 gap-2 text-center mb-2">
          <div><div className="text-[6px]" style={{ color: G.dim }}>Mizanül Mevazin</div><div className="text-lg font-bold" style={{ color: elementMeta.color }}>{mizanulMevazin.toLocaleString()}</div></div>
          <div><div className="text-[6px]" style={{ color: G.dim }}>Kitabet Total</div><div className="text-lg font-bold" style={{ color: elementMeta.color }}>{kitabetTotal.toLocaleString()}</div></div>
          <div><div className="text-[6px]" style={{ color: G.dim }}>A'van Total</div><div className="text-lg font-bold" style={{ color: elementMeta.color }}>{avanTotal.toLocaleString()}</div></div>
        </div>
        <div className="text-3xl font-black" style={{ color: G.gold }}>{sum.toLocaleString()}</div>
      </div>
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Istintaq of Sum → Divine Name Letters</div>
        <LetterRow letters={safeLetters} color={G.gold} size="xl" rtl />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{safeLetters.length}</span></div>
      </div>
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Ebcedi Kebir (First Bast) Values</div>
        <div className="grid grid-cols-4 gap-2">
          {ebcedValues.map((ev, idx) => (
            <div key={idx} className="rounded-lg border p-2 text-center" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
              <span className="font-amiri text-2xl block mb-1" style={{ color: G.gold }}>{ev.letter}</span>
              <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.dim }}>{ev.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border p-3 text-center" style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Total of Ebced Values</div>
        <div className="text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{ebcedTotal.toLocaleString()}</div>
        <div className="text-[6px] mt-1" style={{ color: G.dim }}>This is the target number for matching Esma-ullah names</div>
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
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>Cumulative Total Carry-Forward Workflow</p>
      </div>
      <OrnamentalDivider />
      <div className="px-4 pb-6 space-y-5 pt-4">
        <EsmaKitabetSection kitabetData={result.kitabet} dominant={dominant} getBastLevelFn={getBastLevelFn} mizanulMevazin={mizanulMevazin} />
        {result?.avan && <EsmaAvanSection avanData={result.avan} dominant={dominant} getBastLevelFn={getBastLevelFn} kitabetTotal={result.kitabet.total} />}
        {result?.kasem && <EsmaKasemSection kasemData={result.kasem} dominant={dominant} getBastLevelFn={getBastLevelFn} avanTotal={result.avan.total} firstAvanName={result.avan.names[0] || ''} />}
        {result?.divineNames && <DivineNamesSection mizanulMevazin={mizanulMevazin} kitabetTotal={result.kitabet.total} avanTotal={result.avan.total} getBastLevelFn={getBastLevelFn} dominant={dominant} />}
      </div>
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}