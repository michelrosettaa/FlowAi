"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  // Restore tasks/plan on refresh
  useEffect(() => {
    const t = localStorage.getItem("flowai_tasks");
    const p = localStorage.getItem("flowai_plan");
    if (t) setTasks(t);
    if (p) setPlan(p);
  }, []);

  // Persist to localStorage
  useEffect(() => localStorage.setItem("flowai_tasks", tasks), [tasks]);
  useEffect(() => localStorage.setItem("flowai_plan", plan), [plan]);

  // Support pre-filling via ?tasks= in the URL
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("tasks");
    if (q) setTasks(decodeURIComponent(q));
  }, []);

  const handleGenerate = async () => {
    if (!tasks.trim()) return;
    setLoading(true);
    setPlan("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasksText: tasks }),
      });

      const text = await res.text();
      if (!res.ok) {
        setPlan(`Server error ${res.status}: ${text}`);
        return;
      }

      const data = JSON.parse(text);
      setPlan(data.plan || "No plan generated.");
    } catch (e: any) {
      setPlan(`Network error: ${e?.message ?? e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">FlowAI Planner</h1>
      <p className="text-gray-600 mb-6 text-center">
        Turn your tasks into a smart daily plan.
      </p>

      <textarea
        className="w-full max-w-lg p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={6}
        placeholder="Enter your tasks..."
        value={tasks}
        onChange={(e) => setTasks(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Plan"}
      </button>

      {plan && (
        <div className="mt-6 w-full max-w-lg bg-white p-4 border rounded-lg shadow">
          <h2 className="font-semibold mb-2">Your AI Plan</h2>
          <ReactMarkdown className="prose prose-sm max-w-none">{plan}</ReactMarkdown>
        </div>
      )}
    </main>
  );
}
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      {/* rest of your planner page */}
    </>
  );
}
