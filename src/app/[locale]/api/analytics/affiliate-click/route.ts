import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

type AffiliateClickRequest = {
  productId: string;
  userId?: number;
};

export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as AffiliateClickRequest;
    const { productId, userId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 },
      );
    }

    // Log the affiliate click
    const clickData = {
      productId,
      userId: userId || null,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    };

    // For MVP: Log to console
    // In production, you would save this to a database or send to PostHog/analytics service
    console.warn('[Affiliate Click]', clickData);

    // Optional: Send to PostHog or other analytics service
    // Example with PostHog:
    // if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    //   const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    //     host: process.env.NEXT_PUBLIC_POSTHOG_HOST
    //   });
    //   posthog.capture({
    //     distinctId: userId?.toString() || 'anonymous',
    //     event: 'affiliate_click',
    //     properties: clickData
    //   });
    // }

    // Optional: Save to database
    // await db.insert(affiliateClicks).values(clickData);

    return NextResponse.json(
      { success: true, message: 'Affiliate click tracked' },
      { status: 200 },
    );
  } catch (error) {
    console.error('[Affiliate Click Error]', error);
    return NextResponse.json(
      { error: 'Failed to track affiliate click' },
      { status: 500 },
    );
  }
};
