import type { SavingsResult } from '@/types/calculator';
import { Card } from '@/components/ui/Card';

export type SavingsBreakdownCardProps = {
  costs: SavingsResult;
};

export function SavingsBreakdownCard({ costs }: SavingsBreakdownCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Cost Savings Breakdown</h3>

      <div className="space-y-4">
        {/* Current vs Optimized */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-red-50 p-3">
            <div className="text-xs font-medium tracking-wide text-red-600 uppercase">Current Monthly</div>
            <div className="mt-1 text-2xl font-bold text-red-700">
              {formatCurrency(costs.currentCosts.monthlyCost)}
            </div>
          </div>
          <div className="rounded-lg bg-green-50 p-3">
            <div className="text-xs font-medium tracking-wide text-green-600 uppercase">Optimized Monthly</div>
            <div className="mt-1 text-2xl font-bold text-green-700">
              {formatCurrency(costs.optimizedCosts.monthlyCost)}
            </div>
          </div>
        </div>

        {/* Savings */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Monthly Savings</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(costs.savings.monthlySavings)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Annual Savings</span>
            <span className="text-xl font-bold text-green-600">
              {formatCurrency(costs.savings.annualSavings)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">5-Year Savings</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(costs.savings.annualSavings * 5)}
            </span>
          </div>
        </div>

        {/* Energy Savings */}
        <div className="border-t border-gray-200 pt-4">
          <div className="rounded-lg bg-blue-50 p-3">
            <div className="text-xs font-medium tracking-wide text-blue-600 uppercase">Annual Energy Saved</div>
            <div className="mt-1 text-xl font-bold text-blue-700">
              {costs.savings.annualKwhSaved.toFixed(0)}
              {' '}
              kWh
            </div>
            <div className="mt-1 text-xs text-blue-600">
              Environmental impact: ~
              {(costs.savings.annualKwhSaved * 0.92).toFixed(0)}
              {' '}
              lbs CO₂ reduction
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
