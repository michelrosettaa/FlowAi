/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { emails } = await req.json();

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "No emails provided" }, { status: 400 });
    }

    // Ask AI to summarise and prioritize
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI email assistant. Summarise each email briefly and rate its priority as High, Medium, or Low.",
        },
        {
          role: "user",
          content: `Here are some emails:\n${emails
            .map(
              (e, i) => `Email ${i + 1}: From ${e.from} - Subject: ${e.subject}\nBody: ${e.body}`
            )
            .join("\n\n")}`,
        },
      ],
    });

    const summary = completion.choices[0]?.message?.content || "No summary.";
    return NextResponse.json({ summary });
  } catch (e: any) {
    console.error("Email summarization error:", e);
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 }
    );
  }
}
