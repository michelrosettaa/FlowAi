"use client";

import React, { useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";

export default function CalendarPage() {
  const { addNotification } = useNotifications?.() || { addNotification: () => {} };

  const hours = ["9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm"];

  const events = [
    { title: "Deep Work — Pitch Deck", dayCol: 0, startRow: 0, span: 2, color: "bg-emerald-500/15 border-emerald-500/40 text-emerald-200" },
    { title: "Investor Follow-up Email", dayCol: 1, startRow: 2, span: 1, color: "bg-indigo-500/15 border-indigo-500/40 text-indigo-200" },
    { title: "Team Sync (Meet)",       dayCol: 2, startRow: 1, span: 1, color: "bg-blue-500/15 border-blue-500/40 text-blue-200" },
    { title: "Client Call / Next Steps",dayCol: 3, startRow: 3, span: 1, color: "bg-rose-500/15 border-rose-500/40 text-rose-200" },
    { title: "Prep Outreach / Follow Ups", dayCol: 4, startRow: 4, span: 2, color: "bg-yellow-500/15 border-yellow-500/40 text-yellow-200" },
  ];

  useEffect(() => {
  addNotification?.("Welcome back — your next block starts at 11:00", "calendar");
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // ✅ runs only once when the page mounts

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-white/15 bg-[#0f172a]/60 backdrop-blur-md flex justify-between items-center px-6 py-4 text-[13px]">
        <div>
          <div className="text-[11px] text-slate-400">Week of Oct 27</div>
          <div className="text-slate-100 font-semibold flex items-center gap-2">
            My Calendar <span className="text-[10px] text-slate-500 font-normal">(Demo view)</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[12px] text-slate-300">
          <button className="bg-[#0b1020] border border-white/15 rounded-md px-3 py-2 hover:bg-white/5 text-slate-100">
            + New Block
          </button>
          <div className="text-[12px] text-slate-400">you@company.com</div>
        </div>
      </header>

      {/* Calendar Grid */}
      <section className="flex-1 p-6 overflow-x-auto">
        {/* Days header */}
        <div className="grid grid-cols-[80px_repeat(5,1fr)] text-[12px] text-slate-300 mb-2 min-w-[720px]">
          <div />
          {["Mon","Tue","Wed","Thu","Fri"].map((d)=>(
            <div key={d} className="text-left font-medium text-slate-100">{d}</div>
          ))}
        </div>

        {/* Time grid */}
        <div className="relative min-w-[720px] rounded-lg border border-white/15 bg-[#0b1020]">
          {hours.map((h, rIdx) => (
            <div key={h}
              className="grid grid-cols-[80px_repeat(5,1fr)] text-[11px] text-slate-400"
              style={{ height: 64, borderTop: rIdx===0 ? "none" : "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="p-2 text-right pr-3">{h}</div>
              {[0,1,2,3,4].map((col)=>(
                <div key={col} className="border-l border-white/10" />
              ))}
            </div>
          ))}

          {/* Events */}
          {events.map((event, i) => (
            <div
              key={i}
              className={`absolute ${event.color} border rounded-md px-2 py-1.5 text-[11px] font-medium`}
              style={{
                top: event.startRow * 64 + 6,
                left: `calc(80px + (${event.dayCol} * (100% - 80px)/5))`,
                width: `calc((100% - 80px)/5 - 6px)`,
                height: event.span * 64 - 12,
                boxShadow: "0 8px 18px rgba(0,0,0,0.35)"
              }}
            >
              <div className="truncate">{event.title}</div>
              <div className="text-[10px] opacity-70">
                {event.span === 1 ? "1 hr" : `${event.span} hrs`}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-[11px] text-slate-500 text-center pb-6">
        Calendar view is a demo. Real Google Calendar sync comes next.
      </footer>
    </div>
  );
}
