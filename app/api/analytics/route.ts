import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data: events } = await supabase
    .from("app_events")
    .select("event, count:count(*)")
    .group("event");

  const { data: cal } = await supabase
    .from("calendar_events")
    .select("user_email, count:count(*)")
    .group("user_email");

  return NextResponse.json({ events, calendarCounts: cal });
}
