/**
 * Root Layout — Auth Gate
 * Uses Expo Router's layout system to redirect based on auth state
 */
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../stores/authStore';
import { Colors } from '../constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, isEmailVerified, isLoading, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isLoading) return;

    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && !isEmailVerified && !inAuthGroup) {
      router.replace('/(auth)/verify-email');
    } else if (isAuthenticated && isEmailVerified && inAuthGroup) {
      router.replace('/(tabs)/matching');
    }
  }, [isAuthenticated, isEmailVerified, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Slot />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
