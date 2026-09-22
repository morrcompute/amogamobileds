import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

export interface PhoneHintResult {
  number: string;
  e164: string | null;
  regionCode?: string | null;
}

/**
 * Safely checks if the native ExpoPhoneNumberHint module is compiled into the current binary.
 * In Expo Go, requireOptionalNativeModule safely returns null without throwing an exception.
 */
function hasNativePhoneHintModule(): boolean {
  if (Platform.OS !== 'android') return false;
  try {
    const { requireOptionalNativeModule } = require('expo-modules-core');
    if (typeof requireOptionalNativeModule === 'function') {
      const nativeMod = requireOptionalNativeModule('ExpoPhoneNumberHint');
      return !!nativeMod;
    }
  } catch {
    return false;
  }
  return false;
}

/**
 * Hook to interact with Android's Google Play Services Phone Number Hint API.
 * Automatically checks availability on Android devices, and safely falls back
 * on Expo Go, iOS, Web, and devices without Google Play Services without throwing.
 */
export function usePhoneHint() {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAvailability() {
      // In Expo Go or non-Android, the native module is absent; return early without importing
      if (!hasNativePhoneHintModule()) {
        setIsAvailable(false);
        return;
      }

      try {
        const { isAvailableAsync } = await import('expo-phone-number-hint');
        const available = await isAvailableAsync();
        if (isMounted) {
          setIsAvailable(available);
        }
      } catch {
        if (isMounted) {
          setIsAvailable(false);
        }
      }
    }

    checkAvailability();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Prompts the native Android "Continue with [Phone Number]" dialog.
   * Returns PhoneHintResult if user selected a SIM number, or null if cancelled / unavailable.
   */
  const requestHint = useCallback(async (): Promise<PhoneHintResult | null> => {
    if (!hasNativePhoneHintModule()) {
      return null;
    }

    setLoading(true);
    try {
      const { showPhoneNumberHintAsync } = await import('expo-phone-number-hint');
      const result = await showPhoneNumberHintAsync();

      if (!result || result.canceled || !result.hint) {
        return null;
      }

      return {
        number: result.hint.number,
        e164: result.hint.e164 || result.hint.number,
        regionCode: result.hint.regionCode,
      };
    } catch {
      // User cancelled dialog or API resolution failed
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isAvailable,
    loading,
    requestHint,
  };
}

export default usePhoneHint;
