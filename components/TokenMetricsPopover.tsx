'use client';

import React from 'react';
import { SUPPORTED_MODELS, calculateCost } from '@/lib/openrouter';
import { formatCost, formatLatency, formatTokens } from '@/lib/utils';
import { Zap, Clock, Coins, Cpu, BarChart2, X, CheckCircle2 } from 'lucide-react';

export interface TokenMetricsProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: {
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    costUSD: number;
    latencyMs: number;
  };
}

export function TokenMetricsPopover({ isOpen, onClose, metrics }: TokenMetricsProps) {
  if (!isOpen) return null;

  const currentModelInfo = SUPPORTED_MODELS[metrics.model] || {
    name: metrics.model,
    provider: 'OpenRouter Provider',
    inputCostPer1M: 0.50,
    outputCostPer1M: 1.50,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#15151a] border border-[#dfb76c]/30 rounded-xl shadow-2xl p-6 relative overflow-hidden text-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#dfb76c] via-[#f2d49b] to-[#b88c42]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] border border-[#dfb76c]/20">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              Message Telemetry & LLM Metrics
            </h3>
            <p className="text-xs text-zinc-400 font-sans">
              Exact token economy, execution latency, and cost analysis
            </p>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Input Tokens */}
          <div className="p-3.5 rounded-lg bg-[#1c1c22] border border-zinc-800/80">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span>Input Tokens</span>
              <Cpu className="w-3.5 h-3.5 text-[#dfb76c]" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {formatTokens(metrics.promptTokens)}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">Prompt payload overhead</div>
          </div>

          {/* Output Tokens */}
          <div className="p-3.5 rounded-lg bg-[#1c1c22] border border-zinc-800/80">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span>Output Tokens</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {formatTokens(metrics.completionTokens)}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">Generated completion text</div>
          </div>

          {/* Latency */}
          <div className="p-3.5 rounded-lg bg-[#1c1c22] border border-zinc-800/80">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span>Latency</span>
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-cyan-300 font-mono">
              {formatLatency(metrics.latencyMs)}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">Total API round-trip duration</div>
          </div>

          {/* Cost */}
          <div className="p-3.5 rounded-lg bg-[#1c1c22] border border-[#dfb76c]/30 bg-[#dfb76c]/5">
            <div className="flex items-center justify-between text-xs text-[#dfb76c] mb-1">
              <span>Message Cost</span>
              <Coins className="w-3.5 h-3.5 text-[#dfb76c]" />
            </div>
            <div className="text-xl font-bold text-[#dfb76c] font-mono">
              {formatCost(metrics.costUSD)}
            </div>
            <div className="text-[10px] text-[#dfb76c]/70 mt-1">Estimated OpenRouter USD rate</div>
          </div>
        </div>

        {/* Across LLMs Pricing Comparison */}
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Cost Comparison Across LLMs
            </h4>
            <span className="text-[10px] text-zinc-500 font-mono">
              Total Tokens: {formatTokens(metrics.totalTokens)}
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {Object.entries(SUPPORTED_MODELS).map(([modelId, config]) => {
              const isCurrent = modelId === metrics.model;
              const modelCost = calculateCost(modelId, metrics.promptTokens, metrics.completionTokens);

              return (
                <div
                  key={modelId}
                  className={`flex items-center justify-between p-2.5 rounded-md text-xs transition border ${
                    isCurrent
                      ? 'bg-[#dfb76c]/15 border-[#dfb76c]/50 text-white'
                      : 'bg-[#18181f] border-zinc-800/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCurrent ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb76c] flex-shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-zinc-600 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-zinc-200">{config.name}</div>
                      <div className="text-[10px] text-zinc-500">{config.provider}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className={isCurrent ? 'text-[#dfb76c] font-bold' : 'text-zinc-300'}>
                      {formatCost(modelCost)}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      ${config.inputCostPer1M}/1M in · ${config.outputCostPer1M}/1M out
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 text-center text-[11px] text-zinc-500">
          Telemetry saved to Supabase <code className="text-zinc-400 font-mono">usage_logs</code> table.
        </div>
      </div>
    </div>
  );
}
