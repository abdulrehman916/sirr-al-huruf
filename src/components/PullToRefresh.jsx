import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const THRESHOLD = 72;

/**
 * PullToRefresh — iOS-compatible pull-to-refresh.
 *
 * Key design decisions:
 * - We do NOT call e.preventDefault() on touchmove so the browser's native
 *   momentum/rubber-band scrolling is never blocked (required for passive iOS).
 * - overscroll-behavior: none is set on the *outer scroll container* (PageLayout),
 *   not here, so this component doesn't need to interfere with it.
 * - We only activate the pull gesture when the scroll container is at the very
 *   top (scrollTop ≤ 2), letting normal scrolling work everywhere else.
 * - Content translation is done via a CSS transform on a child div, not by
 *   manipulating the scroll container, so layout is never disrupted.
 */
export default function PullToRefresh({ onRefresh, children }) {
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const startY = useRef(null);
  const pulling = useRef(false);

  // Disable pull-to-refresh while any input/textarea is focused (keyboard open)
  useEffect(() => {
    const handleFocusIn = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        setDisabled(true);
      }
    };
    const handleFocusOut = () => {
      setDisabled(false);
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);
    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  const getScrollContainer = useCallback((el) => {
    // Walk up the DOM to find the data-scroll-container
    let node = el;
    while (node) {
      if (node.dataset?.scrollContainer) return node;
      node = node.parentElement;
    }
    return null;
  }, []);

  const handleTouchStart = useCallback((e) => {
    // Disabled while keyboard is open (input focused)
    if (disabled) return;
    const container = getScrollContainer(e.currentTarget);
    const scrollTop = container ? container.scrollTop : window.scrollY;
    if (scrollTop > 2) return;
    // Additional guard: check if keyboard might be open (viewport height reduced)
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const screenHeight = window.screen.height;
    if (screenHeight > 0 && viewportHeight < screenHeight * 0.7) return;
    startY.current = e.touches[0].clientY;
    pulling.current = true;
  }, [getScrollContainer, disabled]);

  const handleTouchMove = useCallback((e) => {
    // Disabled while keyboard is open (input focused)
    if (disabled || !pulling.current || startY.current === null || refreshing) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0) { pulling.current = false; return; }
    // Rubber-band-style resistance: sqrt curve feels natural
    const resistance = Math.min(dy * 0.42, THRESHOLD + 20);
    setPullY(resistance);
    // Do NOT call e.preventDefault() — keeps iOS scroll momentum intact
  }, [refreshing, disabled]);

  const handleTouchEnd = useCallback(async () => {
    // Disabled while keyboard is open
    if (disabled || !pulling.current) return;
    pulling.current = false;
    startY.current = null;
    if (pullY >= THRESHOLD * 0.45) {
      setRefreshing(true);
      setPullY(0);
      await onRefresh?.();
      setRefreshing(false);
    } else {
      setPullY(0);
    }
  }, [pullY, onRefresh, disabled]);

  const progress = Math.min(pullY / (THRESHOLD * 0.45), 1);
  const shouldTrigger = pullY >= THRESHOLD * 0.45;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
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
      <div
        style={{
          transform: pullY > 0 ? `translateY(${pullY}px)` : "none",
          transition: pullY === 0 ? "transform 0.25s ease" : "none",
          willChange: pullY > 0 ? "transform" : "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}