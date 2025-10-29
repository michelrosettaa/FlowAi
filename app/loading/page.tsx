"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPlannerPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.push("/app");
    }, 2000); // 2s fake build

    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0A0F1C] via-[#101a2e] to-[#1a2b46] text-slate-100 px-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
        <div className="text-[11px] uppercase tracking-wide text-indigo-300 font-medium mb-2">
          Setting up FlowAI
        </div>
        <div className="text-xl font-semibold text-white mb-4">
          Building your intelligent planner…
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 animate-pulse w-2/3 rounded-full" />
        </div>
        <p className="text-[12px] text-slate-400 mt-4 leading-relaxed">
          Blocking focus time, syncing calendar, prepping follow-up emails,
          and getting your mentor ready.
        </p>
      </div>
    </main>
  );
}
