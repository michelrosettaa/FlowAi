import { emailWrapper } from "./base";

interface ReminderEmailData {
  userName: string;
  tasksDue: number;
  topTasks: string[];
  focusGoal: number;
  currentFocus: number;
  motivationalMessage: string;
}

export function dailyReminderEmailTemplate({
  userName,
  tasksDue,
  topTasks,
  focusGoal,
  currentFocus,
  motivationalMessage,
}: ReminderEmailData): {
  subject: string;
  html: string;
} {
  const firstName = userName?.split(" ")[0] || "there";
  const greeting = getTimeGreeting();
  
  const content = `
    <h1>${greeting}, ${firstName}!</h1>
    
    <p>
      Ready to make today count? Here's your quick productivity brief to get you focused and moving.
    </p>
    
    <div class="highlight-box">
      <p>
        <strong>"${motivationalMessage}"</strong>
      </p>
    </div>
    
    ${tasksDue > 0 ? `
    <h2>Today's Priority Tasks</h2>
    <p>You have <strong>${tasksDue} tasks</strong> waiting for your attention:</p>
    
    <ul class="feature-list">
      ${topTasks.slice(0, 3).map(task => `
        <li>
          <span class="feature-icon">○</span>
          <span>${task}</span>
        </li>
      `).join("")}
      ${tasksDue > 3 ? `
        <li style="color: #94a3b8; font-style: italic;">
          <span>+ ${tasksDue - 3} more tasks</span>
        </li>
      ` : ""}
    </ul>
    ` : `
    <div style="text-align: center; padding: 24px; background: #f0fdf4; border-radius: 12px; margin: 24px 0;">
      <p style="color: #16a34a; margin: 0; font-size: 18px; font-weight: 600;">
        No tasks due today — great time to plan ahead!
      </p>
    </div>
    `}
    
    <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h2 style="margin-bottom: 16px;">Focus Time Progress</h2>
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="flex: 1; background: #e2e8f0; border-radius: 999px; height: 12px; overflow: hidden;">
          <div style="width: ${Math.min((currentFocus / focusGoal) * 100, 100)}%; height: 100%; background: linear-gradient(90deg, #3b82f6, #6366f1); border-radius: 999px;"></div>
        </div>
        <span style="font-weight: 600; color: #1e293b;">${currentFocus}/${focusGoal}h</span>
      </div>
      <p style="margin-top: 12px; font-size: 14px; color: #64748b;">
        ${currentFocus >= focusGoal 
          ? "Goal reached! Keep the momentum going!" 
          : `${(focusGoal - currentFocus).toFixed(1)} hours to go — you've got this!`}
      </p>
    </div>
    
    <div style="text-align: center;">
      <a href="https://refraimai.com/app" class="cta-button">
        Open Refraim Dashboard
      </a>
    </div>
    
    <div class="divider"></div>
    
    <p style="text-align: center; color: #64748b;">
      Small actions lead to big results. Make today count!
    </p>
    
    <p style="text-align: center; margin-top: 16px;">
      Focus on,<br>
      <strong>Refraim AI</strong>
    </p>
  `;

  return {
    subject: `${greeting}, ${firstName} — ${tasksDue > 0 ? `${tasksDue} tasks ready for you` : "Ready to plan your day?"}`,
    html: emailWrapper(content, `Your daily productivity brief is here. ${tasksDue} tasks waiting.`),
  };
}

export function weeklyReminderEmailTemplate({
  userName,
  tasksCompleted,
  tasksRemaining,
  weeklyGoal,
  streak,
}: {
  userName: string;
  tasksCompleted: number;
  tasksRemaining: number;
  weeklyGoal: number;
  streak: number;
}): {
  subject: string;
  html: string;
} {
  const firstName = userName?.split(" ")[0] || "there";
  const progress = weeklyGoal > 0 ? Math.round((tasksCompleted / weeklyGoal) * 100) : 0;
  
  const content = `
    <h1>Weekly Check-In Time, ${firstName}!</h1>
    
    <p>
      It's time to reflect on your week and set yourself up for success. 
      Here's where you stand:
    </p>
    
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 32px 0;">
      <div class="stat-card">
        <div class="stat-value">${tasksCompleted}</div>
        <div class="stat-label">Tasks Completed</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${tasksRemaining}</div>
        <div class="stat-label">Tasks Remaining</div>
      </div>
    </div>
    
    <div class="highlight-box">
      <p>
        <strong>Weekly Goal Progress: ${progress}%</strong><br>
        ${progress >= 100 
          ? "Fantastic work! You've crushed your weekly goal!" 
          : progress >= 50 
          ? "Great progress — you're more than halfway there!" 
          : "You've got this! Focus on your top priorities."}
      </p>
    </div>
    
    ${streak > 0 ? `
    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; margin: 24px 0;">
      <p style="margin: 0; font-size: 24px; font-weight: 700; color: #92400e;">
        🔥 ${streak}-Day Streak!
      </p>
      <p style="margin: 8px 0 0; color: #a16207;">Keep it alive!</p>
    </div>
    ` : ""}
    
    <h2>This Week's Focus Areas</h2>
    
    <ul class="feature-list">
      <li>
        <span class="feature-icon">1</span>
        <span>Review your task list and prioritise the top 3 items for Monday</span>
      </li>
      <li>
        <span class="feature-icon">2</span>
        <span>Block focus time on your calendar for deep work</span>
      </li>
      <li>
        <span class="feature-icon">3</span>
        <span>Clear your inbox with Refraim Mail's AI assistance</span>
      </li>
    </ul>
    
    <div style="text-align: center;">
      <a href="https://refraimai.com/app/planner" class="cta-button">
        Plan Your Week
      </a>
    </div>
    
    <div class="divider"></div>
    
    <p style="text-align: center; color: #64748b;">
      A productive week starts with a plan. Let's make it happen!
    </p>
  `;

  return {
    subject: `${firstName}, your weekly check-in — ${progress}% toward your goal`,
    html: emailWrapper(content, `Weekly progress update: ${tasksCompleted} tasks completed, ${tasksRemaining} remaining.`),
  };
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
