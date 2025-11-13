import { NextResponse } from "next/server";
import { getGmailClient } from "@/lib/integrations/gmail";

export async function POST(req: Request) {
  try {
    const { recipient, subject, emailBody } = await req.json();

    if (!recipient || !subject || !emailBody) {
      return NextResponse.json(
        { error: "Recipient, subject, and email body are required" },
        { status: 400 }
      );
    }

    const gmail = await getGmailClient();

    const email = [
      `To: ${recipient}`,
      `Subject: ${subject}`,
      "Content-Type: text/html; charset=utf-8",
      "",
      emailBody,
    ].join("\n");

    const encodedEmail = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedEmail,
      },
    });

    console.log("✅ Email sent successfully via Gmail");
    console.log("To:", recipient);
    console.log("Subject:", subject);

    return NextResponse.json({ ok: true, message: "Email sent successfully" });
  } catch (err: any) {
    console.error("Email send error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
