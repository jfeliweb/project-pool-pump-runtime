'use server';

import type { NewUserPool } from '@/models/Schema';
import type { CalculatorInput } from '@/types/calculator';
import { auth } from '@clerk/nextjs/server';
import { and, desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/libs/DB';
import { userPoolsTable } from '@/models/Schema';
import { calculatePoolOptimization } from '@/utils/calculations';
import { getClimateDataForState } from '@/utils/calculations/climateData';

/**
 * Calculate all energy consumption and savings metrics from pool data
 */
function calculatePoolMetrics(data: Omit<NewUserPool, 'userId'>) {
  // Build calculator input from pool data
  const calculatorInput: CalculatorInput = {
    poolSpecs: {
      length: Number(data.poolLength),
      width: Number(data.poolWidth),
      depth: {
        shallow: Number(data.poolDepthShallow),
        deep: Number(data.poolDepthDeep),
      },
      shape: data.poolShape as any,
      type: data.poolType as any,
    },
    pumpSpecs: {
      type: data.pumpType as any,
      horsepower: Number(data.pumpHorsepower) as any,
      ageYears: Number(data.pumpAgeYears),
      flowRateGPM: data.pumpFlowRate ? Number(data.pumpFlowRate) : undefined,
      variableSpeedSettings:
        data.variableSpeedLowRPM
          ? {
              lowRPM: Number(data.variableSpeedLowRPM),
              mediumRPM: Number(data.variableSpeedMediumRPM || 2400),
              highRPM: Number(data.variableSpeedHighRPM || 3450),
            }
          : undefined,
    },
    locationData: (() => {
      // Get actual climate data for the pool's state
      const climateData = getClimateDataForState(data.state);

      return {
        zipCode: data.zipCode,
        state: data.state,
        city: data.city || '',
        climateZone: data.climateZone as any || climateData.climateZone,
        latitude: data.latitude ? Number(data.latitude) : 0,
        longitude: data.longitude ? Number(data.longitude) : 0,
        avgTemperatures: climateData.avgTemperatures,
        avgSunlightHours: climateData.avgSunlightHours,
      };
    })(),
    usageFactors: {
      usageLevel: data.usageLevel as any,
      averageSwimmers: Number(data.averageSwimmers),
      landscaping: data.landscaping as any,
      screenEnclosure: Boolean(data.screenEnclosure),
      hasWaterfall: Boolean(data.hasWaterfall),
      hasHeater: Boolean(data.hasHeater),
      hasSaltSystem: Boolean(data.hasSaltSystem),
      waterClarity: data.waterClarity as any,
    },
    energyCostData: {
      electricityRate: Number(data.electricityRate),
      hasTimeOfUsePricing: Boolean(data.hasTimeOfUsePricing),
      timeOfUseRates:
        data.hasTimeOfUsePricing && data.touPeakRate
          ? {
              peakRate: Number(data.touPeakRate),
              offPeakRate: Number(data.touOffPeakRate || data.electricityRate),
              peakHours: [
                {
                  start: Number(data.touPeakHoursStart || 14),
                  end: Number(data.touPeakHoursEnd || 21),
                },
              ],
            }
          : undefined,
      currentDailyRuntime: Number(data.currentDailyRuntime),
    },
  };

  // Run calculations
  const result = calculatePoolOptimization(calculatorInput);

  // Return calculated fields to merge with pool data
  // Convert numbers to strings for decimal fields
  return {
    poolVolume: result.poolVolume,
    pumpFlowRate: result.pumpFlowRate.toFixed(2),
    requiredTurnovers: result.requiredTurnovers.toFixed(2),
    recommendedRuntime: result.optimalRuntime.toFixed(2),
    scheduleBlocks: JSON.stringify(result.schedule),

    // Current costs
    currentDailyCost: result.costs.currentCosts.dailyCost.toFixed(2),
    currentMonthlyCost: result.costs.currentCosts.monthlyCost.toFixed(2),
    currentAnnualCost: result.costs.currentCosts.annualCost.toFixed(2),

    // Optimized costs
    dailyCost: result.costs.optimizedCosts.dailyCost.toFixed(2),
    monthlyCost: result.costs.optimizedCosts.monthlyCost.toFixed(2),
    annualCost: result.costs.optimizedCosts.annualCost.toFixed(2),

    // Energy consumption (kWh) - These are the missing fields!
    dailyKwh: result.costs.optimizedCosts.dailyKwh.toFixed(2),
    monthlyKwh: result.costs.optimizedCosts.monthlyKwh.toFixed(2),
    annualKwh: result.costs.optimizedCosts.annualKwh.toFixed(2),

    // Savings
    dailySavings: result.costs.savings.dailySavings.toFixed(2),
    monthlySavings: result.costs.savings.monthlySavings.toFixed(2),
    annualSavings: result.costs.savings.annualSavings.toFixed(2),
    percentReduction: result.costs.savings.percentReduction.toFixed(2),
  };
}

export async function createPool(data: Omit<NewUserPool, 'userId'>) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Calculate all metrics before saving
  const calculatedFields = calculatePoolMetrics(data);

  const [pool] = await db.insert(userPoolsTable).values({
    ...data,
    ...calculatedFields,
    userId,
  }).returning();

  revalidatePath('/dashboard');
  return pool;
}

export async function getUserPools() {
  const { userId } = await auth();
  if (!userId) {
    return []; // Return empty array instead of throwing
  }

  const pools = await db
    .select()
    .from(userPoolsTable)
    .where(eq(userPoolsTable.userId, userId))
    .orderBy(desc(userPoolsTable.isPrimary), desc(userPoolsTable.updatedAt));

  return pools;
}

export async function getPool(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const [pool] = await db
    .select()
    .from(userPoolsTable)
    .where(
      and(
        eq(userPoolsTable.id, id),
        eq(userPoolsTable.userId, userId),
      ),
    );

  return pool;
}

export async function updatePool(id: string, data: Partial<NewUserPool>) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Fetch existing pool data to merge with updates
  const [existingPool] = await db
    .select()
    .from(userPoolsTable)
    .where(
      and(
        eq(userPoolsTable.id, id),
        eq(userPoolsTable.userId, userId),
      ),
    );

  if (!existingPool) {
    throw new Error('Pool not found');
  }

  // Merge existing data with updates
  const mergedData = { ...existingPool, ...data } as Omit<NewUserPool, 'userId'>;

  // Recalculate all metrics with updated data
  const calculatedFields = calculatePoolMetrics(mergedData);

  const [pool] = await db
    .update(userPoolsTable)
    .set({ ...data, ...calculatedFields, updatedAt: new Date() })
    .where(
      and(
        eq(userPoolsTable.id, id),
        eq(userPoolsTable.userId, userId),
      ),
    )
    .returning();

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/pools/${id}`);
  return pool;
}

export async function deletePool(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  await db
    .delete(userPoolsTable)
    .where(
      and(
        eq(userPoolsTable.id, id),
        eq(userPoolsTable.userId, userId),
      ),
    );

  revalidatePath('/dashboard');
}

export async function getPoolStats() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const pools = await getUserPools();

  const totalMonthlySavings = pools.reduce(
    (sum, pool) => sum + Number(pool.monthlySavings || 0),
    0,
  );

  const totalAnnualKwhSaved = pools.reduce(
    (sum, pool) => {
      const currentKwh = Number(pool.currentDailyRuntime) * Number(pool.pumpHorsepower) * 746 * 1.15 / 1000;
      const optimizedKwh = Number(pool.recommendedRuntime || 0) * Number(pool.pumpHorsepower) * 746 * 1.15 / 1000;
      return sum + ((currentKwh - optimizedKwh) * 365);
    },
    0,
  );

  const avgEfficiency = pools.length > 0
    ? pools.reduce((sum, pool) => sum + Number(pool.percentReduction || 0), 0) / pools.length
    : 0;

  return {
    totalPools: pools.length,
    totalMonthlySavings: Number(totalMonthlySavings.toFixed(2)),
    totalAnnualKwhSaved: Math.round(totalAnnualKwhSaved),
    avgEfficiency: Number(avgEfficiency.toFixed(1)),
  };
}
