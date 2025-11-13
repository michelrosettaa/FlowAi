"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
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
  - wraps children in ThemeProvider
  - renders InnerLayout (which can safely use useTheme)
*/
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <InnerLayout>{children}</InnerLayout>
    </ThemeProvider>
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
    { name: "Mentor", path: "/app/mentor", icon: <Settings size={18} /> },
    { name: "Email", path: "/app/email", icon: <Mail size={18} /> },
    { name: "Stats", path: "/app/stats", icon: <LineChart size={18} /> },
    { name: "Calendar", path: "/app/calendar", icon: <Calendar size={18} /> },
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
    <main className="min-h-screen flex" style={{ color: 'var(--app-text, #f1f5f9)' }}>
      {/* SIDEBAR */}
      <aside
        className={`${
          collapsed ? "w-[72px]" : "w-[260px]"
        } premium-glass flex flex-col transition-all duration-300 border-r`}
        style={{ 
          borderColor: 'var(--app-border-strong)',
          backdropFilter: 'blur(24px)'
        }}
      >
        {/* HEADER */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white text-base font-bold flex items-center justify-center shadow-lg">
                F
              </div>
              {!collapsed && (
                <div className="font-bold text-base" style={{ color: 'var(--app-text)' }}>
                  FlowAI
                </div>
              )}
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: 'var(--app-text-dim)' }}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col gap-0.5 px-3">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 text-left text-sm rounded-xl px-3 py-2.5 transition-all duration-200 ${
                pathname === item.path
                  ? "font-semibold shadow-lg"
                  : "font-medium"
              }`}
              style={{
                background: pathname === item.path 
                  ? 'var(--app-surface-hover)' 
                  : 'transparent',
                border: `1px solid ${pathname === item.path ? 'var(--app-border-strong)' : 'transparent'}`,
                color: pathname === item.path ? 'var(--app-accent)' : 'var(--app-text-dim)',
              }}
              onMouseEnter={(e) => {
                if (pathname !== item.path) {
                  e.currentTarget.style.background = 'var(--app-surface)';
                  e.currentTarget.style.borderColor = 'var(--app-border)';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== item.path) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </button>
          ))}
        </div>

        {/* spacer to push bottom section down */}
        <div className="flex-1" />

        {/* THEME PICKER / SETTINGS / HELP / SIGN OUT */}
        <div className="flex flex-col gap-2 px-3 pb-6">
          {/* THEME SELECTOR */}
          {!collapsed && (
            <div className="mb-4 px-2">
              <p className="mb-3 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--app-text-muted)' }}>
                Theme
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => toggleTheme("dark")}
                  className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg transition-all hover:scale-105"
                  style={{
                    background: 'var(--app-surface)',
                    border: '1px solid var(--app-border)'
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-900 to-indigo-900 border-2 border-slate-700" />
                  <span className="text-[10px] font-medium" style={{ color: 'var(--app-text-dim)' }}>Dark</span>
                </button>

                <button
                  onClick={() => toggleTheme("light")}
                  className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg transition-all hover:scale-105"
                  style={{
                    background: 'var(--app-surface)',
                    border: '1px solid var(--app-border)'
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-blue-100 border-2 border-gray-300" />
                  <span className="text-[10px] font-medium" style={{ color: 'var(--app-text-dim)' }}>Light</span>
                </button>

                <button
                  onClick={() => toggleTheme("green")}
                  className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg transition-all hover:scale-105"
                  style={{
                    background: 'var(--app-surface)',
                    border: '1px solid var(--app-border)'
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-200 to-green-300 border-2 border-emerald-400" />
                  <span className="text-[10px] font-medium" style={{ color: 'var(--app-text-dim)' }}>Earth</span>
                </button>

                <button
                  onClick={() => toggleTheme("pink")}
                  className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg transition-all hover:scale-105"
                  style={{
                    background: 'var(--app-surface)',
                    border: '1px solid var(--app-border)'
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 border-2 border-pink-400" />
                  <span className="text-[10px] font-medium" style={{ color: 'var(--app-text-dim)' }}>Bloom</span>
                </button>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          <button
            onClick={() => router.push("/app/settings")}
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-2"
            } text-left text-sm rounded-xl px-3 py-2 transition-all`}
            style={{ color: 'var(--app-text-dim)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--app-surface)';
              e.currentTarget.style.color = 'var(--app-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--app-text-dim)';
            }}
          >
            <Settings size={18} />
            {!collapsed && <span>Settings</span>}
          </button>

          {/* HELP */}
          <button
            onClick={() => router.push("/app/help")}
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-2"
            } text-left text-sm rounded-xl px-3 py-2 transition-all`}
            style={{ color: 'var(--app-text-dim)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--app-surface)';
              e.currentTarget.style.color = 'var(--app-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--app-text-dim)';
            }}
          >
            <HelpCircle size={18} />
            {!collapsed && <span>Help</span>}
          </button>

          {/* SIGN OUT → /login */}
          <button
            onClick={() => router.push("/login")}
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-2"
            } text-left text-sm rounded-xl px-3 py-2 transition-all mt-2`}
            style={{ color: 'var(--app-text-dim)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--app-surface)';
              e.currentTarget.style.color = 'var(--app-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--app-text-dim)';
            }}
          >
            <LogOut size={18} />
            {!collapsed && <span>Sign Out</span>}
          </button>

          {!collapsed && (
            <div className="text-[10px] pt-4 mt-3 text-center" style={{ 
              color: 'var(--app-text-muted)',
              borderTop: '1px solid var(--app-border)'
            }}>
              © {new Date().getFullYear()} FlowAI
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <section className="flex-1 flex flex-col">{children}</section>
    </main>
  );
}
