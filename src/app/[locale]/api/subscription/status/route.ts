import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { usersTable } from '@/models/Schema';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { isPremium: false, subscriptionTier: 'free' },
        { status: 200 },
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
        { isPremium: false, subscriptionTier: 'free' },
        { status: 200 },
      );
    }

    const isPremium = user.subscriptionStatus === 'active'
      && user.subscriptionTier !== 'free';

    return NextResponse.json({
      isPremium,
      subscriptionTier: user.subscriptionTier,
      status: user.subscriptionStatus,
      currentPeriodEnd: user.subscriptionEndDate,
      cancelAtPeriodEnd: user.subscriptionCancelAtPeriodEnd,
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 },
    );
  }
}
