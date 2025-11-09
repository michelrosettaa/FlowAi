"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Answers = {
  reasons: string[];
  occupation: string | null;
  style: string[];
};

const REASONS = [
  "Plan my day automatically",
  "Stay focused / fewer distractions",
  "Email drafting & follow-ups",
  "Calendar & meetings superpowers",
  "Accountability / motivation",
  "Analytics on my work habits",
];

const OCCUPATIONS = [
  "Student",
  "Professional",
  "Freelancer",
  "Founder",
  "Manager / Team lead",
  "Other",
];

const WORK_STYLES = [
  "Deep-work blocks",
  "Short tasks & context switching",
  "Meetings heavy",
  "Evenings & weekends",
  "Strict 9–5",
  "Flexible / variable",
];

export default function OnboardingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const preselectedPlan = params.get("plan"); // "pro" | "team" | "student" | null

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({
    reasons: [],
    occupation: null,
    style: [],
  });

  // Load any stored onboarding in case user navigates back
  useEffect(() => {
    try {
      const raw = localStorage.getItem("flowai_onboarding");
      if (raw) {
        const parsed = JSON.parse(raw) as Answers;
        setAnswers(parsed);
      }
    } catch {}
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem("flowai_onboarding", JSON.stringify(answers));
  }, [answers]);

  const stepsTotal = 3;
  const progress = useMemo(() => (step / stepsTotal) * 100, [step]);

  function toggleMulti(key: "reasons" | "style", value: string) {
    setAnswers((prev) => {
      const set = new Set(prev[key]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...prev, [key]: Array.from(set) };
    });
  }

  function selectOccupation(value: string) {
    setAnswers((prev) => ({ ...prev, occupation: value }));
  }

  function canContinue() {
    if (step === 1) return answers.reasons.length > 0;
    if (step === 2) return !!answers.occupation;
    if (step === 3) return answers.style.length > 0;
    return false;
  }

  function next() {
    if (step < stepsTotal) setStep((s) => s + 1);
    else finish();
  }

  function back() {
    if (step > 1) setStep((s) => s - 1);
  }

  function skipAll() {
    // store minimal object and continue
    localStorage.setItem(
      "flowai_onboarding",
      JSON.stringify({
        reasons: answers.reasons,
        occupation: answers.occupation,
        style: answers.style,
      })
    );
    finish(true);
  }

  function finish(skipped = false) {
    // Decide where to go:
    // If a plan is preselected (e.g., from pricing or CTA), go straight to checkout.
    // Otherwise, send to /pricing.
    if (preselectedPlan === "pro" || preselectedPlan === "team" || preselectedPlan === "student") {
      router.push(`/checkout?plan=${preselectedPlan}`);
    } else {
      router.push("/pricing");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">
      {/* Top nav */}
      <nav className="w-full max-w-5xl mt-6 mb-4 flex items-center justify-between">
        <div
          onClick={() => router.push("/")}
          className="cursor-pointer inline-flex items-center gap-2 text-slate-900 font-semibold"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-white text-sm">
            F
          </span>
          FlowAI
        </div>
        <button
          onClick={() => router.push("/pricing")}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          Skip to pricing →
        </button>
      </nav>

      {/* Card */}
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-6 md:p-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-[12px] text-slate-500">
            Step {step} of {stepsTotal}
          </div>
        </div>

        {/* Step content */}
        {step === 1 && (
          <section>
            <h1 className="text-2xl font-bold text-slate-900">What brings you to FlowAI?</h1>
            <p className="text-slate-600 text-sm mt-2">
              Choose all that apply — we’ll tailor your setup.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {REASONS.map((r) => {
                const active = answers.reasons.includes(r);
                return (
                  <button
                    key={r}
                    onClick={() => toggleMulti("reasons", r)}
                    className={`px-3 py-2 rounded-lg text-sm border transition ${
                      active
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h1 className="text-2xl font-bold text-slate-900">What is your current occupation?</h1>
            <p className="text-slate-600 text-sm mt-2">Pick one.</p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OCCUPATIONS.map((o) => {
                const active = answers.occupation === o;
                return (
                  <button
                    key={o}
                    onClick={() => selectOccupation(o)}
                    className={`w-full px-4 py-3 rounded-xl text-sm border text-left transition ${
                      active
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h1 className="text-2xl font-bold text-slate-900">Describe your work style</h1>
            <p className="text-slate-600 text-sm mt-2">Choose all that fit you.</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {WORK_STYLES.map((s) => {
                const active = answers.style.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleMulti("style", s)}
                    className={`px-3 py-2 rounded-lg text-sm border transition ${
                      active
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 1}
            className={`text-sm px-3 py-2 rounded-lg border transition ${
              step === 1
                ? "text-slate-400 border-slate-200 cursor-not-allowed"
                : "text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            ← Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={skipAll}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Skip for now
            </button>
            <button
              onClick={next}
              disabled={!canContinue()}
              className={`px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-md transition ${
                canContinue()
                  ? "bg-gradient-to-r from-blue-600 to-indigo-500 hover:scale-[1.02]"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              {step < stepsTotal ? "Next →" : "Finish"}
            </button>
          </div>
        </div>
      </div>

      <footer className="text-[11px] text-slate-500 mt-6 mb-10">
        © {new Date().getFullYear()} FlowAI — Focus, clarity, momentum.
      </footer>
    </main>
  );
}
