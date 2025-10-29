"use client";

import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AskFlowAIPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAskFlowAI = async () => {
    if (!input.trim()) return;
    const userMsg: { role: "user"; content: string } = {
  role: "user",
  content: input,
};
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // simulate an AI response
      const reply = await new Promise<string>((resolve) =>
        setTimeout(() => {
          if (input.toLowerCase().includes("meeting")) {
            resolve("Yesterday’s meeting covered your project milestones — want me to summarise it?");
          } else if (input.toLowerCase().includes("email")) {
            resolve("I can draft an email for you — who should it go to?");
          } else if (input.toLowerCase().includes("plan")) {
            resolve("You have 3 tasks today: Finalise proposal, team sync at 2 PM, and review marketing report.");
          } else {
            resolve("Got it — I’ll take note and keep your planner updated!");
          }
        }, 1200)
      );
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#1a2545_0%,#0a0f1c_60%)] text-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="border-b border-white/10 flex justify-between items-center px-6 py-4 text-[13px]">
        <div>
          <div className="text-[11px] text-slate-400">October 2025</div>
          <div className="text-slate-100 font-semibold">Ask FlowAI</div>
        </div>

        <div className="flex items-center gap-3 text-[12px] text-slate-400">
          <button
            onClick={() => router.push("/app")}
            className="bg-white/5 border border-white/10 rounded-md px-3 py-2 hover:bg-white/10 text-slate-200"
          >
            ← Back to Dashboard
          </button>
          <div className="text-[12px] text-slate-500">you@company.com</div>
        </div>
      </header>

      {/* CHAT INTERFACE */}
      <section className="flex-1 flex flex-col justify-between p-6 max-w-3xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 text-sm">
          {messages.length === 0 ? (
            <p className="text-slate-500 text-center mt-12">
              💬 Ask FlowAI anything about your planner, meetings, or tasks.
            </p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-xl ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 border border-white/10 text-slate-200"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs mt-2">
              <Loader2 className="w-3 h-3 animate-spin" /> FlowAI is thinking...
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAskFlowAI()}
            placeholder="Ask FlowAI about your planner..."
            className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500"
          />
          <button
            onClick={handleAskFlowAI}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:scale-[1.03] transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </section>
    </main>
  );
}
