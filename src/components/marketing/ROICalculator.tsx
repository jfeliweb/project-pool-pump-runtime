'use client';

type ROICalculatorProps = {
  initialCost: string;
  annualSavings: string;
  paybackPeriod: string;
  fiveYearSavings: string;
  tenYearSavings: string;
};

export const ROICalculator = ({
  initialCost,
  annualSavings,
  paybackPeriod,
  fiveYearSavings,
  tenYearSavings,
}: ROICalculatorProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-lg">
      <h3 className="mb-6 text-center text-2xl font-bold text-gray-900">
        Variable-Speed Pump Return on Investment
      </h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg bg-white p-4 text-center shadow">
          <div className="mb-1 text-sm text-gray-600">Initial Cost</div>
          <div className="text-2xl font-bold text-gray-900">{initialCost}</div>
        </div>
        <div className="rounded-lg bg-white p-4 text-center shadow">
          <div className="mb-1 text-sm text-gray-600">Annual Savings</div>
          <div className="text-2xl font-bold text-green-600">
            {annualSavings}
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 text-center shadow">
          <div className="mb-1 text-sm text-gray-600">Payback Period</div>
          <div className="text-2xl font-bold text-blue-600">
            {paybackPeriod}
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 text-center shadow">
          <div className="mb-1 text-sm text-gray-600">5-Year Net Savings</div>
          <div className="text-2xl font-bold text-green-700">
            {fiveYearSavings}
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 text-center shadow">
          <div className="mb-1 text-sm text-gray-600">10-Year Net Savings</div>
          <div className="text-2xl font-bold text-green-800">
            {tenYearSavings}
          </div>
        </div>
      </div>
    </div>
  );
};
