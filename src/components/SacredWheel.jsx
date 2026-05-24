import { motion, useAnimationFrame } from "framer-motion";
import { useState } from "react";

const GOLD = "#D4AF37";
const G = (o) => `rgba(212,175,55,${o})`;

const CX = 260, CY = 260, SIZE = 520;

// الله stays at the center (rendered in Home.jsx), these 8 orbit inside
const ASMA = [
  "الرحمن","الرحيم","الملك","القدوس","السلام","العزيز","الجبار","النور"
];

function pt(cx, cy, r, angleDeg) {
  const a = (angleDeg - 90) * (Math.PI / 180);
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
}

function regularPolygon(cx, cy, r, n, rotDeg = 0) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const [x, y] = pt(cx, cy, r, (i / n) * 360 + rotDeg);
    return `${x},${y}`;
  }).join(" ");
}

/* ── SVG Defs ── */
function Defs() {
  return (
    <defs>
      <filter id="sg" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="cg" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="7" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <radialGradient id="aura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.16" />
        <stop offset="55%" stopColor={GOLD} stopOpacity="0.04" />
        <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.40" />
        <stop offset="60%" stopColor={GOLD} stopOpacity="0.07" />
        <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/* ── Breathing aura ── */
function AuraLayers() {
  return (
    <>
      <motion.circle cx={CX} cy={CY} r={248} fill="url(#aura)"
        animate={{ r: [248, 260, 248], opacity: [0.55, 0.90, 0.55] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle cx={CX} cy={CY} r={65} fill="url(#core)"
        animate={{ r: [65, 78, 65], opacity: [0.45, 0.85, 0.45] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

/* ── Outer decorative ring (NO text — text is HTML overlay) ── */
function OuterRing() {
  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: 360 }}
      transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
    >
      {/* Outer border */}
      <circle cx={CX} cy={CY} r={228} fill="none" stroke={GOLD}
        strokeWidth="1.4" strokeOpacity="0.48" filter="url(#sg)" />
      <circle cx={CX} cy={CY} r={220} fill="none" stroke={GOLD}
        strokeWidth="0.4" strokeOpacity="0.18" />

      {/* 12 evenly spaced gem nodes */}
      {Array.from({ length: 12 }, (_, i) => {
        const [x, y] = pt(CX, CY, 228, (i / 12) * 360);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={3.5} fill={GOLD} fillOpacity="0.14"
              stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.60" filter="url(#sg)" />
            <circle cx={x} cy={y} r={1.4} fill={GOLD} fillOpacity="0.88" />
          </g>
        );
      })}
    </motion.g>
  );
}

/* ── Middle hexagram ring ── */
function MiddleRing() {
  const hex1 = regularPolygon(CX, CY, 158, 6, 0);
  const hex2 = regularPolygon(CX, CY, 158, 6, 30);

  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: -360 }}
      transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={CX} cy={CY} r={164} fill="none" stroke={GOLD}
        strokeWidth="1.1" strokeOpacity="0.38" filter="url(#sg)" />

      <polyline points={hex1} fill="none" stroke={GOLD} strokeWidth="0.65" strokeOpacity="0.25" />
      <polyline points={hex2} fill="none" stroke={GOLD} strokeWidth="0.65" strokeOpacity="0.25" />

      {/* 6 clean nodes at hexagram points */}
      {Array.from({ length: 6 }, (_, i) => {
        const [x, y] = pt(CX, CY, 164, (i / 6) * 360);
        return <circle key={i} cx={x} cy={y} r={2.2} fill={GOLD} fillOpacity="0.70" filter="url(#sg)" />;
      })}
    </motion.g>
  );
}

/* ── Inner 8-fold ring ── */
function InnerRing() {
  const sq1 = regularPolygon(CX, CY, 104, 4, 0);
  const sq2 = regularPolygon(CX, CY, 104, 4, 45);

  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: 360 }}
      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={CX} cy={CY} r={110} fill="none" stroke={GOLD}
        strokeWidth="1" strokeOpacity="0.42" filter="url(#sg)" />

      <polyline points={sq1} fill="none" stroke={GOLD} strokeWidth="0.55" strokeOpacity="0.28" />
      <polyline points={sq2} fill="none" stroke={GOLD} strokeWidth="0.55" strokeOpacity="0.28" />

      {/* 8 small gems */}
      {Array.from({ length: 8 }, (_, i) => {
        const [x, y] = pt(CX, CY, 110, (i / 8) * 360);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={3} fill={GOLD} fillOpacity="0.14"
              stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.55" />
            <circle cx={x} cy={y} r={1.2} fill={GOLD} fillOpacity="0.88" />
          </g>
        );
      })}
    </motion.g>
  );
}

/* ── Core halo (around Allah calligraphy) ── */
function CoreHalo() {
  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: -360 }}
      transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={CX} cy={CY} r={62} fill="none" stroke={GOLD}
        strokeWidth="1.1" strokeOpacity="0.50" filter="url(#cg)" />
      <circle cx={CX} cy={CY} r={52} fill="none" stroke={GOLD}
        strokeWidth="0.4" strokeOpacity="0.22" strokeDasharray="3,7" />

      {/* 6 petal gems */}
      {Array.from({ length: 6 }, (_, i) => {
        const [x, y] = pt(CX, CY, 62, (i / 6) * 360);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={2.5} fill={GOLD} fillOpacity="0.18"
              stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.60" />
            <circle cx={x} cy={y} r={1} fill={GOLD} fillOpacity="0.92" />
          </g>
        );
      })}
    </motion.g>
  );
}

/* ── SVG Seal ── */
function SigilSVG() {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{
        position: "absolute",
        width: SIZE, height: SIZE,
        left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        overflow: "visible",
      }}
    >
      <Defs />
      <AuraLayers />
      <OuterRing />
      <MiddleRing />
      <InnerRing />
      <CoreHalo />
    </svg>
  );
}

/* ── Asma ul Husna — 3D celestial orbit INSIDE the seal ── */
// Orbit sits between inner ring (r=110) and middle ring (r=164) in SVG space.
// SVG viewBox=520, container=500px → scale factor = 500/520
// Orbit radius in SVG units: 136. In px: 136 * (500/520) ≈ 130.8px
// Tilted ellipse gives 3D depth: rY = rX * 0.30
function AsmaNames({ containerSize }) {
  const half = containerSize / 2;
  const SVG_SCALE = containerSize / SIZE; // 500/520
  const rX = 136 * SVG_SCALE;   // ~130px — between inner & middle ring
  const rY = rX * 0.30;          // tilt compression
  const ORBIT_DURATION = 100;    // seconds per revolution — slow, celestial

  const [positions, setPositions] = useState(() =>
    ASMA.map((_, i) => ({ x: half, y: half, depth: 0 }))
  );

  useAnimationFrame((t) => {
    const elapsed = (t / 1000) / ORBIT_DURATION;
    setPositions(ASMA.map((_, i) => {
      const baseAngle = (i / ASMA.length) * Math.PI * 2;
      const angle = baseAngle + elapsed * Math.PI * 2;
      const ox = Math.cos(angle) * rX;
      const oy = Math.sin(angle) * rY;
      const depth = Math.sin(angle); // +1 front, -1 back
      return { x: half + ox, y: half + oy, depth };
    }));
  });

  // Sort so front names render on top
  const sorted = positions
    .map((p, i) => ({ ...p, name: ASMA[i], i }))
    .sort((a, b) => a.depth - b.depth);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {sorted.map(({ name, x, y, depth, i }) => {
        // depth: -1 (back) → +1 (front)
        const t = (depth + 1) / 2; // normalise 0..1

        // Scale: back=0.68, front=1.05
        const scale = 0.68 + t * 0.37;
        // Opacity: back=0.20, front=0.95
        const opacity = 0.20 + t * 0.75;
        // Blur: back softens, front is crisp
        const blur = (1 - t) * 1.4;
        const brightness = 68 + t * 32;
        const gInner = G((0.20 + t * 0.60).toFixed(2));
        const gOuter = G((0.08 + t * 0.38).toFixed(2));
        const shadowY = (1 - t) * 1.5;

        return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
              zIndex: Math.round(t * 10) + 6,
              willChange: "transform, opacity",
            }}
          >
            {/* Soft aura halo */}
            <div style={{
              position: "absolute",
              inset: "-6px -10px",
              borderRadius: "50%",
              background: `radial-gradient(ellipse, ${gOuter} 0%, transparent 72%)`,
              filter: `blur(${3 + t * 5}px)`,
              opacity: 0.5 + t * 0.5,
              pointerEvents: "none",
            }} />

            {/* The divine name */}
            <span style={{
              fontFamily: "'Amiri', serif",
              fontWeight: "700",
              fontSize: "11.5px",
              color: `hsl(43, ${52 + t * 28}%, ${52 + t * 22}%)`,
              textShadow: [
                `0 ${shadowY}px ${2 + t * 5}px ${gInner}`,
                `0 0 ${10 + t * 18}px ${gOuter}`,
              ].join(", "),
              whiteSpace: "nowrap",
              display: "block",
              letterSpacing: "0.04em",
              direction: "rtl",
              filter: blur > 0.3 ? `blur(${blur}px) brightness(${brightness}%)` : `brightness(${brightness}%)`,
              position: "relative",
              zIndex: 1,
            }}>
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Gentle orbiting dust ── */
function GoldenDust({ containerSize }) {
  const half = containerSize / 2;
  const particles = Array.from({ length: 12 }, (_, i) => ({
    orbitR: [220, 164, 110][i % 3],
    offset: i / 12,
    size: i % 3 === 0 ? 2 : 1.3,
    duration: 70 + i * 6,
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 3 }}>
      {particles.map((p, i) => (
        <motion.div key={i}
          style={{
            position: "absolute",
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: GOLD,
            boxShadow: `0 0 ${p.size * 5}px ${G("0.85")}`,
            top: "50%", left: "50%",
            marginTop: -p.size / 2, marginLeft: -p.size / 2,
          }}
          animate={{
            x: Array.from({ length: 60 }, (_, t) => {
              const a = ((t / 60) + p.offset) * Math.PI * 2 - Math.PI / 2;
              return Math.cos(a) * p.orbitR;
            }),
            y: Array.from({ length: 60 }, (_, t) => {
              const a = ((t / 60) + p.offset) * Math.PI * 2 - Math.PI / 2;
              return Math.sin(a) * p.orbitR;
            }),
            opacity: [0.25, 0.80, 0.25],
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

/* ── Main export ── */
export default function SacredWheel() {
  const containerSize = 500;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: containerSize, height: containerSize }}
    >
      {/* Outer atmospheric glow — soft, not overwhelming */}
      <div style={{
        position: "absolute",
        width: containerSize + 60,
        height: containerSize + 60,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${G("0.09")} 0%, ${G("0.03")} 50%, transparent 72%)`,
        filter: "blur(35px)",
      }} />

      <SigilSVG />
      <GoldenDust containerSize={containerSize} />
      <AsmaNames containerSize={containerSize} />
    </div>
  );
}