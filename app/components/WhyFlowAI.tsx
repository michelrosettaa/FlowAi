"use client";

export default function WhyFlowAISection() {
  return (
    <section className="relative z-10 w-full max-w-6xl px-6 mt-24">
      <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-8 md:p-10 flex flex-col md:flex-row gap-10">
        {/* Left copy */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
            Why FlowAI?
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed max-w-md">
            FlowAI doesn’t just give you another to-do list. It actively
            protects your focus time, handles boring admin work, and keeps you
            moving toward what matters.
          </p>

          <ul className="mt-6 space-y-4 text-sm text-slate-700">
            <li className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 text-xs font-semibold flex items-center justify-center">
                1
              </div>
              <div>
                <div className="font-semibold text-slate-900">
                  Plans your day for you
                </div>
                <div className="text-slate-600 text-[13px] leading-relaxed">
                  FlowAI takes what you need to do and auto-blocks it on your
                  calendar — no more guessing where work fits.
                </div>
              </div>
            </li>

            <li className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center">
                2
              </div>
              <div>
                <div className="font-semibold text-slate-900">
                  Fights interruptions
                </div>
                <div className="text-slate-600 text-[13px] leading-relaxed">
                  Smart focus mode keeps you on track and gently nudges you
                  back when you drift.
                </div>
              </div>
            </li>

            <li className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-green-100 text-green-600 text-xs font-semibold flex items-center justify-center">
                3
              </div>
              <div>
                <div className="font-semibold text-slate-900">
                  Does the admin work
                </div>
                <div className="text-slate-600 text-[13px] leading-relaxed">
                  Drafts emails, summarises calls, and reminds you of follow-ups
                  so nothing slips.
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Right mini card visual */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm bg-gradient-to-br from-indigo-50 to-blue-50 border border-slate-200 rounded-xl shadow-lg p-5">
            <div className="text-[11px] font-medium text-slate-500 mb-2">
              Daily Focus
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 text-left shadow-sm mb-3">
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>10:00 – 12:00</span>
                <span className="text-blue-600 font-medium">Deep work</span>
              </div>
              <div className="text-slate-900 text-sm font-semibold mt-1">
                Pitch deck final
              </div>
              <div className="text-[12px] text-slate-500 mt-1">
                Blocked by FlowAI
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 text-left shadow-sm mb-3">
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>13:30</span>
                <span className="text-indigo-600 font-medium">
                  Follow-up email
                </span>
              </div>
              <div className="text-slate-900 text-sm font-semibold mt-1">
                Send contract notes to Sarah
              </div>
              <div className="text-[12px] text-slate-500 mt-1">
                Draft ready ✓
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center">
              Built + defended by FlowAI
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
