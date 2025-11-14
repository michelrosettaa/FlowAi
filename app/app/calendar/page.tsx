"use client";

import React, { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  daySegments: Array<{
    dayCol: number;
    startRow: number;
    span: number;
    color: string;
    allDay?: boolean;
  }>;
}

export default function CalendarPage() {
  const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [weekStart, setWeekStart] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const response = await fetch("/api/calendar/events");
        if (!response.ok) {
          throw new Error("Failed to fetch calendar events");
        }
        const data = await response.json();
        setEvents(data.events || []);
        setWeekStart(data.weekStart || "");
        setError("");
      } catch (err: any) {
        console.error("Error fetching calendar:", err);
        setError(err.message || "Failed to load calendar");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const allDayEvents = events.flatMap(event => 
    event.daySegments.filter(seg => seg.allDay).map(segment => ({
      title: event.title,
      ...segment
    }))
  );

  const timedEvents = events.flatMap(event => 
    event.daySegments.filter(seg => !seg.allDay).map(segment => ({
      title: event.title,
      ...segment
    }))
  );

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
              {weekStart ? `Week of ${new Date(weekStart + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'My Calendar'}
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--app-text)' }}>
              Calendar
            </h1>
          </div>
          {loading && (
            <div className="flex items-center gap-2" style={{ color: 'var(--app-text-muted)' }}>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading events...</span>
            </div>
          )}
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

        {/* All-day events banner */}
        {allDayEvents.length > 0 && (
          <div className="grid grid-cols-[90px_repeat(5,1fr)] mb-4 premium-card" style={{ gridTemplateRows: '3rem' }}>
            <div className="p-3 text-right pr-4 text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>
              All day
            </div>
            {[0, 1, 2, 3, 4].map((col) => (
              <div key={col} className="relative" style={{ borderLeft: '1px solid var(--app-border)' }}>
                {allDayEvents
                  .filter(event => event.dayCol === col)
                  .map((event, i) => (
                    <div
                      key={i}
                      className={`${event.color} border text-xs font-semibold rounded-lg p-2 m-1 leading-snug cursor-pointer transition-all hover:scale-105`}
                      style={{ boxShadow: 'var(--app-shadow-lg)' }}
                    >
                      {event.title}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}

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
          {!loading && timedEvents.map((event, i) => (
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
        {error ? (
          <p className="text-xs" style={{ color: 'var(--app-accent)' }}>
            ⚠️ {error} - Please try refreshing the page
          </p>
        ) : (
          <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
            ✨ Connected to Google Calendar - Showing your real events for this week
          </p>
        )}
      </div>
    </>
  );
}
