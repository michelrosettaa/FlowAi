import { NextRequest, NextResponse } from "next/server";
import { auth, signIn } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
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
