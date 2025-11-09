"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ReferralSection() {
  const params = useSearchParams();
  const [userCode, setUserCode] = useState<string | null>(null);

  // Only write to state/localStorage when the code value changes.
  useEffect(() => {
    const code = params.get("ref") || params.get("r") || "";
    if (!code) return;

    // avoid pointless writes
    setUserCode((prev) => (prev === code ? prev : code));
    const existing = typeof window !== "undefined" ? localStorage.getItem("flowai_referral_code") : null;
    if (existing !== code) {
      localStorage.setItem("flowai_referral_code", code);
    }
  }, [params]); // runs when the querystring changes

  if (!userCode) return null;

  return (
    <div className="mt-2 text-[11px] text-slate-400">
      Invited with code: <span className="font-medium">{userCode}</span>
    </div>
  );
}
