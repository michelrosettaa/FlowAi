"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Sparkles, Loader2 } from "lucide-react";

export default function AIPlanner() {
  const [tasks, setTasks] = useState("");
  const [plan, setPlan] = useState("");
  const [timeline, setTimeline] = useState<
    { time: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!tasks.trim()) return alert("Please enter your tasks first.");
    setLoading(true);
    setPlan("");
    setTimeline([]);

    try {
      const fakePlan = `Here's your AI-generated plan for today:

1. 9:00 AM - Review proposals and send updates.
2. 10:30 AM - Team sync (30 min)
3. 11:00 AM - Deep work: Pitch deck finalisation
4. 1:00 PM - Lunch & mental reset
5. 2:00 PM - Respond to emails
6. 3:00 PM - Gym or personal break
7. 4:00 PM - Wrap up + review tomorrow's goals`;

      const fakeTimeline = [
        { time: "9:00 AM", label: "Review proposals" },
        { time: "10:30 AM", label: "Team sync (30 min)" },
        { time: "11:00 AM", label: "Deep work: Pitch deck" },
        { time: "1:00 PM", label: "Lunch & reset" },
        { time: "2:00 PM", label: "Emails & outreach" },
        { time: "3:00 PM", label: "Gym break" },
        { time: "4:00 PM", label: "Wrap up" },
      ];

      setTimeout(() => {
        setPlan(fakePlan);
        setTimeline(fakeTimeline);
        setLoading(false);
      }, 1200);
    } catch (err) {
      setPlan("Error generating plan. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
          <Calendar className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--app-text)' }}>
          AI Daily Planner
        </h1>
        <p className="text-base" style={{ color: 'var(--app-text-dim)' }}>
          Tell me what you want to accomplish today — I'll create a perfect schedule for you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT: Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-6"
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--app-text)' }}>
            What's on your plate today?
          </h2>

          <textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="Finish proposal, email Alex, gym at 6PM, review budget..."
            rows={8}
            className="w-full p-4 text-sm rounded-xl outline-none resize-none mb-4"
            style={{
              background: 'var(--app-surface-hover)',
              border: '1px solid var(--app-border)',
              color: 'var(--app-text)'
            }}
          />

          <button
            onClick={generatePlan}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
            style={{
              background: 'linear-gradient(to right, var(--app-accent), var(--app-accent-hover))'
            }}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? "Generating..." : "Generate AI Plan"}
          </button>
        </motion.div>

        {/* RIGHT: Output */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-6"
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--app-text)' }}>
            Your Plan
          </h2>

          {!plan && !loading && (
            <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
              Your plan will appear here once generated.
            </p>
          )}

          {loading && (
            <p className="text-sm animate-pulse flex items-center gap-2" style={{ color: 'var(--app-accent)' }}>
              <Loader2 className="w-4 h-4 animate-spin" />
              FlowAI is building your perfect day...
            </p>
          )}

          {plan && (
            <div>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed mb-6" style={{ color: 'var(--app-text)' }}>
                {plan}
              </pre>

              {timeline.length > 0 && (
                <div className="pt-6" style={{ borderTop: '1px solid var(--app-border)' }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--app-text-dim)' }}>
                    🕒 Timeline Overview
                  </h3>
                  <div className="space-y-2">
                    {timeline.map((block, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center px-4 py-2.5 rounded-lg text-sm"
                        style={{
                          background: 'var(--app-surface-hover)',
                          border: '1px solid var(--app-border)'
                        }}
                      >
                        <span className="font-medium" style={{ color: 'var(--app-text)' }}>{block.label}</span>
                        <span className="text-xs" style={{ color: 'var(--app-text-muted)' }}>{block.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
