import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Text } from '../../components/ui/text';
import { useToast } from '../../components/ui/toast';
import { View } from '../../components/ui/view';
import { AuthScreen } from '../../components/auth/auth-screen';
import { useColor } from '../../hooks/useColor';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';
import { Lock, Mail, Phone } from 'lucide-react-native';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

export default function SignInScreen() {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const primary = useColor('primary');
  const cardBg = useColor('card');
  const borderColor = useColor('border');
  const textMuted = useColor('textMuted');

  const formatPhoneNumber = (val: string) => {
    let cleaned = val.trim();
    if (cleaned && !cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    return cleaned;
  };

  /*
   * Email OTP Logic - commented out as requested. Users sign in directly with Email + Password.
   *
   * const handleSendEmailOtp = async () => {
   *   const trimmedEmail = email.trim();
   *   const { error } = await supabase.auth.signInWithOtp({
   *     email: trimmedEmail,
   *     options: { shouldCreateUser: false },
   *   });
   *   if (error) throw error;
   *   router.push({ pathname: '/verify-otp', params: { email: trimmedEmail, type: 'email' } });
   * };
   */

  const handleSendPhoneOtp = async () => {
    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phone);
      if (formattedPhone.length < 8) {
        toast.error('Invalid phone number', 'Please enter a valid phone number with country code (e.g. +1234567890).');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) throw error;

      toast.success('Code sent', `We sent a 6-digit SMS OTP to ${formattedPhone}`);
      router.push({
        pathname: '/verify-otp',
        params: {
          phone: formattedPhone,
          type: 'sms',
          isSignUp: 'false',
        },
      });
    } catch (err: any) {
      toast.error('Could not send code', err.message || 'Please verify your phone number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSignIn = async () => {
    if (!email.trim()) {
      toast.error('Email required', 'Please enter your email address.');
      return;
    }
    if (!password) {
      toast.error('Password required', 'Please enter your password.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      toast.error('Could not sign in', error.message);
      return;
    }
  };

  const canSubmitPassword = email.trim().length > 0 && password.length > 0;
  const canSubmitPhone = phone.trim().length >= 6;

  return (
    <AuthScreen
      title='Welcome back'
      subtitle='Sign in to your account.'
      footer={
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Text variant='caption'>New here?</Text>
          <Button
            variant='link'
            size='sm'
            onPress={() => router.push('/sign-up')}
          >
            Create an account
          </Button>
        </View>
      }
    >
      {/* Auth Method Selector (Email vs Mobile) */}
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
              fontSize: 14,
              color: authMethod === 'email' ? '#FFFFFF' : textMuted,
            }}
          >
            Email Sign-In
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
              fontSize: 14,
              color: authMethod === 'phone' ? '#FFFFFF' : textMuted,
            }}
          >
            Mobile OTP
          </Text>
        </TouchableOpacity>
      </View>

      {authMethod === 'email' ? (
        <>
          <Input
            label='Email'
            icon={Mail}
            placeholder='you@example.com'
            value={email}
            onChangeText={setEmail}
            autoCapitalize='none'
            autoComplete='email'
            keyboardType='email-address'
            textContentType='emailAddress'
          />

          <Input
            label='Password'
            icon={Lock}
            placeholder='Your password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize='none'
            autoComplete='current-password'
            textContentType='password'
            onSubmitEditing={() => canSubmitPassword && handlePasswordSignIn()}
          />

          <Button
            disabled={!canSubmitPassword || loading}
            loading={loading}
            onPress={handlePasswordSignIn}
          >
            Sign In
          </Button>
        </>
      ) : (
        <>
          <Input
            label='Mobile Number'
            icon={Phone}
            placeholder='+1 234 567 8900'
            value={phone}
            onChangeText={setPhone}
            autoCapitalize='none'
            autoComplete='tel'
            keyboardType='phone-pad'
            textContentType='telephoneNumber'
            onSubmitEditing={() => canSubmitPhone && handleSendPhoneOtp()}
          />
          <Text variant='caption' style={{ marginTop: -8, color: textMuted }}>
            Include country code prefix (e.g. +1, +44, +91)
          </Text>

          <Button
            disabled={!canSubmitPhone || loading}
            loading={loading}
            onPress={handleSendPhoneOtp}
          >
            Send Mobile OTP
          </Button>
        </>
      )}
    </AuthScreen>
  );
}
