"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

const ACTIVITY_INTERVAL = 5 * 60 * 1000;

export function useActivityTracker() {
  const { data: session } = useSession();
  const lastTracked = useRef<number>(0);

  const trackActivity = useCallback(async () => {
    if (!session?.user) return;
    
    const now = Date.now();
    if (now - lastTracked.current < ACTIVITY_INTERVAL) return;
    
    lastTracked.current = now;

    try {
      await fetch("/api/activity", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to track activity:", error);
    }
  }, [session]);

  useEffect(() => {
    if (!session?.user) return;

    trackActivity();

    const interval = setInterval(trackActivity, ACTIVITY_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        trackActivity();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session, trackActivity]);

  return { trackActivity };
}
