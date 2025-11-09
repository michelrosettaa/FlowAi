"use client";
import { useEffect } from "react";

export default function ClientInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Register SW once
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}
