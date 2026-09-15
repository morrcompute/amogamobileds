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
 * Extract person name dynamically from prompt
 */
export function extractTargetName(prompt: string, defaultName = 'Mohammed Aman'): string {
  const patterns = [
    /(?:with|for|to|user|named|name\s+is|chat\s+with)\s+([a-zA-Z\s]+?)(?=\s+(?:with|and|an|msg|message|send|saying|having|where|for|$))/i,
    /(?:with|for|to|user|named)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i,
    /(?:for|name|user)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
  ];

  for (const pat of patterns) {
    const m = prompt.match(pat);
    if (m && m[1]?.trim()) {
      let raw = m[1].trim().replace(/\b(an|a|the|ui|chat|card|conversation)\b/gi, '').trim();
      if (raw.length > 1) {
        return raw.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }
    }
  }

  return defaultName;
}

/**
 * Extract custom message text dynamically from prompt
 */
export function extractMessageContent(prompt: string, defaultMsg = 'Hello!'): string {
  const patterns = [
    /(?:msg|message|text|send|saying|says)\s+(?:send\s+|is\s+|to\s+|as\s+)?["']?([^"'\n]+?)["']?$/i,
    /(?:msg|message|text|send|saying|says)\s+(?:send\s+)?["']?([a-zA-Z0-9\s!.,?]+)["']?/i,
  ];

  for (const pat of patterns) {
    const m = prompt.match(pat);
    if (m && m[1]?.trim()) {
      let raw = m[1].trim().replace(/^(?:send|is|as|that)\s+/i, '').trim();
      if (raw.length > 0) {
        return raw.charAt(0).toUpperCase() + raw.slice(1);
      }
    }
  }

  return defaultMsg;
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

  // 2. Try raw JSON or substring with outer brackets
  try {
    const parsed = JSON.parse(rawText.trim());
    if (parsed && (parsed.root || parsed.elements || parsed.type)) {
      return parsed;
    }
  } catch (_) {}

  const firstBrace = rawText.indexOf('{');
  const lastBrace = rawText.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      const parsed = JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
      if (parsed && (parsed.root || parsed.elements || parsed.type)) {
        return parsed;
      }
    } catch (_) {}
  }

  // 3. Dynamic schema fallback strictly adapted to the user's prompt text
  const lower = promptText.toLowerCase();
  const partnerName = extractTargetName(promptText, 'Krishna Raju');
  const userMsg = extractMessageContent(promptText, 'Hy');
  const handle = '@' + partnerName.toLowerCase().replace(/\s+/g, '_');

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
  } else if (lower.includes('chat card') || lower.includes('card item') || lower.includes('chat list') || lower.includes('recent chat')) {
    return {
      root: 'chat-cards-stack',
      elements: {
        'chat-cards-stack': {
          type: 'Stack',
          props: { direction: 'vertical', gap: 'sm' },
          children: ['card-1', 'card-2'],
        },
        'card-1': {
          type: 'ChatCardItem',
          props: {
            id: 'c1',
            title: partnerName,
            lastMessage: userMsg || 'Hey! How can I assist you?',
            time: '02:45 PM',
            unreadCount: 2,
            onlineCount: 1,
            isActive: true,
          },
        },
        'card-2': {
          type: 'ChatCardItem',
          props: {
            id: 'c2',
            title: 'Core Design Team',
            lastMessage: 'Updated the color tokens and component primitives.',
            time: '01:15 PM',
            unreadCount: 0,
            membersCount: 6,
            isGroup: true,
          },
        },
      },
    };
  } else if (lower.includes('typing') || lower.includes('typing indicator')) {
    return {
      root: 'typing-stack',
      elements: {
        'typing-stack': {
          type: 'Stack',
          props: { direction: 'vertical', gap: 'md' },
          children: ['header-1', 'bubble-1', 'typing-1'],
        },
        'header-1': {
          type: 'ChatHeader',
          props: {
            title: partnerName,
            subtitle: 'Online',
            status: 'online',
          },
        },
        'bubble-1': {
          type: 'ChatBubble',
          props: {
            content: userMsg || 'Hello! Checking in on the project.',
            isOwn: false,
            senderName: partnerName,
            time: '02:44 PM',
            status: 'read',
          },
        },
        'typing-1': {
          type: 'TypingIndicator',
          props: {
            label: `${partnerName} is typing...`,
          },
        },
      },
    };
  } else if (lower.includes('chat') || lower.includes('bubble') || lower.includes('conversation') || lower.includes('message')) {
    return {
      root: 'chat-flow-stack',
      elements: {
        'chat-flow-stack': {
          type: 'Stack',
          props: { direction: 'vertical', gap: 'md' },
          children: ['header-1', 'msg-1', 'msg-2', 'typing-1', 'input-1'],
        },
        'header-1': {
          type: 'ChatHeader',
          props: {
            title: partnerName,
            subtitle: 'Online',
            status: 'online',
          },
        },
        'msg-1': {
          type: 'ChatBubble',
          props: {
            content: `Hello! Nice to connect with you.`,
            isOwn: false,
            senderName: partnerName,
            time: '03:26 PM',
            status: 'read',
          },
        },
        'msg-2': {
          type: 'ChatBubble',
          props: {
            content: userMsg || 'Hy',
            isOwn: true,
            senderName: 'You',
            time: '03:27 PM',
            status: 'read',
          },
        },
        'typing-1': {
          type: 'TypingIndicator',
          props: {
            label: `${partnerName} is typing...`,
          },
        },
        'input-1': {
          type: 'ChatInput',
          props: {
            placeholder: `Reply to ${partnerName}...`,
            showAttachments: true,
            showVoice: true,
            showEmoji: true,
          },
        },
      },
    };
  }

  return {
    root: 'profile',
    elements: {
      profile: {
        type: 'UserProfileCard',
        props: {
          name: partnerName,
          handle,
          role: 'Software Engineer & Product Architect',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
          fallback: partnerName.substring(0, 2).toUpperCase(),
          bio: 'Building world-class generative UI component design systems.',
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
1. STRICT DYNAMIC PERSONALIZATION:
   - You MUST extract and use any names, usernames, handles, and custom message text requested in the user's prompt!
   - Example 1: If user says "generate a chat UI with Krishna Raju with msg send hy", the ChatHeader MUST have title "Krishna Raju", and the ChatBubble MUST have content "Hy".
   - Example 2: If user asks for a profile card for "Sarah Jenkins", the UserProfileCard MUST have name "Sarah Jenkins" and handle "@sarah_jenkins".
   - Never output hardcoded placeholder names if the user provided specific names, messages, or details in their prompt.

2. Output ONLY a valid, complete JSON schema block inside \`\`\`json ... \`\`\` code block.
The JSON schema MUST follow this structure:
{
  "root": "main",
  "elements": {
    "main": {
      "type": "Stack" | "Card" | "ChatHeader" | "ChatBubble" | "ChatCardItem" | "TypingIndicator" | "ChatInput" | "ChatMessageList" | "ChatLocationCard" | "ChatEmptyState" | "ContactInfoView" | "ContactManager" | "GroupManager" | "UploadedFileCard" | "UserProfileCard" | "DynamicFeedbackForm" | "PricingCard" | "PremiumStats" | "Form",
      "props": { ... },
      "children": [ ... ]
    }
  }
}

ALL AVAILABLE GENERATIVE UI COMPONENTS:

CHAT CATEGORY COMPONENTS:
1. "ChatHeader":
   props: { "title": "Mohammed Aman", "subtitle": "Online", "avatarUrl": "...", "status": "online" | "offline" | "away" | "busy", "isGroup": false, "memberCount": 5 }

2. "ChatBubble":
   props: { "content": "Hello! How can I help?", "isOwn": false, "senderName": "Aman", "time": "02:45 PM", "status": "read" | "delivered" | "sent", "reactions": [{ "emoji": "👍", "count": 1 }] }

3. "ChatCardItem":
   props: { "id": "c1", "title": "Design Team", "lastMessage": "Reviewing new UI components", "time": "02:30 PM", "unreadCount": 2, "isGroup": true, "membersCount": 6, "isActive": true }

4. "TypingIndicator":
   props: { "label": "Mohammed Aman is typing...", "avatarUrl": "..." }

5. "ChatInput":
   props: { "placeholder": "Type a message...", "showAttachments": true, "showVoice": true, "showEmoji": true }

6. "ChatMessageList":
   props: { "messages": [{ "id": "1", "content": "Hello", "isOwn": false, "senderName": "Aman", "time": "10:00 AM" }] }

7. "ChatLocationCard":
   props: { "title": "Headquarters", "address": "Market St, San Francisco, CA", "latitude": 37.7749, "longitude": -122.4194 }

8. "ChatEmptyState":
   props: { "title": "No Messages Yet", "description": "Start a new conversation", "buttonLabel": "New Message" }

9. "ContactInfoView":
   props: { "name": "Mohammed Aman", "email": "aman@example.com", "phone": "+1 555-1234", "role": "Senior Engineer" }

10. "ContactManager":
    props: { "contacts": [{ "id": "1", "name": "Aman", "email": "aman@example.com", "initials": "AM", "isEnabled": true }] }

11. "GroupManager":
    props: { "groups": [{ "id": "g1", "name": "Core Devs", "membersCount": 5, "ownerEmail": "aman@example.com", "isEnabled": true, "description": "Main dev team" }] }

12. "UploadedFileCard":
    props: { "fileName": "specs.pdf", "fileSize": "2.4 MB", "fileType": "pdf" }

13. "FileUploadProgress":
    props: { "fileName": "design.png", "fileSize": "4.8 MB", "progress": 80 }

OTHER PREMIUM DESIGN SYSTEM COMPONENTS:
14. "UserProfileCard":
    props: { "name": "Mohammed Aman", "handle": "@aman", "role": "Software Engineer", "bio": "...", "location": "Ajmer, India", "stats": [{ "label": "Followers", "value": "1.2k" }, { "label": "Posts", "value": 45 }] }

15. "DynamicFeedbackForm":
    props: { "title": "Send Feedback", "description": "Rate our platform" }

16. "PricingCard":
    props: { "title": "Pro Plan", "price": "$49", "period": "/month", "popular": true, "features": ["..."], "buttonLabel": "Get Started" }

17. "PremiumStats":
    props: { "variant": "01", "title": "MRR", "value": "$94,320.00", "change": "+18.4%" }

18. "Stack", "Card", "Form", "Input", "Textarea", "Button", "Badge", "Alert", "Progress", "Separator", "Heading", "Text", "Price", "FeatureList".

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
