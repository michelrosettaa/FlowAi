"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    // Register Service Worker once on client
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("✅ SW registered"))
        .catch((err) => console.error("❌ SW registration failed:", err));
    }
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
