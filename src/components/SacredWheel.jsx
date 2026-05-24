import { motion } from "framer-motion";

const GOLD = "#D4AF37";
const GOLD_DIM = "rgba(212,175,55,";

const ASMA = [
  "الله", "الرحمن", "الرحيم", "الملك", "القدوس",
  "السلام", "العزيز", "الجبار", "المتكبر"
];

const CX = 320, CY = 320, SIZE = 640;

/* ── helpers ── */
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

function starPath(cx, cy, R, r, n, rotDeg = 0) {
  return Array.from({ length: n * 2 }, (_, i) => {
    const angle = (i / (n * 2)) * 360 + rotDeg;
    const radius = i % 2 === 0 ? R : r;
    const [x, y] = pt(cx, cy, radius, angle);
    return `${x},${y}`;
  }).join(" ");
}

/* ── SVG defs ── */
function Defs() {
  return (
    <defs>
      <filter id="glow1" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="glow2" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="6" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="glow3" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="10" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <radialGradient id="outerAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.18" />
        <stop offset="45%" stopColor={GOLD} stopOpacity="0.06" />
        <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.55" />
        <stop offset="60%" stopColor={GOLD} stopOpacity="0.10" />
        <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="midGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.25" />
        <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/* ── LAYER 1: outermost ornate band ── */
function OuterBand() {
  const ticks72 = Array.from({ length: 72 }, (_, i) => {
    const long = i % 9 === 0;
    const mid = i % 3 === 0 && !long;
    const inner = long ? 265 : mid ? 272 : 277;
    const [x1, y1] = pt(CX, CY, inner, (i / 72) * 360);
    const [x2, y2] = pt(CX, CY, 282, (i / 72) * 360);
    return { x1, y1, x2, y2, long, mid };
  });

  // kufic-inspired arc segments
  const arcSegments = Array.from({ length: 36 }, (_, i) => {
    const a1 = (i / 36) * 360 - 90;
    const a2 = ((i + 0.7) / 36) * 360 - 90;
    const [sx, sy] = pt(CX, CY, 292, a1 + 90);
    const [ex, ey] = pt(CX, CY, 292, a2 + 90);
    const sweep = a2 > a1 ? 1 : 0;
    return `M ${sx} ${sy} A 292 292 0 0 ${sweep} ${ex} ${ey}`;
  });

  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: 360 }}
      transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
    >
      {/* Outer boundary double ring */}
      <circle cx={CX} cy={CY} r={302} fill="none" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.20" />
      <circle cx={CX} cy={CY} r={295} fill="none" stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.40" filter="url(#glow1)" />
      <circle cx={CX} cy={CY} r={283} fill="none" stroke={GOLD} strokeWidth="0.4" strokeOpacity="0.18" />

      {/* Kufic arc notches */}
      {arcSegments.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={GOLD} strokeWidth="2.5"
          strokeOpacity={i % 4 === 0 ? 0.55 : 0.22} strokeLinecap="round" />
      ))}

      {/* Tick marks */}
      {ticks72.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={GOLD}
          strokeWidth={t.long ? 1.4 : t.mid ? 0.8 : 0.4}
          strokeOpacity={t.long ? 0.65 : t.mid ? 0.38 : 0.18}
        />
      ))}

      {/* 8-fold outer star polygon */}
      <polyline points={starPath(CX, CY, 298, 280, 8, 0)}
        fill="none" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.22" />

      {/* Major node gems at 8 positions */}
      {Array.from({ length: 8 }, (_, i) => {
        const [x, y] = pt(CX, CY, 295, (i / 8) * 360);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={4.5} fill={GOLD} fillOpacity="0.15"
              stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.55" filter="url(#glow1)" />
            <circle cx={x} cy={y} r={1.8} fill={GOLD} fillOpacity="0.75" />
          </g>
        );
      })}
    </motion.g>
  );
}

/* ── LAYER 2: 12-fold Islamic rosette ring ── */
function RosetteRing() {
  // 12-fold connecting lines (Islamic girih style)
  const lines12 = Array.from({ length: 12 }, (_, i) => {
    const a1 = (i / 12) * 360;
    const a2 = ((i + 5) / 12) * 360;
    const [x1, y1] = pt(CX, CY, 240, a1);
    const [x2, y2] = pt(CX, CY, 240, a2);
    return { x1, y1, x2, y2 };
  });

  // petal arcs
  const petals = Array.from({ length: 12 }, (_, i) => {
    const aMid = (i / 12) * 360;
    const aLeft = ((i - 0.5) / 12) * 360;
    const aRight = ((i + 0.5) / 12) * 360;
    const [mx, my] = pt(CX, CY, 240, aMid);
    const [lx, ly] = pt(CX, CY, 218, aLeft);
    const [rx, ry] = pt(CX, CY, 218, aRight);
    return `M ${lx} ${ly} Q ${mx} ${my} ${rx} ${ry}`;
  });

  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: -360 }}
      transition={{ duration: 130, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={CX} cy={CY} r={242} fill="none" stroke={GOLD} strokeWidth="1" strokeOpacity="0.32" filter="url(#glow1)" />
      <circle cx={CX} cy={CY} r={220} fill="none" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.20" strokeDasharray="3,7" />

      {/* Girih grid lines */}
      {lines12.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.22" />
      ))}

      {/* Rosette petals */}
      {petals.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={GOLD} strokeWidth="1.2"
          strokeOpacity="0.35" strokeLinecap="round" filter="url(#glow1)" />
      ))}

      {/* 12 node dots */}
      {Array.from({ length: 12 }, (_, i) => {
        const [x, y] = pt(CX, CY, 242, (i / 12) * 360);
        return <circle key={i} cx={x} cy={y} r={2.5} fill={GOLD} fillOpacity="0.55" filter="url(#glow1)" />;
      })}

      {/* Outer 6-pointed hexagram */}
      <polyline points={regularPolygon(CX, CY, 240, 6, 0)} fill="none" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.25" />
      <polyline points={regularPolygon(CX, CY, 240, 6, 30)} fill="none" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.25" />
    </motion.g>
  );
}

/* ── LAYER 3: middle geometric mandala ── */
function MandalaBand() {
  // Islamic 8-fold star (two overlapping squares)
  const sq1 = regularPolygon(CX, CY, 185, 4, 0);
  const sq2 = regularPolygon(CX, CY, 185, 4, 45);

  // Fine engraving arcs between spokes
  const spokeArcs = Array.from({ length: 8 }, (_, i) => {
    const a1 = (i / 8) * 360 - 90;
    const a2 = ((i + 0.35) / 8) * 360 - 90;
    const [sx, sy] = pt(CX, CY, 175, a1 + 90);
    const [ex, ey] = pt(CX, CY, 175, a2 + 90);
    return `M ${sx} ${sy} A 175 175 0 0 1 ${ex} ${ey}`;
  });

  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: 360 }}
      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={CX} cy={CY} r={190} fill="none" stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.40" filter="url(#glow1)" />
      <circle cx={CX} cy={CY} r={178} fill="none" stroke={GOLD} strokeWidth="0.4" strokeOpacity="0.22" />

      {/* Two overlapping squares = 8-pointed star */}
      <polyline points={sq1} fill="none" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.32" />
      <polyline points={sq2} fill="none" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.32" />

      {/* Spoke arcs */}
      {spokeArcs.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={GOLD} strokeWidth="2" strokeOpacity="0.42"
          strokeLinecap="round" filter="url(#glow1)" />
      ))}

      {/* 8 radial spokes to center-ish */}
      {Array.from({ length: 8 }, (_, i) => {
        const [ox, oy] = pt(CX, CY, 190, (i / 8) * 360);
        const [ix, iy] = pt(CX, CY, 120, (i / 8) * 360);
        return <line key={i} x1={ox} y1={oy} x2={ix} y2={iy}
          stroke={GOLD} strokeWidth="0.4" strokeOpacity="0.18" />;
      })}

      {/* Engraved mid circle with hashmarks */}
      <circle cx={CX} cy={CY} r={165} fill="none" stroke={GOLD} strokeWidth="0.6"
        strokeOpacity="0.25" strokeDasharray="1.5,5" />

      {/* 8 node diamonds */}
      {Array.from({ length: 8 }, (_, i) => {
        const [x, y] = pt(CX, CY, 190, (i / 8) * 360);
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${(i / 8) * 360})`}>
            <polygon points="0,-5 4,0 0,5 -4,0"
              fill={GOLD} fillOpacity="0.25"
              stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.60"
              filter="url(#glow1)" />
          </g>
        );
      })}
    </motion.g>
  );
}

/* ── LAYER 4: inner khatam ring ── */
function InnerKhatam() {
  // Khatam 6-pointed (Islamic 6-fold interlace)
  const lines6 = Array.from({ length: 6 }, (_, i) => {
    const a1 = (i / 6) * 360;
    const a2 = ((i + 3) / 6) * 360;
    const [x1, y1] = pt(CX, CY, 135, a1);
    const [x2, y2] = pt(CX, CY, 135, a2);
    return { x1, y1, x2, y2 };
  });

  const tri1 = regularPolygon(CX, CY, 135, 3, 0);
  const tri2 = regularPolygon(CX, CY, 135, 3, 60);

  // Fine calligraphic flourishes at 6 points
  const flourishes = Array.from({ length: 6 }, (_, i) => {
    const [x, y] = pt(CX, CY, 135, (i / 6) * 360);
    const a = (i / 6) * 360;
    return { x, y, a };
  });

  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: -360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={CX} cy={CY} r={140} fill="none" stroke={GOLD} strokeWidth="1.2"
        strokeOpacity="0.45" filter="url(#glow1)" />
      <circle cx={CX} cy={CY} r={128} fill="none" stroke={GOLD} strokeWidth="0.5"
        strokeOpacity="0.25" strokeDasharray="2,6" />

      {/* Two triangles = Star of David / Islamic 6-fold */}
      <polyline points={tri1} fill="none" stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.35" />
      <polyline points={tri2} fill="none" stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.35" />

      {/* Diameter lines */}
      {lines6.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={GOLD} strokeWidth="0.4" strokeOpacity="0.18" />
      ))}

      {/* 12 fine ticks */}
      {Array.from({ length: 24 }, (_, i) => {
        const isLong = i % 4 === 0;
        const inner = isLong ? 122 : 128;
        const [x1, y1] = pt(CX, CY, inner, (i / 24) * 360);
        const [x2, y2] = pt(CX, CY, 140, (i / 24) * 360);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={GOLD} strokeWidth={isLong ? 0.9 : 0.4}
          strokeOpacity={isLong ? 0.50 : 0.20} />;
      })}

      {/* Flourish dots */}
      {flourishes.map((f, i) => (
        <g key={i}>
          <circle cx={f.x} cy={f.y} r={5} fill="none"
            stroke={GOLD} strokeWidth="1" strokeOpacity="0.55" filter="url(#glow1)" />
          <circle cx={f.x} cy={f.y} r={2} fill={GOLD} fillOpacity="0.75" />
        </g>
      ))}
    </motion.g>
  );
}

/* ── LAYER 5: innermost seal halo ── */
function CoreSeal() {
  const pentagram = starPath(CX, CY, 90, 55, 5, 0);

  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{ rotate: 360 }}
      transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={CX} cy={CY} r={100} fill="none" stroke={GOLD} strokeWidth="1.4"
        strokeOpacity="0.55" filter="url(#glow2)" />
      <circle cx={CX} cy={CY} r={92} fill="none" stroke={GOLD} strokeWidth="0.5"
        strokeOpacity="0.30" strokeDasharray="2,4" />
      <circle cx={CX} cy={CY} r={82} fill="none" stroke={GOLD} strokeWidth="0.4"
        strokeOpacity="0.22" />

      {/* Pentagram seal */}
      <polyline points={pentagram} fill="none" stroke={GOLD} strokeWidth="0.6"
        strokeOpacity="0.35" filter="url(#glow1)" />

      {/* 5 outer glyph dots */}
      {Array.from({ length: 5 }, (_, i) => {
        const [x, y] = pt(CX, CY, 100, (i / 5) * 360);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={4} fill="none" stroke={GOLD}
              strokeWidth="0.8" strokeOpacity="0.55" />
            <circle cx={x} cy={y} r={1.5} fill={GOLD} fillOpacity="0.80"
              filter="url(#glow1)" />
          </g>
        );
      })}

      {/* 10 fine spoke marks */}
      {Array.from({ length: 10 }, (_, i) => {
        const [x1, y1] = pt(CX, CY, 82, (i / 10) * 360);
        const [x2, y2] = pt(CX, CY, 100, (i / 10) * 360);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.28" />;
      })}
    </motion.g>
  );
}

/* ── Breathing gold aura layers ── */
function GoldenAura() {
  return (
    <>
      {/* Far outer haze */}
      <motion.circle cx={CX} cy={CY} r={305} fill="url(#outerAura)"
        animate={{ r: [305, 318, 305], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Mid radiance */}
      <motion.circle cx={CX} cy={CY} r={200} fill="url(#midGlow)"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      {/* Core pulse */}
      <motion.circle cx={CX} cy={CY} r={70} fill="url(#coreGlow)"
        animate={{ r: [70, 82, 70], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

/* ── Static backdrop geometry (non-rotating, atmosphere) ── */
function AtmosphericBase() {
  // Fine cross-hatch of very faint radial lines
  return (
    <g opacity="0.10">
      {Array.from({ length: 24 }, (_, i) => {
        const [x1, y1] = pt(CX, CY, 10, (i / 24) * 360);
        const [x2, y2] = pt(CX, CY, 300, (i / 24) * 360);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={GOLD} strokeWidth="0.3" />;
      })}
    </g>
  );
}

/* ── SVG sigil ── */
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
      <AtmosphericBase />
      <GoldenAura />
      <OuterBand />
      <RosetteRing />
      <MandalaBand />
      <InnerKhatam />
      <CoreSeal />
      {/* Absolute center dot */}
      <circle cx={CX} cy={CY} r={3} fill={GOLD} fillOpacity="0.9" filter="url(#glow2)" />
    </svg>
  );
}

/* ── Orbiting fine dust particles ── */
function DustParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => {
    const orbitR = [242, 190, 140][i % 3];
    const offset = i / 20;
    const size = i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.8 : 1.2;
    const duration = 50 + i * 3.5;
    return { orbitR, offset, size, duration };
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles.map((p, i) => (
        <motion.div key={i}
          style={{
            position: "absolute",
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: GOLD,
            boxShadow: `0 0 ${p.size * 4}px ${GOLD_DIM}0.9)`,
            top: "50%", left: "50%",
            marginTop: -p.size / 2, marginLeft: -p.size / 2,
          }}
          animate={{
            x: Array.from({ length: 60 }, (_, t) => {
              const a = ((t / 60) + p.offset) * Math.PI * 2 - Math.PI / 2;
              return Math.cos(a) * p.orbitR * (SIZE / 640);
            }),
            y: Array.from({ length: 60 }, (_, t) => {
              const a = ((t / 60) + p.offset) * Math.PI * 2 - Math.PI / 2;
              return Math.sin(a) * p.orbitR * (SIZE / 640);
            }),
            opacity: [0.4, 1, 0.4],
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

/* ── Asma ul Husna on arc path ── */
function AsmaOrbit() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {ASMA.map((name, i) => {
        const angle = (i / ASMA.length) * 360 - 90;
        const rad = angle * (Math.PI / 180);
        const orbitR = 268;
        const x = Math.cos(rad) * orbitR;
        const y = Math.sin(rad) * orbitR;

        return (
          <motion.div key={name}
            className="absolute"
            style={{ transform: `translate(${x}px, ${y}px)` }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.12, duration: 1, ease: "easeOut" }}
          >
            <motion.div
              animate={{
                opacity: [0.65, 1, 0.65],
                scale: [1, 1.06, 1],
              }}
              transition={{
                duration: 4 + i * 0.35,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              style={{
                fontFamily: "'Amiri', serif",
                fontWeight: 700,
                fontSize: 13,
                color: GOLD,
                textShadow: `0 0 6px ${GOLD_DIM}0.4), 0 0 18px ${GOLD_DIM}0.8), 0 0 30px ${GOLD_DIM}0.4)`,
                whiteSpace: "nowrap",
                background: `linear-gradient(135deg, rgba(5,10,25,0.75) 0%, rgba(10,20,45,0.65) 100%)`,
                border: `1px solid ${GOLD_DIM}0.30)`,
                borderRadius: 5,
                padding: "3px 9px",
                backdropFilter: "blur(8px)",
                letterSpacing: "0.04em",
              }}
            >
              {name}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Main export ── */
export default function SacredWheel() {
  const containerSize = 560;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: containerSize, height: containerSize }}
    >
      {/* Deep atmospheric glow behind everything */}
      <div style={{
        position: "absolute",
        width: containerSize + 80,
        height: containerSize + 80,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${GOLD_DIM}0.10) 0%, ${GOLD_DIM}0.04) 40%, transparent 68%)`,
        filter: "blur(32px)",
      }} />

      {/* SVG Seal */}
      <SigilSVG />

      {/* Floating dust particles */}
      <DustParticles />

      {/* Asma ul Husna orbit */}
      <AsmaOrbit />
    </div>
  );
}