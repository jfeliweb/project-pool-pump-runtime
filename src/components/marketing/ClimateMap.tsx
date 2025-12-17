'use client';

type StateSavings = {
  state: string;
  savings: string;
};

type ClimateMapProps = {
  topStates: StateSavings[];
  climateZones: {
    name: string;
    states: string;
    savings: string;
  }[];
};

export const ClimateMap = ({ topStates, climateZones }: ClimateMapProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
      <h3 className="mb-6 text-center text-2xl font-bold text-gray-900">
        Regional Savings Potential
      </h3>

      {/* Top States */}
      <div className="mb-8">
        <h4 className="mb-4 text-lg font-semibold text-gray-800">
          Top 10 States for Pool Pump Savings
        </h4>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {topStates.map((state, index) => (
            <div
              key={state.state}
              className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4"
            >
              <div className="mb-1 text-sm font-semibold text-gray-600">
                #
                {index + 1}
                {' '}
                {state.state}
              </div>
              <div className="text-xl font-bold text-blue-700">
                {state.savings}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Climate Zones */}
      <div>
        <h4 className="mb-4 text-lg font-semibold text-gray-800">
          Climate Zone Savings
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          {climateZones.map(zone => (
            <div
              key={`${zone.name}-${zone.states}`}
              className="rounded-lg border-2 border-green-200 bg-green-50 p-4"
            >
              <div className="mb-2 font-semibold text-gray-900">{zone.name}</div>
              <div className="mb-1 text-sm text-gray-600">{zone.states}</div>
              <div className="text-lg font-bold text-green-700">
                {zone.savings}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
