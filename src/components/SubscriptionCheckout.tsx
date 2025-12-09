'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/useToast';

type CheckoutButtonProps = {
  planType: 'annual' | 'monthly';
  className?: string;
  children: React.ReactNode;
};

export const CheckoutButton = ({ planType, className, children }: CheckoutButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // Create checkout session
      const response = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType }),
      });

      const { url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      addToast({
        message: 'Failed to start checkout. Please try again.',
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
