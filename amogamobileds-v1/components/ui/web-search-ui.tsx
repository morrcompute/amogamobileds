import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image as RNImage, Modal } from 'react-native';
import { Text } from './text';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Globe, ExternalLink, Image as ImageIcon, X, Sparkles } from 'lucide-react-native';

export interface WebSearchSource {
  title: string;
  url: string;
  content?: string;
}

export interface WebSearchUIProps {
  sources?: WebSearchSource[];
  images?: string[];
  loading?: boolean;
  onImageClick?: (url: string) => void;
  style?: any;
}

function getDomainName(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    return url.hostname.replace('www.', '');
  } catch {
    return 'Source';
  }
}

export function WebSearchUI({
  sources = [],
  images = [],
  loading = false,
  onImageClick,
  style,
}: WebSearchUIProps) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const [activeImage, setActiveImage] = useState<string | null>(null);

  const cardBg = isDark ? '#141E33' : '#FFFFFF';
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const tagBg = isDark ? '#1E293B' : '#F1F5F9';

  const handleImagePress = (url: string) => {
    setActiveImage(url);
    if (onImageClick) onImageClick(url);
  };

  if (loading) {
    return (
      <View
        style={[
          {
            padding: 16,
            borderRadius: 14,
            backgroundColor: isDark ? '#141E33' : '#F8FAFC',
            borderWidth: 1,
            borderColor,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          },
          style,
        ]}
      >
        <Globe size={18} color="#3b82f6" />
        <Text style={{ fontSize: 13, fontWeight: '600', color: textMuted }}>
          Searching the web across live sources...
        </Text>
      </View>
    );
  }

  const hasSources = sources && sources.length > 0;
  const hasImages = images && images.length > 0;

  if (!hasSources && !hasImages) return null;

  return (
    <View style={[{ gap: 16 }, style]}>
      {/* Sources Section */}
      {hasSources && (
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Globe size={14} color="#3b82f6" />
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Sources ({sources.length})
            </Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {sources.map((source, index) => {
              const domain = getDomainName(source.url);
              const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (typeof window !== 'undefined') {
                      window.open(source.url, '_blank');
                    }
                  }}
                  style={{
                    flex: 1,
                    minWidth: 160,
                    maxWidth: 240,
                    padding: 12,
                    borderRadius: 14,
                    backgroundColor: cardBg,
                    borderWidth: 1,
                    borderColor,
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ gap: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <RNImage
                        source={{ uri: faviconUrl }}
                        style={{ width: 14, height: 14, borderRadius: 2 }}
                      />
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 11, fontWeight: '600', color: textMuted, flex: 1 }}
                      >
                        {domain}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={2}
                      style={{ fontSize: 12, fontWeight: '700', color: textPrimary, lineHeight: 16 }}
                    >
                      {source.title || 'Source article'}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 4,
                      marginTop: 10,
                      paddingTop: 6,
                      borderTopWidth: 1,
                      borderTopColor: borderColor,
                    }}
                  >
                    <Text style={{ fontSize: 10, color: '#3b82f6', fontWeight: '600' }}>
                      Visit source
                    </Text>
                    <ExternalLink size={10} color="#3b82f6" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Related Images Section */}
      {hasImages && (
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <ImageIcon size={14} color="#8b5cf6" />
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Related Images ({images.length})
            </Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {images.slice(0, 4).map((imgUrl, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleImagePress(imgUrl)}
                style={{
                  width: 100,
                  height: 70,
                  borderRadius: 10,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor,
                  backgroundColor: tagBg,
                }}
              >
                <RNImage
                  source={{ uri: imgUrl }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Lightbox Modal */}
      {activeImage && (
        <Modal
          visible={!!activeImage}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveImage(null)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.85)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => setActiveImage(null)}
              style={{
                position: 'absolute',
                top: 40,
                right: 20,
                padding: 10,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 20,
                zIndex: 10,
              }}
            >
              <X size={20} color="#ffffff" />
            </TouchableOpacity>

            <RNImage
              source={{ uri: activeImage }}
              style={{ width: '90%', height: '70%', borderRadius: 16 }}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}
    </View>
  );
}
