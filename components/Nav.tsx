"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="w-full p-4 bg-blue-600 text-white flex justify-between items-center">
      <h1 className="font-bold text-xl">FlowAI</h1>
      <div className="flex gap-4">
        <Link href="/" className="hover:underline">Planner</Link>
        <Link href="/emails" className="hover:underline">Emails</Link>
        <Link href="/summaries" className="hover:underline">Summaries</Link>
      </div>
    </nav>
  );
}

