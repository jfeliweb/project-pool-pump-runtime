'use client';

import { useRouter } from 'next/navigation';
import { useSubscription } from '@/contexts/SubscriptionContext';

export type AddPoolButtonProps = {
  poolCount: number;
};

export const AddPoolButton = ({ poolCount }: AddPoolButtonProps) => {
  const { isPremium } = useSubscription();
  const router = useRouter();

  const canAddPool = isPremium || poolCount < 1;

  const handleAddPool = () => {
    if (!canAddPool) {
      router.push('/pricing');
      return;
    }
    router.push('/calculator');
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleAddPool}
        className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-green-500 px-6 py-4 text-base font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
      >
        {!canAddPool && (
          <svg className="mr-2 size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
        {canAddPool
          ? (
              <>
                <svg className="mr-2 size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Pool
              </>
            )
          : (
              'Upgrade to Add More Pools'
            )}
      </button>

      {(() => {
        const showUpgradeMessage = !isPremium && poolCount >= 1;
        return showUpgradeMessage;
      })() && (
        <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            <strong>Free plan:</strong>
            {' '}
            You've used your 1 saved pool.
            {' '}
            <button
              type="button"
              onClick={() => router.push('/pricing')}
              className="font-semibold underline hover:text-yellow-900"
            >
              Upgrade for unlimited pools
            </button>
          </p>
        </div>
      )}
    </div>
  );
};
