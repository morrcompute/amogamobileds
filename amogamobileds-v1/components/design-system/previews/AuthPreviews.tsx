import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Phone,
  ArrowLeft,
  Edit3,
} from 'lucide-react-native';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { InputOTP } from '../../ui/input-otp';
import { Checkbox } from '../../ui/checkbox';
import { Separator } from '../../ui/separator';
import { Badge } from '../../ui/badge';
import { useToast } from '../../ui/toast';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { useColor } from '../../../hooks/useColor';
import { useColorTheme } from '../../../providers/color-theme-provider';
import { supabase } from '../../../lib/supabase';

// ---------------------------------------------------------------------------
// 1. Sign In Preview
// ---------------------------------------------------------------------------
export function SignInPreview() {
  const isDark = useColorScheme() === 'dark';
  const { currentTheme } = useColorTheme();
  const accent = isDark
    ? currentTheme?.name && currentTheme.name !== 'zinc' && currentTheme.preview
      ? currentTheme.preview
      : '#818cf8'
    : currentTheme?.name && currentTheme.name !== 'zinc'
    ? currentTheme.preview
    : '#18181b';

  const [email, setEmail] = useState('alex.rivera@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const cardBg = isDark ? '#141721' : '#ffffff';
  const border = isDark ? '#232734' : '#e2e8f0';
  const text = isDark ? '#f8fafc' : '#0f172a';
  const muted = isDark ? '#94a3b8' : '#64748b';

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  return (
    <View style={{ width: '100%', maxWidth: 360, gap: 16 }}>
      {/* Header */}
      <View style={{ gap: 4, alignItems: 'center' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: accent + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}
        >
          <Lock size={20} color={accent} />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '700', color: text }}>Welcome back</Text>
        <Text style={{ fontSize: 12.5, color: muted }}>Sign in to continue to your account.</Text>
      </View>

      {/* Success banner */}
      {success && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#10b98120',
            borderWidth: 1,
            borderColor: '#10b98140',
          }}
        >
          <CheckCircle2 size={16} color="#10b981" />
          <Text style={{ fontSize: 12, color: '#10b981', fontWeight: '500' }}>
            Successfully authenticated!
          </Text>
        </View>
      )}

      {/* Form Fields */}
      <View style={{ gap: 12 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Email</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: border,
              backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
              paddingHorizontal: 10,
              gap: 8,
            }}
          >
            <Mail size={15} color="#94a3b8" />
            <TextInput
              style={{ flex: 1, fontSize: 13, color: text, padding: 0 }}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={{ gap: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Password</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={{ fontSize: 11.5, color: accent, fontWeight: '500' }}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: border,
              backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
              paddingHorizontal: 10,
              gap: 8,
            }}
          >
            <Lock size={15} color="#94a3b8" />
            <TextInput
              style={{ flex: 1, fontSize: 13, color: text, padding: 0 }}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter password"
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
              {showPassword ? <EyeOff size={14} color="#94a3b8" /> : <Eye size={14} color="#94a3b8" />}
            </TouchableOpacity>
          </View>
        </View>

        <Button
          loading={loading}
          disabled={loading}
          onPress={handleSignIn}
          style={{ height: 42, borderRadius: 8, marginTop: 4 }}
        >
          Sign in
        </Button>
      </View>

      {/* Divider */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 2 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: border }} />
        <Text style={{ fontSize: 11, color: muted }}>or continue with</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: border }} />
      </View>

      {/* Social Buttons */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 38,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: border,
            backgroundColor: isDark ? '#0c0f17' : '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 12.5, fontWeight: '600', color: text }}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 38,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: border,
            backgroundColor: isDark ? '#0c0f17' : '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 12.5, fontWeight: '600', color: text }}>Apple</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
        <Text style={{ fontSize: 12, color: muted }}>Don't have an account?</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: accent }}>Create account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// 2. Sign Up Preview
// ---------------------------------------------------------------------------
export function SignUpPreview() {
  const isDark = useColorScheme() === 'dark';
  const { currentTheme } = useColorTheme();
  const accent = isDark
    ? currentTheme?.name && currentTheme.name !== 'zinc' && currentTheme.preview
      ? currentTheme.preview
      : '#818cf8'
    : currentTheme?.name && currentTheme.name !== 'zinc'
    ? currentTheme.preview
    : '#18181b';

  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@example.com');
  const [password, setPassword] = useState('AlexRivera2026!');
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const border = isDark ? '#232734' : '#e2e8f0';
  const text = isDark ? '#f8fafc' : '#0f172a';
  const muted = isDark ? '#94a3b8' : '#64748b';

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRegistered(true);
      setTimeout(() => setRegistered(false), 3000);
    }, 1200);
  };

  return (
    <View style={{ width: '100%', maxWidth: 360, gap: 14 }}>
      {/* Header */}
      <View style={{ gap: 4, alignItems: 'center' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: '#10b98120',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}
        >
          <Sparkles size={20} color="#10b981" />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '700', color: text }}>Create an account</Text>
        <Text style={{ fontSize: 12.5, color: muted }}>Get started with your free 14-day trial.</Text>
      </View>

      {registered && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#10b98120',
            borderWidth: 1,
            borderColor: '#10b98140',
          }}
        >
          <CheckCircle2 size={16} color="#10b981" />
          <Text style={{ fontSize: 12, color: '#10b981', fontWeight: '500' }}>
            Account created! Confirmation sent.
          </Text>
        </View>
      )}

      {/* Form Fields */}
      <View style={{ gap: 11 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Full Name</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: border,
              backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
              paddingHorizontal: 10,
              gap: 8,
            }}
          >
            <User size={15} color="#94a3b8" />
            <TextInput
              style={{ flex: 1, fontSize: 13, color: text, padding: 0 }}
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Work Email</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: border,
              backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
              paddingHorizontal: 10,
              gap: 8,
            }}
          >
            <Mail size={15} color="#94a3b8" />
            <TextInput
              style={{ flex: 1, fontSize: 13, color: text, padding: 0 }}
              value={email}
              onChangeText={setEmail}
              placeholder="you@company.com"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Password</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: border,
              backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
              paddingHorizontal: 10,
              gap: 8,
            }}
          >
            <Lock size={15} color="#94a3b8" />
            <TextInput
              style={{ flex: 1, fontSize: 13, color: text, padding: 0 }}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Create password"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Password Strength Indicators */}
          <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
            <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: '#10b981' }} />
            <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: '#10b981' }} />
            <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: '#10b981' }} />
            <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: border }} />
          </View>
          <Text style={{ fontSize: 10.5, color: '#10b981', marginTop: 1 }}>Strong password</Text>
        </View>

        {/* Terms checkbox */}
        <TouchableOpacity
          onPress={() => setAgree(!agree)}
          activeOpacity={0.8}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              borderWidth: 1.5,
              borderColor: agree ? accent : border,
              backgroundColor: agree ? accent : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {agree && <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '700' }}>✓</Text>}
          </View>
          <Text style={{ fontSize: 12, color: muted, flex: 1 }}>
            I agree to the <Text style={{ color: accent }}>Terms of Service</Text> and{' '}
            <Text style={{ color: accent }}>Privacy Policy</Text>.
          </Text>
        </TouchableOpacity>

        <Button
          loading={loading}
          disabled={loading || !agree}
          onPress={handleSignUp}
          style={{ height: 42, borderRadius: 8, marginTop: 4 }}
        >
          Create account
        </Button>
      </View>

      {/* Footer */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
        <Text style={{ fontSize: 12, color: muted }}>Already have an account?</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: accent }}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// 3. OTP Verification Preview
// ---------------------------------------------------------------------------
export function VerifyOtpPreview() {
  const isDark = useColorScheme() === 'dark';
  const { currentTheme } = useColorTheme();
  const accent = isDark
    ? currentTheme?.name && currentTheme.name !== 'zinc' && currentTheme.preview
      ? currentTheme.preview
      : '#818cf8'
    : currentTheme?.name && currentTheme.name !== 'zinc'
    ? currentTheme.preview
    : '#18181b';

  const [otp, setOtp] = useState(['4', '8', '2', '9', '1', '7']);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const border = isDark ? '#232734' : '#e2e8f0';
  const text = isDark ? '#f8fafc' : '#0f172a';
  const muted = isDark ? '#94a3b8' : '#64748b';

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
      setTimeout(() => setVerified(false), 3000);
    }, 1000);
  };

  return (
    <View style={{ width: '100%', maxWidth: 360, gap: 16, alignItems: 'center' }}>
      <View style={{ gap: 4, alignItems: 'center' }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: accent + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}
        >
          <ShieldCheck size={24} color={accent} />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '700', color: text }}>Two-factor auth</Text>
        <Text style={{ fontSize: 12.5, color: muted, textAlign: 'center' }}>
          Enter the 6-digit code sent to alex@example.com
        </Text>
      </View>

      {verified && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#10b98120',
            borderWidth: 1,
            borderColor: '#10b98140',
            width: '100%',
          }}
        >
          <CheckCircle2 size={16} color="#10b981" />
          <Text style={{ fontSize: 12, color: '#10b981', fontWeight: '500' }}>
            Code verified successfully!
          </Text>
        </View>
      )}

      {/* 6 OTP Input Boxes */}
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        {otp.map((digit, idx) => (
          <View
            key={idx}
            style={{
              width: 44,
              height: 48,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: digit ? accent : border,
              backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: text }}>{digit}</Text>
          </View>
        ))}
      </View>

      <Button
        loading={loading}
        disabled={loading}
        onPress={handleVerify}
        style={{ width: '100%', height: 42, borderRadius: 8 }}
      >
        Verify Code
      </Button>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={{ fontSize: 12, color: muted }}>Didn't receive code?</Text>
        <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <RefreshCw size={12} color={accent} />
          <Text style={{ fontSize: 12, fontWeight: '600', color: accent }}>Resend in 30s</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// 4. Forgot Password Preview
// ---------------------------------------------------------------------------
export function ForgotPasswordPreview() {
  const isDark = useColorScheme() === 'dark';
  const { currentTheme } = useColorTheme();
  const accent = isDark
    ? currentTheme?.name && currentTheme.name !== 'zinc' && currentTheme.preview
      ? currentTheme.preview
      : '#818cf8'
    : currentTheme?.name && currentTheme.name !== 'zinc'
    ? currentTheme.preview
    : '#18181b';

  const [email, setEmail] = useState('alex.rivera@example.com');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const border = isDark ? '#232734' : '#e2e8f0';
  const text = isDark ? '#f8fafc' : '#0f172a';
  const muted = isDark ? '#94a3b8' : '#64748b';

  const handleSend = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }, 1000);
  };

  return (
    <View style={{ width: '100%', maxWidth: 360, gap: 16 }}>
      <View style={{ gap: 4, alignItems: 'center' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: '#f59e0b20',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}
        >
          <KeyRound size={20} color="#f59e0b" />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '700', color: text }}>Forgot password?</Text>
        <Text style={{ fontSize: 12.5, color: muted, textAlign: 'center' }}>
          No worries, we'll send you reset instructions.
        </Text>
      </View>

      {sent && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#10b98120',
            borderWidth: 1,
            borderColor: '#10b98140',
          }}
        >
          <CheckCircle2 size={16} color="#10b981" />
          <Text style={{ fontSize: 12, color: '#10b981', fontWeight: '500' }}>
            Reset instructions sent to your email!
          </Text>
        </View>
      )}

      <View style={{ gap: 12 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Email address</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: border,
              backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
              paddingHorizontal: 10,
              gap: 8,
            }}
          >
            <Mail size={15} color="#94a3b8" />
            <TextInput
              style={{ flex: 1, fontSize: 13, color: text, padding: 0 }}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <Button
          loading={loading}
          disabled={loading}
          onPress={handleSend}
          style={{ height: 42, borderRadius: 8, marginTop: 4 }}
        >
          Send reset instructions
        </Button>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}
      >
        <Text style={{ fontSize: 12.5, fontWeight: '600', color: accent }}>← Back to sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------------------------------------------------------------------------
// 5. Full Signup Page Preview (Pages Category)
// ---------------------------------------------------------------------------
export function SignupPagePreview() {
  const isDark = useColorScheme() === 'dark';
  const { currentTheme } = useColorTheme();
  const accent = isDark
    ? currentTheme?.name && currentTheme.name !== 'zinc' && currentTheme.preview
      ? currentTheme.preview
      : '#818cf8'
    : currentTheme?.name && currentTheme.name !== 'zinc'
    ? currentTheme.preview
    : '#18181b';

  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);

  // OTP flow states
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const toast = useToast();

  const border = isDark ? '#232734' : '#e2e8f0';
  const text = isDark ? '#f8fafc' : '#0f172a';
  const muted = isDark ? '#94a3b8' : '#64748b';
  const cardBg = isDark ? '#141721' : '#f8fafc';
  const successColor = '#10b981';

  // Resend cooldown timer
  React.useEffect(() => {
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

  const validateForm = () => {
    if (!displayName.trim()) {
      toast.error('Name required', 'Please enter your full name.');
      return false;
    }
    if (authMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim() || !emailRegex.test(email.trim())) {
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
    if (!agree) {
      toast.error('Terms required', 'Please accept the terms of service and privacy policy.');
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
      setCooldown(60);
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
      setCooldown(60);
    } catch (err: any) {
      toast.error('Failed to send SMS OTP', err.message || 'Please verify your phone number and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Validate OTP & Save User to Supabase
  const handleVerifyOtp = async (codeOverride?: string) => {
    const code = (codeOverride || otpCode).trim();
    if (code.length < 6) {
      setOtpError('Please enter all 6 digits of your verification code.');
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

      const user = verifyResult.data?.user;
      const cleanName = displayName.trim() || user?.user_metadata?.display_name || 'Amoga User';

      // 1. Save user metadata to Supabase Auth
      await supabase.auth.updateUser({
        data: {
          display_name: cleanName,
          full_name: cleanName,
          name: cleanName,
          ...(authMethod === 'phone'
            ? { mobile: formatPhoneNumber(phone), phone: formatPhoneNumber(phone) }
            : { email: email.trim() }),
        },
      });

      // 2. Persist / Upsert profile in Supabase public.profiles table
      if (user?.id) {
        const profilePayload: Record<string, any> = {
          id: user.id,
          name: cleanName,
          display_name: cleanName,
          updated_at: new Date().toISOString(),
        };
        if (authMethod === 'email') {
          profilePayload.email = email.trim();
        } else {
          const formattedPhone = formatPhoneNumber(phone);
          profilePayload.mobile = formattedPhone;
          profilePayload.phone = formattedPhone;
        }

        await supabase.from('profiles').upsert(profilePayload, { onConflict: 'id' });
      }

      setStep('success');
      toast.success('Account created & verified!', 'Welcome to Amoga Mobile.');
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
        toast.success('Resent!', `New verification code sent to ${email.trim()}`);
      } else {
        const formattedPhone = formatPhoneNumber(phone);
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
          options: { shouldCreateUser: true },
        });
        if (error) throw error;
        toast.success('Resent!', `New SMS OTP sent to ${formattedPhone}`);
      }
      setCooldown(60);
    } catch (err: any) {
      toast.error('Resend failed', err.message || 'Could not resend OTP code.');
    } finally {
      setResending(false);
    }
  };

  const isFormValid =
    displayName.trim().length > 0 &&
    (authMethod === 'email' ? email.trim().length > 3 : phone.trim().length >= 6) &&
    agree;

  // View: Success Screen
  if (step === 'success') {
    return (
      <View style={{ width: '100%', maxWidth: 360, gap: 16, alignItems: 'center', paddingVertical: 12 }}>
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
          <CheckCircle2 size={30} color={successColor} />
        </View>

        <View style={{ alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 19, fontWeight: '700', color: text, textAlign: 'center' }}>
            Welcome, {displayName || 'User'}!
          </Text>
          <Text style={{ fontSize: 12.5, color: muted, textAlign: 'center' }}>
            Verified via {authMethod === 'email' ? 'Email OTP' : 'Mobile SMS OTP'} ({currentTarget})
          </Text>
        </View>

        <View
          style={{
            width: '100%',
            backgroundColor: cardBg,
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: border,
            gap: 8,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, color: muted }}>Name</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>{displayName}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, color: muted }}>
              {authMethod === 'email' ? 'Email' : 'Mobile'}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>{currentTarget}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, color: muted }}>Supabase Sync</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: successColor }}>
              ✓ Saved to Profiles
            </Text>
          </View>
        </View>

        <Button
          style={{ width: '100%', height: 42, borderRadius: 8, marginTop: 4 }}
          onPress={() => {
            setStep('form');
            setOtpCode('');
          }}
        >
          Sign Up Another User
        </Button>
      </View>
    );
  }

  // View: OTP Verification Screen
  if (step === 'otp') {
    return (
      <View style={{ width: '100%', maxWidth: 360, gap: 16 }}>
        {/* Header */}
        <View style={{ gap: 4, alignItems: 'center' }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#10b98120',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 4,
            }}
          >
            <ShieldCheck size={20} color="#10b981" />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: text }}>Verify OTP Code</Text>
          <Text style={{ fontSize: 12.5, color: muted, textAlign: 'center' }}>
            Enter the 6-digit code sent to {currentTarget}
          </Text>
        </View>

        {/* Target Info Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
            borderRadius: 8,
            paddingVertical: 9,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: border,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
            {authMethod === 'email' ? <Mail size={15} color={accent} /> : <Phone size={15} color={accent} />}
            <Text style={{ fontSize: 12.5, fontWeight: '600', color: text }} numberOfLines={1}>
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
            <Edit3 size={14} color={muted} />
          </TouchableOpacity>
        </View>

        {/* 6-Digit InputOTP */}
        <View style={{ gap: 8, alignItems: 'center', marginVertical: 4 }}>
          <InputOTP
            length={6}
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
            <Text style={{ fontSize: 11.5, color: '#ef4444', textAlign: 'center', marginTop: 2 }}>
              {otpError}
            </Text>
          )}
        </View>

        {/* Resend OTP Bar */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          {cooldown > 0 ? (
            <Text style={{ fontSize: 12, color: muted }}>
              Resend code in <Text style={{ fontWeight: '600', color: text }}>{cooldown}s</Text>
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={resending}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <RefreshCw size={12} color={accent} />
              <Text style={{ fontSize: 12, color: accent, fontWeight: '600' }}>
                {resending ? 'Sending...' : 'Resend code'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verify Button */}
        <Button
          loading={verifying}
          disabled={otpCode.length < 6 || verifying}
          onPress={() => handleVerifyOtp()}
          style={{ height: 42, borderRadius: 8, marginTop: 4 }}
        >
          Verify & Create Account
        </Button>

        {/* Change Target */}
        <TouchableOpacity
          onPress={() => {
            setStep('form');
            setOtpError(undefined);
          }}
          style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4, marginTop: 2 }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={13} color={accent} />
          <Text style={{ fontSize: 12, color: accent, fontWeight: '600' }}>
            Change {authMethod === 'email' ? 'Email' : 'Number'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // View: Step 1 Registration Form
  return (
    <View style={{ width: '100%', maxWidth: 360, gap: 14 }}>
      {/* Header */}
      <View style={{ gap: 4, alignItems: 'center' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: '#10b98120',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}
        >
          <Sparkles size={20} color="#10b981" />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '700', color: text }}>Create an account</Text>
        <Text style={{ fontSize: 12.5, color: muted }}>Instant signup with Supabase OTP verification.</Text>
      </View>

      {/* Auth Method Selector (Email OTP vs Mobile OTP) */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: cardBg,
          borderRadius: 10,
          padding: 3,
          borderWidth: 1,
          borderColor: border,
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
            paddingVertical: 8,
            borderRadius: 7,
            backgroundColor: authMethod === 'email' ? accent : 'transparent',
            gap: 6,
          }}
        >
          <Mail size={15} color={authMethod === 'email' ? '#FFFFFF' : muted} />
          <Text
            style={{
              fontWeight: '600',
              fontSize: 12.5,
              color: authMethod === 'email' ? '#FFFFFF' : muted,
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
            paddingVertical: 8,
            borderRadius: 7,
            backgroundColor: authMethod === 'phone' ? accent : 'transparent',
            gap: 6,
          }}
        >
          <Phone size={15} color={authMethod === 'phone' ? '#FFFFFF' : muted} />
          <Text
            style={{
              fontWeight: '600',
              fontSize: 12.5,
              color: authMethod === 'phone' ? '#FFFFFF' : muted,
            }}
          >
            Mobile OTP
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={{ gap: 11 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Full Name</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: border,
              backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
              paddingHorizontal: 10,
              gap: 8,
            }}
          >
            <User size={15} color="#94a3b8" />
            <TextInput
              style={{ flex: 1, fontSize: 13, color: text, padding: 0 }}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Ada Lovelace"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        {authMethod === 'email' ? (
          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Work Email</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 40,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: border,
                backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
                paddingHorizontal: 10,
                gap: 8,
              }}
            >
              <Mail size={15} color="#94a3b8" />
              <TextInput
                style={{ flex: 1, fontSize: 13, color: text, padding: 0 }}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="you@company.com"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        ) : (
          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Mobile Number</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 40,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: border,
                backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
                paddingHorizontal: 10,
                gap: 8,
              }}
            >
              <Phone size={15} color="#94a3b8" />
              <TextInput
                style={{ flex: 1, fontSize: 13, color: text, padding: 0 }}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
                placeholder="+1 234 567 8900"
                placeholderTextColor="#94a3b8"
              />
            </View>
            <Text style={{ fontSize: 10.5, color: muted }}>
              Include country code prefix (e.g. +1, +44, +91)
            </Text>
          </View>
        )}

        {/* Terms checkbox */}
        <TouchableOpacity
          onPress={() => setAgree(!agree)}
          activeOpacity={0.8}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              borderWidth: 1.5,
              borderColor: agree ? accent : border,
              backgroundColor: agree ? accent : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {agree && <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '700' }}>✓</Text>}
          </View>
          <Text style={{ fontSize: 12, color: muted, flex: 1 }}>
            I agree to the <Text style={{ color: accent }}>Terms of Service</Text> and{' '}
            <Text style={{ color: accent }}>Privacy Policy</Text>.
          </Text>
        </TouchableOpacity>

        <Button
          loading={loading}
          disabled={loading || !isFormValid}
          onPress={authMethod === 'email' ? handleSendEmailOtp : handleSendMobileOtp}
          style={{ height: 42, borderRadius: 8, marginTop: 4 }}
        >
          {authMethod === 'email' ? 'Send Email OTP' : 'Send Mobile OTP'}
        </Button>
      </View>

      {/* Footer */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
        <Text style={{ fontSize: 12, color: muted }}>Already have an account?</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: accent }}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// 6. Full Sign In Page Preview (Pages Category)
// ---------------------------------------------------------------------------
export function SignInPagePreview() {
  const isDark = useColorScheme() === 'dark';
  const { currentTheme } = useColorTheme();
  const toast = useToast();

  const accent = isDark
    ? currentTheme?.name && currentTheme.name !== 'zinc' && currentTheme.preview
      ? currentTheme.preview
      : '#818cf8'
    : currentTheme?.name && currentTheme.name !== 'zinc'
    ? currentTheme.preview
    : '#18181b';

  const border = isDark ? '#232734' : '#e2e8f0';
  const text = isDark ? '#f8fafc' : '#0f172a';
  const muted = isDark ? '#94a3b8' : '#64748b';
  const cardBg = isDark ? '#141721' : '#f8fafc';

  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Flow states
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [notRegistered, setNotRegistered] = useState(false);

  const inputRefs = React.useRef<(TextInput | null)[]>([]);

  // Cooldown countdown timer for resending OTP
  React.useEffect(() => {
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
    setBanner(null);
    setNotRegistered(false);

    if (authMethod === 'email') {
      const trimmedEmail = email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
        setBanner({ type: 'error', message: 'Please enter a valid work email address.' });
        return false;
      }
    } else {
      const formatted = formatPhoneNumber(phone);
      if (formatted.length < 8) {
        setBanner({
          type: 'error',
          message: 'Please enter a valid phone number with country code (e.g. +1234567890).',
        });
        return false;
      }
    }
    return true;
  };

  // Step 1: Send Sign In OTP (with shouldCreateUser: false to detect unregistered users)
  const handleSendOtp = async () => {
    if (!validateTarget()) return;

    setLoading(true);
    setBanner(null);
    setNotRegistered(false);

    try {
      if (authMethod === 'email') {
        const trimmedEmail = email.trim();
        const { error } = await supabase.auth.signInWithOtp({
          email: trimmedEmail,
          options: {
            shouldCreateUser: false, // Prevents auto-signup; errors if user doesn't exist
          },
        });

        if (error) throw error;

        toast.success('Code sent!', `A 6-digit login code was sent to ${trimmedEmail}`);
      } else {
        const formattedPhone = formatPhoneNumber(phone);
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
          options: {
            shouldCreateUser: false, // Prevents auto-signup; errors if user doesn't exist
          },
        });

        if (error) throw error;

        toast.success('SMS code sent!', `A 6-digit login code was sent to ${formattedPhone}`);
      }

      setStep('otp');
      setOtp(Array(6).fill(''));
      setCountdown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
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
        setBanner({
          type: 'error',
          message: 'No account found with this information. Please sign up first!',
        });
        toast.error('Account not found', 'Please sign up before signing in.');
      } else {
        setBanner({
          type: 'error',
          message: err.message || 'Failed to send OTP. Please check your credentials.',
        });
        toast.error('Sign in failed', err.message || 'Please check your information.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit inputs
  const handleDigitChange = (value: string, index: number) => {
    if (value.length > 1) {
      const cleanDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      cleanDigits.forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(cleanDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      if (cleanDigits.length === 6) {
        verifyCode(newOtp.join(''));
      }
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (banner) setBanner(null);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newOtp.join('');
    if (fullCode.length === 6 && !newOtp.includes('')) {
      verifyCode(fullCode);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Validate OTP & Sign In
  const verifyCode = async (codeToVerify?: string) => {
    const fullCode = (codeToVerify || otp.join('')).trim();
    if (fullCode.length !== 6) {
      setBanner({
        type: 'error',
        message: 'Please enter all 6 digits of your verification code.',
      });
      return;
    }

    setVerifying(true);
    setBanner(null);

    try {
      let verifyResult: any;
      if (authMethod === 'email') {
        verifyResult = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: fullCode,
          type: 'email',
        });
      } else {
        const formattedPhone = formatPhoneNumber(phone);
        verifyResult = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: fullCode,
          type: 'sms',
        });
      }

      if (verifyResult.error) throw verifyResult.error;

      toast.success('Welcome back!', 'Signed in successfully.');
    } catch (err: any) {
      const msg = err.message || 'Invalid or expired verification code.';
      setBanner({ type: 'error', message: msg });
      toast.error('Sign in failed', msg);
    } finally {
      setVerifying(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setBanner(null);
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
      setCountdown(60);
    } catch (err: any) {
      setBanner({ type: 'error', message: err.message || 'Could not resend OTP code.' });
      toast.error('Resend failed', err.message || 'Could not resend OTP code.');
    } finally {
      setResending(false);
    }
  };

  const isFormValid = authMethod === 'email' ? email.trim().length > 3 : phone.trim().length >= 6;

  // Render Step 2: 6-Digit OTP Verification Screen
  if (step === 'otp') {
    return (
      <View
        style={{
          width: '100%',
          maxWidth: 440,
          alignSelf: 'center',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: border,
          backgroundColor: isDark ? '#0c0f17' : '#ffffff',
          padding: 24,
          gap: 16,
        }}
      >
        {/* Back action */}
        <TouchableOpacity
          onPress={() => {
            setStep('form');
            setBanner(null);
          }}
          activeOpacity={0.7}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginBottom: 4 }}
        >
          <ArrowLeft size={16} color={muted} />
          <Text style={{ fontSize: 13, color: muted, fontWeight: '500' }}>
            Change {authMethod === 'email' ? 'Email' : 'Number'}
          </Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={{ gap: 6, alignItems: 'center' }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 4,
            }}
          >
            <ShieldCheck size={22} color="#10b981" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '700', color: text, letterSpacing: -0.3, textAlign: 'center' }}>
            Verify Sign In Code
          </Text>
          <Text style={{ fontSize: 13, color: muted, textAlign: 'center', lineHeight: 18, paddingHorizontal: 8 }}>
            Enter the 6-digit code sent to {currentTarget}
          </Text>
        </View>

        {/* Banner */}
        {banner && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              padding: 12,
              borderRadius: 10,
              backgroundColor: banner.type === 'success' ? '#10b98118' : '#ef444418',
              borderWidth: 1,
              borderColor: banner.type === 'success' ? '#10b98140' : '#ef444440',
            }}
          >
            {banner.type === 'success' ? <CheckCircle2 size={18} color="#10b981" /> : <AlertCircle size={18} color="#ef4444" />}
            <Text
              style={{
                flex: 1,
                fontSize: 12.5,
                fontWeight: '500',
                color: banner.type === 'success' ? '#10b981' : '#ef4444',
                lineHeight: 17,
              }}
            >
              {banner.message}
            </Text>
          </View>
        )}

        {/* Target Info Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: border,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
            {authMethod === 'email' ? <Mail size={15} color={accent} /> : <Phone size={15} color={accent} />}
            <Text style={{ fontSize: 13, fontWeight: '600', color: text }} numberOfLines={1}>
              {currentTarget}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setStep('form');
              setBanner(null);
            }}
            activeOpacity={0.7}
          >
            <Edit3 size={15} color={muted} />
          </TouchableOpacity>
        </View>

        {/* 6 Digit Input Boxes */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            marginVertical: 4,
          }}
        >
          {otp.map((digit, index) => {
            const isFilled = Boolean(digit);
            return (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(val) => handleDigitChange(val, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                autoFocus={index === 0}
                editable={!verifying}
                style={{
                  width: 44,
                  height: 52,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: isFilled ? accent : border,
                  backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: '700',
                  color: text,
                }}
              />
            );
          })}
        </View>

        {/* Resend OTP Bar */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          {countdown > 0 ? (
            <Text style={{ fontSize: 12.5, color: muted }}>
              Resend code in <Text style={{ fontWeight: '600', color: text }}>{countdown}s</Text>
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={resending}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <RefreshCw size={13} color={accent} />
              <Text style={{ fontSize: 13, color: accent, fontWeight: '600' }}>
                {resending ? 'Sending...' : 'Resend code'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verify Button */}
        <Button
          loading={verifying}
          disabled={otp.join('').length < 6 || verifying}
          onPress={() => verifyCode()}
          style={{ height: 44, borderRadius: 8, marginTop: 4 }}
        >
          Verify & Sign In
        </Button>
      </View>
    );
  }

  // Render Step 1: Form Screen
  return (
    <View
      style={{
        width: '100%',
        maxWidth: 440,
        alignSelf: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: border,
        backgroundColor: isDark ? '#0c0f17' : '#ffffff',
        padding: 24,
        gap: 16,
      }}
    >
      {/* Header */}
      <View style={{ gap: 6, alignItems: 'center' }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}
        >
          <Lock size={22} color={accent} />
        </View>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: text,
            letterSpacing: -0.3,
            textAlign: 'center',
          }}
        >
          Welcome Back
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: muted,
            textAlign: 'center',
            lineHeight: 18,
            paddingHorizontal: 8,
          }}
        >
          Sign in with instant OTP verification. No password required.
        </Text>
      </View>

      {/* Banner */}
      {banner && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            padding: 12,
            borderRadius: 10,
            backgroundColor: banner.type === 'success' ? '#10b98118' : '#ef444418',
            borderWidth: 1,
            borderColor: banner.type === 'success' ? '#10b98140' : '#ef444440',
          }}
        >
          {banner.type === 'success' ? (
            <CheckCircle2 size={18} color="#10b981" />
          ) : (
            <AlertCircle size={18} color="#ef4444" />
          )}
          <Text
            style={{
              flex: 1,
              fontSize: 12.5,
              fontWeight: '500',
              color: banner.type === 'success' ? '#10b981' : '#ef4444',
              lineHeight: 17,
            }}
          >
            {banner.message}
          </Text>
        </View>
      )}

      {/* Unregistered User Action Banner */}
      {notRegistered && (
        <View
          style={{
            backgroundColor: isDark ? 'rgba(239,68,68,0.12)' : '#fef2f2',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(239,68,68,0.3)' : '#fecaca',
            borderRadius: 10,
            padding: 12,
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#ef4444' }}>
            Account not found
          </Text>
          <Text style={{ fontSize: 12, color: text, lineHeight: 17 }}>
            No Amoga account exists for this {authMethod === 'email' ? 'email' : 'phone number'}. Please create your account first!
          </Text>
          <Button
            onPress={() => toast.info('Sign Up Action', 'Redirects to /sign-up')}
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
          borderRadius: 10,
          padding: 3,
          borderWidth: 1,
          borderColor: border,
          gap: 4,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setAuthMethod('email');
            setBanner(null);
            setNotRegistered(false);
          }}
          activeOpacity={0.8}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 9,
            borderRadius: 7,
            backgroundColor: authMethod === 'email' ? accent : 'transparent',
            gap: 6,
          }}
        >
          <Mail size={15} color={authMethod === 'email' ? '#FFFFFF' : muted} />
          <Text
            style={{
              fontWeight: '600',
              fontSize: 13,
              color: authMethod === 'email' ? '#FFFFFF' : muted,
            }}
          >
            Email OTP
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setAuthMethod('phone');
            setBanner(null);
            setNotRegistered(false);
          }}
          activeOpacity={0.8}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 9,
            borderRadius: 7,
            backgroundColor: authMethod === 'phone' ? accent : 'transparent',
            gap: 6,
          }}
        >
          <Phone size={15} color={authMethod === 'phone' ? '#FFFFFF' : muted} />
          <Text
            style={{
              fontWeight: '600',
              fontSize: 13,
              color: authMethod === 'phone' ? '#FFFFFF' : muted,
            }}
          >
            Mobile OTP
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Target Field */}
      <View style={{ gap: 14 }}>
        {authMethod === 'email' ? (
          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Work Email</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 42,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: border,
                backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
                paddingHorizontal: 12,
                gap: 8,
              }}
            >
              <Mail size={16} color="#94a3b8" />
              <TextInput
                style={{ flex: 1, fontSize: 13.5, color: text, padding: 0 }}
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  if (notRegistered) setNotRegistered(false);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="you@company.com"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        ) : (
          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Mobile Number</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 42,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: border,
                backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
                paddingHorizontal: 12,
                gap: 8,
              }}
            >
              <Phone size={16} color="#94a3b8" />
              <TextInput
                style={{ flex: 1, fontSize: 13.5, color: text, padding: 0 }}
                value={phone}
                onChangeText={(val) => {
                  setPhone(val);
                  if (notRegistered) setNotRegistered(false);
                }}
                keyboardType="phone-pad"
                autoCapitalize="none"
                placeholder="+1 234 567 8900"
                placeholderTextColor="#94a3b8"
              />
            </View>
            <Text style={{ fontSize: 11, color: muted }}>
              Include country code prefix (e.g. +1, +44, +91)
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <Button
          loading={loading}
          disabled={loading || !isFormValid}
          onPress={handleSendOtp}
          style={{ height: 44, borderRadius: 8, marginTop: 2 }}
        >
          {authMethod === 'email' ? 'Send Sign In Code' : 'Send Mobile Code'}
        </Button>
      </View>

      {/* Footer */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4, marginTop: 2 }}>
        <Text style={{ fontSize: 13, color: muted }}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => toast.info('Sign Up Link', 'Redirects to /sign-up')} activeOpacity={0.7}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: accent }}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


