import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { storage } from '@/server/storage';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

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
        const invoice = event.data.object as Stripe.Invoice;
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
        const invoice = event.data.object as Stripe.Invoice;
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
          }
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
    status: 'canceled',
    endedAt: new Date(),
  });
}
