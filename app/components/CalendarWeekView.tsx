"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
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
  refetchTrigger?: number;
}

export function useCalendarEvents(weekOffset: number = 0) {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [weekStart, setWeekStart] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const appCalendarPromise = fetch("/api/app-calendar/events");
      
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

      let appEvents: CalendarEvent[] = [];
      if (appResponse.ok) {
        const appData = await appResponse.json();
        appEvents = transformAppEventsToCalendarEvents(appData.events || [], weekOffset);
      }

      let googleEvents: CalendarEvent[] = [];
      let weekStartDate = "";
      if (googleResponse && googleResponse.ok) {
        const googleData = await googleResponse.json();
        googleEvents = googleData.events || [];
        weekStartDate = googleData.weekStart || "";
      }

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
  }, [isAuthenticated, weekOffset]);

  return { events, weekStart, loading, error, refetch: fetchEvents, isAuthenticated };
}

export function useCalendarEventsWithRefetch(refetchTrigger?: number, weekOffset: number = 0) {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [weekStart, setWeekStart] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const appCalendarPromise = fetch("/api/app-calendar/events");
      
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

      let appEvents: CalendarEvent[] = [];
      if (appResponse.ok) {
        const appData = await appResponse.json();
        appEvents = transformAppEventsToCalendarEvents(appData.events || [], weekOffset);
      }

      let googleEvents: CalendarEvent[] = [];
      let weekStartDate = "";
      if (googleResponse && googleResponse.ok) {
        const googleData = await googleResponse.json();
        googleEvents = googleData.events || [];
        weekStartDate = googleData.weekStart || "";
      }

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
  }, [isAuthenticated, refetchTrigger, weekOffset]);

  return { events, weekStart, loading, error, refetch: fetchEvents, isAuthenticated };
}

function transformAppEventsToCalendarEvents(appEvents: any[], weekOffset: number = 0): CalendarEvent[] {
  const getMonday = (d: Date) => {
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diff + (weekOffset * 7));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const today = new Date();
  const weekStart = getMonday(today);

  return appEvents.filter(event => {
    const start = new Date(event.startDate);
    const daysDiff = Math.floor((start.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff >= 0 && daysDiff <= 6;
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
          span: 1,
          color: "bg-emerald-500/90",
          allDay: true
        }]
      };
    }

    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    
    const startRow = Math.max(0, Math.floor(startHour));
    const endRow = Math.min(24, Math.ceil(endHour));
    const span = Math.max(1, endRow - startRow);

    if (startRow < 0 || startRow >= 24) {
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
        color: "bg-blue-500/90"
      }]
    };
  });
}

export default function CalendarWeekView({ onEventCreate, readOnly = false, refetchTrigger }: CalendarWeekViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => {
    return `${String(i).padStart(2, '0')}:00`;
  });
  
  const [weekOffset, setWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  
  const { events, weekStart, loading, error, isAuthenticated } = useCalendarEventsWithRefetch(refetchTrigger, weekOffset);

  const navigateWeek = (direction: 'prev' | 'next') => {
    setWeekOffset(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };

  const getWeekDays = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + (weekOffset * 7));
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  const weekDays = getWeekDays();
  const displayDays = viewMode === 'day' ? [weekDays[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]] : weekDays;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const timedEvents = events.flatMap(event => 
    event.daySegments.filter(seg => !seg.allDay).map(segment => ({
      title: event.title,
      id: event.id,
      ...segment
    }))
  );

  const allDayEvents = events.flatMap(event =>
    event.daySegments.filter(seg => seg.allDay).map(segment => ({
      title: event.title,
      id: event.id,
      ...segment
    }))
  );

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <header className="px-6 py-4 border-b" style={{ 
        borderColor: 'var(--app-border)',
        background: 'var(--app-surface)'
      }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold" style={{ color: 'var(--app-text)' }}>
              {weekDays[0].toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigateWeek('prev')}
                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors" 
                style={{ color: 'var(--app-text-muted)' }}
                title="Previous week"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setWeekOffset(0)}
                className="px-3 py-1 text-xs hover:bg-white/5 rounded-lg transition-colors" 
                style={{ color: 'var(--app-text-muted)' }}
                title="Go to today"
              >
                Today
              </button>
              <button 
                onClick={() => navigateWeek('next')}
                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors" 
                style={{ color: 'var(--app-text-muted)' }}
                title="Next week"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--app-surface-secondary)' }}>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  viewMode === 'day' 
                    ? 'text-white' 
                    : 'hover:bg-white/5'
                }`}
                style={viewMode === 'day' ? { background: 'var(--app-accent)' } : { color: 'var(--app-text-muted)' }}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  viewMode === 'week' 
                    ? 'text-white' 
                    : 'hover:bg-white/5'
                }`}
                style={viewMode === 'week' ? { background: 'var(--app-accent)' } : { color: 'var(--app-text-muted)' }}
              >
                Week
              </button>
            </div>
            
            {loading && (
              <div className="flex items-center gap-2" style={{ color: 'var(--app-text-muted)' }}>
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs">Loading...</span>
              </div>
            )}
            {!readOnly && onEventCreate && (
              <button
                onClick={onEventCreate}
                className="premium-btn flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                New Event
              </button>
            )}
          </div>
        </div>
      </header>

      {/* UNAUTHENTICATED INFO */}
      {!isAuthenticated && (
        <div className="mx-6 mt-4 p-3 rounded-lg border-l-4" style={{ 
          background: 'var(--app-surface)',
          borderLeftColor: 'var(--app-accent)',
          borderTop: '1px solid var(--app-border)',
          borderRight: '1px solid var(--app-border)',
          borderBottom: '1px solid var(--app-border)'
        }}>
          <div className="font-semibold text-sm mb-0.5" style={{ color: 'var(--app-text)' }}>
            📅 Local Calendar
          </div>
          <div className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
            You're using the local calendar. Events are saved to your browser session. Sign in with Google to sync with Google Calendar and access your events across devices.
          </div>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && isAuthenticated && (
        <div className="mx-6 mt-4 p-3 rounded-lg border-l-4" style={{ 
          background: 'var(--app-surface)',
          borderLeftColor: 'var(--app-error)',
          borderTop: '1px solid var(--app-border)',
          borderRight: '1px solid var(--app-border)',
          borderBottom: '1px solid var(--app-border)'
        }}>
          <div className="font-semibold text-sm mb-0.5" style={{ color: 'var(--app-error)' }}>
            Calendar Error
          </div>
          <div className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
            {error}
          </div>
        </div>
      )}

      {/* CALENDAR GRID */}
      <div className="flex-1 overflow-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        <div className="p-6">
          {/* Days header */}
          <div className={`grid gap-0 mb-2`} style={{ gridTemplateColumns: `60px repeat(${displayDays.length}, 1fr)` }}>
            <div className="text-xs" style={{ color: 'var(--app-text-muted)' }}>GMT</div>
            {displayDays.map((date, i) => {
              const isToday = date.getTime() === today.getTime();
              return (
                <div key={i} className="text-center">
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--app-text-muted)' }}>
                    {date.toLocaleDateString('en-GB', { weekday: 'short' })} {date.getDate()}
                  </div>
                  {isToday && (
                    <div className="w-6 h-6 mx-auto rounded-full flex items-center justify-center text-white text-xs font-semibold" 
                      style={{ background: 'var(--app-accent)' }}>
                      {date.getDate()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* All-day events row */}
          {allDayEvents.length > 0 && (
            <div className="grid gap-0 mb-3" style={{ gridTemplateColumns: `60px repeat(${displayDays.length}, 1fr)` }}>
              <div className="text-[10px] pr-2 text-right" style={{ color: 'var(--app-text-muted)', paddingTop: '4px' }}>
                All day
              </div>
              {displayDays.map((day, idx) => {
                const dayCol = weekDays.findIndex(d => d.getTime() === day.getTime());
                const dayEvents = allDayEvents.filter(e => e.dayCol === dayCol);
                return (
                  <div key={idx} className="px-1">
                    {dayEvents.map((event, i) => (
                      <div
                        key={i}
                        className={`${event.color} border border-white/20 text-[11px] font-medium rounded-md px-2 py-1 mb-1 truncate`}
                        style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                      >
                        <div className="text-white truncate">{event.title}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* Time grid */}
          <div 
            className="relative grid"
            style={{
              gridTemplateColumns: `60px repeat(${displayDays.length}, 1fr)`,
              gridTemplateRows: `repeat(24, 3.5rem)`,
              borderTop: '1px solid var(--app-border)',
              borderLeft: '1px solid var(--app-border)'
            }}
          >
            {/* Hour labels and cells */}
            {hours.map((h, rowIdx) => (
              <React.Fragment key={h}>
                {/* Time label */}
                <div 
                  className="pr-2 text-right text-[11px]"
                  style={{ 
                    color: 'var(--app-text-muted)',
                    borderBottom: '1px solid var(--app-border)',
                    gridColumn: 1,
                    gridRow: rowIdx + 1,
                    paddingTop: '2px'
                  }}
                >
                  {h}
                </div>
                {/* Day cells */}
                {displayDays.map((day, idx) => {
                  const isToday = day && day.getTime() === today.getTime();
                  const dayColInWeek = weekDays.findIndex(d => d.getTime() === day.getTime());
                  
                  return (
                    <div
                      key={idx}
                      className="transition-colors hover:bg-white/5"
                      style={{ 
                        borderRight: '1px solid var(--app-border)',
                        borderBottom: '1px solid var(--app-border)',
                        gridColumn: idx + 2,
                        gridRow: rowIdx + 1,
                        background: isToday ? 'rgba(99, 102, 241, 0.05)' : 'transparent'
                      }}
                    />
                  );
                })}
              </React.Fragment>
            ))}

            {/* Events */}
            {timedEvents.map((block, i) => {
              const dayIndexInDisplay = displayDays.findIndex(d => {
                const dayCol = weekDays.findIndex(wd => wd.getTime() === d.getTime());
                return dayCol === block.dayCol;
              });
              
              if (dayIndexInDisplay === -1) return null;
              
              return (
                <div
                  key={i}
                  className={`${block.color} border border-white/20 text-[11px] font-medium rounded-md px-2 py-1 leading-tight cursor-pointer transition-all hover:scale-105 m-0.5 overflow-hidden`}
                  style={{
                    gridColumn: `${dayIndexInDisplay + 2} / ${dayIndexInDisplay + 3}`,
                    gridRow: `${block.startRow + 1} / span ${block.span}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    minHeight: '20px'
                  }}
                >
                  <div className="text-white truncate">{block.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
