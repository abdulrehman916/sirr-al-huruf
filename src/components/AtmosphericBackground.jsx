import { memo } from "react";

// All data generated once at module level — zero re-render cost
const seed = (i, k = 1) => {
  const s = i * 137.508 * k;
  const v = Math.sin(s) * 43758.5453;
  return (v % 1 + 1) % 1;
};

// Star field — 60 stars, varied sizes & twinkle speeds
const STARS = Array.from({ length: 60 }, (_, i) => ({
  w:     seed(i, 1) * 2.2 + 0.4,
  top:   `${seed(i, 1.3) * 100}%`,
  left:  `${seed(i, 1.7) * 100}%`,
  op:    seed(i, 2.1) * 0.55 + 0.10,
  dur:   `${2.4 + seed(i, 0.9) * 4.8}s`,
  delay: `${seed(i, 0.7) * 5}s`,
  layer: i % 3, // 0=small, 1=medium, 2=bright
}));

// Golden dust particles — 20 slow-drifting orbs
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  size:  seed(i, 3.1) * 5 + 2,
  top:   `${seed(i, 3.7) * 110 - 5}%`,
  left:  `${seed(i, 4.1) * 100}%`,
  op:    seed(i, 4.5) * 0.18 + 0.04,
  dur:   `${12 + seed(i, 5.1) * 18}s`,
  delay: `${seed(i, 5.7) * 12}s`,
  dx:    (seed(i, 6.1) - 0.5) * 40,
  dy:    (seed(i, 6.5) - 0.5) * 60,
}));

const AtmosphericBackground = memo(function AtmosphericBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* ── Deep space gradient base ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(20,40,90,0.35) 0%, transparent 65%), " +
            "radial-gradient(ellipse 60% 40% at 80% 100%, rgba(10,20,60,0.25) 0%, transparent 60%)",
        }}
      />

      {/* ── Star field ── */}
      {STARS.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width:  s.w,
            height: s.w,
            top:    s.top,
            left:   s.left,
            background:
              s.layer === 2
                ? "radial-gradient(circle, #fff 0%, rgba(212,175,55,0.6) 55%, transparent 100%)"
                : "#ffffff",
            opacity: s.op,
            animation: `sh-twinkle ${s.dur} ease-in-out infinite`,
            animationDelay: s.delay,
            willChange: "opacity, transform",
          }}
        />
      ))}

      {/* ── Slow golden dust particles ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={`p${i}`}
          className="absolute rounded-full"
          style={{
            width:  p.size,
            height: p.size,
            top:    p.top,
            left:   p.left,
            background:
              "radial-gradient(circle, rgba(212,175,55,0.85) 0%, rgba(212,175,55,0.20) 55%, transparent 100%)",
            opacity: p.op,
            filter: "blur(1px)",
            animation: `sh-drift-${i % 4} ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* ── Ambient gold top bloom ── */}
      <div
        className="absolute"
        style={{
          top: -60,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: 200,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(212,175,55,0.12) 0%, transparent 70%)",
          filter: "blur(20px)",
          animation: "sh-bloom 8s ease-in-out infinite",
        }}
      />

      {/* ── Keyframes injected once ── */}
      <style>{`
        @keyframes sh-twinkle {
          0%,100% { opacity: var(--op, 0.15); transform: scale(1); }
          50%      { opacity: calc(var(--op, 0.15) * 2.8 + 0.1); transform: scale(1.6); }
        }
        @keyframes sh-bloom {
          0%,100% { opacity: 0.65; }
          50%      { opacity: 1; }
        }
        /* 4 drift variants for visual diversity */
        @keyframes sh-drift-0 {
          0%   { transform: translate(0px,  0px)   scale(1);    opacity: inherit; }
          33%  { transform: translate(18px, -22px) scale(1.15); opacity: calc(inherit * 1.5); }
          66%  { transform: translate(-12px,-38px) scale(0.90); opacity: inherit; }
          100% { transform: translate(0px,  0px)   scale(1);    opacity: inherit; }
        }
        @keyframes sh-drift-1 {
          0%   { transform: translate(0px,  0px)   scale(1);    }
          40%  { transform: translate(-20px,-30px) scale(1.10); }
          80%  { transform: translate(14px, -50px) scale(0.85); }
          100% { transform: translate(0px,  0px)   scale(1);    }
        }
        @keyframes sh-drift-2 {
          0%   { transform: translate(0px, 0px)    scale(1);    }
          50%  { transform: translate(25px,-28px)  scale(1.20); }
          100% { transform: translate(0px, 0px)    scale(1);    }
        }
        @keyframes sh-drift-3 {
          0%   { transform: translate(0px,  0px)   scale(1);    }
          30%  { transform: translate(-15px,-18px) scale(0.88); }
          70%  { transform: translate(10px, -40px) scale(1.12); }
          100% { transform: translate(0px,  0px)   scale(1);    }
        }
      `}</style>
    </div>
  );
});

export default AtmosphericBackground;