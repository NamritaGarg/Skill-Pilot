import { NextRequest, NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/openrouter';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, messages, model = 'openai/gpt-4o-mini', skillDomain = 'Full-Stack Engineering' } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const systemPrompt = `You are an elite AI Learning Mentor specializing in ${skillDomain}.
Your tone is friendly, warm, inspiring, and human, yet technically precise.
Provide step-by-step masterclass explanations, code snippets, clear architectural breakdowns, and real-world case study context.
Keep formatting clean with Markdown headers, bold key terms, and structured lists.`;

    // 1. Call OpenRouter LLM
    const metrics = await callOpenRouter(messages, model, systemPrompt);

    // 2. Persist to Supabase if session exists
    let savedMessageId = null;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user && conversationId) {
        const lastUserMsg = messages[messages.length - 1];

        // Store User Message
        await supabase.from('messages').insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: 'user',
          content: lastUserMsg.content,
          model,
        });

        // Store Assistant Message with Metrics
        const { data: assistantMsgData } = await supabase.from('messages').insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: 'assistant',
          content: metrics.content,
          model: metrics.model,
          prompt_tokens: metrics.promptTokens,
          completion_tokens: metrics.completionTokens,
          total_tokens: metrics.totalTokens,
          cost_usd: metrics.costUSD,
          latency_ms: metrics.latencyMs,
        }).select('id').single();

        savedMessageId = assistantMsgData?.id;

        // Store Usage Log
        await supabase.from('usage_logs').insert({
          user_id: user.id,
          message_id: savedMessageId,
          model: metrics.model,
          prompt_tokens: metrics.promptTokens,
          completion_tokens: metrics.completionTokens,
          total_tokens: metrics.totalTokens,
          cost_usd: metrics.costUSD,
          latency_ms: metrics.latencyMs,
        });
      }
    } catch (dbError) {
      console.warn("Supabase persistence skipped or failed:", dbError);
    }

    return NextResponse.json({
      role: 'assistant',
      content: metrics.content,
      model: metrics.model,
      promptTokens: metrics.promptTokens,
      completionTokens: metrics.completionTokens,
      totalTokens: metrics.totalTokens,
      costUSD: metrics.costUSD,
      latencyMs: metrics.latencyMs,
      savedMessageId,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
