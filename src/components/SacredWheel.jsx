import { motion, useMotionValue } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import useIsMobile from "../hooks/useIsMobile";
import { useNavigation } from "../context/NavigationContext";

const GOLD = "#D4AF37";
const G = (o) => `rgba(212,175,55,${o})`;
const CX = 260, CY = 260, SIZE = 520;

const ASMA = ["الرحمن","الرحيم","الملك","القدوس","السلام","العزيز","الجبار","النور"];

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

// ── Precomputed static polygon strings (never rebuilt) ──
const HEX1 = regularPolygon(CX, CY, 158, 6, 0);
const HEX2 = regularPolygon(CX, CY, 158, 6, 30);
const SQ1  = regularPolygon(CX, CY, 104, 4, 0);
const SQ2  = regularPolygon(CX, CY, 104, 4, 45);

// ── Precomputed ring dot positions (never rebuilt) ──
const OUTER_DOTS = Array.from({ length: 12 }, (_, i) => pt(CX, CY, 228, (i / 12) * 360));
const MID_DOTS   = Array.from({ length: 6  }, (_, i) => pt(CX, CY, 164, (i / 6)  * 360));
const INNER_DOTS = Array.from({ length: 8  }, (_, i) => pt(CX, CY, 110, (i / 8)  * 360));
const CORE_DOTS  = Array.from({ length: 6  }, (_, i) => pt(CX, CY, 62,  (i / 6)  * 360));

// ── Precomputed SVG light ray endpoints (never rebuilt) ──
const LIGHT_RAYS_PTS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * 360;
  const a = (angle - 90) * (Math.PI / 180);
  return { x2: CX + Math.cos(a) * 220, y2: CY + Math.sin(a) * 220 };
});

// ── GoldenDust orbital keyframes — computed ONCE at module level ──
// keyed by orbitR so they're stable across renders
const ORBIT_RADII = [222, 164, 110, 190];
const ORBIT_KEYFRAMES = ORBIT_RADII.reduce((acc, r) => {
  acc[r] = {
    x: Array.from({ length: 60 }, (_, t) => {
      const a = (t / 60) * Math.PI * 2 - Math.PI / 2;
      return Math.cos(a) * r;
    }),
    y: Array.from({ length: 60 }, (_, t) => {
      const a = (t / 60) * Math.PI * 2 - Math.PI / 2;
      return Math.sin(a) * r;
    }),
  };
  return acc;
}, {});

/* ── SVG Defs ── */
function Defs({ isMobile }) {
  const blur  = isMobile ? 2   : 2.5;
  const cBlur = isMobile ? 4.5 : 6;
  const bBlur = isMobile ? 8   : 10;
  return (
    <defs>
      <filter id="sg" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={blur} result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="cg" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation={cBlur} result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="bloom" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation={bBlur} result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <radialGradient id="sw-aura" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor={GOLD} stopOpacity="0.14" />
        <stop offset="55%"  stopColor={GOLD} stopOpacity="0.04" />
        <stop offset="100%" stopColor={GOLD} stopOpacity="0"    />
      </radialGradient>
      <radialGradient id="core" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor={GOLD} stopOpacity="0.38" />
        <stop offset="60%"  stopColor={GOLD} stopOpacity="0.07" />
        <stop offset="100%" stopColor={GOLD} stopOpacity="0"    />
      </radialGradient>
      <radialGradient id="outerBloom" cx="50%" cy="50%" r="50%">
        <stop offset="75%"  stopColor={GOLD} stopOpacity="0"    />
        <stop offset="90%"  stopColor={GOLD} stopOpacity="0.08" />
        <stop offset="100%" stopColor={GOLD} stopOpacity="0"    />
      </radialGradient>
    </defs>
  );
}

function AuraLayers({ paused }) {
  return (
    <>
      <motion.circle cx={CX} cy={CY} r={240} fill="url(#outerBloom)"
        animate={paused ? {} : { r: [238, 252, 238], opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle cx={CX} cy={CY} r={248} fill="url(#sw-aura)"
        animate={paused ? {} : { r: [248, 262, 248], opacity: [0.50, 0.88, 0.50] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle cx={CX} cy={CY} r={65} fill="url(#core)"
        animate={paused ? {} : { r: [65, 80, 65], opacity: [0.42, 0.82, 0.42] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function OuterRing({ paused }) {
  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px`, willChange: "transform" }}
      animate={paused ? {} : { rotate: 360 }}
      transition={{ duration: 420, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={CX} cy={CY} r={228} fill="none" stroke={GOLD}
        strokeWidth="1.4" strokeOpacity="0.38" filter="url(#sg)" />
      <circle cx={CX} cy={CY} r={220} fill="none" stroke={GOLD}
        strokeWidth="0.4" strokeOpacity="0.14" />
      <circle cx={CX} cy={CY} r={228} fill="none" stroke={GOLD}
        strokeWidth="6" strokeOpacity="0.034" filter="url(#bloom)" />
      {OUTER_DOTS.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={3.5} fill={GOLD} fillOpacity="0.12"
            stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.55" filter="url(#sg)" />
          <circle cx={x} cy={y} r={1.4} fill={GOLD} fillOpacity="0.85" />
        </g>
      ))}
    </motion.g>
  );
}

function MiddleRing({ paused }) {
  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px`, willChange: "transform" }}
      animate={paused ? {} : { rotate: -360 }}
      transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={CX} cy={CY} r={164} fill="none" stroke={GOLD}
        strokeWidth="1.1" strokeOpacity="0.36" filter="url(#sg)" />
      <polyline points={HEX1} fill="none" stroke={GOLD} strokeWidth="0.65" strokeOpacity="0.22" />
      <polyline points={HEX2} fill="none" stroke={GOLD} strokeWidth="0.65" strokeOpacity="0.22" />
      {MID_DOTS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.2} fill={GOLD} fillOpacity="0.68" filter="url(#sg)" />
      ))}
    </motion.g>
  );
}

function InnerRing({ paused }) {
  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px`, willChange: "transform" }}
      animate={paused ? {} : { rotate: 360 }}
      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={CX} cy={CY} r={110} fill="none" stroke={GOLD}
        strokeWidth="1" strokeOpacity="0.40" filter="url(#sg)" />
      <polyline points={SQ1} fill="none" stroke={GOLD} strokeWidth="0.55" strokeOpacity="0.26" />
      <polyline points={SQ2} fill="none" stroke={GOLD} strokeWidth="0.55" strokeOpacity="0.26" />
      {INNER_DOTS.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={3} fill={GOLD} fillOpacity="0.13"
            stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.52" />
          <circle cx={x} cy={y} r={1.2} fill={GOLD} fillOpacity="0.86" />
        </g>
      ))}
    </motion.g>
  );
}

function CoreHalo({ paused }) {
  return (
    <motion.g
      style={{ transformOrigin: `${CX}px ${CY}px`, willChange: "transform" }}
      animate={paused ? {} : { rotate: -360 }}
      transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={CX} cy={CY} r={62} fill="none" stroke={GOLD}
        strokeWidth="1.1" strokeOpacity="0.48" filter="url(#cg)" />
      <circle cx={CX} cy={CY} r={52} fill="none" stroke={GOLD}
        strokeWidth="0.4" strokeOpacity="0.20" strokeDasharray="3,7" />
      {CORE_DOTS.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={2.5} fill={GOLD} fillOpacity="0.16"
            stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.58" />
          <circle cx={x} cy={y} r={1} fill={GOLD} fillOpacity="0.90" />
        </g>
      ))}
    </motion.g>
  );
}

function SvgLightRays({ paused }) {
  return (
    <g>
      {LIGHT_RAYS_PTS.map(({ x2, y2 }, i) => (
        <motion.line key={i}
          x1={CX} y1={CY} x2={x2} y2={y2}
          stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.06"
          animate={paused ? {} : { strokeOpacity: [0.04, 0.10, 0.04] }}
          transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}
    </g>
  );
}

/* ── SigilSVG — accepts MotionValues for parallax ── */
function SigilSVG({ mouseX, mouseY, paused, isMobile }) {
  const ps = isMobile ? 0 : 1; // no parallax on mobile
  return (
    <div style={{
      position: "absolute", width: SIZE, height: SIZE,
      left: "50%", top: "50%",
      transform: "translate(-50%, -50%) translateZ(0)",
      willChange: "transform",
    }}>
      {/* BACKGROUND layer */}
      <motion.div style={{
        position: "absolute", inset: 0,
        x: ps ? mouseX : 0,
        y: ps ? mouseY : 0,
        willChange: isMobile ? "auto" : "transform",
      }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: SIZE, height: SIZE, overflow: "visible" }}>
          <Defs isMobile={isMobile} />
          <AuraLayers paused={paused} />
          <OuterRing paused={paused} />
        </svg>
      </motion.div>

      {/* ATMOSPHERIC FOG — desktop only */}
      {!isMobile && (
        <motion.div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
          x: mouseX, y: mouseY,
          willChange: "transform",
        }}>
          <motion.div style={{
            position: "absolute",
            width: SIZE * 0.68, height: SIZE * 0.68,
            borderRadius: "50%",
            background: "radial-gradient(circle, transparent 48%, rgba(2,8,22,0.22) 62%, rgba(2,8,22,0.10) 72%, transparent 85%)",
            filter: "blur(14px)",
            willChange: "opacity",
          }}
            animate={paused ? {} : { opacity: [0.55, 0.85, 0.55] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {/* MIDGROUND layer */}
      <motion.div style={{
        position: "absolute", inset: 0,
        x: ps ? mouseX : 0,
        y: ps ? mouseY : 0,
        willChange: isMobile ? "auto" : "transform",
      }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: SIZE, height: SIZE, overflow: "visible" }}>
          <MiddleRing paused={paused} />
        </svg>
      </motion.div>

      {/* FOREGROUND layer */}
      <motion.div style={{
        position: "absolute", inset: 0,
        x: ps ? mouseX : 0,
        y: ps ? mouseY : 0,
        willChange: isMobile ? "auto" : "transform",
      }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: SIZE, height: SIZE, overflow: "visible" }}>
          <SvgLightRays paused={paused} />
          <InnerRing paused={paused} />
          <CoreHalo paused={paused} />
        </svg>
      </motion.div>
    </div>
  );
}

/* ── AsmaNames — pure CSS orbital rotation, zero JS per frame ──
   Instead of useAnimationFrame + setState (60 re-renders/sec),
   we place names at static initial angles and rotate the whole
   container via CSS animation. Visually identical, zero JS cost. */
function AsmaNames({ containerSize, mouseX, mouseY, paused, isMobile }) {
  const half = containerSize / 2;
  const SVG_SCALE = containerSize / SIZE;
  const ORBIT_R = 194 * SVG_SCALE;
  const parallaxScale = isMobile ? 0 : 1;

  // Static initial positions — computed once, never change
  const positions = useMemo(() =>
    ASMA.map((_, i) => {
      const angle = (i / ASMA.length) * Math.PI * 2 - Math.PI / 2;
      return {
        x: half + Math.cos(angle) * ORBIT_R,
        y: half + Math.sin(angle) * ORBIT_R,
      };
    }),
  [half, ORBIT_R]);

  return (
    <>
      {/* Outer ring wrapper — Framer Motion rotate only (no CSS animation conflict) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 8,
          willChange: isMobile ? "auto" : "transform",
          transformOrigin: `${half}px ${half}px`,
        }}
        animate={paused ? {} : { rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        {/* Parallax offset wrapper — separate from rotation to avoid transform conflict */}
        <motion.div
          className="absolute inset-0"
          style={{
            x: parallaxScale ? mouseX : 0,
            y: parallaxScale ? mouseY : 0,
          }}
        >
        {positions.map(({ x, y }, i) => {
          const name = ASMA[i];
          const breathDelay = (i / ASMA.length) * 4;
          return (
            // Counter-rotate each label with Framer Motion — consistent with outer ring
            <motion.div key={name}
              style={{
                position: "absolute",
                left: x, top: y,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={paused ? {} : { rotate: -360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                style={{
                  position: "absolute",
                  inset: "-10px -16px",
                  borderRadius: "50%",
                  background: `radial-gradient(ellipse, ${G("0.30")} 0%, transparent 68%)`,
                  pointerEvents: "none",
                  willChange: "opacity, transform",
                }}
                animate={paused ? {} : { opacity: [0.35, 0.85, 0.35], scale: [0.9, 1.15, 0.9] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: breathDelay }}
              />
              <motion.span
                style={{
                  fontFamily: "'Amiri', serif",
                  fontWeight: "700",
                  fontSize: isMobile ? "12px" : "13px",
                  color: "#D4AF37",
                  whiteSpace: "nowrap",
                  display: "block",
                  letterSpacing: "0.05em",
                  direction: "rtl",
                  position: "relative",
                  zIndex: 1,
                  willChange: "filter",
                }}
                animate={paused ? {} : {
                  textShadow: [
                    `0 0 5px ${G("0.55")}, 0 0 14px ${G("0.22")}`,
                    `0 0 10px ${G("0.90")}, 0 0 28px ${G("0.50")}, 0 0 50px ${G("0.18")}`,
                    `0 0 5px ${G("0.55")}, 0 0 14px ${G("0.22")}`,
                  ],
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: breathDelay }}
              >
                {name}
              </motion.span>
            </motion.div>
          );
        })}
        </motion.div>
      </motion.div>
    </>
  );
}

/* ── GoldenDust — uses precomputed module-level keyframes ── */
function GoldenDust({ containerSize, paused, isMobile }) {
  const SVG_SCALE = containerSize / SIZE;
  const count = isMobile ? 6 : 14;

  // Memoize particle config so it's not rebuilt on re-render
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const baseR = ORBIT_RADII[i % 4];
      const scaledR = Math.round(baseR * SVG_SCALE);
      // Find closest precomputed radius key
      const closestR = ORBIT_RADII.reduce((prev, curr) =>
        Math.abs(curr - scaledR / SVG_SCALE) < Math.abs(prev - scaledR / SVG_SCALE) ? curr : prev
      );
      return {
        orbitR: baseR * SVG_SCALE,
        closestR,
        offset: i / count,
        size: i % 4 === 0 ? 2.2 : 1.4,
        duration: 65 + i * 7,
      };
    }),
  [count, SVG_SCALE]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 3, transform: "translateZ(0)" }}>
      {particles.map((p, i) => {
        // Use precomputed keyframes scaled to actual container
        const scale = p.orbitR / ORBIT_RADII[i % 4];
        const kf = ORBIT_KEYFRAMES[ORBIT_RADII[i % 4]];
        const scaledX = kf.x.map(v => v * scale);
        const scaledY = kf.y.map(v => v * scale);

        return (
          <motion.div key={i}
            style={{
              position: "absolute",
              width: p.size, height: p.size,
              borderRadius: "50%",
              background: GOLD,
              boxShadow: `0 0 ${p.size * 5}px ${G("0.80")}`,
              top: "50%", left: "50%",
              marginTop: -p.size / 2, marginLeft: -p.size / 2,
              willChange: "transform, opacity",
            }}
            animate={paused ? {} : {
              x: scaledX,
              y: scaledY,
              opacity: [0.18, 0.75, 0.18],
            }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
    </div>
  );
}

function getContainerSize() {
  if (typeof window === "undefined") return 400;
  return Math.min(500, Math.max(280, window.innerWidth * 0.88));
}

/* ── Main export ── */
// Accepts shared mouse MotionValues from Home — no own useMouseParallax call
export default function SacredWheel({ mouse }) {
  const [containerSize, setContainerSize] = useState(getContainerSize);
  const isMobile = useIsMobile();
  const { isNavigating } = useNavigation();

  // Always create fallback MotionValues (Rules of Hooks — must be unconditional)
  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);
  const mouseX = mouse?.x ?? fallbackX;
  const mouseY = mouse?.y ?? fallbackY;

  // Scale MotionValues for the outer bloom parallax (desktop only)
  const bloomX = useMotionValue(0);
  const bloomY = useMotionValue(0);

  useEffect(() => {
    if (isMobile) return;
    const unsubX = mouseX.on("change", v => bloomX.set(v * 2));
    const unsubY = mouseY.on("change", v => bloomY.set(v * 2));
    return () => { unsubX(); unsubY(); };
  }, [isMobile, mouseX, mouseY, bloomX, bloomY]);

  useEffect(() => {
    const onResize = () => setContainerSize(getContainerSize());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: containerSize, height: containerSize,
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      {/* Atmospheric outer bloom — no parallax on mobile */}
      <motion.div style={{
        position: "absolute",
        width: containerSize + 80, height: containerSize + 80,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${G("0.08")} 0%, ${G("0.025")} 52%, transparent 72%)`,
        filter: `blur(${isMobile ? 32 : 40}px)`,
        willChange: isMobile ? "auto" : "transform",
        x: isMobile ? 0 : bloomX,
        y: isMobile ? 0 : bloomY,
      }} />

      <SigilSVG mouseX={mouseX} mouseY={mouseY} paused={isNavigating} isMobile={isMobile} />
      <GoldenDust containerSize={containerSize} paused={isNavigating} isMobile={isMobile} />
      <AsmaNames
        containerSize={containerSize}
        mouseX={mouseX} mouseY={mouseY}
        paused={isNavigating}
        isMobile={isMobile}
      />
    </div>
  );
}