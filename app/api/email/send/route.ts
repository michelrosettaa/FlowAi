/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { recipient, subject, emailBody } = await req.json();

    // For now, just log it. Later: integrate Gmail / Outlook / SendGrid.
    console.log("📧 SEND EMAIL (demo)");
    console.log("To:", recipient);
    console.log("Subject:", subject);
    console.log("Body:", emailBody);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to send" },
      { status: 500 }
    );
  }
}
