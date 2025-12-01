import { Resend } from "resend";
import { db } from "@/lib/db/client";
import { emailDeliveryLog, emailPreferences, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Refraim AI <hello@refraimai.com>";
const FROM_EMAIL_NOTIFICATIONS = "Refraim AI <notifications@refraimai.com>";

export type CampaignType = 
  | "welcome" 
  | "reminder_daily" 
  | "reminder_weekly" 
  | "analytics_weekly" 
  | "notification" 
  | "streak_alert" 
  | "task_reminder";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  campaignType: CampaignType;
  userId: string;
  metadata?: Record<string, any>;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  campaignType,
  userId,
  metadata = {},
}: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const fromEmail = campaignType === "notification" || campaignType === "task_reminder" 
      ? FROM_EMAIL_NOTIFICATIONS 
      : FROM_EMAIL;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject,
      html,
      text: text || stripHtml(html),
    });

    if (error) {
      await db.insert(emailDeliveryLog).values({
        userId,
        campaignType,
        recipientEmail: to,
        subject,
        status: "failed",
        errorMessage: error.message,
        metadata,
      });
      return { success: false, error: error.message };
    }

    await db.insert(emailDeliveryLog).values({
      userId,
      campaignType,
      recipientEmail: to,
      subject,
      resendId: data?.id,
      status: "sent",
      metadata,
    });

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error("Failed to send email:", err);
    
    await db.insert(emailDeliveryLog).values({
      userId,
      campaignType,
      recipientEmail: to,
      subject,
      status: "failed",
      errorMessage: err.message || "Unknown error",
      metadata,
    });

    return { success: false, error: err.message };
  }
}

export async function getUserEmailPreferences(userId: string) {
  const prefs = await db.query.emailPreferences.findFirst({
    where: eq(emailPreferences.userId, userId),
  });
  
  if (!prefs) {
    const [newPrefs] = await db.insert(emailPreferences).values({ userId }).returning();
    return newPrefs;
  }
  
  return prefs;
}

export async function updateEmailPreferences(
  userId: string, 
  updates: Partial<{
    welcomeEmail: boolean;
    dailyReminders: boolean;
    weeklyReminders: boolean;
    weeklyAnalytics: boolean;
    taskReminders: boolean;
    streakAlerts: boolean;
    marketingEmails: boolean;
  }>
) {
  const existing = await db.query.emailPreferences.findFirst({
    where: eq(emailPreferences.userId, userId),
  });

  if (existing) {
    const [updated] = await db
      .update(emailPreferences)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(emailPreferences.userId, userId))
      .returning();
    return updated;
  } else {
    const [created] = await db
      .insert(emailPreferences)
      .values({ userId, ...updates })
      .returning();
    return created;
  }
}

export async function canSendEmail(userId: string, campaignType: CampaignType): Promise<boolean> {
  const prefs = await getUserEmailPreferences(userId);
  
  if (prefs.unsubscribedAt) return false;
  
  switch (campaignType) {
    case "welcome":
      return prefs.welcomeEmail;
    case "reminder_daily":
      return prefs.dailyReminders;
    case "reminder_weekly":
      return prefs.weeklyReminders;
    case "analytics_weekly":
      return prefs.weeklyAnalytics;
    case "task_reminder":
      return prefs.taskReminders;
    case "streak_alert":
      return prefs.streakAlerts;
    case "notification":
      return true;
    default:
      return true;
  }
}

function stripHtml(html: string): string {
  let text = html;
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<[^>]+>/g, "");
  text = text.replace(/\s+/g, " ");
  return text.trim();
}

export { resend };
