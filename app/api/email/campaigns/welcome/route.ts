import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email/campaigns";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sendWelcomeEmail(session.user.id);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Welcome email sent!" });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
