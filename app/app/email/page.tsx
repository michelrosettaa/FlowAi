"use client";

import React, { useState, useEffect } from "react";
import { Mail, Sparkles, Loader2, Send, Inbox, RefreshCw, ArrowLeft, X } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  body: string;
}

export default function RefraimMailPage() {
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

  const extractSenderName = (from: string) => {
    const match = from.match(/^([^<]+)/);
    if (match) {
      return match[1].trim().replace(/"/g, '');
    }
    return from.split('@')[0];
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
            Refraim Mail
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
            Connect your Gmail account via OAuth or add any email provider to start using Refraim Mail.
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
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="px-6 py-4 border-b" style={{ borderColor: 'var(--app-border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-xl shadow-lg flex items-center justify-center"
              style={{ background: 'var(--app-accent)' }}
            >
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--app-text)' }}>
                Refraim Mail
              </h1>
              <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                AI-powered email management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab("inbox"); setSelectedEmail(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "inbox" ? "text-white" : ""
              }`}
              style={activeTab === "inbox" 
                ? { background: 'var(--app-accent)' }
                : { background: 'var(--app-surface)', color: 'var(--app-text-muted)' }
              }
            >
              <Inbox className="w-4 h-4" />
              Inbox
            </button>
            <button
              onClick={() => { setActiveTab("compose"); setSelectedEmail(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "compose" ? "text-white" : ""
              }`}
              style={activeTab === "compose" 
                ? { background: 'var(--app-accent)' }
                : { background: 'var(--app-surface)', color: 'var(--app-text-muted)' }
              }
            >
              <Sparkles className="w-4 h-4" />
              Compose
            </button>
          </div>
        </div>
      </header>

      {activeTab === "inbox" && (
        <div className="flex-1 flex overflow-hidden">
          <div 
            className={`${selectedEmail ? 'w-[380px]' : 'flex-1'} border-r flex flex-col overflow-hidden transition-all`}
            style={{ borderColor: 'var(--app-border)' }}
          >
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--app-border)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>
                {emails.length} emails
              </span>
              <button
                onClick={fetchInbox}
                disabled={loadingInbox}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{ background: 'var(--app-surface)', color: 'var(--app-text-muted)' }}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingInbox ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {inboxError && (
                <div className="m-4 p-4 rounded-xl border-l-4 bg-red-500/10" style={{ borderLeftColor: '#ef4444' }}>
                  <div className="font-semibold text-sm text-red-300 mb-1">Error Loading Inbox</div>
                  <div className="text-sm text-red-200">{inboxError}</div>
                  <button
                    onClick={fetchInbox}
                    className="mt-3 px-4 py-2 rounded-lg text-sm text-white transition-all"
                    style={{ background: 'var(--app-accent)' }}
                  >
                    Retry
                  </button>
                </div>
              )}

              {loadingInbox ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--app-accent)' }} />
                </div>
              ) : emails.length === 0 && !inboxError ? (
                <div className="text-center py-12 px-4">
                  <p style={{ color: 'var(--app-text-muted)' }}>No emails found</p>
                </div>
              ) : !inboxError ? (
                <div>
                  {emails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className={`px-4 py-3 cursor-pointer transition-all border-b ${
                        selectedEmail?.id === email.id ? 'border-l-2' : ''
                      }`}
                      style={{ 
                        borderColor: 'var(--app-border)',
                        borderLeftColor: selectedEmail?.id === email.id ? 'var(--app-accent)' : 'transparent',
                        background: selectedEmail?.id === email.id ? 'var(--app-surface)' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedEmail?.id !== email.id) {
                          e.currentTarget.style.background = 'var(--app-surface)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedEmail?.id !== email.id) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-semibold text-sm truncate flex-1 pr-2" style={{ color: 'var(--app-text)' }}>
                          {extractSenderName(email.from)}
                        </div>
                        <div className="text-xs shrink-0" style={{ color: 'var(--app-text-muted)' }}>
                          {formatDate(email.date)}
                        </div>
                      </div>
                      <div className="font-medium text-sm mb-1 truncate" style={{ color: 'var(--app-text)' }}>
                        {email.subject}
                      </div>
                      <p className="text-xs line-clamp-2" style={{ color: 'var(--app-text-muted)' }}>
                        {email.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {selectedEmail && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center gap-4" style={{ borderColor: 'var(--app-border)' }}>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="p-2 rounded-lg transition-all"
                  style={{ color: 'var(--app-text-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--app-surface)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold truncate" style={{ color: 'var(--app-text)' }}>
                    {selectedEmail.subject}
                  </h2>
                  <p className="text-sm truncate" style={{ color: 'var(--app-text-muted)' }}>
                    {selectedEmail.from}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="p-2 rounded-lg transition-all"
                  style={{ color: 'var(--app-text-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--app-surface)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="text-xs mb-4" style={{ color: 'var(--app-text-muted)' }}>
                  {new Date(selectedEmail.date).toLocaleString()}
                </div>
                <div 
                  className="p-4 rounded-xl mb-6 whitespace-pre-wrap text-sm"
                  style={{ background: 'var(--app-surface)', color: 'var(--app-text)' }}
                >
                  {selectedEmail.body || selectedEmail.snippet}
                </div>

                <div className="border-t pt-6" style={{ borderColor: 'var(--app-border)' }}>
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--app-text)' }}>
                    <Sparkles className="w-4 h-4" style={{ color: 'var(--app-accent)' }} />
                    AI Reply Assistant
                  </h3>

                  {replyError && (
                    <div className="mb-4 p-4 rounded-xl border-l-4 bg-red-500/10" style={{ borderLeftColor: '#ef4444' }}>
                      <div className="font-semibold text-sm text-red-300 mb-1">Error Generating Reply</div>
                      <div className="text-sm text-red-200">{replyError}</div>
                    </div>
                  )}

                  {!aiReply ? (
                    <button
                      onClick={() => handleGenerateReply(selectedEmail)}
                      disabled={generatingReply}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                      style={{ background: 'var(--app-accent)' }}
                    >
                      {generatingReply ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating AI Reply...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate AI Reply
                        </>
                      )}
                    </button>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--app-text-muted)' }}>
                        AI-Generated Reply (editable):
                      </label>
                      <textarea
                        value={aiReply}
                        onChange={(e) => setAiReply(e.target.value)}
                        rows={8}
                        className="w-full p-4 rounded-xl text-sm mb-4 resize-none outline-none"
                        style={{ 
                          background: 'var(--app-surface)', 
                          color: 'var(--app-text)',
                          border: '1px solid var(--app-border)'
                        }}
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={handleSendReply}
                          disabled={sendingReply}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                          style={{ background: 'var(--app-accent)' }}
                        >
                          {sendingReply ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Send Reply
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleGenerateReply(selectedEmail)}
                          disabled={generatingReply}
                          className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
                          style={{ background: 'var(--app-surface)', color: 'var(--app-text-muted)' }}
                        >
                          Regenerate
                        </button>
                      </div>
                    </div>
                  )}

                  {sendStatus && (
                    <div className={`mt-4 p-4 rounded-xl text-center text-sm font-medium ${
                      sendStatus.includes('✅') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {sendStatus}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!selectedEmail && emails.length > 0 && (
            <div className="hidden lg:flex flex-1 items-center justify-center" style={{ background: 'var(--app-surface)' }}>
              <div className="text-center">
                <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--app-text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
                  Select an email to view and reply with AI
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "compose" && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--app-text-muted)' }}>
                  To:
                </label>
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full p-3 rounded-xl text-sm outline-none"
                  style={{ 
                    color: 'var(--app-text)',
                    background: 'var(--app-surface)',
                    border: '1px solid var(--app-border)'
                  }}
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--app-text-muted)' }}>
                  Subject:
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject (optional - AI will suggest one)"
                  className="w-full p-3 rounded-xl text-sm outline-none"
                  style={{ 
                    color: 'var(--app-text)',
                    background: 'var(--app-surface)',
                    border: '1px solid var(--app-border)'
                  }}
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--app-text-muted)' }}>
                  What do you want to say?
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g., Follow up on our meeting, ask about timeline, suggest next steps..."
                  rows={4}
                  className="w-full p-3 rounded-xl text-sm outline-none resize-none"
                  style={{ 
                    color: 'var(--app-text)',
                    background: 'var(--app-surface)',
                    border: '1px solid var(--app-border)'
                  }}
                />
              </div>
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
                  Refraim is drafting your email...
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
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--app-text-muted)' }}>
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
        </div>
      )}
    </div>
  );
}
