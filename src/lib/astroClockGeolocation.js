/**
 * ASTRO CLOCK — BROWSER GEOLOCATION
 * Get user's actual location from browser
 * Astro Clock module only — completely isolated
 */

// ─────────────────────────────────────────────────────────────────────────────
// GET USER LOCATION FROM BROWSER
// ─────────────────────────────────────────────────────────────────────────────
export function getUserLocationFromBrowser() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Fallback to Dubai
      resolve({
        lat: 25.2048,
        lng: 55.2708,
        timezone: 4,
        name: "Dubai, UAE (Default)",
        isDefault: true
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Calculate timezone offset from longitude (approximate)
        const timezone = Math.round(longitude / 15);
        
        resolve({
          lat: latitude,
          lng: longitude,
          timezone: timezone,
          name: `Custom Location (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`,
          isDefault: false
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Fallback to Dubai on error
        resolve({
          lat: 25.2048,
          lng: 55.2708,
          timezone: 4,
          name: "Dubai, UAE (Default)",
          isDefault: true
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// GET TIMEZONE OFFSET
// ─────────────────────────────────────────────────────────────────────────────
export function getTimezoneOffset() {
  const now = new Date();
  return -now.getTimezoneOffset() / 60; // Convert minutes to hours
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCATION STATUS
// ─────────────────────────────────────────────────────────────────────────────
export const GEOLOCATION_STATUS = {
  supported: typeof navigator !== 'undefined' && navigator.geolocation,
  permission: 'unknown', // Will be updated on request
  lastUpdate: null
};