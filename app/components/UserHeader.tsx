"use client";

import { useSession } from "next-auth/react";

export function UserHeader() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not signed in</div>;
  }

  return (
    <div className="text-sm text-slate-300">
      Hello {session.user?.name}
    </div>
  );
}
