import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import {
  Receipt,
  ScanLine,
  UploadCloud,
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  Plus,
  Trash2,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  RotateCcw,
  Check,
  Bell,
  Flag,
  MoreVertical,
  X,
  Eye,
  Save,
  Minus,
  Maximize2,
  Code,
  LayoutGrid,
} from 'lucide-react-native';
import { useTheme } from '../../../providers/theme-provider';
import type { GalleryEntry } from '../../types';

// =========================================================================
// 1. COMPLETE VOUCHER FORM (AI OCR & PRINT) PREVIEW
// =========================================================================

export function CompleteVouchersPagePreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(
    stateIndex >= 2 ? 3 : stateIndex === 1 ? 2 : 1
  );

  // Form State
  const [formData, setFormData] = useState({
    businessName: 'Northstar Technology Services GmbH',
    businessEmail: 'billing@northstar-tech.de',
    businessAddress: '14 Oak Street\nAustin, TX 78701',
    customerName: 'Acme Corporation',
    customerEmail: 'accounts@acme.com',
    customerAddress: '520 Market Street\nSan Francisco, CA 94105',
    invoiceNumber: 'INV-2026-1048',
    issueDate: '07/18/2026',
    dueDate: '08/18/2026',
    currency: 'USD ($)',
    itemDescription: 'Cloud Infrastructure & Managed Consulting',
    itemRate: '13200',
    itemTax: '8.18',
  });

  const [zoomLevel, setZoomLevel] = useState(105);
  const [activeDocMode, setActiveDocMode] = useState<'Doc' | 'Voucher'>('Voucher');
  const [activePreviewTab, setActivePreviewTab] = useState<'preview' | 'fields' | 'json'>('preview');

  const containerBg = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? '#141e33' : '#f8fafc';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#182235' : '#ffffff';

  const updateField = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUseTemplate = () => {
    setActiveStep(2);
  };

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.mainContainer,
          { backgroundColor: containerBg, borderColor },
        ]}
      >
        {/* Top App Header */}
        <View style={[styles.topAppHeader, { borderBottomColor: borderColor }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: isDark ? '#312e81' : '#ede9fe',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={18} color="#7c3aed" />
            </View>
            <View>
              <Text style={{ fontSize: 14.5, fontWeight: '800', color: textMain, fontFamily: 'Open Sans' }}>
                Voucher Form
              </Text>
              <Text style={{ fontSize: 11.5, color: textMuted, fontFamily: 'Open Sans' }}>
                Create, review and print digital vouchers.
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => alert('Notifications')}>
              <Bell size={18} color="#f97316" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Flag')}>
              <Flag size={18} color={textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('More Options')}>
              <MoreVertical size={18} color={textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3-Step Wizard Navigation */}
        <View style={[styles.wizardBar, { borderBottomColor: borderColor }]}>
          {[
            { num: 1, label: 'Upload Document' },
            { num: 2, label: 'Edit Fields' },
            { num: 3, label: 'Voucher Preview' },
          ].map((s) => {
            const isActive = activeStep === s.num;
            return (
              <TouchableOpacity
                key={s.num}
                onPress={() => setActiveStep(s.num as 1 | 2 | 3)}
                style={[
                  styles.wizardTab,
                  isActive && { borderBottomColor: '#7c3aed', borderBottomWidth: 2 },
                ]}
              >
                <View
                  style={[
                    styles.wizardCircle,
                    isActive
                      ? { backgroundColor: '#7c3aed' }
                      : { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '800',
                      color: isActive ? '#ffffff' : textMuted,
                      fontFamily: 'Open Sans',
                    }}
                  >
                    {s.num}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: isActive ? '800' : '600',
                    color: isActive ? '#7c3aed' : textMuted,
                    fontFamily: 'Open Sans',
                  }}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Step Body Content */}
        {activeStep === 1 && (
          <View style={{ padding: 24, gap: 20 }}>
            {/* Tag & Title */}
            <View style={{ gap: 4 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '800',
                  color: '#7c3aed',
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  fontFamily: 'Open Sans',
                }}
              >
                DOCUMENT PROCESSING
              </Text>
              <Text style={{ fontSize: 22, fontWeight: '800', color: textMain, fontFamily: 'Open Sans' }}>
                Upload Document
              </Text>
              <Text style={{ fontSize: 12.5, color: textMuted, fontFamily: 'Open Sans', lineHeight: 18 }}>
                Upload any PDF or image. OCR extracts the text, then AI parses it into structured fields you can edit.
              </Text>
            </View>

            {/* 3 Action Option Cards */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {/* Option 1: Upload Document */}
              <TouchableOpacity
                onPress={() => {
                  alert('Selecting document (PDF / PNG / JPG)...');
                  setActiveStep(2);
                }}
                style={[
                  styles.optionCard,
                  {
                    borderColor: '#7c3aed',
                    borderStyle: 'dashed',
                    borderWidth: 1.5,
                    backgroundColor: isDark ? '#141e33' : '#faf5ff',
                  },
                ]}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: isDark ? '#312e81' : '#f3e8ff',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <UploadCloud size={18} color="#7c3aed" />
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={{ fontSize: 14.5, fontWeight: '700', color: textMain, fontFamily: 'Open Sans' }}>
                    Upload Document
                  </Text>
                  <Text style={{ fontSize: 11.5, color: textMuted, fontFamily: 'Open Sans', lineHeight: 17 }}>
                    PDF, PNG, JPG, JPEG. OCR + AI extracts structured fields automatically.
                  </Text>
                </View>

                <Text style={{ fontSize: 12, fontWeight: '700', color: '#7c3aed', fontFamily: 'Open Sans', marginTop: 8 }}>
                  Choose file →
                </Text>
              </TouchableOpacity>

              {/* Option 2: Use Template */}
              <TouchableOpacity
                onPress={handleUseTemplate}
                style={[
                  styles.optionCard,
                  {
                    borderColor,
                    backgroundColor: containerBg,
                  },
                ]}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: isDark ? '#312e81' : '#f3e8ff',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileText size={18} color="#7c3aed" />
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={{ fontSize: 14.5, fontWeight: '700', color: textMain, fontFamily: 'Open Sans' }}>
                    Use Template
                  </Text>
                  <Text style={{ fontSize: 11.5, color: textMuted, fontFamily: 'Open Sans', lineHeight: 17 }}>
                    Start with a pre-filled voucher template as a demo.
                  </Text>
                </View>

                <Text style={{ fontSize: 12, fontWeight: '700', color: '#7c3aed', fontFamily: 'Open Sans', marginTop: 8 }}>
                  Use template →
                </Text>
              </TouchableOpacity>

              {/* Option 3: Make Template */}
              <TouchableOpacity
                onPress={() => {
                  alert('Opening custom template builder...');
                  setActiveStep(2);
                }}
                style={[
                  styles.optionCard,
                  {
                    borderColor,
                    backgroundColor: containerBg,
                  },
                ]}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: isDark ? '#312e81' : '#f3e8ff',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ScanLine size={18} color="#7c3aed" />
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={{ fontSize: 14.5, fontWeight: '700', color: textMain, fontFamily: 'Open Sans' }}>
                    Make Template
                  </Text>
                  <Text style={{ fontSize: 11.5, color: textMuted, fontFamily: 'Open Sans', lineHeight: 17 }}>
                    Create or resume your custom voucher template.
                  </Text>
                </View>

                <Text style={{ fontSize: 12, fontWeight: '700', color: '#7c3aed', fontFamily: 'Open Sans', marginTop: 8 }}>
                  Make template →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 2: Edit Fields */}
        {activeStep === 2 && (
          <View style={{ padding: 20, gap: 16 }}>
            {/* Top Document Header Card */}
            <View
              style={[
                styles.docHeaderCard,
                { backgroundColor: containerBg, borderColor },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: isDark ? '#312e81' : '#f3e8ff',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileText size={18} color="#7c3aed" />
                </View>
                <View>
                  <Text style={{ fontSize: 13.5, fontWeight: '800', color: textMain, fontFamily: 'Open Sans' }}>
                    Invoice Document
                  </Text>
                  <Text style={{ fontSize: 11, color: textMuted, fontFamily: 'Open Sans' }}>
                    Edit any field below and click Save to generate your voucher preview
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setActiveStep(3)}
                  style={[styles.smallIconBtn, { borderColor }]}
                >
                  <Eye size={15} color={textMuted} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => alert('Downloading original document...')}
                  style={[styles.smallIconBtn, { borderColor }]}
                >
                  <Download size={15} color={textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Form Fields Grid */}
            <View style={{ gap: 14 }}>
              <View style={styles.formRow2}>
                <View style={styles.formCol}>
                  <Text style={[styles.fieldLabel, { color: textMuted }]}>Business Name</Text>
                  <TextInput
                    value={formData.businessName}
                    onChangeText={(t) => updateField('businessName', t)}
                    style={[styles.inputBox, { backgroundColor: inputBg, borderColor, color: textMain }]}
                  />
                </View>

                <View style={styles.formCol}>
                  <Text style={[styles.fieldLabel, { color: textMuted }]}>Business Email</Text>
                  <TextInput
                    value={formData.businessEmail}
                    onChangeText={(t) => updateField('businessEmail', t)}
                    style={[styles.inputBox, { backgroundColor: inputBg, borderColor, color: textMain }]}
                  />
                </View>
              </View>

              <View style={styles.formRow2}>
                <View style={styles.formCol}>
                  <Text style={[styles.fieldLabel, { color: textMuted }]}>Business Address</Text>
                  <TextInput
                    value={formData.businessAddress}
                    onChangeText={(t) => updateField('businessAddress', t)}
                    multiline
                    numberOfLines={2}
                    style={[styles.inputBox, { backgroundColor: inputBg, borderColor, color: textMain, height: 60 }]}
                  />
                </View>

                <View style={styles.formCol}>
                  <Text style={[styles.fieldLabel, { color: textMuted }]}>Customer Name</Text>
                  <TextInput
                    value={formData.customerName}
                    onChangeText={(t) => updateField('customerName', t)}
                    style={[styles.inputBox, { backgroundColor: inputBg, borderColor, color: textMain }]}
                  />
                </View>
              </View>

              <View style={styles.formRow2}>
                <View style={styles.formCol}>
                  <Text style={[styles.fieldLabel, { color: textMuted }]}>Customer Email</Text>
                  <TextInput
                    value={formData.customerEmail}
                    onChangeText={(t) => updateField('customerEmail', t)}
                    style={[styles.inputBox, { backgroundColor: inputBg, borderColor, color: textMain }]}
                  />
                </View>

                <View style={styles.formCol}>
                  <Text style={[styles.fieldLabel, { color: textMuted }]}>Customer Address</Text>
                  <TextInput
                    value={formData.customerAddress}
                    onChangeText={(t) => updateField('customerAddress', t)}
                    multiline
                    numberOfLines={2}
                    style={[styles.inputBox, { backgroundColor: inputBg, borderColor, color: textMain, height: 60 }]}
                  />
                </View>
              </View>

              <View style={styles.formRow2}>
                <View style={styles.formCol}>
                  <Text style={[styles.fieldLabel, { color: textMuted }]}>Invoice Number</Text>
                  <TextInput
                    value={formData.invoiceNumber}
                    onChangeText={(t) => updateField('invoiceNumber', t)}
                    style={[styles.inputBox, { backgroundColor: inputBg, borderColor, color: textMain }]}
                  />
                </View>

                <View style={styles.formCol}>
                  <Text style={[styles.fieldLabel, { color: textMuted }]}>Issue Date</Text>
                  <View style={{ position: 'relative', justifyContent: 'center' }}>
                    <TextInput
                      value={formData.issueDate}
                      onChangeText={(t) => updateField('issueDate', t)}
                      style={[styles.inputBox, { backgroundColor: inputBg, borderColor, color: textMain, paddingRight: 36 }]}
                    />
                    <View style={{ position: 'absolute', right: 10 }}>
                      <Calendar size={15} color={textMuted} />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.formRow2}>
                <View style={styles.formCol}>
                  <Text style={[styles.fieldLabel, { color: textMuted }]}>Due Date</Text>
                  <TextInput
                    value={formData.dueDate}
                    onChangeText={(t) => updateField('dueDate', t)}
                    style={[styles.inputBox, { backgroundColor: inputBg, borderColor, color: textMain }]}
                  />
                </View>

                <View style={styles.formCol}>
                  <Text style={[styles.fieldLabel, { color: textMuted }]}>Currency</Text>
                  <TextInput
                    value={formData.currency}
                    onChangeText={(t) => updateField('currency', t)}
                    style={[styles.inputBox, { backgroundColor: inputBg, borderColor, color: textMain }]}
                  />
                </View>
              </View>
            </View>

            {/* Bottom Floating Bar */}
            <View
              style={[
                styles.bottomBindingBar,
                { backgroundColor: containerBg, borderColor, borderTopColor: borderColor },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Sparkles size={15} color="#7c3aed" />
                <Text style={{ fontSize: 11.5, fontWeight: '600', color: textMuted, fontFamily: 'Open Sans' }}>
                  Live two-way binding active
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  alert('Saved structured fields to JSON! Generating preview...');
                  setActiveStep(3);
                }}
                style={styles.savePurpleBtn}
              >
                <Save size={14} color="#ffffff" />
                <Text style={styles.savePurpleBtnText}>Save to JSON</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 3: Voucher Preview */}
        {activeStep === 3 && (
          <View style={{ padding: 20, gap: 16 }}>
            {/* Top Preview Header Bar */}
            <View style={[styles.previewToolbar, { borderBottomColor: borderColor }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TouchableOpacity onPress={() => setActiveStep(2)}>
                  <X size={16} color={textMuted} />
                </TouchableOpacity>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: '#ede9fe',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 10.5, fontWeight: '800', color: '#7c3aed' }}>M1</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: textMain, fontFamily: 'Open Sans' }}>
                  Invoice_VCH_2026.pdf
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Bell size={16} color="#f97316" />
                <Flag size={16} color={textMuted} />
                <MoreVertical size={16} color={textMuted} />
              </View>
            </View>

            {/* Second Toolbar: Zoom & Mode */}
            <View style={[styles.zoomToolbar, { borderBottomColor: borderColor }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setZoomLevel((z) => Math.max(50, z - 10))}
                  style={[styles.smallIconBtn, { borderColor }]}
                >
                  <Minus size={13} color={textMain} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setZoomLevel((z) => Math.min(200, z + 10))}
                  style={[styles.smallIconBtn, { borderColor }]}
                >
                  <Plus size={13} color={textMain} />
                </TouchableOpacity>
                <Text style={{ fontSize: 11.5, fontWeight: '700', color: textMain }}>
                  {zoomLevel}%
                </Text>
              </View>

              <View style={[styles.segmentedSwitch, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
                <TouchableOpacity
                  onPress={() => setActiveDocMode('Doc')}
                  style={[
                    styles.segBtn,
                    activeDocMode === 'Doc' && styles.segBtnActive,
                  ]}
                >
                  <Text style={[styles.segText, activeDocMode === 'Doc' && styles.segTextActive]}>
                    Doc
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActiveDocMode('Voucher')}
                  style={[
                    styles.segBtn,
                    activeDocMode === 'Voucher' && styles.segBtnActive,
                  ]}
                >
                  <Text style={[styles.segText, activeDocMode === 'Voucher' && styles.segTextActive]}>
                    Voucher
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Third Toolbar: Tab Pills + Download PDF */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <TouchableOpacity
                  onPress={() => setActivePreviewTab('preview')}
                  style={[
                    styles.pillTabBtn,
                    activePreviewTab === 'preview'
                      ? { backgroundColor: isDark ? '#312e81' : '#ede9fe', borderColor: '#7c3aed' }
                      : { borderColor },
                  ]}
                >
                  <FileText size={13} color={activePreviewTab === 'preview' ? '#7c3aed' : textMuted} />
                  <Text
                    style={{
                      fontSize: 11.5,
                      fontWeight: '700',
                      color: activePreviewTab === 'preview' ? '#7c3aed' : textMuted,
                    }}
                  >
                    Voucher Preview
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActivePreviewTab('fields')}
                  style={[
                    styles.pillTabBtn,
                    activePreviewTab === 'fields'
                      ? { backgroundColor: isDark ? '#312e81' : '#ede9fe', borderColor: '#7c3aed' }
                      : { borderColor },
                  ]}
                >
                  <LayoutGrid size={13} color={activePreviewTab === 'fields' ? '#7c3aed' : textMuted} />
                  <Text
                    style={{
                      fontSize: 11.5,
                      fontWeight: '700',
                      color: activePreviewTab === 'fields' ? '#7c3aed' : textMuted,
                    }}
                  >
                    Field Matches
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActivePreviewTab('json')}
                  style={[
                    styles.pillTabBtn,
                    activePreviewTab === 'json'
                      ? { backgroundColor: isDark ? '#312e81' : '#ede9fe', borderColor: '#7c3aed' }
                      : { borderColor },
                  ]}
                >
                  <Code size={13} color={activePreviewTab === 'json' ? '#7c3aed' : textMuted} />
                  <Text
                    style={{
                      fontSize: 11.5,
                      fontWeight: '700',
                      color: activePreviewTab === 'json' ? '#7c3aed' : textMuted,
                    }}
                  >
                    JSON
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => alert('Downloading official Voucher PDF...')}
                style={styles.downloadPdfBtn}
              >
                <Download size={14} color="#ffffff" />
                <Text style={styles.downloadPdfBtnText}>Download PDF</Text>
              </TouchableOpacity>
            </View>

            {/* Rendered Voucher Output Sheet */}
            {activePreviewTab === 'preview' && (
              <View style={[styles.voucherSheet, { backgroundColor: containerBg, borderColor }]}>
                {/* Purple Top Banner Header */}
                <View style={styles.purpleBanner}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={styles.vendorAvatar}>
                      <Text style={styles.vendorAvatarText}>NO</Text>
                    </View>
                    <View>
                      <Text style={styles.bannerTitle}>{formData.businessName}</Text>
                      <Text style={styles.bannerSub}>{formData.businessEmail}</Text>
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.bannerInvoiceLabel}>INVOICE</Text>
                    <Text style={styles.bannerInvoiceNum}>#{formData.invoiceNumber}</Text>
                  </View>
                </View>

                {/* Metadata Row */}
                <View style={[styles.metaDataRow, { borderBottomColor: borderColor }]}>
                  <View style={{ gap: 3 }}>
                    <Text style={[styles.metaLabel, { color: textMuted }]}>ISSUE DATE</Text>
                    <Text style={[styles.metaVal, { color: textMain }]}>{formData.issueDate}</Text>
                  </View>
                  <View style={{ gap: 3 }}>
                    <Text style={[styles.metaLabel, { color: textMuted }]}>DUE DATE</Text>
                    <Text style={[styles.metaVal, { color: '#ef4444' }]}>{formData.dueDate}</Text>
                  </View>
                  <View style={{ gap: 3 }}>
                    <Text style={[styles.metaLabel, { color: textMuted }]}>TERMS</Text>
                    <Text style={[styles.metaVal, { color: textMain }]}>Net 30 days</Text>
                  </View>
                </View>

                {/* Bill From & Bill To Cards */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, padding: 16 }}>
                  <View style={[styles.partyCard, { backgroundColor: cardBg, borderColor }]}>
                    <Text style={styles.partyTag}>BILL FROM</Text>
                    <Text style={[styles.partyName, { color: textMain }]}>{formData.businessName}</Text>
                    <Text style={[styles.partyAddress, { color: textMuted }]}>{formData.businessAddress}</Text>
                  </View>

                  <View style={[styles.partyCard, { backgroundColor: cardBg, borderColor }]}>
                    <Text style={styles.partyTag}>BILL TO</Text>
                    <Text style={[styles.partyName, { color: textMain }]}>{formData.customerName}</Text>
                    <Text style={[styles.partyAddress, { color: textMuted }]}>{formData.customerAddress}</Text>
                  </View>
                </View>

                {/* Items & Total Summary */}
                <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 10 }}>
                  <View style={[styles.itemSummaryRow, { borderTopColor: borderColor }]}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: textMain, flex: 1 }}>
                      {formData.itemDescription}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: textMain }}>
                      ${Number(formData.itemRate || 0).toLocaleString()}.00
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end', gap: 4, marginTop: 4 }}>
                    <Text style={{ fontSize: 11, color: textMuted }}>
                      Tax ({formData.itemTax}%): ${(Number(formData.itemRate || 0) * 0.0818).toFixed(2)}
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: '#7c3aed' }}>
                      Total: ${(Number(formData.itemRate || 0) * 1.0818).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* JSON Output Tab */}
            {activePreviewTab === 'json' && (
              <View style={[styles.jsonBox, { backgroundColor: isDark ? '#020617' : '#f8fafc', borderColor }]}>
                <Text style={{ fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 11.5, color: isDark ? '#38bdf8' : '#0369a1' }}>
                  {JSON.stringify(formData, null, 2)}
                </Text>
              </View>
            )}

            {/* Fields List Tab */}
            {activePreviewTab === 'fields' && (
              <View style={[styles.fieldsTable, { backgroundColor: containerBg, borderColor }]}>
                {Object.entries(formData).map(([k, v], i) => (
                  <View key={k} style={[styles.fieldMatchRow, { borderTopColor: i > 0 ? borderColor : 'transparent' }]}>
                    <Text style={{ fontSize: 11.5, fontWeight: '700', color: '#7c3aed', width: 140 }}>
                      {k}
                    </Text>
                    <Text style={{ fontSize: 11.5, color: textMain, flex: 1 }}>
                      {String(v)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

// Backward compatibility exports
export const NewVoucherScanPreview = CompleteVouchersPagePreview;
export const NewVoucherPreview = CompleteVouchersPagePreview;

export function VouchersPreviews({ entry }: { entry?: GalleryEntry }) {
  return <CompleteVouchersPagePreview />;
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
  mainContainer: {
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
  topAppHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  wizardBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    gap: 16,
  },
  wizardTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  wizardCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCard: {
    flex: 1,
    minWidth: 180,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  docHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  smallIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formRow2: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  formCol: {
    flex: 1,
    minWidth: 200,
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  inputBox: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  bottomBindingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    flexWrap: 'wrap',
    gap: 10,
  },
  savePurpleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
  },
  savePurpleBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  previewToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  zoomToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  segmentedSwitch: {
    flexDirection: 'row',
    borderRadius: 6,
    padding: 2,
    gap: 2,
  },
  segBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
  },
  segBtnActive: {
    backgroundColor: '#7c3aed',
  },
  segText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  segTextActive: {
    color: '#ffffff',
  },
  pillTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  downloadPdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
  },
  downloadPdfBtnText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  voucherSheet: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  purpleBanner: {
    backgroundColor: '#7c3aed',
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorAvatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Open Sans',
  },
  bannerSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Open Sans',
  },
  bannerInvoiceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
  },
  bannerInvoiceNum: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  metaDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  metaLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  partyCard: {
    flex: 1,
    minWidth: 180,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 3,
  },
  partyTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#7c3aed',
    letterSpacing: 0.5,
  },
  partyName: {
    fontSize: 12.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  partyAddress: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: 'Open Sans',
  },
  itemSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  jsonBox: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  fieldsTable: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  fieldMatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
  },
});
