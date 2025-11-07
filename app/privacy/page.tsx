"use client";

export default function PrivacyPage() {
  const COMPANY = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "FlowAI";
  const CONTACT = process.env.NEXT_PUBLIC_PRIVACY_CONTACT ?? "privacy@example.com";
  const COUNTRY = process.env.NEXT_PUBLIC_COMPANY_COUNTRY ?? "United Kingdom";

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="mb-4">
          This Privacy Policy explains how {COMPANY} (“we”, “us”) collects and processes
          personal data when you use FlowAI. We’re based in the {COUNTRY} and act as the
          data controller for this application.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">What we collect</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Account data (email, name you provide)</li>
          <li>Subscription/billing data (via Stripe)</li>
          <li>Planner data you enter (tasks, meetings, preferences)</li>
          <li>System events and logs for security and reliability</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">Why we collect it (lawful basis)</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Provide the app and features you request (contract)</li>
          <li>Billing and fraud prevention (legitimate interests/contract)</li>
          <li>Email updates you opt into (consent)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">Where data is stored</h2>
        <p>
          Core app data is stored in Firebase/Firestore (EU region). Payments are handled by
          Stripe (we never store full card details). We maintain access logs and audit trails.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Your rights</h2>
        <p className="mb-4">
          You can request access, correction, deletion, or export of your personal data.
          Contact: <a className="text-blue-600 underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
        <p>
          For privacy requests or questions, email{" "}
          <a className="text-blue-600 underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>
      </section>
    </main>
  );
}
