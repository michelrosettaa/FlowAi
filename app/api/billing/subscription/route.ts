import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { storage } from '@/server/storage';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subscription = await storage.getUserSubscription(session.user.id);
    
    if (!subscription) {
      const freePlan = await storage.getPlanBySlug('free');
      return NextResponse.json({
        subscription: null,
        plan: freePlan,
        status: 'no_subscription',
      });
    }

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      },
      plan: subscription.plan,
    });
  } catch (error: any) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription', message: error.message },
      { status: 500 }
    );
  }
}
