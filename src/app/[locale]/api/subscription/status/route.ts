import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { hasActiveSubscription } from '@/libs/stripe/server';
import { usersTable } from '@/models/Schema';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { isPremium: false, status: 'free' },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        },
      );
    }

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkUserId, userId))
      .limit(1);

    const user = users[0];

    if (!user) {
      return NextResponse.json(
        { isPremium: false, status: 'free' },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        },
      );
    }

    // Check if subscription is active
    const isPremium = user.subscriptionStatus === 'premium'
      || user.subscriptionStatus === 'active';

    // Double-check with Stripe if they have a customer ID
    if (user.stripeCustomerId) {
      const stripeActive = await hasActiveSubscription(user.stripeCustomerId);

      // If Stripe says active but DB says free, update DB
      if (stripeActive && !isPremium) {
        await db
          .update(usersTable)
          .set({ subscriptionStatus: 'premium' })
          .where(eq(usersTable.id, user.id));
      }

      return NextResponse.json(
        {
          isPremium: stripeActive,
          status: stripeActive ? 'premium' : 'free',
          subscriptionTier: user.subscriptionTier,
          subscriptionEndDate: user.subscriptionEndDate,
          cancelAtPeriodEnd: user.subscriptionCancelAtPeriodEnd,
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        },
      );
    }

    return NextResponse.json(
      {
        isPremium,
        status: user.subscriptionStatus || 'free',
        subscriptionTier: user.subscriptionTier,
        subscriptionEndDate: user.subscriptionEndDate,
        cancelAtPeriodEnd: user.subscriptionCancelAtPeriodEnd,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      },
    );
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      },
    );
  }
}
