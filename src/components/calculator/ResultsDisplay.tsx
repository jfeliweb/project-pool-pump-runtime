'use client';

import type { CalculationResult, EnergyCostData } from '@/types/calculator';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { exportCalculatorResultsPDF } from '@/utils/pdf/calculatorResultsExport';
import { RecommendationsList } from './RecommendationsList';
import { ROIAnalysisCard } from './ROIAnalysisCard';
import { RuntimeMetricCard } from './RuntimeMetricCard';
import { SavingsBreakdownCard } from './SavingsBreakdownCard';
import { ScheduleVisualization } from './ScheduleVisualization';

export type ResultsDisplayProps = {
  results: CalculationResult;
  currentRuntime: number;
  energyData: EnergyCostData;
};

export function ResultsDisplay({ results, currentRuntime, energyData }: ResultsDisplayProps) {
  const { isPremium } = useSubscription();
  const router = useRouter();

  const handleDownloadPDF = () => {
    if (!isPremium) {
      router.push('/pricing');
      return;
    }
    exportCalculatorResultsPDF(results, currentRuntime, energyData);
  };

  return (
    <div className="space-y-6">
      {/* Hero Metric */}
      <RuntimeMetricCard
        optimalRuntime={results.optimalRuntime}
        currentRuntime={currentRuntime}
        percentReduction={results.costs.savings.percentReduction}
      />

      {/* Savings Breakdown */}
      <SavingsBreakdownCard costs={results.costs} />

      {/* Schedule Visualization */}
      <ScheduleVisualization
        schedule={results.schedule}
        energyData={energyData}
      />

      {/* ROI Analysis (if applicable) */}
      {results.costs.roiMetrics && (
        <ROIAnalysisCard costs={results.costs} />
      )}

      {/* Recommendations */}
      <RecommendationsList recommendations={results.recommendations} />

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="rounded-lg border-2 border-blue-600 bg-white px-6 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
        >
          Save This Schedule
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
    </div>
  );
}
