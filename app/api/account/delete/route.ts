import { NextResponse } from "next/server";

// Placeholder: in production, verify the user, then:
// - delete Firestore docs
// - cancel Stripe subscription
// - revoke sessions
export async function POST() {
  return NextResponse.json({ ok: true, message: "Deletion request received." });
}
