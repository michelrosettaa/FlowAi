"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    setError("");
    const isStudent = /\.ac\.uk$/i.test(email.trim());
    if (!email || !isStudent) {
      setError("Please use a valid university address (ends with .ac.uk).");
      return;
    }
    // Placeholder “sent” state
    localStorage.setItem("pendingStudentEmail", email.trim());
    setSent(true);
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 text-slate-100"
      >
        <h1 className="text-xl font-semibold mb-2">Verify student email</h1>
        <p className="text-sm text-slate-400 mb-6">
          Use your university address to unlock the Student plan (£6.99/month). We’ll confirm yearly.
        </p>

        {!sent ? (
          <>
            <input
              type="email"
              placeholder="name@university.ac.uk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {error && <p className="text-rose-300 text-xs mt-2">{error}</p>}

            <button
              onClick={handleSend}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:scale-[1.02] transition"
            >
              Send verification link
            </button>
          </>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 rounded-lg p-3 text-sm">
            Check your inbox at <span className="font-medium">{email}</span> and follow the link.
          </div>
        )}

        <p className="text-[11px] text-slate-500 mt-4">
          We never share your email. You’ll re-verify annually to keep your student rate.
        </p>
      </motion.div>
    </main>
  );
}
