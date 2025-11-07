"use client";

import React, { useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { Sparkles } from "lucide-react";

export default function MotivatorPage() {
  const { addNotification } = useNotifications?.() || { addNotification: () => {} };

  useEffect(() => {
    // Sends a motivational message when user opens the page
    addNotification?.("You're doing great — stay consistent today 💪", "mentor");
  }, [addNotification]);

  const quotes = [
    "Small progress each day adds up to big results.",
    "Discipline beats motivation — show up for yourself.",
    "You have 24 hours today — use them intentionally.",
    "Focus on progress, not perfection.",
    "Every expert was once a beginner.",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b1020] text-slate-100 px-6">
      <div className="max-w-2xl text-center space-y-6">
        <Sparkles className="mx-auto text-blue-400 w-8 h-8" />
        <h1 className="text-3xl font-bold">FlowAI Motivator</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Your personal AI motivator — here to keep your energy, focus, and drive alive.
        </p>

        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">
            💡 Today’s Motivation
          </h2>
          <p className="text-slate-200 italic text-base">
            “{quotes[Math.floor(Math.random() * quotes.length)]}”
          </p>
        </div>

        <div className="mt-10 text-sm text-slate-400">
          Need a boost? Ask FlowAI in the{" "}
          <span
            onClick={() => (window.location.href = "/app/ask")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Ask FlowAI
          </span>{" "}
          chat anytime.
        </div>
      </div>
    </div>
  );
}
