export interface ModelPricing {
  name: string;
  provider: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
  maxTokens: number;
  description: string;
}

export const SUPPORTED_MODELS: Record<string, ModelPricing> = {
  "openai/gpt-4o-mini": {
    name: "GPT-4o Mini",
    provider: "OpenAI",
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    maxTokens: 4096,
    description: "Affordable multimodal model for everyday tasks.",
  },
  "google/gemini-flash-1.5": {
    name: "Gemini Flash 1.5",
    provider: "Google AI",
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.30,
    maxTokens: 8192,
    description: "Ultra-fast response with high reasoning capability.",
  },
  "anthropic/claude-3.5-sonnet": {
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    maxTokens: 4096,
    description: "State-of-the-art coding and complex technical analysis.",
  },
  "meta-llama/llama-3.3-70b-instruct": {
    name: "Llama 3.3 70B",
    provider: "Meta AI",
    inputCostPer1M: 0.13,
    outputCostPer1M: 0.40,
    maxTokens: 4096,
    description: "Open-weights flagship performance for structured output.",
  },
  "deepseek/deepseek-chat": {
    name: "DeepSeek V3",
    provider: "DeepSeek",
    inputCostPer1M: 0.14,
    outputCostPer1M: 0.28,
    maxTokens: 8192,
    description: "Chain-of-thought reasoning model for complex STEM problems.",
  },
};

export interface LLMResponseMetrics {
  content: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUSD: number;
  latencyMs: number;
}

export function calculateCost(modelId: string, promptTokens: number, completionTokens: number): number {
  const modelConfig = SUPPORTED_MODELS[modelId] || {
    inputCostPer1M: 0.50,
    outputCostPer1M: 1.50,
  };

  const inputCost = (promptTokens / 1_000_000) * modelConfig.inputCostPer1M;
  const outputCost = (completionTokens / 1_000_000) * modelConfig.outputCostPer1M;

  return Number((inputCost + outputCost).toFixed(6));
}

export async function callOpenRouter(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  model: string = "openai/gpt-4o-mini",
  systemPrompt?: string
): Promise<LLMResponseMetrics> {
  const startTime = Date.now();
  const apiKey = process.env.OPENROUTER_API_KEY;

  const formattedMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  // Fallback to rich mock response if no API key is set yet
  if (!apiKey || apiKey.includes('your_openrouter_api_key_here')) {
    const latencyMs = Math.floor(Math.random() * 800) + 400; // 400ms - 1200ms
    await new Promise((resolve) => setTimeout(resolve, latencyMs));

    const userLastMsg = messages[messages.length - 1]?.content || "";
    const promptTokens = Math.max(15, Math.floor(userLastMsg.length / 4));
    const mockContent = `I am your AI Learning Mentor. Here is a tailored breakdown for your query regarding: "${userLastMsg.slice(0, 60)}..."\n\n### 💡 Key Concept & Practical Implementation\n1. **Core Principle**: Breakdown complex topics into atomic modular components.\n2. **Hands-On Code Pattern**:\n\`\`\`typescript\n// Optimized async pipeline execution\nasync function learnConcept(topic: string) {\n  const roadmap = await generateInteractiveSteps(topic);\n  return roadmap.executeWithMetrics();\n}\n\`\`\`\n3. **Pro-Tip**: Keep testing incremental changes and monitor latency and token economy with every iteration!`;

    const completionTokens = Math.floor(mockContent.length / 4);
    const totalTokens = promptTokens + completionTokens;
    const costUSD = calculateCost(model, promptTokens, completionTokens);

    return {
      content: mockContent,
      model,
      promptTokens,
      completionTokens,
      totalTokens,
      costUSD,
      latencyMs: Date.now() - startTime,
    };
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://vibe-learning-mentor.vercel.app",
        "X-Title": "AI Learning Mentor",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: formattedMessages,
        temperature: 0.7,
      }),
    });

    const endTime = Date.now();
    const latencyMs = endTime - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API call failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No response received from model.";
    const usage = data.usage || {};

    const promptTokens = usage.prompt_tokens || Math.floor((systemPrompt?.length || 0 + formattedMessages.reduce((acc, m) => acc + m.content.length, 0)) / 4);
    const completionTokens = usage.completion_tokens || Math.floor(content.length / 4);
    const totalTokens = usage.total_tokens || (promptTokens + completionTokens);
    const costUSD = calculateCost(model, promptTokens, completionTokens);

    return {
      content,
      model,
      promptTokens,
      completionTokens,
      totalTokens,
      costUSD,
      latencyMs,
    };
  } catch (error) {
    console.error("Error invoking OpenRouter API:", error);
    const latencyMs = Date.now() - startTime;
    return {
      content: `⚠️ System Note: Unable to reach OpenRouter API endpoint (${error instanceof Error ? error.message : 'Unknown error'}). Please verify your \`OPENROUTER_API_KEY\` in \`.env.local\`.`,
      model,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      costUSD: 0,
      latencyMs,
    };
  }
}
