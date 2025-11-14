import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { requireNextAuth } from "./nextAuthMiddleware";
import OpenAI from "openai";
import { getGmailClient } from "../lib/integrations/gmail";
import { getCalendarClient } from "../lib/integrations/calendar";
import { sendNotificationEmail, emailTemplates } from "./notifications";
import { fromZonedTime, toZonedTime, format } from "date-fns-tz";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/auth/user", requireNextAuth, async (req: any, res) => {
    try {
      const userId = req.auth!.userId;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/ask-flowai", requireNextAuth, async (req: any, res) => {
    try {
      const userId = req.auth!.userId;
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      let calendarContext = "";
      try {
        const calendar = await getCalendarClient(userId);
        
        const calendarInfo = await calendar.calendars.get({ calendarId: 'primary' });
        const userTimezone = calendarInfo.data.timeZone || 'UTC';

        const now = new Date();
        const nowInUserTz = toZonedTime(now, userTimezone);
        
        const todayDateStr = format(nowInUserTz, 'yyyy-MM-dd', { timeZone: userTimezone });
        
        const todayStart = fromZonedTime(`${todayDateStr} 00:00:00`, userTimezone);
        const todayEnd = fromZonedTime(`${todayDateStr} 23:59:59`, userTimezone);

        const response = await calendar.events.list({
          calendarId: 'primary',
          timeMin: todayStart.toISOString(),
          timeMax: todayEnd.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
          timeZone: userTimezone,
        });

        const events = response.data.items || [];
        
        if (events.length > 0) {
          const eventsList = events.map((event: any) => {
            const isAllDay = !event.start?.dateTime;
            
            if (isAllDay) {
              return `- All day: ${event.summary || 'Untitled event'}`;
            }
            
            const start = new Date(event.start.dateTime);
            const end = new Date(event.end.dateTime);
            
            const startTime = start.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              timeZone: userTimezone 
            });
            const endTime = end.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              timeZone: userTimezone 
            });
            
            return `- ${startTime} - ${endTime}: ${event.summary || 'Untitled event'}`;
          }).join('\n');
          
          calendarContext = `\n\nUSER'S CALENDAR FOR TODAY (${userTimezone}):\n${eventsList}\n`;
        } else {
          calendarContext = "\n\nUSER'S CALENDAR: No events scheduled for today.";
        }
      } catch (calError) {
        console.error("Calendar fetch error:", calError);
        calendarContext = "\n\n(Calendar data currently unavailable)";
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are FlowAI, an intelligent productivity assistant integrated into a productivity platform. You help users with:
- Planning their day and managing tasks
- Understanding their schedule and calendar
- Email management and drafting
- Meeting summaries and action items
- Focus time and productivity insights

Be concise, helpful, and actionable. Provide specific suggestions when possible. Keep responses brief (2-3 sentences max unless asked for more detail).${calendarContext}`,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const reply = completion.choices[0]?.message?.content || "I'm not sure how to help with that.";
      res.json({ reply });
    } catch (err: any) {
      console.error("Ask FlowAI error:", err);
      res.status(500).json({ error: err.message || "Failed to get AI response" });
    }
  });

  app.post("/api/email/send", requireNextAuth, async (req: any, res) => {
    try {
      const userId = req.auth!.userId;
      const { recipient, subject, emailBody } = req.body;

      if (!recipient || !subject || !emailBody) {
        return res.status(400).json({ error: "Recipient, subject, and email body are required" });
      }

      const gmail = await getGmailClient(userId);

      const email = [
        `To: ${recipient}`,
        `Subject: ${subject}`,
        "Content-Type: text/html; charset=utf-8",
        "",
        emailBody,
      ].join("\n");

      const encodedEmail = Buffer.from(email)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedEmail,
        },
      });

      console.log("✅ Email sent successfully via Gmail");
      res.json({ ok: true, message: "Email sent successfully" });
    } catch (err: any) {
      console.error("Email send error:", err);
      res.status(500).json({ error: err.message || "Failed to send email" });
    }
  });

  app.post("/api/email/generate", requireNextAuth, async (req: any, res) => {
    try {
      const { recipient, subject = "", context = "" } = req.body;

      if (!recipient || !context) {
        return res.status(400).json({ error: "Missing recipient or context" });
      }

      const prompt = `Write a short, polite email to ${recipient}.
Subject: ${subject || "(create a natural subject)"}.
Context: ${context}.
Keep it warm, professional, and include clear next steps.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You write friendly, professional business emails. Be concise, human, and polite.",
          },
          { role: "user", content: prompt },
        ],
      });

      const emailText = completion.choices?.[0]?.message?.content || "No email generated.";
      res.json({ email: emailText });
    } catch (err: any) {
      console.error("Email generation error:", err);
      res.status(500).json({ error: err.message || "Server error" });
    }
  });

  app.get("/api/calendar/events", requireNextAuth, async (req: any, res) => {
    try {
      const userId = req.auth!.userId;
      const calendar = await getCalendarClient(userId);
      
      const calendarInfo = await calendar.calendars.get({ calendarId: 'primary' });
      const userTimezone = calendarInfo.data.timeZone || 'UTC';

      const now = new Date();
      const nowInUserTz = toZonedTime(now, userTimezone);
      
      const currentDayOfWeek = nowInUserTz.getDay();
      const daysFromMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
      
      const mondayDate = new Date(nowInUserTz);
      mondayDate.setDate(mondayDate.getDate() - daysFromMonday);
      
      const fridayDate = new Date(mondayDate);
      fridayDate.setDate(mondayDate.getDate() + 4);
      
      const mondayStr = format(mondayDate, 'yyyy-MM-dd', { timeZone: userTimezone });
      const saturdayStr = format(fridayDate, 'yyyy-MM-dd', { timeZone: userTimezone });
      const saturdayDate = new Date(fridayDate);
      saturdayDate.setDate(fridayDate.getDate() + 1);
      const saturdaySt = format(saturdayDate, 'yyyy-MM-dd', { timeZone: userTimezone });
      
      const weekStart = fromZonedTime(`${mondayStr} 00:00:00`, userTimezone);
      const weekEnd = fromZonedTime(`${saturdaySt} 00:00:00`, userTimezone);

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: weekStart.toISOString(),
        timeMax: weekEnd.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        timeZone: userTimezone,
      });

      const events = response.data.items || [];
      
      const normalizedEvents = events.map((event: any) => {
        const isAllDay = !event.start?.dateTime;
        
        if (isAllDay) {
          const startDate = new Date(event.start.date + 'T00:00:00');
          const endDate = new Date(event.end.date + 'T00:00:00');
          
          const daySegments = [];
          const currentDate = new Date(startDate);
          
          while (currentDate < endDate) {
            const dayOfWeek = currentDate.getDay();
            const dayCol = dayOfWeek === 0 ? -1 : dayOfWeek - 1;
            
            if (dayCol >= 0 && dayCol <= 4) {
              daySegments.push({
                dayCol,
                startRow: -1,
                span: 1,
                allDay: true,
                color: 'bg-purple-400/30 border-purple-400/50 text-purple-200'
              });
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          return {
            id: event.id,
            title: event.summary || 'Untitled',
            start: event.start.date,
            end: event.end.date,
            allDay: true,
            daySegments
          };
        }
        
        const start = new Date(event.start.dateTime);
        const end = new Date(event.end.dateTime);
        
        const startInUserTz = toZonedTime(start, userTimezone);
        const endInUserTz = toZonedTime(end, userTimezone);
        
        const daySegments = [];
        let currentDayStart = new Date(startInUserTz);
        currentDayStart.setHours(0, 0, 0, 0);
        
        while (currentDayStart <= endInUserTz) {
          const dayOfWeek = currentDayStart.getDay();
          const dayCol = dayOfWeek === 0 ? -1 : dayOfWeek - 1;
          
          if (dayCol >= 0 && dayCol <= 4) {
            const dayEnd = new Date(currentDayStart);
            dayEnd.setHours(23, 59, 59, 999);
            
            const isStartDay = format(currentDayStart, 'yyyy-MM-dd', { timeZone: userTimezone }) === format(startInUserTz, 'yyyy-MM-dd', { timeZone: userTimezone });
            const isEndDay = format(currentDayStart, 'yyyy-MM-dd', { timeZone: userTimezone }) === format(endInUserTz, 'yyyy-MM-dd', { timeZone: userTimezone });
            
            const segmentStart = isStartDay ? startInUserTz : fromZonedTime(`${format(currentDayStart, 'yyyy-MM-dd', { timeZone: userTimezone })} 09:00:00`, userTimezone);
            const segmentEnd = isEndDay ? endInUserTz : fromZonedTime(`${format(currentDayStart, 'yyyy-MM-dd', { timeZone: userTimezone })} 17:00:00`, userTimezone);
            
            const segmentStartInTz = toZonedTime(segmentStart, userTimezone);
            const segmentEndInTz = toZonedTime(segmentEnd, userTimezone);
            
            const startHour = parseInt(format(segmentStartInTz, 'HH', { timeZone: userTimezone }));
            const endHour = parseInt(format(segmentEndInTz, 'HH', { timeZone: userTimezone }));
            const endMinutes = parseInt(format(segmentEndInTz, 'mm', { timeZone: userTimezone }));
            
            const clampedStartHour = Math.max(9, Math.min(17, startHour));
            const clampedEndHour = Math.max(9, Math.min(17, endHour + (endMinutes > 0 ? 1 : 0)));
            
            if (clampedEndHour > clampedStartHour && clampedStartHour < 17) {
              const startRow = clampedStartHour - 9;
              const span = clampedEndHour - clampedStartHour;
              
              daySegments.push({
                dayCol,
                startRow,
                span: Math.max(1, span),
                allDay: false,
                color: 'bg-indigo-400/30 border-indigo-400/50 text-indigo-200'
              });
            }
          }
          
          currentDayStart.setDate(currentDayStart.getDate() + 1);
          currentDayStart.setHours(0, 0, 0, 0);
        }
        
        if (daySegments.length === 0) {
          return null;
        }
        
        return {
          id: event.id,
          title: event.summary || 'Untitled',
          start: event.start.dateTime,
          end: event.end.dateTime,
          allDay: false,
          daySegments
        };
      }).filter(e => e !== null);
      
      res.json({ 
        events: normalizedEvents,
        weekStart: mondayStr,
        timezone: userTimezone
      });
    } catch (err: any) {
      console.error("Calendar events error:", err);
      res.status(500).json({ error: err.message || "Failed to fetch calendar events" });
    }
  });

  app.post("/api/calendar/events", requireNextAuth, async (req: any, res) => {
    try {
      const userId = req.auth!.userId;
      const { title, start, end, description } = req.body;

      if (!title || !start || !end) {
        return res.status(400).json({ error: "Title, start, and end times are required" });
      }

      const startDate = new Date(start);
      const endDate = new Date(end);

      if (startDate >= endDate) {
        return res.status(400).json({ error: "End time must be after start time" });
      }

      const calendar = await getCalendarClient(userId);
      
      const calendarInfo = await calendar.calendars.get({ calendarId: 'primary' });
      const userTimezone = calendarInfo.data.timeZone || 'UTC';

      const event = {
        summary: title,
        description: description || '',
        start: {
          dateTime: startDate.toISOString(),
          timeZone: userTimezone,
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: userTimezone,
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });

      res.json({ 
        success: true, 
        event: response.data,
        message: "Event created successfully" 
      });
    } catch (err: any) {
      console.error("Create calendar event error:", err);
      res.status(500).json({ error: err.message || "Failed to create calendar event" });
    }
  });

  app.post("/api/mentor", requireNextAuth, async (req: any, res) => {
    try {
      const { text, voice } = req.body;
      const voiceMap: Record<string, string> = {
        coach: "alloy",
        calm: "verse",
        therapist: "sol",
        focus: "echo",
      };
      const voiceId = voiceMap[voice] || "alloy";

      const chat = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are FlowAI, an AI mentor with a ${voice} personality. Be concise, warm, and motivational in your feedback.`,
          },
          { role: "user", content: text },
        ],
      });

      const summary = chat.choices[0]?.message?.content || "Keep going — you're making amazing progress!";

      const speech = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: voiceId,
        input: summary,
      });

      const audioBuffer = Buffer.from(await speech.arrayBuffer());
      const audioBase64 = audioBuffer.toString("base64");

      res.json({ summary, audio: audioBase64 });
    } catch (error) {
      console.error("❌ Mentor API Error:", error);
      res.status(500).json({ error: "Failed to generate mentor voice." });
    }
  });

  app.get("/api/tasks", requireNextAuth, async (req: any, res) => {
    try {
      const userId = req.auth!.userId;
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", requireNextAuth, async (req: any, res) => {
    try {
      const userId = req.auth!.userId;
      const task = await storage.createTask({
        ...req.body,
        userId,
      });
      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", requireNextAuth, async (req: any, res) => {
    try {
      const userId = req.auth!.userId;
      const task = await storage.updateTask(req.params.id, userId, req.body);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", requireNextAuth, async (req: any, res) => {
    try {
      const userId = req.auth!.userId;
      const deleted = await storage.deleteTask(req.params.id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  app.get("/api/preferences", requireNextAuth, async (req: any, res) => {
    try {
      const userId = req.auth!.userId;
      const prefs = await storage.getUserPreferences(userId);
      res.json(prefs?.preferences || {});
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.post("/api/onboarding", requireNextAuth, async (req: any, res) => {
    try {
      const userId = req.auth!.userId;
      const { answers } = req.body;

      await storage.updateUser(userId, {
        onboardingCompleted: true,
        onboardingData: answers,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error saving onboarding:", error);
      res.status(500).json({ message: "Failed to save onboarding" });
    }
  });

  app.post("/api/preferences", requireNextAuth, async (req: any, res) => {
    try {
      const userId = req.auth!.userId;
      const prefs = await storage.upsertUserPreferences({
        userId,
        preferences: req.body,
      });
      res.json(prefs.preferences);
    } catch (error) {
      console.error("Error saving preferences:", error);
      res.status(500).json({ message: "Failed to save preferences" });
    }
  });

  // Notification endpoints
  app.post("/api/notifications/send-daily-digest", requireNextAuth, async (req: any, res) => {
    try {
      const userId = req.auth!.userId;
      const user = await storage.getUser(userId);
      
      if (!user?.email) {
        return res.status(400).json({ error: "User email not found" });
      }

      // Get user's tasks and events
      const tasks = await storage.getTasks(userId);
      const todayTasks = tasks.filter((t: any) => !t.completed);
      
      // Mock events for now - in the future, integrate with Google Calendar
      const events = [
        { title: "Team Standup", time: "9:00 AM" },
        { title: "Focus Work Block", time: "2:00 PM" }
      ];

      const html = emailTemplates.dailyDigest(
        user.firstName || user.email.split('@')[0],
        todayTasks.slice(0, 5),  // Top 5 tasks
        events
      );

      await sendNotificationEmail({
        to: user.email,
        subject: "☀️ Your Daily FlowAI Digest",
        html
      });

      res.json({ success: true, message: "Daily digest sent" });
    } catch (error: any) {
      console.error("Error sending daily digest:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/notifications/send-task-reminder", requireNextAuth, async (req: any, res) => {
    try {
      const userId = req.auth!.userId;
      const { taskId } = req.body;
      
      if (!taskId) {
        return res.status(400).json({ error: "Task ID required" });
      }

      const user = await storage.getUser(userId);
      if (!user?.email) {
        return res.status(400).json({ error: "User email not found" });
      }

      const tasks = await storage.getTasks(userId);
      const task = tasks.find((t: any) => t.id === taskId);
      
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      const html = emailTemplates.taskReminder(
        user.firstName || user.email.split('@')[0],
        task,
        "Today"
      );

      await sendNotificationEmail({
        to: user.email,
        subject: `⏰ Reminder: ${task.title}`,
        html
      });

      res.json({ success: true, message: "Task reminder sent" });
    } catch (error: any) {
      console.error("Error sending task reminder:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/notifications/send-focus-alert", requireNextAuth, async (req: any, res) => {
    try {
      const userId = req.auth!.userId;
      const { focusBlock } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user?.email) {
        return res.status(400).json({ error: "User email not found" });
      }

      const html = emailTemplates.focusTimeAlert(
        user.firstName || user.email.split('@')[0],
        focusBlock || { title: "Deep Work Session", time: "In 15 minutes" }
      );

      await sendNotificationEmail({
        to: user.email,
        subject: "🧠 Focus Time Starting Soon",
        html
      });

      res.json({ success: true, message: "Focus alert sent" });
    } catch (error: any) {
      console.error("Error sending focus alert:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/plan", requireNextAuth, async (req: any, res) => {
    try {
      const { tasks } = req.body;

      if (!tasks || !tasks.trim()) {
        return res.status(400).json({ error: "Tasks are required" });
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a productivity assistant. Create a time-blocked daily schedule from the user's tasks. 
Format your response as:
1. A detailed plan with specific times (9am-5pm work hours)
2. Include breaks and realistic time estimates
3. Prioritize important tasks for peak productivity hours

Return your response in this exact format:
PLAN:
[detailed schedule here]

TIMELINE:
- 9:00 AM | [task]
- 10:30 AM | [task]
etc.`
          },
          {
            role: "user",
            content: `Create a schedule for these tasks: ${tasks}`
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
      });

      const response = completion.choices[0]?.message?.content || "";
      
      const parts = response.split("TIMELINE:");
      const plan = parts[0].replace("PLAN:", "").trim();
      const timelineText = parts[1] || "";
      
      const timeline = timelineText
        .split("\n")
        .filter(line => line.trim() && line.includes("|"))
        .map(line => {
          const [time, label] = line.split("|").map(s => s.trim().replace(/^-\s*/, ""));
          return { time, label };
        });

      res.json({
        plan,
        timeline: timeline.length > 0 ? timeline : undefined,
      });
    } catch (err: any) {
      console.error("Plan generation error:", err);
      res.status(500).json({ error: err.message || "Failed to generate plan" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
