"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function OnboardingPage() {
  const router = useRouter();

  // Basic onboarding questions
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    goal: "",
    occupation: "",
    style: "",
  });

  const questions = [
    {
      title: "What brings you to FlowAI?",
      name: "goal",
      options: [
        "Boost my productivity",
        "Organise my tasks and goals",
        "Improve my focus and time management",
        "Plan my work or studies more effectively",
      ],
    },
    {
      title: "What best describes your current role?",
      name: "occupation",
      options: [
        "Student",
        "Professional",
        "Freelancer",
        "Entrepreneur",
        "Other",
      ],
    },
    {
      title: "How would you describe your work style?",
      name: "style",
      options: [
        "Structured and scheduled",
        "Flexible and creative",
        "Collaborative and team-focused",
        "Goal-oriented and independent",
      ],
    },
  ];

  const handleSelect = (field: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  // ✅ Detect plan type and redirect accordingly
  const handleFinish = () => {
    localStorage.setItem("onboardingAnswers", JSON.stringify(answers));
    const selectedPlan = localStorage.getItem("selectedPlan");

    // If free → go straight to app dashboard
    if (selectedPlan === "free") {
  router.push("/loading"); // ✅ redirect to loading page first
} else {
  router.push("/pricing");
}
  };

  const currentQuestion = questions[step];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 text-center">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
        className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl w-full max-w-lg p-8"
      >
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          {currentQuestion.title}
        </h1>

        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(currentQuestion.name, opt)}
              className={`border px-4 py-3 rounded-lg text-sm transition ${
                answers[currentQuestion.name as keyof typeof answers] === opt
                  ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white border-transparent"
                  : "border-slate-300 text-slate-700 hover:bg-blue-50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.name as keyof typeof answers]}
            className={`px-6 py-3 rounded-lg text-white font-semibold text-sm shadow-md transition ${
              answers[currentQuestion.name as keyof typeof answers]
                ? "bg-gradient-to-r from-blue-600 to-indigo-500 hover:scale-[1.03]"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            {step < questions.length - 1 ? "Next →" : "Finish"}
          </button>
        </div>
      </motion.div>

      <p className="text-slate-500 text-[12px] mt-6">
        Step {step + 1} of {questions.length}
      </p>
    </main>
  );
}
