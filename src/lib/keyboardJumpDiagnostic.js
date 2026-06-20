/**
 * KEYBOARD JUMP DIAGNOSTIC TOOL
 * 
 * This tool logs EVERY viewport, scroll, resize, and focus event
 * to identify the exact source of page movement on keyboard open.
 * 
 * Usage: Import this component and render it at the root of any page experiencing the issue.
 * 
 * Example: import KeyboardDiagnostic from '@/lib/keyboardJumpDiagnostic';
 *          <KeyboardDiagnostic />
 */

import { useEffect, useRef, useState } from 'react';

export default function KeyboardDiagnostic() {
  const [logs, setLogs] = useState([]);
  const logRef = useRef([]);
  const scrollYBeforeFocus = useRef(null);
  const focusTime = useRef(null);

  const addLog = (type, data) => {
    const timestamp = new Date().toISOString().substr(17, 12);
    const log = { timestamp, type, data };
    logRef.current.push(log);
    setLogs([...logRef.current].slice(-50)); // Keep last 50 logs
    console.log(`[KEYBOARD_DIAG] ${timestamp} | ${type}`, data);
  };

  useEffect(() => {
    addLog('INIT', {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      screenHeight: window.screen.height,
      visualViewport: window.visualViewport ? {
        height: window.visualViewport.height,
        offsetTop: window.visualViewport.offsetTop,
        scale: window.visualViewport.scale
      } : 'not supported'
    });

    // Track ALL resize events
    const handleResize = () => {
      addLog('RESIZE', {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        screenHeight: window.screen.height,
        visualViewport: window.visualViewport ? {
          height: window.visualViewport.height,
          offsetTop: window.visualViewport.offsetTop,
          scale: window.visualViewport.scale
        } : null,
        timeSinceFocus: focusTime.current ? Date.now() - focusTime.current : null
      });
    };

    // Track ALL scroll events
    const handleScroll = () => {
      addLog('SCROLL', {
        scrollY: window.scrollY,
        pageYOffset: window.pageYOffset,
        scrollTop: document.scrollingElement?.scrollTop,
        scrollLeft: document.scrollingElement?.scrollLeft,
        activeElement: document.activeElement?.tagName,
        visualViewport: window.visualViewport ? {
          height: window.visualViewport.height,
          offsetTop: window.visualViewport.offsetTop
        } : null
      });
    };

    // Track focus events (keyboard open)
    const handleFocusIn = (e) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
      if (!isInput) return;

      scrollYBeforeFocus.current = window.scrollY;
      focusTime.current = Date.now();

      addLog('FOCUS_IN', {
        tagName: e.target.tagName,
        type: e.target.type,
        scrollYBefore: scrollYBeforeFocus.current,
        innerHeight: window.innerHeight,
        visualViewport: window.visualViewport ? {
          height: window.visualViewport.height,
          offsetTop: window.visualViewport.offsetTop
        } : null,
        activeElement: document.activeElement?.tagName
      });

      // Check again after 100ms (keyboard may still be opening)
      setTimeout(() => {
        addLog('FOCUS_IN_100MS', {
          scrollY: window.scrollY,
          scrollYDelta: window.scrollY - (scrollYBeforeFocus.current || 0),
          innerHeight: window.innerHeight,
          innerHeightDelta: window.innerHeight - (window.innerHeight),
          visualViewport: window.visualViewport ? {
            height: window.visualViewport.height,
            offsetTop: window.visualViewport.offsetTop
          } : null
        });
      }, 100);

      // Check again after 500ms (keyboard fully open)
      setTimeout(() => {
        addLog('FOCUS_IN_500MS', {
          scrollY: window.scrollY,
          scrollYDelta: window.scrollY - (scrollYBeforeFocus.current || 0),
          innerHeight: window.innerHeight,
          innerHeightBefore: window.innerHeight,
          visualViewport: window.visualViewport ? {
            height: window.visualViewport.height,
            offsetTop: window.visualViewport.offsetTop
          } : null
        });
      }, 500);
    };

    const handleFocusOut = () => {
      addLog('FOCUS_OUT', {
        scrollY: window.scrollY,
        scrollYDelta: window.scrollY - (scrollYBeforeFocus.current || 0),
        innerHeight: window.innerHeight,
        timeSinceFocus: focusTime.current ? Date.now() - focusTime.current : null
      });
      focusTime.current = null;
      scrollYBeforeFocus.current = null;
    };

    // Track ResizeObserver if present
    const originalResizeObserver = window.ResizeObserver;
    if (originalResizeObserver) {
      window.ResizeObserver = class extends originalResizeObserver {
        constructor(callback) {
          super((entries, observer) => {
            const hasViewportChange = entries.some(entry => {
              const rect = entry.contentRect;
              return rect.height < window.innerHeight * 0.8; // Significant height change
            });
            if (hasViewportChange) {
              addLog('RESIZE_OBSERVER', {
                entries: entries.map(e => ({
                  target: e.target.tagName,
                  height: e.contentRect.height,
                  width: e.contentRect.width
                }))
              });
            }
            callback(entries, observer);
          });
        }
      };
    }

    // Attach listeners
    window.addEventListener('resize', handleResize, { passive: true, capture: true });
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('focusin', handleFocusIn, { capture: true });
    window.addEventListener('focusout', handleFocusOut, { capture: true });

    addLog('LISTENERS_ATTACHED', {
      resize: true,
      scroll: true,
      focusin: true,
      focusout: true
    });

    return () => {
      window.removeEventListener('resize', handleResize, { capture: true });
      window.removeEventListener('scroll', handleScroll, { capture: true });
      window.removeEventListener('focusin', handleFocusIn, { capture: true });
      window.removeEventListener('focusout', handleFocusOut, { capture: true });
      window.ResizeObserver = originalResizeObserver;
      addLog('LISTENERS_REMOVED', {});
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      maxHeight: '40vh',
      overflow: 'auto',
      background: 'rgba(0,0,0,0.95)',
      color: '#0f0',
      fontSize: '10px',
      fontFamily: 'monospace',
      zIndex: 999999,
      padding: '8px',
      border: '2px solid #f00'
    }}>
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        background: '#f00', 
        color: '#fff', 
        padding: '4px',
        fontWeight: 'bold',
        marginBottom: '8px'
      }}>
        🔍 KEYBOARD DIAGNOSTIC (Tap input to test)
      </div>
      <div style={{ marginBottom: '4px' }}>
        Current: scrollY={window.scrollY} | innerHeight={window.innerHeight} | 
        viewport.height={window.visualViewport?.height?.toFixed(0)} | 
        viewport.offsetTop={window.visualViewport?.offsetTop?.toFixed(0)}
      </div>
      {logs.map((log, i) => (
        <div key={i} style={{ 
          marginBottom: '2px', 
          borderBottom: '1px solid #333',
          paddingBottom: '2px'
        }}>
          <span style={{ color: '#888' }}>{log.timestamp}</span>
          {' '}
          <span style={{ color: '#ff0', fontWeight: 'bold' }}>{log.type}</span>
          {' '}
          <span style={{ color: '#0ff' }}>{JSON.stringify(log.data)}</span>
        </div>
      ))}
    </div>
  );
}