import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * ZoomableContainer - Allows pinch-to-zoom only within this container
 * Used for: Vefk tables, Magic Square grids, large result tables, Arabic diagrams
 */
export default function ZoomableContainer({ children, className = "", style = {} }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastTouchRef = useRef({ x: 0, y: 0, distance: 0 });

  // Calculate distance between two touch points
  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Get center point between two touches
  const getCenter = (touches) => {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      e.stopPropagation();
      lastTouchRef.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        distance: getDistance(e.touches),
      };
      setIsDragging(true);
    } else if (e.touches.length === 1) {
      lastTouchRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && lastTouchRef.current.distance > 0) {
      e.stopPropagation();
      
      const newDistance = getDistance(e.touches);
      const center = getCenter(e.touches);
      
      // Calculate scale change
      const scaleChange = newDistance / lastTouchRef.current.distance;
      const newScale = Math.min(Math.max(scale * scaleChange, 1), 3); // Min 1x, Max 3x
      
      // Calculate pan offset based on center movement
      const dx = center.x - lastTouchRef.current.x;
      const dy = center.y - lastTouchRef.current.y;
      
      setScale(newScale);
      setPosition(prev => ({
        x: prev.x + dx * (newScale > 1 ? 1 : 0),
        y: prev.y + dy * (newScale > 1 ? 1 : 0),
      }));
      
      lastTouchRef.current = {
        x: center.x,
        y: center.y,
        distance: newDistance,
      };
    } else if (e.touches.length === 1 && scale > 1) {
      e.stopPropagation();
      
      const dx = e.touches[0].clientX - lastTouchRef.current.x;
      const dy = e.touches[0].clientY - lastTouchRef.current.y;
      
      setPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      
      lastTouchRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, [scale]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    lastTouchRef.current = { x: 0, y: 0, distance: 0 };
  }, []);

  // Double-tap to reset zoom
  const handleDoubleClick = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      style={{
        touchAction: 'pan-x pan-y',
        WebkitOverflowScrolling: 'touch',
        contain: 'layout style paint',
        isolation: 'isolate',
        ...style,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
    >
      <motion.div
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          touchAction: 'none',
          willChange: 'transform',
        }}
        animate={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        {children}
      </motion.div>
      
      {/* Zoom indicator */}
      {scale > 1 && (
        <div
          className="absolute top-2 right-2 z-10 px-2 py-1 rounded-md text-xs font-inter font-semibold"
          style={{
            background: 'rgba(212,175,55,0.9)',
            color: '#0d1b2a',
            pointerEvents: 'none',
          }}
        >
          {Math.round(scale * 100)}%
        </div>
      )}
      
      {/* Reset zoom button */}
      {scale > 1 && (
        <button
          onClick={() => {
            setScale(1);
            setPosition({ x: 0, y: 0 });
          }}
          className="absolute top-2 left-2 z-10 px-3 py-1.5 rounded-lg text-xs font-inter font-semibold transition-all"
          style={{
            background: 'rgba(6,12,32,0.95)',
            color: 'rgba(212,175,55,0.9)',
            border: '1px solid rgba(212,175,55,0.3)',
          }}
        >
          ✕ Reset Zoom
        </button>
      )}
    </div>
  );
}