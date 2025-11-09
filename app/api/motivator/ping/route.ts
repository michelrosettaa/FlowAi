import { NextResponse } from "next/server";

// TODO: replace with your real DB write
async function saveNotification(note: { userId: string; message: string; type: "mentor"|"calendar"|"system" }) {
  // write to DB; for now we just no-op
  return true;
}

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  // generate a short nudge
  const nudges = [
    "Two focused 25-minute blocks beat a messy 2 hours. Pick one task now.",
    "Reduce friction: close one tab, open one doc, start.",
    "Micro-win ↦ momentum. What 10-minute task can you finish next?",
  ];
  const message = nudges[Math.floor(Math.random()*nudges.length)];

  // For MVP, send to one demo user. Replace with all tester user IDs.
  await saveNotification({ userId: "demo-user", message, type: "mentor" });

  return NextResponse.json({ ok: true });
}
