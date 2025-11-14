import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { tasks } = await req.json();

    if (!tasks || !tasks.trim()) {
      return NextResponse.json(
        { error: "Tasks are required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a productivity assistant. Create a time-blocked daily schedule from the user's tasks. 
Format your response as:
1. A detailed plan with specific times (9am-5pm work hours)
2. Include breaks and realistic time estimates
3. Prioritize important tasks for peak productivity hours

Return your response in this exact format:
PLAN:
[detailed schedule here]

TIMELINE:
- 9:00 AM | [task]
- 10:30 AM | [task]
etc.`
        },
        {
          role: "user",
          content: `Create a schedule for these tasks: ${tasks}`
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content || "";
    
    const parts = response.split("TIMELINE:");
    const plan = parts[0].replace("PLAN:", "").trim();
    const timelineText = parts[1] || "";
    
    const timeline = timelineText
      .split("\n")
      .filter(line => line.trim() && line.includes("|"))
      .map(line => {
        const [time, label] = line.split("|").map(s => s.trim().replace(/^-\s*/, ""));
        return { time, label };
      });

    return NextResponse.json({
      plan,
      timeline: timeline.length > 0 ? timeline : undefined,
    });
  } catch (err: any) {
    console.error("Plan generation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate plan" },
      { status: 500 }
    );
  }
}
