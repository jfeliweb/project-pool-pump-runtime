'use client';

import type { CalculationResult, EnergyCostData } from '@/types/calculator';
import type { CalculatorInput } from '@/validations/calculator';
import { useUser } from '@clerk/nextjs';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createPool } from '@/app/actions/pools.actions';
import { HorizontalAd, RectangleAd } from '@/components/AdUnit';
import { useToast } from '@/components/ui/useToast';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { exportCalculatorResultsPDF } from '@/utils/pdf/calculatorResultsExport';
import { transformCalculatorToPoolData } from '@/utils/poolDataTransform';
import { ProductRecommendations } from './ProductRecommendations';
import { RecommendationsList } from './RecommendationsList';
import { ROIAnalysisCard } from './ROIAnalysisCard';
import { RuntimeMetricCard } from './RuntimeMetricCard';
import { SavingsBreakdownCard } from './SavingsBreakdownCard';
import { ScheduleVisualization } from './ScheduleVisualization';

export type ResultsDisplayProps = {
  results: CalculationResult;
  currentRuntime: number;
  energyData: EnergyCostData;
  formData: CalculatorInput;
};

export function ResultsDisplay({ results, currentRuntime, energyData, formData }: ResultsDisplayProps) {
  const { isPremium } = useSubscription();
  const router = useRouter();
  const locale = useLocale();
  const { user, isLoaded } = useUser();
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleDownloadPDF = () => {
    if (!isPremium) {
      router.push('/pricing');
      return;
    }
    exportCalculatorResultsPDF(results, currentRuntime, energyData);
  };

  const handleSaveSchedule = async () => {
    // Wait for auth to load
    if (!isLoaded) {
      return;
    }

    // Check if user is logged in
    if (!user) {
      addToast({
        message: 'Please sign in to save your pool schedule',
        type: 'info',
        duration: 3000,
      });
      const signInPath = locale === 'en' ? '/sign-in' : `/${locale}/sign-in`;
      router.push(signInPath);
      return;
    }

    setIsSaving(true);
    try {
      // Transform calculator data to pool data format
      const poolData = transformCalculatorToPoolData(formData, results);

      // Save to database
      const savedPool = await createPool(poolData);

      if (!savedPool) {
        throw new Error('Failed to save pool - no data returned');
      }

      const poolName = savedPool.poolName || 'My Pool';
      addToast({
        message: `Pool "${poolName}" saved successfully!`,
        type: 'success',
        duration: 5000,
      });

      // Optionally redirect to dashboard after a short delay
      setTimeout(() => {
        const dashboardPath = locale === 'en' ? '/dashboard' : `/${locale}/dashboard`;
        router.push(dashboardPath);
      }, 1500);
    } catch (error) {
      console.error('Error saving pool:', error);
      addToast({
        message: error instanceof Error ? error.message : 'Failed to save pool. Please try again.',
        type: 'error',
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Metric */}
      <RuntimeMetricCard
        optimalRuntime={results.optimalRuntime}
        currentRuntime={currentRuntime}
        percentReduction={results.costs.savings.percentReduction}
      />

      {/* Ad Placement 1: After hero metric */}
      <HorizontalAd className="my-8" />

      {/* Main content grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column: Main results */}
        <div className="space-y-6 lg:col-span-2">
          {/* Savings Breakdown */}
          <SavingsBreakdownCard costs={results.costs} />

          {/* Schedule Visualization */}
          <ScheduleVisualization
            schedule={results.schedule}
            energyData={energyData}
          />

          {/* Recommendations */}
          <RecommendationsList recommendations={results.recommendations} />

          {/* ROI Analysis (if applicable) */}
          {results.costs.roiMetrics && (
            <ROIAnalysisCard costs={results.costs} />
          )}
        </div>

        {/* Right sidebar: Ad */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:h-fit">
          {/* Ad Placement 2: Sidebar */}
          <RectangleAd />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={handleSaveSchedule}
          disabled={isSaving}
          className="rounded-lg border-2 border-blue-600 bg-white px-6 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save This Pool'}
        </button>
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="relative rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {!isPremium && (
            <span className="absolute -top-2 -right-2 rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-black">
              PRO
            </span>
          )}
          Download PDF
        </button>
      </div>

      {/* Product Recommendations */}
      <ProductRecommendations
        poolVolume={results.poolVolume}
        currentAnnualCost={results.costs.currentCosts.annualCost}
      />
    </div>
  );
}
