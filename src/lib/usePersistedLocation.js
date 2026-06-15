/**
 * PERSISTED LOCATION HOOK — Astro Clock
 * Saves location to localStorage on first detect.
 * Never prompts again once saved. User can override manually.
 */

import { useState, useEffect } from "react";

const STORAGE_KEY = "astro_clock_location";

const DUBAI_DEFAULT = {
  lat: 25.2048,
  lng: 55.2708,
  timezone: 4,
  name: "Dubai, UAE (Default)",
  isDefault: true
};

export function getSavedLocation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

export function saveLocation(loc) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  } catch (_) {}
}

export function clearSavedLocation() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
}

/**
 * Returns { location, setLocation, isLoading }
 * - On first call: checks localStorage → if found, uses it immediately (no geolocation prompt)
 * - If nothing saved: requests geolocation once, saves result permanently
 * - setLocation(loc) lets users override manually — also saved permanently
 */
export function usePersistedLocation() {
  const saved = getSavedLocation();
  const [location, setLocationState] = useState(saved || null);
  const [isLoading, setIsLoading] = useState(!saved);

  useEffect(() => {
    if (saved) {
      // Already have a saved location — never call geolocation again
      setIsLoading(false);
      return;
    }

    // First time: try geolocation, fall back to Dubai
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timezone: Math.round(position.coords.longitude / 15),
            name: `${position.coords.latitude.toFixed(2)}°N, ${position.coords.longitude.toFixed(2)}°E`,
            isDefault: false
          };
          saveLocation(loc);
          setLocationState(loc);
          setIsLoading(false);
        },
        () => {
          saveLocation(DUBAI_DEFAULT);
          setLocationState(DUBAI_DEFAULT);
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      saveLocation(DUBAI_DEFAULT);
      setLocationState(DUBAI_DEFAULT);
      setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setLocation = (loc) => {
    saveLocation(loc);
    setLocationState(loc);
  };

  return { location: location || DUBAI_DEFAULT, setLocation, isLoading };
}