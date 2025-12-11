import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPool } from '@/app/actions/pools.actions';
import { HorizontalAd, RectangleAd } from '@/components/AdUnit';
import { ScheduleTimeline } from '@/components/charts/ScheduleTimeline';
import { EditPoolButton } from '@/components/dashboard/EditPoolButton';
import { ExportReportButton } from '@/components/dashboard/ExportReportButton';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Pool Details | PoolCalc',
};

export default async function PoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pool = await getPool(id);

  if (!pool) {
    notFound();
  }

  const formatCurrency = (amount: number | string | null) => {
    if (!amount) {
      return '$0';
    }
    const num = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(num);
  };

  // Parse schedule blocks
  let scheduleBlocks = [];
  if (pool.scheduleBlocks) {
    try {
      scheduleBlocks = JSON.parse(pool.scheduleBlocks);
    } catch {
      // Ignore
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div>
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
              <Link href="/dashboard" className="hover:text-gray-900">
                Dashboard
              </Link>
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-gray-900">{pool.poolName}</span>
            </nav>

            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{pool.poolName}</h1>
                <p className="mt-2 text-gray-600">
                  {Number(pool.poolVolume).toLocaleString()}
                  {' '}
                  gallons •
                  {pool.poolShape}
                  {' '}
                  •
                  {pool.poolType}
                </p>
              </div>
              <div className="flex gap-3">
                <ExportReportButton pool={pool} />
                <EditPoolButton pool={pool} />
              </div>
            </div>

            {/* Horizontal Ad Below Header */}
            <div className="mb-8">
              <HorizontalAd />
            </div>

            {/* Top Metrics */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Monthly Savings"
                value={formatCurrency(pool.monthlySavings)}
                icon={(
                  <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
                badge={`${Number(pool.percentReduction || 0).toFixed(1)}% reduction`}
              />

              <StatCard
                label="Recommended Runtime"
                value={`${Number(pool.recommendedRuntime || 0).toFixed(1)} hrs`}
                icon={(
                  <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
                badge={`vs ${Number(pool.currentDailyRuntime)} hrs current`}
              />

              <StatCard
                label="Monthly Energy Usage"
                value={`${Number(pool.monthlyKwh || 0).toFixed(0)} kWh`}
                icon={(
                  <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                iconBgColor="bg-amber-100"
                iconColor="text-amber-600"
              />

              <StatCard
                label="Annual Savings"
                value={formatCurrency(pool.annualSavings)}
                icon={(
                  <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )}
                iconBgColor="bg-purple-100"
                iconColor="text-purple-600"
              />
            </div>

            {/* Schedule */}
            {scheduleBlocks.length > 0 && (
              <Card className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-gray-900">24-Hour Schedule</h2>
                <ScheduleTimeline schedule={scheduleBlocks} />
              </Card>
            )}

            {/* Pool Configuration */}
            <Card>
              <h2 className="mb-4 text-xl font-bold text-gray-900">Pool Configuration</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pump Type</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{pool.pumpType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Horsepower</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {Number(pool.pumpHorsepower)}
                    {' '}
                    HP
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {pool.city}
                    ,
                    {' '}
                    {pool.state}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Usage Level</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900 capitalize">{pool.usageLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Electricity Rate</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    $
                    {Number(pool.electricityRate).toFixed(3)}
                    /kWh
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Climate Zone</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900 capitalize">{pool.climateZone}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar with Ad */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <RectangleAd />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
