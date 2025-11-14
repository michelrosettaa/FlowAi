import { auth } from "./lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  
  const isAppRoute = request.nextUrl.pathname.startsWith("/app");
  const isOnboardingRoute = request.nextUrl.pathname === "/onboarding";
  const isLoginRoute = request.nextUrl.pathname === "/login";
  const isLoadingRoute = request.nextUrl.pathname === "/loading";

  // Allow /onboarding, /loading, and /app for email-only users (unauthenticated)
  // This enables the email → onboarding → loading → app flow
  
  // If authenticated, handle special routing logic
  if (session) {
    const user = session.user as any;
    const onboardingCompleted = user?.onboardingCompleted;

    // Authenticated users who haven't completed onboarding should go to /onboarding
    if (!onboardingCompleted && isAppRoute) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // Authenticated users who completed onboarding shouldn't be on /onboarding
    if (onboardingCompleted && isOnboardingRoute) {
      return NextResponse.redirect(new URL("/app", request.url));
    }

    // Authenticated users at /login should go to the appropriate page
    if (isLoginRoute) {
      return NextResponse.redirect(new URL(onboardingCompleted ? "/app" : "/onboarding", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/onboarding", "/login", "/loading"],
};
