'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageItem, MessageItemProps } from './MessageItem';
import { Send, Sparkles, RefreshCw, Zap, Cpu, Code2, HelpCircle } from 'lucide-react';
import { formatCost, formatTokens } from '@/lib/utils';

export interface ChatThreadProps {
  messages: Array<MessageItemProps['message']>;
  onSendMessage: (content: string) => void;
  loading: boolean;
  selectedModel: string;
  skillDomain: string;
  totalSessionCost: number;
  totalSessionTokens: number;
}

export function ChatThread({
  messages,
  onSendMessage,
  loading,
  selectedModel,
  skillDomain,
  totalSessionCost,
  totalSessionTokens,
}: ChatThreadProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <main className="h-full flex flex-col bg-[#0c0c0e] relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="radial-spotlight-bg" />

      {/* Top Session Telemetry Bar */}
      <div className="z-10 px-6 py-2.5 bg-[#141418]/80 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-serif text-zinc-200 font-semibold">{skillDomain} Mentor</span>
          <span className="text-zinc-600">|</span>
          <span className="font-mono text-[11px] text-[#dfb76c]">
            {selectedModel.split('/')[1] || selectedModel}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Session Tokens: <strong className="text-white">{formatTokens(totalSessionTokens)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-[#dfb76c]">
            <Zap className="w-3.5 h-3.5 text-[#dfb76c]" />
            <span>Cost: <strong>{formatCost(totalSessionCost)}</strong></span>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 z-10 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-6 py-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#dfb76c] via-[#f2d49b] to-[#b88c42] flex items-center justify-center text-zinc-950 shadow-champagne-glow font-bold">
              <Sparkles className="w-8 h-8 fill-zinc-950" />
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-white mb-2">
                Greetings. I am your AI Learning Mentor.
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Select any topic, request step-by-step masterclasses, or choose a real-world case study. Every prompt tracks input & output tokens, latency, and OpenRouter costs in real-time.
              </p>
            </div>

            {/* Quick Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
              {[
                {
                  icon: Code2,
                  title: 'Architect Next.js RLS',
                  prompt: 'Teach me how to setup Supabase Auth, SSR client, and Row Level Security policies for Next.js 14.',
                },
                {
                  icon: Cpu,
                  title: 'Compare OpenRouter Models',
                  prompt: 'Explain the latency, cost, and token efficiency trade-offs between Claude 3.5 Sonnet and Gemini 2.0 Flash.',
                },
                {
                  icon: Zap,
                  title: 'Optimizing Token Economy',
                  prompt: 'What strategies reduce input prompt token overhead while maintaining LLM accuracy?',
                },
                {
                  icon: HelpCircle,
                  title: 'Build Masterclass Plan',
                  prompt: 'Design an intensive 4-week learning curriculum for mastering System Design and Distributed Systems.',
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(item.prompt)}
                  className="p-3.5 rounded-xl bg-[#15151a] hover:bg-[#1c1c22] border border-zinc-800 hover:border-[#dfb76c]/40 transition group text-left space-y-1"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-200 group-hover:text-[#dfb76c]">
                    <item.icon className="w-4 h-4 text-[#dfb76c]" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">
                    {item.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageItem key={msg.id || index} message={msg} />
          ))
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-3 my-4 text-xs text-zinc-400 p-4 rounded-xl bg-[#15151a] border border-[#dfb76c]/20 max-w-md">
            <RefreshCw className="w-4 h-4 text-[#dfb76c] animate-spin" />
            <span>AI Learning Mentor is processing prompt & calculating OpenRouter telemetry...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="z-10 p-4 bg-[#121216] border-t border-zinc-800/80">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask your ${skillDomain} mentor anything... (Press Enter to send)`}
            rows={2}
            className="w-full bg-[#1b1b22] border border-zinc-700/80 focus:border-[#dfb76c] rounded-xl py-3 pl-4 pr-14 text-xs text-white placeholder-zinc-500 focus:outline-none transition resize-none font-sans"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-3 top-3 p-2.5 rounded-full bg-gradient-to-r from-[#dfb76c] via-[#f2d49b] to-[#b88c42] text-zinc-950 font-bold hover:opacity-95 disabled:opacity-30 transition shadow-champagne-sm"
            title="Send prompt"
          >
            <Send className="w-4 h-4 fill-zinc-950" />
          </button>
        </form>

        <div className="mt-2 text-center text-[10px] text-zinc-500 font-sans">
          Click the <span className="text-[#dfb76c] font-semibold">⚡ Metrics</span> icon on any message bubble to view input/output tokens, latency (ms), and cost ($ USD).
        </div>
      </div>
    </main>
  );
}
