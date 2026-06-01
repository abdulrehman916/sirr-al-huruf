// ═══════════════════════════════════════════════════════════════
// AKRAM / HARF CONVERSION — Used ONLY by BastHuroofPage
// Fully isolated. No shared logic with any other engine.
// ═══════════════════════════════════════════════════════════════

import { motion } from "framer-motion";

// ── Palette ───────────────────────────────────────────────────
const G = {
  border:   "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  faint:    "rgba(212,175,55,0.22)",
  bg:       "rgba(212,175,55,0.07)",
  bgHi:     "rgba(212,175,55,0.14)",
};

// ── Abjad Kabir map (units, tens, hundreds, thousands) ────────
const UNITS = {
  1:'ا', 2:'ب', 3:'ج', 4:'د', 5:'ه', 6:'و', 7:'ز', 8:'ح', 9:'ط',
};
const TENS = {
  10:'ي', 20:'ك', 30:'ل', 40:'م', 50:'ن', 60:'س', 70:'ع', 80:'ف', 90:'ص',
};
const HUNDREDS = {
  100:'ق', 200:'ر', 300:'ش', 400:'ت', 500:'ث', 600:'خ', 700:'ذ', 800:'ض', 900:'ظ',
};
// 1000 → غ, then the thousands digit re-starts as a UNIT (1-9 mapped via UNITS)
const THOUSAND_LETTER = 'غ';

/**
 * Convert a positive integer into an ordered array of { value, letter } pieces.
 * Pieces are ordered from lowest-place to highest-place (units first),
 * matching the right-to-left Akram reading convention.
 */
export function toAkramPieces(n) {
  if (!n || n <= 0) return [];
  const pieces = [];

  const units     = n % 10;
  const tens      = Math.floor(n / 10) % 10 * 10;
  const hundreds  = Math.floor(n / 100) % 10 * 100;
  const thousands = Math.floor(n / 1000);

  if (units    && UNITS[units])         pieces.push({ value: units,    letter: UNITS[units] });
  if (tens     && TENS[tens])           pieces.push({ value: tens,     letter: TENS[tens] });
  if (hundreds && HUNDREDS[hundreds])   pieces.push({ value: hundreds, letter: HUNDREDS[hundreds] });

  if (thousands > 0) {
    // Always write غ for the 1000-place
    pieces.push({ value: 1000, letter: THOUSAND_LETTER });
    // Then the thousands digit itself re-restarts as a unit (e.g. 2000 → غ ب)
    const kUnit = thousands % 10;
    const kTens = Math.floor(thousands / 10) % 10 * 10;
    const kHundreds = Math.floor(thousands / 100) % 10 * 100;
    const kThousands = Math.floor(thousands / 1000);

    if (kUnit    && UNITS[kUnit])         pieces.push({ value: kUnit,    letter: UNITS[kUnit] });
    if (kTens    && TENS[kTens])          pieces.push({ value: kTens,    letter: TENS[kTens] });
    if (kHundreds && HUNDREDS[kHundreds]) pieces.push({ value: kHundreds,letter: HUNDREDS[kHundreds] });
    // Recursive for very large numbers (millions+)
    if (kThousands > 0) {
      pieces.push({ value: 1000, letter: THOUSAND_LETTER });
      const deep = toAkramPieces(kThousands);
      pieces.push(...deep);
    }
  }

  return pieces;
}

// ── AkramCard Component ────────────────────────────────────────
export default function AkramCard({ total, levelLabel, levelArabic }) {
  if (total === null || total === undefined || total <= 0) return null;

  const pieces = toAkramPieces(total);
  if (!pieces.length) return null;

  const akramLetters = pieces.map(p => p.letter).join('');
  const breakdownStr = pieces.map(p => p.value.toLocaleString()).join(' • ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
      className="rounded-2xl border p-5 space-y-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(10,22,56,0.99) 0%, rgba(5,12,36,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 50px ${G.glow}, 0 4px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.10)`,
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)" }} />

      {/* Section title */}
      <p className="font-inter text-[9px] uppercase tracking-[0.26em] text-center" style={{ color: G.dim }}>
        ✦ Akram / Harf — {levelLabel} — {levelArabic}
      </p>

      <div className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)" }} />

      {/* Bast value row */}
      <div className="flex items-center justify-between px-2">
        <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.40)" }}>
          Bast Value
        </span>
        <span className="font-inter font-bold tabular-nums text-sm" style={{ color: G.text }}>
          {total.toLocaleString()}
        </span>
      </div>

      {/* Breakdown pieces */}
      <div className="space-y-1.5">
        <p className="font-inter text-[9px] uppercase tracking-widest px-2" style={{ color: "rgba(212,175,55,0.38)" }}>
          Akram Breakdown
        </p>
        <div className="flex flex-wrap gap-1.5 px-1" dir="ltr">
          {pieces.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className="flex flex-col items-center rounded-xl border px-2.5 py-2 min-w-[46px]"
              style={{
                background: p.value === 1000 ? G.bgHi : G.bg,
                borderColor: p.value === 1000 ? G.borderHi : G.faint,
              }}
            >
              <span className="font-amiri text-xl leading-none mb-0.5" style={{ color: "#fff" }}>
                {p.letter}
              </span>
              <span className="font-inter text-[10px] tabular-nums font-bold" style={{ color: G.dim }}>
                {p.value.toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent)" }} />

      {/* Akram letters result */}
      <div className="space-y-2 text-center">
        <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.38)" }}>
          Akram Letters
        </p>
        <motion.p
          className="font-amiri font-bold leading-none"
          style={{ fontSize: "clamp(2rem, 9vw, 3rem)", color: G.text, direction: "rtl" }}
          animate={{
            textShadow: [
              "0 0 14px rgba(212,175,55,0.28)",
              "0 0 44px rgba(212,175,55,0.72)",
              "0 0 14px rgba(212,175,55,0.28)",
            ],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {akramLetters}
        </motion.p>
        <p className="font-inter text-[10px] tabular-nums" style={{ color: "rgba(212,175,55,0.45)" }}>
          {breakdownStr}
        </p>
      </div>
    </motion.div>
  );
}