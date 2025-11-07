// app/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const slides = [
  {
    title: "Plan your day in seconds",
    body: "FlowAI turns your tasks into a schedule that protects deep work.",
  },
  {
    title: "Email + meetings, summarised",
    body: "Auto-drafts replies and extracts action items from calls.",
  },
  {
    title: "Stay in flow",
    body: "Reminders, focus blocks, and a gentle push from the Motivator.",
  },
];

export default function SuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session_id"); // optional if you want to track it
  const [index, setIndex] = useState(0);

  // Advance slides every 2 seconds, then redirect to /loading
  useEffect(() => {
    const tick = setInterval(() => {
      setIndex((i) => {
        const next = i + 1;
        if (next >= slides.length) {
          clearInterval(tick);
          setTimeout(() => router.push("/loading"), 600); // small pause, then to /loading
        }
        return Math.min(next, slides.length - 1);
      });
    }, 2000);

    return () => clearInterval(tick);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-900 px-6">
      {/* Top confirmation */}
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle2 className="text-blue-600" size={26} />
        <h1 className="text-xl font-semibold">You’re in — trial started!</h1>
      </div>

      {/* Optional: show session id for debugging (hidden in prod) */}
      {/* <pre className="text-xs text-slate-500 mb-4 opacity-60">session_id: {sessionId}</pre> */}

      {/* Slideshow card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-lg">
        <div className="text-xs text-slate-500 mb-3">Getting you set up…</div>

        <div className="relative h-32 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <h2 className="text-lg font-semibold mb-1">{slides[index].title}</h2>
              <p className="text-slate-600 text-sm">{slides[index].body}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition ${
                i <= index ? "bg-blue-600" : "bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* Skip button (optional) */}
        <button
          onClick={() => router.push("/loading")}
          className="mt-6 text-xs text-blue-600 underline"
        >
          Skip
        </button>
      </div>
    </main>
  );
}
