import { useState, useEffect, useCallback } from "react";

/**
 * Returns normalised mouse offset { x, y } in range [-1, 1]
 * relative to the center of the viewport.
 * Updates smoothly via lerp on every animation frame.
 */
export default function useMouseParallax(strength = 1) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const target = { x: 0, y: 0 };

  useEffect(() => {
    const onMove = (e) => {
      target.x = ((e.clientX / window.innerWidth) - 0.5) * 2 * strength;
      target.y = ((e.clientY / window.innerHeight) - 0.5) * 2 * strength;
    };
    window.addEventListener("mousemove", onMove);

    let raf;
    let cur = { x: 0, y: 0 };
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.045;
      cur.y += (target.y - cur.y) * 0.045;
      setOffset({ x: cur.x, y: cur.y });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return offset;
}