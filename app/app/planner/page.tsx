"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, Clock, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

interface TimelineItem {
  time: string;
  label: string;
}

export default function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [plan, setPlan] = useState("");
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGeneratePlan = async () => {
    if (!tasks.trim()) {
      setError("Please describe your day or list your tasks");
      return;
    }

    setLoading(true);
    setError("");
    setPlan("");
    setTimeline([]);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const data = await response.json();
      setPlan(data.plan);
      if (data.timeline) {
        setTimeline(data.timeline);
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-blue-400" />
              AI Planner
            </h1>
            <p className="text-gray-400 mt-2">
              Describe your day and let AI create an optimised schedule for you
            </p>
          </div>
          
          <Link
            href="/app/calendar"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <Calendar className="w-4 h-4" />
            View Calendar
          </Link>
        </div>

        <div className="grid gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              What's on your agenda today?
            </label>
            <textarea
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder="Example: I need to finish the quarterly report, attend team meeting at 2pm, review budget proposals, and prepare presentation for Friday..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
            
            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}

            <button
              onClick={handleGeneratePlan}
              disabled={loading}
              className="mt-4 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Plan
                </>
              )}
            </button>
          </div>

          {(plan || timeline.length > 0) && (
            <div className="grid md:grid-cols-2 gap-6">
              {plan && (
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Your Optimised Plan
                  </h2>
                  <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {plan}
                  </div>
                </div>
              )}

              {timeline.length > 0 && (
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Time-Blocked Schedule
                  </h2>
                  <div className="space-y-3">
                    {timeline.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex-shrink-0 w-20 text-sm font-medium text-blue-400">
                          {item.time}
                        </div>
                        <div className="flex-1 text-gray-300">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!plan && !timeline.length && !loading && (
            <div className="glass-card rounded-2xl p-12 border border-white/10 text-center">
              <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                Ready to plan your day?
              </h3>
              <p className="text-gray-500">
                Tell me about your tasks and I'll create an optimised schedule with time blocks and priorities
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
