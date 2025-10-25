// app/api/summarise/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, route: "summarise" });
}

export async function POST(req: Request) {
  try {
    const { notes = "" } = (await req.json().catch(() => ({}))) as {
      notes?: string;
    };

    if (!notes.trim()) {
      return NextResponse.json(
        { error: "Send JSON: { notes: string }" },
        { status: 400 }
      );
    }

    // ---- ECHO MODE (use while testing, then remove) ----
    // return NextResponse.json({ plan: `Echo: ${notes}` });

    // ---- REAL OPENAI CALL ----
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY on the server." },
        { status: 500 }
      );
    }

    const prompt = `Summarize the following meeting/DM notes into:
- 5 concise bullet points
- Action items (owner + target date if possible)
- Risks/blockers

Notes:
${notes}`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 600,
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      return NextResponse.json(
        { error: `OpenAI error ${r.status}`, upstream: errText },
        { status: 502 }
      );
    }

    const data = await r.json();
    const plan: string =
      data?.choices?.[0]?.message?.content?.trim() ?? "No result.";
    return NextResponse.json({ plan });
  } catch (e: any) {
    return NextResponse.json(
      { error: `Server error: ${e?.message ?? "unknown"}` },
      { status: 500 }
    );
  }
}
