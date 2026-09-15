import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './text';
import { useColorScheme } from '../../hooks/useColorScheme';
import { ChevronDown, MessageSquare, Globe, Palette, Check } from 'lucide-react-native';

export interface ToolItem {
  id: string;
  name: string;
  iconName: 'chat' | 'web' | 'ui';
}

export interface ToolSelectorProps {
  tool: string;
  onSelectTool: (toolId: string) => void;
  style?: any;
}

const TOOLS: ToolItem[] = [
  { id: 'chat', name: 'AI Chat', iconName: 'chat' },
  { id: 'web-search', name: 'Web Search', iconName: 'web' },
  { id: 'ui-render', name: 'UI Render', iconName: 'ui' },
];

export function ToolSelector({
  tool,
  onSelectTool,
  style,
}: ToolSelectorProps) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const [open, setOpen] = useState(false);

  const currentTool = TOOLS.find((t) => t.id === tool) || TOOLS[0];

  const cardBg = isDark ? '#141E33' : '#FFFFFF';
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const itemHover = isDark ? '#1E293B' : '#F1F5F9';

  const renderIcon = (name: string, size = 14) => {
    switch (name) {
      case 'web':
        return <Globe size={size} color="#10b981" />;
      case 'ui':
        return <Palette size={size} color="#8b5cf6" />;
      case 'chat':
      default:
        return <MessageSquare size={size} color="#3b82f6" />;
    }
  };

  return (
    <View style={[{ position: 'relative', zIndex: 50 }, style]}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 10,
          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
          borderWidth: 1,
          borderColor,
        }}
      >
        {renderIcon(currentTool.iconName, 13)}
        <Text style={{ fontSize: 12, fontWeight: '700', color: textPrimary }}>
          {currentTool.name}
        </Text>
        <ChevronDown size={12} color={textMuted} />
      </TouchableOpacity>

      {open && (
        <View
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            marginBottom: 6,
            minWidth: 160,
            borderRadius: 12,
            backgroundColor: cardBg,
            borderWidth: 1,
            borderColor,
            padding: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          {TOOLS.map((item) => {
            const selected = item.id === tool;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  onSelectTool(item.id);
                  setOpen(false);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: selected ? (isDark ? '#1E293B' : '#EEF2FF') : 'transparent',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {renderIcon(item.iconName, 14)}
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: selected ? '700' : '500',
                      color: selected ? '#6366f1' : textPrimary,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
                {selected && <Check size={12} color="#6366f1" />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
