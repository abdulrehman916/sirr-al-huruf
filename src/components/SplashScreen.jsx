import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Static particles ──────────────────────────────────────────────
const PARTICLES = Array.from({ length: 38 }, (_, i) => ({
  id: i,
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  size: 1 + Math.random() * 2.2,
  opacity: 0.12 + Math.random() * 0.35,
  dur: 3.5 + Math.random() * 5,
  delay: Math.random() * 4,
}));

// ── Calligraphy atmosphere ────────────────────────────────────────
const CHARS = [
  { char: "ب", top: "9%",  left: "8%",  size: 44, opacity: 0.03, dur: 14, delay: 0 },
  { char: "ح", top: "14%", left: "86%", size: 36, opacity: 0.025, dur: 18, delay: 2 },
  { char: "ن", top: "74%", left: "6%",  size: 52, opacity: 0.028, dur: 16, delay: 5 },
  { char: "ع", top: "78%", left: "84%", size: 40, opacity: 0.022, dur: 20, delay: 1 },
  { char: "م", top: "44%", left: "4%",  size: 34, opacity: 0.020, dur: 22, delay: 7 },
  { char: "ق", top: "42%", left: "90%", size: 42, opacity: 0.024, dur: 17, delay: 4 },
  { char: "ر", top: "88%", left: "44%", size: 50, opacity: 0.020, dur: 19, delay: 3 },
];

// ── Sacred geometry rings ─────────────────────────────────────────
const RINGS = [
  { r: 155, dur: 160, dir: 1,  dashed: true,  opacity: 0.22, width: 0.7 },
  { r: 115, dur: 110, dir: -1, dashed: false, opacity: 0.28, width: 0.5 },
  { r: 82,  dur:  75, dir: 1,  dashed: true,  opacity: 0.32, width: 0.6 },
  { r: 195, dur: 220, dir: -1, dashed: true,  opacity: 0.12, width: 0.5 },
];

// ── SVG Sacred Geometry ───────────────────────────────────────────
function SacredGeometry({ size = 320 }) {
  const cx = size / 2;
  const r1 = size * 0.30;  // outer hexagon
  const r2 = size * 0.20;  // inner hexagon

  const hexPoints = (cx, cy, r, offsetDeg = 0) =>
    Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i + (offsetDeg * Math.PI) / 180;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");

  return (
    <svg
      width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      className="absolute" style={{ top: 0, left: 0, pointerEvents: "none" }}
    >
      <defs>
        <radialGradient id="sg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0.28" />
          <stop offset="60%"  stopColor="#D4AF37" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.00" />
        </radialGradient>
      </defs>

      {/* Ambient glow fill */}
      <ellipse cx={cx} cy={cx} rx={r1 * 1.15} ry={r1 * 1.15} fill="url(#sg-glow)" />

      {/* Outer hexagon */}
      <polygon
        points={hexPoints(cx, cx, r1, 0)}
        fill="none"
        stroke="rgba(212,175,55,0.38)"
        strokeWidth="0.7"
      />
      {/* Inner hexagon rotated 30° */}
      <polygon
        points={hexPoints(cx, cx, r1, 30)}
        fill="none"
        stroke="rgba(212,175,55,0.30)"
        strokeWidth="0.6"
      />
      {/* Star of David lines */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i;
        const b = a + Math.PI;
        return (
          <line key={i}
            x1={cx + r1 * Math.cos(a)} y1={cx + r1 * Math.sin(a)}
            x2={cx + r1 * Math.cos(b)} y2={cx + r1 * Math.sin(b)}
            stroke="rgba(212,175,55,0.14)" strokeWidth="0.5"
          />
        );
      })}
      {/* Inner hexagon */}
      <polygon
        points={hexPoints(cx, cx, r2, 0)}
        fill="none"
        stroke="rgba(212,175,55,0.45)"
        strokeWidth="0.8"
      />
      {/* Innermost circle */}
      <circle cx={cx} cy={cx} r={size * 0.10} fill="none"
        stroke="rgba(212,175,55,0.35)" strokeWidth="0.6" />
      {/* Dot accents on outer hex vertices */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i;
        return (
          <circle key={i}
            cx={cx + r1 * Math.cos(a)} cy={cx + r1 * Math.sin(a)}
            r={1.5} fill="rgba(212,175,55,0.55)"
          />
        );
      })}
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState("in");  // in → hold → out
  const wheelSize = 320;

  useEffect(() => {
    // Hold for 2.2 s then exit
    const hold = setTimeout(() => setPhase("out"), 2200);
    return () => clearTimeout(hold);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {phase !== "out" && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(180deg,#020710 0%,#050d1a 35%,#08101f 70%,#0b1326 100%)",
            zIndex: 9999,
          }}
        >
          {/* ── Calligraphy atmosphere ── */}
          <div className="absolute inset-0 pointer-events-none" style={{ filter: "blur(1.5px)" }}>
            {CHARS.map((c, i) => (
              <motion.span key={i} className="absolute font-amiri select-none"
                style={{ top: c.top, left: c.left, fontSize: c.size, color: "#D4AF37", opacity: c.opacity }}
                animate={{ opacity: [c.opacity * 0.4, c.opacity, c.opacity * 0.4], y: [0, -10, 0] }}
                transition={{ duration: c.dur, repeat: Infinity, ease: "easeInOut", delay: c.delay }}
              >
                {c.char}
              </motion.span>
            ))}
          </div>

          {/* ── Gold dust particles ── */}
          <div className="absolute inset-0 pointer-events-none">
            {PARTICLES.map(p => (
              <motion.div key={p.id} className="absolute rounded-full"
                style={{
                  left: p.x, top: p.y, width: p.size, height: p.size,
                  background: "#D4AF37", opacity: p.opacity,
                }}
                animate={{ opacity: [p.opacity * 0.3, p.opacity, p.opacity * 0.3], y: [0, -18, 0] }}
                transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
              />
            ))}
          </div>

          {/* ── Light rays from center ── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {Array.from({ length: 10 }, (_, i) => (
              <motion.div key={i}
                style={{
                  position: "absolute",
                  width: 1,
                  height: "45vh",
                  background: "linear-gradient(to bottom, rgba(212,175,55,0.22), rgba(212,175,55,0.04), transparent)",
                  transformOrigin: "top center",
                  top: "50%", left: "50%", marginLeft: -0.5,
                  rotate: `${i * 36}deg`,
                }}
                animate={{ opacity: [0.25, 0.70, 0.25] }}
                transition={{ duration: 5 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.45 }}
              />
            ))}
          </div>

          {/* ── Center sigil area ── */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
            style={{ width: wheelSize, height: wheelSize }}
          >
            {/* Orbital rings */}
            {RINGS.map((ring, i) => (
              <motion.div key={i} className="absolute rounded-full"
                style={{
                  width: ring.r * 2, height: ring.r * 2,
                  border: `${ring.width}px ${ring.dashed ? "dashed" : "solid"} rgba(212,175,55,${ring.opacity})`,
                  boxShadow: `0 0 12px rgba(212,175,55,${ring.opacity * 0.45})`,
                }}
                animate={{ rotate: ring.dir * 360 }}
                transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
              />
            ))}

            {/* Sacred geometry SVG */}
            <SacredGeometry size={wheelSize} />

            {/* Central amber glow bloom */}
            <motion.div className="absolute rounded-full pointer-events-none"
              style={{
                width: 180, height: 180,
                background: "radial-gradient(circle,rgba(212,175,55,0.26) 0%,rgba(212,175,55,0.08) 40%,transparent 72%)",
                filter: "blur(22px)",
              }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.42, 0.88, 0.42] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Arabic "الله" */}
            <motion.span
              className="font-amiri font-bold absolute"
              style={{ fontSize: "3.8rem", color: "#D4AF37", lineHeight: 1, letterSpacing: "0.04em", zIndex: 10 }}
              animate={{
                textShadow: [
                  "0 0 12px rgba(212,175,55,0.52),0 0 32px rgba(212,175,55,0.72),0 0 70px rgba(212,175,55,0.24)",
                  "0 0 24px rgba(212,175,55,0.90),0 0 60px rgba(212,175,55,1.00),0 0 110px rgba(212,175,55,0.44)",
                  "0 0 12px rgba(212,175,55,0.52),0 0 32px rgba(212,175,55,0.72),0 0 70px rgba(212,175,55,0.24)",
                ],
                y: [0, -5, 0],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              الله
            </motion.span>
          </motion.div>

          {/* ── Logo text ── */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.72, ease: "easeOut" }}
            className="mt-4 text-center px-6"
          >
            <h1 className="font-amiri font-bold"
              style={{
                fontSize: "clamp(2.1rem,9vw,3.2rem)",
                color: "#f5ead4",
                letterSpacing: "0.025em",
                textShadow: "0 0 28px rgba(212,175,55,0.42),0 0 60px rgba(212,175,55,0.15),0 2px 14px rgba(0,0,0,0.65)",
                lineHeight: 1.1,
              }}>
              سرّ الحروف
            </h1>

            {/* Ornamental divider */}
            <motion.div
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: 0.75, duration: 0.7 }}
              className="flex items-center justify-center gap-2.5 mt-3"
            >
              <div style={{ width: 38, height: 0.5, background: "linear-gradient(to right,transparent,rgba(212,175,55,0.65))" }} />
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(212,175,55,0.60)", boxShadow: "0 0 5px rgba(212,175,55,0.80)" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", border: "1px solid rgba(212,175,55,0.52)", background: "rgba(212,175,55,0.10)", boxShadow: "0 0 8px rgba(212,175,55,0.38)" }} />
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(212,175,55,0.60)", boxShadow: "0 0 5px rgba(212,175,55,0.80)" }} />
              <div style={{ width: 38, height: 0.5, background: "linear-gradient(to left,transparent,rgba(212,175,55,0.65))" }} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.95, duration: 0.55 }}
              className="font-inter font-bold tracking-[0.36em] uppercase mt-2.5"
              style={{ fontSize: "clamp(8px,2vw,10.5px)", color: "rgba(212,175,55,0.78)" }}
            >
              Sirrul Huruf
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.10, duration: 0.55 }}
              className="font-inter tracking-[0.22em] uppercase mt-1"
              style={{ fontSize: "clamp(7px,1.6vw,9px)", color: "rgba(255,255,255,0.28)" }}
            >
              Ilm al-Huruf · علم الحروف
            </motion.p>
          </motion.div>

          {/* ── Loading dots ── */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.4 }}
            className="absolute bottom-12 flex gap-2"
          >
            {[0, 1, 2].map(i => (
              <motion.div key={i} className="rounded-full"
                style={{ width: 4, height: 4, background: "rgba(212,175,55,0.55)" }}
                animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.22 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}