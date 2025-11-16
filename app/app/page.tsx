"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Zap, Keyboard } from "lucide-react";
import CalendarWeekView from "../components/CalendarWeekView";
import ReferralSection from "../components/ReferralSection";
import InteractiveDashboard from "../components/InteractiveDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showCommandHint, setShowCommandHint] = useState(true);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    async function checkOnboarding() {
      if (status === "loading") return;
      if (!session) {
        router.push("/login");
        return;
      }

      // Check database directly for onboarding status
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const userData = await res.json();
          console.log('[APP PAGE] Profile data:', userData);
          console.log('[APP PAGE] Onboarding completed?', userData.onboardingCompleted);
          if (!userData.onboardingCompleted) {
            console.log('[APP PAGE] User has not completed onboarding, redirecting...');
            router.push("/onboarding");
            return;
          }
          console.log('[APP PAGE] Onboarding complete, showing dashboard');
        }
      } catch (error) {
        console.error('[APP PAGE] Error checking onboarding:', error);
      }
      
      setCheckingOnboarding(false);
    }

    checkOnboarding();
  }, [session, status, router]);

  if (status === "loading" || checkingOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Command Palette Hint - Dismissible */}
      {showCommandHint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-4 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Quick Actions Enabled!</h4>
                <p className="text-slate-400 text-xs">
                  Press{" "}
                  <kbd className="px-2 py-0.5 bg-slate-800 rounded text-xs mx-1 border border-slate-700">
                    ⌘ K
                  </kbd>{" "}
                  to instantly create tasks, schedule events, or ask Refraim AI anything
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCommandHint(false)}
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}

      {/* Interactive Stats Dashboard */}
      <InteractiveDashboard />

      {/* Calendar */}
      <CalendarWeekView readOnly={true} />
      
      <div className="pb-20">
        <ReferralSection />
      </div>

      {/* Floating Quick Action Hint */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.3 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <button
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              bubbles: true,
            });
            document.dispatchEvent(event);
          }}
          className="group relative bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            <span className="font-semibold">Quick Actions</span>
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs">⌘ K</kbd>
          </div>
        </button>
      </motion.div>
    </>
  );
}
