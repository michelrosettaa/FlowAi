"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

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
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [weekStart, setWeekStart] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Always fetch app calendar events (works for both authenticated and unauthenticated)
      const appCalendarPromise = fetch("/api/app-calendar/events");
      
      // Conditionally fetch Google Calendar events for authenticated users
      const googleCalendarPromise = isAuthenticated 
        ? fetch("/api/calendar/events").catch(err => {
            console.warn("Google Calendar fetch failed, continuing with app calendar only:", err);
            return null;
          })
        : Promise.resolve(null);

      const [appResponse, googleResponse] = await Promise.all([
        appCalendarPromise,
        googleCalendarPromise
      ]);

      // Parse app calendar events
      let appEvents: CalendarEvent[] = [];
      if (appResponse.ok) {
        const appData = await appResponse.json();
        appEvents = transformAppEventsToCalendarEvents(appData.events || []);
      }

      // Parse Google Calendar events (if authenticated and successful)
      let googleEvents: CalendarEvent[] = [];
      let weekStartDate = "";
      if (googleResponse && googleResponse.ok) {
        const googleData = await googleResponse.json();
        googleEvents = googleData.events || [];
        weekStartDate = googleData.weekStart || "";
      }

      // Merge events (Google events first, then app events)
      const mergedEvents = [...googleEvents, ...appEvents];
      
      setEvents(mergedEvents);
      setWeekStart(weekStartDate);
    } catch (err: any) {
      console.error("Error fetching calendar:", err);
      setError(err.message || "Failed to load calendar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [isAuthenticated]);

  return { events, weekStart, loading, error, refetch: fetchEvents, isAuthenticated };
}

function transformAppEventsToCalendarEvents(appEvents: any[]): CalendarEvent[] {
  const getMonday = (d: Date) => {
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const today = new Date();
  const weekStart = getMonday(today);

  return appEvents.filter(event => {
    const start = new Date(event.startDate);
    const daysDiff = Math.floor((start.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff >= 0 && daysDiff <= 4;
  }).map(event => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    
    const daysDiff = Math.floor((start.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
    const dayCol = daysDiff;

    if (event.allDay) {
      return {
        id: event.id,
        title: event.title,
        daySegments: [{
          dayCol,
          startRow: 0,
          span: 9,
          color: "bg-emerald-500/90",
          allDay: true
        }]
      };
    }

    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    
    const startRow = Math.max(0, Math.floor((startHour - 9) * 1));
    const endRow = Math.min(9, Math.ceil((endHour - 9) * 1));
    const span = Math.max(1, endRow - startRow);

    if (startRow < 0 || startRow >= 9) {
      return {
        id: event.id,
        title: event.title,
        daySegments: []
      };
    }

    return {
      id: event.id,
      title: event.title,
      daySegments: [{
        dayCol,
        startRow,
        span,
        color: "bg-emerald-500/90"
      }]
    };
  });
}

export default function CalendarWeekView({ onEventCreate, readOnly = false }: CalendarWeekViewProps) {
  const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];
  const { events, weekStart, loading, error, isAuthenticated } = useCalendarEvents();

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

      {/* UNAUTHENTICATED INFO */}
      {!isAuthenticated && (
        <div className="mx-8 mt-6 p-4 premium-card border-l-4" style={{ borderLeftColor: 'var(--app-accent)' }}>
          <div className="font-semibold mb-1" style={{ color: 'var(--app-text)' }}>
            📅 Local Calendar
          </div>
          <div className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
            You're using the local calendar. Events are saved to your browser session. Sign in with Google to sync with Google Calendar and access your events across devices.
          </div>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && isAuthenticated && (
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
