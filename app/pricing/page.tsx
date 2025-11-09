"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCheckout(plan: string) {
    const email = prompt("Enter your email to start your free trial:");
    if (!email) return;
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
        alert("Error starting checkout. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to start checkout.");
    } finally {
      setLoading(false);
    }
  }

  const plans = [
    {
      name: "Free",
      price: "£0",
      description: "Perfect for getting started with FlowAI.",
      features: [
        "Basic AI Mentor",
        "Simple Task Planner",
        "Focus Mode (Limited)",
        "Community Support",
        "7 day trial of Professional features",
      ],
      button: "Get Started",
      color: "from-slate-400 to-slate-600",
      path: "/onboarding",
      highlight: false,
    },
    {
      name: "Student",
      price: "£6.99",
      description: "Verified student plan with all core features.",
      features: [
        "Full AI Motivator Access",
        "Smart Task Scheduler",
        "Focus Mode + Reminders",
        "Email Productivity Tools",
        "Student Verification Required",
      ],
      button: "Verify Student Email",
      color: "from-blue-500 to-indigo-500",
      path: "/verify",
      highlight: false,
    },
    {
      name: "Professional",
      price: "£8.99",
      description: "For working professionals who want to stay in flow.",
      features: [
        "Advanced AI Motivator",
        "Smart Planner + Calendar Sync",
        "Focus Analytics Dashboard",
        "Email + Meeting Summaries",
      ],
      button: "Start Free Trial",
      color: "from-sky-500 to-blue-600",
      path: "pro",
      highlight: true,
      badge: "Most Popular",
    },
    {
      name: "Teams (Up to 5)",
      price: "£18.99",
      description: "Collaborate with your small team or project group.",
      features: [
        "All Professional Features",
        "Shared Calendar + Goals",
        "Team Progress Analytics",
        "Priority Support",
        "Up to 5 users included — one flat price",
      ],
      button: "Start for Teams",
      color: "from-indigo-500 to-blue-700",
      path: "team",
      highlight: true,
      badge: "Team Favourite",
    },
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center text-gray-900 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* NAVBAR */}
      <nav className="w-full z-50 bg-white/60 backdrop-blur-md shadow-sm flex justify-between items-center px-8 py-4 border-b border-slate-200/60">
        <div
          onClick={() => router.push("/")}
          className="text-xl font-semibold text-slate-900 cursor-pointer tracking-tight"
        >
          FlowAI
        </div>

        <div className="flex gap-6 text-slate-600 text-sm font-medium">
          <button className="hover:text-slate-900 transition" onClick={() => router.push("/")}>
            Home
          </button>
          <button className="hover:text-slate-900 transition" onClick={() => router.push("/#why")}>
            Why FlowAI
          </button>
          <button className="hover:text-slate-900 transition" onClick={() => router.push("/signup")}>
            Sign Up
          </button>
        </div>
      </nav>

      {/* HEADER */}
      <section className="text-center mt-20 px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Choose your FlowAI plan
        </h1>
        <p className="text-slate-600 text-base md:text-lg mt-4 max-w-2xl mx-auto">
          Whether you’re studying, freelancing, or managing a team — FlowAI helps
          you stay focused and in control.
        </p>
      </section>

      {/* CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 px-8 max-w-6xl">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className={`relative bg-white/90 backdrop-blur-xl border rounded-2xl shadow-lg p-8 text-center flex flex-col transition-all duration-300 ${
              plan.highlight
                ? "border-blue-400/70 shadow-blue-200 hover:shadow-blue-300"
                : "border-slate-200 hover:shadow-blue-100"
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-[10px] px-3 py-1 rounded-full shadow-md uppercase font-semibold tracking-wide">
                {plan.badge}
              </div>
            )}

            <h2 className={`text-2xl font-bold mb-2 ${plan.highlight ? "text-blue-700" : "text-slate-900"}`}>
              {plan.name}
            </h2>
            <p className="text-slate-500 text-sm mb-4">{plan.description}</p>
            <div className={`text-4xl font-extrabold mb-6 ${plan.highlight ? "text-blue-600" : "text-slate-900"}`}>
              {plan.price}
              <span className="text-sm text-slate-500 font-medium"> /month</span>
            </div>

            <ul className="text-sm text-slate-600 flex-1 mb-6 text-left list-disc list-inside space-y-2">
              {plan.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <button
              onClick={() => {
                localStorage.setItem("selectedPlan", plan.name.toLowerCase());
                if (plan.name === "Professional" || plan.name.startsWith("Teams")) {
                  // Stripe path
                  router.push(`/checkout?plan=${plan.path}`);
                } else {
                  // Free & Student
                  router.push(plan.path);
                }
              }}
              disabled={loading}
              className={`bg-gradient-to-r ${plan.color} text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg hover:scale-[1.03] transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Loading..." : plan.button}
            </button>
          </motion.div>
        ))}
      </section>

      {/* FOOTER (uses Link so it won’t trigger the ESLint error) */}
      <footer className="relative z-10 text-slate-500 text-[12px] mt-16 mb-20 text-center">
        © {new Date().getFullYear()} FlowAI — Focus, clarity, momentum. ·{" "}
        <Link href="/privacy" className="underline">Privacy Policy</Link> ·{" "}
        <Link href="/terms" className="underline">Terms of Service</Link>
      </footer>
    </main>
  );
}
