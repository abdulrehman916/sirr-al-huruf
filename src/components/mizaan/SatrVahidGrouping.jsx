import { useMemo } from "react";
import { motion } from "framer-motion";
import { getBastLevel, istintak, GALIB_ANASIR_VALUES } from "../../lib/mizaanPostEngine";

// ── Design tokens ─────────────────────────────────────────────
const G = {
  gold:     "#F5D060",
  goldDim:  "rgba(245,208,96,0.55)",
  goldFaint:"rgba(245,208,96,0.12)",
  goldBorder:"rgba(212,175,55,0.40)",
  goldBorderHi:"rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.18)",
  bg:       "rgba(3,6,20,0.99)",
  bgCard:   "rgba(8,16,40,0.98)",
  bgInner:  "rgba(212,175,55,0.06)",
  green:    "#4ADE80",
  greenDim: "rgba(74,222,128,0.15)",
  red:      "#F87171",
  redDim:   "rgba(248,113,113,0.15)",
  purple:   "#C4B5FD",
  purpleDim:"rgba(196,181,253,0.15)",
  blue:     "#93C5FD",
  blueDim:  "rgba(147,197,253,0.15)",
  white:    "rgba(255,255,255,0.85)",
  dim:      "rgba(255,255,255,0.35)",
};

// ── Shared sub-components ──────────────────────────────────────

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

function LetterCell({ letter, index, color = G.gold, size = "lg", showIndex = false, bgColor }) {
  const sizes = { sm: "text-lg px-2 py-1", lg: "text-2xl px-3 py-2", xl: "text-3xl px-4 py-2.5" };
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className={`font-amiri font-bold rounded-lg border ${sizes[size]}`}
        style={{
          color,
          borderColor: color + "55",
          background: bgColor || color + "12",
          lineHeight: 1.2,
          display: "inline-block",
        }}
      >
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
    <div className="flex flex-wrap gap-1.5 items-center" style={{ direction: rtl ? "rtl" : "ltr", unicodeBidi: rtl ? "normal" : "isolate" }}>
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

function Card({ children, accent, className = "" }) {
  return (
    <div
      className={`rounded-xl border p-4 ${className}`}
      style={{
        background: G.bgCard,
        borderColor: accent ? accent + "55" : G.goldBorder,
        borderLeft: accent ? `3px solid ${accent}` : undefined,
        boxShadow: `0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.05)`,
      }}
    >
      {children}
    </div>
  );
}

function StatRow({ label, value, valueColor = G.gold }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: G.goldBorder + "55" }}>
      <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{label}</span>
      <span className="font-inter text-sm font-bold tabular-nums" style={{ color: valueColor }}>{value}</span>
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

// ── Main component ─────────────────────────────────────────────
export default function SatrVahidGrouping({
  satrVahidLetters = [],
  dominant = "fire",
}) {
  const safeSeed = Array.isArray(satrVahidLetters) ? satrVahidLetters : [];
  const totalSeed = safeSeed.length;
  const isSeedFerd = totalSeed % 2 !== 0;
  const bastLevel = isSeedFerd ? 5 : 4;
  const bastLabelAr = bastLevel === 5 ? "البسط الخامس" : "البسط الرابع";

  // ── C: Individual derivations (LAST → FIRST processing order) ──
  const { derivations, concatenated } = useMemo(() => {
    const d = [];
    for (let i = safeSeed.length - 1; i >= 0; i--) {
      const letter = safeSeed[i];
      const bastValue = getBastLevel(letter, bastLevel);
      const extracted = istintak(bastValue);
      d.push({ letter, bastValue, extracted, originalIndex: i });
    }
    return { derivations: d, concatenated: d.flatMap(x => x.extracted) };
  }, [safeSeed, bastLevel]);

  // ── D: Concatenated Satr-i Vahid ──
  const satrCount = concatenated.length;
  const isSatrFerd = satrCount % 2 !== 0;
  const groupSize = isSatrFerd ? 5 : 4;

  // ── Grouping with remainder supplement ──
  const { finalSequence, supplement, remainder, groups } = useMemo(() => {
    const rem = concatenated.length % groupSize;
    let seq = [...concatenated];
    let supp = [];
    if (rem > 0) {
      const needed = groupSize - rem;
      const galibVal = GALIB_ANASIR_VALUES[dominant] || GALIB_ANASIR_VALUES.fire;
      supp = istintak(galibVal).slice(0, needed);
      seq = [...concatenated, ...supp];
    }
    const grps = [];
    for (let i = 0; i < seq.length; i += groupSize) {
      const g = seq.slice(i, i + groupSize);
      grps.push({ letters: g, name: g.join(""), groupNumber: Math.floor(i / groupSize) + 1 });
    }
    return { finalSequence: seq, supplement: supp, remainder: rem, groups: grps };
  }, [concatenated, groupSize, dominant]);

  const dominantLabel = { fire: "النار", earth: "التراب", air: "الهواء", water: "الماء" }[dominant] || dominant;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background: G.bg,
        borderColor: G.goldBorderHi,
        boxShadow: `0 0 80px ${G.glow}, 0 0 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}
    >
      {/* ══ Top accent line ══ */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />

      {/* ══ Title Banner ══ */}
      <div className="text-center px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-3"
          style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[9px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>Manuscript Pipeline Analysis</span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <h2 className="font-amiri text-3xl font-bold" style={{ color: G.gold }}>سَطْر وَاحِد</h2>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>Satr-i Vahid — Complete Derivation Chain</p>
      </div>

      <OrnamentalDivider />

      <div className="px-4 pb-6 space-y-5 pt-4">

        {/* ══ A: ORIGINAL LETTERS ══ */}
        <Card accent={G.gold}>
          <SectionHeader step="A" label="Original Seed Letters" arabic="الحروف الأصلية" color={G.gold} />
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            <LetterRow letters={safeSeed} color={G.gold} size="xl" showIndex rtl />
          </div>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <div className="px-3 py-1.5 rounded-lg border flex items-center gap-2"
              style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
              <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>Count</span>
              <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.gold }}>{totalSeed}</span>
            </div>
            {/* Parity badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border"
              style={{
                background: (isSeedFerd ? G.red : G.green) + "18",
                borderColor: (isSeedFerd ? G.red : G.green) + "60",
              }}>
              <span className="font-amiri text-lg font-bold" style={{ color: isSeedFerd ? G.red : G.green }}>
                {isSeedFerd ? "فرد" : "زوج"}
              </span>
              <span className="font-inter text-xs font-bold uppercase tracking-wide" style={{ color: isSeedFerd ? G.red : G.green }}>
                {isSeedFerd ? "FERD — Odd" : "ZEVC — Even"}
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-lg border flex items-center gap-2"
              style={{ background: G.bgInner, borderColor: G.goldBorder }}>
              <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>Bast</span>
              <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.goldDim }}>{bastLevel}th — {bastLabelAr}</span>
            </div>
          </div>
        </Card>

        {/* ══ B: CLASSIFICATION ══ */}
        <Card accent={isSeedFerd ? G.red : G.green}>
          <SectionHeader step="B" label="Classification & Method" arabic="التصنيف والمنهج" color={isSeedFerd ? G.red : G.green} />
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[120px] rounded-lg px-4 py-3 text-center border"
              style={{ background: (isSeedFerd ? G.red : G.green) + "15", borderColor: (isSeedFerd ? G.red : G.green) + "40" }}>
              <div className="font-amiri text-2xl font-bold" style={{ color: isSeedFerd ? G.red : G.green }}>
                {isSeedFerd ? "فَرْد" : "زَوْج"}
              </div>
              <div className="font-inter text-[8px] uppercase tracking-wider mt-1" style={{ color: G.dim }}>
                {isSeedFerd ? "ODD — Apply 5th Bast" : "EVEN — Apply 4th Bast"}
              </div>
            </div>
            <Arrow label="applies" />
            <div className="flex-1 min-w-[120px] rounded-lg px-4 py-3 text-center border"
              style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
              <div className="font-amiri text-2xl font-bold" style={{ color: G.gold }}>
                {bastLevel === 5 ? "خَامِس" : "رَابِع"}
              </div>
              <div className="font-inter text-[8px] uppercase tracking-wider mt-1" style={{ color: G.dim }}>
                {bastLevel}th Bast — {bastLabelAr}
              </div>
            </div>
            <Arrow label="rule" />
            <div className="flex-1 min-w-[120px] rounded-lg px-4 py-3 text-center border"
              style={{ background: G.blueDim, borderColor: G.blue + "40" }}>
              <div className="font-inter text-lg font-bold tabular-nums" style={{ color: G.blue }}>
                LAST → FIRST
              </div>
              <div className="font-inter text-[8px] uppercase tracking-wider mt-1" style={{ color: G.dim }}>Processing Order</div>
            </div>
          </div>
        </Card>

        {/* ══ C: INDIVIDUAL DERIVATIONS ══ */}
        <Card>
          <SectionHeader step="C" label="Individual Bast Derivations" arabic="اشتقاق البسط" color={G.green} />
          <div className="space-y-3">
            {derivations.map((d, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border p-3"
                style={{
                  background: idx === 0 ? G.green + "08" : G.bgInner,
                  borderColor: idx === 0 ? G.green + "40" : G.goldBorder + "60",
                }}
              >
                {/* Row header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded font-inter text-[9px] font-black flex-shrink-0"
                    style={{ background: idx === 0 ? G.green : G.goldFaint, color: idx === 0 ? "#000" : G.goldDim }}>
                    {idx + 1}
                  </div>
                  <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>
                    {idx === 0 ? "LAST letter (start)" : idx === derivations.length - 1 ? "FIRST letter (end)" : `Step ${idx + 1}`}
                  </span>
                </div>

                {/* Derivation chain */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Source letter */}
                  <LetterCell letter={d.letter} color={G.gold} size="lg" />

                  <Arrow label={`Bast ${bastLevel}`} />

                  {/* Bast value */}
                  <div className="px-3 py-1.5 rounded-lg border flex-shrink-0"
                    style={{ background: G.greenDim, borderColor: G.green + "40" }}>
                    <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.green }}>
                      {d.bastValue.toLocaleString()}
                    </span>
                  </div>

                  <Arrow label="Istintak" />

                  {/* Extracted letters */}
                  <div className="flex items-center gap-1 flex-wrap" style={{ direction: "rtl" }}>
                    {d.extracted.map((l, i) => (
                      <LetterCell key={i} letter={l} color={G.green} size="sm" />
                    ))}
                    <span className="font-inter text-[8px] ml-1" style={{ color: G.dim }}>
                      ({d.extracted.length})
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* ══ D: COMBINED SEQUENCE ══ */}
        <Card accent={G.gold}>
          <SectionHeader step="D" label="Combined Sequence — Satr-i Vahid" arabic="السطر الواحد" color={G.gold} />
          <div className="mb-3">
            <LetterRow letters={concatenated} color={G.gold} size="lg" showIndex rtl />
          </div>
          <div className="flex gap-3 flex-wrap mt-3 items-center">
            <div className="px-3 py-1.5 rounded-lg border flex items-center gap-2"
              style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
              <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>Total Letters</span>
              <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.gold }}>{satrCount}</span>
            </div>
            {/* Parity badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border"
              style={{
                background: (isSatrFerd ? G.red : G.green) + "18",
                borderColor: (isSatrFerd ? G.red : G.green) + "60",
              }}>
              <span className="font-amiri text-lg font-bold" style={{ color: isSatrFerd ? G.red : G.green }}>
                {isSatrFerd ? "فرد" : "زوج"}
              </span>
              <span className="font-inter text-xs font-bold uppercase tracking-wide" style={{ color: isSatrFerd ? G.red : G.green }}>
                {isSatrFerd ? "FERD — Odd" : "ZEVC — Even"}
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-lg border flex items-center gap-2"
              style={{ background: G.blueDim, borderColor: G.blue + "40" }}>
              <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>Group Size</span>
              <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.blue }}>{groupSize}</span>
            </div>
          </div>
        </Card>

        <OrnamentalDivider />

        {/* ══ I: ESMA-I KITABET GROUPING (with remainder) ══ */}
        <Card>
          <SectionHeader step="I" label="Esma-i Kitabet Grouping" arabic="تجميع الأسماء" color={G.gold} />

          {/* Remainder supplement notice */}
          {remainder > 0 && (
            <div className="mb-3 rounded-lg border p-3"
              style={{ background: G.greenDim, borderColor: G.green + "40" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-inter text-[8px] uppercase tracking-wider font-bold" style={{ color: G.green }}>
                  Remainder Correction Applied
                </span>
                <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.green }}>+{supplement.length} letters</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[8px] mb-2">
                <div className="flex justify-between">
                  <span style={{ color: G.dim }}>Dominant Element</span>
                  <span style={{ color: G.gold }}>{dominantLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: G.dim }}>Galib Anasir Value</span>
                  <span style={{ color: G.gold }}>{(GALIB_ANASIR_VALUES[dominant] || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: G.dim }}>Group Size</span>
                  <span style={{ color: G.gold }}>{groupSize}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: G.dim }}>Remainder</span>
                  <span style={{ color: G.red }}>{remainder} → need {supplement.length}</span>
                </div>
              </div>
              <div className="font-inter text-[7px] uppercase tracking-wider mb-1" style={{ color: G.dim }}>Appended letters:</div>
              <LetterRow letters={supplement} color={G.green} size="sm" rtl />
            </div>
          )}

          {/* Groups */}
          <div className="space-y-3">
            {groups.map((group, gi) => (
              <motion.div key={gi}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.06 }}
                className="rounded-xl border p-3"
                style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded flex items-center justify-center font-inter text-[9px] font-black"
                      style={{ background: G.goldFaint, color: G.gold, border: `1px solid ${G.goldBorder}` }}>
                      {group.groupNumber}
                    </div>
                    <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>
                      Group {group.groupNumber} — {group.letters.length} letters
                    </span>
                  </div>
                </div>

                {/* Letters in group */}
                <div className="flex items-center gap-3 flex-wrap">
                  <LetterRow letters={group.letters} color={G.gold} size="lg" showIndex rtl />
                  <Arrow label="name" />
                  {/* Name */}
                  <span className="font-amiri text-2xl font-bold px-4 py-2 rounded-xl border"
                    style={{ color: G.green, borderColor: G.green + "55", background: G.greenDim }}
                    dir="rtl">
                    {group.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* ══ J: FINAL SUMMARY SEAL ══ */}
        <Card accent={G.gold}>
          <SectionHeader step="J" label="Summary — All Generated Names" arabic="الخلاصة والأسماء" color={G.gold} />
          <div className="flex flex-wrap gap-2 justify-center py-2">
            {groups.map((group, gi) => (
              <motion.div key={gi}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: gi * 0.05 }}
                className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl border"
                style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
                <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>Name {gi + 1}</span>
                <span className="font-amiri text-2xl font-bold" style={{ color: G.gold }} dir="rtl">
                  {group.name}
                </span>
                <span className="font-inter text-[7px] tabular-nums" style={{ color: G.dim }}>
                  {group.letters.length} letters
                </span>
              </motion.div>
            ))}
          </div>
          {groups.length > 0 && (
            <div className="text-center mt-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border"
                style={{ background: G.bgInner, borderColor: G.goldBorder }}>
                <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>Total Names Generated</span>
                <span className="font-inter text-lg font-bold tabular-nums" style={{ color: G.gold }}>{groups.length}</span>
              </div>
            </div>
          )}
        </Card>

      </div>

      {/* ══ Bottom accent line ══ */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}