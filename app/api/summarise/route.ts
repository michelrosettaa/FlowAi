// app/api/summarise/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Optional GET method to test if it's working
export async function GET() {
  return NextResponse.json({ ok: true, route: "summarise" });
}

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "No transcript provided. Send { transcript: string }." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY on the server." },
        { status: 500 }
      );
    }

    const prompt = `
You are FlowAI. Summarise the following call/message transcript and:
- Extract key action items
- Assign priority (High/Medium/Low)
- Suggest timeline
- Return in Markdown format.

Transcript:
${transcript}
`.trim();

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
    const summary = data?.choices?.[0]?.message?.content ?? "No summary generated.";
    return NextResponse.json({ summary });
  } catch (e: any) {
    return NextResponse.json(
      { error: `Server error: ${e?.message ?? "unknown"}` },
      { status: 500 }
    );
  }
}
export default function Home() {
  return (
    <>
      <Nav />   {/* 👈 Navbar renders here at the top of the page */}
      <main className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">FlowAI</h1>
        {/* ... rest of your planner UI ... */}
      </main>
    </>
  );
}
