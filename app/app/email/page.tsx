"use client";

import React, { useState } from "react";
import { Mail, Sparkles, Loader2 } from "lucide-react";

export default function EmailAssistantPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = () => {
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
        "✍️ Hi there,\n\nThanks for your email — I appreciate the clarity. I'll review and follow up shortly.\n\nBest,\nFlowAI ✨";
      setOutput(reply);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-12">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--app-text)' }}>
            Email Helper
          </h1>
          <p className="text-base" style={{ color: 'var(--app-text-dim)' }}>
            Paste an email or rough notes — AI will summarize or draft smart replies instantly.
          </p>
        </div>

        {/* Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste an email you received, or write notes for a reply..."
          rows={10}
          className="w-full premium-card p-5 text-sm resize-none outline-none focus:ring-2 mb-6"
          style={{ 
            color: 'var(--app-text)',
            background: 'var(--app-surface)',
            borderColor: 'var(--app-border)',
            focusRing: '2px solid var(--app-accent)'
          }}
        />

        {/* Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={handleSummarize}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105"
            }`}
            style={{
              background: loading ? 'var(--app-surface-hover)' : 'linear-gradient(to right, var(--app-accent), var(--app-accent-hover))',
              color: 'white'
            }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Processing..." : "Summarize Email"}
          </button>

          <button
            onClick={handleDraftReply}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105"
            }`}
            style={{
              background: loading ? 'var(--app-surface-hover)' : 'linear-gradient(to right, var(--app-accent), var(--app-accent-hover))',
              color: 'white'
            }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            {loading ? "Thinking..." : "Draft Reply"}
          </button>
        </div>

        {/* Output */}
        {output && (
          <div className="premium-card p-6 text-sm leading-relaxed whitespace-pre-wrap animate-in fade-in duration-300"
            style={{ 
              background: 'var(--app-surface-hover)',
              color: 'var(--app-text)'
            }}
          >
            {output}
          </div>
        )}
      </div>
    </div>
  );
}
