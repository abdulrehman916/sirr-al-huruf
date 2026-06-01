// ═══════════════════════════════════════════════════════════════
// AKRAM / HARF CONVERSION — Used ONLY by BastHuroofPage
// Fully isolated. No shared logic with any other engine.
// ═══════════════════════════════════════════════════════════════

import { motion } from "framer-motion";

// ── Palette ───────────────────────────────────────────────────
const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  faint:    "rgba(212,175,55,0.22)",
  bg:       "rgba(212,175,55,0.07)",
  bgHi:     "rgba(212,175,55,0.14)",
};

// ── Letter tables ─────────────────────────────────────────────
const UNITS    = { 1:'ا',2:'ب',3:'ج',4:'د',5:'ه',6:'و',7:'ز',8:'ح',9:'ط' };
const TENS     = { 10:'ي',20:'ك',30:'ل',40:'م',50:'ن',60:'س',70:'ع',80:'ف',90:'ص' };
const HUNDREDS = { 100:'ق',200:'ر',300:'ش',400:'ت',500:'ث',600:'خ',700:'ذ',800:'ض',900:'ظ' };

// ── Core algorithm ────────────────────────────────────────────
/**
 * AKRAM rule:
 *
 * For any number, extract its digits in place-value order
 * (units, tens, hundreds, thousands-group, ...).
 *
 * The thousands group works like this:
 *   - Write غ for the thousand marker
 *   - Then express how many thousands there are, using the
 *     SAME place-value cycle restarting from units:
 *       1000 → غ  (no extra digit — 1 is implicit)
 *       2000 → غ ب  (thousands=2 → unit 2)
 *       ...
 *       9000 → غ ط  (thousands=9 → unit 9)
 *      10000 → غ ي  (thousands=10 → ten 10)
 *     488000 → غ ح ف ت  (thousands=488 → 8 + 80 + 400)
 *
 * Reading order: units first → tens → hundreds → غ → thousands-units → ...
 * This matches the RTL letter output convention in the examples.
 */
export function toAkramPieces(n) {
  if (!n || n < 1) return [];

  n = Math.floor(n); // safety

  const unit = n % 10;
  const ten  = Math.floor(n / 10)  % 10 * 10;
  const hund = Math.floor(n / 100) % 10 * 100;
  const thou = Math.floor(n / 1000);           // how many full thousands

  const pieces = [];

  // 1. units place
  if (unit && UNITS[unit])     pieces.push({ value: unit, letter: UNITS[unit] });
  // 2. tens place
  if (ten  && TENS[ten])       pieces.push({ value: ten,  letter: TENS[ten]  });
  // 3. hundreds place
  if (hund && HUNDREDS[hund])  pieces.push({ value: hund, letter: HUNDREDS[hund] });

  // 4. thousands block
  if (thou > 0) {
    // Always write غ to mark the thousand boundary
    pieces.push({ value: 1000, letter: 'غ' });

    // Special rule: 1000 = غ alone — no extra letter for the implicit "1"
    // 2000+ = غ followed by the thousands-count expressed via the same cycle
    if (thou > 1) {
      const innerPieces = toAkramPieces(thou);
      pieces.push(...innerPieces);
    }
  }

  return pieces;
}



// ── Component ─────────────────────────────────────────────────
export default function AkramCard({ total, levelLabel, levelArabic }) {
  if (!total || total <= 0) return null;

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

      {/* Title */}
      <p className="font-inter text-[9px] uppercase tracking-[0.26em] text-center" style={{ color: G.dim }}>
        ✦ Akram / Harf — {levelLabel} — {levelArabic}
      </p>
      <div className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)" }} />

      {/* Bast value */}
      <div className="flex items-center justify-between px-2">
        <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.38)" }}>
          Bast Value
        </span>
        <span className="font-inter font-bold tabular-nums text-sm" style={{ color: G.text }}>
          {total.toLocaleString()}
        </span>
      </div>

      {/* Breakdown tiles */}
      <div className="space-y-1.5">
        <p className="font-inter text-[9px] uppercase tracking-widest px-2" style={{ color: "rgba(212,175,55,0.38)" }}>
          Akram Breakdown
        </p>
        <div className="flex flex-wrap gap-1.5 px-1">
          {pieces.map((p, i) => {
            const isGhain = p.letter === 'غ';
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="flex flex-col items-center rounded-xl border px-2.5 py-2 min-w-[46px]"
                style={{
                  background: isGhain ? G.bgHi : G.bg,
                  borderColor: isGhain ? G.borderHi : G.faint,
                }}
              >
                <span className="font-amiri text-xl leading-none mb-0.5" style={{ color: "#fff" }}>
                  {p.letter}
                </span>
                <span className="font-inter text-[10px] tabular-nums font-bold" style={{ color: G.dim }}>
                  {p.value.toLocaleString()}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent)" }} />

      {/* Akram letters */}
      <div className="space-y-2 text-center">
        <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.38)" }}>
          Akram Letters
        </p>
        <motion.p
          className="font-amiri font-bold leading-none"
          dir="rtl"
          style={{ fontSize: "clamp(2rem, 9vw, 3rem)", color: G.text }}
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