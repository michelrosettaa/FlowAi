// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set<string>([
  "/", "/pricing", "/signup", "/onboarding", "/checkout",
  "/verify", "/verify-confirm", "/beta",
  "/terms", "/privacy",
]);

// Only gate /app/* behind the private beta cookie.
// Flip this env to "false" to disable the beta wall instantly.
const BETA_REQUIRED = (process.env.BETA_REQUIRED ?? "true").toLowerCase() === "true";
const BETA_COOKIE = process.env.BETA_COOKIE_NAME ?? "flowai_beta";
const BETA_CODE = process.env.BETA_CODE ?? "";  // keep in .env.local

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore Next internals and API
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Public pages — never redirect
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // Private beta: only protect /app/*
  if (BETA_REQUIRED && pathname.startsWith("/app")) {
    const cookie = req.cookies.get(BETA_COOKIE)?.value ?? "";
    if (!cookie || (BETA_CODE && cookie !== BETA_CODE)) {
      const url = req.nextUrl.clone();
      url.pathname = "/beta";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
