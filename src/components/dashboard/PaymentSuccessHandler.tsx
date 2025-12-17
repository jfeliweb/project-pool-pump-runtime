'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';

export const PaymentSuccessHandler = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshSubscription, setPremiumStatus } = useSubscription();
  const hasProcessed = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    // Helper function for delays with proper timeout cleanup
    const waitMs = (ms: number): Promise<void> => {
      return new Promise((resolve) => {
        delayTimeoutRef.current = setTimeout(resolve, ms);
      });
    };

    if (sessionId && !hasProcessed.current) {
      hasProcessed.current = true;

      const checkSubscriptionStatus = async (attempt: number, delayMs: number): Promise<void> => {
        return new Promise((resolve) => {
          timeoutRef.current = setTimeout(async () => {
            try {
              // First, verify the checkout session directly with Stripe
              // This will update the database if the session is complete
              try {
                const verifyResponse = await fetch('/api/subscription/verify-session', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ sessionId }),
                });

                if (verifyResponse.ok) {
                  const verifyData = await verifyResponse.json();

                  if (verifyData.isPremium) {
                    // Directly set premium status to bypass Clerk state check
                    setPremiumStatus(true);
                    // Still refresh to ensure server components update
                    router.refresh();
                    await waitMs(100);
                    if (delayTimeoutRef.current) {
                      clearTimeout(delayTimeoutRef.current);
                      delayTimeoutRef.current = null;
                    }
                    timeoutRef.current = null;
                    resolve();
                    return;
                  }
                } else {
                  console.warn('[PaymentSuccessHandler] Session verification failed:', verifyResponse.status);
                }
              } catch (verifyError) {
                console.error('[PaymentSuccessHandler] Error verifying session:', verifyError);
              }

              // Also check regular subscription status
              await refreshSubscription();

              // Check if subscription is now premium
              const response = await fetch('/api/subscription/status', {
                cache: 'no-store',
              });
              if (response.ok) {
                const data = await response.json();

                if (data.isPremium) {
                  setPremiumStatus(true);
                  router.refresh();
                  await waitMs(100);
                  if (delayTimeoutRef.current) {
                    clearTimeout(delayTimeoutRef.current);
                    delayTimeoutRef.current = null;
                  }
                  timeoutRef.current = null;
                  resolve();
                  return;
                }
              }

              // If not premium yet and we have retries left, retry
              if (attempt < 3) {
                const nextDelay = delayMs * 2; // Exponential backoff: 1s, 2s, 4s (delayMs is the parameter)
                await checkSubscriptionStatus(attempt + 1, nextDelay);
              } else {
                console.warn('[PaymentSuccessHandler] Max retries reached, subscription may not be active yet');
              }

              timeoutRef.current = null;
              resolve();
            } catch (error) {
              console.error(`[PaymentSuccessHandler] Error checking subscription (attempt ${attempt}):`, error);
              timeoutRef.current = null;
              resolve();
            }
          }, delayMs);
        });
      };

      // Initial delay to allow webhook processing (500ms)
      // Then retry with exponential backoff: 1s, 2s, 4s
      checkSubscriptionStatus(1, 500)
        .then(async () => {
          // Ensure fresh data is loaded
          router.refresh();
          // Small delay to allow refresh to complete
          await waitMs(50);
          if (delayTimeoutRef.current) {
            clearTimeout(delayTimeoutRef.current);
            delayTimeoutRef.current = null;
          }

          // Clean up URL by removing session_id parameter
          const newSearchParams = new URLSearchParams(searchParams.toString());
          newSearchParams.delete('session_id');

          const newUrl = newSearchParams.toString()
            ? `${window.location.pathname}?${newSearchParams.toString()}`
            : window.location.pathname;

          router.replace(newUrl);
        })
        .catch((error) => {
          console.error('[PaymentSuccessHandler] Error processing payment success:', error);
        });
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
        delayTimeoutRef.current = null;
      }
    };
  }, [searchParams, router, refreshSubscription, setPremiumStatus]);

  // This component doesn't render anything
  return null;
};
