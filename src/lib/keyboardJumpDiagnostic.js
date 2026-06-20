/**
 * KEYBOARD JUMP DIAGNOSTIC TOOL
 * 
 * This logs EXACTLY what happens when an input receives focus.
 * Attach this to PageLayout to trace the bug.
 * 
 * Logs:
 * 1. window.scrollY before/after focus
 * 2. visualViewport.height changes
 * 3. Which container scrolls
 * 4. Which element changes position
 * 5. Active element details
 */

export function attachKeyboardJumpDiagnostic() {
  if (typeof window === 'undefined') return () => {};

  console.log('🔍 [KEYBOARD DIAGNOSTIC] Attaching listeners...');

  let beforeState = null;
  let afterState = null;

  const getScrollState = () => ({
    windowScrollY: window.scrollY,
    windowScrollX: window.scrollX,
    visualViewportHeight: window.visualViewport?.height || window.innerHeight,
    visualViewportOffsetTop: window.visualViewport?.offsetTop || 0,
    innerHeight: window.innerHeight,
    outerHeight: window.outerHeight,
    screenTop: window.screenTop || 0,
    activeElement: document.activeElement?.tagName || 'null',
    activeElementClass: document.activeElement?.className || '',
    activeElementRect: document.activeElement?.getBoundingClientRect() 
      ? {
          top: document.activeElement.getBoundingClientRect().top,
          bottom: document.activeElement.getBoundingClientRect().bottom,
          height: document.activeElement.getBoundingClientRect().height
        } 
      : null,
    rootScrollTop: document.getElementById('root')?.scrollTop || 0,
    bodyScrollTop: document.body.scrollTop || 0,
    htmlScrollTop: document.documentElement.scrollTop || 0,
  });

  const findScrollableContainers = () => {
    const containers = [];
    const selectors = [
      '[data-scroll-container="true"]',
      '[role="main"]',
      '.flex-1',
      '[style*="overflow"]',
      '#root',
      'body',
      'html'
    ];
    
    selectors.forEach(selector => {
      try {
        const el = document.querySelector(selector);
        if (el) {
          containers.push({
            selector,
            element: el,
            scrollTop: el.scrollTop || 0,
            scrollHeight: el.scrollHeight || 0,
            clientHeight: el.clientHeight || 0,
            offsetTop: el.offsetTop || 0,
            computedOverflow: window.getComputedStyle(el).overflowY || window.getComputedStyle(el).overflow || 'auto',
            computedPosition: window.getComputedStyle(el).position || 'static',
            computedHeight: window.getComputedStyle(el).height || 'auto',
            computedFlex: window.getComputedStyle(el).flex || 'none',
            rect: el.getBoundingClientRect()
          });
        }
      } catch (e) {
        // ignore
      }
    });
    
    return containers;
  };

  const handleFocusIn = (e) => {
    const target = e.target;
    if (!target || !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
      return;
    }

    console.group('⌨️ [KEYBOARD DIAGNOSTIC] FOCUS EVENT STARTED');
    
    // Capture BEFORE state
    beforeState = {
      ...getScrollState(),
      timestamp: Date.now(),
      containers: findScrollableContainers(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      devicePixelRatio: window.devicePixelRatio
    };

    console.log('📊 BEFORE KEYBOARD:', beforeState);
    console.table(beforeState.containers.map(c => ({
      selector: c.selector,
      scrollTop: c.scrollTop,
      height: c.computedHeight,
      flex: c.computedFlex,
      overflow: c.computedOverflow,
      position: c.computedPosition,
      rectTop: c.rect.top,
      rectBottom: c.rect.bottom
    })));

    // Capture AFTER state (delayed to allow keyboard to open)
    setTimeout(() => {
      afterState = {
        ...getScrollState(),
        timestamp: Date.now(),
        containers: findScrollableContainers(),
      };

      console.log('📊 AFTER KEYBOARD:', afterState);
      console.table(afterState.containers.map(c => {
        const beforeContainer = beforeState.containers.find(bc => bc.selector === c.selector);
        return {
          selector: c.selector,
          scrollTopBefore: beforeContainer?.scrollTop || 0,
          scrollTopAfter: c.scrollTop,
          scrollTopChange: c.scrollTop - (beforeContainer?.scrollTop || 0),
          rectTopBefore: beforeContainer?.rect.top || 0,
          rectTopAfter: c.rect.top,
          rectTopChange: c.rect.top - (beforeContainer?.rect.top || 0),
          rectBottomBefore: beforeContainer?.rect.bottom || 0,
          rectBottomAfter: c.rect.bottom,
          rectBottomChange: c.rect.bottom - (beforeContainer?.rect.bottom || 0),
          height: c.computedHeight,
          flex: c.computedFlex,
          overflow: c.computedOverflow
        };
      }));

      // Calculate changes
      const changes = {
        windowScrollYChange: afterState.windowScrollY - beforeState.windowScrollY,
        visualViewportHeightChange: afterState.visualViewportHeight - beforeState.visualViewportHeight,
        innerHeightChange: afterState.innerHeight - beforeState.innerHeight,
        activeElementTopChange: (afterState.activeElementRect?.top || 0) - (beforeState.activeElementRect?.top || 0),
      };

      console.log('🔍 CHANGES DETECTED:', changes);

      // Identify the culprit
      const culprit = afterState.containers.find((c, idx) => {
        const beforeContainer = beforeState.containers[idx];
        if (!beforeContainer) return false;
        
        const scrollTopChanged = Math.abs(c.scrollTop - beforeContainer.scrollTop) > 1;
        const rectTopChanged = Math.abs(c.rect.top - beforeContainer.rect.top) > 10;
        const rectBottomChanged = Math.abs(c.rect.bottom - beforeContainer.rect.bottom) > 10;
        
        return scrollTopChanged || rectTopChanged || rectBottomChanged;
      });

      if (culprit) {
        const beforeContainer = beforeState.containers.find(bc => bc.selector === culprit.selector);
        console.error('🚨 CULPRIT IDENTIFIED:', {
          selector: culprit.selector,
          element: culprit.element,
          className: culprit.element.className,
          id: culprit.element.id,
          scrollTopChange: culprit.scrollTop - (beforeContainer?.scrollTop || 0),
          rectTopChange: culprit.rect.top - (beforeContainer?.rect.top || 0),
          rectBottomChange: culprit.rect.bottom - (beforeContainer?.rect.bottom || 0),
          computedFlex: culprit.computedFlex,
          computedHeight: culprit.computedHeight,
          computedOverflow: culprit.computedOverflow,
          computedPosition: culprit.computedPosition
        });
      } else {
        console.warn('⚠️ No scrolling container identified. The jump may be from browser default behavior.');
      }

      console.groupEnd();
    }, 500); // Wait for keyboard animation to complete
  };

  const handleVisualViewportResize = () => {
    console.log('👁️ [VISUAL VIEWPORT] Resize event:', {
      height: window.visualViewport?.height,
      offsetTop: window.visualViewport?.offsetTop,
      pageLeft: window.visualViewport?.pageLeft,
      pageTop: window.visualViewport?.pageTop
    });
  };

  // Attach listeners
  window.addEventListener('focusin', handleFocusIn, { capture: true });
  window.visualViewport?.addEventListener('resize', handleVisualViewportResize, { capture: true });

  console.log('✅ [KEYBOARD DIAGNOSTIC] Listeners attached. Open console and tap an input field to see diagnostics.');

  return () => {
    window.removeEventListener('focusin', handleFocusIn, { capture: true });
    window.visualViewport?.removeEventListener('resize', handleVisualViewportResize, { capture: true });
    console.log('🛑 [KEYBOARD DIAGNOSTIC] Listeners removed.');
  };
}