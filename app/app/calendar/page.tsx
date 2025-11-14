"use client";

import React, { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Loader2, Plus } from "lucide-react";

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: ""
  });

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

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setCreating(true);
      const response = await fetch("/api/calendar/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      setShowCreateModal(false);
      setNewEvent({ title: "", start: "", end: "", description: "" });
      
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to create event");
    } finally {
      setCreating(false);
    }
  };

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
          <div className="flex items-center gap-3">
            {loading && (
              <div className="flex items-center gap-2" style={{ color: 'var(--app-text-muted)' }}>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading events...</span>
              </div>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: 'white',
                boxShadow: 'var(--app-shadow-lg)'
              }}
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>
        </div>
      </header>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
          <div className="premium-card p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--app-text)' }}>
              Create New Event
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--app-text-muted)' }}>
                  Event Title *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Meeting with team"
                  className="w-full px-4 py-2 rounded-lg border text-sm outline-none transition-all"
                  style={{
                    background: 'var(--app-bg)',
                    borderColor: 'var(--app-border)',
                    color: 'var(--app-text)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--app-text-muted)' }}>
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  value={newEvent.start}
                  onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border text-sm outline-none"
                  style={{
                    background: 'var(--app-bg)',
                    borderColor: 'var(--app-border)',
                    color: 'var(--app-text)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--app-text-muted)' }}>
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border text-sm outline-none"
                  style={{
                    background: 'var(--app-bg)',
                    borderColor: 'var(--app-border)',
                    color: 'var(--app-text)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--app-text-muted)' }}>
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Optional details..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border text-sm outline-none resize-none"
                  style={{
                    background: 'var(--app-bg)',
                    borderColor: 'var(--app-border)',
                    color: 'var(--app-text)'
                  }}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border font-semibold text-sm transition-all hover:scale-105"
                  style={{
                    borderColor: 'var(--app-border)',
                    color: 'var(--app-text-muted)'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  disabled={creating}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: 'white',
                    boxShadow: 'var(--app-shadow-lg)'
                  }}
                >
                  {creating ? "Creating..." : "Create Event"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
