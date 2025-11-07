import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { plan, email } = await req.json();
    console.log("➡️ Creating checkout session for:", plan, email);

    const priceIds: Record<string, string> = {
      pro: "price_1SNyT9JyTRj7dDfrkxORmwMR", // replace with your actual ID
      team: "price_1SNyTnJyTRj7dDfrjb8WAEEl",
      student: " price_1SNyFJJyTRj7dDfr1D0ZGVX2",
    };

    const priceId = priceIds[plan];
    if (!priceId) {
      console.error("❌ Invalid plan name:", plan);
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      subscription_data: {
        trial_period_days: 7,
      },
    });

    console.log("✅ Checkout session created:", session.id);
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("💥 Stripe Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
