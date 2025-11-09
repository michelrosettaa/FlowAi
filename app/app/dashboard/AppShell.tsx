"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

type NavButtonProps = { label: string; path: string; active?: boolean };
function NavButton({ label, path, active }: NavButtonProps) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(path)}
      className={`w-full text-left px-3 py-2 rounded-md border transition ${
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
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#1a2545_0%,#0a0f1c_60%)] text-slate-100 flex">
      <aside className="w-[240px] bg-[#0d152a] border-r border-white/10 p-4">
        <div className="text-slate-100 font-semibold text-sm mb-4">FlowAI</div>

        <NavButton label="Dashboard" path="/app" active={pathname === "/app"} />
        <NavButton label="Mentor" path="/app/mentor" active={pathname === "/app/mentor"} />
        <NavButton label="Email" path="/app/email" active={pathname === "/app/email"} />
        <NavButton label="Calendar" path="/app/calendar" active={pathname === "/app/calendar"} />

        <div className="mt-8 text-[11px] text-slate-400 uppercase tracking-wide mb-3">
          Core features
        </div>
        {/* …any other sidebar content */}
      </aside>

      <section className="flex-1 flex flex-col">{children}</section>
    </main>
  );
}
