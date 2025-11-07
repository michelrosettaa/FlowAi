"use client";

export default function TermsPage() {
  const COMPANY = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "FlowAI";

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <p className="mb-4">
          These Terms govern your use of {COMPANY}. By using the service, you agree to these Terms.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Use of the Service</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>You are responsible for your account and the content you add.</li>
          <li>You will not misuse the service or attempt to disrupt it.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">Subscriptions & Billing</h2>
        <p>
          Paid plans are managed through Stripe. Trials may require payment method capture.
          You can cancel at any time from your account.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Data & Privacy</h2>
        <p>
          See our <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a> for details on how
          we process personal data.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
        <p>
          Questions? Email us at{" "}
          <a className="text-blue-600 underline" href="mailto:privacy@flowai.app">
            privacy@flowai.app
          </a>.
        </p>
      </section>
    </main>
  );
}
