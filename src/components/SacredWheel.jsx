import { motion } from "framer-motion";

const ASMA = [
  "الله", "الرحمن", "الرحيم", "الملك", "القدوس",
  "السلام", "العزيز", "الجبار", "المتكبر"
];

// Generate polygon SVG path points
function polygonPoints(cx, cy, r, n, angleOffset = 0) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2 + angleOffset;
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return pts.join(" ");
}

// Star polygon (every other vertex)
function starPoints(cx, cy, R, r, n) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const radius = i % 2 === 0 ? R : r;
    pts.push(`${cx + Math.cos(a) * radius},${cy + Math.sin(a) * radius}`);
  }
  return pts.join(" ");
}

const CX = 300, CY = 300;
const GOLD = "#D4AF37";

function SigilSVG() {
  return (
    <svg
      viewBox="0 0 600 600"
      className="absolute"
      style={{ width: 600, height: 600, left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
    >
      <defs>
        <filter id="sigilGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="auraGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.25" />
          <stop offset="50%" stopColor={GOLD} stopOpacity="0.06" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.5" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <clipPath id="wheelClip">
          <circle cx={CX} cy={CY} r={270} />
        </clipPath>
      </defs>

      {/* Outer aura disc */}
      <circle cx={CX} cy={CY} r={270} fill="url(#auraGrad)" />

      {/* === RING 1 — outermost, engraved tick marks === */}
      <motion.g
        style={{ originX: "300px", originY: "300px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <circle cx={CX} cy={CY} r={255} fill="none" stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.35" filter="url(#sigilGlow)" />
        <circle cx={CX} cy={CY} r={248} fill="none" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.20" />
        {/* 72 tick marks */}
        {Array.from({ length: 72 }).map((_, i) => {
          const a = (i / 72) * Math.PI * 2;
          const isLong = i % 8 === 0;
          const isMid = i % 4 === 0 && !isLong;
          const inner = isLong ? 233 : isMid ? 238 : 242;
          return (
            <line key={i}
              x1={CX + Math.cos(a) * inner} y1={CY + Math.sin(a) * inner}
              x2={CX + Math.cos(a) * 248} y2={CY + Math.sin(a) * 248}
              stroke={GOLD} strokeWidth={isLong ? 1.2 : isMid ? 0.8 : 0.5}
              strokeOpacity={isLong ? 0.55 : isMid ? 0.35 : 0.20}
            />
          );
        })}
        {/* Outer octagon */}
        <polyline points={polygonPoints(CX, CY, 258, 8)} fill="none" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.22" />
      </motion.g>

      {/* === RING 2 — Islamic 12-fold petal ring === */}
      <motion.g
        style={{ originX: "300px", originY: "300px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        <circle cx={CX} cy={CY} r={210} fill="none" stroke={GOLD} strokeWidth="1" strokeOpacity="0.30" filter="url(#sigilGlow)" />
        {/* 12-petal Islamic rosette lines */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a1 = (i / 12) * Math.PI * 2;
          const a2 = ((i + 4) / 12) * Math.PI * 2;
          return (
            <line key={i}
              x1={CX + Math.cos(a1) * 210} y1={CY + Math.sin(a1) * 210}
              x2={CX + Math.cos(a2) * 210} y2={CY + Math.sin(a2) * 210}
              stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.18"
            />
          );
        })}
        {/* Dashed inner ring */}
        <circle cx={CX} cy={CY} r={200} fill="none" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.18"
          strokeDasharray="4,6" />
        {/* 8-pointed star */}
        <polyline points={starPoints(CX, CY, 210, 170, 8)} fill="none" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.20" />
        {/* Small diamonds at cardinal points */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const x = CX + Math.cos(a) * 210;
          const y = CY + Math.sin(a) * 210;
          return <circle key={i} cx={x} cy={y} r={3} fill={GOLD} fillOpacity="0.55" filter="url(#sigilGlow)" />;
        })}
      </motion.g>

      {/* === RING 3 — middle geometric band === */}
      <motion.g
        style={{ originX: "300px", originY: "300px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
      >
        <circle cx={CX} cy={CY} r={168} fill="none" stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.38" filter="url(#sigilGlow)" />
        {/* 6-fold hexagram */}
        <polyline points={polygonPoints(CX, CY, 168, 6)} fill="none" stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.28" />
        <polyline points={polygonPoints(CX, CY, 168, 6, Math.PI / 6)} fill="none" stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.28" />
        {/* Inter-hex connectors */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
          return (
            <line key={i}
              x1={CX} y1={CY}
              x2={CX + Math.cos(a) * 168} y2={CY + Math.sin(a) * 168}
              stroke={GOLD} strokeWidth="0.4" strokeOpacity="0.14"
            />
          );
        })}
        <circle cx={CX} cy={CY} r={155} fill="none" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.18" strokeDasharray="2,5" />
        {/* 12 glyph dots */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          return <circle key={i} cx={CX + Math.cos(a) * 168} cy={CY + Math.sin(a) * 168} r={2} fill={GOLD} fillOpacity="0.45" />;
        })}
      </motion.g>

      {/* === RING 4 — inner fine engraving === */}
      <motion.g
        style={{ originX: "300px", originY: "300px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      >
        <circle cx={CX} cy={CY} r={126} fill="none" stroke={GOLD} strokeWidth="1" strokeOpacity="0.40" filter="url(#sigilGlow)" />
        {/* 24 fine ticks */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const isLong = i % 6 === 0;
          return (
            <line key={i}
              x1={CX + Math.cos(a) * (isLong ? 108 : 114)} y1={CY + Math.sin(a) * (isLong ? 108 : 114)}
              x2={CX + Math.cos(a) * 126} y2={CY + Math.sin(a) * 126}
              stroke={GOLD} strokeWidth={isLong ? 1 : 0.5}
              strokeOpacity={isLong ? 0.55 : 0.22}
            />
          );
        })}
        {/* 5-pointed star seal */}
        <polyline points={starPoints(CX, CY, 126, 96, 5)} fill="none" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.30" />
      </motion.g>

      {/* === RING 5 — innermost halo === */}
      <motion.g
        style={{ originX: "300px", originY: "300px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <circle cx={CX} cy={CY} r={88} fill="none" stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.45" filter="url(#softGlow)" />
        <circle cx={CX} cy={CY} r={80} fill="none" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.28" strokeDasharray="3,4" />
        {/* 8 petals */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a1 = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const a2 = ((i + 0.5) / 8) * Math.PI * 2 - Math.PI / 2;
          return (
            <g key={i}>
              <line
                x1={CX + Math.cos(a1) * 58} y1={CY + Math.sin(a1) * 58}
                x2={CX + Math.cos(a1) * 88} y2={CY + Math.sin(a1) * 88}
                stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.35"
              />
              <circle cx={CX + Math.cos(a2) * 88} cy={CY + Math.sin(a2) * 88} r={2.5} fill={GOLD} fillOpacity="0.60" filter="url(#sigilGlow)" />
            </g>
          );
        })}
      </motion.g>

      {/* Breathing golden core disc */}
      <motion.circle cx={CX} cy={CY} r={55} fill="url(#coreGrad)"
        animate={{ r: [55, 62, 55], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Central dot */}
      <circle cx={CX} cy={CY} r={4} fill={GOLD} fillOpacity="0.8" filter="url(#softGlow)" />
    </svg>
  );
}

// Orbiting gold particles around ring 2
function OrbitalParticles() {
  return (
    <>
      {Array.from({ length: 16 }).map((_, i) => {
        const offset = i / 16;
        const size = i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5;
        return (
          <motion.div key={i} className="absolute"
            style={{
              width: size, height: size,
              borderRadius: "50%",
              background: GOLD,
              boxShadow: `0 0 ${size * 3}px rgba(212,175,55,0.8)`,
              top: "50%", left: "50%",
              marginTop: -size / 2, marginLeft: -size / 2,
            }}
            animate={{
              x: Array.from({ length: 60 }, (_, t) => {
                const a = ((t / 60) + offset) * Math.PI * 2 - Math.PI / 2;
                return Math.cos(a) * 210;
              }),
              y: Array.from({ length: 60 }, (_, t) => {
                const a = ((t / 60) + offset) * Math.PI * 2 - Math.PI / 2;
                return Math.sin(a) * 210;
              }),
            }}
            transition={{ duration: 30 + i * 1.5, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
    </>
  );
}

export default function SacredWheel() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 420, height: 420 }}>
      {/* Outer deep glow */}
      <div className="absolute rounded-full" style={{
        width: 460, height: 460,
        background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 50%, transparent 72%)",
        filter: "blur(24px)",
      }} />

      {/* SVG Sigil */}
      <SigilSVG />

      {/* Orbital particles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <OrbitalParticles />
      </div>

      {/* Asma ul Husna orbiting names */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {ASMA.map((name, i) => {
          const angle = (i / ASMA.length) * 2 * Math.PI - Math.PI / 2;
          const r = 245;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          return (
            <motion.div key={name}
              className="absolute"
              style={{ transform: `translate(${x}px, ${y}px)` }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  opacity: [0.75, 1, 0.75],
                  textShadow: [
                    "0 0 8px rgba(212,175,55,0.5)",
                    "0 0 18px rgba(212,175,55,0.95)",
                    "0 0 8px rgba(212,175,55,0.5)"
                  ]
                }}
                transition={{ duration: 3.5 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
                className="font-amiri font-bold text-center select-none"
                style={{
                  color: "#D4AF37",
                  fontSize: "clamp(11px, 2vw, 14px)",
                  textShadow: "0 0 12px rgba(212,175,55,0.7)",
                  whiteSpace: "nowrap",
                  background: "rgba(5,10,25,0.55)",
                  border: "1px solid rgba(212,175,55,0.22)",
                  borderRadius: 6,
                  padding: "2px 7px",
                  backdropFilter: "blur(6px)",
                }}
              >
                {name}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Central logo slot — children rendered on top */}
    </div>
  );
}