import type { EnergyCostData, LocationData, PumpSpecs, ScheduleBlock } from '@/types/calculator';

/**
 * Calculate sunrise and sunset times based on latitude and month
 */
function calculateSunTimes(latitude: number, month: number): { sunrise: number; sunset: number } {
  // Simplified solar calculation
  const dayOfYear = month * 30; // Rough approximation
  const declination = -23.45 * Math.cos((360 / 365) * (dayOfYear + 10) * (Math.PI / 180));

  const latRad = latitude * (Math.PI / 180);
  const decRad = declination * (Math.PI / 180);

  const hourAngle = Math.acos(-Math.tan(latRad) * Math.tan(decRad));
  const dayLength = 2 * hourAngle * 12 / Math.PI;

  const sunrise = 12 - dayLength / 2;
  const sunset = 12 + dayLength / 2;

  return {
    sunrise: Math.max(5, Math.min(8, Math.round(sunrise))),
    sunset: Math.max(17, Math.min(21, Math.round(sunset))),
  };
}

/**
 * Generate optimal pump schedule based on runtime and energy pricing
 */
export function generateOptimalSchedule(
  runtime: number,
  location: LocationData,
  energy: EnergyCostData,
  pump: PumpSpecs,
  currentMonth: number,
): ScheduleBlock[] {
  const schedule: ScheduleBlock[] = [];

  // Determine sunrise/sunset for location and month
  const { sunrise } = calculateSunTimes(location.latitude, currentMonth);

  // Strategy: Split runtime into optimal blocks
  if (pump.type === 'variable-speed') {
    // Variable speed: Run longer at low speed, shorter at high speed
    const lowSpeedHours = runtime * 0.7;
    const highSpeedHours = runtime * 0.3;

    if (energy.hasTimeOfUsePricing && energy.timeOfUseRates) {
      // Optimize for time-of-use pricing
      // Run high speed during off-peak hours (early morning)
      schedule.push({
        startHour: 6,
        endHour: Math.min(24, 6 + highSpeedHours),
        speedSetting: 'high',
      });

      // Run low speed during off-peak hours (evening/night)
      const nightStartHour = 22;
      const nightEndHour = nightStartHour + lowSpeedHours;

      if (nightEndHour <= 24) {
        schedule.push({
          startHour: nightStartHour,
          endHour: nightEndHour,
          speedSetting: 'low',
        });
      } else {
        // Split into two blocks if crosses midnight
        schedule.push({
          startHour: nightStartHour,
          endHour: 24,
          speedSetting: 'low',
        });
        schedule.push({
          startHour: 0,
          endHour: nightEndHour - 24,
          speedSetting: 'low',
        });
      }
    } else {
      // No time-of-use pricing: optimize for water quality
      // Run during hottest part of day to prevent algae

      // Morning block (circulation before heat)
      const morningStart = Math.max(6, sunrise - 1);
      schedule.push({
        startHour: morningStart,
        endHour: Math.min(24, morningStart + highSpeedHours),
        speedSetting: 'high',
      });

      // Afternoon/evening block (during peak heat/sun)
      const afternoonStart = 14;
      schedule.push({
        startHour: afternoonStart,
        endHour: Math.min(24, afternoonStart + lowSpeedHours),
        speedSetting: 'low',
      });
    }
  } else if (pump.type === 'two-speed') {
    // Two-speed: Split between high and low
    const highSpeedHours = runtime * 0.4;
    const lowSpeedHours = runtime * 0.6;

    // Morning high-speed block
    schedule.push({
      startHour: 8,
      endHour: Math.min(24, 8 + highSpeedHours),
      speedSetting: 'high',
    });

    // Evening low-speed block
    schedule.push({
      startHour: 18,
      endHour: Math.min(24, 18 + lowSpeedHours),
      speedSetting: 'low',
    });
  } else {
    // Single-speed: Optimize timing only
    if (energy.hasTimeOfUsePricing && energy.timeOfUseRates) {
      // Avoid peak hours - run during off-peak
      const peakHours = energy.timeOfUseRates.peakHours[0];
      const offPeakStart = peakHours ? peakHours.end : 20;

      if (runtime <= 24 - offPeakStart) {
        // Can fit in single off-peak block
        schedule.push({
          startHour: offPeakStart,
          endHour: Math.min(24, offPeakStart + runtime),
        });
      } else {
        // Split into evening and early morning
        schedule.push({
          startHour: offPeakStart,
          endHour: 24,
        });
        schedule.push({
          startHour: 0,
          endHour: runtime - (24 - offPeakStart),
        });
      }
    } else {
      // Split into two blocks for even circulation
      const block1Hours = Math.ceil(runtime / 2);
      const block2Hours = runtime - block1Hours;

      // Morning block
      schedule.push({
        startHour: 8,
        endHour: 8 + block1Hours,
      });

      // Evening block (if there's a second block)
      if (block2Hours > 0) {
        schedule.push({
          startHour: 18,
          endHour: 18 + block2Hours,
        });
      }
    }
  }

  // Ensure no schedule block exceeds 24 hours
  return schedule.map(block => ({
    ...block,
    endHour: Math.min(24, block.endHour),
  }));
}
