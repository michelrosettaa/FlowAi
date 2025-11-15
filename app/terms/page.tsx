import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Refraim AI",
  description: "Terms of Service for Refraim AI productivity platform",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-700 mb-4">
              By accessing and using Refraim AI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-slate-700 mb-4">
              Refraim AI provides an AI-powered productivity platform that includes email management, calendar integration, task planning, and AI assistance features. The Service is provided "as is" and we reserve the right to modify, suspend, or discontinue any part of the Service at any time.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. User Accounts</h2>
            <p className="text-slate-700 mb-4">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
            </p>
            <p className="text-slate-700 mb-4">
              You must provide accurate and complete information when creating your account and keep this information updated.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Subscription and Payment</h2>
            <p className="text-slate-700 mb-4">
              Some features of the Service require a paid subscription. By purchasing a subscription, you agree to pay all applicable fees. Subscriptions automatically renew unless cancelled before the renewal date.
            </p>
            <p className="text-slate-700 mb-4">
              Refunds are handled on a case-by-case basis. Please contact our support team if you have concerns about billing.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Acceptable Use</h2>
            <p className="text-slate-700 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Attempt to gain unauthorized access to the Service or its related systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Transmit any viruses, malware, or other malicious code</li>
              <li>Violate the intellectual property rights of others</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Data and Privacy</h2>
            <p className="text-slate-700 mb-4">
              Your use of the Service is also governed by our Privacy Policy. We collect and use your data as described in the Privacy Policy. You retain all rights to your data, and you may export or delete your data at any time.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Intellectual Property</h2>
            <p className="text-slate-700 mb-4">
              The Service and its original content, features, and functionality are owned by Refraim AI and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Third-Party Services</h2>
            <p className="text-slate-700 mb-4">
              The Service integrates with third-party services such as Google Calendar and Gmail. Your use of these integrations is subject to the respective third-party terms and policies.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-slate-700 mb-4">
              Refraim AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">10. Changes to Terms</h2>
            <p className="text-slate-700 mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">11. Termination</h2>
            <p className="text-slate-700 mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">12. Contact</h2>
            <p className="text-slate-700 mb-4">
              If you have any questions about these Terms, please contact us through the support channels provided in the Service.
            </p>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                These Terms of Service are effective as of the last updated date shown above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
