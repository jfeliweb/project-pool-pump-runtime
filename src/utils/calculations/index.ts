import type { CalculationResult, CalculatorInput } from '@/types/calculator';
import { calculatePoolVolume } from './poolVolume';
import { calculatePumpFlowRate } from './pumpFlow';
import { generateRecommendations } from './recommendations';
import { calculateOptimalRuntime, validateRuntime } from './runtime';
import { calculateSavings } from './savings';
import { generateOptimalSchedule } from './schedule';
import { calculateRequiredTurnovers } from './turnoverRate';

/**
 * Main orchestrator function that calculates pool optimization
 */
export function calculatePoolOptimization(input: CalculatorInput): CalculationResult {
  // Get current month for seasonal calculations
  const currentMonth = new Date().getMonth();

  // Step 1: Calculate pool volume
  const poolVolume = calculatePoolVolume(input.poolSpecs);

  // Step 2: Calculate pump flow rate
  const pumpFlowRate = calculatePumpFlowRate(input.pumpSpecs);

  // Step 3: Determine required turnovers
  const requiredTurnovers = calculateRequiredTurnovers(
    input.locationData,
    input.usageFactors,
    currentMonth,
  );

  // Step 4: Calculate optimal runtime
  let optimalRuntime = calculateOptimalRuntime(
    poolVolume,
    pumpFlowRate,
    requiredTurnovers,
    input.pumpSpecs,
  );

  // Validate runtime is within reasonable bounds
  optimalRuntime = validateRuntime(optimalRuntime);

  // Step 5: Generate optimal schedule
  const schedule = generateOptimalSchedule(
    optimalRuntime,
    input.locationData,
    input.energyCostData,
    input.pumpSpecs,
    currentMonth,
  );

  // Step 6 & 7: Calculate costs and savings
  const costs = calculateSavings(
    input.energyCostData.currentDailyRuntime,
    optimalRuntime,
    input.pumpSpecs,
    input.energyCostData,
    schedule,
  );

  // Step 8: Generate recommendations
  const recommendations = generateRecommendations(
    input.poolSpecs,
    input.pumpSpecs,
    input.locationData,
    input.usageFactors,
    costs,
  );

  return {
    poolVolume,
    pumpFlowRate,
    requiredTurnovers,
    optimalRuntime,
    schedule,
    costs,
    recommendations,
  };
}

export { getClimateDataFromZip, getStateElectricityRate } from './climateData';
// Re-export individual functions for testing
export { calculatePoolVolume } from './poolVolume';
export { calculatePumpFlowRate } from './pumpFlow';
export { generateRecommendations } from './recommendations';
export { calculateOptimalRuntime } from './runtime';
export { calculateSavings } from './savings';
export { generateOptimalSchedule } from './schedule';
export { calculateRequiredTurnovers } from './turnoverRate';
