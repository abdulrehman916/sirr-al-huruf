/**
 * Responsive Layout Hook
 * Detects device type and provides layout configuration
 * 
 * Usage:
 *   const { deviceType, isMobile, isTablet, isDesktop, layout } = useResponsiveLayout();
 */

import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 767; // px
const TABLET_BREAKPOINT = 1023; // px

export function useResponsiveLayout() {
  const [deviceInfo, setDeviceInfo] = useState({
    deviceType: 'mobile',
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ua = navigator.userAgent.toLowerCase();
      
      // Detect device type from screen size
      let type = 'mobile';
      if (width >= 1024) {
        type = 'desktop';
      } else if (width >= 768) {
        type = 'tablet';
      }
      
      // Override for tablets detected in user agent
      if (/tablet|ipad|playbook|silk/i.test(ua)) {
        type = 'tablet';
      }
      
      setDeviceInfo({
        deviceType: type,
        isMobile: type === 'mobile',
        isTablet: type === 'tablet',
        isDesktop: type === 'desktop',
        screenWidth: width,
        screenHeight: height,
      });
    };

    // Initial detection
    updateDeviceInfo();

    // Debounced resize listener
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDeviceInfo, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Layout configuration based on device type
  const layout = {
    // Navigation
    navHeight: deviceInfo.isMobile ? '56px' : deviceInfo.isTablet ? '64px' : '72px',
    navPadding: deviceInfo.isMobile ? '8px' : deviceInfo.isTablet ? '12px' : '16px',
    tabMinWidth: deviceInfo.isMobile ? '48px' : deviceInfo.isTablet ? '64px' : '80px',
    tabMinHeight: deviceInfo.isMobile ? '44px' : deviceInfo.isTablet ? '52px' : '56px',
    tabFontSize: deviceInfo.isMobile ? '13px' : deviceInfo.isTablet ? '15px' : '16px',
    tabSubFontSize: deviceInfo.isMobile ? '8.5px' : deviceInfo.isTablet ? '10px' : '11px',
    
    // Content
    contentPadding: deviceInfo.isMobile ? '12px' : deviceInfo.isTablet ? '24px' : '32px',
    contentMaxWidth: deviceInfo.isMobile ? '100%' : deviceInfo.isTablet ? '90%' : '1200px',
    contentGap: deviceInfo.isMobile ? '16px' : deviceInfo.isTablet ? '24px' : '32px',
    
    // Cards
    cardPadding: deviceInfo.isMobile ? '16px' : deviceInfo.isTablet ? '20px' : '24px',
    cardBorderRadius: deviceInfo.isMobile ? '12px' : deviceInfo.isTablet ? '16px' : '20px',
    
    // Typography
    headingSize: deviceInfo.isMobile ? '1.5rem' : deviceInfo.isTablet ? '2rem' : '2.5rem',
    subheadingSize: deviceInfo.isMobile ? '1.125rem' : deviceInfo.isTablet ? '1.25rem' : '1.5rem',
    bodySize: deviceInfo.isMobile ? '0.875rem' : deviceInfo.isTablet ? '1rem' : '1.125rem',
    
    // Touch targets
    touchTarget: deviceInfo.isMobile ? '44px' : deviceInfo.isTablet ? '48px' : '40px',
    buttonMinHeight: deviceInfo.isMobile ? '44px' : deviceInfo.isTablet ? '48px' : '40px',
    
    // Spacing
    sectionSpacing: deviceInfo.isMobile ? '24px' : deviceInfo.isTablet ? '32px' : '48px',
    elementSpacing: deviceInfo.isMobile ? '12px' : deviceInfo.isTablet ? '16px' : '24px',
    
    // Scroll behavior
    scrollBehavior: deviceInfo.isMobile ? 'smooth' : 'auto',
    momentumScroll: deviceInfo.isMobile,
  };

  return {
    ...deviceInfo,
    layout,
  };
}

export default useResponsiveLayout;