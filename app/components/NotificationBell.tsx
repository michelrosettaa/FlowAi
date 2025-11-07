"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { useState } from "react";

export default function NotificationBell() {
  const { notifications, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative bg-white/5 p-2 rounded-full hover:bg-white/10 transition"
      >
        <Bell size={18} className="text-white" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-10 left-0 w-64 bg-[#0f172a] border border-white/10 rounded-lg shadow-xl p-3 z-50 text-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 font-semibold">Notifications</span>
            <button
              onClick={() => {
                markAllAsRead();
                setOpen(false);
              }}
              className="text-[11px] text-blue-400 hover:underline"
            >
              Mark all read
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="text-slate-500 text-center py-4">No new notifications</div>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {notifications
                .slice()
                .reverse()
                .map((n) => (
                  <li
                    key={n.id}
                    className="p-2 bg-white/5 rounded-md text-slate-200 border border-white/5"
                  >
                    {n.message}
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
