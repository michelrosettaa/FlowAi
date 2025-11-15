"use client";

import { useEffect, useState } from "react";
import { Gift, Copy, CheckCircle } from "lucide-react"; // modern clean icons

export default function ReferralSection() {
  const [copied, setCopied] = useState(false);
  const [userCode, setUserCode] = useState<string | null>(null);

  useEffect(() => {
    let code = localStorage.getItem("refraim_referral_code");
    if (!code) {
      code = "refraim-" + Math.random().toString(36).substring(2, 8);
      localStorage.setItem("refraim_referral_code", code);
    }
    setUserCode(code);
  }, []);

  if (!userCode) return null;

  const referralLink = `https://refraim.app/signup?ref=${userCode}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative bg-white/60 backdrop-blur-2xl border border-slate-200/80 rounded-2xl shadow-2xl p-10 mt-20 max-w-2xl mx-auto text-center overflow-hidden">
      {/* Soft gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-400/10 blur-3xl -z-10"></div>

      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <Gift className="w-6 h-6 text-indigo-500" />
        <h2 className="text-2xl font-bold text-slate-900">Invite & Earn Rewards</h2>
      </div>

      <p className="text-slate-600 mb-6 text-sm leading-relaxed max-w-md mx-auto">
        Share your personal referral link. When your friend joins, you’ll both
        unlock <span className="font-semibold text-indigo-600">1 free month of Refraim AI Pro</span>.
      </p>

      {/* Referral Link */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <input
          value={referralLink}
          readOnly
          className="w-[70%] px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={copyToClipboard}
          className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-5 py-3 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.99] transition-all flex items-center gap-2"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy
            </>
          )}
        </button>
      </div>

      {/* Referral Code */}
      <div className="mt-6 text-xs text-slate-500">
        Your referral code:{" "}
        <span className="font-mono text-slate-800 bg-slate-100 rounded px-2 py-1">
          {userCode}
        </span>
      </div>

      {/* Tagline */}
      <div className="mt-8 text-[13px] text-slate-500 italic">
        Share focus. Grow together with Refraim AI.
      </div>
    </section>
  );
}
