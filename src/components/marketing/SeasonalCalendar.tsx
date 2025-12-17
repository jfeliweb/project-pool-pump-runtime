'use client';

type Season = {
  name: string;
  months: string;
  cost: string;
  savings: string;
  description: string;
};

type SeasonalCalendarProps = {
  seasons: Season[];
  annualSavings: string;
};

export const SeasonalCalendar = ({
  seasons,
  annualSavings,
}: SeasonalCalendarProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
      <h3 className="mb-6 text-center text-2xl font-bold text-gray-900">
        Seasonal Adjustment Calendar
      </h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {seasons.map(season => (
          <div
            key={season.name}
            className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6"
          >
            <div className="mb-2 text-lg font-bold text-gray-900">
              {season.name}
            </div>
            <div className="mb-3 text-sm text-gray-600">{season.months}</div>
            <div className="mb-2 text-sm text-gray-700">{season.description}</div>
            <div className="mb-1">
              <span className="text-sm text-gray-600">Cost: </span>
              <span className="font-semibold text-gray-900">{season.cost}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Savings: </span>
              <span className="font-bold text-green-700">{season.savings}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-lg bg-green-100 p-4 text-center">
        <div className="text-sm text-gray-700">Annual Savings with Seasonal Adjustment</div>
        <div className="text-2xl font-bold text-green-800">{annualSavings}</div>
      </div>
    </div>
  );
};
