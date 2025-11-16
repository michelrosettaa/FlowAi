import { auth } from "./lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function middleware(request: NextRequest) {
  const session = await auth();
  
  const isAppRoute = request.nextUrl.pathname.startsWith("/app");
  const isOnboardingRoute = request.nextUrl.pathname === "/onboarding";
  const isLoginRoute = request.nextUrl.pathname === "/login";
  const isLoadingRoute = request.nextUrl.pathname === "/loading";

  // If NOT authenticated, redirect /app and /onboarding routes to /login
  if (!session) {
    if (isAppRoute || isOnboardingRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
  
  // CRITICAL FIX: Check database directly instead of trusting JWT token
  // JWT tokens don't refresh reliably, but the database is always correct
  let onboardingCompleted = false;
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`
      SELECT onboarding_completed 
      FROM users 
      WHERE id = ${(session.user as any).id} 
      LIMIT 1
    `;
    onboardingCompleted = result[0]?.onboarding_completed ?? false;
    console.log(`[MIDDLEWARE] User ${(session.user as any).id} onboarding status from DB: ${onboardingCompleted}`);
  } catch (error) {
    console.error("[MIDDLEWARE] DB check error:", error);
    // Fallback to session token if DB check fails
    onboardingCompleted = (session.user as any)?.onboardingCompleted ?? false;
    console.log(`[MIDDLEWARE] Using fallback from JWT: ${onboardingCompleted}`);
  }

  // Authenticated users who haven't completed onboarding should go to /onboarding
  if (!onboardingCompleted && isAppRoute) {
    console.log(`[MIDDLEWARE] Redirecting to /onboarding (user hasn't completed)`);
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // Authenticated users who completed onboarding shouldn't be on /onboarding
  if (onboardingCompleted && isOnboardingRoute) {
    console.log(`[MIDDLEWARE] Redirecting to /app (onboarding completed)`);
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // Authenticated users at /login should go to the appropriate page
  if (isLoginRoute) {
    return NextResponse.redirect(new URL(onboardingCompleted ? "/app" : "/onboarding", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/onboarding", "/login"],
};
