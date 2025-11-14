"use client";

import React, { useState, useEffect } from "react";
import { Mail, Plus, Trash2, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

interface EmailProvider {
  name: string;
  provider: string;
  setupInstructions?: string;
}

interface EmailAccount {
  id: string;
  emailAddress: string;
  provider: string;
  isPrimary: boolean;
  isVerified: boolean;
  createdAt: string;
}

export default function EmailSettingsPage() {
  const { isAuthenticated } = useAuth();
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [providers, setProviders] = useState<Record<string, EmailProvider>>({});
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [accountsRes, providersRes] = await Promise.all([
        fetch("/api/email/accounts"),
        fetch("/api/email/providers"),
      ]);

      if (accountsRes.ok) {
        const data = await accountsRes.json();
        setAccounts(data.accounts || []);
      }

      if (providersRes.ok) {
        const data = await providersRes.json();
        setProviders(data.providers || {});
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/email/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailAddress,
          password,
          provider: selectedProvider || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add email account");
      }

      setSuccess("✅ Email account added successfully!");
      setEmailAddress("");
      setPassword("");
      setSelectedProvider("");
      setShowAddForm(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to add email account");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!confirm("Are you sure you want to delete this email account?")) return;

    try {
      const response = await fetch(`/api/email/accounts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete email account");
      }

      setSuccess("✅ Email account deleted successfully");
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete email account");
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
            Email Settings
          </h2>
          <p className="mb-6" style={{ color: 'var(--app-text-muted)' }}>
            Sign in to manage your email accounts
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--app-accent)' }} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-2.5 rounded-xl shadow-lg flex items-center justify-center"
              style={{ background: 'var(--app-accent)' }}
            >
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--app-text)' }}>
                Email Settings
              </h1>
              <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
                Connect your email accounts to use FlowAI Email Helper
              </p>
            </div>
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:scale-105"
              style={{ background: 'var(--app-accent)' }}
            >
              <Plus className="w-4 h-4" />
              Add Email
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-500/20 text-red-300 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 rounded-lg bg-green-500/20 text-green-300 flex items-start gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {showAddForm && (
        <div 
          className="mb-6 p-6 rounded-xl"
          style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--app-text)' }}>
            Add Email Account
          </h2>
          <form onSubmit={handleAddAccount} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--app-text)' }}>
                Email Address
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="w-full p-3 rounded-lg text-sm outline-none"
                style={{ 
                  color: 'var(--app-text)',
                  background: 'var(--app-background)',
                  border: '1px solid var(--app-border)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--app-text)' }}>
                App Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter app-specific password"
                required
                className="w-full p-3 rounded-lg text-sm outline-none"
                style={{ 
                  color: 'var(--app-text)',
                  background: 'var(--app-background)',
                  border: '1px solid var(--app-border)'
                }}
              />
              <p className="mt-1 text-xs" style={{ color: 'var(--app-text-muted)' }}>
                Use an app-specific password, not your regular email password
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--app-text)' }}>
                Provider (auto-detected)
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full p-3 rounded-lg text-sm outline-none"
                style={{ 
                  color: 'var(--app-text)',
                  background: 'var(--app-background)',
                  border: '1px solid var(--app-border)'
                }}
              >
                <option value="">Auto-detect from email</option>
                {Object.entries(providers).map(([key, provider]) => (
                  <option key={key} value={key}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={adding}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ background: 'var(--app-accent)' }}
              >
                {adding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Account
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                disabled={adding}
                className="px-4 py-3 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: 'var(--app-background)',
                  color: 'var(--app-text-muted)',
                  border: '1px solid var(--app-border)'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {accounts.length === 0 ? (
          <div 
            className="p-8 rounded-xl text-center"
            style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}
          >
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" style={{ color: 'var(--app-text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
              No email accounts configured yet. Add your first account to get started!
            </p>
          </div>
        ) : (
          accounts.map((account) => (
            <div
              key={account.id}
              className="p-4 rounded-xl flex items-center justify-between"
              style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--app-accent-muted)' }}
                >
                  <Mail className="w-5 h-5" style={{ color: 'var(--app-accent)' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium" style={{ color: 'var(--app-text)' }}>
                      {account.emailAddress}
                    </span>
                    {account.isPrimary && (
                      <span 
                        className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={{ background: 'var(--app-accent)', color: 'white' }}
                      >
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-sm capitalize" style={{ color: 'var(--app-text-muted)' }}>
                    {account.provider}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteAccount(account.id)}
                className="p-2 rounded-lg transition-all hover:bg-red-500/20"
                style={{ color: 'var(--app-text-muted)' }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <div 
        className="mt-6 p-4 rounded-lg"
        style={{ background: 'var(--app-accent-muted)', border: '1px solid var(--app-accent)' }}
      >
        <h3 className="font-semibold mb-2" style={{ color: 'var(--app-text)' }}>
          📧 How to get an app password:
        </h3>
        <ul className="text-sm space-y-1" style={{ color: 'var(--app-text-muted)' }}>
          <li><strong>Gmail:</strong> Google Account → Security → 2-Step Verification → App Passwords</li>
          <li><strong>Outlook:</strong> Microsoft Account → Security → App Passwords</li>
          <li><strong>Yahoo:</strong> Account Security → Generate App Password</li>
          <li><strong>iCloud:</strong> Apple ID → Security → App-Specific Passwords</li>
        </ul>
      </div>
    </div>
  );
}
