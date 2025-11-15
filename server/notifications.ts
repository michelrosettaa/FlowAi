import { getGmailClient } from "../lib/integrations/gmail";

export interface NotificationEmail {
  to: string;
  subject: string;
  html: string;
}

export async function sendNotificationEmail({ to, subject, html }: NotificationEmail) {
  try {
    const gmail = await getGmailClient();

    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "Content-Type: text/html; charset=utf-8",
      "",
      html,
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

    console.log(`✅ Notification email sent to ${to}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to send notification email:", error);
    return { success: false, error: error.message };
  }
}

// Email Templates
export const emailTemplates = {
  welcome: (userName: string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%); padding: 40px 24px; text-align: center;">
            <div style="width: 64px; height: 64px; margin: 0 auto 20px; background: white; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; color: #6366f1;">
              F
            </div>
            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Welcome to Refraim AI! 🎉</h1>
            <p style="margin: 12px 0 0; color: rgba(255,255,255,0.95); font-size: 16px;">Your personal AI productivity assistant</p>
          </div>

          <div style="padding: 40px 24px;">
            <p style="margin: 0 0 20px; color: #1e293b; font-size: 16px; line-height: 1.6;">
              Hi ${userName},
            </p>
            <p style="margin: 0 0 20px; color: #1e293b; font-size: 16px; line-height: 1.6;">
              Welcome to Refraim AI! We're thrilled to have you on board. 🚀
            </p>
            <p style="margin: 0 0 24px; color: #1e293b; font-size: 16px; line-height: 1.6;">
              Refraim AI is here to supercharge your productivity by helping you:
            </p>

            <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <div style="margin-bottom: 16px;">
                <span style="font-size: 20px; margin-right: 8px;">🗓️</span>
                <strong style="color: #1e293b; font-size: 15px;">Smart Calendar Management</strong>
                <p style="margin: 4px 0 0 28px; color: #64748b; font-size: 14px;">AI-powered scheduling and time blocking</p>
              </div>
              <div style="margin-bottom: 16px;">
                <span style="font-size: 20px; margin-right: 8px;">✉️</span>
                <strong style="color: #1e293b; font-size: 15px;">Email Assistant</strong>
                <p style="margin: 4px 0 0 28px; color: #64748b; font-size: 14px;">Draft replies and manage your inbox with AI</p>
              </div>
              <div style="margin-bottom: 16px;">
                <span style="font-size: 20px; margin-right: 8px;">✅</span>
                <strong style="color: #1e293b; font-size: 15px;">Task Management</strong>
                <p style="margin: 4px 0 0 28px; color: #64748b; font-size: 14px;">Organise and prioritise your work efficiently</p>
              </div>
              <div>
                <span style="font-size: 20px; margin-right: 8px;">🤖</span>
                <strong style="color: #1e293b; font-size: 15px;">Ask Refraim AI Anything</strong>
                <p style="margin: 4px 0 0 28px; color: #64748b; font-size: 14px;">Get instant answers about your schedule and tasks</p>
              </div>
            </div>

            <p style="margin: 0 0 24px; color: #1e293b; font-size: 16px; line-height: 1.6;">
              Ready to boost your productivity? Log in to your Refraim AI dashboard and start exploring!
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.NEXTAUTH_URL || process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}/app` : 'https://refraim.com/app'}" 
                 style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(99,102,241,0.3);">
                Go to Dashboard
              </a>
            </div>

            <p style="margin: 24px 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
              Need help getting started? Just reply to this email and our team will be happy to assist you.
            </p>
          </div>

          <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 13px;">
              Happy flowing! 🌊<br>
              The Refraim AI Team
            </p>
            <p style="margin: 12px 0 0; color: #94a3b8; font-size: 12px;">
              © ${new Date().getFullYear()} Refraim AI - Your Personal AI Productivity Assistant
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  },
  dailyDigest: (userName: string, tasks: any[], events: any[]) => {
    const tasksList = tasks.length > 0
      ? tasks.map(t => `<li style="margin-bottom: 8px;">${t.title}</li>`).join('')
      : '<li style="color: #64748b;">No tasks for today 🎉</li>';

    const eventsList = events.length > 0
      ? events.map(e => `<li style="margin-bottom: 8px;">${e.title} - ${e.time}</li>`).join('')
      : '<li style="color: #64748b;">No events scheduled</li>';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%); padding: 32px 24px; text-align: center;">
            <div style="width: 56px; height: 56px; margin: 0 auto 16px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; color: #6366f1;">
              F
            </div>
            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: bold;">Good Morning, ${userName}!</h1>
            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Here's your daily productivity digest</p>
          </div>

          <!-- Content -->
          <div style="padding: 32px 24px;">
            <!-- Tasks Section -->
            <div style="margin-bottom: 24px;">
              <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                <span style="margin-right: 8px;">✅</span> Your Tasks Today
              </h2>
              <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 15px;">
                ${tasksList}
              </ul>
            </div>

            <!-- Events Section -->
            <div style="margin-bottom: 24px;">
              <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                <span style="margin-right: 8px;">📅</span> Your Schedule
              </h2>
              <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 15px;">
                ${eventsList}
              </ul>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 'https://refraim.com'}" 
                 style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
                Open Refraim AI
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding: 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="margin: 0; color: #64748b; font-size: 13px;">
              You're receiving this because you enabled daily digest emails in Refraim AI
            </p>
            <p style="margin: 8px 0 0; color: #94a3b8; font-size: 12px;">
              © ${new Date().getFullYear()} Refraim AI - Your Personal AI Productivity Assistant
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  taskReminder: (userName: string, task: any, dueTime: string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 24px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 12px;">⏰</div>
            <h1 style="margin: 0; color: white; font-size: 20px; font-weight: bold;">Task Reminder</h1>
          </div>

          <div style="padding: 32px 24px;">
            <p style="margin: 0 0 16px; color: #1e293b; font-size: 16px;">Hi ${userName},</p>
            <p style="margin: 0 0 24px; color: #475569; font-size: 15px; line-height: 1.6;">
              This is a friendly reminder about your upcoming task:
            </p>

            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <h3 style="margin: 0 0 8px; color: #1e293b; font-size: 16px; font-weight: 600;">${task.title}</h3>
              <p style="margin: 0; color: #78350f; font-size: 14px;">📍 Due: ${dueTime}</p>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/app` : 'https://refraim.com/app'}" 
                 style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #f97316); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
                View Task
              </a>
            </div>
          </div>

          <div style="padding: 16px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">Refraim AI - Stay on track, stay productive</p>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  focusTimeAlert: (userName: string, focusBlock: any) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 24px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 12px;">🧠</div>
            <h1 style="margin: 0; color: white; font-size: 20px; font-weight: bold;">Focus Time Starting Soon</h1>
          </div>

          <div style="padding: 32px 24px;">
            <p style="margin: 0 0 16px; color: #1e293b; font-size: 16px;">Hi ${userName},</p>
            <p style="margin: 0 0 24px; color: #475569; font-size: 15px; line-height: 1.6;">
              Your dedicated focus time is starting in 15 minutes. Time to wrap up and prepare for deep work!
            </p>

            <div style="background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%); border-left: 4px solid #6366f1; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <h3 style="margin: 0 0 8px; color: #1e293b; font-size: 16px; font-weight: 600;">${focusBlock.title || 'Deep Work Session'}</h3>
              <p style="margin: 0; color: #4c1d95; font-size: 14px;">🕐 ${focusBlock.time}</p>
            </div>

            <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <p style="margin: 0 0 12px; color: #1e293b; font-size: 14px; font-weight: 600;">💡 Quick Tips:</p>
              <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.6;">
                <li>Close unnecessary tabs and apps</li>
                <li>Put your phone on Do Not Disturb</li>
                <li>Have water and snacks nearby</li>
                <li>Set a timer for your focus session</li>
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/app` : 'https://refraim.com/app'}" 
                 style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
                Get Ready
              </a>
            </div>
          </div>

          <div style="padding: 16px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">Refraim AI - Protect your focus, maximize your impact</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
};
