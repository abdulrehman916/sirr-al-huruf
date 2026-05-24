import { motion } from "framer-motion";

const GOLD = "#D4AF37";
const G = (o) => `rgba(212,175,55,${o})`;

const CX = 260, CY = 260, SIZE = 520;

const ASMA = [
  "الله","الرحمن","الرحيم","الملك","القدوس","السلام","العزيز","الجبار","النور"
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

      {/* 9 gem nodes between names */}
      {ASMA.map((_, i) => {
        const [x, y] = pt(CX, CY, 228, (i / ASMA.length) * 360 + (360 / ASMA.length / 2));
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={4} fill={GOLD} fillOpacity="0.15"
              stroke={GOLD} strokeWidth="0.9" strokeOpacity="0.65" filter="url(#sg)" />
            <circle cx={x} cy={y} r={1.6} fill={GOLD} fillOpacity="0.90" />
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

/* ── Asma ul Husna — upright HTML overlay, fixed around the circle ── */
function AsmaNames({ containerSize }) {
  const radius = containerSize / 2 * 0.82; // sits just inside the outer ring

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {ASMA.map((name, i) => {
        const angleDeg = (i / ASMA.length) * 360 - 90;
        const rad = angleDeg * (Math.PI / 180);
        const x = containerSize / 2 + Math.cos(rad) * radius;
        const y = containerSize / 2 + Math.sin(rad) * radius;

        return (
          <motion.div
            key={name}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.9, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.span
              animate={{
                opacity: [0.72, 1, 0.72],
              }}
              transition={{
                duration: 3.5 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.25,
              }}
              style={{
                fontFamily: "'Amiri', serif",
                fontWeight: "700",
                fontSize: "13px",
                color: GOLD,
                textShadow: `0 0 8px ${G("0.50")}, 0 0 20px ${G("0.75")}, 0 0 36px ${G("0.35")}`,
                whiteSpace: "nowrap",
                display: "block",
                letterSpacing: "0.03em",
                direction: "rtl",
              }}
            >
              {name}
            </motion.span>
          </motion.div>
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