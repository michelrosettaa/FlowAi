"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface Notification {
  id: string; // ✅ use string for unique IDs
  message: string;
  type: "mentor" | "calendar" | "system";
  time: string;
}

const NotificationContext = createContext<{
  notifications: Notification[];
  addNotification: (msg: string, type?: "mentor" | "calendar" | "system") => void;
  removeNotification: (id: string) => void;
}>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ✅ useCallback ensures this function stays stable between renders
  const addNotification = useCallback(
    (msg: string, type: "mentor" | "calendar" | "system" = "system") => {
      const newNote: Notification = {
        id: `${Date.now()}-${Math.random()}`, // ✅ always unique
        message: msg,
        type,
        time: new Date().toLocaleTimeString(),
      };

      setNotifications((prev) => [newNote, ...prev]);

      // Auto-remove after 10 seconds (prevents clutter)
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNote.id));
      }, 10000);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // ✅ Example mentor notifications every 2 hours
  useEffect(() => {
    const timer = setInterval(() => {
      const mentorMessages = [
        "Take a short walk to reset your focus 💭",
        "You’ve done well today. Ready to plan tomorrow?",
        "Remember your why — one deep focus block can change your day.",
      ];
      const msg = mentorMessages[Math.floor(Math.random() * mentorMessages.length)];
      addNotification(msg, "mentor");
    }, 2 * 60 * 60 * 1000); // every 2 hours

    return () => clearInterval(timer);
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}
