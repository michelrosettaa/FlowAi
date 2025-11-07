"use client";

import React from "react";
import ReferralSection from "../components/ReferralSection";

export default function DashboardPage() {
  const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];

  const mockBlocks = [
    {
      dayCol: 1,
      startRow: 1,
      span: 2,
      title: "Deep Work — Pitch Deck",
      color: "bg-emerald-400/30 border-emerald-400/60 text-emerald-200",
    },
    {
      dayCol: 2,
      startRow: 3,
      span: 1,
      title: "Investor Follow-up Email",
      color: "bg-indigo-400/30 border-indigo-400/50 text-indigo-200",
    },
    {
      dayCol: 3,
      startRow: 2,
      span: 1,
      title: "Team Sync (Meet)",
      color: "bg-blue-400/30 border-blue-400/50 text-blue-200",
    },
    {
      dayCol: 4,
      startRow: 4,
      span: 1,
      title: "Client Call / Next Steps",
      color: "bg-pink-400/30 border-pink-400/50 text-pink-200",
    },
    {
      dayCol: 5,
      startRow: 3,
      span: 2,
      title: "Prep Outreach / Follow Ups",
      color: "bg-yellow-400/30 border-yellow-400/50 text-yellow-200",
    },
  ];

  return (
    <>
      {/* HEADER */}
      <header className="border-b border-white/10 flex justify-between items-center px-6 py-4 text-[13px]">
        <div>
          <div className="text-[11px] text-slate-400">Week of Oct 27</div>
          <div className="text-slate-100 font-semibold">My Calendar (Demo view)</div>
        </div>
        <div className="flex items-center gap-3 text-[12px] text-slate-400">
          <button className="bg-white/5 border border-white/10 rounded-md px-3 py-2 hover:bg-white/10 text-slate-200">
            + New Block
          </button>
          <div className="text-[12px] text-slate-500">you@company.com</div>
        </div>
      </header>

      {/* CALENDAR GRID */}
      <div className="flex-1 p-6">
        {/* Days header */}
        <div className="grid grid-cols-[80px_repeat(5,1fr)] text-[12px] text-slate-300 mb-2">
          <div></div>
          <div className="text-left font-medium text-slate-100">Mon</div>
          <div className="text-left font-medium text-slate-100">Tue</div>
          <div className="text-left font-medium text-slate-100">Wed</div>
          <div className="text-left font-medium text-slate-100">Thu</div>
          <div className="text-left font-medium text-slate-100">Fri</div>
        </div>

        {/* Time rows */}
        <div className="relative border-t border-white/10">
          {hours.map((h) => (
            <div
              key={h}
              className="grid grid-cols-[80px_repeat(5,1fr)] text-[11px] text-slate-500"
            >
              <div className="p-2 text-right pr-3 text-slate-500 border-b border-white/5">
                {h}
              </div>
              {[0, 1, 2, 3, 4].map((col) => (
                <div
                  key={col}
                  className="border-l border-white/5 border-b border-white/5 h-16 relative"
                ></div>
              ))}
            </div>
          ))}

          {/* Events */}
          {mockBlocks.map((block, i) => (
            <div
              key={i}
              className={`absolute ${block.color} border text-[11px] font-medium rounded-md p-2 leading-snug shadow-[0_20px_60px_rgba(0,0,0,0.6)]`}
              style={{
                top: block.startRow * 64,
                left: `calc(80px + ${block.dayCol * (100 / 5)}%)`,
                width: `calc(${100 / 5}% - 2px)`,
                height: block.span * 64 - 8,
              }}
            >
              {block.title}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER NOTE */}
      <p className="text-center text-[11px] text-slate-500 mt-4 mb-6">
        Calendar view is a demo. Real Google Calendar sync comes next.
      </p>

      {/* REFERRAL SECTION */}
      <div className="pb-20">
        <ReferralSection />
      </div>
    </>
  );
}
import { useNotifications } from ".././context/NotificationContext";

function DebugNotif() {
  const { addNotification } = useNotifications();
  return (
    <button
      onClick={() => addNotification("Test notification from dashboard", "mentor")}
      className="mt-4 text-xs bg-white/10 border border-white/15 px-3 py-1.5 rounded"
    >
      Send test notification
    </button>
  );
}

