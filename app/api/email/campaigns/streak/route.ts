import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/server/db';
import { users, userStreaks, emailPreferences, emailDeliveryLog } from '@/lib/db/schema';
import { eq, and, lt, sql } from 'drizzle-orm';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function isAdmin(userId: string): Promise<boolean> {
  const [user] = await db
    .select({ isAdmin: users.isAdmin })
    .from(users)
    .where(eq(users.id, userId));
  return user?.isAdmin || false;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await isAdmin(session.user.id))) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    if (!resend) {
      return NextResponse.json({ error: 'Resend not configured' }, { status: 500 });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const usersWithBreakingStreaks = await db
      .select({
        userId: userStreaks.userId,
        currentStreak: userStreaks.currentStreak,
        lastActiveDate: userStreaks.lastActiveDate,
        email: users.email,
        name: users.name,
      })
      .from(userStreaks)
      .innerJoin(users, eq(users.id, userStreaks.userId))
      .leftJoin(emailPreferences, eq(emailPreferences.userId, userStreaks.userId))
      .where(
        and(
          lt(userStreaks.lastActiveDate, yesterday),
          sql`${userStreaks.currentStreak} >= 3`,
          sql`COALESCE(${emailPreferences.streakAlerts}, true) = true`
        )
      );

    let sentCount = 0;
    let failedCount = 0;

    for (const user of usersWithBreakingStreaks) {
      if (!user.email) continue;

      try {
        const result = await resend.emails.send({
          from: 'Refraim AI <hello@refraimai.com>',
          to: user.email,
          subject: `Don't lose your ${user.currentStreak}-day streak!`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">Your Streak is at Risk!</h1>
                </div>
                <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                    Hi ${user.name || 'there'},
                  </p>
                  <div style="background: #fef3c7; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0;">
                    <div style="font-size: 48px; font-weight: bold; color: #f59e0b;">${user.currentStreak}</div>
                    <div style="color: #92400e; font-weight: 600;">day streak at risk</div>
                  </div>
                  <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                    You've built an amazing ${user.currentStreak}-day streak! Don't let it slip away. 
                    Log in today to keep your momentum going.
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXTAUTH_URL}/app" style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                      Continue Your Streak
                    </a>
                  </div>
                  <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                    Keep up the great work!<br>
                    The Refraim AI Team
                  </p>
                </div>
                <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                  <p>Refraim AI - Your AI Productivity Partner</p>
                  <p><a href="${process.env.NEXTAUTH_URL}/app/settings/notifications" style="color: #9ca3af;">Manage notification preferences</a></p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        await db.insert(emailDeliveryLog).values({
          userId: user.userId,
          campaignType: 'streak_alert',
          recipientEmail: user.email,
          subject: `Don't lose your ${user.currentStreak}-day streak!`,
          resendId: result.data?.id,
          status: 'sent',
        });

        sentCount++;
      } catch (error: any) {
        await db.insert(emailDeliveryLog).values({
          userId: user.userId,
          campaignType: 'streak_alert',
          recipientEmail: user.email,
          subject: `Don't lose your ${user.currentStreak}-day streak!`,
          status: 'failed',
          errorMessage: error.message,
        });

        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      failed: failedCount,
      total: usersWithBreakingStreaks.length,
    });
  } catch (error: any) {
    console.error('Streak email campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to send streak emails', message: error.message },
      { status: 500 }
    );
  }
}
