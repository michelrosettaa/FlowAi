import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';

export async function GET() {
  try {
    const plans = await storage.getAllPlans();
    
    const sortedPlans = plans
      .filter(plan => plan.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return NextResponse.json({
      plans: sortedPlans,
    });
  } catch (error: any) {
    console.error('Get plans error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans', message: error.message },
      { status: 500 }
    );
  }
}
