import { useState, useEffect } from "react";

/**
 * useDeviceType - Detects device type (mobile, tablet, desktop) based on screen width.
 * 
 * Breakpoints:
 * - Mobile: < 768px
 * - Tablet: 768px - 1366px
 * - Desktop: > 1366px
 */
export default function useDeviceType() {
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const checkDevice = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setDeviceType('mobile');
      } else if (w <= 1366) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Initial check
    checkDevice();

    // Listen for resize events
    window.addEventListener('resize', checkDevice, { passive: true });

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return deviceType;
}