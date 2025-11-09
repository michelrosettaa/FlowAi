import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  try {
    const { plan, email } = await req.json();

    if (!plan) {
      return NextResponse.json({ error: "Missing plan" }, { status: 400 });
    }

    const priceMap: Record<string, string | undefined> = {
      pro: process.env.STRIPE_PRICE_PRO,
      team: process.env.STRIPE_PRICE_TEAM,
    };
    const price = priceMap[plan];

    // Free plan just goes to onboarding
    if (!price) {
      return NextResponse.json({ url: "/onboarding" });
    }

    // Create or re-use a Customer (optional but nice)
    let customer: string | undefined;
    if (email) {
      const existing = await stripe.customers.list({ email, limit: 1 });
      customer = existing.data[0]?.id ?? (await stripe.customers.create({ email })).id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer,
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      line_items: [{ price, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
      },
      success_url: process.env.STRIPE_SUCCESS_URL!,
      cancel_url: process.env.STRIPE_CANCEL_URL!,
      metadata: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
