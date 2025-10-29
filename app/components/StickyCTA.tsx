"use client";

import { useRouter } from "next/navigation";

export default function StickyCTA() {
  const router = useRouter();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100]">
      <button
        onClick={() => router.push("/app")}
        className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-full px-6 py-3 text-sm font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
      >
        Start free trial → 7 days free
      </button>
    </div>
  );
}
