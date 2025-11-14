import { auth } from "./lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  
  const isAppRoute = request.nextUrl.pathname.startsWith("/app");
  const isOnboardingRoute = request.nextUrl.pathname === "/onboarding";
  const isLoginRoute = request.nextUrl.pathname === "/login";

  // Only block /app routes for unauthenticated users
  // Allow /onboarding access for email-only flow
  if (!session && isAppRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session) {
    const user = session.user as any;
    const onboardingCompleted = user?.onboardingCompleted;

    if (!onboardingCompleted && isAppRoute) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    if (onboardingCompleted && isOnboardingRoute) {
      return NextResponse.redirect(new URL("/app", request.url));
    }

    if (isLoginRoute) {
      return NextResponse.redirect(new URL(onboardingCompleted ? "/app" : "/onboarding", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/onboarding", "/login"],
};
