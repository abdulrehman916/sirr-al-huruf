import { motion, useAnimationFrame } from "framer-motion";
import { useState } from "react";
import useMouseParallax from "../hooks/useMouseParallax";

const GOLD = "#D4AF37";
const G = (o) => `rgba(212,175,55,${o})`;

const CX = 260, CY = 260, SIZE = 520;

// 8 divine names orbit in the large sacred zone
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
        <feGaussianBlur stdDeviation="2.5" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="cg" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="6" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="bloom" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="10" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <radialGradient id="aura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.14" />
        <stop offset="55%" stopColor={GOLD} stopOpacity="0.04" />
        <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.38" />
        <stop offset="60%" stopColor={GOLD} stopOpacity="0.07" />
        <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
      </radialGradient>
      {/* Soft bloom ring for outer circle */}
      <radialGradient id="outerBloom" cx="50%" cy="50%" r="50%">
        <stop offset="75%" stopColor={GOLD} stopOpacity="0" />
        <stop offset="90%" stopColor={GOLD} stopOpacity="0.08" />
        <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/* ── Breathing aura ── */
function AuraLayers() {
  return (
    <>
      {/* Outer golden bloom */}
      <motion.circle cx={CX} cy={CY} r={240} fill="url(#outerBloom)"
        animate={{ r: [238, 252, 238], opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle cx={CX} cy={CY} r={248} fill="url(#aura)"
        animate={{ r: [248, 262, 248], opacity: [0.50, 0.88, 0.50] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle cx={CX} cy={CY} r={65} fill="url(#core)"
        animate={{ r: [65, 80, 65], opacity: [0.42, 0.82, 0.42] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

/* ── BACKGROUND depth layer — outermost ring, slowest parallax ── */
function OuterRing() {
  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: 360 }}
      transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
    >
      {/* Double ring border */}
      <circle cx={CX} cy={CY} r={228} fill="none" stroke={GOLD}
        strokeWidth="1.4" strokeOpacity="0.45" filter="url(#sg)" />
      <circle cx={CX} cy={CY} r={220} fill="none" stroke={GOLD}
        strokeWidth="0.4" strokeOpacity="0.16" />
      {/* Soft bloom halo on outer ring */}
      <circle cx={CX} cy={CY} r={228} fill="none" stroke={GOLD}
        strokeWidth="6" strokeOpacity="0.04" filter="url(#bloom)" />

      {/* 12 gem nodes */}
      {Array.from({ length: 12 }, (_, i) => {
        const [x, y] = pt(CX, CY, 228, (i / 12) * 360);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={3.5} fill={GOLD} fillOpacity="0.12"
              stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.55" filter="url(#sg)" />
            <circle cx={x} cy={y} r={1.4} fill={GOLD} fillOpacity="0.85" />
          </g>
        );
      })}
    </motion.g>
  );
}

/* ── MIDGROUND — hexagram ring, medium parallax ── */
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
        strokeWidth="1.1" strokeOpacity="0.36" filter="url(#sg)" />
      <polyline points={hex1} fill="none" stroke={GOLD} strokeWidth="0.65" strokeOpacity="0.22" />
      <polyline points={hex2} fill="none" stroke={GOLD} strokeWidth="0.65" strokeOpacity="0.22" />

      {Array.from({ length: 6 }, (_, i) => {
        const [x, y] = pt(CX, CY, 164, (i / 6) * 360);
        return <circle key={i} cx={x} cy={y} r={2.2} fill={GOLD} fillOpacity="0.68" filter="url(#sg)" />;
      })}
    </motion.g>
  );
}

/* ── FOREGROUND — inner 8-fold ring, faster parallax ── */
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
        strokeWidth="1" strokeOpacity="0.40" filter="url(#sg)" />
      <polyline points={sq1} fill="none" stroke={GOLD} strokeWidth="0.55" strokeOpacity="0.26" />
      <polyline points={sq2} fill="none" stroke={GOLD} strokeWidth="0.55" strokeOpacity="0.26" />

      {Array.from({ length: 8 }, (_, i) => {
        const [x, y] = pt(CX, CY, 110, (i / 8) * 360);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={3} fill={GOLD} fillOpacity="0.13"
              stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.52" />
            <circle cx={x} cy={y} r={1.2} fill={GOLD} fillOpacity="0.86" />
          </g>
        );
      })}
    </motion.g>
  );
}

/* ── CORE halo — closest to viewer ── */
function CoreHalo() {
  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: -360 }}
      transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={CX} cy={CY} r={62} fill="none" stroke={GOLD}
        strokeWidth="1.1" strokeOpacity="0.48" filter="url(#cg)" />
      <circle cx={CX} cy={CY} r={52} fill="none" stroke={GOLD}
        strokeWidth="0.4" strokeOpacity="0.20" strokeDasharray="3,7" />

      {Array.from({ length: 6 }, (_, i) => {
        const [x, y] = pt(CX, CY, 62, (i / 6) * 360);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={2.5} fill={GOLD} fillOpacity="0.16"
              stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.58" />
            <circle cx={x} cy={y} r={1} fill={GOLD} fillOpacity="0.90" />
          </g>
        );
      })}
    </motion.g>
  );
}

/* ── Subtle SVG light rays from center ── */
function SvgLightRays() {
  return (
    <g opacity="1">
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * 360;
        const a = (angle - 90) * (Math.PI / 180);
        const x2 = CX + Math.cos(a) * 220;
        const y2 = CY + Math.sin(a) * 220;
        return (
          <motion.line key={i}
            x1={CX} y1={CY} x2={x2} y2={y2}
            stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.06"
            animate={{ strokeOpacity: [0.04, 0.10, 0.04] }}
            transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        );
      })}
    </g>
  );
}

/* ── Full SVG seal — parallax layers applied in HTML wrapper ── */
function SigilSVG({ mouse }) {
  return (
    <div style={{ position: "absolute", width: SIZE, height: SIZE, left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>

      {/* BACKGROUND layer — outer ring, moves least */}
      <motion.div style={{
        position: "absolute", inset: 0,
        x: mouse.x * -4,
        y: mouse.y * -4,
      }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: SIZE, height: SIZE, overflow: "visible" }}>
          <Defs />
          <AuraLayers />
          <OuterRing />
        </svg>
      </motion.div>

      {/* MIDGROUND layer — hexagram, moves moderately */}
      <motion.div style={{
        position: "absolute", inset: 0,
        x: mouse.x * -9,
        y: mouse.y * -9,
      }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: SIZE, height: SIZE, overflow: "visible" }}>
          <MiddleRing />
        </svg>
      </motion.div>

      {/* FOREGROUND layer — inner ring + core, moves most */}
      <motion.div style={{
        position: "absolute", inset: 0,
        x: mouse.x * -15,
        y: mouse.y * -15,
      }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: SIZE, height: SIZE, overflow: "visible" }}>
          <SvgLightRays />
          <InnerRing />
          <CoreHalo />
        </svg>
      </motion.div>

    </div>
  );
}

/* ── Asma ul Husna — flat circular orbit in large sacred zone ── */
// Between outer ring (r=228) and middle ring (r=164) → midpoint ~196 SVG units
// In px (container 500, SVG 520): 196 × (500/520) ≈ 188px
function AsmaNames({ containerSize, mouse }) {
  const half = containerSize / 2;
  const SVG_SCALE = containerSize / SIZE;
  const ORBIT_R = 194 * SVG_SCALE; // sits in the large sacred band
  const ORBIT_DURATION = 120;

  const [positions, setPositions] = useState(() =>
    ASMA.map((_, i) => {
      const angle = (i / ASMA.length) * Math.PI * 2 - Math.PI / 2;
      return { x: half + Math.cos(angle) * ORBIT_R, y: half + Math.sin(angle) * ORBIT_R };
    })
  );

  useAnimationFrame((t) => {
    const elapsed = (t / 1000) / ORBIT_DURATION;
    setPositions(ASMA.map((_, i) => {
      const baseAngle = (i / ASMA.length) * Math.PI * 2 - Math.PI / 2;
      const angle = baseAngle + elapsed * Math.PI * 2;
      return {
        x: half + Math.cos(angle) * ORBIT_R,
        y: half + Math.sin(angle) * ORBIT_R,
      };
    }));
  });

  return (
    // Names at midground depth — move slightly with parallax
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 8,
        x: mouse.x * -6,
        y: mouse.y * -6,
      }}
    >
      {positions.map(({ x, y }, i) => {
        const name = ASMA[i];
        return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              willChange: "transform",
            }}
          >
            {/* Soft aura bloom */}
            <div style={{
              position: "absolute",
              inset: "-8px -14px",
              borderRadius: "50%",
              background: `radial-gradient(ellipse, ${G("0.26")} 0%, transparent 68%)`,
              filter: "blur(7px)",
              pointerEvents: "none",
            }} />
            {/* Divine name */}
            <span style={{
              fontFamily: "'Amiri', serif",
              fontWeight: "700",
              fontSize: "13px",
              color: "#D4AF37",
              textShadow: [
                `0 0 7px ${G("0.80")}`,
                `0 0 18px ${G("0.38")}`,
                `0 0 35px ${G("0.15")}`,
              ].join(", "),
              whiteSpace: "nowrap",
              display: "block",
              letterSpacing: "0.05em",
              direction: "rtl",
              position: "relative",
              zIndex: 1,
            }}>
              {name}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
}

/* ── Orbiting golden dust particles ── */
function GoldenDust({ containerSize }) {
  const half = containerSize / 2;
  const SVG_SCALE = containerSize / SIZE;
  const particles = Array.from({ length: 14 }, (_, i) => ({
    orbitR: [222, 164, 110, 190][i % 4] * SVG_SCALE,
    offset: i / 14,
    size: i % 4 === 0 ? 2.2 : 1.4,
    duration: 65 + i * 7,
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
            boxShadow: `0 0 ${p.size * 5}px ${G("0.80")}`,
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
            opacity: [0.18, 0.75, 0.18],
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
  const mouse = useMouseParallax(1);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: containerSize, height: containerSize }}
    >
      {/* Atmospheric outer bloom */}
      <motion.div style={{
        position: "absolute",
        width: containerSize + 80, height: containerSize + 80,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${G("0.08")} 0%, ${G("0.025")} 52%, transparent 72%)`,
        filter: "blur(40px)",
        x: mouse.x * 2,
        y: mouse.y * 2,
      }} />

      {/* Layered SVG seal with depth parallax */}
      <SigilSVG mouse={mouse} />

      {/* Orbiting dust */}
      <GoldenDust containerSize={containerSize} />

      {/* Divine names in the large sacred zone */}
      <AsmaNames containerSize={containerSize} mouse={mouse} />
    </div>
  );
}