"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Nav from "@/components/Nav";

export default function PlanPage() {
  const [tasks, setTasks] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
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
      if (!res.ok) throw new Error(text);

      const data = JSON.parse(text);
      setPlan(data.plan || "No plan generated.");
    } catch (e: any) {
      setPlan(`Error: ${e?.message ?? e}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
        <h1 className="text-4xl font-bold mb-2 text-blue-700">FlowAI Planner</h1>
        <p className="text-gray-600 mb-6">Turn your tasks into a smart daily plan.</p>

        <div className="w-full max-w-lg space-y-3">
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={6}
            placeholder="Enter your tasks (one per line)…"
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Generating…" : "Generate Plan"}
          </button>
        </div>

        {plan && (
          <div className="mt-6 w-full max-w-lg bg-white p-4 border rounded-lg shadow">
            <h2 className="font-semibold mb-2">Your AI Plan</h2>
            <div className="prose max-w-none">
              <ReactMarkdown>{plan}</ReactMarkdown>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
