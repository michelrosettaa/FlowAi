"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function MentorPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const router = useRouter();

  const motivationalPhrases = [
    "Stay consistent — even small wins compound fast.",
    "Remember, your focus is your most valuable asset.",
    "Every task you finish today is one less weight tomorrow.",
    "Momentum beats motivation. Keep going.",
    "You're building something meaningful, one block at a time.",
  ];

  const handleInspire = () => {
    const phrase =
      motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
    setResponse(phrase);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#1a2545_0%,#0a0f1c_60%)] text-slate-100 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center"
      >
        <h1 className="text-2xl font-semibold text-white mb-3">Your AI Motivator</h1>
        <p className="text-sm text-slate-400 mb-8">
          Refraim AI Motivator provides motivational boosts and focus guidance.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Tell Refraim AI what's on your mind..."
          className="w-full h-28 rounded-lg border border-white/10 bg-white/5 text-slate-100 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />

        <button
          onClick={handleInspire}
          className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold py-2 rounded-lg hover:scale-[1.03] transition-all"
        >
          Inspire Me
        </button>

        {response && (
          <div className="mt-6 bg-white/10 border border-white/10 rounded-lg p-4 text-slate-100 text-sm">
            {response}
          </div>
        )}

        <button
          onClick={() => router.push("/app")}
          className="mt-8 text-xs text-slate-400 underline hover:text-slate-200 transition"
        >
          ← Back to Planner
        </button>
      </motion.div>
    </main>
  );
}
