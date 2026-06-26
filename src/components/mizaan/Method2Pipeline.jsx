// ═══════════════════════════════════════════════════════════════
// METHOD 2 PIPELINE: "Adetlerin Bastı" — Complete Workflow
// ─────────────────────────────────────────────────────────────
// Implements Method 2 from PDF pages 4-11:
// - Cumulative total carry-forward (Kitabet → A'van → Kasem)
// - Remainder handling (keep for next stage, special Kasem completion)
// - Bast level selection (4th/5th based on Zevc/Ferd at EACH stage)
// - Divine Names calculation (sum of all three totals)
// - Keyword Subtraction alternative path (Ayil/Yushin)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { runMethod2Pipeline } from "../../lib/mizaanMethod2Engine";
import { getBastLevel, istintak } from "../../lib/mizaanPostEngine";

// ── Helper: Calculate Bast total for text ───────────────────────
function calcBastFromText(text, bastTableFn) {
  if (!text) return 0;
  const clean = text.replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '').replace(/\u0640/g, '').replace(/[^\u0600-\u06FF]/g, '');
  let total = 0;
  for (const ch of clean) { total += bastTableFn(ch) || 0; }
  return total;
}

// ── Design tokens ────────────────────────────────────────────────
const G = {
  gold:         "#F5D060",
  goldDim:      "rgba(245,208,96,0.55)",
  goldFaint:    "rgba(212,175,55,0.07)",
  goldBorder:   "rgba(212,175,55,0.40)",
  goldBorderHi: "rgba(212,175,55,0.65)",
  glow:         "rgba(212,175,55,0.18)",
  bg:           "rgba(3,6,20,0.99)",
  bgCard:       "rgba(8,16,40,0.98)",
  bgInner:      "rgba(212,175,55,0.06)",
  green:        "#4ADE80",
  greenDim:     "rgba(74,222,128,0.15)",
  red:          "#F87171",
  dim:          "rgba(255,255,255,0.35)",
};

const ELEMENT_COLORS = {
  fire:  { color: "#FF6B35", arabic: "النار",  icon: "🔥" },
  earth: { color: "#A5C880", arabic: "التراب", icon: "🌍" },
  air:   { color: "#B2EBF2", arabic: "الهواء", icon: "🌪" },
  water: { color: "#4FC3F7", arabic: "الماء",  icon: "💧" },
};

// ── Sub-components ───────────────────────────────────────────────

function SectionHeader({ step, label, arabic, color = G.gold }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg font-inter text-xs font-black flex-shrink-0"
        style={{ background: color + "22", border: `1px solid ${color}55`, color }}>
        {step}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-inter text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color }}>{label}</span>
          {arabic && <span className="font-amiri text-base" style={{ color: G.goldDim, lineHeight: 1.8, textRendering: "optimizeLegibility", WebkitFontSmoothing: "antialiased" }}>{arabic}</span>}
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

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${G.goldBorder})` }} />
      <span style={{ color: G.goldDim, fontSize: 10 }}>✦</span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${G.goldBorder})` }} />
    </div>
  );
}

function LetterCell({ letter, index, color = G.gold, size = "lg", showIndex = false }) {
  const sizes = { sm: "text-xl px-2.5 py-1.5", lg: "text-3xl px-4 py-2.5", xl: "text-4xl px-5 py-3" };
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`font-amiri font-bold rounded-lg border ${sizes[size]}`}
        style={{
          color,
          borderColor: color + "55",
          background: color + "12",
          lineHeight: 1.8,
          display: "inline-block",
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
        }}>
        {letter}
      </span>
      {showIndex && (
        <span className="font-inter text-[8px] tabular-nums" style={{ color: G.dim }}>{index + 1}</span>
      )}
    </div>
  );
}

function LetterRow({ letters, color = G.gold, size = "lg", showIndex = false, rtl = false }) {
  if (!letters || letters.length === 0) return (
    <span className="font-inter text-xs italic" style={{ color: G.dim }}>—</span>
  );
  return (
    <div className="flex flex-wrap gap-2.5 items-center" style={{ direction: rtl ? "rtl" : "ltr" }}>
      {letters.map((l, i) => (
        <LetterCell key={i} letter={l} index={i} color={color} size={size} showIndex={showIndex} />
      ))}
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

function CollapsibleSource({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mt-3 pt-3 border-t" style={{ borderColor: G.goldBorder + "40" }}>
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-1.5 text-[7px] uppercase tracking-wider font-bold hover:opacity-70 transition-opacity"
        style={{ color: G.dim }}>
        {isOpen ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
        {title}
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
}

// ── ESMA-I KITABET SECTION ──────────────────────────────────────
function EsmaKitabetSection({ mizanulMevazin, dominant, getBastLevelFn }) {
  const kitabet = useMemo(() => {
    const seedLetters = istintak(mizanulMevazin);
    const isFerd = seedLetters.length % 2 !== 0;
    const bastLevel = isFerd ? 5 : 4;
    const derivations = [];
    let allExpandedLetters = [];
    for (let i = seedLetters.length - 1; i >= 0; i--) {
      const letter = seedLetters[i];
      const bastValue = getBastLevelFn(letter, bastLevel);
      const expanded = istintak(bastValue);
      allExpandedLetters = [...allExpandedLetters, ...expanded];
      derivations.push({ stepNumber: derivations.length + 1, originalLetter: letter, bastValue, expandedLetters: expanded, seedIndex: i });
    }
    const totalExpanded = allExpandedLetters.length;
    const isExpandedFerd = totalExpanded % 2 !== 0;
    const groupSize = isExpandedFerd ? 5 : 4;
    const remainder = totalExpanded % groupSize;
    const groups = [];
    for (let i = 0; i < totalExpanded - remainder; i += groupSize) {
      const groupLetters = allExpandedLetters.slice(i, i + groupSize);
      groups.push({ letters: groupLetters, name: groupLetters.join(''), groupNumber: Math.floor(i / groupSize) + 1 });
    }
    const remainderLetters = remainder > 0 ? allExpandedLetters.slice(totalExpanded - remainder) : [];
    const lastName = groups.length > 0 ? groups[groups.length - 1].name : '';
    const lastNameB1 = calcBastFromText(lastName, (ch) => getBastLevelFn(ch, 1));
    const dominantB1 = getBastLevelFn(dominant, 1) || 0;
    const kitabetTotal = lastNameB1 + dominantB1 + mizanulMevazin;
    return { seedLetters, isFerd, bastLevel, derivations, allExpandedLetters, groups, remainder: remainderLetters, total: kitabetTotal };
  }, [mizanulMevazin, dominant, getBastLevelFn]);

  const elementMeta = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;

  return (
    <Card accent={elementMeta.color}>
      <SectionHeader step="1" label="Esma-i Kitabet" arabic="أسماء الكتابة" color={elementMeta.color} />
      {/* Element Info */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{elementMeta.icon}</span>
        <div className="flex items-center gap-2">
          <span className="font-amiri text-lg" style={{ color: elementMeta.color }}>{elementMeta.arabic}</span>
          <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>({dominant})</span>
        </div>
      </div>
      {/* Seed Letters */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Seed Letters (Istintaq of Mizanül Mevazin)</div>
        <LetterRow letters={kitabet.seedLetters} color={elementMeta.color} size="xl" rtl />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>
          Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{kitabet.seedLetters.length}</span>
          <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
          <span style={{ color: kitabet.isFerd ? G.red : G.green, fontWeight: "bold" }}>{kitabet.isFerd ? "FERD (فرد)" : "ZEVC (زوج)"}</span>
          <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
          <span style={{ color: G.goldDim }}>Bast Level: <span style={{ color: G.gold }}>{kitabet.bastLevel}th</span></span>
        </div>
      </div>
      {/* Individual Bast Derivations */}
      <div className="space-y-2 mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Individual Bast Derivations (Reverse Order)</div>
        {kitabet.derivations.map((d, idx) => (
          <div key={idx} className="rounded-lg border p-2 flex items-center gap-2 flex-wrap" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
            <LetterCell letter={d.originalLetter} color={elementMeta.color} size="sm" />
            <Arrow label={`B${d.bastLevel}`} />
            <div className="px-2 py-1 rounded text-xs font-bold tabular-nums" style={{ background: G.greenDim, borderColor: G.green + "40", color: G.green }}>{d.bastValue.toLocaleString()}</div>
            <Arrow label="→" />
            <div className="flex items-center gap-1" style={{ direction: "rtl" }}>
              {d.expandedLetters.map((l, i) => (<LetterCell key={i} letter={l} color={G.green} size="sm" />))}
            </div>
          </div>
        ))}
      </div>
      {/* All Expanded Letters */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>All Expanded Letters ({kitabet.allExpandedLetters.length} total)</div>
        <LetterRow letters={kitabet.allExpandedLetters} color={G.gold} size="lg" rtl showIndex />
      </div>
      {/* Group Formation */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Group Formation → Esma-i Kitabet Names</div>
        <div className="space-y-2">
          {kitabet.groups.map((group, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border" style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
              <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.dim }}>{group.groupNumber}.</span>
              <LetterRow letters={group.letters} color={G.gold} size="lg" rtl />
              <Arrow label="→" />
              <span className="font-amiri text-2xl font-bold px-3 py-1.5 rounded-lg border flex-1 text-center" style={{ color: G.gold, borderColor: G.goldBorder, background: G.bgInner, lineHeight: 1.8 }} dir="rtl">{group.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Remainder */}
      {kitabet.remainder && kitabet.remainder.length > 0 && (
        <div className="mb-4 px-3 py-2 rounded-lg border" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
          <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Remainder (Carried to A'van Stage)</div>
          <LetterRow letters={kitabet.remainder} color={G.goldDim} size="lg" rtl />
        </div>
      )}
      {/* Total Calculation */}
      <div className="rounded-lg border p-3 text-center" style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Esma-i Kitabet Total</div>
        <div className="text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{kitabet.total.toLocaleString()}</div>
        <CollapsibleSource title="Source Breakdown">
          <div className="text-[6px] space-y-1">
            <div>Last Name B1: {calcBastFromText(kitabet.groups[kitabet.groups.length - 1]?.name || '', (ch) => getBastLevelFn(ch, 1)).toLocaleString()}</div>
            <div>Dominant B1 ({dominant}): {getBastLevelFn(dominant, 1).toLocaleString()}</div>
            <div>Mizanül Mevazin: {mizanulMevazin.toLocaleString()}</div>
            <div className="font-bold">Total: {kitabet.total.toLocaleString()}</div>
          </div>
        </CollapsibleSource>
      </div>
    </Card>
  );
}

// ── ESMA-I A'VAN SECTION ──────────────────────────────────────
function EsmaAvanSection({ kitabetTotal, dominant, getBastLevelFn }) {
  const avan = useMemo(() => {
    const seedLetters = istintak(kitabetTotal);
    const isFerd = seedLetters.length % 2 !== 0;
    const bastLevel = isFerd ? 5 : 4;
    const derivations = [];
    let allExpandedLetters = [];
    for (let i = seedLetters.length - 1; i >= 0; i--) {
      const letter = seedLetters[i];
      const bastValue = getBastLevelFn(letter, bastLevel);
      const expanded = istintak(bastValue);
      allExpandedLetters = [...allExpandedLetters, ...expanded];
      derivations.push({ stepNumber: derivations.length + 1, originalLetter: letter, bastValue, expandedLetters: expanded, seedIndex: i });
    }
    const totalExpanded = allExpandedLetters.length;
    const isExpandedFerd = totalExpanded % 2 !== 0;
    const groupSize = isExpandedFerd ? 5 : 4;
    const remainder = totalExpanded % groupSize;
    const groups = [];
    for (let i = 0; i < totalExpanded - remainder; i += groupSize) {
      const groupLetters = allExpandedLetters.slice(i, i + groupSize);
      groups.push({ letters: groupLetters, name: groupLetters.join(''), groupNumber: Math.floor(i / groupSize) + 1 });
    }
    const remainderLetters = remainder > 0 ? allExpandedLetters.slice(totalExpanded - remainder) : [];
    const remainderB1 = remainderLetters.reduce((s, l) => s + (getBastLevelFn(l, 1) || 0), 0);
    const dominantB1 = getBastLevelFn(dominant, 1) || 0;
    const avanTotal = remainderB1 + dominantB1 + kitabetTotal;
    return { seedLetters, isFerd, bastLevel, derivations, allExpandedLetters, groups, remainder: remainderLetters, total: avanTotal, remainderB1, dominantB1 };
  }, [kitabetTotal, dominant, getBastLevelFn]);

  const elementMeta = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;

  return (
    <Card accent={elementMeta.color}>
      <SectionHeader step="2" label="Esma-i A'van" arabic="أسماء الأعوان" color={elementMeta.color} />
      {/* Element Info */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{elementMeta.icon}</span>
        <div className="flex items-center gap-2">
          <span className="font-amiri text-lg" style={{ color: elementMeta.color }}>{elementMeta.arabic}</span>
          <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>({dominant})</span>
        </div>
      </div>
      {/* Seed Letters */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Seed Letters (Istintaq of Kitabet Total: {kitabetTotal.toLocaleString()})</div>
        <LetterRow letters={avan.seedLetters} color={elementMeta.color} size="xl" rtl />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>
          Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{avan.seedLetters.length}</span>
          <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
          <span style={{ color: avan.isFerd ? G.red : G.green, fontWeight: "bold" }}>{avan.isFerd ? "FERD (فرد)" : "ZEVC (زوج)"}</span>
          <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
          <span style={{ color: G.goldDim }}>Bast Level: <span style={{ color: G.gold }}>{avan.bastLevel}th</span></span>
        </div>
      </div>
      {/* Individual Bast Derivations */}
      <div className="space-y-2 mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Individual Bast Derivations (Reverse Order)</div>
        {avan.derivations.map((d, idx) => (
          <div key={idx} className="rounded-lg border p-2 flex items-center gap-2 flex-wrap" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
            <LetterCell letter={d.originalLetter} color={elementMeta.color} size="sm" />
            <Arrow label={`B${d.bastLevel}`} />
            <div className="px-2 py-1 rounded text-xs font-bold tabular-nums" style={{ background: G.greenDim, borderColor: G.green + "40", color: G.green }}>{d.bastValue.toLocaleString()}</div>
            <Arrow label="→" />
            <div className="flex items-center gap-1" style={{ direction: "rtl" }}>
              {d.expandedLetters.map((l, i) => (<LetterCell key={i} letter={l} color={G.green} size="sm" />))}
            </div>
          </div>
        ))}
      </div>
      {/* All Expanded Letters */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>All Expanded Letters ({avan.allExpandedLetters.length} total)</div>
        <LetterRow letters={avan.allExpandedLetters} color={G.gold} size="lg" rtl showIndex />
      </div>
      {/* Group Formation */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Group Formation → Esma-i A'van Names</div>
        <div className="space-y-2">
          {avan.groups.map((group, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border" style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
              <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.dim }}>{group.groupNumber}.</span>
              <LetterRow letters={group.letters} color={G.gold} size="lg" rtl />
              <Arrow label="→" />
              <span className="font-amiri text-2xl font-bold px-3 py-1.5 rounded-lg border flex-1 text-center" style={{ color: G.gold, borderColor: G.goldBorder, background: G.bgInner, lineHeight: 1.8 }} dir="rtl">{group.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Remainder */}
      {avan.remainder && avan.remainder.length > 0 && (
        <div className="mb-4 px-3 py-2 rounded-lg border" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
          <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Remainder (Carried to Kasem Stage)</div>
          <LetterRow letters={avan.remainder} color={G.goldDim} size="lg" rtl />
        </div>
      )}
      {/* Total Calculation */}
      <div className="rounded-lg border p-3 text-center" style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Esma-i A'van Total</div>
        <div className="text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{avan.total.toLocaleString()}</div>
        <CollapsibleSource title="Source Breakdown">
          <div className="text-[6px] space-y-1">
            <div>Remainder B1 ({avan.remainder.length} letters): {avan.remainderB1.toLocaleString()}</div>
            <div>Dominant B1 ({dominant}): {avan.dominantB1.toLocaleString()}</div>
            <div>Kitabet Total: {kitabetTotal.toLocaleString()}</div>
            <div className="font-bold">Total: {avan.total.toLocaleString()}</div>
          </div>
        </CollapsibleSource>
      </div>
    </Card>
  );
}

// ── ESMA-I KASEM SECTION ──────────────────────────────────────
function EsmaKasemSection({ avanTotal, dominant, firstAvanName, getBastLevelFn }) {
  const kasem = useMemo(() => {
    const seedLetters = istintak(avanTotal);
    const isFerd = seedLetters.length % 2 !== 0;
    const bastLevel = isFerd ? 5 : 4;
    const derivations = [];
    let allExpandedLetters = [];
    for (let i = seedLetters.length - 1; i >= 0; i--) {
      const letter = seedLetters[i];
      const bastValue = getBastLevelFn(letter, bastLevel);
      const expanded = istintak(bastValue);
      allExpandedLetters = [...allExpandedLetters, ...expanded];
      derivations.push({ stepNumber: derivations.length + 1, originalLetter: letter, bastValue, expandedLetters: expanded, seedIndex: i });
    }
    const totalExpanded = allExpandedLetters.length;
    const isExpandedFerd = totalExpanded % 2 !== 0;
    const groupSize = isExpandedFerd ? 5 : 4;
    const remainder = totalExpanded % groupSize;
    const groups = [];
    for (let i = 0; i < totalExpanded - remainder; i += groupSize) {
      const groupLetters = allExpandedLetters.slice(i, i + groupSize);
      groups.push({ letters: groupLetters, name: groupLetters.join(''), groupNumber: Math.floor(i / groupSize) + 1 });
    }
    let remainderLetters = remainder > 0 ? allExpandedLetters.slice(totalExpanded - remainder) : [];
    let completedRemainderName = null;
    if (remainderLetters.length > 0 && firstAvanName && firstAvanName.length >= 2) {
      const firstTwoLetters = firstAvanName.slice(0, 2);
      const completedLetters = [...remainderLetters, ...firstTwoLetters];
      completedRemainderName = completedLetters.join('');
      groups.push({ letters: completedLetters, name: completedRemainderName, groupNumber: groups.length + 1, isCompletedRemainder: true });
    }
    return { seedLetters, isFerd, bastLevel, derivations, allExpandedLetters, groups, remainder: remainderLetters, completedRemainderName, firstAvanName };
  }, [avanTotal, dominant, firstAvanName, getBastLevelFn]);

  const elementMeta = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;

  return (
    <Card accent={elementMeta.color}>
      <SectionHeader step="3" label="Esma-i Kasem" arabic="أسماء القسم" color={elementMeta.color} />
      {/* Element Info */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{elementMeta.icon}</span>
        <div className="flex items-center gap-2">
          <span className="font-amiri text-lg" style={{ color: elementMeta.color }}>{elementMeta.arabic}</span>
          <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>({dominant})</span>
        </div>
      </div>
      {/* Seed Letters */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Seed Letters (Istintaq of A'van Total: {avanTotal.toLocaleString()})</div>
        <LetterRow letters={kasem.seedLetters} color={elementMeta.color} size="xl" rtl />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>
          Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{kasem.seedLetters.length}</span>
          <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
          <span style={{ color: kasem.isFerd ? G.red : G.green, fontWeight: "bold" }}>{kasem.isFerd ? "FERD (فرد)" : "ZEVC (زوج)"}</span>
          <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
          <span style={{ color: G.goldDim }}>Bast Level: <span style={{ color: G.gold }}>{kasem.bastLevel}th</span></span>
        </div>
      </div>
      {/* Individual Bast Derivations */}
      <div className="space-y-2 mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Individual Bast Derivations (Reverse Order)</div>
        {kasem.derivations.map((d, idx) => (
          <div key={idx} className="rounded-lg border p-2 flex items-center gap-2 flex-wrap" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
            <LetterCell letter={d.originalLetter} color={elementMeta.color} size="sm" />
            <Arrow label={`B${d.bastLevel}`} />
            <div className="px-2 py-1 rounded text-xs font-bold tabular-nums" style={{ background: G.greenDim, borderColor: G.green + "40", color: G.green }}>{d.bastValue.toLocaleString()}</div>
            <Arrow label="→" />
            <div className="flex items-center gap-1" style={{ direction: "rtl" }}>
              {d.expandedLetters.map((l, i) => (<LetterCell key={i} letter={l} color={G.green} size="sm" />))}
            </div>
          </div>
        ))}
      </div>
      {/* All Expanded Letters */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>All Expanded Letters ({kasem.allExpandedLetters.length} total)</div>
        <LetterRow letters={kasem.allExpandedLetters} color={G.gold} size="lg" rtl showIndex />
      </div>
      {/* Group Formation */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Group Formation → Esma-i Kasem Names</div>
        <div className="space-y-2">
          {kasem.groups.map((group, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border" style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
              <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.dim }}>{group.groupNumber}.</span>
              <LetterRow letters={group.letters} color={G.gold} size="lg" rtl />
              <Arrow label="→" />
              <span className="font-amiri text-2xl font-bold px-3 py-1.5 rounded-lg border flex-1 text-center" style={{ color: G.gold, borderColor: G.goldBorder, background: G.bgInner, lineHeight: 1.8 }} dir="rtl">{group.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Remainder Completion */}
      {kasem.completedRemainderName && (
        <div className="mb-4 px-3 py-3 rounded-lg border" style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Completed Remainder (First 2 Letters from First A'van Name)</div>
          <div className="text-[7px] mb-2" style={{ color: G.dim }}>First A'van Name: <span style={{ color: G.gold, fontWeight: "bold" }}>{firstAvanName}</span></div>
          <div className="flex items-center gap-2">
            <span className="font-inter text-[7px]" style={{ color: G.dim }}>Remainder ({kasem.remainder.length}):</span>
            <LetterRow letters={kasem.remainder} color={G.goldDim} size="sm" rtl />
            <span className="font-inter text-[7px]" style={{ color: G.dim }}>+ First 2:</span>
            <LetterRow letters={firstAvanName.slice(0, 2)} color={elementMeta.color} size="sm" rtl />
            <Arrow label="→" />
            <span className="font-amiri text-2xl font-bold px-4 py-2 rounded-lg border" style={{ color: G.gold, borderColor: G.goldBorder, background: G.bgInner }} dir="rtl">{kasem.completedRemainderName}</span>
          </div>
        </div>
      )}
      {/* Final Names Summary */}
      <div className="rounded-lg border p-3" style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-3 text-center" style={{ color: G.dim }}>Final Esma-i Kasem Names</div>
        <div className="space-y-2">
          {kasem.groups.map((group, idx) => (
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

// ── DIVINE NAMES SECTION ──────────────────────────────────────
function DivineNamesSection({ mizanulMevazin, kitabetTotal, avanTotal, getBastLevelFn, dominant }) {
  const divineNames = useMemo(() => {
    const sum = mizanulMevazin + kitabetTotal + avanTotal;
    const istintaqLetters = istintak(sum);
    const ebcedValues = istintaqLetters.map(letter => ({ letter, value: getBastLevelFn(letter, 1) || 0 }));
    const ebcedTotal = ebcedValues.reduce((s, v) => s + v.value, 0);
    return { sum, istintaqLetters, ebcedValues, ebcedTotal };
  }, [mizanulMevazin, kitabetTotal, avanTotal, getBastLevelFn, dominant]);

  const elementMeta = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;

  return (
    <Card accent={elementMeta.color}>
      <SectionHeader step="4" label="Divine Names Calculation" arabic="الأسماء الإلهية" color={elementMeta.color} />
      {/* Sum of Three Totals */}
      <div className="mb-4 rounded-lg border p-3 text-center" style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Sum of Three Totals</div>
        <div className="grid grid-cols-3 gap-2 text-center mb-2">
          <div>
            <div className="text-[6px]" style={{ color: G.dim }}>Mizanül Mevazin</div>
            <div className="text-lg font-bold" style={{ color: elementMeta.color }}>{mizanulMevazin.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[6px]" style={{ color: G.dim }}>Kitabet Total</div>
            <div className="text-lg font-bold" style={{ color: elementMeta.color }}>{kitabetTotal.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[6px]" style={{ color: G.dim }}>A'van Total</div>
            <div className="text-lg font-bold" style={{ color: elementMeta.color }}>{avanTotal.toLocaleString()}</div>
          </div>
        </div>
        <div className="text-3xl font-black" style={{ color: G.gold }}>{divineNames.sum.toLocaleString()}</div>
      </div>
      {/* Istintaq Letters */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Istintaq of Sum → Divine Name Letters</div>
        <LetterRow letters={divineNames.istintaqLetters} color={G.gold} size="xl" rtl />
        <div className="text-sm font-inter mt-2" style={{ color: G.dim }}>Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{divineNames.istintaqLetters.length}</span></div>
      </div>
      {/* Ebced Values */}
      <div className="mb-4">
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Ebcedi Kebir (First Bast) Values</div>
        <div className="grid grid-cols-4 gap-2">
          {divineNames.ebcedValues.map((ev, idx) => (
            <div key={idx} className="rounded-lg border p-2 text-center" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
              <span className="font-amiri text-2xl block mb-1" style={{ color: G.gold }}>{ev.letter}</span>
              <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.dim }}>{ev.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Ebced Total */}
      <div className="rounded-lg border p-3 text-center" style={{ background: G.bgInner, borderColor: elementMeta.color + "55" }}>
        <div className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>Total of Ebced Values</div>
        <div className="text-2xl font-bold tabular-nums" style={{ color: elementMeta.color }}>{divineNames.ebcedTotal.toLocaleString()}</div>
        <div className="text-[6px] mt-1" style={{ color: G.dim }}>This is the target number for matching Esma-ullah names</div>
      </div>
    </Card>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────────────
export default function Method2Pipeline({ grandBast, dominant, onVefkReady, getBastLevelFn = getBastLevel }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  const mizanulMevazin = useMemo(() => {
    const mahrac = grandBast.toString().length;
    return grandBast + mahrac;
  }, [grandBast]);

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
      <div className="rounded-2xl border p-8 text-center" style={{
        background: G.bg,
        borderColor: G.goldBorder,
      }}>
        <div className="w-12 h-12 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-inter text-sm" style={{ color: G.goldDim }}>Calculating Method 2 Pipeline…</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background: G.bg,
        borderColor: G.goldBorderHi,
        boxShadow: `0 0 80px ${G.glow}, 0 0 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}
    >
      {/* Top accent line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />

      {/* Title Banner */}
      <div className="text-center px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-3"
          style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>Method 2 — Adetlerin Bastı</span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <h2 className="font-amiri text-xl font-bold" style={{ color: G.gold, lineHeight: 1.7, textRendering: "optimizeLegibility", WebkitFontSmoothing: "antialiased" }}>أعدادات البسط</h2>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>Cumulative Total Carry-Forward Workflow</p>
      </div>

      <OrnamentalDivider />

      <div className="px-4 pb-6 space-y-5 pt-4">
        {/* Esma-i Kitabet */}
        <EsmaKitabetSection
          mizanulMevazin={mizanulMevazin}
          dominant={dominant}
          getBastLevelFn={getBastLevelFn}
        />

        {/* Esma-i A'van */}
        {result?.avan && (
          <EsmaAvanSection
            kitabetTotal={result.kitabet.total}
            dominant={dominant}
            getBastLevelFn={getBastLevelFn}
          />
        )}

        {/* Esma-i Kasem */}
        {result?.kasem && (
          <EsmaKasemSection
            avanTotal={result.avan.total}
            dominant={dominant}
            firstAvanName={result.avan.names[0] || ''}
            getBastLevelFn={getBastLevelFn}
          />
        )}

        {/* Divine Names */}
        {result?.divineNames && (
          <DivineNamesSection
            mizanulMevazin={mizanulMevazin}
            kitabetTotal={result.kitabet.total}
            avanTotal={result.avan.total}
            getBastLevelFn={getBastLevelFn}
            dominant={dominant}
          />
        )}
      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}