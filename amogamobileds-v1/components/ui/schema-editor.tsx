import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { Text } from './text';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
import { JsonRenderer } from './json-renderer';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Eye, Code, X, Check, RefreshCw, AlertCircle } from 'lucide-react-native';

export interface SchemaEditorProps {
  initialSchema?: any;
  onSchemaChange?: (schema: any) => void;
  onAction?: (action: string, params?: any) => void;
  onClose?: () => void;
  style?: any;
}

const DEFAULT_SAMPLE_SCHEMA = {
  root: 'pricing-card',
  elements: {
    'pricing-card': {
      type: 'PricingCard',
      props: {
        title: 'Pro Team Plan',
        description: 'Ideal for fast-scaling engineering teams & design system builders',
        price: '$49',
        period: '/month',
        popular: true,
        features: [
          'Unlimited AI Chat & reasoning prompts',
          'Full Generative UI Component Engine',
          'Multi-Model Switcher (GPT-4o, Claude, DeepSeek)',
          'High-res image generation & search attachments',
          'Dedicated enterprise support channel',
        ],
        buttonLabel: 'Upgrade to Pro Team',
      },
    },
  },
};

export function SchemaEditor({
  initialSchema = DEFAULT_SAMPLE_SCHEMA,
  onSchemaChange,
  onAction,
  onClose,
  style,
}: SchemaEditorProps) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');
  const [jsonText, setJsonText] = useState(() => JSON.stringify(initialSchema, null, 2));
  const [parsedSchema, setParsedSchema] = useState<any>(initialSchema);
  const [error, setError] = useState<string | null>(null);

  const cardBg = isDark ? '#141E33' : '#FFFFFF';
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const inputBg = isDark ? '#0B0F19' : '#F8FAFC';

  useEffect(() => {
    if (initialSchema) {
      setParsedSchema(initialSchema);
      setJsonText(JSON.stringify(initialSchema, null, 2));
      setError(null);
    }
  }, [initialSchema]);

  const handleJsonChange = (text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      setParsedSchema(parsed);
      setError(null);
      if (onSchemaChange) onSchemaChange(parsed);
    } catch (e: any) {
      setError(e.message || 'Invalid JSON syntax');
    }
  };

  return (
    <Card style={[{ backgroundColor: cardBg, borderColor, borderWidth: 1, borderRadius: 20 }, style]}>
      <CardHeader style={{ padding: 18, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Code size={18} color="#6366f1" />
          <CardTitle style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>
            Generative UI Schema Studio
          </CardTitle>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {/* Tab buttons */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
              borderRadius: 10,
              padding: 2,
            }}
          >
            <TouchableOpacity
              onPress={() => setActiveTab('preview')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: activeTab === 'preview' ? (isDark ? '#334155' : '#FFFFFF') : 'transparent',
              }}
            >
              <Eye size={13} color={activeTab === 'preview' ? '#6366f1' : textMuted} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: activeTab === 'preview' ? textPrimary : textMuted }}>
                Live Preview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('json')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: activeTab === 'json' ? (isDark ? '#334155' : '#FFFFFF') : 'transparent',
              }}
            >
              <Code size={13} color={activeTab === 'json' ? '#6366f1' : textMuted} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: activeTab === 'json' ? textPrimary : textMuted }}>
                JSON Editor
              </Text>
            </TouchableOpacity>
          </View>

          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
              }}
            >
              <X size={16} color={textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </CardHeader>

      <CardContent style={{ padding: 18, paddingTop: 6 }}>
        {activeTab === 'preview' ? (
          <View style={{ minHeight: 260, justifyContent: 'center' }}>
            {parsedSchema ? (
              <JsonRenderer schema={parsedSchema} onAction={onAction} />
            ) : (
              <Text style={{ color: textMuted, textAlign: 'center', fontSize: 13 }}>
                No valid schema to preview.
              </Text>
            )}
          </View>
        ) : (
          <View style={{ gap: 8 }}>
            <TextInput
              multiline
              value={jsonText}
              onChangeText={handleJsonChange}
              placeholder="Paste or write your JSON UI schema here..."
              placeholderTextColor={textMuted}
              style={{
                fontFamily: 'monospace',
                fontSize: 12,
                color: textPrimary,
                backgroundColor: inputBg,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: error ? '#ef4444' : borderColor,
                padding: 14,
                minHeight: 240,
                textAlignVertical: 'top',
                ...(Platform.OS === 'web' ? { outline: 'none', outlineStyle: 'none' } : {}),
              } as any}
            />

            {error && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={13} color="#ef4444" />
                <Text style={{ fontSize: 11, color: '#ef4444', fontWeight: '600' }}>
                  {error}
                </Text>
              </View>
            )}
          </View>
        )}
      </CardContent>
    </Card>
  );
}
