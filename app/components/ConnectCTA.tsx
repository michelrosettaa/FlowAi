"use client";

import { useRouter } from "next/navigation";
import { IcMail, IcCalendar } from "../Icons";

export default function ConnectCTA() {
  const router = useRouter();

  return (
    <section className="relative z-10 w-full max-w-6xl mx-auto px-6 mt-32 mb-20">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Connect Email */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-6 flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-3 text-white shadow-md">
              <IcMail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-slate-900 font-semibold text-lg">
                Connect your email
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mt-1">
                Refraim AI can summarise long threads, draft replies in your tone,
                and remind you about follow-ups.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/onboarding")}
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-semibold px-4 py-2 shadow-md hover:shadow-lg hover:scale-[1.02] transition"
          >
            Connect email →
          </button>
        </div>

        {/* Connect Calendar */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-6 flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl p-3 text-white shadow-md">
              <IcCalendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-slate-900 font-semibold text-lg">
                Sync your calendar
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mt-1">
                Refraim AI will block “deep work” time around your meetings and keep
                you on track without you doing anything.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/onboarding")}
            className="mt-5 inline-flex items-center justify-center rounded-lg border border-indigo-500/40 text-indigo-600 bg-white text-sm font-semibold px-4 py-2 shadow-sm hover:bg-indigo-50 transition"
          >
            Sync calendar →
          </button>
        </div>
      </div>

      <p className="text-center text-[13px] text-slate-500 mt-10">
        No spam. You stay in control. Disconnect anytime.
      </p>
    </section>
  );
}
