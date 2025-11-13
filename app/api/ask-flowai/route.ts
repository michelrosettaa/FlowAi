import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are FlowAI, an intelligent productivity assistant integrated into a productivity platform. You help users with:
- Planning their day and managing tasks
- Understanding their schedule and calendar
- Email management and drafting
- Meeting summaries and action items
- Focus time and productivity insights

Be concise, helpful, and actionable. Provide specific suggestions when possible. Keep responses brief (2-3 sentences max unless asked for more detail).`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || "I'm not sure how to help with that.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Ask FlowAI error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to get AI response" },
      { status: 500 }
    );
  }
}
