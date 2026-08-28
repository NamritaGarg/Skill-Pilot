'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Layers, 
  Terminal, 
  Monitor, 
  Zap, 
  Sparkles, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export interface LearningStudioProps {
  selectedDomain: string;
  onSelectDomain: (domain: string) => void;
  onSelectPrompt: (promptText: string) => void;
}

export const DOMAINS = [
  { id: 'web-dev', name: 'Full-Stack Engineering', icon: '💻' },
  { id: 'ai-ml', name: 'AI & Machine Learning', icon: '🧠' },
  { id: 'sys-arch', name: 'System Architecture', icon: '🏗️' },
  { id: 'data-eng', name: 'Data Engineering', icon: '📊' },
  { id: 'ui-ux', name: 'UI/UX Product Design', icon: '🎨' },
];

export const CASE_STUDIES: Record<string, Array<{ title: string; scenario: string; prompt: string }>> = {
  'web-dev': [
    {
      title: 'Next.js SSR Hydration & Memory Optimization',
      scenario: 'High latency during Server-Side Rendering in production under 10k RPS load.',
      prompt: 'Act as my AI Senior Mentor. Guide me step-by-step through diagnosing and fixing Next.js SSR hydration bottlenecks and memory leaks under heavy traffic.',
    },
    {
      title: 'Supabase Real-Time RLS Database Architecture',
      scenario: 'Designing scalable multi-tenant security policies for user workspaces.',
      prompt: 'Teach me how to structure robust Supabase Row Level Security (RLS) policies and triggers for a multi-tenant SaaS workspace with optimal query indexes.',
    },
  ],
  'ai-ml': [
    {
      title: 'Fine-Tuning Llama 3 with LoRA & Unsloth',
      scenario: 'Custom domain fine-tuning of open-weights LLMs for specialized code synthesis.',
      prompt: 'Provide a masterclass breakdown on fine-tuning Llama 3 70B using LoRA, parameter-efficient training, and deploying to vLLM.',
    },
    {
      title: 'RAG Pipeline with Vector Search & Re-Ranking',
      scenario: 'Improving retrieval accuracy and reducing hallucinations for enterprise docs.',
      prompt: 'Guide me through building a production-grade RAG pipeline using Supabase pgvector, hybrid search, and Cohere re-ranking.',
    },
  ],
  'sys-arch': [
    {
      title: 'Event-Driven Microservices with Kafka & Redis',
      scenario: 'Handling financial transaction streams with zero-data-loss guarantees.',
      prompt: 'Explain how to design an event-driven architecture using Kafka, Redis pub-sub, and idempotent consumers for fault-tolerant transaction processing.',
    },
  ],
  'data-eng': [
    {
      title: 'Real-Time Streaming ETL with Snowflake & dbt',
      scenario: 'Aggregating billions of web telemetry events into real-time analytical dashboards.',
      prompt: 'Walk me through setting up a real-time data streaming pipeline using ClickHouse, dbt transformations, and automated data validation.',
    },
  ],
  'ui-ux': [
    {
      title: 'Dark Luxury Design System Architecture',
      scenario: 'Creating high-contrast accessible typography and champagne aesthetic components.',
      prompt: 'Teach me the core principles of crafting a dark luxury UI design system with accessible contrast, elegant serif typography, and gold accent micro-interactions.',
    },
  ],
};

export function LearningStudioPanel({
  selectedDomain,
  onSelectDomain,
  onSelectPrompt,
}: LearningStudioProps) {
  const [activeTab, setActiveTab] = useState<'case-studies' | 'video-lessons' | 'screen-guidance'>('case-studies');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoStep, setVideoStep] = useState(1);

  const currentCases = CASE_STUDIES[selectedDomain] || CASE_STUDIES['web-dev'];

  return (
    <aside className="h-full flex flex-col bg-[#141418] border-l border-[#282834] overflow-hidden">
      {/* Top Domain Selector Bar */}
      <div className="p-4 border-b border-zinc-800/80 bg-[#101014]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#dfb76c]" /> Learning Domain
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">Select Masterclass</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {DOMAINS.map((domain) => (
            <button
              key={domain.id}
              onClick={() => onSelectDomain(domain.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedDomain === domain.id
                  ? 'bg-gradient-to-r from-[#dfb76c] to-[#b88c42] text-zinc-950 font-bold shadow-champagne-sm'
                  : 'bg-[#1c1c22] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <span>{domain.icon}</span>
              <span>{domain.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-800 bg-[#16161c]">
        <button
          onClick={() => setActiveTab('case-studies')}
          className={`flex-1 py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition border-b-2 ${
            activeTab === 'case-studies'
              ? 'border-[#dfb76c] text-[#dfb76c] bg-[#dfb76c]/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Case Studies</span>
        </button>

        <button
          onClick={() => setActiveTab('video-lessons')}
          className={`flex-1 py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition border-b-2 ${
            activeTab === 'video-lessons'
              ? 'border-[#dfb76c] text-[#dfb76c] bg-[#dfb76c]/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>AI Video Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('screen-guidance')}
          className={`flex-1 py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition border-b-2 ${
            activeTab === 'screen-guidance'
              ? 'border-[#dfb76c] text-[#dfb76c] bg-[#dfb76c]/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Live Guidance</span>
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Tab 1: Real-World Case Studies */}
        {activeTab === 'case-studies' && (
          <div className="space-y-4">
            <div className="text-xs text-zinc-400 font-sans">
              Real-world engineering challenges designed for interactive masterclasses.
            </div>

            {currentCases.map((cs, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#1b1b22] border border-zinc-800/90 hover:border-[#dfb76c]/40 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif text-sm font-bold text-white group-hover:text-[#dfb76c] transition">
                    {cs.title}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                    Scenario #{idx + 1}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                  {cs.scenario}
                </p>
                <button
                  onClick={() => onSelectPrompt(cs.prompt)}
                  className="w-full py-2 px-3 rounded-full bg-[#dfb76c]/10 hover:bg-[#dfb76c]/20 border border-[#dfb76c]/30 text-[#dfb76c] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <span>Start Mentoring Scenario</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Warm Paper Cream Card Highlight */}
            <div className="p-4 rounded-xl bg-[#f7f5ed] text-[#1c1b18] shadow-md border border-[#dfb76c]/40">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#b88c42] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#b88c42]" /> Personalized AI Path
              </div>
              <h5 className="font-serif text-sm font-bold text-[#1c1b18] mb-1">
                Custom Skill Roadmap
              </h5>
              <p className="text-xs text-zinc-700 leading-relaxed mb-3">
                Ask your mentor to build a personalized 4-week mastery curriculum with automated quizzes and progress tracking.
              </p>
              <button
                onClick={() => onSelectPrompt(`Create a comprehensive 4-week personalized learning curriculum for ${selectedDomain} with practical projects and milestones.`)}
                className="w-full py-2 px-3 rounded-full bg-[#1c1b18] text-[#f7f5ed] hover:bg-black text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span>Generate Curriculum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: AI Video & Interactive Lesson Simulator */}
        {activeTab === 'video-lessons' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#1b1b22] border border-zinc-800">
              <div className="relative aspect-video rounded-lg bg-black overflow-hidden flex items-center justify-center border border-zinc-800">
                {/* Simulated AI Video Frame */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/80 to-transparent flex flex-col justify-between p-3">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="px-2 py-0.5 rounded bg-red-600/80 text-white font-bold animate-pulse">
                      LIVE SIMULATION
                    </span>
                    <span>Step {videoStep} of 4</span>
                  </div>

                  <div className="text-center">
                    {!isPlayingVideo ? (
                      <button
                        onClick={() => setIsPlayingVideo(true)}
                        className="w-12 h-12 rounded-full bg-[#dfb76c] text-zinc-950 flex items-center justify-center mx-auto shadow-champagne-glow hover:scale-110 transition"
                      >
                        <Play className="w-6 h-6 fill-zinc-950 ml-0.5" />
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-xs text-[#dfb76c] font-mono animate-pulse">
                          Generating AI Visual Stream...
                        </div>
                        <div className="w-32 h-1 bg-zinc-800 rounded-full mx-auto overflow-hidden">
                          <div className="w-3/4 h-full bg-[#dfb76c] animate-pulse" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-left text-xs font-serif text-white font-bold">
                    Masterclass: Architecture Blueprint Simulator
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                <button
                  disabled={videoStep <= 1}
                  onClick={() => setVideoStep((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1 rounded bg-zinc-800 disabled:opacity-40"
                >
                  Previous Step
                </button>
                <span className="font-mono text-zinc-300">Module #{videoStep}</span>
                <button
                  disabled={videoStep >= 4}
                  onClick={() => setVideoStep((prev) => Math.min(4, prev + 1))}
                  className="px-3 py-1 rounded bg-[#dfb76c] text-zinc-950 font-bold disabled:opacity-40"
                >
                  Next Step
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#18181f] border border-zinc-800 rounded-lg text-xs space-y-2">
              <div className="font-semibold text-zinc-200">Current AI Visual Steps:</div>
              <div className="space-y-1 text-zinc-400 text-[11px]">
                <div className={videoStep === 1 ? 'text-[#dfb76c] font-bold' : ''}>1. High-Level System Architecture Diagram</div>
                <div className={videoStep === 2 ? 'text-[#dfb76c] font-bold' : ''}>2. Code Execution Flow & State Mutation</div>
                <div className={videoStep === 3 ? 'text-[#dfb76c] font-bold' : ''}>3. OpenRouter Telemetry Benchmark</div>
                <div className={videoStep === 4 ? 'text-[#dfb76c] font-bold' : ''}>4. Production Deployment to Vercel</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Real-Time Screen Guidance */}
        {activeTab === 'screen-guidance' && (
          <div className="space-y-3">
            <div className="text-xs text-zinc-400">
              Interactive real-time checklist and step-by-step environment guidance:
            </div>

            <div className="space-y-2">
              {[
                { title: 'Setup Next.js App Router & Tailwind Theme', done: true },
                { title: 'Connect Supabase Auth & RLS Schema', done: true },
                { title: 'Integrate OpenRouter Multi-LLM API', done: true },
                { title: 'Track Message Tokens, Cost & Latency', done: true },
                { title: 'Deploy to Vercel Cloud Infrastructure', done: false },
              ].map((step, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                    step.done
                      ? 'bg-emerald-950/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-[#1b1b22] border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 ${step.done ? 'text-emerald-400' : 'text-zinc-600'}`} />
                    <span className="font-medium">{step.title}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40">
                    {step.done ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSelectPrompt("Give me step-by-step real-time guidance on optimizing my Vercel deployment and Supabase database indexes.")}
              className="w-full py-2.5 px-3 rounded-full bg-gradient-to-r from-[#dfb76c] via-[#f2d49b] to-[#b88c42] text-zinc-950 text-xs font-bold hover:opacity-95 transition shadow-champagne-sm mt-4 flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-zinc-950" />
              <span>Ask Mentor for Real-Time Guidance</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
