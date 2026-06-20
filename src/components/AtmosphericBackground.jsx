import { memo, useEffect } from "react";

// All data generated once at module level — zero re-render cost
const seed = (i, k = 1) => {
  const s = i * 137.508 * k;
  const v = Math.sin(s) * 43758.5453;
  return (v % 1 + 1) % 1;
};

// Star field — 48 stars (reduced from 60), varied sizes & twinkle speeds
const STARS = Array.from({ length: 48 }, (_, i) => ({
  w:     seed(i, 1) * 2.2 + 0.4,
  top:   `${seed(i, 1.3) * 100}%`,
  left:  `${seed(i, 1.7) * 100}%`,
  op:    seed(i, 2.1) * 0.55 + 0.10,
  dur:   `${2.4 + seed(i, 0.9) * 4.8}s`,
  delay: `${seed(i, 0.7) * 5}s`,
  layer: i % 3, // 0=small, 1=medium, 2=bright
}));

// Golden dust particles — 14 slow-drifting orbs (reduced from 20)
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
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
  // Pause CSS animations when tab is hidden — saves GPU/battery
  useEffect(() => {
    const el = document.getElementById("atm-bg-root");
    if (!el) return;
    const onVis = () => {
      const state = document.hidden ? "paused" : "running";
      el.querySelectorAll(".atm-anim").forEach(n => {
        n.style.animationPlayState = state;
      });
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div
      id="atm-bg-root"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
      style={{ contain: "strict" }}
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
          className="absolute rounded-full atm-anim"
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
            willChange: "opacity",
          }}
        />
      ))}

      {/* ── Slow golden dust particles ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={`p${i}`}
          className="absolute rounded-full atm-anim"
          style={{
            width:  p.size,
            height: p.size,
            top:    p.top,
            left:   p.left,
            background: "rgba(212,175,55,0.55)",
            opacity: p.op,
            animation: `sh-drift-${i % 4} ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* ── Ambient gold top bloom — no blur filter (GPU cost) ── */}
      <div
        className="absolute atm-anim"
        style={{
          top: -60,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: 200,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(212,175,55,0.10) 0%, transparent 70%)",
          animation: "sh-bloom 8s ease-in-out infinite",
        }}
      />

      {/* Keyframes are defined in index.css — no inline style injection */}
    </div>
  );
});

export default AtmosphericBackground;