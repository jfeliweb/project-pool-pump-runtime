import type { SavingsResult } from '@/types/calculator';
import { Card } from '@/components/ui/Card';

export type ROIAnalysisCardProps = {
  costs: SavingsResult;
};

export function ROIAnalysisCard({ costs }: ROIAnalysisCardProps) {
  if (!costs.roiMetrics) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="border-2 border-amber-200 bg-amber-50">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-amber-900">Variable-Speed Pump Upgrade</h3>
          <p className="mt-1 text-sm text-amber-700">Maximize your savings potential</p>
        </div>
        <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-900">
          Recommended
        </span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-amber-700">Upgrade Cost</div>
            <div className="mt-1 text-2xl font-bold text-amber-900">
              {formatCurrency(costs.roiMetrics.variableSpeedUpgradeCost)}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-amber-700">Payback Period</div>
            <div className="mt-1 text-2xl font-bold text-amber-900">
              {costs.roiMetrics.paybackMonths.toFixed(1)}
              {' '}
              months
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4">
          <div className="text-xs font-medium text-gray-600">5-Year Total Savings</div>
          <div className="mt-1 text-3xl font-bold text-green-600">
            {formatCurrency(costs.roiMetrics.fiveYearSavings)}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            After deducting upgrade cost
          </div>
        </div>

        <div className="border-t border-amber-200 pt-4">
          <p className="text-sm text-amber-800">
            Variable-speed pumps can save up to 70% on energy costs compared to single-speed pumps.
            They adjust speed based on pool needs, running efficiently at lower speeds most of the time.
          </p>
        </div>
      </div>
    </Card>
  );
}
