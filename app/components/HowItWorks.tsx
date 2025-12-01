"use client";

import { motion } from "framer-motion";
import { PenLine, Zap, CheckCircle2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Tell Refraim what matters today",
      desc: "Type your tasks, goals, meetings or stress points. You can paste your messy notes — no formatting needed.",
      icon: PenLine,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      step: "2",
      title: "We build your day for you",
      desc: "Refraim AI turns that into a realistic schedule: focus blocks, priorities, when to email people, when to rest.",
      icon: Zap,
      gradient: "from-purple-500 to-pink-600",
    },
    {
      step: "3",
      title: "You just execute",
      desc: "As your day changes, Refraim AI adapts the plan, reschedules deep work, and reminds you what actually matters.",
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-green-600",
    },
  ];

  return (
    <section className="relative w-full py-24 px-6 md:px-10 flex flex-col items-center">
      <div className="absolute inset-0 max-w-6xl mx-auto left-0 right-0 rounded-3xl bg-gradient-to-b from-white/80 to-gray-50/80 backdrop-blur-xl border border-gray-100 shadow-[0_40px_120px_-20px_rgba(37,99,235,0.1)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl text-center flex flex-col gap-14">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            How It Works
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Your AI-powered daily operator
          </h2>
          <p className="text-gray-500 text-lg mt-4">
            It's not "yet another task app." It's an operator that runs your day for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          {steps.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold bg-gray-900 text-white rounded-lg px-3 py-1.5 shadow">
                    Step {item.step}
                  </span>
                </div>

                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </div>
                <div className="text-sm text-gray-500 leading-relaxed flex-1">
                  {item.desc}
                </div>

                {i === 1 && (
                  <div className="mt-5 text-xs text-blue-600 font-medium bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                    "Refraim scheduled 2h deep work 9-11am, rescheduled 1 meeting, and drafted 3 follow-up emails."
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
