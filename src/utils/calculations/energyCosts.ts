import type { EnergyCostData, EnergyCosts, PumpSpecs, ScheduleBlock } from '@/types/calculator';
import { calculateWattage } from './pumpFlow';

/**
 * Calculate energy costs based on runtime and schedule
 */
export function calculateEnergyCosts(
  _runtime: number,
  pump: PumpSpecs,
  energy: EnergyCostData,
  schedule: ScheduleBlock[],
): EnergyCosts {
  let dailyKwh = 0;
  let dailyCost = 0;

  if (energy.hasTimeOfUsePricing && energy.timeOfUseRates) {
    // Calculate cost based on time-of-use rates
    for (const block of schedule) {
      const blockHours = block.endHour - block.startHour;
      const wattage = calculateWattage(pump, block.speedSetting);
      const blockKwh = (wattage / 1000) * blockHours;

      // Determine if block overlaps with peak hours
      let peakHours = 0;
      let offPeakHours = blockHours;

      for (const peak of energy.timeOfUseRates.peakHours) {
        const overlapStart = Math.max(block.startHour, peak.start);
        const overlapEnd = Math.min(block.endHour, peak.end);
        if (overlapStart < overlapEnd) {
          const overlap = overlapEnd - overlapStart;
          peakHours += overlap;
          offPeakHours -= overlap;
        }
      }

      const peakRatio = peakHours / blockHours;
      const offPeakRatio = offPeakHours / blockHours;

      const blockCost
        = (blockKwh * peakRatio * energy.timeOfUseRates.peakRate)
          + (blockKwh * offPeakRatio * energy.timeOfUseRates.offPeakRate);

      dailyKwh += blockKwh;
      dailyCost += blockCost;
    }
  } else {
    // Flat rate calculation
    for (const block of schedule) {
      const blockHours = block.endHour - block.startHour;
      const wattage = calculateWattage(pump, block.speedSetting);
      const blockKwh = (wattage / 1000) * blockHours;

      dailyKwh += blockKwh;
      dailyCost += blockKwh * energy.electricityRate;
    }
  }

  // Calculate monthly and annual costs
  const monthlyCost = dailyCost * 30;
  const annualCost = dailyCost * 365;
  const monthlyKwh = dailyKwh * 30;
  const annualKwh = dailyKwh * 365;

  return {
    dailyCost: Number(dailyCost.toFixed(2)),
    monthlyCost: Number(monthlyCost.toFixed(2)),
    annualCost: Number(annualCost.toFixed(2)),
    dailyKwh: Number(dailyKwh.toFixed(2)),
    monthlyKwh: Number(monthlyKwh.toFixed(2)),
    annualKwh: Number(annualKwh.toFixed(2)),
  };
}

/**
 * Calculate costs for current (unoptimized) runtime
 */
export function calculateCurrentCosts(
  currentRuntime: number,
  pump: PumpSpecs,
  energy: EnergyCostData,
): EnergyCosts {
  // Assume inefficient single-block schedule
  const currentSchedule: ScheduleBlock[] = [{
    startHour: 8,
    endHour: 8 + currentRuntime,
  }];

  // Calculate as single-speed for worst case comparison
  const singleSpeedPump: PumpSpecs = {
    ...pump,
    type: 'single-speed',
  };

  return calculateEnergyCosts(currentRuntime, singleSpeedPump, energy, currentSchedule);
}
