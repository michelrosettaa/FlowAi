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
      <header className="px-8 py-6" style={{ 
        borderBottom: '1px solid var(--app-border)',
        background: 'var(--app-surface)'
      }}>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--app-text-muted)' }}>
              Week of Oct 27
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--app-text)' }}>
              My Calendar
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-lg"
              style={{
                background: 'linear-gradient(to right, var(--app-accent), var(--app-accent-hover))',
                color: 'white'
              }}
            >
              + New Block
            </button>
            <div className="text-sm" style={{ color: 'var(--app-text-dim)' }}>
              you@company.com
            </div>
          </div>
        </div>
      </header>

      {/* CALENDAR GRID */}
      <div className="flex-1 p-8">
        {/* Days header */}
        <div className="grid grid-cols-[90px_repeat(5,1fr)] text-sm mb-4" style={{ color: 'var(--app-text-dim)' }}>
          <div></div>
          <div className="text-left font-semibold pl-4" style={{ color: 'var(--app-text)' }}>Monday</div>
          <div className="text-left font-semibold pl-4" style={{ color: 'var(--app-text)' }}>Tuesday</div>
          <div className="text-left font-semibold pl-4" style={{ color: 'var(--app-text)' }}>Wednesday</div>
          <div className="text-left font-semibold pl-4" style={{ color: 'var(--app-text)' }}>Thursday</div>
          <div className="text-left font-semibold pl-4" style={{ color: 'var(--app-text)' }}>Friday</div>
        </div>

        {/* Time rows - Using CSS Grid for proper alignment */}
        <div 
          className="premium-card overflow-hidden grid"
          style={{
            gridTemplateColumns: '90px repeat(5, 1fr)',
            gridTemplateRows: `repeat(${hours.length}, 5rem)`
          }}
        >
          {/* Hour labels and day cells */}
          {hours.map((h, rowIdx) => (
            <React.Fragment key={h}>
              {/* Time label */}
              <div 
                className="p-3 text-right pr-4 text-xs font-medium"
                style={{ 
                  color: 'var(--app-text-muted)',
                  borderBottom: '1px solid var(--app-border)',
                  gridColumn: 1,
                  gridRow: rowIdx + 1
                }}
              >
                {h}
              </div>
              {/* Day cells */}
              {[0, 1, 2, 3, 4].map((col) => (
                <div
                  key={col}
                  className="transition-colors hover:bg-white/5"
                  style={{ 
                    borderLeft: '1px solid var(--app-border)',
                    borderBottom: '1px solid var(--app-border)',
                    gridColumn: col + 2,
                    gridRow: rowIdx + 1
                  }}
                />
              ))}
            </React.Fragment>
          ))}

          {/* Events - positioned using grid-column and grid-row */}
          {mockBlocks.map((block, i) => (
            <div
              key={i}
              className={`${block.color} border text-xs font-semibold rounded-xl p-3 leading-snug cursor-pointer transition-all hover:scale-105 m-1`}
              style={{
                gridColumn: `${block.dayCol + 1} / ${block.dayCol + 2}`,
                gridRow: `${block.startRow} / span ${block.span}`,
                boxShadow: 'var(--app-shadow-lg)'
              }}
            >
              {block.title}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER NOTE */}
      <div className="px-8 py-4 text-center">
        <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
          ✨ Calendar view is a demo. Real Google Calendar sync is live and ready to connect.
        </p>
      </div>

      {/* REFERRAL SECTION */}
      <div className="pb-20">
        <ReferralSection />
      </div>
    </>
  );
}
