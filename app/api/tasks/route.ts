import { auth } from "@/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  if (!body?.title) {
    return new Response("Missing title", { status: 400 });
  }

  await db.insert(tasks).values({
    title: body.title,
    userId: session.user.id,
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, session.user.id));

  return new Response(JSON.stringify(userTasks), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
