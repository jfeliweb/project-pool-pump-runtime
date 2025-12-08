import type { CalculationResult, EnergyCostData } from '@/types/calculator';
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
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
