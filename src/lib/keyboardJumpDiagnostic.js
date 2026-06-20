/**
 * KEYBOARD JUMP DIAGNOSTIC TOOL - COMPLETE
 * 
 * Logs EXACTLY what happens when keyboard opens on mobile.
 * Attach to PageLayout to trace the bug.
 * 
 * Usage: Uncomment in PageLayout.jsx:
 *   useEffect(() => setupKeyboardJumpDiagnostic(), []);
 */

export function setupKeyboardJumpDiagnostic() {
  if (typeof window === 'undefined') return () => {};

  console.log('🔍 [KEYBOARD DIAGNOSTIC] Attaching listeners...');

  let beforeState = null;
  let afterState = null;

  const getScrollState = () => {
    const state = {
      // WINDOW SCROLL
      windowScrollY: window.scrollY,
      windowScrollX: window.scrollX,
      windowPageYOffset: window.pageYOffset,
      windowPageXOffset: window.pageXOffset,
      
      // DOCUMENT SCROLLING ELEMENT (main scroll container)
      documentScrollingElementScrollTop: document.scrollingElement?.scrollTop || 0,
      documentScrollingElementScrollLeft: document.scrollingElement?.scrollLeft || 0,
      documentScrollingElementClientHeight: document.scrollingElement?.clientHeight || 0,
      documentScrollingElementScrollHeight: document.scrollingElement?.scrollHeight || 0,
      
      // HTML & BODY SCROLL
      htmlScrollTop: document.documentElement?.scrollTop || 0,
      htmlScrollLeft: document.documentElement?.scrollLeft || 0,
      bodyScrollTop: document.body?.scrollTop || 0,
      bodyScrollLeft: document.body?.scrollLeft || 0,
      
      // ROOT ELEMENT SCROLL
      rootScrollTop: document.getElementById('root')?.scrollTop || 0,
      rootScrollLeft: document.getElementById('root')?.scrollLeft || 0,
      rootClientHeight: document.getElementById('root')?.clientHeight || 0,
      rootScrollHeight: document.getElementById('root')?.scrollHeight || 0,
      
      // VISUAL VIEWPORT (keyboard affects this)
      visualViewportHeight: window.visualViewport?.height || 0,
      visualViewportWidth: window.visualViewport?.width || 0,
      visualViewportOffsetTop: window.visualViewport?.offsetTop || 0,
      visualViewportOffsetLeft: window.visualViewport?.offsetLeft || 0,
      visualViewportPageTop: window.visualViewport?.pageTop || 0,
      visualViewportPageLeft: window.visualViewport?.pageLeft || 0,
      
      // WINDOW DIMENSIONS
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      outerHeight: window.outerHeight,
      outerWidth: window.outerWidth,
      
      // SCREEN POSITION
      screenTop: window.screenTop || 0,
      screenLeft: window.screenLeft || 0,
      screenY: window.screenY || 0,
      screenX: window.screenX || 0,
      
      // ACTIVE ELEMENT INFO
      activeElement: document.activeElement?.tagName || 'null',
      activeElementClass: document.activeElement?.className || '',
      activeElementId: document.activeElement?.id || '',
    };

    // Get active element position
    if (document.activeElement && document.activeElement.getBoundingClientRect) {
      const rect = document.activeElement.getBoundingClientRect();
      state.activeElementRect = {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height,
        y: rect.y,
        x: rect.x
      };
    }

    return state;
  };

  const findScrollableContainers = () => {
    const containers = [];
    
    // Check all potential scroll containers
    const selectors = [
      { selector: '[data-scroll-container="true"]', name: 'PageLayout Scroll Container' },
      { selector: '#root', name: '#root' },
      { selector: 'body', name: 'body' },
      { selector: 'html', name: 'html' },
      { selector: '[role="main"]', name: '[role="main"]' },
      { selector: '.flex-1', name: '.flex-1' },
    ];
    
    selectors.forEach(({ selector, name }) => {
      try {
        const el = document.querySelector(selector);
        if (el) {
          const computed = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          
          containers.push({
            name,
            selector,
            element: el,
            scrollTop: el.scrollTop || 0,
            scrollLeft: el.scrollLeft || 0,
            scrollHeight: el.scrollHeight || 0,
            clientHeight: el.clientHeight || 0,
            offsetTop: el.offsetTop || 0,
            computedOverflowY: computed.overflowY || 'auto',
            computedOverflowX: computed.overflowX || 'auto',
            computedPosition: computed.position || 'static',
            computedHeight: computed.height || 'auto',
            computedFlex: computed.flex || 'none',
            computedFlexGrow: computed.flexGrow || '0',
            computedFlexShrink: computed.flexShrink || '1',
            computedTransform: computed.transform || 'none',
            computedWillChange: computed.willChange || 'auto',
            rect: {
              top: rect.top,
              bottom: rect.bottom,
              left: rect.left,
              right: rect.right,
              height: rect.height,
              width: rect.width,
              y: rect.y,
              x: rect.x
            }
          });
        }
      } catch (e) {
        console.warn(`[DIAGNOSTIC] Could not check ${selector}:`, e);
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
    console.log('📍 Target element:', {
      tagName: target.tagName,
      className: target.className,
      id: target.id,
      type: target.type,
      placeholder: target.placeholder,
      value: target.value?.substring(0, 50)
    });
    
    // Capture BEFORE state (immediately on focus)
    beforeState = {
      ...getScrollState(),
      timestamp: Date.now(),
      containers: findScrollableContainers(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      devicePixelRatio: window.devicePixelRatio
    };

    console.log('📊 BEFORE KEYBOARD (focus event):');
    console.table({
      windowScrollY: beforeState.windowScrollY,
      documentScrollingElementScrollTop: beforeState.documentScrollingElementScrollTop,
      htmlScrollTop: beforeState.htmlScrollTop,
      bodyScrollTop: beforeState.bodyScrollTop,
      rootScrollTop: beforeState.rootScrollTop,
      visualViewportHeight: beforeState.visualViewportHeight,
      innerHeight: beforeState.innerHeight,
      activeElement: beforeState.activeElement,
      activeElementTop: beforeState.activeElementRect?.top || 'N/A',
      activeElementBottom: beforeState.activeElementRect?.bottom || 'N/A',
    });

    console.log('📦 SCROLLABLE CONTAINERS (BEFORE):');
    console.table(beforeState.containers.map(c => ({
      name: c.name,
      scrollTop: c.scrollTop,
      clientHeight: c.clientHeight,
      scrollHeight: c.scrollHeight,
      overflowY: c.computedOverflowY,
      flex: c.computedFlex,
      flexGrow: c.computedFlexGrow,
      flexShrink: c.computedFlexShrink,
      position: c.computedPosition,
      height: c.computedHeight,
      rectTop: c.rect.top,
      rectBottom: c.rect.bottom,
      transform: c.computedTransform
    })));

    // Capture AFTER state (delayed to allow keyboard to open)
    setTimeout(() => {
      afterState = {
        ...getScrollState(),
        timestamp: Date.now(),
        containers: findScrollableContainers(),
      };

      console.log('📊 AFTER KEYBOARD (500ms delay):');
      console.table({
        windowScrollY: afterState.windowScrollY,
        documentScrollingElementScrollTop: afterState.documentScrollingElementScrollTop,
        htmlScrollTop: afterState.htmlScrollTop,
        bodyScrollTop: afterState.bodyScrollTop,
        rootScrollTop: afterState.rootScrollTop,
        visualViewportHeight: afterState.visualViewportHeight,
        innerHeight: afterState.innerHeight,
        activeElement: afterState.activeElement,
        activeElementTop: afterState.activeElementRect?.top || 'N/A',
        activeElementBottom: afterState.activeElementRect?.bottom || 'N/A',
      });

      console.log('📦 SCROLLABLE CONTAINERS (AFTER):');
      console.table(afterState.containers.map(c => {
        const beforeContainer = beforeState.containers.find(bc => bc.selector === c.selector);
        return {
          name: c.name,
          scrollTopBefore: beforeContainer?.scrollTop || 0,
          scrollTopAfter: c.scrollTop,
          scrollTopChange: c.scrollTop - (beforeContainer?.scrollTop || 0),
          clientHeight: c.clientHeight,
          overflowY: c.computedOverflowY,
          flex: c.computedFlex,
          flexGrow: c.computedFlexGrow,
          flexShrink: c.computedFlexShrink,
          position: c.computedPosition,
          height: c.computedHeight,
          rectTopBefore: beforeContainer?.rect.top || 0,
          rectTopAfter: c.rect.top,
          rectTopChange: c.rect.top - (beforeContainer?.rect.top || 0),
          rectBottomBefore: beforeContainer?.rect.bottom || 0,
          rectBottomAfter: c.rect.bottom,
          rectBottomChange: c.rect.bottom - (beforeContainer?.rect.bottom || 0),
          transform: c.computedTransform
        };
      }));

      // Calculate changes
      const changes = {
        windowScrollYChange: afterState.windowScrollY - beforeState.windowScrollY,
        documentScrollingElementScrollTopChange: afterState.documentScrollingElementScrollTop - beforeState.documentScrollingElementScrollTop,
        htmlScrollTopChange: afterState.htmlScrollTop - beforeState.htmlScrollTop,
        bodyScrollTopChange: afterState.bodyScrollTop - beforeState.bodyScrollTop,
        rootScrollTopChange: afterState.rootScrollTop - beforeState.rootScrollTop,
        visualViewportHeightChange: afterState.visualViewportHeight - beforeState.visualViewportHeight,
        innerHeightChange: afterState.innerHeight - beforeState.innerHeight,
        visualViewportOffsetTopChange: afterState.visualViewportOffsetTop - beforeState.visualViewportOffsetTop,
        activeElementTopChange: (afterState.activeElementRect?.top || 0) - (beforeState.activeElementRect?.top || 0),
        activeElementBottomChange: (afterState.activeElementRect?.bottom || 0) - (beforeState.activeElementRect?.bottom || 0),
      };

      console.log('🔍 CHANGES DETECTED:', changes);

      // Identify the culprit - which container scrolled?
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
        console.error('🚨 CULPRIT IDENTIFIED:');
        console.error({
          name: culprit.name,
          selector: culprit.selector,
          element: culprit.element,
          className: typeof culprit.element.className === 'string' ? culprit.element.className : 'SVG/Other',
          id: culprit.element.id,
          scrollTopChange: culprit.scrollTop - (beforeContainer?.scrollTop || 0),
          rectTopChange: culprit.rect.top - (beforeContainer?.rect.top || 0),
          rectBottomChange: culprit.rect.bottom - (beforeContainer?.rect.bottom || 0),
          computedFlex: culprit.computedFlex,
          computedFlexGrow: culprit.computedFlexGrow,
          computedFlexShrink: culprit.computedFlexShrink,
          computedHeight: culprit.computedHeight,
          computedOverflowY: culprit.computedOverflowY,
          computedPosition: culprit.computedPosition,
          computedTransform: culprit.computedTransform,
          clientHeight: culprit.clientHeight,
          scrollHeight: culprit.scrollHeight
        });
      } else {
        console.warn('⚠️ No scrolling container identified in PageLayout.');
        console.warn('The jump may be from browser default behavior on document.scrollingElement.');
        console.warn('Check documentScrollingElementScrollTop change above.');
      }

      // Check if browser auto-scrolled
      if (Math.abs(changes.windowScrollYChange) > 10 || Math.abs(changes.documentScrollingElementScrollTopChange) > 10) {
        console.error('🚨 BROWSER AUTO-SCROLL DETECTED!');
        console.error('The browser automatically scrolled the page when keyboard opened.');
        console.error('This is default mobile browser behavior.');
        console.error('Solution: Prevent default focus behavior or use CSS scroll-margin.');
      }

      console.groupEnd();
    }, 500); // Wait for keyboard animation to complete
  };

  const handleVisualViewportResize = () => {
    const state = getScrollState();
    console.log('👁️ [VISUAL VIEWPORT] Resize event:', {
      height: state.visualViewportHeight,
      offsetTop: state.visualViewportOffsetTop,
      pageTop: state.visualViewportPageTop,
      pageLeft: state.visualViewportPageLeft,
      innerHeight: state.innerHeight,
      windowScrollY: state.windowScrollY,
      documentScrollingElementScrollTop: state.documentScrollingElementScrollTop
    });
  };

  // Attach listeners
  window.addEventListener('focusin', handleFocusIn, { capture: true });
  window.visualViewport?.addEventListener('resize', handleVisualViewportResize, { capture: true });

  console.log('✅ [KEYBOARD DIAGNOSTIC] Listeners attached.');
  console.log('📱 Open console on mobile device and tap an input field to see diagnostics.');
  console.log('📋 Check console logs for "CULPRIT IDENTIFIED" message.');

  return () => {
    window.removeEventListener('focusin', handleFocusIn, { capture: true });
    window.visualViewport?.removeEventListener('resize', handleVisualViewportResize, { capture: true });
    console.log('🛑 [KEYBOARD DIAGNOSTIC] Listeners removed.');
  };
}