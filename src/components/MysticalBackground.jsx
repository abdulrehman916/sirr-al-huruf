import { motion, useTransform, useMotionValue } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import useMouseParallax from "../hooks/useMouseParallax";
import useIsMobile from "../hooks/useIsMobile";
import { useNavigation } from "../context/NavigationContext";

function randomBetween(a, b) { return a + Math.random() * (b - a); }

// Static data — generated once at module level
const STARS_NEAR = Array.from({ length: 60 }, () => ({
  size: randomBetween(0.8, 2.8),
  top: randomBetween(0, 100),
  left: randomBetween(0, 100),
  opacity: randomBetween(0.35, 0.85),
  dur: randomBetween(2, 6),
  delay: randomBetween(0, 7),
}));

const STARS_FAR = Array.from({ length: 100 }, () => ({
  size: randomBetween(0.3, 1.4),
  top: randomBetween(0, 100),
  left: randomBetween(0, 100),
  opacity: randomBetween(0.08, 0.40),
  dur: randomBetween(4, 12),
  delay: randomBetween(0, 12),
}));

const DUST = Array.from({ length: 18 }, () => ({
  size: randomBetween(1, 2.8),
  startX: randomBetween(10, 90),
  startY: randomBetween(25, 85),
  driftX: randomBetween(-50, 50),
  driftY: randomBetween(-70, -160),
  dur: randomBetween(14, 30),
  delay: randomBetween(0, 22),
  opacity: randomBetween(0.18, 0.55),
}));

const EDGE_STARS = Array.from({ length: 28 }, (_, i) => {
  const side = i % 4;
  return {
    top: side === 0 ? randomBetween(0, 18) : side === 1 ? randomBetween(82, 100) : randomBetween(0, 100),
    left: side === 2 ? randomBetween(0, 14) : side === 3 ? randomBetween(86, 100) : randomBetween(0, 100),
    size: randomBetween(0.8, 2.2),
    opacity: randomBetween(0.25, 0.65),
    dur: randomBetween(2.5, 7),
    delay: randomBetween(0, 8),
  };
});

const COSMIC_PARTICLES = Array.from({ length: 30 }, () => ({
  size: randomBetween(0.5, 1.6),
  top: randomBetween(0, 100),
  left: randomBetween(0, 100),
  driftX: randomBetween(-18, 18),
  driftY: randomBetween(-25, 10),
  dur: randomBetween(18, 45),
  delay: randomBetween(0, 30),
  opacity: randomBetween(0.06, 0.22),
}));

const BG_LETTERS = ["ب","ح","ط","ي","ل","م","ن","ع","ف","ص","ق","ر","ش","و","ك","ذ","غ","ا"];
const BG_LETTER_DATA = Array.from({ length: 10 }, (_, i) => ({
  char: BG_LETTERS[i % BG_LETTERS.length],
  top: randomBetween(5, 90),
  left: randomBetween(3, 93),
  size: randomBetween(22, 65),
  opacity: randomBetween(0.018, 0.055),
  dur: randomBetween(10, 22),
  delay: randomBetween(0, 12),
}));

const GEO = [
  { r: 420, sides: 6, opacity: 0.045, dur: 100, dir: 1 },
  { r: 310, sides: 8, opacity: 0.050, dur: 75, dir: -1 },
  { r: 145, sides: 6, opacity: 0.060, dur: 38, dir: -1 },
];

function polygon(cx, cy, r, sides) {
  const pts = [];
  for (let i = 0; i <= sides; i++) {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return pts.join(" ");
}

/* ── GPU-accelerated star field ── */
function StarField({ mouse, paused, isMobile }) {
  const count = isMobile ? STARS_FAR.slice(0, 60) : STARS_FAR;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ willChange: "transform", transform: "translateZ(0)" }}>
      {count.map((s, i) => (
        <motion.div key={`f${i}`}
          className="absolute rounded-full"
          style={{
            width: s.size, height: s.size,
            top: `${s.top}%`, left: `${s.left}%`,
            background: "#ffffff",
            willChange: "opacity",
            x: mouse.x * -4,
            y: mouse.y * -4,
          }}
          animate={paused ? {} : { opacity: [s.opacity * 0.3, s.opacity, s.opacity * 0.3] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        />
      ))}
      {(isMobile ? STARS_NEAR.slice(0, 40) : STARS_NEAR).map((s, i) => (
        <motion.div key={`n${i}`}
          className="absolute rounded-full"
          style={{
            width: s.size, height: s.size,
            top: `${s.top}%`, left: `${s.left}%`,
            background: i % 7 === 0 ? "#fffbe8" : "#ffffff",
            boxShadow: i % 7 === 0 ? `0 0 ${s.size * 3}px rgba(255,248,220,0.8)` : "none",
            willChange: "opacity, transform",
            x: mouse.x * (isMobile ? -5 : -10),
            y: mouse.y * (isMobile ? -5 : -10),
          }}
          animate={paused ? {} : { opacity: [s.opacity * 0.2, s.opacity, s.opacity * 0.2], scale: [1, i % 7 === 0 ? 1.7 : 1.2, 1] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        />
      ))}
    </div>
  );
}

/* ── Nebula atmosphere — reduced blur on mobile ── */
function NebulaLayers({ mouse, paused, isMobile }) {
  const blurScale = isMobile ? 0.8 : 1;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ willChange: "transform", transform: "translateZ(0)" }}>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(125deg, transparent 20%, rgba(80,70,150,0.06) 40%, rgba(110,90,190,0.09) 50%, rgba(80,70,150,0.06) 60%, transparent 80%)",
        filter: `blur(${40 * blurScale}px)`,
      }} />
      <motion.div className="absolute"
        style={{
          width: "80vw", height: "60vw", maxWidth: 900,
          top: "30%", left: "50%", transform: "translateX(-50%)",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(15,35,90,0.28) 0%, rgba(8,18,55,0.13) 50%, transparent 75%)",
          filter: `blur(${60 * blurScale}px)`,
          willChange: "transform, opacity",
          x: mouse.x * (isMobile ? -8 : -18),
          y: mouse.y * (isMobile ? -5 : -12),
        }}
        animate={paused ? {} : { scale: [1, 1.06, 1], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="absolute"
        style={{
          width: "50vw", height: "65vw",
          top: "-18%", left: "50%", transform: "translateX(-50%)",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, rgba(180,130,30,0.03) 45%, transparent 70%)",
          filter: `blur(${55 * blurScale}px)`,
          willChange: "opacity",
          x: mouse.x * (isMobile ? -4 : -8),
          y: mouse.y * (isMobile ? -4 : -8),
        }}
        animate={paused ? {} : { opacity: [0.35, 0.80, 0.35], scaleY: [1, 1.12, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      {!isMobile && (
        <>
          <motion.div className="absolute"
            style={{
              width: "55vw", height: "55vw",
              top: "-15%", left: "-15%",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(55,45,170,0.12) 0%, rgba(25,18,90,0.06) 55%, transparent 75%)",
              filter: "blur(70px)",
              willChange: "transform, opacity",
              x: mouse.x * -22, y: mouse.y * -16,
            }}
            animate={paused ? {} : { x: [0, 20, 0], y: [0, 15, 0], opacity: [0.45, 0.85, 0.45] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div className="absolute"
            style={{
              width: "50vw", height: "50vw",
              bottom: "-10%", right: "-10%",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(0,90,165,0.10) 0%, rgba(0,55,110,0.05) 55%, transparent 75%)",
              filter: "blur(65px)",
              willChange: "opacity",
              x: mouse.x * -14, y: mouse.y * -10,
            }}
            animate={paused ? {} : { opacity: [0.30, 0.70, 0.30] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          />
        </>
      )}
    </div>
  );
}

/* ── Edge stars ── */
function EdgeStars({ paused }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ transform: "translateZ(0)" }}>
      {EDGE_STARS.map((s, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: s.size, height: s.size,
            top: `${s.top}%`, left: `${s.left}%`,
            background: i % 5 === 0 ? "#fffbe8" : "#ffffff",
            boxShadow: i % 5 === 0 ? `0 0 ${s.size * 4}px rgba(255,248,220,0.7)` : "none",
            willChange: "opacity",
          }}
          animate={paused ? {} : { opacity: [s.opacity * 0.2, s.opacity, s.opacity * 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        />
      ))}
    </div>
  );
}

/* ── Cosmic micro-particles — skip on mobile ── */
function CosmicParticles({ paused }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ transform: "translateZ(0)" }}>
      {COSMIC_PARTICLES.map((p, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            top: `${p.top}%`, left: `${p.left}%`,
            background: i % 5 === 0 ? "#D4AF37" : "#c8d8f0",
            opacity: p.opacity,
            willChange: "transform, opacity",
          }}
          animate={paused ? {} : { x: [0, p.driftX, 0], y: [0, p.driftY, 0], opacity: [p.opacity * 0.3, p.opacity, p.opacity * 0.3] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </div>
  );
}

/* ── Gold dust — reduced count on mobile ── */
function GoldDust({ paused, isMobile }) {
  const items = isMobile ? DUST.slice(0, 8) : DUST;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ transform: "translateZ(0)" }}>
      {items.map((d, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: d.size, height: d.size,
            left: `${d.startX}%`, top: `${d.startY}%`,
            background: "#D4AF37",
            boxShadow: `0 0 ${d.size * 3}px rgba(212,175,55,0.55)`,
            willChange: "transform, opacity",
          }}
          animate={paused ? {} : { x: d.driftX, y: d.driftY, opacity: [0, d.opacity, d.opacity * 0.5, 0] }}
          transition={{ duration: d.dur, repeat: Infinity, ease: "easeOut", delay: d.delay, repeatDelay: randomBetween(3, 10) }}
        />
      ))}
    </div>
  );
}

/* ── Background letters ── */
function BackgroundLetters({ mouse, paused, isMobile }) {
  const items = isMobile ? BG_LETTER_DATA.slice(0, 6) : BG_LETTER_DATA;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ filter: "blur(1.5px)", transform: "translateZ(0)" }}>
      {items.map((l, i) => (
        <motion.span key={i}
          className="absolute font-amiri select-none"
          style={{
            top: `${l.top}%`, left: `${l.left}%`,
            fontSize: l.size,
            color: "#D4AF37",
            opacity: l.opacity,
            willChange: "transform, opacity",
            x: mouse.x * -6,
            y: mouse.y * -6,
          }}
          animate={paused ? {} : { opacity: [l.opacity * 0.4, l.opacity, l.opacity * 0.4], y: [0, -10, 0] }}
          transition={{ duration: l.dur, repeat: Infinity, ease: "easeInOut", delay: l.delay }}
        >
          {l.char}
        </motion.span>
      ))}
    </div>
  );
}

/* ── Sacred geometry background ── */
function SacredGeoBg({ mouse, paused, isMobile }) {
  const cx = 400, cy = 400;
  const geos = isMobile ? GEO.slice(0, 2) : GEO;
  return (
    <motion.div className="absolute inset-0"
      style={{ x: mouse.x * -6, y: mouse.y * -6, willChange: "transform", transform: "translateZ(0)" }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="bgGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {geos.map((g, i) => (
          <motion.polyline key={i}
            points={polygon(cx, cy, g.r, g.sides)}
            fill="none" stroke="#D4AF37" strokeWidth="0.5"
            strokeOpacity={g.opacity}
            filter="url(#bgGlow)"
            style={{ originX: "400px", originY: "400px" }}
            animate={paused ? {} : { rotate: g.dir * 360 }}
            transition={{ duration: g.dur, repeat: Infinity, ease: "linear" }}
          />
        ))}
        {[0, 30, 60, 90, 120, 150].map((angle, i) => (
          <line key={`cl-${i}`}
            x1={cx + Math.cos((angle * Math.PI) / 180) * 420}
            y1={cy + Math.sin((angle * Math.PI) / 180) * 420}
            x2={cx - Math.cos((angle * Math.PI) / 180) * 420}
            y2={cy - Math.sin((angle * Math.PI) / 180) * 420}
            stroke="#D4AF37" strokeWidth="0.35" strokeOpacity="0.032"
          />
        ))}
      </svg>
    </motion.div>
  );
}

/* ── Light rays — skip on mobile ── */
function LightRays({ mouse, paused }) {
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ x: mouse.x * 4, y: mouse.y * 4, willChange: "transform", transform: "translateZ(0)" }}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * 360;
        return (
          <motion.div key={i}
            className="absolute"
            style={{
              width: 1.5, height: "50vh",
              background: "linear-gradient(to bottom, rgba(212,175,55,0.14), transparent)",
              transformOrigin: "top center",
              top: "50%", left: "50%",
              marginLeft: -0.75,
              rotate: `${angle}deg`,
              willChange: "opacity",
            }}
            animate={paused ? {} : { opacity: [0.25, 0.60, 0.25] }}
            transition={{ duration: 6 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 }}
          />
        );
      })}
    </motion.div>
  );
}

// Zero-value static MotionValues for mobile — no parallax, no rAF
const ZERO_MV = { x: { get: () => 0, on: () => () => {} }, y: { get: () => 0, on: () => () => {} } };

export default function MysticalBackground() {
  const isMobile = useIsMobile();
  // On mobile: useMouseParallax returns zero MotionValues (no rAF runs)
  // On desktop: returns live MotionValues driven by mousemove
  const { x: mouseX, y: mouseY } = useMouseParallax(1);
  const { isNavigating } = useNavigation();

  // Build a mouse-like object for child components that still use mouse.x/mouse.y
  // These are MotionValues — passed as `x`/`y` props to motion.div, no re-renders
  const mouse = { x: mouseX, y: mouseY };

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #010308 0%, #020a18 18%, #050d22 50%, #040a1c 75%, #020610 100%)",
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <StarField mouse={mouse} paused={isNavigating} isMobile={isMobile} />
      <NebulaLayers mouse={mouse} paused={isNavigating} isMobile={isMobile} />
      <BackgroundLetters mouse={mouse} paused={isNavigating} isMobile={isMobile} />
      <SacredGeoBg mouse={mouse} paused={isNavigating} isMobile={isMobile} />
      {!isMobile && <LightRays mouse={mouse} paused={isNavigating} />}
      {!isMobile && <CosmicParticles paused={isNavigating} />}
      <GoldDust paused={isNavigating} isMobile={isMobile} />
      <EdgeStars paused={isNavigating} />

      {/* Cinematic corner vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 35%, rgba(1,3,8,0.72) 100%)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 45% 45% at 0% 0%, rgba(0,0,0,0.55) 0%, transparent 60%),
          radial-gradient(ellipse 45% 45% at 100% 0%, rgba(0,0,0,0.55) 0%, transparent 60%),
          radial-gradient(ellipse 45% 45% at 0% 100%, rgba(0,0,0,0.55) 0%, transparent 60%),
          radial-gradient(ellipse 45% 45% at 100% 100%, rgba(0,0,0,0.55) 0%, transparent 60%)
        `,
      }} />
    </div>
  );
}