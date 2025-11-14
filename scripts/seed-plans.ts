import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { subscriptionPlans } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const plans = [
  {
    slug: 'free',
    name: 'Free',
    description: 'Perfect for trying out FlowAI',
    priceMonthly: 0,
    priceAnnual: 0,
    stripePriceIdMonthly: null,
    stripePriceIdAnnual: null,
    limits: {
      ai_messages: 20,
      email_sends: 5,
      calendar_sync: false,
      google_calendar_sync: false,
    },
    features: [
      'Up to 20 AI messages per month',
      'Up to 5 email sends per month',
      'Local calendar only',
      'Basic task management',
      'Community support',
    ],
    isActive: true,
    sortOrder: 1,
  },
  {
    slug: 'pro',
    name: 'Pro',
    description: 'Full power for productive professionals',
    priceMonthly: 1500,
    priceAnnual: 14400,
    stripePriceIdMonthly: null,
    stripePriceIdAnnual: null,
    limits: {
      ai_messages: 2000,
      email_sends: 100,
      calendar_sync: true,
      google_calendar_sync: true,
    },
    features: [
      'Up to 2,000 AI messages per month',
      'Up to 100 email sends per month',
      'Google Calendar & Gmail sync',
      'Priority support',
      'Early access to new features',
      'Advanced analytics (coming soon)',
    ],
    isActive: true,
    sortOrder: 2,
  },
  {
    slug: 'team',
    name: 'Team',
    description: 'For teams that work together',
    priceMonthly: 3900,
    priceAnnual: 37440,
    stripePriceIdMonthly: null,
    stripePriceIdAnnual: null,
    limits: {
      ai_messages: 10000,
      email_sends: 500,
      calendar_sync: true,
      google_calendar_sync: true,
    },
    features: [
      'Everything in Pro',
      'Shared workspaces (coming soon)',
      'Team analytics (coming soon)',
      'Consolidated billing',
      'Dedicated support',
      'Custom integrations',
    ],
    isActive: true,
    sortOrder: 3,
  },
];

async function seedPlans() {
  console.log('Seeding subscription plans...');

  for (const plan of plans) {
    const existing = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.slug, plan.slug))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(subscriptionPlans)
        .set({
          ...plan,
          updatedAt: new Date(),
        })
        .where(eq(subscriptionPlans.slug, plan.slug));
      console.log(`✓ Updated plan: ${plan.name}`);
    } else {
      await db.insert(subscriptionPlans).values(plan);
      console.log(`✓ Created plan: ${plan.name}`);
    }
  }

  console.log('\nSeeding complete!');
  console.log('\nNext steps:');
  console.log('1. Create products in Stripe Dashboard: https://dashboard.stripe.com/products');
  console.log('2. Set currency to GBP when creating products');
  console.log('3. Update stripePriceIdMonthly and stripePriceIdAnnual in the database');
  console.log('4. Run this script again to sync the Stripe Price IDs');
}

seedPlans()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding plans:', error);
    process.exit(1);
  });
