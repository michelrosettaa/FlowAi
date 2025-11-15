"use client";

export default function ProductivityAnalyticsSection() {
  return (
    <section
      id="analytics"
      className="relative z-10 w-full max-w-6xl px-6 mt-24"
    >
      <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl text-white p-8 md:p-10 flex flex-col md:flex-row gap-10 shadow-xl">
        {/* Left side text */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-white">
            Track & analyse your productivity
          </h2>
          <p className="text-indigo-100 text-sm leading-relaxed max-w-md">
            Refraim AI shows you where your time is really going — deep work,
            meetings, admin, context switching — so you can protect focus
            instead of reacting all day.
          </p>

          <button className="mt-6 inline-flex items-center justify-center bg-white text-indigo-700 text-sm font-semibold rounded-lg px-4 py-2 shadow hover:shadow-lg active:scale-[0.99] transition">
            Connect your calendar — it’s free →
          </button>
        </div>

        {/* Right side "stats" mock dashboard */}
        <div className="flex-1 grid grid-cols-2 gap-4 text-[12px]">
          <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4 shadow-sm">
            <div className="text-indigo-200 text-[11px] font-medium">
              Focus Time
            </div>
            <div className="text-2xl font-semibold text-white mt-1">20h</div>
            <div className="text-[11px] text-indigo-200">
              On track this week
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4 shadow-sm">
            <div className="text-indigo-200 text-[11px] font-medium">
              Meetings
            </div>
            <div className="text-2xl font-semibold text-white mt-1">12.1h</div>
            <div className="text-[11px] text-indigo-200">
              ↑ 6h vs last week
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4 shadow-sm">
            <div className="text-indigo-200 text-[11px] font-medium">
              Other work
            </div>
            <div className="text-2xl font-semibold text-white mt-1">3.8h</div>
            <div className="text-[11px] text-indigo-200">
              Admin / follow-ups
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4 shadow-sm">
            <div className="text-indigo-200 text-[11px] font-medium">
              Free time
            </div>
            <div className="text-2xl font-semibold text-white mt-1">11.7h</div>
            <div className="text-[11px] text-indigo-200">
              ↓ 3.2h vs last week
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
