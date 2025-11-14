import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | FlowAI",
  description: "Privacy Policy for FlowAI productivity platform",
};

export default function PrivacyPolicy() {
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
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
          </div>
          <p className="text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 mb-6">
              At FlowAI, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Account Information</h3>
            <p className="text-slate-700 mb-4">
              When you create an account, we collect your email address, name, and authentication credentials (when using OAuth providers like Google, Microsoft, or Apple).
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Usage Data</h3>
            <p className="text-slate-700 mb-4">
              We collect information about how you use the Service, including:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Tasks and calendar events you create</li>
              <li>AI conversations and queries</li>
              <li>Email content processed through our AI features</li>
              <li>Usage statistics and feature interactions</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Third-Party Integrations</h3>
            <p className="text-slate-700 mb-4">
              When you connect third-party services (Gmail, Google Calendar, etc.), we access only the data necessary to provide our services. We store OAuth tokens securely and refresh them as needed.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-slate-700 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Provide and improve the Service</li>
              <li>Process AI requests and generate responses</li>
              <li>Synchronise your calendar and email</li>
              <li>Send you service-related notifications</li>
              <li>Analyse usage patterns to improve features</li>
              <li>Process payments and manage subscriptions</li>
              <li>Provide customer support</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. AI and Data Processing</h2>
            <p className="text-slate-700 mb-4">
              We use OpenAI's API to power our AI features. When you use AI-assisted features:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Your queries are sent to OpenAI for processing</li>
              <li>OpenAI does not use your data to train their models</li>
              <li>All API calls are encrypted in transit</li>
              <li>We do not store AI-generated content longer than necessary</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Data Security</h2>
            <p className="text-slate-700 mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>All data is encrypted in transit using HTTPS/TLS</li>
              <li>Database credentials are encrypted at rest using AES-256</li>
              <li>OAuth tokens are stored securely and refreshed automatically</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication requirements</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-slate-700 mb-4">
              We do not sell your personal information. We may share your data only in these circumstances:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li><strong>Service Providers:</strong> With third-party services (OpenAI, Stripe, Google) necessary to provide our features</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Your Rights and Choices</h2>
            <p className="text-slate-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
              <li>Disconnect third-party integrations</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Data Retention</h2>
            <p className="text-slate-700 mb-4">
              We retain your data for as long as your account is active or as needed to provide services. When you delete your account, we delete your personal data within 30 days, except where required by law to retain it longer.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Cookies and Tracking</h2>
            <p className="text-slate-700 mb-4">
              We use essential cookies for authentication and session management. We use analytics to understand how users interact with the Service to improve features.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">9. International Data Transfers</h2>
            <p className="text-slate-700 mb-4">
              Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">10. Children's Privacy</h2>
            <p className="text-slate-700 mb-4">
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">11. Changes to This Policy</h2>
            <p className="text-slate-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through the Service. Your continued use after such changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">12. Contact Us</h2>
            <p className="text-slate-700 mb-4">
              If you have questions about this Privacy Policy or your data, please contact us through the support channels in the Service or via the settings page.
            </p>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                This Privacy Policy is effective as of the last updated date shown above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
