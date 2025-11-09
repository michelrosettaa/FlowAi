"use client";

import { usePathname, useRouter } from "next/navigation";

type NavButtonProps = {
  label: string;
  path: string;
  activePath?: string;
  onClick?: () => void;
};

function NavButton({ label, path, activePath, onClick }: NavButtonProps) {
  const router = useRouter();
  const isActive = activePath === path;
  return (
    <button
      onClick={onClick ?? (() => router.push(path))}
      className={`w-full text-left text-sm rounded-md px-3 py-2 mb-1 border transition ${
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
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#1a2545_0%,#0a0f1c_60%)] text-slate-100 flex">
      <aside className="w-[240px] bg-[#0d152a] border-r border-white/10 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold flex items-center justify-center">
              F
            </div>
            <div className="text-slate-100 font-semibold text-sm">FlowAI</div>
          </div>
        </div>

        <NavButton label="Dashboard" path="/app" activePath={pathname} />
        <NavButton label="Mentor" path="/app/mentor" activePath={pathname} />
        <NavButton label="Email" path="/app/email" activePath={pathname} />
        <NavButton label="Calendar" path="/app/calendar" activePath={pathname} />

        <div className="mt-8 text-[11px] text-slate-400 uppercase tracking-wide mb-3">
          Core Features
        </div>
        <NavButton label="AI Daily Planner" path="/app/planner" activePath={pathname} />
        <NavButton label="AI Call Summariser" path="/app/calls" activePath={pathname} />
        <NavButton label="Meetings" path="/app/meetings" activePath={pathname} />
        <NavButton label="Calendar Sync" path="/app/sync" activePath={pathname} />

        <div className="flex-1" />

        <div className="text-[11px] text-slate-500 border-t border-white/10 pt-4 mt-3">
          © {new Date().getFullYear()} FlowAI
        </div>
      </aside>

      <section className="flex-1 flex flex-col">{children}</section>
    </main>
  );
}
