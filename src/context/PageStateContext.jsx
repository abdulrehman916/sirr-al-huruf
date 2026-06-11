import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "app_page_state_v1";
const SCROLL_KEY  = "app_scroll_pos_v1";

// ── Safe localStorage helpers ───────────────────────────────────
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or private mode — fail silently
  }
}

function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

// ── Context ─────────────────────────────────────────────────────
const PageStateContext = createContext(null);

export function PageStateProvider({ children }) {
  // Hydrate immediately from localStorage on mount
  const [pageStates, setPageStates] = useState(() => loadFromStorage(STORAGE_KEY, {}));
  const [scrollPositions, setScrollPositions] = useState(() => loadFromStorage(SCROLL_KEY, {}));

  // Persist page states to localStorage immediately on every change
  useEffect(() => {
    saveToStorage(STORAGE_KEY, pageStates);
  }, [pageStates]);

  useEffect(() => {
    saveToStorage(SCROLL_KEY, scrollPositions);
  }, [scrollPositions]);

  // ── Page state API ───────────────────────────────────────────
  const getPageState = useCallback((pageKey, initialState) => {
    if (pageStates[pageKey] === undefined) return initialState;
    // Merge with initialState so any new keys added to initialState are included
    return { ...initialState, ...pageStates[pageKey] };
  }, [pageStates]);

  const setPageState = useCallback((pageKey, state) => {
    setPageStates(prev => ({ ...prev, [pageKey]: state }));
  }, []);

  const clearPageState = useCallback((pageKey) => {
    setPageStates(prev => {
      const next = { ...prev };
      delete next[pageKey];
      return next;
    });
  }, []);

  // ── Scroll position API ──────────────────────────────────────
  const saveScrollPosition = useCallback((routePath, position) => {
    setScrollPositions(prev => ({ ...prev, [routePath]: position }));
  }, []);

  const getScrollPosition = useCallback((routePath) => {
    return scrollPositions[routePath] ?? 0;
  }, [scrollPositions]);

  // ── Nuclear reset (explicit user action only) ────────────────
  const resetAllState = useCallback(() => {
    setPageStates({});
    setScrollPositions({});
    removeFromStorage(STORAGE_KEY);
    removeFromStorage(SCROLL_KEY);
  }, []);

  return (
    <PageStateContext.Provider value={{
      getPageState,
      setPageState,
      clearPageState,
      saveScrollPosition,
      getScrollPosition,
      resetAllState,
    }}>
      {children}
    </PageStateContext.Provider>
  );
}

export function usePageState() {
  const context = useContext(PageStateContext);
  if (!context) throw new Error("usePageState must be used within PageStateProvider");
  return context;
}

// ── Convenience hook: auto-save + auto-restore scroll ──────────
// Use in any page: useScrollPersist() — no args needed
export function useScrollPersist() {
  const { saveScrollPosition, getScrollPosition } = usePageState();
  const location = useLocation();
  const scrollContainerSelector = '[data-scroll-container="true"]';

  // Restore scroll on mount
  useEffect(() => {
    const saved = getScrollPosition(location.pathname);
    if (!saved) return;
    const el = document.querySelector(scrollContainerSelector);
    if (el) el.scrollTop = saved;
  }, [location.pathname]);

  // Save scroll continuously
  useEffect(() => {
    const el = document.querySelector(scrollContainerSelector);
    if (!el) return;
    const onScroll = () => saveScrollPosition(location.pathname, el.scrollTop);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [location.pathname, saveScrollPosition]);
}