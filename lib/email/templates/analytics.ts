import { emailWrapper } from "./base";

interface AnalyticsEmailData {
  userName: string;
  tasksCompleted: number;
  focusHours: number;
  productivityScore: number;
  streak: number;
  weekStartDate: string;
  weekEndDate: string;
  topAccomplishment?: string;
}

export function weeklyAnalyticsEmailTemplate({
  userName,
  tasksCompleted,
  focusHours,
  productivityScore,
  streak,
  weekStartDate,
  weekEndDate,
  topAccomplishment,
}: AnalyticsEmailData): {
  subject: string;
  html: string;
} {
  const firstName = userName?.split(" ")[0] || "there";
  const scoreEmoji = productivityScore >= 80 ? "🔥" : productivityScore >= 60 ? "💪" : "📈";
  const streakMessage = streak > 5 
    ? `Amazing ${streak}-day streak!` 
    : streak > 0 
    ? `${streak}-day streak — keep it going!` 
    : "Start your streak today!";

  const content = `
    <h1>Your Weekly Productivity Report ${scoreEmoji}</h1>
    
    <p>
      Hey ${firstName}, here's how you performed this week 
      (${weekStartDate} — ${weekEndDate}). Let's celebrate your wins!
    </p>
    
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 32px 0;">
      <div class="stat-card">
        <div class="stat-value">${tasksCompleted}</div>
        <div class="stat-label">Tasks Completed</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${focusHours.toFixed(1)}h</div>
        <div class="stat-label">Focus Time</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${productivityScore}%</div>
        <div class="stat-label">Productivity Score</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${streak}</div>
        <div class="stat-label">Day Streak</div>
      </div>
    </div>
    
    <div class="highlight-box">
      <p>
        <strong>${streakMessage}</strong><br>
        ${streak > 0 
          ? "Consistency is the key to productivity. You're building great habits!" 
          : "Complete a task or log focus time today to start building momentum."}
      </p>
    </div>
    
    ${topAccomplishment ? `
    <h2>Top Accomplishment This Week</h2>
    <p style="font-size: 18px; color: #1e293b; background: #f0f9ff; padding: 16px; border-radius: 12px;">
      "${topAccomplishment}"
    </p>
    ` : ""}
    
    <div class="divider"></div>
    
    <h2>Tips for Next Week</h2>
    
    <ul class="feature-list">
      ${productivityScore < 70 ? `
      <li>
        <span class="feature-icon">💡</span>
        <span>Try blocking 2 hours of deep work time on your calendar each morning</span>
      </li>
      ` : `
      <li>
        <span class="feature-icon">🚀</span>
        <span>You're doing great! Challenge yourself by tackling one high-impact task first thing each day</span>
      </li>
      `}
      <li>
        <span class="feature-icon">📧</span>
        <span>Use Refraim Mail to batch your email responses and save mental energy</span>
      </li>
      <li>
        <span class="feature-icon">🎯</span>
        <span>Check in with Refraim Motivator when you need a productivity boost</span>
      </li>
    </ul>
    
    <div style="text-align: center;">
      <a href="https://refraimai.com/app/stats" class="cta-button">
        View Full Analytics
      </a>
    </div>
    
    <div class="divider"></div>
    
    <p style="text-align: center; color: #64748b;">
      Keep up the momentum, ${firstName}! Every productive day adds up.
    </p>
    
    <p style="text-align: center; margin-top: 24px;">
      Cheers to another great week,<br>
      <strong>The Refraim AI Team</strong>
    </p>
  `;

  return {
    subject: `${firstName}, your weekly productivity report is ready ${scoreEmoji}`,
    html: emailWrapper(content, `You completed ${tasksCompleted} tasks and logged ${focusHours.toFixed(1)} hours of focus time this week.`),
  };
}
