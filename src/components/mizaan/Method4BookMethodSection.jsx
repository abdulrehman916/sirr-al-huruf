// ═══════════════════════════════════════════════════════════════
// METHOD 4 — ALTERNATIVE METHOD (BOOK METHOD)
// ─────────────────────────────────────────────────────────────
// Reuses the existing "Next Number" AND its already-generated
// Istintak letters from earlier in Method 4. Does NOT recompute
// Istintak on the Next Number, and does NOT touch any prior
// Method 4 pipeline, names, or Wafq.
//
// CORRECTED WORKFLOW (per book):
//   1. Reuse existing Next Number + its existing letters
//   2. Build the name normally (FERD/ZEVC grouping + Galib Anasir
//      completion — same rule as Esma-i Kitabet completion)
//   3. Subtract value of "Ayil" (51) from Next Number → reduced number 1
//   4. Display: يا + [Generated Name] + ايل
//   5. Subtract value of "Yuşin" (316) from reduced number 1 → reduced number 2
//   6. Istintak(reduced number 2) → FERD/ZEVC grouping + completion
//      (self-recycle from front — Esma-i A'van completion rule) → Esma-i Kasem
//   7. Display: بحق + [Esma-i Kasem] + يوشن
// ═══════════════════════════════════════════════════════════════

import { useMemo } from "react";
import { motion } from "framer-motion";
import { istintak, GALIB_ANASIR_VALUES } from "../../lib/mizaanPostEngine";

const AYIL_VALUE = 51;
const YUSHIN_VALUE = 316;

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
  red:          "#F87171",
  dim:          "rgba(255,255,255,0.35)",
};

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${G.goldBorder})` }} />
      <span style={{ color: G.goldDim, fontSize: 10 }}>✦</span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${G.goldBorder})` }} />
    </div>
  );
}

function SectionHeader({ step, label, arabic, color = G.gold }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg font-inter text-sm font-black flex-shrink-0"
        style={{ background: color + "22", border: `1px solid ${color}55`, color }}>
        {step}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color }}>{label}</span>
          {arabic && <span className="font-amiri text-sm" style={{ color: G.goldDim, lineHeight: 1.7 }}>{arabic}</span>}
        </div>
      </div>
      <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(to right, ${color}40, transparent)` }} />
    </div>
  );
}

function Card({ children, accent }) {
  return (
    <div className="rounded-xl border p-5"
      style={{
        background: G.bgCard,
        borderColor: accent ? accent + "55" : G.goldBorder,
        borderLeft: accent ? `3px solid ${accent}` : undefined,
        boxShadow: `0 2px 20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(212,175,55,0.05)`,
      }}>
      {children}
    </div>
  );
}

function LetterRow({ letters, color = G.gold, size = "lg" }) {
  const sizes = { sm: "text-lg px-2.5 py-1.5", lg: "text-2xl px-4 py-2.5" };
  if (!letters || letters.length === 0) return <span className="font-inter text-sm italic" style={{ color: G.dim }}>—</span>;
  return (
    <div className="flex flex-wrap gap-2.5 items-center" style={{ direction: "rtl" }}>
      {letters.map((l, i) => (
        <span key={i} className={`font-amiri font-bold rounded-lg border ${sizes[size]}`}
          style={{ color, borderColor: color + "55", background: color + "12", lineHeight: 1.8, display: "inline-block" }}>
          {l}
        </span>
      ))}
    </div>
  );
}

// FERD/ZEVC grouping with a pluggable completion rule for the last (incomplete) group.
function groupLetters(letters, completionSource) {
  const count = letters.length;
  const isFerd = count % 2 !== 0;
  const groupSize = isFerd ? 5 : 4;
  const remainder = count % groupSize;
  let supplement = [];
  let seq = [...letters];
  if (remainder > 0) {
    const needed = groupSize - remainder;
    supplement = completionSource.slice(0, needed);
    seq = [...letters, ...supplement];
  }
  const groups = [];
  for (let i = 0; i < seq.length; i += groupSize) {
    const g = seq.slice(i, i + groupSize);
    groups.push({ letters: g, name: g.join("") });
  }
  return { count, isFerd, groupSize, remainder, supplement, groups };
}

export default function Method4BookMethodSection({ nextNumber, nextLetters, dominant = "fire" }) {
  const pipeline = useMemo(() => {
    if (!nextNumber || nextNumber <= 0 || !Array.isArray(nextLetters) || nextLetters.length === 0) return null;

    // ── STEP 1-2: Reuse existing Next Number letters → build name normally ──
    const galibValue = GALIB_ANASIR_VALUES[dominant] || GALIB_ANASIR_VALUES.fire;
    const galibIstintakLetters = istintak(galibValue);
    const avanGrouping = groupLetters(nextLetters, galibIstintakLetters);
    const avanName = avanGrouping.groups.length > 0 ? avanGrouping.groups[avanGrouping.groups.length - 1].name : "";

    // ── STEP 3: Subtract value of Ayil (51) from Next Number ──
    const reducedNumber1 = nextNumber - AYIL_VALUE;

    // ── STEP 4: Display invocation using reduced number 1 as the invocation number ──
    const invocationAvan = `يا${avanName}ايل`;

    // ── STEP 5: Subtract value of Yuşin (316) from reduced number 1 ──
    const reducedNumber2 = reducedNumber1 - YUSHIN_VALUE;

    // ── STEP 6: Generate Esma-i Kasem from reducedNumber2 (normal grouping rules) ──
    const kasemLetters = reducedNumber2 > 0 ? istintak(reducedNumber2) : [];
    const kasemGrouping = groupLetters(kasemLetters, kasemLetters);
    const kasemName = kasemGrouping.groups.length > 0 ? kasemGrouping.groups[kasemGrouping.groups.length - 1].name : "";

    // ── STEP 7: Final invocation ──
    const invocationKasem = `بحق${kasemName}يوشن`;

    return {
      avanGrouping, avanName, reducedNumber1, invocationAvan,
      reducedNumber2, kasemLetters, kasemGrouping, kasemName, invocationKasem,
    };
  }, [nextNumber, nextLetters, dominant]);

  if (!pipeline) return null;

  const {
    avanGrouping, avanName, reducedNumber1, invocationAvan,
    reducedNumber2, kasemLetters, kasemGrouping, kasemName, invocationKasem,
  } = pipeline;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background:  G.bg,
        borderColor: G.goldBorderHi,
        boxShadow:   `0 0 80px ${G.glow}, 0 0 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}
    >
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />

      <div className="text-center px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-3"
          style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>Alternative Method (Book Method)</span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <p className="font-inter text-[10px] uppercase tracking-[0.2em] mt-1.5" style={{ color: G.goldDim }}>Based on the completed Nine Mizan calculation</p>
      </div>

      <OrnamentalDivider />

      <div className="px-4 pb-6 space-y-5 pt-4">

        {/* STEP 1-2: Reused Next Number + Name Grouping */}
        <Card accent={G.green}>
          <SectionHeader step="1" label="Next Number (Reused) → Name Grouping" arabic="العدد التالي" color={G.green} />
          <div className="flex items-center justify-between px-3 py-2 rounded-lg border mb-3"
            style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
            <span className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>Next Number</span>
            <span className="font-inter text-base font-bold tabular-nums" style={{ color: G.gold }}>{nextNumber.toLocaleString()}</span>
          </div>
          <LetterRow letters={nextLetters} color={G.gold} />
          <div className="text-sm font-inter mt-3" style={{ color: G.dim }}>
            Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{avanGrouping.count}</span>
            <span style={{ margin: "0 0.5rem" }}>•</span>
            <span style={{ color: avanGrouping.isFerd ? G.red : G.green, fontWeight: "bold" }}>{avanGrouping.isFerd ? "FERD (فرد)" : "ZEVC (زوج)"}</span>
            <span style={{ margin: "0 0.5rem" }}>•</span>
            <span style={{ color: G.goldDim }}>Group Size: <span style={{ color: G.gold }}>{avanGrouping.groupSize}</span></span>
          </div>
          {avanGrouping.remainder > 0 && (
            <div className="mt-3 px-3 py-2 rounded-lg border text-[10px] font-inter" style={{ background: G.bgInner, borderColor: G.goldBorder + "55", color: G.dim }}>
              Completed with Galib Anasir Istintak letters:
              <span className="ml-2" dir="rtl" style={{ color: G.gold }}>{avanGrouping.supplement.join("")}</span>
            </div>
          )}
          <div className="space-y-3 mt-4">
            {avanGrouping.groups.map((group, gi) => (
              <div key={gi} className="rounded-xl border p-3" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
                <div className="flex items-center gap-3 flex-wrap">
                  <LetterRow letters={group.letters} color={G.gold} size="sm" />
                  <span className="font-inter text-lg" style={{ color: G.goldDim }}>→</span>
                  <span className="font-amiri text-2xl font-bold px-5 py-3 rounded-xl border"
                    style={{ color: G.gold, borderColor: G.goldBorder + "55", background: G.goldFaint, lineHeight: 1.7 }}
                    dir="rtl">
                    {group.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* STEP 3: Subtract Ayil */}
        <Card accent={G.gold}>
          <SectionHeader step="2" label="Next Number − Value of Ayil" arabic="العدد المخفض" color={G.gold} />
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center">
            <div className="space-y-1">
              <div className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>Next Number</div>
              <div className="font-inter text-base font-bold tabular-nums" style={{ color: G.gold }}>{nextNumber.toLocaleString()}</div>
            </div>
            <span className="font-inter text-lg font-bold" style={{ color: G.goldDim }}>−</span>
            <div className="space-y-1">
              <div className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>Ayil (ايل)</div>
              <div className="font-inter text-base font-bold tabular-nums" style={{ color: G.gold }}>{AYIL_VALUE}</div>
            </div>
            <span className="font-inter text-lg font-bold" style={{ color: G.goldDim }}>=</span>
            <div className="space-y-1">
              <div className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>Reduced Number</div>
              <div className="font-inter text-xl font-black tabular-nums" style={{ color: G.gold }}>{reducedNumber1.toLocaleString()}</div>
            </div>
          </div>
        </Card>

        {/* STEP 4: Esma-i A'van Invocation */}
        <Card accent={G.gold}>
          <SectionHeader step="3" label="Esma-i A'van Invocation" arabic="دعوة أسماء الأعوان" color={G.gold} />
          <div className="text-center px-3 py-4 rounded-lg border"
            style={{ background: G.bgInner, borderColor: G.goldBorderHi }}>
            <span className="font-amiri text-3xl font-bold" style={{ color: G.gold, lineHeight: 2 }} dir="rtl">{invocationAvan}</span>
          </div>
        </Card>

        <OrnamentalDivider />

        {/* STEP 5: Subtract Yuşin */}
        <Card accent={G.gold}>
          <SectionHeader step="4" label="Reduced Number − Value of Yuşin" arabic="العدد الناتج" color={G.gold} />
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center">
            <div className="space-y-1">
              <div className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>Reduced Number</div>
              <div className="font-inter text-base font-bold tabular-nums" style={{ color: G.gold }}>{reducedNumber1.toLocaleString()}</div>
            </div>
            <span className="font-inter text-lg font-bold" style={{ color: G.goldDim }}>−</span>
            <div className="space-y-1">
              <div className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>Yuşin (يوشن)</div>
              <div className="font-inter text-base font-bold tabular-nums" style={{ color: G.gold }}>{YUSHIN_VALUE}</div>
            </div>
            <span className="font-inter text-lg font-bold" style={{ color: G.goldDim }}>=</span>
            <div className="space-y-1">
              <div className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>Result</div>
              <div className="font-inter text-xl font-black tabular-nums" style={{ color: G.gold }}>{reducedNumber2.toLocaleString()}</div>
            </div>
          </div>
        </Card>

        {/* STEP 6: Istintak + Grouping → Esma-i Kasem */}
        <Card accent={G.green}>
          <SectionHeader step="5" label="Istintak → FERD/ZEVC Grouping" arabic="حروف الاستنطاق" color={G.green} />
          <LetterRow letters={kasemLetters} color={G.gold} />
          <div className="text-sm font-inter mt-3" style={{ color: G.dim }}>
            Count: <span style={{ color: G.gold, fontWeight: "bold" }}>{kasemGrouping.count}</span>
            <span style={{ margin: "0 0.5rem" }}>•</span>
            <span style={{ color: kasemGrouping.isFerd ? G.red : G.green, fontWeight: "bold" }}>{kasemGrouping.isFerd ? "FERD (فرد)" : "ZEVC (زوج)"}</span>
            <span style={{ margin: "0 0.5rem" }}>•</span>
            <span style={{ color: G.goldDim }}>Group Size: <span style={{ color: G.gold }}>{kasemGrouping.groupSize}</span></span>
          </div>
          {kasemGrouping.remainder > 0 && (
            <div className="mt-3 px-3 py-2 rounded-lg border text-[10px] font-inter" style={{ background: G.bgInner, borderColor: G.goldBorder + "55", color: G.dim }}>
              Completed by self-recycling from the front of its own sequence:
              <span className="ml-2" dir="rtl" style={{ color: G.gold }}>{kasemGrouping.supplement.join("")}</span>
            </div>
          )}
          <div className="space-y-3 mt-4">
            {kasemGrouping.groups.map((group, gi) => (
              <div key={gi} className="rounded-xl border p-3" style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
                <div className="flex items-center gap-3 flex-wrap">
                  <LetterRow letters={group.letters} color={G.gold} size="sm" />
                  <span className="font-inter text-lg" style={{ color: G.goldDim }}>→</span>
                  <span className="font-amiri text-2xl font-bold px-5 py-3 rounded-xl border"
                    style={{ color: G.gold, borderColor: G.goldBorder + "55", background: G.goldFaint, lineHeight: 1.7 }}
                    dir="rtl">
                    {group.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* STEP 7: Final Kasem Invocation */}
        <Card accent={G.gold}>
          <SectionHeader step="6" label="Esma-i Kasem Invocation" arabic="دعوة أسماء القسم" color={G.gold} />
          <div className="text-center px-3 py-3 rounded-lg border mb-3"
            style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
            <span className="font-amiri text-2xl font-bold" style={{ color: G.gold, lineHeight: 1.8 }} dir="rtl">{kasemName}</span>
          </div>
          <div className="text-center px-3 py-4 rounded-lg border"
            style={{ background: G.bgInner, borderColor: G.goldBorderHi }}>
            <span className="font-amiri text-3xl font-bold" style={{ color: G.gold, lineHeight: 2 }} dir="rtl">{invocationKasem}</span>
          </div>
        </Card>

      </div>

      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}