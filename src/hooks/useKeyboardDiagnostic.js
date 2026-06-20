/**
 * KeyboardDiagnostic — Logs exact viewport/scroll behavior on focus
 * Use to identify what moves the page when keyboard opens
 */

import { useEffect, useRef, useState } from "react";

export function useKeyboardDiagnostic(enabled = true) {
  const [logs, setLogs] = useState([]);
  const initialStateRef = useRef(null);
  const focusTimeRef = useRef(null);

  const log = (type, data) => {
    if (!enabled) return;
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
    setLogs(prev => [...prev.slice(-49), { timestamp, type, ...data }]);
    console.log(`[KEYBOARD_DIAG] ${timestamp} | ${type}`, data);
  };

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const VisualViewport = window.visualViewport;

    // Capture initial state before focus
    const captureInitialState = () => {
      const root = document.getElementById('root');
      initialStateRef.current = {
        scrollY: window.scrollY || window.pageYOffset,
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
        viewportOffsetTop: VisualViewport?.offsetTop || 0,
        viewportHeight: VisualViewport?.height || window.innerHeight,
        viewportWidth: VisualViewport?.width || window.innerWidth,
        activeElement: document.activeElement?.tagName || null,
        timestamp: Date.now(),
        // CONTAINER HEIGHTS
        rootClientHeight: root?.clientHeight || 0,
        rootScrollHeight: root?.scrollHeight || 0,
        rootOffsetHeight: root?.offsetHeight || 0,
        bodyClientHeight: document.body.clientHeight,
        bodyScrollHeight: document.body.scrollHeight,
        htmlClientHeight: document.documentElement.clientHeight,
        htmlScrollHeight: document.documentElement.scrollHeight,
      };
      log("INITIAL_STATE", initialStateRef.current);
    };

    // Track focus events
    const handleFocusIn = (e) => {
      const target = e.target;
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (!isInput) return;

      focusTimeRef.current = Date.now();
      captureInitialState();

      log("FOCUS_IN", {
        tagName: target.tagName,
        type: target.type,
        id: target.id,
        className: target.className,
        rect: target.getBoundingClientRect(),
        offsetTop: target.offsetTop,
        offsetParent: target.offsetParent?.tagName || null,
      });
    };

    // Track blur events
    const handleFocusOut = (e) => {
      const target = e.target;
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (!isInput) return;

      const duration = Date.now() - (focusTimeRef.current || 0);
      const finalState = {
        scrollY: window.scrollY || window.pageYOffset,
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
        viewportOffsetTop: VisualViewport?.offsetTop || 0,
        viewportHeight: VisualViewport?.height || window.innerHeight,
        duration,
      };

      log("FOCUS_OUT", finalState);
      focusTimeRef.current = null;
    };

    // Track viewport changes (keyboard open/close)
    const handleViewportResize = () => {
      if (!initialStateRef.current) return;

      const root = document.getElementById('root');
      const current = {
        scrollY: window.scrollY || window.pageYOffset,
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
        viewportOffsetTop: VisualViewport?.offsetTop || 0,
        viewportHeight: VisualViewport?.height || window.innerHeight,
        viewportWidth: VisualViewport?.width || window.innerWidth,
        // CONTAINER HEIGHT TRACKING
        rootClientHeight: root?.clientHeight || 0,
        rootScrollHeight: root?.scrollHeight || 0,
        rootOffsetHeight: root?.offsetHeight || 0,
        bodyClientHeight: document.body.clientHeight,
        bodyScrollHeight: document.body.scrollHeight,
        htmlClientHeight: document.documentElement.clientHeight,
        htmlScrollHeight: document.documentElement.scrollHeight,
      };

      const initial = initialStateRef.current;
      const delta = {
        scrollY: current.scrollY - initial.scrollY,
        viewportOffsetTop: current.viewportOffsetTop - initial.viewportOffsetTop,
        viewportHeight: current.viewportHeight - initial.viewportHeight,
        viewportWidth: current.viewportWidth - initial.viewportWidth,
        // CONTAINER HEIGHT DELTAS
        rootClientHeight: current.rootClientHeight - (initial.rootClientHeight || 0),
        rootScrollHeight: current.rootScrollHeight - (initial.rootScrollHeight || 0),
        bodyClientHeight: current.bodyClientHeight - (initial.bodyClientHeight || 0),
        htmlClientHeight: current.htmlClientHeight - (initial.htmlClientHeight || 0),
      };

      // Only log if significant change
      if (Math.abs(delta.viewportHeight) > 50 || Math.abs(delta.scrollY) > 10 || Math.abs(delta.rootClientHeight) > 10 || Math.abs(delta.bodyClientHeight) > 10 || Math.abs(delta.htmlClientHeight) > 10) {
        log("VIEWPORT_RESIZE", { initial, current, delta });
      }
    };

    // Track scroll events
    const handleScroll = () => {
      if (!initialStateRef.current) return;

      const currentScrollY = window.scrollY || window.pageYOffset;
      const delta = currentScrollY - initialStateRef.current.scrollY;

      if (Math.abs(delta) > 5) {
        log("SCROLL_EVENT", {
          currentScrollY,
          delta,
          initialScrollY: initialStateRef.current.scrollY,
        });
      }
    };

    // Attach listeners
    window.addEventListener("focusin", handleFocusIn, { capture: true });
    window.addEventListener("focusout", handleFocusOut, { capture: true });
    
    if (VisualViewport) {
      VisualViewport.addEventListener("resize", handleViewportResize);
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });

    return () => {
      window.removeEventListener("focusin", handleFocusIn, { capture: true });
      window.removeEventListener("focusout", handleFocusOut, { capture: true });
      
      if (VisualViewport) {
        VisualViewport.removeEventListener("resize", handleViewportResize);
      }
      
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [enabled]);

  return { logs, clearLogs: () => setLogs([]) };
}

export default useKeyboardDiagnostic;