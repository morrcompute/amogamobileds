import { Button } from '../../components/ui/button';
import { InputOTP } from '../../components/ui/input-otp';
import { Text } from '../../components/ui/text';
import { useToast } from '../../components/ui/toast';
import { View } from '../../components/ui/view';
import { AuthScreen } from '../../components/auth/auth-screen';
import { supabase } from '../../lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

const CODE_LENGTH = 6;

export default function VerifyOtpScreen() {
  const { email, phone, type, isSignUp } = useLocalSearchParams<{
    email?: string;
    phone?: string;
    type?: 'email' | 'sms';
    isSignUp?: string;
  }>();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [resending, setResending] = useState(false);
  const toast = useToast();

  const target = phone || email;
  const isPhone = Boolean(phone || type === 'sms');

  const verify = async (value: string) => {
    if (!target) return;

    setLoading(true);
    setError(undefined);

    try {
      if (isPhone) {
        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
          phone: target,
          token: value,
          type: 'sms',
        });

        if (verifyError) throw verifyError;

        if (verifyData?.user) {
          // 1. Update user metadata in Supabase Auth to ensure mobile/phone is stored on the auth user
          await supabase.auth.updateUser({
            data: {
              mobile: target,
              phone: target,
              phone_number: target,
            },
          });

          // 2. Update/upsert the profile table with the mobile field
          const displayName =
            verifyData.user.user_metadata?.display_name ||
            verifyData.user.user_metadata?.name ||
            verifyData.user.user_metadata?.full_name ||
            target;

          await supabase.from('profiles').upsert(
            {
              id: verifyData.user.id,
              mobile: target,
              name: displayName,
              display_name: displayName,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );
        }
      } else {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email: target,
          token: value,
          type: 'email',
        });

        if (verifyError) throw verifyError;
      }

      toast.success('Verified!', 'You are now signed in.');
      // Session established; the guards in app/_layout.tsx swap (auth) out for (tabs)
    } catch (err: any) {
      setError(err.message || 'Invalid or expired verification code.');
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!target) return;

    setResending(true);
    try {
      if (isPhone) {
        const { error: resendError } = await supabase.auth.signInWithOtp({
          phone: target,
          options: { shouldCreateUser: isSignUp === 'true' },
        });
        if (resendError) throw resendError;
        toast.success('Sent', `A new SMS OTP was sent to ${target}.`);
      } else {
        const { error: resendError } = await supabase.auth.signInWithOtp({
          email: target,
          options: { shouldCreateUser: isSignUp === 'true' },
        });
        if (resendError) throw resendError;
        toast.success('Sent', `A new email code was sent to ${target}.`);
      }
    } catch (err: any) {
      toast.error('Could not resend', err.message || 'Failed to send a new code.');
    } finally {
      setResending(false);
    }
  };

  if (!target) {
    return (
      <AuthScreen
        title='Something went missing'
        subtitle='We do not know which address or phone number to verify.'
      >
        <Button onPress={() => router.replace('/sign-in')}>
          Start over
        </Button>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title='Enter verification code'
      subtitle={`We sent a ${CODE_LENGTH}-digit code to ${target}.`}
      footer={
        <>
          <Button variant='ghost' loading={resending} onPress={resend}>
            Send it again
          </Button>
          <Button variant='link' size='sm' onPress={() => router.back()}>
            {isPhone ? 'Use a different phone number' : 'Use a different email address'}
          </Button>
        </>
      }
    >
      <View style={{ alignItems: 'center', gap: 16 }}>
        <InputOTP
          length={CODE_LENGTH}
          value={code}
          onChangeText={setCode}
          // Submits automatically on the last digit
          onComplete={verify}
          error={error}
          disabled={loading}
          autoFocus
        />

        {loading && <Text variant='caption'>Verifying code…</Text>}
      </View>
    </AuthScreen>
  );
}
