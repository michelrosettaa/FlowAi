"use client";

import React, { useState } from "react";

export default function EmailAssistantPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarise = () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");

    setTimeout(() => {
      const summary =
        input.length < 100
          ? "🧠 This email is short and to the point. No major follow-up needed."
          : "🧠 Summary: The sender shares updates, requests feedback, and suggests next steps.";
      setOutput(summary);
      setLoading(false);
    }, 700);
  };

  const handleDraftReply = () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");

    setTimeout(() => {
      const reply =
        "✍️ Hi there,\n\nThanks for your email — I appreciate the clarity. I’ll review and follow up shortly.\n\nBest,\nFlowAI ✨";
      setOutput(reply);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 text-slate-100">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          ✉️ FlowAI Email Assistant
        </h1>
        <p className="text-slate-400 text-sm mb-8 text-center">
          Paste an email or rough notes — FlowAI can summarise or draft replies instantly.
        </p>

        {/* Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste an email you received, or write notes for a reply..."
          rows={8}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-inner"
        />

        {/* Buttons */}
        <div className="flex gap-4 mt-4 justify-center">
          <button
            onClick={handleSummarise}
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-sm font-semibold shadow-md transition-all ${
              loading
                ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-blue-600 hover:scale-[1.03] text-white"
            }`}
          >
            {loading ? "Processing..." : "🧠 Summarise Email"}
          </button>

          <button
            onClick={handleDraftReply}
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-sm font-semibold shadow-md transition-all ${
              loading
                ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-500 hover:scale-[1.03] text-white"
            }`}
          >
            {loading ? "Thinking..." : "✍️ Draft Reply"}
          </button>
        </div>

        {/* Output */}
        {output && (
          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-5 text-sm leading-relaxed text-slate-200 shadow-xl whitespace-pre-wrap">
            {output}
          </div>
        )}
      </div>
    </div>
  );
}
