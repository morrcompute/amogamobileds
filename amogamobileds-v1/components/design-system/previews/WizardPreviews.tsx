import React, { useState, useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  Wand2,
  Calendar as CalendarIcon,
  Clock,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Plus,
  Minus,
  Play,
  Pause,
  Layers,
  Rocket,
  Globe,
  Shield,
  Loader2,
} from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../../providers/theme-provider';
import { Wizard, WizardStep } from '../../ui/wizard';
import type { GalleryEntry } from '../../types';

// =========================================================================
// 1. QUESTIONNAIRE WIZARD PREVIEW
// =========================================================================

const ROLES = [
  'Product Manager',
  'Engineering Lead',
  'UI/UX Designer',
  'Founder / CEO',
  'Growth Marketer',
];

const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '11:00 AM - 12:00 PM',
  '02:00 PM - 03:00 PM',
  '04:00 PM - 05:00 PM',
];

const FEATURE_OPTIONS = [
  {
    id: 'ai',
    label: 'AI Assistance & Summarization',
    desc: 'Automatic email drafting & chat summaries',
  },
  {
    id: 'analytics',
    label: 'Advanced Analytics',
    desc: 'Real-time response rate and task completion metrics',
  },
  {
    id: 'automation',
    label: 'Workflow Automations',
    desc: 'Custom triggers and automated notifications',
  },
  {
    id: 'custom',
    label: 'Custom Integrations',
    desc: 'Connect with existing CRM and calendar tools',
  },
];

export function QuestionnaireWizardPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const initialStep = stateIndex === 2 ? 4 : stateIndex === 1 ? 2 : 1;
  const initialCompleted = stateIndex === 2;

  const [step, setStep] = useState(initialStep);
  const [name, setName] = useState(stateIndex >= 1 ? 'Alex Morgan' : '');
  const [selectedRole, setSelectedRole] = useState(stateIndex >= 1 ? 'Product Manager' : '');
  const [selectedDateDay, setSelectedDateDay] = useState(21);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(stateIndex >= 1 ? '11:00 AM - 12:00 PM' : '');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    stateIndex === 2 ? ['ai', 'analytics', 'automation'] : stateIndex === 1 ? ['ai'] : []
  );
  const [completed, setCompleted] = useState(initialCompleted);

  const totalSteps = 3;
  const progressPercent = completed
    ? 100
    : Math.round(((step - 1) / totalSteps) * 100);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (completed) {
      setCompleted(false);
      setStep(3);
    } else if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setName('');
    setSelectedRole('');
    setSelectedTimeSlot('');
    setSelectedFeatures([]);
    setCompleted(false);
  };

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.wizardCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Wizard Header */}
        <View style={styles.wizardHeader}>
          <View style={styles.headerTitleRow}>
            <View style={styles.titleWithIcon}>
              <View
                style={[
                  styles.sparkleIconBox,
                  {
                    backgroundColor: isDark
                      ? 'rgba(139, 92, 246, 0.15)'
                      : '#f3e8ff',
                  },
                ]}
              >
                <Wand2 size={18} color="#8b5cf6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.wizardMainTitle, { color: colors.foreground }]}>
                  Onboarding Questionnaire
                </Text>
                <Text style={[styles.wizardSubtitle, { color: colors.mutedForeground }]}>
                  Tailor your workspace preferences & schedule setup
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.stepPill,
                {
                  backgroundColor: isDark
                    ? 'rgba(139, 92, 246, 0.15)'
                    : '#f3e8ff',
                  borderColor: isDark
                    ? 'rgba(139, 92, 246, 0.3)'
                    : '#e9d5ff',
                },
              ]}
            >
              <Text style={styles.stepPillText}>
                {completed ? 'Completed' : `Step ${step} of ${totalSteps}`}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressRow}>
            <View style={styles.progressLabelRow}>
              <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
                Overall Progress
              </Text>
              <Text style={[styles.progressValue, { color: colors.foreground }]}>
                {progressPercent}%
              </Text>
            </View>
            <View
              style={[
                styles.progressBarTrack,
                { backgroundColor: isDark ? '#27272a' : '#f4f4f5' },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progressPercent}%`,
                    backgroundColor: '#8b5cf6',
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Wizard Content Body */}
        <View style={styles.wizardBody}>
          {/* STEP 1: PERSONAL & ROLE */}
          {!completed && step === 1 && (
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <View style={styles.stepHeaderIconRow}>
                  <User size={15} color="#8b5cf6" />
                  <Text style={[styles.stepTitle, { color: colors.foreground }]}>
                    Step 1: Personal Details & Role
                  </Text>
                </View>
                <Text style={[styles.stepSubtitle, { color: colors.mutedForeground }]}>
                  Please tell us your name and primary function in your organization.
                </Text>
              </View>

              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Full Name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Alex Morgan"
                  placeholderTextColor={colors.mutedForeground}
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                />
              </View>

              {/* Role Selection */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Select Your Primary Role
                </Text>
                <View style={styles.roleGrid}>
                  {ROLES.map((r) => {
                    const isSelected = selectedRole === r;
                    return (
                      <Pressable
                        key={r}
                        onPress={() => setSelectedRole(r)}
                        style={[
                          styles.roleChip,
                          isSelected
                            ? {
                                backgroundColor: isDark
                                  ? 'rgba(139, 92, 246, 0.2)'
                                  : '#f3e8ff',
                                borderColor: '#8b5cf6',
                              }
                            : {
                                backgroundColor: colors.background,
                                borderColor: colors.border,
                              },
                        ]}
                      >
                        <Text
                          style={[
                            styles.roleChipText,
                            {
                              color: isSelected ? '#8b5cf6' : colors.foreground,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {r}
                        </Text>
                        {isSelected && <Check size={13} color="#8b5cf6" strokeWidth={2.5} />}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {/* STEP 2: SCHEDULE ONBOARDING SESSION */}
          {!completed && step === 2 && (
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <View style={styles.stepHeaderIconRow}>
                  <CalendarIcon size={15} color="#8b5cf6" />
                  <Text style={[styles.stepTitle, { color: colors.foreground }]}>
                    Step 2: Schedule Onboarding Session
                  </Text>
                </View>
                <Text style={[styles.stepSubtitle, { color: colors.mutedForeground }]}>
                  Pick a preferred date and time slot for your walkthrough.
                </Text>
              </View>

              {/* Date Day Selector */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Select Date (August 2026)
                </Text>
                <View style={styles.daysRow}>
                  {[18, 19, 20, 21, 22, 23, 24].map((d) => {
                    const isSelected = selectedDateDay === d;
                    return (
                      <Pressable
                        key={d}
                        onPress={() => setSelectedDateDay(d)}
                        style={[
                          styles.dayButton,
                          isSelected
                            ? {
                                backgroundColor: '#8b5cf6',
                                borderColor: '#8b5cf6',
                              }
                            : {
                                backgroundColor: colors.background,
                                borderColor: colors.border,
                              },
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayButtonText,
                            {
                              color: isSelected ? '#ffffff' : colors.foreground,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {d}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Time slot pills */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Available Time Slots
                </Text>
                <View style={styles.timeSlotsGrid}>
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <Pressable
                        key={slot}
                        onPress={() => setSelectedTimeSlot(slot)}
                        style={[
                          styles.timeSlotCard,
                          isSelected
                            ? {
                                backgroundColor: isDark
                                  ? 'rgba(139, 92, 246, 0.2)'
                                  : '#f3e8ff',
                                borderColor: '#8b5cf6',
                              }
                            : {
                                backgroundColor: colors.background,
                                borderColor: colors.border,
                              },
                        ]}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Clock
                            size={13}
                            color={isSelected ? '#8b5cf6' : colors.mutedForeground}
                          />
                          <Text
                            style={[
                              styles.timeSlotText,
                              {
                                color: isSelected ? '#8b5cf6' : colors.foreground,
                                fontWeight: isSelected ? '700' : '500',
                              },
                            ]}
                          >
                            {slot}
                          </Text>
                        </View>
                        {isSelected && <Check size={13} color="#8b5cf6" strokeWidth={2.5} />}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {/* STEP 3: FEATURE SELECTION */}
          {!completed && step === 3 && (
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <View style={styles.stepHeaderIconRow}>
                  <Sliders size={15} color="#8b5cf6" />
                  <Text style={[styles.stepTitle, { color: colors.foreground }]}>
                    Step 3: Module & Feature Preferences
                  </Text>
                </View>
                <Text style={[styles.stepSubtitle, { color: colors.mutedForeground }]}>
                  Select the capabilities you plan to use most.
                </Text>
              </View>

              <View style={styles.featureList}>
                {FEATURE_OPTIONS.map((f) => {
                  const isChecked = selectedFeatures.includes(f.id);
                  return (
                    <Pressable
                      key={f.id}
                      onPress={() => toggleFeature(f.id)}
                      style={[
                        styles.featureCard,
                        isChecked
                          ? {
                              backgroundColor: isDark
                                ? 'rgba(139, 92, 246, 0.15)'
                                : '#f5f3ff',
                              borderColor: '#8b5cf6',
                            }
                          : {
                              backgroundColor: colors.background,
                              borderColor: colors.border,
                            },
                      ]}
                    >
                      <View
                        style={[
                          styles.checkboxBox,
                          isChecked
                            ? { backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }
                            : { borderColor: colors.border, backgroundColor: colors.card },
                        ]}
                      >
                        {isChecked && (
                          <Check size={11} color="#ffffff" strokeWidth={3} />
                        )}
                      </View>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text
                          style={[
                            styles.featureCardTitle,
                            { color: colors.foreground },
                          ]}
                        >
                          {f.label}
                        </Text>
                        <Text
                          style={[
                            styles.featureCardDesc,
                            { color: colors.mutedForeground },
                          ]}
                        >
                          {f.desc}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 4: COMPLETED SUMMARY */}
          {completed && (
            <View style={styles.completedContent}>
              <View style={styles.completedSuccessIconBox}>
                <CheckCircle2 size={48} color="#10b981" />
              </View>

              <Text style={[styles.completedTitle, { color: colors.foreground }]}>
                Questionnaire Completed!
              </Text>
              <Text
                style={[
                  styles.completedSubtitle,
                  { color: colors.mutedForeground },
                ]}
              >
                Your setup preferences have been recorded. Here is a quick summary:
              </Text>

              <View
                style={[
                  styles.summaryInfoBox,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
                    Name & Role:
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                    {name || 'Alex Morgan'} ({selectedRole || 'Product Manager'})
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
                    Scheduled Session:
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                    Aug {selectedDateDay}, 2026 {selectedTimeSlot ? `at ${selectedTimeSlot}` : ''}
                  </Text>
                </View>
                <View style={{ gap: 4, marginTop: 4 }}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
                    Selected Features ({selectedFeatures.length}):
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
                    {selectedFeatures.length > 0 ? (
                      selectedFeatures.map((f) => (
                        <View
                          key={f}
                          style={[
                            styles.summaryFeaturePill,
                            {
                              backgroundColor: isDark
                                ? 'rgba(139, 92, 246, 0.18)'
                                : '#f3e8ff',
                            },
                          ]}
                        >
                          <Text style={styles.summaryFeaturePillText}>
                            {f.toUpperCase()}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text style={{ fontSize: 11, color: colors.mutedForeground, fontStyle: 'italic' }}>
                        None selected
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              <Pressable
                onPress={handleReset}
                style={[
                  styles.resetBtn,
                  {
                    backgroundColor: isDark ? colors.card : colors.secondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <RotateCcw size={14} color={colors.foreground} />
                <Text style={[styles.resetBtnText, { color: colors.foreground }]}>
                  Restart Questionnaire
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Wizard Footer Navigation */}
        {!completed && (
          <View
            style={[
              styles.wizardFooter,
              { borderTopColor: colors.border },
            ]}
          >
            <Pressable
              onPress={handleBack}
              disabled={step === 1}
              style={[
                styles.footerBackBtn,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  opacity: step === 1 ? 0.35 : 1,
                },
              ]}
            >
              <ChevronLeft size={14} color={colors.foreground} />
              <Text style={[styles.footerBtnText, { color: colors.foreground }]}>
                Back
              </Text>
            </Pressable>

            <Pressable
              onPress={handleNext}
              style={[styles.footerNextBtn, { backgroundColor: '#8b5cf6' }]}
            >
              <Text style={styles.footerNextBtnText}>
                {step === 3 ? 'Complete Setup' : 'Next Step'}
              </Text>
              {step === 3 ? (
                <Sparkles size={14} color="#ffffff" />
              ) : (
                <ChevronRight size={14} color="#ffffff" />
              )}
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

// =========================================================================
// 2. REUSABLE MULTI-STEP WIZARD TEMPLATE PREVIEW
// =========================================================================

export function MultiStepWizardPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(stateIndex || 0);
  const [appName, setAppName] = useState('My Awesome Project');
  const [category, setCategory] = useState('Enterprise SaaS');
  const [env, setEnv] = useState('Production');
  const [isDone, setIsDone] = useState(false);

  const steps: WizardStep[] = [
    { id: '1', title: 'General Info', description: 'Name & summary', icon: Rocket },
    { id: '2', title: 'Audience', description: 'Industry target', icon: Globe },
    { id: '3', title: 'Deploy', description: 'Environment & lock', icon: Shield },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleSubmit = () => {
    setIsDone(true);
  };

  return (
    <View style={styles.cardWrapper}>
      {isDone ? (
        <View
          style={[
            styles.wizardCard,
            styles.completedCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <CheckCircle2 size={44} color="#10b981" />
          <Text style={[styles.completedTitle, { color: colors.foreground }]}>
            Deployment Configured!
          </Text>
          <Text style={[styles.completedSubtitle, { color: colors.mutedForeground }]}>
            {appName} ({category}) is ready for {env} deployment.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIsDone(false);
              setCurrentStep(0);
            }}
            style={[styles.resetBtn, { borderColor: colors.border, marginTop: 12 }]}
          >
            <RotateCcw size={14} color={colors.foreground} />
            <Text style={[styles.resetBtnText, { color: colors.foreground }]}>
              Configure Another
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Wizard
          title="Project Provisioning Wizard"
          subtitle="Configure deployment pipeline in 3 streamlined steps"
          headerIcon={<Layers size={18} color="#8b5cf6" />}
          steps={steps}
          currentStepIndex={currentStep}
          onStepChange={setCurrentStep}
          onNext={handleNext}
          onPrevious={handlePrev}
          onSubmit={handleSubmit}
        >
          {currentStep === 0 && (
            <View style={{ gap: 14 }}>
              <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                Project / Application Name
              </Text>
              <TextInput
                value={appName}
                onChangeText={setAppName}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  },
                ]}
              />
            </View>
          )}

          {currentStep === 1 && (
            <View style={{ gap: 14 }}>
              <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                Primary Industry & Target
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {['Enterprise SaaS', 'Mobile Consumer', 'Fintech & Payments', 'E-Commerce'].map(
                  (c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setCategory(c)}
                      style={[
                        styles.roleChip,
                        category === c
                          ? { backgroundColor: '#f3e8ff', borderColor: '#8b5cf6' }
                          : { backgroundColor: colors.background, borderColor: colors.border },
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleChipText,
                          { color: category === c ? '#8b5cf6' : colors.foreground },
                        ]}
                      >
                        {c}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          )}

          {currentStep === 2 && (
            <View style={{ gap: 14 }}>
              <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                Target Deployment Environment
              </Text>
              <View style={{ gap: 8 }}>
                {['Staging Sandbox', 'Production US-East', 'Global Edge CDN'].map((e) => (
                  <TouchableOpacity
                    key={e}
                    onPress={() => setEnv(e)}
                    style={[
                      styles.timeSlotCard,
                      env === e
                        ? { backgroundColor: '#f3e8ff', borderColor: '#8b5cf6' }
                        : { backgroundColor: colors.background, borderColor: colors.border },
                    ]}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        { color: env === e ? '#8b5cf6' : colors.foreground },
                      ]}
                    >
                      {e}
                    </Text>
                    {env === e && <Check size={14} color="#8b5cf6" />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </Wizard>
      )}
    </View>
  );
}

// =========================================================================
// 3. SEGMENTED STEP PROGRESS PREVIEW
// =========================================================================

export function SegmentedStepProgressPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const initialStep = stateIndex === 0 ? 2 : stateIndex === 1 ? 3 : 4;
  const [currentStep, setCurrentStep] = useState(initialStep);

  const steps = [
    { label: 'Account', desc: 'Personal details' },
    { label: 'Verification', desc: 'Identity check' },
    { label: 'Billing', desc: 'Payment method' },
    { label: 'Completion', desc: 'Confirmation' },
  ];

  const total = steps.length;
  const percentComplete = Math.round(((currentStep - 1) / (total - 1)) * 100);

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.wizardCard,
          { backgroundColor: colors.card, borderColor: colors.border, padding: 20, gap: 20 },
        ]}
      >
        <View style={{ gap: 4 }}>
          <Text style={[styles.wizardMainTitle, { color: colors.foreground }]}>
            Segmented Step Progress
          </Text>
          <Text style={[styles.wizardSubtitle, { color: colors.mutedForeground }]}>
            Visual step-by-step progress tracking across multi-stage workflows.
          </Text>
        </View>

        {/* Stepper Visualization */}
        <View style={styles.stepperContainer}>
          {/* Connecting Line Track */}
          <View
            style={[
              styles.stepperLineTrack,
              { backgroundColor: isDark ? '#27272a' : '#f1f5f9' },
            ]}
          >
            <View
              style={[
                styles.stepperLineFill,
                {
                  width: `${percentComplete}%`,
                  backgroundColor: '#8b5cf6',
                },
              ]}
            />
          </View>

          {/* Stepper Nodes */}
          <View style={styles.stepperNodesRow}>
            {steps.map((s, idx) => {
              const stepNum = idx + 1;
              const isDone = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;

              return (
                <TouchableOpacity
                  key={s.label}
                  onPress={() => setCurrentStep(stepNum)}
                  style={styles.stepperNodeCol}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.stepperCircle,
                      isDone && { backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' },
                      isCurrent && {
                        borderColor: '#8b5cf6',
                        backgroundColor: isDark
                          ? 'rgba(139, 92, 246, 0.2)'
                          : '#f3e8ff',
                      },
                      !isDone &&
                        !isCurrent && {
                          borderColor: colors.border,
                          backgroundColor: isDark ? colors.card : '#f8fafc',
                        },
                    ]}
                  >
                    {isDone ? (
                      <Check size={14} color="#ffffff" strokeWidth={2.5} />
                    ) : (
                      <Text
                        style={[
                          styles.stepperNumText,
                          {
                            color: isCurrent ? '#8b5cf6' : colors.mutedForeground,
                            fontWeight: isCurrent ? '700' : '600',
                          },
                        ]}
                      >
                        {stepNum}
                      </Text>
                    )}
                  </View>

                  <Text
                    style={[
                      styles.stepperLabelText,
                      {
                        color: isCurrent
                          ? colors.foreground
                          : isDone
                          ? colors.foreground
                          : colors.mutedForeground,
                        fontWeight: isCurrent ? '700' : '500',
                      },
                    ]}
                  >
                    {s.label}
                  </Text>
                  <Text
                    style={[
                      styles.stepperDescText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {s.desc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Status Bar */}
        <View
          style={[
            styles.stepperMetaRow,
            { borderTopColor: colors.border },
          ]}
        >
          <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
            Current Active Stage:{' '}
            <Text style={{ fontWeight: '700', color: colors.foreground }}>
              Step {currentStep} of {total}
            </Text>
          </Text>

          <View
            style={[
              styles.stepBadgePill,
              { backgroundColor: '#f3e8ff', borderColor: '#e9d5ff' },
            ]}
          >
            <Text style={[styles.stepBadgeText, { color: '#8b5cf6' }]}>
              {percentComplete}% Complete
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 4. LINEAR & CIRCULAR PROGRESS PREVIEWS
// =========================================================================

export function LinearAndCircularProgressPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const initialVal = stateIndex === 1 ? 75 : stateIndex === 2 ? 30 : 45;
  const [val, setVal] = useState(initialVal);
  const [isRunning, setIsRunning] = useState(stateIndex === 2);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setVal((p) => (p >= 100 ? 0 : p + 5));
    }, 400);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Circular calculations
  const radius = 34;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (val / 100) * circumference;

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.wizardCard,
          { backgroundColor: colors.card, borderColor: colors.border, padding: 20, gap: 20 },
        ]}
      >
        {/* 1. Linear Bar Section */}
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={[styles.wizardMainTitle, { color: colors.foreground }]}>
                Linear Progress Indicator
              </Text>
              <Text style={[styles.wizardSubtitle, { color: colors.mutedForeground }]}>
                Real-time value updates with variant indicators
              </Text>
            </View>
            <View style={[styles.stepBadgePill, { backgroundColor: '#f3e8ff', borderColor: '#e9d5ff' }]}>
              <Text style={[styles.stepBadgeText, { color: '#8b5cf6' }]}>{val}%</Text>
            </View>
          </View>

          {/* Bar */}
          <View
            style={[
              styles.progressBarTrack,
              { backgroundColor: isDark ? '#27272a' : '#f4f4f5', height: 8 },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                { width: `${val}%`, backgroundColor: '#8b5cf6' },
              ]}
            />
          </View>

          {/* Interactive Controls */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity
                onPress={() => setVal((p) => Math.max(0, p - 10))}
                style={[styles.smallIconBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
              >
                <Minus size={14} color={colors.foreground} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setVal((p) => Math.min(100, p + 10))}
                style={[styles.smallIconBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
              >
                <Plus size={14} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity
                onPress={() => setIsRunning(!isRunning)}
                style={[
                  styles.smallActionBtn,
                  { backgroundColor: isRunning ? '#fef3c7' : '#f3e8ff' },
                ]}
              >
                {isRunning ? (
                  <>
                    <Pause size={13} color="#d97706" />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#d97706' }}>Pause</Text>
                  </>
                ) : (
                  <>
                    <Play size={13} color="#8b5cf6" />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#8b5cf6' }}>Simulate</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setVal(45);
                  setIsRunning(false);
                }}
                style={[styles.smallIconBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
              >
                <RotateCcw size={13} color={colors.foreground} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 2. Radial Circular Progress Ring */}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingTop: 16,
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Text style={[styles.stepTitle, { color: colors.foreground }]}>
            Radial Circular Progress Ring
          </Text>

          <View style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={100} height={100}>
              <Circle
                cx={50}
                cy={50}
                r={radius}
                stroke={isDark ? '#27272a' : '#f4f4f5'}
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={50}
                cy={50}
                r={radius}
                stroke={val === 100 ? '#10b981' : val < 30 ? '#f59e0b' : '#8b5cf6'}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </Svg>
            <View style={{ position: 'absolute', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: colors.foreground, fontFamily: 'Open Sans' }}>
                {val}%
              </Text>
              <Text style={{ fontSize: 9, color: colors.mutedForeground, fontFamily: 'Open Sans' }}>
                {val === 100 ? 'Synced' : 'Uploading'}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {val === 100 ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={14} color="#10b981" />
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#10b981' }}>Sync Complete</Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Loader2 size={14} color="#8b5cf6" />
                <Text style={{ fontSize: 11, color: colors.mutedForeground }}>Syncing assets to cloud...</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 5. COMBINED PREVIEW CONTAINER
// =========================================================================

export function WizardPreviews({ entry }: { entry?: GalleryEntry }) {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <QuestionnaireWizardPreview />
      <View style={{ height: 24 }} />
      <MultiStepWizardPreview />
      <View style={{ height: 24 }} />
      <SegmentedStepProgressPreview />
      <View style={{ height: 24 }} />
      <LinearAndCircularProgressPreview />
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
    maxWidth: 540,
    alignSelf: 'center',
    padding: 4,
  },
  wizardCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  completedCard: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  wizardHeader: {
    padding: 20,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sparkleIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wizardMainTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    letterSpacing: -0.2,
  },
  wizardSubtitle: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    marginTop: 2,
  },
  stepPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  stepPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8b5cf6',
    fontFamily: 'Open Sans',
  },
  progressRow: {
    gap: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  progressValue: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  wizardBody: {
    padding: 20,
  },
  stepContent: {
    gap: 16,
  },
  stepHeader: {
    gap: 4,
  },
  stepHeaderIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  stepSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  textInput: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
    fontFamily: 'Open Sans',
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleChipText: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayButton: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  timeSlotsGrid: {
    gap: 8,
  },
  timeSlotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeSlotText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  featureList: {
    gap: 8,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  featureCardDesc: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  completedContent: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  completedSuccessIconBox: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedTitle: {
    fontSize: 17,
    fontWeight: '800',
    fontFamily: 'Open Sans',
  },
  completedSubtitle: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  summaryInfoBox: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
    marginTop: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  summaryFeaturePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  summaryFeaturePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  wizardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  footerBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  footerBtnText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  footerNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  footerNextBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  stepperContainer: {
    position: 'relative',
    paddingVertical: 10,
  },
  stepperLineTrack: {
    position: 'absolute',
    top: 26,
    left: 20,
    right: 20,
    height: 3,
    borderRadius: 1.5,
  },
  stepperLineFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  stepperNodesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepperNodeCol: {
    alignItems: 'center',
    gap: 6,
    width: 70,
  },
  stepperCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperNumText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  stepperLabelText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  stepperDescText: {
    fontSize: 9.5,
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  stepperMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 14,
  },
  stepBadgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
  },
  stepBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  smallIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 6,
  },
});
