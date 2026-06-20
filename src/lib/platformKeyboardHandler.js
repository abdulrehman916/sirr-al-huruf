/**
 * Platform-Specific Keyboard Handler
 * 
 * Handles keyboard viewport behavior differently for:
 * - iOS Safari: Lock scroll position, prevent jumping
 * - Android Chrome: Use CSS env(keyboard-height)
 * - Desktop/Tablet: No special handling
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
 * Get keyboard height from visualViewport API
 */
function getKeyboardHeight() {
  if (!window.visualViewport) return 0;
  const viewportHeight = window.visualViewport.height;
  const windowHeight = window.innerHeight;
  return Math.max(0, windowHeight - viewportHeight);
}

/**
 * iOS Safari: Lock scroll position when keyboard opens
 * Prevents viewport from jumping or showing white space
 */
export function setupIOSKeyboardLock(containerRef) {
  const { isIOS } = getPlatform();
  if (!isIOS || !containerRef?.current) {
    return () => {};
  }
  
  const container = containerRef.current;
  let savedScrollY = 0;
  
  const handleFocusIn = (e) => {
    const target = e.target;
    if (!target || !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
      return;
    }
    
    // Save current scroll position
    savedScrollY = window.scrollY;
    
    // Lock body scroll to prevent jumping
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Scroll focused element into view after keyboard opens
    setTimeout(() => {
      if (container && target instanceof HTMLElement) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const offset = targetRect.top - containerRect.top - 100;
        
        if (offset < 0 || offset > container.clientHeight - 100) {
          container.scrollTo({
            top: container.scrollTop + offset,
            behavior: 'smooth'
          });
        }
      }
    }, 300);
  };
  
  const handleFocusOut = () => {
    // Restore body scroll
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    
    // Restore scroll position
    window.scrollTo(0, savedScrollY);
  };
  
  window.addEventListener('focusin', handleFocusIn, { capture: true });
  window.addEventListener('focusout', handleFocusOut, { capture: true });
  
  return () => {
    window.removeEventListener('focusin', handleFocusIn, { capture: true });
    window.removeEventListener('focusout', handleFocusOut, { capture: true });
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
  };
}

/**
 * Android Chrome: Minimal handling
 * Android handles keyboard viewport better natively
 * Just ensure padding accounts for keyboard
 */
export function setupAndroidKeyboardPadding(containerRef) {
  const { isAndroid } = getPlatform();
  if (!isAndroid || !containerRef?.current) {
    return () => {};
  }
  
  const container = containerRef.current;
  
  const updatePadding = () => {
    const keyboardHeight = getKeyboardHeight();
    if (keyboardHeight > 0) {
      container.style.paddingBottom = `${keyboardHeight + 16}px`;
    } else {
      container.style.paddingBottom = '16px';
    }
  };
  
  window.visualViewport?.addEventListener('resize', updatePadding);
  updatePadding(); // Initial call
  
  return () => {
    window.visualViewport?.removeEventListener('resize', updatePadding);
    container.style.paddingBottom = '16px';
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
  
  // Fallback: no handling
  return () => {};
}