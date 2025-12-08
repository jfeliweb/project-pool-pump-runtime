import type { EnergyCostData, PumpSpecs, SavingsResult, ScheduleBlock } from '@/types/calculator';
import { calculateCurrentCosts, calculateEnergyCosts } from './energyCosts';

/**
 * Calculate savings by comparing current vs optimized costs
 */
export function calculateSavings(
  currentRuntime: number,
  optimizedRuntime: number,
  pump: PumpSpecs,
  energy: EnergyCostData,
  optimizedSchedule: ScheduleBlock[],
): SavingsResult {
  // Current costs (assuming inefficient setup)
  const currentCosts = calculateCurrentCosts(currentRuntime, pump, energy);

  // Optimized costs
  const optimizedCosts = calculateEnergyCosts(
    optimizedRuntime,
    pump,
    energy,
    optimizedSchedule,
  );

  // Calculate savings
  const dailySavings = currentCosts.dailyCost - optimizedCosts.dailyCost;
  const monthlySavings = currentCosts.monthlyCost - optimizedCosts.monthlyCost;
  const annualSavings = currentCosts.annualCost - optimizedCosts.annualCost;

  const dailyKwhSaved = currentCosts.dailyKwh - optimizedCosts.dailyKwh;
  const monthlyKwhSaved = currentCosts.monthlyKwh - optimizedCosts.monthlyKwh;
  const annualKwhSaved = currentCosts.annualKwh - optimizedCosts.annualKwh;

  const percentReduction = currentCosts.annualCost > 0
    ? ((currentCosts.annualCost - optimizedCosts.annualCost) / currentCosts.annualCost) * 100
    : 0;

  // ROI calculation for variable speed upgrade
  let roiMetrics;
  if (pump.type !== 'variable-speed') {
    const variableSpeedUpgradeCost = 1500; // Average cost
    const additionalSavingsWithVS = annualSavings * 0.30; // 30% more savings with VS
    const totalAnnualSavings = annualSavings + additionalSavingsWithVS;
    const paybackMonths = totalAnnualSavings > 0
      ? (variableSpeedUpgradeCost / totalAnnualSavings) * 12
      : 0;
    const fiveYearSavings = (totalAnnualSavings * 5) - variableSpeedUpgradeCost;

    roiMetrics = {
      variableSpeedUpgradeCost,
      paybackMonths: Number(paybackMonths.toFixed(1)),
      fiveYearSavings: Number(fiveYearSavings.toFixed(2)),
    };
  }

  return {
    currentCosts,
    optimizedCosts,
    savings: {
      dailySavings: Number(dailySavings.toFixed(2)),
      monthlySavings: Number(monthlySavings.toFixed(2)),
      annualSavings: Number(annualSavings.toFixed(2)),
      dailyKwhSaved: Number(dailyKwhSaved.toFixed(2)),
      monthlyKwhSaved: Number(monthlyKwhSaved.toFixed(2)),
      annualKwhSaved: Number(annualKwhSaved.toFixed(2)),
      percentReduction: Number(percentReduction.toFixed(1)),
    },
    roiMetrics,
  };
}
