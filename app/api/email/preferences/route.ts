import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserEmailPreferences, updateEmailPreferences } from "@/lib/email/resend";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await getUserEmailPreferences(session.user.id);
    
    return NextResponse.json(preferences);
  } catch (error: any) {
    console.error("Error getting email preferences:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      welcomeEmail,
      dailyReminders,
      weeklyReminders,
      weeklyAnalytics,
      taskReminders,
      streakAlerts,
      marketingEmails,
    } = body;

    const updated = await updateEmailPreferences(session.user.id, {
      welcomeEmail,
      dailyReminders,
      weeklyReminders,
      weeklyAnalytics,
      taskReminders,
      streakAlerts,
      marketingEmails,
    });
    
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating email preferences:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
