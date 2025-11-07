"use client";

import { useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";

/**
 * This hook automatically triggers notifications
 * for upcoming events 30 minutes and 5 minutes before start time.
 *
 * @param events - Array of { title: string, start: string }
 * start time should be an ISO string or a Date-like string
 */
export function useEventNotifications(events: { title: string; start: string }[]) {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!events || events.length === 0) return;

    const now = new Date().getTime();

    const timers: NodeJS.Timeout[] = [];

    events.forEach((event) => {
      const eventTime = new Date(event.start).getTime();

      // Only for future events
      if (eventTime > now) {
        // 30 min before
        const thirtyBefore = eventTime - 30 * 60 * 1000;
        if (thirtyBefore > now) {
          timers.push(
            setTimeout(() => {
              addNotification(`"${event.title}" starts in 30 minutes ⏰`, "calendar");
            }, thirtyBefore - now)
          );
        }

        // 5 min before
        const fiveBefore = eventTime - 5 * 60 * 1000;
        if (fiveBefore > now) {
          timers.push(
            setTimeout(() => {
              addNotification(`"${event.title}" starts in 5 minutes 🚀`, "calendar");
            }, fiveBefore - now)
          );
        }

        // At start time
        timers.push(
          setTimeout(() => {
            addNotification(`"${event.title}" is starting now 🎯`, "calendar");
          }, eventTime - now)
        );
      }
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [events]);
}
