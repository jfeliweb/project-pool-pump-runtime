'use client';

import type { UseFormRegister } from 'react-hook-form';
import type { CalculatorInput } from '@/validations/calculator';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export type UsageSectionProps = {
  register: UseFormRegister<CalculatorInput>;
  errors: any;
};

export function UsageSection({ register, errors }: UsageSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Usage & Environment</h3>

      <Select
        label="Usage Level"
        {...register('usageFactors.usageLevel')}
        error={errors.usageFactors?.usageLevel?.message}
        options={[
          { value: 'light', label: 'Light (Occasional use)' },
          { value: 'moderate', label: 'Moderate (Regular use)' },
          { value: 'heavy', label: 'Heavy (Daily use)' },
        ]}
      />

      <Input
        label="Average Number of Swimmers"
        type="number"
        min={0}
        max={20}
        {...register('usageFactors.averageSwimmers', { valueAsNumber: true })}
        error={errors.usageFactors?.averageSwimmers?.message}
      />

      <Select
        label="Surrounding Landscaping"
        {...register('usageFactors.landscaping')}
        error={errors.usageFactors?.landscaping?.message}
        options={[
          { value: 'minimal', label: 'Minimal (Few trees)' },
          { value: 'moderate', label: 'Moderate (Some trees)' },
          { value: 'heavy', label: 'Heavy (Many trees)' },
        ]}
      />

      <Select
        label="Water Clarity"
        {...register('usageFactors.waterClarity')}
        error={errors.usageFactors?.waterClarity?.message}
        options={[
          { value: 'crystal-clear', label: 'Crystal Clear' },
          { value: 'slightly-cloudy', label: 'Slightly Cloudy' },
          { value: 'cloudy', label: 'Cloudy' },
        ]}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Pool Features</p>
        <div className="space-y-2">
          <Checkbox label="Screen Enclosure" {...register('usageFactors.screenEnclosure')} />
          <Checkbox label="Waterfall or Fountain" {...register('usageFactors.hasWaterfall')} />
          <Checkbox label="Pool Heater" {...register('usageFactors.hasHeater')} />
          <Checkbox label="Salt Water System" {...register('usageFactors.hasSaltSystem')} />
        </div>
      </div>
    </div>
  );
}
