"use client";

import React, { useMemo, useState } from "react";

export default function ReferralSection() {
  const initialCode = useMemo(() => {
    if (typeof window === "undefined") return "";
    const existing = localStorage.getItem("flowai_referral_code");
    if (existing) return existing;
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    localStorage.setItem("flowai_referral_code", code);
    return code;
  }, []);

  const [userCode] = useState<string>(initialCode);

  if (!userCode) return null;

  return (
    <div className="text-xs text-slate-500 text-center mt-6">
      Your referral code: <span className="font-semibold">{userCode}</span>
    </div>
  );
}
