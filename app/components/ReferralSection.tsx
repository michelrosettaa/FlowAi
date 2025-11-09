"use client";
import React, { useState } from "react";

export default function ReferralSection() {
  const [userCode] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    let code = window.localStorage.getItem("flowai_referral_code");
    if (!code) {
      code = Math.random().toString(36).slice(2, 8);
      window.localStorage.setItem("flowai_referral_code", code);
    }
    return code;
  });

  if (!userCode) return null;

  return (
    <div className="text-[12px] text-slate-500 mt-6">
      Your referral code: <span className="font-semibold">{userCode}</span>
    </div>
  );
}
