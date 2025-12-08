# Bug Fix: Missing Energy Consumption Calculations

## Problem
The pool detail page (`/dashboard/pools/[id]`) attempted to display `pool.monthlyKwh` and `pool.annualKwh` values, but these database fields were never calculated or populated when pools were created or updated. The `createPool` and `updatePool` functions in `pools.actions.ts` simply inserted/updated the raw data without running the energy consumption calculations, resulting in NULL/undefined values.

## Root Cause
- Database schema defines fields: `dailyKwh`, `monthlyKwh`, `annualKwh` (lines 91-93 in Schema.ts)
- Pool detail page displays these values (line 115 in page.tsx)
- `createPool` and `updatePool` functions never calculated these values before saving
- Display relied on fallback logic (`|| 0`), but this masked the underlying issue

## Solution
Created a new `calculatePoolMetrics()` helper function that:

1. Transforms pool database fields into `CalculatorInput` format
2. Calls `calculatePoolOptimization()` to run all calculations
3. Extracts calculated values from the results
4. Returns an object with all computed fields to merge with pool data

### Files Modified

#### `src/app/actions/pools.actions.ts`

**Added:**
- `calculatePoolMetrics()` function that transforms pool data and runs calculations
- Proper import of `CalculatorInput` type from `@/types/calculator`

**Updated:**
- `createPool()` - Now calls `calculatePoolMetrics()` and merges results before insert
- `updatePool()` - Fetches existing pool, merges with updates, recalculates all metrics

**Calculated Fields Now Populated:**
- `poolVolume` - Calculated pool volume in gallons
- `pumpFlowRate` - Pump flow rate in GPM
- `requiredTurnovers` - Required daily turnovers
- `recommendedRuntime` - Optimized runtime in hours
- `scheduleBlocks` - JSON-stringified optimal schedule
- `currentDailyCost`, `currentMonthlyCost`, `currentAnnualCost` - Current energy costs
- `dailyCost`, `monthlyCost`, `annualCost` - Optimized energy costs
- **`dailyKwh`, `monthlyKwh`, `annualKwh`** - ✅ Energy consumption (previously missing!)
- `dailySavings`, `monthlySavings`, `annualSavings` - Savings calculations
- `percentReduction` - Percentage reduction in energy usage

## Testing Considerations

### New Pool Creation
When creating a pool through the calculator:
```typescript
const pool = await createPool({
  poolLength: 30,
  poolWidth: 15,
  // ... other fields
});

// pool.monthlyKwh will now be populated
console.log(pool.monthlyKwh); // e.g., 450.5
```

### Pool Updates
When updating any pool field:
```typescript
const pool = await updatePool(poolId, {
  pumpHorsepower: 2.0, // Changed from 1.5
});

// All metrics are recalculated
console.log(pool.monthlyKwh); // Updated value
```

### Display
The pool detail page now correctly displays energy consumption:
```tsx
<StatCard
  label="Monthly Energy Usage"
  value={`${Number(pool.monthlyKwh || 0).toFixed(0)} kWh`}
  // No longer displays "0 kWh" - shows actual calculated value
/>;
```

## Migration Considerations

### Existing Database Records
If there are existing pool records in the database (created before this fix), they will have NULL values for `monthlyKwh`, `annualKwh`, etc.

**Options:**
1. **Automatic recalculation on next update** - When a user edits any pool, all metrics are recalculated
2. **Migration script** - Create a script to recalculate metrics for all existing pools
3. **Lazy calculation** - Display calculated values on-the-fly if database values are NULL

**Recommended:** Option 1 (current implementation) + Option 3 for display

### Future Improvements
Consider creating a separate `recalculatePoolMetrics(poolId)` function that can be:
- Called from an admin dashboard
- Run as a periodic background job
- Triggered when calculation formulas are updated

## Verification

### Manual Testing
1. Create a new pool through the calculator
2. Verify the pool detail page displays non-zero energy consumption values
3. Update a pool configuration (e.g., pump horsepower)
4. Verify all metrics are recalculated correctly

### Automated Testing
Consider adding integration tests:
```typescript
test('createPool calculates energy consumption', async () => {
  const pool = await createPool({
    // ... pool data
  });

  expect(pool.monthlyKwh).toBeGreaterThan(0);
  expect(pool.annualKwh).toBeGreaterThan(0);
  expect(pool.dailyKwh).toBeGreaterThan(0);
});
```

## Impact
- ✅ Pool detail page now displays accurate energy consumption
- ✅ No more NULL/undefined values for energy metrics
- ✅ Consistent calculation logic across create and update operations
- ✅ Better user experience with accurate data

## Notes
- The `calculatePoolMetrics()` function uses hardcoded temperature and sunlight data for the `locationData.avgTemperatures` and `locationData.avgSunlightHours` fields. Consider fetching these from a climate API in the future for more accurate calculations.
- Energy consumption is calculated based on the **optimized** schedule, not the current runtime. The current costs are stored separately in `currentDailyCost`, etc.
