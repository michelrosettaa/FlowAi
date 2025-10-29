"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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
      // Simulate AI planning (you can connect to your API later)
      const fakePlan = `
Here's your AI-generated plan for today:

1. 9:00 AM - Review proposals and send updates.
2. 10:30 AM - Team sync (30 min)
3. 11:00 AM - Deep work: Pitch deck finalisation
4. 1:00 PM - Lunch & mental reset
5. 2:00 PM - Respond to emails
6. 3:00 PM - Gym or personal break
7. 4:00 PM - Wrap up + review tomorrow’s goals
      `;
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
    <main className="min-h-screen w-full flex flex-col items-center bg-[radial-gradient(circle_at_20%_20%,#0a0f1c_0%,#101828_80%)] text-slate-100 py-20 px-6">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-8">
        {/* LEFT: Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl"
        >
          <h1 className="text-xl font-semibold text-white mb-4">
            AI Daily Planner
          </h1>
          <p className="text-sm text-slate-400 mb-4">
            Type what you want to do today — FlowAI will create a schedule.
          </p>

          <textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="Finish proposal, email Alex, gym at 6PM..."
            rows={6}
            className="w-full bg-white/10 border border-white/10 rounded-lg p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-4"
          />

          <button
            onClick={generatePlan}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-[1.02] transition-all"
          >
            {loading ? "Generating..." : "⚡ Generate AI Plan"}
          </button>
        </motion.div>

        {/* RIGHT: Output */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl"
        >
          <h2 className="text-lg font-semibold text-white mb-3">
            Your Plan
          </h2>

          {!plan && !loading && (
            <p className="text-slate-500 text-sm">
              Your plan will appear here once generated.
            </p>
          )}

          {loading && (
            <p className="text-indigo-400 text-sm animate-pulse">
              FlowAI is building your day...
            </p>
          )}

          {plan && (
            <pre className="whitespace-pre-wrap text-sm text-slate-200 mt-2">
              {plan}
            </pre>
          )}

          {timeline.length > 0 && (
            <div className="mt-6 border-t border-white/10 pt-4">
              <h3 className="text-sm text-slate-400 mb-2">
                🕒 Timeline Overview
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {timeline.map((block, i) => (
                  <li
                    key={i}
                    className="flex justify-between bg-white/5 border border-white/10 rounded-md px-3 py-2"
                  >
                    <span className="text-indigo-400">{block.time}</span>
                    <span>{block.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
