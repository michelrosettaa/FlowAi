"use client";

import { TrendingUp, Clock, CheckCircle2, Target, BarChart3 } from "lucide-react";

export default function StatsPage() {
  const stats = [
    { label: "Focus Hours", value: "24.5h", change: "+12%", icon: <Clock className="w-6 h-6" />, color: "from-blue-500 to-indigo-600" },
    { label: "Tasks Completed", value: "47", change: "+8", icon: <CheckCircle2 className="w-6 h-6" />, color: "from-green-500 to-emerald-600" },
    { label: "Productivity Score", value: "92%", change: "+5%", icon: <Target className="w-6 h-6" />, color: "from-purple-500 to-pink-600" },
    { label: "Week Streak", value: "14 days", change: "New!", icon: <TrendingUp className="w-6 h-6" />, color: "from-orange-500 to-red-600" },
  ];

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <BarChart3 className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--app-text)' }}>
          Analytics
        </h1>
        <p className="text-base" style={{ color: 'var(--app-text-dim)' }}>
          Track your productivity trends, focus time, and achievements.
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

      {/* Coming Soon Section */}
      <div className="premium-card p-8 text-center">
        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--app-text)' }}>
          📊 Detailed Analytics Coming Soon
        </h2>
        <p className="text-sm mb-4" style={{ color: 'var(--app-text-dim)' }}>
          We're building advanced analytics to help you understand your productivity patterns better.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <div className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: 'var(--app-surface-hover)', color: 'var(--app-text-dim)' }}>
            ⏰ Time tracking
          </div>
          <div className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: 'var(--app-surface-hover)', color: 'var(--app-text-dim)' }}>
            📈 Trend analysis
          </div>
          <div className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: 'var(--app-surface-hover)', color: 'var(--app-text-dim)' }}>
            🎯 Goal tracking
          </div>
          <div className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: 'var(--app-surface-hover)', color: 'var(--app-text-dim)' }}>
            📊 Custom reports
          </div>
        </div>
      </div>
    </div>
  );
}
