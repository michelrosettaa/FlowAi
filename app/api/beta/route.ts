// app/api/beta/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json().catch(() => ({} as any));

  const COOKIE = process.env.BETA_COOKIE_NAME ?? "flowai_beta";
  const EXPECTED = process.env.BETA_CODE ?? "";

  // If beta is disabled, just "succeed".
  const betaRequired = (process.env.BETA_REQUIRED ?? "true").toLowerCase() === "true";
  if (!betaRequired) {
    const res = NextResponse.json({ ok: true, disabled: true });
    res.headers.set(
      "Set-Cookie",
      `${COOKIE}=open; Path=/; SameSite=Lax; HttpOnly; Max-Age=${60 * 60 * 24 * 30}`
    );
    return res;
  }

  if (!code || !EXPECTED || code !== EXPECTED) {
    return NextResponse.json({ ok: false, error: "bad_code" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  // NOTE: HttpOnly so client JS can’t fiddle it; Lax so it’s sent on same-site navigations.
  res.headers.set(
    "Set-Cookie",
    `${COOKIE}=${code}; Path=/; SameSite=Lax; HttpOnly; Max-Age=${60 * 60 * 24 * 30}`
  );
  return res;
}
