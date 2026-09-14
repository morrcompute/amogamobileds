import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import {
  Calendar as CalendarIcon,
  Search,
  ChevronLeft,
  CalendarDays,
  X,
} from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';
import { FullPageCalendar, CalendarViewMode, CalendarEventItem } from './full-page-calendar';
import defaultTasksData from './calendar-tasks.json';

export type CalendarTabType = 'today' | 'week' | 'month' | 'year';

export interface CalendarTaskAttendee {
  id: string;
  name: string;
  avatar?: string;
}

export interface CalendarTaskItem {
  id: string;
  title: string;
  description?: string;
  tab: CalendarTabType | string;
  date: string;
  startTime: string;
  endTime: string;
  category: 'Design' | 'Meeting' | 'Dev' | 'Work' | string;
  categoryColor?: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low' | string;
  status?: string;
  location?: string;
  completed: boolean;
  calendarViewMode?: CalendarViewMode;
  attendees?: CalendarTaskAttendee[];
}

export interface CalendarAppViewProps {
  initialTab?: CalendarTabType;
  onOpenDrawer?: () => void;
  onClose?: () => void;
  showMobileHeader?: boolean;
  rightOverlayView?: React.ReactNode;
  onCloseRightPane?: () => void;
}

const TABS: { id: CalendarTabType; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
];

export function CalendarAppView({
  initialTab = 'today',
  onOpenDrawer,
  onClose,
  showMobileHeader = true,
  rightOverlayView,
  onCloseRightPane,
}: CalendarAppViewProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [activeTab, setActiveTab] = useState<CalendarTabType>(initialTab);
  const [tasks, setTasks] = useState<CalendarTaskItem[]>(defaultTasksData as CalendarTaskItem[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    (defaultTasksData as CalendarTaskItem[])[0]?.id || 'task-today-1'
  );

  // Calendar sync state
  const [calendarViewMode, setCalendarViewMode] = useState<CalendarViewMode>('day');
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 8, 12));
  const [isMobileCalendarOpen, setIsMobileCalendarOpen] = useState(false);

  // Filter tasks by active tab and search
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchTab = task.tab === activeTab;
      const matchSearch =
        !searchQuery.trim() ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.location && task.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.category && task.category.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchTab && matchSearch;
    });
  }, [tasks, activeTab, searchQuery]);

  // Handle task selection
  const handleSelectTask = useCallback(
    (task: CalendarTaskItem) => {
      setSelectedTaskId(task.id);

      // Map tab & task to matching calendar view mode
      let targetMode: CalendarViewMode = 'day';
      if (task.calendarViewMode) {
        targetMode = task.calendarViewMode;
      } else if (activeTab === 'today') {
        targetMode = 'day';
      } else if (activeTab === 'week') {
        targetMode = 'week';
      } else if (activeTab === 'month') {
        targetMode = 'month';
      } else if (activeTab === 'year') {
        targetMode = 'agenda';
      }

      setCalendarViewMode(targetMode);

      // Parse task date (YYYY-MM-DD)
      if (task.date) {
        const parts = task.date.split('-').map(Number);
        if (parts.length === 3) {
          setCalendarDate(new Date(parts[0], parts[1] - 1, parts[2]));
        }
      }

      if (isMobile) {
        setIsMobileCalendarOpen(true);
      }
    },
    [activeTab, isMobile]
  );

  // Handle tab change
  const handleTabChange = useCallback((tab: CalendarTabType) => {
    setActiveTab(tab);
    if (tab === 'today') {
      setCalendarViewMode('day');
      setCalendarDate(new Date(2026, 8, 12));
    } else if (tab === 'week') {
      setCalendarViewMode('week');
      setCalendarDate(new Date(2026, 8, 14));
    } else if (tab === 'month') {
      setCalendarViewMode('month');
      setCalendarDate(new Date(2026, 8, 1));
    } else if (tab === 'year') {
      setCalendarViewMode('agenda');
      setCalendarDate(new Date(2026, 8, 12));
    }
  }, []);

  // Convert tasks to calendar events
  const calendarEvents = useMemo<CalendarEventItem[]>(() => {
    return tasks.map((t) => {
      const dateStr = t.date || '2026-09-12';
      let startHour = 9;
      if (t.startTime.includes('10')) startHour = 10;
      else if (t.startTime.includes('11')) startHour = 11;
      else if (t.startTime.includes('12')) startHour = 12;
      else if (t.startTime.includes('01') || t.startTime.includes('1:')) startHour = 13;
      else if (t.startTime.includes('02') || t.startTime.includes('2:')) startHour = 14;
      else if (t.startTime.includes('03') || t.startTime.includes('3:')) startHour = 15;
      else if (t.startTime.includes('04') || t.startTime.includes('4:')) startHour = 16;
      else if (t.startTime.includes('05') || t.startTime.includes('5:')) startHour = 17;

      const pad = (n: number) => n.toString().padStart(2, '0');
      const startIso = `${dateStr}T${pad(startHour)}:00:00`;
      const endIso = `${dateStr}T${pad(startHour + 1)}:30:00`;

      return {
        id: t.id,
        title: t.title,
        description: t.description,
        start: startIso,
        end: endIso,
        color: t.categoryColor || '#3b82f6',
        category: (t.category as any) || 'Work',
        location: t.location,
        attendees: t.attendees?.map((a) => a.name) || [],
      };
    });
  }, [tasks]);

  const activeTextColor = isDark ? '#a5b4fc' : '#4f46e5';
  const indicatorColor = isDark ? '#818cf8' : '#4f46e5';
  const sectionLabelText =
    activeTab === 'today'
      ? 'TODAY'
      : activeTab === 'week'
      ? 'THIS WEEK'
      : activeTab === 'month'
      ? 'MONTH'
      : 'YEAR';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ──────────────── LEFT SIDE: Exact Chat Sidebar UI Style ──────────────── */}
      {(!isMobile || !isMobileCalendarOpen) && (
        <View
          style={[
            styles.sidebarContainer,
            {
              width: isMobile ? '100%' : 320,
              backgroundColor: colors.background,
              borderRightColor: colors.border,
            },
          ]}
        >
          {/* 1. Top Subtabs (Today, This Week, Month, Year) with Active Underline */}
          <View
            style={[
              styles.tabsRow,
              { borderBottomColor: isDark ? colors.border : '#f1f5f9' },
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsScrollContent}
            >
              {TABS.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <Pressable
                    key={tab.id}
                    onPress={() => handleTabChange(tab.id)}
                    style={styles.tabBtn}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text
                      style={[
                        styles.tabLabel,
                        {
                          color: isSelected ? activeTextColor : colors.mutedForeground,
                          fontWeight: isSelected ? '500' : '400',
                        },
                      ]}
                    >
                      {tab.label}
                    </Text>
                    {isSelected && (
                      <View
                        style={[
                          styles.activeIndicator,
                          { backgroundColor: indicatorColor },
                        ]}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* 2. Rounded Search Bar */}
          <View style={styles.searchSection}>
            <View
              style={[
                styles.searchWrapper,
                {
                  backgroundColor: isDark ? colors.card : colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Search
                size={14}
                color={colors.mutedForeground}
                strokeWidth={2}
                style={styles.searchIcon}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search..."
                placeholderTextColor={colors.mutedForeground}
                style={[styles.searchInput, { color: colors.foreground }]}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* 3. Category Section Header (🗓️ SECTION_LABEL ─────────── Count) */}
          <View style={styles.sectionHeader}>
            <CalendarIcon
              size={14}
              color={isDark ? '#34d399' : '#059669'}
              strokeWidth={2.2}
            />
            <Text
              style={[
                styles.sectionLabel,
                { color: colors.mutedForeground },
              ]}
            >
              {sectionLabelText}
            </Text>
            <View
              style={[
                styles.sectionDivider,
                { backgroundColor: isDark ? colors.border : '#e2e8f0' },
              ]}
            />
            <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
              {filteredTasks.length}
            </Text>
          </View>

          {/* 4. Scrollable Task Cards (Exact ChatCardItem Style) */}
          <ScrollView
            style={styles.listScrollView}
            contentContainerStyle={styles.listScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredTasks.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={{ color: colors.mutedForeground, fontSize: 13, textAlign: 'center' }}>
                  No tasks found in {sectionLabelText}
                </Text>
              </View>
            ) : (
              filteredTasks.map((task) => {
                const isActive = task.id === selectedTaskId;
                return (
                  <Pressable
                    key={task.id}
                    onPress={() => handleSelectTask(task)}
                    style={({ pressed }) => [
                      styles.card,
                      isActive
                        ? {
                            backgroundColor: isDark
                              ? 'rgba(99, 102, 241, 0.16)'
                              : '#eef2ff',
                            borderColor: isDark
                              ? 'rgba(99, 102, 241, 0.4)'
                              : 'rgba(199, 210, 254, 0.8)',
                          }
                        : {
                            backgroundColor: pressed
                              ? isDark
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(0, 0, 0, 0.03)'
                              : 'transparent',
                            borderColor: 'transparent',
                          },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                  >
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <View
                        style={[
                          styles.indicatorBar,
                          { backgroundColor: indicatorColor },
                        ]}
                      />
                    )}

                    {/* Row 1: Title, Category Badge, Time */}
                    <View style={styles.headerRow}>
                      <View style={styles.titleWithBadge}>
                        <Text
                          style={[
                            styles.titleText,
                            {
                              color: colors.foreground,
                              fontWeight: isActive ? '600' : '500',
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {task.title}
                        </Text>

                        {task.category ? (
                          <View
                            style={[
                              styles.badge,
                              {
                                backgroundColor: isDark
                                  ? 'rgba(16, 185, 129, 0.18)'
                                  : 'rgba(16, 185, 129, 0.12)',
                                borderColor: isDark
                                  ? 'rgba(16, 185, 129, 0.35)'
                                  : 'rgba(167, 243, 208, 0.8)',
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.badgeText,
                                { color: isDark ? '#34d399' : '#059669' },
                              ]}
                            >
                              {task.category}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      {task.startTime ? (
                        <Text
                          style={[styles.timeText, { color: colors.mutedForeground }]}
                          numberOfLines={1}
                        >
                          {task.startTime}
                        </Text>
                      ) : null}
                    </View>

                    {/* Row 2: Description Snippet */}
                    {task.description ? (
                      <Text
                        style={[styles.lastMessageText, { color: colors.mutedForeground }]}
                        numberOfLines={1}
                      >
                        {task.description}
                      </Text>
                    ) : null}
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </View>
      )}

      {/* ──────────────── RIGHT SIDE: Full Page Calendar / Overlay View ──────────────── */}
      {(!isMobile || isMobileCalendarOpen) && (
        <View
          style={[
            styles.rightCalendarArea,
            {
              borderLeftWidth: !isMobile ? 1 : 0,
              borderLeftColor: colors.border,
              backgroundColor: colors.background,
            },
          ]}
        >
          {rightOverlayView ? (
            rightOverlayView
          ) : (
            <>
              {/* Right Viewport Top Header Bar: "My Calendar" + [X] Close Cross */}
              <View
                style={[
                  styles.rightHeaderBar,
                  {
                    backgroundColor: colors.card || colors.background,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                {isMobile ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setIsMobileCalendarOpen(false)}
                    style={styles.mobileBackBtn}
                  >
                    <ChevronLeft size={20} color={colors.foreground} />
                    <Text style={[styles.rightHeaderTitle, { color: colors.foreground }]}>
                      My Calendar
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.rightHeaderLeft}>
                    <Text style={[styles.rightHeaderTitle, { color: colors.foreground }]}>
                      My Calendar
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    if (isMobile) {
                      setIsMobileCalendarOpen(false);
                    }
                    if (onCloseRightPane) {
                      onCloseRightPane();
                    } else if (onClose) {
                      onClose();
                    }
                  }}
                  style={styles.rightHeaderCloseBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Close My Calendar"
                >
                  <X size={16} color={colors.mutedForeground} strokeWidth={2} />
                </TouchableOpacity>
              </View>

              <View style={styles.calendarWrapper}>
                <FullPageCalendar
                  key={`${calendarViewMode}-${calendarDate.toISOString()}`}
                  initialDate={calendarDate}
                  initialViewMode={calendarViewMode}
                  events={calendarEvents}
                />
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
  sidebarContainer: {
    height: '100%',
    borderRightWidth: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tabsRow: {
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  tabsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  tabBtn: {
    position: 'relative',
    paddingBottom: 8,
    paddingHorizontal: 2,
  },
  tabLabel: {
    fontSize: 13,
    fontFamily: 'Open Sans',
    letterSpacing: -0.1,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },
  searchSection: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchWrapper: {
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 8,
  },
  searchIcon: {
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        outlineWidth: 0,
        outline: 'none',
        boxShadow: 'none',
      } as any,
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 4,
    gap: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionDivider: {
    flex: 1,
    height: 1,
  },
  sectionCount: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    fontWeight: '600',
    marginLeft: 2,
  },
  listScrollView: {
    flex: 1,
  },
  listScrollContent: {
    paddingHorizontal: 8,
    paddingBottom: 16,
    gap: 4,
  },
  card: {
    position: 'relative',
    flexDirection: 'column',
    gap: 4,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  indicatorBar: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3.5,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  titleText: {
    fontSize: 13.5,
    fontFamily: 'Open Sans',
    letterSpacing: -0.2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 9999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  lastMessageText: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    marginTop: 2,
    lineHeight: 16,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightCalendarArea: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  rightHeaderBar: {
    height: 52,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  rightHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rightHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    letterSpacing: -0.3,
  },
  rightHeaderCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileCalendarTopBar: {
    height: 48,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  mobileBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  mobileBackBtnText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  mobileCalendarTopTitle: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    paddingRight: 8,
  },
  calendarWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
});
