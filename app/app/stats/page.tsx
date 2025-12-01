"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Clock, CheckCircle2, Target, BarChart3, Loader2 } from "lucide-react";

interface AnalyticsData {
  focusHours: { value: string; change: string };
  tasksCompleted: { value: number; change: string };
  productivityScore: { value: string; change: string };
  weekStreak: { value: string; change: string };
}

export default function StatsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/analytics");
      
      if (!response.ok) {
        throw new Error("Failed to load analytics");
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (err: any) {
      console.error("Analytics error:", err);
      setError(err.message || "Failed to load your analytics");
    } finally {
      setLoading(false);
    }
  };

  const stats = analytics ? [
    { 
      label: "Focus Hours", 
      value: analytics.focusHours.value, 
      change: analytics.focusHours.change, 
      icon: <Clock className="w-6 h-6" />, 
      color: "from-blue-500 to-indigo-600" 
    },
    { 
      label: "Tasks Completed", 
      value: String(analytics.tasksCompleted.value), 
      change: analytics.tasksCompleted.change, 
      icon: <CheckCircle2 className="w-6 h-6" />, 
      color: "from-green-500 to-emerald-600" 
    },
    { 
      label: "Productivity Score", 
      value: analytics.productivityScore.value, 
      change: analytics.productivityScore.change, 
      icon: <Target className="w-6 h-6" />, 
      color: "from-purple-500 to-pink-600" 
    },
    { 
      label: "Activity Streak", 
      value: analytics.weekStreak.value, 
      change: analytics.weekStreak.change, 
      icon: <TrendingUp className="w-6 h-6" />, 
      color: "from-orange-500 to-red-600" 
    },
  ] : [];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--app-accent)' }} />
          <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
            Calculating your analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="premium-card p-8 text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--app-text-muted)' }}>
            {error}
          </p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ background: 'var(--app-accent)' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <BarChart3 className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--app-text)' }}>
          Refraim Analytics
        </h1>
        <p className="text-base" style={{ color: 'var(--app-text-dim)' }}>
          Track your productivity trends, focus time, and achievements based on your actual activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="premium-card p-6 hover:scale-105 transition-all cursor-pointer"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-gradient-to-br ${stat.color} shadow-lg`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--app-text)' }}>
              {stat.value}
            </div>
            <div className="text-sm mb-2" style={{ color: 'var(--app-text-dim)' }}>
              {stat.label}
            </div>
            <div className="text-xs font-semibold" style={{ color: 'var(--app-accent)' }}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Insights Section */}
      <div className="premium-card p-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--app-text)' }}>
          Your Productivity Insights
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--app-accent)' }}></div>
            <p className="text-sm flex-1" style={{ color: 'var(--app-text-dim)' }}>
              Your analytics are calculated from your actual tasks and calendar events, giving you real insights into your productivity patterns.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--app-accent)' }}></div>
            <p className="text-sm flex-1" style={{ color: 'var(--app-text-dim)' }}>
              Focus hours are calculated from your calendar events for this week. Add more events to track your time better.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--app-accent)' }}></div>
            <p className="text-sm flex-1" style={{ color: 'var(--app-text-dim)' }}>
              Your productivity score is based on task completion rate (60%) and calendar utilisation (40%).
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--app-accent)' }}></div>
            <p className="text-sm flex-1" style={{ color: 'var(--app-text-dim)' }}>
              Activity streaks count consecutive days with completed tasks or calendar events. Keep the streak going!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
