import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  FileText,
  Folder,
  FolderOpen,
  UploadCloud,
  Download,
  Eye,
  Trash2,
  Copy,
  Check,
  Search,
  Filter,
  Grid,
  List,
  ListOrdered,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Film,
  Archive,
  MoreVertical,
  Plus,
  ArrowUpRight,
  HardDrive,
  Bell,
  Flag,
  ArrowLeftRight,
  ArrowUpDown,
  SlidersHorizontal,
  Paperclip,
  Save,
  AlertTriangle,
  ArrowLeft,
  LayoutGrid,
} from 'lucide-react-native';
import { useTheme } from '../../../providers/theme-provider';
import type { GalleryEntry } from '../../types';

interface AttachedFile {
  id: string;
  name: string;
  path: string;
  size: string;
  type: string;
  category: string;
  date: string;
  timeAgo: string;
  color: string;
  bgLight: string;
  bgDark: string;
  badgeLabel: string;
}

const SAMPLE_FILES_DATA: AttachedFile[] = [
  {
    id: 'f1',
    name: 'Project-Roadmap-2026.pdf',
    path: 'Files/my-space/Pdf',
    size: '2.4 MB',
    type: 'PDF',
    category: 'Pdf',
    date: 'Aug 19, 2026',
    timeAgo: '2 hours ago',
    color: '#ef4444',
    bgLight: '#fef2f2',
    bgDark: '#2d1212',
    badgeLabel: 'PDF',
  },
  {
    id: 'f2',
    name: 'Dashboard-UI-Mockup.png',
    path: 'Files/my-space/Images',
    size: '4.8 MB',
    type: 'IMG',
    category: 'Images',
    date: 'Aug 15, 2026',
    timeAgo: '5 hours ago',
    color: '#64748b',
    bgLight: '#f1f5f9',
    bgDark: '#1e293b',
    badgeLabel: 'PNG',
  },
  {
    id: 'f3',
    name: 'Sprint-Architecture-Notes.docx',
    path: 'Files/my-space/Doc',
    size: '1.1 MB',
    type: 'DOC',
    category: 'Doc',
    date: 'Aug 18, 2026',
    timeAgo: '1 day ago',
    color: '#3b82f6',
    bgLight: '#eff6ff',
    bgDark: '#172554',
    badgeLabel: 'DOC',
  },
  {
    id: 'f4',
    name: 'Q3-Budget-Forecast.xlsx',
    path: 'Files/my-space/Xls',
    size: '840 KB',
    type: 'XLS',
    category: 'Xls',
    date: 'Aug 17, 2026',
    timeAgo: '2 days ago',
    color: '#10b981',
    bgLight: '#f0fdf4',
    bgDark: '#052e16',
    badgeLabel: 'SPREADSHEET',
  },
];

// =========================================================================
// 1. FILE MANAGER VIEW PREVIEW (EXACT SCREENSHOT MATCH)
// =========================================================================

export function FileManagerViewPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [activeCategory, setActiveCategory] = useState('All Files');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewCardMode, setViewCardMode] = useState(true);

  const categories = [
    'All Files',
    'Images',
    'Pdf',
    'Doc',
    'Xls',
    'Videos',
    'Ppt',
    'Txt',
    'Zip',
  ];

  const containerBg = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? '#141e33' : '#ffffff';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#182235' : '#ffffff';

  const filteredFiles = SAMPLE_FILES_DATA.filter((file) => {
    if (activeCategory !== 'All Files' && file.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      return file.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.mainBox,
          { backgroundColor: containerBg, borderColor },
        ]}
      >
        {/* 1. Header Row */}
        <View style={[styles.headerRow, { borderBottomColor: borderColor }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: isDark ? '#312e81' : '#ede9fe',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Folder size={18} color="#7c3aed" />
            </View>

            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: textMain, fontFamily: 'Open Sans' }}>
                  Finance & Invoices
                </Text>
                <View
                  style={{
                    backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
                    paddingHorizontal: 7,
                    paddingVertical: 1.5,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ fontSize: 10.5, fontWeight: '700', color: textMuted }}>
                    {SAMPLE_FILES_DATA.length} files
                  </Text>
                </View>
              </View>

              <Text style={{ fontSize: 11, color: textMuted, fontFamily: 'Open Sans', marginTop: 1 }}>
                Storage folder: Files/user/Finance
              </Text>
            </View>
          </View>

          {/* Right Header Icons */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => alert('Notifications')}>
              <Bell size={18} color="#f97316" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Flag')}>
              <Flag size={18} color={textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('More options')}>
              <MoreVertical size={18} color={textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Top Action Controls */}
        <View style={{ paddingHorizontal: 16, paddingTop: 14, gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <TouchableOpacity
                onPress={() => alert('Toggle LTR')}
                style={[styles.outlinePillBtn, { borderColor }]}
              >
                <ArrowLeftRight size={13} color={textMain} />
                <Text style={[styles.outlinePillText, { color: textMain }]}>LTR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => alert('Open Filter options')}
                style={[styles.outlinePillBtn, { borderColor }]}
              >
                <Filter size={13} color={textMain} />
                <Text style={[styles.outlinePillText, { color: textMain }]}>FILTER</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => alert('Open Sort options')}
                style={[styles.outlinePillBtn, { borderColor }]}
              >
                <ArrowUpDown size={13} color={textMain} />
                <Text style={[styles.outlinePillText, { color: textMain }]}>SORT</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => alert('Open Short options')}
                style={[styles.outlinePillBtn, { borderColor }]}
              >
                <SlidersHorizontal size={13} color={textMain} />
                <Text style={[styles.outlinePillText, { color: textMain }]}>SHORT</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setViewCardMode(!viewCardMode)}
              style={styles.purpleViewCardBtn}
            >
              <LayoutGrid size={14} color="#ffffff" />
              <Text style={styles.purpleViewCardBtnText}>VIEW: CARD</Text>
            </TouchableOpacity>
          </View>

          {/* 3. Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={[
                    styles.catFilterPill,
                    isActive
                      ? { backgroundColor: '#7c3aed', borderColor: '#7c3aed' }
                      : { backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderColor },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 11.5,
                      fontWeight: isActive ? '800' : '600',
                      color: isActive ? '#ffffff' : textMuted,
                      fontFamily: 'Open Sans',
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* 4. Search Bar */}
          <View
            style={[
              styles.searchBarBox,
              { backgroundColor: inputBg, borderColor },
            ]}
          >
            <Search size={16} color={textMuted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search files by name, format, or sender..."
              placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              style={[styles.searchTextInput, { color: textMain }]}
            />
          </View>

          {/* 5. Count & Pagination Row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
            <Text style={{ fontSize: 11.5, color: textMuted, fontFamily: 'Open Sans' }}>
              {filteredFiles.length} files
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 11.5, color: textMuted, fontFamily: 'Open Sans' }}>
                1–{filteredFiles.length} of {SAMPLE_FILES_DATA.length}
              </Text>
              <TouchableOpacity style={{ padding: 2 }}>
                <ChevronLeft size={14} color={textMuted} />
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 2 }}>
                <ChevronRight size={14} color={textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* 6. Card Grid (4 Cards in a Row) */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, paddingBottom: 16 }}>
            {filteredFiles.map((file) => (
              <View
                key={file.id}
                style={[
                  styles.fileItemCard,
                  {
                    backgroundColor: cardBg,
                    borderColor,
                  },
                ]}
              >
                {/* Top Thumbnail / Preview Box */}
                <View
                  style={[
                    styles.thumbnailBox,
                    {
                      backgroundColor: isDark ? file.bgDark : file.bgLight,
                    },
                  ]}
                >
                  {file.type === 'PDF' ? (
                    <View style={{ alignItems: 'center', gap: 6 }}>
                      <FileText size={32} color={file.color} />
                      <Text style={{ fontSize: 11, fontWeight: '800', color: file.color, letterSpacing: 0.5 }}>
                        PDF
                      </Text>
                    </View>
                  ) : file.type === 'IMG' ? (
                    <View style={{ alignItems: 'center', gap: 6 }}>
                      <ImageIcon size={32} color={file.color} />
                      <Text
                        style={{ fontSize: 10.5, fontWeight: '700', color: textMain, maxWidth: 110, textAlign: 'center' }}
                        numberOfLines={1}
                      >
                        {file.name}
                      </Text>
                    </View>
                  ) : file.type === 'DOC' ? (
                    <View style={{ alignItems: 'center', gap: 6 }}>
                      <FileText size={32} color={file.color} />
                      <Text style={{ fontSize: 11, fontWeight: '800', color: file.color, letterSpacing: 0.5 }}>
                        DOC
                      </Text>
                    </View>
                  ) : (
                    <View style={{ alignItems: 'center', gap: 6 }}>
                      <FileSpreadsheet size={32} color={file.color} />
                      <Text style={{ fontSize: 10, fontWeight: '800', color: file.color, letterSpacing: 0.5 }}>
                        SPREADSHEET
                      </Text>
                    </View>
                  )}
                </View>

                {/* File Title & Path Info */}
                <View style={{ gap: 2 }}>
                  <Text
                    style={{ fontSize: 12.5, fontWeight: '800', color: textMain, fontFamily: 'Open Sans' }}
                    numberOfLines={1}
                  >
                    {file.name}
                  </Text>
                  <Text
                    style={{ fontSize: 10.5, color: textMuted, fontFamily: 'Open Sans' }}
                    numberOfLines={1}
                  >
                    {file.path} · {file.timeAgo}
                  </Text>
                </View>

                {/* Card Action Buttons */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                  <TouchableOpacity
                    onPress={() => alert(`Previewing ${file.name}...`)}
                    style={[
                      styles.previewBtnPill,
                      { backgroundColor: isDark ? '#312e81' : '#ede9fe' },
                    ]}
                  >
                    <Eye size={13} color="#7c3aed" />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#7c3aed', fontFamily: 'Open Sans' }}>
                      Preview
                    </Text>
                  </TouchableOpacity>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <TouchableOpacity
                      onPress={() => alert(`Downloading ${file.name}...`)}
                      style={styles.actionIconBtn}
                    >
                      <Download size={14} color={textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => alert(`More options for ${file.name}`)}
                      style={styles.actionIconBtn}
                    >
                      <MoreVertical size={14} color={textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 2. FILE UPLOAD FORM PREVIEW (EXACT SCREENSHOT MATCH)
// =========================================================================

export function FileUploadFormPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [folder, setFolder] = useState('Finance');
  const [subFolder, setSubFolder] = useState('Pdf');
  const [remarks, setRemarks] = useState('');
  const [notes, setNotes] = useState('');

  const containerBg = isDark ? '#0f172a' : '#ffffff';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#182235' : '#ffffff';

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.mainBox,
          { backgroundColor: containerBg, borderColor, padding: 20, gap: 16 },
        ]}
      >
        {/* Top Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: textMain, fontFamily: 'Open Sans' }}>
            New File Upload
          </Text>

          <TouchableOpacity
            onPress={() => alert('Navigating back to Storage...')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
          >
            <ArrowLeft size={14} color={textMuted} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: textMuted, fontFamily: 'Open Sans' }}>
              Back to Storage
            </Text>
          </TouchableOpacity>
        </View>

        {/* Warning Alert Banner */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isDark ? '#451a03' : '#fffbeb',
            borderColor: isDark ? '#78350f' : '#fde68a',
            borderWidth: 1,
            borderRadius: 12,
            padding: 12,
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
            <AlertTriangle size={16} color="#f59e0b" />
            <Text style={{ fontSize: 12, color: isDark ? '#fcd34d' : '#b45309', fontFamily: 'Open Sans', flex: 1 }}>
              File Storage Settings. Not Done. Go to App Settings and Add Settings.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => alert('Navigating to App Settings...')}
            style={{
              backgroundColor: isDark ? '#78350f' : '#fef3c7',
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 11.5, fontWeight: '700', color: isDark ? '#fef3c7' : '#92400e', fontFamily: 'Open Sans' }}>
              Go to App Settings
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={{ gap: 14 }}>
          {/* Folder */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: textMain, fontFamily: 'Open Sans' }}>
              Folder
            </Text>
            <TouchableOpacity
              onPress={() => alert('Selecting Folder...')}
              style={[
                styles.selectDropdown,
                { backgroundColor: inputBg, borderColor },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Folder size={15} color="#eab308" fill="#eab308" />
                <Text style={{ fontSize: 12.5, color: textMain, fontFamily: 'Open Sans' }}>
                  {folder}
                </Text>
              </View>
              <ChevronDown size={14} color={textMuted} />
            </TouchableOpacity>
          </View>

          {/* Sub folder */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: textMain, fontFamily: 'Open Sans' }}>
              Sub folder
            </Text>
            <TouchableOpacity
              onPress={() => alert('Selecting Sub Folder...')}
              style={[
                styles.selectDropdown,
                { backgroundColor: inputBg, borderColor },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Folder size={15} color="#eab308" fill="#eab308" />
                <Text style={{ fontSize: 12.5, color: textMain, fontFamily: 'Open Sans' }}>
                  {subFolder}
                </Text>
              </View>
              <ChevronDown size={14} color={textMuted} />
            </TouchableOpacity>
          </View>

          {/* Remarks */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: textMain, fontFamily: 'Open Sans' }}>
              Remarks
            </Text>
            <TextInput
              value={remarks}
              onChangeText={setRemarks}
              placeholder="Add a note about these attachments..."
              placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              multiline
              numberOfLines={3}
              style={[
                styles.textareaBox,
                { backgroundColor: inputBg, borderColor, color: textMain },
              ]}
            />
          </View>

          {/* Description / Notes with Rich Editor Toolbar */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: textMain, fontFamily: 'Open Sans' }}>
              Description / Notes
            </Text>

            <View
              style={[
                styles.richEditorContainer,
                { backgroundColor: inputBg, borderColor },
              ]}
            >
              {/* Toolbar */}
              <View style={[styles.richEditorToolbar, { borderBottomColor: borderColor }]}>
                <TouchableOpacity style={styles.editorToolBtn}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: textMain }}>B</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editorToolBtn}>
                  <Text style={{ fontSize: 12, fontStyle: 'italic', fontWeight: '700', color: textMain }}>I</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editorToolBtn}>
                  <Text style={{ fontSize: 12, textDecorationLine: 'underline', color: textMain }}>U</Text>
                </TouchableOpacity>

                <View style={{ width: 1, height: 14, backgroundColor: borderColor, marginHorizontal: 4 }} />

                <TouchableOpacity style={styles.editorToolBtn}>
                  <List size={14} color={textMain} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.editorToolBtn}>
                  <ListOrdered size={14} color={textMain} />
                </TouchableOpacity>

                <View style={{ width: 1, height: 14, backgroundColor: borderColor, marginHorizontal: 4 }} />

                <TouchableOpacity style={styles.editorToolBtn}>
                  <Paperclip size={14} color={textMain} />
                </TouchableOpacity>
              </View>

              {/* Text Input Body */}
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Type description, remarks, or notes here..."
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                multiline
                numberOfLines={4}
                style={[
                  styles.richEditorBody,
                  { color: textMain },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Bottom Actions Footer */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, flexWrap: 'wrap', gap: 10 }}>
          <TouchableOpacity
            onPress={() => {
              setRemarks('');
              setNotes('');
            }}
            style={[styles.cancelBtn, { borderColor }]}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: textMain, fontFamily: 'Open Sans' }}>
              Cancel
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity
              onPress={() => alert('Saved as draft!')}
              style={[styles.saveDraftBtn, { borderColor }]}
            >
              <Save size={14} color={textMuted} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: textMain, fontFamily: 'Open Sans' }}>
                Save as Draft
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                alert('File upload saved successfully!');
              }}
              style={styles.saveSubmitBtn}
            >
              <Save size={14} color="#ffffff" />
              <Text style={styles.saveSubmitBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 3. FILE UPLOADER & INLINE DOCUMENT VIEWER PREVIEW
// =========================================================================

export function FileUploaderAndViewerPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  return <FileManagerViewPreview />;
}

// =========================================================================
// 4. FILE CARD ITEM PREVIEW
// =========================================================================

export function FileCardItemPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const file = SAMPLE_FILES_DATA[0];

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.fileItemCard,
          {
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            borderColor: colors.border,
            maxWidth: 220,
            alignSelf: 'center',
          },
        ]}
      >
        <View
          style={[
            styles.thumbnailBox,
            { backgroundColor: isDark ? file.bgDark : file.bgLight },
          ]}
        >
          <FileText size={32} color={file.color} />
          <Text style={{ fontSize: 11, fontWeight: '800', color: file.color }}>PDF</Text>
        </View>

        <Text style={{ fontSize: 12.5, fontWeight: '800', color: colors.foreground }}>
          {file.name}
        </Text>
        <Text style={{ fontSize: 10.5, color: colors.mutedForeground }}>
          {file.path} · {file.timeAgo}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <View style={[styles.previewBtnPill, { backgroundColor: isDark ? '#312e81' : '#ede9fe' }]}>
            <Eye size={13} color="#7c3aed" />
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#7c3aed' }}>Preview</Text>
          </View>
          <Download size={14} color={colors.mutedForeground} />
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 5. FOLDER TREE ITEM PREVIEW
// =========================================================================

export function FolderTreeItemPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.mainBox,
          { backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: colors.border, padding: 16, gap: 10 },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FolderOpen size={16} color="#7c3aed" />
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.foreground }}>
            Finance & Invoices
          </Text>
          <View style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 }}>
            <Text style={{ fontSize: 10, color: colors.mutedForeground, fontWeight: '700' }}>4 files</Text>
          </View>
        </View>

        <View style={{ paddingLeft: 18, borderLeftWidth: 1, borderLeftColor: colors.border, marginLeft: 8, gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <FileText size={14} color="#ef4444" />
            <Text style={{ fontSize: 11.5, color: colors.foreground }}>Project-Roadmap-2026.pdf</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ImageIcon size={14} color="#64748b" />
            <Text style={{ fontSize: 11.5, color: colors.foreground }}>Dashboard-UI-Mockup.png</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <FileText size={14} color="#3b82f6" />
            <Text style={{ fontSize: 11.5, color: colors.foreground }}>Sprint-Architecture-Notes.docx</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <FileSpreadsheet size={14} color="#10b981" />
            <Text style={{ fontSize: 11.5, color: colors.foreground }}>Q3-Budget-Forecast.xlsx</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// MASTER FILES PREVIEWS EXPORT
// =========================================================================

export function FilesPreviews({ entry }: { entry?: GalleryEntry }) {
  if (entry?.id === 'file-upload-form') {
    return <FileUploadFormPreview />;
  }
  return <FileManagerViewPreview />;
}

// =========================================================================
// STYLES
// =========================================================================

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: 4,
  },
  mainBox: {
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  outlinePillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  outlinePillText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  purpleViewCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  purpleViewCardBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Open Sans',
    letterSpacing: 0.3,
  },
  catFilterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 40,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Open Sans',
    padding: 0,
  },
  fileItemCard: {
    flex: 1,
    minWidth: 145,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  thumbnailBox: {
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  actionIconBtn: {
    padding: 4,
  },
  selectDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
  },
  textareaBox: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    fontFamily: 'Open Sans',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  richEditorContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  richEditorToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  editorToolBtn: {
    padding: 2,
  },
  richEditorBody: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    fontFamily: 'Open Sans',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  saveDraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  saveSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveSubmitBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
});
