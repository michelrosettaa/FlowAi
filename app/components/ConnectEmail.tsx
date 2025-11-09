"use client";

import { motion } from "framer-motion";

export default function ConnectEmail() {
  return (
    <section className="relative w-full py-24 px-6 md:px-10 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 text-white flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* LEFT SIDE */}
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Connect your email — automate replies
          </h2>
          <p className="text-blue-100 text-lg max-w-md mb-8">
            FlowAI can summarise, write, and schedule responses for you.
            Connect your Gmail or Outlook to start automating your inbox.
          </p>
          <button
            onClick={() => alert("Email connection coming soon!")}
            className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-all"
          >
            Connect your email — it’s free
          </button>
        </div>

        {/* RIGHT SIDE — animated preview */}
        <motion.div
          className="flex-1 bg-white/10 rounded-2xl backdrop-blur-lg border border-white/20 p-6 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-blue-100 mb-4">
            ✉️ Incoming message:
            <br />
            <span className="text-white font-semibold">
              “Can we reschedule our meeting?”
            </span>
          </p>
          <div className="bg-white/20 rounded-lg p-4 text-sm text-white">
            <p>
              <strong>AI Draft:</strong> Sure! How about tomorrow at 2 PM?
              Thanks for letting me know.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
