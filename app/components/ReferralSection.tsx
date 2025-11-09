"use client";
import { useEffect, useState } from "react";

export default function ReferralSection() {
  const [userCode, setUserCode] = useState<string | null>(null);

  // Read the code once from the URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("ref") || params.get("code");
    if (!code) return;
    setUserCode(code); // set-state is OK here because effect runs once
    localStorage.setItem("flowai_referral_code", code);
  }, []); // ← runs once, no render loop

  if (!userCode) return null;

  return (
    <div className="text-sm text-slate-600">
      Thanks! Your referral code <span className="font-semibold">{userCode}</span> is applied.
    </div>
  );
}
