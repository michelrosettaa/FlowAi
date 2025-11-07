export async function POST(req: Request) {
  const { prompt } = await req.json();
  const reply = prompt?.toLowerCase().includes("meeting")
    ? "Yesterday's meeting covered milestones. Want a summary?"
    : "Got it — I can help with planning, meetings, or emails.";
  return new Response(JSON.stringify({ reply }), { status: 200 });
}
