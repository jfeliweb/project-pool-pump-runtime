import type { PumpSpecs } from '@/types/calculator';

/**
 * Calculate optimal daily runtime in hours
 */
export function calculateOptimalRuntime(
  poolVolume: number,
  flowRate: number,
  requiredTurnovers: number,
  pump: PumpSpecs,
): number {
  // Base calculation: time to achieve required turnovers
  const minutesPerTurnover = poolVolume / flowRate;
  const baseRuntime = (minutesPerTurnover * requiredTurnovers) / 60; // Convert to hours

  // Pump type efficiency adjustments
  let runtimeMultiplier = 1.0;

  if (pump.type === 'variable-speed') {
    // Variable speed pumps can run longer at lower speeds
    // This provides better filtration and uses less energy
    runtimeMultiplier = 1.4;
  } else if (pump.type === 'two-speed') {
    // Two-speed pumps get moderate efficiency gains
    runtimeMultiplier = 1.2;
  }

  const optimalRuntime = baseRuntime * runtimeMultiplier;

  // Round to nearest 0.5 hour for practical implementation
  return Math.round(optimalRuntime * 2) / 2;
}

/**
 * Ensure runtime is within reasonable bounds
 */
export function validateRuntime(runtime: number): number {
  // Minimum 4 hours, maximum 24 hours
  return Math.max(4, Math.min(24, runtime));
}
