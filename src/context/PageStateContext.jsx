import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PageStateContext = createContext(null);

export function PageStateProvider({ children }) {
  const [pageStates, setPageStates] = useState({});

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('pageStates');
      if (saved) {
        setPageStates(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('[PageState] Failed to load from sessionStorage:', e);
    }
  }, []);

  // Save to sessionStorage on change
  useEffect(() => {
    try {
      sessionStorage.setItem('pageStates', JSON.stringify(pageStates));
    } catch (e) {
      console.warn('[PageState] Failed to save to sessionStorage:', e);
    }
  }, [pageStates]);

  const getPageState = useCallback((pageKey, defaultValue = {}) => {
    return pageStates[pageKey] ?? defaultValue;
  }, [pageStates]);

  const setPageState = useCallback((pageKey, newState) => {
    setPageStates(prev => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        ...newState
      }
    }));
  }, []);

  const clearPageState = useCallback((pageKey) => {
    setPageStates(prev => {
      const next = { ...prev };
      delete next[pageKey];
      return next;
    });
  }, []);

  return (
    <PageStateContext.Provider value={{ getPageState, setPageState, clearPageState }}>
      {children}
    </PageStateContext.Provider>
  );
}

export function usePageState() {
  const context = useContext(PageStateContext);
  if (!context) {
    throw new Error('usePageState must be used within PageStateProvider');
  }
  return context;
}

// Hook for scroll position persistence
export function useScrollPersist() {
  useEffect(() => {
    const scrollKey = `scroll_${window.location.pathname}`;
    
    // Restore scroll position
    const saved = sessionStorage.getItem(scrollKey);
    if (saved) {
      const scrollContainer = document.querySelector('[data-scroll-container="true"]');
      if (scrollContainer) {
        scrollContainer.scrollTop = parseInt(saved, 10);
      }
    }

    // Save scroll position on unmount
    return () => {
      const scrollContainer = document.querySelector('[data-scroll-container="true"]');
      if (scrollContainer) {
        sessionStorage.setItem(scrollKey, scrollContainer.scrollTop.toString());
      }
    };
  }, []);
}