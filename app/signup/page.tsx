"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  const onContinue = () => {
    if (!email.trim() || !agreed) return;
    localStorage.setItem("flowai_email", email.trim());
    router.push("/onboarding"); // your questions slideshow
  };

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

        {/* Consent (required) */}
        <label className="flex items-start gap-2 text-xs text-slate-600 mt-4">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
            className="mt-0.5"
          />
          <span>
            I agree to the{" "}
            <a href="/terms" className="text-blue-600 underline">Terms</a> and{" "}
            <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a>.
          </span>
        </label>

        <button
          onClick={onContinue}
          disabled={!email.trim() || !agreed}
          className={`w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-semibold px-4 py-3 rounded-lg mt-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition ${
            !email.trim() || !agreed ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          Continue →
        </button>
      </div>
    </main>
  );
}
