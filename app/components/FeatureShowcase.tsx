"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Calendar, Mail, Target, Phone, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Daily Planner",
    desc: "Automatically builds your schedule from your tasks and syncs it with your calendar for deep focus.",
    preview: "/dashboard/ai-planner.svg",
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
  },
  {
    icon: Calendar,
    title: "Smart Calendar Sync",
    desc: "Connect Google or Outlook and let Refraim AI plan deep work around your real meetings.",
    preview: "/dashboard/calendar-sync.svg",
    gradient: "from-indigo-500 to-purple-600",
    iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600",
  },
  {
    icon: Mail,
    title: "Email Automation",
    desc: "Drafts, summarises, and schedules your emails for you — so your focus never breaks.",
    preview: "/dashboard/email-ai.svg",
    gradient: "from-pink-500 to-rose-600",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
  {
    icon: Target,
    title: "Focus Mode & Motivator",
    desc: "Stay accountable with an AI motivator that tracks your flow and sends encouragement throughout your day.",
    preview: "/dashboard/focus-mode.svg",
    gradient: "from-emerald-500 to-green-600",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
  },
  {
    icon: Phone,
    title: "AI Call Summariser",
    desc: "Instantly summarises meetings into action plans and next steps — powered by AI.",
    preview: "/dashboard/call-summary.svg",
    gradient: "from-amber-500 to-orange-600",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
  },
  {
    icon: BarChart3,
    title: "Productivity Analytics",
    desc: "See deep work vs meetings, energy trends, and your weekly progress — all visualised beautifully.",
    preview: "/dashboard/analytics.svg",
    gradient: "from-cyan-500 to-blue-600",
    iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600",
  },
];

export default function FeatureShowcase() {
  const [active, setActive] = useState(0);
  const IconComponent = features[active].icon;

  return (
    <section
      id="features"
      className="relative z-10 flex flex-col items-center justify-center text-center py-28 px-6"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        Core Features
      </div>
      
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
        Built for focus, powered by AI
      </h2>
      <p className="text-gray-500 max-w-2xl mb-16 text-lg">
        Every feature in Refraim AI works together to plan, protect, and optimise your time — automatically.
      </p>

      <div className="grid lg:grid-cols-2 gap-12 max-w-7xl w-full items-start">
        <div className="flex flex-col gap-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                onClick={() => setActive(i)}
                className={`cursor-pointer rounded-2xl p-5 text-left transition-all duration-300 ${
                  active === i
                    ? "bg-white shadow-xl border-2 border-blue-200"
                    : "bg-white/60 border border-gray-100 hover:bg-white hover:shadow-md"
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${feature.iconBg} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="relative flex justify-center items-center lg:sticky lg:top-24">
          <div
            className={`absolute inset-0 blur-[100px] opacity-30 bg-gradient-to-r ${features[active].gradient} rounded-full`}
          ></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative z-10 w-full"
            >
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${features[active].iconBg} flex items-center justify-center`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800">{features[active].title}</span>
                </div>
                <div className="p-6">
                  <motion.img
                    src={features[active].preview}
                    alt={features[active].title}
                    className="w-full h-[260px] object-contain"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
