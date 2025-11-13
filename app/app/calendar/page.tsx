"use client";

import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
  const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];

  const events = [
    {
      title: "Deep Work — Pitch Deck",
      dayCol: 0,
      startRow: 0,
      span: 2,
      color: "bg-emerald-400/30 border-emerald-400/60 text-emerald-200",
    },
    {
      title: "Investor Follow-up Email",
      dayCol: 1,
      startRow: 2,
      span: 1,
      color: "bg-indigo-400/30 border-indigo-400/50 text-indigo-200",
    },
    {
      title: "Team Sync (Meet)",
      dayCol: 2,
      startRow: 1,
      span: 1,
      color: "bg-blue-400/30 border-blue-400/50 text-blue-200",
    },
    {
      title: "Client Call / Next Steps",
      dayCol: 3,
      startRow: 3,
      span: 1,
      color: "bg-pink-400/30 border-pink-400/50 text-pink-200",
    },
    {
      title: "Prep Outreach / Follow Ups",
      dayCol: 4,
      startRow: 4,
      span: 2,
      color: "bg-yellow-400/30 border-yellow-400/50 text-yellow-200",
    },
  ];

  return (
    <>
      {/* Header */}
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
              Calendar
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
              + New Event
            </button>
          </div>
        </div>
      </header>

      {/* Calendar Grid */}
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

        {/* Time rows - Using CSS Grid */}
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
          {events.map((event, i) => (
            <div
              key={i}
              className={`${event.color} border text-xs font-semibold rounded-xl p-3 leading-snug cursor-pointer transition-all hover:scale-105 m-1`}
              style={{
                gridColumn: `${event.dayCol + 2} / ${event.dayCol + 3}`,
                gridRow: `${event.startRow + 1} / span ${event.span}`,
                boxShadow: 'var(--app-shadow-lg)'
              }}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 py-4 text-center">
        <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
          ✨ Google Calendar sync is live — connect your calendar for real-time updates.
        </p>
      </div>
    </>
  );
}
