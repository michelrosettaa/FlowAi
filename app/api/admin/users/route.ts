import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/server/db';
import { users, userSubscriptions, subscriptionPlans } from '@/lib/db/schema';
import { eq, desc, like, or, count, sql } from 'drizzle-orm';

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

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const search = url.searchParams.get('search') || '';
    const planFilter = url.searchParams.get('plan') || '';
    const statusFilter = url.searchParams.get('status') || '';

    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        isAdmin: users.isAdmin,
        createdAt: users.createdAt,
        lastActiveAt: users.lastActiveAt,
        onboardingCompleted: users.onboardingCompleted,
        subscriptionStatus: userSubscriptions.status,
        planSlug: subscriptionPlans.slug,
        planName: subscriptionPlans.name,
        currentPeriodEnd: userSubscriptions.currentPeriodEnd,
        trialEndsAt: userSubscriptions.trialEndsAt,
      })
      .from(users)
      .leftJoin(userSubscriptions, eq(userSubscriptions.userId, users.id))
      .leftJoin(subscriptionPlans, eq(subscriptionPlans.id, userSubscriptions.planId))
      .orderBy(desc(users.createdAt));

    let filteredUsers = allUsers;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (u) =>
          u.email?.toLowerCase().includes(searchLower) ||
          u.name?.toLowerCase().includes(searchLower)
      );
    }

    if (planFilter) {
      filteredUsers = filteredUsers.filter((u) => u.planSlug === planFilter);
    }

    if (statusFilter) {
      filteredUsers = filteredUsers.filter((u) => u.subscriptionStatus === statusFilter);
    }

    const total = filteredUsers.length;
    const offset = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    return NextResponse.json({
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await isAdmin(session.user.id))) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { userId, updates } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const allowedUpdates = ['isAdmin'];
    const safeUpdates: Record<string, any> = {};
    
    for (const key of Object.keys(updates)) {
      if (allowedUpdates.includes(key)) {
        safeUpdates[key] = updates[key];
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 });
    }

    const [updatedUser] = await db
      .update(users)
      .set({ ...safeUpdates, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    console.error('Admin update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user', message: error.message },
      { status: 500 }
    );
  }
}
