import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendDailyReminderEmail, sendBulkDailyReminders } from "@/lib/email/campaigns";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sendDailyReminderEmail(session.user.id);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Reminder email sent!" });
  } catch (error: any) {
    console.error("Error sending reminder email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sent, failed } = await sendBulkDailyReminders();
    
    return NextResponse.json({ 
      success: true, 
      message: `Sent ${sent} reminder emails, ${failed} failed` 
    });
  } catch (error: any) {
    console.error("Error sending bulk reminder emails:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
