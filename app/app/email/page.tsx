"use client";

import React, { useState, useEffect } from "react";
import { Mail, Sparkles, Loader2, Send, Inbox, RefreshCw, Reply } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

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

  useEffect(() => {
    if (isAuthenticated && activeTab === "inbox") {
      fetchInbox();
    }
  }, [isAuthenticated, activeTab]);

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
          subject: subject || "Message from FlowAI",
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
            Sign in with Google to access your inbox and get AI-powered email assistance
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
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

        {/* Tabs */}
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
            <Send className="w-4 h-4 inline mr-2" />
            Compose
          </button>
        </div>
      </header>

      {/* Inbox Tab */}
      {activeTab === "inbox" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--app-text)' }}>
              Recent Emails
            </h2>
            <button
              onClick={fetchInbox}
              disabled={loadingInbox}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
              style={{ background: 'var(--app-surface)', color: 'var(--app-text)' }}
            >
              <RefreshCw className={`w-4 h-4 ${loadingInbox ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {inboxError && (
            <div className="mb-4 p-4 rounded-xl border-l-4 bg-red-500/10"
              style={{ borderLeftColor: '#ef4444' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-red-300 mb-1">Error Loading Inbox</div>
                  <div className="text-sm text-red-200">{inboxError}</div>
                </div>
                <button
                  onClick={fetchInbox}
                  className="px-4 py-2 rounded-lg text-sm text-white transition-all"
                  style={{ background: 'var(--app-accent)' }}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {loadingInbox ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--app-accent)' }} />
            </div>
          ) : emails.length === 0 && !inboxError ? (
            <div 
              className="text-center py-12 rounded-xl border"
              style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)' }}
            >
              <p style={{ color: 'var(--app-text-muted)' }}>No emails found</p>
            </div>
          ) : !inboxError ? (
            <div className="grid gap-3">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className="p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all"
                  style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)' }}
                  onClick={() => {
                    setSelectedEmail(email);
                    setAiReply("");
                    setSendStatus("");
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1" style={{ color: 'var(--app-text)' }}>
                        {email.from}
                      </div>
                      <div className="font-medium text-sm" style={{ color: 'var(--app-text)' }}>
                        {email.subject}
                      </div>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                      {new Date(email.date).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm line-clamp-2" style={{ color: 'var(--app-text-muted)' }}>
                    {email.snippet}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Selected Email Detail */}
          {selectedEmail && (
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedEmail(null)}
            >
              <div 
                className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl"
                style={{ background: 'var(--app-background)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4">
                  <div className="text-xs mb-2" style={{ color: 'var(--app-text-muted)' }}>
                    From: {selectedEmail.from}
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--app-text)' }}>
                    {selectedEmail.subject}
                  </h3>
                  <div className="text-xs mb-4" style={{ color: 'var(--app-text-muted)' }}>
                    {new Date(selectedEmail.date).toLocaleString()}
                  </div>
                  <div 
                    className="p-4 rounded-xl mb-4 whitespace-pre-wrap text-sm"
                    style={{ background: 'var(--app-surface)', color: 'var(--app-text)' }}
                  >
                    {selectedEmail.body || selectedEmail.snippet}
                  </div>
                </div>

                {replyError && (
                  <div className="mb-4 p-4 rounded-xl border-l-4 bg-red-500/10"
                    style={{ borderLeftColor: '#ef4444' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm text-red-300 mb-1">Error Generating Reply</div>
                        <div className="text-sm text-red-200">{replyError}</div>
                      </div>
                      <button
                        onClick={() => handleGenerateReply(selectedEmail)}
                        className="px-4 py-2 rounded-lg text-sm text-white transition-all flex items-center gap-2"
                        style={{ background: 'var(--app-accent)' }}
                      >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                      </button>
                    </div>
                  </div>
                )}

                {!replyError && (
                  <button
                    onClick={() => handleGenerateReply(selectedEmail)}
                    disabled={generatingReply}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white mb-4 transition-all"
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
                )}

                {aiReply && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--app-text)' }}>
                      AI-Generated Reply:
                    </h4>
                    <textarea
                      value={aiReply}
                      onChange={(e) => setAiReply(e.target.value)}
                      rows={8}
                      className="w-full p-4 rounded-xl text-sm mb-4 resize-none"
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
                        onClick={() => {
                          setSelectedEmail(null);
                          setAiReply("");
                        }}
                        className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: 'var(--app-surface)', color: 'var(--app-text-muted)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {sendStatus && (
                  <div className={`mt-4 p-4 rounded-xl border-l-4 ${
                    sendStatus.includes('✅') 
                      ? 'bg-green-500/10 border-green-500' 
                      : 'bg-red-500/10'
                  }`}
                    style={sendStatus.includes('✅') ? {} : { borderLeftColor: '#ef4444' }}
                  >
                    {sendStatus.includes('✅') ? (
                      <div className="text-sm text-green-300 text-center">{sendStatus}</div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-sm text-red-300 mb-1">Error Sending Email</div>
                          <div className="text-sm text-red-200">{sendStatus.replace('❌ ', '')}</div>
                        </div>
                        <button
                          onClick={handleSendReply}
                          disabled={sendingReply}
                          className="px-4 py-2 rounded-lg text-sm text-white transition-all flex items-center gap-2"
                          style={{ background: 'var(--app-accent)' }}
                        >
                          {sendingReply ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4" />
                              Retry
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Compose Tab */}
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
              rows={6}
              className="w-full p-4 rounded-xl text-sm resize-none outline-none"
              style={{ 
                color: 'var(--app-text)',
                background: 'var(--app-surface)',
                border: '1px solid var(--app-border)'
              }}
            />
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={handleGenerateDraft}
              disabled={loading}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white shadow-lg transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              }`}
              style={{ background: 'var(--app-accent)' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Generating..." : "Generate Email with AI"}
            </button>
          </div>

          {draftedEmail && (
            <div className="space-y-4">
              <div 
                className="p-6 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
                style={{ 
                  background: 'var(--app-surface)',
                  color: 'var(--app-text)',
                  border: '1px solid var(--app-border)'
                }}
              >
                {draftedEmail}
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
                  {sending ? "Sending..." : "Send via Gmail"}
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
