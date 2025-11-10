"use client";

import { useRouter, usePathname } from "next/navigation";
import React from "react";

// --- (rest of your component implementation) ---
// Keep the rest of your file exactly as it currently is.
// Example scaffold (replace with your real contents if different):

type Props = {
  children?: React.ReactNode;
};

export default function AppShell({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      <header>
        <h1>App Shell</h1>
      </header>
      <main>{children}</main>
      <footer>Path: {pathname}</footer>
    </div>
  );
}