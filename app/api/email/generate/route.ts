import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { recipient, subject = "", context = "" } = await req.json();

    if (!recipient || !context) {
      return NextResponse.json(
        { error: "Missing recipient or context" },
        { status: 400 }
      );
    }

    const prompt = `Write a short, polite email to ${recipient}.
Subject: ${subject || "(create a natural subject)"}.
Context: ${context}.
Keep it warm, professional, and include clear next steps.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write friendly, professional business emails. Be concise, human, and polite.",
        },
        { role: "user", content: prompt },
      ],
    });

    const emailText =
      completion.choices?.[0]?.message?.content || "No email generated.";

    return NextResponse.json({ email: emailText });
  } catch (err: any) {
    console.error("Email API error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
