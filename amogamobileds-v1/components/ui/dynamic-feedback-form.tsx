import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Text } from './text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Star, Send, CheckCircle2, MessageSquare } from 'lucide-react-native';

export interface DynamicFeedbackFormProps {
  title?: string;
  description?: string;
  onSubmit?: (data: { name: string; email: string; rating: number; category: string; feedback: string }) => void;
  borderless?: boolean;
  style?: any;
}

const CATEGORIES = ['Feature Request', 'Bug Report', 'General Feedback', 'UI/UX Improvement'];

export function DynamicFeedbackForm({
  title = 'Send Product Feedback',
  description = 'Help us improve by rating your experience and sharing suggestions.',
  onSubmit,
  borderless = false,
  style,
}: DynamicFeedbackFormProps) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const cardBg = isDark ? '#141E33' : '#FFFFFF';
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const inputBg = isDark ? '#1E293B' : '#F8FAFC';

  const Container = borderless ? View : Card;
  const containerStyle = borderless
    ? [{ padding: 16, width: '100%' }, style]
    : [{ backgroundColor: cardBg, borderColor, borderWidth: 1, borderRadius: 20 }, style];

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ name, email, rating, category, feedback });
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Container style={containerStyle}>
        <View style={{ padding: borderless ? 12 : 32, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: 54,
              height: 54,
              borderRadius: 27,
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <CheckCircle2 size={32} color="#10b981" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: '800', color: textPrimary, textAlign: 'center', marginBottom: 6 }}>
            Thank You for Your Feedback!
          </Text>
          <Text style={{ fontSize: 13, color: textMuted, textAlign: 'center', lineHeight: 18, marginBottom: 20 }}>
            Your response has been recorded and will help our team design better experiences.
          </Text>
          <Button
            variant="outline"
            onPress={() => {
              setSubmitted(false);
              setFeedback('');
            }}
            style={{ borderRadius: 12 }}
          >
            Submit Another Response
          </Button>
        </View>
      </Container>
    );
  }

  return (
    <Container style={containerStyle}>
      <View style={{ padding: borderless ? 0 : 20, paddingBottom: 12 }}>
        <Text style={{ fontSize: 17, fontWeight: '800', color: textPrimary }}>
          {title}
        </Text>
        {description && (
          <Text style={{ fontSize: 12, color: textMuted, marginTop: 4 }}>
            {description}
          </Text>
        )}
      </View>

      <View style={{ padding: borderless ? 0 : 20, paddingTop: 0, gap: 16 }}>
        {/* Rating Stars */}
        <View>
          <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Overall Rating
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={{
                  padding: 8,
                  borderRadius: 10,
                  backgroundColor: star <= rating ? (isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7') : inputBg,
                }}
              >
                <Star
                  size={20}
                  color={star <= rating ? '#f59e0b' : textMuted}
                  fill={star <= rating ? '#f59e0b' : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Pills */}
        <View>
          <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Topic Category
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: active ? '#6366f1' : inputBg,
                    borderWidth: 1,
                    borderColor: active ? '#6366f1' : borderColor,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: active ? '#ffffff' : textPrimary }}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Inputs */}
        <View style={{ gap: 12 }}>
          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: textPrimary }}>Your Name</Text>
            <Input
              placeholder="Alex Morgan"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: textPrimary }}>Email Address</Text>
            <Input
              placeholder="alex@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: textPrimary }}>Feedback Details</Text>
            <TextInput
              placeholder="Describe your feedback, thoughts, or suggestions..."
              placeholderTextColor={textMuted}
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={4}
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor,
                backgroundColor: inputBg,
                color: textPrimary,
                padding: 12,
                fontSize: 13,
                minHeight: 80,
                textAlignVertical: 'top',
                // @ts-ignore
                outlineStyle: 'none',
                outlineWidth: 0,
              }}
            />
          </View>
        </View>

        {/* Submit */}
        <Button
          variant="default"
          onPress={handleSubmit}
          icon={Send}
          style={{ width: '100%', borderRadius: 12, marginTop: 4 }}
        >
          Submit Feedback
        </Button>
      </View>
    </Container>
  );
}
