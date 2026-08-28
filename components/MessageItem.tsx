'use client';

import React, { useState } from 'react';
import { TokenMetricsPopover } from './TokenMetricsPopover';
import { formatCost, formatLatency, formatTokens } from '@/lib/utils';
import { BarChart2, User, Bot, Copy, Check, Sparkles } from 'lucide-react';

export interface MessageItemProps {
  message: {
    id?: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    model?: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    costUSD?: number;
    latencyMs?: number;
    createdAt?: string;
  };
}

export function MessageItem({ message }: MessageItemProps) {
  const [showMetrics, setShowMetrics] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const hasMetrics = message.totalTokens !== undefined && message.totalTokens > 0;

  const copyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3.5 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar Icon for Assistant */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#dfb76c] to-[#b88c42] flex items-center justify-center text-zinc-950 font-bold shadow-champagne-sm flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* Message Content Bubble */}
      <div className={`max-w-[85%] sm:max-w-[78%] rounded-xl p-4 transition ${
        isUser
          ? 'bg-[#1e1e26] border border-zinc-700/60 text-zinc-100 rounded-tr-none'
          : 'bg-[#15151a] border border-[#dfb76c]/25 text-zinc-200 shadow-lg rounded-tl-none'
      }`}>

        {/* Message Header (Model label & Copy button) */}
        <div className="flex items-center justify-between gap-4 pb-2 mb-2 border-b border-zinc-800/80 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="font-semibold text-zinc-300">
              {isUser ? 'You' : 'AI Learning Mentor'}
            </span>
            {!isUser && message.model && (
              <span className="px-2 py-0.5 rounded-full bg-[#dfb76c]/10 text-[#dfb76c] border border-[#dfb76c]/20 text-[10px] font-mono">
                {message.model.split('/')[1] || message.model}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyContent}
              className="text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-zinc-800 transition"
              title="Copy message content"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Message Text / Body */}
        <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap font-sans text-zinc-200">
          {message.content}
        </div>

        {/* Bottom Bar: Telemetry & Small Metrics Button */}
        <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-3">
            {hasMetrics && (
              <>
                <span className="font-mono text-zinc-400">
                  {formatTokens(message.totalTokens!)} tokens
                </span>
                <span className="text-zinc-600">•</span>
                <span className="font-mono text-[#dfb76c]">
                  {formatCost(message.costUSD!)}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="font-mono text-cyan-400">
                  {formatLatency(message.latencyMs!)}
                </span>
              </>
            )}
          </div>

          {/* Small Clickable Icon for LLM Metrics Breakdown */}
          {hasMetrics ? (
            <button
              onClick={() => setShowMetrics(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#dfb76c]/10 hover:bg-[#dfb76c]/20 text-[#dfb76c] border border-[#dfb76c]/30 font-medium transition hover:scale-105 active:scale-95 shadow-sm"
              title="Click to view detailed token consumption, cost, and LLM telemetry"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Metrics</span>
            </button>
          ) : (
            <span className="text-[10px] text-zinc-500 italic">User Prompt</span>
          )}
        </div>
      </div>

      {/* Avatar Icon for User */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 flex-shrink-0 mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}

      {/* Telemetry Popover Modal */}
      {hasMetrics && (
        <TokenMetricsPopover
          isOpen={showMetrics}
          onClose={() => setShowMetrics(false)}
          metrics={{
            model: message.model || 'google/gemini-2.0-flash-001',
            promptTokens: message.promptTokens || 0,
            completionTokens: message.completionTokens || 0,
            totalTokens: message.totalTokens || 0,
            costUSD: message.costUSD || 0,
            latencyMs: message.latencyMs || 0,
          }}
        />
      )}
    </div>
  );
}
