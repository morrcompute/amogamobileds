import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Sliders, X } from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';
import {
  AppSettingsPagePreview,
  EmailSettingPreview,
  AiApiSettingPreview,
  ChatApiSettingPreview,
  FilesSettingPreview,
} from '../design-system/previews/AppSettingsPreviews';

export {
  AppSettingsPagePreview,
  EmailSettingPreview,
  AiApiSettingPreview,
  ChatApiSettingPreview,
  FilesSettingPreview,
};

export interface AppSettingsViewProps {
  onClose?: () => void;
  title?: string;
}

export function AppSettingsView({
  onClose,
  title = 'App Settings',
}: AppSettingsViewProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header with title and cross button on right */}
      {onClose && (
        <View
          style={[
            styles.header,
            {
              borderBottomColor: colors.border,
              backgroundColor: colors.card || colors.background,
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: isDark ? colors.primary + '20' : colors.primary + '15' },
              ]}
            >
              <Sliders size={17} color={colors.primary} strokeWidth={2.2} />
            </View>
            <Text
              style={[
                styles.headerTitle,
                { color: colors.foreground },
              ]}
            >
              {title}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={[
              styles.closeBtn,
              {
                backgroundColor: isDark ? '#27272a' : '#f1f5f9',
                borderColor: colors.border,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Close App Settings"
          >
            <X size={16} color={colors.mutedForeground} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      )}

      {/* Main Settings Page Component */}
      <View style={styles.body}>
        <AppSettingsPagePreview />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
