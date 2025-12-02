import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/lib/auth';
import { storage } from '@/server/storage';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover' as any,
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { planSlug, billingPeriod = 'monthly', successUrl, cancelUrl } = body;

    if (!planSlug) {
      return NextResponse.json(
        { error: 'Plan slug is required' },
        { status: 400 }
      );
    }

    const plan = await storage.getPlanBySlug(planSlug);
    
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    if (plan.slug === 'free') {
      return NextResponse.json(
        { error: 'Cannot create checkout for free plan' },
        { status: 400 }
      );
    }

    const priceId = billingPeriod === 'annual' 
      ? plan.stripePriceIdAnnual 
      : plan.stripePriceIdMonthly;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured for this plan' },
        { status: 500 }
      );
    }

    const user = await storage.getUser(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const existingSubscription = await storage.getUserSubscription(session.user.id);
    let customerId = existingSubscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: user.name || undefined,
        metadata: {
          userId: session.user.id,
        },
      });
      customerId = customer.id;
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://refraimai.com';
    
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${baseUrl}/app/billing?success=true`,
      cancel_url: cancelUrl || `${baseUrl}/app/billing?cancelled=true`,
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          userId: session.user.id,
          planId: plan.id,
        },
      },
      metadata: {
        userId: session.user.id,
        planId: plan.id,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', message: error.message },
      { status: 500 }
    );
  }
}
