"use client";

import { useState } from "react";

export default function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [context, setContext] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);

  const generateEmail = async () => {
    if (!recipient || !context) {
      alert("Add recipient and context first.");
      return;
    }
    setLoading(true);
    setGenerated("");

    try {
      const res = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient, subject, context }),
      });
      const data = await res.json();
      setGenerated(data.email || "No email generated.");
    } catch (err: any) {
      setGenerated("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    // fake send for now
    const res = await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient,
        subject,
        emailBody: generated,
      }),
    });
    const data = await res.json();
    if (data.ok) {
      alert("Email sent / scheduled (demo).");
    } else {
      alert("Send failed.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900 flex justify-center">
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Email Automation
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          FlowAI writes your follow-ups and outreach emails for you. Just describe the situation.
        </p>

        <label className="block text-sm font-medium mb-1">Recipient</label>
        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="alex@company.com"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <label className="block text-sm font-medium mb-1">
          Subject (optional)
        </label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Quick follow up"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <label className="block text-sm font-medium mb-1">
          Context / what you want
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Met Alex yesterday. I want to thank them and propose a quick call next week about partnership."
          rows={5}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />

        <div className="flex gap-3 mb-6">
          <button
            onClick={generateEmail}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Email"}
          </button>

          <button
            onClick={sendEmail}
            disabled={!generated}
            className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 disabled:opacity-50"
          >
            Send / Schedule
          </button>
        </div>

        {generated && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-2 text-sm">
              Preview
            </h2>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {generated}
            </pre>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigator.clipboard.writeText(generated)}
                className="text-xs border border-gray-300 rounded px-3 py-2 hover:bg-gray-100"
              >
                Copy
              </button>
              <button
                onClick={() => setGenerated("")}
                className="text-xs border border-gray-300 rounded px-3 py-2 hover:bg-gray-100"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
