"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  {
    title: "What brings you to FlowAI?",
    subtitle: "We'll customise your planning experience.",
    options: [
      "I'm overwhelmed / need structure",
      "I want to protect deep work time",
      "I need help with follow-ups & emails",
    ],
    key: "reason",
  },
  {
    title: "What best describes your role?",
    subtitle: "This helps us shape scheduling + communication tone.",
    options: [
      "Founder / Exec",
      "Operator / PM / Marketing / Biz",
      "Freelancer / Solo Builder",
      "Student / Personal Use",
    ],
    key: "role",
  },
  {
    title: "How do you mostly work?",
    subtitle:
      "We'll nudge you in a way that matches your flow.",
    options: [
      "Lots of meetings",
      "Mostly deep work",
      "Chaos / reactive / always context switching",
    ],
    key: "style",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const step = steps[stepIndex];

  const selectOption = (opt: string) => {
    // store answer
    setAnswers((prev) => ({ ...prev, [step.key]: opt }));

    // if last step -> /loading
    if (stepIndex === steps.length - 1) {
      // save mock prefs
      localStorage.setItem("flowai_onboarding", JSON.stringify({ ...answers, [step.key]: opt }));
      router.push("/loading");
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[#EEF0FF]">
      {/* LEFT PANE (question) */}
      <section className="w-full md:w-1/2 bg-white flex flex-col justify-center px-8 py-12 md:px-16">
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold text-slate-900">
            {step.title}
          </h2>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            {step.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {step.options.map((opt) => (
              <button
                key={opt}
                onClick={() => selectOption(opt)}
                className="text-left w-full border border-slate-300 bg-white rounded-xl px-4 py-4 text-sm text-slate-800 hover:border-indigo-500 hover:shadow-md hover:bg-indigo-50 transition flex items-start gap-3"
              >
                <div className="w-4 h-4 rounded-full border border-slate-400 mt-[2px]"></div>
                <div className="flex-1 leading-relaxed">{opt}</div>
              </button>
            ))}
          </div>

          {/* progress bar */}
          <div className="mt-10">
            <div className="w-full h-[3px] bg-slate-200 rounded">
              <div
                className="h-[3px] bg-indigo-500 rounded transition-all"
                style={{
                  width: `${((stepIndex + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Step {stepIndex + 1} of {steps.length}
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT PANE (preview calendar mock) */}
      <section className="w-full md:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 text-slate-800 text-sm">
          <div className="font-semibold text-slate-900 mb-4">
            Your Focus Week
          </div>
          <div className="grid grid-cols-3 gap-4 text-[11px] text-slate-600">
            <div className="rounded-md bg-slate-100 h-20 border border-slate-200 p-2 flex flex-col justify-between">
              <div className="text-[10px] uppercase tracking-wide text-slate-400">
                MON
              </div>
              <div className="text-[11px] text-indigo-600 font-medium">
                Deep Work
              </div>
              <div className="text-[10px] text-slate-500">10-12</div>
            </div>
            <div className="rounded-md bg-[#C7F0D2] h-20 border border-emerald-300 p-2 flex flex-col justify-between">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">
                TUE
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                Focus Time 💡
              </div>
              <div className="text-[10px] text-emerald-600">2-4</div>
            </div>
            <div className="rounded-md bg-slate-100 h-20 border border-slate-200 p-2 flex flex-col justify-between">
              <div className="text-[10px] uppercase tracking-wide text-slate-400">
                WED
              </div>
              <div className="text-[11px] text-indigo-600 font-medium">
                Pitch follow-up
              </div>
              <div className="text-[10px] text-slate-500">send email</div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white mt-6 p-4 text-[11px] leading-relaxed">
            <div className="text-slate-900 font-semibold mb-1">
              FlowAI will:
            </div>
            <ul className="text-slate-600 list-disc pl-4 space-y-1">
              <li>Block deep work on your calendar</li>
              <li>Draft follow-up emails for you</li>
              <li>Send tiny mentor nudges to keep you on track</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
