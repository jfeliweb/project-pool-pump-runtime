'use client';

import type { CalculationResult } from '@/types/calculator';
import type { CalculatorInput } from '@/validations/calculator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HorizontalAd, RectangleAd } from '@/components/AdUnit';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/useToast';
import { calculatePoolOptimization } from '@/utils/calculations';
import { calculatorInputSchema } from '@/validations/calculator';
import { LocationSection } from './LocationSection';
import { PoolSpecsSection } from './PoolSpecsSection';
import { PumpSpecsSection } from './PumpSpecsSection';
import { ResultsDisplay } from './ResultsDisplay';
import { UsageSection } from './UsageSection';

export function CalculatorForm() {
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorInputSchema),
    defaultValues: {
      poolSpecs: {
        shape: 'rectangular',
        length: 30,
        width: 15,
        depth: { shallow: 4, deep: 8 },
        type: 'in-ground',
      },
      pumpSpecs: {
        type: 'single-speed',
        horsepower: 1.5 as const,
        ageYears: 3,
      },
      locationData: {
        zipCode: '',
        state: '',
        city: '',
        climateZone: 'mixed-humid',
        latitude: 35,
        longitude: -95,
        avgTemperatures: {
          jan: 45,
          feb: 50,
          mar: 58,
          apr: 66,
          may: 74,
          jun: 81,
          jul: 84,
          aug: 84,
          sep: 78,
          oct: 68,
          nov: 58,
          dec: 48,
        },
        avgSunlightHours: { winter: 6, spring: 8, summer: 9, fall: 7 },
      },
      usageFactors: {
        usageLevel: 'moderate',
        averageSwimmers: 3,
        landscaping: 'moderate',
        screenEnclosure: false,
        hasWaterfall: false,
        hasHeater: false,
        hasSaltSystem: false,
        waterClarity: 'crystal-clear',
      },
      energyCostData: {
        electricityRate: 0.14,
        hasTimeOfUsePricing: false,
        currentDailyRuntime: 12,
      },
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsCalculating(true);
    try {
      // Perform calculation (cast to ensure proper type)
      const calculationResult = calculatePoolOptimization(data as any);
      setResults(calculationResult);

      // Scroll to results
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Calculation error:', error);
      addToast({
        message: 'An error occurred during calculation. Please check your inputs and try again.',
        type: 'error',
        duration: 5000,
      });
    } finally {
      setIsCalculating(false);
    }
  });

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Left Column - Form */}
      <div className="lg:sticky lg:top-4 lg:h-fit">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Pool Calculator</h2>

          <form onSubmit={onSubmit} className="space-y-6">
            <PoolSpecsSection register={register} control={control} errors={errors} />
            <div className="border-t border-gray-200" />

            <PumpSpecsSection register={register} control={control} setValue={setValue} errors={errors} />
            <div className="border-t border-gray-200" />

            <LocationSection register={register} control={control} setValue={setValue} errors={errors} />
            <div className="border-t border-gray-200" />

            <UsageSection register={register} errors={errors} />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isCalculating}
            >
              {isCalculating ? 'Calculating...' : 'Calculate Optimal Runtime'}
            </Button>
          </form>

          {/* Sidebar Ad */}
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-md">
              <RectangleAd className="mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Results */}
      <div id="results">
        {results
          ? (
              <>
                {/* Horizontal Ad Above Results */}
                <div className="mb-6">
                  <HorizontalAd />
                </div>

                <ResultsDisplay
                  results={results}
                  currentRuntime={watch('energyCostData.currentDailyRuntime')}
                  energyData={watch('energyCostData')}
                  formData={getValues()}
                />
              </>
            )
          : (
              <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-12">
                <div className="text-center">
                  <svg
                    className="mx-auto size-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    Ready to Calculate
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Fill out the form and click "Calculate Optimal Runtime" to see your personalized results
                  </p>
                </div>
              </div>
            )}
      </div>
    </div>
  );
}
