"use client";

import { useState } from "react";
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Calendar, 
  BrainCircuit, 
  LineChart,
  Users,
  PhoneCall,
  Keyboard,
  ExternalLink
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    question: "How do I get started with Refraim AI?",
    answer: "After signing in, head to the Dashboard to see your productivity overview. Use Ask Refraim to get AI-powered planning help, or go to Refraim Planner to manage your tasks. Connect your Google account to sync your calendar and email for the full experience.",
    icon: <BrainCircuit className="w-5 h-5 text-blue-400" />
  },
  {
    question: "How does Refraim Mail work?",
    answer: "Refraim Mail connects to your Gmail account via secure OAuth. Once connected, you can view your inbox, get AI-generated summaries of emails, and compose professional replies with AI assistance. All email content stays private and is never stored.",
    icon: <Mail className="w-5 h-5 text-green-400" />
  },
  {
    question: "Can I sync my calendar with Refraim?",
    answer: "Yes! Click on Calendar in the sidebar and connect your Google Calendar. Refraim will sync your events and can help you plan your day around existing commitments. You can also create events directly from the calendar view.",
    icon: <Calendar className="w-5 h-5 text-purple-400" />
  },
  {
    question: "What is the Refraim Motivator?",
    answer: "The Refraim Motivator is your AI productivity coach. It provides personalised encouragement, tracks your streaks, and helps you stay focused on your goals. Access it from the sidebar to get daily motivation and productivity tips.",
    icon: <Users className="w-5 h-5 text-orange-400" />
  },
  {
    question: "How does Refraim Analytics track my productivity?",
    answer: "Refraim Analytics calculates metrics from your actual activity - completed tasks, calendar events, and daily engagement. Your productivity score combines task completion rate (60%) and calendar utilisation (40%). All data comes from your real usage, not estimates.",
    icon: <LineChart className="w-5 h-5 text-indigo-400" />
  },
  {
    question: "What is the Refraim Summariser?",
    answer: "The Refraim Summariser helps you process meeting notes and long documents quickly. Paste in your content and get concise, actionable summaries. Great for catching up on meetings you missed or distilling key points from lengthy emails.",
    icon: <PhoneCall className="w-5 h-5 text-pink-400" />
  },
  {
    question: "What keyboard shortcuts are available?",
    answer: "Press Cmd/Ctrl + K anywhere in the app to open the command palette. This gives you quick access to navigation, actions, and settings without using the mouse. You can also press Escape to close any modal or panel.",
    icon: <Keyboard className="w-5 h-5 text-cyan-400" />
  },
  {
    question: "How secure is my data?",
    answer: "Your data security is our priority. We use OAuth for Google services (never storing your passwords), encrypt sensitive data, and never share your information with third parties. Your email content and calendar events are processed in real-time and not stored on our servers.",
    icon: <HelpCircle className="w-5 h-5 text-yellow-400" />
  }
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <HelpCircle className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--app-text)' }}>
          Help Centre
        </h1>
        <p className="text-base" style={{ color: 'var(--app-text-dim)' }}>
          Find answers to common questions about Refraim AI.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4 mb-12">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="premium-card overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--app-surface-elevated)' }}>
                  {faq.icon}
                </div>
                <span className="font-medium" style={{ color: 'var(--app-text)' }}>
                  {faq.question}
                </span>
              </div>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5" style={{ color: 'var(--app-text-dim)' }} />
              ) : (
                <ChevronDown className="w-5 h-5" style={{ color: 'var(--app-text-dim)' }} />
              )}
            </button>
            {openIndex === index && (
              <div 
                className="px-6 pb-5 text-sm leading-relaxed"
                style={{ color: 'var(--app-text-dim)', marginLeft: '3.5rem' }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="premium-card p-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--app-text)' }}>
          Quick Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/app"
            className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: 'var(--app-surface-elevated)' }}
          >
            <BrainCircuit className="w-5 h-5" style={{ color: 'var(--app-accent)' }} />
            <span style={{ color: 'var(--app-text)' }}>Dashboard</span>
          </a>
          <a
            href="/app/profile"
            className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: 'var(--app-surface-elevated)' }}
          >
            <Users className="w-5 h-5" style={{ color: 'var(--app-accent)' }} />
            <span style={{ color: 'var(--app-text)' }}>Profile Settings</span>
          </a>
          <a
            href="/app/settings/email"
            className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: 'var(--app-surface-elevated)' }}
          >
            <Mail className="w-5 h-5" style={{ color: 'var(--app-accent)' }} />
            <span style={{ color: 'var(--app-text)' }}>Email Settings</span>
          </a>
          <a
            href="/pricing"
            className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: 'var(--app-surface-elevated)' }}
          >
            <ExternalLink className="w-5 h-5" style={{ color: 'var(--app-accent)' }} />
            <span style={{ color: 'var(--app-text)' }}>View Plans</span>
          </a>
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-8 text-center">
        <p className="text-sm" style={{ color: 'var(--app-text-dim)' }}>
          Still need help? Contact us at{" "}
          <a 
            href="mailto:support@refraimai.com" 
            className="font-medium hover:underline"
            style={{ color: 'var(--app-accent)' }}
          >
            support@refraimai.com
          </a>
        </p>
      </div>
    </div>
  );
}
