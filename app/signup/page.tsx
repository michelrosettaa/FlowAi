"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl w-full max-w-md p-6">
        <h1 className="text-xl font-semibold text-slate-900 text-center">
          Start your free trial
        </h1>
        <p className="text-sm text-slate-600 text-center mt-2">
          FlowAI will build your daily plan, protect your focus, and draft emails for you.
        </p>

        <label className="block text-xs font-medium text-slate-700 mt-6 mb-2">
          Work email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
        />

        <button
          onClick={() => {
            if (!email.trim()) return;
            // store in localStorage for now (mock)
            localStorage.setItem("flowai_email", email.trim());
            router.push("/onboarding");
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-semibold px-4 py-3 rounded-lg mt-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition"
        >
          Continue →
        </button>

        <p className="text-[11px] text-slate-500 text-center mt-4 leading-relaxed">
          No credit card required.
        </p>
      </div>
    </main>
  );
}
