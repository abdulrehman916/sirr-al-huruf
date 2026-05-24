import { useState, useEffect } from "react";

let cached = null;
export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (cached !== null) return cached;
    cached = window.innerWidth < 768;
    return cached;
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => { cached = e.matches; setIsMobile(e.matches); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}