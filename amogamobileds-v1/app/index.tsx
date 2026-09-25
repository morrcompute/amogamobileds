import React from 'react';
import { Redirect } from 'expo-router';
import { Platform } from 'react-native';
import { useAuth } from '../providers/auth-provider';
import { Spinner } from '../components/ui/spinner';
import { View } from '../components/ui/view';

export default function Index() {
  const { session, profile, loading } = useAuth();

  if (Platform.OS === 'web') {
    return <Redirect href='/(tabs)/(home)' />;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size='lg' variant='circle' />
      </View>
    );
  }

  if (session) {
    if (profile?.onboarded === false) {
      return <Redirect href='/(onboarding)' />;
    }
    return <Redirect href='/(tabs)/(home)' />;
  }

  return <Redirect href='/(auth)/sign-in' />;
}
