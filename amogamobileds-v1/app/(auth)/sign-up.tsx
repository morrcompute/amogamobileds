import React from 'react';
import { SignupPageView } from '../../components/ui/signup-page-view';
import { router } from 'expo-router';

export default function SignUpScreen() {
  return (
    <SignupPageView
      onSignInPress={() => router.push('/sign-in')}
      onSuccess={() => {
        router.replace('/(tabs)/(home)');
      }}
    />
  );
}
