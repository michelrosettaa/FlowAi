import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const voiceMap: Record<string, string> = {
  coach: "alloy",
  calm: "verse",
  therapist: "sol",
  focus: "echo",
};

export async function POST(req: Request) {
  try {
    const { text, voice } = await req.json();
    const voiceId = voiceMap[voice] || "alloy";

    const chat = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are FlowAI, an AI mentor with a ${voice} personality. 
          Be concise, warm, and motivational in your feedback.`,
        },
        { role: "user", content: text },
      ],
    });

    const summary =
      chat.choices[0]?.message?.content ||
      "Keep going — you’re making amazing progress!";

    const speech = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voiceId,
      input: summary,
    });

    const audioBuffer = Buffer.from(await speech.arrayBuffer());
    const audioBase64 = audioBuffer.toString("base64");

    return NextResponse.json({ summary, audio: audioBase64 });
  } catch (error) {
    console.error("❌ Mentor API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate mentor voice." },
      { status: 500 }
    );
  }
}
