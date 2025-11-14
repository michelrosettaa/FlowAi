"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare, Calendar, Mail, Brain, Zap, Menu, X } from "lucide-react";

import TypingAssistant from "./components/TypingAssistant";
import WhyFlowAI from "./components/WhyFlowAI";
import ProductivityAnalytics from "./components/ProductivityAnalytics";
import ImpactTimeline from "./components/ImpactTimeline";
import ConnectCTA from "./components/ConnectCTA";
import StickyCTA from "./components/StickyCTA";

export default function LandingPage() {
  const router = useRouter();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        "The AI planner and email automation are absolute game changers. It's like having a digital chief of staff.",
      img: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
      name: "Sophia Patel",
      role: "Freelance Designer",
      quote:
        "Ask FlowAI is incredible — it's like having a productivity coach in my pocket. I ask it anything and get instant help.",
      img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center text-gray-900 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* === NAVBAR === */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-4">
          <div
            onClick={() => router.push("/")}
            className="text-xl font-bold text-slate-900 cursor-pointer tracking-tight"
          >
            FlowAI
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 text-slate-600 text-sm font-medium">
            <button
              className="hover:text-slate-900 transition-colors"
              onClick={() => {
                const el = document.getElementById("features");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Features
            </button>

            <button
              className="hover:text-slate-900 transition-colors"
              onClick={() => {
                const el = document.getElementById("testimonials");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Testimonials
            </button>

            <button
              className="hover:text-slate-900 transition-colors"
              onClick={() => router.push("/pricing")}
            >
              Pricing
            </button>

            <button
              onClick={() => router.push("/login")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Start Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/50">
            <div className="flex flex-col gap-4 px-6 py-6">
              <button
                className="text-left text-slate-700 hover:text-slate-900 py-2 transition-colors"
                onClick={() => {
                  const el = document.getElementById("features");
                  el?.scrollIntoView({ behavior: "smooth" });
                  setMobileMenuOpen(false);
                }}
              >
                Features
              </button>

              <button
                className="text-left text-slate-700 hover:text-slate-900 py-2 transition-colors"
                onClick={() => {
                  const el = document.getElementById("testimonials");
                  el?.scrollIntoView({ behavior: "smooth" });
                  setMobileMenuOpen(false);
                }}
              >
                Testimonials
              </button>

              <button
                className="text-left text-slate-700 hover:text-slate-900 py-2 transition-colors"
                onClick={() => {
                  router.push("/pricing");
                  setMobileMenuOpen(false);
                }}
              >
                Pricing
              </button>

              <button
                onClick={() => {
                  router.push("/login");
                  setMobileMenuOpen(false);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 w-full text-center"
              >
                Start Free
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* === HERO SECTION === */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-32 md:pt-40 max-w-4xl">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-full px-4 py-2 mb-6"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-900">Your Personal AI Productivity Assistant</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-7xl font-bold leading-[1.1] text-slate-900 tracking-tighter"
        >
          Plan your day without
          <br />
          burning your brain.
          <span className="block mt-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            FlowAI does it for you.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 text-lg md:text-xl max-w-2xl mt-8 leading-relaxed"
        >
          Your intelligent assistant that plans your day, drafts emails, syncs calendars,
          and answers your productivity questions — all powered by real AI.
        </motion.p>

        {/* Typing Assistant */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <TypingAssistant />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <button
            onClick={() => router.push("/login")}
            className="group relative overflow-hidden inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-base font-semibold shadow-[0_8px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.4)] hover:scale-[1.02] transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700"
          >
            Start Free Trial →
          </button>

          <button
            onClick={() => setShowDemoModal(true)}
            className="inline-flex items-center justify-center border-2 border-slate-300 text-slate-700 bg-white/80 backdrop-blur px-8 py-4 rounded-2xl text-base font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04),0_12px_24px_rgba(0,0,0,0.06)] hover:bg-slate-50 hover:border-slate-400 hover:scale-[1.02] transition-all duration-300"
          >
            Watch Demo
          </button>
        </motion.div>
      </section>

      {/* === ASK FLOWAI HIGHLIGHT === */}
      <section id="features" className="w-full max-w-7xl px-6 mt-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Meet <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Ask FlowAI</span>
          </h2>
          <p className="text-slate-600 text-lg mt-4 max-w-2xl mx-auto">
            Your personal AI assistant that understands your productivity needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Ask FlowAI Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04),0_12px_24px_rgba(109,40,217,0.08)]"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-6">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Ask FlowAI Anything</h3>
            <p className="text-slate-700 text-base leading-relaxed mb-6">
              "What should I focus on today?" "Help me prioritise my tasks" "Draft an email for my team" 
              — Ask FlowAI understands context and gives you smart, personalised answers instantly.
            </p>
            <div className="bg-white/60 backdrop-blur rounded-2xl p-4 border border-purple-200/40">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-600 text-white rounded-full p-2 text-xs font-bold">You</div>
                <div className="bg-blue-100 text-blue-900 rounded-2xl px-4 py-2 text-sm">
                  Help me plan my day with 3 meetings
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full p-2 text-xs font-bold">AI</div>
                <div className="bg-slate-100 text-slate-900 rounded-2xl px-4 py-2 text-sm">
                  I'll block focus time around your meetings and suggest breaks between them...
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:translate-y-[-4px] transition-all duration-300"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">AI Planner</h4>
              <p className="text-sm text-slate-600">Turns tasks into time-blocked schedules</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:translate-y-[-4px] transition-all duration-300"
            >
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Email AI</h4>
              <p className="text-sm text-slate-600">Drafts and sends emails for you</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:translate-y-[-4px] transition-all duration-300"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Calendar Sync</h4>
              <p className="text-sm text-slate-600">Protects your focus time automatically</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:translate-y-[-4px] transition-all duration-300"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">AI Mentor</h4>
              <p className="text-sm text-slate-600">Keeps you motivated and accountable</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === WHY FLOWAI === */}
      <section id="why" className="w-full max-w-7xl px-6 mt-40">
        <WhyFlowAI />
      </section>

      {/* === PRODUCTIVITY ANALYTICS === */}
      <section id="analytics" className="w-full max-w-7xl px-6 mt-40">
        <ProductivityAnalytics />
      </section>

      {/* === IMPACT TIMELINE === */}
      <section id="impact" className="w-full max-w-7xl px-6 mt-40">
        <ImpactTimeline />
      </section>

      {/* === TESTIMONIALS === */}
      <section
        id="testimonials"
        className="relative z-10 mt-40 px-6 max-w-7xl w-full text-center overflow-hidden"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 tracking-tight">
          People using FlowAI feel calmer
          <br />
          and get more done.
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
              className="min-w-[320px] md:min-w-[380px] bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04),0_12px_24px_rgba(0,0,0,0.06)] p-8 text-left"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-12 h-12 rounded-full border-2 border-slate-200 object-cover"
                />
                <div>
                  <div className="text-slate-900 font-semibold text-base">
                    {t.name}
                  </div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              </div>
              <p className="text-slate-700 text-base leading-relaxed italic">
                "{t.quote}"
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* === CONNECT EMAIL / CALENDAR CTA === */}
      <section className="w-full max-w-7xl px-6 mt-40">
        <ConnectCTA />
      </section>

      <StickyCTA />

      {/* === FOOTER === */}
      <footer className="relative z-10 text-slate-400 text-sm mt-24 mb-20 text-center">
        © {new Date().getFullYear()} FlowAI — Focus, clarity, momentum.
      </footer>

      {/* === DEMO MODAL === */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-2xl text-left relative border border-slate-200 p-8">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              FlowAI in Action
            </h3>

            <div
              style={{
                position: "relative",
                paddingBottom: "56.544502617801044%",
                height: 0,
              }}
            >
              <iframe
                src="https://app.govideolink.com/embed/I8YKF7jV1NwhUoDl1Fpc"
                allow="autoplay; fullscreen"
                allowFullScreen
                frameBorder={0}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: "16px",
                }}
              ></iframe>
            </div>

            <p className="text-slate-600 text-base leading-relaxed my-6">
              FlowAI plans your day, protects deep work, and automates your focus — see it in action.
            </p>

            <button
              onClick={() => {
                setShowDemoModal(false);
                router.push("/login");
              }}
              className="w-full inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-semibold px-6 py-4 shadow-[0_8px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.4)] hover:scale-[1.02] transition-all duration-300"
            >
              Start Free →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
