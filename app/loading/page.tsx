"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    // Simulate loading process for 3 seconds
    const timer = setTimeout(() => {
      router.push("/app");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-lg w-full max-w-md p-8"
      >
        <h1 className="text-2xl font-bold text-slate-900">
          Building your FlowAI dashboard...
        </h1>
        <p className="text-slate-500 text-sm mt-3">
          This may take a few seconds as we personalise your workspace.
        </p>

        <div className="mt-8 flex justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </motion.div>
    </main>
  );
}
