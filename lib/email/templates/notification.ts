import { emailWrapper } from "./base";

interface StreakAlertData {
  userName: string;
  streak: number;
  lastActiveDate: string;
}

export function streakAlertEmailTemplate({
  userName,
  streak,
  lastActiveDate,
}: StreakAlertData): {
  subject: string;
  html: string;
} {
  const firstName = userName?.split(" ")[0] || "there";
  
  const content = `
    <h1>Your ${streak}-Day Streak is at Risk! 🔥</h1>
    
    <p>
      Hey ${firstName}, we noticed you haven't logged any activity since ${lastActiveDate}. 
      Your amazing streak is about to end — but there's still time to save it!
    </p>
    
    <div class="highlight-box">
      <p>
        <strong>Quick ways to keep your streak alive:</strong><br>
        Complete a task, add a calendar event, or just check in with Refraim.
      </p>
    </div>
    
    <div style="text-align: center; padding: 32px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 16px; margin: 32px 0;">
      <p style="margin: 0; font-size: 48px; font-weight: 700; color: #92400e;">
        ${streak}
      </p>
      <p style="margin: 8px 0 0; font-size: 18px; color: #a16207; font-weight: 600;">
        day streak at risk
      </p>
    </div>
    
    <p style="text-align: center;">
      Streaks aren't just numbers — they represent your commitment to productivity 
      and building positive habits. Every day counts!
    </p>
    
    <div style="text-align: center;">
      <a href="https://refraimai.com/app" class="cta-button">
        Save Your Streak
      </a>
    </div>
    
    <div class="divider"></div>
    
    <p style="text-align: center; color: #64748b;">
      We're rooting for you, ${firstName}. Let's keep the momentum going!
    </p>
  `;

  return {
    subject: `${firstName}, your ${streak}-day streak is about to end!`,
    html: emailWrapper(content, `Don't let your ${streak}-day streak end. Quick action needed!`),
  };
}

interface TaskReminderData {
  userName: string;
  taskTitle: string;
  dueTime?: string;
  taskId: string;
}

export function taskReminderEmailTemplate({
  userName,
  taskTitle,
  dueTime,
  taskId,
}: TaskReminderData): {
  subject: string;
  html: string;
} {
  const firstName = userName?.split(" ")[0] || "there";
  
  const content = `
    <h1>Task Reminder</h1>
    
    <p>
      Hey ${firstName}, just a friendly nudge about an upcoming task:
    </p>
    
    <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px; margin: 24px 0;">
      <h2 style="margin: 0 0 8px; color: #0f172a;">${taskTitle}</h2>
      ${dueTime ? `
      <p style="margin: 0; color: #64748b; font-size: 14px;">
        Due: <strong style="color: #3b82f6;">${dueTime}</strong>
      </p>
      ` : ""}
    </div>
    
    <div style="text-align: center;">
      <a href="https://refraimai.com/app/planner" class="cta-button">
        View Task
      </a>
      <br>
      <a href="https://refraimai.com/api/tasks/${taskId}/complete" class="secondary-button">
        Mark as Complete
      </a>
    </div>
    
    <div class="divider"></div>
    
    <p style="text-align: center; color: #64748b; font-size: 14px;">
      Pro tip: Break big tasks into smaller steps to maintain momentum.
    </p>
  `;

  return {
    subject: `Reminder: ${taskTitle}`,
    html: emailWrapper(content, `Don't forget: ${taskTitle}${dueTime ? ` — due ${dueTime}` : ""}`),
  };
}

interface GenericNotificationData {
  userName: string;
  title: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
}

export function genericNotificationEmailTemplate({
  userName,
  title,
  message,
  ctaText = "Open Refraim",
  ctaUrl = "https://refraimai.com/app",
}: GenericNotificationData): {
  subject: string;
  html: string;
} {
  const firstName = userName?.split(" ")[0] || "there";
  
  const content = `
    <h1>${title}</h1>
    
    <p>Hey ${firstName},</p>
    
    <p>${message}</p>
    
    <div style="text-align: center;">
      <a href="${ctaUrl}" class="cta-button">
        ${ctaText}
      </a>
    </div>
    
    <div class="divider"></div>
    
    <p style="text-align: center; color: #64748b;">
      Questions? Reply to this email or visit our Help Centre.
    </p>
  `;

  return {
    subject: title,
    html: emailWrapper(content, message.substring(0, 150)),
  };
}
