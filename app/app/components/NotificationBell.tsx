"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, Check, Flame, Gift, CreditCard, Users, Clock } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  actionUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  streak: <Flame className="w-4 h-4 text-orange-500" />,
  achievement: <Gift className="w-4 h-4 text-purple-500" />,
  trial_ending: <Clock className="w-4 h-4 text-yellow-500" />,
  trial_ended: <CreditCard className="w-4 h-4 text-red-500" />,
  subscription_updated: <CreditCard className="w-4 h-4 text-green-500" />,
  team_invite: <Users className="w-4 h-4 text-blue-500" />,
  welcome: <Gift className="w-4 h-4 text-blue-500" />,
  reminder: <Bell className="w-4 h-4 text-blue-500" />,
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg transition-colors hover:bg-white/10"
        style={{ color: 'var(--app-text-dim)' }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-80 max-h-[480px] overflow-hidden rounded-xl shadow-2xl z-50"
          style={{ 
            background: 'var(--app-surface-elevated)',
            border: '1px solid var(--app-border)',
          }}
        >
          <div 
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'var(--app-border)' }}
          >
            <h3 className="font-semibold" style={{ color: 'var(--app-text)' }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={loading}
                className="text-xs font-medium transition-colors hover:opacity-80"
                style={{ color: 'var(--app-accent)' }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-[380px]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 mx-auto mb-3 opacity-30" style={{ color: 'var(--app-text-dim)' }} />
                <p className="text-sm" style={{ color: 'var(--app-text-dim)' }}>
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                  className={`px-4 py-3 border-b transition-colors cursor-pointer hover:bg-white/5 ${
                    !notification.isRead ? 'bg-blue-500/5' : ''
                  }`}
                  style={{ borderColor: 'var(--app-border)' }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {typeIcons[notification.type] || <Bell className="w-4 h-4" style={{ color: 'var(--app-text-dim)' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--app-text)' }}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--app-text-dim)' }}>
                        {notification.message}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--app-text-muted)' }}>
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div 
            className="px-4 py-3 border-t text-center"
            style={{ borderColor: 'var(--app-border)' }}
          >
            <a 
              href="/app/settings/notifications"
              className="text-xs font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--app-accent)' }}
            >
              Notification Settings
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
