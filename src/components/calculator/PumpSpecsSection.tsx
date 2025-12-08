'use client';

import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import type { CalculatorInput } from '@/validations/calculator';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';

export type PumpSpecsSectionProps = {
  register: UseFormRegister<CalculatorInput>;
  watch: UseFormWatch<CalculatorInput>;
  errors: any;
};

export function PumpSpecsSection({ register, watch, errors }: PumpSpecsSectionProps) {
  const pumpType = watch('pumpSpecs.type');
  const pumpAge = watch('pumpSpecs.ageYears') || 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Pump Information</h3>

      <Select
        label="Pump Type"
        {...register('pumpSpecs.type')}
        error={errors.pumpSpecs?.type?.message}
        options={[
          { value: 'single-speed', label: 'Single-Speed' },
          { value: 'two-speed', label: 'Two-Speed' },
          { value: 'variable-speed', label: 'Variable-Speed' },
        ]}
      />

      <Select
        label="Horsepower"
        {...register('pumpSpecs.horsepower', { valueAsNumber: true })}
        error={errors.pumpSpecs?.horsepower?.message}
        options={[
          { value: '0.5', label: '0.5 HP' },
          { value: '0.75', label: '0.75 HP' },
          { value: '1', label: '1.0 HP' },
          { value: '1.5', label: '1.5 HP' },
          { value: '2', label: '2.0 HP' },
          { value: '2.5', label: '2.5 HP' },
          { value: '3', label: '3.0 HP' },
        ]}
      />

      <Slider
        label="Pump Age"
        unit=" years"
        min={0}
        max={15}
        step={1}
        {...register('pumpSpecs.ageYears', { valueAsNumber: true })}
        value={pumpAge}
      />

      {pumpType === 'variable-speed' && (
        <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-900">Variable Speed Settings (RPM)</p>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Low"
              type="number"
              placeholder="1500"
              {...register('pumpSpecs.variableSpeedSettings.lowRPM', { valueAsNumber: true })}
              error={errors.pumpSpecs?.variableSpeedSettings?.lowRPM?.message}
            />
            <Input
              label="Medium"
              type="number"
              placeholder="2400"
              {...register('pumpSpecs.variableSpeedSettings.mediumRPM', { valueAsNumber: true })}
              error={errors.pumpSpecs?.variableSpeedSettings?.mediumRPM?.message}
            />
            <Input
              label="High"
              type="number"
              placeholder="3450"
              {...register('pumpSpecs.variableSpeedSettings.highRPM', { valueAsNumber: true })}
              error={errors.pumpSpecs?.variableSpeedSettings?.highRPM?.message}
            />
          </div>
        </div>
      )}
    </div>
  );
}
