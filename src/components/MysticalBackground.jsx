import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

// Arabic letters to dim-float in background
const BG_LETTERS = ["ب","ج","د","ه","و","ز","ح","ط","ي","ك","ل","م","ن","س","ع","ف","ص","ق","ر","ش","ت","ث","خ","ذ","ض","ظ","غ","ا"];

function randomBetween(a, b) { return a + Math.random() * (b - a); }

// Static data generated once
const STARS_DATA = Array.from({ length: 220 }, () => ({
  size: randomBetween(0.3, 3),
  top: `${randomBetween(0, 100)}%`,
  left: `${randomBetween(0, 100)}%`,
  opacity: randomBetween(0.06, 0.70),
  dur: randomBetween(2, 9),
  delay: randomBetween(0, 8),
  bright: Math.random() > 0.88,
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
      {/* Milky way diagonal band */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(125deg, transparent 20%, rgba(90,80,160,0.07) 40%, rgba(120,100,200,0.10) 50%, rgba(90,80,160,0.07) 60%, transparent 80%)",
        filter: "blur(35px)",
      }} />
      {/* Deep teal/blue galactic core */}
      <motion.div className="absolute"
        style={{ width: "80vw", height: "60vw", maxWidth: 900, top: "30%", left: "50%", transform: "translateX(-50%)", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(20,40,100,0.30) 0%, rgba(10,20,60,0.15) 50%, transparent 75%)", filter: "blur(55px)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Golden divine light from center-top */}
      <motion.div className="absolute"
        style={{ width: "50vw", height: "70vw", top: "-20%", left: "50%", transform: "translateX(-50%)", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(212,175,55,0.08) 0%, rgba(180,130,30,0.04) 45%, transparent 70%)", filter: "blur(50px)" }}
        animate={{ opacity: [0.4, 0.85, 0.4], scaleY: [1, 1.15, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Indigo nebula top-left */}
      <motion.div className="absolute"
        style={{ width: "55vw", height: "55vw", top: "-15%", left: "-15%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(60,50,180,0.14) 0%, rgba(30,20,100,0.07) 55%, transparent 75%)", filter: "blur(65px)" }}
        animate={{ x: [0, 25, 0], y: [0, 18, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Deep azure nebula bottom-right */}
      <motion.div className="absolute"
        style={{ width: "50vw", height: "50vw", bottom: "-10%", right: "-10%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,100,180,0.12) 0%, rgba(0,60,120,0.06) 55%, transparent 75%)", filter: "blur(60px)" }}
        animate={{ x: [0, -20, 0], y: [0, -18, 0], opacity: [0.35, 0.75, 0.35] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      />
      {/* Violet nebula top-right */}
      <motion.div className="absolute"
        style={{ width: "40vw", height: "40vw", top: "5%", right: "2%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(100,60,200,0.11) 0%, transparent 65%)", filter: "blur(55px)" }}
        animate={{ x: [0, -18, 0], y: [0, 22, 0], opacity: [0.30, 0.65, 0.30] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 9 }}
      />
      {/* Warm amber nebula bottom-left */}
      <motion.div className="absolute"
        style={{ width: "38vw", height: "38vw", bottom: "5%", left: "2%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(180,100,20,0.08) 0%, transparent 65%)", filter: "blur(50px)" }}
        animate={{ x: [0, 20, 0], y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
      {/* Fine cosmic dust haze */}
      <motion.div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 120% 80% at 50% 40%, rgba(30,20,80,0.18) 0%, transparent 65%)", filter: "blur(25px)" }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
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
        <motion.div key={i} className="absolute rounded-full"
          style={{
            width: s.size, height: s.size, top: s.top, left: s.left,
            background: s.bright ? "#fffbe8" : "#ffffff",
            boxShadow: s.bright ? `0 0 ${s.size * 3}px rgba(255,248,220,0.9)` : "none",
          }}
          animate={{ opacity: [s.opacity * 0.2, s.opacity, s.opacity * 0.2], scale: [1, s.bright ? 1.8 : 1.3, 1] }}
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
      style={{ background: "linear-gradient(180deg, #010308 0%, #030818 20%, #050d22 50%, #040a1c 75%, #020610 100%)" }}>
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