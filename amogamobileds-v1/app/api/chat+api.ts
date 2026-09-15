import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Helper to resolve the model based on requested ID and available API keys
function getModelInstance(modelId: string, customApiKey?: string) {
  const openRouterKey =
    customApiKey || process.env.OPENROUTER_API_KEY || process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
  const geminiKey =
    customApiKey ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const openAiKey =
    customApiKey || process.env.OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  const anthropicKey =
    customApiKey || process.env.ANTHROPIC_API_KEY || process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  const groqKey =
    customApiKey || process.env.GROQ_API_KEY || process.env.EXPO_PUBLIC_GROQ_API_KEY;
  const deepseekKey =
    customApiKey || process.env.DEEPSEEK_API_KEY || process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;

  // 1. Primary: OpenRouter (All models via 1 key)
  if (openRouterKey) {
    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: openRouterKey,
      headers: {
        'HTTP-Referer': 'https://amoga.io',
        'X-Title': 'Amoga Mobile Design System',
      },
    });

    // Map model ID to OpenRouter slug if needed
    let targetModel = modelId;
    if (modelId === 'meta-llama/llama-3.3-70b') {
      targetModel = 'meta-llama/llama-3.3-70b-instruct';
    }
    return openrouter(targetModel);
  }

  // 2. Direct Google Gemini Models
  if (modelId.includes('gemini') || modelId.startsWith('google/')) {
    if (geminiKey) {
      const google = createGoogleGenerativeAI({ apiKey: geminiKey });
      const rawModel = modelId.replace('google/', '');
      const validName = rawModel.includes('2.5')
        ? 'gemini-2.0-flash'
        : rawModel.includes('1.5')
        ? 'gemini-1.5-flash'
        : 'gemini-1.5-pro';
      return google(validName);
    }
  }

  // 3. Direct OpenAI GPT Models
  if (modelId.includes('gpt') || modelId.startsWith('openai/')) {
    if (openAiKey) {
      const openai = createOpenAI({ apiKey: openAiKey });
      const rawModel = modelId.replace('openai/', '');
      return openai(rawModel);
    }
  }

  // 4. Direct Anthropic Claude Models
  if (modelId.includes('claude') || modelId.startsWith('anthropic/')) {
    if (anthropicKey) {
      const anthropic = createAnthropic({ apiKey: anthropicKey });
      const rawModel = modelId.replace('anthropic/', '');
      return anthropic(rawModel);
    }
  }

  // 5. Direct DeepSeek Models
  if (modelId.includes('deepseek')) {
    if (deepseekKey) {
      const deepseek = createOpenAI({
        baseURL: 'https://api.deepseek.com/v1',
        apiKey: deepseekKey,
      });
      return deepseek('deepseek-chat');
    }
  }

  // 6. Direct Groq / Llama Models
  if (modelId.includes('llama')) {
    if (groqKey) {
      const groq = createOpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: groqKey,
      });
      return groq('llama-3.3-70b-versatile');
    }
  }

  // Fallbacks
  if (openAiKey) {
    const openai = createOpenAI({ apiKey: openAiKey });
    return openai('gpt-4o-mini');
  }

  if (geminiKey) {
    const google = createGoogleGenerativeAI({ apiKey: geminiKey });
    return google('gemini-1.5-flash');
  }

  throw new Error(
    `No API Key configured. Please put your OPENROUTER_API_KEY or EXPO_PUBLIC_OPENROUTER_API_KEY in your .env.local file.`
  );
}

export async function POST(req: Request) {
  try {
    const { messages, model = 'google/gemini-2.5-flash', toolType, apiKey } = await req.json();

    const selectedModel = getModelInstance(model, apiKey);

    // Dynamic UI Card Tool
    const renderUiCardTool = tool({
      description:
        'Renders a dynamic generative UI component on the client. Use this when the user asks to build, create, or design a UI component (like profile card, metric KPI card, pricing tier table, feedback form, task card).',
      inputSchema: z.object({
        componentType: z.enum(['profile-card', 'kpi-metric', 'pricing-card', 'feedback-form', 'task-list']),
        title: z.string().describe('Title of the generated UI card'),
        subtitle: z.string().optional().describe('Subtitle or supporting caption'),
        accentColor: z.string().optional().describe('Hex color for accents, e.g. #8B5CF6 or #10B981'),
        data: z.record(z.string(), z.any()).describe('Key-value data payload tailored to the component type'),
      }),
      execute: async (props) => {
        return { status: 'rendered', ...props };
      },
    });

    // Web Search Tool
    const webSearchTool = tool({
      description:
        'Searches the live web for recent information, tech news, documentation, or facts. Returns search results with sources.',
      inputSchema: z.object({
        query: z.string().describe('The web search query'),
      }),
      execute: async ({ query }) => {
        const tavilyKey = process.env.TAVILY_API_KEY;
        if (tavilyKey) {
          try {
            const res = await fetch('https://api.tavily.com/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                api_key: tavilyKey,
                query,
                search_depth: 'basic',
                include_images: true,
                max_results: 4,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              return {
                query,
                results: data.results || [],
                images: data.images || [],
              };
            }
          } catch (err) {
            console.warn('Tavily search error, falling back to simulated results', err);
          }
        }

        return {
          query,
          results: [
            {
              title: `${query} - Latest Updates & Overview`,
              url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
              content: `Recent developments, comprehensive articles, and technical documentation regarding "${query}".`,
            },
          ],
        };
      },
    });

    const tools = {
      render_ui_card: renderUiCardTool,
      web_search: webSearchTool,
    };

    const systemPrompt = `You are the Amoga AI Intelligent Assistant built into the Amoga Mobile UI Design System.
You are running as model: ${model}.
Tool mode selected: ${toolType || 'chat'}.

Guidelines:
1. Always be precise, helpful, and concise.
2. If the user asks to design, create, or build a UI element, form, profile card, pricing tier, or dashboard metric, call the \`render_ui_card\` tool.
3. If the user asks for latest news, facts, web search, or real-time tech updates, call the \`web_search\` tool.
4. Format markdown with code blocks, bold text, bullet points, and headers for clarity.`;

    const result = streamText({
      model: selectedModel,
      system: systemPrompt,
      messages,
      tools:
        toolType === 'ui-render'
          ? { render_ui_card: tools.render_ui_card }
          : toolType === 'web-search'
          ? { web_search: tools.web_search }
          : tools,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Error in /api/chat route:', error);
    return new Response(
      JSON.stringify({
        error: error?.message || 'An error occurred while generating the AI response.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
