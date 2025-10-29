"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    icon: "🧠",
    title: "AI Daily Planner",
    desc: "Automatically builds your schedule from your tasks and syncs it with your calendar for deep focus.",
    preview: "/dashboard/ai-planner.svg",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    icon: "📅",
    title: "Smart Calendar Sync",
    desc: "Connect Google or Outlook and let FlowAI plan deep work around your real meetings.",
    preview: "/dashboard/calendar-sync.svg",
    gradient: "from-indigo-400 to-purple-500",
  },
  {
    icon: "✉️",
    title: "Email Automation",
    desc: "Drafts, summarizes, and schedules your emails for you — so your focus never breaks.",
    preview: "/dashboard/email-ai.svg",
    gradient: "from-pink-400 to-red-500",
  },
  {
    icon: "🎯",
    title: "Focus Mode & Mentor",
    desc: "Stay accountable with an AI mentor that tracks your flow and sends encouragement throughout your day.",
    preview: "/dashboard/focus-mode.svg",
    gradient: "from-green-400 to-emerald-500",
  },
  {
    icon: "📞",
    title: "AI Call Summariser",
    desc: "Instantly summarizes meetings into action plans and next steps — powered by AI.",
    preview: "/dashboard/call-summary.svg",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    icon: "📊",
    title: "Productivity Analytics",
    desc: "See deep work vs meetings, energy trends, and your weekly progress — all visualized beautifully.",
    preview: "/dashboard/analytics.svg",
    gradient: "from-sky-400 to-cyan-500",
  },
];

export default function FeatureShowcase() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="features"
      className="relative z-10 flex flex-col items-center justify-center text-center py-24 px-6"
    >
      {/* === Heading === */}
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
        Built for focus, powered by AI.
      </h2>
      <p className="text-gray-600 max-w-2xl mb-14">
        Every feature in FlowAI works together to plan, protect, and optimize your time —
        automatically.
      </p>

      {/* === Two-column layout === */}
      <div className="grid md:grid-cols-2 gap-16 max-w-7xl w-full items-center">
        {/* === Feature List === */}
        <div className="flex flex-col gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              onClick={() => setActive(i)}
              className={`cursor-pointer rounded-xl p-5 text-left border transition-all duration-300 ${
                active === i
                  ? "bg-blue-50 border-blue-300 shadow-lg scale-[1.02]"
                  : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm"
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">{feature.icon}</span> {feature.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* === Feature Preview === */}
        <div className="relative flex justify-center items-center">
          {/* Animated gradient glow */}
          <div
            className={`absolute inset-0 blur-3xl opacity-40 bg-gradient-to-r ${features[active].gradient} rounded-full`}
          ></div>

          {/* Animated dashboard mockup */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative z-10"
            >
              <motion.img
                src={features[active].preview}
                alt={features[active].title}
                className="rounded-2xl shadow-2xl w-[420px] h-[280px] object-contain border border-gray-200 bg-white/80 backdrop-blur-sm transition-transform duration-500"
                whileHover={{ scale: 1.03 }}
              />
              <p className="text-gray-500 text-sm mt-4 italic">
                {features[active].title} in action
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
