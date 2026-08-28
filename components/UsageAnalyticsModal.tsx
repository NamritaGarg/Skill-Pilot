'use client';

import React, { useState, useEffect } from 'react';
import { formatCost, formatLatency, formatTokens } from '@/lib/utils';
import { BarChart2, Coins, Clock, Cpu, RefreshCw, X, Database } from 'lucide-react';

export interface UsageAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionStats: {
    totalPromptTokens: number;
    totalCompletionTokens: number;
    totalTokens: number;
    totalCostUSD: number;
    messagesCount: number;
  };
}

export function UsageAnalyticsModal({ isOpen, onClose, sessionStats }: UsageAnalyticsModalProps) {
  const [dbStats, setDbStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSupabaseUsage();
    }
  }, [isOpen]);

  const fetchSupabaseUsage = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/usage');
      const data = await res.json();
      setDbStats(data);
    } catch (e) {
      console.error('Failed to fetch usage analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const promptTokens = dbStats?.totalPromptTokens || sessionStats.totalPromptTokens;
  const completionTokens = dbStats?.totalCompletionTokens || sessionStats.totalCompletionTokens;
  const totalTokens = dbStats?.totalTokens || sessionStats.totalTokens;
  const totalCostUSD = dbStats?.totalCostUSD || sessionStats.totalCostUSD;
  const logs = dbStats?.logs || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#141418] border border-[#dfb76c]/30 rounded-xl shadow-2xl p-6 relative overflow-hidden text-zinc-100 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#dfb76c] via-[#f2d49b] to-[#b88c42]" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] border border-[#dfb76c]/20">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              Supabase Usage & LLM Cost Telemetry
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              Aggregated historical consumption logs recorded in Supabase
            </p>
          </div>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-[#1c1c22] border border-zinc-800 rounded-lg">
            <div className="text-[11px] text-zinc-400 mb-1 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-[#dfb76c]" /> Prompt Tokens
            </div>
            <div className="text-lg font-bold text-white font-mono">{formatTokens(promptTokens)}</div>
          </div>

          <div className="p-3 bg-[#1c1c22] border border-zinc-800 rounded-lg">
            <div className="text-[11px] text-zinc-400 mb-1 flex items-center gap-1">
              <BarChart2 className="w-3 h-3 text-amber-400" /> Output Tokens
            </div>
            <div className="text-lg font-bold text-white font-mono">{formatTokens(completionTokens)}</div>
          </div>

          <div className="p-3 bg-[#1c1c22] border border-zinc-800 rounded-lg">
            <div className="text-[11px] text-zinc-400 mb-1 flex items-center gap-1">
              <Coins className="w-3 h-3 text-[#dfb76c]" /> Total Cost
            </div>
            <div className="text-lg font-bold text-[#dfb76c] font-mono">{formatCost(totalCostUSD)}</div>
          </div>

          <div className="p-3 bg-[#1c1c22] border border-zinc-800 rounded-lg">
            <div className="text-[11px] text-zinc-400 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> Avg Latency
            </div>
            <div className="text-lg font-bold text-cyan-300 font-mono">
              {formatLatency(dbStats?.averageLatencyMs || 650)}
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="flex-1 overflow-hidden flex flex-col border border-zinc-800/80 rounded-lg bg-[#18181f]">
          <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-[#141418]">
            <div className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#dfb76c]" />
              Recent Supabase Telemetry Logs
            </div>
            <button
              onClick={fetchSupabaseUsage}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {logs.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-500 font-sans">
                No active Supabase database logs recorded yet. Send your first prompt in mentor chat to generate telemetry!
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase">
                    <th className="p-2">Timestamp</th>
                    <th className="p-2">Model</th>
                    <th className="p-2">Tokens (In/Out)</th>
                    <th className="p-2">Latency</th>
                    <th className="p-2 text-right">Cost (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {logs.map((log: any, idx: number) => (
                    <tr key={log.id || idx} className="hover:bg-zinc-800/30 transition text-zinc-300">
                      <td className="p-2 text-zinc-500">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </td>
                      <td className="p-2 font-sans font-semibold text-white">
                        {log.model.split('/')[1] || log.model}
                      </td>
                      <td className="p-2 text-zinc-400">
                        {log.prompt_tokens} / {log.completion_tokens}
                      </td>
                      <td className="p-2 text-cyan-400">
                        {formatLatency(log.latency_ms)}
                      </td>
                      <td className="p-2 text-right text-[#dfb76c] font-bold">
                        {formatCost(log.cost_usd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-800">
          <span>Powered by OpenRouter API & Supabase RLS</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
