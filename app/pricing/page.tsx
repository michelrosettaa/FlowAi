"use client";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-slate-900">
      {/* HEADER */}
      <header className="w-full py-6 border-b border-slate-200 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <div className="text-xl font-bold text-slate-900">Refraim AI</div>
          <nav className="flex gap-6 text-sm font-medium text-slate-700">
            <a href="/" className="hover:text-slate-900 transition">Home</a>
            <a href="/pricing" className="text-blue-600 font-semibold">Pricing</a>
            <a href="/login" className="hover:text-slate-900 transition">Get Started</a>
          </nav>
        </div>
      </header>

      {/* PRICING SECTION */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
            Choose your Refraim AI plan
          </h1>
          <p className="text-slate-500 mb-16 text-lg">
            Start for free — upgrade anytime to unlock your full productivity.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* FREE PLAN */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
              <h2 className="text-xl font-semibold mb-2">Free</h2>
              <p className="text-slate-500 mb-4">For getting started.</p>
              <p className="text-4xl font-bold mb-6">£0<span className="text-base text-slate-500">/month</span></p>
              <ul className="text-left text-slate-600 text-sm mb-8 space-y-2">
                <li>✅ 3 AI plans per day</li>
                <li>✅ Limited motivator messages</li>
                <li>✅ 2 email summaries/day</li>
              </ul>
              <a href="/login" className="inline-block w-full bg-slate-900 text-white rounded-lg py-2 font-medium hover:bg-slate-800 transition">
                Get Started
              </a>
            </div>

            {/* PRO PLAN */}
            <div className="bg-gradient-to-b from-blue-600 to-indigo-600 text-white rounded-2xl p-8 shadow-xl transform scale-105 border border-indigo-500">
              <h2 className="text-xl font-semibold mb-2">Pro</h2>
              <p className="text-slate-200 mb-4">For individuals & professionals.</p>
              <p className="text-4xl font-bold mb-6">£8.99<span className="text-base text-slate-200">/month</span></p>
              <ul className="text-left text-white/90 text-sm mb-8 space-y-2">
                <li>✅ Unlimited AI planning</li>
                <li>✅ Full AI Motivator & streaks</li>
                <li>✅ Calendar sync</li>
                <li>✅ Unlimited email drafts</li>
              </ul>
              <a href="/login" className="inline-block w-full bg-white text-blue-700 rounded-lg py-2 font-semibold hover:bg-slate-100 transition">
                Upgrade to Pro
              </a>
              <p className="text-xs text-slate-200 mt-2">£79/year (save 27%)</p>
            </div>

            {/* TEAM PLAN */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
              <h2 className="text-xl font-semibold mb-2">Team</h2>
              <p className="text-slate-500 mb-4">For small teams & startups.</p>
              <p className="text-4xl font-bold mb-6">£18.99<span className="text-base text-slate-500">/user</span></p>
              <ul className="text-left text-slate-600 text-sm mb-8 space-y-2">
                <li>✅ Shared team planner</li>
                <li>✅ AI meeting summaries</li>
                <li>✅ Team focus analytics</li>
                <li>✅ Slack + Gmail integration</li>
              </ul>
              <a href="/login" className="inline-block w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200">
        © {new Date().getFullYear()} Refraim AI — Focus, clarity, momentum.
      </footer>
    </main>
  );
}
