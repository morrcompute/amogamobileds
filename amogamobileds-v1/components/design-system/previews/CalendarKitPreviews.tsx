import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  FullPageCalendar,
  DEFAULT_CALENDAR_EVENTS,
  DEFAULT_CALENDAR_RESOURCES,
  type CalendarEventItem,
  type CalendarResourceItem,
  type CalendarViewMode,
} from '../../ui/full-page-calendar';
import {
  CalendarAppView,
  type CalendarTabType,
  type CalendarTaskItem,
} from '../../ui/calendar-app-view';
import type { GalleryEntry } from '../../types';

export {
  DEFAULT_CALENDAR_EVENTS,
  DEFAULT_CALENDAR_RESOURCES,
  type CalendarEventItem,
  type CalendarResourceItem,
  type CalendarViewMode,
  type CalendarTabType,
  type CalendarTaskItem,
};

interface CalendarKitPreviewsProps {
  entry?: GalleryEntry;
}

export function CalendarKitPreviews({ entry }: CalendarKitPreviewsProps) {
  return (
    <View style={styles.previewContainer}>
      <FullPageCalendar
        initialDate={new Date(2026, 8, 12)}
        initialViewMode="week"
        events={DEFAULT_CALENDAR_EVENTS}
        resources={DEFAULT_CALENDAR_RESOURCES}
        height="100%"
      />
    </View>
  );
}

export function CalendarAppPreview({ entry }: CalendarKitPreviewsProps) {
  return (
    <View style={styles.previewContainer}>
      <CalendarAppView initialTab="today" />
    </View>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    width: '100%',
    height: '100%',
    flex: 1,
    minHeight: 620,
    borderRadius: 0,
    overflow: 'hidden',
  },
});

