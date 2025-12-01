import { db } from "@/lib/db/client";
import { users, tasks, calendarEvents } from "@/lib/db/schema";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { sendEmail, canSendEmail, CampaignType } from "./resend";
import {
  welcomeEmailTemplate,
  weeklyAnalyticsEmailTemplate,
  dailyReminderEmailTemplate,
  weeklyReminderEmailTemplate,
  streakAlertEmailTemplate,
  taskReminderEmailTemplate,
} from "./templates";

export async function sendWelcomeEmail(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.email) {
      return { success: false, error: "User not found or no email" };
    }

    const canSend = await canSendEmail(userId, "welcome");
    if (!canSend) {
      return { success: false, error: "User has opted out of welcome emails" };
    }

    const { subject, html } = welcomeEmailTemplate({
      userName: user.name || user.firstName || "there",
      userEmail: user.email,
    });

    return await sendEmail({
      to: user.email,
      subject,
      html,
      campaignType: "welcome",
      userId,
    });
  } catch (err: any) {
    console.error("Failed to send welcome email:", err);
    return { success: false, error: err.message };
  }
}

export async function sendWeeklyAnalyticsEmail(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.email) {
      return { success: false, error: "User not found or no email" };
    }

    const canSend = await canSendEmail(userId, "analytics_weekly");
    if (!canSend) {
      return { success: false, error: "User has opted out of analytics emails" };
    }

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const completedTasks = await db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
      .where(
        and(
          eq(tasks.userId, userId),
          eq(tasks.completed, true),
          gte(tasks.updatedAt, weekStart)
        )
      );

    const events = await db
      .select()
      .from(calendarEvents)
      .where(
        and(
          eq(calendarEvents.userId, userId),
          gte(calendarEvents.startDate, weekStart),
          lte(calendarEvents.startDate, now)
        )
      );

    const focusHours = events.reduce((total, event) => {
      const duration = (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60);
      return total + duration;
    }, 0);

    const tasksCount = Number(completedTasks[0]?.count) || 0;
    const productivityScore = Math.min(100, Math.round((tasksCount * 5) + (focusHours * 3)));

    const { subject, html } = weeklyAnalyticsEmailTemplate({
      userName: user.name || user.firstName || "there",
      tasksCompleted: tasksCount,
      focusHours,
      productivityScore,
      streak: 0,
      weekStartDate: weekStart.toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
      weekEndDate: now.toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
    });

    return await sendEmail({
      to: user.email,
      subject,
      html,
      campaignType: "analytics_weekly",
      userId,
    });
  } catch (err: any) {
    console.error("Failed to send weekly analytics email:", err);
    return { success: false, error: err.message };
  }
}

export async function sendDailyReminderEmail(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.email) {
      return { success: false, error: "User not found or no email" };
    }

    const canSend = await canSendEmail(userId, "reminder_daily");
    if (!canSend) {
      return { success: false, error: "User has opted out of daily reminders" };
    }

    const pendingTasks = await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.userId, userId),
          eq(tasks.completed, false)
        )
      )
      .orderBy(desc(tasks.createdAt))
      .limit(5);

    const motivationalMessages = [
      "Small progress is still progress. Every step counts!",
      "Focus on progress, not perfection.",
      "You're capable of amazing things. Let's prove it today.",
      "Consistency beats intensity. Show up and do the work.",
      "Today's effort is tomorrow's result.",
    ];

    const { subject, html } = dailyReminderEmailTemplate({
      userName: user.name || user.firstName || "there",
      tasksDue: pendingTasks.length,
      topTasks: pendingTasks.map(t => t.title),
      focusGoal: 4,
      currentFocus: 0,
      motivationalMessage: motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)],
    });

    return await sendEmail({
      to: user.email,
      subject,
      html,
      campaignType: "reminder_daily",
      userId,
    });
  } catch (err: any) {
    console.error("Failed to send daily reminder email:", err);
    return { success: false, error: err.message };
  }
}

export async function sendStreakAlertEmail(
  userId: string, 
  streak: number, 
  lastActiveDate: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.email) {
      return { success: false, error: "User not found or no email" };
    }

    const canSend = await canSendEmail(userId, "streak_alert");
    if (!canSend) {
      return { success: false, error: "User has opted out of streak alerts" };
    }

    const { subject, html } = streakAlertEmailTemplate({
      userName: user.name || user.firstName || "there",
      streak,
      lastActiveDate,
    });

    return await sendEmail({
      to: user.email,
      subject,
      html,
      campaignType: "streak_alert",
      userId,
    });
  } catch (err: any) {
    console.error("Failed to send streak alert email:", err);
    return { success: false, error: err.message };
  }
}

export async function sendTaskReminderEmail(
  userId: string,
  taskId: string,
  taskTitle: string,
  dueTime?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.email) {
      return { success: false, error: "User not found or no email" };
    }

    const canSend = await canSendEmail(userId, "task_reminder");
    if (!canSend) {
      return { success: false, error: "User has opted out of task reminders" };
    }

    const { subject, html } = taskReminderEmailTemplate({
      userName: user.name || user.firstName || "there",
      taskTitle,
      dueTime,
      taskId,
    });

    return await sendEmail({
      to: user.email,
      subject,
      html,
      campaignType: "task_reminder",
      userId,
      metadata: { taskId },
    });
  } catch (err: any) {
    console.error("Failed to send task reminder email:", err);
    return { success: false, error: err.message };
  }
}

export async function sendBulkWeeklyAnalytics(): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  try {
    const allUsers = await db.select().from(users).where(sql`${users.email} IS NOT NULL`);

    for (const user of allUsers) {
      const result = await sendWeeklyAnalyticsEmail(user.id);
      if (result.success) {
        sent++;
      } else {
        failed++;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (err) {
    console.error("Failed to send bulk weekly analytics:", err);
  }

  return { sent, failed };
}

export async function sendBulkDailyReminders(): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  try {
    const allUsers = await db.select().from(users).where(sql`${users.email} IS NOT NULL`);

    for (const user of allUsers) {
      const result = await sendDailyReminderEmail(user.id);
      if (result.success) {
        sent++;
      } else {
        failed++;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (err) {
    console.error("Failed to send bulk daily reminders:", err);
  }

  return { sent, failed };
}
