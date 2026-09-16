import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Mail,
  Sparkles,
  MessageSquare,
  Database,
  Lock,
  Server,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
} from 'lucide-react-native';
import { useTheme } from '../../../providers/theme-provider';
import type { GalleryEntry } from '../../types';

// =========================================================================
// TYPES & INITIAL DATA
// =========================================================================

export interface EmailAccountItem {
  id: string;
  email: string;
  protocol: 'IMAP' | 'POP3';
  incomingServer: string;
  incomingPort: number;
  outgoingServer: string;
  outgoingPort: number;
  useSSL: boolean;
  useTLS: boolean;
  isEnabled: boolean;
}

export interface AiCredentialItem {
  id: string;
  name: string;
  model: string;
  modelName: string;
  apiKey: string;
  isEnabled: boolean;
}

export interface ChatCredentialItem {
  id: string;
  name: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  isEnabled: boolean;
}

export interface FilesStorageItem {
  id: string;
  name: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  bucketName: string;
  defaultFolder: string;
  isEnabled: boolean;
}

const INITIAL_EMAIL_ACCOUNTS: EmailAccountItem[] = [
  {
    id: 'email-1',
    email: 'user@gmail.com',
    protocol: 'IMAP',
    incomingServer: 'imap.gmail.com',
    incomingPort: 993,
    outgoingServer: 'smtp.gmail.com',
    outgoingPort: 587,
    useSSL: true,
    useTLS: false,
    isEnabled: true,
  },
  {
    id: 'email-2',
    email: 'user@outlook.com',
    protocol: 'IMAP',
    incomingServer: 'outlook.office365.com',
    incomingPort: 993,
    outgoingServer: 'smtp-mail.outlook.com',
    outgoingPort: 587,
    useSSL: true,
    useTLS: false,
    isEnabled: true,
  },
];

const INITIAL_AI_ACCOUNTS: AiCredentialItem[] = [
  {
    id: 'ai-1',
    name: 'Gemini Flash Model',
    model: 'google/gemini-2.5-flash',
    modelName: 'Gemini 2.5 Flash',
    apiKey: 'sk-or-v1-a9f823bc41029481726a8d',
    isEnabled: true,
  },
  {
    id: 'ai-2',
    name: 'OpenAI GPT-4o Reasoning',
    model: 'openai/gpt-4o',
    modelName: 'GPT-4o',
    apiKey: 'sk-or-v1-84729103847591028374bb',
    isEnabled: true,
  },
  {
    id: 'ai-3',
    name: 'Anthropic Claude Sonnet',
    model: 'anthropic/claude-3.5-sonnet',
    modelName: 'Claude 3.5 Sonnet',
    apiKey: 'sk-or-v1-38291048572910485729cc',
    isEnabled: false,
  },
];

const INITIAL_CHAT_ACCOUNTS: ChatCredentialItem[] = [
  {
    id: 'chat-1',
    name: 'My Production Chat DB',
    supabaseUrl: 'https://xyz.supabase.co',
    supabaseAnonKey: 'sb_publishable_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.abc123456',
    isEnabled: true,
  },
  {
    id: 'chat-2',
    name: 'Staging Real-Time Cluster',
    supabaseUrl: 'https://chat-staging.supabase.co',
    supabaseAnonKey: 'sb_publishable_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.def789012',
    isEnabled: true,
  },
];

const INITIAL_FILES_ACCOUNTS: FilesStorageItem[] = [
  {
    id: 'files-1',
    name: 'Main App Storage',
    supabaseUrl: 'https://xyz.supabase.co',
    supabaseAnonKey: 'sb_publishable_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.abc123456',
    bucketName: 'chat-files',
    defaultFolder: 'Chat',
    isEnabled: true,
  },
  {
    id: 'files-2',
    name: 'Voucher & Document Vault',
    supabaseUrl: 'https://vault-storage.supabase.co',
    supabaseAnonKey: 'sb_publishable_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.ghi345678',
    bucketName: 'voucher-attachments',
    defaultFolder: 'Vouchers',
    isEnabled: true,
  },
];

const PRESET_SERVERS: Record<string, Partial<EmailAccountItem>> = {
  Gmail: {
    incomingServer: 'imap.gmail.com',
    incomingPort: 993,
    outgoingServer: 'smtp.gmail.com',
    outgoingPort: 587,
    useSSL: true,
    useTLS: false,
  },
  Outlook: {
    incomingServer: 'outlook.office365.com',
    incomingPort: 993,
    outgoingServer: 'smtp-mail.outlook.com',
    outgoingPort: 587,
    useSSL: true,
    useTLS: false,
  },
  Yahoo: {
    incomingServer: 'imap.mail.yahoo.com',
    incomingPort: 993,
    outgoingServer: 'smtp.mail.yahoo.com',
    outgoingPort: 465,
    useSSL: true,
    useTLS: false,
  },
};

const AI_MODELS = [
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat' },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B' },
];

function maskKey(key: string) {
  if (!key) return '••••••••••••';
  if (key.length <= 12) return '••••••••••••';
  return `${key.slice(0, 7)}...${key.slice(-4)}`;
}

// =========================================================================
// 1. EMAIL SETTING (EMAIL ACCOUNTS MANAGER)
// =========================================================================

export function EmailSettingPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [accounts, setAccounts] = useState<EmailAccountItem[]>(INITIAL_EMAIL_ACCOUNTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string>('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    protocol: 'IMAP' as 'IMAP' | 'POP3',
    incomingServer: 'imap.example.com',
    incomingPort: '993',
    outgoingServer: 'smtp.example.com',
    outgoingPort: '587',
    useSSL: true,
    useSTARTTLS: false,
  });

  const handleOpenAdd = () => {
    setActivePreset('');
    setEditingId(null);
    setFormData({
      email: '',
      password: '',
      protocol: 'IMAP',
      incomingServer: '',
      incomingPort: '993',
      outgoingServer: '',
      outgoingPort: '587',
      useSSL: true,
      useSTARTTLS: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (acc: EmailAccountItem) => {
    setActivePreset('');
    setEditingId(acc.id);
    setFormData({
      email: acc.email,
      password: '••••••••',
      protocol: acc.protocol,
      incomingServer: acc.incomingServer,
      incomingPort: String(acc.incomingPort),
      outgoingServer: acc.outgoingServer,
      outgoingPort: String(acc.outgoingPort),
      useSSL: acc.useSSL,
      useSTARTTLS: acc.useTLS,
    });
    setModalOpen(true);
  };

  const handleSelectPreset = (presetName: string) => {
    setActivePreset(presetName);
    const p = PRESET_SERVERS[presetName];
    if (p) {
      setFormData((prev) => ({
        ...prev,
        incomingServer: p.incomingServer || prev.incomingServer,
        incomingPort: String(p.incomingPort || prev.incomingPort),
        outgoingServer: p.outgoingServer || prev.outgoingServer,
        outgoingPort: String(p.outgoingPort || prev.outgoingPort),
        useSSL: p.useSSL ?? prev.useSSL,
        useSTARTTLS: p.useTLS ?? prev.useSTARTTLS,
      }));
    }
  };

  const handleSave = () => {
    if (!formData.email.trim()) {
      alert('Please enter an email address');
      return;
    }

    if (editingId) {
      setAccounts((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                email: formData.email,
                protocol: formData.protocol,
                incomingServer: formData.incomingServer,
                incomingPort: parseInt(formData.incomingPort, 10) || 993,
                outgoingServer: formData.outgoingServer,
                outgoingPort: parseInt(formData.outgoingPort, 10) || 587,
                useSSL: formData.useSSL,
                useTLS: formData.useSTARTTLS,
              }
            : item
        )
      );
    } else {
      const newAcc: EmailAccountItem = {
        id: `email-${Date.now()}`,
        email: formData.email,
        protocol: formData.protocol,
        incomingServer: formData.incomingServer || 'imap.example.com',
        incomingPort: parseInt(formData.incomingPort, 10) || 993,
        outgoingServer: formData.outgoingServer || 'smtp.example.com',
        outgoingPort: parseInt(formData.outgoingPort, 10) || 587,
        useSSL: formData.useSSL,
        useTLS: formData.useSTARTTLS,
        isEnabled: true,
      };
      setAccounts((prev) => [...prev, newAcc]);
    }
    setModalOpen(false);
  };

  const handleToggle = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, isEnabled: !acc.isEnabled } : acc))
    );
  };

  const handleDelete = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.mainCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Card Header */}
        <View style={styles.cardHeaderArea}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Mail size={22} color="#6366f1" />
            <Text style={[styles.cardTitleText, { color: colors.foreground }]}>
              Email Accounts Manager
            </Text>
          </View>
          <Text style={[styles.cardSubtitleText, { color: colors.mutedForeground, marginTop: 4 }]}>
            Add, edit, configure incoming/outgoing servers, and manage authentication for your emails.
          </Text>
        </View>

        {/* Account Cards List */}
        <View style={{ gap: 12, marginTop: 16 }}>
          {accounts.map((account) => (
            <View
              key={account.id}
              style={[
                styles.accountRowCard,
                {
                  backgroundColor: isDark ? '#161f30' : '#ffffff',
                  borderColor: isDark ? '#1e293b' : '#f1f5f9',
                  opacity: account.isEnabled ? 1 : 0.6,
                },
              ]}
            >
              {/* Mail Icon Box */}
              <View
                style={[
                  styles.accountIconBox,
                  { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' },
                ]}
              >
                <Mail size={18} color={isDark ? '#cbd5e1' : '#475569'} />
              </View>

              {/* Info Column */}
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  style={[styles.accountEmailTitle, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {account.email}
                </Text>
                <Text
                  style={[styles.accountServerSubtitle, { color: colors.mutedForeground }]}
                  numberOfLines={1}
                >
                  {account.protocol} • {account.incomingServer || 'No server configured'}
                </Text>
              </View>

              {/* Actions Right */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {/* Switch Toggle */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleToggle(account.id)}
                  style={[
                    styles.switchTrack,
                    { backgroundColor: account.isEnabled ? '#6366f1' : isDark ? '#334155' : '#cbd5e1' },
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      {
                        transform: [{ translateX: account.isEnabled ? 18 : 2 }],
                      },
                    ]}
                  />
                </TouchableOpacity>

                {/* Edit Button */}
                <TouchableOpacity
                  onPress={() => handleOpenEdit(account)}
                  style={styles.iconActionBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Edit size={16} color="#3b82f6" />
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                  onPress={() => handleDelete(account.id)}
                  style={styles.iconActionBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Add Account Primary Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleOpenAdd}
          style={[styles.primaryActionButton, { backgroundColor: '#4f46e5', marginTop: 18 }]}
        >
          <Plus size={18} color="#ffffff" />
          <Text style={styles.primaryActionText}>+ Add Email Account</Text>
        </TouchableOpacity>
      </View>

      {/* Modal / Dialog */}
      {modalOpen && (
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalDialog,
              {
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                borderColor: colors.border,
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Mail size={20} color="#6366f1" />
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  {editingId ? 'Edit Email Account' : 'Add Email Account'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <X size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSubtitle, { color: colors.mutedForeground }]}>
              Configure provider presets or input custom email credentials and server properties.
            </Text>

            {/* Presets */}
            <Text style={[styles.sectionLabel, { color: colors.foreground, marginTop: 14 }]}>
              Select Provider Preset (Optional)
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
              {['Gmail', 'Outlook', 'Yahoo'].map((preset) => (
                <TouchableOpacity
                  key={preset}
                  onPress={() => handleSelectPreset(preset)}
                  style={[
                    styles.presetPill,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: activePreset === preset ? '#6366f1' : isDark ? '#334155' : '#e2e8f0',
                      borderWidth: activePreset === preset ? 1.5 : 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 12.5,
                      fontWeight: '600',
                      color: activePreset === preset ? '#6366f1' : colors.foreground,
                    }}
                  >
                    {preset}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Account Credentials Section */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 }}>
              <Lock size={15} color="#6366f1" />
              <Text style={[styles.sectionHeaderTitle, { color: '#6366f1' }]}>
                Account Credentials
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Email Address *
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                  placeholder="your.email@example.com"
                  placeholderTextColor={colors.mutedForeground}
                  value={formData.email}
                  onChangeText={(val) => setFormData((prev) => ({ ...prev, email: val }))}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Password / App Password *
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(val) => setFormData((prev) => ({ ...prev, password: val }))}
                />
              </View>
            </View>

            {/* Email Protocol */}
            <Text style={[styles.inputLabel, { color: colors.foreground, marginTop: 12 }]}>
              Email Protocol
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
              <TouchableOpacity
                onPress={() => setFormData((prev) => ({ ...prev, protocol: 'IMAP' }))}
                style={[
                  styles.protocolCard,
                  {
                    borderColor: formData.protocol === 'IMAP' ? '#6366f1' : colors.border,
                    backgroundColor: formData.protocol === 'IMAP' ? (isDark ? 'rgba(99, 102, 241, 0.12)' : '#eef2ff') : 'transparent',
                  },
                ]}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: formData.protocol === 'IMAP' ? '#6366f1' : colors.foreground }}>
                  IMAP
                </Text>
                <Text style={{ fontSize: 10.5, color: colors.mutedForeground, marginTop: 2 }}>
                  Sync folders, fast
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFormData((prev) => ({ ...prev, protocol: 'POP3' }))}
                style={[
                  styles.protocolCard,
                  {
                    borderColor: formData.protocol === 'POP3' ? '#6366f1' : colors.border,
                    backgroundColor: formData.protocol === 'POP3' ? (isDark ? 'rgba(99, 102, 241, 0.12)' : '#eef2ff') : 'transparent',
                  },
                ]}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: formData.protocol === 'POP3' ? '#6366f1' : colors.foreground }}>
                  POP3
                </Text>
                <Text style={{ fontSize: 10.5, color: colors.mutedForeground, marginTop: 2 }}>
                  Download and local storage
                </Text>
              </TouchableOpacity>
            </View>

            {/* Incoming Server */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 }}>
              <Server size={15} color="#6366f1" />
              <Text style={[styles.sectionHeaderTitle, { color: '#6366f1' }]}>
                Incoming Server ({formData.protocol})
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <View style={{ flex: 3 }}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Server Address *
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                  placeholder="imap.example.com"
                  placeholderTextColor={colors.mutedForeground}
                  value={formData.incomingServer}
                  onChangeText={(val) => setFormData((prev) => ({ ...prev, incomingServer: val }))}
                />
              </View>
              <View style={{ flex: 1.2 }}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Port *
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                  placeholder="993"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                  value={formData.incomingPort}
                  onChangeText={(val) => setFormData((prev) => ({ ...prev, incomingPort: val }))}
                />
              </View>
            </View>

            {/* SSL / STARTTLS Toggles */}
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', marginTop: 10 }}>
              <TouchableOpacity
                onPress={() => setFormData((prev) => ({ ...prev, useSSL: !prev.useSSL }))}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <View style={[styles.switchTrackSmall, { backgroundColor: formData.useSSL ? '#6366f1' : '#cbd5e1' }]}>
                  <View style={[styles.switchThumbSmall, { transform: [{ translateX: formData.useSSL ? 14 : 2 }] }]} />
                </View>
                <Text style={{ fontSize: 11.5, color: colors.foreground }}>Use SSL/TLS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFormData((prev) => ({ ...prev, useSTARTTLS: !prev.useSTARTTLS }))}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <View style={[styles.switchTrackSmall, { backgroundColor: formData.useSTARTTLS ? '#6366f1' : '#cbd5e1' }]}>
                  <View style={[styles.switchThumbSmall, { transform: [{ translateX: formData.useSTARTTLS ? 14 : 2 }] }]} />
                </View>
                <Text style={{ fontSize: 11.5, color: colors.foreground }}>Use STARTTLS</Text>
              </TouchableOpacity>
            </View>

            {/* Outgoing Server */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 }}>
              <Server size={15} color="#6366f1" />
              <Text style={[styles.sectionHeaderTitle, { color: '#6366f1' }]}>
                Outgoing Server (SMTP)
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <View style={{ flex: 3 }}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Server Address *
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                  placeholder="smtp.example.com"
                  placeholderTextColor={colors.mutedForeground}
                  value={formData.outgoingServer}
                  onChangeText={(val) => setFormData((prev) => ({ ...prev, outgoingServer: val }))}
                />
              </View>
              <View style={{ flex: 1.2 }}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Port *
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                  placeholder="587"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                  value={formData.outgoingPort}
                  onChangeText={(val) => setFormData((prev) => ({ ...prev, outgoingPort: val }))}
                />
              </View>
            </View>

            {/* Footer Buttons */}
            <View style={styles.modalFooterRow}>
              <TouchableOpacity
                onPress={() => setModalOpen(false)}
                style={[
                  styles.secondaryBtn,
                  { borderColor: colors.border, backgroundColor: isDark ? '#1e293b' : '#ffffff' },
                ]}
              >
                <X size={14} color={colors.foreground} />
                <Text style={[styles.secondaryBtnText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                style={[styles.modalSubmitBtn, { backgroundColor: '#6366f1' }]}
              >
                <Save size={14} color="#ffffff" />
                <Text style={styles.modalSubmitBtnText}>
                  {editingId ? 'Save Account' : 'Add Account'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// =========================================================================
// 2. AI API SETTING (AI API CREDENTIALS MANAGER)
// =========================================================================

export function AiApiSettingPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [aiAccounts, setAiAccounts] = useState<AiCredentialItem[]>(INITIAL_AI_ACCOUNTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showKeyInModal, setShowKeyInModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    model: 'google/gemini-2.5-flash',
    apiKey: '',
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setShowKeyInModal(false);
    setFormData({
      name: '',
      model: 'google/gemini-2.5-flash',
      apiKey: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (acc: AiCredentialItem) => {
    setEditingId(acc.id);
    setShowKeyInModal(false);
    setFormData({
      name: acc.name,
      model: acc.model,
      apiKey: acc.apiKey,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.apiKey.trim()) {
      alert('Please enter an API Key');
      return;
    }

    const modelObj = AI_MODELS.find((m) => m.id === formData.model);
    const modelName = modelObj ? modelObj.name : formData.model;

    if (editingId) {
      setAiAccounts((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: formData.name || modelName,
                model: formData.model,
                modelName,
                apiKey: formData.apiKey,
              }
            : item
        )
      );
    } else {
      const newAcc: AiCredentialItem = {
        id: `ai-${Date.now()}`,
        name: formData.name || modelName,
        model: formData.model,
        modelName,
        apiKey: formData.apiKey,
        isEnabled: true,
      };
      setAiAccounts((prev) => [...prev, newAcc]);
    }
    setModalOpen(false);
  };

  const handleToggle = (id: string) => {
    setAiAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, isEnabled: !acc.isEnabled } : acc))
    );
  };

  const handleDelete = (id: string) => {
    setAiAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.mainCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.cardHeaderArea}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Sparkles size={22} color="#8b5cf6" />
            <Text style={[styles.cardTitleText, { color: colors.foreground }]}>
              AI API Credentials Manager
            </Text>
          </View>
          <Text style={[styles.cardSubtitleText, { color: colors.mutedForeground, marginTop: 4 }]}>
            Add edit and delete AI API Settings to manage OpenRouter models integration with AI Chat
          </Text>
        </View>

        {/* Credentials List */}
        <View style={{ gap: 12, marginTop: 16 }}>
          {aiAccounts.map((account) => (
            <View
              key={account.id}
              style={[
                styles.accountRowCard,
                {
                  backgroundColor: isDark ? '#161f30' : '#ffffff',
                  borderColor: isDark ? '#1e293b' : '#f1f5f9',
                  opacity: account.isEnabled ? 1 : 0.6,
                },
              ]}
            >
              <View
                style={[
                  styles.accountIconBox,
                  { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#f3e8ff' },
                ]}
              >
                <Sparkles size={18} color="#8b5cf6" />
              </View>

              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[styles.accountEmailTitle, { color: colors.foreground }]} numberOfLines={1}>
                    {account.name}
                  </Text>
                  <View style={[styles.badgeTag, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#8b5cf6' }}>
                      {account.modelName}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.accountServerSubtitle, { color: colors.mutedForeground, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }]} numberOfLines={1}>
                  {maskKey(account.apiKey)}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleToggle(account.id)}
                  style={[
                    styles.switchTrack,
                    { backgroundColor: account.isEnabled ? '#8b5cf6' : isDark ? '#334155' : '#cbd5e1' },
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      { transform: [{ translateX: account.isEnabled ? 18 : 2 }] },
                    ]}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleOpenEdit(account)} style={styles.iconActionBtn}>
                  <Edit size={16} color="#3b82f6" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(account.id)} style={styles.iconActionBtn}>
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Add Primary Action */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleOpenAdd}
          style={[styles.primaryActionButton, { backgroundColor: '#8b5cf6', marginTop: 18 }]}
        >
          <Plus size={18} color="#ffffff" />
          <Text style={styles.primaryActionText}>+ Add AI API Credential</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Dialog */}
      {modalOpen && (
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalDialog,
              {
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Sparkles size={20} color="#8b5cf6" />
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  {editingId ? 'Edit AI Credential' : 'Add AI API Credential'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <X size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSubtitle, { color: colors.mutedForeground }]}>
              Configure OpenRouter or direct AI model credentials for AI Chat and reasoning.
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 }}>
              <Lock size={15} color="#8b5cf6" />
              <Text style={[styles.sectionHeaderTitle, { color: '#8b5cf6' }]}>
                Account Credentials
              </Text>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                Connection Name (Optional)
              </Text>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderColor: colors.border,
                    color: colors.foreground,
                  },
                ]}
                placeholder="e.g. My OpenRouter Main"
                placeholderTextColor={colors.mutedForeground}
                value={formData.name}
                onChangeText={(val) => setFormData((prev) => ({ ...prev, name: val }))}
              />
            </View>

            {/* Model Selection */}
            <Text style={[styles.inputLabel, { color: colors.foreground, marginTop: 12 }]}>
              Select Default AI Model
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              {AI_MODELS.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setFormData((prev) => ({ ...prev, model: m.id }))}
                  style={[
                    styles.presetPill,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: formData.model === m.id ? '#8b5cf6' : isDark ? '#334155' : '#e2e8f0',
                      borderWidth: formData.model === m.id ? 1.5 : 1,
                      paddingVertical: 6,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: formData.model === m.id ? '#8b5cf6' : colors.foreground,
                    }}
                  >
                    {m.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* API Key Input */}
            <View style={{ marginTop: 12 }}>
              <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                API Key *
              </Text>
              <View style={{ position: 'relative' }}>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: colors.border,
                      color: colors.foreground,
                      paddingRight: 40,
                    },
                  ]}
                  placeholder="sk-or-v1-••••••••••••"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showKeyInModal}
                  value={formData.apiKey}
                  onChangeText={(val) => setFormData((prev) => ({ ...prev, apiKey: val }))}
                />
                <TouchableOpacity
                  onPress={() => setShowKeyInModal(!showKeyInModal)}
                  style={{ position: 'absolute', right: 12, top: 12 }}
                >
                  {showKeyInModal ? (
                    <EyeOff size={16} color={colors.mutedForeground} />
                  ) : (
                    <Eye size={16} color={colors.mutedForeground} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalFooterRow}>
              <TouchableOpacity
                onPress={() => setModalOpen(false)}
                style={[
                  styles.secondaryBtn,
                  { borderColor: colors.border, backgroundColor: isDark ? '#1e293b' : '#ffffff' },
                ]}
              >
                <X size={14} color={colors.foreground} />
                <Text style={[styles.secondaryBtnText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                style={[styles.modalSubmitBtn, { backgroundColor: '#8b5cf6' }]}
              >
                <Save size={14} color="#ffffff" />
                <Text style={styles.modalSubmitBtnText}>
                  {editingId ? 'Save Credential' : 'Add Credential'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// =========================================================================
// 3. CHAT API SETTING (CHAT SUPABASE CREDENTIALS MANAGER)
// =========================================================================

export function ChatApiSettingPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [chatAccounts, setChatAccounts] = useState<ChatCredentialItem[]>(INITIAL_CHAT_ACCOUNTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showKeyInModal, setShowKeyInModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    supabaseUrl: 'https://xyz.supabase.co',
    supabaseAnonKey: '',
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setShowKeyInModal(false);
    setFormData({
      name: '',
      supabaseUrl: '',
      supabaseAnonKey: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (acc: ChatCredentialItem) => {
    setEditingId(acc.id);
    setShowKeyInModal(false);
    setFormData({
      name: acc.name,
      supabaseUrl: acc.supabaseUrl,
      supabaseAnonKey: acc.supabaseAnonKey,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.supabaseUrl.trim()) {
      alert('Please enter a Supabase Project URL');
      return;
    }

    if (editingId) {
      setChatAccounts((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: formData.name || 'Chat Database',
                supabaseUrl: formData.supabaseUrl,
                supabaseAnonKey: formData.supabaseAnonKey,
              }
            : item
        )
      );
    } else {
      const newAcc: ChatCredentialItem = {
        id: `chat-${Date.now()}`,
        name: formData.name || 'Chat Database',
        supabaseUrl: formData.supabaseUrl,
        supabaseAnonKey: formData.supabaseAnonKey,
        isEnabled: true,
      };
      setChatAccounts((prev) => [...prev, newAcc]);
    }
    setModalOpen(false);
  };

  const handleToggle = (id: string) => {
    setChatAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, isEnabled: !acc.isEnabled } : acc))
    );
  };

  const handleDelete = (id: string) => {
    setChatAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.mainCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.cardHeaderArea}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <MessageSquare size={22} color="#10b981" />
            <Text style={[styles.cardTitleText, { color: colors.foreground }]}>
              Chat Credentials Manager
            </Text>
          </View>
          <Text style={[styles.cardSubtitleText, { color: colors.mutedForeground, marginTop: 4 }]}>
            Add edit and delete Supabase Settings to manage Apps integration with Chat
          </Text>
        </View>

        {/* Credentials List */}
        <View style={{ gap: 12, marginTop: 16 }}>
          {chatAccounts.map((account) => (
            <View
              key={account.id}
              style={[
                styles.accountRowCard,
                {
                  backgroundColor: isDark ? '#161f30' : '#ffffff',
                  borderColor: isDark ? '#1e293b' : '#f1f5f9',
                  opacity: account.isEnabled ? 1 : 0.6,
                },
              ]}
            >
              <View
                style={[
                  styles.accountIconBox,
                  { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#dcfce7' },
                ]}
              >
                <MessageSquare size={18} color="#10b981" />
              </View>

              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.accountEmailTitle, { color: colors.foreground }]} numberOfLines={1}>
                  {account.name}
                </Text>
                <Text style={[styles.accountServerSubtitle, { color: colors.mutedForeground }]} numberOfLines={1}>
                  {account.supabaseUrl}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleToggle(account.id)}
                  style={[
                    styles.switchTrack,
                    { backgroundColor: account.isEnabled ? '#10b981' : isDark ? '#334155' : '#cbd5e1' },
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      { transform: [{ translateX: account.isEnabled ? 18 : 2 }] },
                    ]}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleOpenEdit(account)} style={styles.iconActionBtn}>
                  <Edit size={16} color="#3b82f6" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(account.id)} style={styles.iconActionBtn}>
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Add Primary Action */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleOpenAdd}
          style={[styles.primaryActionButton, { backgroundColor: '#10b981', marginTop: 18 }]}
        >
          <Plus size={18} color="#ffffff" />
          <Text style={styles.primaryActionText}>+ Add Chat Supabase Credential</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Dialog matching screenshot 4 */}
      {modalOpen && (
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalDialog,
              {
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MessageSquare size={20} color="#10b981" />
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  {editingId ? 'Edit Chat Credential' : 'Add Chat Supabase Credential'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <X size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSubtitle, { color: colors.mutedForeground }]}>
              Configure custom Supabase project credentials for real-time chat, contacts, and messaging.
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 }}>
              <Lock size={15} color="#10b981" />
              <Text style={[styles.sectionHeaderTitle, { color: '#10b981' }]}>
                Account Credentials
              </Text>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                Connection Name (Optional)
              </Text>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderColor: colors.border,
                    color: colors.foreground,
                  },
                ]}
                placeholder="e.g. My Production Chat DB"
                placeholderTextColor={colors.mutedForeground}
                value={formData.name}
                onChangeText={(val) => setFormData((prev) => ({ ...prev, name: val }))}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                  <Server size={13} color={colors.mutedForeground} />
                  <Text style={[styles.inputLabel, { color: colors.foreground, marginBottom: 0 }]}>
                    Supabase Project URL *
                  </Text>
                </View>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                  placeholder="https://xyz.supabase.co"
                  placeholderTextColor={colors.mutedForeground}
                  value={formData.supabaseUrl}
                  onChangeText={(val) => setFormData((prev) => ({ ...prev, supabaseUrl: val }))}
                />
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                  <Lock size={13} color={colors.mutedForeground} />
                  <Text style={[styles.inputLabel, { color: colors.foreground, marginBottom: 0 }]}>
                    Supabase Anon / Publishable Key *
                  </Text>
                </View>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    style={[
                      styles.formInput,
                      {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        borderColor: colors.border,
                        color: colors.foreground,
                        paddingRight: 38,
                      },
                    ]}
                    placeholder="sb_publishable_... or eyJhbG..."
                    placeholderTextColor={colors.mutedForeground}
                    secureTextEntry={!showKeyInModal}
                    value={formData.supabaseAnonKey}
                    onChangeText={(val) => setFormData((prev) => ({ ...prev, supabaseAnonKey: val }))}
                  />
                  <TouchableOpacity
                    onPress={() => setShowKeyInModal(!showKeyInModal)}
                    style={{ position: 'absolute', right: 10, top: 12 }}
                  >
                    {showKeyInModal ? (
                      <EyeOff size={15} color={colors.mutedForeground} />
                    ) : (
                      <Eye size={15} color={colors.mutedForeground} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.modalFooterRow}>
              <TouchableOpacity
                onPress={() => setModalOpen(false)}
                style={[
                  styles.secondaryBtn,
                  { borderColor: colors.border, backgroundColor: isDark ? '#1e293b' : '#ffffff' },
                ]}
              >
                <X size={14} color={colors.foreground} />
                <Text style={[styles.secondaryBtnText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                style={[styles.modalSubmitBtn, { backgroundColor: '#10b981' }]}
              >
                <Save size={14} color="#ffffff" />
                <Text style={styles.modalSubmitBtnText}>
                  {editingId ? 'Save Credential' : 'Add Credential'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// =========================================================================
// 4. FILES SETTING (SUPABASE FILES STORAGE CREDENTIALS MANAGER)
// =========================================================================

export function FilesSettingPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [filesAccounts, setFilesAccounts] = useState<FilesStorageItem[]>(INITIAL_FILES_ACCOUNTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showKeyInModal, setShowKeyInModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    supabaseUrl: 'https://xyz.supabase.co',
    supabaseAnonKey: '',
    bucketName: 'chat-files',
    defaultFolder: 'Chat',
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setShowKeyInModal(false);
    setFormData({
      name: '',
      supabaseUrl: '',
      supabaseAnonKey: '',
      bucketName: 'chat-files',
      defaultFolder: 'Chat',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (acc: FilesStorageItem) => {
    setEditingId(acc.id);
    setShowKeyInModal(false);
    setFormData({
      name: acc.name,
      supabaseUrl: acc.supabaseUrl,
      supabaseAnonKey: acc.supabaseAnonKey,
      bucketName: acc.bucketName,
      defaultFolder: acc.defaultFolder,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.supabaseUrl.trim()) {
      alert('Please enter a Supabase Storage URL');
      return;
    }

    if (editingId) {
      setFilesAccounts((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: formData.name || 'Files Storage',
                supabaseUrl: formData.supabaseUrl,
                supabaseAnonKey: formData.supabaseAnonKey,
                bucketName: formData.bucketName || 'chat-files',
                defaultFolder: formData.defaultFolder || 'Chat',
              }
            : item
        )
      );
    } else {
      const newAcc: FilesStorageItem = {
        id: `files-${Date.now()}`,
        name: formData.name || 'Files Storage',
        supabaseUrl: formData.supabaseUrl,
        supabaseAnonKey: formData.supabaseAnonKey,
        bucketName: formData.bucketName || 'chat-files',
        defaultFolder: formData.defaultFolder || 'Chat',
        isEnabled: true,
      };
      setFilesAccounts((prev) => [...prev, newAcc]);
    }
    setModalOpen(false);
  };

  const handleToggle = (id: string) => {
    setFilesAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, isEnabled: !acc.isEnabled } : acc))
    );
  };

  const handleDelete = (id: string) => {
    setFilesAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.mainCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.cardHeaderArea}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Database size={22} color="#3b82f6" />
            <Text style={[styles.cardTitleText, { color: colors.foreground }]}>
              Supabase Credentials Manager
            </Text>
          </View>
          <Text style={[styles.cardSubtitleText, { color: colors.mutedForeground, marginTop: 4 }]}>
            Add edit and delete files Settings to manage Apps integration with Files Storage
          </Text>
        </View>

        {/* Credentials List */}
        <View style={{ gap: 12, marginTop: 16 }}>
          {filesAccounts.map((account) => (
            <View
              key={account.id}
              style={[
                styles.accountRowCard,
                {
                  backgroundColor: isDark ? '#161f30' : '#ffffff',
                  borderColor: isDark ? '#1e293b' : '#f1f5f9',
                  opacity: account.isEnabled ? 1 : 0.6,
                },
              ]}
            >
              <View
                style={[
                  styles.accountIconBox,
                  { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#dbeafe' },
                ]}
              >
                <Database size={18} color="#3b82f6" />
              </View>

              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.accountEmailTitle, { color: colors.foreground }]} numberOfLines={1}>
                  {account.name}
                </Text>
                <Text style={[styles.accountServerSubtitle, { color: colors.mutedForeground }]} numberOfLines={1}>
                  {account.supabaseUrl} • Bucket: {account.bucketName} ({account.defaultFolder})
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleToggle(account.id)}
                  style={[
                    styles.switchTrack,
                    { backgroundColor: account.isEnabled ? '#3b82f6' : isDark ? '#334155' : '#cbd5e1' },
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      { transform: [{ translateX: account.isEnabled ? 18 : 2 }] },
                    ]}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleOpenEdit(account)} style={styles.iconActionBtn}>
                  <Edit size={16} color="#3b82f6" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(account.id)} style={styles.iconActionBtn}>
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Add Primary Action */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleOpenAdd}
          style={[styles.primaryActionButton, { backgroundColor: '#3b82f6', marginTop: 18 }]}
        >
          <Plus size={18} color="#ffffff" />
          <Text style={styles.primaryActionText}>+ Add Storage Credential</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Dialog */}
      {modalOpen && (
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalDialog,
              {
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Database size={20} color="#3b82f6" />
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  {editingId ? 'Edit Storage Credential' : 'Add Storage Credential'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <X size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSubtitle, { color: colors.mutedForeground }]}>
              Configure Supabase Storage bucket credentials for documents, media, and attachments.
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 }}>
              <Lock size={15} color="#3b82f6" />
              <Text style={[styles.sectionHeaderTitle, { color: '#3b82f6' }]}>
                Account Credentials
              </Text>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                Connection Name (Optional)
              </Text>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderColor: colors.border,
                    color: colors.foreground,
                  },
                ]}
                placeholder="e.g. My Production Files Storage"
                placeholderTextColor={colors.mutedForeground}
                value={formData.name}
                onChangeText={(val) => setFormData((prev) => ({ ...prev, name: val }))}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Supabase Project URL *
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                  placeholder="https://xyz.supabase.co"
                  placeholderTextColor={colors.mutedForeground}
                  value={formData.supabaseUrl}
                  onChangeText={(val) => setFormData((prev) => ({ ...prev, supabaseUrl: val }))}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Supabase Anon Key *
                </Text>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    style={[
                      styles.formInput,
                      {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        borderColor: colors.border,
                        color: colors.foreground,
                        paddingRight: 38,
                      },
                    ]}
                    placeholder="sb_publishable_... or eyJhbG..."
                    placeholderTextColor={colors.mutedForeground}
                    secureTextEntry={!showKeyInModal}
                    value={formData.supabaseAnonKey}
                    onChangeText={(val) => setFormData((prev) => ({ ...prev, supabaseAnonKey: val }))}
                  />
                  <TouchableOpacity
                    onPress={() => setShowKeyInModal(!showKeyInModal)}
                    style={{ position: 'absolute', right: 10, top: 12 }}
                  >
                    {showKeyInModal ? (
                      <EyeOff size={15} color={colors.mutedForeground} />
                    ) : (
                      <Eye size={15} color={colors.mutedForeground} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Bucket Name *
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                  placeholder="chat-files"
                  placeholderTextColor={colors.mutedForeground}
                  value={formData.bucketName}
                  onChangeText={(val) => setFormData((prev) => ({ ...prev, bucketName: val }))}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Default Upload Folder
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                  placeholder="Chat"
                  placeholderTextColor={colors.mutedForeground}
                  value={formData.defaultFolder}
                  onChangeText={(val) => setFormData((prev) => ({ ...prev, defaultFolder: val }))}
                />
              </View>
            </View>

            <View style={styles.modalFooterRow}>
              <TouchableOpacity
                onPress={() => setModalOpen(false)}
                style={[
                  styles.secondaryBtn,
                  { borderColor: colors.border, backgroundColor: isDark ? '#1e293b' : '#ffffff' },
                ]}
              >
                <X size={14} color={colors.foreground} />
                <Text style={[styles.secondaryBtnText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                style={[styles.modalSubmitBtn, { backgroundColor: '#3b82f6' }]}
              >
                <Save size={14} color="#ffffff" />
                <Text style={styles.modalSubmitBtnText}>
                  {editingId ? 'Save Credential' : 'Add Credential'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

export function AppSettingsPreviews({ entry }: { entry?: GalleryEntry }) {
  return <EmailSettingPreview />;
}

// =========================================================================
// STYLES
// =========================================================================

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  mainCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderArea: {
    marginBottom: 4,
  },
  cardTitleText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardSubtitleText: {
    fontSize: 12.5,
    lineHeight: 17,
  },
  accountRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  accountIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountEmailTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  accountServerSubtitle: {
    fontSize: 11.5,
    marginTop: 2,
  },
  badgeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  iconActionBtn: {
    padding: 4,
  },
  switchTrack: {
    width: 42,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  switchTrackSmall: {
    width: 34,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
  },
  switchThumbSmall: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffffff',
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryActionText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '700',
  },
  // MODAL STYLES
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalDialog: {
    width: '100%',
    maxWidth: 580,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  presetPill: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  protocolCard: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    marginBottom: 5,
  },
  formInput: {
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 12.5,
  },
  modalFooterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  modalSubmitBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
});
