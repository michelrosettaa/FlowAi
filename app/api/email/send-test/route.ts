import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/email/resend";
import { welcomeEmailTemplate } from "@/lib/email/templates/welcome";
import { weeklyAnalyticsEmailTemplate } from "@/lib/email/templates/analytics";
import { dailyReminderEmailTemplate } from "@/lib/email/templates/reminder";
import { streakAlertEmailTemplate } from "@/lib/email/templates/notification";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type } = body;

    const userName = session.user.name || "there";
    let template: { subject: string; html: string };

    switch (type) {
      case "welcome":
        template = welcomeEmailTemplate({ userName, userEmail: session.user.email });
        break;
      case "analytics":
        template = weeklyAnalyticsEmailTemplate({
          userName,
          tasksCompleted: 12,
          focusHours: 18.5,
          productivityScore: 82,
          streak: 7,
          weekStartDate: "Nov 25",
          weekEndDate: "Dec 1",
          topAccomplishment: "Completed quarterly report ahead of schedule",
        });
        break;
      case "reminder":
        template = dailyReminderEmailTemplate({
          userName,
          tasksDue: 5,
          topTasks: ["Review project proposal", "Team sync meeting", "Update documentation"],
          focusGoal: 4,
          currentFocus: 2.5,
          motivationalMessage: "Focus on progress, not perfection.",
        });
        break;
      case "streak":
        template = streakAlertEmailTemplate({
          userName,
          streak: 7,
          lastActiveDate: "yesterday",
        });
        break;
      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
    }

    const result = await sendEmail({
      to: session.user.email,
      subject: `[TEST] ${template.subject}`,
      html: template.html,
      campaignType: type === "analytics" ? "analytics_weekly" : type === "reminder" ? "reminder_daily" : type === "streak" ? "streak_alert" : "welcome",
      userId: session.user.id,
      metadata: { isTest: true },
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Test ${type} email sent to ${session.user.email}!`,
      id: result.id,
    });
  } catch (error: any) {
    console.error("Error sending test email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
