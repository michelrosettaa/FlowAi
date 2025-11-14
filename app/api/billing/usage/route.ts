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

    const usage = await storage.getCurrentUsage(session.user.id);
    const subscription = await storage.getUserSubscription(session.user.id);
    
    const plan = subscription?.plan || await storage.getPlanBySlug('free');
    
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 500 }
      );
    }

    const limits = plan.limits as Record<string, any>;
    
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    periodEnd.setDate(0);

    return NextResponse.json({
      usage,
      limits: {
        ai_messages: limits.ai_messages || 0,
        email_sends: limits.email_sends || 0,
      },
      periodEnd: periodEnd.toISOString(),
      plan: {
        name: plan.name,
        slug: plan.slug,
      },
    });
  } catch (error: any) {
    console.error('Get usage error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage', message: error.message },
      { status: 500 }
    );
  }
}
