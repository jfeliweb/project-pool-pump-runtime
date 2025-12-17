'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { createPool } from '@/app/actions/pools.actions';
import { useToast } from '@/components/ui/useToast';
import { clearStoredCalculation, getStoredCalculation } from '@/utils/calculationStorage';
import { transformCalculatorToPoolData } from '@/utils/poolDataTransform';

/**
 * Transforms technical error messages into user-friendly messages
 */
const getUserFriendlyErrorMessage = (error: Error): string => {
  const errorMessage = error.message;

  // Clerk middleware errors
  if (errorMessage.includes('clerkMiddleware') || errorMessage.includes('Clerk: auth()')) {
    return 'Authentication error. Please sign in again.';
  }

  // Unauthorized errors
  if (errorMessage.includes('Unauthorized') || errorMessage.includes('unauthorized')) {
    return 'Authentication error. Please sign in again.';
  }

  // Database or network errors
  if (errorMessage.includes('Failed to save') || errorMessage.includes('no data returned')) {
    return 'Unable to save pool. Please try again from the calculator.';
  }

  // Generic fallback
  return 'Unable to save your pool. Please try again from the calculator.';
};

/**
 * Handles restoration and auto-save of calculator results after authentication
 * Similar pattern to PaymentSuccessHandler
 */
export const CalculationRestoreHandler = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (hasProcessed.current) {
      return;
    }

    const restoreAndSaveCalculation = async () => {
      try {
        // Check for stored calculation data
        const storedData = getStoredCalculation();

        if (!storedData) {
          return;
        }

        hasProcessed.current = true;

        const { formData, results, action } = storedData;

        // Generate a unique pool name
        const poolName = 'My Pool';

        // Transform calculator data to pool data format
        const poolData = transformCalculatorToPoolData(formData, results, poolName);

        // Save to database
        const savedPool = await createPool(poolData);

        if (!savedPool) {
          throw new Error('Failed to save pool - no data returned');
        }

        // Clear stored data after successful save
        clearStoredCalculation();

        // Show success message based on the original action
        const message = action === 'save'
          ? `Pool "${poolName}" saved successfully! You can now manage it from your dashboard.`
          : `Pool "${poolName}" saved successfully! You can now download the PDF report.`;

        addToast({
          message,
          type: 'success',
          duration: 5000,
        });

        // Refresh the page to show the new pool
        router.refresh();
      } catch (error) {
        console.error('[CalculationRestoreHandler] Error saving pool:', error);

        // Show user-friendly error message
        const errorMessage = error instanceof Error
          ? getUserFriendlyErrorMessage(error)
          : 'Unable to save your pool. Please try again from the calculator.';

        addToast({
          message: errorMessage,
          type: 'error',
          duration: 7000,
        });

        // Clear stored data on error to prevent infinite retry loops
        clearStoredCalculation();
      }
    };

    restoreAndSaveCalculation();
  }, [router, addToast]);

  // This component doesn't render anything
  return null;
};
