'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ChatThread } from '@/components/ChatThread';
import { LearningStudioPanel, DOMAINS } from '@/components/LearningStudioPanel';
import { AuthModal } from '@/components/AuthModal';
import { UsageAnalyticsModal } from '@/components/UsageAnalyticsModal';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/posthog';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<string>('openai/gpt-4o-mini');
  const [selectedDomain, setSelectedDomain] = useState<string>('web-dev');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isUsageOpen, setIsUsageOpen] = useState<boolean>(false);

  // Session Statistics
  const [sessionStats, setSessionStats] = useState({
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    totalTokens: 0,
    totalCostUSD: 0,
    messagesCount: 0,
  });

  const activeDomainName = DOMAINS.find((d) => d.id === selectedDomain)?.name || 'Full-Stack Engineering';

  // Check existing Supabase auth session
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
        }
      } catch (err) {
        console.warn("Supabase auth check notice:", err);
      }
    }
    checkAuth();
  }, []);

  const handleSendMessage = async (promptContent: string) => {
    if (!promptContent || loading) return;

    const userMessage = {
      role: 'user',
      content: promptContent,
      createdAt: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    trackEvent('chat_message_sent', {
      model: selectedModel,
      domain: activeDomainName,
      promptLength: promptContent.length,
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          model: selectedModel,
          skillDomain: activeDomainName,
        }),
      });

      if (!response.ok) {
        throw new Error(`API response error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage = {
        id: data.savedMessageId || `msg_${Date.now()}`,
        role: 'assistant',
        content: data.content,
        model: data.model,
        promptTokens: data.promptTokens,
        completionTokens: data.completionTokens,
        totalTokens: data.totalTokens,
        costUSD: data.costUSD,
        latencyMs: data.latencyMs,
        createdAt: new Date().toISOString(),
      };

      setMessages([...newMessages, assistantMessage]);

      // Update session statistics
      setSessionStats((prev) => ({
        totalPromptTokens: prev.totalPromptTokens + (data.promptTokens || 0),
        totalCompletionTokens: prev.totalCompletionTokens + (data.completionTokens || 0),
        totalTokens: prev.totalTokens + (data.totalTokens || 0),
        totalCostUSD: Number((prev.totalCostUSD + (data.costUSD || 0)).toFixed(6)),
        messagesCount: prev.messagesCount + 1,
      }));

      trackEvent('llm_response_received', {
        model: data.model,
        tokens: data.totalTokens,
        costUSD: data.costUSD,
        latencyMs: data.latencyMs,
      });

    } catch (err) {
      console.error('Failed to receive response from mentor API:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '⚠️ Apologies, an unexpected network or API error occurred while connecting to the LLM backend. Please check your OpenRouter configuration.',
          model: selectedModel,
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          costUSD: 0,
          latencyMs: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#0c0c0e]">
      {/* Navigation Header */}
      <Navbar
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        userEmail={userEmail}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenUsage={() => setIsUsageOpen(true)}
        sessionCost={sessionStats.totalCostUSD}
      />

      {/* Split-Screen Main Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left / Center: Chat Thread Area (7 cols on large desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 h-full overflow-hidden">
          <ChatThread
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loading}
            selectedModel={selectedModel}
            skillDomain={activeDomainName}
            totalSessionCost={sessionStats.totalCostUSD}
            totalSessionTokens={sessionStats.totalTokens}
          />
        </div>

        {/* Right: Learning Studio Panel (5 cols on large desktop) */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4 h-full overflow-hidden">
          <LearningStudioPanel
            selectedDomain={selectedDomain}
            onSelectDomain={setSelectedDomain}
            onSelectPrompt={handleSendMessage}
          />
        </div>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        userEmail={userEmail}
        onLoginSuccess={(email) => setUserEmail(email)}
      />

      <UsageAnalyticsModal
        isOpen={isUsageOpen}
        onClose={() => setIsUsageOpen(false)}
        sessionStats={sessionStats}
      />
    </div>
  );
}
