/**
 * Mobile Scroll Lock Utility
 * Prevents page jump and blank areas when keyboard opens on mobile
 */

let originalScrollY = 0;
let isLocked = false;

export function setupMobileScrollLock() {
  if (typeof window === 'undefined') return;

  // Only apply on mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (!isMobile) return;

  // Handle keyboard open/close events
  if (window.visualViewport) {
    let lastHeight = window.visualViewport.height;
    let keyboardOpen = false;

    window.visualViewport.addEventListener('resize', () => {
      const currentHeight = window.visualViewport.height;
      const viewportHeight = window.innerHeight;

      // Keyboard opened
      if (currentHeight < lastHeight && currentHeight < viewportHeight * 0.9) {
        if (!keyboardOpen) {
          keyboardOpen = true;
          lockScroll();
        }
      }

      // Keyboard closed
      if (currentHeight > lastHeight && keyboardOpen) {
        keyboardOpen = false;
        unlockScroll();
      }

      lastHeight = currentHeight;
    });
  }

  // Handle focus/blur on inputs
  document.addEventListener('focusin', handleFocusIn, { capture: true });
  document.addEventListener('focusout', handleFocusOut, { capture: true });

  return () => {
    document.removeEventListener('focusin', handleFocusIn, { capture: true });
    document.removeEventListener('focusout', handleFocusOut, { capture: true });
  };
}

function handleFocusIn(event) {
  const target = event.target;
  if (isInput(target)) {
    lockScroll();
  }
}

function handleFocusOut(event) {
  const target = event.target;
  if (isInput(target)) {
    setTimeout(() => {
      // Check if another input is focused
      if (!document.activeElement || !isInput(document.activeElement)) {
        unlockScroll();
      }
    }, 100);
  }
}

function isInput(element) {
  if (!element) return false;
  const tagName = element.tagName?.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    element.isContentEditable
  );
}

function lockScroll() {
  if (isLocked) return;
  isLocked = true;

  const body = document.body;
  originalScrollY = window.scrollY;

  body.style.position = 'fixed';
  body.style.top = `-${originalScrollY}px`;
  body.style.width = '100%';
  body.style.overflow = 'hidden';
}

function unlockScroll() {
  if (!isLocked) return;
  isLocked = false;

  const body = document.body;

  body.style.position = '';
  body.style.top = '';
  body.style.width = '';
  body.style.overflow = '';

  window.scrollTo(0, originalScrollY);
}