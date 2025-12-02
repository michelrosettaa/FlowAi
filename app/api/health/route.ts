import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  const startTime = Date.now();
  
  const checks = {
    status: 'healthy' as 'healthy' | 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: { status: 'unknown' as 'ok' | 'error', latencyMs: 0, message: '' },
      environment: { status: 'ok' as 'ok' | 'error', missing: [] as string[] },
    },
  };

  try {
    const dbStart = Date.now();
    await db.execute(sql`SELECT 1`);
    checks.checks.database = {
      status: 'ok',
      latencyMs: Date.now() - dbStart,
      message: 'Database connection successful',
    };
  } catch (error: any) {
    checks.status = 'unhealthy';
    checks.checks.database = {
      status: 'error',
      latencyMs: 0,
      message: error.message || 'Database connection failed',
    };
  }

  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];

  const optionalEnvVars = [
    'OPENAI_API_KEY',
    'RESEND_API_KEY',
    'STRIPE_SECRET_KEY',
  ];

  const missingRequired = requiredEnvVars.filter((v) => !process.env[v]);
  const missingOptional = optionalEnvVars.filter((v) => !process.env[v]);

  if (missingRequired.length > 0) {
    checks.status = 'unhealthy';
    checks.checks.environment = {
      status: 'error',
      missing: missingRequired,
    };
  } else {
    checks.checks.environment = {
      status: 'ok',
      missing: missingOptional,
    };
  }

  const responseTime = Date.now() - startTime;

  return NextResponse.json(
    {
      ...checks,
      responseTimeMs: responseTime,
    },
    {
      status: checks.status === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}
