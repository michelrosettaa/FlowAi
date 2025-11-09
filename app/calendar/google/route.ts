import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const accessToken = (session as any).g_access_token;
  if (!accessToken) return NextResponse.json({ error: "no google token" }, { status: 400 });

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const cal = google.calendar({ version: "v3", auth });
  const now = new Date();
  const res = await cal.events.list({
    calendarId: "primary",
    timeMin: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString(),
    timeMax: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30).toISOString(),
    singleEvents: true,
    orderBy: "startTime"
  });

  const email = session.user?.email!;
  const rows = (res.data.items ?? []).map((e) => ({
    id: e.id!,
    user_email: email,
    provider: "google",
    title: e.summary ?? "(no title)",
    start_at: e.start?.dateTime ?? e.start?.date,
    end_at: e.end?.dateTime ?? e.end?.date,
    raw: e
  }));

  if (rows.length) {
    // upsert by id
    const { error } = await supabase
      .from("calendar_events")
      .upsert(rows, { onConflict: "id" });
    if (error) console.error(error);
  }

  return NextResponse.json({ imported: rows.length });
}
