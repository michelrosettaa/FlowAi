import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { prompt, email } = await req.json();

  // Call your provider (OpenAI, etc.)
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const j = await r.json();
  const answer = j.choices?.[0]?.message?.content ?? "Sorry, I couldn’t think of anything.";

  // Track event
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  await supabase.from("app_events").insert({ user_email: email, event: "ask_query", meta: { prompt } });

  return NextResponse.json({ answer });
}
