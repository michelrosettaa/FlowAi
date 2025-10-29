"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// sections/components on the landing page
import TypingAssistant from "./components/TypingAssistant";
import WhyFlowAI from "./components/WhyFlowAI";
import ProductivityAnalytics from "./components/ProductivityAnalytics";
import ImpactTimeline from "./components/ImpactTimeline";
import ConnectCTA from "./components/ConnectCTA";
import StickyCTA from "./components/StickyCTA";

export default function LandingPage() {
  const router = useRouter();
  const [showDemoModal, setShowDemoModal] = useState(false);

  const testimonials = [
    {
      name: "Ella Martinez",
      role: "Startup Founder",
      quote:
        "FlowAI saves me hours every week — I just type my goals, and it builds my entire day perfectly.",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "James Liu",
      role: "Marketing Lead",
      quote:
        "The AI planner and email automation are absolute game changers. It’s like having a digital chief of staff.",
      img: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
      name: "Sophia Patel",
      role: "Freelance Designer",
      quote:
        "Focus mode + reminders help me stay in flow. FlowAI is easily the most beautiful productivity app I’ve used.",
      img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center text-gray-900 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* === NAVBAR === */}
      <nav className="w-full z-50 bg-white/60 backdrop-blur-md shadow-sm flex justify-between items-center px-8 py-4 border-b border-slate-200/60">
        <div
          onClick={() => router.push("/")}
          className="text-xl font-semibold text-slate-900 cursor-pointer tracking-tight"
        >
          FlowAI
        </div>

        <div className="flex gap-6 text-slate-600 text-sm font-medium">
          <button
            className="hover:text-slate-900 transition"
            onClick={() => {
              const el = document.getElementById("why");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Why FlowAI
          </button>

          <button
            className="hover:text-slate-900 transition"
            onClick={() => {
              const el = document.getElementById("analytics");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Productivity
          </button>

          <button
            className="hover:text-slate-900 transition"
            onClick={() => {
              const el = document.getElementById("impact");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Results
          </button>

          <button
            className="hover:text-slate-900 transition"
            onClick={() => {
              const el = document.getElementById("testimonials");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Testimonials
          </button>

          {/* NEW PRICING BUTTON */}
          <button
            className="hover:text-slate-900 transition"
            onClick={() => router.push("/pricing")}
          >
            Pricing
          </button>

          <button
            className="hover:text-slate-900 transition"
            onClick={() => router.push("/signup")}
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* === HERO SECTION === */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 md:pt-20 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 tracking-tight">
          Plan your day without burning your brain.
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            FlowAI does the boring work for you.
          </span>
        </h1>

        <p className="text-slate-600 text-base md:text-lg max-w-xl mt-6 leading-relaxed">
          FlowAI turns your tasks into a schedule, drafts your emails,
          protects your focus time, and keeps you accountable — automatically.
        </p>

        {/* Typing Assistant */}
        <div className="mt-6">
          <TypingAssistant />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => router.push("/signup")}
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.99] transition"
          >
            Start Free Trial →
          </button>

          <button
            onClick={() => setShowDemoModal(true)}
            className="inline-flex items-center justify-center border border-indigo-500/60 text-indigo-600 bg-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm hover:bg-indigo-50 hover:scale-[1.03] active:scale-[0.99] transition"
          >
            Watch Demo
          </button>
        </div>
      </section>

      {/* === WHY FLOWAI === */}
      <section id="why" className="w-full max-w-6xl px-6 mt-24">
        <WhyFlowAI />
      </section>

      {/* === PRODUCTIVITY ANALYTICS === */}
      <section id="analytics" className="w-full max-w-6xl px-6 mt-24">
        <ProductivityAnalytics />
      </section>

      {/* === IMPACT TIMELINE === */}
      <section id="impact" className="w-full max-w-6xl px-6 mt-24">
        <ImpactTimeline />
      </section>

      {/* === TESTIMONIALS === */}
      <section
        id="testimonials"
        className="relative z-10 mt-24 px-6 max-w-6xl w-full text-center overflow-hidden"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-10 tracking-tight">
          People using FlowAI feel calmer and get more done.
        </h2>

        <motion.div
          className="flex gap-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "linear",
          }}
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="min-w-[300px] md:min-w-[360px] bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-lg p-6 text-left"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                />
                <div>
                  <div className="text-slate-900 font-semibold text-sm">
                    {t.name}
                  </div>
                  <div className="text-[12px] text-slate-500">{t.role}</div>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed italic">
                “{t.quote}”
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* === CONNECT EMAIL / CALENDAR CTA === */}
      <section className="w-full max-w-6xl px-6 mt-24">
        <ConnectCTA />
      </section>

      <StickyCTA />

      {/* === FOOTER === */}
      <footer className="relative z-10 text-slate-400 text-[12px] mt-16 mb-20 text-center">
        © {new Date().getFullYear()} FlowAI — Focus, clarity, momentum.
      </footer>

      {/* === DEMO MODAL === */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-2xl text-left relative border border-slate-200 p-6">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-sm"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              FlowAI in Action
            </h3>

            {/* EMBEDDED DEMO VIDEO */}
<div
  style={{
    position: "relative",
    paddingBottom: "56.544502617801044%",
    height: 0,
  }}
>
  <iframe
    src="https://www.loom.com/embed/20891e56c3ce4003aa054a5c47a450c9"
    frameBorder="0"
    allowFullScreen
    webkitallowfullscreen="true"
    mozallowfullscreen="true"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "12px",
    }}
  ></iframe>
</div>

            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              FlowAI plans your day, protects deep work, and automates your focus — see it in action.
            </p>

            <button
              onClick={() => {
                setShowDemoModal(false);
                router.push("/signup");
              }}
              className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-semibold px-4 py-2 shadow-md hover:shadow-lg hover:scale-[1.02] transition"
            >
              Start Free →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
