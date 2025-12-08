import type { LocationData, PoolSpecs, PumpSpecs, SavingsResult, UsageFactors } from '@/types/calculator';

/**
 * Generate personalized recommendations based on pool configuration and results
 */
export function generateRecommendations(
  _pool: PoolSpecs,
  pump: PumpSpecs,
  location: LocationData,
  usage: UsageFactors,
  costs: SavingsResult,
): string[] {
  const recommendations: string[] = [];
  const currentMonth = new Date().getMonth();
  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;
  const monthKey = monthNames[currentMonth % 12];
  const currentTemp = monthKey ? location.avgTemperatures[monthKey] : 70;

  // Pump upgrade recommendation
  if (pump.type === 'single-speed' && costs.roiMetrics) {
    const savingsFormatted = costs.roiMetrics.fiveYearSavings.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    recommendations.push(
      `Upgrade to a variable-speed pump: Save an additional ${savingsFormatted} over 5 years with a ${costs.roiMetrics.paybackMonths.toFixed(1)}-month payback period.`,
    );
  }

  // Peak hour avoidance
  if (currentTemp > 80) {
    recommendations.push(
      'Run your pump during early morning hours (6-9 AM) to prevent algae growth during peak heat.',
    );
  }

  // Filter maintenance
  if (pump.ageYears > 3) {
    recommendations.push(
      'Your pump is over 3 years old. Regular maintenance can restore up to 15% efficiency. Consider professional servicing.',
    );
  }

  // Screen enclosure benefit
  if (!usage.screenEnclosure && location.climateZone === 'hot-humid') {
    recommendations.push(
      'A screen enclosure could reduce your filtration needs by 10% by minimizing debris and evaporation.',
    );
  }

  // Water chemistry
  if (usage.waterClarity !== 'crystal-clear') {
    recommendations.push(
      'Improving water chemistry through proper balancing can reduce required filtration time by up to 20%.',
    );
  }

  // Seasonal adjustment
  if ([11, 0, 1].includes(currentMonth)) {
    // Dec, Jan, Feb
    recommendations.push(
      'During winter months, you can safely reduce runtime by 1-2 hours if water remains clear and temperatures stay below 65°F.',
    );
  }

  // High usage adjustment
  if (usage.usageLevel === 'heavy' || usage.averageSwimmers > 6) {
    recommendations.push(
      'With heavy pool usage, consider testing water chemistry twice weekly to maintain optimal balance.',
    );
  }

  // Variable speed optimization
  if (pump.type === 'variable-speed') {
    recommendations.push(
      'Your variable-speed pump is already optimized! Run at low speed for most hours to maximize energy savings.',
    );
  }

  // Landscaping consideration
  if (usage.landscaping === 'heavy') {
    recommendations.push(
      'Heavy landscaping increases debris load. Regular skimming can reduce the burden on your filtration system.',
    );
  }

  // Return top 5 recommendations
  return recommendations.slice(0, 5);
}
