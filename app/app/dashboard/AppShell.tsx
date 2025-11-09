"use client";
import { usePathname, useRouter } from "next/navigation";

// ⬇️ declare OUTSIDE
function NavButton({
  label,
  path,
  isActive,
}: {
  label: string;
  path: string;
  isActive: boolean;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(path)}
      className={`flex items-center gap-2 text-left text-sm rounded-lg px-3 py-2 mb-1 border transition ${
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
      {/* … */}
      <NavButton label="Dashboard" path="/app" isActive={pathname === "/app"} />
      <NavButton label="Mentor" path="/app/mentor" isActive={pathname === "/app/mentor"} />
      <NavButton label="Email" path="/app/email" isActive={pathname === "/app/email"} />
      <NavButton label="Calendar" path="/app/calendar" isActive={pathname === "/app/calendar"} />
      {/* … */}
      {children}
    </main>
  );
}
