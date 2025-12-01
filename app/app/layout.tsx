"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { useAuth } from "@/app/hooks/useAuth";
import {
  LayoutDashboard,
  Mail,
  Calendar,
  LineChart,
  Users,
  User,
  Settings,
  BrainCircuit,
  PhoneCall,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Menu,
  X,
  CreditCard,
  Bell,
} from "lucide-react";
import NotificationBell from "./components/NotificationBell";

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

function InnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navSections = [
    {
      section: "Home",
      items: [
        { name: "Dashboard", path: "/app", icon: <LayoutDashboard size={18} /> },
      ]
    },
    {
      section: "AI Assistants",
      items: [
        { name: "Ask Refraim", path: "/app/ask-refraim", icon: <BrainCircuit size={18} /> },
        { name: "Refraim Motivator", path: "/app/mentor", icon: <Users size={18} /> },
        { name: "Refraim Mail", path: "/app/email", icon: <Mail size={18} /> },
      ]
    },
    {
      section: "Productivity",
      items: [
        { name: "Refraim Planner", path: "/app/planner", icon: <Calendar size={18} /> },
        { name: "Calendar", path: "/app/calendar", icon: <Calendar size={18} /> },
        { name: "Refraim Summariser", path: "/app/calls", icon: <PhoneCall size={18} /> },
      ]
    },
    {
      section: "Insights",
      items: [
        { name: "Refraim Analytics", path: "/app/stats", icon: <LineChart size={18} /> },
      ]
    },
    {
      section: "Account",
      items: [
        { name: "Profile", path: "/app/profile", icon: <User size={18} /> },
        { name: "Subscription", path: "/app/billing", icon: <CreditCard size={18} /> },
        { name: "Notifications", path: "/app/settings/notifications", icon: <Bell size={18} /> },
        { name: "Help", path: "/app/help", icon: <HelpCircle size={18} /> },
      ]
    },
  ];

  const SidebarContent = ({ showFull = true }: { showFull?: boolean }) => (
    <>
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white text-base font-bold flex items-center justify-center shadow-lg">
              F
            </div>
            {(showFull && !collapsed) && (
              <div className="font-bold text-base" style={{ color: 'var(--app-text)' }}>
                Refraim AI
              </div>
            )}
          </div>

          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors hidden md:block"
              style={{ color: 'var(--app-text-dim)' }}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        {navSections.map((section) => (
          <div key={section.section} className="mb-4 md:mb-6">
            {(showFull && !collapsed) && (
              <div className="px-2 mb-2 text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--app-text-muted)' }}>
                {section.section}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
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
                >
                  {item.icon}
                  {(showFull && !collapsed) && <span>{item.name}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      <div className="flex flex-col gap-2 px-3 pb-6">
        {(showFull && !collapsed) && (
          <div className="mb-4 px-2">
            <p className="mb-3 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--app-text-muted)' }}>
              Theme
            </p>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => toggleTheme("dark")}
                className="flex flex-col items-center gap-1.5 px-2 py-2 rounded-lg transition-all hover:scale-105"
                style={{
                  background: 'var(--app-surface)',
                  border: '1px solid var(--app-border)'
                }}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-900 to-indigo-900 border-2 border-slate-700" />
                <span className="text-[9px] font-medium" style={{ color: 'var(--app-text-dim)' }}>Dark</span>
              </button>
              <button
                onClick={() => toggleTheme("light")}
                className="flex flex-col items-center gap-1.5 px-2 py-2 rounded-lg transition-all hover:scale-105"
                style={{
                  background: 'var(--app-surface)',
                  border: '1px solid var(--app-border)'
                }}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-100 to-blue-100 border-2 border-gray-300" />
                <span className="text-[9px] font-medium" style={{ color: 'var(--app-text-dim)' }}>Light</span>
              </button>
              <button
                onClick={() => toggleTheme("green")}
                className="flex flex-col items-center gap-1.5 px-2 py-2 rounded-lg transition-all hover:scale-105"
                style={{
                  background: 'var(--app-surface)',
                  border: '1px solid var(--app-border)'
                }}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-200 to-green-300 border-2 border-emerald-400" />
                <span className="text-[9px] font-medium" style={{ color: 'var(--app-text-dim)' }}>Earth</span>
              </button>
              <button
                onClick={() => toggleTheme("pink")}
                className="flex flex-col items-center gap-1.5 px-2 py-2 rounded-lg transition-all hover:scale-105"
                style={{
                  background: 'var(--app-surface)',
                  border: '1px solid var(--app-border)'
                }}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 border-2 border-pink-400" />
                <span className="text-[9px] font-medium" style={{ color: 'var(--app-text-dim)' }}>Bloom</span>
              </button>
            </div>
          </div>
        )}

        {(showFull && !collapsed) && user && (
          <div className="px-2 py-3 rounded-lg" style={{ 
            background: 'var(--app-surface)',
            border: '1px solid var(--app-border)'
          }}>
            <div className="flex items-center gap-2">
              {user.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={user.email || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                  style={{ border: '2px solid var(--app-accent)' }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: 'var(--app-text)' }}>
                  {user.firstName || user.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-[10px] truncate" style={{ color: 'var(--app-text-muted)' }}>
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => window.location.href = "/api/logout"}
          className={`flex items-center ${
            (showFull && !collapsed) ? "gap-2" : "justify-center"
          } text-left text-sm rounded-xl px-3 py-2 transition-all mt-2`}
          style={{ color: 'var(--app-text-dim)' }}
        >
          <LogOut size={18} />
          {(showFull && !collapsed) && <span>Sign Out</span>}
        </button>

        {(showFull && !collapsed) && (
          <div className="text-[10px] pt-4 mt-3 text-center" style={{ 
            color: 'var(--app-text-muted)',
            borderTop: '1px solid var(--app-border)'
          }}>
            © {new Date().getFullYear()} Refraim AI
          </div>
        )}
      </div>
    </>
  );

  return (
    <main className="min-h-screen flex flex-col md:flex-row" style={{ color: 'var(--app-text, #f1f5f9)' }}>
      {/* MOBILE HEADER */}
      <header 
        className="md:hidden flex items-center justify-between px-4 py-3 premium-glass border-b sticky top-0 z-50"
        style={{ borderColor: 'var(--app-border-strong)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center shadow-lg">
            F
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--app-text)' }}>Refraim AI</span>
        </div>
        
        <div className="flex items-center gap-1">
          <NotificationBell />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--app-text)' }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE SLIDE-IN MENU */}
      <aside
        className={`md:hidden fixed top-0 right-0 h-full w-[280px] z-50 premium-glass flex flex-col transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ 
          borderLeft: '1px solid var(--app-border-strong)',
          backdropFilter: 'blur(24px)'
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--app-border)' }}>
          <span className="font-semibold" style={{ color: 'var(--app-text)' }}>Menu</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg"
            style={{ color: 'var(--app-text-dim)' }}
          >
            <X size={20} />
          </button>
        </div>
        <SidebarContent showFull={true} />
      </aside>

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex ${
          collapsed ? "w-[72px]" : "w-[260px]"
        } premium-glass flex-col transition-all duration-300 border-r sticky top-0 h-screen`}
        style={{ 
          borderColor: 'var(--app-border-strong)',
          backdropFilter: 'blur(24px)'
        }}
      >
        <SidebarContent showFull={true} />
      </aside>

      {/* MAIN CONTENT AREA */}
      <section className="flex-1 flex flex-col min-h-screen md:min-h-0 overflow-x-hidden">
        {children}
      </section>
    </main>
  );
}
