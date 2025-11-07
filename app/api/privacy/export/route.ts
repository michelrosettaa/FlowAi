import { NextResponse } from "next/server";

// Placeholder: replace with real auth / user lookup and Firestore fetch
export async function GET() {
  // Example data structure you might return
  const mock = {
    email: "you@company.com",
    tasks: [{ id: "t1", title: "Sample task" }],
    meetings: [{ id: "m1", title: "Team sync" }],
    preferences: { theme: "dark" },
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json(mock, { status: 200 });
}
