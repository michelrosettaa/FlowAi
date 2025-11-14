"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Calendar, Mail, Brain, CheckCircle2 } from "lucide-react";

const loadingSteps = [
  { icon: Sparkles, text: "Initializing AI assistant", duration: 400 },
  { icon: Calendar, text: "Syncing your calendar", duration: 400 },
  { icon: Mail, text: "Preparing email integration", duration: 400 },
  { icon: Brain, text: "Setting up focus mode", duration: 400 },
  { icon: CheckCircle2, text: "Ready to launch", duration: 400 },
];

export default function LoadingPlannerPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 20);

    // Step progression
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 400);

    // Redirect after completion
    const timeout = setTimeout(() => {
      router.push("/app");
    }, 2200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(timeout);
    };
  }, [router]);

  const CurrentIcon = loadingSteps[currentStep]?.icon || Sparkles;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0A0F1C] via-[#101a2e] to-[#1a2b46] text-slate-100 px-4 relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Main loading card */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
        {/* Animated icon container */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            {/* Rotating gradient ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 blur-lg animate-spin-slow opacity-50" 
                 style={{ width: '80px', height: '80px', margin: '-10px' }} />
            
            {/* Icon container */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-xl">
              <CurrentIcon className="w-8 h-8 text-white animate-fade-in" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-xs uppercase tracking-widest text-indigo-300 font-semibold mb-3 animate-fade-in">
          Setting Up FlowAI
        </div>

        {/* Current step text */}
        <div className="text-2xl font-bold text-white mb-6 h-8 animate-fade-in">
          {loadingSteps[currentStep]?.text}
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 rounded-full transition-all duration-100 ease-linear shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStep
                  ? "bg-indigo-400 shadow-lg shadow-indigo-500/50"
                  : "bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Subtitle */}
        <p className="text-sm text-slate-400 leading-relaxed">
          Preparing your intelligent workspace with AI-powered planning, email automation, and focus protection.
        </p>
      </div>

      {/* Loading percentage */}
      <div className="mt-6 text-indigo-300/60 text-sm font-mono tabular-nums animate-pulse">
        {progress}%
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </main>
  );
}
