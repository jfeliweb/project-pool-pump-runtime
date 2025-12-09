import type { NextRequest } from 'next/server';
import type Stripe from 'stripe';
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
        console.warn(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 },
    );
  }
}

async function handleSubscriptionUpdate(db: any, subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const metadata = subscription.metadata;

  // Access Stripe properties using bracket notation for compatibility
  const currentPeriodStart = (subscription as any).current_period_start;
  const currentPeriodEnd = (subscription as any).current_period_end;
  const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end;

  // Find user by Stripe customer ID
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.stripeCustomerId, customerId))
    .limit(1);

  if (!user) {
    console.error('User not found for customer:', customerId);
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

  console.warn(`Subscription updated for user ${user.id}: ${subscription.status}`);
}

async function handleSubscriptionCanceled(db: any, subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.stripeCustomerId, customerId))
    .limit(1);

  if (!user) {
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

  console.warn(`Subscription canceled for user ${user.id}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.warn(`Payment succeeded for invoice: ${invoice.id}`);
  // Optional: Send success email, update analytics, etc.
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.warn(`Payment failed for invoice: ${invoice.id}`);
  // Optional: Send payment failure email
}
