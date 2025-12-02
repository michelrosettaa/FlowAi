import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { storage } from '@/server/storage';
import { db } from '@/server/db';
import { notifications, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn('STRIPE_WEBHOOK_SECRET not set - webhook signature verification disabled');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    if (process.env.STRIPE_WEBHOOK_SECRET) {
      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 400 }
        );
      }
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeletion(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        const subscriptionId = typeof invoice.subscription === 'string' 
          ? invoice.subscription 
          : invoice.subscription?.id;
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await handleSubscriptionChange(subscription);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const subscriptionId = typeof invoice.subscription === 'string' 
          ? invoice.subscription 
          : invoice.subscription?.id;
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = subscription.metadata?.userId;
          if (userId) {
            await storage.updateUserSubscription(userId, {
              status: 'past_due',
            });
            await createNotification(userId, 'subscription_updated', 
              'Payment Failed', 
              'Your payment failed. Please update your payment method to continue your subscription.',
              '/app/billing'
            );
          }
        }
        break;
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await createNotification(userId, 'trial_ending',
            'Trial Ending Soon',
            'Your free trial ends in 3 days. Add a payment method to continue enjoying Pro features.',
            '/app/billing'
          );
          await sendTrialEndingEmail(userId);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', message: error.message },
      { status: 500 }
    );
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('Missing userId in subscription metadata');
    return;
  }

  const stripePriceId = (subscription as any).items?.data?.[0]?.price?.id;
  
  if (!stripePriceId) {
    console.error('No price ID found in subscription');
    return;
  }

  const allPlans = await storage.getAllPlans();
  const plan = allPlans.find(
    (p) => p.stripePriceIdMonthly === stripePriceId || p.stripePriceIdAnnual === stripePriceId
  );

  const planId = plan?.id || subscription.metadata?.planId;

  if (!planId) {
    console.error('Could not determine plan ID from price or metadata');
    return;
  }

  const currentPeriodStart = new Date((subscription as any).current_period_start * 1000);
  const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000);
  const canceledAt = (subscription as any).canceled_at
    ? new Date((subscription as any).canceled_at * 1000)
    : null;

  await storage.createUserSubscription({
    userId,
    planId,
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    status: subscription.status as any,
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
    canceledAt,
  });
}

async function handleSubscriptionDeletion(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('Missing userId in subscription metadata');
    return;
  }

  const freePlan = await storage.getPlanBySlug('free');
  
  if (!freePlan) {
    console.error('Free plan not found');
    return;
  }

  await storage.createUserSubscription({
    userId,
    planId: freePlan.id,
    status: 'cancelled',
    endedAt: new Date(),
  });

  await createNotification(userId, 'subscription_updated',
    'Subscription Cancelled',
    'Your subscription has been cancelled. You can resubscribe at any time.',
    '/app/billing'
  );
}

async function createNotification(
  userId: string,
  type: 'welcome' | 'streak' | 'trial_ending' | 'trial_ended' | 'subscription_updated' | 'team_invite' | 'achievement' | 'reminder',
  title: string,
  message: string,
  actionUrl?: string
) {
  try {
    await db.insert(notifications).values({
      userId,
      type,
      title,
      message,
      actionUrl,
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

async function sendTrialEndingEmail(userId: string) {
  if (!resend) {
    console.warn('Resend not configured, skipping trial ending email');
    return;
  }

  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user?.email) {
      console.warn('No email found for user:', userId);
      return;
    }

    await resend.emails.send({
      from: 'Refraim AI <hello@refraimai.com>',
      to: user.email,
      subject: 'Your Refraim AI Trial Ends in 3 Days',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Your Trial Ends Soon</h1>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Hi ${user.name || 'there'},
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Your 7-day free trial of Refraim AI Pro ends in 3 days. To continue enjoying unlimited AI messages, calendar sync, and all Pro features, please add a payment method.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}/app/billing" style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                  Continue Your Subscription
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                If you have any questions, just reply to this email - we're here to help!
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                Best,<br>
                The Refraim AI Team
              </p>
            </div>
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p>Refraim AI - Your AI Productivity Partner</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('Trial ending email sent to:', user.email);
  } catch (error) {
    console.error('Failed to send trial ending email:', error);
  }
}
