import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new Response(JSON.stringify({ user: null }), { status: 401 });
  }

  return new Response(
    JSON.stringify({ user: session.user }),
    { status: 200 }
  );
}
