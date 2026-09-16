import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  useWindowDimensions,
} from 'react-native';
import {
  Mail,
  Send,
  FileText,
  Trash2,
  Paperclip,
  Reply,
  Forward,
  MoreVertical,
  Search,
  Check,
  X,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
  Download,
  Eye,
  Settings2,
  Bell,
  Calendar,
  MessageSquare,
  Sparkles,
  Bot,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Flag,
  ReplyAll,
  Strikethrough,
  Code,
  Undo2,
  Redo2,
  Archive,
  AlertOctagon,
  Clock,
  CornerUpLeft,
  CornerUpRight,
  ArrowLeft,
  ChevronDown,
  Save,
} from 'lucide-react-native';
import { useTheme } from '../../../providers/theme-provider';
import type { GalleryEntry } from '../../types';

export interface EmailAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
}

export interface EmailItemData {
  id: string;
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
  headerTitle: string;
  intro: string;
  highlights: string[];
  bulletItems: { text: string; icon: string }[];
  closing: string;
  senderSignoff: string;
  attachments?: EmailAttachment[];
}

export const DEMO_EMAILS: EmailItemData[] = [
  {
    id: 'm1',
    name: 'Jordan Lee',
    email: 'jordan@demo.com',
    avatarInitials: 'JL',
    avatarBg: '#FCE7F3',
    avatarColor: '#DB2777',
    subject: 'Q3 Project Update — Action Required',
    dateStr: 'Sep 16, 2026 9:28 AM',
    relativeTime: 'about 1 hour ago',
    read: false,
    unreadDot: true,
    badges: ['Unread', 'Inbox', '+1'],
    headerTitle: 'Q3 Project Update',
    intro:
      'Here is the latest update on the Q3 deliverables. We are currently at 85% completion for the primary milestones.',
    highlights: ['85% completion'],
    bulletItems: [
      { text: 'Dashboard redesign: Completed', icon: '✅' },
      { text: 'API integration: In progress', icon: '🔄' },
      { text: 'QA testing: Starts Monday', icon: '📅' },
    ],
    closing: 'Please review and reply with any blockers by Friday.',
    senderSignoff: 'Best,\nJordan',
    attachments: [
      {
        id: 'att1',
        name: 'quarterly-report.pdf',
        type: 'PDF',
        size: '2.4 MB',
      },
    ],
  },
  {
    id: 'm2',
    name: 'Sam Rivera',
    email: 'sam.rivera@amoga.dev',
    avatarInitials: 'SR',
    avatarBg: '#E0F2FE',
    avatarColor: '#0284C7',
    subject: 'Meeting Notes — Component Architecture Sync',
    dateStr: 'Sep 16, 2026 7:15 AM',
    relativeTime: 'about 3 hours ago',
    read: true,
    unreadDot: false,
    badges: ['Inbox', 'Work'],
    headerTitle: 'Meeting Notes — Component Architecture Sync',
    intro:
      'Attached are the notes from today’s cross-functional design tokens and responsive layout review.',
    highlights: ['design tokens'],
    bulletItems: [
      { text: 'Canvas vs Mobile emulator synchronization: Approved', icon: '✅' },
      { text: 'Open Sans typography token standardization: Completed', icon: '✅' },
      { text: 'Interactive code snippets: In QA review', icon: '🔄' },
    ],
    closing: 'Let me know if anything was missed in the summary.',
    senderSignoff: 'Regards,\nSam',
    attachments: [
      {
        id: 'att2',
        name: 'Architecture-Notes.pdf',
        type: 'PDF',
        size: '1.8 MB',
      },
    ],
  },
  {
    id: 'm3',
    name: 'Morgan Zhang',
    email: 'morgan.z@preview.internal',
    avatarInitials: 'MZ',
    avatarBg: '#FEF3C7',
    avatarColor: '#D97706',
    subject: 'Welcome to the Dev Preview Environment',
    dateStr: 'Sep 15, 2026 4:00 PM',
    relativeTime: '1 day ago',
    read: false,
    unreadDot: true,
    badges: ['Unread', 'Inbox'],
    headerTitle: 'Welcome to the Dev Preview Environment',
    intro:
      'This is a preview-only email used to test email rendering, thread tracking, and rich body formatting.',
    highlights: ['preview-only email'],
    bulletItems: [
      { text: 'Multi-folder synchronization active', icon: '⚡' },
      { text: 'Fast attachment previewers enabled', icon: '📎' },
    ],
    closing: 'Feel free to reply or compose new test threads anytime.',
    senderSignoff: 'Cheers,\nMorgan',
    attachments: [],
  },
];

// =========================================================================
// 1. COMPLETE MAIL PAGE PREVIEW (DUAL PANE)
// =========================================================================

export function CompleteMailPagePreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [emailList, setEmailList] = useState<EmailItemData[]>(DEMO_EMAILS);
  const [selectedId, setSelectedId] = useState<string>(DEMO_EMAILS[0].id);
  const [activeTab, setActiveTab] = useState<'Inbox' | 'Sent' | 'Folder' | 'Contact' | 'Groups'>('Inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [starredMap, setStarredMap] = useState<Record<string, boolean>>({ m1: true });

  // Compose State
  const [composeTo, setComposeTo] = useState('');
  const [composeFrom, setComposeFrom] = useState('ask@morrai.com');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [composeCc, setComposeCc] = useState('');
  const [composeBcc, setComposeBcc] = useState('');
  const [composeAttachments, setComposeAttachments] = useState<EmailAttachment[]>([
    {
      id: 'att-demo-1',
      name: 'quarterly-report.pdf',
      type: 'PDF',
      size: '2.4 MB',
    },
  ]);

  const selectedEmail = emailList.find((e) => e.id === selectedId) || emailList[0];

  const handleSelectEmail = (id: string) => {
    setSelectedId(id);
    setIsComposing(false);
    setEmailList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true, unreadDot: false } : item))
    );
  };

  const handleDeleteEmail = (id: string) => {
    setEmailList((prev) => {
      const remaining = prev.filter((item) => item.id !== id);
      if (selectedId === id && remaining.length > 0) {
        setSelectedId(remaining[0].id);
      }
      return remaining;
    });
  };

  const filteredEmails = emailList.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q)
    );
  });

  const containerBg = isDark ? '#0f172a' : '#ffffff';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const itemSelectedBg = isDark ? '#1e1b4b' : '#f5f3ff';
  const itemSelectedBorder = isDark ? '#6366f1' : '#7c3aed';
  const badgeBg = isDark ? '#1e293b' : '#f1f5f9';
  const badgeText = isDark ? '#94a3b8' : '#475569';
  const inputBg = isDark ? '#1e293b' : '#f8fafc';

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.mailContainer,
          { backgroundColor: containerBg, borderColor },
        ]}
      >
        <View style={styles.dualPaneWrapper}>
          {/* LEFT PANE */}
          <View
            style={[
              styles.leftEmailListPane,
              { borderRightColor: borderColor, backgroundColor: isDark ? '#0b0f19' : '#ffffff' },
              !isDesktop && selectedEmail && !isComposing ? styles.hideOnMobile : null,
            ]}
          >
            {/* Tabs & Pagination */}
            <View style={styles.tabsRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsScrollContent}
              >
                {(['Inbox', 'Sent', 'Folder', 'Contact', 'Groups'] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <TouchableOpacity
                      key={tab}
                      onPress={() => setActiveTab(tab)}
                      style={[
                        styles.tabItemBtn,
                        isActive && styles.tabItemBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tabItemText,
                          {
                            color: isActive ? (isDark ? '#c084fc' : '#7c3aed') : textMuted,
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
                  1-3 of 3
                </Text>
                <TouchableOpacity style={styles.pageChevronBtn}>
                  <ChevronLeft size={13} color={textMuted} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.pageChevronBtn}>
                  <ChevronRight size={13} color={textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Search & New Button */}
            <View style={styles.searchAndNewRow}>
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
                  style={[styles.searchTextInput, { color: textMain }]}
                />
              </View>

              <TouchableOpacity
                onPress={() => setIsComposing((c) => !c)}
                style={styles.newEmailPillBtn}
              >
                <Mail size={14} color="#ffffff" strokeWidth={2.2} />
                <Text style={styles.newEmailPillText}>New +</Text>
              </TouchableOpacity>
            </View>

            {/* Email List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.emailListScroll}
              contentContainerStyle={{ paddingVertical: 4 }}
            >
              {filteredEmails.map((item) => {
                const isSelected = item.id === selectedId && !isComposing;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleSelectEmail(item.id)}
                    style={[
                      styles.emailCardItem,
                      {
                        backgroundColor: isSelected ? itemSelectedBg : 'transparent',
                        borderColor: isSelected ? itemSelectedBorder : borderColor,
                      },
                    ]}
                  >
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
                        {item.unreadDot && <View style={styles.blueUnreadDot} />}
                      </View>
                      <Text style={[styles.relativeTimeText, { color: textMuted }]}>
                        {item.relativeTime}
                      </Text>
                    </View>

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

                    <Text
                      numberOfLines={1}
                      style={[styles.cardSnippetText, { color: textMuted }]}
                    >
                      {item.intro}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Bottom Pagination */}
            <View style={[styles.bottomPaginationRow, { borderTopColor: borderColor }]}>
              <Text style={[styles.paginationText, { color: textMuted }]}>
                1-3 of 3
              </Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity style={styles.pageChevronBtn}>
                  <ChevronLeft size={13} color={textMuted} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.pageChevronBtn}>
                  <ChevronRight size={13} color={textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* RIGHT PANE */}
          <View
            style={[
              styles.rightDetailPane,
              { backgroundColor: isDark ? '#0f172a' : '#ffffff' },
            ]}
          >
            {isComposing ? (
              /* ── COMPOSE NEW MESSAGE VIEW MATCHING EXACT SCREENSHOT ── */
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.composeContainerStyle}
                showsVerticalScrollIndicator={false}
              >
                {/* Header: New Message & Back to Message */}
                <View style={[styles.composeHeaderRow, { borderBottomColor: borderColor }]}>
                  <Text style={[styles.detailHeading, { color: textMain }]}>
                    New Message
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsComposing(false)}
                    style={styles.backToMsgBtn}
                  >
                    <ArrowLeft size={15} color={textMain} />
                    <Text style={[styles.backToMsgText, { color: textMain }]}>
                      Back to Message
                    </Text>
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
                    <Text style={[styles.templateDropdownText, { color: textMain }]}>Blank</Text>
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
                        <Text style={{ fontSize: 11.5, color: '#7c3aed', fontFamily: 'Open Sans', fontWeight: '600' }}>
                          Cc
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setShowBcc((s) => !s)}>
                        <Text style={{ fontSize: 11.5, color: '#7c3aed', fontFamily: 'Open Sans', fontWeight: '600' }}>
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
                <View style={styles.fieldSection}>
                  <Text style={[styles.fieldLabel, { color: textMain }]}>Message</Text>
                  <View
                    style={[
                      styles.emailContentBox,
                      { backgroundColor: isDark ? '#141824' : '#ffffff', borderColor },
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
                        onPress={() => alert('Attach file')}
                        style={styles.toolbarBtn}
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
                        { color: textMain },
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
                          <FileText size={16} color="#7c3aed" />
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
                        >
                          <Download size={15} color={textMuted} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => alert(`Previewing ${att.name}...`)}
                          style={styles.attActionBtn}
                        >
                          <Eye size={15} color={textMuted} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            setComposeAttachments((prev) => prev.filter((a) => a.id !== att.id))
                          }
                          style={styles.attActionBtn}
                        >
                          <X size={15} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() => alert('Attach file dialog')}
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
                    onPress={() => setIsComposing(false)}
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
                      onPress={() => {
                        alert('Email sent successfully!');
                        setIsComposing(false);
                      }}
                      style={styles.sendPurpleBtn}
                    >
                      <Send size={14} color="#ffffff" />
                      <Text style={styles.sendPurpleBtnText}>Send</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            ) : selectedEmail ? (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.detailScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Header */}
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
                        <Text style={[styles.fromEmailText, { color: textMuted }]}>
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
                    >
                      <Bell size={16} color="#f97316" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        setStarredMap((prev) => ({
                          ...prev,
                          [selectedEmail.id]: !prev[selectedEmail.id],
                        }))
                      }
                      style={styles.topActionBtn}
                    >
                      <Flag
                        size={16}
                        color={starredMap[selectedEmail.id] ? '#ef4444' : textMuted}
                        fill={starredMap[selectedEmail.id] ? '#ef4444' : 'none'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.topActionBtn}>
                      <MoreVertical size={16} color={textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.topActionBtn}>
                      <X size={16} color={textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Subject */}
                <View style={styles.subjectContainer}>
                  <Text style={[styles.sectionFieldLabel, { color: textMuted }]}>
                    Subject
                  </Text>
                  <View
                    style={[
                      styles.subjectDisplayBox,
                      { backgroundColor: containerBg, borderColor },
                    ]}
                  >
                    <Text style={[styles.subjectDisplayText, { color: textMain }]}>
                      {selectedEmail.subject}
                    </Text>
                  </View>
                </View>

                {/* Email Content */}
                <View style={styles.emailContentSection}>
                  <Text style={[styles.sectionFieldLabel, { color: textMuted }]}>
                    Email Content
                  </Text>

                  <View
                    style={[
                      styles.emailContentBox,
                      { backgroundColor: containerBg, borderColor },
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
                      <TouchableOpacity style={styles.toolbarBtn}>
                        <Paperclip size={14} color={textMain} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.emailBodyInner}>
                      <Text style={[styles.bodyHeaderTitle, { color: textMain }]}>
                        {selectedEmail.headerTitle}
                      </Text>

                      <Text style={[styles.bodyNormalText, { color: textMain }]}>
                        Hi team,
                      </Text>

                      <Text style={[styles.bodyNormalText, { color: textMain }]}>
                        {selectedEmail.intro.split('85% completion')[0]}
                        <Text style={{ fontWeight: '600' }}>85% completion</Text>
                        {selectedEmail.intro.split('85% completion')[1] || ''}
                      </Text>

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

                      <Text style={[styles.bodyNormalText, { color: textMain }]}>
                        {selectedEmail.closing}
                      </Text>

                      <Text style={[styles.bodyNormalText, { color: textMain, marginTop: 12 }]}>
                        Best,{'\n'}Jordan
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Attachments */}
                {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                  <View style={styles.attachmentsSection}>
                    <Text style={[styles.attachmentsHeading, { color: textMain }]}>
                      Attachments ({selectedEmail.attachments.length})
                    </Text>

                    {selectedEmail.attachments.map((att) => (
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
                            <FileText size={16} color="#7c3aed" />
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
                          >
                            <Download size={15} color={textMuted} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => alert(`Previewing ${att.name}...`)}
                            style={styles.attActionBtn}
                          >
                            <Eye size={15} color={textMuted} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}

                    <TouchableOpacity
                      onPress={() => alert('Opening file chooser...')}
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
                )}

                {/* Bottom Actions */}
                <View style={[styles.bottomActionsBar, { borderTopColor: borderColor }]}>
                  <View style={styles.bottomLeftActionGroup}>
                    <TouchableOpacity
                      onPress={() => setIsComposing(true)}
                      style={[styles.actionOutlineBtn, { borderColor }]}
                    >
                      <Reply size={13} color={textMain} />
                      <Text style={[styles.actionOutlineBtnText, { color: textMain }]}>
                        Reply
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setIsComposing(true)}
                      style={[styles.actionOutlineBtn, { borderColor }]}
                    >
                      <ReplyAll size={13} color={textMain} />
                      <Text style={[styles.actionOutlineBtnText, { color: textMain }]}>
                        Reply All
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setIsComposing(true)}
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
                <Text style={{ color: textMuted, marginTop: 10, fontSize: 13 }}>
                  Select an email to view its content
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 2. EMAIL COMPOSE PREVIEW (STANDALONE CARD MATCHING EXACT SCREENSHOTS)
// =========================================================================

export function EmailComposePreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [subject, setSubject] = useState('');
  const [to, setTo] = useState('');
  const [from] = useState('ask@morrai.com');
  const [body, setBody] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [attachments, setAttachments] = useState<EmailAttachment[]>([
    {
      id: 'att-1',
      name: 'quarterly-report.pdf',
      type: 'PDF',
      size: '2.4 MB',
    },
  ]);

  const containerBg = isDark ? '#0f172a' : '#ffffff';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#1e293b' : '#f8fafc';

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.mailContainer,
          { backgroundColor: containerBg, borderColor },
        ]}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.composeContainerStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={[styles.composeHeaderRow, { borderBottomColor: borderColor }]}>
            <Text style={[styles.detailHeading, { color: textMain }]}>
              New Message
            </Text>
            <TouchableOpacity
              onPress={() => alert('Back to Message')}
              style={styles.backToMsgBtn}
            >
              <ArrowLeft size={15} color={textMain} />
              <Text style={[styles.backToMsgText, { color: textMain }]}>
                Back to Message
              </Text>
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
              <Text style={[styles.templateDropdownText, { color: textMain }]}>Blank</Text>
              <ChevronDown size={14} color={textMuted} />
            </TouchableOpacity>
          </View>

          {/* 2. Subject */}
          <View style={styles.fieldSection}>
            <Text style={[styles.fieldLabel, { color: textMain }]}>Subject</Text>
            <TextInput
              placeholder="Enter subject"
              placeholderTextColor={textMuted}
              value={subject}
              onChangeText={setSubject}
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
              value={from}
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
                  <Text style={{ fontSize: 11.5, color: '#7c3aed', fontFamily: 'Open Sans', fontWeight: '600' }}>
                    Cc
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowBcc((s) => !s)}>
                  <Text style={{ fontSize: 11.5, color: '#7c3aed', fontFamily: 'Open Sans', fontWeight: '600' }}>
                    Bcc
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              placeholder="Recipient email address (e.g. recipient@example.com)"
              placeholderTextColor={textMuted}
              value={to}
              onChangeText={setTo}
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
                value={cc}
                onChangeText={setCc}
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
                value={bcc}
                onChangeText={setBcc}
                style={[
                  styles.inputBox,
                  { backgroundColor: inputBg, borderColor, color: textMain },
                ]}
              />
            </View>
          )}

          {/* 5. Message with Rich Toolbar */}
          <View style={styles.fieldSection}>
            <Text style={[styles.fieldLabel, { color: textMain }]}>Message</Text>
            <View
              style={[
                styles.emailContentBox,
                { backgroundColor: isDark ? '#141824' : '#ffffff', borderColor },
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
                  onPress={() => alert('Attach file')}
                  style={styles.toolbarBtn}
                >
                  <Paperclip size={14} color={textMain} />
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="Write your email message..."
                placeholderTextColor={textMuted}
                value={body}
                onChangeText={setBody}
                multiline
                textAlignVertical="top"
                style={[
                  styles.composeTextArea,
                  { color: textMain },
                ]}
              />
            </View>
          </View>

          {/* 6. Attachments Section */}
          <View style={styles.attachmentsSection}>
            <Text style={[styles.attachmentsHeading, { color: textMain }]}>
              Attachments ({attachments.length})
            </Text>

            {attachments.map((att) => (
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
                    <FileText size={16} color="#7c3aed" />
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
                  >
                    <Download size={15} color={textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => alert(`Previewing ${att.name}...`)}
                    style={styles.attActionBtn}
                  >
                    <Eye size={15} color={textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      setAttachments((prev) => prev.filter((a) => a.id !== att.id))
                    }
                    style={styles.attActionBtn}
                  >
                    <X size={15} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={() => alert('Attach file dialog')}
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
              onPress={() => alert('Cancelled')}
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
                onPress={() => alert('Email sent successfully!')}
                style={styles.sendPurpleBtn}
              >
                <Send size={14} color="#ffffff" />
                <Text style={styles.sendPurpleBtnText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// =========================================================================
// 3. EMAIL VIEW PREVIEW (STANDALONE CARD)
// =========================================================================

export function EmailViewPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const email = DEMO_EMAILS[0];

  const containerBg = isDark ? '#0f172a' : '#ffffff';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#1e293b' : '#f8fafc';

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.mailContainer,
          { backgroundColor: containerBg, borderColor, padding: 18, gap: 16 },
        ]}
      >
        {/* Header: From, Avatar, Date, and Top Right Action Icons */}
        <View style={[styles.detailHeaderBar, { borderBottomColor: borderColor }]}>
          <View style={styles.senderProfileRow}>
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: email.avatarBg },
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  { color: email.avatarColor },
                ]}
              >
                {email.avatarInitials}
              </Text>
            </View>

            <View style={styles.senderDetailsCol}>
              <View style={styles.senderNameAndEmail}>
                <Text style={[styles.fromNameText, { color: textMain }]}>
                  From: {email.name}
                </Text>
                <Text style={[styles.fromEmailText, { color: textMuted }]}>
                  {email.email}
                </Text>
              </View>
              <Text style={[styles.toMeDateText, { color: textMuted }]}>
                to me {email.dateStr} - {email.relativeTime}
              </Text>
            </View>
          </View>

          <View style={styles.detailTopActions}>
            <TouchableOpacity onPress={() => alert('Notifications toggled')} style={styles.topActionBtn}>
              <Bell size={16} color="#f97316" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.topActionBtn}>
              <Flag size={16} color={textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.topActionBtn}>
              <MoreVertical size={16} color={textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.topActionBtn}>
              <X size={16} color={textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Subject Section */}
        <View style={styles.subjectContainer}>
          <Text style={[styles.sectionFieldLabel, { color: textMuted }]}>
            Subject
          </Text>
          <View
            style={[
              styles.subjectDisplayBox,
              { backgroundColor: containerBg, borderColor },
            ]}
          >
            <Text style={[styles.subjectDisplayText, { color: textMain }]}>
              {email.subject}
            </Text>
          </View>
        </View>

        {/* Email Content Section */}
        <View style={styles.emailContentSection}>
          <Text style={[styles.sectionFieldLabel, { color: textMuted }]}>
            Email Content
          </Text>

          <View
            style={[
              styles.emailContentBox,
              { backgroundColor: containerBg, borderColor },
            ]}
          >
            {/* Formatting Toolbar */}
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
              <TouchableOpacity style={styles.toolbarBtn}>
                <Paperclip size={14} color={textMain} />
              </TouchableOpacity>
            </View>

            {/* Email Body Inner */}
            <View style={styles.emailBodyInner}>
              <Text style={[styles.bodyHeaderTitle, { color: textMain }]}>
                {email.headerTitle}
              </Text>

              <Text style={[styles.bodyNormalText, { color: textMain }]}>
                Hi team,
              </Text>

              <Text style={[styles.bodyNormalText, { color: textMain }]}>
                {email.intro.split('85% completion')[0]}
                <Text style={{ fontWeight: '600' }}>85% completion</Text>
                {email.intro.split('85% completion')[1] || ''}
              </Text>

              <View style={styles.bulletsList}>
                {email.bulletItems.map((bullet, idx) => (
                  <View key={idx} style={styles.bulletItemRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={[styles.bulletItemText, { color: textMain }]}>
                      {bullet.text} {bullet.icon}
                    </Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.bodyNormalText, { color: textMain }]}>
                {email.closing}
              </Text>

              <Text style={[styles.bodyNormalText, { color: textMain, marginTop: 12 }]}>
                Best,{'\n'}Jordan
              </Text>
            </View>
          </View>
        </View>

        {/* Attachments Section */}
        {email.attachments && email.attachments.length > 0 && (
          <View style={styles.attachmentsSection}>
            <Text style={[styles.attachmentsHeading, { color: textMain }]}>
              Attachments ({email.attachments.length})
            </Text>

            {email.attachments.map((att) => (
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
                    <FileText size={16} color="#7c3aed" />
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
                  >
                    <Download size={15} color={textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => alert(`Previewing ${att.name}...`)}
                    style={styles.attActionBtn}
                  >
                    <Eye size={15} color={textMuted} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={() => alert('Opening file chooser...')}
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
        )}

        {/* Bottom Actions */}
        <View style={[styles.bottomActionsBar, { borderTopColor: borderColor }]}>
          <View style={styles.bottomLeftActionGroup}>
            <TouchableOpacity
              onPress={() => alert('Opening reply...')}
              style={[styles.actionOutlineBtn, { borderColor }]}
            >
              <Reply size={13} color={textMain} />
              <Text style={[styles.actionOutlineBtnText, { color: textMain }]}>
                Reply
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => alert('Opening reply all...')}
              style={[styles.actionOutlineBtn, { borderColor }]}
            >
              <ReplyAll size={13} color={textMain} />
              <Text style={[styles.actionOutlineBtnText, { color: textMain }]}>
                Reply All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => alert('Forwarding email...')}
              style={[styles.actionOutlineBtn, { borderColor }]}
            >
              <Forward size={13} color={textMain} />
              <Text style={[styles.actionOutlineBtnText, { color: textMain }]}>
                Forward
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => alert('Delete email action')}
            style={[styles.deleteOutlineBtn, { borderColor: '#fee2e2' }]}
          >
            <Trash2 size={13} color="#ef4444" />
            <Text style={styles.deleteOutlineBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 4. EMAIL DETAIL PREVIEW
// =========================================================================

export function EmailDetailPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const containerBg = isDark ? '#0f172a' : '#ffffff';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const toolbarBg = isDark ? '#141e33' : '#f8fafc';

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.mailContainer,
          {
            backgroundColor: containerBg,
            borderColor,
            overflow: 'hidden',
          },
        ]}
      >
        {/* 1. Top Action Toolbar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: borderColor,
          }}
        >
          {/* Left Actions */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity onPress={() => alert('Archive')}>
              <Archive size={16} color={textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Delete')}>
              <Trash2 size={16} color={textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Report Spam')}>
              <AlertOctagon size={16} color={textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Snooze / Clock')}>
              <Clock size={16} color={textMuted} />
            </TouchableOpacity>
          </View>

          {/* Right Actions */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <TouchableOpacity onPress={() => alert('Reply')}>
              <CornerUpLeft size={16} color={textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Reply All')}>
              <ReplyAll size={16} color={textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Forward')}>
              <CornerUpRight size={16} color={textMuted} />
            </TouchableOpacity>

            <View
              style={{
                width: 1,
                height: 14,
                backgroundColor: borderColor,
                marginHorizontal: 2,
              }}
            />

            <TouchableOpacity onPress={() => alert('More Options')}>
              <MoreVertical size={16} color={textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Close')}>
              <X size={16} color={textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Top Sender Row (Avatar, Name, Email, Date) */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: '#ede9fe',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#7c3aed', fontFamily: 'Open Sans' }}>
                JL
              </Text>
            </View>

            <View style={{ gap: 2 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: textMain, fontFamily: 'Open Sans' }}>
                From: Jordan Lee
              </Text>
              <Text style={{ fontSize: 11.5, color: textMuted, fontFamily: 'Open Sans' }}>
                jordan@demo.com
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 11.5, color: textMuted, fontFamily: 'Open Sans' }}>
            Sep 16, 2026 9:28 AM
          </Text>
        </View>

        {/* 3. Subject Section */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
          <Text
            style={{
              fontSize: 14.5,
              fontWeight: '600',
              color: textMain,
              fontFamily: 'Open Sans',
              letterSpacing: -0.2,
            }}
          >
            Q3 Project Update — Action Required
          </Text>
          <Text
            style={{
              fontSize: 11.5,
              color: textMuted,
              marginTop: 3,
              fontFamily: 'Open Sans',
            }}
          >
            Reply-To: jordan@demo.com
          </Text>
        </View>

        {/* 4. Subheader */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 10,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: '#ede9fe',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 10.5, fontWeight: '600', color: '#7c3aed', fontFamily: 'Open Sans' }}>
                JL
              </Text>
            </View>
            <Text style={{ fontSize: 12.5, fontWeight: '500', color: textMain, fontFamily: 'Open Sans' }}>
              jordan@demo.com
            </Text>
          </View>

          <Text style={{ fontSize: 11.5, color: textMuted, fontFamily: 'Open Sans' }}>
            about 11 hours ago
          </Text>
        </View>

        {/* 5. Email Body Content */}
        <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 24, gap: 12 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: textMain,
              fontFamily: 'Open Sans',
              letterSpacing: -0.2,
            }}
          >
            Q3 Project Update
          </Text>

          <Text style={{ fontSize: 12.5, color: textMain, fontFamily: 'Open Sans', lineHeight: 19 }}>
            Hi team,
          </Text>

          <Text style={{ fontSize: 12.5, color: textMain, fontFamily: 'Open Sans', lineHeight: 19 }}>
            Here is the latest update on the Q3 deliverables. We are currently at{' '}
            <Text style={{ fontWeight: '600' }}>85% completion</Text> for the primary milestones.
          </Text>

          <View style={{ gap: 6, paddingLeft: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 13, color: textMuted }}>•</Text>
              <Text style={{ fontSize: 12.5, color: textMain, fontFamily: 'Open Sans' }}>
                <Text style={{ fontWeight: '600' }}>Dashboard redesign:</Text> Completed ✅
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 13, color: textMuted }}>•</Text>
              <Text style={{ fontSize: 12.5, color: textMain, fontFamily: 'Open Sans' }}>
                <Text style={{ fontWeight: '600' }}>API integration:</Text> In progress 🔄
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 13, color: textMuted }}>•</Text>
              <Text style={{ fontSize: 12.5, color: textMain, fontFamily: 'Open Sans' }}>
                <Text style={{ fontWeight: '600' }}>QA testing:</Text> Starts Monday 📅
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 12.5, color: textMain, fontFamily: 'Open Sans', lineHeight: 19 }}>
            Please review and reply with any blockers by Friday.
          </Text>

          <Text style={{ fontSize: 12.5, color: textMain, fontFamily: 'Open Sans', lineHeight: 19, marginTop: 4 }}>
            Best,{'\n'}Jordan
          </Text>
        </View>

        {/* 6. Docked Bottom Formatting Toolbar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: borderColor,
            backgroundColor: toolbarBg,
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <TouchableOpacity style={styles.toolbarBtn}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: textMain }}>B</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Text style={{ fontSize: 12, fontStyle: 'italic', fontWeight: '500', color: textMain }}>I</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Strikethrough size={14} color={textMain} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Code size={14} color={textMain} />
          </TouchableOpacity>

          <View style={[styles.toolbarDivider, { backgroundColor: borderColor }]} />

          {(['H1', 'H2', 'H3', 'H4', 'H5', 'H6'] as const).map((h) => (
            <TouchableOpacity key={h} style={styles.toolbarBtn}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: textMain }}>
                {h}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={[styles.toolbarDivider, { backgroundColor: borderColor }]} />

          <TouchableOpacity style={styles.toolbarBtn}>
            <List size={14} color={textMain} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <ListOrdered size={14} color={textMain} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Link2 size={14} color={textMain} />
          </TouchableOpacity>

          <View style={[styles.toolbarDivider, { backgroundColor: borderColor }]} />

          <TouchableOpacity style={styles.toolbarBtn}>
            <Undo2 size={14} color={textMain} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Redo2 size={14} color={textMain} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 5. EMAIL EDITOR PREVIEW (INLINE REPLY)
// =========================================================================

export function EmailEditorPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const [content, setContent] = useState('');

  const containerBg = isDark ? '#0f172a' : '#ffffff';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const toolbarBg = isDark ? '#141e33' : '#f8fafc';
  const kbdBg = isDark ? '#1e293b' : '#f1f5f9';

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.mailContainer,
          { backgroundColor: containerBg, borderColor, overflow: 'hidden' },
        ]}
      >
        {/* Formatting Toolbar */}
        <View
          style={[
            styles.richToolbar,
            { borderBottomColor: borderColor, backgroundColor: toolbarBg, paddingHorizontal: 12, paddingVertical: 8, gap: 10 },
          ]}
        >
          <TouchableOpacity style={styles.toolbarBtn}>
            <Text style={[styles.toolbarTextBtn, { color: textMain }]}>B</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Text style={[styles.toolbarTextBtn, { fontStyle: 'italic', color: textMain }]}>I</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Strikethrough size={14} color={textMain} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Code size={14} color={textMain} />
          </TouchableOpacity>

          <View style={[styles.toolbarDivider, { backgroundColor: borderColor }]} />

          {(['H1', 'H2', 'H3', 'H4', 'H5', 'H6'] as const).map((h) => (
            <TouchableOpacity key={h} style={styles.toolbarBtn}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: textMain }}>
                {h}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={[styles.toolbarDivider, { backgroundColor: borderColor }]} />

          <TouchableOpacity style={styles.toolbarBtn}>
            <List size={14} color={textMain} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <ListOrdered size={14} color={textMain} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Link2 size={14} color={textMain} />
          </TouchableOpacity>

          <View style={[styles.toolbarDivider, { backgroundColor: borderColor }]} />

          <TouchableOpacity style={styles.toolbarBtn}>
            <Undo2 size={14} color={textMain} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Redo2 size={14} color={textMain} />
          </TouchableOpacity>
        </View>

        {/* Editor Body */}
        <View style={{ padding: 16, gap: 12 }}>
          {/* Draft indicator */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#10b981' }}>
              Draft
            </Text>
            <Text style={{ fontSize: 12, color: textMuted }}>
              to
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: textMain }}>
              jordan@demo.com
            </Text>
          </View>

          {/* Multi-line Reply Input */}
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Reply to Jordan Lee..."
            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
            multiline
            style={{
              minHeight: 120,
              fontSize: 12.5,
              color: textMain,
              fontFamily: 'Open Sans',
              textAlignVertical: 'top',
              padding: 0,
            }}
          />

          {/* Bottom Toolbar */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: borderColor,
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 11, color: textMuted, fontFamily: 'Open Sans' }}>
                Tip: Press
              </Text>
              <View
                style={{
                  backgroundColor: kbdBg,
                  borderWidth: 1,
                  borderColor,
                  paddingHorizontal: 5,
                  paddingVertical: 1.5,
                  borderRadius: 4,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '600', color: textMain }}>
                  Cmd
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: textMuted }}>+</Text>
              <View
                style={{
                  backgroundColor: kbdBg,
                  borderWidth: 1,
                  borderColor,
                  paddingHorizontal: 5,
                  paddingVertical: 1.5,
                  borderRadius: 4,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '600', color: textMain }}>
                  J
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: textMuted, fontFamily: 'Open Sans' }}>
                for AI autocomplete
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                alert('Reply sent successfully!');
                setContent('');
              }}
              style={{
                backgroundColor: isDark ? '#475569' : '#334155',
                paddingHorizontal: 18,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '600', fontFamily: 'Open Sans' }}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 6. EMAIL CARD ITEM PREVIEW (SIDEBAR ITEM)
// =========================================================================

export function EmailCardItemPreview({ isSelected = true }: { isSelected?: boolean }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const item = DEMO_EMAILS[0];

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.emailCardItem,
          {
            backgroundColor: isSelected ? (isDark ? '#1e1b4b' : '#f5f3ff') : colors.card,
            borderColor: isSelected ? '#7c3aed' : colors.border,
          },
        ]}
      >
        <View style={styles.emailCardHeader}>
          <View style={styles.senderNameBox}>
            <Text style={[styles.senderNameLabel, { color: colors.foreground, fontWeight: '600' }]}>
              {item.name}
            </Text>
            <View style={styles.blueUnreadDot} />
          </View>
          <Text style={[styles.relativeTimeText, { color: colors.mutedForeground }]}>
            {item.relativeTime}
          </Text>
        </View>

        <View style={styles.badgesRow}>
          {item.badges.map((badge, idx) => (
            <View key={idx} style={[styles.badgePill, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
              <Text style={[styles.badgePillText, { color: isDark ? '#94a3b8' : '#475569' }]}>
                {badge}
              </Text>
            </View>
          ))}
        </View>

        <Text numberOfLines={1} style={[styles.cardSubjectText, { color: colors.foreground, fontWeight: '600' }]}>
          {item.subject}
        </Text>
        <Text numberOfLines={1} style={[styles.cardSnippetText, { color: colors.mutedForeground }]}>
          {item.intro}
        </Text>
      </View>
    </View>
  );
}

// =========================================================================
// COMBINED MAIL PREVIEWS
// =========================================================================

export function MailPreviews({ entry }: { entry?: GalleryEntry }) {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <EmailComposePreview />
      <View style={{ height: 24 }} />
      <CompleteMailPagePreview />
      <View style={{ height: 24 }} />
      <EmailViewPreview />
      <View style={{ height: 24 }} />
      <EmailDetailPreview />
      <View style={{ height: 24 }} />
      <EmailEditorPreview />
      <View style={{ height: 24 }} />
      <EmailCardItemPreview isSelected={true} />
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
    padding: 16,
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
  mailContainer: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dualPaneWrapper: {
    flexDirection: 'row',
    minHeight: 520,
  },
  hideOnMobile: {
    display: 'none',
  },

  // ── Left Pane ─────────────────────────────────────────────────────────────
  leftEmailListPane: {
    width: 320,
    borderRightWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  tabsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tabItemBtn: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  tabItemBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#7c3aed',
  },
  tabItemText: {
    fontSize: 11.5,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
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
  newEmailPillBtn: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
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
  },
  emailCardItem: {
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
    backgroundColor: '#3b82f6',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
  },

  // ── Right Pane ────────────────────────────────────────────────────────────
  rightDetailPane: {
    flex: 1,
    minWidth: 320,
  },
  detailScrollContent: {
    padding: 16,
    gap: 14,
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
    fontWeight: '500',
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
    fontSize: 15,
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
    width: 34,
    height: 34,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },

  // Bottom Action Buttons
  bottomActionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    flexWrap: 'wrap',
    gap: 8,
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
    fontWeight: '500',
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
    fontWeight: '500',
    color: '#ef4444',
    fontFamily: 'Open Sans',
  },

  // Compose View
  composeContainerStyle: {
    padding: 20,
    gap: 16,
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
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  backToMsgBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  backToMsgText: {
    fontSize: 12.5,
    fontWeight: '500',
    fontFamily: 'Open Sans',
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
    marginTop: 10,
    borderTopWidth: 1,
  },
  sendPurpleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#7c3aed',
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
