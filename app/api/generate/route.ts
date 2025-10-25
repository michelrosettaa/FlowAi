import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, route: "generate" });
}

export async function POST(req: Request) {
  try {
    const { tasksText } = await req.json();

    if (!tasksText || typeof tasksText !== "string") {
      return NextResponse.json(
        { error: "No tasks provided. Send { tasksText: string }." },
        { status: 400 }
      );
    }

    // Build a simple prompt (later you can make it more complex)
    const prompt = `You are FlowAI. Create a clean, structured daily plan for the following tasks: ${tasksText}`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 500,
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      return NextResponse.json(
        { error: `OpenAI error ${r.status}: ${errText}` },
        { status: 502 }
      );
    }

    const data = await r.json();
    const plan = data?.choices?.[0]?.message?.content ?? "No plan generated.";

    return NextResponse.json({ plan });
  } catch (e: any) {
    return NextResponse.json(
      { error: `Server error: ${e?.message ?? "unknown"}` },
      { status: 500 }
    );
  }
}
