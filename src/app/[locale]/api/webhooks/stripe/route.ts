import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { NextRequest } from 'next/server';
import type Stripe from 'stripe';
import type * as schema from '@/models/Schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/libs/stripe/server';
import { subscriptionsTable, usersTable } from '@/models/Schema';
import { createDbConnection } from '@/utils/DBConnection';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 },
    );
  }

  const db = createDbConnection();

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(db, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(db, subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.warn(`[webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[webhook] Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 },
    );
  }
}

/**
 * Finds or creates a user from a Stripe customer ID.
 * Tries multiple lookup strategies:
 * 1. Find by stripeCustomerId
 * 2. Find by clerkUserId from customer metadata
 * 3. Create new user if not found
 */
async function findOrCreateUserFromStripeCustomer(
  db: NodePgDatabase<typeof schema>,
  customerId: string,
): Promise<typeof usersTable.$inferSelect | null> {
  // First, try to find user by Stripe customer ID
  let [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.stripeCustomerId, customerId))
    .limit(1);

  if (user) {
    return user;
  }

  // If not found, retrieve Stripe customer to get metadata
  let customer: Stripe.Customer | Stripe.DeletedCustomer;
  try {
    customer = await stripe.customers.retrieve(customerId);
    if (typeof customer === 'string' || customer.deleted) {
      console.error('[webhook] Customer not found or deleted:', customerId);
      return null;
    }
  } catch (error) {
    console.error('[webhook] Error retrieving Stripe customer:', customerId, error);
    return null;
  }

  // At this point, customer is confirmed to be a Customer (not DeletedCustomer)
  // TypeScript needs explicit narrowing
  if (customer.deleted) {
    console.error('[webhook] Customer is deleted:', customerId);
    return null;
  }

  // Get clerkId from customer metadata
  const clerkId = customer.metadata?.clerkId;
  if (!clerkId) {
    console.warn('[webhook] No clerkId in customer metadata for:', customerId);
    // Still try to create user with email if available
    if (customer.email) {
      try {
        const [newUser] = await db
          .insert(usersTable)
          .values({
            clerkUserId: `stripe_${customerId}`, // Fallback ID if no clerkId
            email: customer.email,
            stripeCustomerId: customerId,
          })
          .returning();
        console.warn('[webhook] Created user without clerkId for customer:', customerId);
        return newUser ?? null;
      } catch (error) {
        console.error('[webhook] Error creating user without clerkId:', error);
        return null;
      }
    }
    return null;
  }

  // Try to find user by clerkUserId
  [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkUserId, clerkId))
    .limit(1);

  if (user) {
    // Update user with stripeCustomerId if not set
    if (!user.stripeCustomerId) {
      await db
        .update(usersTable)
        .set({ stripeCustomerId: customerId })
        .where(eq(usersTable.id, user.id));
      user.stripeCustomerId = customerId;
    }
    return user;
  }

  // User doesn't exist, create it
  try {
    const [newUser] = await db
      .insert(usersTable)
      .values({
        clerkUserId: clerkId,
        email: customer.email || '',
        stripeCustomerId: customerId,
      })
      .returning();
    console.warn('[webhook] Created new user from Stripe customer:', customerId, 'clerkId:', clerkId);
    return newUser ?? null;
  } catch (error) {
    console.error('[webhook] Error creating user from Stripe customer:', error);
    return null;
  }
}

async function handleSubscriptionUpdate(
  db: NodePgDatabase<typeof schema>,
  subscription: Stripe.Subscription,
) {
  const customerId = subscription.customer as string;
  const metadata = subscription.metadata;

  // Access Stripe properties using bracket notation for compatibility
  const currentPeriodStart = (subscription as any).current_period_start;
  const currentPeriodEnd = (subscription as any).current_period_end;
  const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end;

  // Find or create user from Stripe customer
  const user = await findOrCreateUserFromStripeCustomer(db, customerId);

  if (!user) {
    console.error('[webhook] Could not find or create user for customer:', customerId);
    return;
  }

  // Update user subscription status
  await db
    .update(usersTable)
    .set({
      subscriptionStatus: subscription.status === 'active' ? 'premium' : 'free',
      subscriptionTier: metadata.planType || 'monthly',
      stripeSubscriptionId: subscription.id,
      subscriptionStartDate: new Date(currentPeriodStart * 1000),
      subscriptionEndDate: new Date(currentPeriodEnd * 1000),
      subscriptionCancelAtPeriodEnd: cancelAtPeriodEnd,
    })
    .where(eq(usersTable.id, user.id));

  // Upsert subscription record
  await db
    .insert(subscriptionsTable)
    .values({
      userId: user.id,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      stripePriceId: subscription.items.data[0]?.price.id,
      planType: metadata.planType || 'monthly',
      status: subscription.status,
      currentPeriodStart: new Date(currentPeriodStart * 1000),
      currentPeriodEnd: new Date(currentPeriodEnd * 1000),
      cancelAtPeriodEnd,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: subscriptionsTable.stripeSubscriptionId,
      set: {
        status: subscription.status,
        currentPeriodStart: new Date(currentPeriodStart * 1000),
        currentPeriodEnd: new Date(currentPeriodEnd * 1000),
        cancelAtPeriodEnd,
        updatedAt: new Date(),
      },
    });

  console.warn(`[webhook] Subscription updated for user ${user.id}: ${subscription.status}`);
}

async function handleSubscriptionCanceled(
  db: NodePgDatabase<typeof schema>,
  subscription: Stripe.Subscription,
) {
  const customerId = subscription.customer as string;

  // Find or create user from Stripe customer
  const user = await findOrCreateUserFromStripeCustomer(db, customerId);

  if (!user) {
    console.error('[webhook] Could not find or create user for canceled subscription customer:', customerId);
    return;
  }

  await db
    .update(usersTable)
    .set({
      subscriptionStatus: 'free',
      subscriptionTier: 'free',
    })
    .where(eq(usersTable.id, user.id));

  await db
    .update(subscriptionsTable)
    .set({
      status: 'canceled',
      updatedAt: new Date(),
    })
    .where(eq(subscriptionsTable.stripeSubscriptionId, subscription.id));

  console.warn(`[webhook] Subscription canceled for user ${user.id}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.warn(`Payment succeeded for invoice: ${invoice.id}`);
  // Optional: Send success email, update analytics, etc.
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.warn(`Payment failed for invoice: ${invoice.id}`);
  // Optional: Send payment failure email
}
