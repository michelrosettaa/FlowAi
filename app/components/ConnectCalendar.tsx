"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ConnectCalendar() {
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    // Simulate connection flow for now (mock)
    setTimeout(() => {
      setConnected(true);
    }, 1200);
  };

  return (
    <section className="relative w-full py-20 px-6 md:px-10 flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 border-t border-indigo-100">
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Sync your <span className="text-blue-600">Calendar</span> with Refraim AI
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Let Refraim AI automatically plan your deep work sessions and meetings
          around your real schedule.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex flex-col items-center justify-center gap-6 bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-10"
        >
          {!connected ? (
            <>
              <img
                src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                alt="calendar icon"
                className="w-14 h-14 opacity-80"
              />
              <p className="text-gray-700 font-medium text-base">
                Connect your Google or Outlook calendar to Refraim AI
              </p>
              <button
                onClick={handleConnect}
                className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Connect Calendar →
              </button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="text-5xl mb-4">✅</div>
              <p className="text-green-600 font-semibold text-lg">
                Calendar connected successfully!
              </p>
              <p className="text-gray-600 mt-2 text-sm">
                Refraim AI will now optimize your focus sessions based on meetings.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
