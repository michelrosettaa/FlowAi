import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { userStreaks, notifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const streak = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.userId, session.user.id))
      .limit(1);

    if (streak.length === 0) {
      return NextResponse.json({
        currentStreak: 0,
        longestStreak: 0,
        totalActiveDays: 0,
        lastActiveDate: null,
      });
    }

    return NextResponse.json(streak[0]);
  } catch (error: any) {
    console.error("Error fetching streak:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingStreak = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.userId, session.user.id))
      .limit(1);

    if (existingStreak.length === 0) {
      const newStreak = await db
        .insert(userStreaks)
        .values({
          userId: session.user.id,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: today,
          totalActiveDays: 1,
        })
        .returning();

      await db.insert(notifications).values({
        userId: session.user.id,
        type: "streak",
        title: "Welcome to Refraim!",
        message: "You've started your productivity journey. Come back tomorrow to build your streak!",
      });

      return NextResponse.json({
        ...newStreak[0],
        streakUpdated: true,
        isNewDay: true,
      });
    }

    const streak = existingStreak[0];
    const lastActive = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null;
    
    if (lastActive) {
      lastActive.setHours(0, 0, 0, 0);
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isSameDay = lastActive?.getTime() === today.getTime();

    if (isSameDay) {
      return NextResponse.json({
        ...streak,
        streakUpdated: false,
        isNewDay: false,
        message: "Already logged in today",
      });
    }

    const isConsecutiveDay = lastActive?.getTime() === yesterday.getTime();

    let newCurrentStreak = 1;
    let newLongestStreak = streak.longestStreak;

    if (isConsecutiveDay) {
      newCurrentStreak = streak.currentStreak + 1;
      if (newCurrentStreak > streak.longestStreak) {
        newLongestStreak = newCurrentStreak;
      }
    }

    const updatedStreak = await db
      .update(userStreaks)
      .set({
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActiveDate: today,
        totalActiveDays: streak.totalActiveDays + 1,
        updatedAt: new Date(),
      })
      .where(eq(userStreaks.userId, session.user.id))
      .returning();

    if (isConsecutiveDay) {
      const milestones = [7, 14, 30, 60, 100, 365];
      if (milestones.includes(newCurrentStreak)) {
        await db.insert(notifications).values({
          userId: session.user.id,
          type: "achievement",
          title: `${newCurrentStreak} Day Streak!`,
          message: `Amazing! You've been productive for ${newCurrentStreak} days in a row. Keep going!`,
        });
      }
    } else if (!isConsecutiveDay && streak.currentStreak > 1) {
      await db.insert(notifications).values({
        userId: session.user.id,
        type: "streak",
        title: "Streak Reset",
        message: `Your ${streak.currentStreak}-day streak has ended. No worries - start fresh today!`,
      });
    }

    return NextResponse.json({
      ...updatedStreak[0],
      streakUpdated: true,
      isNewDay: true,
      previousStreak: streak.currentStreak,
      wasConsecutive: isConsecutiveDay,
    });
  } catch (error: any) {
    console.error("Error updating streak:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
