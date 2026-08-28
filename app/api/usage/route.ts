import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        totalPromptTokens: 0,
        totalCompletionTokens: 0,
        totalTokens: 0,
        totalCostUSD: 0,
        averageLatencyMs: 0,
        totalMessages: 0,
        logs: [],
      });
    }

    const { data, error } = await supabase
      .from('usage_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const logs = data || [];
    const totalPromptTokens = logs.reduce((acc, log) => acc + (log.prompt_tokens || 0), 0);
    const totalCompletionTokens = logs.reduce((acc, log) => acc + (log.completion_tokens || 0), 0);
    const totalTokens = logs.reduce((acc, log) => acc + (log.total_tokens || 0), 0);
    const totalCostUSD = logs.reduce((acc, log) => acc + Number(log.cost_usd || 0), 0);
    const totalLatency = logs.reduce((acc, log) => acc + (log.latency_ms || 0), 0);
    const averageLatencyMs = logs.length > 0 ? Math.round(totalLatency / logs.length) : 0;

    return NextResponse.json({
      totalPromptTokens,
      totalCompletionTokens,
      totalTokens,
      totalCostUSD: Number(totalCostUSD.toFixed(6)),
      averageLatencyMs,
      totalMessages: logs.length,
      logs,
    });
  } catch (error) {
    return NextResponse.json({
      totalPromptTokens: 0,
      totalCompletionTokens: 0,
      totalTokens: 0,
      totalCostUSD: 0,
      averageLatencyMs: 0,
      totalMessages: 0,
      logs: [],
    });
  }
}
