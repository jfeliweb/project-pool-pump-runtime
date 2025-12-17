'use client';

import type { CalculationResult, EnergyCostData } from '@/types/calculator';
import type { CalculatorInput } from '@/validations/calculator';
import { useUser } from '@clerk/nextjs';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPool, getUserPools } from '@/app/actions/pools.actions';
import { HorizontalAd, RectangleAd } from '@/components/AdUnit';
import { useToast } from '@/components/ui/useToast';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { storeCalculation } from '@/utils/calculationStorage';
import { exportCalculatorResultsPDF } from '@/utils/pdf/calculatorResultsExport';
import { transformCalculatorToPoolData } from '@/utils/poolDataTransform';
import { ProductRecommendations } from './ProductRecommendations';
import { RecommendationsList } from './RecommendationsList';
import { ROIAnalysisCard } from './ROIAnalysisCard';
import { RuntimeMetricCard } from './RuntimeMetricCard';
import { SavePoolModal } from './SavePoolModal';
import { SavingsBreakdownCard } from './SavingsBreakdownCard';
import { ScheduleVisualization } from './ScheduleVisualization';

export type ResultsDisplayProps = {
  results: CalculationResult;
  currentRuntime: number;
  energyData: EnergyCostData;
  formData: CalculatorInput;
};

/**
 * Generates a unique default pool name based on existing pools
 * Returns "My Pool", "My Pool 1", "My Pool 2", etc.
 */
const generateUniquePoolName = (existingPools: Array<{ poolName: string }>): string => {
  const baseName = 'My Pool';
  const existingNames = new Set(existingPools.map(pool => pool.poolName));

  // Check if base name is available
  if (!existingNames.has(baseName)) {
    return baseName;
  }

  // Find the next available number
  let counter = 1;
  while (existingNames.has(`${baseName} ${counter}`)) {
    counter++;
  }

  return `${baseName} ${counter}`;
};

/**
 * Transforms technical error messages into user-friendly messages
 */
const getUserFriendlyErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return 'Unable to save pool. Please try again.';
  }

  const errorMessage = error.message;

  // Clerk middleware errors
  if (errorMessage.includes('clerkMiddleware') || errorMessage.includes('Clerk: auth()')) {
    return 'Please sign in to save your pool.';
  }

  // Unauthorized errors
  if (errorMessage.includes('Unauthorized') || errorMessage.includes('unauthorized')) {
    return 'Please sign in to save your pool.';
  }

  // Database or network errors
  if (errorMessage.includes('Failed to save') || errorMessage.includes('no data returned')) {
    return 'Unable to save pool. Please try again.';
  }

  // Generic fallback - return a simple message instead of technical details
  return 'Unable to save pool. Please try again.';
};

export function ResultsDisplay({ results, currentRuntime, energyData, formData }: ResultsDisplayProps) {
  const { isPremium } = useSubscription();
  const router = useRouter();
  const locale = useLocale();
  const { user, isLoaded } = useUser();
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [poolCount, setPoolCount] = useState<number>(0);
  const [isLoadingPoolCount, setIsLoadingPoolCount] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultPoolName, setDefaultPoolName] = useState<string>('My Pool');

  // Fetch pool count when user is loaded
  useEffect(() => {
    const fetchPoolCount = async () => {
      if (!isLoaded) {
        return;
      }

      if (!user) {
        setPoolCount(0);
        setIsLoadingPoolCount(false);
        return;
      }

      try {
        const pools = await getUserPools();
        setPoolCount(pools.length);
      } catch (error) {
        console.error('Error fetching pool count:', error);
        // Default to 0 on error to allow save attempt
        setPoolCount(0);
      } finally {
        setIsLoadingPoolCount(false);
      }
    };

    fetchPoolCount();
  }, [isLoaded, user]);

  const handleDownloadPDF = () => {
    if (!isPremium) {
      // Store calculation data before redirecting to pricing
      storeCalculation(formData, results, energyData, currentRuntime, 'download');
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
      // Store calculation data before redirecting to sign-in
      storeCalculation(formData, results, energyData, currentRuntime, 'save');

      addToast({
        message: 'Please sign in to save your pool schedule',
        type: 'info',
        duration: 3000,
      });

      // Redirect to sign-in with return URL to dashboard
      const dashboardPath = locale === 'en' ? '/dashboard' : `/${locale}/dashboard`;
      const signInPath = locale === 'en' ? '/sign-in' : `/${locale}/sign-in`;
      router.push(`${signInPath}?redirect_url=${encodeURIComponent(dashboardPath)}`);
      return;
    }

    // Check if free user has reached pool limit
    if (!isPremium && poolCount >= 1) {
      router.push('/pricing');
      return;
    }

    // Fetch existing pools to generate unique default name
    try {
      const existingPools = await getUserPools();
      const uniqueName = generateUniquePoolName(existingPools);
      setDefaultPoolName(uniqueName);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching pools:', error);
      // Use default name if fetch fails
      setDefaultPoolName('My Pool');
      setIsModalOpen(true);
    }
  };

  const handleSavePool = async (poolName: string) => {
    setIsSaving(true);
    try {
      // Transform calculator data to pool data format with provided name
      const poolData = transformCalculatorToPoolData(formData, results, poolName);

      // Save to database
      const savedPool = await createPool(poolData);

      if (!savedPool) {
        throw new Error('Failed to save pool - no data returned');
      }

      addToast({
        message: `Pool "${poolName}" saved successfully!`,
        type: 'success',
        duration: 5000,
      });

      // Close modal
      setIsModalOpen(false);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        const dashboardPath = locale === 'en' ? '/dashboard' : `/${locale}/dashboard`;
        router.push(dashboardPath);
      }, 1500);
    } catch (error) {
      console.error('Error saving pool:', error);
      const userFriendlyMessage = getUserFriendlyErrorMessage(error);
      addToast({
        message: userFriendlyMessage,
        type: 'error',
        duration: 5000,
      });
      throw error; // Re-throw to let modal handle it
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          className="relative rounded-lg border-2 border-blue-600 bg-white px-6 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {!isPremium && !isLoadingPoolCount && poolCount >= 1 && (
            <span className="absolute -top-2 -right-2 rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-black">
              PRO
            </span>
          )}
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

      {/* Save Pool Modal */}
      <SavePoolModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePool}
        defaultName={defaultPoolName}
        isSaving={isSaving}
      />
    </div>
  );
}
