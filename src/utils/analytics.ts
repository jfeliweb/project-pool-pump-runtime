import posthog from 'posthog-js';

// Initialize PostHog (should be called in the app root)
export function initPostHog() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false, // We'll handle this manually
      capture_pageleave: true,
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') {
          ph.debug();
        }
      },
    });
  }
}

// Calculator events
export function trackCalculatorUsed(data: {
  poolVolume: number;
  pumpType: string;
  climateZone: string;
  savings: number;
}) {
  if (typeof window !== 'undefined') {
    posthog.capture('calculator_used', data);
  }
}

export function trackPoolSaved(poolId: string, savings: number) {
  if (typeof window !== 'undefined') {
    posthog.capture('pool_saved', { poolId, savings });
  }
}

export function trackScheduleExported(format: string, poolId: string) {
  if (typeof window !== 'undefined') {
    posthog.capture('schedule_exported', { format, poolId });
  }
}

// User events
export function trackAccountCreated(userId: string, source: string) {
  if (typeof window !== 'undefined') {
    posthog.capture('account_created', { userId, source });
  }
}

export function trackPumpUpgradeViewed() {
  if (typeof window !== 'undefined') {
    posthog.capture('pump_upgrade_modal_viewed');
  }
}

// Page views
export function trackPageView(page: string) {
  if (typeof window !== 'undefined') {
    posthog.capture('$pageview', { page });
  }
}

// Identify user
export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, properties);
  }
}
