/**
 * Platform-Specific Keyboard Handler
 * 
 * CRITICAL: DO NOT MOVE THE PAGE WHEN KEYBOARD OPENS
 * - NO scrollIntoView()
 * - NO automatic scrolling
 * - NO viewport movement
 * - NO layout shift
 * - Page stays EXACTLY where it is
 * - Keyboard opens UNDERNEATH
 * 
 * Usage in PageLayout:
 *   useEffect(() => setupKeyboardBehavior(scrollRef), [scrollRef]);
 */

/**
 * Detect platform from user agent
 */
function getPlatform() {
  const ua = navigator.userAgent || navigator.vendor;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/.test(ua);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
  const isDesktop = !isIOS && !isAndroid;
  
  return { isIOS, isAndroid, isTablet, isDesktop };
}

/**
 * iOS Safari: Completely disable keyboard-induced scrolling
 * Page stays EXACTLY where it is - keyboard opens underneath
 */
export function setupIOSKeyboardLock(containerRef) {
  const { isIOS } = getPlatform();
  if (!isIOS || !containerRef?.current) {
    return () => {};
  }
  
  const container = containerRef.current;
  let savedScrollY = 0;
  let isLocked = false;
  
  const handleFocusIn = (e) => {
    const target = e.target;
    if (!target || !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
      return;
    }
    
    // CRITICAL: Do NOT scroll, do NOT move viewport
    // Just lock the current position
    isLocked = true;
    savedScrollY = container.scrollTop;
    
    // Prevent any viewport resizing
    container.style.position = 'relative';
    container.style.overflowY = 'auto';
  };
  
  const handleFocusOut = () => {
    if (!isLocked) return;
    
    // Restore to exact same scroll position
    container.scrollTop = savedScrollY;
    container.style.position = '';
    container.style.overflowY = 'auto';
    isLocked = false;
  };
  
  // Prevent visualViewport from triggering layout shifts
  const handleVisualViewportResize = () => {
    if (isLocked) {
      // Keep scroll position absolutely fixed
      container.scrollTop = savedScrollY;
    }
  };
  
  window.addEventListener('focusin', handleFocusIn, { capture: true });
  window.addEventListener('focusout', handleFocusOut, { capture: true });
  window.visualViewport?.addEventListener('resize', handleVisualViewportResize, { capture: true });
  
  return () => {
    window.removeEventListener('focusin', handleFocusIn, { capture: true });
    window.removeEventListener('focusout', handleFocusOut, { capture: true });
    window.visualViewport?.removeEventListener('resize', handleVisualViewportResize, { capture: true });
    container.style.position = '';
    container.style.overflowY = 'auto';
  };
}

/**
 * Android Chrome: NO viewport movement
 * Keyboard opens underneath, page stays stationary
 */
export function setupAndroidKeyboardPadding(containerRef) {
  const { isAndroid } = getPlatform();
  if (!isAndroid || !containerRef?.current) {
    return () => {};
  }
  
  const container = containerRef.current;
  let savedScrollY = 0;
  let isKeyboardOpen = false;
  
  const handleFocusIn = (e) => {
    const target = e.target;
    if (!target || !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
      return;
    }
    
    // CRITICAL: Do NOT move the page
    isKeyboardOpen = true;
    savedScrollY = container.scrollTop;
  };
  
  const handleFocusOut = () => {
    if (!isKeyboardOpen) return;
    
    // Restore exact scroll position
    container.scrollTop = savedScrollY;
    isKeyboardOpen = false;
  };
  
  const handleVisualViewportResize = () => {
    if (isKeyboardOpen) {
      // Keep scroll position absolutely fixed - no movement
      container.scrollTop = savedScrollY;
    }
  };
  
  window.addEventListener('focusin', handleFocusIn, { capture: true });
  window.addEventListener('focusout', handleFocusOut, { capture: true });
  window.visualViewport?.addEventListener('resize', handleVisualViewportResize, { capture: true });
  
  return () => {
    window.removeEventListener('focusin', handleFocusIn, { capture: true });
    window.removeEventListener('focusout', handleFocusOut, { capture: true });
    window.visualViewport?.removeEventListener('resize', handleVisualViewportResize, { capture: true });
  };
}

/**
 * Desktop/Tablet: No special keyboard handling
 */
export function setupDesktopKeyboard() {
  return () => {};
}

/**
 * Main setup function - detects platform and applies correct handler
 * CRITICAL: NO SCROLLING, NO VIEWPORT MOVEMENT
 */
export function setupKeyboardBehavior(containerRef) {
  const { isIOS, isAndroid, isTablet, isDesktop } = getPlatform();
  
  if (isDesktop || isTablet) {
    return setupDesktopKeyboard();
  }
  
  if (isIOS) {
    return setupIOSKeyboardLock(containerRef);
  }
  
  if (isAndroid) {
    return setupAndroidKeyboardPadding(containerRef);
  }
  
  return () => {};
}