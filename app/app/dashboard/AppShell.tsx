"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

function NavButton({
  label,
  path,
}: {
  label: string;
  path: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const active = pathname === path;
  return (
    <button
      onClick={() => router.push(path)}
      className={`text-left text-sm rounded-lg px-3 py-2 mb-1 border transition ${
        active
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
      <aside className="w-[240px] bg-[#0d152a] border-r border-white/10 p-4">
        {/* … header … */}
        <NavButton label="Dashboard" path="/app" />
        <NavButton label="Mentor" path="/app/mentor" />
        <NavButton label="Email" path="/app/email" />
        <NavButton label="Calendar" path="/app/calendar" />
        {/* … rest of your sidebar … */}
      </aside>
      <section className="flex-1 flex flex-col">{children}</section>
    </main>
  );
}
