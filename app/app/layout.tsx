"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { NotificationProvider } from "../context/NotificationContext"; // ✅ added
import NotificationBell from "../components/NotificationBell"; // ✅ added
import {
  LayoutDashboard,
  Mail,
  Calendar,
  LineChart,
  Users,
  Settings,
  BrainCircuit,
  PhoneCall,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

/*
  AppLayout:
  - wraps children in ThemeProvider + NotificationProvider
  - renders InnerLayout (which can safely use useTheme)
*/
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <InnerLayout>{children}</InnerLayout>
      </ThemeProvider>
    </NotificationProvider>
  );
}

/*
  InnerLayout:
  - actual sidebar / shell
  - can use useTheme(), router, etc.
*/
function InnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // pulled from ThemeContext
  const { toggleTheme } = useTheme();

  const navItems = [
    { name: "Dashboard", path: "/app", icon: <LayoutDashboard size={18} /> },
    { name: "FlowAI Motivator", path: "/app/motivator", icon: <Settings size={18} /> },
    { name: "Email", path: "/app/email", icon: <Mail size={18} /> },
    { name: "Stats", path: "/app/stats", icon: <LineChart size={18} /> },
    { name: "Calendar", path: "/app/calendar", icon: <Calendar size={18} /> },
    { name: "Ask FlowAI", path: "/app/ask", icon: <BrainCircuit size={18} /> },
    {
      name: "AI Daily Planner",
      path: "/app/planner",
      icon: <BrainCircuit size={18} />,
    },
    {
      name: "AI Call Summariser",
      path: "/app/calls",
      icon: <PhoneCall size={18} />,
    },
    {
      name: "Meetings",
      path: "/app/meetings",
      icon: <Users size={18} />,
    },
    {
      name: "Calendar Sync",
      path: "/app/sync",
      icon: <Settings size={18} />,
    },
  ];

  return (
    <main className="min-h-screen text-slate-100 flex">
      {/* SIDEBAR */}
      <aside
        className={`${
          collapsed ? "w-[72px]" : "w-[240px]"
        } bg-[#0d152a] border-r border-white/10 p-4 flex flex-col transition-all duration-300`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold flex items-center justify-center">
              F
            </div>
            {!collapsed && (
              <div className="text-slate-100 font-semibold text-sm">
                FlowAI
              </div>
            )}
          </div>

        {/* collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-slate-100 transition"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-2 text-left text-sm rounded-lg px-3 py-2 mb-1 border transition ${
                pathname === item.path
                  ? "bg-white/10 border-white/20 text-white"
                  : "text-slate-300 bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"
              }`}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </button>
          ))}
        </div>

        {/* spacer to push bottom section down */}
        <div className="flex-1" />

        {/* NOTIFICATIONS + THEME PICKER / SETTINGS / HELP / SIGN OUT */}
        <div className="flex flex-col gap-1 mt-4">
          {/* ✅ Notification Bell */}
          {!collapsed && (
            <div className="mb-3 flex justify-center">
              <NotificationBell />
            </div>
          )}

          {/* THEME SELECTOR */}
          {!collapsed && (
            <div className="text-[12px] text-slate-400 mb-3">
              <p className="mb-2 font-semibold text-slate-300">
                Choose your mode
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => toggleTheme("dark")}
                  className="flex items-center gap-2 text-left px-2 py-1.5 rounded-md hover:bg-white/5"
                >
                  <div className="w-4 h-4 rounded-full bg-[#0a0f1c] border border-white/20" />
                  <span>Dark Mode</span>
                </button>

                <button
                  onClick={() => toggleTheme("light")}
                  className="flex items-center gap-2 text-left px-2 py-1.5 rounded-md hover:bg-white/5"
                >
                  <div className="w-4 h-4 rounded-full bg-[#f9fafb] border border-white/20" />
                  <span>Light Mode</span>
                </button>

                <button
                  onClick={() => toggleTheme("green")}
                  className="flex items-center gap-2 text-left px-2 py-1.5 rounded-md hover:bg-white/5"
                >
                  <div className="w-4 h-4 rounded-full bg-green-300 border border-white/20" />
                  <span>Earth Mode</span>
                </button>

                <button
                  onClick={() => toggleTheme("pink")}
                  className="flex items-center gap-2 text-left px-2 py-1.5 rounded-md hover:bg-white/5"
                >
                  <div className="w-4 h-4 rounded-full bg-pink-300 border border-white/20" />
                  <span>Bloom Mode</span>
                </button>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          <button
            onClick={() => router.push("/app/settings")}
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-2"
            } text-left text-sm text-slate-400 hover:text-slate-100 hover:bg-white/5 
            border border-transparent hover:border-white/10 rounded-lg px-3 py-2 transition`}
          >
            <Settings size={18} />
            {!collapsed && <span>Settings</span>}
          </button>

          {/* HELP */}
          <button
            onClick={() => router.push("/app/help")}
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-2"
            } text-left text-sm text-slate-400 hover:text-slate-100 hover:bg-white/5 
            border border-transparent hover:border-white/10 rounded-lg px-3 py-2 transition`}
          >
            <HelpCircle size={18} />
            {!collapsed && <span>Help</span>}
          </button>

          {/* SIGN OUT → /login */}
          <button
            onClick={() => router.push("/login")}
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-2"
            } text-left text-sm text-slate-400 hover:text-slate-100 hover:bg-white/5 
            border border-transparent hover:border-white/10 rounded-lg px-3 py-2 transition mt-2`}
          >
            <LogOut size={18} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {!collapsed && (
          <div className="text-[11px] text-slate-500 border-t border-white/10 pt-4 mt-3">
            <div>© {new Date().getFullYear()} FlowAI</div>
            <div>
              <a href="/privacy" className="underline">Privacy</a> ·{" "}
              <a href="/terms" className="underline">Terms</a>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT AREA */}
      <section className="flex-1 flex flex-col">{children}</section>
    </main>
  );
}
