import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { teams, teamMembers, userSubscriptions, subscriptionPlans } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userTeams = await db
      .select({
        team: teams,
        role: teamMembers.role,
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teams.id, teamMembers.teamId))
      .where(eq(teamMembers.userId, session.user.id));

    const ownedTeams = await db
      .select()
      .from(teams)
      .where(eq(teams.ownerId, session.user.id));

    return NextResponse.json({
      memberOf: userTeams,
      owned: ownedTeams,
    });
  } catch (error: any) {
    console.error("Error fetching teams:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await db
      .select({
        plan: subscriptionPlans,
      })
      .from(userSubscriptions)
      .innerJoin(subscriptionPlans, eq(subscriptionPlans.id, userSubscriptions.planId))
      .where(eq(userSubscriptions.userId, session.user.id))
      .limit(1);

    if (!subscription.length || subscription[0].plan.slug !== 'business') {
      return NextResponse.json({ 
        error: "Business plan required to create teams" 
      }, { status: 403 });
    }

    const existingTeam = await db
      .select()
      .from(teams)
      .where(eq(teams.ownerId, session.user.id))
      .limit(1);

    if (existingTeam.length > 0) {
      return NextResponse.json({ 
        error: "You already have a team. Business plan allows one team." 
      }, { status: 400 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Team name must be at least 2 characters" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const [newTeam] = await db
      .insert(teams)
      .values({
        name: name.trim(),
        slug: `${slug}-${Date.now()}`,
        ownerId: session.user.id,
        maxMembers: 5,
      })
      .returning();

    await db.insert(teamMembers).values({
      teamId: newTeam.id,
      userId: session.user.id,
      role: "admin",
      acceptedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      team: newTeam,
    });
  } catch (error: any) {
    console.error("Error creating team:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
