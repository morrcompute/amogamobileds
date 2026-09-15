import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Clipboard, Platform } from 'react-native';
import { Text } from './text';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { JsonRenderer } from './json-renderer';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Sparkles, Code, Eye, Copy, CheckCheck } from 'lucide-react-native';

export interface GenerativeUiViewProps {
  schema?: any;
  title?: string;
  defaultView?: 'preview' | 'json';
  children?: React.ReactNode;
  style?: any;
}

export function GenerativeUiView({
  schema,
  title = 'Generative UI Component',
  defaultView = 'preview',
  children,
  style,
}: GenerativeUiViewProps) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'preview' | 'json'>(defaultView);
  const [copied, setCopied] = useState(false);

  const cardBg = isDark ? '#141E33' : '#FFFFFF';
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const codeBg = isDark ? '#0B0F19' : '#F8FAFC';
  const tabActiveBg = isDark ? '#1E293B' : '#FFFFFF';
  const tabTrackBg = isDark ? '#0B0F19' : '#F1F5F9';

  const formattedJson = schema ? JSON.stringify(schema, null, 2) : '';

  const handleCopy = () => {
    if (formattedJson) {
      Clipboard.setString(formattedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor: cardBg,
          borderColor,
          borderWidth: 1,
          borderRadius: 18,
          overflow: 'hidden',
          width: '100%',
        },
        style,
      ]}
    >
      {/* Clean Modern Header Bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
          backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        {/* Title & Badge */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#EEF2FF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={13} color="#6366F1" />
          </View>
          <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary }}>
            {title}
          </Text>
          <Badge variant="default" style={{ paddingHorizontal: 6, paddingVertical: 1 }}>
            GEN-UI
          </Badge>
        </View>

        {/* View Switcher Tabs (Preview / JSON) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: tabTrackBg,
              borderRadius: 8,
              padding: 2,
            }}
          >
            <TouchableOpacity
              onPress={() => setActiveTab('preview')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: 9,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: activeTab === 'preview' ? tabActiveBg : 'transparent',
              }}
            >
              <Eye size={11} color={activeTab === 'preview' ? '#6366F1' : textMuted} />
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: activeTab === 'preview' ? textPrimary : textMuted,
                }}
              >
                Preview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('json')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: 9,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: activeTab === 'json' ? tabActiveBg : 'transparent',
              }}
            >
              <Code size={11} color={activeTab === 'json' ? '#6366F1' : textMuted} />
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: activeTab === 'json' ? textPrimary : textMuted,
                }}
              >
                JSON
              </Text>
            </TouchableOpacity>
          </View>

          {/* Copy Button */}
          {formattedJson ? (
            <TouchableOpacity
              onPress={handleCopy}
              style={{
                padding: 6,
                borderRadius: 7,
                backgroundColor: tabTrackBg,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {copied ? (
                <>
                  <CheckCheck size={11} color="#10B981" />
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#10B981' }}>Copied</Text>
                </>
              ) : (
                <Copy size={11} color={textMuted} />
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Content Area without double outer borders */}
      <View style={{ width: '100%' }}>
        {activeTab === 'preview' ? (
          <View style={{ width: '100%' }}>
            {children ? (
              React.isValidElement(children) ? (
                React.cloneElement(children as any, {
                  borderless: true,
                  style: [
                    (children as any).props?.style,
                    { borderWidth: 0, backgroundColor: 'transparent', shadowOpacity: 0, elevation: 0, borderRadius: 0 },
                  ],
                })
              ) : (
                children
              )
            ) : schema ? (
              <JsonRenderer
                schema={schema}
                borderless={true}
                style={{ borderWidth: 0, backgroundColor: 'transparent', shadowOpacity: 0, elevation: 0 }}
              />
            ) : null}
          </View>
        ) : (
          <View style={{ padding: 12 }}>
            <ScrollView
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              style={{
                backgroundColor: codeBg,
                borderRadius: 12,
                borderWidth: 1,
                borderColor,
                padding: 14,
                maxHeight: 360,
              }}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text
                  style={{
                    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                    fontSize: 12.5,
                    color: isDark ? '#A5B4FC' : '#4338CA',
                    lineHeight: 19,
                  }}
                  selectable
                >
                  {formattedJson || '// No JSON schema available'}
                </Text>
              </ScrollView>
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}
