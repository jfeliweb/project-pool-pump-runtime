'use client';

type PoolTypeRow = {
  poolType: string;
  avgVolume: string;
  surfaceType: string;
  runtimeAdjustment: string;
  savingsPotential: string;
  colorClass: string;
};

type PoolTypeComparisonTableProps = {
  rows: PoolTypeRow[];
  note?: string;
};

export const PoolTypeComparisonTable = ({ rows, note }: PoolTypeComparisonTableProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Pool Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Avg Volume
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Surface Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Runtime Adjustment
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Annual Savings Potential
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(row => (
              <tr
                key={row.poolType}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className={`size-3 rounded-full bg-gradient-to-r ${row.colorClass}`} />
                    <span className="font-medium text-gray-900">{row.poolType}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{row.avgVolume}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    row.surfaceType === 'Porous'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                  >
                    {row.surfaceType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${
                    row.runtimeAdjustment === 'Baseline'
                      ? 'text-gray-600'
                      : 'text-green-600'
                  }`}
                  >
                    {row.runtimeAdjustment}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-lg font-bold text-green-600">
                    {row.savingsPotential}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && (
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-3">
          <p className="text-xs text-gray-500 italic">{note}</p>
        </div>
      )}
    </div>
  );
};
