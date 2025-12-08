import type { UserPool } from '@/models/Schema';
import Link from 'next/link';
import { PoolCard } from './PoolCard';

export type PoolGridProps = {
  pools: UserPool[];
};

export function PoolGrid({ pools }: PoolGridProps) {
  const gradientColors = ['blue', 'green', 'purple', 'pink'] as const;

  if (pools.length === 0) {
    return (
      <div className="flex min-h-96 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-12">
        <div className="text-center">
          <svg
            className="mx-auto size-24 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
          </svg>
          <h3 className="mt-6 text-xl font-semibold text-gray-900">No Pools Yet</h3>
          <p className="mt-2 text-sm text-gray-600">
            Get started by adding your first pool configuration
          </p>
          <Link
            href="/calculator"
            className="mt-6 inline-flex items-center rounded-lg bg-gradient-to-br from-blue-600 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
          >
            Add Your First Pool
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {pools.map((pool, index) => (
        <PoolCard
          key={pool.id}
          pool={pool}
          gradientColor={gradientColors[index % gradientColors.length]!}
        />
      ))}
    </div>
  );
}
