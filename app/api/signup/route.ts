import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email;

    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Create a trial end date (7 days from now)
    const trialEnds = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    console.log("Trial started for:", email, "Ends:", trialEnds);

    return NextResponse.json({ ok: true, email, trialEnds });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
