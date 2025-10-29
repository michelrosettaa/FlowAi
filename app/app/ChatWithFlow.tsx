"use client";

import { useState } from "react";

export default function ChatWithFlow() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<
    { from: "you" | "flow"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setLoading(true);

    setHistory((h) => [...h, { from: "you", text: userMsg }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      setHistory((h) => [
        ...h,
        { from: "flow", text: data.reply || "..." },
      ]);
    } catch (err) {
      setHistory((h) => [
        ...h,
        { from: "flow", text: "I couldn't respond. Try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="font-semibold text-gray-800 mb-2 text-base flex items-center gap-2">
        <span className="text-blue-600 text-lg">💬</span>
        <span>Chat with Flow</span>
      </div>
      <p className="text-gray-600 text-[13px] mb-4 leading-relaxed">
        Ask me anything: “Help me plan my day”, “Reschedule my calls”, “Draft an email”.
      </p>

      <div className="bg-white/60 border border-gray-200 rounded-xl p-3 h-40 overflow-y-auto text-[13px] text-gray-800 space-y-3">
        {history.length === 0 && (
          <div className="text-gray-400 italic">
            Flow is ready to chat.
          </div>
        )}
        {history.map((msg, i) => (
          <div key={i} className={msg.from === "you" ? "text-right" : "text-left"}>
            <div
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.from === "you"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 border border-gray-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
          placeholder="Ask Flow..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
