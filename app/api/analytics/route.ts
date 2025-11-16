import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { storage } from "@/server/storage";
import { startOfWeek, endOfWeek, differenceInHours, isToday, startOfDay, endOfDay } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Get current week and extended period for streak calculation
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday
    const streakLookbackStart = new Date(now);
    streakLookbackStart.setDate(streakLookbackStart.getDate() - 30); // Last 30 days
    
    // Fetch user's tasks and calendar events for analytics with error handling
    let allTasks: any[] = [];
    let weekEvents: any[] = [];
    let allRecentEvents: any[] = [];
    
    try {
      [allTasks, weekEvents, allRecentEvents] = await Promise.all([
        storage.getTasks(userId).catch(() => []),
        storage.getCalendarEvents(userId, weekStart, weekEnd).catch(() => []),
        storage.getCalendarEvents(userId, streakLookbackStart, now).catch(() => [])
      ]);
    } catch (dbError) {
      console.error("Database fetch error:", dbError);
      // Continue with empty arrays
    }

    // Calculate completed tasks this week
    const tasksCompletedThisWeek = allTasks.filter(task => {
      if (!task.completed || !task.updatedAt) return false;
      const completedDate = new Date(task.updatedAt);
      return completedDate >= weekStart && completedDate <= weekEnd;
    }).length;

    // Calculate total completed tasks
    const totalCompletedTasks = allTasks.filter(t => t.completed).length;

    // Calculate focus hours from calendar events this week
    let totalFocusMinutes = 0;
    weekEvents.forEach(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const minutes = Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60));
      totalFocusMinutes += minutes;
    });
    const focusHours = totalFocusMinutes / 60;

    // Calculate productivity score (0-100)
    // Based on: task completion rate + calendar utilization
    const totalTasks = allTasks.length;
    const taskCompletionRate = totalTasks > 0 ? (totalCompletedTasks / totalTasks) * 100 : 0;
    const weekHours = 7 * 8; // 56 work hours per week
    const calendarUtilization = Math.min(100, (focusHours / weekHours) * 100);
    const productivityScore = Math.round((taskCompletionRate * 0.6 + calendarUtilization * 0.4));

    // Calculate week streak (days with at least one task completed or calendar event)
    let currentStreak = 0;
    let checkDate = new Date();
    
    // Go backwards from today to find consecutive days with activity
    for (let i = 0; i < 30; i++) {
      const dayStart = startOfDay(checkDate);
      const dayEnd = endOfDay(checkDate);
      
      // Check if any tasks were completed on this day
      const hasTaskActivity = allTasks.some(task => {
        if (!task.completed || !task.updatedAt) return false;
        const completedDate = new Date(task.updatedAt);
        return completedDate >= dayStart && completedDate <= dayEnd;
      });
      
      // Check if any calendar events on this day
      const hasCalendarActivity = allRecentEvents.some(event => {
        const eventStart = new Date(event.startDate);
        return eventStart >= dayStart && eventStart <= dayEnd;
      });
      
      if (hasTaskActivity || hasCalendarActivity) {
        currentStreak++;
      } else if (i > 0) {
        // Break streak if no activity (but allow today to have no activity yet)
        break;
      }
      
      // Move to previous day
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return NextResponse.json({
      focusHours: {
        value: focusHours.toFixed(1) + "h",
        rawValue: focusHours,
        change: tasksCompletedThisWeek > 0 ? "+" + tasksCompletedThisWeek : "0"
      },
      tasksCompleted: {
        value: totalCompletedTasks,
        change: tasksCompletedThisWeek > 0 ? "+" + tasksCompletedThisWeek : "0"
      },
      productivityScore: {
        value: productivityScore + "%",
        rawValue: productivityScore,
        change: productivityScore >= 70 ? "Excellent" : productivityScore >= 50 ? "Good" : "Keep going"
      },
      weekStreak: {
        value: currentStreak + (currentStreak === 1 ? " day" : " days"),
        rawValue: currentStreak,
        change: currentStreak >= 7 ? "Amazing!" : currentStreak >= 3 ? "Great!" : "Keep it up!"
      }
    });

  } catch (error: any) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to calculate analytics" },
      { status: 500 }
    );
  }
}
