"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'mailinator.com',
  'temp-mail.org', '10minutemail.com', 'fakeinbox.com', 'trashmail.com',
  'tempail.com', 'dispostable.com', 'yopmail.com', 'maildrop.cc',
  'getairmail.com', 'mohmal.com', 'getnada.com', 'emailondeck.com',
  'tempr.email', 'discard.email', 'sharklasers.com', 'spam4.me'
];

function isValidEmail(email: string): { valid: boolean; error?: string } {
  const trimmed = email.trim().toLowerCase();
  
  if (!trimmed) {
    return { valid: false, error: "Please enter your email address" };
  }
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address" };
  }
  
  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: "Please enter a valid email address" };
  }
  
  const domain = parts[1];
  if (!domain.includes('.') || domain.endsWith('.') || domain.startsWith('.')) {
    return { valid: false, error: "Please enter a valid email domain" };
  }
  
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return { valid: false, error: "Please use a real email address, not a temporary one" };
  }
  
  return { valid: true };
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/onboarding";

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError(null);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    const validation = isValidEmail(email);
    if (!validation.valid) {
      setEmailError(validation.error || "Invalid email");
      return;
    }
    
    setIsLoading(true);
    setEmailError(null);
    
    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      redirect: false,
    });
    
    if (result?.error) {
      setEmailError("Unable to sign in with this email. Please try again or use Google sign-in.");
      setIsLoading(false);
    } else if (result?.ok) {
      router.push(callbackUrl);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl mb-3">
            R
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Continue to Refraim AI</h1>
          <p className="text-sm text-slate-600 text-center mt-2">
            Sign in with your email or provider
          </p>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailSignIn} className="mb-6">
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-3 rounded-lg border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                emailError 
                  ? 'border-red-400 focus:ring-red-500' 
                  : 'border-slate-300 focus:ring-indigo-500'
              }`}
              disabled={isLoading}
              autoComplete="email"
            />
            {emailError && (
              <p className="mt-2 text-sm text-red-600">{emailError}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium px-4 py-3 rounded-lg transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Continue with Email"}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500">Or continue with</span>
          </div>
        </div>

        {/* OAuth Button - Google only */}
        <button
          onClick={() => handleOAuthSignIn("google")}
          className="w-full bg-white hover:bg-slate-50 text-slate-900 text-sm font-medium px-4 py-3 rounded-lg border border-slate-300 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>

        <p className="text-center text-xs text-slate-500 mt-8 leading-relaxed">
          By continuing, you agree to Refraim AI's Terms of Service and Privacy Policy
        </p>

        <p className="text-center text-[11px] text-slate-400 mt-4">
          © {new Date().getFullYear()} Refraim AI — Focus, clarity, momentum.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
