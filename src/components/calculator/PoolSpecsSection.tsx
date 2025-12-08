'use client';

import type { UseFormRegister } from 'react-hook-form';
import type { CalculatorInput } from '@/validations/calculator';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export type PoolSpecsSectionProps = {
  register: UseFormRegister<CalculatorInput>;
  errors: any;
};

export function PoolSpecsSection({ register, errors }: PoolSpecsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Pool Specifications</h3>

      <Select
        label="Pool Shape"
        {...register('poolSpecs.shape')}
        error={errors.poolSpecs?.shape?.message}
        options={[
          { value: 'rectangular', label: 'Rectangular' },
          { value: 'oval', label: 'Oval' },
          { value: 'round', label: 'Round' },
          { value: 'kidney', label: 'Kidney' },
          { value: 'freeform', label: 'Freeform' },
        ]}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Length (feet)"
          type="number"
          step="0.1"
          {...register('poolSpecs.length', { valueAsNumber: true })}
          error={errors.poolSpecs?.length?.message}
        />
        <Input
          label="Width (feet)"
          type="number"
          step="0.1"
          {...register('poolSpecs.width', { valueAsNumber: true })}
          error={errors.poolSpecs?.width?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Shallow End (feet)"
          type="number"
          step="0.1"
          {...register('poolSpecs.depth.shallow', { valueAsNumber: true })}
          error={errors.poolSpecs?.depth?.shallow?.message}
        />
        <Input
          label="Deep End (feet)"
          type="number"
          step="0.1"
          {...register('poolSpecs.depth.deep', { valueAsNumber: true })}
          error={errors.poolSpecs?.depth?.deep?.message}
        />
      </div>

      <Select
        label="Pool Type"
        {...register('poolSpecs.type')}
        error={errors.poolSpecs?.type?.message}
        options={[
          { value: 'in-ground', label: 'In-Ground' },
          { value: 'above-ground', label: 'Above-Ground' },
        ]}
      />
    </div>
  );
}
