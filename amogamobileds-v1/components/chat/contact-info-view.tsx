import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import {
  X,
  Bell,
  BellOff,
  Phone,
  Video,
  Search,
  FileText,
  Music,
  Link as LinkIcon,
  Image as ImageIcon,
  ExternalLink,
  Download,
  Users,
  UserPlus,
  Shield,
  Check,
} from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import type { ChatMessage, Conversation } from '../../lib/database.types';
import {
  getConversationMembers,
  addConversationMember,
  removeConversationMember,
  type ConversationMemberWithProfile,
} from '../../lib/chat-service';
import { supabase } from '../../lib/supabase';

export interface ContactInfoViewProps {
  onClose: () => void;
  conversation: (Conversation & { otherMember?: any; is_group?: boolean; title?: string; participant_count?: number; membersCount?: number }) | null;
  messages: ChatMessage[];
  currentUserId?: string;
  contacts?: Array<{ id: string; name: string; email?: string; mobile?: string; contactUserId?: string; initials?: string }>;
  onOpenMedia?: (url: string, name?: string) => void;
  onOpenDoc?: (url: string, name?: string) => void;
  onAddMember?: (userId: string) => Promise<boolean> | void;
  onRemoveMember?: (userId: string) => Promise<boolean> | void;
  onAudioCall?: () => void;
  onVideoCall?: () => void;
  style?: any;
}

type TabType = 'members' | 'media' | 'docs' | 'audio' | 'links';

const URL_REGEX = /(https?:\/\/[^\s]+)/gi;

export function ContactInfoView({
  onClose,
  conversation,
  messages,
  currentUserId,
  contacts = [],
  onOpenMedia,
  onOpenDoc,
  onAddMember,
  onRemoveMember,
  onAudioCall,
  onVideoCall,
  style,
}: ContactInfoViewProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const isGroup = !!(conversation?.is_group || conversation?.type === 'group');
  const [activeTab, setActiveTab] = useState<TabType>(isGroup ? 'members' : 'media');
  const [isMuted, setIsMuted] = useState(false);

  // Group Members State
  const [members, setMembers] = useState<ConversationMemberWithProfile[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [addingMemberId, setAddingMemberId] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    if (!conversation?.id || !isGroup) return;
    setLoadingMembers(true);
    try {
      const data = await getConversationMembers(conversation.id);
      setMembers(data);
    } catch (err) {
      console.warn('Failed to load conversation members:', err);
    } finally {
      setLoadingMembers(false);
    }
  }, [conversation?.id, isGroup]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  // Realtime listener for member changes in this group
  useEffect(() => {
    if (!conversation?.id || !isGroup) return;

    const channel = supabase
      .channel(`group_members_${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversation_members',
          filter: `conversation_id=eq.${conversation.id}`,
        },
        () => {
          loadMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation?.id, isGroup, loadMembers]);

  const isAdmin = useMemo(() => {
    if (!isGroup) return false;
    if (conversation?.created_by && currentUserId && conversation.created_by === currentUserId) return true;
    return members.some((m) => m.user_id === currentUserId && m.role === 'admin');
  }, [isGroup, conversation?.created_by, currentUserId, members]);

  const title = isGroup
    ? conversation?.name || conversation?.title || 'Group Chat'
    : conversation?.otherMember?.name || conversation?.otherMember?.email?.split('@')[0] || 'Chat';

  const email = conversation?.otherMember?.email || '';

  const subtitle = isGroup
    ? `${members.length || conversation?.membersCount || conversation?.participant_count || 2} members`
    : email || (conversation?.otherMember?.online ? 'Online' : 'Offline');

  const initials =
    title
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'GC';

  // Extract shared items categorized
  const { mediaItems, docItems, audioItems, linkItems } = useMemo(() => {
    const media: Array<{ id: string; url: string; name: string; isVideo?: boolean; createdAt: string }> = [];
    const docs: Array<{ id: string; url?: string; name: string; size?: number; type?: string; createdAt: string }> = [];
    const audio: Array<{ id: string; url?: string; name: string; size?: number; createdAt: string }> = [];
    const links: Array<{ id: string; url: string; domain: string; text?: string; createdAt: string }> = [];

    messages.forEach((msg) => {
      const fileNameOrMsg = msg.file_name || msg.message || '';
      const url =
        msg.file_url ||
        (msg.message && (msg.message.startsWith('http') || msg.message.startsWith('file:') || msg.message.startsWith('content:'))
          ? msg.message
          : undefined);

      const isImage =
        msg.message_type === 'image' ||
        /\.(jpg|jpeg|png|webp|gif)$/i.test(fileNameOrMsg) ||
        (url && /\.(jpg|jpeg|png|webp|gif)$/i.test(url));

      const isVideo =
        msg.message_type === 'video' ||
        /\.(mp4|mov|webm)$/i.test(fileNameOrMsg) ||
        (url && /\.(mp4|mov|webm)$/i.test(url));

      const isAudio =
        msg.message_type === 'audio' ||
        /\.(mp3|m4a|wav|aac|ogg)$/i.test(fileNameOrMsg) ||
        (url && /\.(mp3|m4a|wav|aac|ogg)$/i.test(url));

      const isDoc =
        msg.message_type === 'document' ||
        msg.message_type === 'file' ||
        /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip)$/i.test(fileNameOrMsg);

      if (url && (isImage || isVideo)) {
        media.push({
          id: msg.id,
          url,
          name: msg.file_name || (isVideo ? 'Video' : 'Photo'),
          isVideo: isVideo ? true : undefined,
          createdAt: msg.created_at,
        });
      } else if (isAudio) {
        audio.push({
          id: msg.id,
          url,
          name: msg.file_name || 'Voice Message',
          size: msg.file_size || undefined,
          createdAt: msg.created_at,
        });
      } else if (isDoc) {
        docs.push({
          id: msg.id,
          url,
          name: msg.file_name || 'Document',
          size: msg.file_size || undefined,
          createdAt: msg.created_at,
        });
      }

      // Check for links
      if (msg.message) {
        const foundUrls = msg.message.match(URL_REGEX);
        if (foundUrls) {
          foundUrls.forEach((u) => {
            try {
              const parsed = new URL(u);
              links.push({
                id: `${msg.id}-${u}`,
                url: u,
                domain: parsed.hostname.replace('www.', ''),
                text: msg.message || undefined,
                createdAt: msg.created_at,
              });
            } catch {
              links.push({
                id: `${msg.id}-${u}`,
                url: u,
                domain: u,
                text: msg.message || undefined,
                createdAt: msg.created_at,
              });
            }
          });
        }
      }
    });

    return { mediaItems: media, docItems: docs, audioItems: audio, linkItems: links };
  }, [messages]);

  const handleOpenLink = async (url: string) => {
    try {
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      } else {
        await WebBrowser.openBrowserAsync(url);
      }
    } catch {
      Linking.openURL(url);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleAddMemberClick = async (targetUserId: string) => {
    if (!conversation?.id) return;
    setAddingMemberId(targetUserId);
    try {
      if (onAddMember) {
        await onAddMember(targetUserId);
      } else {
        await addConversationMember(conversation.id, targetUserId);
      }
      await loadMembers();
      setIsAddMemberModalOpen(false);
    } catch (e) {
      console.error('Failed to add member:', e);
    } finally {
      setAddingMemberId(null);
    }
  };

  const handleRemoveMemberClick = async (targetUserId: string) => {
    if (!conversation?.id) return;
    setRemovingMemberId(targetUserId);
    try {
      if (onRemoveMember) {
        await onRemoveMember(targetUserId);
      } else {
        await removeConversationMember(conversation.id, targetUserId);
      }
      await loadMembers();
    } catch (e) {
      console.error('Failed to remove member:', e);
    } finally {
      setRemovingMemberId(null);
    }
  };

  // Contacts available to be added to this group (excluding already added members)
  const existingMemberIds = useMemo(() => new Set(members.map((m) => m.user_id)), [members]);
  const availableContacts = useMemo(() => {
    return contacts.filter((c) => {
      const uid = c.contactUserId || c.id;
      if (existingMemberIds.has(uid)) return false;
      if (!memberSearchQuery.trim()) return true;
      const q = memberSearchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.mobile && c.mobile.includes(q))
      );
    });
  }, [contacts, existingMemberIds, memberSearchQuery]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
        style,
      ]}
    >
      {/* Top Header Bar with Close on the Right */}
      <View
        style={[
          styles.topBar,
          {
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          },
        ]}
      >
        <Text style={[styles.topBarTitle, { color: colors.foreground }]}>
          {isGroup ? 'Group Info' : 'Contact Info'}
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onClose}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Close info"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={18} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Hero Card */}
        <View
          style={[
            styles.profileHero,
            {
              backgroundColor: isDark ? colors.card : '#f8fafc',
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.avatarCircle,
              {
                backgroundColor: `${colors.primary}18`,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                { color: colors.primary },
              ]}
            >
              {initials}
            </Text>
          </View>

          <Text style={[styles.profileName, { color: colors.foreground }]}>
            {title}
          </Text>
          <Text style={[styles.profileSub, { color: colors.mutedForeground }]}>
            {subtitle}
          </Text>

          {/* Quick Action Buttons Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <BellOff size={18} color="#ef4444" />
              ) : (
                <Bell size={18} color={colors.primary} />
              )}
              <Text
                style={[
                  styles.actionBtnLabel,
                  { color: isMuted ? '#ef4444' : colors.foreground },
                ]}
              >
                {isMuted ? 'Muted' : 'Mute'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  borderColor: colors.border,
                },
              ]}
              onPress={onAudioCall}
              accessibilityRole="button"
              accessibilityLabel="Audio Call"
            >
              <Phone size={18} color="#10b981" />
              <Text style={[styles.actionBtnLabel, { color: colors.foreground }]}>
                Audio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  borderColor: colors.border,
                },
              ]}
              onPress={onVideoCall}
              accessibilityRole="button"
              accessibilityLabel="Video Call"
            >
              <Video size={18} color="#3b82f6" />
              <Text style={[styles.actionBtnLabel, { color: colors.foreground }]}>
                Video
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  borderColor: colors.border,
                },
              ]}
              onPress={onClose}
            >
              <Search size={18} color="#f59e0b" />
              <Text style={[styles.actionBtnLabel, { color: colors.foreground }]}>
                Search
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs Bar */}
        <View
          style={[
            styles.tabsContainer,
            {
              backgroundColor: isDark ? colors.card : '#f8fafc',
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.tabsHeader}>
            {/* TAB: MEMBERS (Only for Groups, placed BEFORE Media) */}
            {isGroup && (
              <TouchableOpacity
                style={[
                  styles.tabItem,
                  activeTab === 'members' && [
                    styles.tabItemActive,
                    { backgroundColor: isDark ? '#27272a' : '#ffffff' },
                  ],
                ]}
                onPress={() => setActiveTab('members')}
              >
                <Users
                  size={15}
                  color={activeTab === 'members' ? colors.primary : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: activeTab === 'members' ? colors.primary : colors.mutedForeground,
                      fontWeight: activeTab === 'members' ? '700' : '500',
                    },
                  ]}
                >
                  Members ({members.length})
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'media' && [
                  styles.tabItemActive,
                  { backgroundColor: isDark ? '#27272a' : '#ffffff' },
                ],
              ]}
              onPress={() => setActiveTab('media')}
            >
              <ImageIcon
                size={15}
                color={activeTab === 'media' ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: activeTab === 'media' ? colors.primary : colors.mutedForeground,
                    fontWeight: activeTab === 'media' ? '700' : '500',
                  },
                ]}
              >
                Media {mediaItems.length > 0 ? `(${mediaItems.length})` : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'docs' && [
                  styles.tabItemActive,
                  { backgroundColor: isDark ? '#27272a' : '#ffffff' },
                ],
              ]}
              onPress={() => setActiveTab('docs')}
            >
              <FileText
                size={15}
                color={activeTab === 'docs' ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: activeTab === 'docs' ? colors.primary : colors.mutedForeground,
                    fontWeight: activeTab === 'docs' ? '700' : '500',
                  },
                ]}
              >
                Docs {docItems.length > 0 ? `(${docItems.length})` : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'audio' && [
                  styles.tabItemActive,
                  { backgroundColor: isDark ? '#27272a' : '#ffffff' },
                ],
              ]}
              onPress={() => setActiveTab('audio')}
            >
              <Music
                size={15}
                color={activeTab === 'audio' ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: activeTab === 'audio' ? colors.primary : colors.mutedForeground,
                    fontWeight: activeTab === 'audio' ? '700' : '500',
                  },
                ]}
              >
                Audio {audioItems.length > 0 ? `(${audioItems.length})` : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'links' && [
                  styles.tabItemActive,
                  { backgroundColor: isDark ? '#27272a' : '#ffffff' },
                ],
              ]}
              onPress={() => setActiveTab('links')}
            >
              <LinkIcon
                size={15}
                color={activeTab === 'links' ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: activeTab === 'links' ? colors.primary : colors.mutedForeground,
                    fontWeight: activeTab === 'links' ? '700' : '500',
                  },
                ]}
              >
                Links {linkItems.length > 0 ? `(${linkItems.length})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Content Panes */}
        <View style={styles.tabContentArea}>
          {/* TAB: MEMBERS */}
          {activeTab === 'members' && isGroup && (
            <View style={{ gap: 12 }}>
              {/* Member Controls Header */}
              <View style={styles.membersHeaderRow}>
                <Text style={[styles.membersCountLabel, { color: colors.foreground }]}>
                  {members.length} {members.length === 1 ? 'Member' : 'Members'}
                </Text>

                {isAdmin && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setIsAddMemberModalOpen(true)}
                    style={[
                      styles.addMemberBtn,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <UserPlus size={14} color="#ffffff" strokeWidth={2} />
                    <Text style={styles.addMemberBtnText}>Add Member</Text>
                  </TouchableOpacity>
                )}
              </View>

              {loadingMembers ? (
                <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              ) : members.length === 0 ? (
                <View style={styles.emptyStateWrap}>
                  <Text style={[styles.emptyStateSub, { color: colors.mutedForeground }]}>
                    No members found.
                  </Text>
                </View>
              ) : (
                <View style={styles.itemsList}>
                  {members.map((m) => {
                    const prof = m.profile || ({} as any);
                    const memberName = prof.name || prof.email?.split('@')[0] || (m.user_id === currentUserId ? 'You' : 'Member');
                    const memberInitials = memberName.slice(0, 2).toUpperCase();
                    const isMemberAdmin = m.role === 'admin' || (conversation?.created_by === m.user_id);
                    const isSelf = m.user_id === currentUserId;

                    return (
                      <View
                        key={m.id || m.user_id}
                        style={[
                          styles.memberCard,
                          {
                            backgroundColor: isDark ? colors.card : '#ffffff',
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        {/* Avatar */}
                        <View
                          style={[
                            styles.memberAvatar,
                            {
                              backgroundColor: `${colors.primary}18`,
                            },
                          ]}
                        >
                          <Text style={[styles.memberAvatarText, { color: colors.primary }]}>
                            {memberInitials}
                          </Text>
                        </View>

                        {/* Details */}
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text
                              style={[styles.memberNameText, { color: colors.foreground }]}
                              numberOfLines={1}
                            >
                              {isSelf ? `${memberName} (You)` : memberName}
                            </Text>
                            {isMemberAdmin && (
                              <View
                                style={[
                                  styles.adminBadge,
                                  { backgroundColor: isDark ? '#4338ca' : '#e0e7ff' },
                                ]}
                              >
                                <Shield size={10} color={isDark ? '#c7d2fe' : '#4338ca'} />
                                <Text
                                  style={[
                                    styles.adminBadgeText,
                                    { color: isDark ? '#c7d2fe' : '#4338ca' },
                                  ]}
                                >
                                  Admin
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text
                            style={[styles.memberSubText, { color: colors.mutedForeground }]}
                            numberOfLines={1}
                          >
                            {prof.mobile || prof.email || 'Group participant'}
                          </Text>
                        </View>

                        {/* Admin Action: Remove Member */}
                        {isAdmin && !isSelf && (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => handleRemoveMemberClick(m.user_id)}
                            disabled={removingMemberId === m.user_id}
                            style={[
                              styles.removeMemberBtn,
                              { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)' },
                            ]}
                            accessibilityLabel={`Remove ${memberName}`}
                          >
                            {removingMemberId === m.user_id ? (
                              <ActivityIndicator size="small" color="#ef4444" />
                            ) : (
                              <X size={15} color="#ef4444" strokeWidth={2.2} />
                            )}
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* TAB 1: MEDIA */}
          {activeTab === 'media' && (
            mediaItems.length === 0 ? (
              <View style={styles.emptyStateWrap}>
                <View
                  style={[
                    styles.emptyIconCircle,
                    { backgroundColor: `${colors.primary}12` },
                  ]}
                >
                  <ImageIcon size={36} color={colors.primary} strokeWidth={1.6} />
                </View>
                <Text style={[styles.emptyStateTitle, { color: colors.foreground }]}>
                  No photos or videos shared yet
                </Text>
                <Text style={[styles.emptyStateSub, { color: colors.mutedForeground }]}>
                  Media files shared in this chat will appear here.
                </Text>
              </View>
            ) : (
              <View style={styles.mediaGrid}>
                {mediaItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={() => onOpenMedia?.(item.url, item.name)}
                    style={[styles.mediaThumbWrap, { borderColor: colors.border }]}
                  >
                    <ExpoImage
                      source={{ uri: item.url }}
                      style={styles.mediaThumb}
                      contentFit="cover"
                      transition={200}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}

          {/* TAB 2: DOCS */}
          {activeTab === 'docs' && (
            docItems.length === 0 ? (
              <View style={styles.emptyStateWrap}>
                <View
                  style={[
                    styles.emptyIconCircle,
                    { backgroundColor: `${colors.primary}12` },
                  ]}
                >
                  <FileText size={36} color={colors.primary} strokeWidth={1.6} />
                </View>
                <Text style={[styles.emptyStateTitle, { color: colors.foreground }]}>
                  No documents shared yet
                </Text>
                <Text style={[styles.emptyStateSub, { color: colors.mutedForeground }]}>
                  PDFs and documents shared will appear here.
                </Text>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {docItems.map((doc) => (
                  <TouchableOpacity
                    key={doc.id}
                    activeOpacity={0.7}
                    onPress={() => doc.url && onOpenDoc?.(doc.url, doc.name)}
                    style={[
                      styles.listItem,
                      {
                        backgroundColor: isDark ? colors.card : '#f8fafc',
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.listIconBox,
                        { backgroundColor: `${colors.primary}18` },
                      ]}
                    >
                      <FileText size={20} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.listItemTitle, { color: colors.foreground }]}
                        numberOfLines={1}
                      >
                        {doc.name}
                      </Text>
                      {doc.size ? (
                        <Text
                          style={[styles.listItemSub, { color: colors.mutedForeground }]}
                        >
                          {formatFileSize(doc.size)}
                        </Text>
                      ) : null}
                    </View>
                    {doc.url && (
                      <Download size={16} color={colors.mutedForeground} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}

          {/* TAB 3: AUDIO */}
          {activeTab === 'audio' && (
            audioItems.length === 0 ? (
              <View style={styles.emptyStateWrap}>
                <View
                  style={[
                    styles.emptyIconCircle,
                    { backgroundColor: `${colors.primary}12` },
                  ]}
                >
                  <Music size={36} color={colors.primary} strokeWidth={1.6} />
                </View>
                <Text style={[styles.emptyStateTitle, { color: colors.foreground }]}>
                  No voice messages or audio
                </Text>
                <Text style={[styles.emptyStateSub, { color: colors.mutedForeground }]}>
                  Voice recordings will appear here.
                </Text>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {audioItems.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.listItem,
                      {
                        backgroundColor: isDark ? colors.card : '#f8fafc',
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.listIconBox,
                        { backgroundColor: `${colors.primary}18` },
                      ]}
                    >
                      <Music size={20} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.listItemTitle, { color: colors.foreground }]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )
          )}

          {/* TAB 4: LINKS */}
          {activeTab === 'links' && (
            linkItems.length === 0 ? (
              <View style={styles.emptyStateWrap}>
                <View
                  style={[
                    styles.emptyIconCircle,
                    { backgroundColor: `${colors.primary}12` },
                  ]}
                >
                  <LinkIcon size={36} color={colors.primary} strokeWidth={1.6} />
                </View>
                <Text style={[styles.emptyStateTitle, { color: colors.foreground }]}>
                  No shared links yet
                </Text>
                <Text style={[styles.emptyStateSub, { color: colors.mutedForeground }]}>
                  Links shared in this conversation will be listed here.
                </Text>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {linkItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => handleOpenLink(item.url)}
                    style={[
                      styles.listItem,
                      {
                        backgroundColor: isDark ? colors.card : '#f8fafc',
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.listIconBox,
                        { backgroundColor: `${colors.primary}18` },
                      ]}
                    >
                      <LinkIcon size={18} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.listItemTitle, { color: colors.foreground }]}
                        numberOfLines={1}
                      >
                        {item.domain}
                      </Text>
                      <Text
                        style={[styles.listItemSub, { color: colors.primary }]}
                        numberOfLines={1}
                      >
                        {item.url}
                      </Text>
                    </View>
                    <ExternalLink size={15} color={colors.mutedForeground} />
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}
        </View>
      </ScrollView>

      {/* Add Member Modal Dialog */}
      <Modal
        visible={isAddMemberModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddMemberModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setIsAddMemberModalOpen(false)}
            activeOpacity={1}
          />
          <View
            style={[
              styles.dialogCard,
              {
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.dialogHeader}>
              <Text style={[styles.dialogTitle, { color: colors.foreground }]}>
                Add Member to Group
              </Text>
              <TouchableOpacity
                onPress={() => setIsAddMemberModalOpen(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={17} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            {/* Search contacts to add */}
            <View
              style={[
                styles.searchBox,
                {
                  backgroundColor: isDark ? '#27272a' : '#f8fafc',
                  borderColor: colors.border,
                },
              ]}
            >
              <Search size={14} color={colors.mutedForeground} />
              <TextInput
                value={memberSearchQuery}
                onChangeText={setMemberSearchQuery}
                placeholder="Search contacts..."
                placeholderTextColor={colors.mutedForeground}
                style={[styles.searchInput, { color: colors.foreground }]}
              />
            </View>

            {/* Available Contacts List */}
            <ScrollView style={{ maxHeight: 240 }} showsVerticalScrollIndicator={false}>
              {availableContacts.length === 0 ? (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: 'Open Sans' }}>
                    No contacts available to add.
                  </Text>
                </View>
              ) : (
                availableContacts.map((c) => {
                  const targetUid = c.contactUserId || c.id;
                  const isAdding = addingMemberId === targetUid;

                  return (
                    <View
                      key={c.id}
                      style={[
                        styles.contactRow,
                        { borderBottomColor: isDark ? '#27272a' : '#f1f5f9' },
                      ]}
                    >
                      <View
                        style={[
                          styles.smallAvatar,
                          { backgroundColor: `${colors.primary}18` },
                        ]}
                      >
                        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary }}>
                          {c.name.slice(0, 2).toUpperCase()}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text
                          style={{ fontSize: 13, fontWeight: '600', color: colors.foreground, fontFamily: 'Open Sans' }}
                          numberOfLines={1}
                        >
                          {c.name}
                        </Text>
                        <Text
                          style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: 'Open Sans' }}
                          numberOfLines={1}
                        >
                          {c.mobile || c.email}
                        </Text>
                      </View>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleAddMemberClick(targetUid)}
                        disabled={isAdding}
                        style={[
                          styles.addMemberActionBtn,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        {isAdding ? (
                          <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                          <Text style={styles.addMemberActionText}>Add</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    display: 'flex' as any,
    flexDirection: 'column',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  scrollContent: {
    padding: 18,
    gap: 16,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  profileHero: {
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    marginBottom: 4,
  },
  profileSub: {
    fontSize: 13,
    fontFamily: 'Open Sans',
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  actionBtn: {
    width: 68,
    height: 60,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  actionBtnLabel: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  tabsContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
  },
  tabsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 9,
  },
  tabItemActive: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 12.5,
    fontFamily: 'Open Sans',
  },
  tabContentArea: {
    paddingVertical: 12,
  },
  emptyStateWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  emptyStateSub: {
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mediaThumbWrap: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
  },
  mediaThumb: {
    width: '100%',
    height: '100%',
  },
  itemsList: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  listIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  listItemSub: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    marginTop: 2,
  },
  membersHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  membersCountLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  addMemberBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addMemberBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Open Sans',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  memberNameText: {
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  memberSubText: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    marginTop: 2,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  removeMemberBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogCard: {
    width: 360,
    maxWidth: '92%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dialogTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: 'Open Sans',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMemberActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  addMemberActionText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Open Sans',
  },
});
