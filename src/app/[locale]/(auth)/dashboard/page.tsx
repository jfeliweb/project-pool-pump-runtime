import type { Metadata } from 'next';
import Link from 'next/link';
import { getPoolStats, getUserPools } from '@/app/actions/pools.actions';
import { PoolGrid } from '@/components/dashboard/PoolGrid';
import { StatCard } from '@/components/dashboard/StatCard';

export const metadata: Metadata = {
  title: 'Dashboard | PoolCalc',
  description: 'Manage your pool configurations and track your savings',
};

export default async function DashboardPage() {
  const [pools, stats] = await Promise.all([
    getUserPools(),
    getPoolStats(),
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your pool configurations and track savings</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Monthly Savings"
            value={formatCurrency(stats.totalMonthlySavings)}
            icon={(
              <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            badge={`${formatCurrency(stats.totalMonthlySavings * 12)}/year`}
            badgeColor="text-green-600"
          />

          <StatCard
            label="Active Pools"
            value={stats.totalPools}
            icon={(
              <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            )}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatCard
            label="Annual Energy Saved"
            value={`${stats.totalAnnualKwhSaved.toLocaleString()} kWh`}
            icon={(
              <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            iconBgColor="bg-amber-100"
            iconColor="text-amber-600"
            badge={`~${Math.round(stats.totalAnnualKwhSaved * 0.92)} lbs CO₂ saved`}
            badgeColor="text-amber-600"
          />

          <StatCard
            label="Avg Efficiency Score"
            value={`${stats.avgEfficiency}%`}
            icon={(
              <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            )}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>

        {/* Add Pool Button */}
        <div className="mb-6">
          <Link
            href="/calculator"
            className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-green-500 px-6 py-4 text-base font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
          >
            <svg className="mr-2 size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Pool
          </Link>
        </div>

        {/* Pool Grid */}
        <PoolGrid pools={pools} />
      </div>
    </div>
  );
}
