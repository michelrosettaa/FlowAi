"use client";

import React, { useState, useEffect } from "react";
import { Mail, Sparkles, Loader2, Send, Inbox } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { EmailInboxView } from "@/app/components/EmailInboxView";
import { EmailDetailModal } from "@/app/components/EmailDetailModal";

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  body: string;
}

export default function EmailAssistantPage() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"inbox" | "compose">("inbox");
  
  const [emails, setEmails] = useState<Email[]>([]);
  const [loadingInbox, setLoadingInbox] = useState(false);
  const [inboxError, setInboxError] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [aiReply, setAiReply] = useState("");
  const [generatingReply, setGeneratingReply] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [context, setContext] = useState("");
  const [draftedEmail, setDraftedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState("");

  const [hasEmailAccount, setHasEmailAccount] = useState<boolean | null>(null);
  const [isGmailConnected, setIsGmailConnected] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkEmailAccount();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "inbox" && hasEmailAccount) {
      fetchInbox();
    }
  }, [isAuthenticated, activeTab, hasEmailAccount]);

  const checkEmailAccount = async () => {
    try {
      const response = await fetch("/api/email/accounts");
      if (response.ok) {
        const data = await response.json();
        const gmailConnected = data.isGmailConnected || false;
        const hasAccounts = data.accounts && data.accounts.length > 0;
        setIsGmailConnected(gmailConnected);
        setHasEmailAccount(gmailConnected || hasAccounts);
      }
    } catch (err) {
      console.error("Failed to check email accounts:", err);
      setHasEmailAccount(false);
      setIsGmailConnected(false);
    }
  };

  const fetchInbox = async () => {
    setLoadingInbox(true);
    setInboxError("");
    try {
      const response = await fetch("/api/email/inbox");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch inbox" }));
        throw new Error(errorData.error || "Failed to fetch inbox");
      }
      
      const data = await response.json();
      setEmails(data.emails || []);
    } catch (err: any) {
      console.error("Error fetching inbox:", err);
      setInboxError(err.message || "Unable to load your inbox. Please try again.");
    } finally {
      setLoadingInbox(false);
    }
  };

  const handleGenerateReply = async (email: Email) => {
    setGeneratingReply(true);
    setAiReply("");
    setReplyError("");
    
    try {
      const response = await fetch("/api/email/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalFrom: email.from,
          originalSubject: email.subject,
          originalBody: email.body || email.snippet,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to generate reply" }));
        throw new Error(errorData.error || "Failed to generate reply");
      }
      
      const data = await response.json();
      setAiReply(data.reply || "");
    } catch (err: any) {
      console.error("Error generating reply:", err);
      setReplyError(err.message || "Unable to generate AI reply. Please try again.");
    } finally {
      setGeneratingReply(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedEmail || !aiReply) return;
    
    setSendingReply(true);
    setSendStatus("");
    try {
      const emailMatch = selectedEmail.from.match(/<(.+)>/);
      const fromEmail = emailMatch ? emailMatch[1] : selectedEmail.from;
      
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: fromEmail,
          subject: selectedEmail.subject.startsWith("Re:") 
            ? selectedEmail.subject 
            : `Re: ${selectedEmail.subject}`,
          emailBody: aiReply,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to send reply" }));
        throw new Error(errorData.error || "Failed to send reply");
      }
      
      setSendStatus("✅ Reply sent successfully!");
      setTimeout(() => {
        setSelectedEmail(null);
        setAiReply("");
        setSendStatus("");
      }, 2000);
    } catch (err: any) {
      console.error("Error sending reply:", err);
      setSendStatus(`❌ ${err.message || "Failed to send reply. Please try again."}`);
    } finally {
      setSendingReply(false);
    }
  };

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
      
      if (!response.ok) throw new Error("Failed to generate email");
      
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
          subject: subject || "Message from Refraim AI",
          emailBody: draftedEmail 
        }),
      });
      
      if (!response.ok) throw new Error("Failed to send email");
      
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

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'var(--app-accent)' }}
          >
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--app-text)' }}>
            Email Helper
          </h2>
          <p className="mb-6" style={{ color: 'var(--app-text-muted)' }}>
            Sign in to access your inbox and get AI-powered email assistance
          </p>
          <a
            href="/login?callbackUrl=/app/email"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'var(--app-accent)' }}
          >
            Sign In to Continue
          </a>
        </div>
      </div>
    );
  }

  if (hasEmailAccount === false) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'var(--app-accent)' }}
          >
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--app-text)' }}>
            Connect Your Email
          </h2>
          <p className="mb-6" style={{ color: 'var(--app-text-muted)' }}>
            Connect your Gmail account via OAuth or add any email provider (Outlook, Yahoo, iCloud, ProtonMail, etc.) to start using AI-powered email features.
          </p>
          <a
            href="/app/settings/email"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'var(--app-accent)' }}
          >
            Connect Email Account
          </a>
        </div>
      </div>
    );
  }

  if (hasEmailAccount === null) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--app-accent)' }} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="p-2.5 rounded-xl shadow-lg flex items-center justify-center"
            style={{ background: 'var(--app-accent)' }}
          >
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--app-text)' }}>
              Email Helper
            </h1>
            <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
              AI-powered email management and drafting
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "inbox" ? "text-white" : ""
            }`}
            style={activeTab === "inbox" 
              ? { background: 'var(--app-accent)' }
              : { background: 'var(--app-surface)', color: 'var(--app-text-muted)' }
            }
          >
            <Inbox className="w-4 h-4 inline mr-2" />
            Inbox
          </button>
          <button
            onClick={() => setActiveTab("compose")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "compose" ? "text-white" : ""
            }`}
            style={activeTab === "compose" 
              ? { background: 'var(--app-accent)' }
              : { background: 'var(--app-surface)', color: 'var(--app-text-muted)' }
            }
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Compose
          </button>
        </div>
      </header>

      {activeTab === "inbox" && (
        <div>
          <EmailInboxView
            emails={emails}
            loadingInbox={loadingInbox}
            inboxError={inboxError}
            onRefresh={fetchInbox}
            onSelectEmail={setSelectedEmail}
          />

          {selectedEmail && (
            <EmailDetailModal
              email={selectedEmail}
              aiReply={aiReply}
              generatingReply={generatingReply}
              replyError={replyError}
              sendingReply={sendingReply}
              sendStatus={sendStatus}
              onClose={() => {
                setSelectedEmail(null);
                setAiReply("");
                setSendStatus("");
              }}
              onGenerateReply={handleGenerateReply}
              onAiReplyChange={setAiReply}
              onSendReply={handleSendReply}
            />
          )}
        </div>
      )}

      {activeTab === "compose" && (
        <div className="max-w-3xl">
          <div className="space-y-4 mb-6">
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient email address"
              className="w-full p-4 rounded-xl text-sm outline-none"
              style={{ 
                color: 'var(--app-text)',
                background: 'var(--app-surface)',
                border: '1px solid var(--app-border)'
              }}
            />
            
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject (optional - AI will suggest one)"
              className="w-full p-4 rounded-xl text-sm outline-none"
              style={{ 
                color: 'var(--app-text)',
                background: 'var(--app-surface)',
                border: '1px solid var(--app-border)'
              }}
            />
            
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="What do you want to say? (e.g., 'Follow up on our meeting, ask about timeline, suggest next steps')"
              rows={4}
              className="w-full p-4 rounded-xl text-sm outline-none resize-none"
              style={{ 
                color: 'var(--app-text)',
                background: 'var(--app-surface)',
                border: '1px solid var(--app-border)'
              }}
            />
          </div>

          <button
            onClick={handleGenerateDraft}
            disabled={loading || !recipient.trim() || !context.trim()}
            className={`w-full flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white mb-6 transition-all ${
              loading ? "opacity-50" : "hover:scale-[1.02]"
            }`}
            style={{ background: 'var(--app-accent)' }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Refraim AI is drafting your email...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Email with AI
              </>
            )}
          </button>

          {draftedEmail && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--app-text)' }}>
                  AI-Generated Email (editable):
                </label>
                <textarea
                  value={draftedEmail}
                  onChange={(e) => setDraftedEmail(e.target.value)}
                  rows={12}
                  className="w-full p-4 rounded-xl text-sm outline-none resize-none"
                  style={{ 
                    color: 'var(--app-text)',
                    background: 'var(--app-surface)',
                    border: '1px solid var(--app-border)'
                  }}
                />
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleSendEmail}
                  disabled={sending}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white shadow-lg transition-all ${
                    sending ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                  }`}
                  style={{ background: 'var(--app-accent)' }}
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sending ? "Sending..." : isGmailConnected ? "Send via Gmail" : "Send Email"}
                </button>
                
                <button
                  onClick={() => setDraftedEmail("")}
                  disabled={sending}
                  className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: 'var(--app-surface)',
                    color: 'var(--app-text-muted)',
                    border: '1px solid var(--app-border)'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
          
          {sendStatus && (
            <div className={`mt-6 p-4 rounded-xl text-center text-sm font-medium ${
              sendStatus.includes('✅') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {sendStatus}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
