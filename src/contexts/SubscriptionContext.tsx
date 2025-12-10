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
    // Don't fetch on server-side
    if (typeof window === 'undefined') {
      return;
    }

    if (!isLoaded || !user) {
      setStatus('free');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/subscription/status');
      
      // Check if response is OK before parsing JSON
      if (!response.ok) {
        console.error('Subscription status API error:', response.status, response.statusText);
        setStatus('free');
        setIsLoading(false);
        return;
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Subscription status API returned non-JSON response');
        setStatus('free');
        setIsLoading(false);
        return;
      }

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
    <SubscriptionContext value={value}>
      {children}
    </SubscriptionContext>
  );
}

export function useSubscription() {
  const context = use(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
