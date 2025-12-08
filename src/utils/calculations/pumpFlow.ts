import type { PumpSpecs } from '@/types/calculator';

/**
 * Calculate pump flow rate in GPM (gallons per minute)
 */
export function calculatePumpFlowRate(pump: PumpSpecs): number {
  // Base flow rate by horsepower (GPM)
  const baseFlowRates: Record<number, number> = {
    0.5: 30,
    0.75: 40,
    1.0: 50,
    1.5: 65,
    2.0: 80,
    2.5: 95,
    3.0: 110,
  };

  let flowRate = baseFlowRates[pump.horsepower] || 50;

  // If user provided flow rate, use it
  if (pump.flowRateGPM) {
    return pump.flowRateGPM;
  }

  // Adjust for pump type
  if (pump.type === 'variable-speed' && pump.variableSpeedSettings) {
    // Calculate effective flow rate at medium speed
    const speedRatio = pump.variableSpeedSettings.mediumRPM / 3450; // 3450 is max RPM
    flowRate = flowRate * speedRatio ** 0.85; // Flow varies with RPM^0.85
  }

  // Efficiency degradation based on age
  const efficiencyLoss = Math.min(pump.ageYears * 0.02, 0.20); // Max 20% loss
  flowRate = flowRate * (1 - efficiencyLoss);

  return Math.round(flowRate);
}

/**
 * Calculate wattage consumption based on pump specs and speed setting
 */
export function calculateWattage(
  pump: PumpSpecs,
  speedSetting?: 'low' | 'medium' | 'high',
): number {
  const baseWattage = pump.horsepower * 746 * 1.15; // 746W per HP, 15% inefficiency

  if (pump.type === 'variable-speed') {
    if (speedSetting === 'low') {
      return baseWattage * 0.125; // Variable speed at low uses ~12.5% power
    } else if (speedSetting === 'medium') {
      return baseWattage * 0.40; // Variable at medium uses ~40% power
    }
    // High speed or undefined uses full power
    return baseWattage;
  }

  if (pump.type === 'two-speed') {
    if (speedSetting === 'low' && pump.twoSpeedSettings) {
      return pump.twoSpeedSettings.lowHP * 746 * 1.15;
    } else if (speedSetting === 'high' && pump.twoSpeedSettings) {
      return pump.twoSpeedSettings.highHP * 746 * 1.15;
    }
  }

  return baseWattage;
}
