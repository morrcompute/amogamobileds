import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultEmailSettings from './app_email_settings.json';

export interface EmailSendPayload {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    id?: string;
    name?: string;
    filename?: string;
    type?: string;
    size?: string;
    url?: string;
    content?: string;
  }>;
}

export function getApiBaseUrl(): string {
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL || process.env.EXPO_PUBLIC_BACKEND_URL;
  if (envApiUrl) {
    return envApiUrl.replace(/\/$/, '');
  }

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      const hostname = window.location?.hostname || '';
      // In local development on web (localhost, 127.0.0.1, or local dev port)
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.') ||
        window.location?.port === '8081' ||
        window.location?.port === '8082'
      ) {
        return 'https://amoganativenew.vercel.app';
      }
    }
    return '';
  }

  // Standalone APK / mobile build default to production serverless backend
  if (!__DEV__) {
    return 'https://amoganativenew.vercel.app';
  }

  // For physical Android/iOS or simulator environments in local development
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest?.debuggerHost ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    '';

  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:8081`;
  }

  return 'https://amoganativenew.vercel.app';
}

export async function getActiveEmailConfig() {
  try {
    const raw = await AsyncStorage.getItem('amoga_app_email_accounts');
    if (raw) {
      const accounts = JSON.parse(raw);
      if (Array.isArray(accounts)) {
        const active = accounts.find((a) => a.isEnabled) || accounts[0];
        if (active) {
          return {
            email: active.email || defaultEmailSettings.email,
          };
        }
      }
    }
  } catch (err) {
    console.warn('Error reading active email config from AsyncStorage:', err);
  }

  return {
    email: defaultEmailSettings.email,
  };
}

export async function fetchLiveInbox(page: number = 1, limit: number = 20) {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/mail/inbox?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.emails)) {
        return data.emails;
      }
    }
  } catch (err) {
    console.warn('fetchLiveInbox network call error:', err);
  }
  return null;
}

export async function fetchLiveSent(page: number = 1, limit: number = 20) {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/mail/sent?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.emails)) {
        return data.emails;
      }
    }
  } catch (err) {
    console.warn('fetchLiveSent network call error:', err);
  }
  return null;
}

export async function sendLiveEmail(payload: EmailSendPayload) {
  try {
    const config = await getActiveEmailConfig();
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/mail/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: payload.to,
        from: `"${config.email.split('@')[0]}" <${config.email}>`,
        subject: payload.subject,
        html: payload.html || payload.text,
        text: payload.text,
        attachments: payload.attachments?.map((att) => ({
          filename: att.name || att.filename || 'attachment',
          content: att.url || att.content,
          contentType: att.type,
        })),
      }),
    });

    const data = await res.json().catch(() => null);
    if (res.ok && data?.success) {
      return { success: true, messageId: data.messageId };
    }
    return {
      success: false,
      message: data?.message || 'Failed to send email through server.',
    };
  } catch (err: any) {
    console.error('sendLiveEmail error:', err);
    return {
      success: false,
      message: err?.message || 'Network error while sending email.',
    };
  }
}

export async function testEmailConnection() {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/mail/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    const data = await res.json().catch(() => null);
    return data || { success: false, message: 'Invalid server response' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error during connection test' };
  }
}
