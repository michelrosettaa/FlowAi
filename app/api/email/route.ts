// app/api/email/route.ts
import { NextResponse } from "next/server";

type Mode = "summary" | "followups" | "report";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, route: "email" });
}

export async function POST(req: Request) {
  try {
    const { emailText = "", mode = "summary" } = (await req.json()) as {
      emailText?: string;
      mode?: Mode;
    };

    if (!emailText.trim()) {
      return NextResponse.json(
        { error: "Send JSON: { emailText: string, mode?: 'summary'|'followups'|'report' }" },
        { status: 400 }
      );
    }

    const m: Mode =
      mode === "summary" || mode === "followups" || mode === "report"
        ? mode
        : "summary";

    const key = process.env.OPENAI_API_KEY;
    if (!key || !key.startsWith("sk-")) {
      return NextResponse.json(
        { error: "Missing or invalid OPENAI_API_KEY. Put a valid sk- key in .env.local and restart the server." },
        { status: 500 }
      );
    }

    const prompt =
      m === "summary"
        ? `Summarize this email thread into 5 concise bullets and then list 3 actionable next steps.

Thread:
${emailText}`
        : m === "followups"
        ? `Write a concise, polite follow-up email (<=120 words) based on this thread.
Include:
- A clear subject line
- 1–2 sentence context
- A single, specific CTA
- A warm sign-off

Thread:
${emailText}`
        : `Create a brief report based on this email thread with sections:
1) Context (2–3 sentences)
2) Key Points (bullets)
3) Risks (bullets, if any)
4) Next Steps (numbered, with owners if available)

Thread:
${emailText}`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 700,
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      if (r.status === 401) {
        return NextResponse.json(
          {
            error:
              "OpenAI 401 (invalid_api_key). Create a new key at https://platform.openai.com/account/api-keys, set OPENAI_API_KEY=sk-..., then restart.",
            upstream: errText,
          },
          { status: 502 }
        );
      }
      if (r.status === 429) {
        return NextResponse.json(
          { error: "OpenAI 429 (rate limit / insufficient_quota). Add billing/credits or wait and retry.", upstream: errText },
          { status: 502 }
        );
      }
      return NextResponse.json({ error: `OpenAI error ${r.status}`, upstream: errText }, { status: 502 });
    }

    const data = await r.json();
    const result: string = data?.choices?.[0]?.message?.content?.trim() ?? "No result.";
    return NextResponse.json({ result });
  } catch (e: any) {
    return NextResponse.json({ error: `Server error: ${e?.message ?? "unknown"}` }, { status: 500 });
  }
}
