'use client';

import React from 'react';
import { SUPPORTED_MODELS } from '@/lib/openrouter';
import { Sparkles, ChevronDown, BarChart2, User, LogOut } from 'lucide-react';

export interface NavbarProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
  userEmail?: string | null;
  onOpenAuth: () => void;
  onOpenUsage: () => void;
  sessionCost: number;
}

export function Navbar({
  selectedModel,
  onSelectModel,
  userEmail,
  onOpenAuth,
  onOpenUsage,
  sessionCost,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#282834] px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#dfb76c] via-[#f2d49b] to-[#b88c42] flex items-center justify-center text-zinc-950 shadow-champagne-glow font-bold">
          <Sparkles className="w-5 h-5 fill-zinc-950 text-zinc-950" />
        </div>
        <div>
          <h1 className="font-serif text-lg font-bold tracking-tight text-white flex items-center gap-2">
            AI Learning Mentor
            <span className="text-[10px] uppercase font-sans font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] border border-[#dfb76c]/30">
              v2.0 Pro
            </span>
          </h1>
          <p className="text-[11px] text-zinc-400 font-sans hidden sm:block">
            Next-Gen Personal Masterclass & Interactive Mentor
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Model Switcher Dropdown */}
        <div className="relative">
          <select
            value={selectedModel}
            onChange={(e) => onSelectModel(e.target.value)}
            className="appearance-none bg-[#1c1c22] border border-zinc-700/80 hover:border-[#dfb76c]/50 text-xs text-zinc-200 rounded-full py-2 pl-3.5 pr-8 cursor-pointer focus:outline-none focus:border-[#dfb76c] transition font-sans"
          >
            {Object.entries(SUPPORTED_MODELS).map(([modelId, info]) => (
              <option key={modelId} value={modelId} className="bg-[#15151a] text-zinc-200">
                {info.name} ({info.provider})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
        </div>

        {/* Telemetry Button */}
        <button
          onClick={onOpenUsage}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#1c1c22] border border-zinc-700/80 hover:border-[#dfb76c]/50 text-xs font-medium text-zinc-300 hover:text-white transition"
          title="Open session and Supabase telemetry stats"
        >
          <BarChart2 className="w-3.5 h-3.5 text-[#dfb76c]" />
          <span className="hidden md:inline">Telemetry</span>
        </button>

        {/* Auth / User Pill Button */}
        {userEmail ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dfb76c]/10 border border-[#dfb76c]/30 text-xs text-[#dfb76c]">
            <User className="w-3.5 h-3.5" />
            <span className="max-w-[120px] truncate font-medium">{userEmail}</span>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#dfb76c] via-[#f2d49b] to-[#b88c42] text-zinc-950 text-xs font-bold hover:opacity-95 transition shadow-champagne-sm"
          >
            Sign In with Email
          </button>
        )}
      </div>
    </header>
  );
}
