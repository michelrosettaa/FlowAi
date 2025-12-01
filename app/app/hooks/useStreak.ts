"use client";

import { useState, useEffect, useCallback } from "react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  lastActiveDate: string | null;
  streakUpdated?: boolean;
  isNewDay?: boolean;
}

export function useStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  const fetchStreak = useCallback(async () => {
    try {
      const res = await fetch("/api/streak");
      if (res.ok) {
        const data = await res.json();
        setStreak(data);
      }
    } catch (err) {
      console.error("Failed to fetch streak:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const recordActivity = useCallback(async () => {
    try {
      const res = await fetch("/api/streak", {
        method: "POST",
      });
      
      if (res.ok) {
        const data = await res.json();
        setStreak(data);
        
        if (data.isNewDay && data.wasConsecutive) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }
        
        return data;
      }
    } catch (err) {
      console.error("Failed to record activity:", err);
    }
    return null;
  }, []);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  useEffect(() => {
    if (!loading && streak) {
      recordActivity();
    }
  }, [loading]);

  return {
    streak,
    loading,
    showCelebration,
    fetchStreak,
    recordActivity,
  };
}
