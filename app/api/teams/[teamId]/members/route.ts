import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { teams, teamMembers, teamInvites, users, notifications } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import crypto from "crypto";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await auth();
    const { teamId } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const membership = await db
      .select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, teamId),
          eq(teamMembers.userId, session.user.id)
        )
      )
      .limit(1);

    if (membership.length === 0) {
      return NextResponse.json({ error: "Not a team member" }, { status: 403 });
    }

    const members = await db
      .select({
        id: teamMembers.id,
        role: teamMembers.role,
        joinedAt: teamMembers.acceptedAt,
        user: {
          id: users.id,
          email: users.email,
          name: users.name,
          image: users.image,
        },
      })
      .from(teamMembers)
      .innerJoin(users, eq(users.id, teamMembers.userId))
      .where(eq(teamMembers.teamId, teamId));

    const pendingInvites = await db
      .select()
      .from(teamInvites)
      .where(
        and(
          eq(teamInvites.teamId, teamId),
          eq(teamInvites.acceptedAt, null as any)
        )
      );

    return NextResponse.json({
      members,
      pendingInvites: pendingInvites.filter(i => !i.acceptedAt),
    });
  } catch (error: any) {
    console.error("Error fetching team members:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await auth();
    const { teamId } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);

    if (team.length === 0) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const membership = await db
      .select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, teamId),
          eq(teamMembers.userId, session.user.id),
          eq(teamMembers.role, "admin")
        )
      )
      .limit(1);

    if (membership.length === 0) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const [memberCount] = await db
      .select({ count: count() })
      .from(teamMembers)
      .where(eq(teamMembers.teamId, teamId));

    if (memberCount.count >= team[0].maxMembers) {
      return NextResponse.json({ 
        error: `Team has reached maximum of ${team[0].maxMembers} members` 
      }, { status: 400 });
    }

    const body = await req.json();
    const { email, role = "member" } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      const existingMember = await db
        .select()
        .from(teamMembers)
        .where(
          and(
            eq(teamMembers.teamId, teamId),
            eq(teamMembers.userId, existingUser[0].id)
          )
        )
        .limit(1);

      if (existingMember.length > 0) {
        return NextResponse.json({ error: "User is already a team member" }, { status: 400 });
      }
    }

    const existingInvite = await db
      .select()
      .from(teamInvites)
      .where(
        and(
          eq(teamInvites.teamId, teamId),
          eq(teamInvites.email, email.toLowerCase())
        )
      )
      .limit(1);

    if (existingInvite.length > 0 && !existingInvite[0].acceptedAt) {
      return NextResponse.json({ error: "Invite already sent to this email" }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const [invite] = await db
      .insert(teamInvites)
      .values({
        teamId,
        email: email.toLowerCase(),
        role: role as "admin" | "member",
        token,
        invitedBy: session.user.id,
        expiresAt,
      })
      .returning();

    if (existingUser.length > 0) {
      await db.insert(notifications).values({
        userId: existingUser[0].id,
        type: "team_invite",
        title: `Team Invitation`,
        message: `You've been invited to join ${team[0].name}. Click to accept.`,
        actionUrl: `/app/teams/accept?token=${token}`,
      });
    }

    return NextResponse.json({
      success: true,
      invite,
      message: "Invite sent successfully",
    });
  } catch (error: any) {
    console.error("Error inviting team member:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
