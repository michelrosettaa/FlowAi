"use client";

import { Inbox, RefreshCw, Loader2 } from "lucide-react";

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  body: string;
}

interface EmailInboxViewProps {
  emails: Email[];
  loadingInbox: boolean;
  inboxError: string;
  onRefresh: () => void;
  onSelectEmail: (email: Email) => void;
}

export function EmailInboxView({
  emails,
  loadingInbox,
  inboxError,
  onRefresh,
  onSelectEmail,
}: EmailInboxViewProps) {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--app-text)' }}>
          Recent Emails
        </h2>
        <button
          onClick={onRefresh}
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
              onClick={onRefresh}
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
              onClick={() => {
                onSelectEmail(email);
              }}
              className="p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
              style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}
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
      ) : null}
    </div>
  );
}
