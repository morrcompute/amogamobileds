import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './text';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Palette, Search, Code, LayoutDashboard, Sparkles, MessageSquare } from 'lucide-react-native';

export interface PromptSuggestionItem {
  title: string;
  description: string;
  prompt: string;
  tool: string;
  iconName: 'palette' | 'search' | 'code' | 'dashboard';
  accentColor: string;
}

export interface PromptSuggestionsProps {
  suggestions?: PromptSuggestionItem[];
  onSelect?: (prompt: string, tool: string) => void;
  currentTool?: string;
  style?: any;
}

const DEFAULT_SUGGESTIONS: PromptSuggestionItem[] = [
  {
    title: 'Design User Profile Card',
    description: 'Generates an interactive profile card with follower metrics, location tag, and action buttons.',
    prompt: 'Design a beautiful user profile card with follower count, Location (San Francisco), custom badges and actions.',
    tool: 'ui-render',
    iconName: 'palette',
    accentColor: '#6366f1',
  },
  {
    title: 'Search Latest AI News',
    description: 'Searches the web for recent announcements in AI breakthroughs and tech conferences.',
    prompt: 'What are the key announcements from the latest tech conferences and AI releases this month?',
    tool: 'web-search',
    iconName: 'search',
    accentColor: '#10b981',
  },
  {
    title: 'Explain React 19 Features',
    description: 'Deep dive into server actions, useActionState, document metadata and React Compiler.',
    prompt: 'Explain the new features of React 19 with examples of Server Actions and the use() hook.',
    tool: 'chat',
    iconName: 'code',
    accentColor: '#0ea5e9',
  },
  {
    title: 'Create Feedback Form',
    description: 'Renders an interactive form with star ratings, category selectors, and submit triggers.',
    prompt: 'Build a premium user feedback form with input fields for name, email, rating select, message textarea, and a submit button.',
    tool: 'ui-render',
    iconName: 'dashboard',
    accentColor: '#f59e0b',
  },
];

export function PromptSuggestions({
  suggestions = DEFAULT_SUGGESTIONS,
  onSelect,
  currentTool = 'chat',
  style,
}: PromptSuggestionsProps) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? '#141E33' : '#FFFFFF';
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';

  const renderIcon = (name: string, color: string) => {
    switch (name) {
      case 'palette':
        return <Palette size={18} color={color} />;
      case 'search':
        return <Search size={18} color={color} />;
      case 'code':
        return <Code size={18} color={color} />;
      case 'dashboard':
      default:
        return <LayoutDashboard size={18} color={color} />;
    }
  };

  return (
    <View style={[{ gap: 12 }, style]}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {suggestions.map((item, idx) => {
          const isCurrentTool = item.tool === currentTool;

          return (
            <TouchableOpacity
              key={idx}
              onPress={() => onSelect && onSelect(item.prompt, item.tool)}
              style={{
                flex: 1,
                minWidth: 260,
                padding: 16,
                borderRadius: 16,
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: isCurrentTool ? item.accentColor : borderColor,
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <View style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {renderIcon(item.iconName, item.accentColor)}
                  </View>
                  <Badge variant={item.tool === 'ui-render' ? 'default' : 'secondary'}>
                    {item.tool === 'ui-render' ? 'Generative UI' : item.tool === 'web-search' ? 'Web Search' : 'Chat'}
                  </Badge>
                </View>

                <Text style={{ fontSize: 14, fontWeight: '700', color: textPrimary, marginTop: 4 }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 12, color: textMuted, lineHeight: 16 }}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
