import { storage } from './storage';

export interface UsageCheck {
  allowed: boolean;
  currentUsage: number;
  limit: number;
  planName: string;
  upgradeRequired: boolean;
}

export async function checkUsageLimit(
  userId: string,
  feature: 'ai_messages' | 'email_sends' | 'tasks' | 'calendar_sync'
): Promise<UsageCheck> {
  const subscription = await storage.getUserSubscription(userId);
  const plan = subscription?.plan || await storage.getPlanBySlug('free');

  if (!plan) {
    throw new Error('Unable to load subscription plan');
  }

  const limits = plan.limits as Record<string, any>;
  const limit = limits[feature] || 0;

  if (limit === -1) {
    return {
      allowed: true,
      currentUsage: 0,
      limit: -1,
      planName: plan.name,
      upgradeRequired: false,
    };
  }

  const usage = await storage.getCurrentUsage(userId);
  const currentUsage = usage[feature] || 0;

  return {
    allowed: currentUsage < limit,
    currentUsage,
    limit,
    planName: plan.name,
    upgradeRequired: currentUsage >= limit,
  };
}

export async function trackUsage(
  userId: string,
  feature: 'ai_messages' | 'email_sends' | 'tasks' | 'calendar_sync',
  amount: number = 1
): Promise<void> {
  await storage.incrementUsage(userId, feature, amount);
}

export function getUpgradeMessage(feature: string, planName: string): string {
  const messages = {
    ai_messages: `You've reached your ${planName} plan limit for AI messages this month. Upgrade to Pro for unlimited AI conversations.`,
    email_sends: `You've reached your ${planName} plan limit for email sends this month. Upgrade to Pro to send more emails.`,
    tasks: `You've reached your ${planName} plan limit for tasks. Upgrade to Pro for unlimited task management.`,
  };

  return messages[feature as keyof typeof messages] || `Upgrade to unlock more ${feature}.`;
}
