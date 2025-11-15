"use client";

import { motion } from "framer-motion";

export default function EmailPreviewCard() {
  return (
    <motion.div
      className="w-full max-w-sm rounded-xl border border-indigo-200 bg-white/80 backdrop-blur-xl shadow-xl p-4 text-left"
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-xs text-gray-500 mb-2 flex items-center justify-between">
        <span>Inbox · 3 new</span>
        <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
          Drafted by Refraim AI
        </span>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-3 text-[13px] mb-3">
        <div className="text-gray-800 font-medium mb-1">
          Re: Next steps on the contract
        </div>
        <div className="text-gray-500 text-[12px] mb-2">
          From Sarah • 5m ago
        </div>
        <div className="text-gray-700 leading-relaxed bg-gray-50 border border-gray-200 rounded p-2">
          Refraim AI’s draft:  
          <br />
          “Hi Sarah — thanks for sending this over. I’ve reviewed the terms and
          I’m good with timeline and scope. I’ll send the signed version today.”
        </div>
      </div>

      <div className="flex items-center justify-between text-[12px] text-gray-600">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          <span>Reply ready</span>
        </div>
        <button className="text-indigo-600 font-medium hover:underline">
          Approve & Send →
        </button>
      </div>
    </motion.div>
  );
}
