import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '../../ui/text';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';
import { Stack } from '../../ui/stack';
import { PremiumStats } from '../../ui/premium-stats';
import { PricingCard, FeatureList } from '../../ui/pricing-card';
import { UserProfileCard } from '../../ui/user-profile-card';
import { DynamicFeedbackForm } from '../../ui/dynamic-feedback-form';
import { WebSearchUI } from '../../ui/web-search-ui';
import { PromptSuggestions } from '../../ui/prompt-suggestions';
import { ToolSelector } from '../../ui/tool-selector';
import { JsonRenderer } from '../../ui/json-renderer';
import { SchemaEditor } from '../../ui/schema-editor';
import { GenerativeUiView } from '../../ui/generative-ui-view';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { Sparkles, Layers, Palette, RefreshCw } from 'lucide-react-native';

export function JsonRendererPreview() {
  const sampleSchema = {
    root: 'pricing-page',
    elements: {
      'pricing-page': {
        type: 'Stack',
        props: { direction: 'vertical', gap: 'md' },
        children: ['kpi-stat', 'pro-plan'],
      },
      'kpi-stat': {
        type: 'PremiumStats',
        props: {
          variant: '01',
          title: 'Active Platform Subscribers',
          value: '18,940',
          change: '+22.4%',
          timeframe: 'vs previous quarter',
        },
      },
      'pro-plan': {
        type: 'PricingCard',
        props: {
          title: 'Enterprise Scaler',
          description: 'Custom AI agent deployment and high throughput',
          price: '$129',
          period: '/month',
          popular: true,
          features: [
            'Dedicated private model fine-tuning',
            'Full JSON generative UI rendering system',
            'SLA 99.99% uptime guarantee',
          ],
          buttonLabel: 'Deploy Now',
        },
      },
    },
  };

  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
        GENERATIVE UI WITH SEPARATE LIVE UI & JSON SCHEMA TOGGLE
      </Text>
      <GenerativeUiView schema={sampleSchema} title="Enterprise Scaler & KPI Stack" />
    </View>
  );
}

export function SchemaEditorPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
        INTERACTIVE SCHEMA STUDIO (PREVIEW & JSON CODE)
      </Text>
      <SchemaEditor />
    </View>
  );
}

export function PremiumStatsPreview() {
  const [selectedVariant, setSelectedVariant] = useState<string>('01');
  const allVariants = [
    { id: '01', label: '01: Trending Grid' },
    { id: '02', label: '02: Current vs Prev' },
    { id: '03', label: '03: Muted Cards' },
    { id: '04', label: '04: Badge Header' },
    { id: '05', label: '05: Action Links' },
    { id: '06', label: '06: Goal Status' },
    { id: '07', label: '07: Ring Progress' },
    { id: '08', label: '08: Ring & Details' },
    { id: '09', label: '09: Linear Bar' },
    { id: '10', label: '10: Area Sparkline' },
    { id: '11', label: '11: Multi-Segment' },
    { id: '12', label: '12: Donut Gauges' },
    { id: '13', label: '13: Segmented Bar' },
    { id: '14', label: '14: Resource Cost' },
    { id: '15', label: '15: Timeline List' },
  ];

  return (
    <View style={{ gap: 18 }}>
      <Text variant="caption" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
        SELECT VARIANT (15 TOTAL VARIANTS PORTED)
      </Text>

      {/* Interactive Variant Pill Chips */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {allVariants.map((v) => {
          const active = selectedVariant === v.id;
          return (
            <TouchableOpacity
              key={v.id}
              onPress={() => setSelectedVariant(v.id)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 8,
                backgroundColor: active ? '#6366f1' : 'rgba(148, 163, 184, 0.12)',
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: active ? '700' : '600',
                  color: active ? '#ffffff' : undefined,
                }}
              >
                {v.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Active Selected Variant Preview */}
      <View style={{ marginTop: 8 }}>
        <PremiumStats
          variant={selectedVariant}
          title={`Variant ${selectedVariant} Live Preview`}
          description="Interactive responsive visualization component"
        />
      </View>
    </View>
  );
}

export function PricingCardPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
        GENERATIVE PRICING TIERS
      </Text>
      <PricingCard
        title="Starter Dev"
        description="Great for hobbyists and individual developers"
        price="$19"
        period="/month"
        popular={false}
        features={[
          'Up to 1,000 monthly chat generations',
          'Standard response speeds',
          'Community Discord support',
        ]}
        buttonLabel="Get Started"
        buttonVariant="outline"
      />
      <PricingCard
        title="Professional Team"
        description="Ideal for production workloads and fast scaling apps"
        price="$79"
        period="/month"
        popular={true}
        features={[
          'Unlimited AI Chat & Generative UI renders',
          'All 5 Top Tier Frontier Models',
          'Web Search with live source crawling',
          'Priority email & Slack support',
        ]}
        buttonLabel="Start 14-Day Free Trial"
      />
    </View>
  );
}

export function UserProfileCardPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
        AI GENERATED USER PROFILE CARD
      </Text>
      <UserProfileCard
        name="Amoga Studio"
        handle="@amogadev"
        role="Principal Mobile Architect"
        avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
        fallback="AS"
        bio="Creating high-performance universal mobile and generative UI design systems across React Native, Expo, and Web."
        location="Bengaluru, India"
        joined="Member since Jan 2024"
        verified={true}
        stats={[
          { label: 'Components', value: 85 },
          { label: 'Forks', value: '2.4k' },
          { label: 'Stars', value: '18.9k' },
        ]}
      />
    </View>
  );
}

export function DynamicFeedbackFormPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
        INTERACTIVE GENERATIVE FEEDBACK FORM
      </Text>
      <DynamicFeedbackForm
        title="Share Your App Experience"
        description="Your thoughts help us refine components, interactions, and themes."
      />
    </View>
  );
}

export function WebSearchUIPreview() {
  const sources = [
    {
      title: 'Vercel AI SDK 4.0 Released with Generative UI and Structured Outputs',
      url: 'https://sdk.vercel.ai/blog/ai-sdk-4',
    },
    {
      title: 'Expo SDK 52 Announcement with New Architecture enabled by default',
      url: 'https://expo.dev/blog/expo-sdk-52',
    },
    {
      title: 'OpenRouter Multi-Model Inference Benchmark Comparison 2026',
      url: 'https://openrouter.ai/models',
    },
  ];

  const images = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
  ];

  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
        CRAWLED SOURCES & RELATED IMAGES
      </Text>
      <WebSearchUI sources={sources} images={images} />
    </View>
  );
}

export function PromptSuggestionsPreview() {
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');

  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
        AI PROMPT STARTER CHIPS
      </Text>
      <PromptSuggestions
        onSelect={(p, t) => setSelectedPrompt(`[${t}] ${p}`)}
        currentTool="ui-render"
      />
      {selectedPrompt ? (
        <Card style={{ padding: 12, borderRadius: 12 }}>
          <Text style={{ fontSize: 12, fontWeight: '600' }}>
            Selected: <Text style={{ color: '#6366f1' }}>{selectedPrompt}</Text>
          </Text>
        </Card>
      ) : null}
    </View>
  );
}

export function ToolSelectorPreview() {
  const [activeTool, setActiveTool] = useState('ui-render');

  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
        MULTI-TOOL DROPDOWN SELECTOR
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <ToolSelector tool={activeTool} onSelectTool={setActiveTool} />
        <Badge variant="default">Active: {activeTool}</Badge>
      </View>
    </View>
  );
}

export function StackPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
        HORIZONTAL STACK (ALIGN CENTER, GAP LG)
      </Text>
      <Stack direction="horizontal" gap="md" align="center" wrap>
        <Badge variant="default">Primary Badge</Badge>
        <Badge variant="secondary">Secondary Tag</Badge>
        <Badge variant="outline">Outline Metric</Badge>
      </Stack>

      <Text variant="caption" style={{ fontWeight: '700', letterSpacing: 0.5, marginTop: 12 }}>
        VERTICAL STACK WITH CARDS
      </Text>
      <Stack direction="vertical" gap="sm">
        <Card style={{ padding: 14, borderRadius: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '700' }}>Item 1: Layout Grid System</Text>
        </Card>
        <Card style={{ padding: 14, borderRadius: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '700' }}>Item 2: Flex Alignment Control</Text>
        </Card>
      </Stack>
    </View>
  );
}
