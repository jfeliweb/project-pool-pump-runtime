import type { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { stripe } from '@/libs/stripe/server';
import { usersTable } from '@/models/Schema';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 },
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    // Check if session is complete
    if (session.status !== 'complete' || session.payment_status !== 'paid') {
      return NextResponse.json({
        isPremium: false,
        status: 'free',
        sessionComplete: false,
      });
    }

    // Get the subscription from the session
    const subscriptionId = typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id;

    if (!subscriptionId) {
      return NextResponse.json({
        isPremium: false,
        status: 'free',
        sessionComplete: true,
        subscriptionFound: false,
      });
    }

    // Retrieve the subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Get the customer ID
    const customerId = typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer?.id;

    if (!customerId) {
      return NextResponse.json({
        isPremium: false,
        status: 'free',
        sessionComplete: true,
        subscriptionFound: true,
      });
    }

    // First, try to find user by Stripe customer ID (more reliable)
    let users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.stripeCustomerId, customerId))
      .limit(1);

    let user = users[0];

    // If not found by customer ID, try by Clerk user ID
    if (!user) {
      users = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.clerkUserId, userId))
        .limit(1);
      user = users[0];
    }

    // If still not found, try to get user info from session metadata or create user
    if (!user) {
      // Try to get email from session customer
      let userEmail: string | undefined;
      try {
        const customer = await stripe.customers.retrieve(customerId);
        if (typeof customer !== 'string' && !customer.deleted) {
          userEmail = customer.email || undefined;
        }
      } catch (error) {
        console.error('[verify-session] Error retrieving customer:', error);
      }

      // Get current user from Clerk to create user record
      const { currentUser } = await import('@clerk/nextjs/server');
      const clerkUser = await currentUser();

      if (clerkUser) {
        // Create user record
        const [newUser] = await db
          .insert(usersTable)
          .values({
            clerkUserId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || userEmail || '',
            stripeCustomerId: customerId,
          })
          .returning();

        user = newUser;
      } else {
        return NextResponse.json({
          isPremium: false,
          status: 'free',
          sessionComplete: true,
          userFound: false,
          error: 'User not found and cannot be created',
        });
      }
    }

    // Ensure user exists (should always be true at this point)
    if (!user) {
      return NextResponse.json({
        isPremium: false,
        status: 'free',
        sessionComplete: true,
        userFound: false,
        error: 'User not found',
      });
    }

    // Update user with customer ID if not set
    if (!user.stripeCustomerId) {
      await db
        .update(usersTable)
        .set({ stripeCustomerId: customerId })
        .where(eq(usersTable.id, user.id));
    }

    // Check if subscription is active
    const isActive = subscription.status === 'active' || subscription.status === 'trialing';

    if (isActive) {
      // Update user subscription status
      // Access Stripe properties using type assertion for compatibility
      const currentPeriodStart = (subscription as any).current_period_start
        ? new Date((subscription as any).current_period_start * 1000)
        : null;
      const currentPeriodEnd = (subscription as any).current_period_end
        ? new Date((subscription as any).current_period_end * 1000)
        : null;

      await db
        .update(usersTable)
        .set({
          subscriptionStatus: 'premium',
          stripeSubscriptionId: subscription.id,
          subscriptionStartDate: currentPeriodStart,
          subscriptionEndDate: currentPeriodEnd,
          subscriptionCancelAtPeriodEnd: (subscription as any).cancel_at_period_end || false,
          subscriptionTier: subscription.metadata?.planType || 'monthly',
        })
        .where(eq(usersTable.id, user.id));

      return NextResponse.json({
        isPremium: true,
        status: 'premium',
        sessionComplete: true,
        subscriptionActive: true,
      });
    }

    return NextResponse.json({
      isPremium: false,
      status: 'free',
      sessionComplete: true,
      subscriptionActive: false,
      subscriptionStatus: subscription.status,
    });
  } catch (error) {
    console.error('[verify-session] Error verifying session:', error);
    return NextResponse.json(
      { error: 'Failed to verify session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
