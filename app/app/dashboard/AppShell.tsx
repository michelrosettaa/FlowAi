"use client";

import { useRouter, usePathname } from "next/navigation";
import React from "react";

const coreFeatures = [
  { label: "AI Daily Planner", desc: "Auto-builds your day from your tasks." },
  { label: "Smart Calendar Sync", desc: "Protects focus time around real meetings." },
  { label: "Email Automation", desc: "Drafts / summarises replies for you." },
  {
    label: "Focus Mode & Mentor",
    desc: "Keeps you accountable with gentle nudges.",
  },
  {
    label: "AI Call Summariser",
    desc: "Turns meetings into actionable next steps.",
  },
  {
    label: "Productivity Analytics",
    desc: "See trends in deep work, energy, progress.",
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const NavButton = ({
    label,
    path,
  }: {
    label: string;
    path: string;
  }) => {
    const active = pathname === path;
    return (
      <button
        onClick={() => router.push(path)}
        className={`w-full text-left text-sm rounded-lg px-3 py-2 mb-3 transition border ${
          active
            ? "bg-white/10 border-white/20 text-slate-100 shadow"
            : "bg-transparent border-transparent text-slate-300 hover:bg-white/5 hover:border-white/10 hover:text-slate-100"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#1a2545_0%,#0a0f1c_60%)] text-slate-100 flex">
      {/* SIDEBAR */}
      <aside className="w-[240px] bg-white/5 border-r border-white/10 p-6 flex flex-col">
        {/* brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold flex items-center justify-center">
            F
          </div>
          <div className="text-slate-100 font-semibold text-sm">FlowAI</div>
        </div>

        {/* main nav */}
        <div className="text-[11px] text-slate-400 uppercase tracking-wide mb-2">
          Planner
        </div>

        <NavButton label="Dashboard" path="/app" />
        <NavButton label="Mentor" path="/app/mentor" />
        <NavButton label="Email" path="/app/email" />
        <NavButton label="Calendar" path="/app/calendar" />

        {/* core features */}
        <div className="mt-8 text-[11px] text-slate-400 uppercase tracking-wide mb-3">
          Core features
        </div>

        <ul className="space-y-3 text-[13px] leading-snug text-slate-300 overflow-y-auto max-h-[40vh] pr-1">
          {coreFeatures.map((f, i) => (
            <li
              key={i}
              className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition"
            >
              <div className="font-semibold text-slate-100 text-[13px]">
                {f.label}
              </div>
              <div className="text-[12px] text-slate-400 mt-1 leading-relaxed">
                {f.desc}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8 text-[11px] text-slate-500">
          © {new Date().getFullYear()} FlowAI
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <section className="flex-1 flex flex-col min-w-0">
        {children}
      </section>
    </main>
  );
}
