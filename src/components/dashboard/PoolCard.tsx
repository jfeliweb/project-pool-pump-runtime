import type { UserPool } from '@/models/Schema';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export type PoolCardProps = {
  pool: UserPool;
  gradientColor: 'blue' | 'green' | 'purple' | 'pink';
};

export function PoolCard({ pool, gradientColor }: PoolCardProps) {
  const formatCurrency = (amount: number | string | null) => {
    if (!amount) {
      return '$0';
    }
    const num = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Parse schedule blocks if available
  let scheduleBlocks = [];
  if (pool.scheduleBlocks) {
    try {
      scheduleBlocks = JSON.parse(pool.scheduleBlocks);
    } catch {
      // Ignore parse errors
    }
  }

  return (
    <Link href={`/dashboard/pools/${pool.id}`}>
      <Card variant="gradient" gradientColor={gradientColor} className="transition-transform hover:scale-105">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white">{pool.poolName}</h3>
          <p className="mt-1 text-sm text-white/80">
            {Number(pool.poolVolume).toLocaleString()}
            {' '}
            gallons •
            {pool.poolShape}
          </p>
        </div>

        <div className="mb-4 rounded-xl bg-white/20 p-6 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-5xl font-bold text-white">
              {Number(pool.recommendedRuntime || 0).toFixed(1)}
            </div>
            <div className="mt-1 text-sm font-medium text-white/90">hours/day recommended</div>
            <div className="mt-2 text-xs text-white/70">
              vs
              {' '}
              {Number(pool.currentDailyRuntime)}
              {' '}
              hours current
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">Monthly Savings</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(pool.monthlySavings)}
            </span>
          </div>

          {scheduleBlocks.length > 0 && (
            <div className="border-t border-gray-200 pt-3">
              <p className="mb-2 text-xs font-medium text-gray-600">Schedule Preview</p>
              <div className="flex h-6 overflow-hidden rounded">
                {Array.from({ length: 24 }, (_, hour) => {
                  const isRunning = scheduleBlocks.some(
                    (b: any) => hour >= b.startHour && hour < b.endHour,
                  );
                  return (
                    <div
                      key={hour}
                      className={`flex-1 ${isRunning ? 'bg-blue-600' : 'bg-gray-200'}`}
                      title={`${hour}:00`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>Last updated</span>
            <span>{new Date(pool.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
