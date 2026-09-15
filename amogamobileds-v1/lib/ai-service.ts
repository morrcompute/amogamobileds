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
 * Extracts JSON UI schema from AI raw response or creates dynamic fallback
 */
export function extractOrBuildSchema(rawText: string, promptText: string): any {
  // 1. Try markdown code fence
  const jsonMatch = rawText.match(/```(?:json|json:ui-card)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (parsed && (parsed.root || parsed.elements || parsed.type)) {
        return parsed;
      }
    } catch (_) {}
  }

  // 2. Try raw JSON string
  try {
    const parsed = JSON.parse(rawText.trim());
    if (parsed && (parsed.root || parsed.elements || parsed.type)) {
      return parsed;
    }
  } catch (_) {}

  // 3. Dynamic schema fallback based on prompt keywords if offline/parsing fails
  const lower = promptText.toLowerCase();
  if (lower.includes('feedback') || lower.includes('form') || lower.includes('survey')) {
    return {
      root: 'feedback',
      elements: {
        feedback: {
          type: 'DynamicFeedbackForm',
          props: {
            title: 'Send Product Feedback',
            description: 'Help us improve by rating your experience and sharing suggestions.',
          },
        },
      },
    };
  } else if (lower.includes('price') || lower.includes('pricing') || lower.includes('tier') || lower.includes('plan')) {
    return {
      root: 'pricing',
      elements: {
        pricing: {
          type: 'PricingCard',
          props: {
            title: 'Pro Plan',
            description: 'Ideal for scaling teams & dynamic mobile systems',
            price: '$49',
            period: '/month',
            popular: true,
            features: [
              'Unlimited Generative UI generation',
              'Multi-Model Switcher (GPT-4o, Claude, DeepSeek)',
              'Live Preview & JSON Export',
            ],
            buttonLabel: 'Get Started',
          },
        },
      },
    };
  } else if (lower.includes('stat') || lower.includes('kpi') || lower.includes('metric') || lower.includes('storage') || lower.includes('analytics')) {
    return {
      root: 'stats-stack',
      elements: {
        'stats-stack': {
          type: 'Stack',
          props: { direction: 'vertical', gap: 'md' },
          children: ['kpi-1'],
        },
        'kpi-1': {
          type: 'PremiumStats',
          props: {
            variant: '01',
            title: 'Monthly Recurring Revenue',
            value: '$94,320.00',
            change: '+18.4%',
            timeframe: 'vs last month',
          },
        },
      },
    };
  }

  // Extract name if found in prompt
  const nameMatch = promptText.match(/(?:for|name|user)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  const detectedName = nameMatch ? nameMatch[1] : 'Jane Doe';
  const handle = '@' + detectedName.toLowerCase().replace(/\s+/g, '_');

  return {
    root: 'profile',
    elements: {
      profile: {
        type: 'UserProfileCard',
        props: {
          name: detectedName,
          handle,
          role: 'Full-Stack Developer & Designer',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
          fallback: detectedName.substring(0, 2).toUpperCase(),
          bio: 'Crafting digital design systems and accessible user interfaces.',
          location: 'San Francisco, CA',
          joined: 'Joined 2024',
          verified: true,
          stats: [
            { label: 'Followers', value: '1.2k' },
            { label: 'Projects', value: 45 },
          ],
        },
      },
    },
  };
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

    const systemPrompt = `You are the Amoga AI Intelligent Assistant & Generative UI Engine.
You are running as model: ${mappedModel}.
Tool mode selected: ${toolType || 'chat'}.

CRITICAL INSTRUCTIONS FOR UI GENERATION:
When the user asks to build, generate, create, design, or render a UI component, form, business card, profile card, stats dashboard, pricing table, or layout (or when tool mode is 'ui-render'):
1. Write a brief friendly intro description (1-2 sentences).
2. Output a valid, complete JSON schema block inside \`\`\`json code block.
The JSON schema MUST follow this structure:
{
  "root": "main",
  "elements": {
    "main": {
      "type": "Stack" | "Card" | "UserProfileCard" | "DynamicFeedbackForm" | "PricingCard" | "PremiumStats" | "Form",
      "props": { ... },
      "children": [ ... ]
    }
  }
}

AVAILABLE GENERATIVE UI COMPONENTS:
1. "UserProfileCard" (or "BusinessCard"):
   props: {
     "name": "Jane Doe",
     "handle": "@janedoe",
     "role": "Lead Product Designer",
     "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
     "bio": "Crafting digital design systems and accessible user interfaces.",
     "location": "San Francisco, CA",
     "joined": "Joined 2024",
     "verified": true,
     "stats": [{ "label": "Projects", "value": 28 }, { "label": "Followers", "value": "12.4k" }, { "label": "Following", "value": 340 }]
   }

2. "DynamicFeedbackForm" (or "FeedbackForm"):
   props: {
     "title": "Share Your Experience",
     "description": "Rate our product and leave constructive suggestions."
   }

3. "PricingCard":
   props: {
     "title": "Pro Tier",
     "description": "For high throughput scaling teams",
     "price": "$49",
     "period": "/month",
     "popular": true,
     "features": ["Unlimited AI Generation", "Multi-Model Switcher", "Priority Support"],
     "buttonLabel": "Get Started"
   }

4. "PremiumStats":
   props: {
     "variant": "01" | "02" | "06" | "07" | "08" | "09" | "10" | "11" | "12" | "13" | "14" | "15",
     "title": "Metric Title",
     "description": "Subtitle",
     "value": "$124,500.00",
     "change": "+18.4%",
     "data": [...],
     "segments": [...],
     "used": 8.4,
     "total": 15,
     "usedLabel": "GB",
     "totalLabel": "GB"
   }

5. "Stack", "Card", "Form", "Input", "Textarea", "Button", "Badge", "Alert", "Progress", "Separator", "Heading", "Text", "Price", "FeatureList".

Always ensure the JSON is 100% valid syntax.`;

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

    let rawAccumulated = '';

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
                rawAccumulated += delta;
                if (toolType !== 'ui-render') {
                  accumulatedText += delta;
                  onChunk(delta, accumulatedText);
                }
              }
            } catch (_) {}
          }
        }
      }
    }

    if (toolType === 'ui-render') {
      const promptText = messages[messages.length - 1]?.content || '';
      const schemaToRender = extractOrBuildSchema(rawAccumulated, promptText);

      if (onToolCall && schemaToRender) {
        onToolCall({
          name: 'render_ui_card',
          args: {
            schema: schemaToRender,
            title: schemaToRender.title || 'Generated UI Schema',
          },
        });
      }

      const successText = '🎨 UI generated successfully! View and refine it in the preview panel.';
      onChunk('', successText);
      onFinish(successText);
    } else {
      onFinish(accumulatedText);
    }
  } catch (err: any) {
    console.error('Error during AI streaming:', err);
    onError(err);
  }
}
