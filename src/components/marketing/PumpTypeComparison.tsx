'use client';

type PumpType = {
  name: string;
  annualCost: string;
  efficiency: string;
  savings: string;
};

type PumpTypeComparisonProps = {
  types: PumpType[];
};

export const PumpTypeComparison = ({ types }: PumpTypeComparisonProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
      <h3 className="mb-6 text-center text-2xl font-bold text-gray-900">
        Pump Type Comparison
      </h3>
      <div className="grid gap-6 md:grid-cols-3">
        {types.map((type, index) => (
          <div
            key={type.name}
            className={`rounded-lg border-2 p-6 ${
              index === types.length - 1
                ? 'border-green-300 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="mb-4 text-xl font-bold text-gray-900">
              {type.name}
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Annual Cost</div>
                <div className="text-2xl font-bold text-gray-900">
                  {type.annualCost}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Efficiency</div>
                <div className="text-lg font-semibold text-gray-700">
                  {type.efficiency}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Savings Potential</div>
                <div
                  className={`text-lg font-bold ${
                    index === types.length - 1
                      ? 'text-green-700'
                      : 'text-gray-700'
                  }`}
                >
                  {type.savings}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
