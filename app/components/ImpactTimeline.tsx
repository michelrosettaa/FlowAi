"use client";

export default function ImpactTimelineSection() {
  const columns = [
    {
      label: "Today",
      points: [
        "Focus time is instantly protected",
        "AI starts defending your priorities",
        "You discover productivity patterns",
      ],
    },
    {
      label: "Day 7",
      points: [
        "More long deep work blocks",
        "Meetings shift to better times",
        "Fragmented time drops ~50%",
      ],
    },
    {
      label: "Day 30",
      points: [
        "Focus time increases ~50%",
        "Meeting load drops ~15%",
        "You feel in control, not reactive",
      ],
    },
  ];

  return (
    <section className="relative z-10 w-full max-w-6xl px-6 mt-24">
      <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-8 md:p-10">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">
          Boost productivity on day 1
        </h2>

        {/* timeline row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-4 text-left border-t border-slate-200 pt-6">
          {columns.map((col, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex-1 min-w-[250px]"
            >
              <div className="inline-block bg-slate-100 text-slate-800 text-[12px] font-semibold rounded-md px-3 py-1 mb-4 border border-slate-200">
                {col.label}
              </div>

              <ul className="space-y-3 text-[13px] text-slate-700 leading-relaxed">
                {col.points.map((p, idx) => (
                  <li key={idx} className="flex gap-2 items-start">
                    <span className="text-green-600 font-semibold text-[14px] leading-[18px]">
                      ✓
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-[12px] text-slate-500 mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600 font-semibold">
              Create your free account
            </span>
            <span>→</span>
          </div>
          <button className="text-[12px] text-slate-500 underline hover:text-slate-700">
            Explore a pilot
          </button>
        </div>
      </div>
    </section>
  );
}
