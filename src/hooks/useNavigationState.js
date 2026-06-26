import { useEffect, useCallback, useRef } from 'react';
import { usePageState } from '../context/PageStateContext';

/**
 * Hook to preserve and restore complete list state across navigation.
 * Automatically handles scroll position, search, filters, sort, and expanded items.
 * 
 * @param {string} listKey - Unique identifier for this list (e.g., 'holy-names-section-a')
 * @param {object} initialState - Default state values
 * @returns {object} State and handlers
 */
export function useNavigationState(listKey, initialState = {}) {
  const { getPageState, setPageState } = usePageState();
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const isRestoringRef = useRef(false);

  // Get current state from storage
  const currentState = getPageState(listKey, {
    searchQuery: '',
    filters: {},
    sortField: null,
    sortDirection: 'asc',
    sortIdx: 0,
    category: 'all',
    expandedItems: [],
    openId: null,
    scrollTop: 0,
    scrollPosition: 0,
    currentPage: 1,
    selectedTab: null,
    ...initialState
  });

  // Update specific state fields
  const updateState = useCallback((updates) => {
    setPageState(listKey, {
      ...currentState,
      ...updates,
      _lastUpdated: Date.now()
    });
  }, [listKey, currentState, setPageState]);

  // Reset to initial state (user-initiated clear)
  const resetState = useCallback(() => {
    const reset = {
      searchQuery: '',
      filters: {},
      sortField: null,
      sortDirection: 'asc',
      sortIdx: 0,
      category: 'all',
      expandedItems: [],
      openId: null,
      scrollTop: 0,
      scrollPosition: 0,
      currentPage: 1,
      selectedTab: null,
      ...initialState
    };
    setPageState(listKey, { ...reset, _lastUpdated: Date.now() });
  }, [listKey, initialState, setPageState]);

  // Restore scroll position on mount
  useEffect(() => {
    if (isRestoringRef.current) return;
    isRestoringRef.current = true;

    const savedScroll = currentState.scrollTop || currentState.scrollPosition || 0;
    
    if (savedScroll > 0) {
      rafRef.current = requestAnimationFrame(() => {
        const container = containerRef.current || document.querySelector('[data-scroll-container="true"]');
        if (container) {
          container.scrollTop = savedScroll;
        }
      });
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [currentState.scrollTop, currentState.scrollPosition]);

  // Save scroll position continuously (throttled with RAF)
  useEffect(() => {
    const container = containerRef.current || document.querySelector('[data-scroll-container="true"]');
    if (!container) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setPageState(listKey, {
            scrollTop: container.scrollTop,
            scrollPosition: container.scrollTop
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [listKey, setPageState]);

  // Save state before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const container = containerRef.current || document.querySelector('[data-scroll-container="true"]');
      if (container) {
        setPageState(listKey, {
          scrollTop: container.scrollTop,
          scrollPosition: container.scrollTop
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [listKey, setPageState]);

  return {
    state: currentState,
    updateState,
    resetState,
    containerRef
  };
}

/**
 * Hook to manage navigation stack for list→detail flows.
 * Pushes state before navigating to detail, restores on return.
 */
export function useNavigationStack(pageKey) {
  const { pushNavState, popNavState, getPageState } = usePageState();

  // Push current state to stack before navigating to detail
  const pushState = useCallback((state) => {
    pushNavState(pageKey, {
      ...state,
      timestamp: Date.now()
    });
  }, [pageKey, pushNavState]);

  // Pop state from stack when returning from detail
  const popState = useCallback(() => {
    return popNavState(pageKey);
  }, [pageKey, popNavState]);

  // Get last saved state for this page
  const getLastState = useCallback(() => {
    return popNavState(pageKey)?.state || null;
  }, [pageKey, popNavState]);

  return {
    pushState,
    popState,
    getLastState
  };
}