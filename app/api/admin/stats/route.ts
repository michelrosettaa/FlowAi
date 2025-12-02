import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/server/db';
import { users, userSubscriptions, subscriptionPlans, usageRecords } from '@/lib/db/schema';
import { eq, count, sql, and, gte, desc } from 'drizzle-orm';

async function isAdmin(userId: string): Promise<boolean> {
  const [user] = await db
    .select({ isAdmin: users.isAdmin })
    .from(users)
    .where(eq(users.id, userId));
  return user?.isAdmin || false;
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await isAdmin(session.user.id))) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalUsersResult] = await db
      .select({ count: count() })
      .from(users);

    const [activeUsersResult] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.lastActiveAt, thirtyDaysAgo));

    const [newUsersResult] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo));

    const subscriptionStats = await db
      .select({
        planSlug: subscriptionPlans.slug,
        planName: subscriptionPlans.name,
        status: userSubscriptions.status,
        count: count(),
      })
      .from(userSubscriptions)
      .innerJoin(subscriptionPlans, eq(subscriptionPlans.id, userSubscriptions.planId))
      .groupBy(subscriptionPlans.slug, subscriptionPlans.name, userSubscriptions.status);

    const planBreakdown: Record<string, { total: number; active: number; trialing: number; cancelled: number }> = {};
    let totalRevenue = 0;
    let activeTrials = 0;
    let paidUsers = 0;

    const plans = await db.select().from(subscriptionPlans);
    const planPrices: Record<string, number> = {};
    plans.forEach(p => {
      planPrices[p.slug] = p.priceMonthly / 100;
    });

    for (const stat of subscriptionStats) {
      if (!planBreakdown[stat.planSlug]) {
        planBreakdown[stat.planSlug] = { total: 0, active: 0, trialing: 0, cancelled: 0 };
      }
      planBreakdown[stat.planSlug].total += stat.count;
      
      if (stat.status === 'active') {
        planBreakdown[stat.planSlug].active += stat.count;
        if (stat.planSlug !== 'free') {
          paidUsers += stat.count;
          totalRevenue += stat.count * (planPrices[stat.planSlug] || 0);
        }
      } else if (stat.status === 'trialing') {
        planBreakdown[stat.planSlug].trialing += stat.count;
        activeTrials += stat.count;
      } else if (stat.status === 'cancelled') {
        planBreakdown[stat.planSlug].cancelled += stat.count;
      }
    }

    const recentUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
        lastActiveAt: users.lastActiveAt,
        onboardingCompleted: users.onboardingCompleted,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(50);

    const usersWithPlans = await Promise.all(
      recentUsers.map(async (user) => {
        const [subscription] = await db
          .select({
            status: userSubscriptions.status,
            planSlug: subscriptionPlans.slug,
            planName: subscriptionPlans.name,
            currentPeriodEnd: userSubscriptions.currentPeriodEnd,
            trialEndsAt: userSubscriptions.trialEndsAt,
          })
          .from(userSubscriptions)
          .innerJoin(subscriptionPlans, eq(subscriptionPlans.id, userSubscriptions.planId))
          .where(eq(userSubscriptions.userId, user.id));

        return {
          ...user,
          subscription: subscription || { status: 'none', planSlug: 'free', planName: 'Free' },
        };
      })
    );

    const upcomingRenewals = await db
      .select({
        userId: userSubscriptions.userId,
        userEmail: users.email,
        userName: users.name,
        planName: subscriptionPlans.name,
        currentPeriodEnd: userSubscriptions.currentPeriodEnd,
        status: userSubscriptions.status,
      })
      .from(userSubscriptions)
      .innerJoin(users, eq(users.id, userSubscriptions.userId))
      .innerJoin(subscriptionPlans, eq(subscriptionPlans.id, userSubscriptions.planId))
      .where(
        and(
          eq(userSubscriptions.status, 'active'),
          gte(userSubscriptions.currentPeriodEnd, new Date())
        )
      )
      .orderBy(userSubscriptions.currentPeriodEnd)
      .limit(20);

    return NextResponse.json({
      overview: {
        totalUsers: totalUsersResult?.count || 0,
        activeUsers: activeUsersResult?.count || 0,
        newUsersLast30Days: newUsersResult?.count || 0,
        paidUsers,
        activeTrials,
        monthlyRecurringRevenue: totalRevenue,
      },
      planBreakdown,
      recentUsers: usersWithPlans,
      upcomingRenewals,
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats', message: error.message },
      { status: 500 }
    );
  }
}
