"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";

export default function AskFlowAIPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hey! I’m FlowAI — your personal productivity mentor. Ask me anything about planning your day, studying smarter, or staying focused.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { role: "user", content: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    // Simulate AI response (replace with API later)
    setTimeout(() => {
      const response =
        "✨ Here’s a thought: Break that into 3 small steps and schedule them across your day. You’ll feel more in control and less overwhelmed.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0a0f1c] text-slate-100">
      <header className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">💬 Ask FlowAI</h1>
        <p className="text-slate-400 text-sm">Your personal AI mentor</p>
      </header>

      {/* Chat Area */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-4 py-3 rounded-2xl ${
              m.role === "user"
                ? "bg-blue-600 text-white self-end"
                : "bg-white/5 text-slate-200 self-start"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="text-slate-500 text-sm italic">
            FlowAI is thinking...
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="border-t border-white/10 p-4 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask FlowAI anything..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:scale-[1.05] transition px-4 py-2 rounded-xl text-white shadow-md"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
