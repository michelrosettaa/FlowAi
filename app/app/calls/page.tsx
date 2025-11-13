"use client";

import { useState } from "react";
import { Loader2, Upload, FileText, PhoneCall } from "lucide-react";

export default function CallSummariserPage() {
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarise = async () => {
    if (!transcript.trim()) return alert("Please paste or upload a transcript first.");
    setLoading(true);
    setSummary("");

    try {
      const res = await fetch("/api/summarise-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const data = await res.json();
      if (data.summary) setSummary(data.summary);
      else setSummary("Something went wrong. Try again.");
    } catch {
      setSummary("Error processing call. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
          <PhoneCall className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--app-text)' }}>
          Call Summaries
        </h1>
        <p className="text-base max-w-2xl" style={{ color: 'var(--app-text-dim)' }}>
          Paste your meeting transcript or upload a text file — AI will summarize key decisions, action items, and next steps.
        </p>
      </div>

      {/* Input Area */}
      <div className="max-w-4xl">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your call transcript here..."
          rows={12}
          className="w-full premium-card p-5 text-sm outline-none resize-none mb-6"
          style={{
            background: 'var(--app-surface)',
            color: 'var(--app-text)'
          }}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 mb-10">
          <button
            onClick={handleSummarise}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm shadow-lg transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
            style={{
              background: 'linear-gradient(to right, var(--app-accent), var(--app-accent-hover))'
            }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {loading ? "Summarising..." : "Summarise Call"}
          </button>

          <label className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium cursor-pointer hover:scale-105 transition-all premium-card">
            <Upload className="w-4 h-4" /> Upload File
            <input
              type="file"
              accept=".txt"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const text = await file.text();
                  setTranscript(text);
                }
              }}
            />
          </label>
        </div>

        {/* Summary Output */}
        {summary && (
          <div className="premium-card p-6 text-sm leading-relaxed animate-in fade-in">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--app-accent)' }}>
              <FileText className="w-5 h-5" />
              Summary
            </h2>
            <p className="whitespace-pre-wrap" style={{ color: 'var(--app-text)' }}>{summary}</p>
          </div>
        )}
      </div>
    </main>
  );
}
