import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import OpenAI from "openai";
import { getGmailClient } from "../lib/integrations/gmail";
import { getCalendarClient } from "../lib/integrations/calendar";
import { sendNotificationEmail, emailTemplates } from "./notifications";
import { fromZonedTime, toZonedTime, format } from "date-fns-tz";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/ask-flowai", isAuthenticated, async (req: any, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      let calendarContext = "";
      try {
        const calendar = await getCalendarClient();
        
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

  app.post("/api/email/send", isAuthenticated, async (req: any, res) => {
    try {
      const { recipient, subject, emailBody } = req.body;

      if (!recipient || !subject || !emailBody) {
        return res.status(400).json({ error: "Recipient, subject, and email body are required" });
      }

      const gmail = await getGmailClient();

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

  app.post("/api/email/generate", isAuthenticated, async (req: any, res) => {
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

  app.post("/api/mentor", isAuthenticated, async (req: any, res) => {
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

  app.get("/api/tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.patch("/api/tasks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.delete("/api/tasks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.get("/api/preferences", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const prefs = await storage.getUserPreferences(userId);
      res.json(prefs?.preferences || {});
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.post("/api/preferences", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app.post("/api/notifications/send-daily-digest", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.email) {
        return res.status(400).json({ error: "User email not found" });
      }

      // Get user's tasks and events
      const tasks = await storage.getUserTasks(userId);
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

  app.post("/api/notifications/send-task-reminder", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { taskId } = req.body;
      
      if (!taskId) {
        return res.status(400).json({ error: "Task ID required" });
      }

      const user = await storage.getUser(userId);
      if (!user?.email) {
        return res.status(400).json({ error: "User email not found" });
      }

      const tasks = await storage.getUserTasks(userId);
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

  app.post("/api/notifications/send-focus-alert", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  const httpServer = createServer(app);
  return httpServer;
}
