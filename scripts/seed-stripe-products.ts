import { getUncachableStripeClient } from '../server/stripeClient';

async function createProducts() {
  console.log('Seeding Stripe products...');
  const stripe = await getUncachableStripeClient();

  // Check if products already exist
  const existingProducts = await stripe.products.list({ limit: 100 });
  const existingNames = existingProducts.data.map(p => p.name);

  // FREE PLAN (no Stripe product needed - it's just a database entry)
  console.log('Free plan is handled in database only');

  // PRO PLAN - £9/month with 7-day trial
  if (!existingNames.includes('Refraim Pro')) {
    console.log('Creating Pro plan...');
    const proProduct = await stripe.products.create({
      name: 'Refraim Pro',
      description: 'Full access to all Refraim AI features with unlimited usage',
      metadata: {
        tier: 'pro',
        features: 'unlimited_tasks,unlimited_ai,priority_support,advanced_analytics',
      },
    });

    await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 900, // £9.00
      currency: 'gbp',
      recurring: { 
        interval: 'month',
        trial_period_days: 7,
      },
      metadata: {
        plan: 'pro_monthly',
      },
    });

    await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 7900, // £79.00 (save £29/year)
      currency: 'gbp',
      recurring: { 
        interval: 'year',
        trial_period_days: 7,
      },
      metadata: {
        plan: 'pro_yearly',
      },
    });

    console.log('Pro plan created:', proProduct.id);
  } else {
    console.log('Pro plan already exists');
  }

  // BUSINESS PLAN - £29/month per seat (up to 5 users)
  if (!existingNames.includes('Refraim Business')) {
    console.log('Creating Business plan...');
    const businessProduct = await stripe.products.create({
      name: 'Refraim Business',
      description: 'Team collaboration with admin controls - up to 5 team members',
      metadata: {
        tier: 'business',
        max_seats: '5',
        features: 'team_management,shared_workspace,admin_controls,priority_support,advanced_analytics,sso',
      },
    });

    await stripe.prices.create({
      product: businessProduct.id,
      unit_amount: 2900, // £29.00 per seat
      currency: 'gbp',
      recurring: { 
        interval: 'month',
        trial_period_days: 7,
      },
      metadata: {
        plan: 'business_monthly',
        per_seat: 'true',
      },
    });

    await stripe.prices.create({
      product: businessProduct.id,
      unit_amount: 24900, // £249.00 per seat/year (save £99/year)
      currency: 'gbp',
      recurring: { 
        interval: 'year',
        trial_period_days: 7,
      },
      metadata: {
        plan: 'business_yearly',
        per_seat: 'true',
      },
    });

    console.log('Business plan created:', businessProduct.id);
  } else {
    console.log('Business plan already exists');
  }

  console.log('Stripe products seeded successfully!');
}

createProducts().catch(console.error);
