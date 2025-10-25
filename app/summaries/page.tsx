"use client";

import { useState } from "react";
import Nav from "@/components/Nav";

export default function SummariesPage() {
  const [notes, setNotes] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!notes.trim()) return;
    setLoading(true);
    setPlan("");
    try {
      const res = await fetch("/api/summarise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const raw = await res.text();
      if (!res.ok) { setPlan(`Server error ${res.status}: ${raw}`); return; }
      const data = JSON.parse(raw);
      setPlan(data.plan || "No result.");
    } catch (e: any) {
      setPlan(`Network error: ${e?.message ?? e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <main className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">Summaries</h1>
        <textarea
          className="w-full max-w-lg p-3 border rounded-lg"
          rows={6}
          placeholder="Paste meeting/DM notes…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          onClick={run}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Summarising…" : "Summarise"}
        </button>
        {plan && (
          <div className="mt-6 w-full max-w-lg bg-white p-4 border rounded-lg shadow">
            <h2 className="font-semibold mb-2">Result</h2>
            <pre className="whitespace-pre-wrap text-gray-700">{plan}</pre>
          </div>
        )}
      </main>
    </>
  );
}
