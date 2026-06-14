/**
 * ASTRO CLOCK — GET LIVE MOON POSITION
 * Backend function to fetch moon position from NASA JPL Horizons API
 * Astro Clock module only — completely isolated
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify user is authenticated
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get request parameters
    const { lat, lng, timezone } = await req.json();
    
    const location = {
      lat: lat || 0,
      lng: lng || 0
    };
    
    const date = new Date();
    
    // Fetch from NASA JPL Horizons API
    const jplData = await fetchFromJPLHorizons('moon', date, location);
    
    if (jplData && jplData.eclipticLongitude !== undefined) {
      // Successfully got JPL data
      return Response.json({
        success: true,
        source: 'NASA JPL Horizons',
        accuracy: 'arcsecond',
        data: jplData,
        timestamp: date.toISOString()
      });
    } else {
      // Fallback to local calculation
      const localData = calculateMoonPositionLocal(date);
      
      return Response.json({
        success: true,
        source: 'Local Calculation (Simplified)',
        accuracy: 'approximate',
        data: localData,
        timestamp: date.toISOString(),
        note: 'JPL API unavailable, using local calculation'
      });
    }
    
  } catch (error) {
    console.error('Error in getLiveMoonPosition:', error);
    
    // Return local calculation as fallback
    const localData = calculateMoonPositionLocal(new Date());
    
    return Response.json({
      success: true,
      source: 'Local Calculation (Error Fallback)',
      accuracy: 'approximate',
      data: localData,
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * Fetch from NASA JPL Horizons API
 */
async function fetchFromJPLHorizons(target, date, location) {
  const JPL_HORIZONS_API = 'https://ssd.jpl.nasa.gov/api/horizons.api';
  
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  
  const startTime = `${year}-${month}-${day} ${hour}:${minute}`;
  const endTime = `${year}-${month}-${day} ${String(date.getUTCHours() + 1).padStart(2, '0')}:${minute}`;
  
  const bodyIds = {
    'sun': '0',
    'moon': '301',
    'mercury': '199',
    'venus': '299',
    'mars': '499',
    'jupiter': '599',
    'saturn': '699'
  };
  
  const targetId = bodyIds[target.toLowerCase()] || target;
  
  const params = new URLSearchParams({
    format: 'json',
    COMMAND: `'${targetId}'`,
    OBJ_DATA: 'YES',
    MAKE_EPHEM: 'YES',
    EPHEM_TYPE: 'OBSERVER',
    CENTER: `'coord@399'`,
    START_TIME: `'${startTime}'`,
    STOP_TIME: `'${endTime}'`,
    STEP_SIZE: `'1m'`,
    QUANTITIES: `'1,2,3,4,5,6,9,19,20,23,24'`
  });
  
  const url = `${JPL_HORIZONS_API}?${params.toString()}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`JPL API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  return parseJPLResponse(data, target);
}

/**
 * Parse JPL Horizons response
 */
function parseJPLResponse(jplData, target) {
  try {
    const ephemeris = jplData.data?.ephemeris?.data?.[0];
    
    if (!ephemeris) {
      return null;
    }
    
    const parsed = {
      target: target,
      timestamp: new Date().toISOString(),
      source: 'NASA JPL Horizons',
      accuracy: 'arcsecond'
    };
    
    if (ephemeris.RA) {
      parsed.rightAscension = parseFloat(ephemeris.RA);
    }
    
    if (ephemeris.DEC) {
      parsed.declination = parseFloat(ephemeris.DEC);
    }
    
    if (ephemeris.AZ) {
      parsed.azimuth = parseFloat(ephemeris.AZ);
    }
    
    if (ephemeris.EL) {
      parsed.elevation = parseFloat(ephemeris.EL);
    }
    
    if (ephemeris.r) {
      parsed.distanceAU = parseFloat(ephemeris.r);
    }
    
    if (ephemeris.delta) {
      parsed.distanceEarth = parseFloat(ephemeris.delta);
    }
    
    // Calculate ecliptic longitude
    if (parsed.rightAscension !== undefined && parsed.declination !== undefined) {
      parsed.eclipticLongitude = raDecToEcliptic(parsed.rightAscension, parsed.declination);
    }
    
    return parsed;
    
  } catch (error) {
    console.error('Failed to parse JPL response:', error);
    return null;
  }
}

/**
 * Convert RA/DEC to Ecliptic Longitude
 */
function raDecToEcliptic(ra, dec) {
  const epsilon = 23.439291 * Math.PI / 180;
  const raRad = ra * Math.PI / 180;
  const decRad = dec * Math.PI / 180;
  
  const lon = Math.atan2(
    Math.sin(raRad) * Math.cos(epsilon) + Math.tan(decRad) * Math.sin(epsilon),
    Math.cos(raRad)
  );
  
  let eclipticLon = lon * 180 / Math.PI;
  if (eclipticLon < 0) eclipticLon += 360;
  
  return eclipticLon;
}

/**
 * Local moon position calculation (fallback)
 */
function calculateMoonPositionLocal(date) {
  const J2000 = 2451545.0;
  const JD = getJulianDate(date);
  const T = (JD - J2000) / 36525;
  
  let L0 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  L0 = normalizeAngle(L0);
  
  let D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  D = normalizeAngle(D);
  
  let M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  M = normalizeAngle(M);
  
  let Mprime = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  Mprime = normalizeAngle(Mprime);
  
  let F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;
  F = normalizeAngle(F);
  
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  
  let longitude = L0
    + 6.289 * Math.sin(degToRad(Mprime))
    - 1.274 * E * Math.sin(degToRad(Mprime - 2 * D))
    + 0.658 * Math.sin(degToRad(2 * D))
    + 0.214 * E * Math.sin(degToRad(2 * Mprime))
    - 0.186 * Math.sin(degToRad(M));
  
  longitude = normalizeAngle(longitude);
  
  let latitude = F
    + 5.128 * Math.sin(degToRad(F))
    - 0.281 * Math.sin(degToRad(F - 2 * D))
    + 0.278 * Math.sin(degToRad(F + Mprime))
    + 0.173 * Math.sin(degToRad(F + 2 * D));
  
  latitude = normalizeAngle(latitude - 180);
  
  const distance = 60.2666
    - 3.2566 * Math.cos(degToRad(Mprime))
    + 0.6032 * E * Math.cos(degToRad(Mprime - 2 * D))
    + 0.1117 * Math.cos(degToRad(2 * D));
  
  const phase = (1 - Math.cos(degToRad(D))) / 2;
  
  return {
    longitude: longitude.toFixed(2),
    latitude: latitude.toFixed(2),
    distance: distance.toFixed(3),
    phase: (phase * 100).toFixed(1)
  };
}

function getJulianDate(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60;
  
  let Y = year;
  let M = month;
  
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + B - 1524.5 + hour / 24;
}

function normalizeAngle(angle) {
  angle = angle % 360;
  if (angle < 0) angle += 360;
  return angle;
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}