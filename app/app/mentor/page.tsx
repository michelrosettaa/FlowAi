"use client";

import React, { useState } from "react";

export default function MentorPage() {
  const [messages, setMessages] = useState<
    { from: "you" | "mentor"; text: string }[]
  >([
    {
      from: "mentor",
      text: "Start a conversation — tell me how you're feeling or what you're stuck on today 👇",
    },
  ]);

  const [draft, setDraft] = useState("");

  const sendMessage = () => {
    if (!draft.trim()) return;

    const userMsg = { from: "you" as const, text: draft.trim() };

    const replyMsg = {
      from: "mentor" as const,
      text:
        "I hear you. Let's lock in one win today. Pick ONE thing that moves you forward, and I will help you protect time for it. 💪",
    };

    setMessages((prev) => [...prev, userMsg, replyMsg]);
    setDraft("");
  };

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-10 text-slate-100">
      <div className="max-w-xl w-full">
        {/* header text */}
        <div className="text-center mb-6">
          <div className="text-[15px] font-semibold text-slate-100 flex items-center justify-center gap-2">
            <span role="img" aria-label="compass">
              🧭
            </span>
            <span>FlowAI Mentor</span>
          </div>
          <div className="text-[13px] text-slate-400 mt-2">
            Tell me how you are feeling. I will answer with motivation,
            clarity, and focus.
          </div>
        </div>

        {/* chat box */}
        <div className="bg-white/5 border border-white/10 rounded-lg shadow-xl p-4 h-[320px] overflow-y-auto text-[13px] leading-relaxed mb-4 text-slate-200">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-4 ${
                m.from === "you" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block max-w-[80%] rounded-lg px-3 py-2 ${
                  m.from === "you"
                    ? "bg-indigo-600 text-white"
                    : "bg-white/10 text-slate-200 border border-white/10"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* input row */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 shadow-lg">
          <input
            className="flex-1 bg-transparent text-[13px] text-slate-100 placeholder-slate-500 outline-none"
            placeholder="Type how you feel, or ask for a push..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            className="text-[12px] font-semibold px-3 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-500 text-white hover:scale-[1.03] active:scale-[0.98] transition"
          >
            Send
          </button>
        </div>

        <div className="text-[11px] text-slate-500 text-center mt-3">
          Coming soon: voice notes & daily audio boosts.
        </div>
      </div>
    </div>
  );
}
