import React from 'react';
import { SigninPageView } from '../../components/ui/signin-page-view';
import { router } from 'expo-router';

export default function SignInScreen() {
  return (
    <SigninPageView
      onSignUpPress={() => router.push('/sign-up')}
      onSuccess={() => {
        router.replace('/(tabs)/(home)');
      }}
    />
  );
}
