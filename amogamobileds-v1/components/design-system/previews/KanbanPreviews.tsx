import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Kanban,
  User,
  MoreVertical,
  ChevronRight,
  Filter,
  Sparkles,
} from 'lucide-react-native';
import { useTheme } from '../../../providers/theme-provider';
import type { GalleryEntry } from '../../types';

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface KanbanTask {
  id: string;
  columnId: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assigneeId: string;
  createdAt: string;
}

const MOCK_ASSIGNEES: Assignee[] = [
  { id: '1', name: 'Mohammad Aman', avatar: 'MA', color: '#10b981' },
  { id: '2', name: 'Sarah Anderson', avatar: 'SA', color: '#3b82f6' },
  { id: '3', name: 'John Doe', avatar: 'JD', color: '#f59e0b' },
  { id: '4', name: 'Oliver Smith', avatar: 'OS', color: '#8b5cf6' },
];

const INITIAL_COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', order: 0 },
  { id: 'in-progress', title: 'In Progress', order: 1 },
  { id: 'review', title: 'Under Review', order: 2 },
  { id: 'done', title: 'Completed', order: 3 },
];

const INITIAL_TASKS: KanbanTask[] = [
  {
    id: 't1',
    columnId: 'todo',
    title: 'Implement OAuth Authentication',
    description: 'Integrate Google and GitHub authentication into the main sign-in page.',
    priority: 'HIGH',
    assigneeId: '2',
    createdAt: 'Aug 20, 2026',
  },
  {
    id: 't2',
    columnId: 'in-progress',
    title: 'Design Landing Page Hero Section',
    description: 'Build a premium glassmorphic hero section with micro-animations.',
    priority: 'MEDIUM',
    assigneeId: '1',
    createdAt: 'Aug 19, 2026',
  },
  {
    id: 't3',
    columnId: 'review',
    title: 'WooCommerce API Proxy Integration',
    description: 'Configure backend serverless proxy routes to securely query store products.',
    priority: 'HIGH',
    assigneeId: '4',
    createdAt: 'Aug 18, 2026',
  },
  {
    id: 't4',
    columnId: 'done',
    title: 'Setup Expo & Next.js Architecture',
    description: 'Initialize universal repository with full theme and token support.',
    priority: 'LOW',
    assigneeId: '3',
    createdAt: 'Aug 15, 2026',
  },
];

// =========================================================================
// 1. COMPLETE KANBAN BOARD PREVIEW
// =========================================================================

export function CompleteKanbanBoardPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState('todo');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [newAssigneeId, setNewAssigneeId] = useState('1');

  const getPriorityColors = (priority: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (priority) {
      case 'HIGH':
        return { bg: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2', text: '#ef4444', border: '#fca5a5' };
      case 'MEDIUM':
        return { bg: isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7', text: '#d97706', border: '#fde68a' };
      case 'LOW':
        return { bg: isDark ? 'rgba(16, 185, 129, 0.2)' : '#dcfce7', text: '#10b981', border: '#86efac' };
    }
  };

  const handleMoveTask = (taskId: string, direction: 'next' | 'prev') => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentIdx = columns.findIndex((c) => c.id === t.columnId);
        const nextIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;
        if (nextIdx >= 0 && nextIdx < columns.length) {
          return { ...t, columnId: columns[nextIdx].id };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleCreateTask = () => {
    if (!newTitle.trim()) return;
    const newTask: KanbanTask = {
      id: `t-${Date.now()}`,
      columnId: targetColumnId,
      title: newTitle.trim(),
      description: newDesc.trim() || 'No description provided.',
      priority: newPriority,
      assigneeId: newAssigneeId,
      createdAt: 'Just now',
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setIsNewTaskModalOpen(false);
  };

  const filteredTasks = tasks.filter((t) => activeFilter === 'ALL' || t.priority === activeFilter);

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.kanbanContainer,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {/* Board Top Header */}
        <View style={[styles.boardHeader, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.boardIconBox,
                { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#f3e8ff' },
              ]}
            >
              <Kanban size={18} color="#8b5cf6" />
            </View>
            <View>
              <Text style={[styles.boardTitle, { color: colors.foreground }]}>
                Sprint Agile Board
              </Text>
              <Text style={[styles.boardSubtitle, { color: colors.mutedForeground }]}>
                Track tasks across lifecycle stages
              </Text>
            </View>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterPillsRow}>
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                style={[
                  styles.filterPill,
                  activeFilter === f
                    ? { backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }
                    : { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: activeFilter === f ? '#ffffff' : colors.mutedForeground },
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Columns Horizontal ScrollView */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.columnsScroll}
        >
          {columns.map((col, colIdx) => {
            const colTasks = filteredTasks.filter((t) => t.columnId === col.id);

            return (
              <View
                key={col.id}
                style={[
                  styles.columnCard,
                  {
                    backgroundColor: isDark ? '#18181b' : '#f8fafc',
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Column Header */}
                <View style={styles.columnHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[styles.columnTitle, { color: colors.foreground }]}>
                      {col.title}
                    </Text>
                    <View
                      style={[
                        styles.taskCountBadge,
                        { backgroundColor: isDark ? '#27272a' : '#e2e8f0' },
                      ]}
                    >
                      <Text style={[styles.taskCountText, { color: colors.foreground }]}>
                        {colTasks.length}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      setTargetColumnId(col.id);
                      setIsNewTaskModalOpen(true);
                    }}
                    style={[
                      styles.addIconBtn,
                      { backgroundColor: isDark ? colors.card : '#ffffff', borderColor: colors.border },
                    ]}
                  >
                    <Plus size={13} color={colors.foreground} />
                  </TouchableOpacity>
                </View>

                {/* Tasks List */}
                <View style={styles.tasksList}>
                  {colTasks.map((t) => {
                    const priorityColor = getPriorityColors(t.priority);
                    const assignee = MOCK_ASSIGNEES.find((a) => a.id === t.assigneeId) || MOCK_ASSIGNEES[0];

                    return (
                      <View
                        key={t.id}
                        style={[
                          styles.taskCard,
                          {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        {/* Task Priority & Actions */}
                        <View style={styles.taskCardTopRow}>
                          <View
                            style={[
                              styles.priorityBadge,
                              {
                                backgroundColor: priorityColor.bg,
                                borderColor: priorityColor.border,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.priorityBadgeText,
                                { color: priorityColor.text },
                              ]}
                            >
                              {t.priority}
                            </Text>
                          </View>

                          <View style={{ flexDirection: 'row', gap: 4 }}>
                            {colIdx > 0 && (
                              <TouchableOpacity
                                onPress={() => handleMoveTask(t.id, 'prev')}
                                style={styles.moveBtn}
                              >
                                <Text style={{ fontSize: 10, color: colors.mutedForeground }}>◀</Text>
                              </TouchableOpacity>
                            )}
                            {colIdx < columns.length - 1 && (
                              <TouchableOpacity
                                onPress={() => handleMoveTask(t.id, 'next')}
                                style={styles.moveBtn}
                              >
                                <Text style={{ fontSize: 10, color: '#8b5cf6' }}>▶</Text>
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity
                              onPress={() => handleDeleteTask(t.id)}
                              style={styles.deleteBtn}
                            >
                              <Trash2 size={12} color="#ef4444" />
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Title & Description */}
                        <Text
                          style={[styles.taskTitleText, { color: colors.foreground }]}
                          numberOfLines={2}
                        >
                          {t.title}
                        </Text>
                        <Text
                          style={[styles.taskDescText, { color: colors.mutedForeground }]}
                          numberOfLines={2}
                        >
                          {t.description}
                        </Text>

                        {/* Footer: Date & Assignee Avatar */}
                        <View
                          style={[
                            styles.taskFooterRow,
                            { borderTopColor: isDark ? '#27272a' : '#f1f5f9' },
                          ]}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Calendar size={11} color={colors.mutedForeground} />
                            <Text style={[styles.taskDateText, { color: colors.mutedForeground }]}>
                              {t.createdAt}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.assigneeAvatar,
                              { backgroundColor: assignee.color },
                            ]}
                          >
                            <Text style={styles.assigneeAvatarText}>
                              {assignee.avatar}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}

                  {colTasks.length === 0 && (
                    <View style={styles.emptyColBox}>
                      <Text style={[styles.emptyColText, { color: colors.mutedForeground }]}>
                        No tasks in {col.title.toLowerCase()}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Modal for Creating New Task */}
        <Modal
          visible={isNewTaskModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsNewTaskModalOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.modalCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  Create New Task
                </Text>
                <TouchableOpacity onPress={() => setIsNewTaskModalOpen(false)}>
                  <X size={18} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>

              <View style={{ gap: 12, paddingVertical: 10 }}>
                <View style={{ gap: 4 }}>
                  <Text style={[styles.inputLabel, { color: colors.foreground }]}>Task Title</Text>
                  <TextInput
                    value={newTitle}
                    onChangeText={setNewTitle}
                    placeholder="e.g. Optimize API Response times"
                    placeholderTextColor={colors.mutedForeground}
                    style={[
                      styles.textInput,
                      { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground },
                    ]}
                  />
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={[styles.inputLabel, { color: colors.foreground }]}>Description</Text>
                  <TextInput
                    value={newDesc}
                    onChangeText={setNewDesc}
                    placeholder="Provide details..."
                    placeholderTextColor={colors.mutedForeground}
                    multiline
                    style={[
                      styles.textInput,
                      { height: 70, backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground },
                    ]}
                  />
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={[styles.inputLabel, { color: colors.foreground }]}>Priority</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {(['LOW', 'MEDIUM', 'HIGH'] as const).map((p) => (
                      <TouchableOpacity
                        key={p}
                        onPress={() => setNewPriority(p)}
                        style={[
                          styles.prioritySelectBtn,
                          newPriority === p
                            ? { backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }
                            : { backgroundColor: colors.background, borderColor: colors.border },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: '700',
                            color: newPriority === p ? '#ffffff' : colors.foreground,
                          }}
                        >
                          {p}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  onPress={() => setIsNewTaskModalOpen(false)}
                  style={[styles.cancelBtn, { borderColor: colors.border }]}
                >
                  <Text style={{ fontSize: 12, color: colors.foreground, fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCreateTask}
                  style={[styles.submitBtn, { backgroundColor: '#8b5cf6' }]}
                >
                  <Text style={{ fontSize: 12, color: '#ffffff', fontWeight: '700' }}>Add Task</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

// =========================================================================
// 2. TASK CARD ITEM PREVIEW (SIDEBAR ITEM)
// =========================================================================

export function TaskCardItemPreview({ isSelected = true }: { isSelected?: boolean }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.sidebarTaskCard,
          isSelected
            ? {
                backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#f3e8ff',
                borderColor: '#8b5cf6',
              }
            : {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
        ]}
      >
        <View style={styles.sidebarTaskTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={[
                styles.sidebarIconBox,
                { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.25)' : '#e9d5ff' },
              ]}
            >
              <Kanban size={14} color="#8b5cf6" />
            </View>
            <Text style={[styles.sidebarTaskTitle, { color: colors.foreground }]}>
              Sprint Sprint 14 Board
            </Text>
          </View>
          <View
            style={[
              styles.sidebarActivePill,
              { backgroundColor: '#10b981' },
            ]}
          />
        </View>

        <Text style={[styles.sidebarTaskSub, { color: colors.mutedForeground }]}>
          4 columns • 12 active tasks in progress
        </Text>

        <View style={styles.sidebarTaskMetaRow}>
          <View style={styles.sidebarBadge}>
            <Text style={styles.sidebarBadgeText}>AGILE KANBAN</Text>
          </View>
          <Text style={{ fontSize: 10.5, color: colors.mutedForeground }}>
            Aug 15 - Aug 29
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// =========================================================================
// COMBINED KANBAN PREVIEWS
// =========================================================================

export function KanbanPreviews({ entry }: { entry?: GalleryEntry }) {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <CompleteKanbanBoardPreview />
      <View style={{ height: 24 }} />
      <TaskCardItemPreview isSelected={true} />
    </ScrollView>
  );
}

// =========================================================================
// STYLES
// =========================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    padding: 4,
  },
  kanbanContainer: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  boardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    flexWrap: 'wrap',
    gap: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  boardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  boardSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  columnsScroll: {
    flexDirection: 'row',
    padding: 16,
    gap: 14,
  },
  columnCard: {
    width: 250,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  columnTitle: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  taskCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  taskCountText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  addIconBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tasksList: {
    gap: 10,
  },
  taskCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  taskCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  priorityBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  moveBtn: {
    padding: 2,
  },
  deleteBtn: {
    padding: 2,
  },
  taskTitleText: {
    fontSize: 12.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    lineHeight: 16,
  },
  taskDescText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    lineHeight: 15,
  },
  taskFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  taskDateText: {
    fontSize: 10,
    fontFamily: 'Open Sans',
  },
  assigneeAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assigneeAvatarText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  emptyColBox: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyColText: {
    fontSize: 11,
    fontStyle: 'italic',
    fontFamily: 'Open Sans',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  textInput: {
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  prioritySelectBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 10,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  submitBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  sidebarTaskCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  sidebarTaskTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidebarIconBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarTaskTitle: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  sidebarActivePill: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  sidebarTaskSub: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
  },
  sidebarTaskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  sidebarBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 4,
  },
  sidebarBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#8b5cf6',
  },
});
