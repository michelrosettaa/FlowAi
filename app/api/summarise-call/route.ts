import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { transcript } = await req.json();

  // In production, replace with real OpenAI API call
  // const res = await openai.chat.completions.create({ ... })
  const fakeSummary = `
**Meeting Summary:**
- Discussed project timeline and new client deliverables.
- Agreed to finalise assets by next Monday.

**Action Items:**
- Sarah to review deck by Friday.
- Alex to send client recap email.

**Next Steps:**
- Schedule internal review meeting for Monday 10AM.
  `;

  return NextResponse.json({ summary: fakeSummary });
}
