import type { NewUserPool } from '@/models/Schema';
import type { CalculationResult } from '@/types/calculator';
import type { CalculatorInput } from '@/validations/calculator';

/**
 * Transforms CalculatorInput and CalculationResult into NewUserPool format
 * for saving to the database
 */
export function transformCalculatorToPoolData(
  formData: CalculatorInput,
  results: CalculationResult,
): Omit<NewUserPool, 'userId'> {
  return {
    poolName: 'My Pool', // Default name, user can change later

    // Pool specifications
    poolLength: formData.poolSpecs.length.toFixed(2),
    poolWidth: formData.poolSpecs.width.toFixed(2),
    poolDepthShallow: formData.poolSpecs.depth.shallow.toFixed(2),
    poolDepthDeep: formData.poolSpecs.depth.deep.toFixed(2),
    poolShape: formData.poolSpecs.shape,
    poolType: formData.poolSpecs.type,
    poolVolume: results.poolVolume,

    // Pump specifications
    pumpType: formData.pumpSpecs.type,
    pumpHorsepower: formData.pumpSpecs.horsepower.toFixed(2),
    pumpAgeYears: formData.pumpSpecs.ageYears,
    pumpFlowRate: results.pumpFlowRate.toFixed(2),
    variableSpeedLowRPM: formData.pumpSpecs.variableSpeedSettings?.lowRPM ?? null,
    variableSpeedMediumRPM: formData.pumpSpecs.variableSpeedSettings?.mediumRPM ?? null,
    variableSpeedHighRPM: formData.pumpSpecs.variableSpeedSettings?.highRPM ?? null,

    // Location data
    zipCode: formData.locationData.zipCode,
    state: formData.locationData.state,
    city: formData.locationData.city || null,
    climateZone: formData.locationData.climateZone,
    latitude: formData.locationData.latitude.toFixed(7),
    longitude: formData.locationData.longitude.toFixed(7),

    // Usage factors
    usageLevel: formData.usageFactors.usageLevel,
    averageSwimmers: formData.usageFactors.averageSwimmers,
    landscaping: formData.usageFactors.landscaping,
    screenEnclosure: formData.usageFactors.screenEnclosure,
    hasWaterfall: formData.usageFactors.hasWaterfall,
    hasHeater: formData.usageFactors.hasHeater,
    hasSaltSystem: formData.usageFactors.hasSaltSystem,
    waterClarity: formData.usageFactors.waterClarity,

    // Energy data
    electricityRate: formData.energyCostData.electricityRate.toFixed(3),
    hasTimeOfUsePricing: formData.energyCostData.hasTimeOfUsePricing,
    touPeakRate: formData.energyCostData.timeOfUseRates?.peakRate.toFixed(3) ?? null,
    touOffPeakRate: formData.energyCostData.timeOfUseRates?.offPeakRate.toFixed(3) ?? null,
    touPeakHoursStart: formData.energyCostData.timeOfUseRates?.peakHours[0]?.start ?? null,
    touPeakHoursEnd: formData.energyCostData.timeOfUseRates?.peakHours[0]?.end ?? null,
    currentDailyRuntime: formData.energyCostData.currentDailyRuntime.toFixed(2),

    // Calculated results from CalculationResult
    requiredTurnovers: results.requiredTurnovers.toFixed(2),
    recommendedRuntime: results.optimalRuntime.toFixed(2),
    scheduleBlocks: JSON.stringify(results.schedule),

    // Current costs
    currentDailyCost: results.costs.currentCosts.dailyCost.toFixed(2),
    currentMonthlyCost: results.costs.currentCosts.monthlyCost.toFixed(2),
    currentAnnualCost: results.costs.currentCosts.annualCost.toFixed(2),

    // Optimized costs
    dailyCost: results.costs.optimizedCosts.dailyCost.toFixed(2),
    monthlyCost: results.costs.optimizedCosts.monthlyCost.toFixed(2),
    annualCost: results.costs.optimizedCosts.annualCost.toFixed(2),

    // Energy consumption (kWh)
    dailyKwh: results.costs.optimizedCosts.dailyKwh.toFixed(2),
    monthlyKwh: results.costs.optimizedCosts.monthlyKwh.toFixed(2),
    annualKwh: results.costs.optimizedCosts.annualKwh.toFixed(2),

    // Savings
    dailySavings: results.costs.savings.dailySavings.toFixed(2),
    monthlySavings: results.costs.savings.monthlySavings.toFixed(2),
    annualSavings: results.costs.savings.annualSavings.toFixed(2),
    percentReduction: results.costs.savings.percentReduction.toFixed(2),

    // Metadata
    isPrimary: false,
  };
}
