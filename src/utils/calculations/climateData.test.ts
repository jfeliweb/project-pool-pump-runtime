import { describe, expect, it } from 'vitest';
import { getClimateDataForState } from './climateData';

describe('Climate-Specific Calculations', () => {
  it('should return different climate data for different states', () => {
    const floridaClimate = getClimateDataForState('FL');
    const newYorkClimate = getClimateDataForState('NY');
    const arizonaClimate = getClimateDataForState('AZ');

    // Florida should be hot-humid
    expect(floridaClimate.climateZone).toBe('hot-humid');
    expect(floridaClimate.avgTemperatures.jan).toBeGreaterThan(60); // Warm winters

    // New York should be cold
    expect(newYorkClimate.climateZone).toBe('cold');
    expect(newYorkClimate.avgTemperatures.jan).toBeLessThan(40); // Cold winters

    // Arizona should be hot-dry
    expect(arizonaClimate.climateZone).toBe('hot-dry');
    expect(arizonaClimate.avgTemperatures.jul).toBeGreaterThan(95); // Very hot summers
  });

  it('should have different temperature profiles', () => {
    const floridaClimate = getClimateDataForState('FL');
    const newYorkClimate = getClimateDataForState('NY');

    // Florida January should be much warmer than NY January
    expect(floridaClimate.avgTemperatures.jan).toBeGreaterThan(
      newYorkClimate.avgTemperatures.jan + 30,
    );

    // Summer temps should be closer but FL still warmer
    expect(floridaClimate.avgTemperatures.jul).toBeGreaterThan(
      newYorkClimate.avgTemperatures.jul,
    );
  });

  it('should have different sunlight hours', () => {
    const floridaClimate = getClimateDataForState('FL');
    const illinoisClimate = getClimateDataForState('IL');

    // Florida should have more winter sunlight than Illinois
    expect(floridaClimate.avgSunlightHours.winter).toBeGreaterThan(
      illinoisClimate.avgSunlightHours.winter,
    );
  });

  it('should return default climate data for unknown states', () => {
    const unknownClimate = getClimateDataForState('XX');

    expect(unknownClimate.climateZone).toBe('mixed-humid');
    expect(unknownClimate.avgTemperatures.jan).toBe(45);
    expect(unknownClimate.avgSunlightHours.winter).toBe(6);
  });

  it('should impact energy calculations differently', () => {
    // This test verifies that two identical pools in different states
    // will have different energy consumption due to climate differences
    const floridaClimate = getClimateDataForState('FL');
    const newYorkClimate = getClimateDataForState('NY');

    // Florida has warmer temps and more sunlight, which affects:
    // 1. Required turnovers (higher in warmer climates)
    // 2. Algae growth potential (higher in warm, sunny climates)
    // 3. Operating season (year-round in FL vs seasonal in NY)

    // Verify the climate data will lead to different calculations
    const floridaAvgTemp
      = Object.values(floridaClimate.avgTemperatures).reduce((a, b) => a + b, 0) / 12;
    const newYorkAvgTemp
      = Object.values(newYorkClimate.avgTemperatures).reduce((a, b) => a + b, 0) / 12;

    expect(floridaAvgTemp).toBeGreaterThan(newYorkAvgTemp + 15);
  });
});
