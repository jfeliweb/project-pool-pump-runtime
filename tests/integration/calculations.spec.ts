import type { LocationData, PoolSpecs, PumpSpecs, UsageFactors } from '@/types/calculator';
import { describe, expect, it } from 'vitest';
import {
  calculateOptimalRuntime,
  calculatePoolOptimization,
  calculatePoolVolume,
  calculatePumpFlowRate,
  calculateRequiredTurnovers,
} from '@/utils/calculations';

describe('Pool Volume Calculations', () => {
  it('calculates rectangular pool volume correctly', () => {
    const specs: PoolSpecs = {
      length: 30,
      width: 15,
      depth: { shallow: 4, deep: 8 },
      shape: 'rectangular',
      type: 'in-ground',
    };

    const result = calculatePoolVolume(specs);

    expect(result).toBe(13500); // 30 * 15 * 6 * 7.5
  });

  it('calculates round pool volume correctly', () => {
    const specs: PoolSpecs = {
      length: 20, // diameter
      width: 20,
      depth: { shallow: 4, deep: 4 },
      shape: 'round',
      type: 'above-ground',
    };

    const result = calculatePoolVolume(specs);

    // π * 10² * 4 * 7.5 ≈ 9425
    expect(result).toBeGreaterThan(9400);
    expect(result).toBeLessThan(9500);
  });

  it('adjusts for irregular pool shapes', () => {
    const rectangular: PoolSpecs = {
      length: 30,
      width: 15,
      depth: { shallow: 4, deep: 8 },
      shape: 'rectangular',
      type: 'in-ground',
    };

    const freeform: PoolSpecs = {
      ...rectangular,
      shape: 'freeform',
    };

    const rectVolume = calculatePoolVolume(rectangular);
    const freeformVolume = calculatePoolVolume(freeform);

    expect(freeformVolume).toBe(rectVolume * 0.85);
  });

  it('handles above-ground pools differently', () => {
    const inGround: PoolSpecs = {
      length: 20,
      width: 10,
      depth: { shallow: 3, deep: 6 },
      shape: 'rectangular',
      type: 'in-ground',
    };

    const aboveGround: PoolSpecs = {
      ...inGround,
      type: 'above-ground',
    };

    const inGroundVolume = calculatePoolVolume(inGround);
    const aboveGroundVolume = calculatePoolVolume(aboveGround);

    // Above-ground uses deep depth consistently
    expect(aboveGroundVolume).toBeGreaterThan(inGroundVolume);
  });
});

describe('Pump Flow Rate Calculations', () => {
  it('calculates base flow rate by horsepower', () => {
    const pump: PumpSpecs = {
      type: 'single-speed',
      horsepower: 1.5,
      ageYears: 0,
    };

    const result = calculatePumpFlowRate(pump);

    expect(result).toBe(65);
  });

  it('accounts for pump age degradation', () => {
    const newPump: PumpSpecs = {
      type: 'single-speed',
      horsepower: 1.5,
      ageYears: 0,
    };

    const oldPump: PumpSpecs = {
      type: 'single-speed',
      horsepower: 1.5,
      ageYears: 5,
    };

    const newFlow = calculatePumpFlowRate(newPump);
    const oldFlow = calculatePumpFlowRate(oldPump);

    expect(oldFlow).toBeLessThan(newFlow);
    expect(oldFlow).toBeGreaterThan(newFlow * 0.8); // Max 20% loss
  });

  it('adjusts for variable speed settings', () => {
    const pump: PumpSpecs = {
      type: 'variable-speed',
      horsepower: 1.5,
      ageYears: 0,
      variableSpeedSettings: {
        lowRPM: 1500,
        mediumRPM: 2400,
        highRPM: 3450,
      },
    };

    const result = calculatePumpFlowRate(pump);

    expect(result).toBeLessThan(65); // Should be less than full speed
    expect(result).toBeGreaterThan(30); // But more than minimum
  });
});

describe('Turnover Rate Calculations', () => {
  const baseLocation: LocationData = {
    zipCode: '33101',
    state: 'FL',
    city: 'Miami',
    climateZone: 'hot-humid',
    latitude: 25.7617,
    longitude: -80.1918,
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
  };

  const baseUsage: UsageFactors = {
    usageLevel: 'moderate',
    averageSwimmers: 3,
    landscaping: 'moderate',
    screenEnclosure: false,
    hasWaterfall: false,
    hasHeater: false,
    hasSaltSystem: false,
    waterClarity: 'crystal-clear',
  };

  it('requires more turnovers in hot weather', () => {
    const summerTurnovers = calculateRequiredTurnovers(baseLocation, baseUsage, 6); // July
    const winterTurnovers = calculateRequiredTurnovers(baseLocation, baseUsage, 0); // January

    expect(summerTurnovers).toBeGreaterThan(winterTurnovers);
  });

  it('adjusts for usage level', () => {
    const lightUsage: UsageFactors = { ...baseUsage, usageLevel: 'light' };
    const heavyUsage: UsageFactors = { ...baseUsage, usageLevel: 'heavy' };

    const lightTurnovers = calculateRequiredTurnovers(baseLocation, lightUsage, 6);
    const heavyTurnovers = calculateRequiredTurnovers(baseLocation, heavyUsage, 6);

    expect(heavyTurnovers).toBeGreaterThan(lightTurnovers);
  });

  it('accounts for screen enclosure', () => {
    const noScreen: UsageFactors = { ...baseUsage, screenEnclosure: false };
    const withScreen: UsageFactors = { ...baseUsage, screenEnclosure: true };

    const noScreenTurnovers = calculateRequiredTurnovers(baseLocation, noScreen, 6);
    const screenTurnovers = calculateRequiredTurnovers(baseLocation, withScreen, 6);

    expect(screenTurnovers).toBeLessThan(noScreenTurnovers);
  });

  it('increases for cloudy water', () => {
    const clear: UsageFactors = { ...baseUsage, waterClarity: 'crystal-clear' };
    const cloudy: UsageFactors = { ...baseUsage, waterClarity: 'cloudy' };

    const clearTurnovers = calculateRequiredTurnovers(baseLocation, clear, 6);
    const cloudyTurnovers = calculateRequiredTurnovers(baseLocation, cloudy, 6);

    expect(cloudyTurnovers).toBeGreaterThan(clearTurnovers);
  });
});

describe('Optimal Runtime Calculations', () => {
  it('calculates runtime based on volume and flow rate', () => {
    const poolVolume = 15000; // gallons
    const flowRate = 60; // GPM
    const requiredTurnovers = 2.0;
    const pump: PumpSpecs = {
      type: 'single-speed',
      horsepower: 1.5,
      ageYears: 2,
    };

    const runtime = calculateOptimalRuntime(poolVolume, flowRate, requiredTurnovers, pump);

    // Should be around 8-9 hours for these values
    expect(runtime).toBeGreaterThan(7);
    expect(runtime).toBeLessThan(10);
  });

  it('adjusts runtime for variable speed pumps', () => {
    const poolVolume = 15000;
    const flowRate = 60;
    const requiredTurnovers = 2.0;

    const singleSpeed: PumpSpecs = {
      type: 'single-speed',
      horsepower: 1.5,
      ageYears: 2,
    };

    const variableSpeed: PumpSpecs = {
      type: 'variable-speed',
      horsepower: 1.5,
      ageYears: 2,
      variableSpeedSettings: {
        lowRPM: 1500,
        mediumRPM: 2400,
        highRPM: 3450,
      },
    };

    const singleRuntime = calculateOptimalRuntime(poolVolume, flowRate, requiredTurnovers, singleSpeed);
    const variableRuntime = calculateOptimalRuntime(poolVolume, flowRate, requiredTurnovers, variableSpeed);

    expect(variableRuntime).toBeGreaterThan(singleRuntime); // VS pumps run longer at lower speed
  });

  it('rounds to nearest 0.5 hour', () => {
    const poolVolume = 15000;
    const flowRate = 60;
    const requiredTurnovers = 2.0;
    const pump: PumpSpecs = {
      type: 'single-speed',
      horsepower: 1.5,
      ageYears: 2,
    };

    const runtime = calculateOptimalRuntime(poolVolume, flowRate, requiredTurnovers, pump);

    // Should be a multiple of 0.5
    expect(runtime % 0.5).toBe(0);
  });
});

describe('Complete Optimization Calculation', () => {
  it('returns complete calculation result', () => {
    const input = {
      poolSpecs: {
        length: 30,
        width: 15,
        depth: { shallow: 4, deep: 8 },
        shape: 'rectangular' as const,
        type: 'in-ground' as const,
      },
      pumpSpecs: {
        type: 'single-speed' as const,
        horsepower: 1.5 as const,
        ageYears: 3,
      },
      locationData: {
        zipCode: '33101',
        state: 'FL',
        city: 'Miami',
        climateZone: 'hot-humid' as const,
        latitude: 25.7617,
        longitude: -80.1918,
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
      usageFactors: {
        usageLevel: 'moderate' as const,
        averageSwimmers: 3,
        landscaping: 'moderate' as const,
        screenEnclosure: false,
        hasWaterfall: false,
        hasHeater: false,
        hasSaltSystem: false,
        waterClarity: 'crystal-clear' as const,
      },
      energyCostData: {
        electricityRate: 0.14,
        hasTimeOfUsePricing: false,
        currentDailyRuntime: 12,
      },
    };

    const result = calculatePoolOptimization(input);

    expect(result.poolVolume).toBeGreaterThan(0);
    expect(result.pumpFlowRate).toBeGreaterThan(0);
    expect(result.requiredTurnovers).toBeGreaterThan(0);
    expect(result.optimalRuntime).toBeGreaterThan(0);
    expect(result.schedule).toHaveLength.greaterThan(0);
    expect(result.costs.savings.annualSavings).toBeGreaterThan(0);
    expect(result.recommendations).toHaveLength.greaterThan(0);
  });

  it('generates ROI metrics for non-variable-speed pumps', () => {
    const input = {
      poolSpecs: {
        length: 30,
        width: 15,
        depth: { shallow: 4, deep: 8 },
        shape: 'rectangular' as const,
        type: 'in-ground' as const,
      },
      pumpSpecs: {
        type: 'single-speed' as const,
        horsepower: 1.5 as const,
        ageYears: 3,
      },
      locationData: {
        zipCode: '33101',
        state: 'FL',
        city: 'Miami',
        climateZone: 'hot-humid' as const,
        latitude: 25.7617,
        longitude: -80.1918,
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
      usageFactors: {
        usageLevel: 'moderate' as const,
        averageSwimmers: 3,
        landscaping: 'moderate' as const,
        screenEnclosure: false,
        hasWaterfall: false,
        hasHeater: false,
        hasSaltSystem: false,
        waterClarity: 'crystal-clear' as const,
      },
      energyCostData: {
        electricityRate: 0.14,
        hasTimeOfUsePricing: false,
        currentDailyRuntime: 12,
      },
    };

    const result = calculatePoolOptimization(input);

    expect(result.costs.roiMetrics).toBeDefined();
    expect(result.costs.roiMetrics!.variableSpeedUpgradeCost).toBe(1500);
    expect(result.costs.roiMetrics!.paybackMonths).toBeGreaterThan(0);
  });
});
