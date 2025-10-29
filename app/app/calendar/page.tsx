"use client";

import React from "react";

export default function CalendarPage() {
  const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];

  const events = [
    {
      title: "Deep Work — Pitch Deck",
      dayCol: 0,
      startRow: 0,
      span: 2,
      color:
        "bg-emerald-400/20 border border-emerald-400/50 text-emerald-200 shadow-[0_20px_60px_rgba(16,185,129,0.4)]",
    },
    {
      title: "Investor Follow-up Email",
      dayCol: 1,
      startRow: 2,
      span: 1,
      color:
        "bg-indigo-400/20 border border-indigo-400/50 text-indigo-200 shadow-[0_20px_60px_rgba(99,102,241,0.4)]",
    },
    {
      title: "Team Sync (Meet)",
      dayCol: 2,
      startRow: 1,
      span: 1,
      color:
        "bg-blue-400/20 border border-blue-400/50 text-blue-200 shadow-[0_20px_60px_rgba(96,165,250,0.4)]",
    },
    {
      title: "Client Call / Next Steps",
      dayCol: 3,
      startRow: 3,
      span: 1,
      color:
        "bg-rose-400/20 border border-rose-400/50 text-rose-200 shadow-[0_20px_60px_rgba(251,113,133,0.4)]",
    },
    {
      title: "Prep Outreach / Follow Ups",
      dayCol: 4,
      startRow: 4,
      span: 2,
      color:
        "bg-yellow-400/20 border border-yellow-400/50 text-yellow-200 shadow-[0_20px_60px_rgba(251,191,36,0.4)]",
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 flex justify-between items-center px-6 py-4 text-[13px]">
        <div>
          <div className="text-[11px] text-slate-400">Week of Oct 27</div>
          <div className="text-slate-100 font-semibold flex items-center gap-2">
            My Calendar
            <span className="text-[10px] text-slate-500 font-normal">
              (Demo view)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[12px] text-slate-400">
          <button className="bg-white/5 border border-white/10 rounded-md px-3 py-2 hover:bg-white/10 text-slate-200">
            + New Block
          </button>
          <div className="text-[12px] text-slate-500">you@company.com</div>
        </div>
      </header>

      {/* Calendar Grid */}
      <section className="flex-1 p-6 overflow-x-auto">
        <div className="grid grid-cols-[80px_repeat(5,1fr)] text-[12px] text-slate-300 mb-2 min-w-[700px]">
          <div></div>
          <div className="text-left font-medium text-slate-100">Mon</div>
          <div className="text-left font-medium text-slate-100">Tue</div>
          <div className="text-left font-medium text-slate-100">Wed</div>
          <div className="text-left font-medium text-slate-100">Thu</div>
          <div className="text-left font-medium text-slate-100">Fri</div>
        </div>

        {/* Time grid */}
        <div className="relative border-t border-white/10 min-w-[700px]">
          {hours.map((h) => (
            <div
              key={h}
              className="grid grid-cols-[80px_repeat(5,1fr)] text-[11px] text-slate-500"
              style={{ height: "64px" }}
            >
              <div className="p-2 text-right pr-3 text-slate-500 border-b border-white/5">
                {h}
              </div>
              {[0, 1, 2, 3, 4].map((col) => (
                <div
                  key={col}
                  className="border-l border-white/5 border-b border-white/5 relative"
                />
              ))}
            </div>
          ))}

          {/* Overlay Events */}
          {events.map((event, idx) => (
            <div
              key={idx}
              className={`absolute rounded-md p-2 text-[11px] font-medium leading-snug ${event.color}`}
              style={{
                top: event.startRow * 64 + 1,
                left: `calc(80px + (${event.dayCol} * (100% - 80px) / 5))`,
                width: `calc((100% - 80px) / 5 - 4px)`,
                height: event.span * 64 - 8,
              }}
            >
              <div className="truncate">{event.title}</div>
              <div className="text-[10px] opacity-70 mt-1">
                {event.span === 1 ? "1 hr" : `${event.span} hrs`}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-[11px] text-slate-500 text-center pb-6">
        Calendar view is a demo. Real Google Calendar sync comes next.
      </footer>
    </div>
  );
}
