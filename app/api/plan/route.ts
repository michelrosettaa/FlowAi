import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { context } = await req.json();

    // This is fake data for now – UI first.
    const planText = `Here's your focused plan:
1. Deep work block (09:00-11:00): Finish pitch deck
2. Reply to 3 priority emails
3. Prep talking points for 2PM meeting
4. Gym at 6PM — non-negotiable`;

    const priorities = [
      "Finish pitch deck for investor call",
      "Follow up with Sarah about contract",
      "Prep talking points for team sync @ 14:00",
    ];

    return NextResponse.json({
      planText,
      priorities,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate plan" },
      { status: 500 }
    );
  }
}
