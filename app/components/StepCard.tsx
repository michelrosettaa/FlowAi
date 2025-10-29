"use client";

type Props = {
  step: number;
};

export default function StepCard({ step }: Props) {
  // tiny fake UI previews that change per step
  const previews = [
    {
      badge: "Calendar Sync",
      title: "We'll defend your focus blocks",
      body: ["Block Deep Work 10-12", "Move meeting with Sarah", "Gym at 18:00 ✅"],
    },
    {
      badge: "Inbox Assist",
      title: "We'll draft replies in your tone",
      body: [
        "Summarise investor thread",
        "Draft reply to Alex (contract)",
        "Reminder to follow up Fri",
      ],
    },
    {
      badge: "Focus Goal",
      title: "How many hours of deep work?",
      body: ["Goal: 20h / week", "You're trending at 16h", "We'll protect more time"],
    },
  ];

  const data = previews[step];

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-6 flex flex-col justify-between">
      <div className="text-[11px] inline-block font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md px-2 py-1 w-fit mb-4">
        {data.badge}
      </div>

      <h2 className="text-slate-900 font-semibold text-lg mb-3">
        {data.title}
      </h2>

      <ul className="text-sm text-slate-600 space-y-2 leading-relaxed">
        {data.body.map((line, i) => (
          <li
            key={i}
            className="flex items-start gap-2 bg-slate-50 border border-slate-200/70 rounded-lg px-3 py-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mt-1.5" />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-[11px] text-slate-400 text-right">
        Preview only • no data saved
      </div>
    </div>
  );
}
