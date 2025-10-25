"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [tasks, setTasks] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

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
    <main className="min-h-screen flex flex-col items-center p-6" style={{ background: "#F6F8FC" }}>
      <h1 className="text-4xl font-bold mb-4" style={{ color: "#1d4ed8" }}>FlowAI</h1>
      <p className="mb-6 text-center" style={{ color: "#475569" }}>
        Turn your tasks into a smart daily plan.
      </p>

      <textarea
        rows={6}
        placeholder="Enter your tasks…"
        value={tasks}
        onChange={(e) => setTasks(e.target.value)}
        style={{ width: "100%", maxWidth: 640, padding: 12, border: "1px solid #e5e7eb", borderRadius: 8 }}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{ marginTop: 12, padding: "10px 18px", background: "#2563eb", color: "#fff", borderRadius: 8, opacity: loading ? 0.6 : 1 }}
      >
        {loading ? "Generating..." : "Generate Plan"}
      </button>

      {plan && (
        <div style={{ marginTop: 16, width: "100%", maxWidth: 640, background: "#fff", padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
          <h2 style={{ fontWeight: 600, marginBottom: 8 }}>Your AI Plan</h2>
          <div className="prose">
            <ReactMarkdown>{plan}</ReactMarkdown>
          </div>
        </div>
      )}
    </main>
  );
}
