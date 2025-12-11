'use client';

import type { Control, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import type { CalculatorInput } from '@/validations/calculator';
import { useState } from 'react';
import { useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';

export type LocationSectionProps = {
  register: UseFormRegister<CalculatorInput>;
  control: Control<CalculatorInput>;
  setValue: UseFormSetValue<CalculatorInput>;
  errors: any;
};

export function LocationSection({ register, control, setValue, errors }: LocationSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const hasTOU = useWatch({ control, name: 'energyCostData.hasTimeOfUsePricing' }) ?? false;

  const handleZipCodeLookup = async (zipCode: string) => {
    if (zipCode.length !== 5) {
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, this would call the climate API
      // For now, we'll use a simplified mock
      const response = await fetch(`/api/climate?zip=${zipCode}`);
      if (response.ok) {
        const data = await response.json();
        setValue('locationData.state', data.state);
        setValue('locationData.city', data.city);
        setValue('locationData.climateZone', data.climateZone);
        setValue('locationData.latitude', data.latitude);
        setValue('locationData.longitude', data.longitude);
        setValue('locationData.avgTemperatures', data.avgTemperatures);
        setValue('locationData.avgSunlightHours', data.avgSunlightHours);
      }
    } catch (error) {
      console.error('Failed to lookup ZIP code', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Location & Energy</h3>

      <Input
        label="ZIP Code"
        type="text"
        maxLength={5}
        placeholder="12345"
        {...register('locationData.zipCode')}
        error={errors.locationData?.zipCode?.message}
        onBlur={e => handleZipCodeLookup(e.target.value)}
      />

      {isLoading && (
        <p className="text-sm text-gray-500">Looking up location data...</p>
      )}

      <Input
        label="Electricity Rate ($/kWh)"
        type="number"
        step="0.001"
        placeholder="0.14"
        {...register('energyCostData.electricityRate', { valueAsNumber: true })}
        error={errors.energyCostData?.electricityRate?.message}
        helperText="Check your utility bill for your rate"
      />

      <Toggle
        label="I have time-of-use pricing"
        {...register('energyCostData.hasTimeOfUsePricing')}
        checked={hasTOU}
        onChange={e => setValue('energyCostData.hasTimeOfUsePricing', e.target.checked)}
      />

      {hasTOU && (
        <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-900">Time-of-Use Rates</p>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Peak Rate ($/kWh)"
              type="number"
              step="0.001"
              placeholder="0.20"
              {...register('energyCostData.timeOfUseRates.peakRate', { valueAsNumber: true })}
            />
            <Input
              label="Off-Peak Rate ($/kWh)"
              type="number"
              step="0.001"
              placeholder="0.10"
              {...register('energyCostData.timeOfUseRates.offPeakRate', { valueAsNumber: true })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Peak Start Hour"
              type="number"
              min={0}
              max={23}
              placeholder="14"
              {...register('energyCostData.timeOfUseRates.peakHours.0.start', { valueAsNumber: true })}
            />
            <Input
              label="Peak End Hour"
              type="number"
              min={0}
              max={23}
              placeholder="19"
              {...register('energyCostData.timeOfUseRates.peakHours.0.end', { valueAsNumber: true })}
            />
          </div>
        </div>
      )}

      <Input
        label="Current Daily Runtime (hours)"
        type="number"
        step="0.5"
        placeholder="12"
        {...register('energyCostData.currentDailyRuntime', { valueAsNumber: true })}
        error={errors.energyCostData?.currentDailyRuntime?.message}
        helperText="How many hours per day does your pump currently run?"
      />
    </div>
  );
}
