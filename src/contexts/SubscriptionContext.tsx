'use client';

import type { ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';

type SubscriptionStatus = 'free' | 'premium' | 'loading';

type SubscriptionContextType = {
  status: SubscriptionStatus;
  isPremium: boolean;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const [status, setStatus] = useState<SubscriptionStatus>('loading');
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!isLoaded || !user) {
      setStatus('free');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/subscription/status');
      const data = await response.json();

      setStatus(data.isPremium ? 'premium' : 'free');
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setStatus('free');
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const refreshSubscription = useCallback(async () => {
    setIsLoading(true);
    await fetchSubscription();
  }, [fetchSubscription]);

  const value = useMemo(
    () => ({
      status,
      isPremium: status === 'premium',
      isLoading,
      refreshSubscription,
    }),
    [status, isLoading, refreshSubscription],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = use(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
