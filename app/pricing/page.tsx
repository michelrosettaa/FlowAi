"use client";

import { Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();

  const handleSelectPlan = (plan: string) => {
    router.push(`/signup?plan=${plan}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="w-full py-5 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center">
              F
            </div>
            <span className="text-lg font-bold text-slate-900">Refraim AI</span>
          </a>
          <nav className="flex gap-6 text-sm font-medium text-slate-600">
            <a href="/" className="hover:text-slate-900 transition">Home</a>
            <a href="/pricing" className="text-blue-600 font-semibold">Pricing</a>
            <a href="/login" className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">Sign In</a>
          </nav>
        </div>
      </header>

      <section className="py-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            7-Day Free Trial on All Paid Plans
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight">
            Choose your Refraim plan
          </h1>
          <p className="text-slate-500 mb-16 text-lg max-w-2xl mx-auto">
            Start with a free plan or try Pro and Business risk-free for 7 days. No credit card required to start.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow">
              <h2 className="text-lg font-semibold mb-1 text-slate-900">Free</h2>
              <p className="text-slate-500 text-sm mb-6">For getting started</p>
              <p className="text-4xl font-bold mb-8 text-slate-900">£0<span className="text-base font-medium text-slate-400">/month</span></p>
              <ul className="text-left text-slate-600 text-sm mb-8 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate-600" />
                  </div>
                  5 AI messages per day
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate-600" />
                  </div>
                  Basic task management
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate-600" />
                  </div>
                  2 email drafts per day
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate-600" />
                  </div>
                  Limited calendar view
                </li>
              </ul>
              <button 
                onClick={() => handleSelectPlan('free')}
                className="w-full bg-slate-100 text-slate-700 rounded-xl py-3 font-semibold hover:bg-slate-200 transition text-center"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-blue-600 to-indigo-600 text-white rounded-2xl p-8 shadow-2xl transform md:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-white/20 text-xs font-bold px-3 py-1 rounded-bl-lg">
                Most Popular
              </div>
              <h2 className="text-lg font-semibold mb-1">Pro</h2>
              <p className="text-blue-100 text-sm mb-6">For professionals</p>
              <p className="text-4xl font-bold mb-2">£9<span className="text-base font-medium text-blue-200">/month</span></p>
              <p className="text-sm text-blue-200 mb-6">7-day free trial included</p>
              <ul className="text-left text-white/90 text-sm mb-8 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  Unlimited AI messages
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  Full AI Motivator access
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  Google Calendar sync
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  Unlimited email drafts
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  Streak tracking
                </li>
              </ul>
              <button 
                onClick={() => handleSelectPlan('pro')}
                className="w-full bg-white text-blue-700 rounded-xl py-3 font-semibold hover:bg-blue-50 transition text-center"
              >
                Start 7-Day Free Trial
              </button>
            </div>

            {/* Business Plan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow relative">
              <div className="absolute top-0 right-0 bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-2xl">
                For Teams
              </div>
              <h2 className="text-lg font-semibold mb-1 text-slate-900">Business</h2>
              <p className="text-slate-500 text-sm mb-6">For teams up to 5</p>
              <p className="text-4xl font-bold mb-2 text-slate-900">£29<span className="text-base font-medium text-slate-400">/month</span></p>
              <p className="text-sm text-slate-500 mb-6">7-day free trial included</p>
              <ul className="text-left text-slate-600 text-sm mb-8 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-purple-600" />
                  </div>
                  Everything in Pro
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-purple-600" />
                  </div>
                  Up to 5 team members
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-purple-600" />
                  </div>
                  Team admin dashboard
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-purple-600" />
                  </div>
                  Shared team calendar
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-purple-600" />
                  </div>
                  Priority support
                </li>
              </ul>
              <button 
                onClick={() => handleSelectPlan('business')}
                className="w-full bg-slate-900 text-white rounded-xl py-3 font-semibold hover:bg-slate-800 transition text-center"
              >
                Start 7-Day Free Trial
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Secure payment with Stripe
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
