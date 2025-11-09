"use client";
import { useMemo, useState } from "react";

export default function ReferralSection() {
  const code = useMemo(() => {
    if (typeof window === "undefined") return "";
    let c = localStorage.getItem("flowai_referral_code");
    if (!c) {
      c = Math.random().toString(36).slice(2, 8).toUpperCase();
      localStorage.setItem("flowai_referral_code", c);
    }
    return c;
  }, []);

  const [userCode] = useState(code);

  if (!userCode) return null;

  return (
    <div className="text-xs text-slate-500 text-center mt-6">
      Your referral code: <span className="font-semibold">{userCode}</span>
    </div>
  );
}
