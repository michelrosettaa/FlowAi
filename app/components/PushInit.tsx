"use client";

import { useEffect } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output;
}

export default function PushInit({ email }: { email?: string }) {
  useEffect(() => {
    (async () => {
      if (typeof window === "undefined") return;
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

      try {
        // 1) Register the SW (once)
        const reg = await navigator.serviceWorker.register("/sw.js");

        // 2) Ask permission (only if not granted/denied)
        let permission = Notification.permission;
        if (permission === "default") {
          permission = await Notification.requestPermission();
        }
        if (permission !== "granted") return; // user said no

        // 3) Subscribe (idempotent)
        const existing = await reg.pushManager.getSubscription();
        const sub =
          existing ||
          (await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string
            ),
          }));

        // 4) Send to your API (idempotent on endpoint)
        const userEmail =
          email ||
          localStorage.getItem("flowai_email") ||
          undefined;

        await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, subscription: sub }),
        }).catch(() => {});
      } catch (e) {
        // swallow — don’t break the app if push fails
        console.warn("Push init skipped:", e);
      }
    })();
  }, [email]);

  return null;
}
