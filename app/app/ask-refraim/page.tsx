"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, User, Bot } from "lucide-react";

export default function AskRefraimAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAskRefraimAI = async () => {
    if (!input.trim()) return;
    const userMsg: { role: "user"; content: string } = {
      role: "user",
      content: input,
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ask-refraim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Error asking Refraim AI:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble responding right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="p-2.5 rounded-xl shadow-lg flex items-center justify-center"
            style={{ background: 'var(--app-accent)' }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--app-text)' }}>
              Ask Refraim
            </h1>
            <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
              Your AI productivity assistant
            </p>
          </div>
        </div>
      </header>

      {/* CHAT CONTAINER */}
      <div 
        className="rounded-2xl p-6 shadow-xl border backdrop-blur-xl"
        style={{ 
          background: 'var(--app-surface)',
          borderColor: 'var(--app-border)',
          minHeight: '600px',
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2" style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent'
        }}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: 'var(--app-accent)' }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--app-text)' }}>
                  How can I help you today?
                </h2>
                <p className="max-w-md" style={{ color: 'var(--app-text-muted)' }}>
                  Ask me anything about your tasks, schedule, emails, or productivity tips.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 w-full max-w-2xl">
                {[
                  "What's on my schedule today?",
                  "Help me prioritise my tasks",
                  "Draft an email to my team",
                  "Create a focus time block"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="p-4 rounded-xl border transition-all text-left text-sm group hover:shadow-md"
                    style={{ 
                      background: 'var(--app-background)',
                      borderColor: 'var(--app-border)',
                      color: 'var(--app-text-muted)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--app-accent)';
                      e.currentTarget.style.color = 'var(--app-text)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--app-border)';
                      e.currentTarget.style.color = 'var(--app-text-muted)';
                    }}
                  >
                    <span style={{ color: 'var(--app-accent)' }} className="inline-block mr-2 group-hover:scale-110 transition-transform">✨</span>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                style={{
                  animation: 'fadeIn 0.3s ease-out'
                }}
              >
                {msg.role === "assistant" && (
                  <div 
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                    style={{ background: 'var(--app-accent)' }}
                  >
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-md ${
                    msg.role === "user" ? "" : "border backdrop-blur-sm"
                  }`}
                  style={msg.role === "user" 
                    ? { background: 'var(--app-accent)', color: 'white' }
                    : { background: 'var(--app-background)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }
                  }
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>

                {msg.role === "user" && (
                  <div 
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                    style={{ background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)' }}
                  >
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3 justify-start" style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div 
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                style={{ background: 'var(--app-accent)' }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div 
                className="px-5 py-3 rounded-2xl backdrop-blur-sm border shadow-md"
                style={{ background: 'var(--app-background)', borderColor: 'var(--app-border)' }}
              >
                <div className="flex items-center gap-2" style={{ color: 'var(--app-text-muted)' }}>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Refraim AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative">
          <div 
            className="relative flex items-end gap-3 p-4 rounded-xl border backdrop-blur-sm shadow-md"
            style={{ background: 'var(--app-background)', borderColor: 'var(--app-border)' }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAskRefraimAI();
                }
              }}
              placeholder="Ask Refraim AI anything..."
              rows={1}
              className="flex-1 bg-transparent focus:outline-none resize-none text-sm leading-relaxed max-h-32"
              style={{ 
                minHeight: "24px",
                color: 'var(--app-text)',
                caretColor: 'var(--app-accent)'
              }}
            />
            <button
              onClick={handleAskRefraimAI}
              disabled={loading || !input.trim()}
              className="flex-shrink-0 p-3 rounded-lg text-white shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--app-accent)' }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-center mt-3" style={{ color: 'var(--app-text-muted)' }}>
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        div::-webkit-scrollbar {
          width: 6px;
        }

        div::-webkit-scrollbar-track {
          background: transparent;
        }

        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        textarea::placeholder {
          color: var(--app-text-muted);
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
