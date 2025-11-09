"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

type NavButtonProps = {
  label: string;
  path: string;
};

function NavButton({ label, path }: NavButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <button
      onClick={() => router.push(path)}
      className={`text-left text-sm rounded-lg px-3 py-2 mb-1 border transition ${
        isActive
          ? "bg-white/10 border-white/20 text-white"
          : "text-slate-300 bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"
      }`}
    >
      {label}
    </button>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#1a2545_0%,#0a0f1c_60%)] text-slate-100 flex">
      <aside className="w-[240px] bg-[#0d152a] border-r border-white/10 p-4 flex flex-col">
        <div className="mb-4 font-semibold">FlowAI</div>

        <NavButton label="Dashboard" path="/app" />
        <NavButton label="Mentor" path="/app/mentor" />
        <NavButton label="Email" path="/app/email" />
        <NavButton label="Calendar" path="/app/calendar" />

        <div className="flex-1" />
      </aside>

      <section className="flex-1 flex flex-col">{children}</section>
    </main>
  );
}
