import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { tasks } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are FlowAI — a friendly AI productivity assistant that creates structured day plans from messy to-do lists. Output short time-blocked schedules.",
        },
        {
          role: "user",
          content: `Turn this list into a time-blocked daily schedule with 5–6 tasks, including realistic breaks:\n\n${tasks}`,
        },
      ],
    });

    const plan = completion.choices[0].message?.content || "No plan generated.";

    // Extract timeline-like summary (optional)
    const timeline = [
      { time: "09:00", label: "Deep work block" },
      { time: "10:30", label: "Email follow-ups" },
      { time: "12:00", label: "Lunch / recharge" },
      { time: "14:00", label: "Meeting / calls" },
      { time: "16:00", label: "Creative / focus work" },
    ];

    return NextResponse.json({ plan, timeline });
  } catch (err) {
    console.error("AI planning error:", err);
    return NextResponse.json({ error: "AI planning failed" }, { status: 500 });
  }
}
