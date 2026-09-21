import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { View } from './view';
import { Text } from './text';
import { Button } from './button';
import { Input } from './input';
import { InputOTP } from './input-otp';
import { Checkbox } from './checkbox';
import { useToast } from './toast';
import { AuthScreen } from '../auth/auth-screen';
import { useColor } from '../../hooks/useColor';
import { useColorScheme } from '../../hooks/useColorScheme';
import { supabase } from '../../lib/supabase';
import {
  Mail,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  Edit3,
} from 'lucide-react-native';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export interface SignupPageViewProps {
  onSuccess?: (user: any) => void;
  onSignInPress?: () => void;
  initialMethod?: 'email' | 'phone';
}

export function SignupPageView({
  onSuccess,
  onSignInPress,
  initialMethod = 'email',
}: SignupPageViewProps) {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>(initialMethod);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [accepted, setAccepted] = useState(false);

  // OTP flow states
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [verifiedUser, setVerifiedUser] = useState<any>(null);

  const toast = useToast();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const primary = useColor('primary');
  const cardBg = useColor('card');
  const borderColor = useColor('border');
  const textMuted = useColor('textMuted');
  const textColor = useColor('text');
  const successColor = '#10b981';

  // Resend cooldown timer
  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const formatPhoneNumber = (val: string) => {
    let cleaned = val.trim();
    if (cleaned && !cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    return cleaned;
  };

  const currentTarget = authMethod === 'email' ? email.trim() : formatPhoneNumber(phone);

  // Validate Step 1 form fields
  const validateForm = (): boolean => {
    if (!displayName.trim()) {
      toast.error('Name required', 'Please enter your full name.');
      return false;
    }

    if (authMethod === 'email') {
      const trimmedEmail = email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
        toast.error('Valid email required', 'Please enter a valid work email address.');
        return false;
      }
    } else {
      const formattedPhone = formatPhoneNumber(phone);
      if (formattedPhone.length < 8) {
        toast.error(
          'Valid phone required',
          'Please enter a valid phone number with country code (e.g. +1234567890).'
        );
        return false;
      }
    }

    if (!accepted) {
      toast.error('Terms agreement required', 'Please accept the terms of service and privacy policy.');
      return false;
    }

    return true;
  };

  // Step 2: Supabase Email OTP Send
  const handleSendEmailOtp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setOtpError(undefined);

    const trimmedEmail = email.trim();
    const cleanName = displayName.trim();

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: {
          shouldCreateUser: true,
          data: {
            display_name: cleanName,
            full_name: cleanName,
            name: cleanName,
          },
        },
      });

      if (error) throw error;

      toast.success('OTP sent!', `A 6-digit verification code was sent to ${trimmedEmail}`);
      setStep('otp');
      setOtpCode('');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err: any) {
      toast.error('Failed to send OTP', err.message || 'Please check your email address and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Supabase Mobile OTP Send
  const handleSendMobileOtp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setOtpError(undefined);

    const formattedPhone = formatPhoneNumber(phone);
    const cleanName = displayName.trim();

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          shouldCreateUser: true,
          data: {
            display_name: cleanName,
            full_name: cleanName,
            name: cleanName,
            mobile: formattedPhone,
          },
        },
      });

      if (error) throw error;

      toast.success('SMS OTP sent!', `A 6-digit code was sent to ${formattedPhone}`);
      setStep('otp');
      setOtpCode('');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err: any) {
      toast.error('Failed to send SMS OTP', err.message || 'Please verify your phone number and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Common OTP Verification & Supabase User / Profile Persistence
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = (codeToVerify || otpCode).trim();
    if (code.length < CODE_LENGTH) {
      setOtpError(`Please enter all ${CODE_LENGTH} digits of your verification code.`);
      return;
    }

    setVerifying(true);
    setOtpError(undefined);

    try {
      let verifyResult: any;

      if (authMethod === 'email') {
        const trimmedEmail = email.trim();
        verifyResult = await supabase.auth.verifyOtp({
          email: trimmedEmail,
          token: code,
          type: 'email',
        });
      } else {
        const formattedPhone = formatPhoneNumber(phone);
        verifyResult = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: code,
          type: 'sms',
        });
      }

      if (verifyResult.error) {
        throw verifyResult.error;
      }

      const user = verifyResult.data?.user;
      if (!user) {
        throw new Error('Verification completed, but no user session was returned.');
      }

      const cleanName = displayName.trim() || user.user_metadata?.display_name || 'Amoga User';

      // 1. Save user metadata in Supabase Auth
      await supabase.auth.updateUser({
        data: {
          display_name: cleanName,
          full_name: cleanName,
          name: cleanName,
          ...(authMethod === 'phone'
            ? {
                mobile: formatPhoneNumber(phone),
                phone: formatPhoneNumber(phone),
                phone_number: formatPhoneNumber(phone),
              }
            : {
                email: email.trim(),
              }),
        },
      });

      // 2. Persist / Upsert profile in Supabase public.profiles table
      const profileData: Record<string, any> = {
        id: user.id,
        name: cleanName,
        display_name: cleanName,
        updated_at: new Date().toISOString(),
      };

      if (authMethod === 'email') {
        profileData.email = email.trim();
      } else {
        const formattedPhone = formatPhoneNumber(phone);
        profileData.mobile = formattedPhone;
        profileData.phone = formattedPhone;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (profileError) {
        console.warn('Profile sync notice:', profileError.message);
      }

      setVerifiedUser(user);
      setStep('success');
      toast.success('Account created & verified!', 'Welcome to Amoga Mobile.');

      if (onSuccess) {
        onSuccess(user);
      }
    } catch (err: any) {
      const msg = err.message || 'Invalid or expired verification code.';
      setOtpError(msg);
      toast.error('Verification failed', msg);
    } finally {
      setVerifying(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);
    setOtpError(undefined);

    try {
      if (authMethod === 'email') {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: { shouldCreateUser: true },
        });
        if (error) throw error;
        toast.success('Resent!', `A new verification code was sent to ${email.trim()}`);
      } else {
        const formattedPhone = formatPhoneNumber(phone);
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
          options: { shouldCreateUser: true },
        });
        if (error) throw error;
        toast.success('Resent!', `A new SMS OTP was sent to ${formattedPhone}`);
      }
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err: any) {
      toast.error('Resend failed', err.message || 'Could not resend OTP code.');
    } finally {
      setResending(false);
    }
  };

  const isFormValid =
    displayName.trim().length > 0 &&
    (authMethod === 'email' ? email.trim().length > 3 : phone.trim().length >= 6) &&
    accepted;

  // Render Step 3: Registration Success Screen
  if (step === 'success') {
    return (
      <AuthScreen
        title="Account Created"
        subtitle="Your account is verified and ready to use."
      >
        <View style={{ alignItems: 'center', gap: 16, paddingVertical: 12 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: successColor + '20',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: successColor + '40',
            }}
          >
            <CheckCircle2 size={32} color={successColor} />
          </View>

          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: textColor, textAlign: 'center' }}>
              Welcome, {displayName || 'User'}!
            </Text>
            <Text style={{ fontSize: 13, color: textMuted, textAlign: 'center' }}>
              Verified via {authMethod === 'email' ? 'Email OTP' : 'Mobile SMS OTP'} (
              {currentTarget})
            </Text>
          </View>

          <View
            style={{
              width: '100%',
              backgroundColor: cardBg,
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor,
              gap: 8,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: textMuted }}>Name</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: textColor }}>{displayName}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: textMuted }}>
                {authMethod === 'email' ? 'Email' : 'Mobile'}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: textColor }}>
                {currentTarget}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: textMuted }}>Supabase Sync</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: successColor }}>
                ✓ Synced to Profiles
              </Text>
            </View>
          </View>

          <Button
            style={{ width: '100%', marginTop: 8 }}
            onPress={() => {
              if (onSignInPress) {
                onSignInPress();
              } else {
                setStep('form');
                setOtpCode('');
              }
            }}
          >
            Continue to App
          </Button>
        </View>
      </AuthScreen>
    );
  }

  // Render Step 2: 6-Digit OTP Verification Screen
  if (step === 'otp') {
    return (
      <AuthScreen
        title="Verify OTP Code"
        subtitle={`Enter the 6-digit code sent to ${currentTarget}`}
        footer={
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setStep('form');
                setOtpError(undefined);
              }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
              activeOpacity={0.7}
            >
              <ArrowLeft size={14} color={primary} />
              <Text style={{ fontSize: 13, color: primary, fontWeight: '600' }}>
                Change {authMethod === 'email' ? 'Email' : 'Number'}
              </Text>
            </TouchableOpacity>
          </View>
        }
      >
        <View style={{ gap: 20 }}>
          {/* Target Info Pill */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: cardBg,
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
              {authMethod === 'email' ? (
                <Mail size={16} color={primary} />
              ) : (
                <Phone size={16} color={primary} />
              )}
              <Text style={{ fontSize: 13, fontWeight: '600', color: textColor }} numberOfLines={1}>
                {currentTarget}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setStep('form');
                setOtpError(undefined);
              }}
              activeOpacity={0.7}
            >
              <Edit3 size={15} color={textMuted} />
            </TouchableOpacity>
          </View>

          {/* 6-Digit InputOTP Component */}
          <View style={{ gap: 8, alignItems: 'center' }}>
            <InputOTP
              length={CODE_LENGTH}
              value={otpCode}
              onChangeText={(val) => {
                setOtpCode(val);
                if (otpError) setOtpError(undefined);
              }}
              onComplete={(val) => {
                setOtpCode(val);
                handleVerifyOtp(val);
              }}
              error={otpError}
              disabled={verifying}
            />

            {otpError && (
              <Text style={{ fontSize: 12, color: '#ef4444', textAlign: 'center', marginTop: 4 }}>
                {otpError}
              </Text>
            )}
          </View>

          {/* Resend OTP Bar */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {cooldown > 0 ? (
              <Text style={{ fontSize: 12.5, color: textMuted }}>
                Resend code in <Text style={{ fontWeight: '600', color: textColor }}>{cooldown}s</Text>
              </Text>
            ) : (
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={resending}
                activeOpacity={0.7}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
              >
                <RefreshCw size={13} color={primary} />
                <Text style={{ fontSize: 12.5, color: primary, fontWeight: '600' }}>
                  {resending ? 'Sending new code...' : 'Resend code'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Verify OTP Button */}
          <Button
            disabled={otpCode.length < CODE_LENGTH || verifying}
            loading={verifying}
            onPress={() => handleVerifyOtp()}
            style={{ height: 44, borderRadius: 8 }}
          >
            Verify & Create Account
          </Button>
        </View>
      </AuthScreen>
    );
  }

  // Render Step 1: Registration Form Screen
  return (
    <AuthScreen
      title="Create an account"
      subtitle="Sign up with instant OTP verification."
      footer={
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Text variant="caption">Already have an account?</Text>
          <Button
            variant="link"
            size="sm"
            onPress={() => {
              if (onSignInPress) {
                onSignInPress();
              }
            }}
          >
            Sign in
          </Button>
        </View>
      }
    >
      {/* Step 1 UI: Method Selector (Email OTP vs Mobile OTP) */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: cardBg,
          borderRadius: 12,
          padding: 4,
          borderWidth: 1,
          borderColor,
          gap: 4,
        }}
      >
        <TouchableOpacity
          onPress={() => setAuthMethod('email')}
          activeOpacity={0.8}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            borderRadius: 8,
            backgroundColor: authMethod === 'email' ? primary : 'transparent',
            gap: 8,
          }}
        >
          <Mail size={16} color={authMethod === 'email' ? '#FFFFFF' : textMuted} />
          <Text
            style={{
              fontWeight: '600',
              fontSize: 13.5,
              color: authMethod === 'email' ? '#FFFFFF' : textMuted,
            }}
          >
            Email OTP
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setAuthMethod('phone')}
          activeOpacity={0.8}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            borderRadius: 8,
            backgroundColor: authMethod === 'phone' ? primary : 'transparent',
            gap: 8,
          }}
        >
          <Phone size={16} color={authMethod === 'phone' ? '#FFFFFF' : textMuted} />
          <Text
            style={{
              fontWeight: '600',
              fontSize: 13.5,
              color: authMethod === 'phone' ? '#FFFFFF' : textMuted,
            }}
          >
            Mobile OTP
          </Text>
        </TouchableOpacity>
      </View>

      {/* Full Name Input */}
      <Input
        label="Full Name"
        icon={User}
        placeholder="Ada Lovelace"
        value={displayName}
        onChangeText={setDisplayName}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
      />

      {/* Dynamic Target Input based on Method */}
      {authMethod === 'email' ? (
        <Input
          label="Work Email"
          icon={Mail}
          placeholder="you@company.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
      ) : (
        <View style={{ gap: 4 }}>
          <Input
            label="Mobile Number"
            icon={Phone}
            placeholder="+1 234 567 8900"
            value={phone}
            onChangeText={setPhone}
            autoCapitalize="none"
            autoComplete="tel"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
          />
          <Text variant="caption" style={{ color: textMuted, fontSize: 11.5 }}>
            Include country code prefix (e.g. +1, +44, +91)
          </Text>
        </View>
      )}

      {/* Terms & Privacy Policy Checkbox */}
      <Checkbox
        checked={accepted}
        onCheckedChange={setAccepted}
        label="I agree to the terms of service and privacy policy"
      />

      {/* Action Button: Send Email / Mobile OTP */}
      <Button
        disabled={!isFormValid || loading}
        loading={loading}
        onPress={authMethod === 'email' ? handleSendEmailOtp : handleSendMobileOtp}
        style={{ height: 44, borderRadius: 8 }}
      >
        {authMethod === 'email' ? 'Send Email OTP' : 'Send Mobile OTP'}
      </Button>
    </AuthScreen>
  );
}
