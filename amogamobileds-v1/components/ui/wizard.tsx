import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';

export interface WizardStep {
  id: string | number;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ size: number; color: string }>;
}

export interface StepIndicatorProps {
  steps: WizardStep[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
  allowStepClick?: boolean;
  style?: ViewStyle;
  activeColor?: string;
}

/**
 * Reusable StepIndicator component for multi-step progress workflows.
 */
export function StepIndicator({
  steps,
  currentStepIndex,
  onStepClick,
  allowStepClick = true,
  style,
  activeColor,
}: StepIndicatorProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const primaryColor = activeColor || colors.primary || '#8b5cf6';

  return (
    <View style={[styles.indicatorContainer, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.indicatorScrollContent}
      >
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isClickable = allowStepClick && onStepClick && idx < currentStepIndex;
          const StepIcon = step.icon;

          return (
            <React.Fragment key={step.id}>
              <TouchableOpacity
                disabled={!isClickable}
                onPress={isClickable ? () => onStepClick(idx) : undefined}
                activeOpacity={isClickable ? 0.7 : 1}
                style={[
                  styles.stepNode,
                  isClickable && styles.stepNodeClickable,
                ]}
              >
                {/* Step Circle Badge */}
                <View
                  style={[
                    styles.stepCircle,
                    isCompleted && {
                      backgroundColor: primaryColor,
                      borderColor: primaryColor,
                    },
                    isCurrent && {
                      borderColor: primaryColor,
                      backgroundColor: isDark
                        ? 'rgba(139, 92, 246, 0.15)'
                        : 'rgba(139, 92, 246, 0.1)',
                    },
                    !isCompleted &&
                      !isCurrent && {
                        borderColor: colors.border,
                        backgroundColor: isDark ? colors.card : '#f4f4f5',
                      },
                  ]}
                >
                  {isCompleted ? (
                    <Check size={14} color="#ffffff" strokeWidth={2.5} />
                  ) : StepIcon ? (
                    <StepIcon
                      size={14}
                      color={isCurrent ? primaryColor : colors.mutedForeground}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.stepNumberText,
                        {
                          color: isCurrent ? primaryColor : colors.mutedForeground,
                          fontWeight: isCurrent ? '700' : '600',
                        },
                      ]}
                    >
                      {idx + 1}
                    </Text>
                  )}
                </View>

                {/* Step Title & Subtitle */}
                <View style={styles.stepTextWrapper}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.stepTitle,
                      {
                        color: isCurrent
                          ? colors.foreground
                          : isCompleted
                          ? colors.foreground
                          : colors.mutedForeground,
                        fontWeight: isCurrent ? '700' : '500',
                      },
                    ]}
                  >
                    {step.title}
                  </Text>
                  {step.description ? (
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.stepDesc,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {step.description}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>

              {/* Connecting Line between steps */}
              {idx < steps.length - 1 && (
                <View
                  style={[
                    styles.stepConnectorLine,
                    {
                      backgroundColor:
                        idx < currentStepIndex ? primaryColor : colors.border,
                    },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
}

export interface WizardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerIcon?: React.ReactNode;
  steps: WizardStep[];
  currentStepIndex: number;
  onStepChange?: (index: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  canProceed?: boolean;
  allowStepClick?: boolean;
  activeColor?: string;
  headerExtra?: React.ReactNode;
  footerExtra?: React.ReactNode;
  showProgressLine?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  children: React.ReactNode;
}

/**
 * Universal Wizard & Multi-Step workflow component.
 * Supports smooth responsive layouts, theme styling, customized buttons, and step indicators.
 */
export function Wizard({
  title,
  subtitle,
  headerIcon,
  steps,
  currentStepIndex,
  onStepChange,
  onNext,
  onPrevious,
  onSubmit,
  nextLabel = 'Continue',
  previousLabel = 'Back',
  submitLabel = 'Complete Setup',
  isSubmitting = false,
  canProceed = true,
  allowStepClick = true,
  activeColor,
  headerExtra,
  footerExtra,
  showProgressLine = true,
  style,
  contentStyle,
  children,
}: WizardProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const primaryColor = activeColor || colors.primary || '#8b5cf6';

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const totalSteps = steps.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <View
      style={[
        styles.wizardContainer,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {/* Header Section */}
      {(title || subtitle || headerIcon || headerExtra) && (
        <View
          style={[
            styles.wizardHeader,
            { borderBottomColor: colors.border },
          ]}
        >
          <View style={styles.headerTopRow}>
            <View style={styles.headerTitleGroup}>
              {headerIcon && (
                <View
                  style={[
                    styles.headerIconBox,
                    {
                      backgroundColor: isDark
                        ? 'rgba(139, 92, 246, 0.15)'
                        : '#f3e8ff',
                    },
                  ]}
                >
                  {headerIcon}
                </View>
              )}
              <View style={{ flex: 1 }}>
                {typeof title === 'string' ? (
                  <Text
                    style={[styles.wizardMainTitle, { color: colors.foreground }]}
                  >
                    {title}
                  </Text>
                ) : (
                  title
                )}
                {typeof subtitle === 'string' ? (
                  <Text
                    style={[styles.wizardSubtitle, { color: colors.mutedForeground }]}
                  >
                    {subtitle}
                  </Text>
                ) : (
                  subtitle
                )}
              </View>
            </View>

            {headerExtra ? (
              headerExtra
            ) : (
              <View
                style={[
                  styles.stepBadgePill,
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
                <Text
                  style={[
                    styles.stepBadgeText,
                    { color: primaryColor },
                  ]}
                >
                  Step {currentStepIndex + 1} of {totalSteps}
                </Text>
              </View>
            )}
          </View>

          {/* Optional linear progress line */}
          {showProgressLine && (
            <View
              style={[
                styles.headerProgressTrack,
                { backgroundColor: isDark ? '#27272a' : '#f4f4f5' },
              ]}
            >
              <View
                style={[
                  styles.headerProgressFill,
                  {
                    width: `${progressPercent}%`,
                    backgroundColor: primaryColor,
                  },
                ]}
              />
            </View>
          )}
        </View>
      )}

      {/* Steps Breadcrumbs / Stepper */}
      <StepIndicator
        steps={steps}
        currentStepIndex={currentStepIndex}
        onStepClick={onStepChange}
        allowStepClick={allowStepClick}
        activeColor={primaryColor}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: isDark ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)',
        }}
      />

      {/* Main Step Body Content */}
      <View style={[styles.wizardBodyContent, contentStyle]}>{children}</View>

      {/* Footer Navigation Controls */}
      <View
        style={[
          styles.wizardFooter,
          { borderTopColor: colors.border },
        ]}
      >
        <TouchableOpacity
          disabled={isFirstStep || isSubmitting}
          onPress={onPrevious}
          activeOpacity={0.7}
          style={[
            styles.footerPrevBtn,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              opacity: isFirstStep ? 0.35 : 1,
            },
          ]}
        >
          <ChevronLeft size={16} color={colors.foreground} />
          <Text
            style={[styles.footerPrevBtnText, { color: colors.foreground }]}
          >
            {previousLabel}
          </Text>
        </TouchableOpacity>

        <View style={styles.footerRightGroup}>
          {footerExtra}
          {isLastStep ? (
            <TouchableOpacity
              disabled={!canProceed || isSubmitting}
              onPress={onSubmit}
              activeOpacity={0.8}
              style={[
                styles.footerNextBtn,
                {
                  backgroundColor: primaryColor,
                  opacity: !canProceed || isSubmitting ? 0.5 : 1,
                },
              ]}
            >
              {isSubmitting ? (
                <Loader2 size={16} color="#ffffff" style={styles.spinnerIcon} />
              ) : (
                <Check size={16} color="#ffffff" strokeWidth={2.5} />
              )}
              <Text style={styles.footerNextBtnText}>
                {isSubmitting ? 'Processing...' : submitLabel}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={!canProceed || isSubmitting}
              onPress={onNext}
              activeOpacity={0.8}
              style={[
                styles.footerNextBtn,
                {
                  backgroundColor: primaryColor,
                  opacity: !canProceed || isSubmitting ? 0.5 : 1,
                },
              ]}
            >
              <Text style={styles.footerNextBtnText}>{nextLabel}</Text>
              <ChevronRight size={16} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wizardContainer: {
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
  wizardHeader: {
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
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
  headerProgressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 2,
  },
  headerProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  indicatorContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  indicatorScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepNode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepNodeClickable: {
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  stepTextWrapper: {
    gap: 1,
    maxWidth: 130,
  },
  stepTitle: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  stepDesc: {
    fontSize: 10,
    fontFamily: 'Open Sans',
  },
  stepConnectorLine: {
    width: 24,
    height: 2,
    borderRadius: 1,
    marginHorizontal: 4,
  },
  wizardBodyContent: {
    padding: 20,
    minHeight: 220,
  },
  wizardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  footerPrevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  footerPrevBtnText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  footerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  spinnerIcon: {
    transform: [{ rotate: '45deg' }],
  },
});
