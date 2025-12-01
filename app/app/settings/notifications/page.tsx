"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  Mail, 
  Calendar, 
  BarChart3, 
  Flame, 
  CheckCircle,
  Loader2,
  Send
} from "lucide-react";

interface EmailPreferences {
  id: string;
  userId: string;
  welcomeEmail: boolean;
  dailyReminders: boolean;
  weeklyReminders: boolean;
  weeklyAnalytics: boolean;
  taskReminders: boolean;
  streakAlerts: boolean;
  marketingEmails: boolean;
}

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState<EmailPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await fetch("/api/email/preferences");
      if (res.ok) {
        const data = await res.json();
        setPreferences(data);
      }
    } catch (err) {
      console.error("Failed to fetch preferences:", err);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key: keyof EmailPreferences, value: boolean) => {
    if (!preferences) return;
    
    setSaving(true);
    try {
      const res = await fetch("/api/email/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
      
      if (res.ok) {
        setPreferences({ ...preferences, [key]: value });
        setMessage({ type: "success", text: "Preferences updated" });
      } else {
        throw new Error("Failed to update");
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to save preference" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const sendTestEmail = async (type: string) => {
    setTestingEmail(type);
    try {
      const res = await fetch("/api/email/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ type: "success", text: data.message });
      } else {
        throw new Error(data.error || "Failed to send");
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to send test email" });
    } finally {
      setTestingEmail(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const preferenceItems = [
    {
      key: "welcomeEmail" as keyof EmailPreferences,
      label: "Welcome Emails",
      description: "Receive a welcome email when you sign up",
      icon: <Mail className="w-5 h-5" />,
      testType: "welcome",
    },
    {
      key: "dailyReminders" as keyof EmailPreferences,
      label: "Daily Reminders",
      description: "Get a daily productivity brief with your tasks",
      icon: <Calendar className="w-5 h-5" />,
      testType: "reminder",
    },
    {
      key: "weeklyReminders" as keyof EmailPreferences,
      label: "Weekly Check-ins",
      description: "Receive weekly planning reminders on Sundays",
      icon: <CheckCircle className="w-5 h-5" />,
      testType: null,
    },
    {
      key: "weeklyAnalytics" as keyof EmailPreferences,
      label: "Weekly Analytics",
      description: "Get your productivity report every week",
      icon: <BarChart3 className="w-5 h-5" />,
      testType: "analytics",
    },
    {
      key: "taskReminders" as keyof EmailPreferences,
      label: "Task Reminders",
      description: "Reminders for upcoming and overdue tasks",
      icon: <Bell className="w-5 h-5" />,
      testType: null,
    },
    {
      key: "streakAlerts" as keyof EmailPreferences,
      label: "Streak Alerts",
      description: "Get notified when your streak is at risk",
      icon: <Flame className="w-5 h-5" />,
      testType: "streak",
    },
  ];

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--app-accent)' }} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <Bell className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--app-text)' }}>
          Email Notifications
        </h1>
        <p className="text-base" style={{ color: 'var(--app-text-dim)' }}>
          Choose which emails you'd like to receive from Refraim AI.
        </p>
      </div>

      {message && (
        <div 
          className={`mb-6 p-4 rounded-xl ${
            message.type === "success" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {preferenceItems.map((item) => (
          <div
            key={item.key}
            className="premium-card p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--app-surface-elevated)', color: 'var(--app-accent)' }}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="font-medium" style={{ color: 'var(--app-text)' }}>
                  {item.label}
                </h3>
                <p className="text-sm" style={{ color: 'var(--app-text-dim)' }}>
                  {item.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {item.testType && (
                <button
                  onClick={() => sendTestEmail(item.testType!)}
                  disabled={testingEmail === item.testType}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
                  style={{ 
                    background: 'var(--app-surface-elevated)', 
                    color: 'var(--app-text-dim)' 
                  }}
                >
                  {testingEmail === item.testType ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Test
                </button>
              )}
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences?.[item.key] as boolean ?? true}
                  onChange={(e) => updatePreference(item.key, e.target.checked)}
                  disabled={saving}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 rounded-xl border border-dashed" style={{ borderColor: 'var(--app-border)' }}>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--app-text)' }}>
          Email Tips
        </h2>
        <ul className="text-sm space-y-2" style={{ color: 'var(--app-text-dim)' }}>
          <li>• Emails are sent from hello@refraimai.com — add us to your contacts</li>
          <li>• Weekly analytics are sent every Sunday evening</li>
          <li>• You can unsubscribe from any email using the link at the bottom</li>
          <li>• Test emails are marked with [TEST] in the subject line</li>
        </ul>
      </div>
    </div>
  );
}
