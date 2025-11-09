"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const plan = params.get("plan") || "pro";

  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // If user just logged in with Google, prefill email
  useEffect(() => {
    if (session?.user?.email) setEmail(session.user.email);
  }, [session]);

  async function goStripe(e?: React.FormEvent) {
    e?.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else if (data?.error) {
        setMsg(data.error);
      } else {
        setMsg("Something went wrong. Please try again.");
      }
    } catch (err) {
      setMsg("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl w-full max-w-md p-6">
        <h1 className="text-xl font-semibold text-slate-900 text-center">Start Your Free Trial</h1>
        <p className="text-sm text-slate-600 text-center mt-2">
          You’re subscribing to the <b>{plan === "team" ? "Teams" : "Pro"}</b> plan with a 7-day free trial.
        </p>

        <form onSubmit={goStripe} className="mt-6">
          <label className="block text-xs font-medium text-slate-700 mb-2">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-semibold px-4 py-3 rounded-lg mt-4 shadow-md hover:shadow-lg hover:scale-[1.02] transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing…" : "Continue"}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
          <div className="h-px bg-slate-200 flex-1" />
          or
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: `/checkout?plan=${plan}` })}
          className="w-full border border-slate-300 bg-white text-slate-800 text-sm font-semibold px-4 py-3 rounded-lg mt-3 shadow-sm hover:bg-slate-50 transition"
        >
          Continue with Google
        </button>

        {msg && <p className="text-xs text-rose-500 mt-3 text-center">{msg}</p>}

        <p
          className="text-[11px] text-slate-500 text-center mt-4 cursor-pointer"
          onClick={() => router.push("/pricing")}
        >
          ← Back to pricing
        </p>
      </div>
    </main>
  );
}
