'use client';

import type { UserPool } from '@/models/Schema';
import type { CalculatorInput } from '@/validations/calculator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updatePool } from '@/app/actions/pools.actions';
import { LocationSection } from '@/components/calculator/LocationSection';
import { PoolSpecsSection } from '@/components/calculator/PoolSpecsSection';
import { PumpSpecsSection } from '@/components/calculator/PumpSpecsSection';
import { UsageSection } from '@/components/calculator/UsageSection';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/useToast';
import { calculatePoolOptimization } from '@/utils/calculations';
import { transformCalculatorToPoolData, transformPoolToCalculatorInput } from '@/utils/poolDataTransform';
import { calculatorInputSchema } from '@/validations/calculator';

type EditPoolModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  pool: UserPool;
};

export function EditPoolModal({ isOpen, onCloseAction, pool }: EditPoolModalProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [poolName, setPoolName] = useState(pool.poolName);

  // Transform pool data to calculator input format
  const defaultValues = transformPoolToCalculatorInput(pool);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorInputSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (formData) => {
    setIsSaving(true);
    try {
      // Calculate results from form data
      const calculationResult = calculatePoolOptimization(formData as any);

      // Transform to pool data format
      const poolData = transformCalculatorToPoolData(formData, calculationResult);

      // Update pool with new data
      await updatePool(pool.id, {
        ...poolData,
        poolName,
      });

      addToast({
        message: `Pool "${poolName}" updated successfully!`,
        type: 'success',
        duration: 5000,
      });

      // Close modal and refresh page
      onCloseAction();
      router.refresh();
    } catch (error) {
      console.error('Error updating pool:', error);
      addToast({
        message: error instanceof Error ? error.message : 'Failed to update pool. Please try again.',
        type: 'error',
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <Modal isOpen={isOpen} closeAction={onCloseAction} title="Edit Pool" size="xl">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Pool Name */}
        <Input
          id="pool-name"
          label="Pool Name"
          type="text"
          value={poolName}
          onChange={e => setPoolName(e.target.value)}
          placeholder="My Pool"
          maxLength={100}
        />

        {/* Pool Specifications */}
        <PoolSpecsSection register={register} control={control} errors={errors} />
        <div className="border-t border-gray-200" />

        {/* Pump Specifications */}
        <PumpSpecsSection register={register} control={control} setValue={setValue} errors={errors} />
        <div className="border-t border-gray-200" />

        {/* Location Section */}
        <LocationSection register={register} control={control} setValue={setValue} errors={errors} />
        <div className="border-t border-gray-200" />

        {/* Usage Section */}
        <UsageSection register={register} errors={errors} />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCloseAction}
            disabled={isSaving}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
