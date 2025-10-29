"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Temporary redirect to dashboard (you'll replace this later with Gmail auth)
    router.push("/app");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_20%_20%,#101828_0%,#0a0f1c_80%)] text-slate-100 px-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
            F
          </div>
          <h1 className="text-xl font-semibold text-slate-100">FlowAI Login</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition text-white rounded-lg px-4 py-2 font-semibold shadow-lg mt-2"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center mt-6 text-slate-500 text-xs">
          <span className="border-t border-white/10 w-16"></span>
          <span className="px-2">or</span>
          <span className="border-t border-white/10 w-16"></span>
        </div>

        {/* Continue with Google */}
        <button
          onClick={() => router.push("/app")}
          className="mt-4 w-full bg-white/10 hover:bg-white/20 text-slate-100 text-sm font-medium px-4 py-2 rounded-lg border border-white/10 transition"
        >
          Continue with Google
        </button>

        <p className="text-center text-[12px] text-slate-500 mt-6">
          © {new Date().getFullYear()} FlowAI — Focus, clarity, momentum.
        </p>
      </div>
    </main>
  );
}
