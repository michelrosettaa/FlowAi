"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Calendar, Shield, LogOut, Loader2 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [onboardingData, setOnboardingData] = useState<any>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      loadUserData();
    }
  }, [status, session]);

  const loadUserData = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        if (data.preferences) {
          setOnboardingData(data.preferences);
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--app-accent)' }} />
      </div>
    );
  }

  if (!session?.user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex-1 p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <User className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--app-text)' }}>
          Your Profile
        </h1>
        <p className="text-base" style={{ color: 'var(--app-text-dim)' }}>
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        <div className="premium-card p-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--app-text)' }}>
            Personal Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--app-text)' }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ 
                  background: 'var(--app-surface)',
                  color: 'var(--app-text)',
                  border: '1px solid var(--app-border)'
                }}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--app-text)' }}>
                Email
              </label>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                style={{ 
                  background: 'var(--app-surface)',
                  border: '1px solid var(--app-border)'
                }}>
                <Mail className="w-4 h-4" style={{ color: 'var(--app-text-dim)' }} />
                <span className="text-sm" style={{ color: 'var(--app-text-dim)' }}>
                  {email}
                </span>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: 'var(--app-accent)' }}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>

        {onboardingData && (
          <div className="premium-card p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--app-text)' }}>
              Your Preferences
            </h2>
            
            <div className="space-y-3">
              {onboardingData.goal && (
                <div>
                  <div className="text-xs font-semibold mb-1" style={{ color: 'var(--app-text-dim)' }}>
                    Main Goal
                  </div>
                  <div className="text-sm" style={{ color: 'var(--app-text)' }}>
                    {onboardingData.goal}
                  </div>
                </div>
              )}
              
              {onboardingData.workStyle && (
                <div>
                  <div className="text-xs font-semibold mb-1" style={{ color: 'var(--app-text-dim)' }}>
                    Work Style
                  </div>
                  <div className="text-sm" style={{ color: 'var(--app-text)' }}>
                    {onboardingData.workStyle}
                  </div>
                </div>
              )}
              
              {onboardingData.challenge && (
                <div>
                  <div className="text-xs font-semibold mb-1" style={{ color: 'var(--app-text-dim)' }}>
                    Biggest Challenge
                  </div>
                  <div className="text-sm" style={{ color: 'var(--app-text)' }}>
                    {onboardingData.challenge}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="premium-card p-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--app-text)' }}>
            Connected Services
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: 'var(--app-surface)' }}>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" style={{ color: 'var(--app-accent)' }} />
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                    Google Calendar
                  </div>
                  <div className="text-xs" style={{ color: 'var(--app-text-dim)' }}>
                    Sync your events and schedules
                  </div>
                </div>
              </div>
              <a
                href="/app/calendar"
                className="text-xs font-semibold px-4 py-2 rounded-lg"
                style={{ background: 'var(--app-accent)', color: 'white' }}
              >
                Manage
              </a>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: 'var(--app-surface)' }}>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" style={{ color: 'var(--app-accent)' }} />
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                    Email Accounts
                  </div>
                  <div className="text-xs" style={{ color: 'var(--app-text-dim)' }}>
                    Gmail, Outlook, and more
                  </div>
                </div>
              </div>
              <a
                href="/app/settings/email"
                className="text-xs font-semibold px-4 py-2 rounded-lg"
                style={{ background: 'var(--app-accent)', color: 'white' }}
              >
                Manage
              </a>
            </div>
          </div>
        </div>

        <div className="premium-card p-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--app-text)' }}>
            Account Actions
          </h2>
          
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {loading ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
