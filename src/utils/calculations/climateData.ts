import type { LocationData } from '@/types/calculator';

// In-memory cache for climate data (expires after 30 days)
const climateCache = new Map<string, { data: LocationData; timestamp: number }>();
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// State-level climate data fallback
const stateClimateData: Record<string, Partial<LocationData>> = {
  FL: {
    climateZone: 'hot-humid',
    avgTemperatures: {
      jan: 68,
      feb: 70,
      mar: 74,
      apr: 78,
      may: 82,
      jun: 86,
      jul: 88,
      aug: 88,
      sep: 86,
      oct: 81,
      nov: 75,
      dec: 70,
    },
    avgSunlightHours: { winter: 7, spring: 9, summer: 10, fall: 8 },
  },
  AZ: {
    climateZone: 'hot-dry',
    avgTemperatures: {
      jan: 58,
      feb: 62,
      mar: 68,
      apr: 76,
      may: 86,
      jun: 95,
      jul: 100,
      aug: 98,
      sep: 92,
      oct: 80,
      nov: 67,
      dec: 58,
    },
    avgSunlightHours: { winter: 8, spring: 10, summer: 11, fall: 9 },
  },
  CA: {
    climateZone: 'marine',
    avgTemperatures: {
      jan: 58,
      feb: 60,
      mar: 62,
      apr: 65,
      may: 68,
      jun: 72,
      jul: 75,
      aug: 76,
      sep: 75,
      oct: 70,
      nov: 64,
      dec: 58,
    },
    avgSunlightHours: { winter: 7, spring: 9, summer: 11, fall: 8 },
  },
  TX: {
    climateZone: 'hot-humid',
    avgTemperatures: {
      jan: 52,
      feb: 56,
      mar: 64,
      apr: 72,
      may: 80,
      jun: 86,
      jul: 89,
      aug: 89,
      sep: 84,
      oct: 74,
      nov: 63,
      dec: 54,
    },
    avgSunlightHours: { winter: 6, spring: 8, summer: 10, fall: 7 },
  },
  NY: {
    climateZone: 'cold',
    avgTemperatures: {
      jan: 32,
      feb: 35,
      mar: 43,
      apr: 54,
      may: 64,
      jun: 74,
      jul: 79,
      aug: 77,
      sep: 70,
      oct: 58,
      nov: 47,
      dec: 37,
    },
    avgSunlightHours: { winter: 5, spring: 7, summer: 9, fall: 6 },
  },
  GA: {
    climateZone: 'mixed-humid',
    avgTemperatures: {
      jan: 45,
      feb: 50,
      mar: 58,
      apr: 66,
      may: 74,
      jun: 81,
      jul: 84,
      aug: 84,
      sep: 78,
      oct: 68,
      nov: 58,
      dec: 48,
    },
    avgSunlightHours: { winter: 6, spring: 8, summer: 9, fall: 7 },
  },
  NC: {
    climateZone: 'mixed-humid',
    avgTemperatures: {
      jan: 42,
      feb: 46,
      mar: 54,
      apr: 62,
      may: 70,
      jun: 78,
      jul: 81,
      aug: 80,
      sep: 74,
      oct: 64,
      nov: 54,
      dec: 45,
    },
    avgSunlightHours: { winter: 6, spring: 8, summer: 9, fall: 7 },
  },
  IL: {
    climateZone: 'cold',
    avgTemperatures: {
      jan: 28,
      feb: 32,
      mar: 44,
      apr: 56,
      may: 66,
      jun: 76,
      jul: 80,
      aug: 78,
      sep: 71,
      oct: 59,
      nov: 45,
      dec: 32,
    },
    avgSunlightHours: { winter: 4, spring: 7, summer: 9, fall: 6 },
  },
};

/**
 * Get climate data from ZIP code using external API
 */
export async function getClimateDataFromZip(zipCode: string): Promise<LocationData> {
  // Check cache first
  const cached = climateCache.get(zipCode);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Try to fetch from external API
    const data = await fetchClimateFromAPI(zipCode);

    // Cache the result
    climateCache.set(zipCode, {
      data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error) {
    // Fallback to state-level data
    console.warn('Climate API failed, using state-level fallback', error);
    return getFallbackClimateData(zipCode);
  }
}

/**
 * Fetch climate data from external API (OpenWeatherMap or WeatherAPI)
 */
async function fetchClimateFromAPI(zipCode: string): Promise<LocationData> {
  const apiKey = process.env.WEATHER_API_KEY || process.env.WEATHERAPI_KEY;

  if (!apiKey) {
    throw new Error('Weather API key not configured');
  }

  // For MVP, using a mock implementation
  // In production, integrate with actual API:
  // const response = await fetch(`https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${apiKey}`);
  // const geoData = await response.json();

  // For now, use fallback
  return getFallbackClimateData(zipCode);
}

/**
 * Get fallback climate data based on ZIP code state
 */
function getFallbackClimateData(zipCode: string): LocationData {
  // Extract state from ZIP code (simplified mapping)
  const state = zipToState(zipCode);
  const stateData = stateClimateData[state];

  if (!stateData) {
    // Default to moderate climate
    return {
      zipCode,
      state: state || 'US',
      city: 'Your City',
      climateZone: 'mixed-humid',
      latitude: 35.0,
      longitude: -95.0,
      avgTemperatures: {
        jan: 45,
        feb: 50,
        mar: 58,
        apr: 66,
        may: 74,
        jun: 81,
        jul: 84,
        aug: 84,
        sep: 78,
        oct: 68,
        nov: 58,
        dec: 48,
      },
      avgSunlightHours: { winter: 6, spring: 8, summer: 9, fall: 7 },
    };
  }

  return {
    zipCode,
    state,
    city: 'Your City',
    climateZone: stateData.climateZone!,
    latitude: getLatitudeFromState(state),
    longitude: getLongitudeFromState(state),
    avgTemperatures: stateData.avgTemperatures!,
    avgSunlightHours: stateData.avgSunlightHours!,
  };
}

/**
 * Convert ZIP code to state abbreviation (simplified)
 */
function zipToState(zipCode: string): string {
  const zip = Number.parseInt(zipCode.slice(0, 5), 10);

  // Simplified ZIP to state mapping
  if (zip >= 32000 && zip <= 34999) {
    return 'FL';
  }
  if (zip >= 85000 && zip <= 86999) {
    return 'AZ';
  }
  if (zip >= 90000 && zip <= 96199) {
    return 'CA';
  }
  if (zip >= 75000 && zip <= 79999) {
    return 'TX';
  }
  if (zip >= 10000 && zip <= 14999) {
    return 'NY';
  }
  if (zip >= 30000 && zip <= 31999) {
    return 'GA';
  }
  if (zip >= 27000 && zip <= 28999) {
    return 'NC';
  }
  if (zip >= 60000 && zip <= 62999) {
    return 'IL';
  }

  return 'US'; // Default
}

/**
 * Get approximate latitude for state
 */
function getLatitudeFromState(state: string): number {
  const latitudes: Record<string, number> = {
    FL: 28.0,
    AZ: 34.0,
    CA: 37.0,
    TX: 31.0,
    NY: 43.0,
    GA: 33.0,
    NC: 35.5,
    IL: 40.0,
  };
  return latitudes[state] || 38.0;
}

/**
 * Get approximate longitude for state
 */
function getLongitudeFromState(state: string): number {
  const longitudes: Record<string, number> = {
    FL: -81.5,
    AZ: -111.0,
    CA: -120.0,
    TX: -100.0,
    NY: -75.0,
    GA: -83.5,
    NC: -79.0,
    IL: -89.0,
  };
  return longitudes[state] || -95.0;
}

/**
 * Get default electricity rate for state
 */
export function getStateElectricityRate(state: string): number {
  const rates: Record<string, number> = {
    FL: 0.14,
    AZ: 0.13,
    CA: 0.23,
    TX: 0.12,
    NY: 0.20,
    GA: 0.13,
    NC: 0.12,
    IL: 0.14,
  };
  return rates[state] || 0.14;
}

/**
 * Get climate data for a state (synchronous fallback for server-side calculations)
 */
export function getClimateDataForState(state: string): {
  avgTemperatures: LocationData['avgTemperatures'];
  avgSunlightHours: LocationData['avgSunlightHours'];
  climateZone: LocationData['climateZone'];
} {
  const stateData = stateClimateData[state];

  if (!stateData) {
    // Default to moderate climate
    return {
      climateZone: 'mixed-humid',
      avgTemperatures: {
        jan: 45,
        feb: 50,
        mar: 58,
        apr: 66,
        may: 74,
        jun: 81,
        jul: 84,
        aug: 84,
        sep: 78,
        oct: 68,
        nov: 58,
        dec: 48,
      },
      avgSunlightHours: { winter: 6, spring: 8, summer: 9, fall: 7 },
    };
  }

  return {
    climateZone: stateData.climateZone!,
    avgTemperatures: stateData.avgTemperatures!,
    avgSunlightHours: stateData.avgSunlightHours!,
  };
}
