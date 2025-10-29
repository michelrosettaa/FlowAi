"use client";

import { useRouter } from "next/navigation";

export default function CalendarPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#1a2545_0%,#0a0f1c_60%)] text-slate-100 flex flex-col items-center justify-center px-6">
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
        <h1 className="text-2xl font-semibold text-white mb-3">Connected Calendar</h1>
        <p className="text-sm text-slate-400 mb-6">
          View and sync your schedule from Google Calendar or Outlook.
        </p>

        <div className="border border-white/10 rounded-lg bg-white/5 text-left p-6 text-sm text-slate-200 mb-6">
          <div className="text-indigo-400 font-semibold mb-2">Upcoming Meetings</div>
          <ul className="space-y-2">
            <li>🗓️ Team sync — Tomorrow 10:00–10:30</li>
            <li>💡 Deep Work block — Wed 2:00–4:00</li>
            <li>🤝 Client meeting — Thu 1:00–2:00</li>
          </ul>
        </div>

        <button className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold py-2 px-5 rounded-lg hover:scale-[1.03] transition-all">
          Connect Google Calendar
        </button>

        <button className="ml-3 border border-indigo-400 text-indigo-300 font-semibold py-2 px-5 rounded-lg hover:bg-white/10 transition-all">
          Connect Outlook
        </button>

        <button
          onClick={() => router.push("/app")}
          className="mt-8 text-xs text-slate-400 underline hover:text-slate-200 transition block mx-auto"
        >
          ← Back to Planner
        </button>
      </div>
    </main>
  );
}
