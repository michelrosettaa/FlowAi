"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const steps = [
  {
    title: "What brings you to Refraim AI?",
    subtitle: "I'll personalise your experience to help you stay productive.",
    options: [
      "I need help staying organised",
      "I want to protect my focus time",
      "I need assistance with emails and follow-ups",
      "All of the above!",
    ],
    key: "goal",
  },
  {
    title: "How do you prefer to work?",
    subtitle: "This helps me understand your workflow style.",
    options: [
      "I thrive with structure and schedules",
      "I prefer flexibility and spontaneity",
      "A mix of both - it depends on the day",
    ],
    key: "workStyle",
  },
  {
    title: "What's your biggest time challenge?",
    subtitle: "I'll focus on helping you overcome this first.",
    options: [
      "Too many meetings interrupt my day",
      "Email and messages are overwhelming",
      "I struggle to prioritise what matters most",
      "I lose track of tasks and follow-ups",
    ],
    key: "challenge",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const step = steps[stepIndex];

  const selectOption = async (opt: string) => {
    const newAnswers = { ...answers, [step.key]: opt };
    setAnswers(newAnswers);

    // if last step -> save to database and go to app
    if (stepIndex === steps.length - 1) {
      // Save answers to localStorage for email-only users
      localStorage.setItem('refraim_onboarding', JSON.stringify(newAnswers));
      
      // Save to database
      try {
        const res = await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers }),
        });
        
        if (res.ok) {
          // NUCLEAR OPTION: Sign out and back in to get a completely fresh JWT token
          // This is the only guaranteed way to update the session
          const { signIn, signOut } = await import("next-auth/react");
          const currentSession = await fetch('/api/auth/session').then(r => r.json());
          const email = currentSession?.user?.email;
          
          if (email) {
            // Sign out completely
            await signOut({ redirect: false });
            // Sign back in with the same email - this generates a fresh token with onboardingCompleted=true
            await signIn('credentials', { email, redirect: false });
            // Now redirect to app
            window.location.href = "/app";
          } else {
            // Fallback
            window.location.href = "/app";
          }
        }
      } catch (err) {
        console.error("Save error:", err);
        // Even if save fails, continue
        window.location.href = "/app";
      }
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* LEFT PANE (question) */}
      <section className="w-full md:w-1/2 bg-white flex flex-col justify-center px-8 py-12 md:px-20 shadow-2xl overflow-y-auto">
        <div className="max-w-lg pb-20">
          {/* Logo & Welcome */}
          <div className="mb-12">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white text-xl font-bold flex items-center justify-center shadow-lg mb-4">
              F
            </div>
            <p className="text-sm text-slate-500">Let's personalise your experience</p>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 leading-tight mb-3">
            {step.title}
          </h2>
          <p className="text-slate-600 text-base leading-relaxed mb-8">
            {step.subtitle}
          </p>

          <div className="flex flex-col gap-3 relative z-10">
            {step.options.map((opt) => (
              <button
                key={opt}
                onClick={() => selectOption(opt)}
                className="group text-left w-full border-2 border-slate-200 bg-white rounded-xl px-5 py-4 text-base text-slate-800 hover:border-indigo-500 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 flex items-start gap-4 cursor-pointer relative z-10"
              >
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 mt-[2px] group-hover:border-indigo-500 group-hover:bg-indigo-50 transition-all flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-indigo-500 transition-all"></div>
                </div>
                <div className="flex-1 leading-relaxed font-medium">{opt}</div>
              </button>
            ))}
          </div>

          {/* progress bar */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-slate-600">
                Step {stepIndex + 1} of {steps.length}
              </div>
              <div className="text-xs text-slate-500">
                {Math.round(((stepIndex + 1) / steps.length) * 100)}% complete
              </div>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((stepIndex + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT PANE (preview) */}
      <section className="w-full md:w-1/2 flex items-center justify-center px-8 py-16 md:py-12 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6 relative z-0">
          {/* Preview Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Your Optimized Week</h3>
                <p className="text-xs text-slate-500">AI-planned for maximum productivity</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-3 flex flex-col justify-between h-24">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">MON</div>
                <div className="text-xs text-blue-900 font-semibold">Deep Work</div>
                <div className="text-[10px] text-blue-600">10am - 12pm</div>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 p-3 flex flex-col justify-between h-24">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">TUE</div>
                <div className="text-xs text-emerald-900 font-semibold">Focus Time 💡</div>
                <div className="text-[10px] text-emerald-600">2pm - 4pm</div>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-3 flex flex-col justify-between h-24">
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600">WED</div>
                <div className="text-xs text-purple-900 font-semibold">Email Draft</div>
                <div className="text-[10px] text-purple-600">Follow-ups</div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 p-5">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="text-lg">✨</span>
                Refraim AI helps you:
              </h4>
              <ul className="text-sm text-slate-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Automatically block focus time on your calendar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span>Draft professional follow-up emails instantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Get personalized mentoring to stay on track</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Trust indicator */}
          <div className="text-center text-sm text-slate-600">
            <p className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Your data is private and secure
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
