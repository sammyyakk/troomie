/**
 * Email Verification Screen
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MailCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { Colors, FontSize, Spacing } from '../../constants/theme';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { checkVerification, resendVerification, signOut, firebaseUser } = useAuthStore();
  const [checking, setChecking] = useState(false);

  // Auto-check every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const verified = await checkVerification();
      if (verified) {
        router.replace('/(tabs)/matching');
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCheck = async () => {
    setChecking(true);
    const verified = await checkVerification();
    setChecking(false);
    if (verified) {
      router.replace('/(tabs)/matching');
    } else {
      Alert.alert('Not Verified', 'Your email is not verified yet. Please check your inbox.');
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification();
      Alert.alert('Email Sent', 'A new verification email has been sent.');
    } catch {
      Alert.alert('Error', 'Could not resend verification email. Try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientMid]}
          style={styles.iconCircle}
        >
          <MailCheck size={40} color="#FFF" />
        </LinearGradient>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We&apos;ve sent a verification link to{'\n'}
          <Text style={styles.email}>{firebaseUser?.email}</Text>
        </Text>
        <Text style={styles.instructions}>
          Click the link in the email to verify your account, then come back here.
        </Text>

        <Button
          title="I've Verified My Email"
          onPress={handleCheck}
          isLoading={checking}
          size="lg"
          style={styles.button}
        />

        <Button
          title="Resend Verification Email"
          onPress={handleResend}
          variant="outline"
          size="md"
          style={styles.button}
        />

        <Button
          title="Sign Out"
          onPress={signOut}
          variant="ghost"
          size="md"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing['3xl'],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['3xl'],
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  email: {
    color: Colors.primary,
    fontWeight: '600',
  },
  instructions: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: Spacing['3xl'],
  },
  button: {
    marginBottom: Spacing.md,
    width: '100%',
  },
});
