'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/contexts/SubscriptionContext';

type PremiumFeatureGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
  feature?: string;
};

export const PremiumFeatureGuard = ({
  children,
  fallback,
  feature = 'this feature',
}: PremiumFeatureGuardProps) => {
  const { isPremium, isLoading } = useSubscription();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!isPremium) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold">Premium Feature</h3>
        <p className="mt-2 text-gray-600">
          Upgrade to Premium to access
          {' '}
          {feature}
        </p>
        <button
          type="button"
          onClick={() => router.push('/pricing')}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Upgrade to Premium
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

// Simple hook version for conditional rendering
export const usePremiumFeature = () => {
  const { isPremium } = useSubscription();

  return {
    isPremium,
    showUpgradePrompt: !isPremium,
  };
};
