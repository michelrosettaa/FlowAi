"use client";

import { useEffect, useRef, useState } from "react";

type Props = { code?: string };

export default function ReferralSection({ code }: Props) {
  const [userCode, setUserCode] = useState("");
  // Prevent repeated state changes on every render to satisfy the lint rule
  const didSetRef = useRef(false);

  useEffect(() => {
    if (didSetRef.current) return;
    if (!code) return;

    try {
      localStorage.setItem("flowai_referral_code", code);
      // guarded one-time state set
      setUserCode(code);
      didSetRef.current = true;
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  }, [code]);

  if (!userCode) return null;

  return (
    <div className="text-xs text-slate-500">
      Referred code: <span className="font-mono">{userCode}</span>
    </div>
  );
}
