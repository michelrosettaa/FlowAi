import { NextRequest, NextResponse } from "next/server";
import { auth, signIn } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { sendWelcomeEmail } from "@/lib/email/campaigns";

export async function POST(request: NextRequest) {
  try {
    // Debug: Log all cookies
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    console.log("[ONBOARDING API] Cookies received:", allCookies.map(c => c.name));
    console.log("[ONBOARDING API] Request headers:", Object.fromEntries(request.headers.entries()));
    
    const session = await auth();
    console.log("[ONBOARDING API] Session:", session ? `User: ${session.user?.id}` : "NO SESSION");
    
    if (!session?.user?.id) {
      console.log("[ONBOARDING API] Returning 401 - no session or user id");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { answers } = body;

    // Use direct SQL connection
    const sql = neon(process.env.DATABASE_URL!);
    
    // Update user's onboarding status
    await sql`
      UPDATE users 
      SET 
        onboarding_completed = true,
        onboarding_data = ${JSON.stringify(answers)}
      WHERE id = ${session.user.id}
    `;

    console.log(`[ONBOARDING API] Saved onboarding for user ${session.user.id}`);

    // Send welcome email (async, don't wait for it)
    sendWelcomeEmail(session.user.id).catch(err => {
      console.error("[ONBOARDING API] Failed to send welcome email:", err);
    });

    // Return the redirect URL for the client to use
    return NextResponse.json({ 
      success: true,
      message: "Onboarding completed successfully",
      redirectTo: "/app"
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}
