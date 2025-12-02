"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sparkles, Check, ArrowLeft } from "lucide-react";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const plan = searchParams.get("plan") || "free";

  const planDetails: Record<string, { name: string; price: string; trial: boolean }> = {
    free: { name: "Free", price: "£0/month", trial: false },
    pro: { name: "Pro", price: "£9/month", trial: true },
    business: { name: "Business", price: "£29/month", trial: true },
  };

  const selectedPlan = planDetails[plan] || planDetails.free;

  const handleEmailSignup = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("refraim_selected_plan", plan);
      }

      const result = await signIn("credentials", {
        email: email.trim(),
        redirect: false,
        callbackUrl: "/onboarding",
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setError("This email is not allowed. Please use a different email or sign up with Google.");
        } else {
          setError("Unable to sign in. Please try again.");
        }
        setIsLoading(false);
      } else if (result?.ok) {
        router.push("/onboarding");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("refraim_selected_plan", plan);
    }
    await signIn("google", { callbackUrl: "/onboarding" });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Back button */}
        <button
          onClick={() => router.push("/pricing")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to pricing
        </button>

        {/* Plan badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            {selectedPlan.name} Plan - {selectedPlan.price}
            {selectedPlan.trial && " (7-day trial)"}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 text-center">
          Create your account
        </h1>
        <p className="text-sm text-slate-600 text-center mt-2 mb-8">
          {selectedPlan.trial 
            ? "Start your 7-day free trial. No credit card required."
            : "Get started with Refraim AI for free."
          }
        </p>

        {/* Google Sign Up */}
        <button
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 text-sm font-medium px-4 py-3 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs text-slate-400">or continue with email</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* Email signup */}
        <label className="block text-xs font-medium text-slate-700 mb-2">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          placeholder="you@example.com"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
        />

        {error && (
          <p className="text-red-500 text-xs mt-2">{error}</p>
        )}

        <button
          onClick={handleEmailSignup}
          disabled={isLoading || !email.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold px-4 py-3 rounded-xl mt-4 shadow-md hover:shadow-lg hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Please wait..." : "Continue with Email"}
        </button>

        {/* Trust badges */}
        <div className="flex flex-col gap-2 mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Check className="w-3.5 h-3.5 text-green-500" />
            No credit card required
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Check className="w-3.5 h-3.5 text-green-500" />
            Cancel anytime during trial
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Check className="w-3.5 h-3.5 text-green-500" />
            Your data is secure
          </div>
        </div>

        {/* Sign in link */}
        <p className="text-xs text-slate-500 text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="text-slate-500">Loading...</div>
      </main>
    }>
      <SignupContent />
    </Suspense>
  );
}
