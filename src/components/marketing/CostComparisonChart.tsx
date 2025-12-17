'use client';

type CostComparisonChartProps = {
  before: {
    label: string;
    monthly: string;
    annual: string;
  };
  after: {
    label: string;
    monthly: string;
    annual: string;
  };
  savings: {
    monthly: string;
    annual: string;
  };
};

export const CostComparisonChart = ({
  before,
  after,
  savings,
}: CostComparisonChartProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
      <h3 className="mb-6 text-center text-2xl font-bold text-gray-900">
        The True Cost of Pool Pump Operation
      </h3>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Before */}
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
          <div className="mb-2 text-sm font-semibold text-red-600">
            {before.label}
          </div>
          <div className="mb-1 text-3xl font-bold text-red-700">
            {before.monthly}
          </div>
          <div className="text-sm text-red-600">{before.annual}</div>
        </div>

        {/* After */}
        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
          <div className="mb-2 text-sm font-semibold text-green-600">
            {after.label}
          </div>
          <div className="mb-1 text-3xl font-bold text-green-700">
            {after.monthly}
          </div>
          <div className="text-sm text-green-600">{after.annual}</div>
        </div>

        {/* Savings */}
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
          <div className="mb-2 text-sm font-semibold text-blue-600">
            Your Savings
          </div>
          <div className="mb-1 text-3xl font-bold text-blue-700">
            {savings.monthly}
          </div>
          <div className="text-sm text-blue-600">{savings.annual}</div>
        </div>
      </div>
    </div>
  );
};
