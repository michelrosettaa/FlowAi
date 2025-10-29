"use client";

import { useState } from "react";
import { Loader2, Upload, FileText } from "lucide-react";

export default function CallSummariserPage() {
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarise = async () => {
    if (!transcript.trim()) return alert("Please paste or upload a transcript first.");
    setLoading(true);
    setSummary("");

    try {
      // This will later call your OpenAI API route
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
    <main className="flex-1 flex flex-col items-center justify-start p-10 text-slate-100">
      <h1 className="text-2xl font-semibold mb-6">AI Call Summariser</h1>
      <p className="text-slate-400 text-sm mb-6 text-center max-w-md">
        Paste your meeting transcript below or upload a text file — FlowAI will summarise
        key decisions, action items, and next steps.
      </p>

      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Paste your call transcript here..."
        rows={10}
        className="w-full max-w-2xl border border-white/10 rounded-xl bg-white/5 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSummarise}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-2 rounded-lg font-semibold text-white text-sm hover:scale-[1.03] transition flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          {loading ? "Summarising..." : "Summarise Call"}
        </button>

        <label className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm cursor-pointer hover:bg-white/10 transition flex items-center gap-2">
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

      {summary && (
        <div className="mt-10 bg-white/5 border border-white/10 rounded-xl p-6 max-w-2xl text-sm leading-relaxed">
          <h2 className="text-lg font-semibold mb-3 text-blue-400">Summary</h2>
          <p className="whitespace-pre-wrap text-slate-200">{summary}</p>
        </div>
      )}
    </main>
  );
}
