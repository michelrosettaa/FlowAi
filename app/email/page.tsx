"use client";

import React, { useState } from "react";
import AppShell from "../dashboard/AppShell";

export default function EmailAssistantPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSummarize() {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");

    // fake AI response
    setTimeout(() => {
      const summary =
        input.length < 120
          ? "Summary: Quick update, nothing urgent. You're good 👍"
          : "Summary: Sender requests follow-up, mentions next steps, and expects a response today.";
      setOutput(summary);
      setLoading(false);
    }, 700);
  }

  function handleDraftReply() {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");

    // fake AI reply
    setTimeout(() => {
      const reply =
        "Hi there,\n\nThanks for the update — I appreciate the detail. I'll review and circle back shortly with next steps.\n\nBest,\nRefraim AI ✨";
      setOutput(reply);
      setLoading(false);
    }, 800);
  }

  return (
    <AppShell>
      {/* This is the content area on the right side */}
      <main className="flex-1 flex flex-col items-center px-6 py-10 text-slate-100">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold mb-2">✉️ Refraim AI Email Assistant</h1>
            <p className="text-slate-400 text-sm">
              Paste an email or your notes. Refraim AI can summarize or draft a reply in your voice.
            </p>
          </div>

          {/* Input */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste an email you got… or write rough bullet points and let Refraim AI reply for you."
            rows={8}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-inner"
          />

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <button
              onClick={handleSummarize}
              disabled={loading}
              className={
                "px-6 py-2 rounded-lg text-sm font-semibold shadow-md transition-all " +
                (loading
                  ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-blue-600 hover:scale-[1.03] text-white")
              }
            >
              {loading ? "Summarising..." : "🧠 Summarise Email"}
            </button>

            <button
              onClick={handleDraftReply}
              disabled={loading}
              className={
                "px-6 py-2 rounded-lg text-sm font-semibold shadow-md transition-all " +
                (loading
                  ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-500 hover:scale-[1.03] text-white")
              }
            >
              {loading ? "Writing..." : "✍️ Draft Reply"}
            </button>
          </div>

          {/* Output */}
          {output && (
            <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-5 text-sm leading-relaxed text-slate-200 shadow-xl whitespace-pre-wrap">
              {output}
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
