"use client";

import { useState } from "react";
import { Gift, Copy, CheckCircle } from "lucide-react";

export default function ReferralSection() {
  const [copied, setCopied] = useState(false);

  // lazy initialiser so we don't call setState inside an effect
  const [userCode] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    let code = localStorage.getItem("flowai_referral_code");
    if (!code) {
      code = "flowai-" + Math.random().toString(36).substring(2, 8);
      localStorage.setItem("flowai_referral_code", code);
    }
    return code;
  });

  if (!userCode) return null;

  const referralLink = `https://flowai.app/signup?ref=${userCode}`;

  const copyToClipboard = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard may be unavailable; ignore
      }
    }
  };

  return (
    <section className="relative bg-white/60 backdrop-blur-2xl border border-slate-200/80 rounded-2xl shadow-2xl p-10 mt-20 max-w-2xl mx-auto text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-400/10 blur-3xl -z-10"></div>

      <div className="flex items-center justify-center gap-3 mb-4">
        <Gift className="w-6 h-6 text-indigo-500" />
        <h2 className="text-2xl font-bold text-slate-900">Invite & Earn Rewards</h2>
      </div>

      <p className="text-slate-600 mb-6 text-sm leading-relaxed max-w-md mx-auto">
        Share your personal referral link. When your friend joins, you&apos;ll both
        unlock <span className="font-semibold text-indigo-600">1 free month of FlowAI Pro</span>.
      </p>

      <div className="flex items-center justify-center gap-2 flex-wrap">
        <input
          value={referralLink}
          readOnly
          className="w-[70%] px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={copyToClipboard}
          className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-5 py-3 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.99] transition-transform duration-150"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 inline-block mr-2" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 inline-block mr-2" /> Copy
            </>
          )}
        </button>
      </div>

      <div className="mt-6 text-xs text-slate-500">
        Your referral code:{" "}
        <span className="font-mono text-slate-800 bg-slate-100 rounded px-2 py-1">{userCode}</span>
      </div>

      <div className="mt-8 text-[13px] text-slate-500 italic">Share focus. Grow together with FlowAI.</div>
    </section>
  );
}