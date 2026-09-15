import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Linking,
  Clipboard,
} from 'react-native';
import {
  Sparkles,
  Palette,
  Code,
  FormInput,
  Search,
  Mic,
  MicOff,
  ArrowUp,
  ChevronDown,
  Plus,
  Check,
  Settings,
  X,
  ExternalLink,
  Star,
  RotateCcw,
  Copy,
  CheckCheck,
  Bot,
  User,
  Zap,
} from 'lucide-react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import {
  streamAiChat,
  getStoredAiSettings,
  saveAiSettings,
  ChatMessage,
  AiSettings,
} from '../../lib/ai-service';
import { JsonRenderer } from './json-renderer';
import { UserProfileCard } from './user-profile-card';
import { DynamicFeedbackForm } from './dynamic-feedback-form';
import { PricingCard } from './pricing-card';
import { PremiumStats } from './premium-stats';
import { GenerativeUiView } from './generative-ui-view';

function extractJsonSchema(content: string): any | null {
  if (!content) return null;
  const match = content.match(/```(?:json|json:ui-card)?\s*([\s\S]*?)\s*```/);
  if (match && match[1]) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed && (parsed.root || parsed.type || parsed.elements || parsed.componentType)) {
        return parsed;
      }
    } catch (_) {}
  }
  return null;
}

// ---------------------------------------------------------------------------
// 3-Dot Typing Indicator Component
// ---------------------------------------------------------------------------
function TypingDots({ isDark }: { isDark: boolean }) {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animateDot = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      );
    };

    const a1 = animateDot(dot1, 0);
    const a2 = animateDot(dot2, 200);
    const a3 = animateDot(dot3, 400);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  const dotColor = isDark ? '#A5B4FC' : '#6366F1';

  return (
    <View style={typingStyles.container}>
      <Animated.View style={[typingStyles.dot, { backgroundColor: dotColor, opacity: dot1 }]} />
      <Animated.View style={[typingStyles.dot, { backgroundColor: dotColor, opacity: dot2 }]} />
      <Animated.View style={[typingStyles.dot, { backgroundColor: dotColor, opacity: dot3 }]} />
    </View>
  );
}

const typingStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});

// ---------------------------------------------------------------------------
// Configs & Models (OpenRouter supported)
// ---------------------------------------------------------------------------

export const AI_MODELS = [
  { id: 'openrouter/free', name: 'Auto (Free)', badge: 'Free', provider: 'OpenRouter', color: '#10B981' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B', badge: 'Free', provider: 'Meta', color: '#3B82F6' },
  { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1', badge: 'Reasoning', provider: 'DeepSeek', color: '#8B5CF6' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat', badge: 'Smart', provider: 'DeepSeek', color: '#06B6D4' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', badge: 'Omni', provider: 'OpenAI', color: '#10B981' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', badge: 'Pro', provider: 'Anthropic', color: '#D97706' },
];

export const AI_TOOLS = [
  { id: 'chat', name: 'AI Chat', icon: Sparkles, color: '#6366F1' },
  { id: 'web-search', name: 'Web Search', icon: Search, color: '#10B981' },
  { id: 'ui-render', name: 'Generative UI', icon: Palette, color: '#8B5CF6' },
];

export const PROMPT_CARDS = [
  {
    id: 'card-1',
    title: 'Design user profile card',
    description: 'Generates a rich, interactive UI card showing stats, avatar, and badges.',
    prompt: 'Design a beautiful user profile card for Mohammed Aman (@aman, Software Engineer from Ajmer) with custom badges and actions.',
    badge: 'GENERATIVE UI',
    tool: 'ui-render',
    icon: Palette,
    iconColor: '#8B5CF6',
    iconBgLight: '#F3E8FF',
    iconBgDark: '#2E1065',
    badgeColor: '#7C3AED',
    badgeBgLight: '#EDE9FE',
    badgeBgDark: '#3B0764',
    borderHover: '#8B5CF6',
  },
  {
    id: 'card-2',
    title: 'Render full chat conversation',
    description: 'Builds a modern chat view with header, incoming & outgoing bubbles, and typing status.',
    prompt: 'Generate an interactive chat conversation layout with a ChatHeader, ChatBubble messages, TypingIndicator, and ChatInput.',
    badge: 'CHAT UI',
    tool: 'ui-render',
    icon: Sparkles,
    iconColor: '#6366F1',
    iconBgLight: '#EEF2FF',
    iconBgDark: '#1E1B4B',
    badgeColor: '#6366F1',
    badgeBgLight: '#EEF2FF',
    badgeBgDark: '#1E1B4B',
    borderHover: '#6366F1',
  },
  {
    id: 'card-3',
    title: 'Search latest Tech news',
    description: 'Searches the web for recent announcements in AI and technology.',
    prompt: 'What are the latest breakthrough announcements and features in modern AI frameworks this week?',
    badge: 'WEB SEARCH',
    tool: 'web-search',
    icon: Search,
    iconColor: '#10B981',
    iconBgLight: '#DCFCE7',
    iconBgDark: '#064E3B',
    badgeColor: '#15803D',
    badgeBgLight: '#DCFCE7',
    badgeBgDark: '#064E3B',
    borderHover: '#10B981',
  },
  {
    id: 'card-4',
    title: 'Create feedback form',
    description: 'Renders a beautiful form with textareas, star ratings, and submittable actions.',
    prompt: 'Build a premium interactive feedback form with star ratings, category selection, and a submit button.',
    badge: 'GENERATIVE UI',
    tool: 'ui-render',
    icon: FormInput,
    iconColor: '#D97706',
    iconBgLight: '#FEF3C7',
    iconBgDark: '#451A03',
    badgeColor: '#B45309',
    badgeBgLight: '#FEF3C7',
    badgeBgDark: '#451A03',
    borderHover: '#D97706',
  },
];

// ---------------------------------------------------------------------------
// Main AI Chat Component
// ---------------------------------------------------------------------------
export function AiChat() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [containerWidth, setContainerWidth] = useState<number>(0);
  const isWide = containerWidth >= 540;

  // Premium Theme tokens
  const bg = isDark ? '#09090B' : '#FFFFFF';
  const cardBg = isDark ? '#18181B' : '#FFFFFF';
  const cardBorder = isDark ? '#27272A' : '#E2E8F0';
  const cardBorderActive = '#6366F1';
  const text = isDark ? '#F4F4F5' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const inputBg = isDark ? '#18181B' : '#FFFFFF';
  const inputBorder = isDark ? '#27272A' : '#E2E8F0';

  // State
  const [input, setInput] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string>('card-3');
  const [selectedModel, setSelectedModel] = useState<string>('openrouter/free');
  const [selectedTool, setSelectedTool] = useState<string>('chat');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showToolDropdown, setShowToolDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatActive, setIsChatActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Settings State
  const [settings, setSettings] = useState<AiSettings>({});
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [openPreviews, setOpenPreviews] = useState<Record<string, boolean>>({});

  // Form State for Generative UI
  const [userRating, setUserRating] = useState(5);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    getStoredAiSettings().then(setSettings);
  }, []);

  // Voice Pulse Animation
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.25, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening, pulseAnim]);

  const activeModelObj = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];
  const activeToolObj = AI_TOOLS.find((t) => t.id === selectedTool) || AI_TOOLS[0];

  const handleCardClick = (card: (typeof PROMPT_CARDS)[0]) => {
    setSelectedCardId(card.id);
    setSelectedTool(card.tool);
    setInput(card.prompt);
  };

  const handleCopyText = (content: string, id: string) => {
    try {
      Clipboard.setString(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (_) {}
  };

  const handleSend = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantMsgId = 'bot-' + Date.now();
    const botMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '', // Empty initially while TypingDots runs
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      toolInvocations: [],
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setIsChatActive(true);
    setInput('');
    setLoading(true);

    const apiMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    await streamAiChat({
      messages: apiMessages,
      model: selectedModel,
      toolType: selectedTool,
      onChunk: (_delta, fullText) => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, content: fullText } : msg))
        );
        scrollViewRef.current?.scrollToEnd({ animated: true });
      },
      onToolCall: (toolCall) => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === assistantMsgId) {
              return {
                ...msg,
                toolInvocations: [
                  {
                    toolName: toolCall.name,
                    toolCallId: 'call-' + Date.now(),
                    args: toolCall.args,
                    result: toolCall.result,
                  },
                ],
              };
            }
            return msg;
          })
        );
      },
      onFinish: () => {
        setLoading(false);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      },
      onError: (err) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content: `⚠️ **Generation Error**: ${err.message || 'Unable to connect to AI provider.'}`,
                }
              : msg
          )
        );
        setLoading(false);
      },
    });
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInput('Design an executive analytics KPI overview card');
      }, 2000);
    }
  };

  const handleReset = () => {
    setIsChatActive(false);
    setMessages([]);
    setInput('');
    setSelectedCardId('card-3');
  };

  const handleSaveSettings = async () => {
    await saveAiSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => {
      setSettingsSaved(false);
      setShowSettingsModal(false);
    }, 900);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setContainerWidth(w);
      }}
      style={[styles.container, { backgroundColor: bg }]}
    >
      {/* -------------------------------------------------------------------
          Main Scroll Area
          ------------------------------------------------------------------- */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.mainScroll}
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {!isChatActive ? (
          <View style={styles.heroSection}>
            {/* Top Sparkle Squircle Icon with Rich Purple Gradient Glow */}
            <View style={[styles.heroIconCircle, { backgroundColor: isDark ? '#2E1065' : '#F3E8FF' }]}>
              <Sparkles size={24} color="#8B5CF6" />
            </View>

            {/* Headline */}
            <Text style={[styles.heroTitle, { color: isDark ? '#F4F4F5' : '#0F172A' }]}>
              How can I help you today?
            </Text>

            {/* Subtitle */}
            <Text style={[styles.heroSubtitle, { color: textMuted }]}>
              Powered by Vercel AI SDK & OpenRouter. Select any model, starter prompt, or generative UI widget below.
            </Text>

            {/* ---------------------------------------------------------------
                Prompt Suggestion Cards Grid (Rich, Colorful, Production-Ready)
                --------------------------------------------------------------- */}
            <View style={[styles.cardsGrid, isWide ? styles.cardsGridDesktop : styles.cardsGridMobile]}>
              {PROMPT_CARDS.map((card) => {
                const IconComp = card.icon;
                const isSelected = selectedCardId === card.id;

                return (
                  <TouchableOpacity
                    key={card.id}
                    onPress={() => handleCardClick(card)}
                    activeOpacity={0.8}
                    style={[
                      styles.promptCard,
                      {
                        backgroundColor: cardBg,
                        borderColor: isSelected ? card.borderHover : cardBorder,
                        borderWidth: isSelected ? 2 : 1,
                      },
                      isWide ? styles.promptCardDesktop : styles.promptCardMobile,
                    ]}
                  >
                    {/* Top Row: Colorful Icon on left, Themed Badge on right */}
                    <View style={styles.cardTopRow}>
                      <View
                        style={[
                          styles.cardIconWrap,
                          {
                            backgroundColor: isDark ? card.iconBgDark : card.iconBgLight,
                          },
                        ]}
                      >
                        <IconComp size={17} color={card.iconColor} />
                      </View>

                      <View
                        style={[
                          styles.cardBadgePill,
                          {
                            backgroundColor: isDark ? card.badgeBgDark : card.badgeBgLight,
                          },
                        ]}
                      >
                        <Text style={[styles.cardBadgeText, { color: card.badgeColor }]}>
                          {card.badge}
                        </Text>
                      </View>
                    </View>

                    {/* Card Title */}
                    <Text style={[styles.cardTitle, { color: text }]}>{card.title}</Text>

                    {/* Card Description */}
                    <Text style={[styles.cardDescription, { color: textMuted }]}>
                      {card.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          /* Active Chat Conversation */
          <View style={styles.chatSection}>
            <View style={styles.chatHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.chatActiveTitle, { color: text }]}>Active Conversation</Text>
                <View style={[styles.modelIndicatorPill, { backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF', borderColor: '#818CF840', borderWidth: 1 }]}>
                  <View style={[styles.modelDot, { backgroundColor: activeModelObj.color || '#6366F1' }]} />
                  <Text style={[styles.modelIndicatorText, { color: '#6366F1' }]}>{activeModelObj.name}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={handleReset} style={[styles.resetBtn, { backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF' }]}>
                <RotateCcw size={13} color="#6366F1" />
                <Text style={[styles.resetBtnText, { color: '#6366F1' }]}>New Chat</Text>
              </TouchableOpacity>
            </View>

            {messages.map((m) => {
              const isUser = m.role === 'user';
              const isWaiting = !isUser && !m.content;
              const hasUiCard =
                !isUser &&
                (m.toolInvocations?.some((inv) => inv.toolName === 'render_ui_card') ||
                  Boolean(extractJsonSchema(m.content)));
              const isPreviewOpen = openPreviews[m.id] !== false;

              return (
                <View key={m.id} style={styles.chatMsgRow}>
                  {/* Circle Avatar with Vibrant Distinct Badges */}
                  <View
                    style={[
                      styles.chatAvatarCircle,
                      {
                        backgroundColor: isUser
                          ? isDark
                            ? '#1E1B4B'
                            : '#EEF2FF'
                          : isDark
                          ? '#1E1B4B'
                          : '#EEF2FF',
                      },
                    ]}
                  >
                    {isUser ? (
                      <User size={16} color="#6366F1" />
                    ) : (
                      <Bot size={17} color="#4F46E5" />
                    )}
                  </View>

                  {/* Message Content Column */}
                  <View style={styles.msgContentCol}>
                    {/* Sender Name with Clean Accent Colors */}
                    <Text style={[styles.senderName, { color: isUser ? '#6366F1' : '#4F46E5' }]}>
                      {isUser ? 'You' : 'AI Assistant'}
                    </Text>

                    {/* Content Body or Typing Indicator */}
                    {isWaiting ? (
                      <TypingDots isDark={isDark} />
                    ) : (
                      <Text style={[styles.msgBodyText, { color: text }]}>
                        {hasUiCard
                          ? '🎨 UI generated successfully! View and refine it in the preview panel.'
                          : m.content}
                      </Text>
                    )}

                    {/* Action Button: Open Preview Panel (Matching Screenshot 3) */}
                    {!isWaiting && !isUser && hasUiCard && (
                      <TouchableOpacity
                        onPress={() => {
                          setOpenPreviews((prev) => ({
                            ...prev,
                            [m.id]: prev[m.id] === undefined ? false : !prev[m.id],
                          }));
                        }}
                        style={[
                          styles.previewPanelBtn,
                          {
                            borderColor: isDark ? '#4338CA' : '#C7D2FE',
                            backgroundColor: isDark ? '#141E33' : '#FFFFFF',
                          },
                        ]}
                        activeOpacity={0.8}
                      >
                        <Sparkles size={14} color="#6366F1" />
                        <Text style={styles.previewPanelBtnText}>Open Preview Panel</Text>
                      </TouchableOpacity>
                    )}

                    {/* Timestamp & Copy Button */}
                    {!isWaiting && (
                      <View style={styles.msgTimeRow}>
                        <Text style={[styles.msgTimeText, { color: textMuted }]}>{m.timestamp}</Text>
                        {!isUser && (
                          <TouchableOpacity
                            onPress={() =>
                              handleCopyText(
                                hasUiCard
                                  ? '🎨 UI generated successfully! View and refine it in the preview panel.'
                                  : m.content,
                                m.id
                              )
                            }
                            style={{ marginLeft: 6 }}
                          >
                            {copiedId === m.id ? (
                              <CheckCheck size={13} color="#10B981" />
                            ) : (
                              <Copy size={13} color={textMuted} />
                            )}
                          </TouchableOpacity>
                        )}
                      </View>
                    )}

                    {/* Render Embedded JSON Schema if returned in message text without toolInvocation */}
                    {!isWaiting && !isUser && hasUiCard && isPreviewOpen && extractJsonSchema(m.content) && !m.toolInvocations?.some((inv) => inv.toolName === 'render_ui_card') && (
                      <View style={{ width: '100%', marginTop: 10 }}>
                        <GenerativeUiView schema={extractJsonSchema(m.content)} title="Generated UI Schema" />
                      </View>
                    )}

                    {/* Render Generative UI Cards if requested or returned by tool */}
                    {isPreviewOpen && m.toolInvocations?.map((inv, idx) => (
                      <View key={idx} style={styles.toolCardWrap}>
                        {inv.toolName === 'render_ui_card' && (
                          <View style={{ width: '100%' }}>
                            {inv.args?.schema ? (
                              <GenerativeUiView schema={inv.args.schema} title={inv.args.title || 'Generative UI Component'} />
                            ) : inv.args?.componentType === 'profile-card' || inv.args?.componentType === 'business-card' ? (
                              <GenerativeUiView
                                title={inv.args.title || 'User Profile Card'}
                                schema={{
                                  root: 'profile',
                                  elements: {
                                    profile: {
                                      type: 'UserProfileCard',
                                      props: {
                                        name: inv.args.title || 'Alex Rivera',
                                        handle: inv.args.subtitle || '@arivera_ai',
                                        role: inv.args.role || 'Lead AI Engineer & Product Architect',
                                        avatarUrl: inv.args.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
                                        fallback: 'AR',
                                        bio: inv.args.bio || 'Building world-class mobile & generative UI component design systems.',
                                        location: inv.args.data?.location || 'San Francisco, CA',
                                        stats: [
                                          { label: 'Projects', value: inv.args.data?.projects || 42 },
                                          { label: 'Followers', value: inv.args.data?.followers || '14.8k' },
                                          { label: 'Following', value: 520 },
                                        ],
                                      },
                                    },
                                  },
                                }}
                              >
                                <UserProfileCard
                                  name={inv.args.title || 'Alex Rivera'}
                                  handle={inv.args.subtitle || '@arivera_ai'}
                                  role={inv.args.role || 'Lead AI Engineer & Product Architect'}
                                  avatarUrl={inv.args.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                                  fallback="AR"
                                  bio={inv.args.bio || 'Building world-class mobile & generative UI component design systems.'}
                                  location={inv.args.data?.location || 'San Francisco, CA'}
                                  stats={[
                                    { label: 'Projects', value: inv.args.data?.projects || 42 },
                                    { label: 'Followers', value: inv.args.data?.followers || '14.8k' },
                                    { label: 'Following', value: 520 },
                                  ]}
                                />
                              </GenerativeUiView>
                            ) : inv.args?.componentType === 'feedback-form' ? (
                              <GenerativeUiView
                                title={inv.args.title || 'Feedback Form'}
                                schema={{
                                  root: 'feedback',
                                  elements: {
                                    feedback: {
                                      type: 'DynamicFeedbackForm',
                                      props: {
                                        title: inv.args.title || 'Send Product Feedback',
                                        description: inv.args.subtitle || 'Help us improve by rating your experience and sharing suggestions.',
                                      },
                                    },
                                  },
                                }}
                              >
                                <DynamicFeedbackForm
                                  title={inv.args.title || 'Send Product Feedback'}
                                  description={inv.args.subtitle || 'Help us improve by rating your experience and sharing suggestions.'}
                                />
                              </GenerativeUiView>
                            ) : inv.args?.componentType === 'pricing-card' ? (
                              <GenerativeUiView
                                title={inv.args.title || 'Pricing Tier'}
                                schema={{
                                  root: 'pricing',
                                  elements: {
                                    pricing: {
                                      type: 'PricingCard',
                                      props: {
                                        title: inv.args.title || 'Pro Tier',
                                        description: inv.args.subtitle || 'For high throughput scaling teams',
                                        price: inv.args.price || '$49',
                                        period: inv.args.period || '/month',
                                        popular: inv.args.popular !== false,
                                        features: inv.args.features || ['Unlimited AI Generation', 'Multi-Model Switcher', 'Priority Support'],
                                        buttonLabel: 'Get Started',
                                      },
                                    },
                                  },
                                }}
                              >
                                <PricingCard
                                  title={inv.args.title || 'Pro Tier'}
                                  description={inv.args.subtitle || 'For high throughput scaling teams'}
                                  price={inv.args.price || '$49'}
                                  period={inv.args.period || '/month'}
                                  popular={inv.args.popular !== false}
                                  features={inv.args.features || ['Unlimited AI Generation', 'Multi-Model Switcher', 'Priority Support']}
                                />
                              </GenerativeUiView>
                            ) : inv.args?.componentType === 'kpi-metric' ? (
                              <GenerativeUiView
                                title={inv.args.title || 'Analytics KPI'}
                                schema={{
                                  root: 'kpi',
                                  elements: {
                                    kpi: {
                                      type: 'PremiumStats',
                                      props: {
                                        variant: inv.args.variant || '01',
                                        title: inv.args.title || 'Platform Analytics',
                                        value: inv.args.value || '$94,320.00',
                                        change: inv.args.change || '+18.4%',
                                      },
                                    },
                                  },
                                }}
                              >
                                <PremiumStats
                                  variant={inv.args.variant || '01'}
                                  title={inv.args.title || 'Platform Analytics'}
                                  value={inv.args.value || '$94,320.00'}
                                  change={inv.args.change || '+18.4%'}
                                />
                              </GenerativeUiView>
                            ) : (
                              <GenerativeUiView schema={inv.args} title="Generative UI Component" />
                            )}
                          </View>
                        )}

                        {/* Web Search Sources Widget */}
                        {inv.toolName === 'web_search' && (
                          <View style={[styles.searchSourcesCard, { backgroundColor: cardBg, borderColor: isDark ? '#064E3B' : '#A7F3D0' }]}>
                            <View style={styles.searchHeader}>
                              <Search size={14} color="#10B981" />
                              <Text style={[styles.searchTitle, { color: text }]}>Web Sources ({inv.args?.query})</Text>
                            </View>
                            <View style={styles.sourceItemsList}>
                              {(inv.result?.results || [1, 2]).map((res: any, sIdx: number) => (
                                <TouchableOpacity
                                  key={sIdx}
                                  onPress={() => res.url && Linking.openURL(res.url)}
                                  style={[styles.sourceItemRow, { borderColor: cardBorder }]}
                                >
                                  <ExternalLink size={13} color="#10B981" />
                                  <Text numberOfLines={1} style={[styles.sourceTitleText, { color: text }]}>
                                    {res.title || 'Official AI Documentation & Release Notes'}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* -------------------------------------------------------------------
          Bottom Floating Message Input Container
          ------------------------------------------------------------------- */}
      <View style={[styles.bottomContainer, { backgroundColor: bg }]}>
        <View style={styles.bottomInner}>
          {/* Dropdown: Model Selector */}
          {showModelDropdown && (
            <View style={[styles.dropdownPopup, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Text style={[styles.dropdownSectionTitle, { color: textMuted }]}>SELECT MODEL</Text>
              {AI_MODELS.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => {
                    setSelectedModel(m.id);
                    setShowModelDropdown(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    selectedModel === m.id && { backgroundColor: isDark ? '#2E1065' : '#F5F3FF' },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={[styles.modelDot, { backgroundColor: m.color }]} />
                    <View>
                      <Text style={[styles.dropdownItemName, { color: text }]}>{m.name}</Text>
                      <Text style={[styles.dropdownItemProvider, { color: textMuted }]}>{m.provider}</Text>
                    </View>
                  </View>
                  <Text style={[styles.dropdownItemBadge, { color: m.color }]}>{m.badge}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Dropdown: Tool Selector */}
          {showToolDropdown && (
            <View style={[styles.dropdownPopup, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Text style={[styles.dropdownSectionTitle, { color: textMuted }]}>SELECT TOOL</Text>
              {AI_TOOLS.map((t) => {
                const ToolIcon = t.icon;
                return (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => {
                      setSelectedTool(t.id);
                      setShowToolDropdown(false);
                    }}
                    style={[
                      styles.dropdownItem,
                      selectedTool === t.id && { backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF' },
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <ToolIcon size={15} color={t.color} />
                      <Text style={[styles.dropdownItemName, { color: text }]}>{t.name}</Text>
                    </View>
                    {selectedTool === t.id && <Check size={14} color="#6366F1" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Input Box Outer Container */}
          <View style={[styles.inputBoxCard, { backgroundColor: inputBg, borderColor: inputBorder }]}>
            {/* Top Text Input with Mic & Send Button on Right */}
            <View style={styles.inputTopRow}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder={isListening ? 'Listening... Speak now' : 'Ask a question or request a UI card...'}
                placeholderTextColor={textMuted}
                style={[
                  styles.textInputField,
                  { color: text },
                  Platform.OS === 'web' && ({ outline: 'none', outlineStyle: 'none', outlineWidth: 0, boxShadow: 'none' } as any),
                ]}
                multiline
                onSubmitEditing={() => handleSend()}
              />

              <View style={styles.inputActionsRight}>
                {/* Voice Mic Button */}
                <TouchableOpacity
                  onPress={handleVoiceToggle}
                  style={[styles.micButton, isListening && { backgroundColor: '#FEE2E2' }]}
                  activeOpacity={0.7}
                >
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    {isListening ? (
                      <MicOff size={16} color="#EF4444" />
                    ) : (
                      <Mic size={16} color={textMuted} />
                    )}
                  </Animated.View>
                </TouchableOpacity>

                {/* Arrow Up Send Button (Vibrant Indigo Button) */}
                <TouchableOpacity
                  onPress={() => handleSend()}
                  disabled={!input.trim() || loading}
                  style={[
                    styles.arrowUpBtn,
                    {
                      backgroundColor: input.trim() && !loading ? '#6366F1' : isDark ? '#334155' : '#C7D2FE',
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <ArrowUp size={15} color="#FFFFFF" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Toolbar: Model pill, Tool pill, Settings, Clear */}
            <View style={styles.inputBottomRow}>
              <View style={styles.pillsLeftGroup}>
                {/* Model Pill */}
                <TouchableOpacity
                  onPress={() => {
                    setShowModelDropdown(!showModelDropdown);
                    setShowToolDropdown(false);
                  }}
                  style={[styles.selectorPill, { borderColor: cardBorder }]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.modelDot, { backgroundColor: activeModelObj.color || '#6366F1' }]} />
                  <Text style={[styles.selectorPillText, { color: text }]}>{activeModelObj.name}</Text>
                  <ChevronDown size={13} color={textMuted} />
                </TouchableOpacity>

                {/* Tool Pill */}
                <TouchableOpacity
                  onPress={() => {
                    setShowToolDropdown(!showToolDropdown);
                    setShowModelDropdown(false);
                  }}
                  style={[styles.selectorPill, { borderColor: cardBorder }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.selectorPillText, { color: text }]}>
                    <Text style={{ color: textMuted }}>Tool: </Text>
                    <Text style={{ color: activeToolObj.color || '#6366F1', fontWeight: '600' }}>{activeToolObj.name}</Text>
                  </Text>
                  <ChevronDown size={13} color={textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.toolsRightGroup}>
                {/* Settings Button */}
                <TouchableOpacity
                  onPress={() => setShowSettingsModal(true)}
                  style={styles.toolIconBtn}
                  activeOpacity={0.7}
                >
                  <Settings size={15} color={textMuted} />
                </TouchableOpacity>

                {/* New Chat Plus Button */}
                <TouchableOpacity onPress={handleReset} style={styles.toolIconBtn} activeOpacity={0.7}>
                  <Plus size={16} color={textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* -------------------------------------------------------------------
          API Key & Configuration Modal
          ------------------------------------------------------------------- */}
      <Modal visible={showSettingsModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Settings size={18} color="#6366F1" />
                <Text style={[styles.modalTitle, { color: text }]}>AI Model & API Keys</Text>
              </View>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <X size={18} color={textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalHelpText, { color: textMuted }]}>
                Configure your keys below. Changes are saved instantly to your frontend and synced with <Text style={{ fontWeight: '700' }}>app_ai_settings.json</Text> & <Text style={{ fontWeight: '700' }}>.env.local</Text>.
              </Text>

              {/* OpenRouter Key */}
              <Text style={[styles.fieldLabel, { color: text }]}>OpenRouter API Key (Powers All Models)</Text>
              <TextInput
                value={settings.openRouterApiKey}
                onChangeText={(val) => setSettings((s) => ({ ...s, openRouterApiKey: val }))}
                placeholder="sk-or-v1-..."
                placeholderTextColor={textMuted}
                secureTextEntry
                style={[
                  styles.modalInput,
                  { color: text, borderColor: cardBorder },
                  Platform.OS === 'web' && ({ outline: 'none', outlineStyle: 'none', outlineWidth: 0 } as any),
                ]}
              />

              {/* OpenAI Key */}
              <Text style={[styles.fieldLabel, { color: text }]}>OpenAI API Key (Optional)</Text>
              <TextInput
                value={settings.openAiApiKey}
                onChangeText={(val) => setSettings((s) => ({ ...s, openAiApiKey: val }))}
                placeholder="sk-..."
                placeholderTextColor={textMuted}
                secureTextEntry
                style={[
                  styles.modalInput,
                  { color: text, borderColor: cardBorder },
                  Platform.OS === 'web' && ({ outline: 'none', outlineStyle: 'none', outlineWidth: 0 } as any),
                ]}
              />

              {/* Anthropic Key */}
              <Text style={[styles.fieldLabel, { color: text }]}>Anthropic Claude API Key (Optional)</Text>
              <TextInput
                value={settings.anthropicApiKey}
                onChangeText={(val) => setSettings((s) => ({ ...s, anthropicApiKey: val }))}
                placeholder="sk-ant-..."
                placeholderTextColor={textMuted}
                secureTextEntry
                style={[
                  styles.modalInput,
                  { color: text, borderColor: cardBorder },
                  Platform.OS === 'web' && ({ outline: 'none', outlineStyle: 'none', outlineWidth: 0 } as any),
                ]}
              />
            </ScrollView>

            <TouchableOpacity
              onPress={handleSaveSettings}
              style={[styles.modalSaveBtn, { backgroundColor: '#6366F1' }]}
            >
              <Text style={styles.modalSaveText}>{settingsSaved ? '✓ Saved Successfully' : 'Save & Apply Keys'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ---------------------------------------------------------------------------
// Stylesheet (Rich, Colorful, Production-Ready)
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mainScroll: {
    flex: 1,
    width: '100%',
  },
  mainScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
    width: '100%',
  },
  heroSection: {
    width: '100%',
    maxWidth: 780,
    alignItems: 'center',
    gap: 10,
  },
  heroIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 27,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 520,
    lineHeight: 19,
    marginBottom: 14,
  },
  cardsGrid: {
    width: '100%',
  },
  cardsGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  cardsGridMobile: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  promptCard: {
    borderRadius: 16,
    padding: 14,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  promptCardDesktop: {
    width: '48.8%',
  },
  promptCardMobile: {
    width: '100%',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBadgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  chatSection: {
    width: '100%',
    maxWidth: 780,
    gap: 18,
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F015',
  },
  chatActiveTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  modelIndicatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  modelDot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5,
  },
  modelIndicatorText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chatMsgRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    width: '100%',
    paddingVertical: 4,
  },
  chatAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  msgContentCol: {
    flex: 1,
    gap: 4,
  },
  senderName: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  msgBodyText: {
    fontSize: 14,
    lineHeight: 21,
  },
  msgTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  msgTimeText: {
    fontSize: 11,
  },
  previewPanelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 4,
  },
  previewPanelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  toolCardWrap: {
    marginTop: 8,
    width: '100%',
  },
  generativeUiCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 10,
    marginTop: 6,
  },
  generativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  generativeTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  genBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  genBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#7C3AED',
  },
  profileWidget: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  profileAvatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
  },
  profileRole: {
    fontSize: 12,
  },
  profileStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 14,
  },
  statItem: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  statLbl: {
    fontSize: 10,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F050',
  },
  feedbackWidget: {
    gap: 8,
  },
  feedbackLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  feedbackSubmitBtn: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  feedbackSubmitText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  searchSourcesCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    gap: 8,
    marginTop: 6,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  sourceItemsList: {
    gap: 6,
  },
  sourceItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  sourceTitleText: {
    fontSize: 12,
    flex: 1,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 8,
  },
  bottomInner: {
    width: '100%',
    maxWidth: 780,
    position: 'relative',
  },
  inputBoxCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  inputTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInputField: {
    flex: 1,
    minHeight: 38,
    maxHeight: 120,
    fontSize: 13.5,
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 6,
    borderWidth: 0,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outlineWidth: 0,
          outline: 'none',
          boxShadow: 'none',
        } as any)
      : {}),
  },
  inputActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 2,
  },
  micButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowUpBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F015',
  },
  pillsLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  toolsRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectorPillText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  toolIconBtn: {
    padding: 6,
  },
  dropdownPopup: {
    position: 'absolute',
    bottom: 85,
    left: 0,
    width: 240,
    borderRadius: 14,
    borderWidth: 1,
    padding: 8,
    gap: 4,
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  dropdownSectionTitle: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 8,
  },
  dropdownItemName: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  dropdownItemProvider: {
    fontSize: 10,
  },
  dropdownItemBadge: {
    fontSize: 10,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalHelpText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  modalSaveBtn: {
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
