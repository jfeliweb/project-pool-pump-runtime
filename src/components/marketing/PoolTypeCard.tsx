'use client';

import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

type PoolTypeCardProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  gradientClass: string;
  characteristics: string[];
  runtimeImpact: string;
  bestFor: string[];
  savingsRange: string;
};

export const PoolTypeCard = ({
  icon,
  title,
  subtitle,
  gradientClass,
  characteristics,
  runtimeImpact,
  bestFor,
  savingsRange,
}: PoolTypeCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${gradientClass} p-6`}>
        <div className="flex items-center space-x-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-sm text-white/80">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Key Characteristics */}
        <div className="mb-6">
          <h4 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
            Key Characteristics
          </h4>
          <ul className="space-y-2">
            {characteristics.map((char, index) => (
              <li key={index} className="flex items-start text-sm text-gray-700">
                <Check className="mt-0.5 mr-2 size-4 flex-shrink-0 text-green-500" />
                <span>{char}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pump Runtime Impact */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <h4 className="mb-2 text-sm font-semibold text-gray-900">
            Pump Runtime Impact
          </h4>
          <p className="text-sm leading-relaxed text-gray-600">{runtimeImpact}</p>
        </div>

        {/* Best For */}
        <div className="mb-4">
          <h4 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
            Best For
          </h4>
          <div className="flex flex-wrap gap-2">
            {bestFor.map((item, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Savings Badge */}
        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Annual Savings Potential</span>
            <span className="text-lg font-bold text-green-600">{savingsRange}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
