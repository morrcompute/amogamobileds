import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { InputOTP } from '../../components/ui/input-otp';
import { Text } from '../../components/ui/text';
import { useToast } from '../../components/ui/toast';
import { View } from '../../components/ui/view';
import { AuthScreen } from '../../components/auth/auth-screen';
import { useColor } from '../../hooks/useColor';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';
import { Mail, Phone, RefreshCw, ArrowLeft, Edit3 } from 'lucide-react-native';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function SignInScreen() {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Flow states
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpError, setOtpError] = useState<string | undefined>();
  const [notRegistered, setNotRegistered] = useState(false);
  const toast = useToast();

  const primary = useColor('primary');
  const cardBg = useColor('card');
  const borderColor = useColor('border');
  const textMuted = useColor('textMuted');
  const textColor = useColor('text');

  // Cooldown countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatPhoneNumber = (val: string) => {
    let cleaned = val.trim();
    if (cleaned && !cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    return cleaned;
  };

  const currentTarget = authMethod === 'email' ? email.trim() : formatPhoneNumber(phone);

  const validateTarget = () => {
    setOtpError(undefined);
    setNotRegistered(false);

    if (authMethod === 'email') {
      const trimmedEmail = email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
        toast.error('Valid email required', 'Please enter a valid work email address.');
        return false;
      }
    } else {
      const formatted = formatPhoneNumber(phone);
      if (formatted.length < 8) {
        toast.error('Valid phone required', 'Please enter a valid phone number with country code (e.g. +1234567890).');
        return false;
      }
    }
    return true;
  };

  // Step 1: Send Sign In OTP (with shouldCreateUser: false to detect unregistered users)
  const handleSendOtp = async () => {
    if (!validateTarget()) return;

    setLoading(true);
    setOtpError(undefined);
    setNotRegistered(false);

    try {
      if (authMethod === 'email') {
        const trimmedEmail = email.trim();
        const { error } = await supabase.auth.signInWithOtp({
          email: trimmedEmail,
          options: {
            shouldCreateUser: false, // Disallows auto-signup for sign-in
          },
        });
        if (error) throw error;
        toast.success('Code sent!', `A 6-digit login code was sent to ${trimmedEmail}`);
      } else {
        const formattedPhone = formatPhoneNumber(phone);
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
          options: {
            shouldCreateUser: false,
          },
        });
        if (error) throw error;
        toast.success('SMS code sent!', `A 6-digit login code was sent to ${formattedPhone}`);
      }

      setStep('otp');
      setOtpCode('');
      setCountdown(RESEND_COOLDOWN);
    } catch (err: any) {
      const msg = (err.message || '').toLowerCase();
      if (
        msg.includes('signup') ||
        msg.includes('not allowed') ||
        msg.includes('user not found') ||
        msg.includes('no user') ||
        msg.includes('invalid')
      ) {
        setNotRegistered(true);
        toast.error('Account not found', 'No account found with this information. Please sign up first!');
      } else {
        toast.error('Sign in failed', err.message || 'Please check your information.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Validate OTP & Sign In -> Route to Home Screen
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = (codeToVerify || otpCode).trim();
    if (code.length < CODE_LENGTH) {
      setOtpError(`Please enter all ${CODE_LENGTH} digits.`);
      return;
    }

    setVerifying(true);
    setOtpError(undefined);

    try {
      let verifyResult: any;
      if (authMethod === 'email') {
        verifyResult = await supabase.auth.verifyOtp({
          email: email.trim(),
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

      if (verifyResult.error) throw verifyResult.error;

      toast.success('Welcome back!', 'Signed in successfully.');

      // Route directly to home screen
      router.replace('/(tabs)/(home)');
    } catch (err: any) {
      const msg = err.message || 'Invalid or expired verification code.';
      setOtpError(msg);
      toast.error('Verification failed', msg);
    } finally {
      setVerifying(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setOtpError(undefined);
    try {
      if (authMethod === 'email') {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: { shouldCreateUser: false },
        });
        if (error) throw error;
        toast.success('Resent!', `New verification code sent to ${email.trim()}`);
      } else {
        const formattedPhone = formatPhoneNumber(phone);
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
          options: { shouldCreateUser: false },
        });
        if (error) throw error;
        toast.success('Resent!', `New SMS OTP sent to ${formattedPhone}`);
      }
      setCountdown(RESEND_COOLDOWN);
    } catch (err: any) {
      toast.error('Resend failed', err.message || 'Could not resend OTP code.');
    } finally {
      setResending(false);
    }
  };

  const isFormValid = authMethod === 'email' ? email.trim().length > 3 : phone.trim().length >= 6;

  // Render Step 2: 6-Digit OTP Verification Screen
  if (step === 'otp') {
    return (
      <AuthScreen
        title="Verify Sign In Code"
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
          {/* Target Info Bar */}
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

          {/* 6 Digit InputOTP Component */}
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
            {countdown > 0 ? (
              <Text style={{ fontSize: 12.5, color: textMuted }}>
                Resend code in <Text style={{ fontWeight: '600', color: textColor }}>{countdown}s</Text>
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

          {/* Verify Button */}
          <Button
            disabled={otpCode.length < CODE_LENGTH || verifying}
            loading={verifying}
            onPress={() => handleVerifyOtp()}
            style={{ height: 44, borderRadius: 8 }}
          >
            Verify & Sign In
          </Button>
        </View>
      </AuthScreen>
    );
  }

  // Render Step 1: Form Screen
  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in with instant OTP verification. No password required."
      footer={
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Text variant="caption">Don't have an account?</Text>
          <Button variant="link" size="sm" onPress={() => router.push('/sign-up')}>
            Sign up
          </Button>
        </View>
      }
    >
      {/* Unregistered User Action Banner */}
      {notRegistered && (
        <View
          style={{
            backgroundColor: 'rgba(239,68,68,0.12)',
            borderWidth: 1,
            borderColor: 'rgba(239,68,68,0.3)',
            borderRadius: 10,
            padding: 12,
            gap: 8,
            marginBottom: 6,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#ef4444' }}>
            Account not found
          </Text>
          <Text style={{ fontSize: 12, color: textColor, lineHeight: 17 }}>
            No Amoga account exists for this {authMethod === 'email' ? 'email' : 'phone number'}. Please create your account first!
          </Text>
          <Button
            onPress={() => router.push('/sign-up')}
            style={{ height: 38, borderRadius: 6, marginTop: 2 }}
          >
            Go to Sign Up
          </Button>
        </View>
      )}

      {/* Auth Method Selector Toggle (Email OTP vs Mobile OTP) */}
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
          onPress={() => {
            setAuthMethod('email');
            setNotRegistered(false);
          }}
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
          onPress={() => {
            setAuthMethod('phone');
            setNotRegistered(false);
          }}
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

      {/* Dynamic Target Input */}
      {authMethod === 'email' ? (
        <Input
          label="Work Email"
          icon={Mail}
          placeholder="you@company.com"
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            if (notRegistered) setNotRegistered(false);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />
      ) : (
        <View style={{ gap: 4 }}>
          <Input
            label="Mobile Number"
            icon={Phone}
            placeholder="+1 234 567 8900"
            value={phone}
            onChangeText={(val) => {
              setPhone(val);
              if (notRegistered) setNotRegistered(false);
            }}
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoComplete="tel"
            textContentType="telephoneNumber"
          />
          <Text variant="caption" style={{ color: textMuted, fontSize: 11.5 }}>
            Include country code prefix (e.g. +1, +44, +91)
          </Text>
        </View>
      )}

      {/* Action Button: Send Sign In Code */}
      <Button
        disabled={!isFormValid || loading}
        loading={loading}
        onPress={handleSendOtp}
        style={{ height: 44, borderRadius: 8 }}
      >
        {authMethod === 'email' ? 'Send Sign In Code' : 'Send Mobile Code'}
      </Button>
    </AuthScreen>
  );
}
