import type { LocationData, UsageFactors } from '@/types/calculator';

/**
 * Calculate required pool turnovers per day based on climate and usage
 */
export function calculateRequiredTurnovers(
  location: LocationData,
  usage: UsageFactors,
  currentMonth: number,
): number {
  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

  // Get temperature for current month
  const monthKey = monthNames[currentMonth % 12];
  const baselineTemp = monthKey ? location.avgTemperatures[monthKey] : 70;

  // Temperature-based turnover requirements
  let turnovers: number;

  if (baselineTemp >= 85) {
    turnovers = 2.5; // Hot weather: more algae growth, faster chemical depletion
  } else if (baselineTemp >= 75) {
    turnovers = 2.0; // Warm weather
  } else if (baselineTemp >= 65) {
    turnovers = 1.75; // Moderate weather
  } else if (baselineTemp >= 50) {
    turnovers = 1.5; // Cool weather
  } else {
    turnovers = 1.25; // Cold weather (minimal biological activity)
  }

  // Adjust for usage intensity
  const usageMultipliers = {
    light: 0.9,
    moderate: 1.0,
    heavy: 1.2,
  };
  turnovers *= usageMultipliers[usage.usageLevel];

  // Adjust for swimmers (contaminant load)
  const swimmerAdjustment = 1 + (Math.min(usage.averageSwimmers, 10) * 0.03);
  turnovers *= swimmerAdjustment;

  // Adjust for landscaping (debris load)
  const landscapingMultipliers = {
    minimal: 0.95,
    moderate: 1.0,
    heavy: 1.15,
  };
  turnovers *= landscapingMultipliers[usage.landscaping];

  // Screen enclosure reduces filtration needs
  if (usage.screenEnclosure) {
    turnovers *= 0.90;
  }

  // Water features require more filtration
  if (usage.hasWaterfall) {
    turnovers *= 1.1;
  }

  // Salt systems are gentler, may need less filtration
  if (usage.hasSaltSystem) {
    turnovers *= 0.95;
  }

  // Water clarity indicates current filtration effectiveness
  const clarityMultipliers = {
    'crystal-clear': 0.95,
    'slightly-cloudy': 1.0,
    'cloudy': 1.2,
  };
  turnovers *= clarityMultipliers[usage.waterClarity];

  return Number(turnovers.toFixed(2));
}
