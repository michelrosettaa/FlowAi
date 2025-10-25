"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Title */}
        <Link href="/" className="text-xl font-bold text-blue-700">
          FlowAI
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-4 text-gray-600">
          <Link href="/planner" className="hover:text-blue-600">
            Planner
          </Link>
          <Link href="/emails" className="hover:text-blue-600">
            Emails
          </Link>
          <Link href="/summaries" className="hover:text-blue-600">
            Summaries
          </Link>
        </div>
      </div>
    </nav>
  );
}
