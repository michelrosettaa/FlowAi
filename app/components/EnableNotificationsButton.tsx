"use client";

import { useState } from "react";

function urlB64ToUint8Array(b64: string) {
  const padding = "=".repeat((4 - (b64.length % 4)) % 4);
  const base64 = (b64 + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) arr[i] = raw.charCodeAt(i);
  return arr;
}

export default function EnableNotificationsButton({
  email,
}: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  const enable = async () => {
    setErr("");
    try {
      if (!("Notification" in window)) throw new Error("No Notification API");
      const perm = await Notification.requestPermission();
      if (perm !== "granted") throw new Error("Permission denied");

      const reg = await navigator.serviceWorker.ready;

      const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
      if (!vapid) throw new Error("Missing VAPID public key");

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(vapid),
      });

      setLoading(true);
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subscription: sub }),
      });
      if (!res.ok) throw new Error("Subscribe failed");
      setOk(true);
    } catch (e: any) {
      setErr(e.message || "Failed to enable notifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={enable}
        disabled={loading || ok}
        className={`px-3 py-2 rounded-md text-sm font-semibold text-white
          ${ok ? "bg-green-600" : "bg-indigo-600 hover:bg-indigo-700"}
          disabled:opacity-60`}
      >
        {ok ? "Notifications enabled" : (loading ? "Enabling…" : "Enable notifications")}
      </button>
      {err && <span className="text-rose-500 text-xs">{err}</span>}
    </div>
  );
}
