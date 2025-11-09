// app/signup/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const plan = (params.get("plan") || "pro").toLowerCase(); // default pro
  const [email, setEmail] = useState("");

  // Utility: set short-lived cookie (30 min)
  const setCookie = (name: string, value: string) => {
    const expires = new Date(Date.now() + 30 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Expires=${expires}; SameSite=Lax`;
  };

  const onContinue = () => {
    if (!email.trim()) return;
    setCookie("fa_email", email.trim());
    setCookie("fa_plan", plan);
    router.push(`/onboarding?plan=${plan}`);
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
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
        />

        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-semibold px-4 py-3 rounded-lg mt-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition"
        >
          Continue →
        </button>

        <div className="mt-4 text-center">
          <a
            href={`/api/auth/signin/google?callbackUrl=${encodeURIComponent(
              `/onboarding?plan=${plan}`
            )}`}
            className="inline-block text-sm text-indigo-600 hover:underline"
          >
            Or continue with Google
          </a>
        </div>
      </div>
    </main>
  );
}
