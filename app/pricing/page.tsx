"use client";

import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="w-full py-5 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center">
              F
            </div>
            <span className="text-lg font-bold text-slate-900">Refraim AI</span>
          </div>
          <nav className="flex gap-6 text-sm font-medium text-slate-600">
            <a href="/" className="hover:text-slate-900 transition">Home</a>
            <a href="/pricing" className="text-blue-600 font-semibold">Pricing</a>
            <a href="/login" className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">Get Started</a>
          </nav>
        </div>
      </header>

      <section className="py-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Simple Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight">
            Choose your Refraim plan
          </h1>
          <p className="text-slate-500 mb-16 text-lg max-w-2xl mx-auto">
            Start for free — upgrade anytime to unlock your full productivity potential.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow">
              <h2 className="text-lg font-semibold mb-1 text-slate-900">Free</h2>
              <p className="text-slate-500 text-sm mb-6">For getting started</p>
              <p className="text-4xl font-bold mb-8 text-slate-900">£0<span className="text-base font-medium text-slate-400">/month</span></p>
              <ul className="text-left text-slate-600 text-sm mb-8 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate-600" />
                  </div>
                  3 AI plans per day
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate-600" />
                  </div>
                  Limited motivator messages
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate-600" />
                  </div>
                  2 email summaries per day
                </li>
              </ul>
              <a href="/login" className="inline-block w-full bg-slate-100 text-slate-700 rounded-xl py-3 font-semibold hover:bg-slate-200 transition text-center">
                Get Started
              </a>
            </div>

            <div className="bg-gradient-to-b from-blue-600 to-indigo-600 text-white rounded-2xl p-8 shadow-2xl transform md:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-white/20 text-xs font-bold px-3 py-1 rounded-bl-lg">
                Popular
              </div>
              <h2 className="text-lg font-semibold mb-1">Pro</h2>
              <p className="text-blue-100 text-sm mb-6">For individuals and professionals</p>
              <p className="text-4xl font-bold mb-8">£8.99<span className="text-base font-medium text-blue-200">/month</span></p>
              <ul className="text-left text-white/90 text-sm mb-8 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  Unlimited AI planning
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  Full AI Motivator and streaks
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  Calendar sync
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  Unlimited email drafts
                </li>
              </ul>
              <a href="/login" className="inline-block w-full bg-white text-blue-700 rounded-xl py-3 font-semibold hover:bg-blue-50 transition text-center">
                Upgrade to Pro
              </a>
              <p className="text-xs text-blue-200 mt-3 text-center">£79/year (save 27%)</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow">
              <h2 className="text-lg font-semibold mb-1 text-slate-900">Team</h2>
              <p className="text-slate-500 text-sm mb-6">For small teams and startups</p>
              <p className="text-4xl font-bold mb-8 text-slate-900">£18.99<span className="text-base font-medium text-slate-400">/user</span></p>
              <ul className="text-left text-slate-600 text-sm mb-8 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate-600" />
                  </div>
                  Shared team planner
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate-600" />
                  </div>
                  AI meeting summaries
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate-600" />
                  </div>
                  Team focus analytics
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate-600" />
                  </div>
                  Slack and Gmail integration
                </li>
              </ul>
              <a href="/login" className="inline-block w-full bg-slate-900 text-white rounded-xl py-3 font-semibold hover:bg-slate-800 transition text-center">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-100">
        © {new Date().getFullYear()} Refraim AI — Focus, clarity, momentum.
      </footer>
    </main>
  );
}
