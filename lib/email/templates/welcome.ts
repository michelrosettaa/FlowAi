import { emailWrapper } from "./base";

interface WelcomeEmailData {
  userName: string;
  userEmail: string;
}

export function welcomeEmailTemplate({ userName, userEmail }: WelcomeEmailData): {
  subject: string;
  html: string;
} {
  const firstName = userName?.split(" ")[0] || "there";
  
  const content = `
    <h1>Welcome to Refraim AI, ${firstName}! 🎉</h1>
    
    <p>
      We're thrilled to have you on board. You've just taken the first step towards 
      reclaiming your time and supercharging your productivity.
    </p>
    
    <div class="highlight-box">
      <p>
        <strong>Your account is ready.</strong> Log in now to explore everything 
        Refraim AI has to offer and start your productivity journey.
      </p>
    </div>
    
    <h2>Here's what you can do with Refraim AI:</h2>
    
    <ul class="feature-list">
      <li>
        <span class="feature-icon">✓</span>
        <span><strong>Ask Refraim</strong> — Get AI-powered answers to your productivity questions and daily planning assistance</span>
      </li>
      <li>
        <span class="feature-icon">✓</span>
        <span><strong>Refraim Mail</strong> — Write professional emails in seconds with AI-generated drafts and summaries</span>
      </li>
      <li>
        <span class="feature-icon">✓</span>
        <span><strong>Refraim Planner</strong> — Organise your tasks and protect your focus time automatically</span>
      </li>
      <li>
        <span class="feature-icon">✓</span>
        <span><strong>Refraim Analytics</strong> — Track your productivity patterns and celebrate your wins</span>
      </li>
      <li>
        <span class="feature-icon">✓</span>
        <span><strong>Refraim Motivator</strong> — Get personalised encouragement to keep you on track</span>
      </li>
    </ul>
    
    <div style="text-align: center;">
      <a href="https://refraimai.com/app" class="cta-button">
        Start Your Day with Refraim
      </a>
    </div>
    
    <div class="divider"></div>
    
    <h2>Quick tips to get started:</h2>
    
    <p>
      <strong>1. Connect your calendar</strong> — Sync with Google Calendar to let Refraim AI 
      help you plan around your existing commitments.
    </p>
    
    <p>
      <strong>2. Set up Refraim Mail</strong> — Connect your email to get AI-powered 
      summaries and draft professional replies in seconds.
    </p>
    
    <p>
      <strong>3. Try Ask Refraim</strong> — Type any productivity question and watch 
      the AI create a personalised plan for your day.
    </p>
    
    <div class="divider"></div>
    
    <p style="text-align: center; color: #64748b;">
      Questions? Just reply to this email or visit our 
      <a href="https://refraimai.com/app/help" style="color: #3b82f6;">Help Centre</a>.
    </p>
    
    <p style="text-align: center; margin-top: 24px;">
      Here's to focused days ahead,<br>
      <strong>The Refraim AI Team</strong>
    </p>
  `;

  return {
    subject: `Welcome to Refraim AI, ${firstName}! Let's reclaim your time`,
    html: emailWrapper(content, "Your productivity journey starts now. Here's everything you need to get started with Refraim AI."),
  };
}
