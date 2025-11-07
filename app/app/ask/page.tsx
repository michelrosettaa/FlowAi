"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";

export default function AskFlowAI() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey there 👋 I'm FlowAI — how can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // 🔧 Replace this with your real API call later (OpenAI, Gemini, etc.)
      const reply = {
        role: "assistant",
        content: `I’m still learning, but here’s what I think about "${userMessage.content}" 🤔`,
      };

      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops — I had trouble responding just now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b1020] text-slate-100">
      {/* HEADER */}
      <header className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Ask FlowAI</h1>
        <p className="text-xs text-slate-400">Your AI productivity mentor 💬</p>
      </header>

      {/* CHAT WINDOW */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2 rounded-xl text-sm leading-relaxed ${
              msg.role === "assistant"
                ? "bg-white/10 text-slate-100 self-start"
                : "bg-blue-600 text-white self-end ml-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="text-slate-400 text-sm animate-pulse">
            FlowAI is thinking...
          </div>
        )}
      </div>

      {/* INPUT BAR */}
      <footer className="border-t border-white/10 p-4 flex items-center gap-2 bg-[#0d152a]">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask FlowAI anything..."
          className="flex-1 bg-transparent resize-none text-sm text-slate-200 p-2 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 min-h-[40px]"
          rows={1}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
        >
          <Send size={18} />
        </button>
      </footer>
    </div>
  );
}
