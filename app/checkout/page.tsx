"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const plan = params.get("plan") || "student"; // fallback

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to start checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <div className="bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl p-10 w-full max-w-md text-center border border-slate-200 relative z-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Start Your Free Trial
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          You’re subscribing to the{" "}
          <span className="font-semibold text-indigo-600 capitalize">
            {plan}
          </span>{" "}
          plan with a 7-day free trial.
        </p>

        {/* ✅ Form section */}
        <form
          onSubmit={handleCheckout}
          className="flex flex-col gap-4 relative z-20"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-white text-slate-900"
            required
          />

          <button
            type="submit"
            disabled={loading || !email}
            className={`bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-3 rounded-lg font-semibold text-sm shadow-lg hover:scale-[1.02] transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Start Free Trial →"}
          </button>
        </form>

        <button
          onClick={() => router.push("/pricing")}
          className="mt-6 text-slate-500 text-xs underline hover:text-slate-700 transition"
        >
          ← Back to pricing
        </button>
      </div>
    </main>
  );
}
