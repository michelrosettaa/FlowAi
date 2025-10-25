import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, route: "summarise" });
}

export async function POST(req: Request) {
  try {
    const { notes = "" } = await req.json();
    if (!notes.trim()) {
      return NextResponse.json({ error: "Missing notes" }, { status: 400 });
    }
    return NextResponse.json({ plan: `Echo: ${notes}` });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
