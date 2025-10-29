"use client";

import { motion } from "framer-motion";

export default function AnalyticsPreviewCard() {
  return (
    <motion.div
      className="w-full max-w-sm rounded-xl border border-purple-200 bg-white/80 backdrop-blur-xl shadow-xl p-4 text-left"
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-xs text-gray-500 mb-3 flex items-center justify-between">
        <span>Focus Report · This Week</span>
        <span className="text-[10px] text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
          Beta
        </span>
      </div>

      {/* top stat row */}
      <div className="grid grid-cols-2 gap-3 text-[13px] mb-4">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="text-gray-500 text-[11px]">Deep work time</div>
          <div className="text-gray-900 font-semibold text-lg leading-none">
            12.1h
          </div>
          <div className="text-green-600 text-[11px] font-medium">
            ▲ +2.4h vs last week
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="text-gray-500 text-[11px]">Meetings</div>
          <div className="text-gray-900 font-semibold text-lg leading-none">
            6.5h
          </div>
          <div className="text-red-500 text-[11px] font-medium">
            ▼ -1.1h vs last week
          </div>
        </div>
      </div>

      {/* tiny “chart” bar sim */}
      <div className="text-[11px] text-gray-500 mb-2">
        Focus consistency
      </div>
      <div className="flex items-end gap-2 h-16">
        {[60, 80, 70, 90, 50].map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-gradient-to-t from-purple-500 to-purple-300 rounded"
            style={{ height: `${h}%` }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
          />
        ))}
      </div>

      <div className="text-[11px] text-gray-500 mt-3 leading-snug">
        You’re most focused 10AM–1PM. FlowAI will protect that block.
      </div>
    </motion.div>
  );
}
