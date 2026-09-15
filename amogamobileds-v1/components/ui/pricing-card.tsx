import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Check, Sparkles } from 'lucide-react-native';

export interface PricingCardProps {
  title: string;
  description?: string;
  price: string;
  period?: string;
  features: string[];
  popular?: boolean;
  buttonLabel?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary';
  onSelect?: () => void;
  style?: any;
}

export function PricingCard({
  title,
  description,
  price,
  period = '/month',
  features = [],
  popular = false,
  buttonLabel = 'Get Started',
  buttonVariant = 'default',
  onSelect,
  style,
}: PricingCardProps) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? '#141E33' : '#FFFFFF';
  const borderColor = popular
    ? '#6366f1'
    : isDark
    ? '#1E293B'
    : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';

  return (
    <Card
      style={[
        {
          backgroundColor: cardBg,
          borderColor,
          borderWidth: popular ? 2 : 1,
          borderRadius: 20,
          position: 'relative',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {popular && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: '#6366f1',
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderBottomLeftRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Sparkles size={11} color="#ffffff" />
          <Text style={{ fontSize: 10, fontWeight: '800', color: '#ffffff', letterSpacing: 0.5 }}>
            MOST POPULAR
          </Text>
        </View>
      )}

      <CardHeader style={{ padding: 24, paddingBottom: 16 }}>
        <CardTitle style={{ fontSize: 20, fontWeight: '800', color: textPrimary }}>
          {title}
        </CardTitle>
        {description && (
          <CardDescription style={{ fontSize: 13, color: textMuted, marginTop: 4 }}>
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        {/* Price Row */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
          <Text style={{ fontSize: 36, fontWeight: '900', color: textPrimary, letterSpacing: -1 }}>
            {price}
          </Text>
          {period && (
            <Text style={{ fontSize: 14, fontWeight: '600', color: textMuted }}>
              {period}
            </Text>
          )}
        </View>

        {/* Features list */}
        <View style={{ gap: 12, marginBottom: 24 }}>
          {features.map((feature, idx) => (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check size={12} color="#6366f1" />
              </View>
              <Text style={{ fontSize: 13, color: textPrimary, flex: 1 }}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {/* Action button */}
        <Button
          variant={popular ? 'default' : buttonVariant}
          onPress={onSelect}
          style={{ width: '100%', borderRadius: 12 }}
        >
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

export function FeatureList({ features = [] }: { features: string[] }) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';

  return (
    <View style={{ gap: 10 }}>
      {features.map((feat, idx) => (
        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Check size={14} color="#10b981" />
          <Text style={{ fontSize: 13, color: textPrimary }}>{feat}</Text>
        </View>
      ))}
    </View>
  );
}
