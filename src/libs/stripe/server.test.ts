import type Stripe from 'stripe';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { hasActiveSubscription, stripe, SUBSCRIPTION_PLANS } from './server';

describe('Stripe Configuration', () => {
  it('should have valid stripe instance', () => {
    expect(stripe).toBeDefined();
    expect(stripe).toBeInstanceOf(Object);
  });

  it('should be configured with TypeScript support', () => {
    expect(stripe).toHaveProperty('subscriptions');
    expect(stripe).toHaveProperty('customers');
    expect(stripe).toHaveProperty('prices');
  });
});

describe('Subscription Plans Configuration', () => {
  describe('Annual Plan', () => {
    it('should have valid price ID format', () => {
      expect(SUBSCRIPTION_PLANS.annual.priceId).toMatch(/^price_/);
    });

    it('should have correct amount', () => {
      expect(SUBSCRIPTION_PLANS.annual.amount).toBe(4900);
    });

    it('should have correct interval', () => {
      expect(SUBSCRIPTION_PLANS.annual.interval).toBe('year');
    });

    it('should have correct name', () => {
      expect(SUBSCRIPTION_PLANS.annual.name).toBe('Premium Annual');
    });

    it('should have correct description', () => {
      expect(SUBSCRIPTION_PLANS.annual.description).toBe('Save $11/year with annual billing');
    });
  });

  describe('Monthly Plan', () => {
    it('should have valid price ID format', () => {
      expect(SUBSCRIPTION_PLANS.monthly.priceId).toMatch(/^price_/);
    });

    it('should have correct amount', () => {
      expect(SUBSCRIPTION_PLANS.monthly.amount).toBe(500);
    });

    it('should have correct interval', () => {
      expect(SUBSCRIPTION_PLANS.monthly.interval).toBe('month');
    });

    it('should have correct name', () => {
      expect(SUBSCRIPTION_PLANS.monthly.name).toBe('Premium Monthly');
    });

    it('should have correct description', () => {
      expect(SUBSCRIPTION_PLANS.monthly.description).toBe('Flexible monthly billing');
    });
  });

  it('should have both annual and monthly plans defined', () => {
    expect(SUBSCRIPTION_PLANS).toHaveProperty('annual');
    expect(SUBSCRIPTION_PLANS).toHaveProperty('monthly');
    expect(Object.keys(SUBSCRIPTION_PLANS)).toEqual(['annual', 'monthly']);
  });
});

describe('hasActiveSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true when customer has active subscription', async () => {
    const mockSubscriptions = {
      object: 'list',
      data: [
        {
          id: 'sub_123',
          status: 'active',
        } as Stripe.Subscription,
      ],
      has_more: false,
      url: '/v1/subscriptions',
      lastResponse: {
        headers: {},
        requestId: 'req_123',
        statusCode: 200,
      },
    } as any;

    const listSpy = vi.spyOn(stripe.subscriptions, 'list').mockResolvedValue(mockSubscriptions);

    const result = await hasActiveSubscription('cus_123');

    expect(result).toBe(true);
    expect(listSpy).toHaveBeenCalledWith({
      customer: 'cus_123',
      status: 'active',
      limit: 1,
    });
  });

  it('should return false when customer has no subscriptions', async () => {
    const mockSubscriptions = {
      object: 'list',
      data: [],
      has_more: false,
      url: '/v1/subscriptions',
      lastResponse: {
        headers: {},
        requestId: 'req_456',
        statusCode: 200,
      },
    } as any;

    const listSpy = vi.spyOn(stripe.subscriptions, 'list').mockResolvedValue(mockSubscriptions);

    const result = await hasActiveSubscription('cus_456');

    expect(result).toBe(false);
    expect(listSpy).toHaveBeenCalledWith({
      customer: 'cus_456',
      status: 'active',
      limit: 1,
    });
  });

  it('should return false when customer ID is empty string', async () => {
    const result = await hasActiveSubscription('');

    expect(result).toBe(false);
  });

  it('should verify correct Stripe API parameters', async () => {
    const mockSubscriptions = {
      object: 'list',
      data: [],
      has_more: false,
      url: '/v1/subscriptions',
      lastResponse: {
        headers: {},
        requestId: 'req_test',
        statusCode: 200,
      },
    } as any;

    const listSpy = vi.spyOn(stripe.subscriptions, 'list').mockResolvedValue(mockSubscriptions);

    await hasActiveSubscription('cus_test');

    expect(listSpy).toHaveBeenCalledTimes(1);
    expect(listSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: 'cus_test',
        status: 'active',
        limit: 1,
      }),
    );
  });
});
