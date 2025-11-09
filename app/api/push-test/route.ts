import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPush } from "@/lib/push";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { email } = await req.json();
  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("*").eq("email", email);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await Promise.all(
    (data || []).map((row) =>
      sendPush(row, { title: "FlowAI", body: "Test push from FlowAI 🚀", tag: "test" })
        .catch(() => {})
    )
  );
  return NextResponse.json({ ok: true });
}
