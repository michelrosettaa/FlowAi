"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Tell Refraim AI what matters today",
      desc: "Type your tasks, goals, meetings or stress points. You can paste your messy notes — no formatting.",
      icon: "✍️",
    },
    {
      step: "2",
      title: "We build your day for you",
      desc: "Refraim AI turns that into a realistic schedule: focus blocks, priorities, when to email people, when to rest.",
      icon: "⚡",
    },
    {
      step: "3",
      title: "You just execute",
      desc: "As your day changes, Refraim AI adapts the plan, reschedules deep work, and reminds you what actually matters.",
      icon: "🎯",
    },
  ];

  return (
    <section className="relative w-full py-20 px-6 md:px-10 flex flex-col items-center">
      {/* subtle background card */}
      <div className="absolute inset-0 max-w-6xl mx-auto left-0 right-0 rounded-3xl bg-white/60 backdrop-blur-xl border border-gray-200 shadow-[0_40px_120px_-20px_rgba(37,99,235,0.15)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl text-center flex flex-col gap-12">
        {/* header */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How Refraim AI works
          </h2>
          <p className="text-gray-600 text-base mt-3">
            It’s not “yet another task app.” It’s an operator that runs your
            day for you.
          </p>
        </div>

        {/* steps grid */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{item.icon}</div>
                <span className="text-xs font-semibold bg-blue-600 text-white rounded-md px-2 py-1 shadow">
                  Step {item.step}
                </span>
              </div>

              <div className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </div>

              {i === 1 && (
                <div className="mt-4 text-[11px] text-blue-600 font-medium bg-blue-50 border border-blue-100 rounded-md px-3 py-2 shadow-inner">
                  “Refraim AI scheduled 2h deep work 9–11am, rescheduled 1 meeting,
                  and drafted 3 follow-up emails.”
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
