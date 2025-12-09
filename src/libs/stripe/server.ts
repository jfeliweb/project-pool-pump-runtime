import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
});

// Subscription plan configuration
export const SUBSCRIPTION_PLANS = {
  annual: {
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID!,
    amount: 4900, // $49.00 in cents
    interval: 'year' as const,
    name: 'Premium Annual',
    description: 'Save $11/year with annual billing',
  },
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    amount: 500, // $5.00 in cents
    interval: 'month' as const,
    name: 'Premium Monthly',
    description: 'Flexible monthly billing',
  },
} as const;

// Helper to check if user has active subscription
export async function hasActiveSubscription(stripeCustomerId: string): Promise<boolean> {
  if (!stripeCustomerId) {
    return false;
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: 'active',
    limit: 1,
  });

  return subscriptions.data.length > 0;
}
