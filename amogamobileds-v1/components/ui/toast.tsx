import { Text } from './text';
import { AlertCircle, Check, Info, X } from 'lucide-react-native';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
  index: number;
}

const { width: screenWidth } = Dimensions.get('window');

// Reanimated spring configuration
const SPRING_CONFIG = {
  stiffness: 160,
  damping: 14,
};

export function Toast({
  id,
  title,
  description,
  variant = 'default',
  onDismiss,
  index,
  action,
}: ToastProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion
    );
    return () => subscription.remove();
  }, []);

  // Reanimated shared values
  const translateX = useSharedValue(-24);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    if (reduceMotion) {
      translateX.value = 0;
      opacity.value = 1;
      scale.value = 1;
    } else {
      translateX.value = withSpring(0, SPRING_CONFIG);
      opacity.value = withTiming(1, { duration: 220 });
      scale.value = withSpring(1, SPRING_CONFIG);
    }
  }, [reduceMotion]);

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return '#10b981'; // Green
      case 'error':
        return '#ef4444'; // Red
      case 'warning':
        return '#f59e0b'; // Amber
      case 'info':
        return '#38bdf8'; // Sky blue
      default:
        return '#94a3b8'; // Slate
    }
  };

  const getIcon = () => {
    const iconProps = { size: 16, color: getVariantColor() };

    switch (variant) {
      case 'success':
        return <Check {...iconProps} />;
      case 'error':
        return <X {...iconProps} />;
      case 'warning':
        return <AlertCircle {...iconProps} />;
      case 'info':
        return <Info {...iconProps} />;
      default:
        return null;
    }
  };

  const dismiss = useCallback(() => {
    if (reduceMotion) {
      onDismiss(id);
      return;
    }

    const onDismissAction = () => {
      'worklet';
      runOnJS(onDismiss)(id);
    };

    translateX.value = withTiming(-80, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        onDismissAction();
      }
    });
    scale.value = withSpring(0.9, SPRING_CONFIG);
  }, [id, onDismiss, reduceMotion]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (reduceMotion) return;
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;

      if (
        Math.abs(translationX) > 80 ||
        Math.abs(velocityX) > 600
      ) {
        if (reduceMotion) {
          runOnJS(onDismiss)(id);
          return;
        }

        const onDismissAction = () => {
          'worklet';
          runOnJS(onDismiss)(id);
        };

        translateX.value = withTiming(
          translationX > 0 ? screenWidth : -screenWidth,
          { duration: 200 }
        );
        opacity.value = withTiming(0, { duration: 200 }, (finished) => {
          if (finished) {
            onDismissAction();
          }
        });
      } else if (!reduceMotion) {
        translateX.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  // Docked at bottom-left corner with stack spacing
  const bottomOffset = (Platform.OS === 'web' ? 24 : 32) + index * 58;
  const leftOffset = Platform.OS === 'web' ? 20 : 16;

  const toastStyle: ViewStyle = {
    position: 'absolute',
    bottom: bottomOffset,
    left: leftOffset,
    zIndex: 999999 + index,
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[toastStyle, animatedContainerStyle]}
        accessible
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        accessibilityLabel={[title, description].filter(Boolean).join('. ')}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#18181b',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.12)',
            paddingHorizontal: 12,
            paddingVertical: 10,
            maxWidth: Math.min(screenWidth - 32, 330),
            minWidth: 200,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          {/* Variant Icon on Left */}
          {getIcon() && (
            <View
              style={{
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getIcon()}
            </View>
          )}

          {/* Title & Description in Middle */}
          <View style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
            {title && (
              <Text
                variant="subtitle"
                style={{
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: '600',
                  lineHeight: 17,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
            )}
            {description && (
              <Text
                variant="caption"
                style={{
                  color: '#A1A1AA',
                  fontSize: 11.5,
                  fontWeight: '400',
                  lineHeight: 15,
                  marginTop: title ? 2 : 0,
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {description}
              </Text>
            )}
          </View>

          {/* Optional Action Button */}
          {action && (
            <TouchableOpacity
              onPress={action.onPress}
              style={{
                marginLeft: 10,
                paddingHorizontal: 8,
                paddingVertical: 3,
                backgroundColor: getVariantColor(),
                borderRadius: 8,
              }}
            >
              <Text
                variant="caption"
                style={{
                  color: '#FFFFFF',
                  fontSize: 11,
                  fontWeight: '600',
                }}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          )}

          {/* Dedicated Cross (X) Close Button on Right */}
          <TouchableOpacity
            onPress={dismiss}
            style={{
              marginLeft: 8,
              padding: 4,
              borderRadius: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            accessibilityRole="button"
            accessibilityLabel="Close toast notification"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={13} color="#D4D4D8" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

interface ToastContextType {
  toast: (toast: Omit<ToastData, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 3 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const addToast = useCallback(
    (toastData: Omit<ToastData, 'id'>) => {
      const id = generateId();
      const newToast: ToastData = {
        ...toastData,
        id,
        duration: toastData.duration ?? 4000,
      };

      setToasts((prev) => {
        const updated = [newToast, ...prev];
        return updated.slice(0, maxToasts);
      });

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, newToast.duration);
      }
    },
    [maxToasts, dismissToast]
  );

  const createVariantToast = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      addToast({
        title,
        description,
        variant,
      });
    },
    [addToast]
  );

  const contextValue: ToastContextType = {
    toast: addToast,
    success: (title, description) =>
      createVariantToast('success', title, description),
    error: (title, description) =>
      createVariantToast('error', title, description),
    warning: (title, description) =>
      createVariantToast('warning', title, description),
    info: (title, description) =>
      createVariantToast('info', title, description),
    dismiss: dismissToast,
    dismissAll,
  };

  const containerStyle: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 999999,
    pointerEvents: 'box-none',
  };

  return (
    <ToastContext.Provider value={contextValue}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {children}
        <View style={containerStyle} pointerEvents="box-none">
          {toasts.map((toast, index) => (
            <Toast
              key={toast.id}
              {...toast}
              index={index}
              onDismiss={dismissToast}
            />
          ))}
        </View>
      </GestureHandlerRootView>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
