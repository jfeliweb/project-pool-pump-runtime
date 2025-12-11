'use client';

import { useUser } from '@clerk/nextjs';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/components/ui/useToast';
import { getI18nPath } from '@/utils/Helpers';

type CheckoutButtonProps = {
  planType: 'annual' | 'monthly';
  className?: string;
  children: React.ReactNode;
};

export const CheckoutButton = ({ planType, className, children }: CheckoutButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const locale = useLocale();

  const handleCheckout = async () => {
    // Check if user is authenticated
    if (isLoaded && !user) {
      // Redirect to sign-up with return URL to pricing page
      const pricingPath = getI18nPath('/pricing', locale);
      const signUpPath = getI18nPath('/sign-up', locale);
      const redirectUrl = `${signUpPath}?redirect_url=${encodeURIComponent(pricingPath)}`;
      router.push(redirectUrl);
      return;
    }

    // If user is not loaded yet, wait
    if (!isLoaded) {
      return;
    }

    setLoading(true);

    try {
      // Create checkout session
      const response = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType }),
      });

      if (!response.ok) {
        // Handle error responses
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to start checkout. Please try again.';
        addToast({
          message: errorMessage,
          type: 'error',
        });
        setLoading(false);
        return;
      }

      // Parse successful response
      const data = await response.json();
      const { url } = data;

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      addToast({
        message: error instanceof Error ? error.message : 'Failed to start checkout. Please try again.',
        type: 'error',
      });
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className={className}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
