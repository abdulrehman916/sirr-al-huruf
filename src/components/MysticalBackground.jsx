import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

// Arabic letters to dim-float in background
const BG_LETTERS = ["ب","ج","د","ه","و","ز","ح","ط","ي","ك","ل","م","ن","س","ع","ف","ص","ق","ر","ش","ت","ث","خ","ذ","ض","ظ","غ","ا"];

function randomBetween(a, b) { return a + Math.random() * (b - a); }

// Static data generated once
const STARS_DATA = Array.from({ length: 120 }, () => ({
  size: randomBetween(0.5, 2.5),
  top: `${randomBetween(0, 100)}%`,
  left: `${randomBetween(0, 100)}%`,
  opacity: randomBetween(0.08, 0.55),
  dur: randomBetween(2.5, 7),
  delay: randomBetween(0, 6),
}));

const DUST_DATA = Array.from({ length: 40 }, () => ({
  size: randomBetween(1, 3.5),
  startX: randomBetween(5, 95),
  startY: randomBetween(20, 90),
  driftX: randomBetween(-60, 60),
  driftY: randomBetween(-80, -180),
  dur: randomBetween(12, 28),
  delay: randomBetween(0, 20),
  opacity: randomBetween(0.2, 0.6),
}));

const BG_LETTER_DATA = Array.from({ length: 18 }, (_, i) => ({
  char: BG_LETTERS[i % BG_LETTERS.length],
  top: `${randomBetween(5, 90)}%`,
  left: `${randomBetween(3, 93)}%`,
  size: randomBetween(24, 72),
  opacity: randomBetween(0.02, 0.07),
  dur: randomBetween(8, 20),
  delay: randomBetween(0, 10),
}));

const GEOMETRY_LINES = [
  // outer polygon rings
  { r: 420, sides: 6, opacity: 0.055, dur: 90, dir: 1 },
  { r: 310, sides: 8, opacity: 0.06, dur: 70, dir: -1 },
  { r: 220, sides: 12, opacity: 0.07, dur: 50, dir: 1 },
  { r: 145, sides: 6, opacity: 0.08, dur: 35, dir: -1 },
];

function polygon(cx, cy, r, sides) {
  const pts = [];
  for (let i = 0; i <= sides; i++) {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return pts.join(" ");
}

function SacredGeometrySVG() {
  const cx = 400, cy = 400;
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 1 }}>
      <defs>
        <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {GEOMETRY_LINES.map((g, i) => (
        <motion.polyline key={i}
          points={polygon(cx, cy, g.r, g.sides)}
          fill="none" stroke="#D4AF37" strokeWidth="0.6"
          strokeOpacity={g.opacity}
          filter="url(#glow)"
          style={{ originX: "400px", originY: "400px" }}
          animate={{ rotate: g.dir * 360 }}
          transition={{ duration: g.dur, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {/* Cross-lines inside the geometry */}
      {[0,30,60,90,120,150].map((angle, i) => (
        <motion.line key={`cl-${i}`}
          x1={cx + Math.cos((angle * Math.PI) / 180) * 420}
          y1={cy + Math.sin((angle * Math.PI) / 180) * 420}
          x2={cx - Math.cos((angle * Math.PI) / 180) * 420}
          y2={cy - Math.sin((angle * Math.PI) / 180) * 420}
          stroke="#D4AF37" strokeWidth="0.4" strokeOpacity="0.04"
        />
      ))}
    </svg>
  );
}

function LightRays() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360;
        return (
          <motion.div key={i}
            className="absolute"
            style={{
              width: 2,
              height: "55vh",
              background: "linear-gradient(to bottom, rgba(212,175,55,0.18), transparent)",
              transformOrigin: "top center",
              top: "50%",
              left: "50%",
              rotate: `${angle}deg`,
              marginLeft: -1,
            }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          />
        );
      })}
    </div>
  );
}

function NebulaLayers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Central golden nebula */}
      <motion.div className="absolute"
        style={{ width: "70vw", height: "70vw", maxWidth: 700, maxHeight: 700, top: "50%", left: "50%", transform: "translate(-50%, -50%)", borderRadius: "50%", background: "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.09) 0%, rgba(139,90,0,0.05) 40%, transparent 70%)", filter: "blur(40px)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Indigo nebula top-left */}
      <motion.div className="absolute"
        style={{ width: "50vw", height: "50vw", top: "-10%", left: "-10%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(79,70,229,0.12) 0%, transparent 65%)", filter: "blur(60px)" }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Cyan nebula bottom-right */}
      <motion.div className="absolute"
        style={{ width: "45vw", height: "45vw", bottom: "-5%", right: "-5%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(6,182,212,0.09) 0%, transparent 65%)", filter: "blur(55px)" }}
        animate={{ x: [0, -25, 0], y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
      {/* Deep purple nebula top-right */}
      <motion.div className="absolute"
        style={{ width: "35vw", height: "35vw", top: "10%", right: "5%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(139,92,246,0.10) 0%, transparent 65%)", filter: "blur(50px)" }}
        animate={{ x: [0, -20, 0], y: [0, 25, 0], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      />
      {/* Fog / smoke layers */}
      <motion.div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(15,20,50,0.3) 0%, transparent 50%, rgba(10,16,40,0.25) 100%)", filter: "blur(20px)" }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function GoldDust() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {DUST_DATA.map((d, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{ width: d.size, height: d.size, left: `${d.startX}%`, top: `${d.startY}%`, background: "#D4AF37", boxShadow: `0 0 ${d.size * 2}px rgba(212,175,55,0.6)` }}
          animate={{ x: d.driftX, y: d.driftY, opacity: [0, d.opacity, d.opacity * 0.6, 0] }}
          transition={{ duration: d.dur, repeat: Infinity, ease: "easeOut", delay: d.delay, repeatDelay: randomBetween(2, 8) }}
        />
      ))}
    </div>
  );
}

function StarField() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {STARS_DATA.map((s, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{ width: s.size, height: s.size, top: s.top, left: s.left }}
          animate={{ opacity: [s.opacity * 0.3, s.opacity, s.opacity * 0.3], scale: [1, 1.5, 1] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        />
      ))}
    </div>
  );
}

function BackgroundArabicLetters() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ filter: "blur(1px)" }}>
      {BG_LETTER_DATA.map((l, i) => (
        <motion.span key={i}
          className="absolute font-amiri select-none"
          style={{ top: l.top, left: l.left, fontSize: l.size, color: "#D4AF37", opacity: l.opacity }}
          animate={{ opacity: [l.opacity * 0.4, l.opacity, l.opacity * 0.4], y: [0, -12, 0] }}
          transition={{ duration: l.dur, repeat: Infinity, ease: "easeInOut", delay: l.delay }}
        >
          {l.char}
        </motion.span>
      ))}
    </div>
  );
}

export default function MysticalBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #02060f 0%, #050d1a 30%, #080f20 60%, #060c1a 100%)" }}>
      <StarField />
      <NebulaLayers />
      <BackgroundArabicLetters />
      <SacredGeometrySVG />
      <LightRays />
      <GoldDust />
      {/* Final depth vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(2,6,15,0.65) 100%)" }} />
    </div>
  );
}