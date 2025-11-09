"use client";
import { useMemo } from "react";

export default function ReferralSection() {
  const userCode = useMemo(() => {
    if (typeof window === "undefined") return "";
    const code = new URLSearchParams(window.location.search).get("ref") || "";
    if (code) localStorage.setItem("flowai_referral_code", code);
    return code;
  }, []);

  if (!userCode) return null;
  return null; // or your badge/UI
}
