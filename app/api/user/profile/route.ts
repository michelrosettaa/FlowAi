import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { storage } from "@/server/storage";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const userId = session.user.id;
    const preferences = await storage.getUserPreferences(userId);
    
    // Get user's onboarding status directly from database
    const user = await storage.getUser(userId);
    
    console.log(`[PROFILE API] User ${userId} - onboarding status:`, user?.onboardingCompleted);

    const prefsData = preferences?.preferences as Record<string, any> | null;
    
    return NextResponse.json({
      name: session.user.name,
      email: session.user.email,
      onboardingCompleted: user?.onboardingCompleted ?? false,
      preferences: prefsData ? {
        goal: prefsData.goal,
        workStyle: prefsData.workStyle,
        challenge: prefsData.challenge,
      } : null,
    });
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const updatedUser = await storage.updateUser(userId, { name: name.trim() });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
