import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const THRESHOLD = 72;

export default function PullToRefresh({ onRefresh, children }) {
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const pulling = useRef(false);

  const handleTouchStart = useCallback((e) => {
    // Only activate when scrolled to top
    const el = e.currentTarget.closest("[data-scroll-container]") || document.documentElement;
    if (el.scrollTop > 2) return;
    startY.current = e.touches[0].clientY;
    pulling.current = true;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!pulling.current || startY.current === null || refreshing) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy < 0) { pulling.current = false; return; }
    const resistance = Math.min(dy * 0.45, THRESHOLD + 16);
    setPullY(resistance);
  }, [refreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;
    if (pullY >= THRESHOLD * 0.45) {
      setRefreshing(true);
      setPullY(0);
      await onRefresh?.();
      setRefreshing(false);
    } else {
      setPullY(0);
    }
    startY.current = null;
  }, [pullY, onRefresh]);

  const progress = Math.min(pullY / (THRESHOLD * 0.45), 1);
  const shouldTrigger = pullY >= THRESHOLD * 0.45;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ position: "relative", touchAction: "pan-y" }}
    >
      {/* Pull indicator */}
      <AnimatePresence>
        {(pullY > 4 || refreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "absolute",
              top: pullY > 0 ? pullY - 40 : 8,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            <div style={{
              width: 36, height: 36,
              borderRadius: "50%",
              background: "rgba(8,16,40,0.92)",
              border: `1px solid rgba(212,175,55,${0.15 + progress * 0.50})`,
              boxShadow: `0 0 16px rgba(212,175,55,${progress * 0.30})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {refreshing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: 16, height: 16,
                    border: "2px solid rgba(212,175,55,0.18)",
                    borderTop: "2px solid #D4AF37",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <motion.svg
                  viewBox="0 0 16 16"
                  style={{ width: 16, height: 16 }}
                  animate={{ rotate: shouldTrigger ? 180 : progress * 160 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <path
                    d="M8 2 L8 10 M4 7 L8 11 L12 7"
                    stroke={shouldTrigger ? "#D4AF37" : "rgba(212,175,55,0.50)"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </motion.svg>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content shifts down while pulling */}
      <div style={{ transform: pullY > 0 ? `translateY(${pullY}px)` : "none", transition: pullY === 0 ? "transform 0.25s ease" : "none" }}>
        {children}
      </div>
    </div>
  );
}