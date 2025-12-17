'use client';

import type { ReactNode } from 'react';

type StatItem = {
  icon: ReactNode;
  value: string;
  label: string;
};

type SavingsStatsProps = {
  stats: StatItem[];
};

export const SavingsStats = ({ stats }: SavingsStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map(stat => (
        <div
          key={`${stat.value}-${stat.label}`}
          className="flex flex-col items-center rounded-xl bg-white/10 p-6 backdrop-blur-sm"
        >
          <div className="mb-3 text-white">{stat.icon}</div>
          <div className="mb-2 text-3xl font-bold text-yellow-300 lg:text-4xl">
            {stat.value}
          </div>
          <div className="text-center text-sm text-blue-100 lg:text-base">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};
