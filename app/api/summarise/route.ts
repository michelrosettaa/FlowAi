import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  return NextResponse.json({ ok: true, route: "summarise" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const notes = body.notes || body.tasksText || "";

    if (!notes.trim()) {
      return NextResponse.json({ error: "Missing notes" }, { status: 400 });
    }

    // 🧠 Ask OpenAI to generate a structured daily plan
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI productivity assistant. Turn tasks into a clear, practical daily plan with times and priorities.",
        },
        {
          role: "user",
          content: `Tasks: ${notes}`,
        },
      ],
    });

    const aiPlan = completion.choices[0]?.message?.content || "No plan generated.";

    return NextResponse.json({ plan: aiPlan });
  } catch (e: any) {
    console.error("Error in /api/summarise:", e);
    return NextResponse.json(
      { error: e.message || String(e) },
      { status: 500 }
    );
  }
}
