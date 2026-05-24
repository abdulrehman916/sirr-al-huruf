import { motion } from "framer-motion";

const GOLD = "#D4AF37";
const G = (o) => `rgba(212,175,55,${o})`;

const CX = 300, CY = 300, SIZE = 600;

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
      {/* Soft glow filter */}
      <filter id="sg" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      {/* Strong glow */}
      <filter id="sg2" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="9" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      {/* Text glow */}
      <filter id="tg" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      {/* Outer aura gradient */}
      <radialGradient id="aura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.22" />
        <stop offset="50%" stopColor={GOLD} stopOpacity="0.06" />
        <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
      </radialGradient>
      {/* Core glow */}
      <radialGradient id="core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.60" />
        <stop offset="55%" stopColor={GOLD} stopOpacity="0.12" />
        <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
      </radialGradient>

      {/* Asma arc paths — defined once, used by textPath */}
      {ASMA.map((_, i) => {
        const r = 246;
        const segDeg = 360 / ASMA.length;
        const startDeg = (i / ASMA.length) * 360 - 90;
        const endDeg = startDeg + segDeg * 0.75;
        const sr = startDeg * Math.PI / 180;
        const er = endDeg * Math.PI / 180;
        const sx = CX + Math.cos(sr) * r;
        const sy = CY + Math.sin(sr) * r;
        const ex = CX + Math.cos(er) * r;
        const ey = CY + Math.sin(er) * r;
        return (
          <path key={i} id={`ap${i}`}
            d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`} />
        );
      })}
    </defs>
  );
}

/* ── Breathing aura layers ── */
function AuraLayers() {
  return (
    <>
      <motion.circle cx={CX} cy={CY} r={285} fill="url(#aura)"
        animate={{ r: [285, 300, 285], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle cx={CX} cy={CY} r={80} fill="url(#core)"
        animate={{ r: [80, 96, 80], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

/* ── RING 1: Outer Asma ring with elegant border ── */
function OuterAsmaRing() {
  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: 360 }}
      transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
    >
      {/* Clean double border */}
      <circle cx={CX} cy={CY} r={260} fill="none" stroke={GOLD}
        strokeWidth="1.4" strokeOpacity="0.50" filter="url(#sg)" />
      <circle cx={CX} cy={CY} r={252} fill="none" stroke={GOLD}
        strokeWidth="0.5" strokeOpacity="0.25" />

      {/* 9 elegant gem nodes — one per Asma */}
      {ASMA.map((_, i) => {
        const [x, y] = pt(CX, CY, 260, (i / ASMA.length) * 360);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={5} fill={GOLD} fillOpacity="0.18"
              stroke={GOLD} strokeWidth="1" strokeOpacity="0.70" filter="url(#sg)" />
            <circle cx={x} cy={y} r={2} fill={GOLD} fillOpacity="0.90" />
          </g>
        );
      })}
    </motion.g>
  );
}

/* ── Asma ul Husna on arc — counter-rotating so text stays readable ── */
function AsmaText() {
  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: -360 }}
      transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
    >
      {ASMA.map((name, i) => (
        <text key={i}
          fontFamily="'Amiri', serif"
          fontSize="14"
          fontWeight="bold"
          fill={GOLD}
          fillOpacity="0.95"
          filter="url(#tg)"
        >
          <textPath href={`#ap${i}`} startOffset="5%">
            {name}
          </textPath>
        </text>
      ))}
    </motion.g>
  );
}

/* ── RING 2: Middle elegant geometric ring ── */
function MiddleRing() {
  const hex1 = regularPolygon(CX, CY, 175, 6, 0);
  const hex2 = regularPolygon(CX, CY, 175, 6, 30);

  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: -360 }}
      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
    >
      {/* Main ring */}
      <circle cx={CX} cy={CY} r={182} fill="none" stroke={GOLD}
        strokeWidth="1.2" strokeOpacity="0.42" filter="url(#sg)" />
      <circle cx={CX} cy={CY} r={168} fill="none" stroke={GOLD}
        strokeWidth="0.4" strokeOpacity="0.20" />

      {/* Two overlapping hexagrams */}
      <polyline points={hex1} fill="none" stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.28" />
      <polyline points={hex2} fill="none" stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.28" />

      {/* 12 graceful node dots */}
      {Array.from({ length: 12 }, (_, i) => {
        const [x, y] = pt(CX, CY, 182, (i / 12) * 360);
        return <circle key={i} cx={x} cy={y} r={2} fill={GOLD} fillOpacity="0.65" />;
      })}
    </motion.g>
  );
}

/* ── RING 3: Inner sacred ring with 8-fold star ── */
function InnerRing() {
  const sq1 = regularPolygon(CX, CY, 115, 4, 0);
  const sq2 = regularPolygon(CX, CY, 115, 4, 45);

  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: 360 }}
      transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={CX} cy={CY} r={122} fill="none" stroke={GOLD}
        strokeWidth="1" strokeOpacity="0.48" filter="url(#sg)" />
      <circle cx={CX} cy={CY} r={108} fill="none" stroke={GOLD}
        strokeWidth="0.4" strokeOpacity="0.20" strokeDasharray="3,8" />

      {/* Two squares forming 8-pointed star */}
      <polyline points={sq1} fill="none" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.30" />
      <polyline points={sq2} fill="none" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.30" />

      {/* 8 small gems */}
      {Array.from({ length: 8 }, (_, i) => {
        const [x, y] = pt(CX, CY, 122, (i / 8) * 360);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={3.5} fill={GOLD} fillOpacity="0.15"
              stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.60" filter="url(#sg)" />
            <circle cx={x} cy={y} r={1.4} fill={GOLD} fillOpacity="0.85" />
          </g>
        );
      })}
    </motion.g>
  );
}

/* ── Core halo (innermost, around Allah) ── */
function CoreHalo() {
  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: -360 }}
      transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={CX} cy={CY} r={68} fill="none" stroke={GOLD}
        strokeWidth="1.2" strokeOpacity="0.55" filter="url(#sg2)" />
      <circle cx={CX} cy={CY} r={58} fill="none" stroke={GOLD}
        strokeWidth="0.5" strokeOpacity="0.28" strokeDasharray="3,6" />

      {/* 6 fine petals */}
      {Array.from({ length: 6 }, (_, i) => {
        const [x, y] = pt(CX, CY, 68, (i / 6) * 360);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={3} fill={GOLD} fillOpacity="0.20"
              stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.65" filter="url(#sg)" />
            <circle cx={x} cy={y} r={1.2} fill={GOLD} fillOpacity="0.90" />
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
      <OuterAsmaRing />
      <AsmaText />
      <MiddleRing />
      <InnerRing />
      <CoreHalo />
    </svg>
  );
}

/* ── Gentle floating dust particles ── */
function GoldenDust() {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    orbitR: [246, 182, 122][i % 3],
    offset: i / 14,
    size: i % 4 === 0 ? 2.2 : 1.4,
    duration: 60 + i * 5,
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles.map((p, i) => (
        <motion.div key={i}
          style={{
            position: "absolute",
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: GOLD,
            boxShadow: `0 0 ${p.size * 5}px ${G("0.9")}`,
            top: "50%", left: "50%",
            marginTop: -p.size / 2, marginLeft: -p.size / 2,
          }}
          animate={{
            x: Array.from({ length: 60 }, (_, t) => {
              const a = ((t / 60) + p.offset) * Math.PI * 2 - Math.PI / 2;
              return Math.cos(a) * p.orbitR * (SIZE / 600);
            }),
            y: Array.from({ length: 60 }, (_, t) => {
              const a = ((t / 60) + p.offset) * Math.PI * 2 - Math.PI / 2;
              return Math.sin(a) * p.orbitR * (SIZE / 600);
            }),
            opacity: [0.3, 0.85, 0.3],
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

/* ── Main export ── */
export default function SacredWheel() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 560, height: 560 }}>
      {/* Atmospheric outer glow */}
      <div style={{
        position: "absolute",
        width: 640, height: 640,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${G("0.12")} 0%, ${G("0.04")} 45%, transparent 70%)`,
        filter: "blur(40px)",
      }} />

      <SigilSVG />
      <GoldenDust />
    </div>
  );
}