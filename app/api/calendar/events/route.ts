import { NextResponse } from "next/server";
import { getCalendarClient } from "@/lib/integrations/calendar";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const timeMin = searchParams.get("timeMin") || new Date().toISOString();
    const timeMax = searchParams.get("timeMax");
    const maxResults = parseInt(searchParams.get("maxResults") || "10");

    const calendar = await getCalendarClient();

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin,
      timeMax: timeMax || undefined,
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];

    return NextResponse.json({ 
      ok: true, 
      events: events.map(event => ({
        id: event.id,
        summary: event.summary,
        description: event.description,
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        htmlLink: event.htmlLink,
      }))
    });
  } catch (err: any) {
    console.error("Calendar fetch error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch calendar events" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { summary, description, start, end } = await req.json();

    if (!summary || !start || !end) {
      return NextResponse.json(
        { error: "Summary, start time, and end time are required" },
        { status: 400 }
      );
    }

    const calendar = await getCalendarClient();

    const event = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary,
        description,
        start: {
          dateTime: start,
          timeZone: "America/New_York",
        },
        end: {
          dateTime: end,
          timeZone: "America/New_York",
        },
      },
    });

    console.log("✅ Calendar event created successfully");
    console.log("Event:", event.data.summary);

    return NextResponse.json({ 
      ok: true, 
      event: {
        id: event.data.id,
        summary: event.data.summary,
        htmlLink: event.data.htmlLink,
      }
    });
  } catch (err: any) {
    console.error("Calendar create error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create calendar event" },
      { status: 500 }
    );
  }
}
