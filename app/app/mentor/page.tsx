"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";

export default function MentorPage() {
  const [messages, setMessages] = useState<
    { from: "you" | "mentor"; text: string }[]
  >([
    {
      from: "mentor",
      text: "Hey! I'm here to help you stay focused and motivated. Tell me what's on your mind today 👇",
    },
  ]);

  const [draft, setDraft] = useState("");

  const sendMessage = () => {
    if (!draft.trim()) return;

    const userMsg = { from: "you" as const, text: draft.trim() };

    const replyMsg = {
      from: "mentor" as const,
      text:
        "I hear you. Let's lock in one win today. Pick ONE thing that moves you forward, and I'll help you protect time for it. 💪",
    };

    setMessages((prev) => [...prev, userMsg, replyMsg]);
    setDraft("");
  };

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--app-text)' }}>
            AI Mentor
          </h1>
          <p className="text-base" style={{ color: 'var(--app-text-dim)' }}>
            Your personal productivity coach. Share what's on your mind and get focused, actionable guidance.
          </p>
        </div>

        {/* Chat Box */}
        <div 
          className="premium-card h-[400px] overflow-y-auto p-5 mb-4 space-y-4"
          style={{ background: 'var(--app-surface)' }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.from === "you" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  m.from === "you"
                    ? "text-white shadow-lg"
                    : "shadow-md"
                }`}
                style={{
                  background: m.from === "you" 
                    ? 'linear-gradient(to right, var(--app-accent), var(--app-accent-hover))' 
                    : 'var(--app-surface-hover)',
                  color: m.from === "you" ? 'white' : 'var(--app-text)',
                  border: m.from === "mentor" ? '1px solid var(--app-border)' : 'none'
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Row */}
        <div className="flex items-center gap-3 premium-card p-3">
          <input
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--app-text)' }}
            placeholder="Type how you feel, or ask for a push..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg hover:scale-105 transition-all"
            style={{
              background: 'linear-gradient(to right, var(--app-accent), var(--app-accent-hover))'
            }}
          >
            Send
          </button>
        </div>

        <div className="text-xs text-center mt-4" style={{ color: 'var(--app-text-muted)' }}>
          ✨ Coming soon: voice notes & daily audio motivation
        </div>
      </div>
    </div>
  );
}
