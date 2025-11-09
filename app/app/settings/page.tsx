// Example: app/app/settings/page.tsx (client)
"use client";
import { useSession } from "next-auth/react";
import EnableNotificationsButton from "@/app/components/EnableNotificationsButton";

export default function SettingsPage() {
  const { data } = useSession();
  const email = data?.user?.email || "";

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Settings</h1>
      {email ? (
        <EnableNotificationsButton email={email} />
      ) : (
        <p className="text-sm text-slate-500">Sign in to enable notifications.</p>
      )}
    </div>
  );
}
