import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Platform,
  useWindowDimensions,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {
  Mail,
  Send,
  FileText,
  Trash2,
  Paperclip,
  Reply,
  Forward,
  ReplyAll,
  Search,
  Check,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Flag,
  Bell,
  Settings2,
  Calendar,
  MessageSquare,
  Sparkles,
  Bot,
  Link2,
  Image as ImageIcon,
  List,
  ListOrdered,
  Download,
  Eye,
  Star,
  ArrowLeft,
  ChevronDown,
  Bookmark,
  Save,
  RefreshCw,
} from 'lucide-react-native';
import { Skeleton } from './skeleton';
import { useTheme } from '../../providers/theme-provider';
import defaultEmailsData from './email-messages.json';
import {
  fetchLiveInbox,
  fetchLiveSent,
  sendLiveEmail,
  getActiveEmailConfig,
} from './email-client';

export type EmailTabType = 'Inbox' | 'Sent' | 'Folder' | 'Contact' | 'Groups';

export interface EmailAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
}

export interface EmailMessageItem {
  id: string;
  tab: string;
  name: string;
  email: string;
  avatarInitials: string;
  avatarBg: string;
  avatarColor: string;
  subject: string;
  dateStr: string;
  relativeTime: string;
  read: boolean;
  unreadDot: boolean;
  badges: string[];
  badgeColor?: string;
  headerTitle?: string;
  intro: string;
  highlights?: string[];
  bulletItems?: { text: string; icon: string }[];
  closing?: string;
  senderSignoff?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAppViewProps {
  initialTab?: EmailTabType;
  onOpenDrawer?: () => void;
  onClose?: () => void;
  showMobileHeader?: boolean;
  rightOverlayView?: React.ReactNode;
  onCloseRightPane?: () => void;
  onViewStateChange?: (state: { isDetailOpen: boolean; isComposing: boolean }) => void;
}

const TABS: EmailTabType[] = ['Inbox', 'Sent', 'Folder', 'Contact', 'Groups'];

function EmailCardSkeleton({ isDark, borderColor }: { isDark: boolean; borderColor: string }) {
  const skelBg = isDark ? 'rgba(148, 163, 184, 0.22)' : 'rgba(203, 213, 225, 0.65)';
  return (
    <View
      style={[
        styles.emailCardItem,
        {
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : '#f8fafc',
          borderColor,
          width: '100%',
        },
      ]}
    >
      <View style={styles.emailCardHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Skeleton width={26} height={26} variant="rounded" style={{ borderRadius: 13, backgroundColor: skelBg }} />
          <Skeleton width={110} height={14} variant="rounded" style={{ borderRadius: 4, backgroundColor: skelBg }} />
        </View>
        <Skeleton width={44} height={12} variant="rounded" style={{ borderRadius: 4, backgroundColor: skelBg }} />
      </View>
      <View style={[styles.badgesRow, { marginVertical: 4 }]}>
        <Skeleton width={48} height={16} variant="rounded" style={{ borderRadius: 4, backgroundColor: skelBg }} />
      </View>
      <Skeleton width="85%" height={14} variant="rounded" style={{ borderRadius: 4, marginVertical: 3, backgroundColor: skelBg }} />
      <Skeleton width="65%" height={12} variant="rounded" style={{ borderRadius: 4, backgroundColor: skelBg }} />
    </View>
  );
}

export function EmailAppView({
  initialTab = 'Inbox',
  onOpenDrawer,
  onClose,
  showMobileHeader = true,
  rightOverlayView,
  onCloseRightPane,
  onViewStateChange,
}: EmailAppViewProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [activeTab, setActiveTab] = useState<EmailTabType>(initialTab);
  const [emails, setEmails] = useState<EmailMessageItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [starredMap, setStarredMap] = useState<Record<string, boolean>>({});

  // Compose form state
  const [composeTo, setComposeTo] = useState('');
  const [composeFrom, setComposeFrom] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeAttachments, setComposeAttachments] = useState<EmailAttachment[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('Blank');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [composeCc, setComposeCc] = useState('');
  const [composeBcc, setComposeBcc] = useState('');
  const [isLoadingLive, setIsLoadingLive] = useState(true);
  const [isSendingLive, setIsSendingLive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  // Sync active from address from stored config
  useEffect(() => {
    getActiveEmailConfig().then((cfg) => {
      if (cfg?.email) setComposeFrom(cfg.email);
    });
  }, []);

  // Mobile navigation state: false = list view, true = detail view
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  // Notify parent of view state changes (detail view or compose mode active)
  useEffect(() => {
    onViewStateChange?.({
      isDetailOpen: isMobileDetailOpen,
      isComposing: isComposing,
    });
  }, [isMobileDetailOpen, isComposing, onViewStateChange]);

  // Reset page on tab or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Colors & Theme Tokens
  const containerBg = isDark ? '#0b0f19' : '#ffffff';
  const borderColor = colors.border || (isDark ? '#1e293b' : '#e2e8f0');
  const textMain = colors.foreground || (isDark ? '#f8fafc' : '#0f172a');
  const textMuted = colors.mutedForeground || (isDark ? '#94a3b8' : '#64748b');
  const itemSelectedBg = isDark ? 'rgba(99, 102, 241, 0.16)' : '#f5f3ff';
  const itemSelectedBorder = isDark ? '#6366f1' : colors.primary || '#7c3aed';
  const badgeBg = isDark ? '#1e293b' : '#f1f5f9';
  const badgeText = isDark ? '#94a3b8' : '#475569';
  const inputBg = isDark ? '#1e293b' : '#f8fafc';

  // Live Email Fetch from IMAP / Hostinger
  const loadLiveEmails = useCallback(async (tabToLoad: EmailTabType = activeTab) => {
    setIsLoadingLive(true);
    try {
      if (tabToLoad === 'Inbox') {
        const liveList = await fetchLiveInbox();
        if (Array.isArray(liveList)) {
          const mapped: EmailMessageItem[] = liveList.map((item: any, idx: number) => {
            const initials = (item.fromName || item.from || 'EM')
              .split(' ')
              .filter(Boolean)
              .map((n: string) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase();
            const d = item.date ? new Date(item.date) : new Date();
            return {
              id: `live-inbox-${item.id || idx}`,
              tab: 'inbox',
              name: item.fromName || (item.from ? item.from.split('@')[0] : 'Sender'),
              email: item.from || '',
              avatarInitials: initials || 'EM',
              avatarBg: '#e0f2fe',
              avatarColor: '#0284c7',
              subject: item.subject || '(No Subject)',
              dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              relativeTime: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              read: item.isRead ?? true,
              unreadDot: !item.isRead,
              badges: ['Inbox'],
              intro: item.text || (item.html ? item.html.replace(/<[^>]*>?/gm, '') : ''),
              attachments: item.attachments,
            };
          });
          setEmails((prev) => {
            const nonInbox = prev.filter((e) => e.tab.toLowerCase() !== 'inbox');
            return [...mapped, ...nonInbox];
          });
          if (mapped.length > 0) {
            setSelectedId((curr) => {
              const exists = mapped.some((m) => m.id === curr);
              return exists ? curr : mapped[0].id;
            });
          }
        }
      } else if (tabToLoad === 'Sent') {
        const sentList = await fetchLiveSent();
        if (Array.isArray(sentList)) {
          const mapped: EmailMessageItem[] = sentList.map((item: any, idx: number) => {
            const d = item.date ? new Date(item.date) : new Date();
            const fromName = item.fromName || (item.from ? item.from.split('@')[0] : 'Me');
            const initials = fromName
              .split(' ')
              .filter(Boolean)
              .map((n: string) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase();
            return {
              id: `live-sent-${item.id || idx}`,
              tab: 'sent',
              name: fromName,
              email: item.from || '',
              avatarInitials: initials || 'ME',
              avatarBg: '#ede9fe',
              avatarColor: '#7c3aed',
              subject: item.subject || '(No Subject)',
              dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              relativeTime: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              read: true,
              unreadDot: false,
              badges: ['Sent'],
              intro: item.text || (item.html ? item.html.replace(/<[^>]*>?/gm, '') : ''),
              attachments: item.attachments,
            };
          });
          setEmails((prev) => {
            const nonSent = prev.filter((e) => e.tab.toLowerCase() !== 'sent');
            return [...mapped, ...nonSent];
          });
          if (mapped.length > 0) {
            setSelectedId((curr) => {
              const exists = mapped.some((m) => m.id === curr);
              return exists ? curr : mapped[0].id;
            });
          }
        }
      }
    } catch (err) {
      console.warn('Error loading live emails:', err);
    } finally {
      setIsLoadingLive(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadLiveEmails(activeTab);
    const syncInterval = setInterval(() => {
      loadLiveEmails(activeTab);
    }, 8000);
    return () => clearInterval(syncInterval);
  }, [activeTab, loadLiveEmails]);

  // Cross-platform document picker (Web + Mobile APK)
  const handlePickDocument = useCallback(async (targetEmailId?: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedAttachments: EmailAttachment[] = result.assets.map((asset, index) => {
          const ext = asset.name?.split('.').pop()?.toUpperCase() || 'FILE';
          const sizeBytes = asset.size || 0;
          const sizeStr =
            sizeBytes > 1024 * 1024
              ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
              : sizeBytes > 0
                ? `${(sizeBytes / 1024).toFixed(0)} KB`
                : '1.2 MB';

          return {
            id: `att-doc-${Date.now()}-${index}`,
            name: asset.name || `document-${index + 1}.${ext.toLowerCase()}`,
            type: ext,
            size: sizeStr,
          };
        });

        if (isComposing) {
          setComposeAttachments((prev) => [...prev, ...pickedAttachments]);
        } else {
          const targetId = targetEmailId || selectedId;
          setEmails((prev) =>
            prev.map((item) =>
              item.id === targetId
                ? {
                    ...item,
                    attachments: [...(item.attachments || []), ...pickedAttachments],
                  }
                : item
            )
          );
        }
      }
    } catch (error) {
      console.warn('Error picking document:', error);
    }
  }, [isComposing, selectedId]);

  // Cross-platform image picker (Web + Mobile APK)
  const handlePickImage = useCallback(async (targetEmailId?: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedAttachments: EmailAttachment[] = result.assets.map((asset, index) => {
          const ext = (asset.fileName || asset.uri).split('.').pop()?.toUpperCase() || 'IMAGE';
          const sizeBytes = (asset as any).fileSize || 0;
          const sizeStr =
            sizeBytes > 1024 * 1024
              ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
              : sizeBytes > 0
                ? `${(sizeBytes / 1024).toFixed(0)} KB`
                : '850 KB';

          return {
            id: `att-img-${Date.now()}-${index}`,
            name: asset.fileName || `image-${Date.now()}.${ext.toLowerCase()}`,
            type: ext,
            size: sizeStr,
          };
        });

        if (isComposing) {
          setComposeAttachments((prev) => [...prev, ...pickedAttachments]);
        } else {
          const targetId = targetEmailId || selectedId;
          setEmails((prev) =>
            prev.map((item) =>
              item.id === targetId
                ? {
                    ...item,
                    attachments: [...(item.attachments || []), ...pickedAttachments],
                  }
                : item
            )
          );
        }
      }
    } catch (error) {
      console.warn('Error picking image:', error);
    }
  }, [isComposing, selectedId]);

  const handleRemoveAttachment = useCallback(
    (attId: string, targetEmailId?: string) => {
      if (isComposing) {
        setComposeAttachments((prev) => prev.filter((a) => a.id !== attId));
      } else {
        const targetId = targetEmailId || selectedId;
        setEmails((prev) =>
          prev.map((item) =>
            item.id === targetId
              ? {
                  ...item,
                  attachments: (item.attachments || []).filter((a) => a.id !== attId),
                }
              : item
          )
        );
      }
    },
    [isComposing, selectedId]
  );

  // Filter emails by active tab and search
  const filteredEmails = useMemo(() => {
    return emails.filter((item) => {
      const currentTabLower = activeTab.toLowerCase();
      const itemTabLower = item.tab.toLowerCase();
      const matchTab =
        currentTabLower === 'inbox'
          ? itemTabLower === 'inbox'
          : currentTabLower === 'sent'
            ? itemTabLower === 'sent'
            : currentTabLower === 'folder'
              ? itemTabLower === 'folder'
              : true;

      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.intro && item.intro.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchTab && matchSearch;
    });
  }, [emails, activeTab, searchQuery]);

  const totalCount = filteredEmails.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalCount);
  const paginatedEmails = useMemo(() => {
    return filteredEmails.slice(startIndex, endIndex);
  }, [filteredEmails, startIndex, endIndex]);

  const rangeText = useMemo(() => {
    if (totalCount === 0) return '0-0 of 0';
    return `${startIndex + 1}–${endIndex} of ${totalCount}`;
  }, [totalCount, startIndex, endIndex]);

  const selectedEmail = useMemo(() => {
    return emails.find((e) => e.id === selectedId) || paginatedEmails[0] || null;
  }, [emails, selectedId, paginatedEmails]);

  const handleSelectEmail = useCallback((id: string) => {
    setSelectedId(id);
    setIsComposing(false);
    setEmails((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true, unreadDot: false } : item))
    );
    if (!isDesktop) {
      setIsMobileDetailOpen(true);
    }
  }, [isDesktop]);

  const handleDeleteEmail = useCallback((id: string) => {
    setEmails((prev) => {
      const remaining = prev.filter((item) => item.id !== id);
      if (selectedId === id && remaining.length > 0) {
        setSelectedId(remaining[0].id);
      }
      return remaining;
    });
    if (!isDesktop) {
      setIsMobileDetailOpen(false);
    }
  }, [selectedId, isDesktop]);

  const handleToggleFlag = useCallback((id: string) => {
    setStarredMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleSendCompose = useCallback(async () => {
    if (!composeTo.trim() || !composeSubject.trim()) {
      alert('Please fill out recipient and subject.');
      return;
    }
    setIsSendingLive(true);
    try {
      const activeConfig = await getActiveEmailConfig();
      const sendRes = await sendLiveEmail({
        to: composeTo.trim(),
        subject: composeSubject.trim(),
        html: composeBody.trim(),
        text: composeBody.trim(),
        attachments: composeAttachments,
      });

      const senderName = activeConfig?.email ? activeConfig.email.split('@')[0] : 'Me';
      const newEmail: EmailMessageItem = {
        id: `email-compose-${Date.now()}`,
        tab: 'sent',
        name: senderName,
        email: activeConfig?.email || '',
        avatarInitials: (activeConfig?.email ? activeConfig.email.slice(0, 2) : 'ME').toUpperCase(),
        avatarBg: '#ede9fe',
        avatarColor: colors.primary || '#7c3aed',
        subject: composeSubject.trim(),
        dateStr: 'Just now',
        relativeTime: 'Just now',
        read: true,
        unreadDot: false,
        badges: ['Sent'],
        intro: composeBody.trim() || 'No content provided.',
        attachments: composeAttachments.length > 0 ? composeAttachments : undefined,
      };
      setEmails((prev) => [newEmail, ...prev]);
      setIsComposing(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      setComposeAttachments([]);
      setActiveTab('Sent');
      setSelectedId(newEmail.id);
      if (!sendRes.success) {
        console.warn('Live mail send notice:', sendRes.message);
      }
    } catch (err: any) {
      console.error('Error sending email:', err);
    } finally {
      setIsSendingLive(false);
    }
  }, [composeTo, composeSubject, composeBody, composeAttachments, colors.primary]);

  // Responsive display controls
  const showSidebar = isDesktop || !isMobileDetailOpen;
  const showDetailPane = isDesktop || isMobileDetailOpen;

  return (
    <View style={[styles.rootContainer, { backgroundColor: containerBg }]}>
      <View style={styles.dualPaneWrapper}>
        {/* ============================================================ */}
        {/* 1. LEFT EMAIL LIST PANE (width: 320px on desktop)            */}
        {/* ============================================================ */}
        {showSidebar && (
          <View
            style={[
              styles.leftEmailListPane,
              {
                width: isDesktop ? 320 : '100%',
                flex: isDesktop ? undefined : 1,
                borderRightColor: borderColor,
                borderRightWidth: isDesktop ? 1 : 0,
                backgroundColor: containerBg,
              },
            ]}
          >
            {/* Subtabs & Mini Pagination */}
            <View style={[styles.tabsRow, { borderBottomColor: borderColor }]}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsScrollContent}
              >
                {TABS.map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <TouchableOpacity
                      key={tab}
                      onPress={() => setActiveTab(tab)}
                      style={[
                        styles.tabItemBtn,
                        isActive && [
                          styles.tabItemBtnActive,
                          { borderBottomColor: colors.primary },
                        ],
                      ]}
                    >
                      <Text
                        style={[
                          styles.tabItemText,
                          {
                            color: isActive ? colors.primary : textMuted,
                            fontWeight: isActive ? '600' : '400',
                          },
                        ]}
                      >
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.miniPagination}>
                <Text style={[styles.paginationText, { color: textMuted }]}>
                  {rangeText}
                </Text>
                <TouchableOpacity
                  disabled={currentPage <= 1}
                  onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={[styles.pageChevronBtn, { opacity: currentPage <= 1 ? 0.35 : 1 }]}
                >
                  <ChevronLeft size={13} color={textMuted} />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={currentPage >= totalPages}
                  onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={[styles.pageChevronBtn, { opacity: currentPage >= totalPages ? 0.35 : 1 }]}
                >
                  <ChevronRight size={13} color={textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Search & New + Button Row */}
            <View style={[styles.searchAndNewRow, { borderBottomColor: borderColor }]}>
              <View
                style={[
                  styles.searchInputBox,
                  { backgroundColor: inputBg, borderColor },
                ]}
              >
                <Search size={14} color={textMuted} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search..."
                  placeholderTextColor={textMuted}
                  style={[
                    styles.searchTextInput,
                    {
                      color: textMain,
                      ...Platform.select({
                        web: { outlineStyle: 'none' } as any,
                      }),
                    },
                  ]}
                />
              </View>

              <TouchableOpacity
                onPress={() => loadLiveEmails(activeTab)}
                style={[
                  styles.refreshIconBtn,
                  {
                    borderColor,
                    backgroundColor: inputBg,
                  },
                ]}
                accessibilityLabel="Sync Emails"
              >
                <RefreshCw size={13} color={isLoadingLive ? colors.primary : textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setIsComposing(true);
                  if (!isDesktop) {
                    setIsMobileDetailOpen(true);
                  }
                }}
                style={[styles.newEmailPillBtn, { backgroundColor: colors.primary }]}
              >
                <Mail size={14} color="#ffffff" strokeWidth={2.2} />
                <Text style={styles.newEmailPillText}>New +</Text>
              </TouchableOpacity>
            </View>

            {/* Email Cards List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.emailListScroll}
              contentContainerStyle={{ padding: 10, gap: 8, width: '100%' }}
            >
              {isLoadingLive ? (
                <View style={{ gap: 8, width: '100%' }}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <EmailCardSkeleton key={`skeleton-${idx}`} isDark={isDark} borderColor={borderColor} />
                  ))}
                </View>
              ) : paginatedEmails.length === 0 ? (
                <View style={styles.emptyListState}>
                  <Mail size={28} color={textMuted} strokeWidth={1.5} />
                  <Text style={[styles.emptyListText, { color: textMuted }]}>
                    No messages in {activeTab}
                  </Text>
                </View>
              ) : (
                paginatedEmails.map((item) => {
                  const isSelected = item.id === selectedId && !isComposing;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      onPress={() => handleSelectEmail(item.id)}
                      style={[
                        styles.emailCardItem,
                        {
                          backgroundColor: isSelected ? itemSelectedBg : 'transparent',
                          borderColor: isSelected ? itemSelectedBorder : borderColor,
                        },
                      ]}
                    >
                      {/* Card Header Row */}
                      <View style={styles.emailCardHeader}>
                        <View style={styles.senderNameBox}>
                          <Text
                            style={[
                              styles.senderNameLabel,
                              {
                                color: textMain,
                                fontWeight: isSelected ? '600' : '500',
                              },
                            ]}
                          >
                            {item.name}
                          </Text>
                          {item.unreadDot && (
                            <View style={[styles.blueUnreadDot, { backgroundColor: colors.primary }]} />
                          )}
                        </View>
                        <Text style={[styles.relativeTimeText, { color: textMuted }]}>
                          {item.relativeTime}
                        </Text>
                      </View>

                      {/* Badges Row */}
                      <View style={styles.badgesRow}>
                        {item.badges.map((badge, idx) => (
                          <View
                            key={idx}
                            style={[
                              styles.badgePill,
                              { backgroundColor: badgeBg },
                            ]}
                          >
                            <Text
                              style={[
                                styles.badgePillText,
                                { color: badgeText },
                              ]}
                            >
                              {badge}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {/* Subject */}
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.cardSubjectText,
                          {
                            color: textMain,
                            fontWeight: item.read ? '500' : '600',
                          },
                        ]}
                      >
                        {item.subject}
                      </Text>

                      {/* Snippet */}
                      <Text
                        numberOfLines={1}
                        style={[styles.cardSnippetText, { color: textMuted }]}
                      >
                        {item.intro}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>

            {/* Bottom Pagination Row */}
            <View style={[styles.bottomPaginationRow, { borderTopColor: borderColor }]}>
              <Text style={[styles.paginationText, { color: textMuted }]}>
                {rangeText}
              </Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity
                  disabled={currentPage <= 1}
                  onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={[styles.pageChevronBtn, { opacity: currentPage <= 1 ? 0.35 : 1 }]}
                >
                  <ChevronLeft size={13} color={textMuted} />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={currentPage >= totalPages}
                  onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={[styles.pageChevronBtn, { opacity: currentPage >= totalPages ? 0.35 : 1 }]}
                >
                  <ChevronRight size={13} color={textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* 2. RIGHT EMAIL SEND / READ VIEWPORT                          */}
        {/* ============================================================ */}
        {showDetailPane && (
          <View
            style={[
              styles.rightDetailPane,
              { backgroundColor: isDark ? '#0f172a' : '#ffffff' },
            ]}
          >
            {rightOverlayView ? (
              rightOverlayView
            ) : isComposing ? (
              /* ── COMPOSE NEW MESSAGE VIEW ── */
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={[styles.composeContainerStyle, { flexGrow: 1 }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Compose Header */}
                <View style={[styles.composeHeaderRow, { borderBottomColor: borderColor }]}>
                  <Text style={[styles.detailHeading, { color: textMain }]}>
                    New Message
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setIsComposing(false);
                      if (!isDesktop) {
                        setIsMobileDetailOpen(false);
                      }
                    }}
                    style={styles.closeComposeBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Close Compose"
                  >
                    <X size={18} color={textMain} />
                  </TouchableOpacity>
                </View>

                {/* 1. Select Template */}
                <View style={styles.fieldSection}>
                  <Text style={[styles.fieldLabel, { color: textMain }]}>Select Template</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.templateDropdownBtn,
                      { backgroundColor: inputBg, borderColor },
                    ]}
                  >
                    <Text style={[styles.templateDropdownText, { color: textMain }]}>{selectedTemplate}</Text>
                    <ChevronDown size={14} color={textMuted} />
                  </TouchableOpacity>
                </View>

                {/* 2. Subject */}
                <View style={styles.fieldSection}>
                  <Text style={[styles.fieldLabel, { color: textMain }]}>Subject</Text>
                  <TextInput
                    placeholder="Enter subject"
                    placeholderTextColor={textMuted}
                    value={composeSubject}
                    onChangeText={setComposeSubject}
                    style={[
                      styles.inputBox,
                      { backgroundColor: inputBg, borderColor, color: textMain },
                    ]}
                  />
                </View>

                {/* 3. From */}
                <View style={styles.fieldSection}>
                  <Text style={[styles.fieldLabel, { color: textMain }]}>From</Text>
                  <TextInput
                    value={composeFrom}
                    editable={false}
                    style={[
                      styles.inputBox,
                      { backgroundColor: inputBg, borderColor, color: textMain },
                    ]}
                  />
                </View>

                {/* 4. To */}
                <View style={styles.fieldSection}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={[styles.fieldLabel, { color: textMain }]}>To</Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <TouchableOpacity onPress={() => setShowCc((s) => !s)}>
                        <Text style={{ fontSize: 11.5, color: colors.primary || '#7c3aed', fontFamily: 'Open Sans', fontWeight: '600' }}>
                          Cc
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setShowBcc((s) => !s)}>
                        <Text style={{ fontSize: 11.5, color: colors.primary || '#7c3aed', fontFamily: 'Open Sans', fontWeight: '600' }}>
                          Bcc
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TextInput
                    placeholder="Recipient email address (e.g. recipient@example.com)"
                    placeholderTextColor={textMuted}
                    value={composeTo}
                    onChangeText={setComposeTo}
                    style={[
                      styles.inputBox,
                      { backgroundColor: inputBg, borderColor, color: textMain },
                    ]}
                  />
                </View>

                {showCc && (
                  <View style={styles.fieldSection}>
                    <Text style={[styles.fieldLabel, { color: textMain }]}>Cc</Text>
                    <TextInput
                      placeholder="Cc recipient email address"
                      placeholderTextColor={textMuted}
                      value={composeCc}
                      onChangeText={setComposeCc}
                      style={[
                        styles.inputBox,
                        { backgroundColor: inputBg, borderColor, color: textMain },
                      ]}
                    />
                  </View>
                )}

                {showBcc && (
                  <View style={styles.fieldSection}>
                    <Text style={[styles.fieldLabel, { color: textMain }]}>Bcc</Text>
                    <TextInput
                      placeholder="Bcc recipient email address"
                      placeholderTextColor={textMuted}
                      value={composeBcc}
                      onChangeText={setComposeBcc}
                      style={[
                        styles.inputBox,
                        { backgroundColor: inputBg, borderColor, color: textMain },
                      ]}
                    />
                  </View>
                )}

                {/* 5. Message with Rich Toolbar */}
                <View style={[styles.fieldSection, { flex: 1, minHeight: 220 }]}>
                  <Text style={[styles.fieldLabel, { color: textMain }]}>Message</Text>
                  <View
                    style={[
                      styles.emailContentBox,
                      { backgroundColor: isDark ? '#141824' : '#ffffff', borderColor, flex: 1 },
                    ]}
                  >
                    <View style={[styles.richToolbar, { borderBottomColor: borderColor, backgroundColor: isDark ? '#141e33' : '#f8fafc' }]}>
                      <TouchableOpacity style={styles.toolbarBtn}>
                        <Text style={[styles.toolbarTextBtn, { color: textMain }]}>B</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.toolbarBtn}>
                        <Text style={[styles.toolbarTextBtn, { fontStyle: 'italic', color: textMain }]}>I</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.toolbarBtn}>
                        <Text style={[styles.toolbarTextBtn, { textDecorationLine: 'underline', color: textMain }]}>U</Text>
                      </TouchableOpacity>

                      <View style={[styles.toolbarDivider, { backgroundColor: borderColor }]} />

                      <TouchableOpacity style={styles.toolbarBtn}>
                        <List size={14} color={textMain} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.toolbarBtn}>
                        <ListOrdered size={14} color={textMain} />
                      </TouchableOpacity>

                      <View style={[styles.toolbarDivider, { backgroundColor: borderColor }]} />

                      <TouchableOpacity style={styles.toolbarBtn}>
                        <Link2 size={14} color={textMain} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.toolbarBtn}>
                        <ImageIcon size={14} color={textMain} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handlePickDocument()}
                        style={styles.toolbarBtn}
                        accessibilityLabel="Attach Document"
                      >
                        <Paperclip size={14} color={textMain} />
                      </TouchableOpacity>
                    </View>

                    <TextInput
                      placeholder="Write your email message..."
                      placeholderTextColor={textMuted}
                      value={composeBody}
                      onChangeText={setComposeBody}
                      multiline
                      textAlignVertical="top"
                      style={[
                        styles.composeTextArea,
                        {
                          color: textMain,
                          flex: 1,
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* 6. Attachments Section */}
                <View style={styles.attachmentsSection}>
                  <Text style={[styles.attachmentsHeading, { color: textMain }]}>
                    Attachments ({composeAttachments.length})
                  </Text>

                  {composeAttachments.map((att) => (
                    <View
                      key={att.id}
                      style={[
                        styles.attachmentCard,
                        { backgroundColor: inputBg, borderColor },
                      ]}
                    >
                      <View style={styles.attachmentLeft}>
                        <View
                          style={[
                            styles.pdfTypeBox,
                            { backgroundColor: isDark ? '#334155' : '#ede9fe' },
                          ]}
                        >
                          <FileText size={16} color={colors.primary || '#7c3aed'} />
                        </View>
                        <View>
                          <Text style={[styles.attachmentName, { color: textMain }]}>
                            {att.name}
                          </Text>
                          <Text style={[styles.attachmentSize, { color: textMuted }]}>
                            {att.size}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.attachmentActions}>
                        <TouchableOpacity
                          onPress={() => alert(`Downloading ${att.name}...`)}
                          style={styles.attActionBtn}
                          accessibilityLabel="Download Attachment"
                        >
                          <Download size={15} color={textMuted} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => alert(`Previewing ${att.name}...`)}
                          style={styles.attActionBtn}
                          accessibilityLabel="Preview Attachment"
                        >
                          <Eye size={15} color={textMuted} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleRemoveAttachment(att.id)}
                          style={styles.attActionBtn}
                          accessibilityLabel="Remove Attachment"
                        >
                          <X size={15} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() => handlePickDocument()}
                    style={[
                      styles.attachFilesOutlineBtn,
                      { borderColor, width: '100%', marginTop: 6, height: 38, justifyContent: 'center' },
                    ]}
                  >
                    <Paperclip size={14} color={textMain} />
                    <Text style={[styles.attachFilesOutlineText, { color: textMain }]}>
                      Attach Files
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 7. Footer Actions */}
                <View style={styles.composeFooterRow}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsComposing(false);
                      if (!isDesktop) {
                        setIsMobileDetailOpen(false);
                      }
                    }}
                    style={[styles.outlineActionBtn, { borderColor }]}
                  >
                    <Text style={[styles.outlineActionBtnText, { color: textMain }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity
                      onPress={() => alert('Draft saved successfully!')}
                      style={[styles.outlineActionBtn, { borderColor, flexDirection: 'row', alignItems: 'center', gap: 6 }]}
                    >
                      <Save size={14} color={textMain} />
                      <Text style={[styles.outlineActionBtnText, { color: textMain }]}>
                        Save as Draft
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleSendCompose}
                      disabled={isSendingLive}
                      activeOpacity={0.85}
                      style={[
                        styles.sendPurpleBtn,
                        { backgroundColor: colors.primary || '#7c3aed', opacity: isSendingLive ? 0.7 : 1 },
                      ]}
                    >
                      {isSendingLive ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Send size={14} color="#ffffff" />
                      )}
                      <Text style={styles.sendPurpleBtnText}>
                        {isSendingLive ? 'Sending...' : 'Send'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            ) : selectedEmail ? (
              /* ── EMAIL READING & REPLY VIEW ── */
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={[styles.detailScrollContent, { flexGrow: 1 }]}
                showsVerticalScrollIndicator={false}
              >
                {/* Detail Top Header Bar */}
                <View style={[styles.detailHeaderBar, { borderBottomColor: borderColor }]}>
                  <View style={styles.senderProfileRow}>
                    <View
                      style={[
                        styles.avatarCircle,
                        { backgroundColor: selectedEmail.avatarBg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.avatarText,
                          { color: selectedEmail.avatarColor },
                        ]}
                      >
                        {selectedEmail.avatarInitials}
                      </Text>
                    </View>

                    <View style={styles.senderDetailsCol}>
                      <View style={styles.senderNameAndEmail}>
                        <Text style={[styles.fromNameText, { color: textMain }]}>
                          From: {selectedEmail.name}
                        </Text>
                        <Text style={[styles.fromEmailText, { color: textMuted }]} numberOfLines={1}>
                          {selectedEmail.email}
                        </Text>
                      </View>
                      <Text style={[styles.toMeDateText, { color: textMuted }]}>
                        to me {selectedEmail.dateStr} - {selectedEmail.relativeTime}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailTopActions}>
                    <TouchableOpacity
                      onPress={() => alert('Notifications toggled')}
                      style={styles.topActionBtn}
                      accessibilityLabel="Notifications"
                    >
                      <Bell size={16} color="#f97316" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleToggleFlag(selectedEmail.id)}
                      style={styles.topActionBtn}
                      accessibilityLabel="Flag"
                    >
                      <Flag
                        size={16}
                        color={starredMap[selectedEmail.id] ? '#ef4444' : textMuted}
                        fill={starredMap[selectedEmail.id] ? '#ef4444' : 'none'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.topActionBtn} accessibilityLabel="More options">
                      <MoreVertical size={16} color={textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setIsMobileDetailOpen(false);
                        if (onCloseRightPane) onCloseRightPane();
                        if (onClose) onClose();
                      }}
                      style={styles.topActionBtn}
                      accessibilityRole="button"
                      accessibilityLabel="Close"
                    >
                      <X size={18} color={textMain} strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Subject Box */}
                <View style={styles.subjectContainer}>
                  <Text style={[styles.sectionFieldLabel, { color: textMuted }]}>
                    Subject
                  </Text>
                  <View
                    style={[
                      styles.subjectDisplayBox,
                      { backgroundColor: inputBg, borderColor },
                    ]}
                  >
                    <Text style={[styles.subjectDisplayText, { color: textMain }]}>
                      {selectedEmail.subject}
                    </Text>
                  </View>
                </View>

                {/* Email Content Box with Rich Toolbar */}
                <View style={[styles.emailContentSection, { flex: 1, minHeight: 200 }]}>
                  <Text style={[styles.sectionFieldLabel, { color: textMuted }]}>
                    Email Content
                  </Text>

                  <View
                    style={[
                      styles.emailContentBox,
                      { backgroundColor: isDark ? '#141824' : '#ffffff', borderColor, flex: 1 },
                    ]}
                  >
                    {/* Rich Formatting Toolbar */}
                    <View style={[styles.richToolbar, { borderBottomColor: borderColor, backgroundColor: isDark ? '#141e33' : '#f8fafc' }]}>
                      <TouchableOpacity style={styles.toolbarBtn}>
                        <Text style={[styles.toolbarTextBtn, { color: textMain }]}>B</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.toolbarBtn}>
                        <Text style={[styles.toolbarTextBtn, { fontStyle: 'italic', color: textMain }]}>I</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.toolbarBtn}>
                        <Text style={[styles.toolbarTextBtn, { textDecorationLine: 'underline', color: textMain }]}>U</Text>
                      </TouchableOpacity>

                      <View style={[styles.toolbarDivider, { backgroundColor: borderColor }]} />

                      <TouchableOpacity style={styles.toolbarBtn}>
                        <List size={14} color={textMain} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.toolbarBtn}>
                        <ListOrdered size={14} color={textMain} />
                      </TouchableOpacity>

                      <View style={[styles.toolbarDivider, { backgroundColor: borderColor }]} />

                      <TouchableOpacity style={styles.toolbarBtn}>
                        <Link2 size={14} color={textMain} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handlePickDocument(selectedEmail?.id)}
                        style={styles.toolbarBtn}
                        accessibilityLabel="Attach Document"
                      >
                        <Paperclip size={14} color={textMain} />
                      </TouchableOpacity>
                    </View>

                    {/* Email Body Inner Text */}
                    <View style={styles.emailBodyInner}>
                      {selectedEmail.headerTitle && (
                        <Text style={[styles.bodyHeaderTitle, { color: textMain }]}>
                          {selectedEmail.headerTitle}
                        </Text>
                      )}

                      <Text style={[styles.bodyNormalText, { color: textMain }]}>
                        {selectedEmail.intro}
                      </Text>

                      {/* Bullets if present */}
                      {selectedEmail.bulletItems && selectedEmail.bulletItems.length > 0 && (
                        <View style={styles.bulletsList}>
                          {selectedEmail.bulletItems.map((bullet, idx) => (
                            <View key={idx} style={styles.bulletItemRow}>
                              <Text style={styles.bulletDot}>•</Text>
                              <Text style={[styles.bulletItemText, { color: textMain }]}>
                                {bullet.text} {bullet.icon}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {selectedEmail.closing && (
                        <Text style={[styles.bodyNormalText, { color: textMain }]}>
                          {selectedEmail.closing}
                        </Text>
                      )}

                      {selectedEmail.senderSignoff && (
                        <Text style={[styles.bodyNormalText, { color: textMain, marginTop: 10 }]}>
                          {selectedEmail.senderSignoff}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* Attachments Section */}
                <View style={styles.attachmentsSection}>
                  <Text style={[styles.attachmentsHeading, { color: textMain }]}>
                    Attachments ({selectedEmail.attachments ? selectedEmail.attachments.length : 0})
                  </Text>

                  {selectedEmail.attachments &&
                    selectedEmail.attachments.map((att) => (
                      <View
                        key={att.id}
                        style={[
                          styles.attachmentCard,
                          { backgroundColor: inputBg, borderColor },
                        ]}
                      >
                        <View style={styles.attachmentLeft}>
                          <View
                            style={[
                              styles.pdfTypeBox,
                              { backgroundColor: isDark ? '#334155' : '#e2e8f0' },
                            ]}
                          >
                            <Text style={[styles.pdfTypeText, { color: textMuted }]}>
                              {att.type}
                            </Text>
                          </View>
                          <View>
                            <Text style={[styles.attachmentName, { color: textMain }]}>
                              {att.name}
                            </Text>
                            <Text style={[styles.attachmentSize, { color: textMuted }]}>
                              {att.size}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.attachmentActions}>
                          <TouchableOpacity
                            onPress={() => alert(`Downloading ${att.name}...`)}
                            style={styles.attActionBtn}
                            accessibilityLabel="Download Attachment"
                          >
                            <Download size={15} color={textMuted} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => alert(`Previewing ${att.name}...`)}
                            style={styles.attActionBtn}
                            accessibilityLabel="Preview Attachment"
                          >
                            <Eye size={15} color={textMuted} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleRemoveAttachment(att.id, selectedEmail.id)}
                            style={styles.attActionBtn}
                            accessibilityLabel="Remove Attachment"
                          >
                            <X size={15} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}

                  <TouchableOpacity
                    onPress={() => handlePickDocument(selectedEmail.id)}
                    style={[
                      styles.attachFilesOutlineBtn,
                      { borderColor, width: '100%', marginTop: 8, height: 38, justifyContent: 'center' },
                    ]}
                  >
                    <Paperclip size={14} color={textMain} />
                    <Text style={[styles.attachFilesOutlineText, { color: textMain }]}>
                      Attach Files
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Bottom Actions Bar (Reply / Reply All / Forward / Delete) */}
                <View style={[styles.bottomActionsBar, { borderTopColor: borderColor }]}>
                  <View style={styles.bottomLeftActionGroup}>
                    <TouchableOpacity
                      onPress={() => {
                        setIsComposing(true);
                        setComposeTo(selectedEmail.email);
                        setComposeSubject(selectedEmail.subject.startsWith('Re:') ? selectedEmail.subject : `Re: ${selectedEmail.subject}`);
                        setComposeBody(`\n\n--- Original Message ---\nFrom: ${selectedEmail.name} <${selectedEmail.email}>\nDate: ${selectedEmail.dateStr}\n\n${selectedEmail.intro}`);
                      }}
                      style={[styles.actionOutlineBtn, { borderColor }]}
                    >
                      <Reply size={13} color={textMain} />
                      <Text style={[styles.actionOutlineBtnText, { color: textMain }]}>
                        Reply
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setIsComposing(true);
                        setComposeTo(selectedEmail.email);
                        setComposeSubject(selectedEmail.subject.startsWith('Re:') ? selectedEmail.subject : `Re: ${selectedEmail.subject}`);
                        setComposeBody(`\n\n--- Original Message ---\nFrom: ${selectedEmail.name} <${selectedEmail.email}>\nDate: ${selectedEmail.dateStr}\n\n${selectedEmail.intro}`);
                      }}
                      style={[styles.actionOutlineBtn, { borderColor }]}
                    >
                      <ReplyAll size={13} color={textMain} />
                      <Text style={[styles.actionOutlineBtnText, { color: textMain }]}>
                        Reply All
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setIsComposing(true);
                        setComposeTo('');
                        setComposeSubject(selectedEmail.subject.startsWith('Fwd:') ? selectedEmail.subject : `Fwd: ${selectedEmail.subject}`);
                        setComposeBody(`\n\n--- Forwarded Message ---\nFrom: ${selectedEmail.name} <${selectedEmail.email}>\nDate: ${selectedEmail.dateStr}\n\n${selectedEmail.intro}`);
                      }}
                      style={[styles.actionOutlineBtn, { borderColor }]}
                    >
                      <Forward size={13} color={textMain} />
                      <Text style={[styles.actionOutlineBtnText, { color: textMain }]}>
                        Forward
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDeleteEmail(selectedEmail.id)}
                    style={[styles.deleteOutlineBtn, { borderColor: '#fee2e2' }]}
                  >
                    <Trash2 size={13} color="#ef4444" />
                    <Text style={styles.deleteOutlineBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              <View style={styles.emptySelectionContainer}>
                <Mail size={36} color={textMuted} />
                <Text style={{ color: textMuted, marginTop: 10, fontSize: 13, fontFamily: 'Open Sans' }}>
                  Select an email to view its content
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  dualPaneWrapper: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },

  // ── Left Pane ─────────────────────────────────────────────────────────────
  leftEmailListPane: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  leftHeaderRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  messagesTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    letterSpacing: -0.2,
  },
  headerActionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    padding: 6,
    borderRadius: 6,
  },
  bellWrapper: {
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: -3,
    right: -4,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  bellBadgeText: {
    color: '#ffffff',
    fontSize: 8.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },

  // Subtabs & Pagination
  tabsRow: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  tabsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  tabItemBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabItemBtnActive: {
    borderBottomWidth: 2,
  },
  tabItemText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  miniPagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  paginationText: {
    fontSize: 10.5,
    fontFamily: 'Open Sans',
  },
  pageChevronBtn: {
    padding: 2,
  },

  // Search & New Action Row
  searchAndNewRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  searchInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    padding: 0,
  },
  refreshIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newEmailPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    justifyContent: 'center',
  },
  newEmailPillText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },

  // Email Card Items
  emailListScroll: {
    flex: 1,
    width: '100%',
  },
  emailCardItem: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    gap: 4,
    marginBottom: 8,
  },
  emailCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  senderNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  senderNameLabel: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  blueUnreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  relativeTimeText: {
    fontSize: 10,
    fontFamily: 'Open Sans',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 1,
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  badgePillText: {
    fontSize: 9.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  cardSubjectText: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
  },
  cardSnippetText: {
    fontSize: 10.5,
    fontFamily: 'Open Sans',
    lineHeight: 14,
  },
  bottomPaginationRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  emptyListState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyListText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },

  // ── Right Pane ────────────────────────────────────────────────────────────
  rightDetailPane: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  detailScrollContent: {
    padding: 16,
    gap: 12,
    flexGrow: 1,
  },
  detailHeaderBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  senderProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  senderDetailsCol: {
    flex: 1,
    gap: 1,
  },
  senderNameAndEmail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  fromNameText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  fromEmailText: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
  },
  toMeDateText: {
    fontSize: 10.5,
    fontFamily: 'Open Sans',
  },
  detailTopActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topActionBtn: {
    padding: 6,
    borderRadius: 6,
  },

  // Subject Section
  subjectContainer: {
    gap: 4,
  },
  sectionFieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  subjectDisplayBox: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  subjectDisplayText: {
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },

  // Email Content Section
  emailContentSection: {
    gap: 4,
  },
  emailContentBox: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  richToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    flexWrap: 'wrap',
  },
  toolbarBtn: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarTextBtn: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    minWidth: 12,
    textAlign: 'center',
  },
  toolbarDivider: {
    width: 1,
    height: 14,
    marginHorizontal: 2,
  },
  emailBodyInner: {
    padding: 14,
    gap: 10,
  },
  bodyHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    letterSpacing: -0.2,
  },
  bodyNormalText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    lineHeight: 18,
  },
  bulletsList: {
    gap: 4,
    paddingLeft: 4,
  },
  bulletItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bulletDot: {
    fontSize: 14,
    color: '#64748b',
  },
  bulletItemText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    lineHeight: 18,
  },

  // Attachments Section
  attachmentsSection: {
    gap: 8,
    paddingTop: 4,
  },
  attachmentsHeading: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  attachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  attachmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pdfTypeBox: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfTypeText: {
    fontSize: 9.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  attachmentName: {
    fontSize: 11.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  attachmentSize: {
    fontSize: 10,
    fontFamily: 'Open Sans',
  },
  attachmentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attActionBtn: {
    padding: 4,
  },
  attachFilesOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  attachFilesOutlineText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },

  // Bottom Action Buttons
  bottomActionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    marginTop: 'auto',
    borderTopWidth: 1,
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  bottomLeftActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  actionOutlineBtnText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  deleteOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: '#fff1f2',
  },
  deleteOutlineBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ef4444',
    fontFamily: 'Open Sans',
  },

  // Compose View
  composeContainerStyle: {
    padding: 16,
    gap: 12,
    flexGrow: 1,
  },
  composeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  detailHeading: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  closeComposeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldSection: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  templateDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 130,
  },
  templateDropdownText: {
    fontSize: 12.5,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },
  inputBox: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12.5,
    fontFamily: 'Open Sans',
  },
  composeTextArea: {
    minHeight: 180,
    padding: 12,
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    textAlignVertical: 'top',
  },
  composeFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginTop: 'auto',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  sendPurpleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sendPurpleBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  outlineActionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  outlineActionBtnText: {
    fontSize: 12.5,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },

  emptySelectionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
});
