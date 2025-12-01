"use client";

import { Loader2, Send, Sparkles, RefreshCw } from "lucide-react";

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  body: string;
}

interface EmailDetailModalProps {
  email: Email;
  aiReply: string;
  generatingReply: boolean;
  replyError: string;
  sendingReply: boolean;
  sendStatus: string;
  onClose: () => void;
  onGenerateReply: (email: Email) => void;
  onAiReplyChange: (value: string) => void;
  onSendReply: () => void;
}

export function EmailDetailModal({
  email,
  aiReply,
  generatingReply,
  replyError,
  sendingReply,
  sendStatus,
  onClose,
  onGenerateReply,
  onAiReplyChange,
  onSendReply,
}: EmailDetailModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl"
        style={{ background: 'var(--app-background)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <div className="text-xs mb-2" style={{ color: 'var(--app-text-muted)' }}>
            From: {email.from}
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--app-text)' }}>
            {email.subject}
          </h3>
          <div className="text-xs mb-4" style={{ color: 'var(--app-text-muted)' }}>
            {new Date(email.date).toLocaleString()}
          </div>
          <div 
            className="p-4 rounded-xl mb-4 whitespace-pre-wrap text-sm"
            style={{ background: 'var(--app-surface)', color: 'var(--app-text)' }}
          >
            {email.body || email.snippet}
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
                onClick={() => onGenerateReply(email)}
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
            onClick={() => onGenerateReply(email)}
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
              onChange={(e) => onAiReplyChange(e.target.value)}
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
                onClick={onSendReply}
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
                onClick={onClose}
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
            sendStatus.includes('successfully') 
              ? 'bg-green-500/10 border-green-500' 
              : 'bg-red-500/10'
          }`}
            style={sendStatus.includes('successfully') ? {} : { borderLeftColor: '#ef4444' }}
          >
            {sendStatus.includes('successfully') ? (
              <div className="text-sm text-green-300 text-center">{sendStatus}</div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-red-300 mb-1">Error Sending Email</div>
                  <div className="text-sm text-red-200">{sendStatus.replace('Error: ', '')}</div>
                </div>
                <button
                  onClick={onSendReply}
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
  );
}
