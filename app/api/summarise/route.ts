import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, route: "summarise" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const notes = body.notes || body.tasksText || "";

    if (!notes.trim()) {
      return NextResponse.json({ error: "Missing notes" }, { status: 400 });
    }

    // Temporary simple response — will later replace with OpenAI logic
    return NextResponse.json({ plan: `Echo: ${notes}` });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
