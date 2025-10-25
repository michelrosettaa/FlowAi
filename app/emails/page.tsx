"use client";

import Nav from "@/components/Nav";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

type Mode = "summary" | "followups" | "report";

export default function EmailsPage() {
  const [emailText, setEmailText] = useState("");
  const [mode, setMode] = useState<Mode>("summary");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!emailText.trim()) return;
    setLoading(true);
    setOut("");
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailText, mode }),
      });
      const raw = await res.text();
      if (!res.ok) {
        setOut(`Server error ${res.status}: ${raw}`);
        return;
      }
      const data = JSON.parse(raw);
      setOut(data.result || "No result");
    } catch (e: any) {
      setOut(`Network error: ${e?.message ?? e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />

      <main className="container py-12 grid lg:grid-cols-[420px,1fr] gap-8">
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Email Automation</h2>

          <textarea
            className="w-full h-48 rounded-xl border border-stone-200 p-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste an email thread…"
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
          />

          <div className="flex items-center gap-2 mt-3">
            {(["summary", "followups", "report"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-2 rounded-lg border ${
                  mode === m ? "bg-blue-600 text-white border-blue-600" : "border-stone-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={run}
            disabled={loading}
            className="w-full h-12 mt-3 rounded-xl bg-blue-600 text-white disabled:opacity-60"
          >
            {loading ? "Working…" : "Run"}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm min-h-[280px]">
          <h2 className="text-xl font-semibold mb-4">Result</h2>
          {out ? (
            <div className="prose max-w-none">
              <ReactMarkdown>{out}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-stone-600">Output will appear here.</p>
          )}
        </div>
      </main>
    </>
  );
}
