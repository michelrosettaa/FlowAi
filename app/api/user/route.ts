import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ user: null }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ user: session.user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("API /api/user error:", error);

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
