// app/beta/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BetaPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr("");
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/beta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setErr("Incorrect code. Try again.");
        return;
      }
      // cookie set by server → go to app/dashboard (or landing if you prefer)
      router.replace("/app"); // or "/"
    } catch (e) {
      setErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl w-full max-w-md p-6">
        <h1 className="text-xl font-semibold text-slate-900 text-center">Private Beta</h1>
        <p className="text-sm text-slate-600 text-center mt-2">Enter your access code to preview FlowAI.</p>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter access code"
          className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none bg-white mt-6"
        />

        <button
          onClick={submit}
          disabled={loading}
          className={`w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-semibold px-4 py-3 rounded-lg mt-4 shadow-md hover:shadow-lg hover:scale-[1.02] transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Unlocking…" : "Enter"}
        </button>

        {err && <p className="text-xs text-rose-500 mt-3 text-center">{err}</p>}
        <p className="text-[11px] text-slate-500 text-center mt-4">Friends & family only.</p>
      </div>
    </main>
  );
}
