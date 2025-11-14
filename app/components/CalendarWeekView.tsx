"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  daySegments: Array<{
    dayCol: number;
    startRow: number;
    span: number;
    color: string;
    allDay?: boolean;
  }>;
}

interface CalendarWeekViewProps {
  onEventCreate?: () => void;
  readOnly?: boolean;
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [weekStart, setWeekStart] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/calendar/events");
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch calendar events");
      }
      
      const data = await response.json();
      setEvents(data.events || []);
      setWeekStart(data.weekStart || "");
    } catch (err: any) {
      console.error("Error fetching calendar:", err);
      setError(err.message || "Failed to load calendar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, weekStart, loading, error, refetch: fetchEvents };
}

export default function CalendarWeekView({ onEventCreate, readOnly = false }: CalendarWeekViewProps) {
  const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];
  const { events, weekStart, loading, error } = useCalendarEvents();

  const timedEvents = events.flatMap(event => 
    event.daySegments.filter(seg => !seg.allDay).map(segment => ({
      title: event.title,
      ...segment
    }))
  );

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
              {weekStart ? `Week of ${new Date(weekStart + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'My Calendar'}
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--app-text)' }}>
              My Calendar
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {loading && (
              <div className="flex items-center gap-2" style={{ color: 'var(--app-text-muted)' }}>
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Loading calendar...</span>
              </div>
            )}
            {!readOnly && onEventCreate && (
              <button
                onClick={onEventCreate}
                className="premium-btn flex items-center gap-2"
              >
                <Plus size={18} />
                Add Block
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mx-8 mt-6 p-4 premium-card border-l-4" style={{ borderLeftColor: 'var(--app-error)' }}>
          <div className="font-semibold mb-1" style={{ color: 'var(--app-error)' }}>
            Calendar Error
          </div>
          <div className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
            {error}
          </div>
          <div className="text-xs mt-2" style={{ color: 'var(--app-text-dim)' }}>
            Try signing out and back in to refresh your Google Calendar connection.
          </div>
        </div>
      )}

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
          {timedEvents.map((block, i) => (
            <div
              key={i}
              className={`${block.color} border text-xs font-semibold rounded-xl p-3 leading-snug cursor-pointer transition-all hover:scale-105 m-1`}
              style={{
                gridColumn: `${block.dayCol + 2} / ${block.dayCol + 3}`,
                gridRow: `${block.startRow + 1} / span ${block.span}`,
                boxShadow: 'var(--app-shadow-lg)'
              }}
            >
              {block.title}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
