import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './text';
import { Card, CardContent } from './card';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Badge } from './badge';
import { Button } from './button';
import { useColorScheme } from '../../hooks/useColorScheme';
import { CheckCircle2, MapPin, Calendar, Mail, MessageSquare, UserPlus, Sparkles } from 'lucide-react-native';

export interface UserProfileCardProps {
  name: string;
  handle?: string;
  role?: string;
  avatarUrl?: string;
  fallback?: string;
  bio?: string;
  location?: string;
  joined?: string;
  verified?: boolean;
  stats?: {
    label: string;
    value: string | number;
  }[];
  onFollow?: () => void;
  onMessage?: () => void;
  style?: any;
}

export function UserProfileCard({
  name,
  handle = '@designer',
  role = 'Lead Design Systems Engineer',
  avatarUrl,
  fallback = 'US',
  bio = 'Building world-class mobile & generative UI component design systems with React Native and Expo.',
  location = 'San Francisco, CA',
  joined = 'Joined March 2024',
  verified = true,
  stats = [
    { label: 'Projects', value: 34 },
    { label: 'Followers', value: '14.2k' },
    { label: 'Following', value: 480 },
  ],
  onFollow,
  onMessage,
  style,
}: UserProfileCardProps) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? '#141E33' : '#FFFFFF';
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const statBg = isDark ? '#1E293B' : '#F8FAFC';

  return (
    <Card style={[{ backgroundColor: cardBg, borderColor, borderWidth: 1, borderRadius: 20 }, style]}>
      <CardContent style={{ padding: 20 }}>
        {/* Header with Avatar and Basic Info */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <Avatar size={64}>
            {avatarUrl ? <AvatarImage source={{ uri: avatarUrl }} /> : null}
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: textPrimary }}>
                {name}
              </Text>
              {verified && <CheckCircle2 size={16} color="#3b82f6" />}
            </View>
            <Text style={{ fontSize: 13, color: '#6366f1', fontWeight: '600', marginTop: 1 }}>
              {handle}
            </Text>
            <Text style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>
              {role}
            </Text>
          </View>
        </View>

        {/* Bio */}
        {bio && (
          <Text style={{ fontSize: 13, color: textPrimary, lineHeight: 19, marginBottom: 16 }}>
            {bio}
          </Text>
        )}

        {/* Meta info: Location and Join Date */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          {location && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MapPin size={13} color={textMuted} />
              <Text style={{ fontSize: 12, color: textMuted }}>{location}</Text>
            </View>
          )}
          {joined && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Calendar size={13} color={textMuted} />
              <Text style={{ fontSize: 12, color: textMuted }}>{joined}</Text>
            </View>
          )}
        </View>

        {/* Stats Row */}
        {stats.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              borderRadius: 14,
              backgroundColor: statBg,
              borderWidth: 1,
              borderColor,
              paddingVertical: 12,
              marginBottom: 18,
            }}
          >
            {stats.map((s, idx) => (
              <View
                key={idx}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  borderRightWidth: idx < stats.length - 1 ? 1 : 0,
                  borderRightColor: borderColor,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>
                  {s.value}
                </Text>
                <Text style={{ fontSize: 11, color: textMuted, marginTop: 2, fontWeight: '500' }}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            variant="default"
            onPress={onFollow}
            style={{ flex: 1, borderRadius: 12 }}
            icon={UserPlus}
          >
            Follow
          </Button>
          <Button
            variant="outline"
            onPress={onMessage}
            style={{ flex: 1, borderRadius: 12 }}
            icon={MessageSquare}
          >
            Message
          </Button>
        </View>
      </CardContent>
    </Card>
  );
}
