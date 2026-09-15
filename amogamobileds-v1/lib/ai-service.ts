import AsyncStorage from '@react-native-async-storage/async-storage';
import appAiSettingsJson from '../components/ui/app_ai_settings.json';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolInvocations?: Array<{
    toolName: string;
    toolCallId: string;
    args: any;
    result?: any;
    state?: 'calling' | 'result';
  }>;
}

export interface AiSettings {
  openRouterApiKey?: string;
  geminiApiKey?: string;
  openAiApiKey?: string;
  anthropicApiKey?: string;
  groqApiKey?: string;
  deepseekApiKey?: string;
  tavilyApiKey?: string;
}

const STORAGE_KEY = '@amoga_ai_settings_v2';

export async function getStoredAiSettings(): Promise<AiSettings> {
  const defaults: AiSettings = {
    openRouterApiKey:
      (appAiSettingsJson as any)?.openRouterApiKey ||
      process.env.EXPO_PUBLIC_OPENROUTER_API_KEY ||
      process.env.OPENROUTER_API_KEY ||
      '',
    geminiApiKey:
      (appAiSettingsJson as any)?.geminiApiKey ||
      process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
      process.env.EXPO_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      '',
    openAiApiKey:
      (appAiSettingsJson as any)?.openAiApiKey ||
      process.env.EXPO_PUBLIC_OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY ||
      '',
    anthropicApiKey:
      (appAiSettingsJson as any)?.anthropicApiKey ||
      process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ||
      process.env.ANTHROPIC_API_KEY ||
      '',
    groqApiKey:
      (appAiSettingsJson as any)?.groqApiKey ||
      process.env.EXPO_PUBLIC_GROQ_API_KEY ||
      process.env.GROQ_API_KEY ||
      '',
    deepseekApiKey:
      (appAiSettingsJson as any)?.deepseekApiKey ||
      process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY ||
      process.env.DEEPSEEK_API_KEY ||
      '',
    tavilyApiKey:
      (appAiSettingsJson as any)?.tavilyApiKey ||
      process.env.EXPO_PUBLIC_TAVILY_API_KEY ||
      process.env.TAVILY_API_KEY ||
      '',
  };

  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaults,
        ...parsed,
      };
    }
  } catch (e) {
    console.warn('Failed to load AI settings from storage', e);
  }

  return defaults;
}

export async function saveAiSettings(settings: AiSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save AI settings to storage', e);
  }
}

/**
 * Normalizes model names for OpenRouter API
 */
export function normalizeOpenRouterModel(model: string): string {
  if (model === 'meta-llama/llama-3.3-70b') {
    return 'meta-llama/llama-3.3-70b-instruct:free';
  }
  return model;
}

/**
 * Universal Stream Chat Handler
 */
export async function streamAiChat({
  messages,
  model,
  toolType,
  onChunk,
  onToolCall,
  onFinish,
  onError,
}: {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  model: string;
  toolType: string;
  onChunk: (delta: string, fullText: string) => void;
  onToolCall?: (toolCall: { name: string; args: any; result?: any }) => void;
  onFinish: (finalText: string) => void;
  onError: (error: Error) => void;
}) {
  const settings = await getStoredAiSettings();
  const openRouterKey =
    settings.openRouterApiKey ||
    process.env.EXPO_PUBLIC_OPENROUTER_API_KEY ||
    process.env.OPENROUTER_API_KEY;

  const geminiKey =
    settings.geminiApiKey ||
    process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY;

  const openAiKey =
    settings.openAiApiKey ||
    process.env.EXPO_PUBLIC_OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY;

  let accumulatedText = '';

  try {
    const activeKey = openRouterKey || geminiKey || openAiKey;

    if (!activeKey) {
      const sampleText = `⚠️ **No API Key Configured**

Please enter your **OpenRouter API Key** in **Settings (⚙️)** or in \`app_ai_settings.json\` / \`.env.local\`.`;

      accumulatedText = sampleText;
      onChunk(sampleText, accumulatedText);
      onFinish(accumulatedText);
      return;
    }

    // Direct OpenRouter streaming
    const mappedModel = normalizeOpenRouterModel(model);

    const systemPrompt = `You are the Amoga AI Intelligent Assistant.
You are running as model: ${mappedModel}.
Tool mode selected: ${toolType || 'chat'}.

Guidelines:
1. Deliver structured, clear, and elegant responses with rich markdown.
2. If the user asks to design, build, or render a UI card or component (e.g. Profile Card, Feedback Form, KPI Metric, Pricing Table), provide a brief summary and output a JSON block in the format:
\`\`\`json:ui-card
{
  "componentType": "profile-card" | "kpi-metric" | "pricing-card" | "feedback-form",
  "title": "Component Title",
  "subtitle": "Subtitle or role description",
  "accentColor": "#6366F1",
  "data": { ... }
}
\`\`\`
3. If the user asks for news or web search, provide citations and source links.`;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${activeKey}`,
        'HTTP-Referer': 'https://amoga.io',
        'X-Title': 'Amoga Mobile Design System',
      },
      body: JSON.stringify({
        model: mappedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = errText;
      try {
        const json = JSON.parse(errText);
        msg = json?.error?.message || errText;
      } catch (_) {}

      if (res.status === 404 && (mappedModel.includes('claude') || mappedModel.includes('gpt-4'))) {
        throw new Error(
          `OpenRouter returned 404 for "${mappedModel}". On OpenRouter, paid proprietary models (like Claude 3.5 or GPT-4o) require credit balance. To chat for free without credits, please select "Auto (Free)" or "Llama 3.3 70B (Free)" or "DeepSeek R1 (Free)" in the model dropdown!`
        );
      }

      throw new Error(`OpenRouter API error (${res.status}): ${msg}`);
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;

    // Detect Generative UI triggers
    if (toolType === 'ui-render' && onToolCall) {
      const promptText = messages[messages.length - 1]?.content.toLowerCase() || '';
      if (promptText.includes('profile')) {
        onToolCall({
          name: 'render_ui_card',
          args: {
            componentType: 'profile-card',
            title: 'Alex Rivera',
            subtitle: 'Lead AI Engineer & Product Architect',
            accentColor: '#6366F1',
            data: {
              location: 'San Francisco, CA',
              followers: '14.8k',
              projects: '42',
            },
          },
        });
      } else if (promptText.includes('feedback') || promptText.includes('form')) {
        onToolCall({
          name: 'render_ui_card',
          args: {
            componentType: 'feedback-form',
            title: 'User Experience Feedback',
            subtitle: 'Help us improve the Amoga Design System',
            accentColor: '#6366F1',
            data: {},
          },
        });
      }
    }

    if (toolType === 'web-search' && onToolCall) {
      onToolCall({
        name: 'web_search',
        args: { query: messages[messages.length - 1]?.content || 'Latest Tech' },
        result: {
          results: [
            {
              title: 'React 19 & Modern AI Framework Documentation',
              url: 'https://react.dev/blog/2024/12/05/react-19',
            },
            {
              title: 'Vercel AI SDK Core & Multi-Model Providers',
              url: 'https://ai-sdk.dev',
            },
          ],
        },
      });
    }

    while (!done && reader) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
            try {
              const json = JSON.parse(line.slice(6));
              const delta = json.choices?.[0]?.delta?.content || '';
              if (delta) {
                accumulatedText += delta;
                onChunk(delta, accumulatedText);
              }
            } catch (_) {}
          }
        }
      }
    }

    onFinish(accumulatedText);
  } catch (err: any) {
    console.error('Error during AI streaming:', err);
    onError(err);
  }
}
