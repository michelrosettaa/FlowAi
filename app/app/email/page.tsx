"use client";

import React, { useState } from "react";
import { Mail, Sparkles, Loader2, Send } from "lucide-react";

export default function EmailAssistantPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [context, setContext] = useState("");
  const [draftedEmail, setDraftedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState("");

  const handleGenerateDraft = async () => {
    if (!recipient.trim() || !context.trim()) {
      alert("Please enter a recipient and what you want to say");
      return;
    }
    
    setLoading(true);
    setSendStatus("");
    
    try {
      const response = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient, subject, context }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate email");
      }
      
      const data = await response.json();
      setDraftedEmail(data.email || "No email generated.");
    } catch (err: any) {
      console.error("Error generating email:", err);
      alert("Failed to generate email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipient.trim() || !draftedEmail.trim()) {
      alert("Please generate an email first");
      return;
    }
    
    setSending(true);
    setSendStatus("");
    
    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          recipient, 
          subject: subject || "Message from FlowAI",
          emailBody: draftedEmail 
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to send email");
      }
      
      setSendStatus("✅ Email sent successfully via Gmail!");
      setRecipient("");
      setSubject("");
      setContext("");
      setDraftedEmail("");
    } catch (err: any) {
      console.error("Error sending email:", err);
      setSendStatus("❌ Failed to send email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-12">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--app-text)' }}>
            Email Assistant
          </h1>
          <p className="text-base" style={{ color: 'var(--app-text-dim)' }}>
            AI drafts professional emails and sends them via your Gmail account.
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 mb-6">
          <input
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient email address"
            className="w-full premium-card p-4 text-sm outline-none focus:ring-2"
            style={{ 
              color: 'var(--app-text)',
              background: 'var(--app-surface)',
              borderColor: 'var(--app-border)'
            }}
          />
          
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject (optional - AI will suggest one)"
            className="w-full premium-card p-4 text-sm outline-none focus:ring-2"
            style={{ 
              color: 'var(--app-text)',
              background: 'var(--app-surface)',
              borderColor: 'var(--app-border)'
            }}
          />
          
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="What do you want to say? (e.g., 'Follow up on our meeting, ask about timeline, suggest next steps')"
            rows={6}
            className="w-full premium-card p-4 text-sm resize-none outline-none focus:ring-2"
            style={{ 
              color: 'var(--app-text)',
              background: 'var(--app-surface)',
              borderColor: 'var(--app-border)'
            }}
          />
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleGenerateDraft}
            disabled={loading}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
            style={{
              background: loading ? 'var(--app-surface-hover)' : 'linear-gradient(to right, var(--app-accent), var(--app-accent-hover))',
              color: 'white'
            }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate Email with AI"}
          </button>
        </div>

        {/* Drafted Email */}
        {draftedEmail && (
          <div className="space-y-4">
            <div className="premium-card p-6 text-sm leading-relaxed whitespace-pre-wrap"
              style={{ 
                background: 'var(--app-surface-hover)',
                color: 'var(--app-text)'
              }}
            >
              {draftedEmail}
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSendEmail}
                disabled={sending}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all ${
                  sending ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
                style={{
                  background: sending ? 'var(--app-surface-hover)' : 'linear-gradient(to right, var(--app-accent), var(--app-accent-hover))',
                  color: 'white'
                }}
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sending ? "Sending..." : "Send via Gmail"}
              </button>
              
              <button
                onClick={() => setDraftedEmail("")}
                disabled={sending}
                className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{
                  background: 'var(--app-surface)',
                  color: 'var(--app-text-dim)',
                  border: '1px solid var(--app-border)'
                }}
              >
                Clear
              </button>
            </div>
          </div>
        )}
        
        {/* Send Status */}
        {sendStatus && (
          <div className={`mt-6 p-4 rounded-xl text-center text-sm font-medium ${
            sendStatus.includes('✅') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {sendStatus}
          </div>
        )}
      </div>
    </div>
  );
}
